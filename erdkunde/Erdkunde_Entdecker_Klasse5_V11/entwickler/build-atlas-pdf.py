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
def header(title,page,solution=False,total=6):
    c.setFillColor(HexColor(TEAL));c.rect(0,H-8,W,8,fill=1,stroke=0)
    txt(34,36,'ERDKUNDE · KLASSE 5',9,'Bold',TEAL)
    txt(34,66,title,23,'Bold')
    txt(34,87,('Musterlösungen und Lernhinweise' if solution else 'Gradnetz · Erdviertel · Polansichten · Atlasarbeit'),10,color=GREY)
    line(34,804,W-34,804)
    txt(34,823,'Eigene Lernmodelle · Küsten: Natural Earth, Public Domain',8,color=GREY)
    txt(W-98,823,f'Seite {page} / {total}',8,color=GREY)
def question(index,y,width=520):
    q=DATA['exam'][index-1]
    h=para(34,y,width,f'<b>{index}. {q["question"]}</b>',11,16)
    return y+h
def map_art(x,y,w,h,bounds,point=None,point_label=None,lat_step=5,lon_step=5,fields=False,tolerance=False):
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
    if fields:
        for i in range(5):
            xx=left+i*mw/4;yy=top+i*mh/4
            line(xx,top,xx,top+mh,'#425A68',.9);line(left,yy,left+mw,yy,'#425A68',.9)
            if i<4:
                txt(xx+mw/8-3,top+mh+12,chr(65+i),8,'Bold')
                txt(left+mw+5,yy+mh/8+3,str(i+1),8,'Bold')
    if point:
        la,lo=point;
        if tolerance:
            c.setFillColor(HexColor('#D6EDDE'));c.setStrokeColor(HexColor('#6A997D'));c.rect(X(lo-1),H-Y(la-1),X(lo+1)-X(lo-1),Y(la-1)-Y(la+1),fill=1,stroke=1)
        c.setFillColor(HexColor('#E8B83C'));c.setStrokeColor(HexColor(INK));c.circle(X(lo),H-Y(la),3.5,fill=1,stroke=1)
        if point_label:txt(X(lo)+7,Y(la)-5,point_label,8,'Bold')
    if not fields:txt(left,y+h-4,'Vereinfachte Lernkarte · Natural Earth, Public Domain',7,color=GREY)
def field(x,y,w,label):
    para(x,y,w,label,9.4,13)
    line(x,y+31,x+w,y+31)
def qhead(number,x,y,width=527):
    q=DATA['exam'][number-1]
    para(x,y,width-42,f'<b>{number}. {q["title"]}</b>',11.3,15)
    txt(x+width-35,y+11,'2 P.',9,'Bold',TEAL)
    instruction=q['question'].split(' Du kannst')[0]+' Setze ein kleines Kreuz.' if q['kind']=='map' else q['question']
    return y+21+para(x,y+21,width,instruction,10,14)
def model(x,y,size,kind,label):
    cx=x+size/2;cy=y+size/2;r=size*.39
    c.setFillColor(HexColor('#F3F7FA'));c.setStrokeColor(HexColor('#445E70'));c.setLineWidth(.8);c.circle(cx,H-cy,r,fill=1,stroke=1)
    if kind=='parallel-pole':
        for scale in [.866,.5,.2]:c.circle(cx,H-cy,r*scale,fill=0,stroke=1)
    elif kind=='meridian-pole':
        for a in range(0,360,45):line(cx,cy,cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a)),'#445E70',.8)
    elif kind=='parallel-side':
        for lat in [-60,-30,0,30,60]:
            dy=r*math.sin(math.radians(lat));span=r*math.cos(math.radians(lat));line(cx-span,cy-dy,cx+span,cy-dy,'#445E70',.8)
    else:
        for lon in [-60,-30,0,30,60]:
            p=c.beginPath()
            for i in range(91):
                a=math.radians(-90+2*i);xx=cx+r*math.cos(a)*math.sin(math.radians(lon));yy=cy-r*math.sin(a)
                if i==0:p.moveTo(xx,H-yy)
                else:p.lineTo(xx,H-yy)
            c.setStrokeColor(HexColor('#445E70'));c.drawPath(p,fill=0,stroke=1)
    txt(x+size/2-20,y-3,label,9,'Bold')
