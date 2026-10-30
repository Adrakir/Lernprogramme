'use strict';
/* Lehrstoffprüfung: echte 272 Fragen, 64 Lektionen und ihre didaktischen Begründungen. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,source=fs.readFileSync(path.join(root,'lernstoff.js'),'utf8');
const ctx={console,Math,Intl};vm.createContext(ctx);
vm.runInContext(source+'\nglobalThis.CHECK={modules:MODULES,questions:Q};',ctx);
const {modules,questions}=ctx.CHECK;
let passed=0;function ok(v,message){assert.ok(v,message);passed++;}
ok(modules.length===16,'Alle 16 Geografie-Themen');
ok(questions.length===272,'272 Wissens- und Anwendungsfragen');
const IDs=new Set(),textOk=v=>typeof v==='string'&&v.trim().length>=5;
const themes=new Set(modules.map(m=>m.id));
ok(themes.size===16,'Themen-IDs sind eindeutig');
for(const m of modules){
 ok(textOk(m.title)&&textOk(m.subtitle),'Lernthema erklaert: '+m.id);
 ok(m.lessons?.length===4,'Vier aufeinander aufbauende Erklaerungen: '+m.id);
 for(const [i,l] of m.lessons.entries()){
  ok(l.length===3&&l.every(textOk),'Titel, Schulung und Merkbeispiel: '+m.id+'/'+i);
  ok(l[1].length>=70,'Erklaertext ausreichend umfangreich: '+m.id+'/'+i);
 }
 const qs=questions.filter(q=>q.topic===m.id);
 ok(qs.length>=5,'Mindestens fuenf Fragen pro Thema: '+m.id);
}
for(const q of questions){
 ok(!IDs.has(q.id),'Eindeutige Frage-ID: '+q.id);IDs.add(q.id);
 ok(themes.has(q.topic),'Uebungsthema existiert: '+q.id);
 ok(textOk(q.text)&&q.text.length>=10,'Fragestellung: '+q.id);
 ok(Array.isArray(q.opts)&&q.opts.length>=3,'Auswahloptionen: '+q.id);
 ok(new Set(q.opts).size===q.opts.length,'Antwortmoeglichkeiten unterscheiden sich: '+q.id);
 ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.opts.length,'Richtige Antwort auswaehlbar: '+q.id);
 ok(textOk(q.explain)&&q.explain.length>=20,'Fachliche Begruendung: '+q.id);
 ok(Array.isArray(q.hints)&&q.hints.length===3&&q.hints.every(textOk),'Drei freiwillige Hilfestufen: '+q.id);
}
// Kritische Werte werden unabhängig von den vorhandenen Musterlösungen nachgerechnet.
const cases=[
 ['massstab-1','100 m'],['massstab-2','2 km'],['massstab-4','5 km'],
 ['massstab-5','160 km'],['massstab-6','1 cm = 50 m'],
 ['gradnetz-1','Äquator'],['gradnetz-2','Nullmeridian'],
 ['gradnetz-6','Breite, Länge'],
 ['himmelsrichtungen-1','Nordosten'],['himmelsrichtungen-6','Nordwesten']
];
for(const [id,expected] of cases){
 const q=questions.find(q=>q.id===id);
 ok(q&&q.opts[q.answer]===expected,'Fachkontrolle: '+id+' => '+expected);
}
const scale=questions.filter(q=>q.topic==='massstab');
ok(scale.length===30,'30 Massstabsaufgaben');
const coordinate=questions.filter(q=>q.topic==='gradnetz');
ok(coordinate.length===68,'68 Gradnetzfragen');
const compass=questions.filter(q=>q.topic==='himmelsrichtungen');
ok(compass.length===38,'38 Himmelsrichtungsfragen');
console.log('PASS: '+passed+' Fachpruefungen, '+modules.length+' Themen, '+modules.reduce((n,m)=>n+m.lessons.length,0)+' Erklaereinheiten, '+questions.length+' Fragen.');
