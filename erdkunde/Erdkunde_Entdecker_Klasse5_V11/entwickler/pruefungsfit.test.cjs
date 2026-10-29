'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'pruefungsfit.js'),'utf8');
let n=0;function ok(v,m){assert.ok(v,m);n++}function equal(a,b,m){assert.equal(a,b,m);n++}
const listeners={},main={innerHTML:'',querySelector:()=>null},tab={insertAdjacentHTML(where,html){this.added=(this.added||'')+html;}};
const nav={querySelector:k=>k==='[data-tab="tests"]'?tab:null};
const store=new Map();
const document={getElementById:id=>id==='tabs'?nav:id==='main'?main:null,addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)};
const context={document,window:{confirm:()=>true},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},state:{tab:'start',view:'home'},render(){},renderTests(){return '<section>Alte Tests</section>';},renderStart(){return '<section>Alter Start</section>';},switchTab(t){context.state.tab=t;context.state.view='home';context.render();},console};
vm.createContext(context);vm.runInContext(source,context);
const api=context.window.Pruefungsfit;ok(api,'API vorhanden');equal(api.topics.length,8);equal(api.questionCount,48);
for(const t of api.topics){equal(t.qs.length,6,t.id);equal(t.steps.length,4,t.id);ok(t.goal.length>30,t.id+' hat ein Lernziel');ok(t.mistake.length>40,t.id+' hat typische Fehler');ok(t.rule.length>30,t.id+' hat eine Merkregel');
 for(const q of t.qs){equal(q[1].length,4,t.id);ok(Number.isInteger(q[2])&&q[2]>=0&&q[2]<4,'korrekte Antwort im Bereich');ok(q[3].length>35,'fachliche Begründung');}
 for(let i=1;i<=4;i++){const svg=api.art(t,i);ok(svg.includes('<svg')&&svg.includes('</svg>'),t.id+' Grafik '+i);ok(svg.includes('Bildschritt '+i+' von 4'),t.id+' Grafikschritt '+i);}}
ok(tab.added.includes('data-tab="pruefung"'),'Navigation');
ok(context.renderStart().includes('Prüfungsfit')&&context.renderStart().includes('Alter Start'),'Start nicht ersetzt');
ok(context.renderTests().includes('Prüfungsfit')&&context.renderTests().includes('Alte Tests'),'Vorhandene Tests erhalten');
api.startUnit(0);context.state.tab='pruefung';context.render();ok(main.innerHTML.includes('Äquator und Nullmeridian'),'Lernpfad sichtbar');
api.startTest();context.render();ok(main.innerHTML.includes('24 Aufgaben'),'Probeprüfung vorhanden');
function click(a){const b={dataset:{pf:a}};const e={target:{closest:()=>b},preventDefault(){},stopPropagation(){}};listeners.click.forEach(fn=>fn(e));}
click('submit');ok(main.innerHTML.includes('Deine Auswertung'),'Abgabe zeigt Auswertung');
ok(main.innerHTML.includes('24'),'Aufgabenanzahl nach Abgabe');
click('overview');ok(main.innerHTML.includes('acht Lernwege'),'Übersicht');
console.log(n+' Prüfungen bestanden: 8 Lernwege, 48 Fragen, SVG-Bildschritte, Navigation, Probepruefung, Abgabe und Rueckmeldung.');