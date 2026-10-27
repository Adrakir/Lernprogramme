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
def header(title,page,solution=False,total=9):
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
def model(x,y,size,kind,label,color='#445E70'):
    cx=x+size/2;cy=y+size/2;r=size*.39
    c.setFillColor(HexColor('#F3F7FA'));c.setStrokeColor(HexColor(color));c.setLineWidth(.8);c.circle(cx,H-cy,r,fill=1,stroke=1)
    if kind=='parallel-pole':
        for scale in [.866,.5,.2]:c.circle(cx,H-cy,r*scale,fill=0,stroke=1)
    elif kind=='meridian-pole':
        for a in range(0,360,45):line(cx,cy,cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a)),color,.8)
    elif kind=='parallel-side':
        for lat in [-60,-30,0,30,60]:
            dy=r*math.sin(math.radians(lat));span=r*math.cos(math.radians(lat));line(cx-span,cy-dy,cx+span,cy-dy,color,.8)
    else:
        for lon in [-60,-30,0,30,60]:
            p=c.beginPath()
            for i in range(91):
                a=math.radians(-90+2*i);xx=cx+r*math.cos(a)*math.sin(math.radians(lon));yy=cy-r*math.sin(a)
                if i==0:p.moveTo(xx,H-yy)
                else:p.lineTo(xx,H-yy)
            c.setStrokeColor(HexColor(color));c.drawPath(p,fill=0,stroke=1)
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
def draw_original_scene(key,x,y,w):
    sc=DATA['notes']['scenes'][key];scale=w/sc['w']
    c.saveState();c.translate(x,H-y);c.scale(scale,scale)
    for i in sc['items']:
        color=i.get('color',INK);fill=i.get('fill','none');stroke=color!='none';filled=fill!='none'
        if stroke:c.setStrokeColor(HexColor(color))
        if filled:c.setFillColor(HexColor(fill))
        c.setLineWidth(i.get('width',1))
        tag=i['tag']
        if tag=='text':
            font='Bold' if i.get('bold') else 'Body';size=i['size'];t=i['text'];xx=i['x'];yy=-i['y']
            c.saveState();c.translate(xx,yy);c.rotate(-i.get('rotate',0))
            if i.get('halo'):
                tw=pdfmetrics.stringWidth(t,font,size);c.setFillColor(HexColor('#FFFFFF'));c.rect(-tw/2-2,-2,tw+4,size+3,fill=1,stroke=0)
            c.setFillColor(HexColor(color));c.setFont(font,size);c.drawCentredString(0,0,t);c.restoreState()
        elif tag=='line':c.line(i['x1'],-i['y1'],i['x2'],-i['y2'])
        elif tag=='circle':c.circle(i['cx'],-i['cy'],i['r'],stroke=int(stroke),fill=int(filled))
        elif tag=='ellipse':c.ellipse(i['cx']-i['rx'],-i['cy']-i['ry'],i['cx']+i['rx'],-i['cy']+i['ry'],stroke=int(stroke),fill=int(filled))
        elif tag=='polyline':
            p=c.beginPath();p.moveTo(i['points'][0][0],-i['points'][0][1])
            for xx,yy in i['points'][1:]:p.lineTo(xx,-yy)
            if i.get('close'):p.close()
            c.drawPath(p,stroke=int(stroke),fill=int(filled))
    c.restoreState()
    return sc['h']*scale

