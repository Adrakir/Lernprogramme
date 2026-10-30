import os,math,random,subprocess,wave,textwrap,time
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np
from mpl_toolkits.basemap import Basemap
from scipy.io import wavfile
from scipy.signal import resample_poly

OUT=os.environ.get('GUSTAV_VIDEO_OUT','/mnt/data')
TMP=os.environ.get('GUSTAV_VIDEO_TMP','/mnt/data/erdkunde_folge4')
os.makedirs(OUT,exist_ok=True)
os.makedirs(TMP,exist_ok=True)
W,H=1280,720
FPS=15
R=239
CX,CY=373,356
F_TITLE='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
F_BODY='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
for f in ['/usr/share/fonts/truetype/lato/Lato-Bold.ttf','/usr/share/fonts/truetype/lato/Lato-Regular.ttf']:
 print('font',f,os.path.exists(f))
F_TITLE='/usr/share/fonts/truetype/lato/Lato-Bold.ttf'
F_BODY='/usr/share/fonts/truetype/lato/Lato-Regular.ttf'
font=lambda sz,b=False:ImageFont.truetype(F_TITLE if b else F_BODY,sz)

# Rolle, Sprechtext, Szenentitel, zentrale Lernaussage, Hervorhebung, Kamera-Meridian
SCENES=[
 ('Paul','Herr Welt, der Äquator teilt in Nord und Süd. Gibt es auch vier Erdviertel?','Vier Viertel der Erde?','Paul hat eine spannende Frage.','intro',10),
 ('Herr Welt','Ja, Paul! Gustav Globus zeigt uns, wie das funktioniert.','Gustav erklärt es','Zwei gedachte Linien helfen uns.','setup',5),
 ('Gustav','Der Äquator teilt die Erde in die Nordhalbkugel und die Südhalbkugel.','1. Der Äquator','0° Breite: Norden und Süden','equator',15),
 ('Gustav','Der Nullmeridian und der gegenüberliegende hundertachtzig Grad Meridian teilen die Erde in Osten und Westen.','2. Die Meridiane','0° und 180° Länge: Osten und Westen','meridians',38),
 ('Gustav','Wenn beide Teilungen zusammenkommen, entstehen vier Erdviertelkugeln.','3. Vier Erdviertel','Zwei Hälften mal zwei Hälften sind vier Viertel.','all',25),
 ('Gustav','Nordost liegt nördlich des Äquators und östlich des Nullmeridians. Nordwest liegt nördlich und westlich.','Die beiden nördlichen Viertel','NORDOST und NORDWEST','north',16),
 ('Gustav','Südost liegt südlich und östlich. Südwest liegt südlich und westlich.','Die beiden südlichen Viertel','SÜDOST und SÜDWEST','south',-20),
 ('Paul','Warum sagen wir Nordost und nicht Ostnord?','Pauls gute Frage','Warum steht NORD zuerst?','naming',20),
 ('Gustav','Bei den Erdvierteln nennen wir zuerst Nord oder Süd, danach Ost oder West. Das ist die übliche Namensreihenfolge.','Erst Nord oder Süd','Danach Ost oder West!','naming',5),
 ('Herr Welt','Deutschland liegt nördlich des Äquators und östlich des Nullmeridians. In welchem Viertel liegt es?','Jetzt bist du dran!','Deutschland: nördlich + östlich = ?','quiz',18),
 ('Gustav','Genau! Im Nordostviertel. Im nächsten Film sehen wir die Erde von der Seite und von oben.','Richtig: Nordost!','Super gemacht. Bis zur nächsten Folge!','answer',18),
]
COLORS={'NO':(37,176,160),'NW':(109,128,239),'SO':(240,170,57),'SW':(224,96,143)}
# Build illustrated geographical texture at resolution 4 px/degree
print('Rendere Weltmaske...',flush=True)
m=Basemap(projection='cyl',llcrnrlon=-180,urcrnrlon=180,llcrnrlat=-90,urcrnrlat=90,resolution='c')
mask=Image.new('L',(1440,720),0);md=ImageDraw.Draw(mask)
for pol in m.landpolygons:
 coords=pol.get_coords()
 xy=[]
 for lon,lat in coords:
  xy.append(((float(lon)+180)*4,(90-float(lat))*4))
 if len(xy)>2:md.polygon(xy,fill=255)
