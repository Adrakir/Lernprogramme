'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const APP=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
test('Deutsch Leseverständnis: sechs vollständige Geschichten und 72 Aufgaben mit Hinweisen und Textbelegen',async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1280,height:870}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(APP);await page.locator('[data-page="lesen"]').click();
  const ids=await page.locator('#reading-story option').evaluateAll(a=>a.map(x=>x.value));
  assert.equal(ids.length,6,'Sechs Lesegeschichten');
  let checks=0;
  for(const id of ids){
   await page.selectOption('#reading-story',id);
   const total=await page.locator('#reading-jump option').count();
   assert.equal(total,13,'Zwölf Aufgaben plus Rückmeldung in '+id);
   const paragraphs=await page.locator('.reading-paragraph').count();
   assert.ok(paragraphs>=4,'Absätze nummeriert in '+id);
   const text=await page.locator('#reading-text').textContent();
   assert.ok(text.length>=800,'vollständiger Lesetext in '+id);
   for(let i=0;i<12;i++){
    await page.selectOption('#reading-jump',String(i));
    const title=await page.locator('#reading-heading').textContent();
    assert.ok(title.trim().length>=12,'Aufgabe '+id+'/'+i+' hat verständlichen Auftrag');
    await page.locator('#reading-hint').click();
    assert.ok((await page.locator('.hint-box').textContent()).length>30,'inhaltliche Hilfe '+id+'/'+i);
    await page.locator('#reading-solution summary').click();
    const solution=await page.locator('#reading-solution').textContent();
    assert.match(solution,/Passende Textstelle:/,'Lösung mit Textstelle '+id+'/'+i);
    const refs=[...solution.matchAll(/Absatz (\d+)/g)].map(m=>Number(m[1]));
    assert.ok(refs.every(n=>n>=1&&n<=paragraphs),'gültige Absatznummer '+id+'/'+i);
    checks++;
   }
  }
  assert.equal(checks,72,'alle 72 Leseaufgaben interaktiv geprüft');
  assert.deepEqual(errors,[],'keine ungefangenen Browser-Fehler');
  console.log('PASS: 72 Lesefragen, 6 Geschichten, Hilfen, Lösungstexte und gültige Absatzbelege.');
 }finally{await browser.close();}
});
