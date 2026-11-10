/* BioLabor 5 · mobile-first-Lernstudio */
(function(){
'use strict';
const DB='biolab5-tierstudio-2026';
const OPTIONS=['dog','cat'],STATIONS=window.BioTierwissen.sections;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
let saved={dog:{},cat:{}};
try{const s=JSON.parse(localStorage.getItem(DB)||'null');if(s&&s.dog&&s.cat)saved=s}catch(e){}
const store=()=>{try{localStorage.setItem(DB,JSON.stringify(saved))}catch(e){}};
const state={animal:'dog',section:'skeleton',mode:'guide',step:0,task:0,answers:{},feedback:null};
let lesson=null;
const progress=sp=>STATIONS.filter(s=>saved[sp]&&saved[sp][s]&&saved[sp][s].finished).length;
const record=()=>{if(!saved[state.animal][state.section])saved[state.animal][state.section]={step:0,done:[],finished:false};return saved[state.animal][state.section]};
const completedTasks=()=>record().done.filter(Boolean).length;
function question(){
 const step=lesson.steps[state.step],q=step[2],answers=step[3];
 let h='<div class="ls-stepbuttons" role="group" aria-label="Lernschritte">';
 h+=lesson.steps.map((s,i)=>'<button data-ls="step" data-num="'+i+'" aria-current="'+(i===state.step?'step':'false')+'"><span>'+(i+1)+'</span>'+esc(s[0])+'</button>').join('');
 h+='</div><article class="ls-card"><small>SCHRITT '+(state.step+1)+' VON '+lesson.steps.length+'</small><h4>'+esc(step[0])+'</h4><p>'+esc(step[1])+'</p>';
 if(lesson.detail)h+='<p class="ls-species-note">🐾 '+esc(lesson.detail)+'</p>';
 h+='<div class="ls-question"><strong>🔎 Denkfrage</strong><p>'+esc(q)+'</p><div class="ls-options">';
 h+=answers.map((v,i)=>'<button data-ls="answer" data-num="'+i+'" class="'+(state.answers.choice===i?'ls-choosen':'')+'">'+esc(v)+'</button>').join('');
 h+='</div></div>';
 if(state.feedback)h+=result();
 h+='<div class="ls-actions"><button data-ls="prev" '+(state.step===0?'disabled':'')+'>← Zurück</button><button data-ls="hint">💡 Hinweis</button><button class="ls-main" data-ls="next">'+(state.step===lesson.steps.length-1?'Zu den Übungen →':'Weiter →')+'</button></div></article>';
 return h;
}
function result(){
 return '<div role="status" class="ls-feedback '+(state.feedback.ok?'good':'bad')+'"><b>'+(state.feedback.ok?'✓ Richtig!':'↗ Noch nicht richtig.')+'</b><p>'+esc(state.feedback.text)+'</p></div>';
}
function diagram(){
 return '<figure class="ls-figure"><svg viewBox="0 0 610 200" role="img" aria-label="Vereinfachtes Skelett mit den Zielpunkten A B und C">'+
 '<path d="M112 68Q85 45 49 73L21 99L87 116L158 86L193 75Q277 49 405 74L454 87Q474 90 505 116" stroke="#b5946c" stroke-width="12" stroke-linecap="round" fill="none"/>'+
 '<path d="M140 91L156 160L151 187M174 91L186 159L186 190M411 89L444 150L465 190M433 92L467 150L496 188" stroke="#c7aa82" stroke-width="11" fill="none" stroke-linecap="round"/>'+
 Array.from({length:11},(_,i)=>'<path d="M'+(197+i*17)+' 75Q'+(218+i*17)+' 144 '+(205+i*17)+' 150" stroke="#cbb18c" stroke-width="5" fill="none"/>').join('')+
 '<path d="M467 84Q539 21 585 63" fill="none" stroke="#b5946c" stroke-width="8"/>'+
 '<g class="ls-marker"><circle cx="72" cy="80" r="19"/><text x="72" y="86">A</text></g>'+
 '<g class="ls-marker"><circle cx="270" cy="122" r="19"/><text x="270" y="128">B</text></g>'+
 '<g class="ls-marker"><circle cx="362" cy="72" r="19"/><text x="362" y="78">C</text></g></svg>'+
 '<figcaption>A = Kopf · B = Brust · C = Rücken. Vereinfachte Orientierungsskizze.</figcaption></figure>';
}
function task(){
 const r=record(),t=state.task,assignment=t===0;
 let h='<article class="ls-card"><small>FORSCHERAUFGABE '+(t+1)+' VON 2</small><h4>'+(assignment?'🧩 Zuordnen und Beschriften':'🔢 Reihenfolge herstellen')+'</h4>';
 h+='<p>'+(assignment?esc(lesson.pairHint):'Ordne die Schritte mit den Pfeilen. Der erste steht oben.')+'</p>';
 if(assignment){
  if(state.section==='skeleton')h+=diagram();
  const opts=state.section==='compare'?lesson.pairs.map(p=>p[1]):lesson.pairs.map(p=>p[1]);
  h+='<div class="ls-assign">'+lesson.pairs.map((p,i)=>'<label><strong>'+esc(p[0])+'</strong><select data-ls-select="'+i+'" aria-label="'+esc(p[0])+' zuordnen"><option value="">Bitte auswählen</option>'+
  opts.map(v=>'<option value="'+esc(v)+'" '+(state.answers['r'+i]===v?'selected':'')+'>'+esc(v)+'</option>').join('')+
  '</select></label>').join('')+'</div>';
 }else{
  const list=state.answers.order||lesson.sequence.slice().reverse();
  h+='<div class="ls-order">'+list.map((v,i)=>'<div class="ls-orderitem"><span>'+(i+1)+'.</span><strong>'+esc(v)+'</strong><button aria-label="Schritt nach oben" data-ls="move" data-num="'+i+'" data-dir="-1" '+(i===0?'disabled':'')+'>↑</button><button aria-label="Schritt nach unten" data-ls="move" data-num="'+i+'" data-dir="1" '+(i===list.length-1?'disabled':'')+'>↓</button></div>').join('')+'</div>';
 }
 if(state.feedback)h+=result();
 h+='<div class="ls-actions"><button data-ls="taskPrev" '+(t===0?'disabled':'')+'>← Vorherige</button><button data-ls="taskHint">💡 Hilfe</button><button class="ls-main" data-ls="check">✓ Prüfen</button><button data-ls="taskNext" '+(t===1?'disabled':'')+'>Nächste →</button></div>';
 h+='<p class="ls-tip">Die Übungen funktionieren auch mit Touchscreen und Tastatur – ohne Drag-and-Drop.</p></article>';
 if(r.finished)h+='<div class="ls-success"><b>🏅 Station abgeschlossen!</b><p>Du hast beide Aufgaben gelöst. Wiederhole schwierige Stellen oder gehe zum nächsten Thema.</p><button data-ls="nextStation">Nächste Station →</button></div>';
 return h;
}
function teacher(){
 return '<article class="ls-card"><small>LEHRERANSICHT · '+esc(lesson.title)+'</small><h4>Lernziel und Unterrichtsablauf</h4>'+
 '<p><b>Fachliches Ziel:</b> '+esc(lesson.goal)+'</p>'+
 '<p><b>1. Aktivierung (5 Min.):</b> Schüler betrachten die große Darstellung und beschreiben, was sie beobachten.</p>'+
 '<p><b>2. Erklärung (5 Min.):</b> Fachbegriffe mit dem Körperbau verbinden. Schüler erklären jeweils „weil“.</p>'+
 '<p><b>3. Anwendung (10 Min.):</b> Zuordnungs- und Reihenfolgeaufgaben ohne Hilfe lösen.</p>'+
 '<p><b>Differenzierung:</b> Hilfen einblenden oder Aussagen zusätzlich mit einem vollständigen Satz begründen lassen.</p>'+
 '<p><b>Fachliche Grenze:</b> Grafiken und Bewegungsanimationen sind Lernmodelle, keine maßstabsgetreuen veterinäranatomischen Präparate.</p>'+
 '<p><b>Lernstand:</b> Die Ergebnisse werden lokal auf diesem Gerät gespeichert. Es gibt keine personenbezogene Schülerliste oder serverseitige Übertragung.</p>'+
 '<button data-ls="print">🖨 Druckansicht öffnen</button></article>';
}
function render(){
 const root=$('#ls-studio');if(!root)return;
 const r=record();
 let h='<div class="ls-head"><div><span class="ls-eyebrow">DEIN LERNWEG · '+(state.animal==='dog'?'HUND':'KATZE')+'</span><h3>'+lesson.icon+' '+esc(lesson.title)+'</h3><p>'+esc(lesson.goal)+'</p></div><div class="ls-total"><strong>'+progress(state.animal)+'/7</strong><span>geschafft</span></div></div>';
 h+='<div class="ls-tabs" role="group" aria-label="Lernmodus"><button data-ls="mode" data-mode="guide" aria-pressed="'+(state.mode==='guide')+'">📖 Geführtes Lernen</button><button data-ls="mode" data-mode="task" aria-pressed="'+(state.mode==='task')+'">✏️ Übungen</button><button data-ls="mode" data-mode="teacher" aria-pressed="'+(state.mode==='teacher')+'">👩‍🏫 Lehrerhinweise</button></div>';
 h+=state.mode==='guide'?question():state.mode==='task'?task():teacher();
 h+='<div class="ls-progress"><span><b>Übungen geschafft:</b> '+r.done.filter(Boolean).length+' von 2</span><div><i style="width:'+(r.done.filter(Boolean).length*50)+'%"></i></div></div>';
 h+='<div class="ls-voice"><button data-ls="read">🔊 Abschnitt vorlesen</button><label>Tempo <select id="ls-rate"><option value=".75">langsam</option><option value=".95" selected>normal</option><option value="1.12">schnell</option></select></label></div>';
 h+='<p id="ls-note" class="ls-note" role="status" aria-live="polite"></p>';
 root.innerHTML=h;
}
function note(t){let el=$('#ls-note');if(el)el.textContent=t}
function check(){
 const t=state.task;let wrong=0,solution=[];
 if(t===0){
  lesson.pairs.forEach((p,i)=>{if(state.answers['r'+i]!==p[1])wrong++;solution.push(p[0]+' = '+p[1])})
 }else{
  const arr=state.answers.order||lesson.sequence.slice().reverse();
  lesson.sequence.forEach((v,i)=>{if(v!==arr[i])wrong++});solution=lesson.sequence;
 }
 if(!wrong){
  const r=record();r.done[t]=true;r.finished=!!r.done[0]&&!!r.done[1];store();
  state.feedback={ok:true,text:'Alle Lösungen passen. '+lesson.pairHint};
 }else state.feedback={ok:false,text:wrong+' '+(wrong===1?'Antwort ist':'Antworten sind')+' noch nicht passend. Vergleiche: '+solution.join(' → ')};
 render();
}
function read(){
 if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){note('Vorlesen in diesem Browser nicht verfügbar.');return}
 const speech=window.speechSynthesis;if(speech.speaking){speech.cancel();return}
 let txt=lesson.goal;
 if(state.mode==='guide'){const st=lesson.steps[state.step];txt+=' '+st[0]+'. '+st[1]+'. '+st[2]}
 if(state.mode==='task')txt+=' '+(state.task===0?lesson.pairHint:lesson.sequence.join('. '));
 const u=new SpeechSynthesisUtterance(txt);u.lang='de-DE';
 const speed=$('#ls-rate');u.rate=speed?Number(speed.value):.95;
 const v=speech.getVoices().find(v=>v.lang&&v.lang.startsWith('de'));if(v)u.voice=v;
 speech.speak(u);
}
function click(e){
 const b=e.target.closest('[data-ls]'),root=$('#ls-studio');
 if(!b||!root||!root.contains(b))return;
 const a=b.dataset.ls;
 if(a==='mode'){state.mode=b.dataset.mode;state.feedback=null;state.answers={}}
 else if(a==='step'){state.step=Number(b.dataset.num);state.feedback=null;state.answers={}}
 else if(a==='prev'){state.step=Math.max(0,state.step-1);state.feedback=null;state.answers={}}
 else if(a==='answer'){
  const st=lesson.steps[state.step],v=Number(b.dataset.num);
  state.answers.choice=v;state.feedback={ok:v===st[4],text:st[5]}
 }
 else if(a==='next'){
  if(!state.feedback||!state.feedback.ok){note('Bitte beantworte erst die Denkfrage richtig.');return}
  if(state.step===2){state.mode='task';state.task=0}else state.step++;
  record().step=Math.max(record().step,state.step+1);store();
  state.feedback=null;state.answers={};
 }
 else if(a==='hint'){note(lesson.steps[state.step][5]);return}
 else if(a==='taskPrev'||a==='taskNext'){state.task=Math.max(0,Math.min(1,state.task+(a==='taskNext'?1:-1)));state.feedback=null;state.answers={}}
 else if(a==='move'){
  const arr=state.answers.order||lesson.sequence.slice().reverse(),i=Number(b.dataset.num),j=i+Number(b.dataset.dir);
  if(j>=0&&j<arr.length){[arr[i],arr[j]]=[arr[j],arr[i]];state.answers.order=arr}
  state.feedback=null;
 }
 else if(a==='taskHint'){note(lesson.pairHint);return}
 else if(a==='check'){check();return}
 else if(a==='read'){read();return}
 else if(a==='print'){window.print();return}
 else if(a==='nextStation'){
  const index=STATIONS.indexOf(state.section),next=STATIONS[(index+1)%STATIONS.length],nav=document.querySelector('#sections [data-section="'+next+'"]');
  if(nav)nav.click();return;
 }
 render();
}
function change(e){
 const el=e.target.closest('[data-ls-select]'),root=$('#ls-studio');
 if(!el||!root||!root.contains(el))return;
 state.answers['r'+el.dataset.lsSelect]=el.value;
 state.feedback=null;
}
function mount(args){
 const main=$('#content');if(!main||!args||!STATIONS.includes(args.section))return;
 const species=args.animal==='cat'?'cat':'dog';
 if(state.animal!==species||state.section!==args.section){
  state.animal=species;state.section=args.section;state.mode='guide';state.step=0;state.task=0;state.feedback=null;state.answers={};
 }
 lesson=window.BioTierwissen.get(state.animal,state.section);
 const title=main.querySelector('.page-title');
 const box=document.createElement('section');box.className='ls-studio';box.id='ls-studio';box.setAttribute('aria-label','Geführte Tierkunde: '+lesson.title);
 main.insertBefore(box,title?title.nextSibling:main.firstChild);
 const rig=main.querySelector('#rig-studio');
 if(rig)main.insertBefore(rig,box.nextSibling);
 const old=document.createElement('details');old.className='ls-reference';old.innerHTML='<summary>📚 Schulbuchwissen, Knochenlexikon und weitere Erklärungen aufklappen</summary>';
 Array.from(main.children).forEach(el=>{if(el!==box&&el!==title&&el!==rig)old.appendChild(el)});
 main.appendChild(old);
 render();
}
document.addEventListener('click',click);
document.addEventListener('change',change);
window.BioLernstudio={mount,getProgress:()=>JSON.parse(JSON.stringify(saved)),complete:progress,selfTest:()=>window.BioTierwissen.selfTest()&&STATIONS.length===7};
const init=decodeURIComponent(location.hash.slice(1)).split('/');
if(STATIONS.includes(init[1]||'skeleton'))mount({animal:init[0]==='cat'?'cat':'dog',section:init[1]||'skeleton'});
})();
