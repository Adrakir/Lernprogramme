import test from 'node:test';
import assert from 'node:assert/strict';
import {aufgabe,themen,diagnose,pruefung,fach,richtig,type Thema} from './groessen-training.ts';
import {lesen,speichernRunde,verbuchen,merken,type Stand} from './groessen-training-stand.ts';

test('Einstieg und Klassenarbeit verteilen die Aufgaben gleichmäßig auf alle drei Bereiche',()=>{
  for(const [ids,n] of [[diagnose,2],[pruefung,4]] as const)
    for(const b of Object.keys(fach))assert.equal(ids.filter(id=>themen[id][0]===b).length,n);
});
test('Jeder Aufgabentyp hat bei wechselnden Zahlen und Richtungen auswertbare Antworten',()=>{
  for(const id of Object.keys(themen) as Thema[])for(const seed of [91,357111329,919813032,1807654321])for(const rueck of [true,false]){
    const a=aufgabe(id,seed,rueck);
    assert.ok(a.frage.length&&a.weg.length&&a.tipp.length);
    for(const feld of a.felder){assert.ok(richtig(feld,typeof feld.wert==='number'?String(feld.wert).replace('.',','):feld.wert),id);assert.ok(!richtig(feld,''),id);if(feld.optionen)assert.ok(feld.optionen.includes(String(feld.wert)));}
    if(id==='regelM'){const b=aufgabe(id,seed,!rueck);assert.ok(Math.abs(Number((rueck?a:b).felder[2].wert)*1000-Number((rueck?b:a).felder[2].wert))<1e-8);}
    if(id==='lineal'){const [lo,hi]=a.bild!.daten;assert.equal(a.felder[2].wert,(hi-lo)/10);}
    if(id==='skala'){const [step,pos]=a.bild!.daten;assert.equal(a.felder[1].wert,step*pos);}
  }
});
test('Wiederholung merkt Hilfen, speichert Teilantworten und prüft die Gegenrichtung',()=>{
  const mem=new Map<string,string>();
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>mem.get(k)??null,setItem:(k:string,v:string)=>mem.set(k,v)}});
  try{
    merken('regelM');merken('regelM');
    const r:Stand={modus:'wiederholen',ids:['regelM'],i:0,seed:123,hilfe:[false],umkehr:[false],antworten:[['teilen','','']],fertig:false};
    speichernRunde(r);assert.deepEqual(lesen().runde,r);
    verbuchen({...r,fertig:true},[true]);assert.deepEqual(lesen().liste,[{id:'regelM',umkehr:true}]);
    verbuchen({...r,fertig:true,umkehr:[true],hilfe:[true]},[true]);assert.equal(lesen().liste.length,1);
    verbuchen({...r,fertig:true,umkehr:[true]},[true]);assert.equal(lesen().liste.length,0);
  }finally{delete (globalThis as {localStorage?:Storage}).localStorage;}
});
