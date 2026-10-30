#!/usr/bin/env python3
# Paul und Gustav Globus – Folge 5: Seitenansicht & Draufsicht
# Standalone render: python build_folge5.py; requires numpy, pillow, scipy, basemap, espeak, ffmpeg
import os,math,random,subprocess,functools
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from mpl_toolkits.basemap import Basemap
from scipy.io import wavfile
from scipy.signal import resample_poly

OUT=Path(os.environ.get('GUSTAV_VIDEO_OUT','/mnt/data'))
TMP=Path(os.environ.get('GUSTAV_VIDEO_TMP','/mnt/data/erdkunde_folge5'))
OUT.mkdir(parents=True,exist_ok=True);TMP.mkdir(parents=True,exist_ok=True)
W,H,FPS,R=1280,720,15,231
CX,CY=342,360
FA='/usr/share/fonts/truetype/lato/Lato-Bold.ttf'
FB='/usr/share/fonts/truetype/lato/Lato-Regular.ttf'
if not os.path.exists(FA): FA='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
if not os.path.exists(FB): FB='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=lambda n,b=False:ImageFont.truetype(FA if b else FB,n)

# role,text,heading,point,visual,camLon. Short speech sentences for young learners.
SCENES=[
 ('Paul','Herr Welt, warum sieht dieselbe Erde auf manchen Bildern ganz anders aus?', 'Eine Erde – zwei Ansichten', 'Paul entdeckt zwei verschiedene Blickrichtungen.','intro',12),
 ('Herr Welt','Gute Frage, Paul! Gustav, zeig uns die Seitenansicht und die Draufsicht.', 'Zwei Blickrichtungen', 'Wir ändern unseren Blickwinkel – nicht die Erde.','intro',12),
 ('Gustav','Bei der Seitenansicht schauen wir von der Seite auf die Erdkugel. Oben ist der Nordpol, unten der Südpol.', '1. Die Seitenansicht','Wir sehen die Kugel von der Seite.','side',18),
 ('Gustav','Der rote Äquator verläuft mittig. Die Meridiane gehen vom Nordpol bis zum Südpol und wirken manchmal gebogen.', 'Linien auf der Seitenansicht','Äquator = 0° Breite · Meridiane = Längenkreise','sidegrid',5),
 ('Paul','Und wenn ich direkt über dem Nordpol schwebe, was sehe ich dann?', 'Paul wechselt den Blick','Wir schauen jetzt von oben auf den Nordpol.','tilt',5),
 ('Gustav','Jetzt ist es die Draufsicht vom Nordpol. Der Nordpol liegt in der Mitte, der Äquator am Rand. Wir sehen die Nordhalbkugel.', '2. Die Draufsicht','Nordpol in der Mitte · Äquator am Rand','top',8),
 ('Gustav','Die Meridiane verlaufen wie Speichen von der Mitte nach außen. Die Breitenkreise sehen wie Ringe aus.', 'Das Gradnetz von oben','Meridiane = Strahlen · Breitenkreise = Ringe','topgrid',5),
 ('Paul','Sind das jetzt zwei verschiedene Erden?', 'Zwei Ansichten, eine Erde!', 'Vergleiche beide Blickrichtungen.','compare',10),
 ('Gustav','Nein, Paul. Die Erde bleibt eine Kugel. Nur unsere Blickrichtung verändert sich!', 'Immer dieselbe Erdkugel', 'Seitenansicht ≠ Draufsicht · Gleicher Körper','compare',10),
 ('Herr Welt','Das kennst du von einem Haus: Von der Seite sieht man Türen und Fenster. Von oben sieht man das Dach.', 'Beispiel: Ein Schulhaus','Seite: Fenster und Tür · Oben: Dach','building',10),
 ('Paul','Und bei welcher Ansicht liegt der Nordpol mitten im Bild? Überleg kurz!', 'Jetzt bist du dran!', 'Wo liegt der Nordpol in der Mitte?','quiz',3),
 ('Gustav','Bei der Draufsicht vom Nordpol! Prima! Im nächsten Film lesen wir gemeinsam das Gradnetz.', 'Richtig: Draufsicht!', 'Merke: Erst genau die Blickrichtung erkennen.','answer',5),
]

