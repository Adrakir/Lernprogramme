#!/usr/bin/env python3
"""Paul & Gustav Folge 6: eigenes reproduzierbares Lernvideo (Python/ffmpeg)."""
import os, math, subprocess, functools, random
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.io import wavfile
from scipy.signal import resample_poly
from mpl_toolkits.basemap import Basemap
OUT=Path(os.environ.get('GUSTAV_VIDEO_OUT','/mnt/data'))
TMP=Path(os.environ.get('GUSTAV_VIDEO_TMP','/mnt/data/erdkunde_folge6'))
OUT.mkdir(parents=True,exist_ok=True); TMP.mkdir(parents=True,exist_ok=True)
W,H,FPS,R=1280,720,12,225
CX,CY=333,357
FA='/usr/share/fonts/truetype/lato/Lato-Bold.ttf';FB='/usr/share/fonts/truetype/lato/Lato-Regular.ttf'
if not Path(FA).exists():FA='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';FB='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=lambda size,b=False:ImageFont.truetype(FA if b else FB,size)
RED=(255,133,118,255); MINT=(111,239,186,255); YELLOW=(255,220,113,255); WHITE=(248,253,255,255)
# Figur, Dialog, Erklärüberschrift, Lehrhinweis, Grafikmodus, Blickrichtung (lat,lon)
SCENES=[
('Paul','Herr Welt, wie findet man eigentlich einen Ort ganz genau auf der Erde?','Wie finde ich einen Ort?','Gustav zeigt dir das Gradnetz.','intro', (30,-15)),
('Herr Welt','Gustav, erklär uns das Gradnetz bitte Schritt für Schritt!','Das Gradnetz der Erde','Zwei Arten gedachter Linien helfen uns.','grid',(30,-15)),
('Gustav','Das Gradnetz besteht aus Breitenkreisen und Meridianen. Wo sie sich schneiden, können wir einen Ort bestimmen.','Zwei Linienarten','Breitenkreise + Meridiane = Gradnetz','grid',(28,-15)),
('Gustav','Der Äquator hat null Grad Breite. Breitenkreise verlaufen parallel zum Äquator: bis neunzig Grad Nord und bis neunzig Grad Süd.','1. Die Breitenkreise','Äquator: 0° Breite. Norden: N. Süden: S.','latitude',(13,-18)),
('Paul','Und was sind dann die Längengrade?','Paul hat eine Frage','Jetzt kommen die Meridiane.','pause',(25,-25)),
('Gustav','Meridiane verlaufen vom Nordpol zum Südpol. Der Nullmeridian hat null Grad Länge. Wir zählen von dort nach Osten oder Westen.','2. Die Meridiane','Nullmeridian = 0° Länge','longitude',(27,-37)),
('Herr Welt','Wir suchen jetzt zweiundfünfzig Grad Nord und zehn Grad Ost. Merk dir: Zuerst die Breite, danach die Länge.','Unser Beispiel','Gesucht: 52° N · 10° O','example',(33,-20)),
('Gustav','Schritt eins: Suche zweiundfünfzig Grad nördlicher Breite. Du folgst dem Breitenkreis um die Erdkugel.','Schritt 1: Breitengrad','52° N = nördlich des Äquators','step1',(30,-25)),
('Gustav','Schritt zwei: Suche zehn Grad östlicher Länge. Verfolge diesen Meridian vom Nordpol nach Süden.','Schritt 2: Längengrad','10° O = östlich des Nullmeridians','step2',(33,-30)),
('Paul','Ah! Dort treffen sich der Breitenkreis und der Meridian. Das ist unser gesuchter Punkt!','Der Schnittpunkt','52° N UND 10° O treffen sich.','intersection',(33,-30)),
('Paul','Aber Gustav: Die Meridianlinie ist doch gebogen. Kann ich trotzdem zehn Grad Ost ablesen?','Wenn der Meridian gebogen ist','Folge der ganzen Linie, nicht ihrem Schatten.','curve',(30,-45)),
('Gustav','Ja! Der Meridian liegt auf einer Kugel. Aus unserem Blickwinkel erscheint er gebogen. Verfolge dieselbe Linie bis zum Breitenkreis.','Dem Meridian folgen','Gebogen im Bild – derselbe Längengrad','trace',(30,-45)),
('Herr Welt','Jetzt bist du dran: Welche Angabe suchst du zuerst – zweiundfünfzig Grad Nord oder zehn Grad Ost?','Deine Mitmachfrage','Erst Breite oder erst Länge?','quiz',(33,-30)),
('Gustav','Zuerst zweiundfünfzig Grad Nord! Dann zehn Grad Ost. Merke: Breite vor Länge. Gut gemacht!','Richtig: Breite vor Länge!','52° N → 10° O → Schnittpunkt','answer',(33,-30)),
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

# each frame

def render(i,j,nframes):
 role,speech,title,point,mode,(lat0,lon0)=SCENES[i]
 t=j/FPS;duration=nframes/FPS
 frame=bg.copy();d=ImageDraw.Draw(frame,'RGBA')
 d.rounded_rectangle((35,28,590,70),radius=19,fill=(17,75,92,235),outline=(111,207,205,140),width=2)
 d.text((51,40),'ERDKUNDE MIT PAUL & GUSTAV GLOBUS',font=font(18,True),fill=(230,252,252))
 d.rounded_rectangle((1095,26,1244,68),radius=16,fill=(55,119,151,245))
 d.text((1110,37),'FOLGE 06',font=font(20,True),fill='white')
 d.text((47,96),'Das Gradnetz der Erde',font=font(37,True),fill=(249,253,255))
 d.rounded_rectangle((35,142,621,578),radius=25,fill=(5,30,59,160),outline=(91,153,173,130),width=2)
 lon=lon0+1.4*math.sin(t*.22)
 la=round(lat0);lo=round(lon)
 phase=min(10,round(t*2))
 g=globe(la,lo,mode,phase)
 frame.alpha_composite(g,(CX-R,CY-R));d=ImageDraw.Draw(frame,'RGBA')
 if mode in ('latitude','step1','intersection','curve','trace','quiz','answer','example','step2'):
  pill(d,(57,158),'BREITENKREIS: ROT',(102,48,60,237),WHITE,17)
 if mode in ('longitude','step2','intersection','curve','trace','quiz','answer','example'):
  pill(d,(57,521),'MERIDIAN: GRÜN',(24,88,68,237),WHITE,18)
 if mode in ('intersection','curve','trace','quiz','answer','example'):
  d.rounded_rectangle((60,456,250,507),radius=16,fill=(98,76,24,239),outline=(255,231,137,255),width=2)
  d.text((76,468),'●  52° N, 10° O',font=font(19,True),fill=(255,242,187))
 panel(d,i,mode,title,point)
 # subtitles
 d.rounded_rectangle((39,610,1240,707),radius=20,fill=(2,16,30,242),outline=(91,175,191,115),width=2)
 cols={'Paul':(255,197,103),'Herr Welt':(124,233,194),'Gustav':(133,220,253)}
 col=cols[role]
 d.rounded_rectangle((52,626,207,691),radius=15,fill=(*col,42),outline=(*col,228),width=2)
 d.text((68,646),role.upper(),font=font(21,True),fill=(244,254,252))
 f=font(22);lines=wrapped(d,speech,f,991)
 if len(lines)>2: f=font(20);lines=wrapped(d,speech,f,1007)
 if len(lines)>2:f=font(18);lines=wrapped(d,speech,f,1000)
 for q,line in enumerate(lines[:2]):d.text((231,635+q*32),line,font=f,fill=(250,254,255))
 return frame.convert('RGB')

# audio scene synced, without remote services
voices={'Paul':('de+f4',64,158),'Herr Welt':('de+m2',35,156),'Gustav':('de+m3',48,150)}
tracks=[];durations=[]
for i,sc in enumerate(SCENES):
 who,speech=sc[0],sc[1];voice,pitch,speed=voices[who]
 wav=TMP/f'voice_{i:02d}.wav'
 subprocess.run(['espeak','-v',voice,'-p',str(pitch),'-s',str(speed),'-a','165','-w',str(wav),speech],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 sr,data=wavfile.read(wav); data=data.astype('float32')/32768
 if data.ndim==2:data=data.mean(axis=1)
 data=resample_poly(data,48000,sr)
 tail=3.0 if sc[4]=='quiz' else .8
 length=max(5.0,len(data)/48000+tail+.62)
 frames=int(math.ceil(length*FPS));tracks.append(data);durations.append(frames)
 print('Szene',i+1,who,sc[4],round(frames/FPS,2),'s',flush=True)
TOT=sum(durations);SAMPLES=round(TOT/FPS*48000)
audio=np.zeros(SAMPLES,np.float32);cursor=0
for data,fr in zip(tracks,durations):
 start=cursor+int(.48*48000);end=min(SAMPLES,start+len(data));audio[start:end]+=.87*data[:end-start];cursor+=round(fr*48000/FPS)
# Quiet original ambient pad, no copyright music
for start in range(0,SAMPLES,12*48000):
 end=min(SAMPLES,start+12*48000);tt=np.arange(end-start,dtype='float32')/48000
 env=np.minimum(1,tt/2)*np.minimum(1,(end-start)/48000-tt)
 for frequency in (146.83,196,293.66):
  audio[start:end]+=np.sin(2*np.pi*frequency*tt).astype('float32')*env*.0025
wavfile.write(str(TMP/'folge6_audio.wav'),48000,np.int16(np.clip(audio,-1,1)*32767))
fmt=lambda t:f'{int(t//3600):02d}:{int(t//60)%60:02d}:{int(t)%60:02d},{int((t%1)*1000):03d}'
secs=0;srt=[];script=['Paul und Gustav Globus – Folge 6: Das Gradnetz der Erde','']
for i,(sc,n) in enumerate(zip(SCENES,durations),1):
 dur=n/FPS;role,speech=sc[0],sc[1]
 srt.extend([str(i),f'{fmt(secs+.45)} --> {fmt(secs+dur-.2)}',f'{role}: {speech}',''])
 script.append(f'{role}: {speech}');secs+=dur
(OUT/'Gustav_Globus_Folge6_Untertitel.srt').write_text('\n'.join(srt),encoding='utf-8')
(OUT/'Gustav_Globus_Folge6_Sprechtext.txt').write_text('\n\n'.join(script),encoding='utf-8')
for i,name in [(2,'Gradnetz'),(3,'Breitenkreise'),(5,'Meridiane'),(7,'Breitengrad'),(8,'Laengengrad'),(9,'Schnittpunkt'),(11,'Gekruemmter_Meridian'),(13,'Merksatz')]:
 render(i,0,durations[i]).save(OUT/f'Gustav_Globus_Folge6_Vorschau_{name}.jpg',quality=90)
output=OUT/'Paul_und_Gustav_Globus_Folge_6_Gradnetz_Koordinaten.mp4'
# Frame-by-frame globe scenes are rendered as timed, gently shifting illustrated sequences.
# The concat demuxer preserves each scene's exact audio-matched duration.
seq=[]
for i,n in enumerate(durations):
 count=4 if SCENES[i][4]=='trace' else 3
 for k in range(count):
  j=round((k+.3)/count*n)
  pic=TMP/f'scene_{i:02d}_{k:02d}.jpg'
  render(i,j,n).save(pic,quality=91,subsampling=0)
  seq.append((pic,n/FPS/count))
 print('Zeichnungen',i+1,'/',len(SCENES),flush=True)
concat=TMP/'slides.ffconcat'
with open(concat,'w') as f:
 f.write('ffconcat version 1.0\n')
 for p,duration in seq:
  f.write(f"file '{p}'\n")
  f.write(f'duration {duration:.6f}\n')
 f.write(f"file '{seq[-1][0]}'\n")
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-safe','0','-f','concat','-i',str(concat),'-i',str(TMP/'folge6_audio.wav'),'-map','0:v','-map','1:a','-vf','fps=12,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','22','-c:a','aac','-b:a','144k','-movflags','+faststart','-shortest',str(output)]
print('Video zusammenfügen: 14 animierte Lerntafeln,',round(TOT/FPS,2),'Sekunden',flush=True)
subprocess.run(cmd,check=True)
print('VIDEO',output,output.stat().st_size,flush=True)