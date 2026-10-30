'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const file=fs.readFileSync(path.join(__dirname,'themen-training.js'),'utf8');
const buttons={},listeners={};
const nav={querySelector:()=>({insertAdjacentHTML:(_where,html)=>{buttons.tab=html}}),querySelectorAll:()=>[]};
const main={innerHTML:''};
const sample=Array.from({length:24},(_,i)=>({id:'a'+i,topic:'a',text:['Was ist ein Atlas?','Du findest einen Ort auf einer Karte.','Warum ist diese Regel wichtig?'][i%3]+' '+i,opts:['Richtig','Falsch','Unklar'],answer:0,explain:'Weil die Regel gilt.',hints:['Denk nach.','Nutze die Regel.','Vergleiche die Aussagen.']}));
const context={MODULES:[{id:'a',title:'Atlas',icon:'🌍',subtitle:'Atlasarbeit',lessons:[['Atlas','Richtig','Merksatz']]}],Q:sample,state:{tab:'start',topic:'a'},
render:()=>{},renderLearn:()=>'<div>Lernen</div>',renderLesson:()=>'<div>Kapitel</div>',
esc:x=>String(x).replaceAll('<','&lt;'),head:()=>'<h1>Üben</h1>',
pickQuestions:(arr,n)=>arr.slice(0,n),updateStars:()=>{},reasoningFor:()=>'<ol><li>Schritt 1</li><li>Schritt 2</li></ol>',
grade:()=>{},msg:()=>{},MAIN:main,
localStorage:{getItem:()=>null,setItem:()=>{}},
document:{getElementById:(id)=>id==='tabs'?nav:main,querySelectorAll:()=>[],addEventListener:(name,cb)=>{listeners[name]=cb}},
window:{},console,Date};
context.switchTab=function(tab){context.state.tab=tab;context.render()};
context.goGuide=function(id){context.state.topic=id;context.state.tab='guided'};
vm.runInNewContext(file,context,{filename:'themen-training.js'});
const api=context.window.ErdkundeThemenTraining;
assert.equal(api.topics,1);
for(let i=1;i<=3;i++){let a=api.trainingPool('a',i);assert.ok(a.length>=6,'Six tasks per level');assert.equal(new Set(a.map(q=>q.id)).size,a.length)}
assert.match(context.renderLesson(),/Übungen zu Atlas/);
assert.match(context.renderLearn(),/Jedes Thema in drei Schwierigkeitsstufen/);
const action=(name)=>listeners.click({target:{closest:()=>({dataset:{train:name}})},preventDefault(){},stopPropagation(){}});
action('home');assert.match(main.innerHTML,/Stufe 3/);
action('start:a:1');assert.match(main.innerHTML,/Aufgabe 1 von 6/);
action('hint');assert.match(main.innerHTML,/Hinweis 1/);
for(let i=0;i<6;i++){
 listeners.change({target:{name:'tt-answer',value:String(i%2)}});
 if(i<5)action('next');
}
action('submit');
assert.match(main.innerHTML,/Kurzlösung:/);
assert.match(main.innerHTML,/<details class="tt-steps">/);
assert.match(main.innerHTML,/Geführte Musterlösung Schritt für Schritt/);
assert.match(main.innerHTML,/Schritt 1/);
assert.match(main.innerHTML,/3 \/ 6 richtig/);
action('home');assert.match(main.innerHTML,/Letzte Übung/);
console.log('Themenübungen: Auswahl, drei Niveaus, Hinweise, Wertung und ausklappbare Lösungen erfolgreich getestet.');
