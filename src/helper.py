from langchain_community.document_loaders import  PyPDFLoader
from langchain_community.document_loaders import DirectoryLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter  
from langchain_huggingface import HuggingFaceEmbeddings
from typing import List

def load_pdf_files(data):
    loader = DirectoryLoader(data, 
                         glob = "*.pdf",
                        loader_cls=PyPDFLoader
                        )
    documents = loader.load()
    return documents


def filter_to_minimal_docs(documents: List[Document]):
    """
    Filter documents to only include page_content and source as metadata.
    """
    minimal_docs = []
    for doc in documents:
        src = doc.metadata.get("source")
        minimal_docs.append(Document(page_content=doc.page_content,
                                metadata={"source": src}))
    return minimal_docs

def text_split(minimal_docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20, #small so that he can understand the content well
        length_function=len
    )
    text_chunks = text_splitter.split_documents(minimal_docs)
    return text_chunks

def download_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return embeddings

def format_docs(docs: List[Document]) -> str:
    return "\n\n".join([doc.page_content for doc in docs])