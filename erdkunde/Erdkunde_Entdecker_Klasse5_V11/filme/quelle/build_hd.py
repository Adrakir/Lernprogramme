#!/usr/bin/env python3
"""HD-Neubild zu Folgen 4–7. Originalsprache bleibt 1:1, keine TTS-Aufrufe.

python filme/quelle/build_hd.py --episode 4
Die zeitliche Grundlage sind die Original-MP4 und ihre szenengenauen SRT-Dateien.
Pillow/NumPy/Basemap erzeugen fachliche Projektionen, FFmpeg kodiert H.264/AAC.
"""
import argparse, ast, functools, json, math, re, subprocess
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from mpl_toolkits.basemap import Basemap

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(__file__).parent / 'assets'
OUT = ROOT / 'videos' / 'hd-20261031'
OUT.mkdir(exist_ok=True)
W, H, FPS = 1920, 1080, 25
BG = '#f4f6ef'
INK = '#142b43'
MUTED = '#4c6273'
RED = '#c93848'
GREEN = '#087a70'
GOLD = '#ffce40'
BLUE = '#265ca5'
QCOL = np.array([[53,167,153],[115,133,210],[236,168,67],[202,112,148]],np.float32)
FONTDIR = Path('/usr/share/fonts/truetype')

@functools.lru_cache(maxsize=50)
def font(size, bold=False):
    p = FONTDIR / 'lato' / ('Lato-Bold.ttf' if bold else 'Lato-Regular.ttf')
    if not p.exists():
        p = FONTDIR / 'dejavu' / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')
    return ImageFont.truetype(str(p), size)

def probe(p):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)]))

def ease(t):
    t = max(0., min(1., t))
    return t*t*(3-2*t)

def wrap(text, size, width, bold=False):
    d=ImageDraw.Draw(Image.new('RGB',(1,1)))
    result=[]; line=''
    for word in text.split():
        trial=(line+' '+word).strip()
        if d.textlength(trial,font=font(size,bold)) > width and line:
            result.append(line); line=word
        else: line=trial
    if line: result.append(line)
    return result

def text(im, words, xy, size=48, color=INK, bold=False, width=None, align='left'):
    d=ImageDraw.Draw(im)
    lines=wrap(words,size,width,bold) if width else [words]
    for i,line in enumerate(lines):
        x,y=xy
        if align=='center': x-=d.textlength(line,font=font(size,bold))/2
        d.text((round(x),round(y+i*(size+12))),line,font=font(size,bold),fill=color)
    return len(lines)*(size+12)

def label(im, words, xy, size=42, color=INK, fill='white'):
    d=ImageDraw.Draw(im); tw=d.textlength(words,font=font(size,True))
    x,y=xy
    d.rounded_rectangle((x-16,y-8,x+tw+16,y+size+12),radius=13,fill=fill)
    d.text((x,y),words,font=font(size,True),fill=color)

def arrow(im,a,b,color=INK,width=7):
    d=ImageDraw.Draw(im);d.line((a,b),fill=color,width=width)
    v=np.array(a,float)-np.array(b,float);v/=max(1,np.linalg.norm(v))
    p=np.array([-v[1],v[0]])
    q=np.array(b)
    d.polygon([tuple(q),tuple(q+v*24+p*12),tuple(q+v*24-p*12)],fill=color)

FIG=Image.open(ASSETS/'figuren-20261031.webp').convert('RGBA')
HOUSE=Image.open(ASSETS/'haus-ansichten-20261031.webp').convert('RGBA')
FIG_BOUNDS={'Paul':(52,125,365,590),'Herr Welt':(590,20,978,545),'Gustav':(1050,330,1518,820)}

@functools.lru_cache(maxsize=12)
def character(role, height):
    tile=FIG.crop(FIG_BOUNDS[role]);tile=tile.crop(tile.getbbox())
    tile.thumbnail((500,height),Image.Resampling.LANCZOS)
    return tile

