import urllib.request
import json
import os
import shutil
import time

SITES = [
    ("gayatri-refrigeration","https://gayatrirefrigeration.com/"),
    ("pro-albums-direct",    "https://www.proalbumsdirect.com/")
]

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def fetch_screenshot(slug, url):
    print(f"Fetching {slug} from {url}...")
    api_url = f"https://api.microlink.io?url={url}&screenshot=true&meta=false&waitFor=15000&waitUntil=networkidle0&viewport.width=1440&viewport.height=900"
    
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if 'data' in data and 'screenshot' in data['data'] and 'url' in data['data']['screenshot']:
                img_url = data['data']['screenshot']['url']
                vp_path = os.path.join(ASSETS_DIR, f"{slug}_ss.png")
                urllib.request.urlretrieve(img_url, vp_path)
                full_path = os.path.join(ASSETS_DIR, f"{slug}_ss_full.png")
                shutil.copy(vp_path, full_path)
                print(f"  -> Saved {vp_path}")
            else:
                print(f"  -> Failed: {data}")
    except Exception as e:
        print(f"  -> Exception: {e}")

for slug, url in SITES:
    fetch_screenshot(slug, url)
    time.sleep(2)
