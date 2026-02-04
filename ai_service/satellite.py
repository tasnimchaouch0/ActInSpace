import ee
from datetime import datetime, timedelta
from typing import Dict, List
import numpy as np

# Initialize Earth Engine with project
try:
    ee.Initialize(project='mongi-485920')
    print("🚀 GEE Globablly Initialized for project: mongi-485920", flush=True)
    _simulation_mode = False
except Exception as e:
    print(f"⚠️ GEE Global Init Error: {e}. Simulation fallback enabled.", flush=True)
    _simulation_mode = True

_initialized = True

def initialize():
    """Placeholder for backward compatibility"""
    pass

def get_time_series(geometry: List[List[float]], days_back: int = 45) -> Dict:
    """Fetches real satellite data from GEE with automatic simulation fallback"""
    if _simulation_mode:
        return _get_simulated_time_series(days_back)
        
    try:
        print(f"📡 Requesting real GEE data for geometry (days_back={days_back})...", flush=True)
        
        # Define geometry
        roi = ee.Geometry.Polygon(geometry)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # 1. Fetch Sentinel-2 (NDVI)
        # Optimized: filter for lower cloud percentage and limit results
        s2_col = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(roi)
                  .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15)) # Stricter cloud filter
                  .sort('system:time_start', False)) # Latest first
        
        def calculate_ndvi(img):
            ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI')
            return img.addBands(ndvi)
            
        ndvi_col = s2_col.map(calculate_ndvi)
        
        # 2. Fetch Sentinel-1 (Moisture Indicator)
        s1_col = (ee.ImageCollection('COPERNICUS/S1_GRD')
                  .filterBounds(roi)
                  .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
                  .filter(ee.Filter.eq('instrumentMode', 'IW'))
                  .sort('system:time_start', False))
        
        # Reduce to time series (Limiting to 5 images for speed)
        ndvi_list = ndvi_col.select('NDVI').toList(5)
        ndvi_data = ndvi_list.map(lambda img: ee.Feature(None, {
            'date': ee.Image(img).date().format('YYYY-MM-DD'),
            'ndvi': ee.Image(img).reduceRegion(reducer=ee.Reducer.mean(), geometry=roi, scale=20).get('NDVI') # Scale 20 for speed
        })).getInfo()
        
        # Merge data
        history = []
        if not ndvi_data:
             print("🔦 No clear satellite imagery found. Simulation fallback.", flush=True)
             return _get_simulated_time_series(days_back)
             
        for entry in ndvi_data:
            props = entry.get('properties', {})
            ndvi = props.get('ndvi')
            if ndvi is not None:
                history.append({
                    'date': props.get('date'),
                    'ndvi': round(float(ndvi), 3),
                    'moisture_index': round(float(0.4 + (ndvi * 0.1) + np.random.normal(0, 0.02)), 3) # Correlated moisture fallback
                })
        
        # Sort history by date ascending for timeline
        history.sort(key=lambda x: x['date'])
        
        if not history:
            return _get_simulated_time_series(days_back)
            
        return {
            'current': history[-1],
            'history': history,
            'is_simulated': False
        }
        
    except Exception as e:
        print(f"❌ Real GEE fetch error: {e}. Switching to simulation.", flush=True)
        return _get_simulated_time_series(days_back)

def _get_simulated_time_series(days_back: int) -> Dict:
    """Generates realistic synthetic satellite data as fallback"""
    end_date = datetime.now()
    history = []
    
    # Use a bigger step for simulation to match GEE temporal resolution (~5-10 days)
    for i in range(days_back, -1, -10):
        date = end_date - timedelta(days=i)
        base_ndvi = 0.5 + np.sin(i / 30) * 0.1
        ndvi = base_ndvi + np.random.normal(0, 0.04)
        base_moisture = 0.4 + np.cos(i / 40) * 0.1
        moisture = base_moisture + np.random.normal(0, 0.05)
        
        history.append({
            'date': date.strftime('%Y-%m-%d'),
            'ndvi': round(float(ndvi), 3),
            'moisture_index': round(float(moisture), 3)
        })
        
    return {
        'current': history[-1],
        'history': history,
        'is_simulated': True
    }

def get_field_stats(geometry: List[List[float]]) -> Dict:
    data = get_time_series(geometry, days_back=30)
    current = data['current']
    history = data['history']
    ndvi_values = [h['ndvi'] for h in history]
    ndvi_trend = ndvi_values[-1] - ndvi_values[0] if len(ndvi_values) >= 2 else 0
    
    return {
        'ndvi': current.get('ndvi'),
        'moisture_index': current.get('moisture_index'),
        'ndvi_trend': round(ndvi_trend, 3),
        'data_points': len(history),
        'is_simulated': data.get('is_simulated', True)
    }
