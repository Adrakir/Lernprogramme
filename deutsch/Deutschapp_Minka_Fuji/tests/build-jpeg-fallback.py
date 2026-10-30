from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'assets'
images = sorted(root.glob('*.webp'))
assert len(images) >= 9, f'Zu wenige vorhandene Deutsch-Illustrationen: {len(images)}'
for original in images:
    with Image.open(original) as source:
        source.load()
        rgba = source.convert('RGBA')
        canvas = Image.new('RGB', rgba.size, (255, 255, 255))
        canvas.paste(rgba, mask=rgba.getchannel('A'))
        destination = original.with_suffix('.jpg')
        canvas.save(destination, 'JPEG', quality=89, optimize=True, progressive=True)
    with Image.open(destination) as check:
        check.verify()
    print(f'Bild OK: {original.name} -> {destination.name}')
print(f'{len(images)} JPEG-Fassungen fuer alte Safari-Versionen erzeugt.')
