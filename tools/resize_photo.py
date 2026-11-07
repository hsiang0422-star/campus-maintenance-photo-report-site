"""Resize a photo for the web to about 20 KB (JPEG).

Usage:
    python3 tools/resize_photo.py SOURCE_IMAGE DEST_JPG [--limit-kb 20]

Keeps the longest side at 600 px where possible and lowers the JPEG quality
until the file is at or below the size limit. Smaller sides are tried if
quality alone is not enough.
"""
import argparse
import os

from PIL import Image, ImageOps


def resize(source, dest, limit_kb=20):
    limit = limit_kb * 1024
    base = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    for side in (600, 540, 500, 450, 400):
        im = base.copy()
        im.thumbnail((side, side * 2))
        for quality in range(75, 9, -5):
            im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
            if os.path.getsize(dest) <= limit:
                return side, quality, os.path.getsize(dest)
    return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("dest")
    parser.add_argument("--limit-kb", type=int, default=20)
    args = parser.parse_args()
    result = resize(args.source, args.dest, args.limit_kb)
    print(result if result else "could not reach the size limit")
