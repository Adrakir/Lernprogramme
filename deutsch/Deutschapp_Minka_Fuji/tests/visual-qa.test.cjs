'use strict';
// Browserabnahme: Chromium + WebKit (Safari-nahe Engine), Desktop und schmale Displays.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium,webkit}=require('playwright');
const URL=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
const artifactDir=path.resolve(__dirname,'artifacts');
fs.mkdirSync(artifactDir,{recursive:true});
async function artwork(image,label){
 let result;
 for(let attempt=0;attempt<45;attempt++){
  result=await image.evaluate(img=>{
   const r=img.getBoundingClientRect(),s=getComputedStyle(img);
   return {width:r.width,height:r.height,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,display:s.display,visibility:s.visibility,src:img.getAttribute('src')};
  });
  if(result.naturalWidth>0&&result.naturalHeight>0)break;
  await new Promise(resolve=>setTimeout(resolve,80));
 }
 assert.ok(result.naturalWidth>0&&result.naturalHeight>0,label+' wird nicht dekodiert: '+JSON.stringify(result));
 assert.ok(result.width>=48&&result.height>=40&&result.display!=='none'&&result.visibility!=='hidden',label+' ist unsichtbar: '+JSON.stringify(result));
}
async function layout(page,label){
 const size=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
 assert.ok(size.scrollWidth<=size.width+2,label+': horizontaler Seitenüberlauf '+JSON.stringify(size));
}
test('Deutschapp: echte Browser- und Bildkontrolle auf Safari/WebKit und Chromium',async t=>{
 for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]){
  await t.test(engine+': Ansichten, Bilder, Aufgaben und Handy-Layout',async()=>{
   const browser=await browserType.launch({headless:true, ...(engine==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}:{})});
   try{
    for(const width of [320,390,1366]){
     const page=await browser.newPage({viewport:{width,height:880},deviceScaleFactor:1,acceptDownloads:true});
     const errors=[];page.on('pageerror',e=>errors.push(e.message));
     try{
      // Safari-/iMac-Kompatibilität: WebP absichtlich unzugänglich machen.
      if(width===1366)await page.route('**/*.webp',route=>route.abort());
      await page.goto(URL,{waitUntil:'load'});
      assert.equal(await page.locator('nav.navigation [data-page]').count(),9,'Neun integrierte Deutsch-Bereiche');
      await page.locator('[data-page="studio"]').click();
      await artwork(page.locator('#studio .studio-app-top img'),'Studio-Titelbild '+engine+' '+width);
      assert.equal(await page.locator('#studio .studio-choice').count(),3,'Drei Einstiege');
      assert.equal(await page.locator('#studio .studio-path-step').count(),7,'Sieben Lernschritte');
      await layout(page,'Studio '+engine+' '+width);
      if(width===1366)await page.screenshot({path:path.join(artifactDir,'deutsch-'+engine+'-desktop-start.png')});
      if(width===320)await page.screenshot({path:path.join(artifactDir,'deutsch-'+engine+'-handy-start.png')});

      // Alle Navigationseinträge wirklich besuchen: nicht nur existierende Links.
      for(const id of ['entdecken','spannung','ueben','schreiben','lesen','sprache','lehrgang','hauptteil']){
       await page.locator('[data-page="'+id+'"]').click();
       assert.equal(await page.locator('section#'+id).isVisible(),true,'Bereich erreichbar: '+id);
       await layout(page,id+' '+engine+' '+width);
      }
      await page.locator('[data-page="entdecken"]').click();
      await artwork(page.locator('#comic-image'),'Comicmotiv '+engine+' '+width);
      await artwork(page.locator('.guide-pair'),'Fuji/Minka-Figuren '+engine+' '+width);
      if(width===1366)assert.match(await page.locator('#comic-image').getAttribute('src'),/\.jpg$/,'Comic bei blockiertem WebP als JPEG');

      await page.locator('#scene-next').click();
      await artwork(page.locator('#comic-image'),'Comicmotiv nach Weiterblättern '+engine+' '+width);
      await page.locator('[data-page="hauptteil"]').click();
      await artwork(page.locator('#body-art'),'Hauptteil-Szenenbild '+engine+' '+width);
      if(width===1366)assert.match(await page.locator('#body-art').getAttribute('src'),/\.jpg$/,'Hauptteilbild bei blockiertem WebP als JPEG');
      await page.locator('[data-page="studio"]').click();
      await page.locator('[data-studio-view="builder"]').first().click();
      for(const id of ['leuchtturm','waldkarte','schleuse']){
       const opts=await page.locator('#up-scene option').evaluateAll(a=>a.map(x=>x.value));
       if(opts.includes(id)){
        await page.selectOption('#up-scene',id);
        const scenes=page.locator('.up-scene svg');
        assert.equal(await scenes.count(),6,'Sechs Vektorbilder zur Geschichte '+id);
        const sized=await scenes.first().evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
        assert.ok(sized.width>35&&sized.height>35,'SVG-Szene sichtbar '+id);
       }
      }
      await layout(page,'Bildergeschichten '+engine+' '+width);
      if(width===1366)await page.screenshot({path:path.join(artifactDir,'deutsch-'+engine+'-desktop-bildergeschichte.png')});
      assert.deepEqual(errors,[],'Ungefangene JS-Fehler '+engine+' '+width);
     }finally{await page.close();}
    }
   }finally{await browser.close();}
  });
 }
});