land=np.asarray(mask,dtype=np.uint8)
print('Polygone',len(m.landpolygons),flush=True)

# sphere coordinate arrays, lat and lon relative to camera
D=2*R+2
yidx,xidx=np.mgrid[0:D,0:D]
x=(xidx-R)/R; y=(yidx-R)/R
rr=x*x+y*y
inside=rr<=1
zz=np.sqrt(np.maximum(0.,1.-rr))
lat0=math.radians(6.)
N=-y;E=x;V=zz
sLat=N*math.cos(lat0)+V*math.sin(lat0)
LAT=np.arcsin(np.clip(sLat,-1,1))
DLON=np.arctan2(E,V*math.cos(lat0)-N*math.sin(lat0))
base_light=(.76+.28*zz+.04*(-x))
illum=np.clip(base_light,0.7,1.14)
shader=(illum[...,None])
# alpha blur edge, precomputed
radii=np.sqrt(rr)
AA=np.uint8(np.maximum(0,np.minimum(1,(1.003-radii)*R*0.83))*255)

# one voice line per scene
print('Stimmen rendern...',flush=True)
tracks=[]; scene_frames=[]; spans=[]
role_voices={'Paul':('de+f4','58','162'),'Herr Welt':('de+m2','36','159'),'Gustav':('de+m3','50','151')}
for i,(role,speech,*_) in enumerate(SCENES):
 voc,pitch,speed=role_voices[role]
 audio=f'{TMP}/speech_{i:02d}.wav'
 subprocess.run(['espeak','-v',voc,'-p',pitch,'-s',speed,'-a','155','-w',audio,speech],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 sr,dat=wavfile.read(audio)
 if dat.ndim>1:dat=dat.mean(axis=1)
 dat=dat.astype(np.float32)/32768
 dat=resample_poly(dat,48000,sr)
 # add a pause at each scene, plus quiz pause
 tail=.55 if i not in (9,10) else (3.0 if i==9 else 1.)
 pad_head=.55
 total=int((len(dat)/48000+tail+pad_head)*FPS+0.5)
 # ensure 4 sec per scene minimum
 total=max(total,int(4.5*FPS))
 tracks.append((pad_head,dat,total))
 scene_frames.append(total)
 print(i,role,'audio %.1fs'%(len(dat)/48000),'scene %.1fs'%(total/FPS),flush=True)
TOTAL=sum(scene_frames)
DURATION=TOTAL/FPS
print('DURATION',DURATION,'TOTALFRAMES',TOTAL,flush=True)
# final audio waveform with scene-aligned narration and gentle background intro theme
samples=int(DURATION*48000)
audio=np.zeros(samples,np.float32)
offset=0
for h,dat,nframes in tracks:
 start=offset+int(h*48000)
 end=min(samples,start+len(dat))
 audio[start:end]+=dat[:end-start]*.92
 offset+=int(nframes/FPS*48000)
# quiet background melody made with soft additive sine pads; original, not known musical piece
rng=np.random.default_rng(3)
t=np.arange(samples,dtype=np.float32)/48000
# Subtle music, long pad chords, quieter than voice
notes=[(196,246.94,293.66),(174.61,220,261.63),(164.81,196,246.94),(174.61,220,293.66)]
chord_secs=16
music=np.zeros_like(audio)
for chord_i, chord in enumerate(notes*2):
 s=int(chord_i*chord_secs*48000);e=min(samples,int((chord_i+1)*chord_secs*48000))
 if s>=samples:break
 tt=np.arange(e-s,dtype=np.float32)/48000
 env=np.minimum(1,tt/2)*np.minimum(1,(e-s)/48000/2-tt/2+.5)
 env=np.clip(env,0,1)
 chordwaves=sum((np.sin(2*np.pi*hz*tt)+.22*np.sin(2*np.pi*2*hz*tt))/len(chord) for hz in chord)
 music[s:e]+=0.024*chordwaves*env
# prevent overmodulation
mix=np.clip(audio+music,-.95,.95)
wavfile.write(f'{TMP}/episode4_audio.wav',48000,np.int16(mix*32767))
# background bg
xx,yy=np.mgrid[0:W,0:H]
bgarr=np.zeros((H,W,3),dtype=np.uint8)
for c,(top,bottom) in enumerate(zip((12,25,51),(7,15,36))):
 bgarr[:,:,c]=np.uint8(top+(bottom-top)*(np.arange(H)[:,None]/H))
bg=Image.fromarray(bgarr,'RGB').convert('RGBA')
bgd=ImageDraw.Draw(bg,'RGBA')
random.seed(101)
for k in range(66):
 sx=random.randint(0,W);sy=random.randint(0,H)
 r=random.choice([1,1,2]);bgd.ellipse((sx-r,sy-r,sx+r,sy+r),fill=(169,207,233,random.randint(60,150)))
for i in range(9):
 x0=720+i*95
 bgd.arc((x0,-170,x0+530,1000),90,265,fill=(40,75,115,30),width=2)
# lower subtitle band
bgd.rounded_rectangle((25,613,1255,703),radius=23,fill=(6,17,38,230),outline=(87,143,170,105),width=2)
# left globe circle glow
bgd.ellipse((CX-R-23,CY-R-23,CX+R+23,CY+R+23),outline=(58,136,194,68),width=11)

# characters drawing

def draw_paul(draw,x,y,sc=1.0):
 def P(b):return tuple(int(v*sc+(x if i%2==0 else y)) for i,v in enumerate(b))
 draw.ellipse(P((-33,-85,33,-18)),fill=(248,204,153,255))
 # ears
 draw.ellipse(P((-39,-55,-26,-32)),fill=(247,192,136,255));draw.ellipse(P((25,-55,39,-32)),fill=(247,192,136,255))
 draw.pieslice(P((-40,-92,37,-16)),180,345,fill=(241,193,57,255))
 draw.polygon([P((-35,-68,-35,-68))[:2],P((-15,-98,-15,-98))[:2],P((13,-84,13,-84))[:2],P((31,-94,31,-94))[:2],P((36,-72,36,-72))[:2]],fill=(248,204,72,255))
 for ex in [-14,14]:draw.ellipse(P((ex-3,-57,ex+3,-49)),fill=(30,48,65,255))
 draw.arc(P((-12,-49,14,-28)),0,160,fill=(112,61,54,255),width=max(1,int(sc*2)))
 draw.rounded_rectangle(P((-43,-20,43,83)),radius=int(18*sc),fill=(31,122,203,255),outline=(92,192,245,255),width=3)
 draw.line([P((-29,64,-29,64))[:2],P((-29,106,-29,106))[:2]],fill=(44,60,88,255),width=13)
 draw.line([P((29,64,29,64))[:2],P((29,106,29,106))[:2]],fill=(44,60,88,255),width=13)

def draw_welt(draw,x,y,sc=1.0):
 def P(b):return tuple(int(v*sc+(x if i%2==0 else y)) for i,v in enumerate(b))
 draw.ellipse(P((-32,-93,32,-20)),fill=(237,185,137,255))
 draw.pieslice(P((-35,-96,35,-29)),170,330,fill=(69,77,94,255))
 for ex in [-16,16]:
  draw.ellipse(P((ex-11,-67,ex+11,-49)),outline=(31,46,66,255),width=3)
 draw.line([P((-5,-58,-5,-58))[:2],P((5,-58,5,-58))[:2]],fill=(36,40,55,255),width=2)
 draw.arc(P((-12,-51,11,-30)),10,150,fill=(128,77,63,255),width=2)
 draw.rounded_rectangle(P((-47,-17,47,80)),radius=int(15*sc),fill=(43,157,145,255),outline=(111,217,202,255),width=3)
 draw.polygon([P((-10,-15,-10,-15))[:2],P((10,-15,10,-15))[:2],P((0,37,0,37))[:2]],fill=(230,228,213,255))
 draw.line([P((-25,74,-25,74))[:2],P((-25,110,-25,110))[:2]],fill=(65,66,87,255),width=13)
 draw.line([P((25,74,25,74))[:2],P((25,110,25,110))[:2]],fill=(65,66,87,255),width=13)

def draw_gustav(draw,x,y,sc=1.0):
 def P(b):return tuple(int(v*sc+(x if i%2==0 else y)) for i,v in enumerate(b))
 draw.ellipse(P((-54,-65,54,43)),fill=(19,144,193,255),outline=(139,244,235,255),width=max(2,int(3*sc)))
 for a in [-20,20]: draw.arc(P((a-22,-61,a+22,42)),80,280,fill=(102,211,211,255),width=2)
 draw.arc(P((-52,-32,52,14)),0,180,fill=(102,211,211,255),width=2)
 draw.arc(P((-52,-18,52,31)),180,360,fill=(102,211,211,255),width=2)
 draw.ellipse(P((-32,-24,-4,4)),fill=(255,255,255,255));draw.ellipse(P((4,-24,32,4)),fill=(255,255,255,255))
 draw.ellipse(P((-22,-14,-12,-4)),fill=(32,46,66,255));draw.ellipse(P((14,-14,24,-4)),fill=(32,46,66,255))
 draw.arc(P((-18,-2,20,26)),0,180,fill=(33,45,65,255),width=3)
 draw.line([P((-36,35,-36,35))[:2],P((-43,59,-43,59))[:2]],fill=(139,244,235,255),width=5)
 draw.line([P((36,35,36,35))[:2],P((43,59,43,59))[:2]],fill=(139,244,235,255),width=5)

# Sphere and lines

def project(lat_deg, lon_deg, central):
 la=np.radians(lat_deg); dlo=np.radians(np.array(lon_deg))-central
 x=np.cos(la)*np.sin(dlo)
 y=np.sin(la)*np.cos(lat0)-np.cos(la)*np.cos(dlo)*np.sin(lat0)
 depth=np.sin(la)*np.sin(lat0)+np.cos(la)*np.cos(lat0)*np.cos(dlo)
 return x,y,depth

def path_globe(d,lat_arr,lon_arr,central,color,width=3):
 x,y,z=project(np.array(lat_arr),np.array(lon_arr),central)
 prior=None
 for a,b,c in zip(x,y,z):
  if c>0.005:
   p=(round(CX+a*R),round(CY-b*R))
   if prior is not None and abs(p[0]-prior[0])+abs(p[1]-prior[1])<R/3:
    d.line((prior,p),fill=color,width=width,joint='curve')
   prior=p
  else:prior=None

def sphere(central,mode,spot=None):
 cam=math.radians(central)
 lon=(cam+DLON+np.pi)%(2*np.pi)-np.pi
 lon_deg=np.degrees(lon)
 la_deg=np.degrees(LAT)
 texture_x=np.clip(np.floor((lon_deg+180)*4).astype(int),0,1439)
 texture_y=np.clip(np.floor((90-la_deg)*4).astype(int),0,719)
 mask_land=land[texture_y,texture_x]>127
 ocean=np.array([22,99,158.],dtype=np.float32)
 lc=np.array([76,166,120.],dtype=np.float32)
 color=np.where(mask_land[...,None],lc,ocean).astype(np.float32)
 north=la_deg>=0
 east=lon_deg>=0
 q=np.where(north & east,0,np.where(north&~east,1,np.where(~north&east,2,3)))
 palette=np.array([COLORS['NO'],COLORS['NW'],COLORS['SO'],COLORS['SW']],dtype=np.float32)
 if mode=='equator':
  tint=np.where(north[...,None],np.array([43.,135.,215.]),np.array([235.,174.,66.]))
  color=.64*color+.36*tint
 if mode=='meridians':
  tint=np.where(east[...,None],np.array([42.,193.,164.]),np.array([200.,123.,213.]))
  color=.70*color+.30*tint
 if mode in ('all','north','south','naming','quiz','answer'):
  alpha=.41
  if mode=='north':
   alpha=np.where(north[...,None],.56,.16)
  elif mode=='south':
   alpha=np.where((~north)[...,None],.56,.16)
  elif mode=='quiz' or mode=='answer':
   alpha=np.where((q==0)[...,None],.63,.24)
  color=(1-alpha)*color+alpha*palette[q]
 if mode in ('intro','setup'):
  color*=1.04
 color*=shader
 # specular highlight
 high=np.exp(-((x+0.22)**2+(y+0.31)**2)/0.12)[...,None]
 color+=high*17
 alpha=AA
 rgba=np.dstack((np.clip(color,0,255).astype(np.uint8),alpha))
 rgba[~inside,3]=0
 im=Image.fromarray(rgba,'RGBA')
 d=ImageDraw.Draw(im,'RGBA')
 # latitudinal + longitudinal guide grid relative to spatial reference
 for latv in [-60,-30,0,30,60]:
  p_lons=np.linspace(-180,180,721)
  path_globe_local(d,np.full_like(p_lons,latv),p_lons,cam,(194,228,243,75),1)
 for lonv in [-150,-120,-90,-60,-30,0,30,60,90,120,150,180]:
  p_lat=np.linspace(-90,90,361)
  path_globe_local(d,p_lat,np.full_like(p_lat,lonv),cam,(194,228,243,60),1)
 # prominent lines equator and prime & opposite meridian
 if mode not in ('intro','setup'):
  path_globe_local(d,np.full(721,0),np.linspace(-180,180,721),cam,(255,103,112,255),4)
 if mode not in ('intro','setup','equator'):
  for lo,col in [(0,(80,250,201,255)),(180,(248,200,90,255))]:
   path_globe_local(d,np.linspace(-90,90,361),np.full(361,lo),cam,col,4)
 if mode in ('quiz','answer'):
  # Coordinates Germany approximate 51N 10E
  u,v,z=project(51,10,cam)
  if z>0:
   px=R+u*R;py=R-v*R
   d.ellipse((px-9,py-9,px+9,py+9),fill=(255,255,255,255),outline=(245,199,78,255),width=3)
 return im

def path_globe_local(draw,lat_arr,lon_arr,cam,color,width=3):
 x0,y0,z0=project(lat_arr,lon_arr,cam)
 prev=None
 for a,b,c in zip(x0,y0,z0):
  if c>0.004:
   p=(int(R+a*R),int(R-b*R))
   if prev is not None and abs(p[0]-prev[0])+abs(p[1]-prev[1])<R/4:
    draw.line((prev,p),fill=color,width=width,joint='curve')
   prev=p
  else:prev=None

def wrap_text(draw,text,f,maxw):
 words=text.split(); lines=[]; cur=''
 for word in words:
  cand=(cur+' '+word).strip()
  if draw.textbbox((0,0),cand,font=f)[2]>maxw and cur:
   lines.append(cur);cur=word
  else:cur=cand
 if cur:lines.append(cur)
 return lines

def draw_legend(draw,mode):
 if mode not in ('all','north','south','naming','quiz','answer'): return
 # 2x2 geographische Matrix West links, Ost rechts; Nord oben, Süd unten
 x0,y0=773,340
 draw.text((x0,y0-29),'Schematische Übersicht',font=font(20,True),fill=(143,185,207))
 boxes=[('NW','NORDWEST',x0,y0),('NO','NORDOST',x0+184,y0),('SW','SÜDWEST',x0,y0+88),('SO','SÜDOST',x0+184,y0+88)]
 for key,txt,x,y in boxes:
  active=mode=='all' or mode=='naming' or (mode=='north' and key in ('NW','NO')) or (mode=='south' and key in ('SW','SO')) or (mode in ('quiz','answer') and key=='NO')
  c=COLORS[key]
  fill=(*c,90 if active else 30)
  draw.rounded_rectangle((x,y,x+174,y+76),radius=14,fill=fill,outline=(*c,220 if active else 80),width=3 if active else 1)
  tx=x+12; ty=y+27
  draw.text((tx,ty),txt,font=font(17,True),fill=(248,251,255) if active else (139,166,181))
 draw.text((x0,y0+185),'Erst Nord/Süd, dann Ost/West',font=font(18),fill=(197,215,230))

def scene_cam(i,t):
 base=SCENES[i][5]
 if i==3: return base + t*26
 if i==4: return base + t*24
 if i==5: return base-t*16
 if i==6: return base-t*18
 return base+3*np.sin(t*1.7)

def frame_scene(i,localframe):
 role,spoken,title,point,mode,cam=SCENES[i]
 t=localframe/FPS
 im=bg.copy();d=ImageDraw.Draw(im,'RGBA')
 # fixed top label and episode badge
 d.rounded_rectangle((38,25,430,67),radius=21,fill=(21,62,89,211),outline=(79,167,186,128),width=2)
 d.text((57,35),'ERDKUNDE MIT GUSTAV GLOBUS',font=font(19,True),fill=(202,244,247))
 d.rounded_rectangle((1100,26,1237,65),radius=19,fill=(72,128,158,142))
 d.text((1118,35),'FOLGE 04',font=font(19,True),fill='white')
 d.text((69,77),'Vier Erdviertelkugeln',font=font(34,True),fill=(248,251,255))
 # globe shadow
 d.ellipse((CX-R-3,CY-R+13,CX+R+22,CY+R+31),fill=(0,7,17,130))
 g=sphere(scene_cam(i,t),mode)
 im.alpha_composite(g,(CX-R,CY-R))
 d=ImageDraw.Draw(im,'RGBA')
 # show pole labels near globe, equator annotation left
 if mode not in ('intro','setup'):
  d.rounded_rectangle((73,354,205,390),radius=14,fill=(96,27,47,226))
  d.text((87,363),'ÄQUATOR',font=font(18,True),fill=(255,194,194))
  d.line((205,372,247,372),fill=(255,103,112,255),width=3)
 # text panel on right
 d.rounded_rectangle((702,112,1228,592),radius=27,fill=(10,32,58,221),outline=(75,126,159,140),width=2)
 heading_font=font(32,True)
 while d.textbbox((0,0),title,font=heading_font)[2]>448:
  heading_font=font(heading_font.size-1,True)
 d.text((744,148),title,font=heading_font,fill=(255,255,255))
 d.rounded_rectangle((743,207,1185,216),radius=4,fill=(78,197,187,170))
 lines=wrap_text(d,point,font(25),439)
 for j,line in enumerate(lines[:3]):d.text((744,238+j*38),line,font=font(25),fill=(210,231,242))
 draw_legend(d,mode)
 # character icon bottom right if no diagram
 if mode in ('intro','setup','equator','meridians'):
  draw_paul(d,830,465,.75);draw_welt(d,948,465,.76);draw_gustav(d,1104,471,.9)
  d.text((791,563),'PAUL',font=font(16,True),fill=(180,216,243))
  d.text((906,563),'HERR WELT',font=font(16,True),fill=(178,227,214))
  d.text((1065,563),'GUSTAV',font=font(16,True),fill=(181,238,228))
 # subtitle role + speech text on bottom
 role_color={'Paul':(240,200,93),'Herr Welt':(91,225,193),'Gustav':(109,202,255)}[role]
 d.rounded_rectangle((47,631,205,680),radius=15,fill=(*role_color,55),outline=(*role_color,210),width=2)
 d.text((65,644),role.upper(),font=font(21,True),fill=(251,254,255))
 # show speech broken into readable 2 lines (can shrink for length)
 subtfont=font(21)
 wrapped=wrap_text(d,spoken,subtfont,994)
 if len(wrapped)>2:
  subtfont=font(18)
  wrapped=wrap_text(d,spoken,subtfont,1007)
 for j,l in enumerate(wrapped[:2]):d.text((226,637+j*31),l,font=subtfont,fill=(245,248,254))
 return im

# Create poster and contact sheet sample
for i,name in [(0,'intro'),(3,'meridiane'),(4,'viertel'),(9,'quiz')]:
 img=frame_scene(i,0)
 img.convert('RGB').save(f'{TMP}/preview_{name}.jpg',quality=88)
if True:
 thumbs=[]
 for i in [0,3,4,9]:thumbs.append(frame_scene(i,10).resize((640,360)))
 contact=Image.new('RGB',(1280,720))
 for j,timg in enumerate(thumbs):contact.paste(timg,((j%2)*640,(j//2)*360))
 contact.save(f'{OUT}/Gustav_Globus_Folge4_Vorschau.jpg',quality=85)

# Subtitle SRT saved separately (scene aligned)
clock=lambda secs:f'{int(secs//3600):02}:{int(secs%3600//60):02}:{int(secs%60):02},{int((secs%1)*1000):03}'
start=0.;srt=[]
for k,(sc,nframes) in enumerate(zip(SCENES,scene_frames),1):
 length=nframes/FPS
 a=start+.28;b=start+length-.25
 srt.extend([str(k),f'{clock(a)} --> {clock(b)}',f'{sc[0]}: {sc[1]}',''])
 start+=length
open(f'{OUT}/Gustav_Globus_Folge4_Untertitel.srt','w',encoding='utf-8').write('\n'.join(srt))
# text educational accompanying script
with open(f'{OUT}/Gustav_Globus_Folge4_Sprechtext.txt','w',encoding='utf-8') as fh:
 fh.write('Paul und Gustav Globus – Folge 4: Die vier Erdviertelkugeln\n\n')
 for item in SCENES:fh.write(f'{item[0]}: {item[1]}\n\n')
 fh.write('Hinweis: Nordost bedeutet nördlich des Äquators und östlich des Nullmeridians; die Viertelkugeln werden durch Äquator sowie den vollständigen Großkreis aus Null- und 180°-Meridian abgegrenzt. Benennungsreihenfolge ist Konvention.\n')

# encode via pipe
video=f'{OUT}/Paul_und_Gustav_Globus_Folge_4_Erdviertelkugeln.mp4'
command=['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',f'{TMP}/episode4_audio.wav','-map','0:v','-map','1:a','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',video]
print('STARTE VIDEO',round(DURATION,1),'s',flush=True)
proc=subprocess.Popen(command,stdin=subprocess.PIPE,stderr=open(f'{TMP}/render_err.txt','w'),bufsize=1000000)
try:
 k=0
 for scene_i,nframes in enumerate(scene_frames):
  for frame_i in range(nframes):
   frame=frame_scene(scene_i,frame_i)
   proc.stdin.write(np.asarray(frame.convert('RGB')).tobytes())
   k+=1
  print('gerendert:',scene_i+1,'/',len(scene_frames),'total',k,'/',TOTAL,flush=True)
finally:
 try:proc.stdin.close()
 except BrokenPipeError:pass
proc.wait()
print('FINISHED:',proc.returncode,'path',video,'bytes',os.path.getsize(video) if os.path.exists(video) else None,flush=True)