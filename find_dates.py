import requests
import json

STAC_URL = "https://earth-search.aws.element84.com/v1/search"

def find_scenes():
    # Search for Sentinel-2 L2A data
    # Tile: 31TFJ
    # Date: Jan 2024
    
    payload = {
        "collections": ["sentinel-2-l2a"],
        "query": {
            "mgrs:utm_zone": {"eq": 31},
            "mgrs:latitude_band": {"eq": "T"},
            "mgrs:grid_square": {"eq": "FJ"}
        },
        "datetime": "2024-01-01T00:00:00Z/2024-01-31T23:59:59Z",
        "limit": 5
    }
    
    print("Searching STAC API...")
    try:
        response = requests.post(STAC_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        features = data.get("features", [])
        print(f"Found {len(features)} scenes.")
        
        for feature in features:
            props = feature["properties"]
            date = props["datetime"]
            print(f"\nDate: {date}")
            print(f"Scene ID: {feature['id']}")
            assets = feature["assets"]
            if "red" in assets:
                 print(f"Red Band URL: {assets['red']['href']}")
            if "nir" in assets:
                 print(f"NIR Band URL: {assets['nir']['href']}")
            
            # Print legacy href if available (s3 path)
            # Usually in alternate assets or just the href
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_scenes()
