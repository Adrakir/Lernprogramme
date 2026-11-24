import test from 'node:test';
import assert from 'node:assert/strict';
import {gewichtPruefen,zeitZerlegen,uebertraege,divisionsTipp} from './denkaufgaben.ts';
import {checkField,groessenangabe} from './groessen-core.ts';
import {rechenweg} from './division.ts';
import {spalten} from './addition.ts';
test('Minuten vor, auf und nach der Stundengrenze',()=>{
 for(const [min,h,rest] of [[59,0,59],[60,1,0],[61,1,1]]){
  assert.deepEqual(zeitZerlegen(min),{stunden:h,minuten:rest});
  assert.equal(groessenangabe(h+' h '+rest+' min','zeit')?.basis,min*60);
 }
});
test('Grammgrenze, gemischte Einheiten und verlangte Einheit',()=>{
 for(const g of [999,1000,1001,1500]){
  assert.match(gewichtPruefen((g/1000).toLocaleString('de-DE')+' kg',g,false),/^Richtig/);
  assert.match(gewichtPruefen(g+' g',g,true),/^Richtig/);
 }
 assert.match(gewichtPruefen('1 kg 500 g',1500,true),/Menge stimmt/);
 for(const raw of ['1,5 kg','1 kg 500 g','1.500 g'])assert.match(gewichtPruefen(raw,1500,false),/^Richtig/);
 assert.doesNotMatch(gewichtPruefen('1 kg x500 g',1500,false),/^Richtig/);
 assert.match(checkField({id:'m',kind:'size',bereich:'laenge',unit:'cm',answer:1500},{m:'1 m 50 cm'}).message??'',/Menge stimmt/);
});
test('Übertragskette und Null im Ergebnis: Rechenschritt und Erklärung',()=>{
 assert.deepEqual(uebertraege(999,1),['Einern','Zehnern','Hundertern']);
 assert.deepEqual(spalten([999,1]).map(c=>c.ziffer),[0,0,0,1]);
 assert.deepEqual(rechenweg(2816,4).map(s=>s.q),[7,0,4]);
 assert.match(divisionsTipp(704,74,4),/Zehnerstelle/);
 assert.match(divisionsTipp(704,700,4),/Einerstelle/);
});
