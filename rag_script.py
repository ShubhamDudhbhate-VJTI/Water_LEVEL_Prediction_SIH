# from PyPDF2 import PdfReader
# from sentence_transformers import SentenceTransformer
# import chromadb
# from ollama import Client  # Ollama Python SDK import

# # -----------------------------
# # 1. PDF to text chunks
# # -----------------------------
# def pdf_to_chunks(path, chunk_size=200, overlap=50):
#     reader = PdfReader(path)
#     text = ""
#     for page in reader.pages:
#         page_text = page.extract_text()
#         if page_text:
#             text += page_text + " "
#     words = text.split()
#     chunks = []
#     i = 0
#     while i < len(words):
#         chunk = words[i:i+chunk_size]
#         chunks.append(" ".join(chunk))
#         i += chunk_size - overlap
#     return chunks

# # -----------------------------
# # 2. Embed chunks
# # -----------------------------
# embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# def embed_chunks(chunks):
#     return embedding_model.encode(chunks, convert_to_tensor=False)

# # -----------------------------
# # 3. Store in ChromaDB
# # -----------------------------
# def store_embeddings(chunks, embeddings):
#     client = chromadb.Client()
#     collection = client.get_or_create_collection("rag_pdf")
#     ids = [f"chunk_{i}" for i in range(len(chunks))]
#     collection.add(
#         documents=chunks,
#         embeddings=embeddings,
#         ids=ids
#     )
#     return collection

# # -----------------------------
# # 4. Retrieve Top-K Chunks
# # -----------------------------
# def query_chunks(collection, query, top_k=3):
#     query_embedding = embedding_model.encode([query], convert_to_tensor=False)
#     results = collection.query(
#         query_embeddings=query_embedding,
#         n_results=top_k
#     )
#     return results["documents"][0]

# # -----------------------------
# # 5. Call Ollama LLM locally (no HTTP calls)
# # -----------------------------
# def call_ollama_rag(context, query, model_name="gpt-oss:120b-cloud"):
#     prompt = f"""Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"""
#     # print("Context sent to model:\n", context)
#     # print("Full prompt:\n", prompt)

#     try:
#         ollama_client = Client()
#         response = ollama_client.generate(
#             model=model_name,
#             prompt=prompt,
#             stream=False
#         )
#         # print("Raw response from Ollama:", response)
        
#         text = response.get("response", "")
        
#         return text.strip()
#     except Exception as e:
#         print("Error calling Ollama locally:", e)
#     return None


# # -----------------------------
# # 6. RAG flow
# # -----------------------------
# def run_rag(pdf_path, user_query):
#     print("[1] Converting PDF to chunks...")
#     chunks = pdf_to_chunks(pdf_path)

#     print(f"[2] Created {len(chunks)} chunks. Embedding chunks...")
#     embeddings = embed_chunks(chunks)

#     print("[3] Storing embeddings in ChromaDB...")
#     collection = store_embeddings(chunks, embeddings)

#     print("[4] Retrieving relevant chunks for query...")
#     top_chunks = query_chunks(collection, user_query, top_k=3)

#     print("[5] Generating answer from LLM locally...")
#     context = "\n".join(top_chunks)
#     answer = call_ollama_rag(context, user_query)

#     print("\n🔍 Answer:\n", answer)

# # -----------------------------
# # Run the script
# # -----------------------------
# if __name__ == "__main__":
#     import sys
#     pdf_path = "ingres2.pdf"  # Your PDF file
#     # Get the query from command line argument
#     query = sys.argv[1] if len(sys.argv) > 1 else ""
#     # Run RAG and print only the answer (for Express server)
#     chunks = pdf_to_chunks(pdf_path)
#     embeddings = embed_chunks(chunks)
#     collection = store_embeddings(chunks, embeddings)
#     top_chunks = query_chunks(collection, query, top_k=3)
#     context = "\n".join(top_chunks)
#     answer = call_ollama_rag(context, query)
#     print(answer)





#___________________________________________________________________________________________________________________________________________________________________________________________________

# from PyPDF2 import PdfReader
# import pdfplumber
# import csv
# import json as _json
# from sentence_transformers import SentenceTransformer
# import chromadb
# from chromadb.config import Settings
# from ollama import Client
# import os
# import sys
# from typing import List, Tuple
# from tqdm import tqdm


