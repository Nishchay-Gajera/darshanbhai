"""
Screenshot script for new portfolio projects.
Uses Playwright with slow-scroll to ensure full page load.
Run: python take_new_screenshots.py
"""

import asyncio
from playwright.async_api import async_playwright
import os

SITES = [
    ("golden-route-tourism", "https://goldenroutetourism.com/"),
    ("first-decacorn",       "https://firstdecacorn.com/"),
    ("canvas-special",       "https://canvasspecial.co.za/"),
    ("pro-albums-direct",    "https://www.proalbumsdirect.com"),
    ("trips-njoy",           "https://www.tripsnjoy.in/"),
    ("gayatri-refrigeration","https://gayatrirefrigeration.com/"),
    ("mindbrust",            "https://mindbrust.com/"),
    ("rrmgt",                "https://rrmgt.in/"),
    ("whereelse-properties", "https://township.whereelseproperties.com/"),
    ("gayatri-engineering",  "https://gayatriengineering.co.in/"),
    ("umiyaram",             "https://umiyaram101.com/"),
    ("globallok",            "https://globallok.com/"),
]

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

HIDE_CLUTTER_JS = """
    const selectors = [
        '[class*="cookie"]', '[id*="cookie"]',
        '[class*="chat"]',   '[id*="chat"]',
        '[class*="popup"]',  '[id*="popup"]',
        '[class*="overlay"]','[id*="overlay"]',
        '[class*="modal"]',  '[id*="modal"]',
        '[class*="widget"]', '[id*="widget"]',
        '.intercom-launcher', '#hubspot-messages-iframe-container'
    ];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
    });
"""

async def slow_scroll(page):
    """Scroll slowly to trigger lazy-loaded images."""
    height = await page.evaluate("document.body.scrollHeight")
    step = 600
    for y in range(0, height, step):
        await page.evaluate(f"window.scrollTo(0, {y})")
        await asyncio.sleep(0.15)
    await page.evaluate("window.scrollTo(0, 0)")
    await asyncio.sleep(1)

async def screenshot_site(page, slug, url):
    vp_path   = os.path.join(ASSETS_DIR, f"{slug}_ss.png")
    full_path = os.path.join(ASSETS_DIR, f"{slug}_ss_full.png")

    print(f"  -> {url}")
    try:
        # networkidle ensures all assets (images, fonts) are loaded
        await page.goto(url, wait_until="networkidle", timeout=60000)
        
        # Wait 15 full seconds to ensure all CSS preloaders and intro animations fade out
        print("    Waiting 15s for preloaders...")
        await asyncio.sleep(15)
        
        await page.evaluate(HIDE_CLUTTER_JS)
        await slow_scroll(page)
        await asyncio.sleep(3)

        # Viewport screenshot
        await page.screenshot(path=vp_path, type="png")
        print(f"    OK viewport  -> {vp_path}")

        # Full-page screenshot
        await page.screenshot(path=full_path, full_page=True, type="png")
        print(f"    OK full-page -> {full_path}")

    except Exception as e:
        print(f"    FAIL FAILED: {e}")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        )
        page = await context.new_page()

        for slug, url in SITES:
            vp = os.path.join(ASSETS_DIR, f"{slug}_ss.png")
            if os.path.exists(vp) and os.path.getsize(vp) > 50000:
                print(f"  SKIP (exists): {slug}")
                continue
            print(f"\n[{SITES.index((slug,url))+1}/{len(SITES)}] {slug}")
            await screenshot_site(page, slug, url)

        await browser.close()
        print("\nDONE All done!")

asyncio.run(main())

