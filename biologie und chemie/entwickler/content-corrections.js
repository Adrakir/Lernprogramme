
(function(){
'use strict';
const glassItem=matterQuestions.find(q=>q[0]==='Glas');
if(glassItem){glassItem[0]='Glas (Material)';glassItem[2]='Glas ist ein Werkstoff. Ein Trinkglas oder eine Fensterscheibe wäre dagegen ein Körper aus diesem Stoff.'}
matterQuestions.push(
 ['Trinkglas','Körper','Ein bestimmtes Trinkglas ist ein Gegenstand. Es kann aus dem Stoff Glas bestehen.'],
 ['Plastikflasche','Körper','Die Flasche ist ein Gegenstand; sie besteht aus einem Kunststoff.'],
 ['Kunststoff','Stoff','Kunststoff bezeichnet das Material, aus dem zum Beispiel eine Flasche hergestellt wird.'],
 ['Eisennagel','Körper','Ein einzelner Nagel ist ein Gegenstand. Er kann aus dem Stoff Eisen bestehen.'],
 ['Aluminiumfolie','Körper','Ein Stück Folie ist ein Körper aus dem Stoff Aluminium.'],
 ['Kochsalz','Stoff','Kochsalz ist ein Stoff. Ein Salzkorn oder ein Salzhaufen ist ein Körper aus diesem Stoff.'],
 ['Salzkorn','Körper','Ein einzelnes Salzkorn ist ein kleiner Körper aus Kochsalz.'],
 ['Kupferdraht','Körper','Der Draht ist ein geformter Körper aus dem Stoff Kupfer.'],
 ['Kupfer','Stoff','Kupfer ist ein Stoff; daraus können unterschiedliche Gegenstände hergestellt werden.']
);
const originalIconForMatter=iconForMatter;
iconForMatter=function(item){if(item==='Glas (Material)'||item==='Glas'){return `<svg viewBox="0 0 180 130" role="img" aria-label="Materialprobe aus Glas, keine Glasware" style="display:block;width:100%;max-width:230px;height:118px;margin:auto"><rect x="8" y="8" width="164" height="114" rx="16" fill="#eef8f8"/><path d="M37 89L56 34L79 70L101 25L133 91Z" fill="#c8eff2" fill-opacity=".72" stroke="#4b9eac" stroke-width="4" stroke-linejoin="round"/><path d="M59 48L72 68M104 39L119 73M47 88H128" stroke="#fff" stroke-width="5" stroke-linecap="round"/><text x="90" y="112" text-anchor="middle" fill="#276975" font-size="13" font-weight="700">Material: Glas</text></svg>`}return originalIconForMatter(item)};
const originalRenderMatter=renderMatter;
renderMatter=function(){originalRenderMatter();const context=$('matterContext');if(context&&state.matter.i<currentMatterList.length)context.textContent='Ist das hier ein Gegenstand (Körper) oder ein Material (Stoff)?';};
const extraQuiz=[
 {topic:'Stoffe & Körper',q:'Was ist mit „Glas“ in dieser Aufgabe gemeint?',options:['Der Werkstoff, aus dem zum Beispiel ein Trinkglas besteht','Immer ein Trinkgefäß','Ein Gasbrenner','Ein bestimmtes Fenster'],correct:0,ex:'Hier ist Glas der Stoff bzw. Werkstoff. Ein Trinkglas oder eine Scheibe wäre ein Körper aus Glas.'},
 {topic:'Stoffe & Körper',q:'Ein Trinkglas besteht aus Glas. Was ist der Körper?',options:['Das Trinkglas','Der Stoff Glas','Die Farbe','Die Temperatur'],correct:0,ex:'Das Trinkglas ist ein konkreter Gegenstand (Körper); Glas ist das Material (Stoff).'},
 {topic:'Stoffe & Körper',q:'Welche Reihe nennt nur Stoffe?',options:['Kupfer, Glas, Wasser','Kupferdraht, Trinkglas, Regentropfen','Fenster, Zeitung, Nagel','Tasse, Löffel, Flasche'],correct:0,ex:'Kupfer, Glas und Wasser bezeichnen Stoffe. Die anderen Beispiele sind Gegenstände oder Körper.'},
 {topic:'Stoffe & Körper',q:'Eine Schultasche besteht aus Kunststoff. Was ist Kunststoff?',options:['Der Stoff bzw. das Material','Die Schultasche als Gegenstand','Ein Laborgerät','Ein Volumenmaß'],correct:0,ex:'Die Tasche ist der Körper; Kunststoff bezeichnet hier ihr Material.'},
 {topic:'Siedetemperatur',q:'Bei welcher Temperatur siedet Ethanol (Trinkalkohol) ungefähr bei normalem Luftdruck?',options:['20 °C','78 °C','100 °C','150 °C'],correct:1,ex:'Reines Ethanol siedet bei Normaldruck bei ungefähr 78 °C. „Alkohol“ ist hier konkret Ethanol; andere Alkohole können andere Siedepunkte haben.'},
 {topic:'Siedetemperatur',q:'Was ist beim Erhitzen von Ethanol besonders wichtig?',options:['Ethanol ist leicht entzündlich; im Unterricht nur nach Anweisung und nicht direkt über einer offenen Flamme erhitzen.','Ethanol kann man gefahrlos probieren.','Ethanol siedet immer bei 100 °C.','Ein geschlossenes Gefäß ist sicherer.'],correct:0,ex:'Ethanol ist leicht entzündlich. Im Unterricht gelten die Anweisungen der Lehrkraft; es darf nicht unüberlegt mit offener Flamme erhitzt werden.'},
 {topic:'Experimente',q:'Was ist eine Beobachtung und keine Deutung?',options:['Das Thermometer zeigt 78 °C.','Der Stoff ist bestimmt Ethanol.','Die Probe ist sicher rein.','Der Messfehler erklärt alles.'],correct:0,ex:'Ein abgelesener Messwert ist eine Beobachtung. Die anderen Aussagen sind Schlussfolgerungen oder Vermutungen.'}
];
quizBank.push(...extraQuiz);
const heatingPage=document.getElementById('page-heating');
if(heatingPage)heatingPage.insertAdjacentHTML('beforeend',`<section class="panel alcohol-boiling" aria-labelledby="alcoholBoilingTitle"><span class="pill">Stoffvergleich · Normaldruck</span><h3 id="alcoholBoilingTitle">Wasser und Ethanol: unterschiedliche Siedetemperaturen</h3><p>Reines <b>Ethanol</b> (der Alkohol in alkoholischen Getränken) siedet bei etwa <b>78 °C</b>. Reines Wasser siedet bei etwa <b>100 °C</b>. Der Siedepunkt gehört zu einem bestimmten Stoff und hängt auch vom Luftdruck ab.</p><div class="boiling-comparison" role="img" aria-label="Vergleich der Siedetemperaturen: Ethanol ungefähr 78 Grad Celsius, Wasser ungefähr 100 Grad Celsius"><div><b>Ethanol</b><span class="boiling-bar ethanol-bar"></span><strong>ca. 78 °C</strong></div><div><b>Wasser</b><span class="boiling-bar water-bar"></span><strong>ca. 100 °C</strong></div></div><div class="notebox alert"><strong>Sicherheit:</strong> Ethanol ist leicht entzündlich. Die App zeigt nur Fachwissen; im Unterricht niemals ohne Anweisung der Lehrkraft erhitzen.</div></section>`);

const burnerStage=document.getElementById('page-burner');
if(burnerStage){
 const controls=burnerStage.querySelector('.sim-layout');
 controls.insertAdjacentHTML('beforeend',`<section class="panel virtual-burner" aria-labelledby="virtualBurnerTitle"><h3 id="virtualBurnerTitle">🧪 Virtuellen Bunsenbrenner bedienen</h3><p>Übe die Reihenfolge nur in dieser Simulation. Ein echter Gasbrenner darf ausschließlich mit Freigabe und Aufsicht der Lehrkraft benutzt werden.</p><div class="virtual-burner-workspace"><svg viewBox="0 0 300 210" class="virtual-burner-svg" role="img" aria-label="Modell eines Bunsenbrenners, dessen Flamme virtuell ein- und ausgeschaltet werden kann"><rect x="8" y="8" width="284" height="194" rx="18" fill="#f2f8fa"/><path d="M24 172H276" stroke="#b6cbd0" stroke-width="3"/><g id="virtualBurnerFlame" class="virtual-flame" aria-hidden="true"><path d="M132 119Q99 81 143 28Q144 74 161 117Q151 136 132 119Z" fill="#f1a536"/><path class="virtual-inner-flame" d="M139 118Q126 92 145 60Q145 91 153 117Q147 128 139 118Z" fill="#fff2a3"/></g><path d="M132 124V165H166V124Z" fill="#829ba9" stroke="#476978" stroke-width="4"/><ellipse cx="149" cy="169" rx="59" ry="14" fill="#728c98" stroke="#4b6875" stroke-width="4"/><rect x="133" y="139" width="34" height="16" rx="4" fill="#a2b8bf" stroke="#536e79" stroke-width="2"/><path d="M166 147H223" stroke="#607981" stroke-width="9" stroke-linecap="round"/><circle cx="224" cy="147" r="10" fill="#91a8b2" stroke="#526e7b" stroke-width="3"/><text x="20" y="190" font-size="11" fill="#49717a">Nur ein virtuelles Lernmodell</text></svg><div class="virtual-burner-controls"><ol><li id="virtualStepConnect">Schlauch anschließen</li><li id="virtualStepIgnite">Virtuell zünden</li><li id="virtualStepAir">Luftzufuhr und Flamme einstellen</li><li id="virtualStepOff">Gas schließen und ausschalten</li></ol><div class="btn-row"><button type="button" class="btn secondary" id="virtualConnect">1 · Virtuell anschließen</button><button type="button" class="btn primary" id="virtualIgnite" disabled>2 · Virtuell zünden</button><button type="button" class="btn secondary" id="virtualAir" disabled>Luftzufuhr öffnen</button><button type="button" class="btn warn" id="virtualOff" disabled>4 · Ausschalten</button></div><label for="virtualFlameHeight">Flammenhöhe einstellen</label><input id="virtualFlameHeight" type="range" min="1" max="5" value="3" disabled><p id="virtualBurnerStatus" class="feedback" role="status" aria-live="polite">Schritt 1: Verbinde den Brenner im Modell, bevor du ihn virtuell zündest.</p></div></div></section>`);
 const virtualBurner={connected:false,lit:false,airOpen:false};
 const v=$=>document.getElementById($);
 const virtualHose=controls.querySelector('.virtual-burner-svg path[d="M166 147H223"]');
 if(virtualHose){virtualHose.id='virtualBurnerHose';virtualHose.setAttribute('d','M166 147H197 M215 147H223');virtualHose.setAttribute('stroke-dasharray','4 4')}
 function updateVirtualBurner(message){const flame=v('virtualBurnerFlame'),height=Number(v('virtualFlameHeight').value);flame.style.opacity=virtualBurner.lit?'1':'0';flame.style.transform=`scaleY(${.65+height*.16})`;flame.classList.toggle('blue',virtualBurner.airOpen);v('virtualConnect').disabled=virtualBurner.connected;v('virtualConnect').textContent=virtualBurner.connected?'✓ Schlauch angeschlossen':'1 · Virtuell anschließen';v('virtualIgnite').disabled=!virtualBurner.connected||virtualBurner.lit;v('virtualAir').disabled=!virtualBurner.lit;v('virtualAir').textContent=virtualBurner.airOpen?'Luftzufuhr schließen':'3 · Luftzufuhr öffnen';v('virtualFlameHeight').disabled=!virtualBurner.lit;v('virtualOff').disabled=!virtualBurner.lit;v('virtualBurnerStatus').textContent=message||(!virtualBurner.connected?'Schritt 1: Verbinde den Brenner im Modell, bevor du ihn virtuell zündest.':!virtualBurner.lit?'Schritt 2: Der Brenner ist angeschlossen und ausgeschaltet.':'Virtuell an: '+(virtualBurner.airOpen?'blaue, rauschende Flamme bei geöffneter Luftzufuhr.':'gelbe, leuchtende Flamme bei geschlossener Luftzufuhr.'));}
 v('virtualConnect').addEventListener('click',()=>{virtualBurner.connected=true;updateVirtualBurner('Der virtuelle Schlauch sitzt. In einem echten Labor muss die Lehrkraft den Aufbau kontrollieren.')});
 v('virtualConnect').addEventListener('click',()=>{if(virtualHose){virtualHose.setAttribute('d','M166 147H223');virtualHose.removeAttribute('stroke-dasharray')}});
 v('virtualIgnite').addEventListener('click',()=>{if(!virtualBurner.connected)return;virtualBurner.lit=true;virtualBurner.airOpen=false;updateVirtualBurner('Virtuell gezündet: Die Luftzufuhr ist zunächst geschlossen, daher zeigt das Modell eine gelbe Flamme.')});
 v('virtualAir').addEventListener('click',()=>{if(!virtualBurner.lit)return;virtualBurner.airOpen=!virtualBurner.airOpen;updateVirtualBurner(virtualBurner.airOpen?'Luftzufuhr geöffnet: Das Modell zeigt eine blaue, rauschende Flamme.':'Luftzufuhr geschlossen: Das Modell zeigt eine gelbe, leuchtende Flamme.')});
 v('virtualFlameHeight').addEventListener('input',()=>updateVirtualBurner('Die Flammenhöhe wurde im Modell verändert.'));
 v('virtualOff').addEventListener('click',()=>{virtualBurner.lit=false;virtualBurner.airOpen=false;updateVirtualBurner('Ausgeschaltet: Im Modell ist die Flamme aus und die Gaszufuhr geschlossen.')});
}

const methodPage=document.getElementById('page-method');
if(methodPage)methodPage.insertAdjacentHTML('beforeend',`<section class="panel observation-sort" aria-labelledby="observationSortTitle"><h3 id="observationSortTitle">🗂 Zuordnungsaufgabe: Beobachtung, Vermutung oder Auswertung?</h3><p>Ordne jede Aussage genau einer Kategorie zu: Eine <b>Beobachtung</b> beschreibt, was du siehst oder misst. Eine <b>Vermutung</b> ist eine prüfbare Vorhersage. Eine <b>Auswertung</b> erklärt oder deutet Ergebnisse.</p><div class="sort-rows">${[['Das Thermometer zeigt 78 °C.','Beobachtung'],['Während des Erwärmens steigen Bläschen auf.','Beobachtung'],['Ich vermute, dass die Probe bei stärkerem Heizen schneller warm wird.','Vermutung'],['Der Messwert passt zu Ethanol, beweist aber allein nicht die Identität.','Auswertung'],['Der Stoff könnte Ethanol sein.','Vermutung'],['Die Flüssigkeit begann bei ungefähr 78 °C zu sieden.','Beobachtung']].map(([text])=>`<label class="sort-row"><span>${text}</span><select data-sort-answer aria-label="Kategorie für: ${text}"><option value="">Kategorie wählen …</option><option>Beobachtung</option><option>Vermutung</option><option>Auswertung</option></select></label>`).join('')}</div><div class="btn-row"><button type="button" class="btn primary" id="checkObservationSort">Zuordnungen prüfen</button><button type="button" class="btn secondary" id="resetObservationSort">Neu ordnen</button></div><div id="observationSortFeedback" class="feedback" role="status" aria-live="polite">Wähle für jede Aussage eine Kategorie.</div></section>`);
if(methodPage){
 const expected=['Beobachtung','Beobachtung','Vermutung','Auswertung','Vermutung','Beobachtung'];
 document.getElementById('checkObservationSort').addEventListener('click',()=>{const selects=[...methodPage.querySelectorAll('[data-sort-answer]')];if(selects.some(s=>!s.value)){feedback(document.getElementById('observationSortFeedback'),false,'Bitte ordne erst alle sechs Aussagen zu.');return}const correct=selects.filter((s,i)=>s.value===expected[i]).length;feedback(document.getElementById('observationSortFeedback'),correct===expected.length,`${correct} von ${expected.length} Zuordnungen richtig. Beobachtungen nennen Wahrnehmungen oder Messwerte; Vermutungen sind prüfbare Vorhersagen; Auswertungen deuten Ergebnisse.`);if(correct===expected.length)complete('method');selects.forEach((s,i)=>{s.style.borderColor=s.value===expected[i]?'#21856f':'#b84c4c'})});
 document.getElementById('resetObservationSort').addEventListener('click',()=>{methodPage.querySelectorAll('[data-sort-answer]').forEach(s=>{s.value='';s.style.borderColor=''});feedback(document.getElementById('observationSortFeedback'),null,'Wähle für jede Aussage eine Kategorie.')});
}

const safetyPage=document.getElementById('page-safety');
if(safetyPage){
 const prompt=safetyPage.querySelector('.page-head p');if(prompt)prompt.innerHTML='Sechs Gefahren sind im Bild mit einem <b>?</b> markiert. Tippe jede markierte Stelle an und lies rechts nach, wie du dich richtig verhältst.';
 const hair=safetyPage.querySelector('[data-safety="1"]');if(hair){hair.style.left='48%';hair.style.top='21%';hair.setAttribute('aria-label','Lose Haare untersuchen')}
 const svg=safetyPage.querySelector('#safetyScene svg');
 if(svg)svg.insertAdjacentHTML('beforeend',`<g aria-hidden="true" pointer-events="none"><path d="M320 78Q304 92 309 119Q314 137 306 153M332 82Q319 98 323 123Q327 140 319 157M346 82Q337 99 342 120Q348 137 338 151" fill="none" stroke="#342b28" stroke-width="7" stroke-linecap="round"/><path d="M314 150q8 7 15 1" fill="none" stroke="#c07a47" stroke-width="3"/><rect x="178" y="328" width="103" height="45" rx="12" fill="#e8a34f" stroke="#6e5878" stroke-width="4"/><path d="M201 327q6-23 26-19q20 4 25 19M191 346q37 14 77 0" fill="none" stroke="#604a6d" stroke-width="7" stroke-linecap="round"/><rect x="205" y="345" width="52" height="23" rx="6" fill="#f6d89c" stroke="#805d4a" stroke-width="3"/><path d="M209 349h44M211 366l-10 10M252 366l12 10" stroke="#805d4a" stroke-width="3"/><text x="231" y="361" text-anchor="middle" font-size="9" font-weight="800" fill="#5b4a55">TASCHE</text></g>`);
}

// Neues Spiel in der Chemie-Spielwelt: Geräte-Duo (Paare finden)
const playPage=document.getElementById('page-v4play');
if(playPage){
 playPage.insertAdjacentHTML('beforeend',`<div class="panel duo-panel"><h3>🧠 Neues Spiel: Geräte-Duo</h3><p>Finde die Paare: Wähle links ein Laborgerät und rechts die passende Aufgabe. Sechs Paare pro Runde.</p><div class="scoreline"><span>Gefundene Paare</span><span id="duoCount">0 von 6</span></div><div class="duo-grid"><div id="duoLeft" role="group" aria-label="Laborgeräte"></div><div id="duoRight" role="group" aria-label="Aufgaben"></div></div><div class="btn-row"><button type="button" class="btn" id="duoNew">↻ Neue Runde</button></div><div class="feedback" id="duoFeedback" role="status" aria-live="polite">Wähle zuerst ein Gerät.</div></div>`);
 const duo={list:[],leftOrder:[],rightOrder:[],left:null,right:null,matched:new Set()};
 function duoRender(){
  $('duoCount').textContent=`${duo.matched.size} von 6`;
  $('duoLeft').innerHTML=duo.leftOrder.map(i=>`<button type="button" class="pair-choice ${duo.left===i?'is-active':''} ${duo.matched.has(i)?'is-matched':''}" data-duo-l="${i}" ${duo.matched.has(i)?'disabled':''}>${duo.list[i].name} ${duo.matched.has(i)?'✓':''}</button>`).join('');
  $('duoRight').innerHTML=duo.rightOrder.map(i=>`<button type="button" class="pair-choice ${duo.right===i?'is-active':''} ${duo.matched.has(i)?'is-matched':''}" data-duo-r="${i}" ${duo.matched.has(i)?'disabled':''}>${duo.list[i].purpose} ${duo.matched.has(i)?'✓':''}</button>`).join('');
 }
 function duoCheck(){
  if(duo.left===null||duo.right===null)return;
  if(duo.left===duo.right){duo.matched.add(duo.left);feedback($('duoFeedback'),true,`${duo.list[duo.left].name}: ${duo.list[duo.left].purpose} ${duo.matched.size===6?'Alle sechs Paare gefunden – stark!':'Weiter so!'}`)}
  else feedback($('duoFeedback'),false,`Das passt nicht zusammen. Überlege: Wozu dient ${duo.list[duo.left].name}?`);
  duo.left=null;duo.right=null;duoRender();
 }
 function duoNewRound(){duo.list=shuffle(devices).slice(0,6);duo.leftOrder=shuffle([0,1,2,3,4,5]);duo.rightOrder=shuffle([0,1,2,3,4,5]);duo.left=null;duo.right=null;duo.matched=new Set();duoRender();feedback($('duoFeedback'),null,'Wähle zuerst ein Gerät.')}
 playPage.addEventListener('click',e=>{const l=e.target.closest('[data-duo-l]'),r=e.target.closest('[data-duo-r]');if(l){duo.left=+l.dataset.duoL;duoRender();duoCheck()}else if(r){duo.right=+r.dataset.duoR;duoRender();duoCheck()}});
 $('duoNew').addEventListener('click',duoNewRound);
 duoNewRound();
}


// Navigation thematisch gruppieren und Versionsnamen entfernen
(function(){const nav=document.getElementById('nav');if(!nav)return;
 const byPage={};[...nav.querySelectorAll('button[data-page]')].forEach(b=>byPage[b.dataset.page]=b);
 const fixText=(b,txt)=>{if(!b)return;[...b.childNodes].forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.textContent=txt})};
 fixText(byPage.v5academy,'Forscherwerkstatt ');fixText(byPage.chem6,' Forschungscampus');
 const groups=[[null,['home','learningpath','practicehub']],['Grundlagen',['matter','devices','safety','solubility','thermal','heating','burner','method']],['Zusatzwissen & Spiele',['missions','deep','v4lab','v4play','v5academy','chem6']],['Üben & Nachschlagen',['protocoltrainer','quiz','sheet','v4study']],['Zum Abschluss',['finaltest']]];
 const frag=document.createDocumentFragment();const used=new Set();
 groups.forEach(([heading,ids])=>{const els=ids.map(i=>byPage[i]).filter(Boolean);if(!els.length)return;if(heading){const d=document.createElement('div');d.className='nav-section';d.textContent=heading;frag.appendChild(d)}els.forEach(el=>{frag.appendChild(el);used.add(el)})});
 [...nav.querySelectorAll('button[data-page]')].forEach(b=>{if(!used.has(b))frag.appendChild(b)});
 nav.appendChild(frag);
})();