# # 1. PDF to text chunks
# def pdf_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
#     try:
#         reader = PdfReader(path)
#         text = ""
#         for page in reader.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + " "
#         if not text.strip():
#             raise ValueError("No text extracted using PyPDF2.")
#     except Exception as e:
#         print(f"PyPDF2 failed: {e}. Trying pdfplumber...")
#         with pdfplumber.open(path) as pdf:
#             text = ""
#             for page in pdf.pages:
#                 text += page.extract_text() or ""
#         if not text.strip():
#             raise ValueError("No text extracted from the PDF. Check the file format.")

#     words = text.split()
#     chunks = []
#     i = 0
#     while i < len(words):
#         chunk = words[i:i+chunk_size]
#         chunks.append(" ".join(chunk))
#         i += chunk_size - overlap
#     return chunks

# def csv_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
#     # Read CSV rows and join into a single text
#     try:
#         lines: List[str] = []
#         with open(path, newline='', encoding='utf-8', errors='ignore') as f:
#             reader = csv.reader(f)
#             for row in reader:
#                 # join cells with space; skip empty rows
#                 line = " ".join([cell for cell in row if cell is not None])
#                 if line.strip():
#                     lines.append(line.strip())
#         text = "\n".join(lines)
#     except Exception:
#         text = ""
#     words = text.split()
#     chunks: List[str] = []
#     i = 0
#     while i < len(words):
#         chunk = words[i:i+chunk_size]
#         chunks.append(" ".join(chunk))
#         i += chunk_size - overlap
#     return chunks

# def txt_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
#     try:
#         with open(path, 'r', encoding='utf-8', errors='ignore') as f:
#             text = f.read()
#     except Exception:
#         text = ""
#     words = text.split()
#     chunks: List[str] = []
#     i = 0
#     while i < len(words):
#         chunk = words[i:i+chunk_size]
#         chunks.append(" ".join(chunk))
#         i += chunk_size - overlap
#     return chunks

# def json_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
#     try:
#         with open(path, 'r', encoding='utf-8', errors='ignore') as f:
#             data = _json.load(f)
#         # Flatten simple JSON into text lines
#         lines: List[str] = []
#         def walk(obj, prefix=""):
#             if isinstance(obj, dict):
#                 for k, v in obj.items():
#                     walk(v, f"{prefix}{k}:")
#             elif isinstance(obj, list):
#                 for i, v in enumerate(obj):
#                     walk(v, prefix)
#             else:
#                 lines.append(f"{prefix} {str(obj)}")
#         walk(data)
#         text = "\n".join(lines)
#     except Exception:
#         text = ""
#     words = text.split()
#     chunks: List[str] = []
#     i = 0
#     while i < len(words):
#         chunk = words[i:i+chunk_size]
#         chunks.append(" ".join(chunk))
#         i += chunk_size - overlap
#     return chunks

# # 2. Embed chunks
# embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# def embed_chunks(chunks: List[str]):
#     if not chunks:
#         raise ValueError("No chunks provided for embedding.")
#     embeddings = embedding_model.encode(chunks, convert_to_tensor=False)
#     try:
#         # Ensure pure Python lists for Chroma compatibility
#         return embeddings.tolist()  # type: ignore[attr-defined]
#     except AttributeError:
#         return embeddings

# def get_collection():
#     # Use persistent storage so data survives between runs
#     persist_dir = os.path.join(os.path.dirname(__file__), "chroma")
#     os.makedirs(persist_dir, exist_ok=True)
#     client = chromadb.PersistentClient(path=persist_dir, settings=Settings(anonymized_telemetry=False))
#     collection = client.get_or_create_collection("rag_pdf")
#     return collection

# def store_embeddings(chunks: List[str], embeddings, source_name: str):
#     collection = get_collection()
#     # Remove previous chunks from this source to avoid duplication
#     try:
#         collection.delete(where={"source": source_name})
#     except Exception:
#         pass
#     ids = [f"{source_name}_chunk_{i}" for i in range(len(chunks))]
#     metadatas = [{"source": source_name, "chunk_index": i} for i in range(len(chunks))]
#     # Provide embeddings explicitly
#     collection.add(documents=chunks, ids=ids, metadatas=metadatas, embeddings=embeddings)
#     return collection

# # 4. Retrieve Top-K Chunks
# def query_chunks(collection, query: str, top_k: int = 3):
#     # Compute query embedding explicitly
#     query_embedding = embed_chunks([query])
#     results = collection.query(query_embeddings=query_embedding, n_results=top_k, include=["documents", "metadatas", "distances"])
#     documents = (results.get("documents") or [[]])[0]
#     metadatas = results.get("metadatas", [[{}]*len(documents)])[0]
#     distances = results.get("distances", [[None]*len(documents)])[0]
#     # Return tuples of (document, metadata, distance)
#     return list(zip(documents, metadatas, distances))


