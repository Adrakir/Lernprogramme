/* V10: Sieben weitere echte Forschungsstationen, Gustav unterstützt nun alle 16 Lernpfade. */
'use strict';
const G10_KINDS=new Set(['geofocus','route','camera','maptypes','atlasgrid','water','sketch']);
const g10={focus:'both',route:1,camera:'top',altitude:2,maptype:'topo',square:'',target:'C3',water:'split',tool:'school',painting:[],history:[],message:''};
const g10Safe=s=>esc(String(s));
const g10Options=(pairs,current,prefix)=>pairs.map(([key,title])=>`<button type="button" class="g9-btn ${key===current?'primary':'light'}" data-g10="${prefix}:${key}" aria-pressed="${key===current}">${g10Safe(title)}</button>`).join('');
function g10Base(content,caption){return `<svg class="g9-graphic g10-illustration" viewBox="0 0 700 360" role="img" aria-label="${g10Safe(caption)}"><rect width="700" height="360" rx="20" fill="#e8f5f7"/>${content}<rect x="12" y="329" width="676" height="25" fill="#fff" opacity=".83" rx="7"/><text x="350" y="347" text-anchor="middle" fill="#183d51" font-size="15" font-weight="700">${g10Safe(caption)}</text></svg>`}
function g10SceneGraphic(m){let type=m.kind,sc=g9.phase==='story'?g9.scene:-1;let content='',caption='Schematische Darstellung';
if(type==='geofocus'){
const mode=sc<0?g10.focus:['both','nature','human'][sc]||'both';
content=`<rect width="700" height="360" rx="20" fill="#d5eaf0"/><path d="M0 195Q110 151 233 198Q350 235 480 187Q580 144 700 185V360H0Z" fill="#a7d2ae"/><path d="M0 235Q180 217 316 261Q420 277 555 232L700 260V360H0Z" fill="#e8d3a6"/><path d="M0 165Q105 197 210 161T412 178T700 156V240Q541 224 424 248T0 229Z" fill="#76b9d6"/>${mode!=='human'?`<g><path d="M35 238Q200 195 315 263" stroke="#ecf8fd" stroke-width="5" stroke-dasharray="8 8" fill="none"/><circle cx="550" cy="120" r="30" fill="#f8c75d"/><path d="M515 210L559 153L609 218Z" fill="#769f7a"/><text x="105" y="104" font-size="22" fill="#20618a" font-weight="800">Natur</text></g>`:''}${mode!=='nature'?`<g><path d="M360 276L421 191 512 275Z" fill="#be7559"/><rect x="387" y="221" width="107" height="54" fill="#e9bf9b"/><path d="M490 259H697" stroke="#877c6d" stroke-width="23"/><path d="M490 259H697" stroke="#fff" stroke-width="2.5" stroke-dasharray="12 10"/><path d="M254 240V286M282 241V288" stroke="#7c6153" stroke-width="8"/><text x="446" y="115" font-size="22" fill="#854d3d" font-weight="800">Mensch</text></g>`:''}`;
caption=mode==='nature'?'Physische Geographie: Naturvorgänge':mode==='human'?'Humangeographie: menschliche Nutzung':'Beide Bereiche greifen ineinander';
}else if(type==='route'){
 const selected=sc<0?g10.route:sc===1?0:1;
 content=`<rect width="700" height="360" fill="#e6efdd"/><g stroke="#d8e0c2" stroke-width="3">${[0,1,2,3,4,5].map(i=>`<path d="M${i*120} 0V360"/>`).join('')}</g><path d="M110 65H595V285H110Z" fill="#dae4da" stroke="#a2b49c" stroke-width="2"/><path d="M110 185H595M350 65V285" stroke="#858d89" stroke-width="32"/><path d="M110 185H595M350 65V285" stroke="#f9f4e3" stroke-width="3" stroke-dasharray="12 9"/><rect x="132" y="81" width="96" height="72" fill="#d3a181"/><rect x="468" y="220" width="96" height="46" fill="#92b8ce"/><rect x="175" y="224" width="95" height="42" fill="#9bb78d"/><circle cx="188" cy="116" r="12" fill="#267b9e"/><circle cx="513" cy="242" r="12" fill="#b14d46"/><text x="188" y="95" text-anchor="middle" font-size="20" font-weight="800" fill="#23495d">Start</text><text x="513" y="213" text-anchor="middle" font-size="20" font-weight="800" fill="#23495d">Schule</text><path d="${selected===0?'M188 116L350 185 513 242':'M188 116L188 306 513 306 513 242'}" fill="none" stroke="${selected===0?'#ca6952':'#168776'}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="15 8"/><rect x="490" y="284" width="52" height="8" fill="#fefefe"/><text x="325" y="49" text-anchor="middle" font-size="19" fill="#244e5b" font-weight="800">${selected===0?'Direktweg: modellhaft kürzer':'Alternativer Weg: geregelte Querung'}</text>`;
 caption='Erfundenes Verkehrsmodell – keine reale Straßenempfehlung';
}else if(type==='camera'){
 const camera=sc<0?g10.camera:sc===0?'oblique':'top',alt=sc<0?g10.altitude:sc===2?3:2,zoom=1+(3-alt)*.34;
 let blocks=`<g transform="translate(350 169) scale(${zoom}) translate(-350 -169)"><rect x="122" y="64" width="464" height="202" fill="#a6c9a0"/><path d="M120 162H580M343 60V270" stroke="#8d9799" stroke-width="36"/><rect x="154" y="88" width="96" height="59" fill="#ad765c" stroke="#fff" stroke-width="3"/><rect x="396" y="85" width="113" height="60" fill="#b4a16d" stroke="#fff" stroke-width="3"/><rect x="145" y="185" width="119" height="58" fill="#c28d7d" stroke="#fff" stroke-width="3"/><rect x="406" y="191" width="97" height="57" fill="#c19d77" stroke="#fff" stroke-width="3"/></g>`;
 if(camera==='oblique')blocks=`<g transform="translate(38,42) skewX(-13) scale(.94,.72)">${blocks}</g><path d="M145 226L210 266 211 204 146 170Z" fill="#a16650"/><path d="M393 221L460 263 461 199 395 170Z" fill="#8f755a"/>`;
 content=`<rect width="700" height="360" rx="20" fill="#cfebfa"/><path d="M75 310H630" stroke="#789f86" stroke-width="9"/>${blocks}<text x="350" y="34" text-anchor="middle" font-size="22" font-weight="800" fill="#21556b">${camera==='top'?'Senkrecht: Blick von oben':'Schräg: Gebäude räumlich erkennbar'}</text>`;
 caption=`Fiktives Aufnahme-Modell · relative Flughöhe: ${alt}`;
}else if(type==='maptypes'){
 const mode=sc<0?g10.maptype:['topo','physical','theme'][sc]||'topo';
 content=`<rect x="78" y="33" width="544" height="276" rx="10" fill="${mode==='physical'?'#ece2bd':'#dfebd5'}" stroke="#769f9a" stroke-width="3"/><path d="M110 284Q228 115 337 207T585 91" fill="none" stroke="#68b1d2" stroke-width="29"/>${mode==='topo'?`<path d="M99 91L556 270 M146 272L542 74" stroke="#fff1c7" stroke-width="18" fill="none"/><path d="M99 91L556 270 M146 272L542 74" stroke="#bb9878" stroke-width="2" fill="none"/><g fill="#cc8469"><rect x="170" y="112" width="55" height="40"/><rect x="390" y="199" width="58" height="30"/></g><path d="M350 38V55" stroke="#22485a" stroke-width="5"/><text x="350" y="30" fill="#22485a" font-size="19">N</text>`:mode==='physical'?`<path d="M90 160L194 67 265 155L333 93 425 200 493 97 622 214V299H90Z" fill="#b6c881" opacity=".85"/><path d="M115 160L194 67 265 155L333 93 425 200 493 97 580 187" fill="none" stroke="#937256" stroke-width="7"/><path d="M151 125L194 67 245 128 M306 128L333 93 365 131" fill="#f7faf6" stroke="#f7faf6" stroke-width="10"/>`:`<g fill="#428e5b"><rect x="120" y="65" width="124" height="91"/><rect x="278" y="104" width="93" height="115"/><rect x="476" y="163" width="121" height="102"/></g><g fill="#88bf84"><rect x="140" y="225" width="118" height="57"/><rect x="397" y="78" width="91" height="71"/></g>`}<rect x="433" y="41" width="160" height="40" fill="#fffaf0" rx="8"/><text x="512" y="68" text-anchor="middle" font-size="18" fill="#1b4861" font-weight="800">${mode==='topo'?'Topografisch':mode==='physical'?'Physisch':'Thematisch'}</text>`;
 caption=mode==='topo'?'Wege, Siedlungen, Gewässer und Gelände':mode==='physical'?'Relief und Höhenstufen im Mittelpunkt':'Beispiel: Verteilung von Waldflächen';
}else if(type==='atlasgrid'){
const target='C3';const chosen=sc<0?g10.square:sc===2?'C3':'';
content=`<rect x="137" y="28" width="427" height="284" fill="#e7eddd" stroke="#376c7b" stroke-width="4" rx="9"/><text x="350" y="54" text-anchor="middle" font-size="19" fill="#173b50" font-weight="800">Atlas: Seite 24 · Planquadrat ${target}</text>`;
for(let c=0;c<4;c++){content+=`<text x="${240+c*75}" y="90" font-size="20" text-anchor="middle" fill="#214b5d" font-weight="800">${'ABCD'[c]}</text>`;for(let r=0;r<4;r++){if(c===0)content+=`<text x="161" y="${131+r*43}" font-size="20" fill="#214b5d">${r+1}</text>`;let x=203+c*75,y=100+r*43;content+=`<rect x="${x}" y="${y}" width="74" height="42" fill="${chosen==='ABCD'[c]+(r+1)?'#f5bd55':(c+r)%2?'#d1e2d0':'#ecf1e3'}" stroke="#659ca3" stroke-width="1.5"/>`}}
caption='Planquadrat: Spalte (Buchstabe), dann Zeile (Zahl)';
}else if(type==='water'){
const mode=sc<0?g10.water:sc===0?'split':sc===1?'land':'ocean';
content=`<circle cx="350" cy="170" r="125" fill="#3b8dbb" stroke="#d6f0fc" stroke-width="6"/><path d="M${mode==='land'?250:mode==='ocean'?320:279} 84Q350 20 400 80L382 142 459 200 405 265 295 247 267 183Z" fill="#82b987"/><path d="M310 199L339 173 362 221 333 269Z" fill="#abd198"/><circle cx="350" cy="170" r="126" fill="none" stroke="#467b9b" stroke-width="3"/><rect x="116" y="305" width="468" height="19" rx="8" fill="#85b988"/><rect x="116" y="305" width="332" height="19" rx="8" fill="#4298c6"/><text x="350" y="34" text-anchor="middle" font-size="22" font-weight="800" fill="#194a60">Wasser 71 % · Land 29 %</text>`;
caption=mode==='land'?'Blick auf die Landflächen – schematisches Modell':mode==='ocean'?'Blick auf die Ozeane – schematisches Modell':'Wasserplanet – Flächenanteile in der Leiste';
}else if(type==='sketch'){
 const paints=g10.painting;const bg=['#e5ede0','#e9eadf'];
 content=`<text x="350" y="30" text-anchor="middle" font-size="20" fill="#235368" font-weight="800">Gustavs selbst gezeichnete Kartenskizze</text>`;
 for(let r=0;r<4;r++)for(let c=0;c<6;c++){let x=95+c*84,y=52+r*61;let val=paints.find(e=>e.r===r&&e.c===c)?.type||'';let color={forest:'#8cbe85',river:'#8bc4de',road:'#d8c194',school:'#f5ab83',park:'#a6d59c'}[val]||'#fff9e9';let icon={forest:'🌲',river:'≈',road:'━━',school:'🏫',park:'🌳'}[val]||'';content+=`<rect x="${x}" y="${y}" width="80" height="57" fill="${color}" stroke="#afbfbb" stroke-width="2" rx="3"/><text x="${x+40}" y="${y+37}" font-size="24" text-anchor="middle" fill="#295a6c">${icon}</text>`}
content+=`<path d="M640 50V87M640 50l-10 14M640 50l10 14" stroke="#214b5b" stroke-width="3"/><text x="640" y="43" text-anchor="middle" font-size="18" font-weight="800" fill="#214b5b">N</text>`;
caption='Fiktiver Ort · eigene Zeichen · keine maßstabsgetreue Karte';
}
return g10Base(content,caption);
}
const g10OriginalGraphic=g9SceneGraphic;
g9SceneGraphic=function(m){return G10_KINDS.has(m.kind)?g10SceneGraphic(m):g10OriginalGraphic(m)};
function g10Grid(){let s='<div class="g10-paint-board" role="group" aria-label="Eigene Kartenskizze: Kästchen auswählen">';for(let r=0;r<4;r++)for(let c=0;c<6;c++){const val=g10.painting.find(e=>e.r===r&&e.c===c)?.type||'';let icon={forest:'🌲',river:'💧',road:'━',school:'🏫',park:'🌳'}[val]||'＋';s+=`<button type="button" data-g10="paint:${r},${c}" aria-label="Feld ${c+1} der Zeile ${r+1}: ${val||'leer'}" class="g10-cell g10-${val||'blank'}">${icon}</button>`}return s+'</div>'}
function g10Experiment(m){let text='',controls='',caption='Forschen';switch(m.experiment){
case'geofocus':
 controls=`<p>Wähle eine Forschungsbrille. Gustav markiert, was untersucht wird.</p><div class="g10-actions">${g10Options([['nature','🌿 Natur'],['human','🏘️ Mensch'],['both','🔎 Beides']],g10.focus,'focus')}</div>`;
 text=g10.focus==='nature'?'Was hat die Natur geschaffen? Dünen, Wasser und Wetter gehören zu den natürlichen Faktoren.':g10.focus==='human'?'Was gestalten Menschen? Straßen, Häuser und Hafen sind Formen menschlicher Raumnutzung.':'Beide Bereiche wirken zusammen: Menschen reagieren zum Beispiel mit Deichen auf Hochwasser.';break;
case'route':
 controls=`<p>Vergleiche zwei erfundene Wege zur Schule.</p><div class="g10-actions">${g10Options([['0','Direkter Weg'],['1','Weg über Querung']],String(g10.route),'route')}</div>`;
 text=g10.route===0?'Der Direktweg ist im Modell kürzer, die Querung jedoch weniger gut geregelt. Welche Frage würdest du vor Ort klären?':'Der zweite Weg macht einen Umweg zu einer geregelten Querung. Überlege, warum das eine sinnvolle Entscheidung sein kann.';break;
case'camera':
 controls=`<div class="g10-actions">${g10Options([['top','Senkrechtblick'],['oblique','Schrägblick']],g10.camera,'camera')}</div><label for="g10alt">Relative Flughöhe: ${g10.altitude}</label><input id="g10alt" type="range" data-g10range="altitude" min="1" max="3" step="1" value="${g10.altitude}">`;
 text='Beobachte Dächer, Fassaden und die scheinbare Größe kleiner Gegenstände bei unterschiedlicher Flughöhe.';break;
case'maptypes':
 controls=`<p>Stelle für dasselbe erfundene Gebiet drei Kartenarten ein:</p><div class="g10-actions">${g10Options([['topo','Topografisch'],['physical','Physisch'],['theme','Thematisch']],g10.maptype,'maptype')}</div>`;
 text=({topo:'Topografisch: für die Orientierung mit Siedlungen, Wegen und Gewässern.',physical:'Physisch: Relief, Höhenstufen und Geländeformen stehen im Vordergrund.',theme:'Thematisch: hier steht die Verteilung der Waldflächen im Vordergrund.'})[g10.maptype];break;
case'atlasgrid':
 controls=`<p><b>Gustavs Auftrag:</b> Finde Planquadrat C3. Tippe auf das passende Feld.</p><div class="g10-atlas-grid"><span></span>${['A','B','C','D'].map(x=>`<b>${x}</b>`).join('')}${[1,2,3,4].map(r=>`<b>${r}</b>${['A','B','C','D'].map(c=>`<button type="button" data-g10="square:${c+r}" class="${g10.square===c+r?(g10.square==='C3'?'correct':'incorrect'):''}" aria-label="Planquadrat ${c+r}">${g10.square===c+r?'●':''}</button>`).join('')}`).join('')}</div>`;
 text=g10.square?(g10.square==='C3'?'Richtig! Spalte C und Zeile 3 treffen sich hier.':'Das ist '+g10.square+'. Prüfe erst die Spalte C oben, dann die Zeile 3 links.'):'Ein Registerhinweis besteht meist aus Kartenseite und Planquadrat. Beginne bei der Spaltenbeschriftung.';break;
case'water':
 controls=`<div class="g10-actions">${g10Options([['split','Land/Wasser'],['land','Landansicht'],['ocean','Ozeanansicht']],g10.water,'water')}</div>`;
 text='Fast drei Viertel der Erdoberfläche sind Wasser. Das Erdkugelbild ist eine symbolische Grafik und bildet die Küstenformen nicht maßstäblich ab.';break;
case'sketch':
 controls=`<p>Wähle ein Kartenzeichen und tippe danach in ein Kästchen. Mit „Rückgängig“ kannst du etwas korrigieren.</p><div class="g10-actions">${g10Options([['road','Straße'],['forest','Wald'],['river','Gewässer'],['school','Schule'],['park','Park']],g10.tool,'tool')}</div>${g10Grid()}<div class="g10-actions"><button type="button" class="g9-btn light" data-g10="sketchUndo">↩️ Rückgängig</button><button type="button" class="g9-btn light" data-g10="sketchReset">Neu beginnen</button></div><p class="g10-legend"><b>Legende:</b> Straße ━ · Wald 🌲 · Gewässer 💧 · Schule 🏫 · Park 🌳</p>`;
 text='Zeichne zuerst einen Weg, dann weitere Merkmale. Gib deiner Skizze einen Titel und erkläre die Zeichen in der Legende.';break;
}
return `<section class="card g9-experiment g10-experiment"><span class="g9-tag">🔬 Gustav forscht mit dir</span><h2>${g10Safe(m.name)}: Versuch</h2><p><b>Vermute:</b> Was verändert sich? Wähle mindestens zwei Einstellungen, bevor du dein Ergebnis festhältst.</p><div class="g9-drawing" id="g9-drawing">${g10SceneGraphic(m)}</div><div class="g9-controls">${controls}</div><p id="g10-observation" class="g10-insight" role="status">${g10Safe(text)}</p><div class="g10-actions">${g9Button(g9.obs?'Beobachtung gespeichert ✓':'Beobachtung speichern','observe','primary')}${g9Button('Zum Lernlabor','lab','light')}</div></section>`
}
const g10OriginalExperiment=g9Experiment;
g9Experiment=function(m){return G10_KINDS.has(m.kind)?g10Experiment(m):g10OriginalExperiment(m)};
const g10OriginalWrongWhy=g9WrongWhy;
g9WrongWhy=function(q,selected){let guidance={geographie:'Unterscheide natürliche Prozesse von der menschlichen Nutzung eines Raumes. Manche Beispiele zeigen die Wechselwirkung beider Bereiche.',wege:'Achte auf Start, Ziel, Richtung und sichere Überquerungen. Der kürzeste Weg muss nicht automatisch der geeignetste sein.',luftbild:'Frage, ob die Kamera senkrecht nach unten oder schräg schaut. Mit steigender Flughöhe werden kleine Objekte schwerer erkennbar.',kartenarten:'Eine physische Karte zeigt Relief, eine topografische mehrere Geländeobjekte und eine thematische ein ausgewähltes Thema.',atlanten:'Im Atlasregister steht die Kartenseite und das Planquadrat. Finde die Buchstabenspalte und dann die Zahlenzeile.',erde:'Rund 71 % der Erdoberfläche sind Wasser. Beim Zählen der Kontinente verwendet dieses Schulbuch sieben.',skizzen:'Eine Kartenskizze zeigt eine sinnvolle Auswahl: passende Zeichen, Titel, Nordpfeil und verständliche Legende.'};return guidance[q.topic]||g10OriginalWrongWhy(q,selected)};
const g10OriginalOverview=g9Overview;
g9Overview=function(){const n=G9_MISSIONS.length;return g10OriginalOverview().replace('10 Comic-Abenteuer',`${n} Comic-Abenteuer`).replace('von 10 Missionen',`von ${n} Missionen`)};
const g10OriginalStart=renderStart;
renderStart=function(){return g10OriginalStart().replace('Neu: Zehn Comic-Abenteuer','Neu: Siebzehn Comic-Abenteuer')};
const g10OriginalGames=renderGames;
renderGames=function(){return g10OriginalGames().replace('10 geografische Missionen',`${G9_MISSIONS.length} geografische Missionen`)};
const g10OriginalQuiz=g9Quiz;
g9Quiz=function(){const html=g10OriginalQuiz();if(g9.phase!=='quiz'||!g9.answered||g9.guesses[g9.qi]===g9.quiz[g9.qi].answer)return html;const m=g9M();return html+`<details class="g10-diagnostic"><summary>👀 Gustav zeigt die passende Anschauung</summary><div class="g10-diagnostic-body"><div>${g9SceneGraphic(m)}</div><div><h3>So kannst du den Fehler selbst überprüfen</h3><ol><li>Lies die Frage erneut und achte auf das entscheidende Fachwort.</li><li>Vergleiche das Beispiel mit der Regel: ${g10Safe(m.simple)}</li><li>Prüfe, warum die richtige Antwort zur Darstellung passt.</li></ol></div></div></details>`};
const g10OriginalRun=g9Run;
g9Run=function(cmd){if(cmd.startsWith('open:')){g10.square='';g10.message='';g10.painting=[];g10.history=[];g10.focus='both';g10.route=1;g10.camera='top';g10.altitude=2;g10.maptype='topo';g10.water='split';g10.tool='school';}g10OriginalRun(cmd)};
function g10Act(command){let [a,b]=command.split(':');if(a==='focus')g10.focus=['nature','human','both'].includes(b)?b:'both';
else if(a==='route')g10.route=Number(b)===0?0:1;
else if(a==='camera')g10.camera=b==='oblique'?'oblique':'top';
else if(a==='maptype')g10.maptype=['topo','physical','theme'].includes(b)?b:'topo';
else if(a==='square')g10.square=b;
else if(a==='water')g10.water=['split','land','ocean'].includes(b)?b:'split';
else if(a==='tool')g10.tool=['school','road','forest','river','park'].includes(b)?b:'school';
else if(a==='paint') {let [r,c]=b.split(',').map(Number);if(Number.isInteger(r)&&Number.isInteger(c)&&r>=0&&r<4&&c>=0&&c<6){g10.history.push(g10.painting.map(z=>({...z})));g10.painting=g10.painting.filter(e=>e.r!==r||e.c!==c);g10.painting.push({r,c,type:g10.tool});}}
else if(a==='sketchUndo')g10.painting=g10.history.pop()||[];
else if(a==='sketchReset'){g10.history.push(g10.painting.map(z=>({...z})));g10.painting=[];}
render();}
document.addEventListener('click',e=>{let el=e.target.closest('[data-g10]');if(!el)return;e.preventDefault();e.stopPropagation();g10Act(el.dataset.g10);},true);
MAIN.addEventListener('input',e=>{if(e.target.dataset.g10range!=='altitude')return;g10.altitude=Number(e.target.value);let draw=document.querySelector('#g9-drawing');if(draw)draw.innerHTML=g10SceneGraphic(g9M());let lab=e.target.closest('.g9-controls');if(lab){let txt=lab.querySelector('label[for="g10alt"]');if(txt)txt.textContent='Relative Flughöhe: '+g10.altitude;}});
MAIN.addEventListener('change',e=>{if(e.target.dataset.g10range==='altitude')render()});
render();
