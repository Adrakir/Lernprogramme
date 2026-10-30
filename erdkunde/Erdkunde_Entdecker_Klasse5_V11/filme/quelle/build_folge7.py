#!/usr/bin/env python3
"""Paul & Gustav Folge 7: eigenes reproduzierbares Lernvideo (Python/ffmpeg)."""
import os, math, subprocess, functools, random
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.io import wavfile
from scipy.signal import resample_poly
from mpl_toolkits.basemap import Basemap
OUT=Path(os.environ.get('GUSTAV_VIDEO_OUT','/mnt/data'))
TMP=Path(os.environ.get('GUSTAV_VIDEO_TMP','/mnt/data/erdkunde_folge7'))
OUT.mkdir(parents=True,exist_ok=True); TMP.mkdir(parents=True,exist_ok=True)
W,H,FPS,R=1280,720,12,225
CX,CY=333,357
FA='/usr/share/fonts/truetype/lato/Lato-Bold.ttf';FB='/usr/share/fonts/truetype/lato/Lato-Regular.ttf'
if not Path(FA).exists():FA='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';FB='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=lambda size,b=False:ImageFont.truetype(FA if b else FB,size)
RED=(255,133,118,255); MINT=(111,239,186,255); YELLOW=(255,220,113,255); WHITE=(248,253,255,255)
# Figur, Dialog, Erklärüberschrift, Lehrhinweis, Grafikmodus, Blickrichtung (lat,lon)
SCENES=[
 ('Paul','Herr Welt, ich kenne die Koordinaten. Aber wie finde ich den Ort jetzt in einem Atlas?','Orte im Atlas finden','Gustav hilft Schritt für Schritt.','intro',(36,-15)),
 ('Herr Welt','Zuerst wählen wir im Inhaltsverzeichnis eine passende Karte. Für unser Beispiel ist das eine Deutschlandkarte.','1. Richtige Karte wählen','Inhaltsverzeichnis → Deutschlandkarte','index',(36,-15)),
 ('Gustav','Schau am Kartenrand! Dort stehen Breiten- und Längengrade. Die Linien im Kartenbild bilden das Gradnetz.','2. Kartenrand ansehen','Beschriftungen und Gradnetz beachten','atlas',(33,-12)),
 ('Paul','Ich suche die Gegend um Hannover. Als grobe Koordinaten nehmen wir zweiundfünfzig Grad Nord und zehn Grad Ost.','Unser Beispiel: Hannover','ungefähr 52° N, 10° O','task',(35,-14)),
 ('Gustav','Merke dir unbedingt: Wir suchen zuerst den Breitengrad und erst danach den Längengrad.','Die richtige Reihenfolge','1. Breite  →  2. Länge','rule',(35,-14)),
 ('Gustav','Schritt eins: Suche am linken oder rechten Kartenrand zweiundfünfzig Grad nördlicher Breite. Folge der roten Linie.','Schritt 1: Breitengrad','52° N am Kartenrand suchen','step1',(34,-11)),
 ('Paul','Jetzt habe ich den Breitenkreis gefunden. Was mache ich als Nächstes?','Paul ist bereit','Der rote Breitenkreis ist gefunden.','step1',(33,-14)),
 ('Gustav','Schritt zwei: Suche oben oder unten zehn Grad östlicher Länge. Folge dem grünen Meridian.','Schritt 2: Längengrad','10° O am Kartenrand suchen','step2',(32,-14)),
 ('Gustav','Dort, wo sich der rote Breitenkreis und der grüne Meridian treffen, liegt unser gesuchter Punkt.','Schritt 3: Schnittpunkt','52° N  +  10° O  =  Schnittpunkt','intersection',(33,-14)),
 ('Herr Welt','Die Stadt Hannover liegt ganz in der Nähe. Gerundete Gradangaben zeigen die ungefähre Lage, nicht jede Straße.','Ungefähr bei Hannover','Hannover ≈ 52,4° N · 9,7° O','hannover',(33,-14)),
 ('Paul','Aber in manchen Atlanten sind die Meridiane krumm. Muss ich eine gerade Linie ziehen?','Paul fragt nach','Meridiane können gebogen aussehen.','curve',(39,-12)),
 ('Gustav','Nein, Paul! Die Darstellung hängt von der Kartenprojektion ab. Verfolge immer dieselbe gebogene Meridianlinie bis zum Breitenkreis.','Gebogene Meridiane','Der Linie folgen – nicht abkürzen!','trace',(39,-12)),
 ('Herr Welt','Nicht jeder Grad ist eingezeichnet. Liegt dein Wert zwischen zwei Linien, musst du den Abstand sorgfältig abschätzen.','Zwischen den Linien','Gradzahlen am Rand vergleichen','between',(34,-12)),
 ('Paul','Und jetzt probiere ich es selbst: Punkt B liegt bei fünfzig Grad Nord und zwölf Grad Ost. Was suche ich zuerst?','Deine Mitmachfrage','Punkt B: 50° N, 12° O','quiz',(34,-12)),
 ('Gustav','Zuerst fünfzig Grad Nord, dann zwölf Grad Ost. Und schließlich den Schnittpunkt! Sehr gut!','Richtig – geschafft!','Erst Breite · dann Länge · dann Punkt','answer',(34,-12)),
]
print('Erstelle geografische Basiskarte ...',flush=True)
base=Basemap(projection='cyl',llcrnrlon=-180,urcrnrlon=180,llcrnrlat=-90,urcrnrlat=90,resolution='c')
mask=Image.new('L',(1440,720),0);dr=ImageDraw.Draw(mask)
for poly in base.landpolygons:
 pts=[((float(a)+180)*4,(90-float(b))*4) for a,b in poly.get_coords()]
 if len(pts)>2:dr.polygon(pts,fill=255)
