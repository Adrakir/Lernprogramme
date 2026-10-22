/* Bewegte Modelle und geführte Kartenarbeit. Keine externen Laufzeitbibliotheken. */
'use strict';
(function(){
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const savedMapProgress=progress.guides?.diepholzMap||{};
const geoMapState={
 selected:['school','shop','wood','river'].includes(savedMapProgress.selected)?savedMapProgress.selected:'school',
 zoom:Math.max(1,Math.min(3,Number(savedMapProgress.zoom)||1)),
 step:Math.max(0,Math.min(5,Number(savedMapProgress.step)||0)),
 answer:['N','O','S','W'].includes(savedMapProgress.answer)?savedMapProgress.answer:'',
 done:Array.from({length:5},(_,i)=>savedMapProgress.done?.[i]===true),
 completedRuns:Math.max(0,Number(savedMapProgress.completedRuns)||0)
};
function geoSaveMapProgress(){
 progress.guides=progress.guides||{};
 progress.guides.diepholzMap={...progress.guides.diepholzMap,selected:geoMapState.selected,zoom:geoMapState.zoom,step:geoMapState.step,answer:geoMapState.answer,done:geoMapState.done,completedRuns:geoMapState.completedRuns};
 save();
}
window.geoGrid=geoGrid;window.geoContour=geoContour;window.geoRealMapSvg=geoRealMapSvg;window.geoLandmarks=geoLandmarks;
const geoBookVisual=geoLearningVisual;
geoLearningVisual=function(topic){return topic==='gradnetz'?geoGrid():topic==='relief'?geoContour():geoBookVisual(topic)};
if(typeof MAIN==='undefined')return;
const geoMotion={enabled:true,angle:90,altitude:2,relief:110};
const geoReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function geoMovingScene(angle,drone=false,altitude=2){
 return `<div class="geo-motion-stage" data-angle="${angle}" data-altitude="${altitude}" data-drone="${drone}"><div class="geo-motion-frame">${geoScene(angle,1,false,altitude)}</div><div class="geo-motion-controls"><button type="button" class="btn ghost small" data-geo-motion="replay">Blickwechsel animieren ↻</button><button type="button" class="btn ghost small" data-geo-motion="toggle">${geoMotion.enabled?'Bewegung anhalten':'Bewegung starten'}</button><span class="mini">Kamera kippen: Dach und Fassade verändern sich gemeinsam.</span></div></div>`;
}
function geoRunScene(stage,replay=false){
 if(!stage?.isConnected)return;
 const end=+stage.dataset.angle,alt=+stage.dataset.altitude,frame=stage.querySelector('.geo-motion-frame');
 const active=geoMotion.enabled&&!geoReduced()&&(typeof g9==='undefined'||g9.animated);
 const start=replay?(end===90?25:90):geoMotion.angle;
 const startAlt=geoMotion.altitude;
 const begin=performance.now();stage._geoRun=(stage._geoRun||0)+1;const run=stage._geoRun;
 const paint=(a,height)=>{
  let svg=geoScene(a,1,false,height);
  if(stage.dataset.drone==='true')svg=svg.replace('</svg>','<g class="geo-drone-icon" aria-hidden="true" fill="#e6ba4b" stroke="#254f63" stroke-width="3"><path d="M590 65L628 85M590 85L628 65"/><ellipse cx="609" cy="75" rx="13" ry="7"/><ellipse cx="588" cy="63" rx="12" ry="4"/><ellipse cx="630" cy="87" rx="12" ry="4"/><ellipse cx="588" cy="87" rx="12" ry="4"/><ellipse cx="630" cy="63" rx="12" ry="4"/></g></svg>');
  frame.innerHTML=svg;geoMotion.angle=a;geoMotion.altitude=height;
 };
 const tick=now=>{
  if(!stage.isConnected||stage._geoRun!==run)return;
  const t=active?Math.min(1,(now-begin)/1700):1,smooth=t*t*(3-2*t);
  paint(start+(end-start)*smooth,startAlt+(alt-startAlt)*smooth);
  if(t<1&&geoMotion.enabled&&!document.hidden)requestAnimationFrame(tick);
 };
 stage.classList.toggle('geo-paused',!active);
 requestAnimationFrame(tick);
}
const geoScenesSeen=new WeakSet();
new MutationObserver(()=>{
 document.querySelectorAll('.geo-motion-stage').forEach(stage=>{if(!geoScenesSeen.has(stage)){geoScenesSeen.add(stage);geoRunScene(stage)}});
}).observe(MAIN,{childList:true,subtree:true});
g10SceneGraphic=(function(original){return function(m){
 if(m.kind!=='camera')return original(m);
 const story=g9.phase==='story',camera=story?(g9.scene===0?'oblique':'top'):g10.camera,alt=story?(g9.scene===2?3:2):g10.altitude;
 return geoMovingScene(camera==='top'?90:40,true,alt);
}})(g10SceneGraphic);
function geoGrid(lat=null,lon=null,limit=60,lonLimit=limit){
 const x0=140,y0=72,w=440,h=250,X=v=>x0+(v+lonLimit)/(2*lonLimit)*w,Y=v=>y0+(limit-v)/(2*limit)*h;
 let art=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#d2edf4" stroke="#315f76" stroke-width="2"/>`;
 for(let n=-limit;n<=limit;n+=limit/6){
  art+=`<path d="M${x0} ${Y(n)}H${x0+w}" stroke="${Math.abs(n)<.001?'#235f85':'#89b8c6'}" stroke-width="${Math.abs(n)<.001?3:1}"/>`;
 }
 for(let n=-lonLimit;n<=lonLimit;n+=lonLimit/6){
  art+=`<path d="M${X(n)} ${y0}V${y0+h}" stroke="${Math.abs(n)<.001?'#235f85':'#89b8c6'}" stroke-width="${Math.abs(n)<.001?3:1}"/>`;
 }
 for(let n=-limit;n<=limit;n+=limit/3){
  const v=Math.round(n);
  art+=`<text x="125" y="${Y(n)+6}" text-anchor="end" font-size="17" fill="#173d52">${Math.abs(v)}°${v<0?' S':v>0?' N':''}</text>`;
 }
 for(let n=-lonLimit;n<=lonLimit;n+=lonLimit/3){const v=Math.round(n);art+=`<text x="${X(n)}" y="53" text-anchor="middle" font-size="17" fill="#173d52">${Math.abs(v)}°${v<0?' W':v>0?' O':''}</text>`}
 if(Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=limit&&Math.abs(lon)<=lonLimit){
  art+=`<path class="geo-grid-lat" d="M${x0} ${Y(lat)}H${x0+w}" stroke="#dd902c" stroke-width="4"/><path class="geo-grid-lon" d="M${X(lon)} ${y0}V${y0+h}" stroke="#b84269" stroke-width="4"/><circle cx="${X(lon)}" cy="${Y(lat)}" r="8" fill="#173d52" stroke="white" stroke-width="3"/>`;
 }
 return `<figure class="geo-grid-figure"><svg class="geo-scene" viewBox="0 0 700 390" role="img" aria-label="Gradnetz mit getrennten Randbeschriftungen. Breite zuerst, Länge danach."><rect width="700" height="390" rx="16" fill="#f1f7fa"/>${art}<path d="M170 350H215" stroke="#dd902c" stroke-width="4"/><text x="228" y="357" font-size="18" fill="#173d52">Breite</text><path d="M410 350H455" stroke="#b84269" stroke-width="4"/><text x="468" y="357" font-size="18" fill="#173d52">Länge</text></svg><figcaption>Die Zahlen stehen außerhalb des Gitters. Orange: Breitenkreis. Rotviolett: Meridian. Ihr Schnittpunkt bestimmt den Ort. Das flache Raster ist ein vereinfachtes Lernmodell.</figcaption></figure>`;
}
v11CoordGraphic=function(pair){return geoGrid(pair[0]*(pair[1]==='S'?-1:1),pair[2]*(pair[3]==='W'?-1:1))};
function geoContour(width=110){
 const r=Math.max(45,Math.min(120,Number(width)*.66)),cx=180,cy=283,H=170,tx=530,ty=185;
 let art=`<path d="M${cx-r} ${cy}L${cx} ${cy-H}L${cx+r} ${cy}Z" fill="#a3bd87" stroke="#527451" stroke-width="3"/><path d="M38 ${cy}H325" stroke="#56704c" stroke-width="2"/>`;
 for(let k=1;k<=4;k++){
  const f=k/5,y=cy-H*f,half=r*(1-f);
  art+=`<path d="M${cx-half} ${y}H${cx+half}" stroke="#99623e" stroke-width="3"/><text x="35" y="${y+5}" font-size="15" fill="#173d52">${k*40} m</text>`;
 }
 art+=`<circle cx="${tx}" cy="${ty}" r="${r}" fill="#c6d99f" stroke="#99623e" stroke-width="2"/>`;
 for(let k=1;k<=4;k++)art+=`<circle cx="${tx}" cy="${ty}" r="${r*(1-k/5)}" fill="${['#c6d99f','#b6ca8d','#a1ba80','#e4c795','#c29b76'][k]}" stroke="#99623e" stroke-width="2"/>`;
 art+=`<circle cx="${tx}" cy="${ty}" r="4" fill="#70523b"/><path d="M350 65V315" stroke="#bdcdc4" stroke-dasharray="6 6"/>`;
 return `<svg class="geo-scene geo-relief-art" viewBox="0 0 720 370" role="img" aria-label="Zusammengehöriges Seitenprofil und Draufsicht eines 200 Meter hohen Modellberges. Linienabstand 40 Höhenmeter."><rect width="720" height="370" rx="16" fill="#f4f6ec"/><text x="180" y="35" text-anchor="middle" font-size="22" fill="#173d52">Seitenprofil</text><text x="530" y="35" text-anchor="middle" font-size="22" fill="#173d52">Höhenlinien von oben</text>${art}<text x="180" y="332" text-anchor="middle" font-size="17" fill="#173d52">Gipfel bleibt 200 m hoch</text><text x="530" y="332" text-anchor="middle" font-size="17" fill="#173d52">${r<70?'eng: steiler Hang':'weiter: flacherer Hang'}</text></svg>`;
}
v11HeightGraphic=geoContour;
g9SceneGraphic=(function(original){return function(m){
 const story=g9.phase==='story';
 if(m.kind==='building')return geoMovingScene(story?([45,90,0,45][g9.scene]??45):Number(g9.angle));
 if(m.kind==='grid'||m.kind==='ship'){
  const lat=story?(m.kind==='ship'?-10:20):Number(g9.lat),lon=story?(m.kind==='ship'?-20:30):Number(g9.lon);
  return geoGrid(lat,lon);
 }
 if(m.kind==='mountain')return geoContour(story?([110,165,70][g9.scene]??110):60+Number(g9.steep));
 return original(m);
}})(g9SceneGraphic);
modelIllustration=(function(original){return function(topic,q){
 if(topic==='gradnetz'){
  const answer=q?String(q.opts[q.answer]):'',pair=/(\d+)°\s*(N|S)\s*,\s*(\d+)°\s*(O|W)/.exec(answer);
  return pair?geoGrid(+pair[1]*(pair[2]==='S'?-1:1),+pair[3]*(pair[4]==='W'?-1:1),90,180):geoGrid();
 }
 return original(topic,q);
}})(modelIllustration);
function geoReliefPanel(){
 return `<section class="geo-relief-panel card"><h2>Ein Berg – zwei zusammengehörige Bilder</h2><p>Die Höhe bleibt <b>200 m</b>. Jede braune Linie liegt <b>40 Höhenmeter</b> höher. Der Regler verändert nur die Breite, nicht die Höhe.</p><div class="geo-relief-frame">${geoContour(geoMotion.relief)}</div><label>Breite des Modellberges <input type="range" data-geo-relief min="70" max="180" value="${geoMotion.relief}" step="1"></label><button type="button" class="btn" data-geo-relief-play>Hangneigung animieren ↔</button><p class="geo-relief-feedback" role="status">Vergleiche: enge Linien = steil, größere Abstände = flach.</p><details><summary>Warum ist das so?</summary><p>40 m Höhenunterschied bleiben 40 m. Wird diese Höhe auf einer kürzeren waagerechten Strecke erreicht, ist der Hang steiler. Beim breiteren Berg brauchst du mehr Weg für dieselbe Höhe; die Höhenlinien liegen weiter auseinander.</p><p>Dieses Modell ist ein gleichmäßiger Kegel. Echte Landschaften sind unregelmäßig. Geschlossene Linien allein sagen ohne Höhenwerte noch nicht, ob eine Kuppe oder eine Senke vorliegt.</p></details></section>`;
}
labHeight=geoReliefPanel;
const geoMethodSteps=['1 · Beobachten','2 · Untersuchen','3 · Erklären','4 · Prüfen'];
function geoMethod(topic){
 const m=mod(topic),index=MODULES.findIndex(x=>x.id===topic),colors=['#216878','#8b5638','#407552','#82507f','#265e93','#b56d20'];
 let art=topic==='perspektive'||topic==='luftbild'?geoMovingScene(45,topic==='luftbild'):topic==='gradnetz'?geoGrid(20,30):topic==='relief'?geoContour():geoLearningVisual(topic);
 if(!art){const mission=G9_MISSIONS.find(x=>x.topic===topic);if(mission)art=g9SceneGraphic(mission)}
 return `<section class="geo-method" style="--geo-accent:${colors[index%colors.length]}" data-geo-topic="${topic}"><header><span>Lernpfad ${index+1} · ${m.icon}</span><h2>${esc(m.title)} – selbst entdecken</h2><p>Erst beobachten, dann ausprobieren und mit eigenen Worten erklären.</p></header><div class="geo-method-grid"><div class="geo-method-art">${art||geoLearningVisual('geographie')}</div><div class="geo-method-guide"><div class="geo-method-steps">${geoMethodSteps.map((s,i)=>`<button type="button" data-geo-step="${i}" aria-pressed="${i===0}">${s}</button>`).join('')}</div><div class="geo-method-copy" aria-live="polite"><h3>${esc(m.lessons[0][0])}</h3><p>${esc(m.lessons[0][1])}</p><p><b>Auftrag:</b> Nenne zwei Merkmale im Bild, bevor du weiterklickst.</p></div></div></div></section>`;
}
function geoMapReading(){
 return `<section class="geo-reading-method" data-focus="title"><h3>Vier Schritte am Bild untersuchen</h3><p>Tippe nacheinander auf Titel, Nordpfeil, Legende und Maßstab. Der passende Bereich wird hervorgehoben.</p><div class="inline">${[['title','1 · Titel'],['north','2 · Nordpfeil'],['legend','3 · Legende'],['scale','4 · Maßstab']].map(([k,t])=>`<button type="button" class="btn ghost small" data-geo-map-part="${k}">${t}</button>`).join('')}</div><svg class="geo-scene" viewBox="0 0 700 450" role="img" aria-label="Kartenlese-Methode an einer beschrifteten Beispielkarte. Titel, Nordpfeil, Legende und Maßstabsleiste stehen in getrennten Bereichen."><rect width="700" height="450" rx="16" fill="#eef7f4"/><g data-geo-detail="title"><rect x="22" y="12" width="656" height="52" fill="#fff" stroke="#8fb3b7"/><text x="350" y="47" text-anchor="middle" font-size="24" fill="#173d52">Beispielkarte: das Schulviertel (Modell)</text></g><rect x="22" y="80" width="430" height="270" fill="#dae9cc"/><path d="M45 86Q230 132 188 344" fill="none" stroke="#65aecd" stroke-width="22"/><path d="M24 270L443 125" stroke="#e3bd80" stroke-width="18"/><rect x="279" y="240" width="65" height="49" fill="#b77659"/><circle cx="365" cy="130" r="29" fill="#52885b"/><g data-geo-detail="north"><rect x="473" y="80" width="200" height="100" fill="#fff" stroke="#8fb3b7"/><path d="M520 155V105M520 105L510 123M520 105L530 123" stroke="#173d52" stroke-width="4" fill="none"/><text x="550" y="134" font-size="22" fill="#173d52">Norden</text></g><g data-geo-detail="legend"><rect x="473" y="194" width="200" height="156" fill="#fff" stroke="#8fb3b7"/><text x="485" y="221" font-size="22" fill="#173d52">Legende</text><path d="M487 247H522" stroke="#65aecd" stroke-width="10"/><text x="535" y="254" font-size="19">Fluss</text><rect x="487" y="269" width="35" height="18" fill="#b77659"/><text x="535" y="285" font-size="19">Haus</text><circle cx="505" cy="315" r="13" fill="#52885b"/><text x="535" y="322" font-size="19">Wald</text></g><g data-geo-detail="scale"><rect x="22" y="365" width="651" height="70" fill="#fff" stroke="#8fb3b7"/><path d="M48 391H252M48 384V398M150 384V398M252 384V398" stroke="#173d52" stroke-width="4"/><text x="45" y="420" font-size="17">0</text><text x="130" y="420" font-size="17">100 m</text><text x="230" y="420" font-size="17">200 m</text><text x="350" y="406" font-size="19">Längen mit der Leiste vergleichen</text></g></svg><p class="geo-reading-feedback" role="status"><b>Titel:</b> Er verrät das Thema und den dargestellten Raum. Das ist die erste Orientierung, bevor du Zeichen deutest.</p></section>`;
}
renderLesson=(function(original){return function(){
 let html=original();
 if(state.topic==='kartenlesen')html=html.replace('<b>1. So beginnst du beim Kartenlesen</b>','<b>1. So beginnst du beim Kartenlesen</b>'+geoMapReading());
 return geoMethod(state.topic)+html+(state.topic==='relief'?geoReliefPanel():'')+(state.topic==='kartenlesen'?geoRealMap():'');
}})(renderLesson);
function geoCenter(f){return f.points.reduce((a,p)=>[a[0]+p[0]/f.points.length,a[1]+p[1]/f.points.length],[0,0])}
function geoLandmarks(){
 const school=[8.36177,52.60172],distance=p=>(p[0]-school[0])**2*.37+(p[1]-school[1])**2;
 const nearest=predicate=>GEO_DIEPHOLZ.features.filter(predicate).sort((a,b)=>distance(geoCenter(a))-distance(geoCenter(b)))[0];
 const shop=nearest(f=>f.tags.shop==='supermarket'),wood=nearest(f=>f.tags.landuse==='forest'||f.tags.natural==='wood');
 const river=nearest(f=>f.tags.waterway==='river');
 const nearRiver=river.points.reduce((a,p)=>distance(a)<distance(p)?a:p);
 return [{id:'school',name:'Mühlenkampschule · Lüderstraße 72',point:school,osm:'way/148632628',type:'Schule'},{id:'shop',name:shop.tags.name||'Supermarkt',point:geoCenter(shop),osm:shop.id,type:'Supermarkt'},{id:'wood',name:'Waldfläche laut OSM',point:geoCenter(wood),osm:wood.id,type:'Wald'},{id:'river',name:river.tags.name||'Fluss',point:nearRiver,osm:river.id,type:'Fluss'}];
}
function geoMapDirectionAnswer(){
 const places=geoLandmarks(),school=places[0].point,shop=places[1].point;
 const dx=(shop[0]-school[0])*.607,dy=shop[1]-school[1];
 return Math.abs(dx)>Math.abs(dy)?(dx>0?'O':'W'):(dy>0?'N':'S');
}
function geoMapTaskReady(step=geoMapState.step,map=geoMapState){
 if(step>=0&&step<4)return map.done[step]===true&&map.selected===['school','shop','wood','river'][step];
 return step===4&&map.answer===geoMapDirectionAnswer();
}
function geoRealMapSvg(){
 const [west,south,east,north]=GEO_DIEPHOLZ.bounds,project=p=>[40+(p[0]-west)/(east-west)*820,40+(north-p[1])/(north-south)*720],points=f=>f.points.map(p=>project(p).map(n=>n.toFixed(1)).join(',')).join(' ');
 const places=geoLandmarks(),selected=places.find(p=>p.id===geoMapState.selected),center=project(selected.point),z=geoMapState.zoom;
 let ground='',buildings='',roads='',water='';
 for(const f of GEO_DIEPHOLZ.features){
  const t=f.tags,p=points(f);
  if(t.landuse==='forest'||t.natural==='wood')ground+=`<polygon points="${p}" fill="#9dc58c" stroke="#6f985e" stroke-width="1"/>`;
  if(t.building)buildings+=`<polygon points="${p}" fill="#d5b39d" stroke="#ba9784" stroke-width=".7"/>`;
  if(t.highway)roads+=`<polyline points="${p}" fill="none" stroke="${['primary','secondary','tertiary'].includes(t.highway)?'#e4ba7c':'#fffaf0'}" stroke-width="${t.highway==='footway'||t.highway==='path'?1.4:4}" stroke-linecap="round"/>`;
  if(t.waterway)water+=`<polyline points="${p}" fill="none" stroke="#4d98bd" stroke-width="${t.waterway==='river'?4:1.5}"/>`;
 }
 const markers=places.map((p,i)=>{const [x,y]=project(p.point);return `<g data-geo-place="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name)}" class="geo-map-marker ${p.id===selected.id?'selected':''}"><circle cx="${x}" cy="${y}" r="${p.id===selected.id?16:12}" fill="${p.id===selected.id?'#b2424b':'#194d68'}" stroke="white" stroke-width="3"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" fill="white" font-weight="bold">${i+1}</text></g>`}).join('');
 const bar=500/((east-west)*111320*Math.cos(52.6*Math.PI/180))*820*z;
 return `<svg class="geo-real-map-svg" viewBox="0 0 900 820" role="img" aria-label="Echte Offline-Karte um die Mühlenkampschule, aus OpenStreetMap-Geodaten. Vier nummerierte Fundorte."><defs><clipPath id="geoMapClip"><rect x="40" y="40" width="820" height="720"/></clipPath></defs><rect width="900" height="820" rx="15" fill="#f4f5ea"/><g clip-path="url(#geoMapClip)"><g transform="translate(${450-z*center[0]} ${400-z*center[1]}) scale(${z})">${ground}${roads}${water}${buildings}${markers}</g></g><path d="M852 42V10M852 10L846 21M852 10L858 21" stroke="#173d52" stroke-width="3" fill="none"/><text x="830" y="27" font-size="18" fill="#173d52">N</text><path d="M60 780h${bar}M60 773v14M${60+bar} 773v14" stroke="#173d52" stroke-width="3"/><text x="60" y="808" font-size="17" fill="#173d52">ca. 500 m</text></svg>`;
}
function geoRealMap(){
 if(typeof GEO_DIEPHOLZ==='undefined')return '<p>Kartendaten fehlen. Bitte die vollständige Offline-Ausgabe öffnen.</p>';
 const places=geoLandmarks(),p=places.find(p=>p.id===geoMapState.selected)||places[0],taskIds=['school','shop','wood','river'];
 const steps=['Finde die Mühlenkampschule. Klicke Fundort 1.','Finde einen echten Supermarkt. Wähle Fundort 2 und lies den Namen.','Suche Fundort 3: Wald. Vergleiche die grüne Fläche mit der Legende.','Finde Fundort 4: den Fluss. Verfolge die blaue Linie.','Vergleiche die Lage von Supermarkt und Schule: In welche Haupthimmelsrichtung geht es?'];
 const finished=geoMapState.step>=5,step=finished?4:geoMapState.step,ready=!finished&&geoMapTaskReady(step);
 const status=finished?`Expedition geschafft! Du hast alle fünf Aufträge richtig gelöst. Abgeschlossene Expeditionen auf diesem Gerät: ${geoMapState.completedRuns}.`
  :step<4?(ready?`Fundort gefunden: ${esc(p.name)}. Begründe mit Farbe, Form und Lage; dann geht es weiter.`:geoMapState.selected===taskIds[step]?`Der richtige Ort ist markiert. Tippe Fundort ${step+1} noch einmal an, um den Kartenhinweis selbst zu entdecken.`:`Das ist ${esc(p.name)}. Suche auf der Karte nach Fundort ${step+1} (${['Schule','Supermarkt','Wald','Fluss'][step]}).`)
  :(geoMapState.answer?(geoMapState.answer===geoMapDirectionAnswer()?`Richtig! Der Supermarkt liegt ${geoMapState.answer==='N'?'nördlich':geoMapState.answer==='O'?'östlich':geoMapState.answer==='S'?'südlich':'westlich'} der Schule. Begründe deine Antwort mit Nordpfeil und Lage.`:`Noch nicht. Nutze den Nordpfeil und vergleiche die Lage beider Marker; du kannst es erneut versuchen.`):'Vergleiche die Marker und nutze den Nordpfeil. Wähle erst eine Richtung, bevor du weitergehst.');
 return `<section class="card geo-real-map"><h2>Diepholz entdecken: rund um die Mühlenkampschule</h2><p><b>Echte Geodaten, offline gezeichnet:</b> Gebäude, Straßen, Wald und Wasserläufe stammen aus OpenStreetMap. Datenabruf: ${GEO_DIEPHOLZ.snapshot}. Dies ist kein Live-Luftbild. Die Auswahl und Farben wurden für die Lernkarte vereinfacht.</p><div class="geo-map-layout"><div class="geo-map-art">${geoRealMapSvg()}<div class="geo-map-legend"><span>■ Braun: Gebäude</span><span>■ Grün: Wald</span><span>━ Blau: Gewässer</span><span>━ Hell: Straße/Weg</span></div><div class="inline"><button type="button" class="btn ghost small" data-geo-zoom="-1" aria-label="Karte verkleinern">−</button><span>Zoom ${geoMapState.zoom}×</span><button type="button" class="btn ghost small" data-geo-zoom="1" aria-label="Karte vergrößern">+</button></div></div><aside><h3>Vier echte Fundorte</h3>${places.map((x,i)=>`<button type="button" class="geo-place-button" data-geo-place="${x.id}" aria-pressed="${p.id===x.id}">${i+1}. ${esc(x.type)}: ${esc(x.name)}</button>`).join('')}<p><b>Ausgewählt:</b> ${esc(p.name)}<br><a href="https://www.openstreetmap.org/${p.osm}" target="_blank" rel="noopener">Dieses OSM-Objekt nachprüfen ↗</a></p><div class="geo-map-task"><h3>${finished?'Kartenexpedition abgeschlossen':`Entdeckerauftrag ${step+1} / 5`}</h3>${finished?'<p>Du hast Schule, Supermarkt, Wald und Fluss auf der Karte gefunden und ihre Lage verglichen.</p>':`<p>${steps[step]}</p>${step===4?`<div class="inline" role="group" aria-label="Himmelsrichtung wählen">${['N','O','S','W'].map(d=>`<button type="button" class="btn ghost small" data-geo-map-answer="${d}" aria-pressed="${geoMapState.answer===d}">${d}</button>`).join('')}</div>`:''}`}<p role="status" aria-live="polite">${status}</p><button type="button" class="btn" data-geo-map-next ${!finished&&!ready?'disabled':''}>${finished?'Aufträge erneut beginnen':'Nächster Auftrag →'}</button></div></aside></div><p class="mini">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap-Mitwirkende</a> · ODbL 1.0 · <a href="https://www.openstreetmap.org/?mlat=52.60172&amp;mlon=8.36177#map=17/52.60172/8.36177" target="_blank" rel="noopener">Aktuelle Online-Karte ↗</a>. Nicht als sichere Schulweg- oder Navigationsanweisung verwenden.</p></section>`;
}
labAtlas=(function(original){return function(){return original()+geoRealMap()}})(labAtlas);
renderStart=(function(original){return function(){return original()+`<section class="card"><h2>🗺️ Echte Diepholzer Kartenexpedition</h2><p>Schule, Supermarkt, Wald und Fluss rund um die Mühlenkampschule entdecken – mit echten OSM-Daten auch offline.</p><p class="mini subtle">${geoMapState.completedRuns?`Auf diesem Gerät abgeschlossene Expeditionen: ${geoMapState.completedRuns}. Dein aktueller Auftrag wird automatisch gespeichert.`:'Fünf kleine Aufträge; dein aktueller Stand wird automatisch auf diesem Gerät gespeichert.'}</p><button type="button" class="btn" data-action="lesson:kartenlesen">Geführte Kartenexpedition starten</button></section>`}})(renderStart);
function geoRefreshMap(){
 const map=document.querySelector('.geo-real-map');if(map)map.outerHTML=geoRealMap();
}
document.addEventListener('click',e=>{
 const motion=e.target.closest('[data-geo-motion]');
 if(motion){
  const stage=motion.closest('.geo-motion-stage');
  if(motion.dataset.geoMotion==='toggle'){geoMotion.enabled=!geoMotion.enabled;motion.textContent=geoMotion.enabled?'Bewegung anhalten':'Bewegung starten';stage.classList.toggle('geo-paused',!geoMotion.enabled)}
  geoRunScene(stage,motion.dataset.geoMotion==='replay');return;
 }
 const step=e.target.closest('[data-geo-step]');
 if(step){
  const panel=step.closest('[data-geo-topic]'),m=mod(panel.dataset.geoTopic),i=+step.dataset.geoStep;
  panel.querySelectorAll('[data-geo-step]').forEach(b=>b.setAttribute('aria-pressed',String(b===step)));
  const lesson=m.lessons[Math.min(i,m.lessons.length-1)];
  panel.querySelector('.geo-method-copy').innerHTML=`<h3>${geoMethodSteps[i]}: ${esc(lesson[0])}</h3><p>${esc(lesson[1])}</p><p class="tip"><b>Gustavs Hilfe:</b> ${esc(lesson[2])}</p>${i===3?`<button type="button" class="btn" data-action="start:practice:${m.id}">Zum Themenquiz</button>`:'<p>Beschreibe zuerst deine Beobachtung, bevor du weitergehst.</p>'}`;return;
 }
 const part=e.target.closest('[data-geo-map-part]');
 if(part){
  const panel=part.closest('.geo-reading-method'),k=part.dataset.geoMapPart;
  const explanations={title:'Der Titel verrät das Thema und den dargestellten Raum.',north:'Der Nordpfeil zeigt Norden. Leite danach Osten, Süden und Westen ab.',legend:'Die Legende übersetzt Farben und Zeichen: Blau ist hier Fluss, Braun Haus, Grün Wald.',scale:'Die grafische Leiste zeigt die Wirklichkeitslänge. Sie wird beim Vergrößern gemeinsam mit der Karte skaliert.'};
  panel.dataset.focus=k;panel.querySelector('.geo-reading-feedback').textContent=explanations[k];return;
 }
 const place=e.target.closest('[data-geo-place]');
 if(place){geoMapState.selected=place.dataset.geoPlace;if(geoMapState.step<4&&geoMapState.selected===['school','shop','wood','river'][geoMapState.step])geoMapState.done[geoMapState.step]=true;geoSaveMapProgress();geoRefreshMap();return}
 const zoom=e.target.closest('[data-geo-zoom]');
 if(zoom){geoMapState.zoom=Math.max(1,Math.min(3,geoMapState.zoom+Number(zoom.dataset.geoZoom)));geoSaveMapProgress();geoRefreshMap();return}
 if(e.target.closest('[data-geo-map-next]')){
  if(geoMapState.step>=5){geoMapState.step=0;geoMapState.answer='';geoMapState.selected='school';geoMapState.done=Array(5).fill(false)}
  else if(geoMapTaskReady()){geoMapState.step++;geoMapState.answer='';if(geoMapState.step===5){geoMapState.completedRuns++;progress.guides=progress.guides||{};progress.guides.diepholzMap={...(progress.guides.diepholzMap||{}),completedRuns:geoMapState.completedRuns,lastCompleted:new Date().toISOString()}}}
  geoSaveMapProgress();geoRefreshMap();return
 }
 const answer=e.target.closest('[data-geo-map-answer]');
 if(answer){geoMapState.answer=answer.dataset.geoMapAnswer;geoMapState.done[4]=geoMapState.answer===geoMapDirectionAnswer();geoSaveMapProgress();geoRefreshMap();return}
 const relief=e.target.closest('[data-geo-relief-play]');
 if(relief){
  const panel=relief.closest('.geo-relief-panel'),start=performance.now();
  panel._geoRelief=(panel._geoRelief||0)+1;const token=panel._geoRelief;
  const frame=now=>{
   if(!panel.isConnected||panel._geoRelief!==token)return;
   const t=Math.min(1,(now-start)/4200),width=70+110*(.5-.5*Math.cos(t*Math.PI*2));
   geoUpdateRelief(panel,width);
   if(t<1&&!geoReduced()&&!document.hidden)requestAnimationFrame(frame);
  };requestAnimationFrame(frame);
 }
});
function geoUpdateRelief(panel,width){
 geoMotion.relief=width;panel.querySelector('.geo-relief-frame').innerHTML=geoContour(width);
 panel.querySelector('[data-geo-relief]').value=String(width);
 panel.querySelector('.geo-relief-feedback').textContent=width<110?'Schmaler Berg: gleiche 200 m Höhe auf kürzerer Strecke. Die Linien liegen enger – steiler!':'Breiter Berg: gleiche 200 m Höhe auf längerer Strecke. Die Linien liegen weiter – flacher!';
}
document.addEventListener('input',e=>{
 if(e.target.matches('[data-geo-relief]')){const p=e.target.closest('.geo-relief-panel');p._geoRelief=(p._geoRelief||0)+1;geoUpdateRelief(p,+e.target.value)}
});
document.addEventListener('keydown',e=>{if(e.target.matches('g[data-geo-place]')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
geoSelfTest=(function(original){return function(){
 const base=original(),results=[...base.results],check=(name,ok)=>results.push({name,ok:!!ok});
 for(const m of MODULES)check('Geführter visueller Lernpfad: '+m.id,geoMethod(m.id).includes('<svg'));
 check('Vier echte OSM-Fundorte',geoLandmarks().length===4);
 check('Schule entspricht OSM-Objekt',GEO_DIEPHOLZ.features.some(f=>f.id==='way/148632628'));
 check('Wald und Supermarkt aus Geodaten',GEO_DIEPHOLZ.features.some(f=>f.tags.shop==='supermarket')&&GEO_DIEPHOLZ.features.some(f=>f.tags.landuse==='forest'||f.tags.natural==='wood'));
 check('Reale Flussgeometrie',GEO_DIEPHOLZ.features.some(f=>f.tags.waterway==='river'));
 check('Kartenexpedition verlangt Fundort und korrekte Richtung',!geoMapTaskReady(0,{done:[false],selected:'school'})&&geoMapTaskReady(0,{done:[true],selected:'school'})&&!geoMapTaskReady(0,{done:[true],selected:'shop'})&&geoMapTaskReady(4,{answer:geoMapDirectionAnswer()})&&!geoMapTaskReady(4,{answer:'?' }));
 check('Beschriftungen außerhalb des Gradgitters',![...geoGrid(20,30).matchAll(/<text x="([\d.]+)" y="([\d.]+)"/g)].some(m=>+m[1]>140&&+m[1]<580&&+m[2]>72&&+m[2]<322));
 check('Relief verändert Breite und Linienabstand',geoContour(70)!==geoContour(180));
 check('Drohne besitzt Animationssteuerung',geoMovingScene(40,true).includes('data-geo-motion'));
 check('Kartenlesen mit vier Bildschritten',(geoMapReading().match(/data-geo-map-part=/g)||[]).length===4);
 return {passed:results.filter(r=>r.ok).length,total:results.length,results};
}})(geoSelfTest);
render();
})();