def cast(im, role, x=85, y=370, height=400):
    tile=character(role,height)
    im.alpha_composite(tile,(int(x),int(y)))
    text(im,role,(x+tile.width/2,y+tile.height+18),32,MUTED,True,align='center')

@functools.lru_cache(maxsize=2)
def land_texture():
    base=Basemap(projection='cyl',llcrnrlon=-180,urcrnrlon=180,llcrnrlat=-90,urcrnrlat=90,resolution='c')
    mask=Image.new('L',(1440,720));d=ImageDraw.Draw(mask)
    for poly in base.landpolygons:
        pts=[((float(a)+180)*4,(90-float(b))*4) for a,b in poly.get_coords()]
        if len(pts)>2: d.polygon(pts,fill=255)
    return np.asarray(mask)

def project(lat,lon,clat=20,clon=0):
    la=np.radians(lat);lo=np.radians(np.asarray(lon)-clon);p=math.radians(clat)
    x=np.cos(la)*np.sin(lo)
    y=np.sin(la)*math.cos(p)-np.cos(la)*np.cos(lo)*math.sin(p)
    z=np.sin(la)*math.sin(p)+np.cos(la)*np.cos(lo)*math.cos(p)
    return x,y,z

def geo_path(im,lats,lons,cx,cy,r,clat,clon,color,width=6,progress=1.):
    n=max(2,round(len(lats)*progress))
    x,y,z=project(np.asarray(lats[:n]),np.asarray(lons[:n]),clat,clon)
    d=ImageDraw.Draw(im);run=[]
    for a,b,c in zip(x,y,z):
        if c>=-0.001:
            run.append((round(cx+r*a),round(cy-r*b)))
        else:
            if len(run)>1: d.line(run,fill=color,width=width,joint='curve')
            run=[]
    if len(run)>1: d.line(run,fill=color,width=width,joint='curve')

@functools.lru_cache(maxsize=10)
def sphere_base(r,clat,clon,tint):
    sz=2*r+2; yy,xx=np.mgrid[0:sz,0:sz]
    x=(xx-r)/r;y=(r-yy)/r;rr=x*x+y*y;z=np.sqrt(np.maximum(0,1-rr))
    p=math.radians(clat)
    lat=np.degrees(np.arcsin(np.clip(y*math.cos(p)+z*math.sin(p),-1,1)))
    lon=(np.degrees(np.arctan2(x,z*math.cos(p)-y*math.sin(p)))+clon+180)%360-180
    land=land_texture()[np.clip(((90-lat)*4).astype(int),0,719),np.clip(((lon+180)*4).astype(int),0,1439)]>128
    rgb=np.where(land[...,None],np.array([111.,178.,124.]),np.array([76.,157.,199.])).astype(np.float32)
    north=lat>=0;east=lon>=0
    q=np.where(north & east,0,np.where(north&~east,1,np.where(~north&east,2,3)))
    if tint in ['all','north','south','naming','quiz4','answer4']:
        k=np.full(rr.shape,.48,dtype=np.float32)
        if tint=='north': k=np.where(north,.72,.12)
        if tint=='south': k=np.where(~north,.72,.12)
        rgb=rgb*(1-k[...,None])+QCOL[q]*k[...,None]
    elif tint=='equator':
        rgb=rgb*.64+np.where(north[...,None],np.array([65.,147.,214.]),np.array([237.,189.,95.]))*.36
    elif tint=='meridians':
        rgb=rgb*.64+np.where(east[...,None],np.array([47.,179.,159.]),np.array([149.,125.,208.]))*.36
    rgb*=np.clip(.75+.26*z-.05*x,.6,1.1)[...,None]
    rgb+=np.exp(-((x+.25)**2+(y-.3)**2)/.12)[...,None]*18
    alpha=np.clip((1.002-np.sqrt(rr))*r,0,1)*255
    return Image.fromarray(np.dstack((np.clip(rgb,0,255).astype(np.uint8),alpha.astype(np.uint8))),'RGBA')

