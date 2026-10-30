/* Integrationstests ohne Browser- oder Paketabhängigkeiten. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const dir=__dirname, app=fs.readFileSync(path.join(dir,'videos-app.js'),'utf8');
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(dir,'service-worker.js'),'utf8');
const out=path.join(dir,'..','filme','videos');
assert.match(html,/<link rel="stylesheet" href="videos-app.css">/);
assert.match(html,/<script src="videos-app.js"><\/script>/);
assert.match(sw,/videos-app.js/);
assert.match(sw,/videos-app.css/);
assert.match(app,/controls playsinline preload="none"/);
assert.match(app,/data-gv-open/);
assert.match(app,/details class="gv-expand"/);
assert.match(app,/file:/);
for(let n=1;n<=7;n++){
  const f=path.join(out,'folge-'+n+'.mp4');
  assert(fs.existsSync(f),'Video '+n+' fehlt im öffentlichen Repository');
  assert(fs.statSync(f).size>200000,'Video '+n+' scheint unvollständig');
}
new vm.Script(app,{filename:'videos-app.js'});
const handlers={}, added=[];
const fakeEl=()=>({classList:{toggle(){}},setAttribute(){},insertAdjacentHTML(position,html){added.push(html)},scrollIntoView(){}});
const root={
  querySelector(){return null},
  appendChild(){},
};
const main={
  innerHTML:'',
  querySelector(sel){if(sel==='.flash > .hero'||sel==='.section-head, .hero'||sel==='.flash'||sel==='.gv-stage')return fakeEl();return null}
};
const state={tab:'start',view:'home',topic:'geographie',lab:'coords',printSet:null};
const doc={
  getElementById(id){return id==='tabs'?root:null},
  createElement(){return {dataset:{},insertAdjacentElement(){}}},
  documentElement:{dataset:{},style:{setProperty(){}}},
  querySelectorAll(){return [fakeEl()]},
  addEventListener(type,fn){handlers[type]=fn},
};
const context={
  document:doc,location:{protocol:'https:'},window:{},MAIN:main,state,
  progress:{theme:'light',contrast:'normal',font:1},
  updateStars(){},
  render(){main.innerHTML='<div class="flash">Die Original-App wird angezeigt.</div>'},
  switchTab(tab){state.tab=tab;state.view='home';context.render();}
};
vm.createContext(context);
vm.runInContext(app,context,{timeout:3000});
assert.equal(context.window.ErdkundeVideos.count,7);
assert(added.some(s=>s.includes('Erdkunde sehen und verstehen')),'Startseiten-Einstieg fehlt');
context.window.ErdkundeVideos.open(6);
assert.equal(state.tab,'videos');
assert.match(main.innerHTML,/Das Gradnetz und Koordinaten/);
assert.match(main.innerHTML,/videos\/folge-6.mp4/);
assert.equal((main.innerHTML.match(/data-gv-film="\d+"/g)||[]).length>=7,true);
context.window.ErdkundeVideos.open(7);
assert.match(main.innerHTML,/videos\/folge-7.mp4/);
state.tab='learn';state.view='lesson';state.topic='perspektive';added.length=0;context.render();
assert(added.some(s=>s.includes('videos/folge-5.mp4')),'Passender Film für Draufsicht und Seitenansicht fehlt');
state.tab='guided';state.view='guide';state.topic='gradnetz';added.length=0;context.render();
assert(added.some(s=>s.includes('videos/folge-6.mp4')),'Gradnetz-Film fehlt im Lernbegleiter');
state.tab='lab';state.view='home';state.lab='atlas';added.length=0;context.render();
assert(added.some(s=>s.includes('videos/folge-7.mp4')),'Atlas-Film fehlt im Labor');
state.tab='tests';state.view='quiz';added.length=0;context.render();
assert.equal(added.length,0,'Kein Video bei laufender Klassenarbeit einfügen');
console.log('OK: 7 MP4-Dateien, Hauptnavigation, Startseite, Lernpfad, Lernbegleiter, Atlas, Prüfungsmodus und Offlinecache');
