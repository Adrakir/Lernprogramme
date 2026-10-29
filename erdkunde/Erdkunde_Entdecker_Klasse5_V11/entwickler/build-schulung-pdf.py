"""Bebilderte Schulung passend zu den 18 Aufgaben der Erdkunde-Klassenarbeit.

Ausführen im bestehenden Erdkunde-Projekt: python entwickler/build-schulung-pdf.py
Verwendet die eigenen Modellgrafiken und Ortsdaten des Projekts.
"""
from pathlib import Path
import importlib.util, math
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
spec=importlib.util.spec_from_file_location('atlaspdf',HERE/'build-atlas-pdf.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
W,H=A4
INK='#19384D';TEAL='#086F62';BLUE='#1766A1';PURPLE='#9C3475';GREY='#526B7B'
OUT=ROOT/'Erdkunde_Schulung_Gradnetz_Atlas_Klasse5.pdf'
c=canvas.Canvas(str(OUT),pagesize=A4,invariant=1)
c.setTitle('Fit für die Erdkunde-Klassenarbeit - Gradnetz, Ansichten und Atlas')
c.setAuthor('Erdkunde-Entdecker - Schulungsmaterial Klasse 5')
m.c=c
N=19

def t(x,y,s,size=11,bold=False,color=INK):
    c.setFont('Bold' if bold else 'Body',size);c.setFillColor(HexColor(color));c.drawString(x,H-y,s)
def p(x,y,w,s,size=11,leading=16,color=INK):
    q=Paragraph(s,ParagraphStyle('body',fontName='Body',fontSize=size,leading=leading,textColor=HexColor(color),splitLongWords=True))
    _,h=q.wrap(w,H)
    assert y+h<798,('Text außerhalb der Nutzfläche',s,y,h)
    q.drawOn(c,x,H-y-h);return h
def line(x,y,x2,y2,color='#B4C6D0',width=.7):m.line(x,y,x2,y2,color,width)
def rect(x,y,w,h,fill='#F0F6F8',stroke=None):m.box(x,y,w,h,fill,stroke)
def page(title,subtitle,section):
    if c.getPageNumber()>1:c.showPage()
    # Page number advances on showPage; the initial page is opened separately below.
def head(title,subtitle,section):
    if getattr(head,'started',False):c.showPage()
    head.started=True
    c.setFillColor(HexColor(TEAL));c.rect(0,H-7,W,7,fill=1,stroke=0)
    t(34,34,'ERDKUNDE · KLASSE 5',9,True,TEAL)
    c.setFont('Bold',8);c.drawRightString(W-34,H-34,section.upper())
    size=23
    while m.pdfmetrics.stringWidth(title,'Bold',size)>W-68:size-=.5
    t(34,67,title,size,True)
    p(34,82,W-68,subtitle,10,14,GREY)
    line(34,805,W-34,805)
    t(34,824,'Schulung zur Klassenarbeit · Bebilderte Fassung 29.10.2026',7.5,color=GREY)
    c.setFont('Body',8);c.drawRightString(W-34,H-824,f'{c.getPageNumber()} / {N}')
def callout(y,s,title='Gustavs Merksatz',h=68):
    rect(34,y,527,h,'#EDF6F3');t(47,y+17,title,9.5,True,TEAL)
    p(47,y+23,500,s,10.2,14)
def card(x,y,w,h,title,s,color=TEAL):
    rect(x,y,w,h,'#F2F6F8');t(x+12,y+21,title,11,True,color);p(x+12,y+32,w-24,s,10.2,15)
def number(n,x,y):
    c.setFillColor(HexColor(TEAL));c.circle(x,H-y,13,fill=1,stroke=0)
    c.setFillColor(HexColor('#FFFFFF'));c.setFont('Bold',11);c.drawCentredString(x,H-y-4,str(n))
def dot(x,y,label=None,color='#E6B83B'):
    c.setStrokeColor(HexColor(INK));c.setFillColor(HexColor(color));c.setLineWidth(.7);c.circle(x,H-y,3.5,fill=1,stroke=1)
    if label:t(x+8,y-7,label,10,True)
def axes(x,y,w,h,bounds,latstep=1,lonstep=1,lat=None,lon=None,points=(),label='Modellgradnetz'):
    west,east,south,north=bounds
    left=x+45;top=y+24;mw=w-57;mh=h-53
    X=lambda a:left+(a-west)/(east-west)*mw
    Y=lambda a:top+(north-a)/(north-south)*mh
    c.setFillColor(HexColor('#F7FAFC'));c.rect(left,H-top-mh,mw,mh,fill=1,stroke=0)
    for i in range(math.ceil(west/lonstep),math.floor(east/lonstep)+1):
        a=i*lonstep;xx=X(a);line(xx,top,xx,top+mh,'#C2B3C0',.6)
        s=f'{abs(a):g}°'+(' W' if a<0 else ' O' if a>0 else '')
        c.setFont('Body',9);c.setFillColor(HexColor(PURPLE));c.drawCentredString(xx,H-top+9,s)
    for i in range(math.ceil(south/latstep),math.floor(north/latstep)+1):
        a=i*latstep;yy=Y(a);line(left,yy,left+mw,yy,'#ACC7D8',.6)
        s=f'{abs(a):g}°'+(' S' if a<0 else ' N' if a>0 else '')
        c.setFont('Body',9);c.setFillColor(HexColor(BLUE));c.drawRightString(left-6,H-yy-3,s)
    if lat is not None:line(left,Y(lat),left+mw,Y(lat),BLUE,2)
    if lon is not None:line(X(lon),top,X(lon),top+mh,PURPLE,2)
    c.setStrokeColor(HexColor(INK));c.setLineWidth(.8);c.rect(left,H-top-mh,mw,mh,fill=0,stroke=1)
    for la,lo,name in points:dot(X(lo),Y(la),name)
    t(left,y+h-7,label,7.8,color=GREY)
    return X,Y
def answer(x,y,w,label=''):
    if label:p(x,y,w,label,10,14)
    line(x,y+32,x+w,y+32)
def city(id):return next(v for v in m.DATA['cities'] if v['id']==id)

# 1: Orientierung
head('Fit für die Erdkunde-Klassenarbeit','Gradnetz, Erdviertel, Ansichten und die sichere Ortssuche im Atlas.','Dein Lernweg')
t(34,145,'Verstehen. Vormachen. Selbst üben.',20,True)
p(34,169,310,'Dieses Heft erklärt die Themen der <b>18 Aufgaben</b> deiner Klassenarbeit. Du siehst zuerst den Denkweg, übst anschließend selbst und vergleichst zum Schluss mit den Lösungen.',12,18)
m.reference_globe(457,241,73,'both')
p(34,284,310,'Du brauchst einen Bleistift, einen blauen und einen violetten Stift sowie einen Schulatlas. Für die Modellaufgaben im Heft reicht das ausgedruckte Blatt.',11,17)
rect(34,364,527,48,'#EDF6F3')
p(47,375,501,'<b>Blau = geografische Breite (N/S).</b><br/><font color="'+PURPLE+'"><b>Violett = geografische Länge (O/W).</b></font>',10.5,15,color=BLUE)
items=[('Bezugslinien und Gradangaben','Seiten 2-3'),('Erdviertel und Ansichten','Seiten 4-6'),('Beschriften und selbst zeichnen','Seite 7'),('Atlas und Register verstehen','Seite 8'),('Orte mit Koordinaten finden','Seiten 9-12'),('Zusatz: Grad und Minuten','Seite 13'),('Üben und Lösungen vergleichen','Seiten 14-17'),('Lernzettel und Quellen','Seiten 18-19')]
for i,(a,b) in enumerate(items):
    x=34 if i%2==0 else 309;y=436+(i//2)*67
    t(x,y+16,a,10.2,True);t(x,y+36,b,10,color=GREY);line(x,y+48,x+245,y+48)
callout(726,'Erkläre den Weg mit eigenen Worten. Ein richtiger Begriff hilft erst dann, wenn du ihn auch am Bild zeigen kannst.',h=65)

# 2: Beide Bezugslinien
head('Die beiden Bezugslinien','Zu den Aufgaben 1, 11 und 17: Welche Linie ist die Ausgangslinie?','Grundlagen')
t(34,131,'Äquator: 0° Breite',13,True,BLUE);t(309,131,'Nullmeridian: 0° Länge',13,True,PURPLE)
m.reference_globe(156,258,80,'lat');m.reference_globe(432,258,80,'lon')
p(34,370,245,'Der <b>Äquator</b> verläuft um die Mitte der Erde. Er teilt die Erde in Nordhalbkugel und Südhalbkugel.',11,17)
p(309,370,252,'Der <b>Nullmeridian</b> verläuft von Pol zu Pol. Er ist die Ausgangslinie für die östliche und westliche Länge.',11,17)
card(34,478,245,112,'Breite fragt: Nord oder Süd?','Beispiel: <b>50,1° N</b><br/>Der Ort liegt nördlich des Äquators.',BLUE)
card(309,478,252,112,'Länge fragt: Ost oder West?','Beispiel: <b>14,4° O</b><br/>Der Ort liegt östlich des Nullmeridians.',PURPLE)
rect(34,618,527,62,'#F6F1F6')
t(48,645,'50,1° N',18,True,BLUE);t(194,645,'/',18);t(229,645,'14,4° O',18,True,PURPLE)
t(48,667,'zuerst die Breite',9,color=BLUE);t(229,667,'danach die Länge',9,color=PURPLE)
callout(711,'Eine Koordinatenangabe besteht aus <b>zwei</b> Angaben. In vielen Atlanten steht <b>E</b> für das englische Wort „East“: E bedeutet dasselbe wie O.',h=77)

# 3: Grad und Halbkugeln
head('Gradangaben und Halbkugeln','Zu den Aufgaben 2, 11 und 14: Die Zahlen zeigen eine Lage auf der Erde.','Grundlagen')
p(34,116,527,'Die Gradangaben beschreiben <b>Winkel</b>. Sie sind keine Kilometerangaben. Breite und Länge haben unterschiedliche Höchstwerte.',11,17)
t(63,178,'Breite: vom Äquator zum Pol',11,True,BLUE);t(329,178,'Länge: um die Erdachse',11,True,PURPLE)
m.limit_model(152,272,60,True,True);m.limit_model(426,272,60,False,True)
p(34,370,245,'<b>0° bis 90°</b> nach Norden oder Süden.<br/>Nordpol: <b>90° N</b><br/>Südpol: <b>90° S</b>',10.7,16)
p(309,370,252,'<b>0° bis 180°</b> nach Osten oder Westen.<br/>0°: Nullmeridian<br/>Gegenseite: 180°-Meridian',10.7,16)
m.draw_original_scene('hemispheres',70,435,450)
callout(716,'Der Äquator trennt <b>Nord und Süd</b>. Nullmeridian <b>und</b> 180°-Meridian begrenzen <b>Ost und West</b>. Eine Breite von 95° N ist unmöglich.',h=75)

# 4: Erdviertel
head('Aus zwei Richtungen wird ein Erdviertel','Zu den Aufgaben 3, 4, 12 und 18: N/S und O/W zusammen lesen.','Erdviertel')
m.quarter_globe(96,114,350,True)
p(34,487,527,'Vereinfachte Vorderansicht: Norden oben, Westen links. Ein Erdviertel setzt sich auf der Rückseite fort. Dort liegt die zweite Ost-/Westgrenze am 180°-Meridian.',10,15,GREY)
for x,y,title,detail in [(34,552,'N + O = Nordostviertel','48,9° N / 2,3° O'),(309,552,'N + W = Nordwestviertel','37,8° N / 122,4° W'),(34,638,'S + O = Südostviertel','23,7° S / 133,9° O'),(309,638,'S + W = Südwestviertel','34,6° S / 58,4° W')]:
    card(x,y,245 if x==34 else 252,70,title,detail)
callout(735,'Lies zuerst N oder S, dann O oder W. Auf einer Grenzlinie gehört ein Punkt nicht eindeutig zu nur einem Erdviertel.',h=56)

# 5: Vier Ansichten
head('Warum dieselben Linien anders aussehen','Zu den Aufgaben 5, 6, 13 und 16: Die Blickrichtung verändert das Bild.','Ansichten')
t(60,134,'Blick vom Äquator',12,True);t(325,134,'Blick auf den Nordpol',12,True)
panels=[(34,155,'Breitenkreise','parallel-side','waagerechte Linien',BLUE),(309,155,'Breitenkreise','parallel-pole','Ringe um den Pol',BLUE),(34,422,'Meridiane','meridian-side','Bögen von Pol zu Pol',PURPLE),(309,422,'Meridiane','meridian-pole','Speichen zum Pol',PURPLE)]
for x,y,title,kind,caption,col in panels:
    rect(x,y,245 if x==34 else 252,241,'#F6F9FB')
    t(x+15,y+25,title,12,True,col);m.model(x+50,y+40,150,kind,'',col)
    t(x+15,y+217,caption,10.7,True,col)
callout(706,'<b>Ringe = Breitenkreise.</b> <b>Speichen = Meridiane.</b> Die waagerechten Linien gelten für den genauen Blick vom Äquator. Bei einer schrägen Ansicht erscheinen Breitenkreise als Ellipsen.',h=82)

# Zusatzseite: Hausansichten aus Aufgabe 16
head('Draufsicht oder Seitenansicht?','Zu Aufgabe 16: Begründe deine Entscheidung mit sichtbaren Merkmalen.','Ansichten')
p(34,116,527,'Das gleiche Haus sieht aus zwei Blickrichtungen anders aus. Entscheidend ist, <b>von wo</b> du auf das Haus schaust.',11.5,17)
t(74,180,'Seitenansicht',13,True,TEAL);t(357,180,'Draufsicht',13,True,TEAL)
m.house_side(79,204,156);m.house_top(355,215,156)
p(34,370,245,'Du schaust von der Seite auf das Haus. Du erkennst die <b>Hauswand, die Fenster und die Tür</b>.',11,17)
p(309,370,252,'Du schaust senkrecht von oben auf das Haus. Du erkennst die <b>Dachflächen und den Schornstein</b>.',11,17)
rect(34,463,527,83,'#EDF6F3');t(47,484,'So kannst du deine Begründung schreiben',11,True,TEAL)
p(47,496,500,'„Bild A zeigt eine Seitenansicht, weil ich die Hauswand mit Tür und Fenstern sehe.“<br/>„Bild B zeigt eine Draufsicht, weil ich von oben auf das Dach schaue.“',10.5,16)
t(34,588,'Die gleiche Idee hilft dir beim Globus.',12,True,TEAL)
m.model(73,615,138,'parallel-side','',BLUE);m.model(350,615,138,'parallel-pole','',BLUE)
p(34,757,245,'Vom Äquator: Breitenkreise als Linien.',9.8,14,BLUE)
p(309,757,252,'Vom Nordpol: Breitenkreise als Ringe.',9.8,14,BLUE)

# 7: Beschriften und Zeichnen
head('Beschriften und Linien zeichnen','Zu den Aufgaben 11-17: Vom Modell zur eigenen Zeichnung.','Zeichnen')
p(34,116,527,'Die Halbkuppel zeigt die nördliche Hälfte der Erde. Die Erdachse reicht durch den Erdmittelpunkt weiter zum Südpol.',11,16)
m.draw_original_scene('angle',51,147,493)
p(34,425,527,'<b>Nordpol:</b> 90° N · <b>Äquator:</b> 0° Breite · <b>Südpol:</b> 90° S<br/>Der Erdmittelpunkt liegt im Inneren, nicht auf der Erdoberfläche.',10.5,16)
t(34,489,'Die drei Merksätze aus deiner Vorlage',12,True,TEAL)
for j,s in enumerate(m.DATA['notes']['sentences']):
    p(34,510+j*37,440,s,10.7,16)
    m.reference_globe(520,520+j*37,16,'lon' if j==1 else 'lat',False)
t(34,649,'So baust du eine Gradnetz-Zeichnung auf',12,True,TEAL)
m.plain_globe(119,710,34)
m.model(250,665,100,'parallel-side','',BLUE)
m.reference_globe(479,710,38,'both',False)
dot(479+38*math.sin(math.radians(25)),710+38*math.sin(math.radians(18))*math.cos(math.radians(25)))
t(66,774,'1. Kreis und Pole',9.4,True);t(248,774,'2. Breitenkreise',9.4,True);t(397,774,'3. Meridiane + Schnittpunkt',9,True)

# 7: Register
head('Was der Atlas dir verrät','Zu den Aufgaben 9 und 10: Inhaltsverzeichnis, Register und Planquadrat.','Atlas verstehen')
p(34,116,527,'<b>Ortsname bekannt?</b> Suche im alphabetischen Register und prüfe Land oder Region. <b>Nur Koordinaten bekannt?</b> Beginne mit einer passenden Übersichts- oder Regionalkarte mit Gradnetz.',11,17)
t(34,190,'Modellregister - keine echten Atlas-Seitenzahlen',11,True,TEAL)
m.register_table(208)
p(34,365,527,'Beispiel: Gesucht ist Frankfurt in <b>Hessen</b>. Richtig ist <b>Frankfurt am Main</b>, nicht Frankfurt (Oder) in Brandenburg.',10.5,16)
m.map_art(34,414,310,172,m.DATA['maps']['germany']['bounds'],lat_step=2,lon_step=2,fields=True)
p(379,428,182,'<b>Karte D</b> ist hier die Modellkarte.<br/><br/><b>B3</b> heißt: Spalte B und Zeile 3. Das ist ein Suchfeld, keine Koordinate.',10.5,16)
card(34,626,245,94,'Register','Der Kartenverweis führt zur passenden Atlasseite. Die Seitenzahl hängt von Ausgabe und Auflage ab.')
card(309,626,252,94,'Gradnetz','Breite und Länge beschreiben eine Lage auf der Erde - unabhängig von der Atlasausgabe.')
callout(743,'Planquadrat B3 ist <b>nicht</b> dasselbe wie 50° N / 8° O.',h=47)

# 8: Hauptverfahren
head('So findest du einen Ort im Atlas','Der vollständige Suchweg - am Beispiel 50,1° N / 14,4° O.','Schritt für Schritt')
steps=[('Koordinaten lesen','50,1° N ist die Breite, 14,4° O die Länge. Der Ort liegt nördlich des Äquators und östlich des Nullmeridians.'),('Eine passende Karte wählen','Bestimme zunächst die Weltregion: Hier ist eine Europakarte sinnvoll. Suche eine ausreichend genaue Karte mit Gradnetz.'),('Die Breite am Rand suchen','Breitenangaben stehen meist links oder rechts. Suche 50° N und gehe für 50,1° N ein kleines Stück weiter nach Norden.'),('Die Länge am Rand suchen','Längenangaben stehen meist oben oder unten. Suche 14° O und gehe für 14,4° O 0,4° weiter nach Osten.'),('Die Linien bis zum Schnittpunkt verfolgen','Verfolge den Breitenkreis und den Meridian. Auf gekrümmten Karten folgst du den gedruckten Linien, nicht einfach dem Blattrand.'),('Ortsname und Ergebnis kontrollieren','Lies den Namen am Schnittpunkt: Hier liegt Prag. Prüfe N/S und O/W und nutze bei Bedarf eine genauere Karte.')]
for i,(title,body) in enumerate(steps):
    y=126+i*98;rect(34,y,527,86,'#F1F6F8');number(i+1,56,y+25)
    t(80,y+24,title,11.2,True,BLUE if i==2 else PURPLE if i==3 else TEAL)
    p(80,y+34,466,body,10.5,15)
callout(734,'<b>Erst die Breite, dann die Länge, dann der Schnittpunkt.</b> Auf den nächsten Seiten siehst du den Weg als Bilderfolge.',h=56)

# 9: Prag
head('Beispiel 1: Prag finden','50,1° N / 14,4° O - Breite und Länge werden zu einem Schnittpunkt.','Vorgemacht')
t(34,130,'1. Breite verfolgen',12,True,BLUE);t(309,130,'2. Länge verfolgen',12,True,PURPLE)
axes(34,153,245,226,(12,16,49,52),lat=50.1)
axes(309,153,252,226,(12,16,49,52),lon=14.4)
p(34,396,245,'50,1° N liegt <b>ein Zehntel</b> des Abstands von 50° N zu 51° N weiter nach Norden.',10.4,15)
p(309,396,252,'14,4° O liegt <b>vier Zehntel</b> des Abstands von 14° O zu 15° O weiter nach Osten.',10.4,15)
t(34,475,'3. Beide Linien treffen sich: Hier liegt Prag.',12,True,TEAL)
axes(59,494,477,218,(12,16,49,52),lat=50.1,lon=14.4,points=[(50.1,14.4,'Prag')])
callout(739,'Die Modelle zeigen das Ablesen besonders deutlich. Im echten Atlas suchst du am Schnittpunkt das Ortszeichen und liest den Namen daneben.',h=51)

# 10: Lissabon
head('Beispiel 2: Lissabon finden','38,7° N / 9,1° W - jetzt liegt der Ort westlich des Nullmeridians.','Vorgemacht')
p(34,116,527,'Wähle eine Karte der Iberischen Halbinsel. Suche die Breite <b>38,7° N</b> und danach die Länge <b>9,1° W</b>. Der Schnittpunkt liegt bei Lissabon.',11,17)
x,y,w,h=34,173,527,291
m.map_art(x,y,w,h,(-15,0,35,45),(38.7,-9.1),None,lat_step=5,lon_step=5)
X=lambda lo:x+36+(lo+15)/15*(w-48)
Y=lambda la:y+22+(45-la)/10*(h-43)
c.setDash([4,3]);line(x+36,Y(38.7),X(-9.1),Y(38.7),BLUE,1.7);line(X(-9.1),y+22,X(-9.1),Y(38.7),PURPLE,1.7);c.setDash([])
dot(X(-9.1),Y(38.7),'Lissabon')
card(34,494,245,112,'Breite 38,7° N','38,7° N liegt zwischen 35° N und 40° N. Es liegt <b>1,3° südlich von 40° N</b>.',BLUE)
card(309,494,252,112,'Länge 9,1° W','9,1° W liegt zwischen 10° W und 5° W. Es liegt <b>0,9° östlich von 10° W</b>.',PURPLE)
p(34,638,527,'<b>Achtung:</b> Links vom Nullmeridian werden die West-Zahlen nach Westen größer. 10° W liegt weiter westlich als 9,1° W. Auf dieser nach Norden ausgerichteten Karte ist Westen links.',11,17)
callout(736,'Wenn Lissabon und 38,7° N bereits gegeben sind, suchst du das Ortszeichen und liest nur noch die fehlende Länge ab: <b>ungefähr 9° W</b>.',h=55)

# 11: Ablesen
head('Koordinaten eines Punktes ablesen','Zu Aufgabe 8: Jetzt arbeitest du den Suchweg rückwärts ab.','Selbst ablesen')
p(34,116,527,'Gegeben ist Punkt P. Verfolge vom Punkt aus zuerst den Breitenkreis zum seitlichen Rand. Verfolge dann den Meridian zum oberen oder unteren Rand.',11,17)
axes(34,181,527,287,(-80,-40,-40,0),10,10,lat=-20,lon=-60,points=[(-20,-60,'P')],label='Modellgradnetz - auf dem ganzen Ausschnitt südliche Breite und westliche Länge')
card(34,509,245,97,'1. Breite ablesen','P liegt auf <b>20° S</b>.<br/>Zahl: 20 · Richtung: Süd',BLUE)
card(309,509,252,97,'2. Länge ablesen','P liegt auf <b>60° W</b>.<br/>Zahl: 60 · Richtung: West',PURPLE)
rect(34,637,527,61,'#EDF6F3');t(49,675,'P: 20° S / 60° W',20,True,TEAL)
callout(733,'Die Lage des Blattes ist kein Ersatz für die Richtungsangabe. <b>Lies N, S, O/E oder W am Gradnetz ab.</b>',h=57)

# 12: Minuten
head('Zusatz: Grad und Minuten','Nur nötig, wenn dein Atlas oder deine Aufgabe Minutenangaben verwendet.','Zusatzwissen')
rect(34,124,527,72,'#EDF6F3');t(50,166,'1° = 60′',25,True,TEAL);t(270,163,'Ein Grad hat 60 Winkelminuten.',11)
p(34,223,527,'Das Zeichen <b>′</b> bedeutet hier Winkelminute. Es beschreibt eine feinere Ortsangabe und keine Uhrzeit. Achtung: Ein Grad wird in <b>60</b> Minuten geteilt, nicht in 100.',11.5,18)
t(34,312,'Ein Grad, in sechs Abschnitte zu je 10′ geteilt',11,True)
left=61;right=535;yy=365
line(left,yy,right,yy,INK,2)
for i in range(7):
    xx=left+(right-left)*i/6;line(xx,yy-10,xx,yy+10,INK,1);t(xx-9,yy+31,f'{i*10}′',10)
t(left-7,yy+57,'0°',10,True);t(right-7,yy+57,'1°',10,True)
card(34,464,527,110,'Von Dezimalgrad zu Grad und Minuten','<b>50,1° N = 50° 06′ N</b>, denn 0,1 × 60 = 6.<br/><b>14,4° O = 14° 24′ O</b>, denn 0,4 × 60 = 24.')
card(34,603,527,89,'Zurück zu Dezimalgrad','<b>38° 42′ N = 38,7° N</b>, denn 42 : 60 = 0,7.<br/>Gradzahl behalten und den Minutenanteil dazurechnen.')
callout(735,'Je nach Maßstab kannst du Zwischenwerte im Atlas nur ungefähr abschätzen. Eine sehr kleine Übersichtskarte reicht nicht für jede Zehntelgrad-Angabe.',h=56)

# 13: Übungen Begriffe
head('Übungswerkstatt 1: Begriffe und Bilder','Erst selbst bearbeiten. Die Lösungen stehen auf Seite 16.','Jetzt bist du dran')
t(34,123,'A · Wie heißen die hervorgehobenen Linien?',11.5,True,TEAL)
m.reference_globe(158,220,57,'lat');m.reference_globe(430,220,57,'lon')
answer(34,309,245,'a) 0° Breite:');answer(309,309,252,'b) 0° Länge:')
t(34,384,'B · Ergänze die größten möglichen Gradzahlen.',11.5,True,TEAL)
answer(34,404,245,'Breite: 0° bis');answer(309,404,252,'Länge: 0° bis')
t(34,478,'C · Benenne die Erdviertel.',11.5,True,TEAL)
answer(34,499,245,'a) 48,9° N / 2,3° O');answer(309,499,252,'b) 34,6° S / 58,4° W')
t(34,574,'D · Breitenkreise oder Meridiane?',11.5,True,TEAL)
for i,(kind,label) in enumerate([('parallel-pole','A'),('meridian-pole','B'),('parallel-side','C'),('meridian-side','D')]):
    m.model(44+i*132,612,109,kind,label)
for i in range(4):answer(34+i*132,743,115,chr(65+i)+':')

# 14: Übungen Atlas
head('Übungswerkstatt 2: Koordinaten','Die Modellaufgaben gehen ohne Atlas. Lösungen: Seite 17.','Jetzt bist du dran')
p(34,115,527,'<b>1.</b> Markiere <b>52° N / 8° O</b> mit einem Kreuz.<br/><b>2.</b> Lies die Koordinaten von Punkt P ab: zuerst Breite, dann Länge.',11,17)
axes(34,174,527,282,(4,16,48,55),1,2,points=[(50,10,'P')])
answer(34,475,245,'P: geografische Breite');answer(309,475,252,'P: geografische Länge')
t(34,557,'3 · Finde die vier Orte in deinem Schulatlas.',11.5,True,TEAL)
p(34,572,527,'Beginne mit der passenden Weltregion. Notiere den gefundenen Ortsnamen. Seitenzahlen sind je nach Atlas verschieden.',10.3,15)
rows=[('a','50,1° N / 14,4° O'),('b','38,7° N / 9,1° W'),('c','37,8° N / 122,4° W'),('d','23,7° S / 133,9° O')]
for i,(letter,coord) in enumerate(rows):
    yy=630+i*36;t(38,yy,f'{letter}) {coord}',10.5);line(302,yy+3,557,yy+3)
p(34,780,527,'Tipp: N/S und O/W bestimmen gemeinsam das Erdviertel. Suche nicht nur nach der Gradzahl.',8.5,12,GREY)

# 15: Lösungen 1
head('Lösungen zur Übungswerkstatt 1','Seite 14: Vergleiche die Bilder und verbessere deine eigenen Antworten.','Vergleichen')
t(34,124,'A · Die beiden Bezugslinien',12,True,TEAL)
m.reference_globe(157,222,58,'lat');m.reference_globe(430,222,58,'lon')
t(34,320,'a) Äquator',13,True,BLUE);t(309,320,'b) Nullmeridian',13,True,PURPLE)
t(34,375,'B · Höchstwerte',12,True,TEAL)
p(34,392,527,'<b>Breite: 90°.</b> Das gilt nördlich und südlich des Äquators.<br/><b>Länge: 180°.</b> Das gilt östlich und westlich des Nullmeridians.',11,17)
t(34,474,'C · Erdviertel',12,True,TEAL)
p(34,491,527,'a) N + O = <b>Nordostviertel (NO)</b>.<br/>b) S + W = <b>Südwestviertel (SW)</b>.',11,18)
t(34,565,'D · Die vier Ansichten',12,True,TEAL)
for i,(kind,label,col) in enumerate([('parallel-pole','A',BLUE),('meridian-pole','B',PURPLE),('parallel-side','C',BLUE),('meridian-side','D',PURPLE)]):m.model(44+i*132,609,109,kind,label,col)
p(34,746,527,'<b>A:</b> Breitenkreise (Ringe) · <b>B:</b> Meridiane (Speichen)<br/><b>C:</b> Breitenkreise (Linien) · <b>D:</b> Meridiane (Bögen)',10.2,16)

# 16: Lösungen 2
head('Lösungen zur Übungswerkstatt 2','Seite 15: Prüfe zuerst die Lage, dann die vollständige Schreibweise.','Vergleichen')
t(34,123,'1 · Das Kreuz und 2 · die Koordinaten von P',12,True,TEAL)
axes(34,149,527,285,(4,16,48,55),1,2,lat=52,lon=8,points=[(52,8,'Kreuz'),(50,10,'P')])
p(34,455,527,'<b>1.</b> Das Kreuz liegt am Schnittpunkt von 52° N und 8° O.<br/><b>2.</b> Punkt P liegt bei <b>50° N / 10° O</b>. Beide Richtungen gehören dazu.',11,18)
t(34,536,'3 · Die vier Orte',12,True,TEAL)
for i,(letter,coord,name,region) in enumerate([('a','50,1° N / 14,4° O','Prag','Tschechien'),('b','38,7° N / 9,1° W','Lissabon','Portugal'),('c','37,8° N / 122,4° W','San Francisco','USA'),('d','23,7° S / 133,9° O','Alice Springs','Australien')]):
    yy=569+i*36;t(34,yy,f'{letter}) {coord}',10.2);t(276,yy,name,11,True,TEAL);t(423,yy,region,9.4)
callout(735,'Die Koordinaten sind gerundet. Im Atlas kann das Ortszeichen geringfügig danebenliegen. Prüfe auch die Region und verwende eine ausreichend genaue Karte.',h=56)

# 17: Lernzettel
head('Mein Lernzettel für die Vorbereitung','Decke einzelne Antworten ab und erkläre den Rest am Bild.','Wiederholen')
card(34,122,245,101,'Breite','Äquator = 0°<br/>N oder S · höchstens 90°<br/>Breitenkreise parallel zum Äquator.',BLUE)
card(309,122,252,101,'Länge','Nullmeridian = 0°<br/>O/E oder W · höchstens 180°<br/>Meridiane verbinden die Pole.',PURPLE)
t(34,261,'Der Atlasweg in einem Satz',13,True,TEAL)
p(34,279,527,'<b>Region wählen → Breite suchen → Länge suchen → Linien verfolgen → Schnittpunkt finden → Ortsnamen und Richtungen prüfen.</b>',12,19)
t(34,363,'Vier typische Fehler vermeiden',12,True,TEAL)
for i,(bad,good) in enumerate([('Breite und Länge vertauschen.','Zuerst N/S, danach O/E/W lesen.'),('Die Richtungsbuchstaben weglassen.','20° S und 20° N sind verschiedene Lagen.'),('Planquadrat und Gradnetz verwechseln.','B3 ist ein Suchfeld; 50° N / 8° O ist eine Lage.'),('Bei gebogenen Linien einfach gerade zeichnen.','Auf der Karte dem gedruckten Gradnetz folgen.')]):
    yy=390+i*65;t(34,yy,bad,10.5,True);p(34,yy+9,527,good,10.5,16)
t(34,682,'Das kann ich vor der Klassenarbeit abhaken',12,True,TEAL)
for i,s in enumerate(['Bezugslinien, Pole, Halbkugeln und Erdviertel am Bild zeigen.','Ringe, Speichen, Linien und Bögen den Ansichten zuordnen.','Gradnetz beschriften und selbst zeichnen.','Mit Register und Koordinaten einen Ort im Atlas finden.']):
    yy=705+i*22;c.setStrokeColor(HexColor(GREY));c.rect(34,H-yy-9,9,9,fill=0,stroke=1);t(51,yy,s,9.5)

# 18: Bezug, Quellen und App
head('So passt die Schulung zur Klassenarbeit','Die Erklärungen decken die Themen der vorhandenen 18 Aufgaben ab.','Nachschlagen')
mapping=[('Aufgaben 1-2','Bezugslinien, Breite, Länge und Gradzahlen','2-3'),('Aufgaben 3-4, 12, 18','Erdviertel bestimmen und benennen','4'),('Aufgaben 5-6, 13, 16','Vier Ansichten; Draufsicht und Seitenansicht','5-6'),('Aufgaben 7-10','Schnittpunkt, Ablesen, Register und Ortssuche','8-12'),('Aufgaben 11, 14-15, 17','Beschriftungen, Merksätze und eigene Zeichnungen','2-7'),('Üben und vergleichen','Eigene Antworten und vollständige Lösungen','14-17')]
for i,(a,b,pages) in enumerate(mapping):
    yy=128+i*48;t(34,yy,a,9.6,True,TEAL);t(199,yy,b,9.1);t(199,yy+16,'Schulungsseiten '+pages,8.5,color=GREY)
t(34,443,'Fachliche Grundlagen und Herkunft der Bilder',12,True,TEAL)
sources=[('NOAA: Latitude / Longitude','https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html'),('NOAA: What is latitude?','https://oceanservice.noaa.gov/facts/latitude.html'),('NGA Geomatics: Coordinate Systems (Grad und Minuten)','https://earth-info.nga.mil/?action=coordsys&dir=coordsys')]
for i,(name,url) in enumerate(sources):
    p(34,463+i*31,527,f'<link href="{url.replace("&","&amp;")}" color="{BLUE}">{name}</link>',9,13)
p(34,565,527,'Eigene Modellgrafiken aus dem bestehenden Erdkunde-Projekt; Unterrichtsskizzen nach den eingereichten Vorlagen. Vereinfachte Küsten: Natural Earth (Public Domain). Ortslagen aus den Projektdaten, gerundet auf 0,1°; unter anderem GeoNames (CC BY 4.0) sowie für Alice Springs das amtliche Ortsnamenregister des Northern Territory. Fachlicher Quellenabgleich: 29.10.2026.',8.5,12,GREY)
app='https://adrakir.github.io/Lernprogramme/erdkunde/Erdkunde_Entdecker_Klasse5_V11/'
rect(34,660,527,129,'#EDF6F3');t(47,682,'Mit der vorhandenen App weiterüben',11,True,TEAL)
p(47,697,375,'Öffne <b>Gradnetz &amp; Atlas</b> und dann <b>Klassenarbeit</b>. Dort bearbeitest du die 18 Aufgaben interaktiv. Nach der Abgabe kannst du Bilder und animierte Lösungswege vergleichen.',10,15)
p(47,756,375,f'<link href="{app}" color="{BLUE}">Erdkunde-App direkt über GitHub Pages öffnen</link>',9.3,13)
qr=QrCodeWidget(app);b=qr.getBounds();size=83;d=Drawing(size,size,transform=[size/(b[2]-b[0]),0,0,size/(b[3]-b[1]),0,0]);d.add(qr);renderPDF.draw(d,c,463,H-764)

assert c.getPageNumber()==N,c.getPageNumber()
c.save()
print(OUT)