// Soundeffekte und Belohnungsanimation (abschaltbar)
let chemFx=true;try{chemFx=localStorage.getItem('chemfx')!=='aus'}catch(e){}
let chemFxCtx=null;
function chemChime(){if(!chemFx)return;try{chemFxCtx=chemFxCtx||new (window.AudioContext||window.webkitAudioContext)();const t0=chemFxCtx.currentTime;[[659,0],[988,.1]].forEach(([f,d])=>{const o=chemFxCtx.createOscillator(),g=chemFxCtx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+d);g.gain.exponentialRampToValueAtTime(.09,t0+d+.025);g.gain.exponentialRampToValueAtTime(.0001,t0+d+.32);o.connect(g);g.connect(chemFxCtx.destination);o.start(t0+d);o.stop(t0+d+.4)})}catch(e){}}
function chemSparkle(){if(!chemFx)return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;const sp=document.createElement('div');sp.className='fx-sparkle';sp.textContent='✨';document.body.appendChild(sp);setTimeout(()=>sp.remove(),950)}
const prevFeedbackFx=feedback;
feedback=function(el,ok,msg){prevFeedbackFx(el,ok,msg);if(ok===true){chemChime();chemSparkle()}};
const topControls=document.querySelector('.topbar .controls');
if(topControls){const b=document.createElement('button');b.type='button';b.className='btn iconbtn';b.id='fxToggle';const paintFx=()=>{b.textContent=chemFx?'🎵':'🔇';b.title='Soundeffekte '+(chemFx?'an':'aus');b.setAttribute('aria-pressed',String(chemFx));b.setAttribute('aria-label','Soundeffekte '+(chemFx?'ausschalten':'einschalten'))};paintFx();b.addEventListener('click',()=>{chemFx=!chemFx;try{localStorage.setItem('chemfx',chemFx?'an':'aus')}catch(e){}paintFx();if(chemFx)chemChime()});topControls.insertBefore(b,topControls.firstChild)}