print('Erzeuge Landkonturen ...',flush=True)
m=Basemap(projection='cyl',llcrnrlon=-180,urcrnrlon=180,llcrnrlat=-90,urcrnrlat=90,resolution='c')
mask=Image.new('L',(1440,720),0);md=ImageDraw.Draw(mask)
for poly in m.landpolygons:
 pts=[((float(a)+180)*4,(90-float(b))*4) for a,b in poly.get_coords()]
 if len(pts)>2:md.polygon(pts,fill=255)
LAND=np.asarray(mask,dtype=np.uint8)
SZ=2*R+2
YY,XX=np.mgrid[0:SZ,0:SZ]
FX=(XX-R)/R;FY=(R-YY)/R
RR=FX*FX+FY*FY;FZ=np.sqrt(np.maximum(0,1-RR));INSIDE=RR<=1
ANTIALIAS=np.uint8(np.clip((1.003-np.sqrt(RR))*R,0,1)*255)
SHADE=(.75+.24*FZ+.06*(-FX))

def project(lat,lon,camlat,camlon):
 la=np.radians(lat);dl=np.radians(lon-camlon);phi=math.radians(camlat)
 x=np.cos(la)*np.sin(dl)
 y=np.sin(la)*math.cos(phi)-np.cos(la)*np.cos(dl)*math.sin(phi)
 z=np.sin(la)*math.sin(phi)+np.cos(la)*np.cos(dl)*math.cos(phi)
 return x,y,z

def draw_projected(d,lats,lons,camlat,camlon,color,width=3):
 x,y,z=project(np.asarray(lats),np.asarray(lons),camlat,camlon)
 prev=None
 for u,v,w in zip(x,y,z):
  if w>=0.002:
   xy=(round(R+R*u),round(R-R*v))
   if prev is not None and abs(xy[0]-prev[0])+abs(xy[1]-prev[1])<R/4:
    d.line((prev,xy),fill=color,width=width)
   prev=xy
  else:prev=None

@functools.lru_cache(maxsize=100)
def globe(camlat,camlon,kind):
 phi=math.radians(camlat)
 slat=FY*math.cos(phi)+FZ*math.sin(phi)
 lat=np.degrees(np.arcsin(np.clip(slat,-1,1)))
 dl=np.arctan2(FX,FZ*math.cos(phi)-FY*math.sin(phi))
 lon=((np.degrees(dl)+camlon+180)%360)-180
 xi=np.clip(np.floor((lon+180)*4).astype(int),0,1439)
 yi=np.clip(np.floor((90-lat)*4).astype(int),0,719)
 is_land=LAND[yi,xi]>128
 colors=np.where(is_land[...,None],np.array([66.,166.,123.]),np.array([24.,101.,162.])).astype(np.float32)
 ocean_depth=(.5+FZ*.5)[...,None]
 colors+=np.array([6.,10.,16.])*ocean_depth
 colors*=SHADE[...,None]
 # shade north ocean slightly for polar top, keep accurate continents
 color=np.clip(colors+np.exp(-((FX+.33)**2+(FY-.3)**2)/.085)[...,None]*19,0,255).astype(np.uint8)
 rgba=np.dstack((color,ANTIALIAS));rgba[~INSIDE,3]=0
 img=Image.fromarray(rgba,'RGBA');d=ImageDraw.Draw(img,'RGBA')
 # longitudes from -180 to +150 at 30° intervals
 if kind in ('sidegrid','topgrid','tilt','top','side','quiz','answer','intro'):
  for ln in range(-150,181,30):
   lats=np.linspace(-90,90,181)
   draw_projected(d,lats,np.full_like(lats,ln),camlat,camlon,(202,244,255,80),1)
  for la in [-60,-30,0,30,60]:
   ln=np.linspace(-180,180,721)
   draw_projected(d,np.full_like(ln,la),ln,camlat,camlon,(210,236,248,75),1)
 # Equator red when relevant; bright lines for educational clarity
 if kind not in ('intro',):
  ln=np.linspace(-180,180,721)
  draw_projected(d,np.zeros_like(ln),ln,camlat,camlon,(255,106,115,255),4)
 # 0-degree meridian green (North Pole view = a spoke), plus 180 opposite
 if kind in ('sidegrid','topgrid','tilt','top','quiz','answer'):
  la=np.linspace(-90,90,361)
  draw_projected(d,la,np.zeros_like(la),camlat,camlon,(90,245,199,255),4)
  draw_projected(d,la,np.full_like(la,180),camlat,camlon,(90,245,199,220),3)
 # north pole dot (at surface) and label location from outside, but not attached to globe text
 xp,yp,zp=project(90,0,camlat,camlon)
 if zp>=-.001:
  x0,y0=R+R*xp,R-R*yp
  d.ellipse((x0-7,y0-7,x0+7,y0+7),fill=(255,255,255,255),outline=(41,102,175,255),width=2)
 return img

