import ee
import os

project_id = "mongi-485920"
try:
    print(f"Attempting to initialize GEE with project: {project_id}")
    ee.Initialize(project=project_id)
    print("✅ Success! Earth Engine is ready.")
    
    # Simple test fetch
    info = ee.Image("NASA/NASADEM_HGT/001").reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=ee.Geometry.Point([10.76, 34.75]),
        scale=30
    ).getInfo()
    print(f"Test fetch successful: {info}")
    
except Exception as e:
    print(f"❌ Initialization failed: {e}")
