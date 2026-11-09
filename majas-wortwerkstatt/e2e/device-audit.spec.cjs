'use strict';
/*
 * Browser-engine compatibility audit. Tests simulate screen size and touch events.
 * They DO NOT claim verification of real device speakers, Safari on iOS, or Bluetooth.
 */
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const AxeBuilder=require('@axe-core/playwright').default;
const url=hash=>'/majas-wortwerkstatt/'+(hash?'#'+hash:'');
const screenshot=async(page,info,subject)=>{
  const directory=path.resolve(__dirname,'../qa-device-shots');
  fs.mkdirSync(directory,{recursive:true});
  await page.screenshot({path:path.join(directory,info.project.name+'-'+subject+'.png'),animations:'disabled'});
};
const errors=[];
test.beforeEach(async({page})=>{
  page.on('pageerror',err=>errors.push(err.message));
});
test.afterEach(async()=>{
  expect(errors.splice(0),'Unerwartete JavaScript-Ausnahmen').toEqual([]);
});

test('Start, Hören, Comics, Schrank, Baumhaus und Advent ohne horizontales Scrollen',async({page},info)=>{
 const samples=[
  ['', '.maja-advent-highlight','start'],
  ['pruefung/hoeren/ueben/1','#prep-play','hoeren'],
  ['tagescomic/melody-und-die-hausaufgaben/1','.kino-controls','comic'],
  ['baerli/schrank/saison','.bw-category-grid','saison'],
  ['baerli/schrank/weihnachten/saison-weihnachtsmuetze','.bw-figure','muetze'],
  ['baumhaus','.bh-shell','baumhaus'],
  ['advent','.adv-calendar','advent']
 ];
 for(const [hash,selector,key] of samples){
   await page.goto(url(hash),{waitUntil:'domcontentloaded'});
   await expect(page.locator(selector).first(),key+' fehlt').toBeVisible();
   const result=await page.evaluate(()=>{
     const width=document.documentElement.clientWidth;
     return {client:width,scroll:document.documentElement.scrollWidth,broken:[...document.images]
       .filter(img=>img.complete&&img.currentSrc&&img.naturalWidth===0)
       .map(img=>({src:img.currentSrc,alt:img.alt}))};
   });
   expect(result.scroll-result.client,key+' ragt horizontal aus dem Bildschirm').toBeLessThanOrEqual(2);
   expect(result.broken,key+' enthält defekte Bilder').toEqual([]);
   if(['comic','muetze','baumhaus','advent'].includes(key))await screenshot(page,info,key);
 }
});

test('Hörtext: fünf vorhandene MP3-Dateien und Aufnahmesteuerung mit drei Geschwindigkeiten',async({page},info)=>{
 const audioNames=['der-falsche-kuchen','rettung-fuer-eine-schnecke','der-koffer-mit-dem-loch','das-fenster-voller-sterne','die-letzte-kastanie'];
 for(let n=1;n<=5;n++){
   await page.goto(url('pruefung/hoeren/test/'+n),{waitUntil:'domcontentloaded'});
   await expect(page.locator('#prep-audio')).toHaveAttribute('src',new RegExp(audioNames[n-1]+'.mp3'));
   const src=await page.locator('#prep-audio').getAttribute('src');
   const response=await page.request.get(new URL(src,page.url()).href);
   expect(response.ok(),'MP3 nicht erreichbar: '+src).toBeTruthy();
   const bytes=await response.body();
   expect(bytes.length,'MP3 leer oder zu kurz: '+src).toBeGreaterThan(3000);
   expect(bytes.subarray(0,3).toString('latin1')==='ID3'||bytes[0]===255,'kein MP3-Signal: '+src).toBeTruthy();
   await expect(page.locator('#prep-reading')).toHaveCount(0);
 }
 await page.goto(url('pruefung/hoeren/ueben/1'),{waitUntil:'domcontentloaded'});
 await expect(page.locator('#prep-reading')).toHaveCount(1);
 const mode=page.locator('#prep-playback-mode'),rate=page.locator('#prep-playback-speed');
 await expect(mode).toBeVisible();
 await expect(rate).toBeVisible();
 await rate.selectOption('0.7');
 await page.locator('#prep-play').click();
 await expect.poll(()=>page.locator('#prep-audio').evaluate(a=>a.playbackRate)).toBe(0.7);
 await page.locator('#prep-stop').click();
 await expect(page.locator('#prep-audio-message')).toContainText('Gestoppt');
 await mode.selectOption('computer');
 await expect(page.locator('#prep-voice-row')).toBeVisible();
 await expect(page.locator('#prep-playback-speed')).toHaveValue('0.7');
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('#prep-playback-mode')).toHaveValue('computer');
 await expect(page.locator('#prep-playback-speed')).toHaveValue('0.7');
 await screenshot(page,info,'hoeren-steuerung');
});

