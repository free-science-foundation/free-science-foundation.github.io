#!/usr/bin/env python3
"""
Convert animal line drawings to white/beige silhouettes on transparent background.
- White background → transparent
- Black outlines → white-beige (#F5F0E8)
"""
from PIL import Image
import os, glob

OUTLINE_COLOR = (245, 240, 232, 255)  # white-beige
THRESHOLD = 180  # pixels darker than this are considered "line"
INPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(INPUT_DIR, "silhouettes")

files = glob.glob(os.path.join(INPUT_DIR, "*.jpg")) + glob.glob(os.path.join(INPUT_DIR, "*.png"))

for path in files:
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3
            if brightness < THRESHOLD:
                # Dark pixel → outline → make white-beige
                pixels[x, y] = OUTLINE_COLOR
            else:
                # Light pixel → background → make transparent
                pixels[x, y] = (255, 255, 255, 0)

    name = os.path.splitext(os.path.basename(path))[0]
    # Rename sequentially: animal-1.png, animal-2.png, ...
    out_name = f"animal-{files.index(path) + 1}.png"
    out_path = os.path.join(OUTPUT_DIR, out_name)
    img.save(out_path, "PNG")
    print(f"  {os.path.basename(path)} → {out_name}")

print(f"\nDone. {len(files)} silhouettes saved to {OUTPUT_DIR}")
