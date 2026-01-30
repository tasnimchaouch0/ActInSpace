"""
Decision Engine - Expert System for Olive Grove Management
Converts satellite metrics into actionable intelligence
"""
from typing import Dict, Optional
import numpy as np

def analyze(satellite_data: Dict, ml_model=None) -> Dict:
    """
    Analyze satellite data and generate intelligent recommendations
    
    Args:
        satellite_data: Output from satellite.get_time_series()
        ml_model: Optional ML model for yield prediction
        
    Returns:
        Dictionary with risk assessment and recommendations
    """
    current = satellite_data.get('current', {})
    history = satellite_data.get('history', [])
    
    ndvi = current.get('ndvi')
    moisture = current.get('moisture_index')
    
    # Calculate trends
    ndvi_trend = _calculate_trend([h.get('ndvi') for h in history if h.get('ndvi') is not None])
    moisture_trend = _calculate_trend([h.get('moisture_index') for h in history if h.get('moisture_index') is not None])
    
    # Decision Logic - Expert Rules
    risk_level = "Unknown"
    recommendation = "Insufficient data"
    title = "Awaiting Data"
    confidence = 0.0
    
    if ndvi is not None and moisture is not None:
        # SCENARIO 1: Critical Water Stress (Low moisture + Declining NDVI)
        if moisture < 0.3 and ndvi < 0.4 and ndvi_trend < -0.05:
            risk_level = "Critical"
            title = "🚨 Severe Water Stress Detected"
            recommendation = "Immediate irrigation required. Apply 50-60mm water within 24 hours to prevent permanent damage."
            confidence = 0.92
            
        # SCENARIO 2: Disease/Waterlogging Warning (High moisture + Low NDVI)
        elif moisture > 0.6 and ndvi < 0.4:
            risk_level = "High"
            title = "⚠️ Potential Root Disease"
            recommendation = "Soil is saturated but vegetation is stressed. STOP irrigation. Inspect for root rot or fungal infection."
            confidence = 0.85
            
        # SCENARIO 3: Moderate Water Stress (Declining trend)
        elif moisture < 0.4 and ndvi_trend < -0.02:
            risk_level = "Medium"
            title = "💧 Water Stress Developing"
            recommendation = "Schedule irrigation within 48-72 hours. Monitor closely for further decline."
            confidence = 0.78
            
        # SCENARIO 4: Heat Stress (Good moisture but declining NDVI)
        elif moisture > 0.5 and ndvi < 0.5 and ndvi_trend < 0:
            risk_level = "Medium"
            title = "🌡️ Heat Stress Suspected"
            recommendation = "Adequate soil moisture but vegetation declining. Check for heat damage or pest activity."
            confidence = 0.72
            
        # SCENARIO 5: Optimal Growth
        elif ndvi > 0.6 and moisture > 0.4 and ndvi_trend >= 0:
            risk_level = "Low"
            title = "✅ Healthy Growth"
            recommendation = "Vegetation is thriving. Continue current irrigation schedule. No action needed."
            confidence = 0.88
            
        # SCENARIO 6: Recovery Phase (Improving NDVI)
        elif ndvi_trend > 0.05:
            risk_level = "Low"
            title = "📈 Recovery in Progress"
            recommendation = "Vegetation health improving. Maintain current management practices."
            confidence = 0.80
            
        # SCENARIO 7: Moderate Health
        elif ndvi > 0.4 and moisture > 0.3:
            risk_level = "Medium"
            title = "⚡ Moderate Health"
            recommendation = "Vegetation is stable but not optimal. Consider light irrigation if no rain expected."
            confidence = 0.70
            
        else:
            risk_level = "Medium"
            title = "📊 Monitoring Required"
            recommendation = "Conditions are borderline. Continue monitoring for trend changes."
            confidence = 0.65
    
    # ML-based Yield Prediction (if model available)
    yield_prediction = None
    if ml_model is not None and ndvi is not None:
        try:
            # Prepare features for model
            features = _prepare_ml_features(satellite_data)
            if features is not None:
                yield_pred = ml_model.predict([features])[0]
                yield_prediction = {
                    'expected_yield_percent': round(float(yield_pred * 100), 1),
                    'baseline': 100.0,
                    'status': 'above' if yield_pred > 1.0 else 'below'
                }
        except Exception as e:
            print(f"ML prediction failed: {e}")
    
    return {
        'risk_level': risk_level,
        'confidence': confidence,
        'insight': {
            'title': title,
            'description': _generate_description(ndvi, moisture, ndvi_trend, moisture_trend),
            'action': recommendation
        },
        'metrics': {
            'ndvi': round(ndvi, 3) if ndvi is not None else None,
            'moisture_index': round(moisture, 3) if moisture is not None else None,
            'ndvi_trend': round(ndvi_trend, 3),
            'moisture_trend': round(moisture_trend, 3)
        },
        'yield_prediction': yield_prediction
    }


def _calculate_trend(values: list) -> float:
    """Calculate simple linear trend from time series"""
    if len(values) < 2:
        return 0.0
    
    # Remove None values
    clean_values = [v for v in values if v is not None]
    if len(clean_values) < 2:
        return 0.0
    
    # Simple trend: last value - first value
    return clean_values[-1] - clean_values[0]


def _generate_description(ndvi: float, moisture: float, ndvi_trend: float, moisture_trend: float) -> str:
    """Generate human-readable description of current conditions"""
    if ndvi is None or moisture is None:
        return "Awaiting satellite data for analysis."
    
    # NDVI interpretation
    if ndvi > 0.6:
        veg_status = "dense and healthy"
    elif ndvi > 0.4:
        veg_status = "moderate"
    else:
        veg_status = "stressed"
    
    # Moisture interpretation
    if moisture > 0.6:
        moisture_status = "high"
    elif moisture > 0.4:
        moisture_status = "adequate"
    else:
        moisture_status = "low"
    
    # Trend interpretation
    trend_desc = ""
    if abs(ndvi_trend) > 0.05:
        direction = "improving" if ndvi_trend > 0 else "declining"
        trend_desc = f" Vegetation health is {direction}."
    
    return f"Vegetation is {veg_status} (NDVI: {ndvi:.2f}). Soil moisture is {moisture_status} ({int(moisture*100)}%).{trend_desc}"


def _prepare_ml_features(satellite_data: Dict) -> Optional[np.ndarray]:
    """Prepare feature vector for ML model"""
    try:
        current = satellite_data.get('current', {})
        history = satellite_data.get('history', [])
        
        ndvi = current.get('ndvi')
        moisture = current.get('moisture_index')
        
        if ndvi is None or moisture is None:
            return None
        
        # Calculate statistical features
        ndvi_values = [h.get('ndvi') for h in history if h.get('ndvi') is not None]
        
        if len(ndvi_values) < 3:
            return None
        
        ndvi_mean = np.mean(ndvi_values)
        ndvi_std = np.std(ndvi_values)
        ndvi_min = np.min(ndvi_values)
        ndvi_max = np.max(ndvi_values)
        
        # Feature vector (adjust based on your model's training)
        features = np.array([
            ndvi,
            moisture,
            ndvi_mean,
            ndvi_std,
            ndvi_min,
            ndvi_max,
            len(ndvi_values)
        ])
        
        return features
        
    except Exception as e:
        print(f"Feature preparation failed: {e}")
        return None
