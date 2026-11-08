'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'maja-plus.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'maja-plus.css'),'utf8');

assert(html.includes('maja-plus.js?v=20261108'),'Lernstudio script linked');
assert(html.includes('maja-plus.css?v=20261108'),'Lernstudio stylesheet linked');
for(const route of ['tagesplan','fehlertraining','einstellungen']){
  assert(html.includes("page==='"+route+"'"),'Route '+route+' is registered');
}
assert(!html.includes('Beispiel für diese Aufgabe: ${q.answer}.'),'Guided mode must not disclose the answer');
assert(!html.includes('Bei -nis lernst du den Artikel mit: das Erlebnis, aber die Kenntnis.'),'No target solution in guidance');
assert(css.includes('data-maja-contrast'),'Accessible high-contrast option exists');

const scripts=[...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/g)].map(m=>m[1]).filter(x=>x.trim());
assert(scripts.length>=8,'Expected the existing app scripts');
for(const script of scripts)new vm.Script(script);
new vm.Script(js);

const values=new Map();
const localStorage={
  getItem:key=>values.get(key)||null,
  setItem:(key,value)=>values.set(key,value),
  key:index=>[...values.keys()][index],
  get length(){return values.size;}
};
const sample={id:'n1-s0',prompt:'Bilde das Nomen',answer:'die Zeichnung',type:'write',skill:'ung'};
const saved={'nomen:test:1':{done:true,answers:[{id:'n1-s0',given:'Zeichnung',correct:false,skill:'ung'}]}};
const sandbox={
  window:{},document:{documentElement:{dataset:{}}},
  localStorage,prepRead:()=>saved,prepTasks:()=>[sample],
  prepCorrect:(q,answer)=>q.answer===answer,escapeHtml:s=>s
};
vm.runInNewContext(js,sandbox);
const plus=sandbox.window.MajaPlus;
assert(plus&&typeof plus.showDaily==='function');
assert.equal(plus.mistakes().length,1);
assert.equal(plus.mistakes()[0].q.skill,'ung');
assert(plus.skillHelp(sample).includes('Rettung'));
assert.equal(sandbox.document.documentElement.dataset.majaFont,'normal');
console.log('Majas Lernstudio: Integration, Syntax und Fehlertrainer geprüft.');
