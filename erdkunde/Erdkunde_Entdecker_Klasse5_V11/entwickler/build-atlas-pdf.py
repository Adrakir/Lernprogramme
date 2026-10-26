"""Zwei farbige Druckdateien aus denselben Testdaten wie die Lernapp."""
from pathlib import Path
import json, math, base64
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
DATA=json.loads((HERE/'atlasdaten.js').read_text().split('window.AW_DATA = ',1)[1].strip().rstrip(';'))
LAND=json.loads((HERE/'world.js').read_text().split('const WORLD_LAND=',1)[1].strip().rstrip(';'))
for name,f in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+f))
W,H=A4
INK='#19384D';TEAL='#086F62';BLUE='#1766A1';PINK='#9C3475';GREY='#526B7B'
c=None
def txt(x,y,t,size=11,font='Body',color=INK):
    c.setFont(font,size);c.setFillColor(HexColor(color));c.drawString(x,H-y,t)
def para(x,y,w,t,size=11,leading=16,color=INK,font='Body'):
    p=Paragraph(t,ParagraphStyle('p',fontName=font,fontSize=size,leading=leading,textColor=HexColor(color)))
    _,h=p.wrap(w,H);p.drawOn(c,x,H-y-h);return h
def line(x,y,x2,y2,color='#9AB1BE',width=.7):
    c.setStrokeColor(HexColor(color));c.setLineWidth(width);c.line(x,H-y,x2,H-y2)
def box(x,y,w,h,fill='#EFF7F5',stroke=None):
    c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.roundRect(x,H-y-h,w,h,10,fill=1,stroke=bool(stroke))
def header(title,page,solution=False):
    c.setFillColor(HexColor(TEAL));c.rect(0,H-8,W,8,fill=1,stroke=0)
    txt(34,36,'ERDKUNDE · KLASSE 5',9,'Bold',TEAL)
    txt(34,66,title,23,'Bold')
    txt(34,87,('Musterlösungen und Lernhinweise' if solution else 'Gradnetz · Erdviertel · Polansichten · Atlasarbeit'),10,color=GREY)
    line(34,804,W-34,804)
    txt(34,823,'Eigene Lernmodelle · Küsten: Natural Earth, Public Domain',8,color=GREY)
    txt(W-98,823,f'Seite {page} / 2',8,color=GREY)
def question(index,y,width=520):
    q=DATA['exam'][index-1]
    h=para(34,y,width,f'<b>{index}. {q["question"]}</b>',11,16)
    return y+h
def map_art(x,y,w,h,bounds,point=None,point_label=None,lat_step=5,lon_step=5):
    west,east,south,north=bounds
    left=x+36;top=y+22;mw=w-48;mh=h-43
    X=lambda lo:left+(lo-west)/(east-west)*mw
    Y=lambda la:top+(north-la)/(north-south)*mh
    c.setFillColor(HexColor('#E8F3F9'));c.rect(left,H-top-mh,mw,mh,fill=1,stroke=0)
    c.saveState();clip=c.beginPath();clip.rect(left,H-top-mh,mw,mh);c.clipPath(clip,stroke=0)
    c.setFillColor(HexColor('#D0DECA'));c.setStrokeColor(HexColor('#819679'));c.setLineWidth(.4)
    for poly in LAND:
        if not any(west-5<=lo<=east+5 and south-5<=la<=north+5 for lo,la in poly):continue
        p=c.beginPath();p.moveTo(X(poly[0][0]),H-Y(poly[0][1]))
        for lo,la in poly[1:]:p.lineTo(X(lo),H-Y(la))
        p.close();c.drawPath(p,fill=1,stroke=1)
    c.restoreState()
    for i in range(math.ceil(west/lon_step),math.floor(east/lon_step)+1):
        lo=i*lon_step;xx=X(lo);line(xx,top,xx,top+mh,'#B69DB1',.5)
        label=f'{abs(lo):g}°'+(' W' if lo<0 else ' O' if lo>0 else '')
        c.setFont('Body',8);c.setFillColor(HexColor(PINK));c.drawCentredString(xx,H-top+7,label)
    for i in range(math.ceil(south/lat_step),math.floor(north/lat_step)+1):
        la=i*lat_step;yy=Y(la);line(left,yy,left+mw,yy,'#94B7CB',.5)
        label=f'{abs(la):g}°'+(' S' if la<0 else ' N' if la>0 else '')
        c.setFont('Body',8);c.setFillColor(HexColor(BLUE));c.drawRightString(left-5,H-yy-3,label)
    c.setStrokeColor(HexColor('#50758C'));c.rect(left,H-top-mh,mw,mh,fill=0,stroke=1)
    if point:
        la,lo=point;c.setFillColor(HexColor('#E8B83C'));c.setStrokeColor(HexColor(INK));c.circle(X(lo),H-Y(la),3.5,fill=1,stroke=1)
        if point_label:txt(X(lo)+7,Y(la)-5,point_label,8,'Bold')
    txt(left,y+h-4,'Vereinfachte Lernkarte, kein Ausschnitt eines Verlagsatlas',7.4,color=GREY)