def sketch_test_pages():
    c.showPage();header('Halbkugeln aus deiner Vorlage',4,total=9)
    para(34,105,527,'<b>11. Beschrifte die Zeichnung wie auf deinem Foto.</b> Schreibe die acht Begriffe zu A bis H. Kennzeichne Breitenkreise blau und Längenkreise violett. Die Beschriftungen werden mit der Musterlösung geprüft; Teil A zählt weiter 20 Punkte.',10,15)
    draw_original_scene('hemispheresTest',34,175,527)
    for n,(id,_) in enumerate(DATA['notes']['labels']):
        x=34 if n%2==0 else 309;yy=498+(n//2)*51
        field(x,yy,245,id+':')
    para(34,735,527,'Wortliste: Äquator · Nordhalbkugel · Nordpol · Nullmeridian · Osthalbkugel · Südhalbkugel · Südpol · Westhalbkugel.',9,14,color=GREY)
    c.showPage();header('Erdviertel und vier Felder',5,total=9)
    txt(34,111,'12. Trage die vier Erdviertel ein.',12,'Bold',TEAL)
    para(34,127,527,'Norden ist oben. Verwende die vollständigen Namen wie auf deiner ersten Skizze.',10,15)
    draw_original_scene('quartersTest',34,153,527)
    txt(34,417,'13. Zeichne die Linien in die vier Felder.',12,'Bold',TEAL)
    para(34,432,527,'Oben Breitenkreise, unten Längenkreise. Links Seitenansicht vom Äquator, rechts Draufsicht auf den Nord- oder Südpol. Genau diese Anordnung zeigt deine zweite Skizze.',10,15)
    draw_original_scene('viewsTest',34,477,447)
    c.showPage();header('Pole, Äquator und Lückentext',6,total=9)
    txt(34,111,'14. Beschrifte deine Halbkugel.',12,'Bold',TEAL)
    para(34,126,527,'Trage Nordpol, Südpol, Äquator und Erdmittelpunkt ein. Ergänze 0°, 90° N und 90° S. Die Achse und die Äquatorebene sind vorgezeichnet.',10,15)
    draw_original_scene('angleTest',34,165,527)
    txt(34,478,'15. Dein Lückentext - gleiche Satzfolge wie auf dem Foto',11.6,'Bold',TEAL)
    txt(34,518,'Die Breitenkreise verlaufen',10.5);line(208,521,360,521);txt(370,518,'zum',10.5);line(398,521,551,521);txt(555,518,'.',10.5)
    txt(34,568,'Die Längenkreise verlaufen vom',10.5);line(233,571,380,571)
    txt(34,608,'zum',10.5);line(67,611,315,611);txt(321,608,'.',10.5)
    txt(34,658,'Der größte Breitenkreis ist der',10.5);line(226,661,550,661);txt(555,658,'.',10.5)
    para(34,714,527,'<b>Begriff aus deiner Vorlage:</b> „Längenkreise“. Fachlich heißt ein Halbkreis von Pol zu Pol Meridian oder Längenhalbkreis. Zwei gegenüberliegende Meridiane bilden einen ganzen Längenkreis.',9,14,color=GREY)

def sketch_solution_pages():
    c.showPage();header('Halbkugeln und Gradnetz',3,True,total=8)
    txt(34,110,'11. Die vollständigen Beschriftungen',12,'Bold',TEAL)
    draw_original_scene('hemispheres',34,125,527)
    para(34,438,527,'A: Nordpol · B: Südpol · C: Nordhalbkugel · D: Südhalbkugel · E: Äquator · F: Westhalbkugel · G: Osthalbkugel · H: Nullmeridian',9.5,15)
    draw_original_scene('globe',34,495,527)
    c.showPage();header('Erdviertel und vier Ansichten',4,True,total=8)
    txt(34,111,'12. Die vier Erdviertel wie auf deiner Skizze',12,'Bold',TEAL)
    draw_original_scene('quarters',34,129,527)
    txt(34,408,'13. Breitenkreise und Längenkreise',12,'Bold',TEAL)
    draw_original_scene('views',34,427,497)
    c.showPage();header('Pole und drei Merksätze',5,True,total=8)
    txt(34,111,'14. Nordpol, Südpol, Äquator und Erdmittelpunkt',11.7,'Bold',TEAL)
    draw_original_scene('angle',34,133,527)
    para(34,433,527,'0° Breite am Äquator, 90° N am Nordpol, 90° S am Südpol. Auch die linke Seite des Äquators hat 0° Breite. Die Achse geht durch den Erdmittelpunkt weiter zum Südpol.',10,15)
    txt(34,526,'15. Die drei vollständigen Sätze deiner Vorlage',12,'Bold',TEAL)
    for j,sentence in enumerate(DATA['notes']['sentences']):para(34,552+j*44,527,sentence,11,16)
    para(34,714,527,'Ein Meridian ist ein Längenhalbkreis von Pol zu Pol. Zwei gegenüberliegende Meridiane bilden den ganzen Längenkreis. Die Datumsgrenze liegt nur ungefähr am 180°-Meridian.',9,14,color=GREY)

def pdf_polygon(points,fill,stroke=INK,width=1):
    p=c.beginPath();p.moveTo(points[0][0],H-points[0][1])
    for x,y in points[1:]:p.lineTo(x,H-y)
    p.close();c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke));c.setLineWidth(width);c.drawPath(p,fill=1,stroke=1)