# background and foreground characters
bg=Image.new('RGBA',(W,H),(7,24,48,255));bd=ImageDraw.Draw(bg,'RGBA')
for j in range(H):
 a=j/(H-1);bd.line((0,j,W,j),fill=(int(10*(1-a)+5*a),int(32*(1-a)+16*a),int(59*(1-a)+39*a),255))
random.seed(9)
for _ in range(90):
 x=random.randrange(W);y=random.randrange(H);v=random.choice([1,1,2]);bd.ellipse((x-v,y-v,x+v,y+v),fill=(157,217,230,random.randrange(30,110)))
bd.rounded_rectangle((27,608,1253,703),radius=22,fill=(2,14,32,235),outline=(82,150,174,110),width=2)

def offset_points(d,points,offset):return [(x+offset[0],y+offset[1]) for x,y in points]
def draw_paul(d,cx,cy,scale=1):
 def box(q):return tuple(int(q[i]*scale+(cx if i%2==0 else cy)) for i in range(4))
 d.ellipse(box((-36,-89,36,-16)),fill=(244,197,152))
 d.pieslice(box((-38,-93,38,-22)),180,353,fill=(241,194,64))
 d.polygon(offset_points(d,[(-34,-65),(-15,-103),(2,-84),(23,-96),(37,-70)],(cx,cy)),fill=(248,208,78))
 for ex in (-15,15):d.ellipse(box((ex-3,-59,ex+3,-53)),fill=(23,55,77))
 d.arc(box((-12,-46,13,-29)),0,150,fill=(124,64,53),width=2)
 d.rounded_rectangle(box((-43,-18,43,75)),radius=17,fill=(37,125,207),outline=(105,215,248),width=3)
 for xx in (-24,24): d.line((cx+int(xx*scale),cy+int(65*scale),cx+int(xx*scale),cy+int(101*scale)),fill=(37,58,76),width=12)
def draw_welt(d,cx,cy):
 d.ellipse((cx-32,cy-90,cx+32,cy-22),fill=(237,187,138));d.pieslice((cx-35,cy-93,cx+35,cy-32),180,350,fill=(65,79,101))
 for ex in (-15,15):d.ellipse((cx+ex-11,cy-66,cx+ex+11,cy-47),outline=(26,47,69),width=3)
 d.line((cx-4,cy-59,cx+4,cy-59),fill=(26,47,69),width=2)
 d.arc((cx-10,cy-50,cx+11,cy-31),0,150,fill=(111,60,49),width=2)
 d.rounded_rectangle((cx-48,cy-14,cx+48,cy+75),radius=18,fill=(48,154,140),outline=(101,222,202),width=3)
 d.polygon([(cx-11,cy-14),(cx+11,cy-14),(cx,cy+30)],fill=(228,226,218))
 for xx in (-24,24):d.line((cx+xx,cy+65,cx+xx,cy+102),fill=(53,66,84),width=12)
def draw_gustav(d,cx,cy):
 d.ellipse((cx-55,cy-60,cx+55,cy+50),fill=(26,135,189),outline=(127,241,229),width=4)
 for xx in (-23,23):d.arc((cx+xx-27,cy-57,cx+xx+27,cy+49),80,280,fill=(129,236,222),width=2)
 d.arc((cx-54,cy-20,cx+54,cy+24),0,180,fill=(129,236,222),width=2)
 for xx in (-21,21):
  d.ellipse((cx+xx-13,cy-24,cx+xx+12,cy+2),fill=(250,251,248));d.ellipse((cx+xx-5,cy-15,cx+xx+3,cy-7),fill=(28,55,77))
 d.arc((cx-18,cy-2,cx+19,cy+27),0,165,fill=(20,57,73),width=4)
 d.line((cx-33,cy+45,cx-43,cy+66),fill=(129,236,222),width=5);d.line((cx+33,cy+45,cx+43,cy+66),fill=(129,236,222),width=5)