LAND=np.asarray(mask,dtype=np.uint8)
SZ=2*R+2
YY,XX=np.mgrid[0:SZ,0:SZ]
FX=(XX-R)/R; FY=(R-YY)/R
RR=FX*FX+FY*FY;FZ=np.sqrt(np.maximum(0,1-RR)); INSIDE=RR<=1
ALPHA=np.uint8(np.clip((1.005-np.sqrt(RR))*R,0,1)*255)
SHADE=.78+.20*FZ+.045*(-FX)

def project(lat,lon,camlat,camlon):
 la=np.radians(lat);dl=np.radians(lon-camlon);phi=math.radians(camlat)
 x=np.cos(la)*np.sin(dl)
 y=np.sin(la)*math.cos(phi)-np.cos(la)*np.cos(dl)*math.sin(phi)
 z=np.sin(la)*math.sin(phi)+np.cos(la)*np.cos(dl)*math.cos(phi)
 return x,y,z

def line_geo(d,lats,lons,camlat,camlon,color,width=3):
 x,y,z=project(np.asarray(lats),np.asarray(lons),camlat,camlon)
 prev=None
 for xx,yy,zz in zip(x,y,z):
  if zz>.0005:
   xy=(round(R+R*xx),round(R-R*yy))
   if prev is not None and abs(prev[0]-xy[0])+abs(prev[1]-xy[1])<R*.15:d.line((prev,xy),fill=color,width=width)
   prev=xy
  else:prev=None

def marker(d,la,lo,camlat,camlon,r=9,col=YELLOW):
 x,y,z=project(la,lo,camlat,camlon)
 if z>0:
  xx,yy=R+R*float(x),R-R*float(y)
  d.ellipse((xx-r-5,yy-r-5,xx+r+5,yy+r+5),fill=(255,231,115,65),outline=(255,235,183,170),width=2)
  d.ellipse((xx-r,yy-r,xx+r,yy+r),fill=col,outline=(255,255,255,255),width=3)
 return x,y,z

@functools.lru_cache(maxsize=150)
def globe(camlat,camlon,mode,phase=0):
 camlat=float(camlat);camlon=float(camlon);phi=math.radians(camlat)
 slat=FY*math.cos(phi)+FZ*math.sin(phi)
 lat=np.degrees(np.arcsin(np.clip(slat,-1,1)))
 dl=np.arctan2(FX,FZ*math.cos(phi)-FY*math.sin(phi))
 lon=((np.degrees(dl)+camlon+180)%360)-180
 xi=np.clip(np.floor((lon+180)*4).astype(int),0,1439)
 yi=np.clip(np.floor((90-lat)*4).astype(int),0,719)
 is_land=LAND[yi,xi]>128
 colors=np.where(is_land[...,None],np.array([77.,171.,136.]),np.array([24.,100.,167.])).astype(np.float32)
 colors*=SHADE[...,None]
 colors+=np.exp(-((FX+.38)**2+(FY-.33)**2)/.12)[...,None]*18
 rgb=np.clip(colors,0,255).astype(np.uint8)
 rgba=np.dstack((rgb,ALPHA));rgba[~INSIDE,3]=0
 im=Image.fromarray(rgba,'RGBA');d=ImageDraw.Draw(im,'RGBA')
 # thin reference lines, 30° grid; all are genuine globe projections
 for lo in range(-150,181,30):
  las=np.linspace(-90,90,361);line_geo(d,las,np.full_like(las,lo),camlat,camlon,(215,244,255,114),2)
 for la in (-60,-30,0,30,60):
  ls=np.linspace(-180,180,721);line_geo(d,np.full_like(ls,la),ls,camlat,camlon,(224,244,252,109),2)
 ls=np.linspace(-180,180,721);las=np.linspace(-90,90,361)
 if mode in ('latitude','step1','intersection','curve','trace','quiz','answer','example'):
  line_geo(d,np.zeros_like(ls),ls,camlat,camlon,RED,5)
 if mode=='latitude':
  for la in (30,60,-30):line_geo(d,np.full_like(ls,la),ls,camlat,camlon,(255,184,164,210),3)
 if mode in ('step1','step2','intersection','curve','trace','quiz','answer','example'):
  # true 52-degree north parallel, displayed in red
  line_geo(d,np.full_like(ls,52),ls,camlat,camlon,(255,107,109,255),6)
 if mode in ('longitude','step2','intersection','curve','trace','quiz','answer','example'):
  line_geo(d,las,np.zeros_like(las),camlat,camlon,(184,255,222,225),3)
 if mode in ('step2','intersection','curve','trace','quiz','answer','example'):
  line_geo(d,las,np.full_like(las,10),camlat,camlon,(103,255,160,255),6)
 if mode in ('intersection','curve','trace','quiz','answer','example'):
  marker(d,52,10,camlat,camlon,9 if mode!='intersection' else 12)
 if mode=='trace':
  # yellow dot travels along fixed 10E meridian from 83N toward 52N
  latpoint=82-(30*phase/10)
  marker(d,latpoint,10,camlat,camlon,6,(255,245,155,255))
 return im

bg=Image.new('RGBA',(W,H),(5,21,41,255));bd=ImageDraw.Draw(bg,'RGBA')
for y in range(H):
 z=y/H;bd.line((0,y,W,y),fill=(int(12-7*z),int(39-18*z),int(74-23*z),255))
