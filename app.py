from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException
from langchain_pinecone import PineconeVectorStore
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from src.helper import download_embeddings, format_docs
from src.prompt import *
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from fastapi.concurrency import run_in_threadpool
from langchain_openai import ChatOpenAI


load_dotenv()

PINECONE_API_KEY =os.getenv("PINECONE_API_KEY")
OPENROUTER_API_KEY =os.getenv("OPENROUTER_API_KEY")
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["OPENROUTER_API_KEY"] = OPENROUTER_API_KEY

app = FastAPI()

@app.get("/")
async def read_root():
    return {"status": "Farmer Assistant Backend is Running", "docs": "/docs"}

origins = ["http://localhost:3000", "http://localhost:3001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding = download_embeddings()

index_name = "sentinel-farmer-index"
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embedding
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3})


llm = ChatOpenAI(
    model="mistralai/mistral-7b-instruct",
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=os.environ["OPENROUTER_API_KEY"],
    temperature=0,
)


prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])


rag_chain = (
    {
        "context": lambda x: format_docs(retriever.invoke(x["input"])),
        "input": lambda x: x["input"],
    }
    | prompt    
    | llm
    | StrOutputParser()
)


class Message(BaseModel):
    text: str
    image: str | None = None  # Base64 string or URL

@app.options("/chat")
async def options_chat():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@app.post("/chat")
async def chat_endpoint(message: Message):
    try:
        print("Received:", message.text, "Image present:", bool(message.image))
        
        if message.image:
            # --- Vision Path ---
            # Use a VLM for image analysis
            vision_llm = ChatOpenAI(
                model="google/gemini-2.0-flash-exp:free", # Or gpt-4o
                openai_api_base="https://openrouter.ai/api/v1",
                openai_api_key=os.environ["OPENROUTER_API_KEY"],
                temperature=0.1,
            )
            
            # Construct Multimodal Message
            from langchain_core.messages import HumanMessage
            
            # Ensure base64 header is present or handled. 
            # Frontend usually sends "data:image/jpeg;base64,..."
            # OpenRouter/LLMs expect the URL format or base64 details.
            
            msg = HumanMessage(content=[
                {
                    "type": "text", 
                    "text": f"""You are an expert agricultural advisor helping farmers. Analyze this wheat/crop image carefully.

Farmer's question: {message.text}

Please provide:
1. What you see in the image (plant health, color, any visible issues)
2. Your diagnosis in simple, farmer-friendly language (avoid jargon)
3. If you use technical terms (like "chlorosis", "rust", "blight"), explain them in simple words
4. Practical advice the farmer can take immediately
5. Whether they should consult an agronomist for serious issues

Keep your response clear, friendly, and actionable. Use simple language that any farmer can understand."""
                },
                {
                    "type": "image_url",
                    "image_url": {"url": message.image} 
                }
            ])
            
            response = await run_in_threadpool(lambda: vision_llm.invoke([msg]))
            return {"reply": response.content}
            
        else:
            # --- Text/RAG Path ---
            response = await run_in_threadpool(
                lambda: rag_chain.invoke({
                    "input": message.text, 
                })
            )
            return {"reply": response}
            
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))