const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const APP=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
test('Schreibakademie: Lerncoach, Reparatur, Textlupe, Lehrerbereich und mobile Darstellung',async t=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:920},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const open=async()=>{await page.goto(APP);await page.click('[data-page="studio"]');};
 const tab=async v=>page.click('.studio-tabs [data-studio-view="'+v+'"]');
 try{
  await t.test('20 Klassenarbeiten und 40 Original- plus neue SVG-Szenen verfügbar',async()=>{
    await open();await tab('exam');
    assert.equal(await page.locator('#studio-picker option').count(),20);
    for(const id of ['bild-kiste','bild-drachen','bild-tierheim','bild-theater','bild-planetarium','bild-museum']){
      await page.selectOption('#studio-picker',id);
      assert.equal(await page.locator('.studio-story-panel svg').count(),4);
      await page.locator('.studio-zoom').first().click();
      assert.equal(await page.locator('#ac-art-zoom').isVisible(),true);
      await page.locator('[data-ac-close-zoom]').click();
    }
    await page.selectOption('#studio-picker','reiz-markt');
    assert.equal(await page.locator('.studio-wordcards span').count(),4);
  });
  await t.test('Orientierungstest: 12 Aufgaben, sechs Kompetenzen und gezielte Empfehlung',async()=>{
    await tab('coach');
    assert.equal(await page.locator('.ac-question').count(),12);
    const answers=await page.evaluate(()=>window.MF_ACADEMY_DATA.diagnostics.map(q=>({id:q.id,right:q.right})));
    for(const {id,right} of answers)await page.locator('[data-ac-answer="'+id+'"][value="'+right+'"]').check();
    await page.click('[data-ac-submit]');
    assert.match(await page.locator('.ac-score').textContent(),/12 von 12/);
    assert.equal(await page.locator('.ac-skill').count(),6);
    assert.equal(await page.locator('[data-ac-answer="d01"]:not(:disabled)').count(),0);
    await page.click('[data-ac-redo]');
    assert.equal(await page.locator('.ac-score').count(),0);
  });
  await t.test('Reparaturwerkstatt: Hilfen, Textfassung, Versionslupe und lokale Speicherung',async()=>{
    await tab('repair');
    assert.equal(await page.locator('#ac-repair-pick option').count(),12);
    await page.selectOption('#ac-repair-pick','r09');
    await page.click('[data-ac-hint]');
    await page.click('[data-ac-hint]');
    assert.equal(await page.locator('.ac-hints li').count(),2);
    await page.fill('#ac-repair-text','Lea lauschte. Was bewegte sich hinter dem Vorhang?');
    await page.click('[data-ac-save-repair]');
    await page.fill('#ac-repair-text','Lea lauschte am Fenster. Was bewegte sich hinter dem Vorhang? Ihr Atem stockte. Vorsichtig ging sie näher.');
    await page.click('[data-ac-save-repair]');
    assert.match(await page.locator('.ac-version-panel').textContent(),/2 gespeicherte Fassungen/);
    await page.locator('.ac-diff summary').click();
    assert.ok(await page.locator('.ac-diff ins').count()>0);
    await page.locator('[data-ac-self="0"]').check();
    await page.reload();await tab('repair');
    await page.selectOption('#ac-repair-pick','r09');
    assert.match(await page.locator('#ac-repair-text').inputValue(),/Atem stockte/);
  });
  await t.test('Eigene Erzählung: zwei Fassungen und sechs manuelle Textfarben',async()=>{
    await tab('writer');await page.selectOption('#studio-picker','bibliothek');
    await page.fill('[data-studio-part="intro"]','Emma blätterte im Buch. Ihr Herz klopfte schnell.');
    await page.fill('[data-studio-part="body"]','Was bedeutete der Zettel? Sie ging zur Theke.');
    await page.click('[data-ac-save-writer]');
    await page.fill('[data-studio-part="body"]','Was bedeutete der geheimnisvolle Zettel? Emma schlich zur Theke und fragte nach dem Brief.');
    await page.click('[data-ac-save-writer]');
    assert.match(await page.locator('.ac-version-panel').textContent(),/2 gespeicherte Fassungen/);
    await page.locator('[data-studio-part="intro"]').evaluate(el=>{el.focus();el.setSelectionRange(26,48);el.dispatchEvent(new Event('select',{bubbles:true}));});
    await page.click('[data-ac-mark="gefuehl"]');
    assert.ok(await page.locator('.ac-mark-preview mark.ac-mark-gefuehl').count()>=1);
    await page.reload();await tab('writer');await page.selectOption('#studio-picker','bibliothek');
    assert.ok(await page.locator('.ac-mark-preview mark.ac-mark-gefuehl').count()>=1);
    await page.click('[data-ac-clear-marks]');
    assert.equal(await page.locator('.ac-mark-preview mark').count(),0);
  });
  await t.test('Lehrermaterialien: getrenntes Schülerblatt, Lösung, Raster, Schreibkonferenz',async()=>{
    await tab('teacher');
    assert.equal(await page.locator('#ac-teacher-task option').count(),20);
    await page.evaluate(()=>{window.print=()=>{};});
    for(const kind of ['student','solution','rubric','conference']){
      await page.click('[data-ac-print="'+kind+'"]');
      assert.ok((await page.locator('#ac-print-sheet').textContent()).length>150);
      if(kind==='student')assert.equal(await page.locator('#ac-print-sheet').textContent().then(t=>t.includes('Möglicher Handlungsverlauf')),false);
      if(kind==='solution')assert.match(await page.locator('#ac-print-sheet').textContent(),/Erwartungshorizont/);
      await page.evaluate(()=>document.body.classList.remove('ac-printing'));
    }
    assert.ok(await page.locator('#ac-tts-speed').count()>0);
    assert.ok(await page.locator('#ac-size').count()>0);
    await page.selectOption('#ac-size','1.24');
    await page.locator('#ac-contrast').check();
    assert.equal(await page.locator('#studio.academy-contrast').count(),1);
  });
  await t.test('Mobile Größen: alle neuen Bereiche ohne horizontales Scrollen',async()=>{
    for(const width of [320,390,768]){
      await page.setViewportSize({width,height:830});
      for(const view of ['coach','repair','teacher']){
        await tab(view);
        const size=await page.evaluate(()=>({w:document.documentElement.scrollWidth,inner:innerWidth}));
        assert.ok(size.w<=width+1,view+' bei '+width+': '+size.w);
      }
    }
  });
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});