def marker(im,lat,lon,cx,cy,r,clat,clon,radius=11,color=GOLD):
    x,y,z=project(lat,lon,clat,clon)
    if z<0: return None
    a,b=cx+r*x,cy-r*y
    d=ImageDraw.Draw(im);d.ellipse((a-radius-4,b-radius-4,a+radius+4,b+radius+4),fill='white')
    d.ellipse((a-radius,b-radius,a+radius,b+radius),fill=color,outline=INK,width=2)
    return a,b

def globe(im, mode='grid', cx=1020,cy=510,r=330,clat=20,clon=0,p=1,episode=6):
    base=sphere_base(r,round(clat,2),round(clon,2),mode if episode==4 else '')
    im.alpha_composite(base,(round(cx-r),round(cy-r)))
    d=ImageDraw.Draw(im)
    for lat in [-60,-30,0,30,60]:
        ls=np.linspace(-180,180,361)
        geo_path(im,np.full_like(ls,lat),ls,cx,cy,r,clat,clon,'#ccdfdc',2)
    for lon in range(-150,181,30):
        las=np.linspace(-90,90,181)
        geo_path(im,las,np.full_like(las,lon),cx,cy,r,clat,clon,'#ccdfdc',2)
    if mode not in ['intro','setup','pause']:
        ls=np.linspace(-180,180,721)
        geo_path(im,np.zeros_like(ls),ls,cx,cy,r,clat,clon,RED,7,p if mode=='equator' else 1)
    if mode in ['meridians','all','north','south','naming','quiz4','answer4','longitude','sidegrid','topgrid','tilt','top','quiz5','answer5']:
        for lo in [0,180]:
            las=np.linspace(90,-90,361)
            geo_path(im,las,np.full_like(las,lo),cx,cy,r,clat,clon,GREEN,7,p if mode=='meridians' else 1)
    if mode in ['latitude']:
        for la in [-60,-30,30,60]:
            ls=np.linspace(-180,180,721)
            geo_path(im,np.full_like(ls,la),ls,cx,cy,r,clat,clon,RED,5,p)
    if mode in ['longitude']:
        for lo in [-60,-30,30,60]:
            las=np.linspace(90,-90,361)
            geo_path(im,las,np.full_like(las,lo),cx,cy,r,clat,clon,GREEN,5,p)
    if mode in ['step1','step2','intersection','curve','trace','example','quiz6','answer6']:
        ls=np.linspace(-180,180,721)
        if mode!='example':geo_path(im,np.full_like(ls,52),ls,cx,cy,r,clat,clon,RED,8,p if mode=='step1' else 1)
        if mode in ['step2','intersection','curve','trace','answer6']:
            las=np.linspace(90,-90,721)
            geo_path(im,las,np.full_like(las,10),cx,cy,r,clat,clon,GREEN,8,p if mode=='step2' else 1)
        if mode in ['intersection','answer6']: marker(im,52,10,cx,cy,r,clat,clon,15)
        if mode in ['curve','trace']:
            lat=90-(90-52)*p
            marker(im,lat,10,cx,cy,r,clat,clon,13)
    if mode in ['side','sidegrid','tilt','top','topgrid','compare','quiz5','answer5']:
        q=marker(im,90,0,cx,cy,r,clat,clon,8,color='white')
        if q:
            lx,ly=q[0]+25,q[1]-35
            label(im,'Nordpol',(lx,ly),31)
        if clat>=89:
            ImageDraw.Draw(im).ellipse((cx-r,cy-r,cx+r,cy+r),outline=RED,width=7)
            label(im,'Äquator am Rand',(cx-r+45,cy+r+15),32,RED)
    if episode==4 and mode in ['quiz4','answer4']:
        q=marker(im,51,10,cx,cy,r,clat,clon,13)
        if q: label(im,'Deutschland',(q[0]+30,q[1]-20),31)

