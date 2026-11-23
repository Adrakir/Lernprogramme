import {test} from 'node:test';
import assert from 'node:assert/strict';
import {raster as mal,punkte as malpunkte} from './multiplikation.ts';
import {raster as division,punkte as divisionspunkte} from './division.ts';
import {rasterPunkte} from './addition.ts';
import {rasterpunkte} from './subtraktion.ts';
import {lernziele} from './lernzielbericht.ts';
test('Eigene Teilprodukte addieren, ohne die fehlerhafte Zehnerzeile gutzuschreiben',()=>{
 const a=mal(3,0),p=malpunkte(a,{p0:'72',p1:'24',produkt:'96'});
 assert.equal(p.filter(v=>v.folge).length,1);
 assert.equal(p.find(v=>v.name.endsWith('Gesamtprodukt'))?.ok,true);
 assert.equal(p.find(v=>v.name.endsWith('Teilprodukt der Zehnerzeile'))?.ok,false);
 for(const w of [{p0:'72',p1:'',produkt:'72'},{p0:'72',p1:'24',produkt:'97'}])assert.ok(!malpunkte(a,w).some(v=>v.folge));
 const z=lernziele([{titel:'Mal',punkte:p}]).find(g=>g.titel==='Teilprodukte addieren')!;
 assert.deepEqual([z.richtig,z.folge,z.gesamt],[0,1,1]);
});
test('Bei Division, Addition und Subtraktion zählt eine belegte richtige Folgerechnung',()=>{
 const d=divisionspunkte(division(4,0),{q0:'1',p0:'6'});
 assert.ok(d.some(v=>v.folge&&v.name.includes('Vielfaches')));
 assert.ok(rasterPunkte([587,268],{'u1':'0','e1':'4'}).some(v=>v.folge));
 assert.ok(rasterpunkte(704,286,{v1:'8',e1:'0'}).some(v=>'folge' in v&&v.folge));
 assert.ok(!divisionspunkte(division(4,0),{}).some(v=>v.folge));
});
