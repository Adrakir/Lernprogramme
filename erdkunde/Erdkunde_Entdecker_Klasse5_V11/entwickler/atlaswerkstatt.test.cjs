'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},nav={insertBefore:noop,querySelector:()=>null};
const ctx={MAIN:{addEventListener:noop},document:{getElementById:()=>nav,createElement:()=>({dataset:{}}),addEventListener:noop},localStorage:{getItem:()=>null},window:{},render:noop,renderStart:()=>'',renderLesson:()=>'',state:{tab:'start'},cancelAnimationFrame:noop,clearTimeout:noop};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'atlaswerkstatt.js'),'utf8'),ctx);
const a=ctx.window.AtlasWerkstatt;let checks=0;
const eq=(got,want)=>{assert.equal(got,want);checks++};
for(const [lat,lon,want] of [[50,14,'NO'],[50,-14,'NW'],[-50,14,'SO'],[-50,-14,'SW'],[0,45,'edge'],[35,0,'edge'],[-30,180,'edge'],[30,-180,'edge'],[90,80,'pole'],[-90,-70,'pole']])eq(a.quarter(lat,lon).code,want);
for(const [raw,max,want] of [['',90,null],[' ',90,null],['abc',180,null],['-1',90,null],['1e2',180,null],['90,1',90,null],['181',180,null],['14,4',180,14.4],['14.4',180,14.4],['0',90,0],['90',90,90],['180',180,180]])eq(a.number(raw,max),want);
eq(a.checkMissing('9,1','W',-9.1,false).ok,true);
eq(a.checkMissing('9,1','O',-9.1,false).ok,false);
eq(a.checkMissing('23,7','S',-23.7,true).ok,true);
eq(a.checkMissing('23,7','N',-23.7,true).ok,false);
eq(a.checkMissing('','N',50.1,true).ok,false);
eq(a.checkMissing('50,9','N',50.1,true).ok,false);
eq(a.checkMissing('50,0','N',50.1,true).ok,true);
eq(a.checkMissing('91','N',50.1,true).ok,false);
for(const [la,lo,ca,co,x,y,z] of [[0,0,0,0,320,212,1],[0,90,0,0,484,212,0],[90,0,0,0,320,48,0],[90,0,90,0,320,212,1],[-90,0,-90,0,320,212,1]]){
 const p=a.project(la,lo,ca,co);for(let i=0;i<3;i++){assert.ok(Math.abs(p[i]-[x,y,z][i])<1e-8);checks++;}
}
eq(a.normalize('  PRAHA  '),'praha');
eq(a.fieldFor(a.cityData[0]),'C1');eq(a.fieldFor(a.cityData[1]),'A3');
for(const p of a.cityData){const [w,e,s,n]=a.maps[p.map].bounds;assert.ok(p.lon>w&&p.lon<e&&p.lat>s&&p.lat<n);checks++;}
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|webp|webmanifest))"/g)){assert.ok(fs.existsSync(path.join(__dirname,m[1])),`Fehlende lokale Abhängigkeit: ${m[1]}`);checks++;}
const output=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
assert.ok(!/<script src=/.test(output));checks++;
assert.ok(output.includes('atlaswerkstatt.js')&&output.includes('Ortsname + Länge → Breite'));checks++;
console.log(`${checks} Prüfungen bestanden: Erdviertel, Grenzfälle, Komma-Eingaben, Richtungen, Kugelprojektion, Registerfelder, vollständige Ein-Datei-Ausgabe.`);
