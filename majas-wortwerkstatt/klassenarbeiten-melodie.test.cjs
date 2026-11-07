const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),a=html.indexOf('// Two preparation courses'),b=html.indexOf('function render(initial=false)',a),c={assert,console,structuredClone};vm.createContext(c);vm.runInContext(html.slice(a,b),c);
vm.runInContext(`
const tracks=new Set(),ids=new Set();
for(let n=1;n<=5;n++){
 const hearing=prepTasks('hoeren','test',n);assert.equal(hearing.length,5);tracks.add(hearing[0].track);
 const nouns=prepTasks('nomen','test',n);assert.equal(nouns.length,15);assert.deepEqual(nouns.slice(0,5).map(q=>q.skill),['ung','heit','keit','schaft','nis']);
 for(const q of [...hearing,...nouns]){assert(!ids.has(q.id));ids.add(q.id);assert(prepCorrect(q,q.answer));assert(!prepCorrect(q,'falsch'));if(q.options){assert(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);}}
}
assert.equal(tracks.size,5);assert.equal(prepCorrect({answer:'die Zeichnung'},'Die Zeichnung'),true);assert.equal(prepCorrect({answer:'die Zeichnung'},'die zeichnung'),false);
assert.equal(prepPercent([{correct:true},{correct:true},{correct:true},{correct:true},{correct:false}]),80);assert.equal(prepPercent([{correct:true},{correct:true},{correct:true},{correct:false},{correct:false}]),60);
assert.equal(melodySongs.length,5);for(const song of melodySongs){const ns=melodyNotes(song);assert.equal(ns.length,song.beats.length);assert(ns.every(n=>Number.isFinite(melodyPitch(n.note))&&n.beats>0));assert(new Set(ns.map(n=>n.note)).size<=8);}
assert(melodyTiming(550,550));assert(melodyTiming(350,550));assert(!melodyTiming(50,550));assert(!melodyTiming(1200,550));assert(Math.abs(melodyPitch('A4')-440)<.001);
let wallet={rewards:{}},writes=0;function starRefresh(){return wallet;}function starDay(){return '2026-11-07';}function starCommit(next){wallet=next;writes++;return true;}
prepReward('nomen','test',1,60);assert.equal(wallet.rewards['prep:nomen:test:1'].amount,1);prepReward('nomen','test',1,60);assert.equal(writes,1);prepReward('nomen','test',1,80);assert.equal(wallet.rewards['prep:nomen:test:1'].amount,2);prepReward('nomen','test',1,100);assert.equal(writes,2);
`,c);
// Every bundled script must parse, and every final listening track must have a recording.
for(const [,script]of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script);
const names=vm.runInContext('prepListen.map(x=>x[0])',c);for(const name of names)assert(html.includes(name));
console.log('PASS: ten distinct final tests, five suffix groups per test, correct capitalization, 80% threshold, reward upgrades without farming, five melodies, pitches and hold-duration checks.');