random.seed(4)
for _ in range(70):
 x=random.randrange(W);y=random.randrange(H);bd.ellipse((x,y,x+2,y+2),fill=(166,231,245,68))

def txtfit(d,t,sz,maxwidth,bold=False):
 while sz>18 and d.textbbox((0,0),t,font=font(sz,bold))[2]>maxwidth:sz-=1
 return font(sz,bold)

def wrapped(d,text,f,maxwidth):
 words=text.split();out=[];line=''
 for word in words:
  tryline=(line+' '+word).strip()
  if d.textbbox((0,0),tryline,font=f)[2]>maxwidth and line:out.append(line);line=word
  else:line=tryline
 if line:out.append(line)
 return out

def paul(d,x,y):
 d.ellipse((x-34,y-88,x+34,y-22),fill=(246,193,150))
 d.pieslice((x-37,y-92,x+36,y-27),190,353,fill=(255,204,81))
 d.polygon(((x-33,y-65),(x-15,y-102),(x+3,y-85),(x+22,y-96),(x+35,y-67)),fill=(248,207,86))
 for xx in (-14,13):d.ellipse((x+xx-3,y-60,x+xx+3,y-54),fill=(20,50,72))
 d.arc((x-12,y-46,x+13,y-33),0,150,fill=(99,56,46),width=2)
 d.rounded_rectangle((x-43,y-18,x+43,y+73),radius=16,fill=(41,127,207),outline=(134,216,244),width=3)

def welt(d,x,y):
 d.ellipse((x-33,y-88,x+33,y-22),fill=(239,186,142))
 d.pieslice((x-35,y-96,x+35,y-30),185,352,fill=(75,79,90))
 for xx in (-14,14):d.ellipse((x+xx-10,y-65,x+xx+10,y-46),outline=(28,48,65),width=3)
 d.line((x-5,y-58,x+5,y-58),fill=(28,48,65),width=2)
 d.arc((x-11,y-47,x+11,y-35),0,180,fill=(112,58,54),width=2)
 d.rounded_rectangle((x-43,y-18,x+43,y+73),radius=17,fill=(45,144,129),outline=(102,226,191),width=3)

def gustav(d,x,y):
 d.ellipse((x-52,y-57,x+52,y+47),fill=(38,137,190),outline=(147,235,226),width=4)
 for xx in (-25,25): d.arc((x+xx-23,y-54,x+xx+23,y+45),80,280,fill=(137,230,221),width=2)
 d.arc((x-50,y-18,x+50,y+22),0,180,fill=(143,225,226),width=2)
 for xx in (-20,20):
  d.ellipse((x+xx-12,y-24,x+xx+12,y+2),fill=(255,255,255));d.ellipse((x+xx-3,y-16,x+xx+4,y-8),fill=(12,46,79))
 d.arc((x-19,y-2,x+18,y+24),0,160,fill=(22,43,55),width=4)

def pill(d,xy,s,fill,fg,size=21):
 x,y=xy;ff=font(size,True);w=int(d.textbbox((0,0),s,font=ff)[2])+35
 d.rounded_rectangle((x,y,x+w,y+43),radius=14,fill=fill)
 d.text((x+16,y+10),s,font=ff,fill=fg)
 return w

def panel(d,i,mode,title,point):
 d.rounded_rectangle((667,146,1234,577),radius=23,fill=(7,33,57,238),outline=(80,160,181,175),width=2)
 d.text((698,170),title,font=txtfit(d,title,34,507,True),fill=(244,253,255))
 d.line((698,225,1202,225),fill=(94,211,184,255),width=5)
 for j,line in enumerate(wrapped(d,point,font(25),494)[:2]):d.text((698,243+j*36),line,font=font(25),fill=(200,230,245))
 if mode in ('intro','grid','pause'):
  paul(d,765,451);welt(d,937,451);gustav(d,1114,444)
  pill(d,(717,538),'PAUL FRAGT • GUSTAV ERKLÄRT',(25,69,86,245),WHITE,16)
 elif mode=='latitude':
  pill(d,(706,337),'BREITE = NORD / SÜD',(78,68,85,255),WHITE,22)
  for k,(v,y) in enumerate([('90° N: Nordpol',395),('0°: Äquator',450),('90° S: Südpol',504)]):
   d.text((732,y),v,font=font(24,True),fill=(255,209,196) if k==1 else (227,242,255))
 elif mode=='longitude':
  pill(d,(707,338),'LÄNGE = OST / WEST',(23,87,83,255),WHITE,22)
  d.text((729,400),'0°: Nullmeridian',font=font(26,True),fill=(187,248,217))
  d.text((729,449),'Ost = O    ·    West = W',font=font(23),fill=(224,238,248))
  d.text((729,502),'Vom Nordpol zum Südpol',font=font(20),fill=(179,222,238))
 elif mode in ('example','step1','step2','intersection','curve','trace','quiz','answer'):
  if mode=='quiz':
   pill(d,(705,331),'WAS ZUERST?',(47,82,102,255),WHITE,24)
   d.text((731,406),'A  52° N (Breite)',font=font(26,True),fill=(255,183,183))
   d.text((731,461),'B  10° O (Länge)',font=font(26,True),fill=(149,245,191))
   d.text((733,523),'Denk kurz nach …',font=font(21),fill=(235,226,160))
  elif mode=='answer':
   pill(d,(706,335),'✓ 52° N → 10° O',(29,119,92,255),WHITE,28)
   d.text((730,416),'1. Breitengrad suchen',font=font(24),fill=(255,199,197))
   d.text((730,467),'2. Längengrad suchen',font=font(24),fill=(176,253,205))
   d.text((730,518),'3. Schnittpunkt finden',font=font(24),fill=(253,233,150))
  else:
   a='52° N';b='10° O';aon=mode in ('step1','intersection','curve','trace','example');bon=mode in ('step2','intersection','curve','trace','example')
   pill(d,(714,342),'1  BREITE',(96,52,61,255),WHITE,22)
   d.text((966,344),a,font=font(31,True),fill=(255,157,146) if aon else (126,145,154))
   pill(d,(714,410),'2  LÄNGE',(25,87,73,255),WHITE,22)
   d.text((969,412),b,font=font(31,True),fill=(112,247,178) if bon else (126,145,154))
   d.rounded_rectangle((715,490,1197,547),radius=14,fill=(26,66,89,245))
   message=('Schnittpunkt: 52° N, 10° O' if mode in ('intersection','example') else 'Gekrümmte Linie weiterverfolgen!' if mode in ('curve','trace') else 'Zuerst den Breitenkreis!' if mode=='step1' else 'Jetzt den Meridian!')
   d.text((728,506),message,font=txtfit(d,message,23,451,True),fill=(231,246,254))

