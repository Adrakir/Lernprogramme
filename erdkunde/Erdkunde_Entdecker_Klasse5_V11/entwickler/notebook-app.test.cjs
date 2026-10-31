'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const p=__dirname,src=fs.readFileSync(path.join(p,'notebook-app.js'),'utf8'),html=fs.readFileSync(path.join(p,'index.html'),'utf8'),css=fs.readFileSync(path.join(p,'notebook-app.css'),'utf8'),worker=fs.readFileSync(path.join(p,'service-worker.js'),'utf8');
const url='https://notebook.google.com/notebook/cc98ffba-22b1-4d1b-9326-0c17a86323c0';
assert(src.includes(url),'Exakte Notebook-Adresse fehlt');
assert(html.includes('<script src="notebook-app.js"></script>'),'Notebook-JavaScript im Quell-HTML fehlt');
assert(html.includes('<link rel="stylesheet" href="notebook-app.css">'),'Notebook-CSS im Quell-HTML fehlt');
assert(worker.includes('notebook-app.js')&&worker.includes('notebook-app.css'),'Offline-Cache aktualisieren');
assert(css.includes('@media(max-width:470px)'),'Mobile Darstellung nicht vorgesehen');
assert(src.includes('target="_blank" rel="noopener noreferrer"'),'Sicheres Öffnen des Google-Links fehlt');
assert(src.includes('öffentlich für Personen mit dem Link freigegeben'),'Hinweis auf öffentliches Notebook fehlt');
assert(src.includes('Google-Konto erforderlich'),'Google-Anmeldung muss korrekt erläutert werden');
new vm.Script(src,{filename:'notebook-app.js'});
const inserts=[];
const node=()=>({insertAdjacentHTML(pos,value){inserts.push(value)},querySelector(sel){return node()}});
const context={
  MAIN:{querySelector(sel){return sel==='.flash'?node():null}},
  state:{tab:'start',view:'home',printSet:null},
  render(){},
  window:{}
};
vm.createContext(context);vm.runInContext(src,context,{timeout:1000});
assert.equal(context.window.ErdkundeNotebook.url,url);
assert(inserts.some(x=>x.includes(url)),'Notebook nicht auf Startseite sichtbar');
inserts.length=0;context.state.tab='learn';context.state.view='home';context.render();
assert(inserts.some(x=>x.includes('Erdkunde-Notebook')),'Notebook in Lernpfaden fehlt');
inserts.length=0;context.state.tab='tests';context.state.view='quiz';context.render();
assert.equal(inserts.length,0,'Notebook soll nicht die Klassenarbeit verdecken');
console.log('OK: Exakter Link, Erdkunde-Zuordnung, Startseite/Lernpfade, Sicherheitsattribute, Mobilansicht, keine Ablenkung in Klassenarbeit.');