def textwrap_width(d,text,f,width):
 arr=[];line=''
 for word in text.split():
  n=(line+' '+word).strip()
  if d.textbbox((0,0),n,font=f)[2]>width and line:arr.append(line);line=word
  else:line=n
 if line:arr.append(line)
 return arr

def normal_panel(d,mode,title,point):
 d.rounded_rectangle((673,124,1235,584),radius=25,fill=(6,29,56,233),outline=(90,154,186,140),width=2)
 fs=35
 while d.textbbox((0,0),title,font=font(fs,True))[2]>515:fs-=1
 d.text((704,154),title,font=font(fs,True),fill=(248,252,255))
 d.line((704,210,1191,210),fill=(73,207,185),width=6)
 f=font(27)
 lines=textwrap_width(d,point,f,478)
 for j,line in enumerate(lines[:3]):d.text((704,231+j*38),line,font=f,fill=(213,233,244))
 if mode in ('intro','side','sidegrid','tilt','top','topgrid','quiz','answer'):
  draw_paul(d,775,477);draw_welt(d,928,477);draw_gustav(d,1118,457)
  # Figuren bleiben ohne zusätzliche Namenslabels – besser lesbar
 elif mode=='building':
  draw_building(d,790,427,'side',.83);draw_building(d,1060,430,'top',.83)
  d.text((732,529),'SEITENANSICHT',font=font(19,True),fill=(139,230,231))
  d.text((1024,529),'DRAUFSICHT',font=font(19,True),fill=(139,230,231))

def draw_building(d,cx,cy,view,scale=1):
 def q(x,y):return(cx+x*scale,cy+y*scale)
 if view=='side':
  d.polygon([q(-95,-36),q(0,-92),q(97,-36)],fill=(197,113,87),outline=(255,204,165))
  d.rectangle((*q(-93,-36),*q(93,67)),fill=(232,210,167),outline=(250,242,214),width=3)
  for x in (-58,40):
   d.rectangle((*q(x-17,-12),*q(x+17,21)),fill=(94,175,212),outline=(58,94,128),width=3)
   d.line((*q(x,-12),*q(x,21)),fill=(240,242,236),width=3)
  d.rectangle((*q(-15,17),*q(17,67)),fill=(117,90,84),outline=(245,231,192),width=3)
 else:
  d.polygon([q(-90,0),q(0,-79),q(90,0),q(0,79)],fill=(186,93,91),outline=(250,202,155))
  d.line((*q(0,-79),*q(0,79)),fill=(250,213,157),width=4)
  d.rectangle((*q(-16,-10),*q(16,10)),fill=(147,206,230),outline=(241,243,248),width=3)

def cam_mode(mode,elapsed,scene_len,base):
 if mode in ('top','topgrid','quiz','answer'):return 90,base+math.sin(elapsed*.7)*1.5
 if mode=='tilt':
  u=np.clip(elapsed/scene_len,0,1);u=u*u*(3-2*u)
  return 87*u,base
 return 0,base+math.sin(elapsed*.55)*5

