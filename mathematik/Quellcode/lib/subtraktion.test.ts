import assert from 'node:assert/strict';
import {test} from 'node:test';
import {raster,rechenweg,rasterpunkte,namen,aufgabe,punkte,type Thema,type Werte,type Ziel} from './subtraktion.ts';
import {subtraktionsheft} from './subtraktion-heft.ts';
test('Jeder Tausch erhält den Wert, auch über zwei Nullen hinweg',()=>{
 for(let seed=0;seed<300;seed++)for(let level=0;level<6;level++){
  const [a,b]=raster(level,seed*7919),cols=rechenweg(a,b),w:Werte={};
  assert.equal(cols.reduce((s,c,i)=>s+c.rest*10**i,0),a-b);
  const tausche=cols.flatMap(c=>c.tausch);
  if(level<3)assert.equal(tausche.length,level);
  if(level===3||level===4)assert.equal(cols[0].tausch.length,level-1);
  for(const z of tausche){assert.equal(z.reduce((s,v,i)=>s+v*10**i,0),a);assert.ok(z.every(v=>v>=0));}
  cols.forEach((c,i)=>{w['v'+i]=String(c.verfuegbar);w['e'+i]=String(c.rest);[a,b].forEach((n,j)=>w['s'+j+'-'+i]=String(n).at(-1-i)??'');});
  assert.ok(rasterpunkte(a,b,w).every(p=>p.ok));w.e0='';assert.equal(rasterpunkte(a,b,w).filter(p=>!p.ok).length,1);
  assert.ok(!rasterpunkte(a,b,{}).some(p=>p.ok));
 }
 assert.deepEqual(rechenweg(704,286)[0].tausch,[[4,10,6],[14,9,6]]);
});
test('Aufgaben, alternative Sprünge und beide Additionsproben werden ausgewertet',()=>{
 for(const t of Object.keys(namen) as Thema[])for(const seed of [0,43121,943287,4567239]){
  const a=aufgabe(t,seed),w:Werte={};a.felder.forEach((f,i)=>{w['f'+i]=String(f.wert);if(f.wahl)assert.ok(f.wahl.includes(String(f.wert)));});
  if(t==='sprung'||t==='ergaenzen')w.spruenge='2,'+(a.zahlen[1]-a.zahlen[0]-2);
  if(t==='probe'){const [x,y,z]=a.zahlen;for(const cards of [[z,y,x],[y,z,x]])assert.ok(punkte(a,{karten:cards.join(',')})[0].ok);w.karten=[y,z,x].join(',');}
  assert.ok(punkte(a,w).every(p=>p.ok));assert.ok(!punkte(a,{}).some(p=>p.ok));
 }
});
test('Alle Nachübungsziele erzeugen ein Heftblatt mit separater Lösung',()=>{
 for(const ziel of ['raster','nullkette',...Object.keys(namen)] as Ziel[])assert.equal(subtraktionsheft([ziel],7919).getNumberOfPages(),2);
});