def quarter_labels(im, mode, cx=1020,cy=510):
    if mode not in ['all','north','south','naming','quiz4','answer4']: return
    active=['NO','NW','SO','SW']
    if mode=='north':active=['NO','NW']
    if mode=='south':active=['SO','SW']
    if mode=='quiz4':active=[]
    if mode=='answer4':active=['NO']
    positions=[('NW','Nordwest',cx-350,cy-170),('NO','Nordost',cx+160,cy-170),('SW','Südwest',cx-350,cy+130),('SO','Südost',cx+160,cy+130)]
    for key,word,x,y in positions:
        if key in active:label(im,word,(x,y),40)

def atlas_xy(lat,lon,curved=False):
    # Equirektangulare Deutschland-Übung; zweite Darstellung: Sinusoidalprojektion.
    if curved:
        return 1040+(lon+60)*math.cos(math.radians(lat))*6.2,815-(lat-20)*8.2
    return 575+(lon-5)*105,805-(lat-47)*67

@functools.lru_cache(maxsize=2)
def atlas_base(curved=False):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    x0,y0,x1,y1=(575,165,1793,805)
    d.rectangle((x0,y0,x1,y1),fill='#e2eef0')
    base=Basemap(projection='cyl',llcrnrlon=-180,urcrnrlon=180,llcrnrlat=-90,urcrnrlat=90,resolution='l')
    layer=Image.new('RGBA',(W,H),(0,0,0,0));ld=ImageDraw.Draw(layer)
    # Sourced coastlines and national borders; drawn on a clipped map layer.
    for poly in base.landpolygons:
        pts=[atlas_xy(float(b),float(a),curved) for a,b in poly.get_coords()]
        if len(pts)>2:ld.polygon(pts,fill='#e7ebd3',outline='#8b9c8b',width=2)
    base.drawcountries()
    for seg in base.cntrysegs:
        pts=[atlas_xy(float(b),float(a),curved) for a,b in seg]
        if len(pts)>1:ld.line(pts,fill='#a0ab98',width=2)
    layer=layer.crop((x0,y0,x1,y1));im.alpha_composite(layer,(x0,y0))
    d=ImageDraw.Draw(im)
    for la in (range(20,81,10) if curved else range(47,57)):
        ls=np.linspace(-70,80,600) if curved else np.linspace(5,16.6,250)
        pts=[atlas_xy(la,lo,curved) for lo in ls]
        ld=ImageDraw.Draw(im);ld.line(pts,fill='#b1c8c8',width=2)
    for lo in (range(-60,81,20) if curved else range(5,17)):
        las=np.linspace(20,80,250) if curved else np.linspace(47,56.5,250)
        pts=[atlas_xy(la,lo,curved) for la in las]
        ImageDraw.Draw(im).line(pts,fill='#b1c8c8',width=2)
    # Clip all geometry once more; retain outside degree labels only for the flat map.
    clipped=Image.new('RGBA',(W,H),(0,0,0,0))
    clipped.alpha_composite(im.crop((x0,y0,x1,y1)),(x0,y0))
    if not curved:
        for la in range(48,57):
            a,b=atlas_xy(la,5);text(clipped,f'{la}° N',(a-91,b-21),30,MUTED)
        for lo in range(5,17):
            a,b=atlas_xy(47,lo);text(clipped,f'{lo}° O',(a,b+24),29,MUTED,align='center')
    ImageDraw.Draw(clipped).rectangle((x0,y0,x1,y1),outline='#80989b',width=3)
    return clipped