def register_table(y):
    widths=[218,128,181];xs=[34,252,380,561]
    rows=[['Ortsname','Region / Land','Karte / Suchfeld'],['Frankfurt am Main','Hessen / Deutschland','Europa / C1'],['Frankfurt (Oder)','Brandenburg / Deutschland','Europa / C1']]
    for r,row in enumerate(rows):
        yy=y+r*27
        if r==0:box(34,yy,527,27,'#E6F1F3')
        for col,t in enumerate(row):txt(xs[col]+6,yy+18,t,8.5,'Bold' if r==0 else 'Body')
        line(34,yy+27,561,yy+27)
def make_test():
    global c
    path=ROOT/'Atlas_Abschlusstest_Klasse5.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Abschlusstest Gradnetz und Atlas - Klasse 5')
    header('Mein Atlas-Abschlusstest',1)
    txt(34,111,'Name:',10);line(74,113,315,113);txt(356,111,'Datum:',10);line(397,113,561,113)
    for i,y in [(1,142),(2,225),(3,314),(4,398),(5,482),(6,566)]:
        end=question(i,y);line(34,end+31,561,end+31)
    box(34,696,527,68)
    para(48,708,497,'<b>So arbeitest du:</b> Lies die Richtungsangaben genau. Du kannst ausgeschriebene Begriffe oder eindeutige Abkürzungen verwenden. Arbeite in deinem Tempo; etwa 15–20 Minuten sind ein Richtwert.',10,15)
    c.showPage();header('Karten- und Atlasaufgaben',2)
    question(7,105);map_art(34,133,527,167,DATA['maps']['europe']['bounds'])
    question(8,321);register_table(361);txt(34,464,'Vollständiger Ortsname:',10);line(184,467,561,467)
    question(9,492);p=next(p for p in DATA['cities'] if p['id']=='lissabon')
    map_art(34,541,332,137,[-15,0,35,45],(p['lat'],p['lon']),'Lissabon',lat_step=5,lon_step=5)
    txt(382,577,'Länge:',10,'Bold');line(382,608,485,608);txt(495,608,'°',11)
    txt(382,638,'O oder W:',10);line(449,640,557,640)
    question(10,704);txt(34,756,'Antwort:',10);line(92,758,207,758)
    txt(233,756,'Begründung (unbenotet):',9);line(233,781,561,781)
    c.save();return path
def make_solutions():
    global c
    path=ROOT/'Atlas_Abschlusstest_Loesungen.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Musterlösungen - Abschlusstest Gradnetz und Atlas')
    header('Lösungen zum Abschlusstest',1,True)
    for i,y in [(1,126),(2,222),(3,318),(4,414),(5,510),(6,606)]:
        q=DATA['exam'][i-1];txt(34,y,f'Aufgabe {i}',11,'Bold',TEAL);para(34,y+13,527,q['explanation'],11,17)
    para(34,745,527,'Bewertungsvorschlag: pro Aufgabe ein Punkt. Sinngleiche richtige Begriffe gelten ebenfalls. Es handelt sich um einen Lerncheck, nicht um eine vorgegebene Schulnote.',9,14,color=GREY)
    c.showPage();header('Kartenlösungen und nächste Schritte',2,True)
    txt(34,114,'7. Schnittpunkt: 50° N / 10° O',11,'Bold',TEAL);map_art(34,126,527,163,DATA['maps']['europe']['bounds'],(50,10),'Gesuchter Punkt')
    for i,y in [(8,315),(9,395),(10,475)]:
        q=DATA['exam'][i-1];txt(34,y,f'Aufgabe {i}',11,'Bold',TEAL);para(34,y+12,527,q['explanation'],10.5,16)
    txt(34,599,'Gezielt weiterüben',12,'Bold',TEAL)
    steps=[('1, 2, 10','Grundlagen: Globus und Lückentext'),('3, 4','Erdviertel: N/S und O/W kombinieren'),('5, 6','Polansichten: Ringe und Speichen vergleichen'),('7','Kartenarbeit: selbst Punkte markieren'),('8, 9','Atlasarbeit: Register und Randangaben lesen')]
    for n,(nums,advice) in enumerate(steps):txt(34,625+n*23,f'Aufgaben {nums}',9,'Bold');txt(146,625+n*23,advice,9)
    para(34,756,527,'Quellen der verwendeten Ortslagen: GeoNames (CC BY 4.0), Frankfurt am Main 2925533, Frankfurt (Oder) 2925535, Lissabon 2267057. Eigene Grafiken mit Natural-Earth-Küsten. Stand: 26.10.2026.',8,12,color=GREY)
    c.save();return path
if __name__=='__main__':
    test=make_test();solutions=make_solutions()
    encoded={'test':'data:application/pdf;base64,'+base64.b64encode(test.read_bytes()).decode(),'solutions':'data:application/pdf;base64,'+base64.b64encode(solutions.read_bytes()).decode()}
    (HERE/'atlas-druckdateien.js').write_text('/* Eingebettete Druckdateien für die Ein-Datei-App. */\nwindow.AW_PDFS = '+json.dumps(encoded)+';\n')
    print(test.name,solutions.name)