def grid_field(p,key):
    w,e,so,n=DATA['maps'][key]['bounds']
    return chr(65+min(3,int((p['lon']-w)/(e-w)*4)))+str(min(3,int((n-p['lat'])/(n-so)*4))+1)
def register_table(y):
    xs=[34,188,344,508];row_h=28
    rows=[['Ort','Land / Region','Karte','Feld']]
    for id in ['frankfurt-main','frankfurt-oder','berlin','lissabon']:
        p=next(p for p in DATA['cities'] if p['id']==id);key='germany' if p['country']=='Deutschland' else 'europe'
        rows.append([p['name'],p['country']+' / '+p['region'],DATA['maps'][key]['code']+' · '+('Deutschland' if key=='germany' else 'Europa'),grid_field(p,key)])
    for i,row in enumerate(rows):
        if i==0:box(34,y+i*row_h,527,row_h,'#E5F1F3')
        for col,t in enumerate(row):txt(xs[col]+5,y+i*row_h+18,t,8.2,'Bold' if i==0 else 'Body')
        line(34,y+(i+1)*row_h,561,y+(i+1)*row_h)
def empty_circle(cx,cy,r):
    c.setStrokeColor(HexColor(INK));c.setLineWidth(1);c.circle(cx,H-cy,r,fill=0,stroke=1)
def sketch_test_pages():
    c.showPage();header('Teil B: Deine Skizzen',4,total=6)
    para(34,105,527,'<b>Zeichnen und Beschriften.</b> Dieser Teil wird mit der Lehrkraft oder der Musterlösung geprüft. Er ist nicht in den 20 automatisch bewerteten Punkten von Teil A enthalten.',10,15)
    txt(34,168,'11. Gradnetz und Halbkugeln',12,'Bold',TEAL)
    para(34,182,527,'Zeichne den Äquator und den Nullmeridian ein. Ergänze je zwei weitere Breitenkreise und Meridiane. Nutze zwei Farben. Beschrifte Nordpol und Südpol.',10,15)
    empty_circle(297,362,117)
    para(34,514,527,'Kennzeichne links die Nord- und Südhalbkugel, rechts die West- und Osthalbkugel. Beschrifte die Trennlinien. Die Modelle sind nach Norden ausgerichtet.',10,15)
    empty_circle(166,665,92);empty_circle(429,665,92)
    c.showPage();header('Erdviertel und vier Ansichten',5,total=6)
    txt(34,110,'12. Trage die vier Erdviertel ein.',12,'Bold',TEAL)
    para(34,124,527,'Schreibe die vollständigen Namen in die Felder. Norden ist oben.',10,15)
    line(297,168,297,326,INK,1);line(77,246,517,246,INK,1)
    txt(304,163,'Nullmeridian',8);txt(458,239,'Äquator',8)
    txt(34,366,'13. Zeichne die Linien in die vier Felder.',12,'Bold',TEAL)
    para(34,380,527,'Zeichne nur die genannte Linienart. Die äußeren Kreise sind der Rand der Erdkugel.',10,15)
    for x,t in [(166,'Blick vom Äquator'),(429,'Blick auf Nord- oder Südpol')]:
        c.setFont('Bold',9);c.setFillColor(HexColor(INK));c.drawCentredString(x,H-425,t)
    for x in [166,429]:
        empty_circle(x,509,61);empty_circle(x,703,61)
    txt(35,445,'Breitenkreise',9,'Bold',BLUE);txt(35,639,'Meridiane',9,'Bold',PINK)
    line(34,606,561,606);line(297,413,297,782)
    c.showPage();header('Breitenwinkel und Merksätze',6,total=6)
    txt(34,111,'14. Vom Äquator zum Nordpol',12,'Bold',TEAL)
    para(34,127,527,'Die Skizze zeigt einen Schnitt durch die Nordhalbkugel. Zeichne vom Erdmittelpunkt je einen Radius zum Äquator und zum Nordpol. Beschrifte 0° und 90° N. Zeichne einen weiteren Radius bei ungefähr 45° N ein und markiere den Breitenwinkel am Erdmittelpunkt.',10,15)
    p=c.beginPath();p.moveTo(132,H-365)
    for i in range(181):
        a=math.radians(180-i);p.lineTo(297+165*math.cos(a),H-(365-165*math.sin(a)))
    p.close();c.setStrokeColor(HexColor(INK));c.drawPath(p,fill=0,stroke=1)
    c.setFillColor(HexColor(INK));c.circle(297,H-365,2,fill=1,stroke=0);txt(250,390,'Erdmittelpunkt',9)
    txt(34,447,'15. Ergänze deinen Lückentext.',12,'Bold',TEAL)
    para(34,472,527,'Die Breitenkreise verlaufen',11,16);line(213,488,401,488)
    txt(34,528,'zum',11);line(69,531,340,531);txt(346,528,'.',11)
    txt(34,583,'Die Meridiane verlaufen vom',11);line(215,586,506,586)
    txt(34,633,'zum',11);line(69,636,340,636);txt(346,633,'.',11)
    txt(34,688,'Der größte Breitenkreis ist der',11);line(225,691,535,691);txt(541,688,'.',11)
    para(34,739,527,'Fachwort: Ein Meridian ist ein Längenhalbkreis. Zwei gegenüberliegende Meridiane bilden einen ganzen Längenkreis.',9,14,color=GREY)
