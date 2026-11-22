import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aufgabe,ausrichtung,namen,pruefeAufgabe,rasterAufgabe,rasterPunkte,spalten,type Thema,type Werte} from './addition.ts';
import {additionsheft,type Ziel} from './addition-heft.ts';

function loese(z:number[]){
  const w:Werte={};
  spalten(z).forEach((c,i)=>{z.forEach((n,j)=>{const digit=String(n).at(-1-i);if(digit!==undefined)w[`s${j}-${i}`]=digit;});w['e'+i]=String(c.ziffer);if(c.eingang)w['u'+i]=String(c.eingang);});
  return w;
}
test('Stufen trennen Übertragsfälle und erhalten den Stellenwert bei allen Zahlenvarianten',()=>{
  for(let seed=0;seed<150;seed++)for(let s=0;s<6;s++){
    const z=rasterAufgabe(s,seed*7919),cols=spalten(z);
    assert.equal(cols.reduce((acc,c,i)=>acc+c.ziffer*10**i,0),z.reduce((a,b)=>a+b));
    assert.ok(rasterPunkte(z,loese(z)).every(c=>c.ok));
    assert.ok(!rasterPunkte(z,{}).some(c=>c.ok));
    const traege=cols.filter(c=>c.ausgang).length;
    if(s<=1)assert.equal(traege,s);
    if(s===2)assert.ok(traege>=2);
    if(s===3)assert.ok(cols.length>Math.max(...z.map(n=>String(n).length)));
    if(s===5)assert.equal(cols[0].ausgang,2);
  }
});
test('Ausrichtung trennt interne Null von Leerstellen, Teilpunkte bleiben auf richtige Schritte beschränkt',()=>{
  const z=[4006,78],w=loese(z);assert.ok(ausrichtung(z,w,1));
  w['s1-2']='0';assert.ok(!ausrichtung(z,w,1));w['s0-2']='';assert.ok(!ausrichtung(z,w,0));
  const d=loese([587,268]);d.e1='4';assert.equal(rasterPunkte([587,268],d).filter(c=>!c.ok).length,1);
});
test('Rechenstrategien akzeptieren alternative Wege und beide Umkehrproben',()=>{
  const a=aufgabe('sprung');for(const s of ['32,25','50,7','57'])assert.ok(pruefeAufgabe(a,{spruenge:s})[0].ok);
  assert.ok(!pruefeAufgabe(a,{spruenge:'60,-3'})[0].ok);
  const p=aufgabe('probe');for(const s of ['624,278,346','624,346,278'])assert.ok(pruefeAufgabe(p,{karten:s})[0].ok);
  assert.ok(!pruefeAufgabe(p,{karten:'346,624,278'})[0].ok);
  assert.ok(pruefeAufgabe(aufgabe('paare'),{paare:'125,75,52,48'})[0].ok);
});
test('Alle Aufgabenvarianten liefern eindeutige Lösungen; Längen und Zeit verwenden die richtige Bündelung',()=>{
  for(const id of Object.keys(namen) as Thema[])for(const seed of [0,435343,23482532]){
    const a=aufgabe(id,seed),w:Werte={};for(const f of a.felder){w[f.key]=String(f.wert);if(f.optionen){assert.ok(f.optionen.includes(String(f.wert)));assert.equal(new Set(f.optionen).size,f.optionen.length);}}
    if(id==='probe'){const [x,y,sum]=a.zahlen;w.karten=[sum,x,y].join(',');}
    if(id==='sprung')w.spruenge=String(a.zahlen[1]);
    if(id==='paare'){const [a1,b,c,d]=a.zahlen;w.paare=[a1,c,b,d].join(',');}
    assert.ok(pruefeAufgabe(a,w).every(v=>v.ok),id);
    if(id==='fehler')assert.ok(+w.erg===a.zahlen[0]+a.zahlen[1]);
  }
  assert.deepEqual(aufgabe('groessen').felder.map(f=>f.wert),[2,60,2,20]);
});
test('Persönliche Heftblätter haben drei Aufgaben und ein getrenntes Lösungsblatt',()=>{
  for(const id of ['raster','raster3',...Object.keys(namen)] as Ziel[]){
    const doc=additionsheft([id],984732);assert.equal(doc.getNumberOfPages(),2);
    assert.match(doc.output(),/^%PDF/);
  }
});