def house_side(x,y,w):
    box(x,y+44,w,79,'#F1D8A9',INK)
    box(x+w*.7,y+7,w*.12,33,'#D5D7DA',INK)
    pdf_polygon([(x-8,y+45),(x+w/2,y),(x+w+8,y+45)],'#BA6A52')
    box(x+w*.4,y+76,w*.22,47,'#D4B281',INK)
    for xx in [x+w*.1,x+w*.72]:box(xx,y+66,w*.17,22,'#DDEFF5',INK)
    line(x-12,y+125,x+w+12,y+125,INK,1)
def house_top(x,y,w):
    pdf_polygon([(x,y),(x+w,y),(x+w,y+104),(x,y+104)],'#C97A5C')
    line(x+w/2,y,x+w/2,y+104,INK,2)
    pdf_polygon([(x+w*.7,y+13),(x+w*.82,y+13),(x+w*.82,y+31),(x+w*.7,y+31)],'#D5D7DA')
def view_pair(x,y,size,kind):
    # Keine Merkmale aus der Antwort als Text im Bild.
    model(x,y,size,kind,'')
def plain_globe(cx,cy,r):
    empty_circle(cx,cy,r)
    c.setFillColor(HexColor(INK));c.circle(cx,H-(cy-r),2,fill=1,stroke=0);c.circle(cx,H-(cy+r),2,fill=1,stroke=0)
    txt(cx-18,cy-r-10,'Nordpol',8.5,'Bold');txt(cx-17,cy+r+18,'Südpol',8.5,'Bold')
def quarter_globe(x,y,size,solution=False):
    # Nach Norden ausgerichtete Vorderansicht mit 0°-Meridian in der Bildmitte.
    cx=x+size/2;cy=y+size/2;r=size*.37
    cols=['#E4EEF9','#E7F3E7','#F7EAD9','#F2E4F1']
    for n,(start,end) in enumerate([(180,270),(270,360),(90,180),(0,90)]):
        pts=[(cx,cy)]+[(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a))) for a in range(start,end+1,2)]
        pdf_polygon(pts,cols[n],cols[n],.5)
    empty_circle(cx,cy,r)
    for dy in [-r*.55,r*.55]:
        span=math.sqrt(r*r-dy*dy);line(cx-span,cy+dy,cx+span,cy+dy,'#ADC0CE',.65)
    c.setStrokeColor(HexColor('#ADC0CE'));c.setLineWidth(.65)
    for scale in [.5]:c.ellipse(cx-r*scale,H-cy-r,cx+r*scale,H-cy+r,fill=0,stroke=1)
    line(cx-r,cy,cx+r,cy,BLUE,2);line(cx,cy-r,cx,cy+r,PINK,2)
    txt(cx-19,cy-r-13,'Nordpol',9,'Bold');txt(cx-18,cy+r+23,'Südpol',9,'Bold')
    txt(cx+r+8,cy+4,'Äquator',9,'Bold',BLUE)
    txt(cx+12,cy-r+16,'0°',9,'Bold',PINK)
    labels=['Nordwestviertel','Nordostviertel','Südwestviertel','Südostviertel']
    for n,(dx,dy) in enumerate([(-.42,-.42),(.42,-.42),(-.42,.42),(.42,.42)]):
        px=cx+r*dx;py=cy+r*dy
        if solution:
            # Zweizeilig, damit die Namen nicht über die Grenzlinien reichen.
            parts=[['Nordwest-','viertel'],['Nordost-','viertel'],['Südwest-','viertel'],['Südost-','viertel']][n]
            c.setFont('Bold',9);c.setFillColor(HexColor(INK));c.drawCentredString(px,H-py+3,parts[0]);c.drawCentredString(px,H-py-10,parts[1])
        else:
            c.setFont('Bold',16);c.setFillColor(HexColor(INK));c.drawCentredString(px,H-py,str(n+1))
    return cx,cy,r

