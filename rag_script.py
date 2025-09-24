import os
import sys
import csv
import json as _json
from typing import List, Tuple
from tqdm import tqdm

from PyPDF2 import PdfReader
import pdfplumber
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from ollama import Client

# -----------------------------
# 1. File to text chunks
# -----------------------------
def pdf_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
        if not text.strip():
            raise ValueError("No text extracted using PyPDF2.")
    except Exception as e:
        print(f"PyPDF2 failed: {e}. Trying pdfplumber...")
        with pdfplumber.open(path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
        if not text.strip():
            raise ValueError("No text extracted from the PDF. Check the file format.")

    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks

# -----------------------------
# 2. Embed chunks
# -----------------------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks: List[str]):
    if not chunks:
        raise ValueError("No chunks provided for embedding.")
    embeddings = embedding_model.encode(chunks, convert_to_tensor=False)
    try:
        return embeddings.tolist()  # Convert to a list if it's a NumPy array
    except AttributeError:
        return embeddings  # If already a list, return as is

# -----------------------------
# 3. ChromaDB setup
# -----------------------------
def get_collection():
    persist_dir = os.path.join(os.path.dirname(__file__), "chroma")
    os.makedirs(persist_dir, exist_ok=True)
    client = chromadb.PersistentClient(path=persist_dir, settings=Settings(anonymized_telemetry=False))
    collection = client.get_or_create_collection("rag_pdf")
    return collection

def store_embeddings(chunks: List[str], embeddings, source_name: str):
    collection = get_collection()
    try:
        collection.delete(where={"source": source_name})  # Remove previous entries for this source
    except Exception as e:
        pass
    ids = [f"{source_name}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": source_name, "chunk_index": i} for i in range(len(chunks))]
    collection.add(documents=chunks, ids=ids, metadatas=metadatas, embeddings=embeddings)
    return collection

# -----------------------------
# 4. Query chunks
# -----------------------------
def query_chunks(collection, query, top_k=3):
    query_embedding = embedding_model.encode([query], convert_to_tensor=False)
    try:
        results = collection.query(query_embeddings=query_embedding, n_results=top_k)
        return [
            {
                "document": doc,
                "metadata": meta,
                "distance": dist
            }
            for doc, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0])
        ]
    except Exception as e:
        print(f"[ERROR] Exception in query_chunks: {e}")
        return []

# -----------------------------
# 5. Call Ollama LLM locally
# -----------------------------
def call_ollama_rag(context, query, model_name="gpt-oss:120b-cloud"):
    prompt = f"""Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"""
    try:
        ollama_client = Client()
        response = ollama_client.generate(model=model_name, prompt=prompt, stream=False)
        return response.get("response", "").strip()
    except Exception as e:
        return "I don't know."

# -----------------------------
# 6. Ingest files
# -----------------------------
def ingest_files(file_paths: List[str]) -> Tuple[int, List[str]]:
    ingested = 0
    sources = []
    for path in file_paths:
        source_name = os.path.basename(path)
        try:
            print(f"[1] Extracting: {source_name}")
            lower = source_name.lower()
            if lower.endswith('.pdf'):
                chunks = pdf_to_chunks(path)
            else:
                print(f"Skipping unsupported file type: {source_name}")
                continue
            if not chunks:
                print(f"Warning: No text found in {source_name}")
                continue
            embeddings = embed_chunks(chunks)
            store_embeddings(chunks, embeddings, source_name)
            ingested += 1
            sources.append(source_name)
        except Exception as e:
            print(f"Error ingesting {source_name}: {e}")
    return ingested, sources

# -----------------------------
# 7. Answer query
# -----------------------------
def answer_query(user_query: str, top_k: int = 8):
    try:
        collection = get_collection()
        results = query_chunks(collection, user_query, top_k=top_k)

        if results:
            # If relevant content is found in the files, use it to generate an answer
            context = "\n".join([result["document"] for result in results])
            source_files = ", ".join(set(result["metadata"]["source"] for result in results))
            answer_text = call_ollama_rag(context, user_query)
            source_info = f"Answer derived from the following PDF(s): {source_files}."
            return f"{answer_text}\n\n{source_info}"
        else:
            # Fallback to AI if no relevant content is found
            print("[INFO] No relevant content found in files. Falling back to AI.")
            ai_answer = call_ollama_rag("", user_query)
            source_info = "Answer generated by AI as no relevant content was found in the PDFs."
            return f"{ai_answer}\n\n{source_info}"

    except Exception as e:
        print(f"[ERROR] An error occurred while processing the query: {e}")
        return "An error occurred while processing your request. Please try again."

# -----------------------------
# Main entrypoint
# -----------------------------
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("Usage: rag_script.py [ingest <files...> | query]")
            sys.exit(1)

        mode = sys.argv[1]
        if mode == "ingest":
            files = sys.argv[2:]
            if not files:
                print("No files provided to ingest.")
                sys.exit(1)

            count, sources = ingest_files(files)
            print(f"Ingested {count} document(s): {', '.join(sources)}")
            print("\nYou can now ask questions about the uploaded documents.")

            while True:
                question = input("\nAsk a question (or type 'exit' to quit): ").strip()
                if question.lower() == "exit":
                    print("Exiting. Goodbye!")
                    break
                try:
                    answer = answer_query(question)
                    print(f"\nAnswer: {answer}")
                except Exception as e:
                    print(f"An error occurred: {e}")

        elif mode == "query":
            print("Please ingest files first using the 'ingest' mode.")
        else:
            print("Unknown mode. Use 'ingest' or 'query'.")
            sys.exit(1)

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)