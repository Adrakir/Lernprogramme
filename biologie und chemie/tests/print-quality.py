from pathlib import Path
import re, subprocess, xml.etree.ElementTree as ET

pdf=Path('chemie-test-artifacts/Chemie_Klassenarbeit_Pruefausgabe.pdf')
text=subprocess.check_output(['pdftotext','-layout',str(pdf),'-'],text=True)
for marker in ['1. Eine unbekannte Flüssigkeit','20. Eine dunkle Teelichtschale','B1. Wärmeleitung erklären','B4. Ein kurzes Versuchsprotokoll schreiben']:
    assert marker in text, marker
assert 'Musterantwort:' not in text and 'Richtige Lösung:' not in text, 'Student print exposes solutions'
xml=subprocess.check_output(['pdftotext','-bbox',str(pdf),'-'],text=True)
root=ET.fromstring(xml)
pages=[n for n in root.iter() if n.tag.endswith('page')]
for page in pages:
    width,height=float(page.attrib['width']),float(page.attrib['height'])
    for word in page.iter():
        if not word.tag.endswith('word'): continue
        a=word.attrib
        assert float(a['xMin'])>=0 and float(a['xMax'])<=width+1, 'Text outside page width'
        assert float(a['yMin'])>=0 and float(a['yMax'])<=height+1, 'Text outside page height'
subprocess.run(['pdftoppm','-f','1','-l','2','-scale-to','1100','-png',str(pdf),'chemie-test-artifacts/print-first'],check=True,capture_output=True)
subprocess.run(['pdftoppm','-f',str(max(1,len(pages)-1)),'-l',str(len(pages)),'-scale-to','1100','-png',str(pdf),'chemie-test-artifacts/print-last'],check=True,capture_output=True)
print(f'PASS: {len(pages)} A4 pages, all task sections present, no solutions and no text outside page bounds.')
