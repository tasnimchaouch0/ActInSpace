from src.sentinel_utils import process_sentinel_tile
from src.helper import download_embeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from dotenv import load_dotenv
import os

load_dotenv()

# ---------------- Configuration ----------------
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

TILE_ID = "T31TFJ"         
DATES = ["2024-01-01"]     
OUTPUT_DIR = "./data/sentinel_data"
INDEX_NAME = "sentinel-farmer-index"

def main():
    print("Starting Sentinel-2 Data Ingestion...")
    
    # 1. Generate Documents from Sentinel Data
    print(f"Processing tile {TILE_ID} for dates {DATES}...")
    # Returns list of dicts: {"page_content": str, "metadata": dict}
    raw_docs = process_sentinel_tile(TILE_ID, DATES, OUTPUT_DIR)
    
    if not raw_docs:
        print("No documents generated. Exiting.")
        return

    # Convert to LangChain Documents
    documents = [
        Document(page_content=d["page_content"], metadata=d["metadata"])
        for d in raw_docs
    ]
    print(f"Generated {len(documents)} documents.")
    
    # 2. Initialize Embeddings
    print("Loading embeddings model...")
    embeddings = download_embeddings()

    # 3. Initialize Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # 4. Create Index if it doesn't exist
    if INDEX_NAME not in pc.list_indexes().names():
        print(f"Creating index '{INDEX_NAME}'...")
        pc.create_index(
            name=INDEX_NAME, 
            dimension=384, # Fits all-MiniLM-L6-v2
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
    else:
        print(f"Index '{INDEX_NAME}' already exists.")

    # 5. Index Documents
    print("Upserting documents to Pinecone...")
    docsearch = PineconeVectorStore.from_documents(
        documents=documents,
        index_name=INDEX_NAME,
        embedding=embeddings
    )
    print("Ingestion complete!")

if __name__ == "__main__":
    main()
