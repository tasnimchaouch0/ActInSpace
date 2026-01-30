from dotenv import load_dotenv
import os
from src.helper import load_pdf_files, filter_to_minimal_docs, text_split, download_embeddings
from pinecone import Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import PineconeVectorStore
load_dotenv()

PINECONE_API_KEY =os.getenv("PINECONE_API_KEY")
MISTRAL_API_KEY =os.getenv("MISTRAL_API_KEY")
GROQ_API_KEY =os.getenv("GROQ_API_KEY")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["MISTRALAI_API_KEY"] = MISTRAL_API_KEY
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

extracted_data = load_pdf_files(data = "data/")
filtered_data = filter_to_minimal_docs(extracted_data)
text_chunks = text_split(filtered_data)

embeddings = download_embeddings()

pinecone_api_key = PINECONE_API_KEY
pc = Pinecone(api_key=pinecone_api_key)

index_name = "medical-chatbot-index"
if not pc.has_index(index_name):
    pc.create_index(name=index_name, 
                    dimension=384,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"))


index = pc.Index("medical-chatbot-index")

ids = [f"chunk-{i}" for i in range(len(text_chunks))]
docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    index_name=index_name,
    embedding=embeddings,
    ids = ids
)