# def _extract_keywords(text: str) -> list:
#     words = [w.strip().lower() for w in text.split() if len(w) > 3]
#     # keep likely domain words and proper nouns candidates
#     seeds = set(words)
#     # domain synonyms
#     synonyms = {"recharge", "groundwater", "aquifer", "water", "rainfall", "infiltration"}
#     return list(seeds.union(synonyms))

# # 5. Call Ollama LLM locally
# def call_ollama_rag(context: str, query: str, model_name: str = "llama3.1:8b"):
#     prompt = f"""Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"""
#     try:
#         ollama_client = Client()
#         response = ollama_client.generate(model=model_name, prompt=prompt, stream=False)
#         return response.get("response", "").strip()
#     except Exception as e:
#         return f"Error calling Ollama locally: {e}"

# def ingest_files(file_paths: List[str]) -> Tuple[int, List[str]]:
#     ingested = 0
#     sources = []
#     for path in file_paths:
#         source_name = os.path.basename(path)
#         try:
#             print(f"[1] Extracting: {source_name}")
#             lower = source_name.lower()
#             if lower.endswith('.pdf'):
#                 chunks = pdf_to_chunks(path)
#             elif lower.endswith('.csv'):
#                 chunks = csv_to_chunks(path)
#             elif lower.endswith('.txt'):
#                 chunks = txt_to_chunks(path)
#             elif lower.endswith('.json'):
#                 chunks = json_to_chunks(path)
#             else:
#                 print(f"Skipping unsupported file type: {source_name}")
#                 continue
#             if not chunks:
#                 print(f"Warning: No text found in {source_name}")
#                 continue
#             print(f"[2] Embedding {len(chunks)} chunks for {source_name}...")
#             embeddings = embed_chunks(chunks)
#             print("[3] Upserting into ChromaDB...")
#             store_embeddings(chunks, embeddings, source_name)
#             ingested += 1
#             sources.append(source_name)
#         except Exception as e:
#             print(f"Error ingesting {source_name}: {e}")
#     return ingested, sources


# def answer_query(user_query: str, top_k: int = 8):
#     collection = get_collection()
#     # Primary semantic search
#     results = query_chunks(collection, user_query, top_k=top_k) or []
#     # Lightweight keyword-boosted secondary search
#     extra = []
#     try:
#         for kw in _extract_keywords(user_query)[:5]:
#             extra.extend(query_chunks(collection, kw, top_k=2))
#     except Exception:
#         pass
#     # Merge while preserving order and uniqueness
#     seen = set()
#     merged = []
#     for item in results + extra:
#         if not item:
#             continue
#         doc, meta, _dist = item
#         key = (meta.get("source") if isinstance(meta, dict) else None, doc[:50])
#         if key in seen:
#             continue
#         seen.add(key)
#         merged.append(item)

#     if not merged:
#         return {
#             "answer": "",
#             "sources": [],
#             "context": "",
#             "found": False,
#         }

#     # Build context and sources
#     context_parts = [doc for (doc, _meta, _dist) in merged[:top_k]]
#     context = "\n".join(context_parts)
#     sources = []
#     for (_doc, meta, dist) in merged[:top_k]:
#         source_name = None
#         chunk_index = None
#         if isinstance(meta, dict):
#             source_name = meta.get("source")
#             chunk_index = meta.get("chunk_index")
#         try:
#             score = float(dist) if dist is not None else None
#         except Exception:
#             score = None
#         sources.append({
#             "source": source_name,
#             "chunk_index": int(chunk_index) if isinstance(chunk_index, (int, float, str)) and str(chunk_index).isdigit() else None,
#             "score": score,
#         })
#     answer_text = call_ollama_rag(context, user_query)
#     return {
#         "answer": answer_text,
#         "sources": sources,
#         "context": context,
#         "found": True,
#     }


