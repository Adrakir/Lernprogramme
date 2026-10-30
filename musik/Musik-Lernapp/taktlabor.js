'use strict';
(function taktlaborApp(){
'use strict';
// Zusätzliche Übungsansicht auf Basis der vorhandenen Notendarstellung und Audiotechnik.
// Eine Einheit in der Zeitspur entspricht einer Sechzehntelnote.
const TL_KEY='rhythmuswerkstatt.taktlabor.v1';
const TL_TASKS=[
 {level:1,m:4,ids:['q','q','h'],kind:'length',target:2,caption:'Lange und kurze Noten',why:'Zwei Viertelschläge und eine halbe Note füllen genau vier Schläge.'},
 {level:1,m:3,ids:['h','q'],kind:'start',target:1,caption:'Der Dreiertakt',why:'Die halbe Note hält zwei Schläge. Die Viertelnote beginnt deshalb auf Schlag 3.'},
 {level:1,m:4,ids:['q','qr','q','q'],kind:'silence',caption:'Eine Pause ist auch Zeit',why:'Die Viertelpause ist ein Schlag lang. Währenddessen bleibt der Puls gleichmäßig.'},
 {level:1,m:3,ids:['e','e','q','q'],kind:'start',target:1,caption:'Käse: zwei Achtelnoten',why:'Zwei Achtelnoten teilen sich einen Schlag. Die zweite beginnt auf 1 und.'},
 {level:1,m:4,ids:['q','e','e','h'],kind:'length',target:1,caption:'Notenfamilie',why:'Eine Achtelnote dauert einen halben Viertelschlag.'},
 {level:1,m:3,ids:['q','q','q'],kind:'length',target:1,caption:'Drei gleich lange Schläge',why:'Jede Viertelnote entspricht genau einem Schlag.'},
 {level:2,m:4,ids:['s','s','e','q','h'],kind:'start',target:2,caption:'Ananas: 2 Sechzehntel + 1 Achtel',why:'Die beiden Sechzehntelnoten dauern zusammen einen halben Schlag. Die Achtel beginnt auf 1 und.'},
 {level:2,m:3,ids:['q','er','e','q'],kind:'silence',caption:'Kurze Stille',why:'Die Achtelpause dauert einen halben Schlag; die nächste Achtelnote beginnt auf 2 und.'},
 {level:2,m:3,ids:['qd','e','q'],kind:'length',target:0,caption:'Der Verlängerungspunkt',why:'Eine punktierte Viertelnote dauert 1 Schlag plus die Hälfte davon: 1½ Schläge.'},
 {level:2,m:4,ids:['q','q','hr'],kind:'silence',caption:'Eine lange Pause',why:'Die halbe Pause dauert zwei Schläge. Sie belegt die Schläge 3 und 4.'},
 {level:2,m:4,ids:['e','e','q','h'],kind:'start',target:3,caption:'Anfang nach zwei Schlägen',why:'Zwei Achtelnoten plus eine Viertelnote dauern zusammen zwei Schläge. Die halbe Note beginnt auf 3.'},
 {level:2,m:3,ids:['s','s','e','h'],kind:'start',target:1,caption:'Ananas trifft halbe Note',why:'Die zweite Sechzehntelnote beginnt ein Viertel eines Schlags nach der 1: auf 1 e.'},
 {level:3,m:4,ids:['ed','s','q','h'],kind:'start',target:1,caption:'Punktierte Achtelnote + Sechzehntel',why:'Die punktierte Achtelnote dauert drei Sechzehntel. Das folgende Zeichen beginnt auf 1 a.'},
 {level:3,m:4,ids:['q','qrd','e','q'],kind:'silence',caption:'Punktierte Viertelpause',why:'Die punktierte Viertelpause dauert einen Schlag plus einen halben Schlag: 1½ Schläge.'},
 {level:3,m:4,ids:['qd','e','h'],kind:'start',target:1,caption:'Verschobener Einsatz',why:'Die punktierte Viertelnote hält 1½ Schläge. Die Achtelnote beginnt genau auf 2 und.'},
 {level:3,m:3,ids:['q','ed','s','q'],kind:'start',target:2,caption:'Ein Sechzehntel vor Schlag 3',why:'Nach Schlag 1 beginnt die punktierte Achtel auf 2 und dauert drei Sechzehntel; die Sechzehntelnote beginnt auf 2 a.'},
 {level:3,m:4,ids:['s','s','e','qr','h'],kind:'silence',caption:'Ananas mit Ruhephase',why:'Zwei Sechzehntelnoten plus eine Achtel füllen Schlag 1. Die Viertelpause auf Schlag 2 dauert einen Schlag.'},
 {level:3,m:4,ids:['hd','q'],kind:'length',target:0,caption:'Punktierte halbe Note',why:'Die halbe Note hat 2 Schläge; der Punkt verlängert um 1 Schlag auf insgesamt 3.'}
];
const TL_COUNT=6;
let tlLevel=1,tlIndexes=[0,0,0],tlHint=0,tlAnswer=null,tlReveal=false;
let tlResults={};
try{const raw=appStorage.read(TL_KEY);if(raw&&raw.version===1&&raw.results&&typeof raw.results==='object'&&!Array.isArray(raw.results)){for(const k of Object.keys(raw.results))if(/^\d+$/.test(k)&&Number(k)>=0&&Number(k)<TL_TASKS.length&&['correct','guided','wrong'].includes(raw.results[k]))tlResults[k]=raw.results[k];}}catch(_){}
const tlUnits=(id,m)=>val(id,m);
const tlStart=(task,i)=>task.ids.slice(0,i).reduce((a,id)=>a+tlUnits(id,task.m),0);
const tlSilence=task=>task.ids.reduce((a,id)=>a+(get(id).rest?tlUnits(id,task.m):0),0);
const tlNumber=n=>Number.isInteger(n)?String(n):String(n).replace('.',',');
const tlBeat=u=>String(Math.floor(u/4)+1)+['',' e',' und',' a'][u%4];
const tlIndex=()=>((tlLevel-1)*TL_COUNT+tlIndexes[tlLevel-1]);
const tlCurrent=()=>TL_TASKS[tlIndex()];
function tlCorrectUnits(task){return task.kind==='silence'?tlSilence(task):task.kind==='start'?tlStart(task,task.target):tlUnits(task.ids[task.target],task.m);}
function tlOptions(task){
 const answer=tlCorrectUnits(task);
 let options=[];
 if(task.kind==='start'){options=Array.from({length:task.m*4},(_,i)=>i);}
 else if(task.kind==='length'){options=[1,2,3,4,6,8,12,16].filter(n=>n<=task.m*4);}
 else{options=[0,1,2,3,4,6,8,10,12,16].filter(n=>n<=task.m*4);}
 return [answer,...options.filter(x=>x!==answer).sort((a,b)=>Math.abs(a-answer)-Math.abs(b-answer)||a-b).slice(0,3)]
  .sort((a,b)=>a-b);
}
function tlQuestion(task){
 if(task.kind==='silence')return 'Wie viele Schläge lang ist die Stille insgesamt?';
 if(task.kind==='start')return 'Auf welcher Zählzeit beginnt das markierte Zeichen?';
 return 'Wie viele Schläge dauert das markierte Zeichen?';
}
function tlAnswerLabel(task,u){return task.kind==='start'?tlBeat(u):tlNumber(u/4)+' '+(u===4?'Schlag':'Schläge');}
function tlHints(task){
 const base='Vier kleine Kästchen ergeben einen Viertelschlag. Die Zeitspur zeigt die Dauer jedes Zeichens.';
 if(task.kind==='start')return ['Zähle vom Anfang des Takts bis zum markierten Zeichen.','Jede Note und jede Pause verbraucht Zeit – auch wenn nichts klingt.','Addiere die kleinen Kästchen vor dem markierten Zeichen. Beginne mit der Zählzeit 1.'];
 if(task.kind==='silence')return ['Eine Pause ist Stille. Es gibt mehrere verschiedene Pausenzeichen.','Zähle nur die Abschnitte mit der Aufschrift „Pause“.',base];
 return ['Achte auf das markierte Noten- oder Pausenzeichen.','Ein Punkt verlängert um die Hälfte des ursprünglichen Werts.',base];
}
function tlExplain(task){
 const parts=task.ids.map((id,i)=>get(id).name+': '+tlNumber(tlUnits(id,task.m)/4)+' '+(tlUnits(id,task.m)===4?'Schlag':'Schläge'));
 const formula=task.kind==='silence'?'Stille: '+task.ids.filter(id=>get(id).rest).map(id=>tlNumber(tlUnits(id,task.m)/4)).join(' + ')+' = '+tlAnswerLabel(task,tlCorrectUnits(task))
  :task.kind==='start'?'Vorher liegen '+tlNumber(tlCorrectUnits(task)/4)+' Schläge. Einsatz: '+tlAnswerLabel(task,tlCorrectUnits(task))
  :'Das markierte Zeichen dauert '+tlCorrectUnits(task)+' kleine Kästchen = '+tlAnswerLabel(task,tlCorrectUnits(task))+'.';
 return '<p><strong>So rechnest du:</strong> '+formula+'</p><p>'+task.why+'</p><details><summary>Alle Zeichen mit Dauer anzeigen</summary><ol>'+parts.map(x=>'<li>'+x+'</li>').join('')+'</ol><p>In '+task.m+'/4 dauert der vollständige Takt '+task.m+' Schläge. Ein Taktstrich fügt keine Zeit hinzu.</p></details>';
}
function tlTimeline(task){
 let start=0;
 const cells=task.ids.map((id,i)=>{
  const n=tlUnits(id,task.m),rest=get(id).rest,focus=task.target===i&&task.kind!=='silence';
  const html='<span class="tlBlock '+(rest?'tlRest ':'tlSound ')+(focus?'tlFocus':'')+'" style="grid-column:span '+n+'" data-tl-index="'+i+'" title="'+(rest?'Pause':'Ton')+'">'+(focus?'<b>?</b>':rest?'Pause':'Ton')+'</span>';
  start+=n;return html;
 }).join('');
 return '<div class="tlTime" style="--tl-cells:'+(task.m*4)+'"><div class="tlNumbers">'+Array.from({length:task.m},(_,i)=>'<span>Schlag '+(i+1)+'</span>').join('')+'</div><div id="taktlaborTimeline" class="tlTimeline" style="--tl-cells:'+(task.m*4)+'">'+cells+'</div><div class="tlSubdiv">'+Array.from({length:task.m*4},(_,i)=>'<span'+(i%4===0?' class="tlStrong"':'')+'>'+(['1','e','&','a'][i%4])+'</span>').join('')+'</div></div>';
}
function tlSave(){
 appStorage.write(TL_KEY,{version:1,results:tlResults});
}
function tlMark(value,fromSolution=false){
 if(tlAnswer!==null||tlReveal)return;
 if(fromSolution){tlReveal=true;tlResults[tlIndex()]='guided';}
 else{tlAnswer=value;tlResults[tlIndex()]=value===tlCorrectUnits(tlCurrent())?'correct':'wrong';}
 tlSave();renderTaktlabor();
 const feedback=document.querySelector('#tlFeedback');if(feedback){feedback.setAttribute('tabindex','-1');feedback.focus({preventScroll:true});}
}
function tlHear(){
 const task=tlCurrent(),region=document.querySelector('#tlEvents');
 play(task.ids,task.m,{leadIn:true,target:region,
  onProgress(info){
   const at=Math.max(0,info.units);
   const parts=region?.querySelectorAll('[data-index]')||[];
   for(const item of parts)item.classList.toggle('playing',Number(item.dataset.index)===info.index);
   let sum=0;for(const cell of document.querySelectorAll('#taktlaborTimeline [data-tl-index]')){const index=Number(cell.dataset.tlIndex),begin=sum;sum+=tlUnits(task.ids[index],task.m);cell.classList.toggle('tlNow',info.units>=0&&at>=begin&&at<sum);}
  },
  onComplete(){for(const cell of document.querySelectorAll('#taktlaborTimeline .tlNow'))cell.classList.remove('tlNow');}
 });
}
function renderTaktlabor(){
 const task=tlCurrent(),index=tlIndex(),correct=tlCorrectUnits(task),feedback=tlAnswer!==null||tlReveal;
 const done=Object.keys(tlResults).filter(k=>Number(k)>= (tlLevel-1)*TL_COUNT&&Number(k)<tlLevel*TL_COUNT);
 const yes=done.filter(k=>tlResults[k]==='correct').length;
 const score=staffScore(task.ids,task.m,{focusSlot:task.kind==='silence'?undefined:task.target});
 const steps=tlHints(task);
 document.querySelector('#main').innerHTML='<div class="eyebrow">Üben · Hör- und Taktlabor</div><h1>Rhythmus sehen, hören und verstehen</h1>'
  +'<div class="tlCoach"><img src="images/fuji-musiklehrer.webp" width="90" height="90" alt="Fuji, der Musiklehrer"><p class="guideLead">Fuji zeigt dir den Rhythmus im Notenbild. Darunter wird die Zeit in gleich große Stücke zerlegt. Die grünen Felder klingen, die schraffierten Felder sind still.</p></div>'
  +'<div class="tlLevels" role="group" aria-label="Schwierigkeitsgrad">'+[1,2,3].map(n=>'<button class="'+(tlLevel===n?'selected':'')+'" data-tl-level="'+n+'" aria-pressed="'+(tlLevel===n)+'">'+['','1 · Grundlagen','2 · Mit Pausen','3 · Knifflig'][n]+'</button>').join('')+'</div>'
  +'<section class="card tlExercise"><div class="tlStep"><span>Aufgabe '+(tlIndexes[tlLevel-1]+1)+' von '+TL_COUNT+'</span><span>'+yes+' selbstständig richtig · '+done.length+' bearbeitet</span></div>'
  +'<h2>'+task.caption+'</h2><p>'+task.m+'/4-Takt · Die Viertelnote zählt als 1 Schlag.</p>'
  +'<div id="tlEvents" class="tlNotes">'+score+'</div>'
  +'<div class="tlLegend"><span><b class="tlLegendSound"></b> Ton</span><span><b class="tlLegendRest"></b> Pause (Stille)</span><span><b class="tlLegendFocus"></b> Gesuchtes Zeichen</span></div>'
  +'<h3>Die Zeitspur</h3>'+tlTimeline(task)
  +'<div class="row tlTools"><button id="tlHear" class="primary">▶ Hören und mitverfolgen</button><button id="tlStop">■ Stopp</button><span class="legend">Zuerst wird eingezählt. Danach hörst du den Takt.</span></div>'
  +'<section class="tlQuestion"><h3>'+tlQuestion(task)+'</h3><div class="tlChoices" role="group" aria-label="Antwort auswählen">'+tlOptions(task).map(u=>'<button data-tl-answer="'+u+'" '+(feedback?'disabled':'')+' class="'+(feedback&&u===correct?'tlRight':feedback&&tlAnswer===u?'tlWrong':'')+'">'+tlAnswerLabel(task,u)+'</button>').join('')+'</div>'
  +(!feedback?'<div class="tlAssist"><button id="tlHint">Tipp '+Math.min(tlHint+1,3)+' von 3 '+(tlHint===3?'erneut ansehen':'öffnen')+'</button><button id="tlSolution" class="subtle">Geführte Lösung ansehen</button></div>'+(tlHint?'<p class="tlHint" role="status"><strong>Fujis Tipp '+tlHint+':</strong> '+steps[tlHint-1]+'</p>':''):'')
  +(feedback?'<div class="tlFeedback" id="tlFeedback" role="status"><strong>'+(tlReveal?'Geführte Lösung':tlAnswer===correct?'Richtig! Gut gezählt.':'Fast! Hier ist die passende Lösung.')+'</strong><p>Richtige Antwort: <strong>'+tlAnswerLabel(task,correct)+'</strong></p>'+tlExplain(task)+(tlReveal?'<p class="legend">Diese Aufgabe wurde mit Lösung bearbeitet, nicht als selbstständig richtig gewertet.</p>':'')+'</div>':'')+'</section>'
  +'<div class="tlNext"><button id="tlPrev" class="subtle" '+(tlIndexes[tlLevel-1]===0?'disabled':'')+'>← Zurück</button><button id="tlNext" class="primary">'+(tlIndexes[tlLevel-1]===TL_COUNT-1?'Noch einmal von vorn':'Nächste Aufgabe →')+'</button></div></section>'
  +'<details class="card tlExplainer"><summary>Fuji erklärt die Rhythmuswörter</summary><div class="tlWords"><div><strong>Brot</strong>'+staffScore(['q'],4)+'<span>1 Viertel = 1 Schlag</span></div><div><strong>Käse</strong>'+staffScore(['e','e'],4)+'<span>2 Achtel = 1 Schlag</span></div><div><strong>Schokolade</strong>'+staffScore(['s','s','s','s'],4)+'<span>4 Sechzehntel = 1 Schlag</span></div><div><strong>Ananas</strong>'+staffScore(['s','s','e'],4)+'<span>2 Sechzehntel + 1 Achtel = 1 Schlag</span></div></div><p>Die Wörter helfen beim Sprechen. Entscheidend sind die Notenwerte, nicht die Silbenzahl allein.</p></details>';
 on('tlHear',tlHear);on('tlStop',()=>stop());
 for(const b of document.querySelectorAll('[data-tl-level]'))b.onclick=()=>{stop();tlLevel=Number(b.dataset.tlLevel);tlAnswer=null;tlReveal=false;tlHint=0;render();};
 for(const b of document.querySelectorAll('[data-tl-answer]'))b.onclick=()=>tlMark(Number(b.dataset.tlAnswer));
 on('tlHint',()=>{tlHint=tlHint%3+1;renderTaktlabor();});
 on('tlSolution',()=>tlMark(null,true));
 on('tlNext',()=>{stop();tlIndexes[tlLevel-1]=(tlIndexes[tlLevel-1]+1)%TL_COUNT;tlAnswer=null;tlReveal=false;tlHint=0;render();document.querySelector('#main h1')?.scrollIntoView({block:'start'});});
 on('tlPrev',()=>{stop();tlIndexes[tlLevel-1]=Math.max(0,tlIndexes[tlLevel-1]-1);tlAnswer=null;tlReveal=false;tlHint=0;render();});
}
function tlOpen(){tlAnswer=null;tlReveal=false;tlHint=0;setView('taktlabor');}
const tlOldHub=renderExerciseHub;
renderExerciseHub=function(){tlOldHub();const p=document.createElement('section');p.className='card tlEntry';p.innerHTML='<div><strong class="guideTag">Neu · mit Fuji</strong><h2>Hör- und Taktlabor</h2><p>Noten und Pausen im Takt sehen, anhören und in kleinen Schritten auszählen. 18 Aufgaben in drei Stufen – mit je drei Tipps und Rechenweg.</p></div><button id="tlOpen" class="primary">Taktlabor starten →</button>';const intro=document.querySelector('#main .guideExerciseGrid');intro?.before(p);on('tlOpen',tlOpen);};
registerView('taktlabor',renderTaktlabor);interfaceRoutes.add('taktlabor');
guideMeta.taktlabor=['Hör- und Taktlabor','exerciseHub'];
guideTaskHelp.taktlabor='Höre den Takt, beobachte die farbige Zeitspur und wähle dann die richtige Zählzeit oder Dauer.';
onAfterRender(()=>{if(view==='taktlabor'){const dock=document.querySelector('.audioDock');if(dock)dock.hidden=false;document.body.classList.add('simpleSound');if(typeof enhanceMobile==='function')enhanceMobile();}});
})();
