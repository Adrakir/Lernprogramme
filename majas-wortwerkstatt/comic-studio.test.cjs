'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=__dirname;
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const studio=fs.readFileSync(path.join(dir,'comic-studio.js'),'utf8');
const css=fs.readFileSync(path.join(dir,'comic-studio.css'),'utf8');

assert(html.includes('comic-studio.js?v=20261108c'),'Comic studio script linked');
assert(html.includes('comic-studio.css?v=20261108c'),'Comic studio style linked');
assert(html.includes("if(page==='comicstudio')"),'Comic studio route registered');
assert(html.includes('window.MajaComicStudio?.stop()'),'Comic studio playback stopped on navigation');
assert(html.includes('href="#comicstudio"'),'User can open Comic studio');
assert(css.includes('max-width:700px'),'Mobile styling present');

const scripts=html.split('<script>').slice(1).map(x=>x.split('</script>')[0]).filter(x=>x.trim());
for(const js of scripts)new vm.Script(js);
new vm.Script(studio);
const sandbox={
  window:{speechSynthesis:{cancel(){}}},
  localStorage:{getItem(){return null},setItem(){}},
  document:{},
};
vm.runInNewContext(studio,sandbox);
const api=sandbox.window.MajaComicStudio;
assert(typeof api.render==='function'&&typeof api.stop==='function');
assert.equal(api.questions.length,8,'Eight guided comic questions');
assert.equal(api.steps.length,6,'Six steps of writing process');
assert.equal(new Set(api.questions.map(x=>x.q)).size,8,'Unique questions');
for(const q of api.questions){
  assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3,'Valid correct choice');
  assert(q.options.length===3&&new Set(q.options).size===3,'Distinct distractors');
  assert(q.hint&&q.why&&q.skill,'A helpful explanation is always provided');
  assert(q.panel>=0&&q.panel<24,'Every image maps to the published comic');
}
api.stop();
console.log('Comicstudio: 8 Aufgaben, 6 Schreibphasen, Syntax, Route und mobile Darstellung geprüft.');