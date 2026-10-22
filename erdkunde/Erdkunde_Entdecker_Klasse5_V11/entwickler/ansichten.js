/* Gemeinsame, offline verfügbare Geometrie für App, Lernheft und PDF. */
'use strict';
function geoScene(angle=45, object=1, map=false, altitude=2){
 const e=Math.max(0,Math.min(90,Number(angle)))*Math.PI/180;
 const az=(angle===0?0:25)*Math.PI/180, scale=altitude<=2?1.16-(Number(altitude)-1)*.24:.92-(Number(altitude)-2)*.2;
 const project=([x,y,z=0])=>[350+scale*(x*Math.cos(az)+y*Math.sin(az)),235+scale*((y*Math.cos(az)-x*Math.sin(az))*Math.sin(e)-z*Math.cos(e))];
 const poly=(points,fill,stroke='#37505b')=>`<polygon points="${points.map(p=>project(p).map(n=>n.toFixed(2)).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
 let art=poly([[-235,-135],[235,-135],[235,135],[-235,135]],'#cbe4bc');
 art+=poly([[-235,86],[235,86],[235,116],[-235,116]],'#8c979d');
 art+=poly([[142,-135],[169,-135],[169,135],[142,135]],'#e6cf9d');
 const house=(x,y,w,d,h,r,color)=>{
  const a=[x-w,y-d,0],b=[x+w,y-d,0],c=[x+w,y+d,0],f=[x-w,y+d,0];
  const A=[x-w,y-d,h],B=[x+w,y-d,h],C=[x+w,y+d,h],F=[x-w,y+d,h],R=[x,y-d,h+r],S=[x,y+d,h+r];
  if(map)return poly([a,b,c,f],color);
  let s='';
  if(angle<90){
   s+=poly([a,f,F,A],'#cba77f')+poly([f,c,C,F],'#f0cba0')+poly([F,C,S],'#e3b98c');
   s+=poly([[x-35,y+d+.2,0],[x-7,y+d+.2,0],[x-7,y+d+.2,47],[x-35,y+d+.2,47]],'#725345');
   s+=poly([[x+13,y+d+.3,26],[x+40,y+d+.3,26],[x+40,y+d+.3,49],[x+13,y+d+.3,49]],'#a0dce9');
  }
  return s+poly([R,S,C,B],'#b76d51')+poly([A,F,S,R],color);
 };
 if(object===2){
  art+=house(-80,-48,73,36,64,0,'#9a73b7');
  art+=house(-117,18,36,30,64,0,'#9a73b7');
  art+=poly([[6,-12],[104,-12],[104,61],[6,61]],'#eadcb6');
 }else art+=house(-35,-8,92,62,74,43,'#d58c64');
 const tree=project([95,-90,angle===90?0:65]);
 if(angle<90){const base=project([95,-90,0]);art+=`<path d="M${base.join(' ')}L${tree.join(' ')}" stroke="#76513c" stroke-width="${9*scale}"/>`}
 art+=`<circle cx="${tree[0]}" cy="${tree[1]}" r="${24*scale}" fill="#47845d" stroke="#2f6143" stroke-width="2"/>`;
 const label=map?'Kartenskizze':angle===90?'Draufsicht · senkrecht von oben':angle===0?'Seitenansicht · vom Boden':'Schrägansicht · von schräg oben';
 const caption=object===2?'Objekt 2: L-förmiges Schulgebäude und Hof':'Objekt 1: Haus, Baum und Straße';
 return `<svg class="geo-scene" viewBox="0 0 700 420" role="img" aria-label="${caption}. ${label}. Schematisches Modell."><defs><clipPath id="geoSceneClip"><rect x="10" y="55" width="620" height="300"/></clipPath></defs><rect width="700" height="420" rx="16" fill="#eef7fb"/><text x="350" y="30" text-anchor="middle" font-size="23" font-weight="700" fill="#173d52">${label}</text><g clip-path="url(#geoSceneClip)">${art}</g><text x="350" y="392" text-anchor="middle" font-size="18" fill="#173d52">${caption}</text>${map?'<g transform="rotate(-25 660 110)" fill="#173d52"><path d="M660 126V88M660 88L653 101M660 88L667 101" stroke="#173d52" stroke-width="3"/><text x="653" y="79" font-size="20">N</text></g>':''}</svg>`;
}
function geoLearningVisual(topic){
 let s='',caption='';
 if(topic==='himmelsrichtungen'){
  const names=['N','NO','O','SO','S','SW','W','NW'];
  s='<circle cx="350" cy="155" r="103" fill="#e6f1ec" stroke="#347787" stroke-width="3"/>';
  s+=names.map((n,i)=>{const a=i*Math.PI/4;return `<path d="M350 155L${350+85*Math.sin(a)} ${155-85*Math.cos(a)}" stroke="#699ca7" stroke-width="2"/><text x="${350+124*Math.sin(a)}" y="${162-124*Math.cos(a)}" text-anchor="middle" font-size="21" fill="#173d52">${n}</text>`}).join('');
  s+='<path d="M350 70L338 155H362Z" fill="#be493d"/>';
  caption='Die Windrose: N – O – S – W im Uhrzeigersinn';
 }else if(topic==='gradnetz'){
  s='<rect x="110" y="30" width="480" height="235" fill="#c2e6f2" stroke="#347787"/>';
  for(let i=0;i<=8;i++)s+=`<path d="M${110+i*60} 30V265" stroke="#7eb4c7"/>`;
  for(let i=0;i<=4;i++)s+=`<path d="M110 ${30+i*58.75}H590" stroke="#7eb4c7"/>`;
  s+='<path d="M350 30V265M110 147.5H590" stroke="#235d80" stroke-width="3"/><text x="120" y="140" font-size="17">Äquator 0°</text><text x="358" y="52" font-size="17">Nullmeridian</text><circle cx="470" cy="88.75" r="8" fill="#c64d3d"/><text x="480" y="78" font-size="18">30° N, 60° O</text><text x="78" y="40" font-size="18">N</text><text x="78" y="263" font-size="18">S</text><text x="113" y="290" font-size="18">West</text><text x="550" y="290" font-size="18">Ost</text>';
  caption='Vereinfachtes Gradnetz: Breite waagerecht, Länge senkrecht';
 }else if(['kartenlesen','atlanten','kartenarten','wege','skizzen','geographie'].includes(topic)){
  s='<rect x="75" y="38" width="355" height="230" fill="#d5e7c9" stroke="#347787"/><path d="M80 70Q290 100 180 268" stroke="#5dadd2" stroke-width="24" fill="none"/><path d="M75 200L430 90" stroke="#e3bf83" stroke-width="16"/><rect x="285" y="175" width="40" height="30" fill="#b7735a"/><circle cx="355" cy="70" r="25" fill="#4d8c62"/><path d="M405 80V45L397 58M405 45L413 58" stroke="#173d52" fill="none" stroke-width="3"/><text x="399" y="34" font-size="18">N</text><text x="458" y="60" font-size="21">Legende</text><path d="M460 95H496" stroke="#5dadd2" stroke-width="12"/><text x="510" y="102" font-size="19">Fluss</text><path d="M460 137H496" stroke="#e3bf83" stroke-width="12"/><text x="510" y="144" font-size="19">Straße</text><rect x="460" y="170" width="36" height="22" fill="#b7735a"/><text x="510" y="188" font-size="19">Gebäude</text><circle cx="477" cy="231" r="16" fill="#4d8c62"/><text x="510" y="238" font-size="19">Wald</text>';
  caption='Erfundene Kartenskizze: wichtige Objekte mit Legende';
 }else if(topic==='massstab'){
  s='<text x="350" y="65" text-anchor="middle" font-size="28" fill="#173d52">1 : 50.000</text><path d="M170 110H530" stroke="#d18b48" stroke-width="5"/><path d="M170 95V125M530 95V125" stroke="#173d52" stroke-width="3"/><text x="350" y="153" text-anchor="middle" font-size="23">3 cm (angegebener Messwert)</text><text x="350" y="205" text-anchor="middle" font-size="24">3 × 50.000 cm = 150.000 cm</text><text x="350" y="254" text-anchor="middle" font-size="24">= 1.500 m = 1,5 km</text>';
  caption='Erst multiplizieren, danach die Einheit umrechnen';
 }else if(topic==='hoehenlinien'){
  s='<path d="M55 265L200 55L345 265Z" fill="#a4c591" stroke="#44775b" stroke-width="3"/><path d="M98 203H303M140 141H260M181 80H219" stroke="#a16743" stroke-width="3"/><ellipse cx="510" cy="160" rx="125" ry="102" fill="#d4e8c9" stroke="#a16743" stroke-width="3"/><ellipse cx="510" cy="160" rx="84" ry="67" fill="none" stroke="#a16743" stroke-width="3"/><ellipse cx="510" cy="160" rx="43" ry="33" fill="none" stroke="#a16743" stroke-width="3"/><text x="125" y="295" font-size="20">Seitenprofil</text><text x="465" y="295" font-size="20">Draufsicht</text>';
  caption='Höhenlinien verbinden Punkte gleicher Höhe – schematisches Modell';
 }
 return s?`<figure><svg class="geo-scene" viewBox="0 0 700 340" role="img" aria-label="${caption}"><rect width="700" height="340" rx="15" fill="#eef7fb"/>${s}</svg><figcaption>${caption}</figcaption></figure>`:'';
}
function geoComparison(object=1){
 const views=object===1?[[0,false,'Höhe, Tür und Fenster; Flächen dahinter bleiben verdeckt.'],[45,false,'Dach und Fassade gemeinsam; Gebäude verdecken Teile des Geländes.'],[90,false,'Dachflächen und Lage; die Hauswand ist nicht sichtbar.'],[90,true,'Gleiche Lage, vereinfacht als Zeichen. Kein Foto und kein genauer Maßstab.']]:[[45,false,'Zwei verbundene Flügel bilden ein L. Der helle Hof liegt rechts daneben.'],[90,false,'Von oben bleibt die L-Form erhalten. Die Höhe fällt aus der Darstellung weg.']];
 return `<div class="geo-comparison">${views.map(([a,m,t])=>`<figure>${geoScene(a,object,m)}<figcaption>${t}</figcaption></figure>`).join('')}</div><p class="geo-key"><b>Orientierungshilfe:</b> Der Baum bleibt hinter/rechts vom Gebäude, die Straße davor. Bei Objekt 1 bedeutet die braune Fläche in der Kartenskizze „Gebäude“, Grün „Baum“, Grau „Straße“. Vergleiche dieselben Merkmale, nicht nur die Farben.</p>`;
}
function geoDrone(camera,altitude){
 return geoScene(camera==='oblique'?40:90,1,false,Number(altitude));
}
function geoDepth(topic){
 const texts={
  perspektive:['So vergleichst du Ansichten','1. Suche ein wiedererkennbares Objekt (Haus, Baum, Straße). 2. Bestimme die Blickrichtung. 3. Vergleiche Lage, Dach und Fassade. 4. Erkläre, was sichtbar oder verdeckt ist.','Warum verschwindet die Fassade von oben? Die Blickrichtung verläuft parallel zur senkrechten Hauswand. Sie erscheint nur noch als Kante. Ein Dachumriss verrät deshalb nicht zuverlässig die Gebäudehöhe.'],
  luftbild:['Die Kamera schaut – nicht die Drohne','Die Drohne kann auf derselben Höhe bleiben und nur ihre Kamera kippen. Senkrecht: Die Kamera zeigt zum Boden. Schräg: Dächer und Fassaden sind gemeinsam sichtbar.','Flughöhe und Blickwinkel sind verschiedene Größen. In unserem Modell verkleinert höhere Flughöhe das Haus bei gleichem Bildausschnitt und gleicher Kameraeinstellung. In Wirklichkeit wirken auch Brennweite und Bildausschnitt. Ein Luftbild ist nicht automatisch eine maßstabstreue Karte.'],
  himmelsrichtungen:['Richtungen begründen','Finde zuerst den Nordpfeil. Leite Osten, Süden und Westen daraus ab. Erst dann beschreibst du eine Richtung vom Start zum Ziel.','Rechts bedeutet nur dann Osten, wenn Norden im Bild nach oben zeigt. Wird die Karte gedreht, drehen sich ihre Himmelsrichtungen mit.'],
  kartenlesen:['Eine Karte ist eine begründete Auswahl','Titel: Was wird dargestellt? Nordpfeil: Wie ist die Karte ausgerichtet? Legende: Was bedeuten Zeichen? Maßstab: Welche Entfernung entspricht einer Strecke?','Beispiel C3: zuerst Spalte C, dann Zeile 3. Ein Planquadrat grenzt eine Fläche ein und ist kein einzelner exakter Punkt.'],
  gradnetz:['Koordinaten wirklich verstehen','Breite misst vom Äquator nach Norden oder Süden (0° bis 90°). Länge misst vom Nullmeridian nach Osten oder Westen (0° bis 180°). Nenne zuerst die Breite.','Beispiel 30° N, 20° O: Suche den Breitenkreis 30° nördlich des Äquators und den Meridian 20° östlich von Greenwich. Der Schnittpunkt ist der gesuchte Ort. Im flachen Übungsraster sind die Linien vereinfacht; auf der Kugel treffen Meridiane an den Polen zusammen.'],
  massstab:['Rechnen mit Einheiten','3 cm bei 1 : 50.000: 3 × 50.000 = 150.000 cm = 1.500 m = 1,5 km. Prüfe zuletzt, ob die Entfernung plausibel ist.','Auf dem Bildschirm ist ein gezeichneter Zentimeter nicht unbedingt ein echter Zentimeter. Nutze angegebene Messwerte oder eine gemeinsam skalierte Maßstabsleiste.']
 };
 const t=texts[topic];return t?`<section class="card geo-depth"><h3>${t[0]}</h3><p>${t[1]}</p><p><b>Genauer erklärt:</b> ${t[2]}</p></section>`:'';
}
