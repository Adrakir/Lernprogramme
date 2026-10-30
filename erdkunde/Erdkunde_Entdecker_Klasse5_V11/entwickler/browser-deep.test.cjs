'use strict';
/* Echte Desktop-/Safari-/Smartphone-Abnahme der einen vorhandenen Erdkunde-App.
   Im Unterricht ersetzt das keine reale Schuelerbeobachtung. */
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium,webkit}=require('playwright');
const URL=pathToFileURL(path.resolve(__dirname,'..','index.html')).href;
const OUTPUT=path.resolve(__dirname,'artifacts');
fs.mkdirSync(OUTPUT,{recursive:true});
const ids=['geographie','perspektive','himmelsrichtungen','wege','luftbild','kartenlesen','massstab','kartenarten','relief','atlanten','gradnetz','projektionen','erde','sonnensystem','zeitzonen','skizzen'];
async function check(browser,engine,width){
 const label=engine+'-'+width,ctx=await browser.newContext({viewport:{width,height:860},deviceScaleFactor:1,locale:'de-DE',hasTouch:width<500,isMobile:width<500&&engine==='chromium'});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const fit=async(where)=>{
  const v=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(v.actual<=v.viewport+4,label+' horizontaler Ueberlauf bei '+where+': '+JSON.stringify(v));
 };
 const picture=async(selector,where)=>{
  const svg=page.locator(selector).first();
  assert.ok(await svg.count(),label+': Grafik fehlt '+where);
  const rect=await svg.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,display:getComputedStyle(el).display}));
  assert.ok(rect.width>=50&&rect.height>=35&&rect.display!=='none',label+': Grafik verborgen '+where+': '+JSON.stringify(rect));
 };
 try{
  await page.goto(URL,{waitUntil:'load',timeout:60000});
  await page.locator('#main h1').first().waitFor({timeout:30000});
  assert.equal(await page.locator('#appStartup').count(),0,label+': App zeigt keinen endlosen Starthinweis');
  assert.equal(await page.locator('#tt-root .tt-topic').count(),0,'Thementraining erscheint nur im entsprechenden Tab');
  await fit('Start');
  if(width===1366||width===320)await page.screenshot({path:path.join(OUTPUT,label+'-start.png'),fullPage:false});

  await page.locator('#tabs [data-tab="train"]').click();
  await page.locator('#tt-root .tt-topic').first().waitFor();
  assert.equal(await page.locator('#tt-root .tt-topic').count(),16,label+': Alle 16 Themen');
  await fit('16 Themen');
  if(width===1366||width===320)await page.screenshot({path:path.join(OUTPUT,label+'-themen.png'),fullPage:false});
  // Lernen: Alle 16 Themen in Grundlagen; zu den Schwerpunkten auch Level 2/3.
  for(const id of ids){
   const action='start:'+id+':1';
   await page.locator('#tt-root [data-train="'+action+'"]').click();
   assert.ok(await page.locator('#tt-root .tt-question h1').count(),label+': Aufgabenstellung '+id);
   assert.equal(await page.locator('#tt-root .tt-options input').count()>1,true,label+': Antwortmoeglichkeiten '+id);
   await page.locator('#tt-root [data-train="hint"]').click();
   assert.equal(await page.locator('#tt-root .tt-tip').count(),1,label+': Hinweis '+id);
   await fit('Stufe 1 '+id);
   await page.locator('#tt-root [data-train="home"]').click();
  }
  for(const id of ['perspektive','himmelsrichtungen','kartenlesen','massstab','atlanten','gradnetz']){
   for(const level of [2,3]){
    await page.locator('#tt-root [data-train="start:'+id+':'+level+'"]').click();
    assert.ok((await page.locator('#tt-root .tt-question h1').textContent()).includes('A'),label+': Transferaufgabe '+id+'/'+level);
    await fit('Stufe '+level+' '+id);
    await page.locator('#tt-root [data-train="home"]').click();
   }
  }
  // Klassenarbeit: alle 18 Aufgaben, deren Zeichnungen und Hilfen.
  await page.locator('#tabs [data-tab="start"]').click();
  const open=page.locator('[data-aw="openClasswork"]');
  assert.ok(await open.count(),label+': vorhandene Klassenarbeit verlinkt');
  await open.first().click();
  await page.locator('[data-aw="cwStart"]').click();
  assert.equal(await page.locator('.aw-exam-numbers [data-aw^="cwGo:"]').count(),18,label+': 18 Klassenarbeits-Aufgaben');
  let graphics=0;
  for(let i=0;i<18;i++){
   await page.locator('.aw-exam-numbers [data-aw="cwGo:'+i+'"]').click();
   assert.ok((await page.locator('#cwQuestion h2').textContent()).trim().length>8,label+': Aufgabentitel '+i);
   assert.ok((await page.locator('#cwQuestion .aw-exam-instruction').textContent()).trim().length>25,label+': Arbeitsauftrag '+i);
   assert.ok((await page.locator('#cwQuestion .cw-objective').textContent()).trim().length>25,label+': Lernziel '+i);
   const shapes=page.locator('#cwQuestion svg');
   if(await shapes.count()){
    await picture('#cwQuestion svg','Aufgabe '+(i+1));
    graphics++;
   }
   await fit('Klassenarbeit '+(i+1));
   if((i===0||i===10||i===17)&&(width===1366||width===320))
     await page.screenshot({path:path.join(OUTPUT,label+'-klassenarbeit-'+(i+1)+'.png'),fullPage:false});
  }
  assert.ok(graphics>=9,label+': Bild- und Kartenaufgaben wirklich grafisch dargestellt ('+graphics+')');
  await page.locator('[data-aw="cwFinish"]').click();
  await page.locator('[data-aw="cwSubmit"]').click();
  assert.ok(await page.locator('#cwQuestion').count(),label+': Lösungen nach Abgabe im Kontext');
  await page.locator('.aw-exam-numbers [data-aw="cwGo:0"]').click();
  await page.locator('#cwWalkGraphic').first().waitFor();
  await picture('#cwWalkGraphic svg','animierter Lösungsweg');
  const before=await page.locator('#cwWalkProgress').textContent();
  await page.locator('[data-aw="cwWalkMove:1"]').first().click();
  const after=await page.locator('#cwWalkProgress').textContent();
  assert.notEqual(before,after,label+': animierte Musterloesung schrittweise bedienbar');
  await fit('Auswertung');
  assert.deepEqual(errors,[],label+': keine ungefangenen Javascriptfehler');
  console.log('PASS '+label+': 16 Themen, sechs Transfer-Schwerpunkte, 18 Klassenarbeits-Aufgaben, '+graphics+' bebilderte Aufgaben, animierter Loesungsweg.');
 }finally{await ctx.close();}
}
(async()=>{
 for(const [engine,kind] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await kind.launch({headless:true});
  try{for(const width of [320,390,1366])await check(browser,engine,width);}
  finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