def atlas(im,mode,p):
    curved=mode in ['curve','trace']
    im.alpha_composite(atlas_base(curved))
    la,lo=(50,12) if mode in ['quiz','answer'] else (52,10)
    d=ImageDraw.Draw(im)
    def path_lat(progress=1):
        ls=np.linspace(-60,70,401) if curved else np.linspace(5,16.6,401)
        pts=[atlas_xy(la,x,curved) for x in ls[:max(2,int(len(ls)*progress))]]
        d.line(pts,fill=RED,width=8,joint='curve')
    def path_lon(progress=1):
        las=np.linspace(80,20,401) if curved else np.linspace(56.5,47,401)
        pts=[atlas_xy(x,lo,curved) for x in las[:max(2,int(len(las)*progress))]]
        d.line(pts,fill=GREEN,width=8,joint='curve')
    if mode in ['step1','step2','intersection','hannover','trace','between','answer']:
        path_lat(p if mode=='step1' else 1)
    if mode in ['step2','intersection','hannover','curve','trace','between','answer']:
        path_lon(p if mode=='step2' else 1)
    if mode in ['curve','trace']:
        pt=atlas_xy(80-(80-52)*p,10,True)
        d.ellipse((pt[0]-13,pt[1]-13,pt[0]+13,pt[1]+13),fill=GOLD,outline=INK,width=2)
        at=atlas_xy(70,10,True);label(im,'10° O',(at[0]+22,at[1]),35,GREEN)
        text(im,'Sinusoidalprojektion · anderer Kartenausschnitt',(575,867),26,MUTED)
    else:text(im,'Übungskarte · vereinfachter Deutschland-Ausschnitt',(575,867),26,MUTED)
    if mode in ['intersection','hannover','between','answer']:
        a,b=atlas_xy(la,lo,curved)
        d.ellipse((a-13,b-13,a+13,b+13),fill=GOLD,outline=INK,width=3)
        label(im,f'{la}° N, {lo}° O',(a+35,b+25),35)
    if mode=='hannover':
        a,b=atlas_xy(52.3759,9.732)
        d.ellipse((a-6,b-6,a+6,b+6),fill=INK)
        arrow(im,(a-125,b-65),(a,b),INK,4)
        label(im,'Hannover',(a-245,b-114),34)
    if mode=='between':
        a,b=atlas_xy(52.4,9.7)
        d.ellipse((a-10,b-10,a+10,b+10),fill=GOLD,outline=INK,width=3)
        label(im,'52,4° N · 9,7° O',(a+30,b-76),35)

def scenes_for(n):
    tree=ast.parse((Path(__file__).parent/f'build_folge{n}.py').read_text())
    for x in tree.body:
        if isinstance(x,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='SCENES' for t in x.targets):
            return ast.literal_eval(x.value)
    raise ValueError('SCENES fehlt')

def stamp(s):
    h,m,v=s.replace(',','.').split(':');return float(h)*3600+float(m)*60+float(v)

def timeline(n):
    scenes=scenes_for(n)
    srt=(ROOT/'videos'/f'Gustav_Globus_Folge{n}_Untertitel.srt').read_text()
    intervals=re.findall(r'(\d\d:\d\d:\d\d,\d+) --> (\d\d:\d\d:\d\d,\d+)',srt)
    assert len(scenes)==len(intervals)
    duration=float(probe(ROOT/'videos'/f'folge-{n}.mp4')['format']['duration'])
    starts=[max(0,stamp(a)-.28) for a,b in intervals]
    ends=starts[1:]+[duration]
    return [dict(scene=s,start=a,end=b,caption_start=stamp(c),caption_end=stamp(d)) for s,a,b,(c,d) in zip(scenes,starts,ends,intervals)],duration

@functools.lru_cache(maxsize=80)
def static_scene(n,i):
    s=scenes_for(n)[i];role,speech,title,point,mode,cam=s
    im=Image.new('RGBA',(W,H),BG)
    # Calm editorial textbook: one concept, large diagrams, one stable subtitle treatment.
    text(im,title,(72,45),57,INK,True,width=1730)
    ImageDraw.Draw(im).line((75,128,1845,128),fill='#d6dfd4',width=3)
    cast(im,role,88,340,390)
    text(im,point,(75,178),43,INK,True,width=420)
    return im