# # Main entrypoint: two modes
# #   python rag_script.py ingest <file1> <file2> ...
# #   python rag_script.py query "your question"
# if __name__ == "__main__":
#     try:
#         if len(sys.argv) < 2:
#             print("Usage: rag_script.py [ingest <files...> | query <question>]")
#             sys.exit(1)
#         mode = sys.argv[1]
#         if mode == "ingest":
#             files = sys.argv[2:]
#             if not files:
#                 print("No files provided to ingest.")
#                 sys.exit(1)
#             count, sources = ingest_files(files)
#             print(f"Ingested {count} document(s): {', '.join(sources)}")
#         elif mode == "query":
#             # Support optional --source <filename> filter
#             args = sys.argv[2:]
#             source_filter = None
#             if "--source" in args:
#                 idx = args.index("--source")
#                 if idx < len(args) - 1:
#                     source_filter = args[idx + 1]
#                     del args[idx:idx + 2]
#             question = " ".join(args).strip()
#             if not question:
#                 print("Please provide a question to query.")
#                 sys.exit(1)
#             result = answer_query(question)
#             # Optionally filter sources in the response
#             if isinstance(result, dict) and source_filter:
#                 filtered_sources = [s for s in (result.get("sources") or []) if (s.get("source") or "").lower() == source_filter.lower()]
#                 result["sources"] = filtered_sources
#                 result["found"] = bool(filtered_sources)
#             # Ensure JSON output for server consumption
#             import json
#             if isinstance(result, dict):
#                 print(json.dumps(result, ensure_ascii=False))
#             else:
#                 print(json.dumps({"answer": str(result)}, ensure_ascii=False))
#         else:
#             print("Unknown mode. Use 'ingest' or 'query'.")
#             sys.exit(1)
#     except Exception:
#         # Suppress internal details in server responses
#         import json
#         print(json.dumps({"answer": "An error occurred while processing your request. Please try again."}))














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

