(function(){
'use strict';
// Interaktive Extras: Eis-Heizkurve (Siedetemperatur-Seite), Aggregatzustands-Sortierspiel (Stoffe-Seite), weitere Stoffe im Löseversuch (Löslichkeit-Seite).
const el=id=>document.getElementById(id);

/* ---------- 1) Eiswürfel erhitzen: komplette Heizkurve mit Zustandsbereichen ---------- */
(function(){
const page=el('page-heating');if(!page)return;
// Kurve: Zeit 0..10 (Modellschritte), Temperatur -20..110. Zonen: fest / schmilzt / flüssig / siedet / gasförmig
const X=t=>60+t*56, Y=T=>250-(T+20)*(210/130);
const seg=[[0,1.4,'fest','Eis: Die Teilchen sitzen auf festen Plätzen und schwingen nur.'],
 [1.4,3.2,'schmilzt','Schmelzen bei ≈ 0 °C: fest und flüssig zugleich. Die Temperatur bleibt stehen – die Energie löst die Teilchen aus dem Gitter.'],
 [3.2,6.8,'flüssig','Wasser: Die Teilchen gleiten aneinander vorbei. Die Temperatur steigt beim Erwärmen.'],
 [6.8,9,'siedet','Sieden bei ≈ 100 °C: Dampfblasen im Inneren. Die Temperatur bleibt wieder stehen – die Energie macht aus Wasser Wasserdampf.'],
 [9,10,'gasförmig','Wasserdampf: Die Teilchen fliegen frei und schnell durch den Raum.']];
function curveT(t){if(t<=1.4)return -20+t*(20/1.4);if(t<=3.2)return 0;if(t<=6.8)return (t-3.2)*(100/3.6);if(t<=9)return 100;return 100+(t-9)*10}
function curvePath(){let d='M'+X(0)+' '+Y(-20);for(let t=0;t<=10.001;t+=.1)d+='L'+X(t).toFixed(1)+' '+Y(curveT(t)).toFixed(1);return d}
const zonesSvg=seg.map(([a,b,label],i)=>`<g class="ice-zone" data-icezone="${i}" role="button" tabindex="0" aria-label="Abschnitt ${label} erklären"><rect x="${X(a)}" y="38" width="${X(b)-X(a)}" height="232" fill="transparent"/><text x="${(X(a)+X(b))/2}" y="${i%2?76:286}" text-anchor="middle" class="ice-lab">${label}</text></g>`).join('');
const html=`<section class="panel ice-panel" aria-labelledby="iceTitle"><span class="pill">Vom Eiswürfel zum Wasserdampf</span><h3 id="iceTitle">🧊 Eiswürfel erhitzen – die ganze Heizkurve</h3>
<p>Starte das virtuelle Erhitzen und verfolge die Kurve live. <b>Tippe die Abschnitte an</b> („fest“, „schmilzt“ …), um zu sehen, was mit den Teilchen passiert – und warum die Kurve zweimal stehen bleibt.</p>
<div class="ice-grid"><svg viewBox="0 0 640 305" class="ice-svg" role="img" aria-label="Heizkurve von Eis bei minus 20 Grad bis Wasserdampf über 100 Grad mit zwei waagerechten Abschnitten beim Schmelzen und Sieden">
<path d="M${X(0)} ${Y(110)}V${Y(-20)}H${X(10)}" stroke="#37474f" stroke-width="2.5" fill="none"/>
<g class="ice-ticks">${[-20,0,20,100].map(T=>`<path d="M${X(0)-5} ${Y(T)}h5" stroke="#37474f"/><text x="${X(0)-9}" y="${Y(T)+4}" text-anchor="end">${T}</text>`).join('')}<text x="18" y="34">°C</text><text x="${X(10)-4}" y="${Y(-20)-8}" text-anchor="end">Zeit →</text></g>
<path d="M${X(0)} ${Y(0)}H${X(10)}" class="ice-guide"/><path d="M${X(0)} ${Y(100)}H${X(10)}" class="ice-guide"/>
<path d="${curvePath()}" class="ice-curve" id="iceCurve"/>${zonesSvg}
<circle id="iceMarker" cx="${X(0)}" cy="${Y(-20)}" r="8" class="ice-marker"/></svg>
<div class="ice-side"><div class="ice-part" id="icePart" aria-hidden="true"></div><div class="ice-read"><span>Temperatur <b id="iceTemp">−20 °C</b></span><span>Zustand <b id="iceState">fest</b></span></div></div></div>
<div class="btn-row"><button type="button" class="btn primary" id="icePlay">▶ Eiswürfel erhitzen</button><button type="button" class="btn" id="iceReset">↺ Zurück zum Start</button></div>
<p class="feedback" id="iceText" aria-live="polite">Noch ist alles gefroren: −20 °C kaltes Eis. Starte das Erhitzen oder tippe einen Kurvenabschnitt an.</p></section>`;
const anchor=el('boilCompare');if(anchor)anchor.insertAdjacentHTML('afterend',html);else page.insertAdjacentHTML('beforeend',html);
let iceT=0,iceTimer=null;
function partSvg(zone){ // Teilchenbild je Zustand
 const dot=(x,y,cls='')=>`<circle cx="${x}" cy="${y}" r="7" class="ice-dot ${cls}"/>`;let body='';
 if(zone===0){for(let r=0;r<3;r++)for(let c=0;c<4;c++)body+=dot(28+c*30,24+r*30,'vib')}
 else if(zone===1){for(let r=0;r<3;r++)for(let c=0;c<2;c++)body+=dot(24+c*30,24+r*30,'vib');body+=dot(104,30,'slide')+dot(126,58,'slide')+dot(100,86,'slide')+dot(130,98,'slide')}
 else if(zone===2){body=dot(30,80,'slide')+dot(60,95,'slide')+dot(95,78,'slide')+dot(120,96,'slide')+dot(45,55,'slide')+dot(85,50,'slide')+dot(115,60,'slide')}
 else if(zone===3){body=dot(30,88,'slide')+dot(62,95,'slide')+dot(98,85,'slide')+dot(45,60,'slide')+dot(90,55,'slide')+'<circle cx="70" cy="75" r="12" class="ice-bub"/><circle cx="110" cy="40" r="9" class="ice-bub"/>'+dot(120,20,'fly')}
 else{body=dot(25,30,'fly')+dot(95,20,'fly')+dot(130,70,'fly')+dot(55,85,'fly')+dot(110,105,'fly')}
 return `<svg viewBox="0 0 150 120"><rect x="2" y="2" width="146" height="116" rx="10" fill="#eef7fa" stroke="#9db7c0"/>${body}</svg>`}
function setZone(i,explain){const [a,b,label,txt]=seg[i];el('icePart').innerHTML=partSvg(i);el('iceState').textContent=label;
 if(explain){el('iceText').textContent=txt;el('iceText').className='feedback good'}}
function zoneAt(t){return seg.findIndex(([a,b])=>t>=a&&t<=b)||0}
function render(){const T=curveT(iceT);el('iceMarker').setAttribute('cx',X(iceT));el('iceMarker').setAttribute('cy',Y(T));
 el('iceTemp').textContent=(T<0?'−':'')+Math.abs(Math.round(T))+' °C';const z=Math.max(0,zoneAt(iceT));setZone(z,false)}
el('icePlay').addEventListener('click',()=>{if(iceTimer)return;el('iceText').textContent='Beobachte: Bei 0 °C und bei 100 °C bleibt die Temperatur stehen, obwohl weiter geheizt wird!';el('iceText').className='feedback';
 iceTimer=setInterval(()=>{iceT=Math.min(10,iceT+.05);render();if(iceT>=10){clearInterval(iceTimer);iceTimer=null;el('iceText').textContent='Fertig: Aus −20 °C kaltem Eis wurde über 100 °C heißer Wasserdampf. Tippe die Abschnitte an, um die zwei „Pausen“ der Kurve zu verstehen.';el('iceText').className='feedback good'}},60)});
el('iceReset').addEventListener('click',()=>{if(iceTimer){clearInterval(iceTimer);iceTimer=null}iceT=0;render();el('iceText').textContent='Zurück zum Start: −20 °C kaltes Eis.';el('iceText').className='feedback'});
page.querySelectorAll('[data-icezone]').forEach(z=>{const go=()=>{const i=+z.dataset.icezone;iceT=(seg[i][0]+seg[i][1])/2;render();setZone(i,true)};z.addEventListener('click',go);z.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
render();
})();

/* ---------- 2) Aggregatzustände sortieren (Stoffe & Körper) ---------- */
(function(){
const page=el('page-matter');if(!page)return;
const cols=[{k:'solid',t:'fest',p:'Teilchen sitzen auf festen Plätzen und schwingen nur.'},{k:'liquid',t:'flüssig',p:'Teilchen gleiten aneinander vorbei – nimmt jede Gefäßform an.'},{k:'gas',t:'gasförmig',p:'Teilchen fliegen frei und schnell – füllt den ganzen Raum.'}];
const items=[['🧊','Eiswürfel','solid','Eis ist gefrorenes Wasser – fest, bis es schmilzt.'],['🪨','Stein','solid','Ein Stein behält seine Form – typisch fest.'],['🪵','Holzklotz','solid','Holz ist fest: Es behält Form und Volumen.'],['🥛','Milch','liquid','Milch fließt und passt sich dem Gefäß an – flüssig.'],['🧃','Saft','liquid','Saft lässt sich gießen – flüssig.'],['🫒','Speiseöl','liquid','Öl fließt (langsamer als Wasser) – trotzdem flüssig.'],['💨','Luft','gas','Luft füllt jeden Raum vollständig aus – gasförmig.'],['♨️','Wasserdampf','gas','Wasserdampf ist unsichtbares, gasförmiges Wasser.'],['🎈','Gas im Luftballon','gas','Das Gas verteilt sich im ganzen Ballon – gasförmig.']];
const colPart=k=>{const d=(x,y,cls)=>`<circle cx="${x}" cy="${y}" r="5" class="ice-dot ${cls}"/>`;let b='';
 if(k==='solid'){for(let r=0;r<2;r++)for(let c=0;c<3;c++)b+=d(18+c*20,16+r*20,'vib')}
 else if(k==='liquid'){b=d(16,36,'slide')+d(36,28,'slide')+d(56,38,'slide')+d(28,16,'slide')+d(50,18,'slide')}
 else{b=d(14,14,'fly')+d(58,20,'fly')+d(30,40,'fly')+d(64,44,'fly')}
 return `<svg viewBox="0 0 76 54" class="st-part"><rect x="1" y="1" width="74" height="52" rx="8" fill="#eef7fa" stroke="#9db7c0"/>${b}</svg>`};
const html=`<section class="panel st-panel" aria-labelledby="stTitle"><span class="pill">Teilchenmodell · Sortierspiel</span><h3 id="stTitle">🧊💧💨 Fest, flüssig oder gasförmig?</h3>
<p>Tippe zuerst eine Karte an und dann den passenden Zustand. Die Teilchenbilder zeigen dir, wie sich die Teilchen in jedem Zustand verhalten.</p>
<div class="st-tray" id="stTray" role="group" aria-label="Beispiele zum Sortieren"></div>
<div class="st-cols" id="stCols"></div>
<p class="feedback" id="stFeedback" aria-live="polite">Wähle zuerst eine Karte.</p>
<div class="btn-row"><button type="button" class="btn" id="stReset">↺ Neu sortieren</button><button type="button" class="btn" id="stToParticles">🔬 Teilchen in Bewegung ansehen (Forschercampus)</button></div></section>`;
page.insertAdjacentHTML('beforeend',html);
let stPicked=null,stDone={};
function stRender(){el('stTray').innerHTML=items.map((it,i)=>stDone[i]?'':`<button type="button" class="st-item${stPicked===i?' picked':''}" data-stitem="${i}">${it[0]} ${it[1]}</button>`).join('')||'<p class="v4small">Alle Karten einsortiert! 🎉</p>';
 el('stCols').innerHTML=cols.map(c=>{const got=items.map((it,i)=>stDone[i]&&it[2]===c.k?`<span class="st-chip">${it[0]} ${it[1]}</span>`:'').join('');
  return `<button type="button" class="st-col" data-stcol="${c.k}"><b>${c.t}</b>${colPart(c.k)}<small>${c.p}</small><div class="st-got">${got}</div></button>`}).join('');
 page.querySelectorAll('[data-stitem]').forEach(b=>b.addEventListener('click',()=>{stPicked=stPicked===+b.dataset.stitem?null:+b.dataset.stitem;stRender();stFb(stPicked!==null?`„${items[stPicked][1]}" gewählt. Tippe jetzt fest, flüssig oder gasförmig an.`:'Wähle zuerst eine Karte.')}));
 page.querySelectorAll('[data-stcol]').forEach(b=>b.addEventListener('click',()=>{if(stPicked===null){stFb('Wähle zuerst oben eine Karte aus.');return}
  const it=items[stPicked];
  if(it[2]===b.dataset.stcol){stDone[stPicked]=true;stPicked=null;stRender();stFb('✓ Richtig! '+it[3],true);
   if(Object.keys(stDone).length===items.length){stFb('🎉 Alle 9 Beispiele richtig einsortiert! Merke: Der Zustand hängt davon ab, wie sich die Teilchen bewegen – nicht davon, wie der Stoff heißt.',true);window.LernCockpit?.record({id:'chem-state-sort',topic:'matter',correct:true,assisted:false,mode:'spiel',skill:'wissen'})}}
  else{const right=cols.find(c=>c.k===it[2]);stFb(`Noch nicht. ${it[3]} Es gehört also zu „${right.t}“.`,false)}}))}
function stFb(t,ok){const f=el('stFeedback');f.textContent=t;f.className='feedback'+(ok===true?' good':ok===false?' bad':'')}
el('stReset').addEventListener('click',()=>{stPicked=null;stDone={};stRender();stFb('Neu gemischt. Wähle eine Karte.')});
el('stToParticles').addEventListener('click',()=>{if(typeof navigate==='function')navigate('chem6')});
stRender();
})();

/* ---------- 3) Löslichkeit: Sand und Öl testen, gelöst vs. geschmolzen ---------- */
(function(){
const page=el('page-solubility');if(!page)return;
const subs={salt:{n:'Salz',r:'dissolve',t:'Das Salz ist <b>gelöst</b>: Seine Teilchen sind unsichtbar im Wasser verteilt. Es ist noch da – probiere es (nur gedanklich!): Das Wasser schmeckt salzig.'},
 sugar:{n:'Zucker',r:'dissolve',t:'Der Zucker ist <b>gelöst</b> – nicht geschmolzen! Schmelzen braucht Hitze (Zucker schmilzt erst bei ≈ 185 °C). Hier haben Wasserteilchen die Zuckerteilchen umhüllt und verteilt.'},
 sand:{n:'Sand',r:'sediment',t:'Sand <b>löst sich nicht</b>: Seine Teilchen werden vom Wasser nicht umhüllt und verteilt. Er sinkt zu Boden – ein Bodensatz, den man abfiltrieren kann.'},
 oil:{n:'Öl',r:'float',t:'Öl <b>löst sich nicht</b> in Wasser – es schwimmt als Schicht oben, weil es leichter (geringere Dichte) als Wasser ist und sich nicht mit ihm mischt.'}};
const html=`<section class="panel sol-extra" aria-labelledby="solExtraTitle"><span class="pill">Weiter forschen</span><h3 id="solExtraTitle">🏖️ Löst sich alles in Wasser? Teste Sand und Öl!</h3>
<p>Gib virtuell einen Stoff ins Wasser, rühre um und beobachte: <b>gelöst</b>, <b>Bodensatz</b> oder <b>schwimmende Schicht</b>?</p>
<div class="btn-row">${Object.entries(subs).map(([k,s])=>`<button type="button" class="btn" data-solx="${k}">${({salt:'🧂',sugar:'🍬',sand:'🏖️',oil:'🫒'})[k]} ${s.n}</button>`).join('')}</div>
<div class="sol-glass-wrap"><svg viewBox="0 0 220 200" class="sol-glass" role="img" aria-label="Becherglas mit Wasser und Testergebnis"><path d="M50 18h120M56 18v150a14 14 0 0 0 14 14h80a14 14 0 0 0 14-14V18" fill="none" stroke="#36798a" stroke-width="4"/><rect x="60" y="66" width="100" height="112" fill="#bfe4f2" id="solxWater"/><g id="solxResult"></g></svg>
<div class="sol-extra-text"><p class="feedback" id="solxText">Wähle einen Stoff.</p>
<div class="notebox" id="solxMerk" hidden><strong>Gelöst oder geschmolzen?</strong><span>Lösen: Wasserteilchen umhüllen und verteilen die Stoffteilchen (bei Zimmertemperatur). Schmelzen: Ein fester Stoff wird durch <b>Wärme</b> flüssig – ganz ohne Wasser.</span></div></div></div>
<div class="sol-mini" id="solxQuiz"><b>Kurz nachgedacht:</b> Der Zucker im warmen Tee ist …
<button type="button" class="answer" data-solxq="0">geschmolzen</button><button type="button" class="answer" data-solxq="1">gelöst</button>
<span class="feedback" id="solxQF" aria-live="polite"></span></div></section>`;
const anchorQ=page.querySelector('.notebox.warm');if(anchorQ)anchorQ.insertAdjacentHTML('afterend',html);else page.insertAdjacentHTML('beforeend',html);
function solxShow(k){const s=subs[k],g=el('solxResult');el('solxMerk').hidden=k!=='sugar';
 if(s.r==='dissolve')g.innerHTML=Array.from({length:14},(_,i)=>`<circle cx="${70+(i*23)%84}" cy="${80+(i*31)%88}" r="3" fill="${k==='salt'?'#5a8fa8':'#c9962e'}" class="solx-dot"/>`).join('');
 else if(s.r==='sediment')g.innerHTML='<path d="M60 166q50 -14 100 0v12H60Z" fill="#c8a25a"/><circle cx="85" cy="168" r="3" fill="#a87f3d"/><circle cx="120" cy="170" r="3.5" fill="#a87f3d"/><circle cx="145" cy="167" r="3" fill="#a87f3d"/>';
 else g.innerHTML='<rect x="60" y="66" width="100" height="16" fill="#f2cf4c" opacity=".9"/><text x="110" y="78" text-anchor="middle" font-size="10" fill="#7a5c00">Ölschicht</text>';
 el('solxText').innerHTML=s.t;el('solxText').className='feedback good'}
page.querySelectorAll('[data-solx]').forEach(b=>b.addEventListener('click',()=>solxShow(b.dataset.solx)));
page.querySelectorAll('[data-solxq]').forEach(b=>b.addEventListener('click',()=>{const ok=b.dataset.solxq==='1';b.classList.add(ok?'correct':'wrong');
 el('solxQF').textContent=ok?'Richtig! Der Zucker ist gelöst – die Teewärme hat nur das Lösen beschleunigt. Geschmolzen wäre er erst bei ≈ 185 °C ganz ohne Wasser.':'Nicht ganz: Schmelzen passiert durch Hitze ohne Wasser. Im Tee wird der Zucker von Wasserteilchen umhüllt und verteilt – er ist gelöst.';
 el('solxQF').className='feedback '+(ok?'good':'bad')}));
})();
})();
