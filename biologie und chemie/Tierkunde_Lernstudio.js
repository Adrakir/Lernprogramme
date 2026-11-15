/* BioLabor 5 · mobile-first-Lernstudio */
(function(){
'use strict';
const DB='biolab5-tierstudio-2026';
const STATIONS=window.BioTierwissen.sections;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
let saved={dog:{},cat:{}};
try{const s=JSON.parse(localStorage.getItem(DB)||'null');if(s&&s.dog&&s.cat)saved=s}catch(e){}
const store=()=>{if(window.BioLaborLernweg.acceptsAnimalWrites()===false)return;try{localStorage.setItem(DB,JSON.stringify(saved))}catch(e){}};
const state={animal:null,section:null,mode:'guide',step:0,task:0,answers:{},feedback:null};
let lesson=null;
let speechRate=['.75','.95','1.12'].includes(saved.speechRate)?saved.speechRate:'.95';
const progress=sp=>STATIONS.filter(s=>saved[sp]&&saved[sp][s]&&saved[sp][s].finished).length;
const record=()=>{if(!saved[state.animal][state.section])saved[state.animal][state.section]={step:0,done:[],finished:false};return saved[state.animal][state.section]};
function restoreAnswers(){
 const entry=record();
 if(state.mode==='guide'){
  const choice=entry.guideAnswers?.[state.step];
  const step=lesson.steps[state.step];
  state.answers=Number.isInteger(choice)?{choice}:{};
  state.feedback=Number.isInteger(choice)?{ok:choice===step[4],text:step[5]}:null;
 }else{
  state.answers=state.mode==='task'?(entry.drafts?.[state.task]||{}):{};
  state.feedback=null;
 }
}
function saveTaskDraft(){
 const entry=record();
 (entry.drafts ||= {})[state.task]=state.answers;
 store();
}
function question(){
 const step=lesson.steps[state.step],q=step[2],answers=step[3];
 let h='<div class="ls-stepbuttons" role="group" aria-label="Lernschritte">';
 h+=lesson.steps.map((s,i)=>'<button data-ls="step" data-num="'+i+'" aria-current="'+(i===state.step?'step':'false')+'"><span>'+(i+1)+'</span>'+esc(s[0])+'</button>').join('');
 h+='</div><article class="ls-card"><small>SCHRITT '+(state.step+1)+' VON '+lesson.steps.length+'</small><h3>'+esc(step[0])+'</h3><p>'+esc(step[1])+'</p>';
 if(lesson.detail)h+='<p class="ls-species-note">🐾 '+esc(lesson.detail)+'</p>';
 h+='<div class="ls-question"><strong>🔎 Denkfrage</strong><p>'+esc(q)+'</p><div class="ls-options">';
 h+=answers.map((v,i)=>'<button data-ls="answer" data-num="'+i+'" aria-pressed="'+(state.answers.choice===i)+'" class="'+(state.answers.choice===i?'ls-choosen':'')+'">'+esc(v)+'</button>').join('');
 h+='</div></div>';
 if(state.feedback)h+=result();
 h+='<div class="ls-actions"><button data-ls="prev" '+(state.step===0?'disabled':'')+'>← Zurück</button><button data-ls="hint">💡 Hinweis</button><button class="ls-main" data-ls="next">'+(state.step===lesson.steps.length-1?'Zu den Übungen →':'Weiter →')+'</button></div></article>';
 return h;
}
function result(){
 return '<div role="status" class="ls-feedback '+(state.feedback.ok?'good':'bad')+'"><b>'+(state.feedback.ok?'✓ Richtig!':'↗ Noch nicht richtig.')+'</b><p>'+esc(state.feedback.text)+'</p></div>';
}
function diagram(){
 return '<figure class="ls-figure"><svg viewBox="0 0 610 200" role="img" aria-label="Orientierungsskizze. A am Kopf, B am Brustkorb, C am Rücken.">'+
 '<path d="M112 68Q85 45 49 73L21 99L87 116L158 86L193 75Q277 49 405 74L454 87Q474 90 505 116" stroke="#b5946c" stroke-width="12" stroke-linecap="round" fill="none"/>'+
 '<path d="M140 91L156 160L151 187M174 91L186 159L186 190M411 89L444 150L465 190M433 92L467 150L496 188" stroke="#c7aa82" stroke-width="11" fill="none" stroke-linecap="round"/>'+
 Array.from({length:13},(_,i)=>'<path d="M'+(197+i*14)+' 75Q'+(218+i*14)+' 144 '+(205+i*14)+' 150" stroke="#cbb18c" stroke-width="5" fill="none"/>').join('')+
 '<path d="M467 84Q539 21 585 63" fill="none" stroke="#b5946c" stroke-width="8"/>'+
 '<g class="ls-marker"><circle cx="72" cy="80" r="19"/><text x="72" y="86">A</text></g>'+
 '<g class="ls-marker"><circle cx="270" cy="122" r="19"/><text x="270" y="128">B</text></g>'+
 '<g class="ls-marker"><circle cx="362" cy="72" r="19"/><text x="362" y="78">C</text></g></svg>'+
 '<figcaption>A = Kopf · B = Brust · C = Rücken. Vereinfachte Orientierungsskizze.</figcaption></figure>';
}
function assignmentOptions(){
 const answers=lesson.pairs.map(pair=>pair[1]);
 const order=answers.slice();
 for(let i=order.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [order[i],order[j]]=[order[j],order[i]];
 }
 if(order.every((answer,i)=>answer===answers[i]))order.push(order.shift());
 return order;
}
const toothHints={
 'Schneidezähne':'Denke an die kleinen Zähne ganz vorn. Was tun sie mit kleinen Futterstücken?',
 'Fangzähne':'Denke an die langen, spitzen Eckzähne. Wofür braucht das Tier einen festen Griff?',
 'Reißzähne':'Achte darauf, wie die scharfen Kanten beim Schließen des Mauls aneinander vorbeigleiten.'
};
const orderInstruction='Ordne die Schritte mit den Pfeilen. Der erste steht oben.';
const orderItems=()=>state.answers.order||lesson.sequence.slice().reverse();
function task(){
 const r=record(),t=state.task,assignment=t===0;
 let h='<article class="ls-card"><small>FORSCHERAUFGABE '+(t+1)+' VON 2</small><h3>'+(assignment?'🧩 Zuordnen und Beschriften':'🔢 Reihenfolge herstellen')+'</h3>';
 h+='<p>'+(assignment?esc(lesson.pairHint):orderInstruction)+'</p>';
 if(assignment){
  if(state.section==='skeleton')h+=diagram();
  const opts=state.answers.options ||= assignmentOptions();
  h+='<div class="ls-assign">'+lesson.pairs.map((p,i)=>'<label><strong>'+esc(p[0])+'</strong><select data-ls-select="'+i+'" aria-label="'+esc(p[0])+' zuordnen"><option value="">Bitte auswählen</option>'+
  opts.map(v=>'<option value="'+esc(v)+'" '+(state.answers['r'+i]===v?'selected':'')+'>'+esc(v)+'</option>').join('')+
  '</select></label>').join('')+'</div>';
 }else{
  const list=orderItems();
  h+='<div class="ls-order">'+list.map((v,i)=>'<div class="ls-orderitem"><span>'+(i+1)+'.</span><strong>'+esc(v)+'</strong><button aria-label="Schritt nach oben" data-ls="move" data-num="'+i+'" data-dir="-1" '+(i===0?'disabled':'')+'>↑</button><button aria-label="Schritt nach unten" data-ls="move" data-num="'+i+'" data-dir="1" '+(i===list.length-1?'disabled':'')+'>↓</button></div>').join('')+'</div>';
 }
 if(state.feedback)h+=result();
 if(!assignment&&state.feedback&&!state.feedback.ok){
  h+='<details class="ls-order-solution"><summary>Musterlösung anzeigen</summary><ol>'+lesson.sequence.map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol></details>';
 }
 h+='<div class="ls-actions"><button data-ls="taskPrev" '+(t===0?'disabled':'')+'>← Vorherige</button><button data-ls="taskHint">💡 Hilfe</button><button class="ls-main" data-ls="check">✓ Prüfen</button><button data-ls="taskNext" '+(t===1?'disabled':'')+'>Nächste →</button></div>';
 h+='<p class="ls-tip">Die Übungen funktionieren auch mit Touchscreen und Tastatur – ohne Drag-and-Drop.</p></article>';
 if(r.finished)h+='<div class="ls-success"><b>🏅 Station abgeschlossen!</b><p>Du hast beide Aufgaben gelöst. Wiederhole schwierige Stellen oder gehe zum nächsten Thema.</p><button data-ls="nextStation">Nächste Station →</button></div>';
 return h;
}
function teacher(){
 return '<article class="ls-card"><small>LEHRERANSICHT · '+esc(lesson.title)+'</small><h3>Lernziel und Unterrichtsablauf</h3>'+
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
 let h='<div class="ls-head"><div><span class="ls-eyebrow">DEIN LERNWEG · '+(state.animal==='dog'?'HUND':'KATZE')+'</span><h2>'+lesson.icon+' '+esc(lesson.title)+'</h2><p>'+esc(lesson.goal)+'</p></div><div class="ls-total"><strong>'+progress(state.animal)+'/7</strong><span>geschafft</span></div></div>';
 h+='<div class="ls-tabs" role="group" aria-label="Lernmodus"><button data-ls="mode" data-mode="guide" aria-pressed="'+(state.mode==='guide')+'">📖 Geführtes Lernen</button><button data-ls="mode" data-mode="task" aria-pressed="'+(state.mode==='task')+'">✏️ Übungen</button><button data-ls="mode" data-mode="teacher" aria-pressed="'+(state.mode==='teacher')+'">👩‍🏫 Lehrerhinweise</button></div>';
 h+=state.mode==='guide'?question():state.mode==='task'?task():teacher();
 h+='<div class="ls-progress"><span><b>Übungen geschafft:</b> '+r.done.filter(Boolean).length+' von 2</span><div><i style="width:'+(r.done.filter(Boolean).length*50)+'%"></i></div></div>';
 h+='<div class="ls-voice"><button data-ls="read">🔊 Abschnitt vorlesen</button><label>Tempo <select id="ls-rate"><option value=".75">langsam</option><option value=".95">normal</option><option value="1.12">schnell</option></select></label></div>';
 h+='<p id="ls-note" class="ls-note" role="status" aria-live="polite"></p>';
 root.innerHTML=h;
 root.querySelector('#ls-rate').value=speechRate;
}
function note(t){let el=$('#ls-note');if(el)el.textContent=t}
function check(){
 const t=state.task;
 let wrong=0,hint='';
 if(t===0){
  if(lesson.pairs.some((_,i)=>!state.answers['r'+i])){
   note('Wähle in jeder Liste eine Antwort aus.');
   return;
  }
  const missed=lesson.pairs.filter((pair,i)=>state.answers['r'+i]!==pair[1]);
  wrong=missed.length;
  if(wrong){
   hint=state.section==='teeth'
    ? missed.map(([name])=>name+': '+toothHints[name]).join(' ')
    : 'Schau dir diese Begriffe noch einmal an: '+missed.map(([label])=>label).join(', ')+'. '+lesson.pairHint;
  }
 }else{
  const arr=orderItems();
  wrong=lesson.sequence.filter((step,i)=>step!==arr[i]).length;
  hint='Tipp für den nächsten Versuch: Beginne mit „'+lesson.sequence[0]+'“.';
 }
 if(!wrong){
  const r=record();r.done[t]=true;r.finished=!!r.done[0]&&!!r.done[1];store();
  state.feedback={ok:true,text:'Alle Lösungen passen. '+lesson.pairHint};
 }else state.feedback={ok:false,text:wrong+' '+(wrong===1?'Antwort ist':'Antworten sind')+' noch nicht passend. '+hint};
 render();
 $('#ls-studio [data-ls="check"]')?.focus({preventScroll:true});
}
function read(){
 if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){note('Vorlesen in diesem Browser nicht verfügbar.');return}
 const speech=window.speechSynthesis;if(speech.speaking||speech.pending){speech.cancel();return}
 let txt=lesson.goal;
 if(state.mode==='guide'){
  const [title,intro,question,answers]=lesson.steps[state.step];
  txt+=' '+title+'. '+intro+' '+question+' '+answers.map((answer,i)=>(i+1)+'. '+answer).join('. ');
 }
 if(state.mode==='task'){
  const taskText=state.task===0?lesson.pairHint+' Ordne diese Begriffe zu: '+
   lesson.pairs.map(([label])=>label).join(', ')+'. Zur Auswahl: '+(state.answers.options||[]).join(', ')+'.'
   :orderInstruction+' Aktuelle Reihenfolge: '+orderItems().map((step,i)=>(i+1)+'. '+step).join(' ');
  txt+=' '+taskText;
 }
 const u=new SpeechSynthesisUtterance(txt);u.lang='de-DE';
 u.rate=Number(speechRate);
 const v=speech.getVoices().find(v=>v.lang&&v.lang.startsWith('de'));if(v)u.voice=v;
 speech.speak(u);
}
function click(e){
 const b=e.target.closest('[data-ls]'),root=$('#ls-studio');
 if(!b||!root||!root.contains(b))return;
 const a=b.dataset.ls;
 let focus='[data-ls="'+a+'"]';
 if(b.dataset.mode)focus+='[data-mode="'+b.dataset.mode+'"]';
 if(b.dataset.num)focus+='[data-num="'+b.dataset.num+'"]';
 if(a==='mode'){
  if(state.mode===b.dataset.mode)return;
  state.mode=b.dataset.mode;restoreAnswers();
 }
 else if(a==='step'){
  const next=Number(b.dataset.num);
  if(state.step===next)return;
  state.step=next;restoreAnswers();
 }
 else if(a==='prev'){state.step=Math.max(0,state.step-1);restoreAnswers()}
 else if(a==='answer'){
  const st=lesson.steps[state.step],v=Number(b.dataset.num);
  (record().guideAnswers ||= {})[state.step]=v;
  store();
  state.answers.choice=v;state.feedback={ok:v===st[4],text:st[5]};
 }
 else if(a==='next'){
  if(!state.feedback||!state.feedback.ok){note('Bitte beantworte erst die Denkfrage richtig.');return}
  if(state.step===2){state.mode='task';state.task=0}else state.step++;
  record().step=Math.max(record().step,state.step+1);
  focus='.ls-card h3';
  restoreAnswers();
 }
 else if(a==='hint'){note(lesson.steps[state.step][5]);return}
 else if(a==='taskPrev'||a==='taskNext'){
  state.task=a==='taskNext'?1:0;
  restoreAnswers();
  focus='.ls-card h3';
 }
 else if(a==='move'){
  const arr=orderItems(),i=Number(b.dataset.num),j=i+Number(b.dataset.dir);
  if(j>=0&&j<arr.length){
   [arr[i],arr[j]]=[arr[j],arr[i]];
   state.answers.order=arr;
   saveTaskDraft();
   const direction=j===0?1:j===arr.length-1?-1:Number(b.dataset.dir);
   focus='[data-ls="move"][data-num="'+j+'"][data-dir="'+direction+'"]';
  }
  state.feedback=null;
 }
 else if(a==='taskHint'){
  note(state.task===0?lesson.pairHint:'Beginne mit „'+lesson.sequence[0]+'“. '+orderInstruction);
  return;
 }
 else if(a==='check'){check();return}
 else if(a==='read'){read();return}
 else if(a==='print'){window.print();return}
 else if(a==='nextStation'){
  const index=STATIONS.indexOf(state.section),next=STATIONS[(index+1)%STATIONS.length],nav=document.querySelector('#sections [data-section="'+next+'"]');
  if(nav)nav.click();return;
 }
 if(['mode','step','prev','next','taskPrev','taskNext'].includes(a)){
  record().view={mode:state.mode,step:state.step,task:state.task};
  store();
 }
 render();
 window.BioLaborLernweg.focus(root.querySelector(focus+':not(:disabled)')||root.querySelector('.ls-card h3'));
}
function change(e){
 const root=$('#ls-studio');
 if(root?.contains(e.target)&&e.target.id==='ls-rate'){
  speechRate=e.target.value;
  saved.speechRate=speechRate;
  store();
  return;
 }
 const el=e.target.closest('[data-ls-select]');
 if(!el||!root||!root.contains(el))return;
 state.answers['r'+el.dataset.lsSelect]=el.value;
 saveTaskDraft();
 state.feedback=null;
 root.querySelector('.ls-feedback')?.remove();
 note('');
}
function mount(args){
 const main=$('#content');if(!main||!args||!STATIONS.includes(args.section))return;
 const species=args.animal==='cat'?'cat':'dog';
 if(state.animal!==species||state.section!==args.section){
  state.animal=species;state.section=args.section;
  const previous=record();
  const view=previous.view;
  state.mode=['guide','task','teacher'].includes(view?.mode)?view.mode:'guide';
  const step=view?.step ?? previous.step-1;
  state.step=Number.isInteger(step)?Math.max(0,Math.min(2,step)):0;
  state.task=view?.task===1?1:0;
  lesson=window.BioTierwissen.get(state.animal,state.section);
  restoreAnswers();
 }
 const title=main.querySelector('.page-title');
 const box=document.createElement('section');box.className='ls-studio';box.id='ls-studio';box.setAttribute('aria-label','Geführte Tierkunde: '+lesson.title);
 main.insertBefore(box,title?title.nextSibling:main.firstChild);
 const rig=main.querySelector('#rig-studio');
 if(rig)main.insertBefore(rig,box.nextSibling);
 const old=document.createElement('details');old.className='ls-reference';old.innerHTML='<summary>📚 Schulbuchwissen, Knochenlexikon und weitere Erklärungen aufklappen</summary>';
 Array.from(main.children).forEach(el=>{if(el!==box&&el!==title&&el!==rig&&!el.classList.contains('bs-context'))old.appendChild(el)});
 main.appendChild(old);
 render();
}
document.addEventListener('click',click);
document.addEventListener('change',change);
window.BioLernstudio={mount,getProgress:()=>JSON.parse(JSON.stringify(saved)),complete:progress,selfTest:()=>window.BioTierwissen.selfTest()&&STATIONS.length===7};
const init=window.BioLaborLernweg.animalRoute();
const section=STATIONS.includes(init[1])?init[1]:'skeleton';
if(init[1]!=='quiz')mount({animal:init[0]==='cat'?'cat':'dog',section});
})();
