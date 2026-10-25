#!/usr/bin/env python3
"""Watermark new or replaced photos in assets/ once per file version.

The manifest tracks the Git blob SHA of the processed output. Existing images
are seeded in the manifest so they are not changed by this new automation.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
MANIFEST = ASSETS / ".image-processing.json"
FORMATS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_SIDE = 1920
LABEL = "© Roberto Calzoni"
FONT_FILE = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def blob_sha(path):
    content = path.read_bytes()
    return hashlib.sha1(
        b"blob " + str(len(content)).encode() + b"\0" + content
    ).hexdigest()


def watermark(path):
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        image.load()

    if max(image.size) > MAX_SIDE:
        image.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)

    width, height = image.size
    font = ImageFont.truetype(FONT_FILE, max(18, round(width * 0.044)))
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    bounds = draw.textbbox((0, 0), LABEL, font=font)
    x = (width - (bounds[2] - bounds[0])) // 2 - bounds[0]
    y = (height - (bounds[3] - bounds[1])) // 2 - bounds[1]
    offset = max(2, round(width * 0.0017))
    draw.text((x + offset, y + offset), LABEL, font=font, fill=(0, 0, 0, 125))
    draw.text((x, y), LABEL, font=font, fill=(255, 255, 255, 142))

    output = Image.alpha_composite(image.convert("RGBA"), overlay)
    ext = path.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        output.convert("RGB").save(
            path, "JPEG", quality=90, optimize=True, subsampling=0
        )
    elif ext == ".png":
        output.save(path, "PNG", optimize=True)
    else:
        output.save(path, "WEBP", quality=90, method=6)
    return width, height


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if not isinstance(manifest, dict):
        raise ValueError("Invalid image processing manifest")

    changed = False
    for path in sorted(ASSETS.rglob("*")):
        if not path.is_file() or path.is_symlink() or path.suffix.lower() not in FORMATS:
            continue
        key = path.relative_to(ROOT).as_posix()
        if manifest.get(key) == blob_sha(path):
            continue

        width, height = watermark(path)
        manifest[key] = blob_sha(path)
        changed = True
        print(f"Watermarked {key}: {width}x{height}")

    if changed:
        MANIFEST.write_text(
            json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
    else:
        print("No new or changed images to watermark.")


if __name__ == "__main__":
    main()
