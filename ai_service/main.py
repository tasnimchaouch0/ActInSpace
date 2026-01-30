
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import joblib
import numpy as np
import os

app = FastAPI()

# Load the model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'images_dataset.joblib')
model = None
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Could not load model: {e}")

class AnalyzeFieldRequest(BaseModel):
    field_id: str
    image_url: str

@app.get("/")
def home():
    return {"message": "GreenSignal AI Service running"}

@app.post("/analyze-field")
def analyze_field(request: AnalyzeFieldRequest):
    # For demonstration, use dummy features
    # Replace this with real feature extraction from image_url or field_id
    features = np.random.rand(1, model.n_features_in_) if model else np.zeros((1, 10))
    ndvi = float(model.predict(features)[0]) if model else 0.0
    # Dummy risk/alerts logic
    risk = "High" if ndvi < 0.3 else ("Medium" if ndvi < 0.6 else "Low")
    alerts = []
    if ndvi < 0.3:
        alerts.append("Severe water stress detected")
    elif ndvi < 0.6:
        alerts.append("Moderate water stress detected")
    else:
        alerts.append("No water stress detected")
    result = {
        "ndvi": ndvi,
        "risk": risk,
        "alerts": alerts
    }
    return JSONResponse(content=result)