def sketch_solution_pages():
    c.showPage();header('Lösungen zu deinen Skizzen',3,True,total=4)
    txt(34,112,'11. Gradnetz und Halbkugeln',12,'Bold',TEAL)
    para(34,129,527,'Nordpol oben, Südpol unten. Der Äquator teilt Nord- und Südhalbkugel. Nullmeridian und 180°-Meridian begrenzen Ost- und Westhalbkugel. Breitenkreise sind parallel zum Äquator; Meridiane führen von Pol zu Pol.',10,15)
    model(65,208,180,'parallel-side','Nord / Süd');model(338,208,180,'meridian-side','West / Ost')
    txt(139,221,'Nordpol',8,'Bold');txt(139,379,'Südpol',8,'Bold')
    txt(129,275,'Nordhalbkugel',7.5,color=BLUE);txt(129,327,'Südhalbkugel',7.5,color=BLUE)
    txt(214,301,'Äquator 0°',8,color=BLUE)
    txt(360,303,'West',8,color=PINK);txt(452,303,'Ost',8,color=PINK)
    txt(386,221,'Nullmeridian 0°',8,color=PINK)
    line(155,229,155,368,PINK,1);line(428,229,428,368,PINK,1)
    line(85,298,225,298,BLUE,1.3)
    txt(34,410,'12. Vier Erdviertel (Norden oben)',12,'Bold',TEAL)
    line(297,444,297,586,INK,1);line(65,515,530,515,INK,1)
    for x,y,t in [(80,481,'Nordwestviertel'),(327,481,'Nordostviertel'),(80,558,'Südwestviertel'),(327,558,'Südostviertel')]:txt(x,y,t,11)
    txt(34,630,'So wird der Zeichenteil geprüft',12,'Bold',TEAL)
    para(34,649,527,'Kontrolliere die Lage der Linien und Beschriftungen. Beim Äquator müssen Nord und Süd, beim Nullmeridian West und Ost auf der richtigen Seite stehen. Die geometrische Form zählt mehr als künstlerische Genauigkeit. Zeichnungen werden nicht automatisch benotet.',10,15)
    c.showPage();header('Vier Felder und Breitenwinkel',4,True,total=4)
    txt(34,110,'13. Die vier Felder',12,'Bold',TEAL)
    for x,t in [(166,'Blick vom Äquator'),(429,'Blick auf einen Pol')]:
        c.setFont('Bold',9);c.setFillColor(HexColor(INK));c.drawCentredString(x,H-140,t)
    model(96,155,140,'parallel-side','Linien');model(359,155,140,'parallel-pole','Ringe')
    model(96,320,140,'meridian-side','Bögen');model(359,320,140,'meridian-pole','Speichen')
    txt(34,178,'Breite',9,'Bold',BLUE);txt(34,343,'Länge',9,'Bold',PINK)
    txt(34,492,'14. Breitenwinkel',12,'Bold',TEAL)
    cx,cy,r=159,637,102
    empty_circle(cx,cy,r)
    line(cx,cy,cx+r,cy,BLUE,1.4);line(cx,cy,cx,cy-r,BLUE,1.4);line(cx,cy,cx+r*.707,cy-r*.707,PINK,1.4)
    for i in range(46):
        a=math.radians(i);b=math.radians(i+1);line(cx+33*math.cos(a),cy-33*math.sin(a),cx+33*math.cos(b),cy-33*math.sin(b),PINK,1)
    txt(cx+r+5,cy+3,'0°',9);txt(cx-12,cy-r-9,'90° N',9);txt(cx+57,cy-79,'45° N',9)
    para(312,514,249,'Der Winkel liegt am Erdmittelpunkt. Er wird von der Äquatorebene zum gesuchten Breitenkreis gemessen. 0° liegt am Äquator, 90° N am Nordpol; 45° N liegt dazwischen.',9.7,15)
    txt(312,634,'15. Merksätze',11,'Bold',TEAL)
    para(312,648,249,'<b>parallel</b> · <b>Äquator</b> · <b>Nordpol</b> · <b>Südpol</b> · <b>Äquator</b><br/>Breitenkreise: parallel zum Äquator. Meridiane: von Pol zu Pol. Der Äquator ist der größte Breitenkreis.',9.5,15)

