"""
Satellite Data Processing Module
Fetches and processes Sentinel-1/2 data from Google Earth Engine
"""
import ee
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import numpy as np

# Initialize Earth Engine (will be called on startup)
_initialized = False

def initialize():
    """Initialize Earth Engine with authentication"""
    global _initialized
    if not _initialized:
        try:
            ee.Initialize()
            _initialized = True
            print("✅ Earth Engine initialized successfully")
        except Exception as e:
            print(f"⚠️ Earth Engine initialization failed: {e}")
            print("Attempting to authenticate...")
            try:
                ee.Authenticate()
                ee.Initialize()
                _initialized = True
                print("✅ Earth Engine authenticated and initialized")
            except Exception as auth_error:
                print(f"❌ Authentication failed: {auth_error}")
                raise


def get_time_series(
    geometry: List[List[float]], 
    days_back: int = 90
) -> Dict:
    """
    Fetch time series data for a field polygon
    
    Args:
        geometry: List of [lon, lat] coordinates forming a polygon
        days_back: Number of days to look back
        
    Returns:
        Dictionary with current stats and historical time series
    """
    if not _initialized:
        initialize()
    
    # Convert geometry to Earth Engine polygon
    ee_geometry = ee.Geometry.Polygon(geometry)
    
    # Date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    # Fetch Sentinel-2 (Optical - for NDVI)
    s2_collection = (
        ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
        .filterBounds(ee_geometry)
        .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    )
    
    # Fetch Sentinel-1 (Radar - for Moisture)
    s1_collection = (
        ee.ImageCollection('COPERNICUS/S1_GRD')
        .filterBounds(ee_geometry)
        .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
        .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    )
    
    # Process time series
    history = []
    
    # Get list of dates (sample every 7 days to reduce computation)
    date_list = []
    current = start_date
    while current <= end_date:
        date_list.append(current)
        current += timedelta(days=7)
    
    for date in date_list:
        date_str = date.strftime('%Y-%m-%d')
        week_start = date
        week_end = date + timedelta(days=7)
        
        # Get NDVI for this week
        s2_week = s2_collection.filterDate(
            week_start.strftime('%Y-%m-%d'),
            week_end.strftime('%Y-%m-%d')
        )
        
        if s2_week.size().getInfo() > 0:
            # Calculate NDVI
            def add_ndvi(image):
                ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
                return image.addBands(ndvi)
            
            s2_with_ndvi = s2_week.map(add_ndvi)
            ndvi_mean = s2_with_ndvi.select('NDVI').mean().reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=ee_geometry,
                scale=10,
                maxPixels=1e9
            ).getInfo()
            
            ndvi_value = ndvi_mean.get('NDVI', None)
        else:
            ndvi_value = None
        
        # Get Moisture proxy (VV backscatter) for this week
        s1_week = s1_collection.filterDate(
            week_start.strftime('%Y-%m-%d'),
            week_end.strftime('%Y-%m-%d')
        )
        
        if s1_week.size().getInfo() > 0:
            vv_mean = s1_week.select('VV').mean().reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=ee_geometry,
                scale=10,
                maxPixels=1e9
            ).getInfo()
            
            # Convert to moisture index (normalized -20 to 0 dB range to 0-1)
            vv_db = vv_mean.get('VV', None)
            if vv_db is not None:
                moisture_index = (vv_db + 20) / 20  # Simple normalization
                moisture_index = max(0, min(1, moisture_index))  # Clamp to 0-1
            else:
                moisture_index = None
        else:
            moisture_index = None
        
        if ndvi_value is not None or moisture_index is not None:
            history.append({
                'date': date_str,
                'ndvi': round(ndvi_value, 3) if ndvi_value is not None else None,
                'moisture_index': round(moisture_index, 3) if moisture_index is not None else None
            })
    
    # Get current (most recent) values
    current_stats = history[-1] if history else {
        'date': end_date.strftime('%Y-%m-%d'),
        'ndvi': None,
        'moisture_index': None
    }
    
    return {
        'current': current_stats,
        'history': history
    }


def get_field_stats(geometry: List[List[float]]) -> Dict:
    """
    Get current snapshot statistics for a field
    
    Args:
        geometry: List of [lon, lat] coordinates forming a polygon
        
    Returns:
        Dictionary with current NDVI, moisture, and basic stats
    """
    data = get_time_series(geometry, days_back=30)
    
    current = data['current']
    history = data['history']
    
    # Calculate trend (simple linear regression on last 30 days)
    ndvi_values = [h['ndvi'] for h in history if h['ndvi'] is not None]
    
    if len(ndvi_values) >= 2:
        # Simple trend: compare last value to first
        ndvi_trend = ndvi_values[-1] - ndvi_values[0]
    else:
        ndvi_trend = 0
    
    return {
        'ndvi': current.get('ndvi'),
        'moisture_index': current.get('moisture_index'),
        'ndvi_trend': round(ndvi_trend, 3),
        'data_points': len(history)
    }