// Tages-Training: mischt gespeicherte Fehler automatisch unter neue Fragen
const prevFinishQuizDaily=finishQuiz;
finishQuiz=function(){prevFinishQuizDaily();try{const stored=JSON.parse(localStorage.getItem('chemie5-fehler')||'[]');const fresh=state.quiz.records.filter(r=>!r.ok).map(r=>r.q.q);const solved=state.quiz.records.filter(r=>r.ok).map(r=>r.q.q);const merged=[...new Set([...stored.filter(q=>!solved.includes(q)),...fresh])].slice(-30);localStorage.setItem('chemie5-fehler',JSON.stringify(merged))}catch(e){}};
const prevStartQuizDaily=startQuiz;
startQuiz=function(mode='new'){
 if(mode==='daily'){let err=[];try{err=JSON.parse(localStorage.getItem('chemie5-fehler')||'[]')}catch(e){}
  const errQ=shuffle(quizBank.filter(q=>err.includes(q.q))).slice(0,5);
  const rest=shuffle(quizBank.filter(q=>!errQ.includes(q))).slice(0,Math.max(5,10-errQ.length));
  state.quiz={questions:shuffle([...errQ,...rest]).slice(0,10),i:0,score:0,answered:false,records:[],mode:'daily'};
  $('examPanel').hidden=false;$('quizEnd').hidden=true;renderQuiz();return}
 prevStartQuizDaily(mode)};