def frame(n,i,t,entry):
    role,speech,title,point,mode,cam=entry['scene']
    im=static_scene(n,i).copy()
    p=ease((t-.45)/3.0)
    if n==4:
        mode={'quiz':'quiz4','answer':'answer4'}.get(mode,mode)
        clat,clon=(5,0)
        if mode=='meridians':clon=0+180*ease((t-2)/4)
        globe(im,mode,clat=clat,clon=clon,p=p,episode=4)
        quarter_labels(im,mode)
        if mode=='equator':
            label(im,'Norden',(1440,310),47,BLUE)
            label(im,'Süden',(1440,650),47,'#90651c')
            label(im,'0° Breite',(1410,490),36,RED)
        elif mode=='meridians':
            text(im,'Nullmeridian: 0° Länge',(1430,350),38,GREEN,True,width=410)
            text(im,'Gegenüber: 180° Länge',(1430,545),38,GREEN,True,width=410)
        elif mode=='naming':
            label(im,'1. Nord / Süd',(1440,350),42)
            arrow(im,(1565,430),(1565,500),GREEN)
            label(im,'2. Ost / West',(1440,540),42)
        if mode=='quiz4':text(im,'Überlege in Ruhe.',(1430,470),42,INK,True,width=380)
    elif n==5:
        if mode=='building':
            # Generated orthographic views of one and the same building.
            left=HOUSE.crop((0,40,1080,640));right=HOUSE.crop((1110,40,2172,640))
            left.thumbnail((640,540),Image.Resampling.LANCZOS);right.thumbnail((640,540),Image.Resampling.LANCZOS)
            im.alpha_composite(left,(540,300));im.alpha_composite(right,(1220,300))
            text(im,'Seitenansicht',(850,710),43,INK,True,align='center')
            text(im,'Draufsicht',(1535,710),43,INK,True,align='center')
            text(im,'Tür und Fenster',(850,775),37,MUTED,align='center')
            text(im,'Dach und Stufen',(1535,775),37,MUTED,align='center')
        elif mode=='compare':
            globe(im,'sidegrid',cx=865,cy=485,r=260,clat=0,clon=15,episode=5)
            globe(im,'topgrid',cx=1490,cy=485,r=260,clat=90,clon=15,episode=5)
            text(im,'von der Seite',(865,815),39,INK,True,align='center')
            text(im,'über dem Nordpol',(1490,815),39,INK,True,align='center')
        else:
            lat=90*ease(t/4) if mode=='tilt' else (90 if mode in ['top','topgrid','answer'] else 0)
            if mode=='quiz':
                lat=90;mode='quiz5'
            if mode=='answer':mode='answer5'
            globe(im,mode,clat=lat,clon=15,p=p,episode=5)
            msg='Nordpol in der Mitte' if lat==90 else 'Blick von der Seite'
            if mode=='tilt':msg='Unser Blick wandert zum Nordpol'
            text(im,msg,(1420,385),43,INK,True,width=420)
    elif n==6:
        clat,clon=cam
        mode={'quiz':'quiz6','answer':'answer6'}.get(mode,mode)
        globe(im,mode,clat=clat,clon=clon,p=p,episode=6)
        if mode in ['step1','step2','intersection','curve','trace','answer6','example']:
            label(im,'52° N',(1435,325),54,RED)
            if mode not in ['step1']:label(im,'10° O',(1435,460),54,GREEN)
            if mode in ['intersection','answer6']:text(im,'Schnittpunkt',(1435,620),43,INK,True)
        elif mode=='latitude':text(im,'parallel zum Äquator',(1435,385),41,RED,True,width=400)
        elif mode=='longitude':text(im,'von Pol zu Pol',(1435,385),43,GREEN,True,width=400)
        elif mode=='quiz6':text(im,'Breite oder Länge?',(1435,385),44,INK,True,width=400)
    else:
        atlas(im,mode,p)
        if mode in ['index','intro']:
            # A simplified contents page, not a fabricated branded atlas screenshot.
            d=ImageDraw.Draw(im);d.rounded_rectangle((640,255,1740,745),radius=20,fill='white',outline='#c6d2c8',width=3)
            text(im,'Inhaltsverzeichnis',(700,300),55,INK,True)
            for j,name in enumerate(['Welt','Europa','Deutschland']):
                y=400+j*95
                if name=='Deutschland' and mode=='index':d.rounded_rectangle((685,y-7,1685,y+73),radius=12,fill='#dceee5')
                text(im,name,(720,y),46,GREEN if name=='Deutschland' else MUTED,name=='Deutschland')
        if mode=='rule':
            label(im,'1. Breite',(740,400),65,RED)
            arrow(im,(1110,450),(1250,450),INK,8)
            label(im,'2. Länge',(1320,400),65,GREEN)
        if mode=='quiz':
            text(im,'Was suchst du zuerst?',(1060,320),53,INK,True,align='center')
            label(im,'50° N',(800,465),62,RED)
            label(im,'12° O',(1270,465),62,GREEN)
    # Exact original full-sentence subtitles: no fabricated word-level timing.
    if entry['caption_start']<=entry['start']+t<entry['caption_end']:
        lines=wrap(speech,44,1740)
        assert len(lines)<=3,(n,i,len(lines))
        d=ImageDraw.Draw(im);y=H-44-len(lines)*54
        d.rounded_rectangle((50,y-17,1870,1058),radius=20,fill='#142b43')
        for j,line in enumerate(lines):text(im,line,(960,y+j*54),44,'white',align='center')
    return im.convert('RGB')

