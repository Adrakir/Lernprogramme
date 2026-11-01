'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'vorlesen.js'),'utf8');
function boot(){
 const listeners={},queue=[],stored=new Map();let available=[],cancelled=0,paused=0;
 const synth={getVoices:()=>available,speak:u=>queue.push(u),cancel(){cancelled++},addEventListener:(n,f)=>listeners[n]=f};
 const document={hidden:false,querySelectorAll:()=>[{paused:false,pause(){paused++}}],getElementById:()=>null,addEventListener:(n,f)=>listeners[n]=f};
 const window={speechSynthesis:synth,SpeechSynthesisUtterance:function(text){this.text=text;},addEventListener:(n,f)=>listeners[n]=f};
 const ctx={window,document,localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)}};
 vm.runInNewContext(source,ctx);
 return {api:window.ErdkundeSpeech,queue,listeners,document,setVoices(v){available=v},get cancelled(){return cancelled},get paused(){return paused}};
}
const b=boot();
b.setVoices([{voiceURI:'en',lang:'en-US',name:'English Natural'},{voiceURI:'basic',lang:'de-DE',name:'Basic'},{voiceURI:'neural',lang:'de-DE',name:'Katja Online Natural'}]);
let finished='';const button={textContent:'Schritt vorlesen',setAttribute(){}};
const text=Array.from({length:20},(_,i)=>'Abschnitt '+i+' erklärt die Erde mit 52.4 Grad und vollständigen Sätzen.').join(' ');
assert(b.api.speak(text,{owner:'lesson',button,onFinish:r=>finished=r}));
assert.equal(b.queue[0].voice.voiceURI,'neural');assert.equal(button.textContent,'Vorlesen stoppen');assert.equal(b.paused,1);
let i=0;while(i<b.queue.length){assert.equal(b.queue[i].lang,'de-DE');b.queue[i++].onend();}
assert.equal(b.queue.map(x=>x.text).join(' '),text);assert.equal(finished,'ended');assert.equal(button.textContent,'Schritt vorlesen');
assert.equal(b.api.spokenText('52° N und 10° O. 50,1° S.'),'52 Grad Nord und 10 Grad Ost. 50,1 Grad Süd.');
assert.equal(b.api.chunks('52.4 bleibt erhalten. Kein Wort fehlt.').join(' '),'52.4 bleibt erhalten. Kein Wort fehlt.');
assert.equal(b.api.spokenText('52°30′ N, 10°15′30″ O.'),'52 Grad 30 Minuten Nord, 10 Grad 15 Minuten 30 Sekunden Ost.');
assert.equal(b.api.spokenText('1 : 50.000; 4 cm × 50.000 = 200.000 cm; 71 %.'),'eins zu 50000; 4 cm mal 50000 bedeutet 200000 cm; 71 Prozent .');
assert.equal(b.api.spokenText('N, NO, O, SO, S, SW, W, NW.'),'Nord, Nordost, Ost, Südost, Süd, Südwest, West, Nordwest.');
assert.equal(b.api.spokenText('1. Suche N oder S. 2. Suche O oder W.'),'Schritt 1: Suche Nord oder Süd. Schritt 2: Suche Ost oder West.');
assert.equal(b.api.spokenText('207.1, L11; 50,1° S; 12.5 bleibt erhalten.'),'207.1, L11; 50,1 Grad Süd; 12.5 bleibt erhalten.');
const curriculum={};vm.createContext(curriculum);
vm.runInContext(fs.readFileSync(path.join(__dirname,'lernstoff.js'),'utf8')+';globalThis.modules=MODULES;',curriculum);
let audited=0;
for(const module of curriculum.modules)for(const lesson of module.lessons){
 const full=lesson[0]+'. '+lesson[1]+' Merke: '+lesson[2], player=boot();
 assert(player.api.speak(full,{owner:'audit'}));
 let n=0;while(n<player.queue.length){assert(n<100,'Keine Endlosschleife');player.queue[n++].onend();}
 assert.equal(player.queue.map(x=>x.text).join(' '),player.api.spokenText(full),module.id+': vollständige Erklärung und Merksatz');
 audited++;
}
assert.equal(audited,64);
b.api.speak(text,{owner:'old'});const old=b.queue.at(-1);b.api.speak('Neue Erklärung.',{owner:'new'});const size=b.queue.length;old.onend();assert.equal(b.queue.length,size,'Abgebrochene Ausgabe darf keinen weiteren Abschnitt starten');
const cancels=b.cancelled;b.api.stop('other');assert.equal(b.cancelled,cancels);b.api.stop('new');assert.equal(b.cancelled,cancels+1);
b.api.speak(text,{owner:'toggle'});assert.equal(b.api.speak(text,{owner:'toggle'}),false);
const late=boot();late.api.speak(text,{owner:'late'});assert.equal(late.queue[0].voice,undefined);late.setVoices([{voiceURI:'loaded',lang:'de-DE',name:'Anna Enhanced'}]);late.queue[0].onend();assert.equal(late.queue[1].voice.voiceURI,'loaded','Später geladene deutsche Stimmen verwenden');
late.document.hidden=true;late.listeners.visibilitychange();const count=late.queue.length;late.queue.at(-1).onend();assert.equal(late.queue.length,count);
const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const speak=app.slice(app.indexOf('function speakLesson(id){'),app.indexOf('\nfunction action('));
let delivered='';const context={window:{ErdkundeSpeech:{speak:t=>delivered=t}},mod:()=>({title:'Thema',lessons:[['Erste','Text eins','Regel eins'],['Zweite','Text zwei','Regel zwei']]}),state:{view:'guide',guideStep:2},MAIN:{querySelector:()=>null},msg(){}};
vm.runInNewContext(speak+';speakLesson("test")',context);assert.equal(delivered,'Zweite. Text zwei Merke: Regel zwei');
context.state.view='lesson';vm.runInNewContext('speakLesson("test")',context);assert(delivered.includes('Text eins')&&delivered.includes('Text zwei'));
console.log('OK: natürliche deutsche Stimme, alle Sinnabschnitte, Dezimalwerte, spätes Laden, Abbruch, Wiederholungsbutton und richtiger Lernschritt');
