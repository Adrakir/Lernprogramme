import {test} from 'node:test';
import assert from 'node:assert/strict';
import {faktoren,raster,zeilen,aufgabe,namen,punkte,bereit,type Antworten,type Ziel} from './multiplikation.ts';
import {malheft} from './multiplikation-heft.ts';
test('Die Teilprodukte, Ziffern und Überträge bilden auf jeder Stufe genau das Produkt',()=>{
 for(let stufe=0;stufe<6;stufe++)for(let i=0;i<200;i++){
  const seed=i*7919,[a,b]=faktoren(stufe,seed),rows=zeilen(a,b);
  assert.equal(rows.reduce((s,r)=>s+r.wert,0),a*b);
  for(const r of rows){
   assert.equal(r.spalten.reduce((s,c,i)=>s+c.rest*10**i,0)+r.spalten.at(-1)!.uebertrag*10**r.spalten.length,a*r.ziffer);
   for(const c of r.spalten){assert.equal(c.summe,c.z*r.ziffer+c.eingang);assert.equal(c.rest+10*c.uebertrag,c.summe);}
  }
  if(stufe===0)assert.ok(rows[0].spalten.every(c=>c.uebertrag===0));
  if(stufe===1)assert.ok(rows[0].spalten.some(c=>c.uebertrag>0));
  if(stufe===2)assert.equal(rows[0].wert,0);
  if(stufe===4)assert.equal(rows[1].wert,0);
  if(stufe===5)assert.equal(rows.filter(r=>r.wert>0).length,3);
  const task=raster(stufe,seed),w:Antworten={};
  for(const s of task.schritte)for(const f of s.felder){assert.ok(!(f.key in w));w[f.key]=String(f.wert);}
  assert.ok(bereit(task,w)&&punkte(task,w).every(p=>p.ok));
  w.produkt='';assert.equal(punkte(task,w).filter(p=>!p.ok).length,1);
 }
});
test('Übungsvarianten, freie Antworten, Null und beide Divisionsproben',()=>{
 for(const z of Object.keys(namen) as Ziel[])for(const seed of [0,28738,284952]){
  const a=aufgabe(z,seed),w:Antworten={};assert.ok(!punkte(a,w).some(p=>p.ok));
  for(const f of a.schritte.flatMap(s=>s.felder))w[f.key]=String(f.wert);
  if(z==='probe'){const [x,y,p]=a.zahlen;for(const v of [[p,x,y],[p,y,x]]){w.karten=v.join(',');assert.ok(punkte(a,w)[0].ok);}assert.ok(!punkte(a,{karten:[x,p,y].join(',')})[0].ok);}
  if(['geschichte','vergleich'].includes(z)){assert.ok(!bereit(a,w));w.text='Mein Rechenweg';}
  assert.ok(bereit(a,w));assert.ok(punkte(a,w).every(p=>p.ok));
 }
 assert.deepEqual(zeilen(24,13).map(r=>r.wert),[72,240]);
});
test('Jedes Nachübungsziel erhält eine eigene Aufgabenseite und getrennte Lösungen',()=>{
 for(const z of Object.keys(namen) as Ziel[]){const pdf=malheft([z],10021);assert.equal(pdf.getNumberOfPages(),2);assert.match(pdf.output(),/^%PDF/);}
});
