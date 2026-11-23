import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blattaufgabe,faecher,zusammenstellen} from './lernatelier.ts';
import {standLesen,importVorschau} from './werkstattstand.ts';
import {rasterAufgabe} from './addition.ts';
import {raster as minus} from './subtraktion.ts';
import {faktoren} from './multiplikation.ts';
import {zahlen} from './division.ts';
test('V1-Arbeit: Stelle, Antworten, Freitext und Abschlusszustand überstehen die Wiederherstellung',()=>{
 const antworten=Array.from({length:8},(_,i)=>i===2?{t0:'12',text:'Meine Erklärung'}:{});
 const alt={arbeit:{seed:987,index:2,antworten,fertig:false},ziele:['raster','entfernt']};
 const raw=JSON.stringify(alt),geladen=standLesen(raw,(v):v is 'raster'=>v==='raster');
 assert.deepEqual(geladen.arbeit,alt.arbeit);assert.deepEqual(geladen.ziele,['raster']);
 assert.match(importVorschau({'mathe-kompass-division-v1':raw})[0],/Aufgabe 3 von 8/);
 assert.equal(standLesen('{',(v):v is string=>typeof v==='string').arbeit,undefined);
});
test('Fassungen A/B haben die gleichen Lernziele, Pflichtaufgaben und Punkte',()=>{
 const z=['sach','zeit','addition','geometrie'] as const;
 const a=zusammenstellen([...z],['zeit'],8,731,0),b=zusammenstellen([...z],['zeit'],8,731,1);
 assert.equal(a[0].fach,'zeit');assert.deepEqual(a.map(x=>[x.fach,x.kriterien,x.art]),b.map(x=>[x.fach,x.kriterien,x.art]));
 assert.ok(a.some((x,i)=>x.text!==b[i].text));
});
test('Aufgabenvielfalt umfasst Zahlvarianten, Reste, Nullstellen und mehrere Modellierungsarten',()=>{
 const seeds=Array.from({length:120},(_,i)=>(i+1)*7919);
 for(const f of faecher){const tasks=seeds.map((s,i)=>blattaufgabe(f,s,i));assert.ok(new Set(tasks.map(a=>a.text)).size>=5,f);assert.ok(new Set(tasks.map(a=>a.antwort)).size>=3,f);}
 for(const gen of [rasterAufgabe,minus,faktoren,zahlen])for(let level=0;level<6;level++)assert.ok(new Set(seeds.map(s=>gen(level,s).join(','))).size>=4);
 const reste=new Set(seeds.map(s=>{const [n,d]=zahlen(5,s);return n%d;}));assert.ok(reste.size>=5);
 assert.equal(new Set(seeds.map((s,i)=>blattaufgabe('sach',s,i).art)).size,4);
});
