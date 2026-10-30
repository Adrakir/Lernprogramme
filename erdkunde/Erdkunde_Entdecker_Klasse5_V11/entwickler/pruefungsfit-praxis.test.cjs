'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const script=fs.readFileSync(path.join(__dirname,'pruefungsfit-praxis.js'),'utf8');
const handlers={};
const main={innerHTML:'',querySelector:()=>({setAttribute(){},focus(){}})};
const storage=new Map();
const context={
 document:{getElementById:id=>id==='main'?main:null,addEventListener:(type,fn)=>handlers[type]=fn},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 window:{},console
};
vm.runInNewContext(script,context);
const p=context.window.PruefungsPraxis;
assert.ok(p,'Werkstatt-API vorhanden');
assert.equal(p.coordTasks.length,6);
assert.equal(p.compassTasks.length,6);
assert.match(p.compassTasks[3].why,/Nordosten/,'Gedrehter Nordpfeil: Nordost');
for(const t of p.compassTasks)assert.ok(Number.isInteger((t.target-t.north+8)%8),'Kompassrichtung berechenbar');
assert.equal(p.atlasTasks.length,6);
assert.equal(p.coord(60,-30),'60° N / 30° W');
assert.equal(p.coord(-30,120),'30° S / 120° O');
assert.equal(p.coord(0,0),'0° / 0°');
assert.equal(p.entries[1].region,'Brandenburg');
assert.equal(p.entries[1].cell,'C2');
function click(action){
 const item={dataset:{praxis:action}};
 handlers.click({target:{closest:s=>s==='[data-praxis]'?item:null},preventDefault(){},stopPropagation(){}});
}
p.start('grid');
assert.match(main.innerHTML,/Gradnetz/);
assert.match(main.innerHTML,/30°-Schritten/);
click('move:north');click('move:north');click('move:west');p.check();
assert.match(main.innerHTML,/✓ Richtig/);
assert.match(main.innerHTML,/Grün/);
click('next');assert.match(main.innerHTML,/30° S \/ 120° O/);
p.start('compass');click('answer:7');p.check();
assert.match(main.innerHTML,/✓ Richtig/);
p.start('atlas');click('entry:1');click('cell:C2');p.check();
assert.match(main.innerHTML,/✓ Richtig/);
assert.match(main.innerHTML,/Karte <b>F<\/b>/);
p.start('atlas');click('entry:0');click('cell:B3');p.check();
assert.match(main.innerHTML,/Noch nicht richtig/);
assert.match(main.innerHTML,/Frankfurt \(Oder\)/);
assert.match(main.innerHTML,/Gustavs Lösungsweg/);
assert.match(main.innerHTML,/Schritt für Schritt/);
for(let i=1;i<6;i++){
 click('next');click('entry:0');click('cell:B3');p.check();
}
click('next');
assert.match(main.innerHTML,/Diese Aufgaben übe ich noch einmal/);
assert.match(main.innerHTML,/Passenden Lernweg mit Gustav öffnen/);
assert.ok(JSON.parse(storage.get('erdkunde-pruefungsfit-praxis-v1')).atlas.errors>0);

console.log('Praxisstationen geprüft: sechs Aufgaben pro Station, Gradnetz, gedrehter Nordpfeil, Register, Rückmeldung und Bedienung.');
