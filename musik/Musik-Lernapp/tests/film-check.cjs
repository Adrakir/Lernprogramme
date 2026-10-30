'use strict';
// Fach-/Strukturprüfung aller 27 interaktiven Lernfilme.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const a=read('app.js'),c=read('curriculum.js'),e=read('extension-content.js'),film=read('lernfilm.js');
const env=new Function(a.slice(a.indexOf('const notes='),a.indexOf('function symbol('))+'\n'+c+'\n'+e+'\n'+film+'\nreturn {MUSIC_PATH,filmGuides,filmBars,filmRow,filmBeatLabel,filmMarkup,val,get};')();
let tested=0;
for(const [index,d] of env.MUSIC_PATH.entries()){
 assert.equal(env.filmGuides[d.key].length,2,'Einfacher Erklärungstext vorhanden '+d.key);
 assert.ok(env.filmGuides[d.key].every(x=>x.length>=35&&x.length<170),'Kurze altersgerechte Texte '+d.key);
 const bars=env.filmBars(d);
 assert.ok(bars.length>=1&&bars.length<=4,'Eine bis vier Notenzeilen '+d.key);
 for(const [i,bar] of bars.entries()){
  const cells=env.filmRow(d,bar,i);
  assert.equal(cells.length,d.m*4,'Sechzehntel-Raster stimmt '+d.key+' Zeile '+i);
  assert.ok(cells.every(c=>['note','rest','gap'].includes(c.kind)),'Keine unbekannten Zellzustände '+d.key);
  assert.ok(cells.every(c=>c.kind==='gap'||env.get(c.id)),'Alle Zeichen haben gültige Notenwerte '+d.key);
  const sum=bar.reduce((v,id)=>v+(id==='?'?Math.max(0,d.m*4-v):env.val(id,d.m)),0);
  assert.ok(sum<=d.m*4,'Kein Notenbild länger als ein Takt: '+d.key+'/'+i);
  for(let beat=0;beat<d.m;beat++)assert.ok(env.filmBeatLabel(cells,beat).length>30,'Erklärung für Schlag '+beat+' in '+d.key);
 }
 const html=env.filmMarkup(d);
 assert.ok(html.includes('data-film-key="'+d.key+'"'),'Lernfilm gehört zum richtigen Lernschritt');
 assert.equal((html.match(/class="filmBeat"/g)||[]).length,bars.length*d.m,'Alle Schläge anklickbar: '+d.key);
 assert.ok(html.includes('id="filmPlay"')&&html.includes('id="filmNext"')&&html.includes('id="filmStop"'),'Bedienung vollständig: '+d.key);
 assert.ok(html.includes('role="status"')&&html.includes('aria-pressed='),'Lernfilm gibt zugängliche Rückmeldung: '+d.key);
 tested++;
}
assert.deepEqual(env.filmBars(env.MUSIC_PATH.find(d=>d.key==='woerter'))[0],['q','e','e','s','s','s','s','s','s','e']);
const gp=env.filmBars(env.MUSIC_PATH.find(d=>d.key==='generalpause'));
assert.deepEqual(gp,[['q','qr','hr'],['q','q','hr']],'Fuji und Minka als gleichzeitige Stimmen');
assert.equal(env.filmRow(env.MUSIC_PATH.find(d=>d.key==='luecken'),['q','e','e','?'],0).filter(x=>x.kind==='gap').length,8,'Zwei fehlende Schläge sind keine Pause');
console.log('PASS: '+tested+' animierte Lektionen, Ton-/Halte-/Pausenzeichen, 3/4- und 4/4-Raster, individuelle Erklärungen, 2-Stimmen-Beispiel und Taktlücken.');
