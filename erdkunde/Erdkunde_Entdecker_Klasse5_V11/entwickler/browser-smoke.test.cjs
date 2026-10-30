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
 assert.equal(await page.locator('#tabs [data-tab="train"]').count(),1,label+': Themenübungen sind erreichbar');
 await page.locator('#tabs [data-tab="train"]').click();
 await page.locator('#tt-root').waitFor();
 assert.equal(await page.locator('#tt-root .tt-topic').count(),16,label+': Übungsbereich für alle 16 Themen');
 await page.locator('#tt-root [data-train="start:gradnetz:3"]').click();
 assert.ok((await page.locator('#tt-root').innerText()).includes('Stufe 3'),label+': schwierigste Stufe startet');
 await page.locator('#tt-root [data-train="hint"]').click();
 assert.ok((await page.locator('#tt-root').innerText()).includes('Hinweis 1'),label+': freiwillige Hilfe sichtbar');
 for(let n=0;n<6;n++){
  await page.locator('#tt-root input[name="tt-answer"][value="0"]').check();
  await page.locator('#tt-root [data-train="'+(n<5?'next':'submit')+'"]').click();
 }
 assert.equal(await page.locator('#tt-root .tt-result').count(),6,label+': Auswertung aller Aufgaben');
 assert.equal(await page.locator('#tt-root .tt-steps[open]').count(),0,label+': ausführliche Lösungen zunächst geschlossen');
 assert.ok((await page.locator('#tt-root .tt-result').first().innerText()).includes('Kurzlösung'),label+': normale Auswertung zeigt Kurzlösung');
 await page.locator('#tt-root .tt-steps summary').first().click();
 assert.equal(await page.locator('#tt-root .tt-steps[open]').count(),1,label+': individuelle Musterlösung aufklappbar');
 assert.ok((await page.locator('#tt-root .tt-steps').first().innerText()).includes('Aufgabe verstehen'),label+': geführte Schritte vorhanden');
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
 await page.locator('[data-praxis="reflect:1"]').click();
 await page.locator('[data-praxis="reflect-check"]').click();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Noch nicht ganz'),label+': Schüler darf nach Denkfehler korrigieren');
 await page.locator('[data-praxis="reflect:0"]').click();
 await page.locator('[data-praxis="reflect-check"]').click();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Verstanden!'),label+': Verstehensfrage gelöst');
 await page.locator('[data-praxis="home"]').click();
 await page.locator('[data-praxis="start:compass"]').click();
 await page.locator('[data-praxis="answer:0"]').click();
 await page.locator('[data-praxis="check"]').click();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Nordpfeil'),label+': Kompassdiagnose');
 await page.locator('[data-praxis="home"]').click();
 await page.locator('[data-praxis="start:atlas"]').click();
 await page.locator('[data-praxis="entry:0"]').click();
 await page.locator('[data-praxis="cell:B3"]').click();
 await page.locator('[data-praxis="check"]').click();
 assert.ok((await page.locator('#pf-root').innerText()).includes('Bundesland'),label+': Atlasfehler erklärt');
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