BORDERS=[{'name': 'France', 'pts': [[5.898, 49.443], [6.658, 49.202], [8.099, 49.018], [7.594, 48.333], [7.467, 47.621], [7.192, 47.45], [6.737, 47.542], [6.769, 47.288], [6.037, 46.726], [6.023, 46.273], [6.5, 46.43], [6.844, 45.991], [6.802, 45.709], [7.097, 45.333], [6.75, 45.029], [7.008, 44.255], [7.55, 44.128], [7.435, 43.694], [6.529, 43.129], [4.557, 43.4], [3.1, 43.075], [2.986, 42.473], [1.827, 42.343], [0.702, 42.796], [0.338, 42.58], [-1.503, 43.034], [-1.901, 43.423], [-1.384, 44.023], [-1.194, 46.015], [-2.963, 47.57], [-4.492, 47.955], [-4.592, 48.684], [-3.296, 48.902], [-1.617, 48.644], [-1.933, 49.776], [-0.989, 49.347], [1.339, 50.127], [1.639, 50.947], [2.514, 51.149], [2.658, 50.797], [3.123, 50.78], [4.286, 49.907], [4.799, 49.985], [5.898, 49.443]]}, {'name': 'Sweden', 'pts': [[11.027, 58.856], [12.3, 60.118], [12.631, 61.294], [11.992, 61.8], [11.931, 63.128], [12.58, 64.066], [13.572, 64.049], [13.92, 64.445], [13.556, 64.787], [16.769, 68.014], [17.729, 68.011], [17.994, 68.567], [19.879, 68.407], [20.025, 69.065], [20.646, 69.106], [23.539, 67.936], [23.566, 66.396], [23.903, 66.007], [22.183, 65.724], [21.214, 65.026], [21.37, 64.414], [17.848, 62.749], [17.12, 61.341], [17.831, 60.637], [18.788, 60.082], [17.869, 58.954], [16.829, 58.72], [16.448, 57.041], [15.88, 56.104], [14.667, 56.201], [14.101, 55.408], [12.943, 55.362], [12.625, 56.307], [11.027, 58.856]]}, {'name': 'Poland', 'pts': [[23.484, 53.912], [23.799, 52.691], [23.199, 52.487], [24.03, 50.705], [23.923, 50.425], [23.427, 50.309], [22.518, 49.477], [22.776, 49.027], [21.608, 49.47], [20.888, 49.329], [20.416, 49.431], [19.825, 49.217], [19.321, 49.572], [18.91, 49.436], [18.393, 49.989], [17.649, 50.049], [17.555, 50.362], [16.869, 50.474], [16.719, 50.216], [16.176, 50.423], [16.239, 50.698], [15.491, 50.785], [15.017, 51.107], [14.607, 51.745], [14.685, 52.09], [14.438, 52.625], [14.075, 52.981], [14.353, 53.248], [14.12, 53.757], [17.623, 54.852], [18.621, 54.683], [18.696, 54.439], [22.731, 54.328], [23.244, 54.221], [23.484, 53.912]]}, {'name': 'Austria', 'pts': [[16.96, 48.597], [16.904, 47.715], [16.341, 47.713], [16.534, 47.496], [16.012, 46.684], [15.137, 46.659], [14.632, 46.432], [12.376, 46.768], [12.153, 47.115], [11.165, 46.942], [11.049, 46.751], [9.48, 47.103], [9.594, 47.525], [9.896, 47.58], [10.402, 47.302], [10.545, 47.566], [11.426, 47.524], [12.141, 47.703], [12.933, 47.468], [12.884, 48.289], [13.243, 48.416], [13.596, 48.877], [14.339, 48.555], [15.253, 49.039], [16.03, 48.734], [16.499, 48.786], [16.96, 48.597]]}, {'name': 'Hungary', 'pts': [[22.086, 48.422], [22.641, 48.15], [22.711, 47.882], [22.1, 47.672], [21.022, 46.316], [19.596, 46.172], [18.456, 45.759], [17.63, 45.952], [16.202, 46.852], [16.534, 47.496], [16.341, 47.713], [16.904, 47.715], [16.98, 48.123], [17.857, 47.758], [20.239, 48.328], [20.801, 48.624], [21.872, 48.32], [22.086, 48.422]]}, {'name': 'Germany', 'pts': [[14.12, 53.757], [14.353, 53.248], [14.075, 52.981], [14.438, 52.625], [14.685, 52.09], [14.607, 51.745], [15.017, 51.107], [14.571, 51.002], [14.307, 51.117], [12.24, 50.266], [12.521, 49.547], [13.596, 48.877], [13.243, 48.416], [12.884, 48.289], [12.933, 47.468], [12.141, 47.703], [11.426, 47.524], [10.545, 47.566], [10.402, 47.302], [9.896, 47.58], [8.523, 47.831], [8.317, 47.614], [7.467, 47.621], [7.594, 48.333], [8.099, 49.018], [6.658, 49.202], [6.186, 49.464], [6.243, 49.902], [6.043, 50.128], [6.157, 50.804], [5.989, 51.852], [6.589, 51.852], [6.843, 52.228], [7.092, 53.144], [6.905, 53.482], [7.1, 53.694], [7.936, 53.748], [8.122, 53.528], [8.801, 54.021], [8.572, 54.396], [8.526, 54.963], [9.282, 54.831], [9.922, 54.983], [9.94, 54.597], [10.95, 54.364], [10.939, 54.009], [12.518, 54.47], [14.12, 53.757]]}, {'name': 'Switzerland', 'pts': [[9.594, 47.525], [9.48, 47.103], [10.443, 46.894], [10.363, 46.484], [9.923, 46.315], [9.183, 46.44], [8.966, 46.037], [8.49, 46.005], [8.317, 46.164], [7.756, 45.824], [7.274, 45.777], [6.844, 45.991], [6.5, 46.43], [6.023, 46.273], [6.037, 46.726], [6.769, 47.288], [6.737, 47.542], [7.192, 47.45], [7.467, 47.621], [8.317, 47.614], [8.523, 47.831], [9.594, 47.525]]}, {'name': 'Luxembourg', 'pts': [[6.043, 50.128], [6.243, 49.902], [6.186, 49.464], [5.674, 49.529], [5.782, 50.09], [6.043, 50.128]]}, {'name': 'Belgium', 'pts': [[6.157, 50.804], [6.043, 50.128], [5.782, 50.09], [5.674, 49.529], [4.799, 49.985], [4.286, 49.907], [3.123, 50.78], [2.658, 50.797], [2.514, 51.149], [4.974, 51.475], [6.157, 50.804]]}, {'name': 'Netherlands', 'pts': [[6.905, 53.482], [7.092, 53.144], [6.843, 52.228], [6.589, 51.852], [5.989, 51.852], [6.157, 50.804], [4.974, 51.475], [4.047, 51.267], [3.315, 51.346], [3.83, 51.621], [4.706, 53.092], [6.074, 53.51], [6.905, 53.482]]}, {'name': 'Italy', 'pts': [[10.443, 46.894], [11.049, 46.751], [11.165, 46.942], [12.153, 47.115], [12.376, 46.768], [13.806, 46.509], [13.698, 46.017], [13.938, 45.591], [13.142, 45.737], [12.329, 45.382], [12.261, 44.6], [12.589, 44.091], [13.527, 43.588], [14.03, 42.761], [15.143, 41.955], [15.926, 41.961], [16.17, 41.74], [15.889, 41.541], [18.377, 40.356], [18.48, 40.169], [18.293, 39.811], [17.738, 40.278], [16.87, 40.442], [16.449, 39.795], [17.171, 39.425], [17.053, 38.903], [16.635, 38.844], [16.101, 37.986], [15.684, 37.909], [15.892, 38.751], [16.109, 38.965], [15.414, 40.048], [14.998, 40.173], [14.703, 40.605], [14.061, 40.786], [13.628, 41.188], [12.888, 41.253], [11.192, 42.355], [10.512, 42.931], [10.2, 43.92], [8.889, 44.366], [7.435, 43.694], [7.55, 44.128], [7.008, 44.255], [6.75, 45.029], [7.097, 45.333], [6.802, 45.709], [6.844, 45.991], [7.274, 45.777], [7.756, 45.824], [8.317, 46.164], [8.49, 46.005], [8.966, 46.037], [9.183, 46.44], [9.923, 46.315], [10.363, 46.484], [10.443, 46.894]]}, {'name': 'Denmark', 'pts': [[9.922, 54.983], [9.282, 54.831], [8.526, 54.963], [8.12, 55.518], [8.09, 56.54], [8.543, 57.11], [9.424, 57.172], [10.58, 57.73], [10.546, 57.216], [10.25, 56.89], [10.37, 56.61], [10.912, 56.459], [10.668, 56.081], [10.37, 56.19], [9.65, 55.47], [9.922, 54.983]]}, {'name': 'Denmark', 'pts': [[12.371, 56.111], [12.69, 55.61], [12.09, 54.8], [11.044, 55.365], [10.904, 55.78], [12.371, 56.111]]}, {'name': 'Slovakia', 'pts': [[22.558, 49.086], [21.872, 48.32], [20.801, 48.624], [20.239, 48.328], [17.857, 47.758], [16.98, 48.123], [16.88, 48.47], [17.102, 48.817], [17.886, 48.903], [18.555, 49.495], [19.321, 49.572], [19.825, 49.217], [20.416, 49.431], [20.888, 49.329], [21.608, 49.47], [22.558, 49.086]]}, {'name': 'Czechia', 'pts': [[15.017, 51.107], [15.491, 50.785], [16.239, 50.698], [16.176, 50.423], [16.719, 50.216], [16.869, 50.474], [17.555, 50.362], [17.649, 50.049], [18.393, 49.989], [18.853, 49.496], [18.17, 49.272], [17.886, 48.903], [17.102, 48.817], [16.96, 48.597], [15.253, 49.039], [14.339, 48.555], [12.521, 49.547], [12.24, 50.266], [14.307, 51.117], [14.571, 51.002], [15.017, 51.107]]}]

