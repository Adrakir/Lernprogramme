const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const APP=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
test('Ausbau: Bilderkino, Geschichtenbaukasten, Textcoach, Schreibprobe, Portfolio und Lehrerwerkzeuge',async t=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const tab=async id=>page.locator('[data-studio-view="'+id+'"]').first().click();
 try{
  await page.goto(APP);await page.locator('[data-page="studio"]').first().click();
  await t.test('Drei Bildergeschichten mit sechs echten Vektor-Szenen, Zoom und Umschalten',async()=>{
   await tab('builder');
   assert.equal(await page.locator('#up-scene option').count(),3);
   assert.equal(await page.locator('.up-scene svg').count(),6);
   assert.equal(await page.locator('[data-up-card]').count(),7);
   await page.locator('[data-up-zoom="2"]').click();
   assert.equal(await page.locator('#up-zoom-dialog').isVisible(),true);
   await page.locator('[data-up-close]').click();
   await page.selectOption('#up-scene','waldkarte');
   assert.match(await page.locator('.up-gallery').textContent(),/roten Kreuz/);
   assert.equal(await page.locator('.up-scene svg').count(),6);
  });
  await t.test('Handlungskarten sortieren, Bauplan speichern und kontrollieren',async()=>{
   await page.locator('[data-up-move="0:1"]').click();
   await page.locator('[data-up-note="intro"]').fill('Mia und Tariq machen sich früh auf den Weg.');
   await page.locator('[data-up-plancheck]').click();
   assert.match(await page.locator('#up-plan-feedback').textContent(),/Planungspunkten/);
   await tab('feedback');await tab('builder');
   assert.match(await page.locator('[data-up-note="intro"]').inputValue(),/Mia und Tariq/);
  });
  await t.test('Regel-Textcoach: wiederkehrende Satzanfänge und Wortschatz erklären, keine Note',async()=>{
   await tab('feedback');
   await page.locator('[data-up-load="sample"]').click();
   assert.match(await page.locator('.up-analysis').textContent(),/Viele „dann“/);
   assert.match(await page.locator('.up-analysis').textContent(),/Allgemeine Wörter/);
   assert.equal(await page.locator('.up-writing-prompt').count(),3);
  });
  await t.test('Schreibdiagnose verlangt echten Textbeleg, empfiehlt Übungen und zeigt Schreibkonferenz',async()=>{
   const story='Die Klasse wanderte am Morgen zum Leuchtturm. Nele sah dort ein merkwürdiges Licht und hielt den Atem an.';
   await page.locator('[data-up-draft="schleuse"]').fill(story);
   await page.locator('[data-up-evidence="schleuse"]').fill('Dieser Satz steht nicht im Text');
   await page.locator('[data-up-rating="schleuse"]').selectOption('2');
   await page.locator('[data-up-checkwriting="schleuse"]').click();
   assert.match(await page.locator('#up-write-status-schleuse').textContent(),/wortwörtlich/);
   await page.locator('[data-up-evidence="schleuse"]').fill('Nele sah dort ein merkwürdiges Licht');
   await page.locator('[data-up-checkwriting="schleuse"]').click();
   assert.match(await page.locator('#up-write-status-schleuse').textContent(),/Textbeleg hinterlegt/);
   assert.equal(await page.locator('.up-path-card').count(),6);
   await page.locator('[data-up-conf="2"]').click();
   assert.match(await page.locator('.up-conf-feedback').textContent(),/Körperreaktion/);
   await page.locator('[data-up-conftext]').fill('Beschreibe zum Beispiel, dass ihre Hände zittern.');
   await tab('builder');await tab('feedback');
   await page.locator('[data-up-conf="2"]').click();
   assert.match(await page.locator('[data-up-conftext]').inputValue(),/Hände zittern/);
   await page.locator('[data-up-train="aufbau"]').click();
   assert.match(await page.locator('#studio-workspace').textContent(),/Geschichten-Reparaturwerkstatt/);
  });
  await t.test('Lesetandem markiert Sätze und Backup-Export ist möglich',async()=>{
   await tab('portfolio');
   await page.locator('#up-reading-text').fill('Mia hörte ein Geräusch. Sie blieb stehen. Dann holte sie Hilfe.');
   assert.equal(await page.locator('.up-read-line').count(),3);
   const downloadPromise=page.waitForEvent('download');
   await page.locator('[data-up-backup]').click();
   const dl=await downloadPromise;
   assert.match(dl.suggestedFilename(),/Deutsch_Erzaehlwerkstatt_Lernstand/);
   await page.locator('#up-import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"bad":true}')});
   assert.match(await page.locator('#up-backup-status').textContent(),/Kein gültiges/);
  });
  await t.test('Lehrkräfte erstellen 6-Bilder-Arbeiten mit zwei getrennten Druckfassungen',async()=>{
   await tab('teacher');
   assert.equal(await page.locator('#up-teacher-scene option').count(),3);
   await page.locator('#up-teacher-title').fill('Klassenarbeit: Das geheimnisvolle Licht');
   await page.locator('#up-teacher-scene').selectOption('leuchtturm');
   await page.locator('#up-teacher-minutes').selectOption('50');
   await page.evaluate(()=>{window.print=()=>{};});
   await page.locator('[data-up-print="student"]').click();
   assert.equal(await page.locator('#ac-print-sheet svg').count(),6);
   assert.doesNotMatch(await page.locator('#ac-print-sheet').textContent(),/Lehrerblatt und Erwartungshorizont/);
   await page.evaluate(()=>document.body.classList.remove('ac-printing'));
   await page.locator('[data-up-print="teacher"]').click();
   assert.match(await page.locator('#ac-print-sheet').textContent(),/Erwartungshorizont/);
   await page.evaluate(()=>document.body.classList.remove('ac-printing'));
  });
  await t.test('Mobil: 320, 390 und 768 px ohne horizontales Dokument-Überlaufen',async()=>{
   for(const width of [320,390,768]){
    await page.setViewportSize({width,height:850});
    for(const v of ['builder','feedback','portfolio','teacher']){
     await tab(v);
     const z=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
     assert.ok(z.scroll<=z.width+1, v+' '+width+'px: '+z.scroll+' document width '+z.width);
    }
   }
  });
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});