const examConfig=document.querySelector('#examPanel .exam-config');
if(examConfig){const b=document.createElement('button');b.type='button';b.className='btn';b.id='quizDaily';b.textContent='🗓 Tages-Training (mischt deine Fehler ein)';b.addEventListener('click',()=>startQuiz('daily'));examConfig.appendChild(b)}

// Erinnerung an die Lernstand-Sicherung (höchstens alle 14 Tage)
function miniToast(msg){const t=document.createElement('div');t.className='mini-toast';t.textContent=msg;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('on'));setTimeout(()=>{t.classList.remove('on');setTimeout(()=>t.remove(),400)},8000)}
setTimeout(()=>{try{const doneCount=Object.values(state.done||{}).filter(Boolean).length;const last=Number(localStorage.getItem('chem-backup-hint')||0);if(doneCount>=4&&Date.now()-last>1000*60*60*24*14){miniToast('💾 Tipp: Sichere deinen Lernstand im Lerncockpit unter „Sicherung“.');localStorage.setItem('chem-backup-hint',String(Date.now()))}}catch(e){}},4500);

const style=document.createElement('style');
style.textContent='.boiling-comparison{display:flex;gap:24px;align-items:end;justify-content:center;min-height:170px;margin:18px 0;padding:18px;border-radius:14px;background:#f2f8fa}.boiling-comparison>div{display:grid;justify-items:center;gap:8px;min-width:110px}.boiling-bar{display:block;width:54px;border-radius:10px 10px 3px 3px;background:linear-gradient(#e7a75a,#e9d4a8)}.ethanol-bar{height:78px}.water-bar{height:100px;background:linear-gradient(#68b5c6,#b9e0e5)}.virtual-burner{grid-column:1/-1}.virtual-burner-workspace{display:grid;grid-template-columns:minmax(180px,300px) 1fr;gap:18px;align-items:center}.virtual-burner-svg{width:100%;max-height:250px}.virtual-flame{opacity:0;transform-origin:50% 100%;transition:opacity .2s,transform .2s}.virtual-flame.blue path:first-child{fill:#39a6e2}.virtual-flame.blue .virtual-inner-flame{fill:#c8f5ff}.virtual-burner-controls ol{line-height:1.8}.virtual-burner-controls input[type=range]{width:100%}.sort-rows{display:grid;gap:8px;margin:14px 0}.sort-row{display:grid;grid-template-columns:minmax(220px,1fr) minmax(160px,.6fr);gap:12px;align-items:center;padding:10px;border-radius:10px;background:#f5f8f8}.sort-row select{font:inherit;padding:8px;border:1px solid #9aa; border-radius:8px;background:#fff;color:#17252a}.duo-panel{margin-top:18px}.duo-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:14px;margin:14px 0}.duo-grid>div{display:grid;gap:8px;align-content:start}.duo-grid .pair-choice{text-align:left;font-size:14px}@media(max-width:650px){.virtual-burner-workspace{grid-template-columns:1fr}.sort-row{grid-template-columns:1fr}.boiling-comparison{gap:12px}.duo-grid{grid-template-columns:1fr}}.nav-section{margin:14px 10px 4px;font-size:10.5px;letter-spacing:.09em;font-weight:800;text-transform:uppercase;color:#9cc4c9}@media(max-width:900px){.nav-section{display:none}}.fx-sparkle{position:fixed;left:50%;top:40%;font-size:46px;z-index:9999;pointer-events:none;animation:fxPop .9s ease forwards}@keyframes fxPop{0%{opacity:0;transform:translate(-50%,-30%) scale(.5)}25%{opacity:1}100%{opacity:0;transform:translate(-50%,-150%) scale(1.35)}}.mini-toast{position:fixed;left:50%;bottom:26px;transform:translate(-50%,24px);background:#123c44;color:#fff;padding:13px 20px;border-radius:13px;opacity:0;transition:.35s;z-index:9999;max-width:min(92vw,560px);font-size:14.5px;box-shadow:0 10px 26px rgba(10,40,45,.35)}.mini-toast.on{opacity:1;transform:translate(-50%,0)}';
document.head.appendChild(style);
})();
