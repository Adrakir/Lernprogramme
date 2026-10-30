// Fachlicher Datentest unabhängig vom Browser.
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const app=read('app.js'),curr=read('curriculum.js'),extension=read('extension-content.js');
const begin=app.indexOf('const notes='),end=app.indexOf('function symbol(');
assert.ok(begin>=0&&end>begin,'notenbezogene Grunddaten vorhanden');
const model=new Function(app.slice(begin,end)+'\n'+curr+'\n'+extension+'\nreturn {notes,rests,dotted,dottedRests,all,get,val,MUSIC_PATH};')();
const {get,val,MUSIC_PATH}=model;
let assertions=0;const ok=(value,info)=>{assert.ok(value,info);assertions++;};
ok(MUSIC_PATH.length===27,'27 Lernschritte');
ok(new Set(MUSIC_PATH.map(d=>d.key)).size===27,'eindeutige IDs');
ok(MUSIC_PATH.every(d=>d.steps.length===3&&d.hints.length===3),'drei Gedanken und Hilfen je Schritt');
for(const [id,u] of Object.entries({w:16,h:8,q:4,e:2,s:1})){
 ok(val(id)===u,'Wert '+id);
 ok(val(id+'r')===u,'Pause '+id);
 if(id!=='s'){ok(val(id+'d')===u*1.5,'punktierte Note '+id);ok(val(id+'rd')===u*1.5,'punktierte Pause '+id);}
}
ok(val('barrest',3)===12&&val('barrest',4)===16,'Ganztaktpause');
let questions=0,notation=0,exceptions=[];
for(const [i,d] of MUSIC_PATH.entries()){
 ok(typeof d.title==='string'&&d.title.length>8,'Titel '+i);
 ok(typeof d.goal==='string'&&d.goal.length>20,'Lernziel '+i);
 ok(typeof d.rule==='string'&&d.rule.length>18,'Merksatz '+i);
 ok(Array.isArray(d.questions)&&d.questions.length===8,'acht Fragen '+i);
 for(const [j,q] of d.questions.entries()){
  questions++;
  ok(q.options.length>=3&&new Set(q.options).size===q.options.length,'Optionen '+i+'/'+j);
  ok(q.options.includes(q.answer),'Antwort '+i+'/'+j);
  ok(q.why?.length>=20,'Lösung '+i+'/'+j);
  if(!q.ids)continue;
  notation++;
  ok(q.ids.length>0,'Notenfolge '+i+'/'+j);
  ok(q.ids.every(id=>id==='?'||!!get(id)),'Notensymbole '+i+'/'+j);
  if(q.meter!==true)continue;
  const known=q.ids.filter(id=>id!=='?').reduce((sum,id)=>sum+val(id,q.m),0);
  const diff=known-q.m*4;
  if(diff!==0)exceptions.push({step:d.key,question:q.q,diff});
  ok(Math.abs(diff)<=4,'Taktabweichung maximal ein Schlag '+i+'/'+j);
 }
}
ok(questions===216,'216 Fragen');
ok(notation>=140,'mindestens 140 Notenbilder');
const wordMatch=app.match(/const wordIds=(\{[^;]+\});/);
ok(!!wordMatch,'Worttakt-Baukasten');
const wordIds=new Function('return '+wordMatch[1])();
for(const [word,ids,onsets] of [
 ['Brot',['q'],1],['Käse',['e','e'],2],['Schokolade',['s','s','s','s'],4],['Ananas',['s','s','e'],3]
]){
 ok(JSON.stringify(wordIds[word])===JSON.stringify(ids),word+' Notenwerte');
 ok(ids.reduce((sum,id)=>sum+val(id),0)===4,word+' ein Schlag');
 ok(ids.length===onsets,word+' Tonanfänge');
}
const words=MUSIC_PATH.find(d=>d.key==='woerter');
ok(words.pattern.reduce((sum,id)=>sum+val(id),0)===16,'Wortfolge füllt 4/4');
ok(words.pattern.length===10,'vier Wortgruppen ergeben zehn Tonanfänge');
ok(words.questions.some(q=>q.q.includes('A-na-nas')),'Ananas wird abgefragt');
ok(words.steps.some(p=>p.includes('nas')&&(p.includes('doppelt so lang')||p.includes('länger'))),'Ananas Silbendauer erklärt');
ok(app.includes("wordCard('Ananas','A – na – nas',['s','s','e'])"),'Ananas-Wortkarte');
console.log('PASS: '+assertions+' Fachchecks; '+questions+' Fragen, '+notation+' Notenbilder, vier Rhythmuswörter, '+exceptions.length+' Lücken-/Fehlertakte.');
