import urllib.request
import json
import os
import time

SITES = [
    ("first-decacorn",       "https://firstdecacorn.com/"),
    ("golden-route-tourism", "https://goldenroutetourism.com/"),
    ("gayatri-engineering",  "https://gayatriengineering.co.in/"),
    ("rj-inox",              "https://www.rjinoxllp.com/"),
    ("aim-international",    "https://aiminternational.in/"),
    ("pro-albums-direct",    "https://www.proalbumsdirect.com/")
]

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def fetch_full_screenshot(slug, url):
    print(f"Fetching full page {slug} from {url}...")
    api_url = f"https://api.microlink.io?url={url}&screenshot=true&meta=false&waitFor=10000&waitUntil=networkidle0&fullPage=true&viewport.width=1440"
    
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if 'data' in data and 'screenshot' in data['data'] and 'url' in data['data']['screenshot']:
                img_url = data['data']['screenshot']['url']
                full_path = os.path.join(ASSETS_DIR, f"{slug}_ss_full.png")
                urllib.request.urlretrieve(img_url, full_path)
                print(f"  -> Saved full page to {full_path}")
            else:
                print(f"  -> Failed: {data}")
    except Exception as e:
        print(f"  -> Exception: {e}")

for slug, url in SITES:
    fetch_full_screenshot(slug, url)
    time.sleep(2)
