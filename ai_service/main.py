
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from typing import List, Optional
import joblib
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

# Load the ML model at startup (for yield prediction)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'images_dataset.joblib')
ml_model = None
try:
    ml_model = joblib.load(MODEL_PATH)
    print(f"✅ ML model loaded: {MODEL_PATH}")
except Exception as e:
    print(f"⚠️ Could not load ML model: {e}")
    print("Continuing without ML-based yield prediction")

# Initialize Earth Engine on startup
@app.on_event("startup")
async def startup_event():
    """Initialize Earth Engine when the service starts"""
    try:
        satellite.initialize()
    except Exception as e:
        print(f"⚠️ Earth Engine initialization failed: {e}")
        print("Service will continue but satellite data fetching will fail")


class AnalyzeFieldRequest(BaseModel):
    field_id: str
    geometry: List[List[float]]  # [[lon, lat], [lon, lat], ...]
    days_back: Optional[int] = 90


@app.get("/")
def home():
    return {
        "service": "ZAYTUNA.AI Satellite Intelligence",
        "status": "operational",
        "capabilities": [
            "Sentinel-1 SAR moisture analysis",
            "Sentinel-2 NDVI vegetation health",
            "Time-series trend analysis",
            "Expert decision recommendations",
            "ML-based yield prediction"
        ]
    }


@app.post("/analyze-field")
async def analyze_field(request: AnalyzeFieldRequest):
    """
    Analyze a field using real satellite data from Earth Engine
    
    Returns:
        - current: Current NDVI and moisture metrics
        - history: Time series data (last 90 days)
        - insight: AI-generated recommendation
        - risk_level: Critical/High/Medium/Low
    """
    try:
        # Validate geometry
        if not request.geometry or len(request.geometry) < 3:
            raise HTTPException(
                status_code=400,
                detail="Invalid geometry. Must be a polygon with at least 3 points."
            )
        
        # Fetch satellite data
        print(f"🛰️ Fetching satellite data for field {request.field_id}...")
        satellite_data = satellite.get_time_series(
            geometry=request.geometry,
            days_back=request.days_back
        )
        
        # Run decision engine analysis
        print(f"🧠 Running decision engine analysis...")
        analysis = decision_engine.analyze(satellite_data, ml_model=ml_model)
        
        # Combine results
        result = {
            "field_id": request.field_id,
            "current": satellite_data['current'],
            "history": satellite_data['history'],
            "risk_level": analysis['risk_level'],
            "confidence": analysis['confidence'],
            "insight": analysis['insight'],
            "metrics": analysis['metrics'],
            "yield_prediction": analysis.get('yield_prediction')
        }
        
        print(f"✅ Analysis complete for field {request.field_id}")
        return JSONResponse(content=result)
        
    except Exception as e:
        print(f"❌ Error analyzing field: {str(e)}")
        # Fallback to mock data if GEE fails (so the demo doesn't break)
        print("⚠️ Falling back to simulation mode due to error")
        
        import random
        from datetime import datetime, timedelta
        
        # Simulated history
        history = []
        for i in range(request.days_back):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            history.append({
                "date": date,
                "ndvi": 0.3 + (0.5 * (1 - (i/request.days_back))), # Simulated trend
                "moisture_index": 0.2 + (random.random() * 0.3)
            })
        history.reverse()
        
        return JSONResponse(content={
            "field_id": request.field_id,
            "current": {
                "ndvi": 0.72, 
                "moisture_index": 0.45,
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            "history": history,
            "risk_level": "Low",
            "confidence": 0.85,
            "insight": {
                "title": "Simulation Mode Active",
                "description": f"Real satellite data unavailable: {str(e)}. Displaying simulated healthy field metrics.",
                "action": "Check API credentials"
            },
            "metrics": {
                "ndvi_trend": 0.05,
                "moisture_trend": -0.02
            }
        })


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "earth_engine": satellite._initialized,
        "ml_model": ml_model is not None
    }
