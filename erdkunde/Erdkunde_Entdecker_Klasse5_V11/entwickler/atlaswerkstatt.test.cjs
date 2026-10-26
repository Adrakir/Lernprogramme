'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},nav={insertBefore:noop,querySelector:()=>null};
const ctx={MAIN:{addEventListener:noop},document:{getElementById:()=>nav,createElement:()=>({dataset:{}}),querySelectorAll:()=>[],addEventListener:noop},localStorage:{getItem:()=>null},window:{},render:noop,renderStart:()=>'',renderLesson:()=>'',state:{tab:'start'},cancelAnimationFrame:noop,clearTimeout:noop};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'atlasdaten.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'atlaswerkstatt.js'),'utf8'),ctx);
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
assert.ok(output.includes('atlasdaten.js')&&output.includes('awExamForm'));checks++;
const goodGaps={parallel:'parallel',reference:'Äquator',north:'Nordpol',south:'Südpol',largest:'Äquator'};
for(const r of a.checkGaps(goodGaps))eq(r.ok,true);
for(const r of a.checkGaps({}))eq(r.empty,true);
for(const r of a.checkGaps({...goodGaps,reference:'Aequator',south:'Suedpol',largest:' ÄQUATOR. '}))eq(r.ok,true);
eq(a.checkGaps({...goodGaps,parallel:'senkrecht'})[0].ok,false);
eq(a.checkGaps({...goodGaps,reference:'Nordpol'})[1].ok,false);
eq(a.checkGaps({...goodGaps,largest:'Meridian'})[4].ok,false);
eq(a.cityData.length,20);
for(const code of ['NO','NW','SO','SW']){assert.ok(a.cityData.some(p=>a.quarter(p.lat,p.lon).code===code));checks++;}
eq(a.coordinateFeedback(50,14,{lat:50,lon:14}).ok,true);
eq(a.coordinateFeedback(14,50,{lat:50,lon:14}).code,'swapped');
eq(a.coordinateFeedback(-50,14,{lat:50,lon:14}).code,'latitude-direction');
eq(a.coordinateFeedback(50,-14,{lat:50,lon:14}).code,'longitude-direction');
eq(a.coordinateFeedback(50,20,{lat:50,lon:14}).code,'longitude');
eq(a.coordinateFeedback(20,14,{lat:50,lon:14}).code,'latitude');
eq(a.coordinateFeedback(100,14,{lat:50,lon:14}).code,'range');
eq(a.pointFromMap(63,42,'world').lat,90);
eq(a.pointFromMap(713,372,'world').lon,180);
eq(a.pointFromMap(62,42,'world'),null);
eq(a.checkMissing('50,1','O',14.4,false,50.1).code,'swapped');
const answers={equator:'Äquator',maxlat:'90',quarterse:'SO',quartersw:'SW',rings:'Ringe',rays:'Speichen',register:'Frankfurt am Main',lisbon:'9',lisbonDir:'W',single:'Nein'};
eq(a.gradeExam(answers,{lat:50,lon:10}).filter(r=>r.ok).length,10);
eq(a.gradeExam({},null).filter(r=>r.ok).length,0);
eq(a.gradeExam({...answers,lisbonDir:'O'},{lat:50,lon:10}).filter(r=>r.ok).length,9);
eq(a.gradeExam(answers,{lat:10,lon:50}).find(r=>r.id==='point').code,'swapped');
console.log(`${checks} Prüfungen bestanden: Erdviertel, Grenzfälle, Komma-Eingaben, Richtungen, Kugelprojektion, Registerfelder, vollständige Ein-Datei-Ausgabe.`);