def make_test():
    global c
    path=ROOT/'Atlas_Abschlusstest_Klasse5.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Atlas-Abschlusstest Klasse 5 - verbesserte Fassung, 20 Punkte')
    header('Mein Atlas-Abschlusstest',1)
    txt(34,108,'Name:',9);line(72,110,323,110);txt(357,108,'Datum:',9);line(401,110,561,110)
    txt(34,130,'Teil A: 20 Punkte · Teil B: Zeichnen ab Seite 4 · Teil A: 20–25 Minuten',9,'Bold',TEAL)
    qhead(1,34,151);field(34,205,527,DATA['exam'][0]['fields'][0]['label']);field(34,249,527,DATA['exam'][0]['fields'][1]['label'])
    qhead(2,34,309);field(34,360,245,DATA['exam'][1]['fields'][0]['label']);field(309,360,252,DATA['exam'][1]['fields'][1]['label'])
    qhead(3,34,424);field(34,475,245,DATA['exam'][2]['fields'][0]['label']);field(309,475,252,DATA['exam'][2]['fields'][1]['label'])
    qhead(4,34,539);field(34,590,245,DATA['exam'][3]['fields'][0]['label']);field(309,590,252,DATA['exam'][3]['fields'][1]['label'])
    box(34,657,527,52)
    para(46,668,502,'<b>Hinweis:</b> Bei den Erdvierteln darfst du NO, NW, SO oder SW schreiben. Pro passender Teilantwort gibt es einen Punkt. Arbeite in deinem Tempo.',9.3,14)
    para(34,729,527,'<b>Zusatz ohne Punkte:</b> Warum bestimmt ein Breitengrad allein normalerweise noch keinen eindeutigen Ort?',9.7,14)
    line(34,779,561,779)
    c.showPage();header('Ansichten und Kartenarbeit',2)
    qhead(5,34,105,247);qhead(6,314,105,247)
    model(42,180,104,'parallel-pole','Modell A');model(163,180,104,'meridian-pole','Modell B')
    model(322,180,104,'parallel-side','Modell A');model(443,180,104,'meridian-side','Modell B')
    field(34,296,247,'A: Breitenkreise oder Meridiane?');field(34,339,247,'B: Breitenkreise oder Meridiane?')
    field(314,296,247,'A: Breitenkreise oder Meridiane?');field(314,339,247,'B: Breitenkreise oder Meridiane?')
    qhead(7,34,393)
    map_art(34,449,527,143,DATA['maps']['germany']['bounds'],lat_step=2,lon_step=2)
    txt(70,608,'Bewertung: Breite und Länge je 1 Punkt, Ablesetoleranz je 1°.',8.5,color=GREY)
    qhead(8,34,636)
    map_art(34,690,280,105,[-80,-40,-40,0],(-20,-60),'P',lat_step=10,lon_step=10)
    field(337,696,105,'Breite: Gradzahl (0,5 P.)');field(456,696,105,'N oder S (0,5 P.)');field(337,753,105,'Länge: Gradzahl (0,5 P.)');field(456,753,105,'O oder W (0,5 P.)')
    c.showPage();header('Im Atlas sicher suchen',3)
    qhead(9,34,105);register_table(173)
    txt(34,337,'Modellkarte D · Deutschland und Nachbarn',9,'Bold')
    map_art(34,350,310,159,DATA['maps']['germany']['bounds'],lat_step=2,lon_step=2,fields=True)
    field(369,351,192,'Vollständiger Ortsname (0,5 P.)');field(369,407,192,'Karte: Kennzeichen / Name (0,5 P.)');field(369,463,192,'Suchfeld (1 P.)')
    qhead(10,34,549)
    p=next(p for p in DATA['cities'] if p['id']=='lissabon')
    map_art(34,625,310,155,DATA['maps']['iberia']['bounds'],(p['lat'],p['lon']),'Lissabon')
    field(369,639,192,'Länge: Gradzahl (1 P.)');field(369,703,192,'Länge: O oder W (1 P.)')
    sketch_test_pages()
    c.save();return path
