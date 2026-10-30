'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>new Function('const window={};'+read(p)+';return Object.values(window)[0]')();
const all={
 studio:load('studio-data.js'),
 academy:load('academy-data.js'),
 upgrade:load('upgrade-data.js'),
 course:load('course-data.js')
};
const nonempty=s=>typeof s==='string'&&s.trim().length>=7;
test('Deutsch: Fachinhalte, Lösungsbegründungen, Lernziele und Aufgabenbanken vollständig',()=>{
 const {studio,academy,upgrade,course}=all;
 let checks=0;function ok(x,message){assert.ok(x,message);checks++;}
 ok(studio.pathway.length===7,'sieben Lernpfad-Stationen');
 ok(studio.stories.length===6,'sechs unterschiedliche Geschichten');
 ok(studio.exams.length===8,'acht Kern-Schreibarbeiten');
 ok(studio.rubric.length===6,'transparentes Bewertungsraster');
 ok(studio.labs.length===6,'sechs Leselabore');
 const unique=(array,name)=>ok(new Set(array.map(x=>x.id)).size===array.length,name+' eindeutige IDs');
 for(const [name,items] of [['Geschichten',studio.stories],['Klassenarbeiten',studio.exams],['Textlabore',studio.labs],['Diagnose',academy.diagnostics],['Reparatur',academy.repairs],['Kurse',course.lessons],['Bildgeschichten',upgrade.sequences]])unique(items,name);
 for(const d of studio.stories){
  ok(nonempty(d.name)&&nonempty(d.setting)&&nonempty(d.people)&&nonempty(d.purpose),'Geschichte mit Figuren, Ort und Anlass '+d.id);
  ok(nonempty(d.hint)&&nonempty(d.obstacle)&&nonempty(d.peak)&&nonempty(d.ending),'Geschichte mit rotem Faden '+d.id);
  ok(d.panels.length===4&&d.panels.every(p=>p.length===3&&!!p[0]&&nonempty(p[1])&&nonempty(p[2])),'vier verständliche Handlungsbilder '+d.id);
  ok(d.ideas.length>=2,'Anregungen zur eigenen Geschichte '+d.id);
 }
 for(const d of studio.exams){
  ok(nonempty(d.title)&&nonempty(d.task)&&d.guide.length===4,'Klassenarbeit mit Auftrag und vier Planungsschritten '+d.id);
  ok(d.guide.every(nonempty),'Lösungshinweise in Klassenarbeit '+d.id);
 }
 for(const d of studio.labs){
  ok(nonempty(d.weak)&&nonempty(d.better)&&nonempty(d.explain),'Mustertext und Begründung '+d.id);
  ok(d.fragments.length>=4&&d.fragments.every(p=>p.length===2&&nonempty(p[0])&&studio.tags[p[1]]),'Handlung, Gedanken, Gefühle, Höhepunkt '+d.id);
 }
 ok(academy.skills.length===6,'sechs erzählerische Kompetenzen');
 ok(academy.diagnostics.length===12,'12 Orientierungsfragen');
 for(const q of academy.diagnostics){
  ok(academy.skills.some(k=>k.id===q.skill),'Diagnose gehört zu Kompetenz '+q.id);
  ok(q.options.length>=3&&new Set(q.options).size===q.options.length,'eindeutige Antwortmöglichkeiten '+q.id);
  ok(Number.isInteger(q.right)&&q.right>=0&&q.right<q.options.length,'gültige richtige Antwort '+q.id);
  ok(nonempty(q.why),'begründete Lösung '+q.id);
 }
 ok(academy.repairs.length===12,'zwölf Textreparaturaufgaben');
 for(const q of academy.repairs){
  ok(academy.skills.some(k=>k.id===q.skill),'Textreparatur gehört zu Kompetenz '+q.id);
  ok(nonempty(q.weak)&&nonempty(q.model)&&nonempty(q.problem)&&nonempty(q.prompt),'Mustertext, Lernziel, Arbeitsauftrag '+q.id);
  ok(Array.isArray(q.steps)&&q.steps.length>=2,'mehrstufige Hilfe '+q.id);
 }
 ok(upgrade.sequences.length===3,'drei eigenständige Bildergeschichten');
 for(const d of upgrade.sequences)ok(d.scenes.length===6&&d.scenes.every(x=>nonempty(x.action)&&nonempty(x.title)&&nonempty(x.detail)),'sechs logisch beschriebene Bilder '+d.id);
 ok(course.lessons.length===8,'acht fachliche Kurseinheiten');
 for(const d of course.lessons){
  ok(nonempty(d.goal)&&nonempty(d.rule)&&nonempty(d.intro)&&nonempty(d.takeaway),'Lernziel, Erklärung, Merksatz '+d.id);
  ok(d.tasks.length===2&&d.tasks.every(x=>nonempty(x.prompt)&&nonempty(x.explain)),'zwei erklärende Kursaufgaben '+d.id);
 }
 console.log('PASS: '+checks+' fachliche Datenprüfungen über sechs Geschichten, 20 Klassenarbeitsangebote, 12 Diagnosefragen und 12 Reparaturfälle.');
});
test('Deutsch: Alle Offline-Bestandteile existieren und Installationen dürfen nicht unvollständig gelingen',()=>{
 const worker=read('sw.js');
 const core=worker.match(/const CORE=(\[[\s\S]*?\]);/);
 assert.ok(core,'CORE-Offline-Dateiliste');
 const files=new Function('return '+core[1])();
 for(const f of files){
  const local=f.replace(/^\.\//,'').replace(/\?.*$/,'');
  if(local==='')continue;
  assert.ok(fs.existsSync(path.join(root,local)),'Offline-Datei fehlt: '+f);
 }
 const webps=files.filter(f=>f.endsWith('.webp'));
 assert.ok(webps.length>=9,'Originalbilder vorhanden');
 assert.ok(files.includes('./image-compat.js?v=1'),'Safari-Bildkompatibilität offline verfügbar');
 for(const source of webps){
  const fallback=source.replace('.webp','.jpg');
  assert.ok(files.includes(fallback),'JPEG-Bild nicht im Offlinecache registriert: '+fallback);
  const binary=fs.readFileSync(path.join(root,fallback.slice(2)));
  assert.ok(binary.length>1500&&binary[0]===255&&binary[1]===216,'JPEG-Datei nicht lesbar: '+fallback);
 }
 assert.ok(read('index.html').includes('studio.css?v=3'),'Neue Mobilbilder werden über aktualisiertes CSS geladen');
 assert.ok(worker.includes('await Promise.all(CORE.map'),'Offline-Installationsdateien werden vollständig geprüft');
 assert.ok(!worker.includes('Promise.allSettled(CORE.map'),'Keine versteckten Offline-Ladefehler');
 console.log('PASS: '+files.length+' Offline-Ressourcen vorhanden und vollständige Installation erzwungen.');
});
