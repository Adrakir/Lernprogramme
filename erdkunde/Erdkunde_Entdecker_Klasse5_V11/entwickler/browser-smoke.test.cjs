'use strict';
/* Echte Chromium-Laufzeit mit Desktop- und mobilem Viewport.
   Der mobile Viewport ersetzt keinen Hardware-Test auf iOS/Android. */
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const url=pathToFileURL(path.join(__dirname,'..','index.html')).href;
async function run(browser,label,viewport,isMobile){
 const page=await browser.newPage({viewport,isMobile,hasTouch:isMobile,locale:'de-DE'});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url,{waitUntil:'load',timeout:45000});
 await page.locator('#main').waitFor();
 assert.ok(await page.locator('#main h1').count(),label+': Einstieg sichtbar');
 assert.equal(await page.locator('#tabs [data-tab="atlaswerkstatt"]').count(),1,label+': vorhandene Atlaswerkstatt');
 assert.equal(await page.locator('#awMoreMain summary').count(),1,label+': zusätzliche Bereiche in einem Menü');
 await page.locator('#awMoreMain summary').click();
 await page.locator('#awMoreMain [data-tab="pruefung"]').click();
 await page.locator('#pf-root').waitFor();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Prüfungsfit'),label+': Prüfungsfit öffnet');
 await page.locator('[data-praxis="open"]').click();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Gustavs Geowerkstatt'),label+': Geowerkstatt öffnet');
 await page.locator('[data-praxis="start:grid"]').click();
 await page.locator('[data-praxis="move:north"]').click(); // Absichtlich falsch: gesucht 60° N / 30° W
 await page.locator('[data-praxis="check"]').click();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Gustavs Lösungsweg'),label+': Fehlererklärung sichtbar');
 assert.ok((await page.locator('#pf-root .praxis-steps li').count())>=3,label+': mehrstufige Erklärung');
 const metrics=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,main:document.querySelector('#main')?.scrollWidth}));
 assert.ok(metrics.document<=metrics.width+3,label+': kein horizontaler Seitenüberlauf '+JSON.stringify(metrics));
 assert.deepEqual(errors,[],label+': keine nicht behandelten JavaScript-Fehler');
 console.log(label+': Start, Navigation, Geowerkstatt, Fehlerhilfe und Layout OK');
 await page.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  await run(browser,'Desktop 1280px',{width:1280,height:850},false);
  await run(browser,'Smartphone 390px',{width:390,height:844},true);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