# Schematische, geografisch lagegetreue Atlaszeichnung: Längengrad von links nach rechts,
# Breitengrad von unten nach oben; Kartenrand zeigt echte geografische Koordinaten.
MAP_X,MAP_Y,MAP_W,MAP_H=98,198,578,321
MINLON,MAXLON=5,16
MINLAT,MAXLAT=48,56

def mx(lon):return MAP_X+(lon-MINLON)/(MAXLON-MINLON)*MAP_W
def my(lat):return MAP_Y+(MAXLAT-lat)/(MAXLAT-MINLAT)*MAP_H

map_background=Image.new('RGBA',(W,H),(0,0,0,0))
md=ImageDraw.Draw(map_background,'RGBA')
md.rounded_rectangle((31,135,736,578),radius=22,fill=(8,30,53,252),outline=(100,189,193,156),width=2)
md.rectangle((MAP_X,MAP_Y,MAP_X+MAP_W,MAP_Y+MAP_H),fill=(26,103,157),outline=(199,242,254),width=3)
country_layer=Image.new('RGBA',(W,H),(0,0,0,0))
cd=ImageDraw.Draw(country_layer,'RGBA')
for item in BORDERS:
 pts=[(mx(x),my(y)) for x,y in item['pts']]
 if len(pts)>2:
  cd.polygon(pts,fill=(98,165,119,255),outline=(39,95,92,255),width=1)