def supplementary_test_pages():
    c.showPage();header('Draufsicht und Seitenansicht',7,total=9)
    txt(34,111,'16. Von wo schaust du auf das Modell?',12,'Bold',TEAL)
    para(34,129,527,'a) Dasselbe Haus aus zwei Blickrichtungen. Schreibe Draufsicht oder Seitenansicht unter jedes Bild. Begründe bei einem Bild deine Entscheidung.',10,15)
    txt(87,192,'Bild A',10,'Bold');txt(365,192,'Bild B',10,'Bold')
    house_side(85,212,150);house_top(360,223,150)
    field(34,364,245,'Bild A:');field(309,364,252,'Bild B:')
    field(34,417,527,'Meine Begründung:')
    txt(34,495,'b) Die Erdkugel aus zwei Blickrichtungen',11,'Bold',TEAL)
    para(34,509,527,'Die Modelle zeigen nur Breitenkreise. Ordne zu: Draufsicht auf den Nordpol oder Seitenansicht vom Äquator. Ergänze: Ringe oder waagerechte Linien?',10,15)
    view_pair(65,555,180,'parallel-pole');view_pair(342,555,180,'parallel-side')
    field(34,718,245,'Links: Blickrichtung und Form');field(309,718,252,'Rechts: Blickrichtung und Form')
    line(34,783,279,783);line(309,783,561,783)
    c.showPage();header('Linien selbst einzeichnen',8,total=9)
    txt(34,111,'17. Zeichne das Gradnetz auf die Erdkugel.',12,'Bold',TEAL)
    para(34,129,527,'Die drei Kreise zeigen die Erdkugel von der Seite. Nordpol ist oben, Südpol unten. Zeichne sauber und benutze Blau für Breitenkreise und Violett für Meridiane.',10,15)
    txt(34,191,'a) Breitenkreise',11,'Bold',BLUE);txt(309,191,'b) Längenkreise / Meridiane',11,'Bold',PINK)
    plain_globe(161,338,97);plain_globe(435,338,97)
    para(34,466,245,'Zeichne den Äquator und je zwei weitere Breitenkreise nördlich und südlich davon ein. Beschrifte den Äquator.',9.6,14)
    para(309,466,252,'Zeichne den Nullmeridian und zwei weitere Meridiane ein. Alle verbinden Nordpol und Südpol. Beschrifte den Nullmeridian.',9.6,14)
    txt(34,551,'c) Beide Linienarten zusammen',11,'Bold',TEAL)
    plain_globe(175,679,89)
    para(309,594,252,'Übertrage beide Linienarten in eine gemeinsame Kugelzeichnung. Markiere einen Schnittpunkt und schreibe Breitenkreis und Meridian an die passende Linie.',10,15)
    para(309,702,252,'Achte darauf: Breitenkreise berühren die Pole nicht. Meridiane treffen sich an beiden Polen.',9,14,color=GREY)
    c.showPage();header('Die vier Viertelkugeln',9,total=9)
    txt(34,111,'18. Benenne die Erdviertel an der Kugelzeichnung.',12,'Bold',TEAL)
    para(34,129,527,'Schreibe die vollständigen Bezeichnungen zu 1 bis 4. Der Äquator und der Nullmeridian sind eingezeichnet. Norden ist oben, Westen links und Osten rechts.',10,15)
    quarter_globe(63,190,410)
    for n in range(4):field(34 if n%2==0 else 309,626+(n//2)*54,245,str(n+1)+':')
    para(34,747,527,'Vereinfachte Vorderansicht: Jedes Erdviertel setzt sich auf der Rückseite fort. Dort liegt auch der 180°-Meridian, die zweite Grenze zwischen Ost und West.',9,14,color=GREY)

def supplementary_solution_pages():
    c.showPage();header('Lösungen zu den Ansichten',6,True,total=8)
    txt(34,111,'16. Draufsicht und Seitenansicht',12,'Bold',TEAL)
    house_side(85,151,150);house_top(360,163,150)
    txt(72,310,'Bild A: Seitenansicht',11,'Bold');txt(340,310,'Bild B: Draufsicht',11,'Bold')
    para(34,340,527,'Bei der Seitenansicht siehst du Hauswand, Fenster und Tür. In der Draufsicht schaust du senkrecht von oben auf das Dach; der Schornstein ist von oben sichtbar.',10.5,16)
    view_pair(65,414,180,'parallel-pole');view_pair(342,414,180,'parallel-side')
    para(34,613,245,'Links: Draufsicht auf den Nordpol. Die Breitenkreise erscheinen als Ringe.',10,15)
    para(309,613,252,'Rechts: Seitenansicht vom Äquator. Die Breitenkreise erscheinen als waagerechte Linien.',10,15)
    para(34,720,527,'Hinweis: Eine Draufsicht auf ein Haus und der Blick auf den Pol sind verschiedene Beispiele derselben Blickrichtung von oben auf das jeweilige Modell.',9,14,color=GREY)
    c.showPage();header('Lösungen zum Einzeichnen',7,True,total=8)
    txt(34,111,'17. So verlaufen die Linien auf der Kugel.',12,'Bold',TEAL)
    model(62,145,188,'parallel-side','a) Breitenkreise',BLUE);model(337,145,188,'meridian-side','b) Meridiane',PINK)
    para(34,356,245,'Der Äquator liegt in der Mitte. Weitere Breitenkreise liegen parallel dazu; sie werden zum Pol hin kleiner.',10,15)
    para(309,356,252,'Meridiane verbinden die beiden Pole. Die mittlere Linie ist hier der Nullmeridian, die anderen erscheinen als Bögen.',10,15)
    draw_original_scene('globe',34,434,527)
    px=34+260*527/760;py=434+213*527/760
    c.setFillColor(HexColor('#E6B83B'));c.setStrokeColor(HexColor(INK));c.circle(px,H-py,4,fill=1,stroke=1)
    para(34,745,527,'c) Gelb: ein möglicher Schnittpunkt. Entscheidend sind Verlauf, Beschriftung und die zwei Linienfarben. Andere Kreuzungen eines Breitenkreises mit einem Meridian sind ebenfalls richtig.',9,14,color=GREY)
    c.showPage();header('Lösung: die Viertelkugeln',8,True,total=8)
    txt(34,111,'18. Die vier Erdviertel',12,'Bold',TEAL)
    quarter_globe(63,151,410,True)
    rows=['1: Nordwestviertel = Nordhalbkugel + Westhalbkugel','2: Nordostviertel = Nordhalbkugel + Osthalbkugel','3: Südwestviertel = Südhalbkugel + Westhalbkugel','4: Südostviertel = Südhalbkugel + Osthalbkugel']
    for j,t in enumerate(rows):txt(34,612+j*33,t,10.5)
    para(34,759,527,'Der Äquator trennt Nord und Süd. Nullmeridian und 180°-Meridian begrenzen Ost und West. Die farbigen Bereiche zeigen hier nur den sichtbaren Teil jedes Erdviertels.',8.7,13,color=GREY)

def make_test():
    global c
    path=ROOT/'Atlas_Abschlusstest_Klasse5.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Atlas-Abschlusstest Klasse 5 - verbesserte Fassung, 20 Punkte')
    header('Mein Atlas-Abschlusstest',1)
    txt(34,108,'Name:',9);line(72,110,323,110);txt(357,108,'Datum:',9);line(401,110,561,110)
    txt(34,130,'Teil A: 20 Punkte · Teil B ab Seite 4 · Zusatzblätter ab Seite 7',9,'Bold',TEAL)
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
    supplementary_test_pages()
    c.save();return path
def solution_line(number,y):
    q=DATA['exam'][number-1];txt(34,y,f'{number}. {q["title"]} · 2 Punkte',10.8,'Bold',TEAL);para(34,y+12,527,q['explanation'],10,15)
def make_solutions():
    global c
    path=ROOT/'Atlas_Abschlusstest_Loesungen.pdf';c=canvas.Canvas(str(path),pagesize=A4);c.setTitle('Musterlösungen und Teilpunkte - Atlas-Abschlusstest Klasse 5')
    header('Lösungen und Teilpunkte',1,True,total=8)
    box(34,110,527,103)
    para(47,121,500,'<b>Teil A: maximal 20 Punkte.</b> Jeder der fünf Bereiche zählt vier Punkte. Passende Teilantworten werden einzeln gewertet. Ein falsches Richtungszeichen nimmt keine bereits verdienten Punkte für eine passende Gradzahl weg. Die freie Zusatzbegründung wird nicht automatisch benotet.',10,16)
    solution_line(1,246);solution_line(2,325);solution_line(3,404);solution_line(4,483);solution_line(5,562);solution_line(6,641)
    para(34,739,527,'Für Aufgaben 1–6: pro richtiger Teilantwort 1 Punkt. In der Druckfassung gelten eindeutige Abkürzungen und sinngleiche Fachwörter ebenfalls.',9,14,color=GREY)
    c.showPage();header('Kartenlösungen und Auswertung',2,True,total=8)
    txt(34,112,'7. Markieren: 52° N / 8° O',10.5,'Bold',TEAL);txt(312,112,'8. Ablesen: 20° S / 60° W',10.5,'Bold',TEAL)
    map_art(34,129,251,167,DATA['maps']['germany']['bounds'],(52,8),'Lösung',lat_step=2,lon_step=2,tolerance=True)
    map_art(312,129,249,167,[-80,-40,-40,0],(-20,-60),'P',lat_step=10,lon_step=10)
    para(34,307,251,'Je 1 Punkt für passende Breite / Länge; bis 1° Abweichung pro Achse. Grün zeigt den Bereich für beide vollen Punkte.',9,14)
    para(312,307,249,'20, S, 60 und W zählen jeweils 0,5 Punkte. Bei den Gradzahlen gilt eine Ablesetoleranz bis 0,5°.',9,14)
    solution_line(9,399);solution_line(10,501)
    txt(34,603,'Gezielt weiterüben',12,'Bold',TEAL)
    rows=[('Aufgaben 1–2','Grundlagen: Bezugslinien und Gradangaben'),('Aufgaben 3–4','Erdviertel: N/S und O/W zusammen lesen'),('Aufgaben 5–6','Ansichten: Ringe, Speichen, Linien und Bögen'),('Aufgaben 7–8','Kartenarbeit: markieren und ablesen'),('Aufgaben 9–10','Atlasarbeit: Register und Randangaben')]
    for i,(a,b) in enumerate(rows):txt(34,628+i*24,a,9,'Bold');txt(151,628+i*24,b,9)
    para(34,765,527,'Eigene Modelle. Ortslagen: GeoNames (CC BY 4.0), Frankfurt am Main 2925533, Frankfurt (Oder) 2925535, Lissabon 2267057. Testfassung 5 · Ansichten und Zeichenaufgaben · 27.10.2026.',7.7,11,color=GREY)
    sketch_solution_pages()
    supplementary_solution_pages()
    c.save();return path
if __name__=='__main__':
    test=make_test();solutions=make_solutions()
    encoded={'test':'data:application/pdf;base64,'+base64.b64encode(test.read_bytes()).decode(),'solutions':'data:application/pdf;base64,'+base64.b64encode(solutions.read_bytes()).decode()}
    (HERE/'atlas-druckdateien.js').write_text('/* Eingebettete Druckdateien für Testfassung 5 mit Ansichten, Gradnetz und Viertelkugeln. */\nwindow.AW_PDFS = '+json.dumps(encoded)+';\n')
    print(test.name,solutions.name)
