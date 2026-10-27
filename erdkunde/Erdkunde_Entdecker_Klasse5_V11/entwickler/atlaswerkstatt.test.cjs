'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const noop=()=>{},nav={insertBefore:noop,querySelector:()=>null};
function boot(saved=null){
 const ctx={MAIN:{addEventListener:noop},document:{getElementById:()=>nav,createElement:()=>({dataset:{}}),querySelectorAll:()=>[],addEventListener:noop},localStorage:{getItem:key=>key==='geo-atlaswerkstatt-v1'?saved:null},window:{},render:noop,renderStart:()=>'',renderLesson:()=>'',state:{tab:'start'},cancelAnimationFrame:noop,clearTimeout:noop};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'atlasdaten.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'atlaswerkstatt.js'),'utf8'),ctx);
 return ctx;
}
const ctx=boot();
const a=ctx.window.AtlasWerkstatt;let checks=0;
const eq=(got,want)=>{assert.equal(got,want);checks++};
for(const saved of ['null','[]','true','42','"alt"','{beschädigt',JSON.stringify({done:['Grundlagen'],stats:{Grundlagen:{attempts:3,correct:2}}})]){
 const loaded=boot(saved);eq(loaded.window.AtlasWerkstatt.cwTasks.length,18);
}
const resumed=boot(JSON.stringify({done:['Grundlagen'],stats:{Grundlagen:{attempts:3,correct:2}}}));
eq(resumed.localStorage.getItem('geo-atlaswerkstatt-v1'),JSON.stringify({done:['Grundlagen'],stats:{Grundlagen:{attempts:3,correct:2}}}));
assert.ok(resumed.renderStart().includes('Klassenarbeit · 18 Aufgaben'));checks++;
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
for(const match of output.matchAll(/<script>\s*([\s\S]*?)<\/script>/g)){new vm.Script(match[1]);checks++;}
assert.ok(output.includes('id="appStartup"'));checks++;
const workbook=output.match(/href="(data:application\/pdf;base64,[^"]+)" download="Erdkunde_Lernheft_Klasse5.pdf"/);
assert.ok(workbook,'Vorhandenes Lernheft muss in der Offline-App eingebettet sein');checks++;
assert.deepEqual(Buffer.from(workbook[1].split(',')[1],'base64'),fs.readFileSync(path.join(__dirname,'../Erdkunde_Lernheft_Klasse5.pdf')));checks++;
const oldEntry=fs.readFileSync(path.join(__dirname,'../Erdkunde_App_NEU_2026-10-27_Klassenarbeit_18_Aufgaben.html'),'utf8');
assert.ok(oldEntry.includes('content="0;url=index.html"')&&!oldEntry.includes('<script'));checks++;
assert.ok(!fs.readFileSync(path.join(__dirname,'build-offline.js'),'utf8').includes('copyFileSync'));checks++;
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
const specs=ctx.window.AW_DATA.exam;
const answers={};for(const q of specs)for(const f of q.fields||[])answers[f.id]=f.kind==='number'?String(f.target):f.answers[0];
const total=results=>results.reduce((sum,r)=>sum+r.points,0);
eq(total(a.gradeExam(answers,{lat:52,lon:8})),20);
eq(a.gradeExam(answers,{lat:52,lon:8}).filter(r=>r.ok).length,10);
eq(total(a.gradeExam({},null)),0);
for(const skill of ctx.window.AW_DATA.examMeta.skills)eq(a.gradeExam(answers,{lat:52,lon:8}).filter(r=>r.skill===skill).reduce((n,r)=>n+r.points,0),4);
eq(a.gradeExam({...answers,readLatDir:'N'},{lat:52,lon:8}).find(r=>r.id==='readpoint').points,1.5);
eq(a.gradeExam({...answers,lisbonDir:'O'},{lat:52,lon:8}).find(r=>r.id==='lisbon').points,1);
eq(a.gradeExam({...answers,lisbonDir:''},{lat:52,lon:8}).find(r=>r.id==='lisbon').points,1);
eq(a.gradeExam({...answers,lisbonLon:'200'},{lat:52,lon:8}).find(r=>r.id==='lisbon').points,1);
eq(a.gradeExam({...answers,registerCity:'Frankfurt (Oder)'},{lat:52,lon:8}).find(r=>r.id==='register').points,1.5);
eq(a.gradeExam({...answers,registerField:'D2'},{lat:52,lon:8}).find(r=>r.id==='register').points,1);
eq(a.gradeExam({...answers,registerField:'b 3'},{lat:52,lon:8}).find(r=>r.id==='register').points,2);
eq(a.gradeExam({...answers,equator:'Aequator',prime:'Greenwich-Meridian'},{lat:52,lon:8}).find(r=>r.id==='reference').points,2);
eq(a.gradeExam(answers,{lat:52,lon:12}).find(r=>r.id==='point').points,1);
eq(a.gradeExam(answers,{lat:51,lon:9}).find(r=>r.id==='point').points,2);
eq(a.gradeExam(answers,{lat:8,lon:52}).find(r=>r.id==='point').code,'swapped');
eq(a.gradeExam(answers,{lat:8,lon:52}).find(r=>r.id==='point').points,0);
eq(a.gradeExam(answers,{lat:NaN,lon:8}).find(r=>r.id==='point').points,0);
for(const r of a.gradeExam({},null))eq(r.answered,false);
eq(a.examRegisterRows().find(r=>r.name==='Frankfurt am Main').field,'B3');
eq(a.examRegisterRows().find(r=>r.name==='Frankfurt (Oder)').field,'D2');
const sketch=a.cleanSketch({paths:{globe:[{color:'#1766a1',points:[[0,0],[480,300]]},{color:'bad',points:[[1,1]]},{color:'#1766a1',points:[[1,301]]}]},texts:{globe:'x'.repeat(1600)},review:true,color:'#9c3475'});
eq(sketch.paths.globe.length,1);eq(sketch.texts.globe.length,1500);eq(sketch.review,true);eq(sketch.color,'#9c3475');eq(a.cleanSketch(null).review,false);eq(a.cleanSketch({paths:{globe:'invalid'}}).paths.globe.length,0);
const notes=ctx.window.AW_DATA.notes;
eq(notes.labels.length,8);
for(const word of ['Nordpol','Südpol','Nordhalbkugel','Südhalbkugel','Äquator','Westhalbkugel','Osthalbkugel','Nullmeridian']){assert.ok(notes.scenes.hemispheres.items.some(i=>i.tag==='text'&&i.text===word));checks++;}
eq(notes.scenes.hemispheresTest.items.filter(i=>i.tag==='text'&&/^[A-H]$/.test(i.text)).length,8);
eq(notes.sentences[1],'Die Längenkreise verlaufen vom Nordpol zum Südpol.');
eq(notes.sentences.length,3);
assert.ok(a.originalScene('hemispheres').includes('Nullmeridian'));checks++;
assert.ok(!notes.scenes.angle.items.some(i=>i.tag==='text'&&i.text.includes('45')));checks++;
eq(a.cwTasks.length,18);
const cwAnswers={};for(const q of a.cwTasks)for(const f of q.fields||[])cwAnswers[f.id]=f.kind==='number'?String(f.target):f.answers[0];
const full=a.gradeClasswork(cwAnswers,{lat:52,lon:8});
eq(full.reduce((n,q)=>n+q.points,0),54);eq(full.slice(0,10).reduce((n,q)=>n+q.points,0),20);eq(full.slice(10).reduce((n,q)=>n+q.points,0),34);
eq(a.gradeClasswork({},null).reduce((n,q)=>n+q.points,0),0);
eq(a.gradeClasswork({...cwAnswers,labelH:'Äquator'},{lat:52,lon:8}).reduce((n,q)=>n+q.points,0),53);
eq(a.gradeClasswork({...cwAnswers,readLatDir:'N'},{lat:52,lon:8}).reduce((n,q)=>n+q.points,0),53.5);
eq(a.gradeClasswork({...cwAnswers,houseB:'von oben'},{lat:52,lon:8}).find(q=>q.id==='house').points,6);
const cwDraft=a.cleanClasswork({version:1,answers:{labelH:'Nullmeridian',reason:'Ich sehe das Dach.',injected:'bad'},drawings:{latSide:[{color:'#1766a1',points:[[10,20],[300,20]]},{color:'red',points:[[1,1]]}]},descriptions:{gBoth:'Zwei Linien kreuzen sich.'},point:{lat:52,lon:8},index:99,submitted:true,started:true,manual:{latSide:true,unknown:true}});
eq(cwDraft.answers.labelH,'Nullmeridian');eq(cwDraft.answers.injected,undefined);eq(cwDraft.drawings.latSide.length,1);eq(cwDraft.descriptions.gBoth,'Zwei Linien kreuzen sich.');eq(cwDraft.index,17);eq(cwDraft.submitted,true);eq(cwDraft.manual.latSide,true);eq(cwDraft.manual.unknown,undefined);
eq(a.cleanClasswork({version:0,submitted:true}).submitted,false);
eq(a.cleanClasswork({version:1,point:{lat:100,lon:20}}).point,null);
console.log(`${checks} Prüfungen bestanden: Erdviertel, Grenzfälle, Komma-Eingaben, Richtungen, Kugelprojektion, Registerfelder, vollständige Ein-Datei-Ausgabe.`);