def csv_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
    try:
        lines: List[str] = []
        with open(path, newline='', encoding='utf-8', errors='ignore') as f:
            reader = csv.reader(f)
            for row in reader:
                line = " ".join([cell for cell in row if cell])
                if line.strip():
                    lines.append(line.strip())
        text = "\n".join(lines)
    except Exception:
        text = ""
    words = text.split()
    chunks: List[str] = []
    i = 0
    while i < len(words):
        chunk = words[i:i+chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks

def txt_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
    except Exception:
        text = ""
    words = text.split()
    chunks: List[str] = []
    i = 0
    while i < len(words):
        chunk = words[i:i+chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks

def json_to_chunks(path: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            data = _json.load(f)
        lines: List[str] = []
        def walk(obj, prefix=""):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    walk(v, f"{prefix}{k}:")
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    walk(v, prefix)
            else:
                lines.append(f"{prefix} {str(obj)}")
        walk(data)
        text = "\n".join(lines)
    except Exception:
        text = ""
    words = text.split()
    chunks: List[str] = []
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
    embeddings = []
    for chunk in tqdm(chunks, desc="Embedding chunks", unit="chunk"):
        emb = embedding_model.encode([chunk], convert_to_tensor=False)
        embeddings.append(emb[0])
    return embeddings

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
        collection.delete(where={"source": source_name})
    except Exception:
        pass
    ids = [f"{source_name}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": source_name, "chunk_index": i} for i in range(len(chunks))]
    collection.add(documents=chunks, ids=ids, metadatas=metadatas, embeddings=embeddings)
    return collection

# -----------------------------
# 4. Query chunks
# -----------------------------
def query_chunks(collection, query: str, top_k: int = 3):
    query_embedding = embed_chunks([query])
    results = collection.query(query_embeddings=query_embedding, n_results=top_k, include=["documents", "metadatas", "distances"])
    documents = (results.get("documents") or [[]])[0]
    metadatas = results.get("metadatas", [[{}]*len(documents)])[0]
    distances = results.get("distances", [[None]*len(documents)])[0]
    return list(zip(documents, metadatas, distances))

def _extract_keywords(text: str) -> list:
    words = [w.strip().lower() for w in text.split() if len(w) > 3]
    synonyms = {"recharge", "groundwater", "aquifer", "water", "rainfall", "infiltration"}
    return list(set(words).union(synonyms))

# -----------------------------
# 5. Call Ollama LLM locally
# -----------------------------
def call_ollama_rag(context: str, query: str, model_name: str = "llama3.1:8b"):
    prompt = f"""Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"""
    try:
        ollama_client = Client()
        response = ollama_client.generate(model=model_name, prompt=prompt, stream=False)
        return response.get("response", "").strip()
    except Exception as e:
        return f"Error calling Ollama locally: {e}"

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
            elif lower.endswith('.csv'):
                chunks = csv_to_chunks(path)
            elif lower.endswith('.txt'):
                chunks = txt_to_chunks(path)
            elif lower.endswith('.json'):
                chunks = json_to_chunks(path)
            else:
                print(f"Skipping unsupported file type: {source_name}")
                continue
            if not chunks:
                print(f"Warning: No text found in {source_name}")
                continue
            print(f"[2] Embedding {len(chunks)} chunks for {source_name}...")
            embeddings = embed_chunks(chunks)
            print("[3] Upserting into ChromaDB...")
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
    collection = get_collection()
    results = query_chunks(collection, user_query, top_k=top_k) or []

    extra = []
    try:
        for kw in _extract_keywords(user_query)[:5]:
            extra.extend(query_chunks(collection, kw, top_k=2))
    except Exception:
        pass

    seen = set()
    merged = []
    for item in results + extra:
        if not item:
            continue
        doc, meta, dist = item
        key = (meta.get("source") if isinstance(meta, dict) else None, doc[:50])
        if key in seen:
            continue
        seen.add(key)
        merged.append(item)

    if not merged:
        return {
            "answer": "Answer not found in the documents.",
            "sources": [],
            "found": False,
        }

    context_parts = [doc for (doc, _meta, _dist) in merged[:top_k]]
    context = "\n".join(context_parts)
    sources = []
    for (_doc, meta, dist) in merged[:top_k]:
        source_name = meta.get("source") if isinstance(meta, dict) else None
        chunk_index = meta.get("chunk_index") if isinstance(meta, dict) else None
        score = float(dist) if dist is not None else None
        sources.append({"source": source_name, "chunk_index": chunk_index, "score": score})

    answer_text = call_ollama_rag(context, user_query)
    if not answer_text.strip():
        answer_text = "Answer not found in the documents."

    # Return only answer + sources, remove context
    return {
        "answer": answer_text,
        "sources": sources,
        "found": True,
    }


# -----------------------------
# Main entrypoint
# -----------------------------
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("Usage: rag_script.py [ingest <files...> | query <question>]")
            sys.exit(1)
        mode = sys.argv[1]
        if mode == "ingest":
            files = sys.argv[2:]
            if not files:
                print("No files provided to ingest.")
                sys.exit(1)
            count, sources = ingest_files(files)
            print(f"Ingested {count} document(s): {', '.join(sources)}")
        elif mode == "query":
            args = sys.argv[2:]
            source_filter = None
            if "--source" in args:
                idx = args.index("--source")
                if idx < len(args) - 1:
                    source_filter = args[idx + 1]
                    del args[idx:idx + 2]
            question = " ".join(args).strip()
            if not question:
                print("Please provide a question to query.")
                sys.exit(1)
            result = answer_query(question)
            if isinstance(result, dict) and source_filter:
                filtered_sources = [s for s in (result.get("sources") or []) if (s.get("source") or "").lower() == source_filter.lower()]
                result["sources"] = filtered_sources
                result["found"] = bool(filtered_sources)
            import json
            print(json.dumps(result, ensure_ascii=False))
        else:
            print("Unknown mode. Use 'ingest' or 'query'.")
            sys.exit(1)
    except Exception:
        import json
        print(json.dumps({"answer": "An error occurred while processing your request. Please try again."}))
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("Usage: rag_script.py [ingest <files...> | query <question>]")
            sys.exit(1)
        mode = sys.argv[1]
        if mode == "ingest":
            files = sys.argv[2:]
            if not files:
                print("No files provided to ingest.")
                sys.exit(1)
            count, sources = ingest_files(files)
            print(f"Ingested {count} document(s): {', '.join(sources)}")
        elif mode == "query":
            args = sys.argv[2:]
            source_filter = None
            if "--source" in args:
                idx = args.index("--source")
                if idx < len(args) - 1:                              
                    del args[idx:idx + 2] 
            question = " ".join(args).strip()
            if not question:
                print("Please provide a question to query.")
                sys.exit(1)
            result = answer_query(question)
            if source_filter:
                filtered_sources = [s for s in (result.get("sources") or []) if (s.get("source") or "").lower() == source_filter.lower()]
                result["sources"] = filtered_sources
                result["found"] = bool(filtered_sources)
            import json
            # Only answer + sources + found
            print(json.dumps(result, ensure_ascii=False))
        else:
            print("Unknown mode. Use 'ingest' or 'query'.")
            sys.exit(1)
    except Exception:
        import json
        print(json.dumps({"answer": "An error occurred while processing your request. Please try again."}))
