#!/usr/bin/env python3
"""
Diagnostic script to identify backend startup issues
"""
import sys

print("=" * 50)
print("AgriChat Backend Diagnostic")
print("=" * 50)

# Test 1: Environment variables
print("\n[1/5] Checking environment variables...")
try:
    from dotenv import load_dotenv
    import os
    load_dotenv()
    
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    
    if PINECONE_API_KEY:
        print("✓ PINECONE_API_KEY found")
    else:
        print("✗ PINECONE_API_KEY missing!")
        
    if OPENROUTER_API_KEY:
        print("✓ OPENROUTER_API_KEY found")
    else:
        print("✗ OPENROUTER_API_KEY missing!")
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)

# Test 2: Import dependencies
print("\n[2/5] Testing imports...")
try:
    from langchain_pinecone import PineconeVectorStore
    from langchain_openai import ChatOpenAI
    from src.helper import download_embeddings
    print("✓ All imports successful")
except Exception as e:
    print(f"✗ Import error: {e}")
    sys.exit(1)

# Test 3: Pinecone connection
print("\n[3/5] Checking Pinecone connection...")
try:
    from pinecone import Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    indexes = pc.list_indexes().names()
    print(f"✓ Connected to Pinecone. Indexes: {indexes}")
    
    if 'sentinel-farmer-index' in indexes:
        print("✓ sentinel-farmer-index exists")
        idx = pc.Index('sentinel-farmer-index')
        stats = idx.describe_index_stats()
        print(f"  Vector count: {stats.get('total_vector_count', 0)}")
        if stats.get('total_vector_count', 0) == 0:
            print("  ⚠ WARNING: Index is empty! Run store_sentinel.py first")
    else:
        print("✗ sentinel-farmer-index NOT found! Run store_sentinel.py")
except Exception as e:
    print(f"✗ Pinecone error: {e}")
    sys.exit(1)

# Test 4: Load embeddings
print("\n[4/5] Loading embeddings model...")
try:
    embeddings = download_embeddings()
    print("✓ Embeddings model loaded")
except Exception as e:
    print(f"✗ Embeddings error: {e}")
    sys.exit(1)

# Test 5: Test vector store
print("\n[5/5] Testing vector store connection...")
try:
    docsearch = PineconeVectorStore.from_existing_index(
        index_name="sentinel-farmer-index",
        embedding=embeddings
    )
    print("✓ Vector store connected")
except Exception as e:
    print(f"✗ Vector store error: {e}")
    sys.exit(1)

print("\n" + "=" * 50)
print("✓ All diagnostics passed!")
print("Backend should be ready to run.")
print("=" * 50)
