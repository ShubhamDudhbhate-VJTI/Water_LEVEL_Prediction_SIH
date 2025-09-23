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







from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb
from ollama import Client  # Ollama Python SDK import
import sys

# 1. PDF to text chunks
def pdf_to_chunks(path, chunk_size=200, overlap=50):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + " "
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks

# 2. Embed chunks
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks):
    return embedding_model.encode(chunks, convert_to_tensor=False)

# 3. Store in ChromaDB
def store_embeddings(chunks, embeddings):
    client = chromadb.Client()
    collection = client.get_or_create_collection("rag_pdf")
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    # Remove existing docs to avoid duplicates
    try:
        collection.delete(ids=ids)
    except Exception:
        pass
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )
    return collection

# 4. Retrieve Top-K Chunks
def query_chunks(collection, query, top_k=3):
    query_embedding = embedding_model.encode([query], convert_to_tensor=False)
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )
    return results["documents"][0]

# 5. Call Ollama LLM locally
def call_ollama_rag(context, query, model_name="gpt-oss:120b-cloud"):
    prompt = f"""Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"""
    # print("Context sent to model:\n", context)
    # print("Full prompt:\n", prompt)

    
    try:
        ollama_client = Client()
        response = ollama_client.generate(
            model=model_name,
            prompt=prompt,
            stream=False
        )
        text = response.get("response", "")
        return text.strip()
    except Exception as e:
        return f"Error calling Ollama locally: {e}"

# Main entrypoint for Express server
# ...existing code...

if __name__ == "__main__":
    pdf_path = "ingres2.pdf"
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    chunks = pdf_to_chunks(pdf_path)
    embeddings = embed_chunks(chunks)
    collection = store_embeddings(chunks, embeddings)
    top_chunks = query_chunks(collection, query, top_k=3)
    context = "\n".join(top_chunks)
    answer = call_ollama_rag(context, query)
    # Correction: Only show answer if present in context
    if "Sorry, the answer is not present" not in answer and query.lower() not in context.lower():
        answer = "Sorry, the answer is not present in the provided document."
    print(f"[Source: {pdf_path}] {answer}")

# ...existing code...





