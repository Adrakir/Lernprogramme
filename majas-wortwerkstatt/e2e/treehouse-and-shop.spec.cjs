'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const url=hash=>'/majas-wortwerkstatt/#'+hash;
const KEY='majas-wortwerkstatt-klassenarbeiten-nov2026-v1';
async function seed(page,count=1){
 await page.goto(url('baumhaus'),{waitUntil:'domcontentloaded'});
 const saved=await page.evaluate(({key,count})=>{
   const results={};
   for(let i=0;i<count;i++){
     const topic=i<5?'hoeren':'nomen',n=i%5+1,total=topic==='hoeren'?5:15;
     results[topic+':test:'+n]={done:true,assisted:false,answers:Array.from({length:total},(_,j)=>({id:'test-'+i+'-'+j,given:'abc',correct:true}))};
   }
   localStorage.setItem(key,JSON.stringify(results));
   return results;
 },{key:KEY,count});
 await page.reload({waitUntil:'domcontentloaded'});
 return saved;
}
async function screenshot(page,name,project){
 const dir=path.join(__dirname,'..','qa-treehouse-shots');
 fs.mkdirSync(dir,{recursive:true});
 await page.screenshot({path:path.join(dir,project+'-'+name+'.png'),animations:'disabled',fullPage:false});
}
test('Baumhaus startet verriegelt, öffnet nach einer bestandenen Prüfung mit zwei Startgegenständen',async ({page},testInfo)=>{
 await page.goto(url('baumhaus'),{waitUntil:'domcontentloaded'});
 await expect(page.getByText('Das Baumhaus ist noch verschlossen')).toBeVisible();
 await expect(page.locator('.bh-room-stage')).toHaveCount(0);
 await seed(page,1);
 await expect(page.locator('.bh-room-stage')).toBeVisible();
 await expect(page.locator('.bh-object')).toHaveCount(2);
 await expect(page.locator('[data-bh-select="start-sitzsack"]')).toBeVisible();
 await expect(page.locator('[data-bh-select="start-laptop"]')).toBeVisible();
 await expect(page.locator('.bh-stats')).toContainText('10');
 const initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')));
 expect(initial.orders).toEqual({});
 expect(initial.placed).toEqual([]);
 await screenshot(page,'baumhaus-start',testInfo.project.name);
 await page.locator('[data-bh-select="start-laptop"]').click();
 await expect(page).toHaveURL(/#baumhaus\/shop$/);
 await expect(page.locator('.bh-shop-brand')).toContainText('Bärli AG Osnabrück');
 await screenshot(page,'gelb-blauer-shop',testInfo.project.name);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});
test('Bettwäsche und Nachttisch im Shop, Bestellung kostet Taler und lässt Zimmer gestalten',async ({page})=>{
 await seed(page,3);
 await page.goto(url('baumhaus/shop/moebel'),{waitUntil:'domcontentloaded'});
 await expect(page.locator('[data-bh-buy="bett"]')).toBeEnabled();
 await expect(page.locator('[data-bh-buy="nachttisch"]')).toBeEnabled();
 await page.locator('[data-bh-buy="nachttisch"]').click();
 await expect(page.locator('[data-bh-buy="nachttisch"]')).toBeDisabled();
 await expect(page.locator('.bh-stats')).toContainText('23');
 await page.locator('[data-bh-buy="bett"]').click();
 await page.goto(url('baumhaus'));
 await expect(page.locator('[data-bh-select="bett"]')).toBeVisible();
 await expect(page.locator('[data-bh-select="nachttisch"]')).toBeVisible();
 await page.locator('[data-bh-choose="nachttisch"]').click();
 const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')).placed.find(x=>x.id==='nachttisch'));
 await page.locator('[data-bh-move="right"]').click();
 const moved=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')).placed.find(x=>x.id==='nachttisch'));
 expect(moved.x).toBeGreaterThan(first.x);
 await page.reload({waitUntil:'domcontentloaded'});
 const final=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')).placed.find(x=>x.id==='nachttisch'));
 expect(final.x).toBe(moved.x);
 await page.goto(url('baumhaus/shop/moebel'));
 await expect(page.locator('[data-bh-buy="bettwaesche-blau"]')).toBeEnabled();
 await page.locator('[data-bh-buy="bettwaesche-blau"]').click();
 const positions=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')).placed);
 expect(positions.find(x=>x.id==='bettwaesche-blau').x).toBe(positions.find(x=>x.id==='bett').x);
 await page.goto(url('baumhaus'));
 await expect(page.locator('[data-bh-select="bettwaesche-blau"]')).toBeVisible();
});
test('Weihnachtsabteilung erst nach sechs unterschiedlichen Prüfungen erreichbar',async ({page})=>{
 await seed(page,5);
 await page.goto(url('baumhaus/shop/weihnachten'),{waitUntil:'domcontentloaded'});
 await expect(page.locator('.bh-shop-lock')).toContainText('1');
 await expect(page.locator('[data-bh-buy="weihnachtsbaum"]')).toBeDisabled();
 await seed(page,6);
 await page.goto(url('baumhaus/shop/weihnachten'));
 await expect(page.locator('.bh-shop-lock')).toHaveCount(0);
 await page.locator('[data-bh-buy="weihnachtsbaum"]').click();
 await page.locator('[data-bh-buy="kugeln"]').click();
 await page.goto(url('baumhaus'));
 await expect(page.locator('[data-bh-select="weihnachtsbaum"]')).toBeVisible();
 await page.locator('[data-bh-choose="weihnachtsbaum"]').click();
 await expect(page.locator('[data-bh-decorate]')).toBeVisible();
 await page.locator('[data-bh-decorate]').click();
 const decorated=await page.evaluate(()=>JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')).decorated);
 expect(decorated).toBe(true);
});
test('Erst nach zehn unterschiedlichen Prüfungen ist das zweite Zimmer kaufbar und leer',async ({page})=>{
 await seed(page,10);
 await page.goto(url('baumhaus/shop/extra'));
 await page.locator('[data-bh-buy="zimmer2"]').click();
 await page.goto(url('baumhaus'));
 await expect(page.locator('[data-bh-room="2"]')).toBeVisible();
 await expect(page.locator('.bh-room-stage')).toBeVisible();
 await expect(page.locator('[data-bh-select="start-sitzsack"]')).toHaveCount(0);
 await expect(page.locator('[data-bh-select="start-laptop"]')).toHaveCount(0);
 await page.locator('[data-bh-room="1"]').click();
 await expect(page.locator('[data-bh-select="start-sitzsack"]')).toBeVisible();
});
test('Das Bestehen des gleichen Tests bringt auch nach Neustart nicht doppelte Taler',async ({page})=>{
 await seed(page,1);
 await page.evaluate(key=>{
  const state=JSON.parse(localStorage.getItem(key));
  state['hoeren:test:1'].answers.forEach(x=>x.correct=false);
  localStorage.setItem(key,JSON.stringify(state));
 },KEY);
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('.bh-stats')).toContainText('10');
 const count=await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('majas-wortwerkstatt-baumhaus-v1')).best).length);
 expect(count).toBe(1);
});
