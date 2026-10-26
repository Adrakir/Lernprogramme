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
def header(title,page,solution=False,total=3):
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
def make_test():
    global c
    path=ROOT/'Atlas_Abschlusstest_Klasse5.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Atlas-Abschlusstest Klasse 5 - verbesserte Fassung, 20 Punkte')
    header('Mein Atlas-Abschlusstest',1)
    txt(34,108,'Name:',9);line(72,110,323,110);txt(357,108,'Datum:',9);line(401,110,561,110)
    txt(34,130,'20 Punkte · fünf Bereiche mit je 4 Punkten · Richtwert 20–25 Minuten',9,'Bold',TEAL)
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
    c.save();return path
def solution_line(number,y):
    q=DATA['exam'][number-1];txt(34,y,f'{number}. {q["title"]} · 2 Punkte',10.8,'Bold',TEAL);para(34,y+12,527,q['explanation'],10,15)
def make_solutions():
    global c
    path=ROOT/'Atlas_Abschlusstest_Loesungen.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Musterlösungen und Teilpunkte - Atlas-Abschlusstest Klasse 5')
    header('Lösungen und Teilpunkte',1,True,total=2)
    box(34,110,527,103)
    para(47,121,500,'<b>Maximal 20 Punkte.</b> Jeder der fünf Bereiche zählt vier Punkte. Passende Teilantworten werden einzeln gewertet. Ein falsches Richtungszeichen nimmt keine bereits verdienten Punkte für eine passende Gradzahl weg. Die freie Zusatzbegründung wird nicht automatisch benotet.',10,16)
    solution_line(1,246);solution_line(2,325);solution_line(3,404);solution_line(4,483);solution_line(5,562);solution_line(6,641)
    para(34,739,527,'Für Aufgaben 1–6: pro richtiger Teilantwort 1 Punkt. In der Druckfassung gelten eindeutige Abkürzungen und sinngleiche Fachwörter ebenfalls.',9,14,color=GREY)
    c.showPage();header('Kartenlösungen und Auswertung',2,True,total=2)
    txt(34,112,'7. Markieren: 52° N / 8° O',10.5,'Bold',TEAL);txt(312,112,'8. Ablesen: 20° S / 60° W',10.5,'Bold',TEAL)
    map_art(34,129,251,167,DATA['maps']['germany']['bounds'],(52,8),'Lösung',lat_step=2,lon_step=2,tolerance=True)
    map_art(312,129,249,167,[-80,-40,-40,0],(-20,-60),'P',lat_step=10,lon_step=10)
    para(34,307,251,'Je 1 Punkt für passende Breite / Länge; bis 1° Abweichung pro Achse. Grün zeigt den Bereich für beide vollen Punkte.',9,14)
    para(312,307,249,'20, S, 60 und W zählen jeweils 0,5 Punkte. Bei den Gradzahlen gilt eine Ablesetoleranz bis 0,5°.',9,14)
    solution_line(9,399);solution_line(10,501)
    txt(34,603,'Gezielt weiterüben',12,'Bold',TEAL)
    rows=[('Aufgaben 1–2','Grundlagen: Bezugslinien und Gradangaben'),('Aufgaben 3–4','Erdviertel: N/S und O/W zusammen lesen'),('Aufgaben 5–6','Ansichten: Ringe, Speichen, Linien und Bögen'),('Aufgaben 7–8','Kartenarbeit: markieren und ablesen'),('Aufgaben 9–10','Atlasarbeit: Register und Randangaben')]
    for i,(a,b) in enumerate(rows):txt(34,628+i*24,a,9,'Bold');txt(151,628+i*24,b,9)
    para(34,765,527,'Eigene Modelle. Ortslagen: GeoNames (CC BY 4.0), Frankfurt am Main 2925533, Frankfurt (Oder) 2925535, Lissabon 2267057. Testfassung 2 · 26.10.2026.',7.7,11,color=GREY)
    c.save();return path
if __name__=='__main__':
    test=make_test();solutions=make_solutions()
    encoded={'test':'data:application/pdf;base64,'+base64.b64encode(test.read_bytes()).decode(),'solutions':'data:application/pdf;base64,'+base64.b64encode(solutions.read_bytes()).decode()}
    (HERE/'atlas-druckdateien.js').write_text('/* Eingebettete Druckdateien für Testfassung 2. */\nwindow.AW_PDFS = '+json.dumps(encoded)+';\n')
    print(test.name,solutions.name)
