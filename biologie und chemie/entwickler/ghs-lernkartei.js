(function(){
'use strict';
// GHS-Lernkartei: große, kontrastreiche Gefahrensymbole mit Erklärungen und Zuordnungsspiel.
const page=document.getElementById('page-safety');if(!page)return;
const S=3; // stroke base
function dia(inner){return '<svg viewBox="0 0 100 100" class="ghs-svg" aria-hidden="true"><path d="M50 3L97 50L50 97L3 50Z" fill="#fff" stroke="#d0021b" stroke-width="7" stroke-linejoin="round"/>'+inner+'</svg>'}
const G={
 ghs01:{n:'Explodierende Bombe',m:'Kann explodieren.',b:'Feuerwerkskörper, Sprengstoffe',v:'Fernhalten von Hitze, Schlag und Funken. In der Schule kommt dir so ein Stoff nicht in die Hände.',
  s:dia('<circle cx="54" cy="58" r="14" fill="#111"/><path d="M46 47l-8-9m4 22H30m42-24 10-8M44 36c2-5 8-5 9-1m-26 7 7 5M72 68l9 3M66 44l6-12" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none"/>')},
 ghs02:{n:'Flamme',m:'Kann leicht Feuer fangen (entzündbar).',b:'Ethanol (Alkohol), Spiritus, Feuerzeuggas',v:'Von Flammen und Hitze fernhalten. Deshalb wird Ethanol nie über offener Flamme erhitzt!',
  s:dia('<path d="M50 24c9 11 17 16 17 28a17 17 0 0 1-34 0c0-7 3-11 7-16 1 6 3 8 6 9-2-8 0-15 4-21Z" fill="#111"/><path d="M34 74h32" stroke="#111" stroke-width="5"/>')},
 ghs03:{n:'Flamme über Kreis',m:'Kann einen Brand verursachen oder verstärken (brandfördernd).',b:'Sauerstoff aus Druckflaschen, manche Reiniger',v:'Streng von brennbaren Stoffen trennen. Nicht mit Flamme (GHS02) verwechseln!',
  s:dia('<circle cx="50" cy="66" r="12" fill="none" stroke="#111" stroke-width="5"/><path d="M50 22c7 9 13 13 13 22a13 13 0 0 1-26 0c0-5 2-8 5-12 1 4 2 6 4 7-1-6 0-12 4-17Z" fill="#111"/>')},
 ghs04:{n:'Gasflasche',m:'Gas unter Druck. Der Behälter kann bei Hitze bersten.',b:'Gasflaschen, Kohlensäure-Kartuschen',v:'Nicht erhitzen, nicht umwerfen. Flaschen immer gesichert aufbewahren.',
  s:dia('<path d="M42 34h16v-6h-16zM38 38h24a4 4 0 0 1 4 4v26a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V42a4 4 0 0 1 4-4Z" fill="#111"/><path d="M58 28v-5h6" stroke="#111" stroke-width="4" fill="none"/>')},
 ghs05:{n:'Ätzwirkung',m:'Kann Haut und Augen schwer schädigen und Metalle angreifen.',b:'Rohrreiniger, konzentrierte Säuren und Laugen',v:'Schutzbrille und Handschuhe nach Anweisung. Spritzer sofort mit viel Wasser abspülen und melden.',
  s:dia('<g stroke="#111" stroke-width="3" fill="none"><path d="M33 26l8 3-6 16 10 4 6-16" fill="#111"/><path d="M62 26l-6 16 10 4 6-16Z" fill="#111"/></g><path d="M40 50l-2 6m26-6-2 6" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M36 60c1-3 5-3 6 0l1 4h-8ZM62 60c1-3 5-3 6 0l1 4h-8Z" fill="#111"/><path d="M24 70h24l-3 8H27Z" fill="#111"/><path d="M56 78c3-8 9-10 13-10l8 10Z" fill="#111"/>')},
 ghs06:{n:'Totenkopf',m:'Akut giftig – schon kleine Mengen können sehr gefährlich sein.',b:'Manche Pflanzenschutzmittel, Labor-Chemikalien',v:'Niemals probieren oder einatmen. In der Schule nur die Lehrkraft im Vorbereitungsraum.',
  s:dia('<circle cx="50" cy="46" r="16" fill="#111"/><circle cx="44" cy="43" r="4" fill="#fff"/><circle cx="56" cy="43" r="4" fill="#fff"/><path d="M47 52h6l-3 5Z" fill="#fff"/><path d="M42 60c0 4 16 4 16 0v4c0 3-16 3-16 0Z" fill="#111"/><path d="M30 68l34-16M30 52l34 16" stroke="#111" stroke-width="5" stroke-linecap="round"/>')},
 ghs07:{n:'Ausrufezeichen',m:'Kann reizen oder gesundheitsschädlich sein.',b:'Manche Spülmittel, Kalkreiniger',v:'Haut- und Augenkontakt vermeiden, Hände nach dem Experiment waschen.',
  s:dia('<path d="M45 26h10l-2 30h-6Z" fill="#111"/><circle cx="50" cy="68" r="7" fill="#111"/>')},
 ghs08:{n:'Gesundheitsgefahr',m:'Kann schwere oder langfristige Gesundheitsschäden verursachen.',b:'Benzin-Dämpfe, manche Lösungsmittel',v:'Dämpfe nicht einatmen; nur im Abzug und durch die Lehrkraft.',
  s:dia('<circle cx="50" cy="31" r="7" fill="#111"/><path d="M50 40c11 0 17 7 17 17v16a17 17 0 0 1-34 0V57c0-10 6-17 17-17Z" fill="#111"/><path d="M50 44l3.5 8 8.5 1-6 6 1.5 9-7.5-4.5L42.5 68l1.5-9-6-6 8.5-1Z" fill="#fff"/>')},
 ghs09:{n:'Umwelt',m:'Kann Gewässer und Wasserlebewesen schädigen.',b:'Altöl, manche Reinigungsmittel',v:'Niemals in den Ausguss oder die Natur – Reste nach Anweisung entsorgen.',
  s:dia('<path d="M30 56c6-12 10-16 10-24l6 8 4-14c6 10 8 18 6 26Z" fill="#111"/><path d="M26 60h50" stroke="#111" stroke-width="4"/><path d="M58 68c4-5 12-5 16 0-4 5-12 5-16 0Zm16 0 6-4v8Z" fill="#111"/><circle cx="62" cy="66" r="1.6" fill="#fff"/>')}
};
const ORDER=['ghs01','ghs02','ghs03','ghs04','ghs05','ghs06','ghs07','ghs08','ghs09'];
const html='<section class="panel ghs-panel" aria-labelledby="ghsTitle"><span class="pill">Lernkartei · 9 Gefahrstoff-Piktogramme</span><h3 id="ghsTitle">⚠️ Gefahrensymbole verstehen</h3>'+
 '<p>Rote Rauten warnen vor Gefahren eines Stoffs – wie auf Seite 2 deines Lernhefts. <b>Tippe ein Symbol an</b>, um Name, Bedeutung, Beispiel und das richtige Verhalten groß zu sehen.</p>'+
 '<div class="ghs-grid" role="group" aria-label="Gefahrensymbole zum Antippen">'+ORDER.map(k=>'<button type="button" class="ghs-card" data-ghs="'+k+'" aria-label="'+G[k].n+' erklären">'+G[k].s+'<small>'+G[k].n+'</small></button>').join('')+'</div>'+
 '<div class="ghs-detail" id="ghsDetail" hidden role="region" aria-live="polite"></div>'+
 '<div class="ghs-game"><h4>🎯 Zuordnungsspiel: Welches Symbol gehört auf die Flasche?</h4><p>Tippe zuerst ein Symbol unten an und dann die passende Flasche. Zwei Symbole bleiben übrig.</p>'+
 '<div class="ghs-bottles" id="ghsBottles"></div><div class="ghs-tray" id="ghsTray" role="group" aria-label="Symbole zur Auswahl"></div>'+
 '<p class="feedback" id="ghsGameFeedback" aria-live="polite">Wähle zuerst ein Symbol.</p><button type="button" class="btn" id="ghsGameReset">↺ Spiel neu starten</button></div></section>';
const anchorPanel=page.querySelector('.columns');
if(anchorPanel)anchorPanel.insertAdjacentHTML('afterend',html);else page.insertAdjacentHTML('beforeend',html);
// Detail view
let openKey=null;
function showDetail(k){const d=document.getElementById('ghsDetail');openKey=k;const g=G[k];d.hidden=false;
 d.innerHTML='<div class="ghs-big">'+g.s+'</div><div class="ghs-text"><h4>'+g.n+'</h4><p><b>Bedeutung:</b> '+g.m+'</p><p><b>Beispiele:</b> '+g.b+'</p><p class="ghs-act"><b>So verhältst du dich:</b> '+g.v+'</p><button type="button" class="btn" id="ghsDetailClose">Schließen</button></div>';
 document.getElementById('ghsDetailClose').addEventListener('click',()=>{d.hidden=true;openKey=null});
 d.scrollIntoView({behavior:'smooth',block:'nearest'})}
page.querySelectorAll('[data-ghs]').forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.ghs)));
// Matching game: 4 bottles, 6 symbols (2 distractors)
const bottles=[
 {k:'ghs02',label:'Ethanol',hint:'Diese Flüssigkeit fängt sehr leicht Feuer.'},
 {k:'ghs05',label:'Rohrreiniger',hint:'Diese Lauge kann Haut und Augen schwer verletzen.'},
 {k:'ghs04',label:'Gaskartusche',hint:'Hier ist Gas unter Druck – bei Hitze kann der Behälter bersten.'},
 {k:'ghs09',label:'Altöl',hint:'Dieser Stoff darf nie in den Fluss oder Ausguss gelangen.'}
];
const tray=['ghs02','ghs05','ghs04','ghs09','ghs07','ghs03'];
let picked=null,solved={};
function renderGame(){
 const bEl=document.getElementById('ghsBottles'),tEl=document.getElementById('ghsTray');
 bEl.innerHTML=bottles.map((b,i)=>'<button type="button" class="ghs-bottle'+(solved[i]?' done':'')+'" data-bottle="'+i+'" aria-label="Flasche '+b.label+'"><svg viewBox="0 0 60 90" aria-hidden="true"><path d="M24 8h12v14l8 10v48a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V32l8-10Z" fill="#dff0f6" stroke="#36606e" stroke-width="3"/><rect x="23" y="4" width="14" height="6" rx="2" fill="#36606e"/></svg><span class="ghs-slot">'+(solved[i]?G[bottles[i].k].s:'?')+'</span><small>'+b.label+'</small><em>'+b.hint+'</em></button>').join('');
 tEl.innerHTML=tray.map(k=>{const used=Object.keys(solved).some(i=>bottles[i].k===k);return '<button type="button" class="ghs-chip'+(picked===k?' picked':'')+(used?' used':'')+'" data-chip="'+k+'" '+(used?'disabled':'')+' aria-label="Symbol '+G[k].n+(picked===k?' (ausgewählt)':'')+'">'+G[k].s+'<small>'+G[k].n+'</small></button>'}).join('');
 tEl.querySelectorAll('[data-chip]').forEach(c=>c.addEventListener('click',()=>{picked=picked===c.dataset.chip?null:c.dataset.chip;renderGame();fb(picked?'Symbol „'+G[picked].n+'“ gewählt. Tippe jetzt die passende Flasche an.':'Wähle zuerst ein Symbol.')}));
 bEl.querySelectorAll('[data-bottle]').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.dataset.bottle;if(solved[i]){fb('Diese Flasche ist schon richtig beschriftet.');return}
  if(!picked){fb('Wähle zuerst unten ein Symbol aus.');return}
  if(bottles[i].k===picked){solved[i]=true;const g=G[picked];picked=null;renderGame();fb('✓ Richtig! '+g.n+': '+g.m+' '+g.v,true);
   if(Object.keys(solved).length===4){fb('🎉 Alle vier Flaschen richtig beschriftet! Die Symbole Ausrufezeichen und Flamme über Kreis blieben übrig – sie passen zu keiner dieser Flaschen.',true);window.LernCockpit?.record({id:'chem-ghs-game',topic:'safety',correct:true,assisted:false,mode:'spiel',skill:'wissen'})}}
  else{const w=G[picked];fb('Noch nicht. Das Symbol „'+w.n+'“ bedeutet: '+w.m+' Lies den Hinweis auf der Flasche noch einmal.',false)}}));
}
function fb(txt,ok){const f=document.getElementById('ghsGameFeedback');f.textContent=txt;f.className='feedback'+(ok===true?' good':ok===false?' bad':'')}
document.getElementById('ghsGameReset').addEventListener('click',()=>{picked=null;solved={};renderGame();fb('Spiel neu gestartet. Wähle zuerst ein Symbol.')});
renderGame();
})();
