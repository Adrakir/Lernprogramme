const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {chromium}=require('playwright');
const app=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;

test('Medien und Lernstand auf dem Handy',async t=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:320,height:780},isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await t.test('Üben ist ohne Wischen sichtbar und die Schreibaufgabe bleibt nach Neuladen erhalten',async()=>{
   await page.goto(app);
   const entry=page.getByRole('button',{name:'Üben',exact:true}),r=await entry.boundingBox();
   assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=320&&r.y+r.height<220);
   await entry.click();
   await page.locator('[data-language-topic="schluss"]').click();
   await page.getByRole('button',{name:'Selbst schreiben (10)'}).click();
   await page.locator('#language-next-task').click();
   const task=await page.locator('#language-jump').inputValue();
   await page.locator('#language-open-answer').fill('Fuji fand den Ball und brachte ihn nach Hause.');
   await page.locator('#language-check').click();
   await page.reload();
   await entry.click();
   assert.equal(await page.locator('#language-heading').textContent(),'Schluss und Auflösung');
   assert.equal(await page.locator('#language-jump').inputValue(),task);
   assert.equal(await page.locator('#language-open-answer').inputValue(),'Fuji fand den Ball und brachte ihn nach Hause.');
   assert.equal(await page.locator('#language-solution').evaluate(el=>el.open),true);
  });
  await t.test('Wortstellung, Bildlupe und Wal sind per Tastatur und Antippen bedienbar',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.locator('[data-language-topic="satzanfaenge"]').click();
   const demo=page.locator('.language-demo');
   await demo.getByRole('button',{name:'„Vorsichtig“ nach vorn'}).press('Enter');
   assert.deepEqual(await demo.locator('li').allTextContents(),['Vorsichtig','öffnete','Fuji','die Tür.']);
   assert.equal(await demo.evaluate(el=>el.getAnimations({subtree:true}).length),0);
   await demo.getByRole('button',{name:'Zurück zum ersten Satz'}).click();
   assert.deepEqual(await demo.locator('li').allTextContents(),['Fuji','öffnete','vorsichtig','die Tür.']);
   await page.locator('[data-page="spannung"]').click();
   await page.locator('[data-wal-button="3"]').press('Space');
   assert.match(await page.locator('#curve-explanation').textContent(),/Höhepunkt/);
   assert.equal(await page.locator('[data-wal-button="3"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-wal-button="1"] .wal-point').tap();
   assert.match(await page.locator('#curve-explanation').textContent(),/Erster Hinweis/);
   await page.locator('[data-wal-button="3"]').press('Enter');
   await page.locator('#show-curve-scene').click();
   await page.locator('#comic-zoom').click();
   assert.match(await page.locator('#comic-lightbox-title').textContent(),/Bild 5 von 6/);
   await page.locator('#comic-large-image').evaluate(img=>img.decode());
   const width=await page.locator('#comic-large-image').evaluate(img=>img.clientWidth);
   await page.locator('#comic-detail').click();
   assert.ok(await page.locator('#comic-large-image').evaluate(img=>img.clientWidth)>width);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#comic-lightbox').isVisible(),false);
   assert.equal(await page.locator('#comic-zoom').evaluate(el=>el===document.activeElement),true);
  });
  await t.test('Lehrgang pausiert die Bewegung und die festen Hörbeispiele sind decodierbar',async()=>{
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.locator('[data-page="lehrgang"]').click();
   await page.locator('[data-course-lesson="1"]').click();
   await page.locator('[data-course-frame="1"]').click();
   const effect=page.locator('.course-sound');
   await page.locator('#course-play').click();
   assert.equal(await effect.evaluate(el=>getComputedStyle(el).animationPlayState),'running');
   await page.locator('#course-play').click();
   assert.equal(await effect.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
   await page.locator('[data-course-lesson="4"]').click();
   assert.equal(await page.locator('#lehrgang .hearing-examples audio').count(),4);
   await page.getByRole('button',{name:'Üben',exact:true}).click();
   await page.locator('[data-language-topic="rede"]').click();
   const examples=page.locator('#sprache .hearing-examples');
   await examples.locator('summary').click();
   const durations=await examples.locator('audio').evaluateAll(async elements=>Promise.all(elements.map(audio=>new Promise((resolve,reject)=>{
    audio.addEventListener('loadedmetadata',()=>resolve(audio.duration),{once:true});
    audio.addEventListener('error',()=>reject(new Error(audio.currentSrc)),{once:true});
    audio.load();
   }))));
   assert.equal(durations.length,4);
   assert.ok(durations.every(seconds=>seconds>1&&seconds<10));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),320);
  });
  await t.test('Lesetandem behält Begleitsätze bei und liest beim Antippen genau einen Satz',async()=>{
   const speech=await context.newPage();
   await speech.addInitScript(()=>{
    window.spoken=[];
    window.SpeechSynthesisUtterance=function(text){this.text=text;};
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
     getVoices:()=>[],cancel:()=>{},pause:()=>{},resume:()=>{},
     speak:u=>{window.spoken.push(u.text);queueMicrotask(()=>u.onend());}
    }});
   });
   await speech.goto(app);
   await speech.locator('.studio-tabs [data-studio-view="portfolio"]').click();
   const text='„Hörst du das?“, fragte Minka. Fuji sah z. B. die rote Kiste. Dann lauschte sie.';
   const sentences=['„Hörst du das?“, fragte Minka.','Fuji sah z. B. die rote Kiste.','Dann lauschte sie.'];
   await speech.locator('#up-reading-text').fill(text);
   assert.deepEqual(await speech.locator('[data-up-sentence]').allTextContents(),sentences);
   await speech.locator('[data-up-sentence="0"]').click();
   assert.deepEqual(await speech.evaluate(()=>window.spoken),[sentences[0]]);
   await speech.locator('[data-up-read="start"]').click();
   assert.deepEqual(await speech.evaluate(()=>window.spoken),[sentences[0],...sentences]);
   await speech.close();
  });
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
