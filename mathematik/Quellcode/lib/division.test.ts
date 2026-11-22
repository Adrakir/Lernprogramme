import assert from 'node:assert/strict';
import {test} from 'node:test';
import {zahlen,raster,rechenweg,aufgabe,punkte,bereit,namen,type Antworten,type Ziel} from './division.ts';
import {divisionsheft} from './division-heft.ts';

test('Schriftliche Division bewahrt Stellenwerte, Nullziffern und echte Reste',()=>{
 for(let level=0;level<6;level++)for(let i=0;i<200;i++){
  const seed=i*7919,[n,d]=zahlen(level,seed),rows=rechenweg(n,d);
  assert.equal(rows.map(r=>r.q).join(''),String(Math.floor(n/d)));
  assert.equal(rows.at(-1)!.rest,n%d);
  for(const [j,r] of rows.entries()){
   assert.equal(r.produkt,r.q*d);assert.equal(r.teil,r.produkt+r.rest);assert.ok(r.rest>=0&&r.rest<d);
   if(j)assert.equal(r.teil,10*rows[j-1].rest+r.ziffer);
  }
  if(level===0)assert.ok(rows.every(r=>!r.rest));
  if(level===1)assert.ok(rows.slice(0,-1).some(r=>r.rest));
  if(level===2||level===5)assert.ok(n%d>0);
  if(level===4)assert.ok(rows.slice(1,-1).some(r=>r.q===0));
  const a=raster(level,seed),w:Antworten={};for(const s of a.schritte)for(const f of s.felder)w[f.key]=String(f.wert);
  assert.ok(bereit(a,w));assert.ok(punkte(a,w).every(p=>p.ok));w.q0='';assert.equal(punkte(a,w).filter(p=>!p.ok).length,1);
 }
 assert.deepEqual(rechenweg(1248,6).map(r=>[r.teil,r.q,r.rest]),[[12,2,0],[4,0,4],[48,8,0]]);
 for(const n of [0,3])assert.deepEqual(rechenweg(n,5).map(r=>[r.q,r.rest]),[[0,n]]);
 assert.throws(()=>rechenweg(7,0));
});
test('Übungsvarianten, offene Begründungen und beide zulässigen Proben',()=>{
 for(const t of Object.keys(namen) as Ziel[])for(const seed of [0,13823,927281]){
  const a=aufgabe(t,seed),w:Antworten={};assert.ok(!punkte(a,w).some(p=>p.ok));
  for(const f of a.schritte.flatMap(s=>s.felder))w[f.key]=String(f.wert);
  if(t==='probe'){const [q,d,r]=a.zahlen;for(const cards of [[q,d,r],[d,q,r]]){w.karten=cards.join(',');assert.ok(punkte(a,w).every(p=>p.ok));}assert.ok(!punkte(a,{...w,karten:[r,d,q].join(',')}).at(-1)!.ok);}
  if(t==='luecke')w.nullregel='Die Rechnung hat kein Ergebnis.';
  if(['geschichte','vergleich'].includes(t)){assert.ok(!bereit(a,w));w.text='Mein Rechenweg';}
  assert.ok(bereit(a,w));assert.ok(punkte(a,w).every(p=>p.ok));
 }
});
test('Für jedes Nachübungsziel enthält das Heft zwei getrennte Seiten',()=>{
 for(const ziel of Object.keys(namen) as Ziel[])assert.equal(divisionsheft([ziel],23147).getNumberOfPages(),2);
});
