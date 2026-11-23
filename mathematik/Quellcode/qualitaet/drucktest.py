"""Check printable margins, heading clearance, writing space and grayscale rendering."""
import sys
from pathlib import Path
import fitz
from itertools import combinations

for path in Path(sys.argv[1]).glob('*.pdf'):
    doc = fitz.open(path)
    for page in doc:
        spans = [s for b in page.get_text('dict')['blocks'] if 'lines' in b
                 for line in b['lines'] for s in line['spans'] if s['text'].strip()]
        assert spans, (path, page.number)
        for s in spans:
            box = fitz.Rect(s['bbox'])
            assert (box.x0 > 10 and box.y0 > 10 and box.x1 < page.rect.width-10
                    and box.y1 < page.rect.height-10), (path, page.number, s['text'])
        for a,b in combinations(spans,2):
            overlap = fitz.Rect(a['bbox']) & fitz.Rect(b['bbox'])
            assert overlap.width < 4 or overlap.height < 4, (path, page.number,a['text'],b['text'])
        if page.number == 0:
            lines = page.get_drawings()
            assert lines or any('_' in s['text'] for s in spans), (path,'Schreibraum')
        pix = page.get_pixmap(colorspace=fitz.csGRAY, matrix=fitz.Matrix(.5,.5))
        assert min(pix.samples)<90, (path,'Kontrast')
print('Druckproben geprüft:',len(list(Path(sys.argv[1]).glob('*.pdf'))))
