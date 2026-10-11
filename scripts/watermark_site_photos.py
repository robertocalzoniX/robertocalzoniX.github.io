#!/usr/bin/env python3
"""Apply a permanent centered copyright watermark to selected public site photos."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = [
    ROOT / "assets" / "20261011_113822.jpg",
    ROOT / "assets" / "scarpe-running.jpg",
]
MARKER = ROOT / "assets" / ".watermark-completed"
TEXT = "© Roberto Calzoni"

def main():
    if MARKER.exists():
        print("Already watermarked; no changes.")
        return
    font_file = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    for path in PHOTOS:
        if not path.is_file():
            raise FileNotFoundError(path)
        with Image.open(path) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
        w, h = image.size
        font = ImageFont.truetype(font_file, max(18, round(w * 0.044)))
        draw_layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(draw_layer)
        box = draw.textbbox((0, 0), TEXT, font=font)
        tw, th = box[2] - box[0], box[3] - box[1]
        x = (w - tw) // 2 - box[0]
        y = (h - th) // 2 - box[1]
        offset = max(2, round(w * 0.0017))
        draw.text((x + offset, y + offset), TEXT, font=font, fill=(0, 0, 0, 125))
        draw.text((x, y), TEXT, font=font, fill=(255, 255, 255, 142))
        out = Image.alpha_composite(image.convert("RGBA"), draw_layer).convert("RGB")
        out.save(path, "JPEG", quality=90, optimize=True, subsampling=0)
        print(f"Watermarked {path.name}: {w}x{h}")
    MARKER.write_text("Applied centered © Roberto Calzoni watermark to two photos.\n", encoding="utf-8")

if __name__ == "__main__":
    main()
