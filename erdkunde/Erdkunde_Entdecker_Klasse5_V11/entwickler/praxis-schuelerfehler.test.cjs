'use strict';
/* Simulierte Schülerfehler: keine realen Testkinder, sondern reproduzierbare
   Lösungsversuche inklusive Diagnose, Verstehensfrage und Wiederholungsweg. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const code=fs.readFileSync(path.join(__dirname,'pruefungsfit-praxis.js'),'utf8');
let assertions=0;
function ok(value,label){assert.ok(value,label);assertions++;}
function contains(text,fragment,label){assert.ok(text.includes(fragment),label+' -> '+fragment);assertions++;}
function setup(){
 const handlers={},store=new Map(),main={innerHTML:'',querySelector:()=>({setAttribute(){},focus(){}})};
 const completed=[];
 const topics=['linien','gradnetz','haelften','viertel','koordinaten','atlas','ansichten','karte'].map(id=>({id}));
 const context={document:{getElementById:id=>id==='main'?main:null,addEventListener:(name,cb)=>handlers[name]=cb},localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)},window:{Pruefungsfit:{topics,startUnit:n=>completed.push(['unit',topics[n].id])}},switchTab:t=>completed.push(['tab',t]),console};
 vm.runInNewContext(code,context,{filename:'pruefungsfit-praxis.js'});
 function click(command){const b={dataset:{praxis:command}};handlers.click({target:{closest:q=>q==='[data-praxis]'?b:null},preventDefault(){},stopPropagation(){}});}
 return {api:context.window.PruefungsPraxis,main,store,click,completed};
}
function attempt(station,good){
 const {api,main,store,click,completed}=setup();
 api.start(station);
 const tasks=station==='grid'?api.coordTasks:station==='compass'?api.compassTasks:api.atlasTasks;
 for(let i=0;i<tasks.length;i++){
  if(station==='grid'){
   if(good){
    const t=tasks[i],move=(direction,n)=>{for(let k=0;k<n;k++)click('move:'+direction);};
    move(t.lat<0?'south':'north',Math.abs(t.lat)/30);
    move(t.lon<0?'west':'east',Math.abs(t.lon)/30);
    if(t.lat===0&&t.lon===0){click('move:north');click('move:south');}
   }else click('move:north');
  }else if(station==='compass'){
   const t=tasks[i],correct=(t.target-t.north+8)%8;
   click('answer:'+(good?correct:(correct+1)%8));
  }else{
   const id=tasks[i],record=api.entries[id];
   click('entry:'+(good?id:(id+1)%api.entries.length));
   click('cell:'+record.cell);
  }
  click('check');
  if(good){
   contains(main.innerHTML,'✓ Richtig','richtige Aufgabe '+station+' '+i);
   ok(!main.innerHTML.includes('praxis-understand'), 'keine unnötige Verstehensfrage');
  }else{
   contains(main.innerHTML,'Gustavs Hinweis','Diagnose '+station+' '+i);
   contains(main.innerHTML,'Gustavs Lösungsweg','Erklärung '+station+' '+i);
   contains(main.innerHTML,'Kannst du den Denkfehler jetzt erklären?','Transferfrage '+station+' '+i);
   click('reflect-check');
   contains(main.innerHTML,'Wähle zuerst','Eingabe vor Korrektur');
   const correct=main.innerHTML.includes('Welche Angabe führt nach Osten oder Westen?')?1:0;
   click('reflect:'+(1-correct));click('reflect-check');
   contains(main.innerHTML,'Noch nicht ganz','Fehler bei Transferfrage');
   click('reflect:'+correct);click('reflect-check');
   contains(main.innerHTML,'Verstanden!','Transferfrage verstanden');
  }
  click('next');
 }
 contains(main.innerHTML,(good?tasks.length:0)+' von '+tasks.length+' Aufgaben','Zusammenfassung '+station);
 const summary=JSON.parse(store.get('erdkunde-pruefungsfit-praxis-v1'));
 ok(summary[station].score===(good?6:0),'originale Bewertung '+station);
 ok(summary[station].errors===(good?0:6),'Fehlererfassung '+station);
 if(!good){
  contains(main.innerHTML,'6 von 6 Verstehensfragen','sechs begründete Fehler '+station);
  contains(main.innerHTML,'Denkfehler erklärt','Diagnose im Lernstand '+station);
  click('train');
  ok(completed.some(x=>x[0]==='tab'&&x[1]==='pruefung'),'Navigation Prüfungsfit '+station);
  const expected={grid:'koordinaten',compass:'karte',atlas:'atlas'}[station];
  ok(completed.some(x=>x[0]==='unit'&&x[1]===expected),'passende Schulung '+station);
 }
 return {api,main,store,click};
}
for(const station of ['grid','compass','atlas']){
 attempt(station,true);attempt(station,false);
}
{
 const {api,main,click}=setup();api.start('grid');
 click('move:south');click('move:east');click('move:east');click('check');
 contains(main.innerHTML,'Breite und Länge vertauscht','vertauschte Koordinaten');
 click('reflect:0');click('reflect-check');contains(main.innerHTML,'Verstanden!','Reihenfolge gelernt');
}
{
 const {api,main,click}=setup();api.start('grid');
 click('move:north');click('move:north');click('check');
 contains(main.innerHTML,'Die Breite stimmt schon','Längenfehler isoliert');
 click('reflect:0');click('reflect-check');contains(main.innerHTML,'Noch nicht ganz','falsche Reflexion bei Längenfehler');
 click('reflect:1');click('reflect-check');contains(main.innerHTML,'Verstanden!','richtige Reflexion Längengrad');
}
{
 const {api,main,click}=setup();api.start('grid');
 click('move:west');click('check');
 contains(main.innerHTML,'Die Länge stimmt schon','Breitenfehler isoliert');
}
{
 const {api,main,click}=setup();api.start('atlas');
 click('entry:1');click('cell:B3');click('check');
 contains(main.innerHTML,'Den Ort hast du richtig gefunden','Planquadratfehler isoliert');
 contains(main.innerHTML,'Spalte C, Zeile 2','Planquadrat in Frage erklärt');
}
{
 const {api,main,click}=setup();api.start('grid');click('check');
 contains(main.innerHTML,'Markiere zuerst','fehlende Antwort');
 ok(!main.innerHTML.includes('praxis-understand'),'keine Lösung bei leerer Eingabe');
 click('move:north');click('check');contains(main.innerHTML,'Kannst du den Denkfehler','Nachholen möglich');
}
console.log(assertions+' simulierte Schüler-Prüfungen erfolgreich: 18 richtige + 18 falsche Lösungen, 36 Verstehensfragen und typische Fehlvorstellungen.');