# Clip land and national borders to the atlas panel; never paint over the title or subtitles.
map_background.alpha_composite(country_layer.crop((MAP_X,MAP_Y,MAP_X+MAP_W,MAP_Y+MAP_H)),(MAP_X,MAP_Y))
md=ImageDraw.Draw(map_background,'RGBA')
# draw background grid; degree labels are exactly aligned to their geographic lines
for lon in range(5,17):
 x=round(mx(lon)); md.line((x,MAP_Y,x,MAP_Y+MAP_H),fill=(233,244,253,88),width=1)
 if lon%2==0:md.text((x-14,MAP_Y-33),f'{lon}°O',font=font(17,True),fill=(232,249,255))
for lat in range(48,57):
 y=round(my(lat));md.line((MAP_X,y,MAP_X+MAP_W,y),fill=(230,244,252,94),width=1)
 if lat%2==0:md.text((MAP_X-65,y-12),f'{lat}°N',font=font(17,True),fill=(231,245,252))
md.text((MAP_X+MAP_W/2-58,MAP_Y+MAP_H+13),'DEUTSCHLAND',font=font(20,True),fill=(217,249,251))
md.text((MAP_X+MAP_W-204,MAP_Y+12),'Atlas – Kartenausschnitt',font=font(16,True),fill=(252,253,254))

# TTS-generated audio, multiple voices differentiated by role.
def panel_for_scene(img, i, scene, nframes, j):
 role,speech,title,info,mode,(caml,camlo)=scene
 d=ImageDraw.Draw(img,'RGBA')
 d.rounded_rectangle((754,141,1241,579),radius=24,fill=(6,31,57,249),outline=(106,208,200,165),width=2)
 d.text((781,174),title,font=txtfit(d,title,32,432,True),fill=WHITE)
 d.line((783,226,1214,226),fill=(106,229,189),width=4)
 for k,ln in enumerate(wrapped(d,info,font(24),426)[:3]):d.text((785,252+k*37),ln,font=font(24),fill=(200,231,245))
 if mode=='intro':
  paul(d,824,448);welt(d,986,448);gustav(d,1131,442)
 elif mode=='index':
  for k,s in enumerate(['INHALTSVERZEICHNIS','Europa .......... 12','Deutschland .... 20','Asien ........... 34']):
   d.text((806,338+k*47),s,font=font(21,True) if k==0 else font(20),fill=(255,227,157) if k==2 else WHITE)
 elif mode in ('atlas','task','rule'):
  a=['Karte und Rand lesen','52° N  =  Breitengrad','10° O  =  Längengrad']
  for k,s in enumerate(a):
   fill=YELLOW if k==0 else (RED if k==1 else MINT)
   d.text((796,352+k*59),s,font=font(22,True),fill=fill)
 elif mode in ('step1','step2','intersection','hannover','curve','trace','between','quiz','answer'):
  d.rounded_rectangle((782,337,1210,529),radius=20,fill=(17,53,78,225),outline=(86,157,171,128),width=2)
  if mode=='quiz':
   d.text((802,363),'Was suchst du zuerst?',font=font(25,True),fill=WHITE)
   d.text((811,422),'A   50° N – Breite',font=font(23,True),fill=RED)
   d.text((811,472),'B   12° O – Länge',font=font(23,True),fill=MINT)
  elif mode=='answer':
   for k,s in enumerate(['1   50° N (Breite)','2   12° O (Länge)','3   Schnittpunkt']):d.text((801,359+53*k),s,font=font(23,True),fill=(RED if k==0 else MINT if k==1 else YELLOW))
  elif mode in ('curve','trace'):
   d.text((811,357),'GEBOGEN ≠ FALSCH',font=font(25,True),fill=YELLOW)
   d.text((809,412),'Der Meridian bleibt',font=font(22),fill=WHITE)
   d.text((809,450),'auf der Karte derselbe.',font=font(22),fill=WHITE)
  elif mode=='between':
   d.text((806,364),'52° liegt zwischen …?',font=font(24,True),fill=WHITE)
   d.text((808,427),'51° N  |  52° N  |  53° N',font=font(20,True),fill=RED)
   d.text((808,483),'Bei Bedarf abschätzen.',font=font(20),fill=WHITE)
  else:
   for k,s in enumerate(['1  BREITE: 52° N','2  LÄNGE: 10° O','3  SCHNITTPUNKT']):
    active=(k==0 if mode=='step1' else k<2 if mode=='step2' else True)
    d.text((812,356+k*54),s,font=font(24,True),fill=(RED if k==0 else MINT if k==1 else YELLOW) if active else (130,156,168))


