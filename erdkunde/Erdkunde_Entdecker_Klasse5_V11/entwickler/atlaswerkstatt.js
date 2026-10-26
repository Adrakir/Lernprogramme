/* Gradnetz- und Atlaswerkstatt. Eigene SVG-Lernmodelle, keine Laufzeitdienste. */
'use strict';
(function(){
const ROOT=typeof MAIN!=='undefined'?MAIN:document.getElementById('main');
if(!ROOT)return;
const D=Math.PI/180,BLUE='#1766a1',PINK='#9c3475',GREEN='#086f62';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.abs(n).toLocaleString('de-DE',{maximumFractionDigits:1});
const latText=n=>`${fmt(n)}° ${n===0?'(Äquator)':n>0?'N':'S'}`;
const lonText=n=>`${fmt(n)}° ${n===0?'(Nullmeridian)':Math.abs(n)===180?'(180°-Meridian)':n>0?'O':'W'}`;
const coord=(lat,lon)=>`${latText(lat)} · ${lonText(lon)}`;
const round=n=>Math.round(n*10)/10;
const cityData=[
 {id:'prag',name:'Prag',aliases:['prag','praha','prague'],country:'Tschechien',lat:50.1,lon:14.4,map:'europe',source:'https://www.geonames.org/3067696/prague.html'},
 {id:'lissabon',name:'Lissabon',aliases:['lissabon','lisbon','lisboa'],country:'Portugal',lat:38.7,lon:-9.1,map:'europe',source:'https://www.geonames.org/2267057/lisbon.html'},
 {id:'sanfrancisco',name:'San Francisco',aliases:['san francisco','sanfrancisco'],country:'USA',lat:37.8,lon:-122.4,map:'america',source:'https://www.geonames.org/5391959/san-francisco.html'},
 {id:'alice',name:'Alice Springs',aliases:['alice springs','alicesprings'],country:'Australien',lat:-23.7,lon:133.9,map:'australia',source:'https://www.ntlis.nt.gov.au/placenames/print_extract.jsp?id=22272'}
];
const maps={world:{name:'Weltkarte',bounds:[-180,180,-90,90],step:30},europe:{name:'Europa',bounds:[-15,25,30,55],step:5},america:{name:'Westen Nordamerikas',bounds:[-130,-110,30,45],step:5},australia:{name:'Australien',bounds:[110,155,-45,-10],step:5}};
function quarter(lat,lon){
 if(Math.abs(lat)===90)return {code:'pole',name:lat>0?'Nordpol':'Südpol',detail:'Am Pol treffen sich alle Meridiane. Eine eindeutige östliche oder westliche Länge gibt es dort nicht.'};
 if(lat===0||lon===0||Math.abs(lon)===180)return {code:'edge',name:'Auf einer Grenze',detail:'Äquator, Nullmeridian und 180°-Meridian sind Grenzen. Ordne den Punkt keinem einzelnen Erdviertel zu.'};
 const code=(lat>0?'N':'S')+(lon>0?'O':'W');
 return {code,name:({NO:'Nordostviertel',NW:'Nordwestviertel',SO:'Südostviertel',SW:'Südwestviertel'})[code],detail:`${lat>0?'Nördlich':'Südlich'} des Äquators und ${lon>0?'östlich':'westlich'} des Nullmeridians.`};
}
function number(raw,max){
 const s=String(raw).trim().replace(',','.');
 if(!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return null;
 const n=Number(s);return Number.isFinite(n)&&n>=0&&n<=max?n:null;
}
function checkMissing(raw,dir,target,isLat){
 const n=number(raw,isLat?90:180);if(n===null)return {ok:false,text:`Trage eine Zahl von 0 bis ${isLat?90:180} ein. Ein Komma ist erlaubt, zum Beispiel 14,4.`};
 const sign=(dir==='S'||dir==='W')?-1:1,val=n*sign;
 if(n!==0&&sign!==Math.sign(target))return {ok:false,text:`Prüfe die Richtung: Hier brauchst du ${target>0?(isLat?'Norden (N)':'Osten (O)'):(isLat?'Süden (S)':'Westen (W)')}.`};
 const ok=Math.abs(val-target)<=.16;
 return {ok,text:ok?'Gut abgelesen! Der Wert passt zur gerundeten Ortslage.':'Schau auf die Zahlen am Kartenrand und lies zwischen den benachbarten Gradlinien ab. Die Karte arbeitet mit auf 0,1° gerundeten Ortslagen.'};
}
const persisted=(()=>{try{return JSON.parse(localStorage.getItem('geo-atlaswerkstatt-v1')||'{}')}catch{return {}}})();
const s={view:'globe',lat:50,lon:14,camLon:0,camLat:18,layer:'both',spin:false,city:0,mode:'coords',step:0,playing:false,answer:'',direction:'O',feedback:null,quarterIndex:0,quarterFeedback:null,viewAnswers:{},viewFeedback:'',gaps:{},gapFeedback:null,gapSolution:false,gapSeenSolution:false,done:new Set(Array.isArray(persisted.done)?persisted.done.filter(x=>typeof x==='string'&&x.length<60):[])};
let raf=0,timer=0,last=0;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function mark(key){s.done.add(key);try{localStorage.setItem('geo-atlaswerkstatt-v1',JSON.stringify({done:[...s.done]}))}catch{}}
function stop(){cancelAnimationFrame(raf);clearTimeout(timer);raf=0;timer=0;s.spin=false;s.playing=false;last=0;}
function button(label,act,extra=''){return `<button type="button" data-aw="${act}" ${extra}>${label}</button>`;}
function feedback(f){return f?`<div class="aw-feedback" role="status" data-good="${f.ok}">${E(f.text)}</div>`:'';}
function svg(title,body,vb='0 0 640 430',cls='aw-svg'){return `<svg class="${cls}" viewBox="${vb}" role="img" aria-label="${E(title)}" xmlns="http://www.w3.org/2000/svg"><title>${E(title)}</title>${body}</svg>`;}
function project(lat,lon,camLat=0,camLon=0,r=164,cx=320,cy=212){
 const a=lat*D,b=(lon-camLon)*D,p=camLat*D;
 return [cx+r*Math.cos(a)*Math.sin(b),cy-r*(Math.cos(p)*Math.sin(a)-Math.sin(p)*Math.cos(a)*Math.cos(b)),Math.sin(p)*Math.sin(a)+Math.cos(p)*Math.cos(a)*Math.cos(b)];
}
function curve(points,col,width=1.2,back=false){
 let front='',rear='',prev=null;
 for(const p of points){const vis=p[2]>=-1e-8;const q=`${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  if(vis)front+=(prev===true?'L':'M')+q;else rear+=(prev===false?'L':'M')+q;prev=vis;}
 return `${back?`<path d="${rear}" fill="none" stroke="${col}" opacity=".22" stroke-dasharray="4 5" stroke-width="${width}"/>`:''}<path d="${front}" fill="none" stroke="${col}" stroke-width="${width}"/>`;
}
function globeGraphic(camLat=s.camLat,camLon=s.camLon,layer=s.layer,selected=true){
 const pp=(la,lo)=>project(la,lo,camLat,camLon),a=[];
 a.push('<circle cx="320" cy="212" r="164" fill="#e3f1f8" stroke="#567f95" stroke-width="2"/>');
 if(layer!=='lon')for(let lat=-60;lat<=60;lat+=30)a.push(curve(Array.from({length:181},(_,i)=>pp(lat,-180+i*2)),BLUE,lat===0?3:1.3,true));
 if(layer!=='lat')for(let lon=-180;lon<180;lon+=30)a.push(curve(Array.from({length:91},(_,i)=>pp(-90+i*2,lon)),PINK,lon===0?3:1.2,true));
 if(selected){
  if(layer!=='lon')a.push(curve(Array.from({length:181},(_,i)=>pp(s.lat,-180+i*2)),BLUE,4));
  if(layer!=='lat')a.push(curve(Array.from({length:91},(_,i)=>pp(-90+i*2,s.lon)),PINK,4));
  const p=pp(s.lat,s.lon);if(p[2]>=0)a.push(`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#f6ce55" stroke="#17394e" stroke-width="2"/>`);
 }
 const pole=pp(90,0),south=pp(-90,0);
 for(const [p,t] of [[pole,'Nordpol · 90° N'],[south,'Südpol · 90° S']])if(p[2]>-.02)a.push(`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#17394e"/><text x="${p[0]+10}" y="${p[1]-9}" font-size="14" fill="#17394e">${t}</text>`);
 a.push('<text x="320" y="413" text-anchor="middle" font-size="14" fill="#405e70">Durchsichtige Modellkugel · Rückseite gestrichelt</text>');
 return svg(`Gradnetz, Blick aus ${Math.round(camLat)}° Breite und ${Math.round(camLon)}° Länge. Breitenkreise blau, Meridiane violett.`,a.join(''));
}
function angleGraphic(){
 const lat=s.lat,theta=lat*D,cx=155,cy=125,r=83,x=cx+r*Math.cos(theta),y=cy-r*Math.sin(theta);
 const small=36,ax=cx+small*Math.cos(theta),ay=cy-small*Math.sin(theta),sweep=lat>=0?0:1;
 return svg(`Breitenwinkel ${latText(lat)} vom Äquator aus gemessen`,`<circle cx="155" cy="125" r="83" fill="#eaf4fa" stroke="#728c9d"/><path d="M55 125H255" stroke="${BLUE}" stroke-width="2"/><path d="M155 25V225" stroke="#728c9d" stroke-dasharray="4 4"/><path d="M155 125L${x} ${y}" stroke="${PINK}" stroke-width="3"/><path d="M191 125A36 36 0 0 ${sweep} ${ax} ${ay}" fill="none" stroke="#9b6100" stroke-width="3"/><circle cx="155" cy="125" r="3" fill="#17394e"/><circle cx="${x}" cy="${y}" r="4" fill="${PINK}"/><text x="262" y="130" font-size="13" fill="${BLUE}">Äquator 0°</text><text x="165" y="21" font-size="13" fill="#17394e">Nordpol</text><text x="165" y="244" font-size="13" fill="#17394e">Südpol</text><text x="15" y="267" font-size="14" fill="#17394e">Erdmittelpunkt → Winkel: ${latText(lat)}</text>`,'0 0 350 282');
}
function flatMap(key='world',opts={}){
 const m=maps[key],bounds=m.bounds,[west,east,south,north]=bounds,x0=63,y0=42,w=650,h=330;
 const X=n=>x0+(n-west)/(east-west)*w,Y=n=>y0+(north-n)/(north-south)*h;
 let a=`<defs><clipPath id="aw-mapclip"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath></defs><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#e1f0f8"/>`;
 if(opts.quarters&&key==='world')for(const [x,y,label,col] of [[X(-180),Y(90),'NW','#d5e9ff'],[X(0),Y(90),'NO','#e0f0d3'],[X(-180),Y(0),'SW','#f8e4d5'],[X(0),Y(0),'SO','#eee1f6']])a+=`<rect x="${x}" y="${y}" width="${w/2}" height="${h/2}" fill="${col}"/>`;
 if(typeof WORLD_LAND!=='undefined')a+=`<g clip-path="url(#aw-mapclip)" fill="#c1d5bc" stroke="#718d78" stroke-width=".6">${WORLD_LAND.map(poly=>`<path d="${poly.map(([lo,la],i)=>(i?'L':'M')+X(lo).toFixed(1)+','+Y(la).toFixed(1)).join('')}Z"/>`).join('')}</g>`;
 for(let lo=Math.ceil(west/m.step)*m.step;lo<=east;lo+=m.step)a+=`<path d="M${X(lo)} ${y0}V${y0+h}" stroke="${PINK}" opacity="${lo===0?1:.35}" stroke-width="${lo===0?2.5:1}"/><text x="${X(lo)}" y="${y0-12}" text-anchor="middle" fill="${PINK}" font-size="13">${lo===0?'0°':fmt(lo)+'° '+(lo<0?'W':'O')}</text>`;
 for(let la=Math.ceil(south/m.step)*m.step;la<=north;la+=m.step)a+=`<path d="M${x0} ${Y(la)}H${x0+w}" stroke="${BLUE}" opacity="${la===0?1:.35}" stroke-width="${la===0?2.5:1}"/><text x="${x0-8}" y="${Y(la)+4}" text-anchor="end" fill="${BLUE}" font-size="13">${la===0?'0°':fmt(la)+'° '+(la<0?'S':'N')}</text>`;
 if(opts.quarters&&key==='world')for(const [lo,la,t] of [[-90,65,'Nordwestviertel'],[90,65,'Nordostviertel'],[-90,-65,'Südwestviertel'],[90,-65,'Südostviertel']])a+=`<text x="${X(lo)}" y="${Y(la)}" text-anchor="middle" font-weight="700" font-size="17" fill="#17394e" stroke="#fff" stroke-width="4" paint-order="stroke">${t}</text>`;
 const city=opts.city;
 if(city){
  if(opts.lat)a+=`<path d="M${x0} ${Y(city.lat)}H${x0+w}" stroke="${BLUE}" stroke-width="4"/><text x="${x0+10}" y="${Y(city.lat)-9}" fill="${BLUE}" stroke="#fff" stroke-width="4" paint-order="stroke" font-size="16" font-weight="700">Breite: ${latText(city.lat)}</text>`;
  if(opts.lon)a+=`<path d="M${X(city.lon)} ${y0}V${y0+h}" stroke="${PINK}" stroke-width="4"/><text x="${Math.min(x0+w-170,Math.max(x0+10,X(city.lon)+10))}" y="${y0+22}" fill="${PINK}" stroke="#fff" stroke-width="4" paint-order="stroke" font-size="16" font-weight="700">Länge: ${lonText(city.lon)}</text>`;
  if(opts.point)a+=`<circle cx="${X(city.lon)}" cy="${Y(city.lat)}" r="7" fill="#f4c943" stroke="#17394e" stroke-width="2"/>`;
 }
 if(opts.names)for(const p of cityData.filter(p=>p.lon>=west&&p.lon<=east&&p.lat>=south&&p.lat<=north))a+=`<circle cx="${X(p.lon)}" cy="${Y(p.lat)}" r="4" fill="#17394e"/><text x="${X(p.lon)+9}" y="${Y(p.lat)+20}" fill="#17394e" stroke="#fff" stroke-width="4" paint-order="stroke" font-size="16">${E(p.name)}</text>`;
 if(opts.tap)a+=`<rect data-aw-map="world" x="${x0}" y="${y0}" width="${w}" height="${h}" fill="transparent"/>`;
 a+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#4e758a"/><text x="${x0}" y="410" fill="#405e70" font-size="13">${E(m.name)} · vereinfachte Lernkarte · Küsten: Natural Earth (Public Domain)</text>`;
 return `<div class="aw-map-scroll" tabindex="0" role="region" aria-label="Karte, bei schmaler Ansicht seitlich verschiebbar">${svg(`${m.name} mit Gradnetz; Breitengrade am linken Rand, Längengrade am oberen Rand.`,a,'0 0 760 430','aw-svg'+(opts.tap?' aw-tappable':''))}</div><p class="aw-map-hint aw-muted">Du kannst die Karte seitlich verschieben. So bleiben die Gradangaben lesbar.</p>`;
}
function globeView(){
 return `<div class="aw-grid"><div><section class="aw-card"><h2>Eine Erde, zwei Arten von Linien</h2><div class="aw-controls">${[['both','Beide Linien'],['lat','Nur Breitenkreise'],['lon','Nur Meridiane']].map(([k,t])=>button(t,'layer:'+k,`aria-pressed="${s.layer===k}"`)).join('')}</div><div id="awGlobe" class="aw-globe">${globeGraphic()}</div><div class="aw-controls">${button('Blick vom Äquator','camera:equator')}${button('Blick auf den Nordpol','camera:north')}${button('Blick auf den Südpol','camera:south')}</div><div class="aw-controls" style="margin-top:10px">${button(reduced()?'20° weiterdrehen':'Drehung starten','spin','id="awSpin" aria-pressed="false"')}${button('Gewählten Punkt nach vorn holen','focus')}</div><label for="awCamera">Erde nach Osten oder Westen drehen</label><input id="awCamera" data-aw-input="camLon" type="range" min="-180" max="180" step="1" value="${s.camLon}"><label for="awTilt">Blick zwischen Südpol und Nordpol kippen</label><input id="awTilt" data-aw-input="camLat" type="range" min="-90" max="90" step="1" value="${s.camLat}"><p class="aw-muted">Du steuerst die Ansicht mit Reglern oder Tasten. Beim Verlassen hält die Drehung an.</p></section><section class="aw-card"><h3>Warum heißt es Breitengrad?</h3><p>Auf der Modellkugel ist die Breite ein <b>Winkel vom Äquator aus</b>. Ein Grad ist hier ein Winkelmaß, keine Temperatur und keine feste Weglänge.</p><div id="awAngle">${angleGraphic()}</div></section></div><div><section class="aw-card"><h2>Bewege den gelben Punkt</h2><p>Ändere erst die Breite, dann die Länge. Die dickeren Linien schneiden sich am gewählten Punkt.</p><label class="aw-lat" for="awLatitude">Breite: <output id="awLatOut">${latText(s.lat)}</output></label><input id="awLatitude" data-aw-input="lat" type="range" min="-90" max="90" value="${s.lat}"><label class="aw-lon" for="awLongitude">Länge: <output id="awLonOut">${lonText(s.lon)}</output></label><input id="awLongitude" data-aw-input="lon" type="range" min="-180" max="180" value="${s.lon}"><div id="awPoint" class="aw-stat">${pointSummary()}</div><div class="aw-callout"><b>Breitenkreise</b> verlaufen parallel zum Äquator. Die Breite sagt: wie weit <b>nördlich oder südlich</b>?<br><b>Meridiane</b> führen von Pol zu Pol. Die Länge sagt: wie weit <b>östlich oder westlich</b>?</div><p><b>Breite:</b> 0° am Äquator, bis 90° N oder 90° S.<br><b>Länge:</b> 0° am Nullmeridian durch Greenwich, bis 180° O oder 180° W.</p><details><summary>Längenkreis oder Meridian?</summary><p>Ein Meridian ist ein Halbkreis von Pol zu Pol. Mit dem gegenüberliegenden Meridian bildet er einen ganzen Längenkreis. Ein Breitenkreis ist ein ganzer Kreis; an den Polen schrumpft er zum Punkt.</p></details><details><summary>Wo liegt die Datumsgrenze?</summary><p>Der 180°-Meridian liegt dem Nullmeridian gegenüber. Die internationale Datumsgrenze verläuft ungefähr dort, weicht aber an einigen Stellen ab. Sie ist keine gerade Linie entlang des gesamten Meridians.</p></details></section></div></div>`;
}
function pointSummary(){const q=quarter(s.lat,s.lon),p=project(s.lat,s.lon,s.camLat,s.camLon);return `${coord(s.lat,s.lon)}<br>${q.name}<div class="aw-small">${p[2]<0?'Der Punkt liegt gerade auf der Rückseite. Hole ihn nach vorn.':q.detail}</div>`;}
const quarterTasks=[[50,14],[-30,80],[40,-120],[-20,-60],[0,45],[35,0],[-30,180],[90,80]];
function hemisphereModels(){
 return `<details><summary>Nord-, Süd-, Ost- und Westhalbkugel im Modell vergleichen</summary><p>Jeder Blick zeigt genau eine Halbkugel. Die Gegenseite liegt dahinter. Wähle im Gradnetzbereich dieselbe Ansicht, um die Erde zu drehen.</p><div class="aw-grid2">${[[90,0,'Nordhalbkugel','Grenze: Äquator','#e0edfc'],[-90,0,'Südhalbkugel','Grenze: Äquator','#e2f3e9'],[0,90,'Osthalbkugel','Grenzen: 0° und 180°','#f4e6ee'],[0,-90,'Westhalbkugel','Grenzen: 0° und 180°','#f8efd9']].map(([la,lo,title,desc,col])=>`<section class="aw-card aw-viewcard"><h3>${title}</h3>${globeGraphic(la,lo,'both',false).replace('fill="#e3f1f8"',`fill="${col}"`)}<p>${desc}</p></section>`).join('')}</div></details>`;
}
function quartersView(){
 const t=quarterTasks[s.quarterIndex],q=quarter(t[0],t[1]);
 return `${hemisphereModels()}<div class="aw-grid"><section class="aw-card"><h2>Aus zwei Halbkugeln wird ein Erdviertel</h2><p>Der <b>Äquator</b> trennt Nord und Süd. <b>Nullmeridian und 180°-Meridian</b> grenzen Ost- und Westhalbkugel voneinander ab.</p>${flatMap('world',{quarters:true})}<div class="aw-callout">Beispiel: <b>50° N und 14° O → Nordostviertel</b>. Auf der Weltkarte liegt es oben rechts. Ein Erdviertel ist kein Kontinent.</div><p class="aw-muted">Die flache Weltkarte verzerrt Flächen. Die vier Erdviertel sind auf der Kugel gleich große Teile.</p></section><section class="aw-card"><span class="aw-kicker">Aufgabe ${s.quarterIndex+1} / ${quarterTasks.length}</span><h2>In welchem Erdviertel?</h2><div class="aw-stat">${coord(...t)}</div><div class="aw-quarter">${[['NW','Nordwestviertel','N + W'],['NO','Nordostviertel','N + O'],['SW','Südwestviertel','S + W'],['SO','Südostviertel','S + O'],['edge','Auf einer Grenze','0° oder 180°'],['pole','Am Pol','90° N oder 90° S']].map(([k,title,sub])=>button(`${title}<span>${sub}</span>`,'quarter:'+k)).join('')}</div>${feedback(s.quarterFeedback)}<div class="aw-controls" style="margin-top:15px">${button('Nächste Aufgabe →','quarterNext')}</div><details><summary>Gustavs Hilfe</summary><p>Lies N oder S für die erste Hälfte. Lies O oder W für die zweite Hälfte. Steht dort 0°, 180° oder ein Pol, prüfe zuerst den Sonderfall.</p></details><p class="aw-muted">Die Grenzen werden nicht willkürlich einem Viertel zugeschlagen.</p></section></div>`;
}
function viewModel(kind){
 if(kind==='parallel-side')return globeGraphic(0,0,'lat',false);
 if(kind==='parallel-pole')return globeGraphic(90,0,'lat',false);
 if(kind==='meridian-side')return globeGraphic(0,0,'lon',false);
 return globeGraphic(90,0,'lon',false);
}
const viewCases=[['parallel-side','Nur Breitenkreise · Blick vom Äquator','waagerecht'],['parallel-pole','Nur Breitenkreise · Blick auf den Nordpol','ringe'],['meridian-side','Nur Meridiane · Blick vom Äquator','boegen'],['meridian-pole','Nur Meridiane · Blick auf den Nordpol','strahlen']];
function viewsView(){return `<section class="aw-card"><h2>Was verändert die Blickrichtung?</h2><p>Die Linien auf der Erde bleiben gleich. Von der Seite und vom Pol sehen sie verschieden aus. Betrachte die vier Modelle wie die vier Felder auf deinem Arbeitsblatt.</p><div class="aw-callout"><b>Vom Pol:</b> Breitenkreise erscheinen als Ringe. Meridiane laufen wie Speichen zum Pol.<br><b>Vom Äquator:</b> Breitenkreise erscheinen waagerecht. Meridiane sind gebogene Linien; der mittlere erscheint gerade.</div></section><div class="aw-grid2">${viewCases.map(([id,title])=>`<section class="aw-card aw-viewcard"><h3>${title}</h3>${viewModel(id)}<label for="awView-${id}">Welche Form erkennst du?</label><select id="awView-${id}" data-aw-view="${id}"><option value="">Bitte auswählen</option>${[['waagerecht','Waagerechte Linien'],['ringe','Ringe um den Pol'],['boegen','Bögen von Pol zu Pol'],['strahlen','Speichen / Strahlen zum Pol']].map(([v,t])=>`<option value="${v}" ${s.viewAnswers[id]===v?'selected':''}>${t}</option>`).join('')}</select></section>`).join('')}</div><section class="aw-card">${button('Meine vier Zuordnungen prüfen','checkViews','class="aw-primary"')}<div id="awViewsFeedback" role="status">${s.viewFeedback}</div><p>Vom Südpol sehen Breitenkreise ebenfalls wie Ringe und Meridiane wie Speichen aus. Probiere den Blickwechsel im ersten Bereich aus.</p></section>`;}
const normalize=t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function task(){const p=cityData[s.city];return s.mode==='coords'?`Gesucht: Welche Stadt liegt ungefähr bei <b>${coord(p.lat,p.lon)}</b>?`:s.mode==='nameLat'?`Gegeben: <b>${p.name}, ${p.country}</b>, und <b>${latText(p.lat)}</b>. Gesucht: die <b>Länge</b>.`:`Gegeben: <b>${p.name}, ${p.country}</b>, und <b>${lonText(p.lon)}</b>. Gesucht: die <b>Breite</b>.`;}
function fieldFor(p){const [w,e,so,n]=maps[p.map].bounds;return String.fromCharCode(65+Math.min(3,Math.floor((p.lon-w)/(e-w)*4)))+(Math.min(3,Math.floor((n-p.lat)/(n-so)*4))+1);}
const stepTitles=['Erdviertel','Karte wählen','Breite suchen','Länge suchen','Ort prüfen'];
function stepText(){const p=cityData[s.city],q=quarter(p.lat,p.lon),named=s.mode!=='coords';
 const texts=[
  named?`Suche <b>${p.name}</b> im alphabetischen Ortsregister. Prüfe das Land: <b>${p.country}</b>. Der Registereintrag führt zur Karte und zum Suchfeld. Der bekannte Grad hilft dir beim Kontrollieren.`:`Zerlege die Angabe: <span class="aw-lat">${latText(p.lat)} = Breite</span>, <span class="aw-lon">${lonText(p.lon)} = Länge</span>. Das ist das <b>${q.name}</b>. Suche dieses Gebiet auf der Weltkarte.`,
  `Von der Weltkarte zur genaueren Karte: <b>${maps[p.map].name}</b>. Im echten Atlas findest du die passende Karte im Inhaltsverzeichnis, Kartenübersichtsplan oder Register. Seitenzahlen hängen von der Atlasausgabe ab.`,
  `Suche <b>${latText(p.lat)}</b> am Kartenrand und folge dem <span class="aw-lat">blauen Breitenkreis</span>. In der Lernkarte stehen die Breitengrade links. ${named?'Du gehst vom Ortszeichen zur Breitenangabe am Rand.':'Noch bleibt eine ganze Linie als Möglichkeit.'}`,
  `Suche <b>${lonText(p.lon)}</b> am Kartenrand und folge dem <span class="aw-lon">violetten Meridian</span>. ${named?'Kontrolliere, ob die Linie zum Ortszeichen und zur bekannten Angabe passt.':'Am Schnittpunkt mit dem Breitenkreis liegt die gesuchte Position.'}`,
  `Lies den Namen am Schnittpunkt: <b>${p.name}</b>, ${p.country}. Prüfe <b>beide Zahlen und beide Richtungen</b>. Bei gerundeten Koordinaten suchst du einen kleinen Bereich um den Punkt, keine exakte Adresse.`
 ];return texts[s.step];}
function atlasView(){const p=cityData[s.city],isLat=s.mode==='nameLon';
 return `<section class="aw-card"><h2>Mit dem Atlas einen Ort finden</h2><div class="aw-controls">${[['coords','Zwei Koordinaten → Ort'],['nameLat','Ortsname + Breite → Länge'],['nameLon','Ortsname + Länge → Breite']].map(([k,t])=>button(t,'mode:'+k,`aria-pressed="${s.mode===k}"`)).join('')}</div><label for="awExample">Beispiel auswählen</label><select id="awExample" data-aw-example>${cityData.map((p,i)=>`<option value="${i}" ${s.city===i?'selected':''}>Beispiel ${i+1}${s.mode==='coords'?'':' · '+p.name}</option>`).join('')}</select><div class="aw-stat">${task()}</div><div class="aw-callout"><b>Ein Grad allein beschreibt eine Linie.</b> Bei Ortsname + einem Grad findest du den Ort über das Register und liest den fehlenden Grad ab. Ohne Ortsname oder zweite Koordinate ist die Position normalerweise nicht eindeutig.</div></section><div class="aw-grid"><section class="aw-card"><h3>Der Suchweg auf der Karte</h3><div class="aw-steps">${stepTitles.map((t,i)=>button(`${i+1}. ${t}`,'step:'+i,`aria-current="${s.step===i?'step':'false'}" ${s.step===i?'class="aw-primary"':''}`)).join('')}</div><div id="awAtlasMap" class="aw-map-wrap">${atlasMap()}</div><p class="aw-feedback" id="awStepText" role="status">${stepText()}</p><div class="aw-controls">${button('← Zurück','step:'+Math.max(0,s.step-1),s.step===0?'disabled':'')}${button(s.step===4?'Von vorn':'Weiter →','step:'+(s.step===4?0:s.step+1))}${button(s.playing?'Suchweg anhalten':'Suchweg abspielen','play','id="awPlay" aria-pressed="'+s.playing+'"')}</div><p class="aw-muted">Im echten Atlas können Zahlen an anderen Rändern stehen. Folge den beschrifteten Linien; nicht jede Karte ist ein rechteckiges Gradnetz.</p></section><div><section class="aw-card"><h3>Jetzt selbst lösen</h3><form id="awAnswerForm">${s.mode==='coords'?`<label for="awAnswer">Wie heißt die Stadt?</label><input id="awAnswer" data-aw-answer type="text" autocomplete="off" value="${E(s.answer)}" placeholder="Ortsnamen eintragen">`:`<label for="awAnswer">Fehlende ${isLat?'Breite':'Länge'} in Grad</label><div class="aw-fields"><input id="awAnswer" data-aw-answer type="text" inputmode="decimal" autocomplete="off" value="${E(s.answer)}" placeholder="z. B. 14,4"><select id="awDirection" data-aw-direction aria-label="Himmelsrichtung">${(isLat?['N','S']:['O','W']).map(d=>`<option ${s.direction===d?'selected':''}>${d}</option>`).join('')}</select></div>`}<div class="aw-controls" style="margin-top:14px"><button type="submit" class="aw-primary">Antwort prüfen</button>${button('Weiteres Beispiel →','nextCity')}</div></form>${feedback(s.feedback)}<details><summary>Tipp zum Ablesen zwischen Gradlinien</summary><p>Liegt ein Ort zwischen 10° und 15° O, schätze den Anteil: 14° liegt nahe an 15°. Für Nachkommastellen brauchst du eine ausreichend genaue Karte. Die Lernkarte nutzt gerundete Werte mit einer Nachkommastelle.</p></details></section><section class="aw-card"><h3>Übungsregister</h3><p class="aw-muted">Dieses Register gehört nur zu unseren Lernkarten. Es enthält vier Orte, alphabetisch sortiert. Ein Eintrag verrät die Ortslösung; nutze ihn zuerst bei „Ortsname + Grad“.</p><details><summary>Alphabetisches Modellregister öffnen</summary><div class="aw-register">${[...cityData].sort((a,b)=>a.name.localeCompare(b.name,'de')).map(p=>button(`${p.name}<span class="aw-small" style="display:block">${p.country} · ${maps[p.map].name} · ${fieldFor(p)}</span>`,'register:'+p.id)).join('')}</div></details><p><b>So funktioniert ein echtes Register:</b> Ortsname suchen → Land prüfen → Seite/Karte aufschlagen → Buchstaben und Zahl des Suchfelds kombinieren → Ortszeichen finden → Grade am Kartenrand ablesen.</p><p class="aw-muted"><b>Planquadrat ≠ Gradnetz:</b> Ein Suchfeld wie C3 gilt nur auf einer bestimmten Karte. 50° N / 14° O beschreibt eine Lage auf der Erde. Zahlen für echte Atlasseiten werden hier nicht erfunden.</p></section></div></div><details><summary>Planquadrate gesondert üben (zeigt Ortsnamen)</summary><section class="aw-card"><h3>Planquadrate im Übungsatlas ausprobieren</h3><p>Das Modellregister nennt für ${p.name} das Suchfeld <b>${fieldFor(p)}</b>. Suche zuerst die Spalte (Buchstabe), dann die Zeile (Zahl). Die Buchstaben sind keine Himmelsrichtungen.</p>${registerMap(p)}</section></details><details><summary>Genau hinschauen: Angaben aus den Skizzen</summary><p>Prag liegt ungefähr bei <b>50,1° N / 14,4° O</b>. Falls die Notiz als 50,9° N gelesen wird, ist das für Prag zu weit nördlich. Lissabon liegt ungefähr bei <b>38,7° N / 9,1° W</b>; San Francisco bei <b>37,8° N / 122,4° W</b>.</p><p><b>23,6° S / 133,8° O</b> aus der Skizze liegt in Zentralaustralien, in der Nähe von Alice Springs. Der verwendete Referenzpunkt für Alice Springs liegt gerundet bei <b>23,7° S / 133,9° O</b>. Gerundete Angaben und Ortszeichen verschiedener Atlanten können leicht voneinander abweichen.</p><p><b>0,1° ist nicht 1′:</b> 0,1 Grad = 6 Winkelminuten; 1° = 60′. Die App verwendet Dezimalgrad mit Komma.</p></details>`;
}
function atlasMap(){const p=cityData[s.city];return flatMap(s.step===0?'world':p.map,{quarters:s.step===0,city:p,lat:s.step>=2,lon:s.step>=3,point:s.step>=3,names:s.step>=4});}
function registerMap(p){
 let html=flatMap(p.map,{city:p,names:true}),[w,e,so,n]=maps[p.map].bounds;
 let a='';for(let i=0;i<=4;i++){let x=63+i*650/4,y=42+i*330/4;if(i<4)a+=`<text x="${x+650/8}" y="397" text-anchor="middle" font-size="17" font-weight="700" fill="#17394e">${String.fromCharCode(65+i)}</text><text x="733" y="${y+330/8+5}" font-size="17" font-weight="700" fill="#17394e">${i+1}</text>`;a+=`<path d="M${x} 42V372M63 ${y}H713" stroke="#17394e" stroke-width="1.5" stroke-dasharray="6 5"/>`;}
 const field=fieldFor(p);const col=field.charCodeAt(0)-65,row=Number(field[1])-1;
 a+=`<rect x="${63+col*650/4}" y="${42+row*330/4}" width="${650/4}" height="${330/4}" fill="#e6a129" fill-opacity=".2" stroke="#925b00" stroke-width="3"/>`;
 return html.replace('</svg>',a+'</svg>');
}
const gapItems=[
 {id:'parallel',label:'Lücke 1: Verlauf der Breitenkreise',words:['parallel'],tip:'Die Breitenkreise schneiden sich nicht. Sie haben überall dieselbe Richtung wie der Äquator.'},
 {id:'reference',label:'Lücke 2: Bezugslinie der Breitenkreise',words:['äquator','aequator'],tip:'Gesucht ist die Linie mit 0° geografischer Breite.'},
 {id:'north',label:'Lücke 3: Startpunkt des Meridians',words:['nordpol'],tip:'Gesucht ist der Pol bei 90° N.'},
 {id:'south',label:'Lücke 4: Endpunkt des Meridians',words:['südpol','suedpol'],tip:'Gesucht ist der Pol bei 90° S.'},
 {id:'largest',label:'Lücke 5: größter Breitenkreis',words:['äquator','aequator'],tip:'Dieser Breitenkreis liegt genau zwischen den beiden Polen und hat 0° Breite.'}
];
function checkGaps(values){return gapItems.map(item=>({id:item.id,ok:item.words.some(w=>normalize(w)===normalize(values[item.id]||'').replace(/[.!?]+$/,'')),empty:!String(values[item.id]||'').trim(),tip:item.tip}));}
function gapField(id){const item=gapItems.find(i=>i.id===id),result=s.gapFeedback?.find(i=>i.id===id);return `<span class="aw-gap-field"><label class="sr-only" for="aw-gap-${id}">${item.label}</label><input id="aw-gap-${id}" data-aw-gap="${id}" type="text" autocomplete="off" spellcheck="false" maxlength="40" value="${E(s.gaps[id]||'')}" placeholder="${id==='parallel'?'Wie?':'Welcher Begriff?'}" ${result?`aria-invalid="${!result.ok}" aria-describedby="aw-gap-feedback-${id}"`:''}>${result?`<span id="aw-gap-feedback-${id}" class="aw-gap-state" data-good="${result.ok}">${result.ok?'✓ Das passt.':result.empty?'Hier fehlt noch ein Wort.':'Das übe ich noch.'}</span>`:''}</span>`;}
function gapView(){const result=s.gapFeedback,count=result?.filter(r=>r.ok).length;return `<div class="aw-grid"><section class="aw-card"><span class="aw-kicker">Ergänzung zu deinem Arbeitsblatt</span><h2>Drei Merksätze zum Gradnetz</h2><p>Ergänze die fünf Lücken. Du kannst die Wörter selbst schreiben oder vorher die Wort-Hilfe öffnen.</p><details><summary>Wort-Hilfe öffnen</summary><div class="aw-chips"><span>Äquator</span><span>Nordpol</span><span>parallel</span><span>Südpol</span></div><p>Das Wort <b>Äquator</b> brauchst du zweimal. „Ae“ statt „Ä“ und „ue“ statt „ü“ werden ebenfalls erkannt.</p></details><form id="awGapForm"><ol class="aw-gap-list"><li>Die Breitenkreise verlaufen ${gapField('parallel')} zum ${gapField('reference')}.</li><li>Die Meridiane (Längenhalbkreise) verlaufen vom ${gapField('north')} zum ${gapField('south')}.</li><li>Der größte Breitenkreis ist der ${gapField('largest')}.</li></ol><div class="aw-controls"><button type="submit" class="aw-primary">Meine Lücken prüfen</button>${button('Lücken neu ausfüllen','gapReset')}${button(s.gapSolution?'Musterlösung ausblenden':'Musterlösung anzeigen','gapSolution')}</div></form>${result?`<div class="aw-feedback" role="status" data-good="${count===5}"><b>${count} von 5 Lücken passen.</b>${count===5?' Gut gemacht! Lies die drei vollständigen Sätze noch einmal.':' Du kannst deine Einträge verbessern und erneut prüfen.'}${result.filter(r=>!r.ok).map(r=>`<p><b>${E(gapItems.find(i=>i.id===r.id).label)}:</b> ${E(r.tip)}</p>`).join('')}${s.gapSeenSolution?'<p>Mit geöffneter Musterlösung übst du ohne neue Einträge im Lernfortschritt. Mit „Lücken neu ausfüllen“ startest du einen neuen Versuch.</p>':''}</div>`:''}${s.gapSolution?`<aside class="aw-callout"><h3>Musterlösung</h3><p>Die Breitenkreise verlaufen <b>parallel</b> zum <b>Äquator</b>.</p><p>Die Meridiane (Längenhalbkreise) verlaufen vom <b>Nordpol</b> zum <b>Südpol</b>.</p><p>Der größte Breitenkreis ist der <b>Äquator</b>.</p></aside>`:''}</section><div><section class="aw-card aw-viewcard"><h3 class="aw-lat">Breitenkreise: parallel zum Äquator</h3>${globeGraphic(12,0,'lat',false)}<p>Der dicke blaue Kreis ist der Äquator. Die Breitenkreise werden zu den Polen hin kleiner. An jedem Pol bleibt nur ein Punkt.</p></section><section class="aw-card aw-viewcard"><h3 class="aw-lon">Meridiane: von Pol zu Pol</h3>${globeGraphic(0,0,'lon',false)}<p>Ein Meridian ist ein <b>halber Längenkreis</b>. Zwei gegenüberliegende Meridiane bilden einen ganzen Längenkreis. Ganze Längenkreise verlaufen durch beide Pole.</p></section></div></div>`;}

function sources(){return `<details class="aw-sources"><summary>Fachliche Grundlagen und Kartenquellen</summary><p>Eigene Lernmodelle nach den eingereichten Unterrichtsskizzen. Keine kopierten Atlaskarten. Vereinfachte Küstenkonturen: Natural Earth, Public Domain.</p><ul><li><a href="https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html" target="_blank" rel="noopener">NOAA: geografische Breite und Länge</a></li><li><a href="https://oceanservice.noaa.gov/facts/longitude.html" target="_blank" rel="noopener">NOAA: Nullmeridian, 180°-Meridian und Datumsgrenze</a></li>${cityData.map(p=>`<li><a href="${p.source}" target="_blank" rel="noopener">Ortslage ${p.name}: ${coord(p.lat,p.lon)}, auf 0,1° gerundet</a></li>`).join('')}</ul><p>GeoNames-Ortslagen: CC BY 4.0. Alice Springs: Place Names Register, Northern Territory Government. Fach- und Datenprüfung: 26.10.2026. Alle Übungen funktionieren ohne diese externen Links.</p></details>`;}
function show(){
 const views={globe:globeView,quarters:quartersView,views:viewsView,atlas:atlasView,gaps:gapView};
 return `<div class="aw"><header class="aw-hero"><span class="aw-kicker">Gustavs Gradnetz- und Atlaswerkstatt</span><h1>Jeder Ort hat eine Lage.</h1><p>Entdecke Linien auf der Erde, wechsle den Blickwinkel und finde Orte im Atlas. Schritt für Schritt, mit deinen Unterrichtsskizzen als Ausgangspunkt.</p><div class="aw-chips"><span class="aw-lat">━ Breite · N / S</span><span class="aw-lon">┃ Länge · O / W</span><span>Vier Erdviertel</span></div><div class="aw-progress"><span class="aw-complete">${s.done.size} verschiedene Aufgaben gelöst · auf diesem Gerät gespeichert</span>${button('Lernfortschritt zurücksetzen','askReset','class="aw-small"')}</div></header><nav class="aw-nav" aria-label="Bereiche der Atlaswerkstatt">${[['globe','1 · Gradnetz entdecken'],['quarters','2 · Erdviertel'],['views','3 · Blickrichtungen'],['atlas','4 · Orte im Atlas finden'],['gaps','5 · Lückentext']].map(([v,t])=>button(t,'view:'+v,`aria-current="${s.view===v?'page':'false'}"`)).join('')}</nav><div id="awSection">${views[s.view]()}</div>${sources()}</div>`;
}
function updateGlobe(){
 const g=document.getElementById('awGlobe');if(!g)return;g.innerHTML=globeGraphic();
 document.getElementById('awAngle').innerHTML=angleGraphic();
 document.getElementById('awLatOut').textContent=latText(s.lat);document.getElementById('awLonOut').textContent=lonText(s.lon);
 document.getElementById('awPoint').innerHTML=pointSummary();
}
function renderHere(){render();}
function spin(now){if(!s.spin||state.tab!=='atlaswerkstatt'||s.view!=='globe')return;
 if(last){s.camLon=((s.camLon+Math.min(now-last,100)*.012+180)%360)-180;updateGlobe();document.getElementById('awCamera').value=s.camLon;}
 last=now;raf=requestAnimationFrame(spin);
}
function playStep(){if(!s.playing||state.tab!=='atlaswerkstatt')return;
 timer=setTimeout(()=>{if(document.hidden){stop();renderHere();return;}s.step++;if(s.step>=4){s.step=4;s.playing=false;}renderHere();if(s.playing)playStep();},2200);
}
function answer(){const p=cityData[s.city];
 if(s.mode==='coords'){
  const ok=p.aliases.includes(normalize(s.answer));s.feedback={ok,text:ok?`Richtig: ${p.name} in ${p.country}. Kontrolliere ${coord(p.lat,p.lon)}.`:s.answer.trim()?'Prüfe den Schnittpunkt auf der genaueren Karte. Du kannst den Suchweg bis „Ort prüfen“ durchgehen.':'Trage zuerst einen Ortsnamen ein. Nutze bei Bedarf den Suchweg.'};
 }else s.feedback=checkMissing(s.answer,s.direction,s.mode==='nameLat'?p.lon:p.lat,s.mode==='nameLon');
 if(s.feedback.ok)mark(s.mode+':'+p.id);renderHere();
}
function command(cmd){const [action,value]=cmd.split(':');
 if(action==='gapReset'){s.gaps={};s.gapFeedback=null;s.gapSolution=false;s.gapSeenSolution=false;renderHere();return;}
 if(action==='gapSolution'){s.gapSolution=!s.gapSolution;s.gapSeenSolution=true;renderHere();return;}
 if(action==='view'){stop();s.view=value;renderHere();return;}
 if(action==='layer'){stop();s.layer=value;renderHere();return;}
 if(action==='camera'){stop();s.camLat=({equator:0,north:90,south:-90})[value];s.camLon=0;renderHere();return;}
 if(action==='focus'){stop();s.camLon=s.lon;s.camLat=s.lat;renderHere();return;}
 if(action==='spin'){
  if(reduced()){s.camLon=(s.camLon+20+180)%360-180;renderHere();return;}
  s.spin=!s.spin;const b=document.getElementById('awSpin');b.textContent=s.spin?'Drehung anhalten':'Drehung starten';b.setAttribute('aria-pressed',String(s.spin));if(s.spin){last=0;raf=requestAnimationFrame(spin);}else cancelAnimationFrame(raf);return;
 }
 if(action==='quarter'){const t=quarterTasks[s.quarterIndex],q=quarter(...t),ok=q.code===value;s.quarterFeedback={ok,text:ok?`${q.name}: ${q.detail}`:`Schau noch einmal: ${q.detail}`};if(ok)mark('viertel:'+s.quarterIndex);renderHere();return;}
 if(action==='quarterNext'){s.quarterIndex=(s.quarterIndex+1)%quarterTasks.length;s.quarterFeedback=null;renderHere();return;}
 if(action==='checkViews'){
  const missing=viewCases.filter(([id])=>!s.viewAnswers[id]);
  if(missing.length)s.viewFeedback=`<div class="aw-feedback" data-good="false">Wähle zuerst in allen vier Feldern eine Form aus.</div>`;
  else {let correct=0;s.viewFeedback=viewCases.map(([id,title,key])=>{const ok=s.viewAnswers[id]===key;if(ok){correct++;mark('ansicht:'+id);}return `<p><b>${E(title)}:</b> ${ok?'Das passt.':({waagerecht:'Breitenkreise erscheinen waagerecht.',ringe:'Vom Pol siehst du Ringe.',boegen:'Meridiane erscheinen als Bögen von Pol zu Pol.',strahlen:'Meridiane erscheinen wie Speichen zum Pol.'})[key]}</p>`;}).join('');s.viewFeedback=`<div class="aw-feedback" data-good="${correct===4}"><b>${correct} von 4 passen.</b>${s.viewFeedback}</div>`;}
  renderHere();return;
 }
 if(action==='step'){stop();s.step=+value;renderHere();return;}
 if(action==='play'){if(s.playing){stop();renderHere();return;}if(reduced()){s.step=Math.min(4,s.step+1);renderHere();return;}stop();s.step=0;s.playing=true;renderHere();playStep();return;}
 if(action==='mode'){stop();s.mode=value;s.step=0;s.answer='';s.direction=value==='nameLon'?'N':'O';s.feedback=null;renderHere();return;}
 if(action==='nextCity'){stop();s.city=(s.city+1)%cityData.length;s.step=0;s.answer='';s.feedback=null;renderHere();return;}
 if(action==='register'){stop();s.city=cityData.findIndex(p=>p.id===value);s.mode='nameLat';s.direction='O';s.step=1;s.answer='';s.feedback=null;renderHere();return;}
 if(action==='askReset'){
  const b=ROOT.querySelector('[data-aw="askReset"]');b.outerHTML='<span class="aw-row">Nur die neuen Werkstatt-Ergebnisse löschen? '+button('Ja, zurücksetzen','reset')+button('Behalten','keep')+'</span>';return;
 }
 if(action==='reset'){s.done.clear();try{localStorage.removeItem('geo-atlaswerkstatt-v1')}catch{}renderHere();return;}
 if(action==='keep')renderHere();
}
document.addEventListener('click',e=>{const el=e.target.closest('[data-aw]');if(!el)return;e.preventDefault();e.stopPropagation();if(el.dataset.aw==='open'){stop();state.tab='atlaswerkstatt';state.view='home';renderHere();return;}command(el.dataset.aw);},true);
ROOT.addEventListener('submit',e=>{if(e.target.id==='awGapForm'){e.preventDefault();s.gapFeedback=checkGaps(s.gaps);if(!s.gapSeenSolution)s.gapFeedback.filter(r=>r.ok).forEach(r=>mark('merksatz:'+r.id));renderHere();return;}if(e.target.id==='awAnswerForm'){e.preventDefault();answer();}});
ROOT.addEventListener('input',e=>{const el=e.target;if(el.dataset.awGap){s.gaps[el.dataset.awGap]=el.value;s.gapFeedback=null;const input=el;input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');const hint=document.getElementById('aw-gap-feedback-'+el.dataset.awGap);if(hint){hint.textContent='Erneut prüfen';hint.removeAttribute('data-good');}const total=ROOT.querySelector('.aw-feedback[role="status"]');if(total){total.textContent='Eintrag geändert. Prüfe deine Lücken erneut.';total.removeAttribute('data-good');}}if(el.dataset.awInput){if(s.spin){stop();const b=document.getElementById('awSpin');if(b){b.textContent=reduced()?'20° weiterdrehen':'Drehung starten';b.setAttribute('aria-pressed','false');}}s[el.dataset.awInput]=Number(el.value);updateGlobe();}if(el.hasAttribute('data-aw-answer')){s.answer=el.value;if(s.playing){stop();const b=document.getElementById('awPlay');if(b){b.textContent='Suchweg abspielen';b.setAttribute('aria-pressed','false');}}}});
ROOT.addEventListener('change',e=>{const el=e.target;if(el.hasAttribute('data-aw-example')){stop();s.city=Number(el.value);s.step=0;s.feedback=null;s.answer='';renderHere();}if(el.hasAttribute('data-aw-direction'))s.direction=el.value;if(el.dataset.awView)s.viewAnswers[el.dataset.awView]=el.value;});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(s.spin||s.playing)){stop();if(state.tab==='atlaswerkstatt')renderHere();}});
const oldRender=render;
render=function(){if(state.tab!=='atlaswerkstatt'){stop();oldRender();return;}updateStars();document.documentElement.dataset.theme=progress.theme;document.documentElement.dataset.contrast=progress.contrast;document.documentElement.style.setProperty('--fontScale',String(progress.font));document.querySelectorAll('#tabs button').forEach(b=>{const active=b.dataset.tab==='atlaswerkstatt';b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');});ROOT.innerHTML=show();};
const nav=document.getElementById('tabs'),tab=document.createElement('button');tab.type='button';tab.dataset.tab='atlaswerkstatt';tab.textContent='🌐 Gradnetz & Atlas';nav.insertBefore(tab,nav.querySelector('[data-tab="learn"]'));
const entry=()=>`<section class="card aw-entry"><div class="eyebrow">Neu · passend zu deinen Unterrichtsskizzen</div><h2>🌐 Gradnetz & Atlas</h2><p>Erde drehen · Erdviertel erkennen · Blick auf den Pol · Orte mit Koordinaten oder Ortsname + einem Grad finden.</p><button type="button" class="btn" data-aw="open">Gradnetz- und Atlaswerkstatt öffnen →</button></section>`;
const oldStart=renderStart;renderStart=function(){return entry()+oldStart();};
const oldLesson=renderLesson;renderLesson=function(){const result=oldLesson();return ['gradnetz','atlanten'].includes(state.topic)?entry()+result:result;};
window.AtlasWerkstatt=Object.freeze({quarter,number,checkMissing,project,cityData,maps,fieldFor,coord,normalize,checkGaps});
render();
})();
