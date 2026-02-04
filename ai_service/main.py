
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from typing import List, Optional
import os

# Import our custom modules
import satellite
import decision_engine

app = FastAPI(title="ZAYTUNA.AI Satellite Intelligence Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ML model loading is disabled for stability during initialization fix
ml_model = None

@app.get("/ping")
def ping():
    return {"status": "alive", "service": "ZAYTUNA.AI"}

class AnalyzeFieldRequest(BaseModel):
    field_id: str
    geometry: List[List[float]]
    days_back: Optional[int] = 90

@app.post("/analyze-field")
async def analyze_field(request: AnalyzeFieldRequest):
    print(f"📥 Request: {request.field_id}", flush=True)
    try:
        # Fetch satellite data (Simulated fallback is automatic inside satellite.py)
        satellite_data = satellite.get_time_series(
            geometry=request.geometry,
            days_back=request.days_back
        )
        
        # Run decision engine analysis
        analysis = decision_engine.analyze(satellite_data, ml_model=ml_model)
        
        result = {
            "field_id": request.field_id,
            "current": satellite_data['current'],
            "history": satellite_data['history'],
            "risk_level": analysis['risk_level'],
            "confidence": analysis['confidence'],
            "insight": analysis['insight'],
            "metrics": analysis['metrics'],
            "is_simulated": satellite_data.get('simulated', False)
        }
        
        print(f"✅ Dispatched: {request.field_id} (Simulated: {result['is_simulated']})", flush=True)
        return JSONResponse(content=result)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}", flush=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "earth_engine": satellite._initialized,
        "ml_model": False
    }
