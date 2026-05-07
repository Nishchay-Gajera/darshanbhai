import urllib.request
import json
import os
import time

SITES = [
    ("first-decacorn",       "https://firstdecacorn.com/"),
    ("golden-route-tourism", "https://goldenroutetourism.com/"),
    ("gayatri-refrigeration","https://gayatrirefrigeration.com/"),
    ("gayatri-engineering",  "https://gayatriengineering.co.in/"),
    ("rj-inox",              "https://www.rjinoxllp.com/"),
    ("aim-international",    "https://aiminternational.in/")
]

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def fetch_screenshot(slug, url):
    print(f"Fetching {slug} from {url}...")
    
    # Using microlink.io to get a high-quality screenshot, wait 10s for page load
    api_url = f"https://api.microlink.io?url={url}&screenshot=true&meta=false&waitFor=15000&waitUntil=networkidle0&viewport.width=1440&viewport.height=900"
    
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            if 'data' in data and 'screenshot' in data['data'] and 'url' in data['data']['screenshot']:
                img_url = data['data']['screenshot']['url']
                print(f"  -> Got screenshot URL: {img_url}")
                
                # Download the image
                vp_path = os.path.join(ASSETS_DIR, f"{slug}_ss.png")
                urllib.request.urlretrieve(img_url, vp_path)
                print(f"  -> Saved viewport to {vp_path}")
                
                # We can just copy the viewport to full for now since it's a fallback
                full_path = os.path.join(ASSETS_DIR, f"{slug}_ss_full.png")
                import shutil
                shutil.copy(vp_path, full_path)
                return True
            else:
                print(f"  -> Failed: No screenshot in response")
                print(data)
                return False
    except Exception as e:
        print(f"  -> Exception: {e}")
        return False

for slug, url in SITES:
    fetch_screenshot(slug, url)
    time.sleep(2) # rate limit

print("Done with API fallback!")