def curved_demo(d, phase=0):
 # Accurate conceptual demonstration of a curved geographic graticule on a projected map.
 # Show *one continuous* curved meridian; red parallel crosses it exactly once.
 d.rounded_rectangle((90,184,694,538),radius=9,fill=(20,102,154),outline=(221,246,255),width=3)
 for lonoffset in [-155,-60,50,151]:
  pts=[]
  for y in range(204,517,3):
   xn=360+lonoffset + .0007*(y-347)**2 - .07*(y-347)
   pts.append((xn,y))
  d.line(pts,fill=(156,244,198,160),width=3,joint='curve')
 yy=363;d.line((101,yy,683,yy),fill=RED,width=7)
 pts=[]
 for y in range(199,523,2):
  x=394 + .0013*(y-357)**2-.11*(y-357)
  pts.append((x,y))
 d.line(pts,fill=MINT,width=7,joint='curve')
 ydot=yy;x=394+.0013*(ydot-357)**2-.11*(ydot-357)
 d.ellipse((x-13,ydot-13,x+13,ydot+13),fill=YELLOW,outline=WHITE,width=3)
 d.text((137,207),'Schematische Kartenprojektion',font=font(22,True),fill=WHITE)
 d.text((120,493),'Meridian: grün     Breitenkreis: rot',font=font(20,True),fill=WHITE)