test('Comic: Zoom, Blasen, Bildwechsel und Tastatur-/Touch-Bedienung',async({page},info)=>{
 await page.goto(url('tagescomic/melody-und-die-hausaufgaben/1'),{waitUntil:'domcontentloaded'});
 await expect(page.locator('.kino-controls')).toBeVisible();
 await expect(page.locator('#kino-speed')).toBeVisible();
 await page.locator('#kino-speed').selectOption('0.8');
 await expect(page.locator('#kino-speed')).toHaveValue('0.8');
 const separated=page.locator('#kino-separate');
 await separated.setChecked(true);
 await expect(page.locator('.detective-panels')).toHaveClass(/kino-separated/);
 await page.locator('[data-kino-zoom="0"]').click();
 await expect(page.locator('.kino-dialog')).toHaveAttribute('open','');
 await expect(page.locator('.kino-zoom-art')).toBeVisible();
 await page.locator('.kino-close').click();
 await expect(page.locator('.kino-dialog')).not.toHaveAttribute('open','');
 const steps=page.locator('.kino-step-controls');
 if(await steps.count()){
  await expect(page.locator('.kino-panel-wrap:visible')).toHaveCount(1);
  await page.locator('[data-kino-next]').click();
  await expect(page.locator('.kino-step-count')).toContainText('Bild 2');
  await page.locator('[data-kino-prev]').click();
  await expect(page.locator('.kino-step-count')).toContainText('Bild 1');
 }
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('#kino-speed')).toHaveValue('0.8');
 await expect(page.locator('#kino-separate')).toBeChecked();
 await screenshot(page,info,'comic-zoom');
});

test('Schrank und Baumhaus: Anprobe ohne Käufe, Laptop-Shop bedienbar',async({page},info)=>{
 await page.goto(url('baerli/schrank/weihnachten/saison-weihnachtsmuetze'),{waitUntil:'domcontentloaded'});
 const before=await page.evaluate(()=>({outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1'),wallet:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1')}));
 await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id','saison-weihnachtsmuetze');
 await page.locator('[data-bw-move="1"]').click();
 const after=await page.evaluate(()=>({outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1'),wallet:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1')}));
 expect(after).toEqual(before);
 await page.goto(url('baumhaus'),{waitUntil:'domcontentloaded'});
 await expect(page.locator('.bh-locked')).toBeVisible();
 await page.evaluate(()=>{
   localStorage.setItem('majas-wortwerkstatt-klassenarbeiten-nov2026-v1',JSON.stringify({
     'hoeren:test:1':{done:true,assisted:false,answers:Array.from({length:5},(_,i)=>({id:'h'+i,correct:true,given:'x'}))}
   }));
 });
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('.bh-room-stage')).toBeVisible();
 await expect(page.locator('[data-bh-select="start-sitzsack"]')).toBeVisible();
 await page.locator('[data-bh-select="start-laptop"]').click();
 await expect(page).toHaveURL(/#baumhaus\/shop$/);
 await expect(page.locator('.bh-shop-brand')).toContainText('Bärli AG Osnabrück');
 await screenshot(page,info,'baumhaus-shop');
});

test('Basis-Barrierefreiheit von neuen interaktiven Bereichen',async({page},info)=>{
 test.skip(info.project.name==='small-phone-webkit','nicht jedes schmale Display doppelt scannen');
 for(const hash of ['baumhaus','advent','baerli/schrank/saison']){
   await page.goto(url(hash),{waitUntil:'domcontentloaded'});
   const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
   const serious=results.violations.filter(v=>['serious','critical'].includes(v.impact));
   expect(serious.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),
     hash+' enthält schwere Barrieren').toEqual([]);
 }
});