def render(i,frame_index,scene_length):
 role,speech,title,point,mode,base=SCENES[i]
 t=frame_index/FPS
 frame=bg.copy();d=ImageDraw.Draw(frame,'RGBA')
 d.rounded_rectangle((36,27,490,68),radius=19,fill=(18,71,91,220),outline=(63,172,176,170),width=2)
 d.text((53,37),'ERDKUNDE MIT PAUL & GUSTAV GLOBUS',font=font(18,True),fill=(215,246,246))
 d.rounded_rectangle((1083,26,1240,67),radius=19,fill=(62,125,156,160))
 d.text((1100,36),'FOLGE 05',font=font(20,True),fill='white')
 d.text((52,87),'Seitenansicht & Draufsicht',font=font(35,True),fill=(246,252,253))
 if mode=='compare':
  d.rounded_rectangle((34,164,612,574),radius=19,fill=(8,40,67,210),outline=(64,139,180,145),width=2)
  d.rounded_rectangle((661,164,1238,574),radius=19,fill=(8,40,67,210),outline=(64,139,180,145),width=2)
  a=globe(0,12,'sidegrid').resize((330,330),Image.Resampling.LANCZOS)
  b=globe(90,12,'topgrid').resize((330,330),Image.Resampling.LANCZOS)
  ImageDraw.Draw(b).ellipse((2,2,328,328),outline=(255,106,115,255),width=3)
  frame.alpha_composite(a,(167,202));frame.alpha_composite(b,(796,202));d=ImageDraw.Draw(frame,'RGBA')
  d.text((178,179),'SEITENANSICHT',font=font(24,True),fill=(154,234,230))
  d.text((799,179),'DRAUFSICHT',font=font(24,True),fill=(154,234,230))
  d.text((194,541),'Nordpol oben',font=font(21),fill=(234,246,255))
  d.text((817,541),'Nordpol in der Mitte',font=font(21),fill=(234,246,255))
 elif mode=='building':
  d.rounded_rectangle((45,149,623,570),radius=21,fill=(9,40,65,218),outline=(80,140,167),width=2)
  d.rounded_rectangle((647,149,1236,570),radius=21,fill=(9,40,65,218),outline=(80,140,167),width=2)
  draw_building(d,326,356,'side',1.4);draw_building(d,937,357,'top',1.4)
  d.text((180,188),'SEITENANSICHT',font=font(27,True),fill=(152,230,229))
  d.text((801,188),'DRAUFSICHT',font=font(27,True),fill=(152,230,229))
  d.text((202,525),'Türen + Fenster',font=font(23),fill=(228,239,249))
  d.text((860,525),'Dachfläche',font=font(23),fill=(228,239,249))
 else:
  camlat,camlon=cam_mode(mode,t,scene_length,base)
  camlat=round(camlat/3)*3; camlon=round(camlon/3)*3
  disc=globe(camlat,camlon,'topgrid' if mode=='topgrid' else 'sidegrid' if mode in ('sidegrid','tilt') else mode)
  frame.alpha_composite(disc,(CX-R,CY-R))
  d=ImageDraw.Draw(frame,'RGBA')
  if camlat==90:
   d.ellipse((CX-R,CY-R,CX+R,CY+R),outline=(255,106,115,255),width=4)
  if mode in ('side','sidegrid'):
   d.text((274,141),'NORDPOL',font=font(20,True),fill=(230,246,252))
   d.text((274,584),'SÜDPOL',font=font(20,True),fill=(230,246,252))
   if mode=='sidegrid':d.text((50,351),'ÄQUATOR →',font=font(21,True),fill=(255,175,180))
  elif mode in ('top','topgrid','quiz','answer'):
   d.rounded_rectangle((48,167,232,205),radius=16,fill=(25,70,91,230))
   d.text((65,175),'DRAUFSICHT',font=font(19,True),fill=(194,241,235))
   d.line((cx:=CX,cy:=CY,cx+45,cy+24),fill=(248,250,248,230),width=3)
   d.text((440,390),'NORDPOL',font=font(20,True),fill=(247,251,252))
   if mode=='topgrid':
    d.text((49,527),'BREITENKREISE',font=font(19,True),fill=(201,236,244))
    d.text((49,551),'= RINGE',font=font(19,True),fill=(201,236,244))
  if mode=='tilt':
   d.text((49,533),'BLICK VON OBEN',font=font(22,True),fill=(136,242,221))
  normal_panel(d,mode,title,point)
  if mode=='quiz':
   d.rounded_rectangle((743,332,1178,379),radius=14,fill=(31,92,116,220),outline=(142,227,220),width=2)
   d.text((770,345),'Denkpause: 1 · 2 · 3 …',font=font(23,True),fill=(232,251,249))
  if mode=='answer':
   d.rounded_rectangle((742,334,1156,394),radius=17,fill=(14,113,95,221),outline=(117,247,185),width=3)
   d.text((762,350),'✓ DRAUFSICHT',font=font(28,True),fill=(236,255,237))
 # dialogue subtitles: role tagged, two lines
 c={'Paul':(255,196,98),'Herr Welt':(122,232,192),'Gustav':(136,217,252)}[role]
 d.rounded_rectangle((46,624,210,686),radius=16,fill=(*c,45),outline=(*c,210),width=2)
 d.text((64,643),role.upper(),font=font(21,True),fill=(247,254,252))
 fs=22
 while fs>17 and len(textwrap_width(d,speech,font(fs),999))>2:fs-=1
 lines=textwrap_width(d,speech,font(fs),999)
 for j,line in enumerate(lines[:2]):d.text((231,636+j*30),line,font=font(fs),fill=(247,250,253))
 return frame.convert('RGB')