def render(i,j,nframes):
 scene=SCENES[i];role,speech,title,info,mode,(camlat,camlon)=scene
 frame=bg.copy();d=ImageDraw.Draw(frame,'RGBA')
 d.rounded_rectangle((35,28,665,72),radius=17,fill=(17,75,92,235),outline=(111,207,205,140),width=2)
 d.text((51,41),'ERDKUNDE MIT PAUL & GUSTAV GLOBUS',font=font(19,True),fill=(232,253,249))
 d.rounded_rectangle((1092,26,1244,68),radius=17,fill=(48,123,147))
 d.text((1106,37),'FOLGE 07',font=font(20,True),fill=WHITE)
 d.text((47,91),'Orte im Atlas finden',font=font(38,True),fill=WHITE)
 if mode=='intro':
  d.rounded_rectangle((31,135,736,578),radius=24,fill=(6,33,58,170),outline=(116,181,177,130),width=2)
  g=globe(27,-25,'grid',0);frame.alpha_composite(g,(351-R,355-R));d=ImageDraw.Draw(frame,'RGBA')
 elif mode in ('curve','trace'):
  d.rounded_rectangle((31,135,736,578),radius=22,fill=(10,39,65),outline=(86,149,172),width=2)
  curved_demo(d,min(10,j//10))
 else:
  frame.alpha_composite(map_background);d=ImageDraw.Draw(frame,'RGBA')
  # school atlas: horizontal red parallels and vertical green meridians, frame ticks.
  if mode in ('step1','step2','intersection','hannover','quiz','answer'):
   lat=50 if mode in ('quiz','answer') else 52
   y=round(my(lat));d.line((MAP_X,y,MAP_X+MAP_W,y),fill=RED,width=7)
   d.rounded_rectangle((36,y-20,101,y+22),radius=12,fill=(112,39,57),outline=RED,width=2)
   d.text((47,y-11),str(lat)+'°N',font=font(18,True),fill=WHITE)
  if mode in ('step2','intersection','hannover','quiz','answer'):
   lon=12 if mode in ('quiz','answer') else 10
   x=round(mx(lon));d.line((x,MAP_Y,x,MAP_Y+MAP_H),fill=MINT,width=7)
   d.rounded_rectangle((x-33,MAP_Y-38,x+36,MAP_Y+4),radius=10,fill=(24,89,71),outline=MINT,width=2)
   d.text((x-25,MAP_Y-28),str(lon)+'°O',font=font(18,True),fill=WHITE)
  if mode in ('intersection','hannover','answer'):
   lat=50 if mode=='answer' else 52;lon=12 if mode=='answer' else 10
   x=mx(lon);y=my(lat);d.ellipse((x-16,y-16,x+16,y+16),fill=YELLOW,outline=(255,255,255),width=4)
  if mode=='hannover':
   # reference city marker at approximately 52.375 N / 9.732 E, not exactly grid point
   x,y=mx(9.73),my(52.38)
   d.ellipse((x-6,y-6,x+6,y+6),fill=(255,255,255),outline=(34,77,105),width=2)
   d.line((x+6,y-6,x+79,y-54),fill=WHITE,width=2)
   d.rounded_rectangle((x+57,y-95,x+235,y-49),radius=12,fill=(5,36,58,250))
   d.text((x+72,y-84),'HANNOVER',font=font(23,True),fill=YELLOW)
  if mode=='between':
   # dotted half-degree 51.5 N, to show estimate between marked lines
   y=my(51.5)
   for x in range(MAP_X,MAP_X+MAP_W-1,22):d.line((x,y,x+11,y),fill=YELLOW,width=3)
   d.text((MAP_X+30,MAP_Y+MAP_H-36),'Beispiel: 51,5° N zwischen 51° und 52°',font=font(17,True),fill=WHITE)
  if mode in ('task','rule'):
   d.rounded_rectangle((120,525,470,564),radius=12,fill=(12,43,70,249))
   d.text((133,534),'BEISPIEL: 52° N, 10° O',font=font(22,True),fill=YELLOW)
 # side panel
 panel_for_scene(frame,i,scene,nframes,j)
 d=ImageDraw.Draw(frame,'RGBA')
 d.rounded_rectangle((37,606,1242,707),radius=18,fill=(2,15,33,243),outline=(75,161,178,115),width=2)
 cols={'Paul':(255,197,103),'Herr Welt':(124,233,194),'Gustav':(133,220,253)}
 col=cols[role];d.rounded_rectangle((53,627,208,689),radius=14,fill=(*col,43),outline=(*col,218),width=2)
 d.text((67,647),role.upper(),font=font(20,True),fill=WHITE)
 f=font(23);lines=wrapped(d,speech,f,985)
 if len(lines)>2:f=font(21);lines=wrapped(d,speech,f,1000)
 if len(lines)>2:f=font(19);lines=wrapped(d,speech,f,1000)
 for k,ln in enumerate(lines[:2]):d.text((227,631+k*35),ln,font=f,fill=WHITE)
 return frame.convert('RGB')

voices={'Paul':('de+f4',64,157),'Herr Welt':('de+m2',36,152),'Gustav':('de+m3',47,147)}
tracks=[];durations=[]
for i,sc in enumerate(SCENES):
 who,speech=sc[0],sc[1];voice,pitch,speed=voices[who]
 wav=TMP/f'voice_{i:02d}.wav'
 subprocess.run(['espeak','-v',voice,'-p',str(pitch),'-s',str(speed),'-a','166','-w',str(wav),speech],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 sr,data=wavfile.read(wav); data=data.astype('float32')/32768
 if data.ndim==2:data=data.mean(axis=1)
 data=resample_poly(data,48000,sr)
 tail=3.1 if sc[4]=='quiz' else 1.0
 length=max(5.25,len(data)/48000+tail+.70)
 frames=int(math.ceil(length*FPS));tracks.append(data);durations.append(frames)
 print('Szene',i+1,who,sc[4],round(frames/FPS,2),'s',flush=True)
TOT=sum(durations);SAMPLES=round(TOT/FPS*48000)
audio=np.zeros(SAMPLES,np.float32);cursor=0
for data,fr in zip(tracks,durations):
 start=cursor+int(.46*48000);end=min(SAMPLES,start+len(data));audio[start:end]+=.9*data[:end-start];cursor+=round(fr*48000/FPS)
# Subtle original drone with no copyright-protected melody
for start in range(0,SAMPLES,12*48000):
 end=min(SAMPLES,start+12*48000);tt=np.arange(end-start,dtype='float32')/48000
 env=np.minimum(1,tt/2)*np.minimum(1,(end-start)/48000-tt)
 for frequency in (130.81,196.0,261.63):audio[start:end]+=np.sin(2*np.pi*frequency*tt).astype('float32')*env*.0019
wavfile.write(str(TMP/'folge7_audio.wav'),48000,np.int16(np.clip(audio,-1,1)*32767))
fmt=lambda t:f'{int(t//3600):02d}:{int(t//60)%60:02d}:{int(t)%60:02d},{int((t%1)*1000):03d}'
secs=0;srt=[];script=['Paul und Gustav Globus – Folge 7: Orte im Atlas finden','']
for i,(sc,n) in enumerate(zip(SCENES,durations),1):
 dur=n/FPS;role,speech=sc[0],sc[1]
 srt.extend([str(i),f'{fmt(secs+.43)} --> {fmt(secs+dur-.15)}',f'{role}: {speech}',''])
 script.append(f'{role}: {speech}');secs+=dur
(OUT/'Gustav_Globus_Folge7_Untertitel.srt').write_text('\n'.join(srt),encoding='utf-8')
(OUT/'Gustav_Globus_Folge7_Sprechtext.txt').write_text('\n\n'.join(script),encoding='utf-8')
for i,name in [(1,'Atlaswahl'),(5,'Breitengrad'),(7,'Laengengrad'),(8,'Schnittpunkt'),(9,'Hannover'),(11,'Gekruemmter_Meridian'),(13,'Quiz'),(14,'Antwort')]:
 render(i,0,durations[i]).save(OUT/f'Gustav_Globus_Folge7_Vorschau_{name}.jpg',quality=91)
output=OUT/'Paul_und_Gustav_Globus_Folge_7_Atlas_Koordinaten.mp4'
seq=[]
for i,n in enumerate(durations):
 count=3
 for k in range(count):
  j=round((k+.3)/count*n)
  pic=TMP/f'scene_{i:02d}_{k:02d}.jpg'
  render(i,j,n).save(pic,quality=88,subsampling=0)
  seq.append((pic,n/FPS/count))
 print('Zeichnungen',i+1,'/',len(SCENES),flush=True)
concat=TMP/'slides.ffconcat'
with open(concat,'w') as f:
 f.write('ffconcat version 1.0\n')
 for p,duration in seq:
  f.write(f"file '{p}'\n")
  f.write(f'duration {duration:.6f}\n')
 f.write(f"file '{seq[-1][0]}'\n")
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-safe','0','-f','concat','-i',str(concat),'-i',str(TMP/'folge7_audio.wav'),'-map','0:v','-map','1:a','-vf','fps=12,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','22','-c:a','aac','-b:a','144k','-movflags','+faststart','-shortest',str(output)]
print('Video zusammenfügen:',len(SCENES),'Sequenzen',round(TOT/FPS,2),'Sekunden',flush=True)
subprocess.run(cmd,check=True)
print('VIDEO',output,output.stat().st_size,flush=True)