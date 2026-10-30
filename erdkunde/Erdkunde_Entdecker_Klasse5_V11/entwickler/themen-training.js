/* Themenübungen – drei Niveaus, freiwillige Tipps, zweistufige Auswertung. */
(function(){
'use strict';
if(typeof MODULES==='undefined'||typeof Q==='undefined'||typeof render==='function'===false)return;
const LEVELS=[['Grundlagen','Begriffe erkennen und einfache Zusammenhänge verstehen'],['Anwenden','Das Wissen auf Beispiele und Karten übertragen'],['Knifflig','Zusammenhänge begründen und Fehler erkennen']];
const KEY='erdkunde-thementraining-v1';
let session=null,completed={};
try{completed=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){completed={}}
const safe=x=>esc(x);
const button=(label,task,cls='btn ghost small')=>'<button type="button" class="'+cls+'" data-train="'+task+'">'+label+'</button>';
const topic=id=>MODULES.find(m=>m.id===id);
function rank(q){
 const s=q.text.toLocaleLowerCase('de');let value=3;
 if(/^(was ist|was bedeutet|wie heißt|welche linie|welche farbe|wozu dient|woran erkennst|wo liegt|was bezeichnet|was zeigt)/.test(s))value=0;
 if(/warum|begründe|weshalb|welche aussage|was gilt|was passiert|unterschied|was stimmt|welche reihenfolge|welcher fehler/.test(s))value+=3;
 if(/berechne|wie lang|maßstab|flugzeit|uhrzeit|entfernung|dreht sich|zeigt der pfeil|du findest|du stehst|auf deiner karte|anhand|ein ort liegt/.test(s))value+=2;
 if(/nicht|falsch|immer|nie|statt|außer|unvollständig/.test(s))value+=2;
 return value;
}
function trainingPool(id,level){
 const all=Q.filter(q=>q.topic===id&&Array.isArray(q.opts)&&q.opts.length>=2&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.opts.length);
 const sorted=all.slice().sort((a,b)=>rank(a)-rank(b)||String(a.id).localeCompare(String(b.id)));
 if(!sorted.length)return [];
 const begin=Math.floor((level-1)*sorted.length/3),end=Math.floor(level*sorted.length/3);
 let selected=sorted.slice(begin,end);
 const center=(begin+end-1)/2;
 if(selected.length<6){
  const others=sorted.filter(q=>!selected.includes(q)).sort((a,b)=>Math.abs(sorted.indexOf(a)-center)-Math.abs(sorted.indexOf(b)-center));
  selected=selected.concat(others.slice(0,Math.max(0,6-selected.length)));
 }
 return selected;
}
function choose(id,level){
 const pool=trainingPool(id,level),key='training-'+id+'-'+level+'-'+Date.now();
 return pickQuestions(pool,Math.min(6,pool.length),key);
}
function overview(){
 const rows=MODULES.map(m=>{
  const last=completed[m.id],note=last?'Letzte Übung: Stufe '+last.level+' · '+last.correct+'/'+last.total+' richtig':'Noch kein Ergebnis gespeichert';
  return '<article class="card tt-topic"><h2>'+safe(m.icon)+' '+safe(m.title)+'</h2><p class="mini subtle">'+safe(note)+'</p><div class="tt-levels">'+LEVELS.map((lv,i)=>button('Stufe '+(i+1)+': '+lv[0],'start:'+m.id+':'+(i+1))).join('')+'</div></article>';
 }).join('');
 return '<div class="space">'+head('Üben in drei Stufen','🧩 Themenübungen','Wähle eines der 16 Themen und eine Schwierigkeitsstufe. Die Fragen wechseln zwischen Übungsrunden. Hinweise sind freiwillig und kosten keine Punkte.')+button('Zu den Lernpfaden','learn','btn ghost small')+'</div><div class="tt-intro card"><h2>So funktioniert es</h2><p><strong>1. Grundlagen:</strong> verstehen · <strong>2. Anwenden:</strong> übertragen · <strong>3. Knifflig:</strong> begründen.</p><p>Du darfst Antworten überspringen und zurückgehen. Richtig oder falsch erfährst du erst nach der Abgabe. Die Kurzlösung ist immer sichtbar; die ausführliche Erklärung öffnest du bei Bedarf.</p></div><div class="grid tt-overview">'+rows+'</div>';
}
function lessonPanel(id){
 const m=topic(id);if(!m)return '';
 return '<section class="card tt-lesson"><h2>🧩 Übungen zu '+safe(m.title)+'</h2><p>Trainiere dieses Thema in drei Stufen. Bei Bedarf erhältst du drei Hinweise. Nach der Abgabe kannst du zu jeder Aufgabe die geführte Musterlösung aufklappen.</p><div class="tt-levels">'+LEVELS.map((lv,i)=>button('Stufe '+(i+1)+' · '+lv[0],'start:'+id+':'+(i+1),'btn alt small')).join('')+'</div></section>';
}
function start(id,level){
 if(!topic(id)||!Number.isInteger(level)||level<1||level>3)return;
 const items=choose(id,level);
 if(!items.length){msg('Zu diesem Thema fehlen noch Aufgaben.');return}
 session={id,level,items,index:0,answers:Array(items.length).fill(null),hints:Array(items.length).fill(0),submitted:false};
 switchTab('train');
}
function questionView(){
 const s=session,q=s.items[s.index],a=s.answers[s.index],hintCount=s.hints[s.index];
 const question='<div class="tt-options" role="radiogroup" aria-label="Antwort auswählen">'+q.opts.map((v,i)=>'<label class="tt-option"><input type="radio" name="tt-answer" value="'+i+'" '+(a===i?'checked':'')+'><span>'+String.fromCharCode(65+i)+'. '+safe(v)+'</span></label>').join('')+'</div>';
 const hints=(q.hints||[]).slice(0,hintCount).map((v,i)=>'<p class="tt-tip"><b>Hinweis '+(i+1)+':</b> '+safe(v)+'</p>').join('');
 const missing=hintCount>=(q.hints||[]).length;
 return '<div class="space">'+button('← Themenübersicht','home')+'<span class="pill">Stufe '+s.level+' · '+LEVELS[s.level-1][0]+'</span></div><section class="card tt-question"><p class="mini subtle">'+safe(topic(s.id).title)+' · Aufgabe '+(s.index+1)+' von '+s.items.length+'</p><div class="progress-track"><div class="progress-fill" style="width:'+Math.round(s.index/s.items.length*100)+'%"></div></div><h1>'+safe(q.text)+'</h1>'+question+'<div class="tt-tips">'+button(missing?'Alle Hinweise angezeigt':'💡 Nächsten Hinweis anzeigen','hint','btn ghost small'+(missing?' tt-disabled':''))+'</div>'+hints+'<p class="mini subtle">Du kannst auch ohne Antwort fortfahren. Die Lösung wird erst nach der Abgabe angezeigt.</p><div class="tt-actions">'+button('← Vorherige','previous','btn ghost',s.index===0?'disabled':'')+(s.index===s.items.length-1?button('Abgeben und auswerten','submit','btn alt'):button('Nächste Aufgabe →','next','btn alt'))+'</div></section>';
}
function results(){
 const s=session,correct=s.items.filter((q,i)=>s.answers[i]===q.answer).length,percent=Math.round(correct/s.items.length*100);
 const reviews=s.items.map((q,i)=>{
  const choice=s.answers[i],ok=choice===q.answer,short=safe(q.opts[q.answer]);
  return '<article class="tt-result"><h3>'+(ok?'✓':'↻')+' Aufgabe '+(i+1)+': '+safe(q.text)+'</h3><p><b>Deine Antwort:</b> '+(choice===null?'Offen':safe(q.opts[choice]))+' · <b>'+ (ok?'Richtig':'Noch nicht richtig')+'</b></p><p><b>Kurzlösung:</b> '+short+'</p><details class="tt-steps"><summary>Geführte Musterlösung Schritt für Schritt aufklappen</summary>'+reasoningFor(q,choice,true)+'</details></article>';
 }).join('');
 const weak=s.items.filter((q,i)=>s.answers[i]!==q.answer);
 const recommendation=weak.length?'<p>Übe diese Fragen noch einmal und schaue bei Bedarf in den Lernpfad <strong>'+safe(topic(s.id).title)+'</strong>. Lies besonders die Regeln in den aufgeklappten Musterlösungen.</p>':'<p>Alle Antworten richtig. Versuche die nächsthöhere Stufe oder erkläre eine Antwort mit eigenen Worten.</p>';
 return '<div class="space">'+button('← Themenübersicht','home')+'<span class="pill">Auswertung · Stufe '+s.level+'</span></div><section class="card tt-summary"><h1>Deine Auswertung: '+safe(topic(s.id).title)+'</h1><p class="big-num">'+correct+' / '+s.items.length+' richtig</p><div class="progress-track"><div class="progress-fill" style="width:'+percent+'%"></div></div><p>Du hast '+percent+' % erreicht. '+s.hints.filter(Boolean).length+' Aufgabe(n) mit Hilfen bearbeitet. Das ist keine Schulnote.</p><h2>So kannst du weiterlernen</h2>'+recommendation+'<div class="tt-actions">'+button('Weitere Aufgaben dieser Stufe','start:'+s.id+':'+s.level,'btn alt')+button('Schrittweise lernen','guide:'+s.id,'btn ghost')+(s.level<3?button('Stufe '+(s.level+1)+' versuchen','start:'+s.id+':'+(s.level+1),'btn ghost'):'')+'</div></section><h2 class="section-title">Alle Antworten und kurzen Lösungen</h2><p>Die ausführliche Erklärung bleibt zunächst geschlossen. Du entscheidest, welche Lösung du genauer ansehen möchtest.</p><div class="tt-review">'+reviews+'</div>';
}
function submit(){
 if(!session||session.submitted)return;
 session.submitted=true;
 const s=session,correct=s.items.filter((q,i)=>s.answers[i]===q.answer).length;
 s.items.forEach((q,i)=>grade(q,s.answers[i]===q.answer));
 completed[s.id]={level:s.level,correct,total:s.items.length,date:new Date().toISOString().slice(0,10)};
 try{localStorage.setItem(KEY,JSON.stringify(completed))}catch(e){}
 draw();
}
function draw(){
 if(state.tab!=='train')return;
 updateStars();
 document.querySelectorAll('#tabs button').forEach(b=>{const active=b.dataset.tab==='train';b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false')});
 MAIN.innerHTML='<div class="flash" id="tt-root">'+(!session?overview():session.submitted?results():questionView())+'</div>';
}
const formerLearn=renderLearn;renderLearn=function(){return formerLearn()+'<section class="card tt-entry"><h2>🧩 Jedes Thema in drei Schwierigkeitsstufen üben</h2><p>Grundlagen, Anwenden oder Knifflig – mit freiwilligen Hinweisen, Kurzlösungen und aufklappbaren geführten Lösungen.</p>'+button('Alle Themenübungen öffnen','home','btn alt')+'</section>'};
const formerLesson=renderLesson;renderLesson=function(){return formerLesson()+lessonPanel(state.topic)};
const formerRender=render;render=function(){if(state.tab==='train'){draw();return}formerRender()};
const nav=document.getElementById('tabs'),before=nav&&nav.querySelector('[data-tab="tests"]');
if(before)before.insertAdjacentHTML('beforebegin','<button type="button" data-tab="train">🧩 Üben</button>');
else if(nav)nav.insertAdjacentHTML('beforeend','<button type="button" data-tab="train">🧩 Üben</button>');
document.addEventListener('change',function(e){if(e.target?.name==='tt-answer'&&session&&!session.submitted)session.answers[session.index]=Number(e.target.value)});
document.addEventListener('click',function(e){
 const control=e.target.closest('[data-train]');if(!control)return;
 e.preventDefault();e.stopPropagation();
 const a=control.dataset.train;
 if(a==='home'){session=null;switchTab('train');return}
 if(a==='learn'){session=null;switchTab('learn');return}
 if(a==='hint'&&session&&!session.submitted){const n=(session.items[session.index].hints||[]).length;session.hints[session.index]=Math.min(n,session.hints[session.index]+1);draw();return}
 if(a==='previous'&&session){session.index=Math.max(0,session.index-1);draw();return}
 if(a==='next'&&session){session.index=Math.min(session.items.length-1,session.index+1);draw();return}
 if(a==='submit'&&session){submit();return}
 if(a.startsWith('guide:')){const id=a.slice(6);session=null;goGuide(id);return}
 if(a.startsWith('start:')){const bits=a.split(':');start(bits[1],Number(bits[2]));return}
});
window.ErdkundeThemenTraining=Object.freeze({levels:LEVELS,topics:MODULES.length,questionCount:Q.length,trainingPool:trainingPool});
})();
