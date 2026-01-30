import os
import requests
import rasterio
import numpy as np
from datetime import datetime, timedelta

# ---------------- Utility Functions ----------------

def download_file(url, out_path):
    """Downloads a file from a URL to a local path."""
    if os.path.exists(out_path):
        print(f"{out_path} already exists")
        return True
    
    print(f"Downloading {url} to {out_path} ...")
    try:
        r = requests.get(url, stream=True)
        if r.status_code == 200:
            with open(out_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
        else:
            print(f"Failed to download {url} (HTTP {r.status_code})")
            return False
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def get_sentinel_scene_urls(tile_id, date_str):
    """
    Queries Element84 STAC API to find the best scene for a given tile and date.
    Returns dictionary of band URLs (red, nir) and the actual capture date.
    """
    stac_url = "https://earth-search.aws.element84.com/v1/search"
    
    # Parse tile_id (T31TFJ -> 31, T, FJ) for better search if needed, 
    # but the STAC API usually supports simple filtering or we can just use the grid.
    # Actually, simpler is to filter by generic full-text or geometry, but let's use the explicit MGRS fields.
    # MGRS: 31TFJ
    
    # Parse date (expects YYYYMMDD or YYYY-MM-DD)
    try:
        if "-" in date_str:
            target_date = datetime.strptime(date_str, "%Y-%m-%d")
        else:
            target_date = datetime.strptime(date_str, "%Y%m%d")
    except ValueError:
        print(f"Invalid date format: {date_str}")
        return None, None

    # Search window: +/- 5 days to find a valid capture
    start_date = (target_date - timedelta(days=5)).strftime("%Y-%m-%dT00:00:00Z")
    end_date = (target_date + timedelta(days=5)).strftime("%Y-%m-%dT23:59:59Z")
    
    # Parse MGRS
    # T31TFJ -> 31, T, FJ
    # Note: T31TFJ -> Zone 31, Band T, Square FJ
    # Logic: 2 digits zone, 1 char band, 2 chars square
    zone = int(tile_id[1:3])
    lat_band = tile_id[3]
    square = tile_id[4:]
    
    payload = {
        "collections": ["sentinel-2-l2a"],
        "query": {
            "mgrs:utm_zone": {"eq": zone},
            "mgrs:latitude_band": {"eq": lat_band},
            "mgrs:grid_square": {"eq": square},
            "eo:cloud_cover": {"lt": 20} # Filter cloudy scenes
        },
        "datetime": f"{start_date}/{end_date}",
        "limit": 1,
        "sort": [{"field": "datetime", "direction": "asc"}]
    }
    
    try:
        r = requests.post(stac_url, json=payload)
        r.raise_for_status()
        features = r.json().get("features", [])
        
        if not features:
            print(f"No scenes found for {tile_id} around {date_str}")
            return None, None
            
        feature = features[0]
        assets = feature["assets"]
        
        urls = {}
        # Element84 STAC uses 'red' and 'nir' keys usually, or 'B04' and 'B08'
        # Let's check keys
        if "red" in assets:
            urls["B04"] = assets["red"]["href"]
        elif "B04" in assets:
             urls["B04"] = assets["B04"]["href"]
             
        if "nir" in assets:
            urls["B08"] = assets["nir"]["href"]
        elif "B08" in assets:
            urls["B08"] = assets["B08"]["href"]
            
        capture_date = feature["properties"]["datetime"].split("T")[0]
        return urls, capture_date
        
    except Exception as e:
        print(f"STAC Search Error: {e}")
        return None, None

def compute_ndvi_for_bands(red_path, nir_path):
    """Computes Mean NDVI from Red (B04) and NIR (B08) band files."""
    try:
        with rasterio.open(nir_path) as src_nir, rasterio.open(red_path) as src_red:
            # Read first band
            nir = src_nir.read(1).astype(np.float32)
            red = src_red.read(1).astype(np.float32)
            
            # Avoid division by zero
            # Handle potential shape mismatch (unlikely for same scene)
            if nir.shape != red.shape:
                # Resize red to match nir if needed, or just fail
                print("Band shapes mismatch")
                return None
                
            ndvi = (nir - red) / (nir + red + 1e-6)
            mean_ndvi = float(np.nanmean(ndvi))
            return mean_ndvi
    except Exception as e:
        print(f"Error computing NDVI: {e}")
        return None

def process_sentinel_tile(tile_id, dates, output_dir, fields=["Field_1"]):
    """
    Downloads bands, computes NDVI, and generates document objects for RAG.
    """
    # bands = ["B04", "B08"] 
    documents = []
    
    os.makedirs(output_dir, exist_ok=True)
    
    for date_str in dates:
        print(f"\nProcessing request for date: {date_str}")
        
        # 1. Resolve URLs via STAC
        band_urls, capture_date = get_sentinel_scene_urls(tile_id, date_str)
        
        if not band_urls or not capture_date:
            print(f"Skipping {date_str} (No scene found)")
            continue
            
        print(f"Found scene from {capture_date}")
        
        band_paths = {}
        success = True
        
        for band_name, url in band_urls.items():
            filename = f"S2_{capture_date}_{tile_id}_{band_name}.tif"
            out_path = os.path.join(output_dir, filename)
            
            if download_file(url, out_path):
                band_paths[band_name] = out_path
            else:
                success = False
                break
        
        if not success or "B04" not in band_paths or "B08" not in band_paths:
            print("Missing required bands.")
            continue
            
        # 2. Compute NDVI
        mean_ndvi = compute_ndvi_for_bands(band_paths["B04"], band_paths["B08"])
        
        if mean_ndvi is None:
            continue
            
        print(f"Mean NDVI for {capture_date}: {mean_ndvi:.3f}")
        
        # 3. Create Documents
        for field in fields:
            status = 'Crop healthy' if mean_ndvi > 0.4 else 'Potential stress' # Adjusted threshold
            recommendation = 'Maintain irrigation' if mean_ndvi > 0.4 else 'Check irrigation and soil moisture'
            
            content = f"""
            Field Report
            ----------------
            Field ID: {field}
            Request Date: {date_str}
            Satellite Capture Date: {capture_date}
            Tile ID: {tile_id}
            Mean NDVI: {mean_ndvi:.2f}
            Status: {status}
            Recommendation: {recommendation}
            """
            
            metadata = {
                "source": f"Sentinel-2 Analysis {capture_date}",
                "field_id": field,
                "date": capture_date,
                "ndvi": mean_ndvi
            }
            
            documents.append({"page_content": content.strip(), "metadata": metadata})
            
    return documents