# audio: 3 different voices, voiceover follows subtitle
TRACKS=[];DURATIONS=[]
voices={'Paul':('de+f4',64,167),'Herr Welt':('de+m2',37,159),'Gustav':('de+m3',51,152)}
for i,sc in enumerate(SCENES):
 role,txt,*_=sc;v,p,spd=voices[role]
 wav=TMP/f'voice_{i:02d}.wav'
 subprocess.run(['espeak','-v',v,'-p',str(p),'-s',str(spd),'-a','162','-w',str(wav),txt],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 sr,data=wavfile.read(wav);data=data.astype('float32')/32768
 if data.ndim==2:data=data.mean(axis=1)
 data=resample_poly(data,48000,sr)
 tail=2.9 if sc[4]=='quiz' else .65
 scene_len=max(4.8,len(data)/48000+tail+.5)
 frames=math.ceil(scene_len*FPS)
 TRACKS.append(data);DURATIONS.append(frames)
 print('Scene',i+1,role,sc[4],round(frames/FPS,2),'sec',flush=True)
TOT=sum(DURATIONS);SAMPLES=int(TOT/FPS*48000)
audio=np.zeros(SAMPLES,dtype=np.float32);cursor=0
for dat,fr in zip(TRACKS,DURATIONS):
 start=cursor+int(.45*48000);end=min(start+len(dat),SAMPLES)
 audio[start:end]+=.85*dat[:end-start];cursor+=fr*int(48000/FPS)
# subtle original chord bed, low level; no copyrighted track
for base_sec,(a,b,c) in enumerate([(146.83,220,293.66),(130.81,196,261.63),(164.81,220,329.63),(146.83,196,293.66)]*3):
 begin=base_sec*12*48000;end=min((base_sec+1)*12*48000,SAMPLES)
 if begin>=SAMPLES:break
 tt=np.arange(end-begin,dtype='float32')/48000
 envelope=np.minimum(1,tt/2)*np.minimum(1,((end-begin)/48000-tt)/2)
 for f in (a,b,c):audio[begin:end]+=np.sin(2*np.pi*f*tt).astype('float32')*envelope*.0028
wavfile.write(str(TMP/'episode5_audio.wav'),48000,np.int16(np.clip(audio,-1,1)*32767))

# subtitles + script
clock=lambda s:f'{int(s//3600):02d}:{int(s//60)%60:02d}:{int(s)%60:02d},{int((s%1)*1000):03d}'
cur=0;srt=[];txtlines=['Paul und Gustav Globus – Folge 5: Seitenansicht und Draufsicht','']
for i,(sc,fr) in enumerate(zip(SCENES,DURATIONS),1):
 role,speech,*_=sc;dur=fr/FPS
 srt.extend([str(i),f'{clock(cur+.45)} --> {clock(cur+dur-.2)}',role+': '+speech,''])
 txtlines.append(role+': '+speech);cur+=dur
(OUT/'Gustav_Globus_Folge5_Untertitel.srt').write_text('\n'.join(srt),encoding='utf-8')
(OUT/'Gustav_Globus_Folge5_Sprechtext.txt').write_text('\n\n'.join(txtlines),encoding='utf-8')
# Preview scenes; test top vs side
for i,name in [(2,'side'),(5,'top'),(6,'grid'),(7,'compare'),(9,'building')]:
 render(i,0,DURATIONS[i]/FPS).save(OUT/f'Gustav_Globus_Folge5_Vorschau_{name}.jpg',quality=88)

output=OUT/'Paul_und_Gustav_Globus_Folge_5_Seitenansicht_Draufsicht.mp4'
cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','-', '-i',str(TMP/'episode5_audio.wav'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','144k','-movflags','+faststart','-shortest',str(output)]
print('Encode',TOT,'frames',TOT/FPS,'sec',flush=True)
with open(TMP/'ffmpeg.log','w') as err:
 process=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=err,bufsize=1048576)
 try:
  for i,n in enumerate(DURATIONS):
   dur=n/FPS
   for j in range(n):process.stdin.write(np.asarray(render(i,j,dur),dtype=np.uint8).tobytes())
   print('Completed',i+1,'/',len(SCENES),'frames',n,flush=True)
 finally:
  try:process.stdin.close()
  except BrokenPipeError:pass
 code=process.wait()
if code:raise RuntimeError(f'ffmpeg exited {code}; see {TMP}/ffmpeg.log')
print('Finished',str(output),output.stat().st_size,flush=True)