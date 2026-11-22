import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aufgabe,themen,richtig,type Thema} from './groessen-training.ts';
import {punkte,rundenAufgabe,standardPlan,zusammenstellen,uebungsziele,zwischenschritt} from './groessen-auswertung.ts';
import {aufbauThemen} from './groessen-aufbau.ts';
import type {Stand} from './groessen-training-stand.ts';
import {fehlerblatt} from './groessen-fehlerblatt.ts';

const runde=(ids:Thema[]):Stand=>({modus:'arbeit',version:2,ids,i:0,seed:32143,antworten:ids.map(()=>[]),hilfe:ids.map(()=>false),umkehr:ids.map(()=>false),fertig:true});
test('Aufbauvarianten und Musterantworten einschließlich Tageswechsel und Gegenrichtung',()=>{
  for(const id of Object.keys(aufbauThemen) as Thema[])for(const seed of [1,3141,19932838])for(const v of [0,1,2]){
    const a=aufgabe(id,seed,false,v);assert.ok(a.weg&&a.tipp&&a.frage);
    for(const feld of a.felder){assert.ok(richtig(feld,String(feld.wert)));if(feld.optionen)assert.ok(feld.optionen.includes(String(feld.wert)));}
    if(id==='kalender'){const [start,ende]=a.modell!.werte;assert.equal(Number(a.felder[2].wert)*60+Number(a.felder[3].wert),2880-start+ende);}
  }
  const r={...runde(['fahrdreieck','fahrdreieck','fahrdreieck']),modus:'uebung' as const};
  const [ank,start,dauer]=r.ids.map((_,i)=>rundenAufgabe(r,i).felder);
  assert.equal(Number(ank[0].wert)*60+Number(ank[1].wert)-Number(start[0].wert)*60-Number(start[1].wert),dauer[0].wert);
});
test('Konfiguration berücksichtigt Verteilung, Ausschlüsse und Schwerpunkte',()=>{
  for(const n of [0,1,2,6,12]){
    const plan={anzahl:{laenge:4,masse:2,zeit:n},dezimal:false,mehrtaegig:true};
    const ids=zusammenstellen(plan,312);assert.equal(ids.length,6+n);
    for(const [b,count] of Object.entries(plan.anzahl))assert.equal(ids.filter(id=>themen[id][0]===b).length,count);
    assert.ok(!ids.includes('dezimal')&&!ids.includes('fehlerZ'));assert.equal(ids.includes('kalender'),n>0);
  }
  assert.ok(!zusammenstellen(standardPlan,7).includes('kalender'));assert.equal(zusammenstellen(standardPlan,7).length,12);
});
test('Teilpunkte, geratene Antworten und höchstens drei verschiedene Übungsziele',()=>{
  const r=runde(['rezept','band','regelM','regelM','zeitlinie']);const a=rundenAufgabe(r,0);
  r.antworten[0]=a.felder.map(f=>String(f.wert));r.antworten[0][2]='0';assert.deepEqual(punkte(r,0),{erreicht:3,max:4});
  const alt={...r,version:undefined};assert.equal(rundenAufgabe(alt,0).felder.length,1);
  const ziele=uebungsziele(r);assert.equal(ziele.length,3);assert.equal(new Set(ziele.map(x=>x.id)).size,3);
  const eins=runde(['regelM']);eins.antworten=[rundenAufgabe(eins,0).felder.map(f=>String(f.wert))];eins.sicherheit=['geraten'];assert.equal(uebungsziele(eins).length,1);
});
test('Gezielte Zwischenfrage zur Nachkommastelle',()=>{
  const r=runde(['regelM']),a=rundenAufgabe(r,0);
  const h=zwischenschritt('regelM',a,[String(a.felder[0].wert),String(a.felder[1].wert),'0']);
  assert.equal(h.feld.wert,Number(a.felder[2].wert)%1000);
});
test('PDF enthält getrennte Seiten für Übungen und Lösungen',()=>{
  const doc=fehlerblatt(runde(['lineal','skala','fahrtafel']));assert.ok(doc.getNumberOfPages()>=4);
  assert.match(doc.output(),/^%PDF/);
});
