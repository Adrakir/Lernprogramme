#!/usr/bin/env python3
"""Gezielte fachliche und grafische Korrektur der vorhandenen Musikhefte.

Benötigt PyMuPDF und reportlab sowie DejaVu Sans. Ausgangs-PDFs werden aus
dem angegebenen Git-Stand gelesen; die Illustrationen, Seitenzahlen und Links
bleiben erhalten. Aufruf aus beliebigem Verzeichnis:
  python korrigiere-hefte.py [--basis-ref COMMIT] [--quellen ORDNER]
--quellen erlaubt unveränderte Ausgangs-PDFs anstelle des Git-Standes.
"""
import argparse
import io
import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path

import fitz
from reportlab.pdfgen import canvas
from reportlab.lib.colors import toColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[3]
APP = Path(__file__).resolve().parents[1]
BASE = '2d7bbb18548e4f96e5498c47e13e568b11a31d7c'
W, H = 595.2756, 841.8898
INK = '#203342'
BLUE = '#216583'
PAPER = '#fffdf7'
YELLOW = '#fff0bd'
GREEN = '#e1efdf'
MUTED = '#60727a'
FONT = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('DV', str(FONT / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('DVB', str(FONT / 'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('DV', normal='DV', bold='DVB', italic='DV', boldItalic='DVB')
STATS = defaultdict(int)


class Drawing:
    """Alle Koordinaten vom oberen linken Seitenrand, in PDF-Punkten."""
    def __init__(self):
        self.data = io.BytesIO()
        self.c = canvas.Canvas(self.data, pagesize=(W, H), pageCompression=1)

    def line(self, x1, y1, x2, y2, color=INK, width=.7, dash=None):
        c = self.c
        c.saveState()
        c.setStrokeColor(toColor(color))
        c.setLineWidth(width)
        if dash:
            c.setDash(*dash)
        c.line(x1, H-y1, x2, H-y2)
        c.restoreState()

    def box(self, x, y, w, h, fill='white', stroke=MUTED, radius=7):
        c = self.c
        c.setFillColor(toColor(fill))
        c.setStrokeColor(toColor(stroke))
        c.setLineWidth(.7)
        c.roundRect(x, H-y-h, w, h, radius, fill=1, stroke=1)

    def text(self, x, y, txt, fs=10, bold=False, color=INK):
        c = self.c
        c.setFillColor(toColor(color))
        c.setFont('DVB' if bold else 'DV', fs)
        c.drawString(x, H-y-fs*.82, txt)

    def para(self, x, y, w, txt, fs=10.6, leading=14.4, maxh=100, color=INK):
        style = ParagraphStyle('p', fontName='DV', fontSize=fs, leading=leading,
                               textColor=toColor(color), spaceAfter=0)
        p = Paragraph(txt, style)
        _, h = p.wrap(w, maxh)
        if h > maxh + .01:
            raise ValueError(f'Text passt nicht: {txt[:85]!r}, {h} > {maxh}')
        p.drawOn(self.c, x, H-y-h)
        return h

    def heading(self, x, y, txt):
        self.text(x, y, txt, 8.6, True, BLUE)

    def staff(self, x, y, w, gap=10, bar=False):
        # Genau fünf Linien. Linie 1 liegt bei y + 4*gap.
        for i in range(5):
            self.line(x, y+i*gap, x+w, y+i*gap)
        if bar:
            self.line(x+w, y, x+w, y+4*gap, width=1)

    def head(self, x, y, hollow=False, scale=1):
        c = self.c
        c.saveState()
        c.translate(x, H-y)
        c.rotate(18)
        c.setFillColor(toColor('white' if hollow else INK))
        c.setStrokeColor(toColor(INK))
        c.setLineWidth(1.2*scale)
        c.ellipse(-6.5*scale, -3.5*scale, 6.5*scale, 3.5*scale, fill=1, stroke=1)
        c.restoreState()

    def note(self, x, y, half=False, scale=1):
        self.head(x, y, half, scale)
        self.line(x+6*scale, y-1*scale, x+6*scale, y-30*scale, width=1.4*scale)

    def halfrest(self, x, staff_y, gap=9):
        # Rechteck sitzt AUF Linie 3, nicht unter ihr.
        y = staff_y+2*gap
        self.c.setFillColor(toColor(INK))
        self.c.rect(x-7.5, H-y, 15, gap*.55, fill=1, stroke=0)

    def quarterrest(self, x, y, scale=.6):
        c = self.c
        c.saveState()
        c.translate(x, H-y)
        c.scale(scale, -scale)
        c.setFillColor(toColor(INK))
        path = c.beginPath()
        path.moveTo(2, -22)
        path.lineTo(12, -10)
        path.lineTo(3, 0)
        path.lineTo(12, 11)
        path.curveTo(-7, 5, -2, 17, 4, 23)
        path.curveTo(-12, 15, -5, 6, 3, 7)
        path.lineTo(-6, -5)
        path.lineTo(4, -14)
        path.close()
        c.drawPath(path, fill=1, stroke=0)
        c.restoreState()

    def sign(self, x, y, n, gap=9):
        self.text(x, y+gap-7.5, str(n), 16, True)
        self.text(x, y+3*gap-7.5, '4', 16, True)

    def answer(self, y, x=50, end=545):
        self.text(x, y-6, 'Antwort:', 7.4, color=MUTED)
        self.line(x+50, y+1, end, y+1, color=MUTED, width=.6, dash=(1.5, 2.5))

    def rhythm_qqr(self, x, y, w, signature=True, numbers=False):
        self.staff(x, y, w, 9, bar=signature)
        if signature:
            self.sign(x+10, y, 4)
        start = x+(44 if signature else 25)
        unit = (w-(58 if signature else 45))/4
        self.note(start, y+27)
        self.note(start+unit, y+27)
        self.halfrest(start+2*unit, y)
        if numbers:
            for i in range(4):
                self.text(start+i*unit-2, y+44, str(i+1), 9, True, BLUE)
        return start, unit

    def time_qqr(self, x, y, w):
        self.c.setFillColor(toColor('#d8e9ef'))
        self.c.rect(x, H-y-20, w/2, 20, fill=1, stroke=0)
        self.c.setFillColor(toColor('#ececec'))
        self.c.rect(x+w/2, H-y-20, w/2, 20, fill=1, stroke=0)
        for i in range(5):
            self.line(x+i*w/4, y, x+i*w/4, y+20, MUTED, .5)
        for i in range(4):
            self.text(x+i*w/4+3, y-16, str(i+1), 9, True, BLUE)
        for i in range(2):
            self.c.setFillColor(toColor(INK))
            self.c.circle(x+i*w/4+5, H-y-10, 2.3, fill=1, stroke=0)
        self.text(x+20, y+6, 'Klang', 8)
        self.text(x+w/4+20, y+6, 'Klang', 8)
        self.text(x+w*.68, y+6, 'still', 8)

    def bytes(self):
        self.c.showPage()
        self.c.save()
        return self.data.getvalue()


def patch(page, rect, draw, fill=PAPER):
    """Originale Inhalte entfernen; nicht nur unsichtbar überdecken."""
    page.add_redact_annot(fitz.Rect(rect), fill=tuple(toColor(fill).rgb()))
    page.apply_redactions(images=0, graphics=1, text=0)
    p = Drawing()
    draw(p)
    overlay = fitz.open(stream=p.bytes(), filetype='pdf')
    page.show_pdf_page(page.rect, overlay, 0)
    STATS['ersetzte_bereiche'] += 1


def replace_paragraph(page, rect, text, fs=10.6, leading=14.4, fill=PAPER):
    x, y, right, bottom = rect
    patch(page, rect, lambda p: p.para(x, y, right-x, text, fs, leading, bottom-y), fill)


LINE = re.compile(r'n (-?[\d.]+) (-?[\d.]+) m (-?[\d.]+) (-?[\d.]+) l S')


def improve_rules(doc, work=False):
    for page in doc:
        raw = page.read_contents().decode('latin1')
        paths = []
        for m in LINE.finditer(raw):
            x1, y1, x2, y2 = map(float, m.groups())
            if abs(y1-y2)<.01 and x2-x1>60:
                paths.append((m.group(0), x1, y1, x2))
        groups = defaultdict(list)
        for original, x, y, right in paths:
            groups[(x, right)].append((y, original))
        for (x, right), values in groups.items():
            values.sort()
            for i in range(len(values)-4):
                five = values[i:i+5]
                gap = five[1][0]-five[0][0]
                if 5 <= gap <= 15 and all(abs(five[j+1][0]-five[j][0]-gap)<.01 for j in range(4)):
                    for _, original in five:
                        improved = 'q .16 .23 .28 RG .7 w '+original+' Q'
                        raw = raw.replace(original+'\n', improved+'\n')
                    STATS['notensysteme_mit_kontrast'] += 1
        answer_positions = []
        if work:
            for original, x, y, right in paths:
                if abs(x-50)<.01 and abs(right-545.2756)<.01:
                    # Antwortlinien sind sichtbar getrennt, beschriftet und gestrichelt.
                    raw = raw.replace(original+'\n',
                        f'q [1.5 2.5] 0 d n 100 {y-5:g} m {right:g} {y-5:g} l S Q\n')
                    answer_positions.append(H-y)
                    STATS['getrennte_antwortlinien'] += 1
        xref = doc.get_new_xref()
        doc.update_object(xref, '<<>>')
        doc.update_stream(xref, raw.encode('latin1'))
        page.set_contents(xref)
        if answer_positions:
            d = Drawing()
            for y in answer_positions:
                d.text(50, y-1, 'Antwort:', 7.2, color=MUTED)
            overlay = fitz.open(stream=d.bytes(), filetype='pdf')
            page.show_pdf_page(page.rect, overlay, 0)


def learn_lines(p):
    p.para(34, 294, 527, 'Notenköpfe stehen <b>auf Linien oder in Zwischenräumen</b>. '
           'Beide werden von unten nach oben gezählt. Eine Linie geht durch die Mitte eines '
           'Kopfes; im Zwischenraum liegt seine Mitte genau zwischen zwei Linien. '
           '<b>Hilfslinien</b> setzen die gleichen Abstände oberhalb oder unterhalb fort. '
           'Die Notennamen ergeben sich erst zusammen mit einem Notenschlüssel.', maxh=75)
    p.box(34, 384, 527, 246)
    p.heading(46, 396, 'FÜNF LINIEN - VIER ZWISCHENRÄUME')
    top, gap = 430, 14
    p.staff(145, top, 285, gap)
    for i in range(5):
        p.text(55, top+i*gap-4, f'{5-i}. Linie', 9, True, BLUE)
    for i in range(4):
        p.text(443, top+i*gap+gap/2-3, f'{4-i}. Zwischenraum', 7.5, color=BLUE)
    p.head(220, top+3*gap)
    p.head(330, top+2.5*gap)
    p.text(167, 508, 'Kopf auf Linie 2', 9)
    p.text(294, 522, 'Kopf im Zwischenraum 2', 8.5)
    p.line(215, 502, 220, 477, BLUE, .6)
    p.line(339, 516, 330, 470, BLUE, .6)
    # Beide Hilfslinien stehen im unmittelbaren räumlichen Bezug zum System.
    p.text(55, 544, 'Unter dem System', 8.5, True, BLUE)
    p.staff(189, 555, 84, 7)
    p.line(218, 590, 244, 590, width=1)
    p.head(231, 590)
    p.text(55, 603, '1. Hilfslinie: eine Linienhöhe unter Linie 1.', 7.6)
    p.text(323, 544, 'Über dem System', 8.5, True, BLUE)
    p.staff(443, 562, 84, 7)
    p.line(472, 555, 498, 555, width=1)
    p.head(485, 555)
    p.text(323, 603, '1. Hilfslinie: eine Linienhöhe über Linie 5.', 7.6)
    p.heading(34, 644, 'SO LIEST DU DAS BILD')
    for y, n, txt in [
        (664, '1', '<b>Von unten:</b> Linie 1, Zwischenraum 1, Linie 2, Zwischenraum 2 usw. '
         'Zwischen den fünf Linien liegen vier innere Zwischenräume.'),
        (699, '2', 'Der linke Kopf liegt auf <b>Linie 2</b>. Der rechte Kopf liegt im '
         '<b>Zwischenraum 2</b>, also zwischen Linie 2 und Linie 3.'),
        (734, '3', 'Eine Hilfslinie ist <b>kurz</b> und steht nur bei der betreffenden Note. '
         'Sie ist keine sechste durchgehende Notenlinie.')]:
        p.text(36, y, n, 10, True, BLUE)
        p.para(54, y-1, 500, txt, 10.1, 13.5, 29)
    p.box(34, 774, 527, 27, GREEN)
    p.para(46, 781, 505, '<b>Merke:</b> Lage = Tonhöhe mit Schlüssel. Form = Notenwert.', 9.6, 13, 15)


def learn_halfrest(p):
    p.para(34, 294, 527, 'Die <b>halbe Pause dauert zwei Viertelschläge</b>. Ihr schwarzes '
           'Rechteck sitzt auf der <b>dritten Notenlinie</b>. Die ganze Pause hängt dagegen '
           'unter Linie 4. Im 4/4-Takt schreiben wir eine halbe Pause hier über 1 und 2 oder '
           'über 3 und 4. So bleibt die Gliederung des Takts gut lesbar.', maxh=75)
    p.box(34, 400, 527, 161)
    p.heading(46, 412, 'ZWEI VIERTELNOTEN - DANN ZWEI SCHLÄGE STILLE')
    p.rhythm_qqr(49, 440, 497, True)
    p.time_qqr(96, 518, 435)
    p.heading(34, 576, 'DAS BEISPIEL SCHRITT FÜR SCHRITT')
    for y, n, txt in [
        (598, '1', 'Auf <b>1 und 2</b> spielt Fuji je eine Viertelnote. Es gibt zwei Tonanfänge. '
         'Mit Beginn von Schlag 3 endet der zweite Ton.'),
        (634, '2', 'Die halbe Pause beginnt auf <b>3</b> und füllt auch Schlag <b>4</b>. '
         'Beide Schläge bleiben still. Der nächste Einsatz wäre auf 1 im nächsten Takt.'),
        (670, '3', 'Die Rechnung lautet <b>1 + 1 + 2 = 4</b>. Bei Stille auf 2 und 3 '
         'schreiben wir stattdessen zwei Viertelpausen: Die Taktmitte bleibt sichtbar.')]:
        p.text(36, y, n, 10, True, BLUE)
        p.para(57, y-1, 496, txt, 10.4, 14.3, 31)
    p.box(34, 741, 527, 58, GREEN)
    p.heading(46, 751, 'MERKSATZ')
    p.para(46, 770, 503, 'Halbe Pause: sitzt auf Linie 3, dauert zwei Viertelschläge.', 10.3, 14, 18)


def work_lines_model(p):
    p.box(34, 290, 527, 186)
    p.heading(46, 301, 'LINIEN VON UNTEN ZÄHLEN - DANACH DIE TAKTANGABE LESEN')
    p.staff(140, 329, 278, 10)
    for i in range(5):
        p.text(54, 325+i*10, f'{5-i}. Linie', 8, True, BLUE)
    for i in range(4):
        p.text(434, 330+i*10, f'{4-i}. Zwischenraum', 7.8, color=BLUE)
    p.head(221, 359)
    p.head(330, 354)
    p.text(180, 378, 'auf Linie 2', 8.3)
    p.text(293, 378, 'im Zwischenraum 2', 8.3)
    p.staff(55, 410, 245, 8, True)
    p.sign(63, 410, 3, 8)
    p.note(115, 434, True)
    p.note(233, 434)
    for x, n in [(111, '1'), (170, '2'), (229, '3')]:
        p.text(x, 452, n, 9, True, BLUE)
    p.para(324, 406, 217, '<b>3 über 4:</b> drei Viertelschläge.<br/>'
           'Halbe auf 1, über 2 halten.<br/>Viertel auf 3. <b>2 + 1 = 3.</b>', 9.5, 14, 58)


def work_lines_tasks(p):
    p.box(34, 156, 527, 162)
    p.heading(47, 168, 'G  GEMEINSAM - GENAU AUF DAS BILD SCHAUEN')
    p.para(47, 190, 500, 'Zähle von unten: __ Linien und __ innere Zwischenräume. '
           'Kopf A liegt auf Linie __. Kopf B liegt im Zwischenraum __.', 10.7, 15, 34)
    p.staff(111, 252, 393, 10)
    p.head(232, 282)
    p.head(389, 257)
    p.text(228, 301, 'A', 9, True, BLUE)
    p.text(385, 301, 'B', 9, True, BLUE)


def work_lines_solution(p):
    p.box(34, 577, 527, 193)
    p.text(47, 588, 'Notenlinien und Taktangabe lesen', 11, True, BLUE)
    p.text(47, 610, 'Aufgaben S. 34 / Beispiel S. 33', 8.5, color=MUTED)
    p.para(47, 630, 496, '<b>G:</b> Fünf Linien, vier innere Zwischenräume. '
           '<b>A: Linie 2. B: Zwischenraum 4</b>, zwischen Linie 4 und 5.', 10, 13.5, 30)
    p.staff(61, 671, 194, 7)
    for i in range(5):
        p.text(48, 668+i*7, str(5-i), 6.5, True, BLUE)
    p.head(126, 692, scale=.8)
    p.head(206, 674.5, scale=.8)
    p.text(122, 708, 'A', 8, True, BLUE)
    p.text(202, 708, 'B', 8, True, BLUE)
    p.para(281, 671, 263, '<b>A:</b> Vier Viertelschläge. Zwei halbe Noten '
           'füllen den Takt: 2 + 2 = 4. Es müssen nicht vier Köpfe sein.', 9.4, 13, 43)
    p.para(47, 731, 496, '<b>B:</b> Taktangabe links: 3 über 4. Taktstrich rechts. '
           'Liniennummern von unten: 1, 2, 3, 4, 5.', 9.7, 13.5, 30)


def work_half_model(p):
    p.box(34, 290, 527, 186)
    p.heading(46, 301, 'HALBE SITZT - GANZE HÄNGT - DEN TAKT MITLESEN')
    p.staff(61, 329, 132, 8)
    p.halfrest(127, 329, 8)
    p.text(66, 370, 'Halbe: 2 Schläge', 8.6, True, BLUE)
    p.staff(230, 329, 132, 8)
    p.c.setFillColor(toColor(INK))
    p.c.rect(289, H-(329+8)-4.4, 15, 4.4, fill=1, stroke=0)
    p.text(231, 370, 'Ganze: fester Wert 4', 8.2, True, BLUE)
    p.staff(399, 329, 138, 8, True)
    p.sign(404, 329, 3, 8)
    p.c.setFillColor(toColor(INK))
    p.c.rect(474, H-(329+8)-4.4, 15, 4.4, fill=1, stroke=0)
    p.text(399, 370, 'Ganztaktpause: hier 3', 8.2, True, BLUE)
    p.rhythm_qqr(50, 411, 224, False, numbers=True)
    p.time_qqr(302, 438, 239)


def update_work_pauses(doc):
    # Keine halbe Pause quer über die Mitte des 4/4-Takts.
    def pulse_exercise(d):
        d.staff(51, 256.8898, 493.2756, 9)
        d.note(65, 283.8898)
        d.quarterrest(181.069, 274.8898)
        d.quarterrest(297.138, 274.8898)
        d.note(413.207, 283.8898)
    patch(doc[3], (50, 230, 546, 299), pulse_exercise, 'white')
    for number, top in [(23, 570.8898), (27, 256.8898), (32, 284.8898)]:
        p = doc[number-1]
        patch(p, (50, top-25, 546, top+40),
              lambda d, top=top: d.rhythm_qqr(51, top, 493.2756, False), 'white')
    replace_paragraph(doc[26], (47, 188, 544, 225),
        'Im Beispiel ist es auf __ und __ still. Zwei Viertelnoten und eine halbe Pause '
        'dauern insgesamt __ Schläge.', 11, 15, 'white')
    patch(doc[25], (33, 289, 562, 477), work_half_model)
    replace_paragraph(doc[25], (61, 497, 554, 544),
        'Die halbe Pause sitzt auf Linie 3. Sie dauert zwei Schläge. Im Beispiel klingen '
        'Viertelnoten auf <b>1 und 2</b>; die halbe Pause hält <b>3 und 4</b> frei. '
        'Stille auf 2 und 3 schreiben wir mit zwei Viertelpausen.', 10.8, 15)
    replace_paragraph(doc[31], (46, 628, 546, 657),
        '1. Zweiter Ton auf <b>2</b>; Stille auf <b>3 und 4</b>. Die halbe Pause dauert '
        'zwei Schläge. Bei Unsicherheit: S. 26.', 10, 13.5, GREEN)
    # Die beiden zur veränderten Klangfolge gehörenden Lösungen.
    p = doc[63]
    blocks = p.get_text('blocks')
    for b in blocks:
        txt = b[4].strip()
        if txt.startswith('B: Auf 2 und 3 ist Stille'):
            replace_paragraph(p, (47, b[1]-.4, 548, b[3]+4),
                'B: Auf 3 und 4 ist Stille, weil die halbe Pause zwei Schläge dauert. '
                'Der zweite Ton beginnt auf 2.', 10.3, 14, 'white')
        elif txt.startswith('G: Auf 2 und 3 still'):
            replace_paragraph(p, (47, b[1]-.4, 548, b[3]+4),
                'G: Auf 3 und 4 still; 1 + 1 + 2 = 4 Schläge. '
                'Die Töne beginnen auf 1 und 2.', 10.3, 14, 'white')


def add_revision(doc):
    for p in doc:
        d = Drawing()
        d.text(359, 820, 'Korrigiert: 27.10.2026', 6.6, color=MUTED)
        overlay = fitz.open(stream=d.bytes(), filetype='pdf')
        p.show_pdf_page(p.rect, overlay, 0)


def read_original(name, args):
    if args.quellen:
        return (args.quellen / name).read_bytes()
    path = (APP / 'documents' / name).relative_to(ROOT).as_posix()
    return subprocess.check_output(['git', '-C', str(ROOT), 'show', f'{args.basis_ref}:{path}'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--basis-ref', default=BASE)
    parser.add_argument('--quellen', type=Path)
    args = parser.parse_args()
    learn = fitz.open(stream=read_original('lernheft-musik.pdf', args), filetype='pdf')
    work = fitz.open(stream=read_original('arbeitsheft-musik.pdf', args), filetype='pdf')
    improve_rules(learn)
    improve_rules(work, True)
    patch(learn[5], (33, 289, 562, 802), learn_lines)
    patch(learn[16], (33, 289, 562, 802), learn_halfrest)
    patch(work[32], (33, 289, 562, 477), work_lines_model)
    replace_paragraph(work[32], (262, 244, 549, 276),
        'Wir untersuchen zuerst die Lage der Köpfe. Darunter lesen wir die Dauer im Takt.',
        10.5, 14.2, GREEN)
    patch(work[33], (33, 155, 562, 319), work_lines_tasks)
    replace_paragraph(work[33], (47, 517, 544, 551),
        'Markiere die Taktangabe und den rechten Taktstrich. Schreibe links neben die '
        'fünf Linien ihre Nummern: Beginne unten.', 10.7, 15, 'white')
    patch(work[64], (33, 576, 562, 771), work_lines_solution)
    work[64].insert_link({'kind': fitz.LINK_GOTO,
                         'from': fitz.Rect(34, 584.8898, 561.2756, 621.8898),
                         'page': 33})
    update_work_pauses(work)
    # Singular und Bruchteile in der Wertetafel korrekt benennen.
    p = work[19]
    for old, new in [('1 Schläge', '1 Schlag'), ('½ Schläge', '½ Schlag'), ('¼ Schläge', '¼ Schlag')]:
        for r in p.search_for(old):
            patch(p, (r.x0-.5, r.y0-.3, r.x1+1, r.y1+1),
                  lambda d, r=r, new=new: d.text(r.x0, r.y0+.4, new, 9, True, BLUE), 'white')
    for doc, name in [(learn, 'lernheft-musik.pdf'), (work, 'arbeitsheft-musik.pdf')]:
        add_revision(doc)
        meta = doc.metadata
        meta.update({'modDate': "D:20261027220000+00'00'", 'subject':
            'Fachlich und didaktisch korrigiert am 27.10.2026: Notenlinien, Hilfslinien, '
            'Antwortflächen und Pausengruppierung; Seitenzählung beibehalten.'})
        doc.set_metadata(meta)
        dest = APP / 'documents' / name
        tmp = dest.with_suffix('.new.pdf')
        doc.save(tmp, garbage=4, deflate=True)
        tmp.replace(dest)
        print(f'{name}: {len(doc)} Seiten')
    print(json.dumps(dict(STATS), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
