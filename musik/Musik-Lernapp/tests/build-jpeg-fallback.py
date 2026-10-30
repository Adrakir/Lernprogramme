from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / "images"
images = sorted(root.glob("*.webp"))
assert len(images) >= 30, f"Nur {len(images)} WebP-Illustrationen gefunden"
for original in images:
    with Image.open(original) as source:
        source.load()
        image = source.convert("RGBA")
        opaque = Image.new("RGB", image.size, (255, 255, 255))
        opaque.paste(image, mask=image.getchannel("A"))
        destination = original.with_suffix(".jpg")
        opaque.save(destination, "JPEG", quality=88, progressive=True, optimize=True)
    with Image.open(destination) as check:
        check.verify()
    print(f"Bilddatei OK: {destination.name}")
print(f"Fertig: {len(images)} JPEG-Fallbacks.")