def render(n, preview=False):
    entries,duration=timeline(n)
    dest=OUT/f'folge-{n}-hd.mp4'
    samples=[(0,1.0),(min(3,len(entries)-1),2.5),(len(entries)-2,1.5)]
    for i,t in samples:frame(n,i,t,entries[i]).save(OUT/f'folge-{n}-szene-{i+1}.jpg',quality=90)
    frame(n,min(2,len(entries)-1),1.5,entries[min(2,len(entries)-1)]).save(OUT/f'folge-{n}-poster.jpg',quality=90)
    if preview:
        print('Vorschauen',n,flush=True);return
    audio=OUT/f'folge-{n}-ton.m4a'
    # Keep cadence and pitch. Filter the old music's low band, balance speech, true-peak limit.
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(ROOT/'videos'/f'folge-{n}.mp4'),'-vn','-af','highpass=f=120,lowpass=f=10000,loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000','-c:a','aac','-b:a','160k',str(audio)],check=True)
    cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(audio),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','copy','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',str(dest)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        total=math.ceil(duration*FPS);idx=0
        for k in range(total):
            sec=k/FPS
            while idx<len(entries)-1 and sec>=entries[idx]['end']:idx+=1
            proc.stdin.write(frame(n,idx,sec-entries[idx]['start'],entries[idx]).tobytes())
            if k%(FPS*10)==0:print(f'Folge {n}: {k/FPS:.0f}/{duration:.1f} s',flush=True)
        proc.stdin.close();code=proc.wait()
        if code:raise RuntimeError(f'ffmpeg {code}')
    except BaseException:
        proc.kill();raise
    (OUT/f'folge-{n}.srt').write_text((ROOT/'videos'/f'Gustav_Globus_Folge{n}_Untertitel.srt').read_text(),encoding='utf-8')
    meta=probe(dest)
    manifest=dict(episode=n,width=W,height=H,fps=FPS,duration=float(meta['format']['duration']),original_duration=duration,audio='Originalstimmen; Sprache gefiltert und Lautheit angeglichen; keine neuen natürlichen Stimmen',new_tts=False,scenes=len(entries),listening_review='not_performed',source=f'../folge-{n}.mp4')
    (OUT/f'folge-{n}-pruefung.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print('FERTIG',dest,dest.stat().st_size,flush=True)

if __name__=='__main__':
    a=argparse.ArgumentParser();a.add_argument('--episode',type=int,choices=[4,5,6,7],required=True);a.add_argument('--preview',action='store_true');args=a.parse_args()
    render(args.episode,args.preview)