def solution_line(number,y):
    q=DATA['exam'][number-1];txt(34,y,f'{number}. {q["title"]} · 2 Punkte',10.8,'Bold',TEAL);para(34,y+12,527,q['explanation'],10,15)
def make_solutions():
    global c
    path=ROOT/'Atlas_Abschlusstest_Loesungen.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Musterlösungen und Teilpunkte - Atlas-Abschlusstest Klasse 5')
    header('Lösungen und Teilpunkte',1,True,total=4)
    box(34,110,527,103)
    para(47,121,500,'<b>Maximal 20 Punkte.</b> Jeder der fünf Bereiche zählt vier Punkte. Passende Teilantworten werden einzeln gewertet. Ein falsches Richtungszeichen nimmt keine bereits verdienten Punkte für eine passende Gradzahl weg. Die freie Zusatzbegründung wird nicht automatisch benotet.',10,16)
    solution_line(1,246);solution_line(2,325);solution_line(3,404);solution_line(4,483);solution_line(5,562);solution_line(6,641)
    para(34,739,527,'Für Aufgaben 1–6: pro richtiger Teilantwort 1 Punkt. In der Druckfassung gelten eindeutige Abkürzungen und sinngleiche Fachwörter ebenfalls.',9,14,color=GREY)
    c.showPage();header('Kartenlösungen und Auswertung',2,True,total=4)
    txt(34,112,'7. Markieren: 52° N / 8° O',10.5,'Bold',TEAL);txt(312,112,'8. Ablesen: 20° S / 60° W',10.5,'Bold',TEAL)
    map_art(34,129,251,167,DATA['maps']['germany']['bounds'],(52,8),'Lösung',lat_step=2,lon_step=2,tolerance=True)
    map_art(312,129,249,167,[-80,-40,-40,0],(-20,-60),'P',lat_step=10,lon_step=10)
    para(34,307,251,'Je 1 Punkt für passende Breite / Länge; bis 1° Abweichung pro Achse. Grün zeigt den Bereich für beide vollen Punkte.',9,14)
    para(312,307,249,'20, S, 60 und W zählen jeweils 0,5 Punkte. Bei den Gradzahlen gilt eine Ablesetoleranz bis 0,5°.',9,14)
    solution_line(9,399);solution_line(10,501)
    txt(34,603,'Gezielt weiterüben',12,'Bold',TEAL)
    rows=[('Aufgaben 1–2','Grundlagen: Bezugslinien und Gradangaben'),('Aufgaben 3–4','Erdviertel: N/S und O/W zusammen lesen'),('Aufgaben 5–6','Ansichten: Ringe, Speichen, Linien und Bögen'),('Aufgaben 7–8','Kartenarbeit: markieren und ablesen'),('Aufgaben 9–10','Atlasarbeit: Register und Randangaben')]
    for i,(a,b) in enumerate(rows):txt(34,628+i*24,a,9,'Bold');txt(151,628+i*24,b,9)
    para(34,765,527,'Eigene Modelle. Ortslagen: GeoNames (CC BY 4.0), Frankfurt am Main 2925533, Frankfurt (Oder) 2925535, Lissabon 2267057. Testfassung 3 · mit Skizzenaufgaben · 27.10.2026.',7.7,11,color=GREY)
    sketch_solution_pages()
    c.save();return path
if __name__=='__main__':
    test=make_test();solutions=make_solutions()
    encoded={'test':'data:application/pdf;base64,'+base64.b64encode(test.read_bytes()).decode(),'solutions':'data:application/pdf;base64,'+base64.b64encode(solutions.read_bytes()).decode()}
    (HERE/'atlas-druckdateien.js').write_text('/* Eingebettete Druckdateien für Testfassung 3 mit Zeichenteil. */\nwindow.AW_PDFS = '+json.dumps(encoded)+';\n')
    print(test.name,solutions.name)
