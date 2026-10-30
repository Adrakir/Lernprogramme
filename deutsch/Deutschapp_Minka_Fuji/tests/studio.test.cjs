const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const fs=require('node:fs/promises');
const {chromium}=require('playwright');
const url=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
test('Erzählstudio: geführter Lernweg, mehrere Geschichten, Klassenarbeit und interaktives Textlabor',async t=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const open=async()=>{await page.goto(url);await page.click('[data-page="studio"]');};
  try{
    await t.test('Start: drei klare Einstiege und sieben verknüpfte Lernschritte',async()=>{
      await open();
      assert.equal(await page.locator('#studio .studio-choice').count(),3);
      assert.equal(await page.locator('#studio .studio-path-step').count(),7);
      await page.locator('[data-studio-path-check="0"]').check();
      assert.match(await page.locator('#studio .studio-progress-line').textContent(),/1 von 7/);
      await page.locator('#studio-path-items [data-studio-route="spannung"]').click();
      assert.equal(await page.locator('#spannung').isVisible(),true);
      await page.click('[data-page="studio"]');
      assert.equal(await page.locator('[data-studio-path-check="0"]').isChecked(),true);
    });
    await t.test('Schreibwerkstatt: sechs unterschiedliche Geschichten, Bilder und schrittweiser Text',async()=>{
      await page.locator('[data-studio-view="writer"]').first().click();
      const titles=await page.locator('#studio-picker option').allTextContents();
      assert.equal(titles.length,6);
      assert.ok(titles.some(x=>x.includes('Schuppen')));
      assert.ok(titles.some(x=>x.includes('Pokal')));
      assert.ok(titles.some(x=>x.includes('Bücherregal')));
      await page.selectOption('#studio-picker','pokal');
      assert.match(await page.locator('.studio-story-title').textContent(),/Lina und Ben/);
      assert.equal(await page.locator('.studio-story-panel').count(),4);
      assert.equal(await page.locator('.studio-story-panel svg').count(),4);
      await page.click('[data-studio-scene="3"]');
      assert.match(await page.locator('.studio-scene-focus').textContent(),/Der Vorhang/);
      assert.equal(await page.locator('.studio-tension-graphic svg circle').count(),4);
      await page.fill('[data-studio-plan="figures"]','Lina und Ben');
      await page.fill('[data-studio-part="intro"]','Vor dem Schulfest suchten die beiden den Pokal.');
      await page.fill('[data-studio-part="body"]','Was war hinter dem Vorhang? Linas Hände zitterten. Sie schlich näher und zog den Vorhang beiseite.');
      await page.fill('[data-studio-part="end"]','Erleichtert brachten sie den gefundenen Pokal zurück.');
      assert.match(await page.locator('#studio-writer-preview').textContent(),/Vorhang beiseite/);
      await page.locator('[data-studio-writer-check="0"]').check();
      assert.match(await page.locator('#studio-writer-checkinfo').textContent(),/1 von 7/);
      await page.fill('[data-studio-part="end"]','Zufrieden ging Lina mit Ben zurück.');
      assert.equal(await page.locator('[data-studio-writer-check="0"]').isChecked(),false);
      const wait=page.waitForEvent('download');await page.click('[data-studio-download="writer"]');
      const downloaded=await wait;assert.match(downloaded.suggestedFilename(),/Erzaehlung/);
      const txt=await fs.readFile(await downloaded.path(),'utf8');assert.match(txt,/Lina und Ben/);
      await page.reload();
      assert.equal(await page.locator('#studio-picker').inputValue(),'pokal');
      assert.match(await page.locator('[data-studio-part="body"]').inputValue(),/Linas Hände zitterten/);
    });
    await t.test('Klassenarbeit: acht Aufgaben, Hilfen, Simulation, Rubrik, Sicherung und Textänderung',async()=>{
      await page.click('.studio-tabs [data-studio-view="exam"]');
      assert.equal(await page.locator('#studio-picker option').count(),20);
      await page.selectOption('#studio-picker','reiz-dachboden');
      assert.equal(await page.locator('.studio-wordcards span').count(),4);
      await page.selectOption('#studio-picker','bild-fahrrad');
      assert.equal(await page.locator('.studio-story-panel svg').count(),4);
      await page.selectOption('#studio-picker','reiz-dachboden');
      await page.click('[data-studio-exam-hint]');
      assert.match(await page.locator('.studio-hintlist').textContent(),/Hinweis 1/);
      await page.check('input[name="studio-exam-mode"][value="simulation"]');
      assert.equal(await page.locator('[data-studio-exam-hint]').count(),0);
      await page.fill('[data-studio-exam-title]','Der geheimnisvolle Dachboden');
      await page.fill('[data-studio-exam-text]','Ich nahm die Taschenlampe. Auf dem Dachboden hörte ich ein Klopfen. Mein Herz schlug schneller. Ich fasste Mut und rief nach meiner Schwester.');
      await page.click('[data-studio-exam-submit]');
      assert.equal(await page.locator('[data-studio-rating]').count(),6);
      await page.selectOption('[data-studio-rating="0"]','2');
      await page.selectOption('[data-studio-rating="1"]','1');
      assert.match(await page.locator('#studio-score').textContent(),/3 von 12/);
      assert.match(await page.locator('#studio-score').textContent(),/Selbsteinschätzung/);
      const wait=page.waitForEvent('download');await page.click('[data-studio-download="exam"]');
      const saved=await wait;assert.match(await fs.readFile(await saved.path(),'utf8'),/Dachboden/);
      await page.fill('[data-studio-exam-text]','Eine vollständig überarbeitete Fassung.');
      assert.equal(await page.locator('#studio-exam-review').count(),0);
      await page.click('[data-studio-exam-submit]');
      assert.equal(await page.locator('[data-studio-rating]').count(),6);
      assert.equal(await page.locator('[data-studio-rating="0"]').inputValue(),'');
    });
    await t.test('Textlabor: sechs Texte, vier Markierungen, Rückmeldung und eigene Überarbeitung',async()=>{
      await page.click('.studio-tabs [data-studio-view="lab"]');
      assert.equal(await page.locator('#studio-picker option').count(),6);
      for(const name of ['gefuehle','schule','see','buch','wald','musik']){
        await page.selectOption('#studio-picker',name);
        assert.equal(await page.locator('[data-studio-fragment]').count(),4);
        const story=await page.evaluate(name=>window.MF_STUDIO_DATA.labs.find(x=>x.id===name),name);
        for(let i=0;i<story.fragments.length;i++){
          await page.click('[data-studio-tag="'+story.fragments[i][1]+'"]');
          await page.click('[data-studio-fragment="'+i+'"]');
        }
        await page.click('[data-studio-lab-check]');
        assert.match(await page.locator('.studio-lab-feedback').textContent(),/4 von 4/);
        await page.locator('#studio-lab-explain summary').click();
        assert.match(await page.locator('#studio-lab-explain').textContent(),/Höhepunkt/);
        await page.fill('[data-studio-lab-revision]','Hier schreibe ich eine anschauliche Szene mit einem Gedanken und einer Handlung.');
        await page.locator('[data-studio-lab-self="0"]').check();
        assert.match(await page.locator('#studio-lab-self-status').textContent(),/1 von 3/);
      }
      await page.reload();
      await page.click('.studio-tabs [data-studio-view="lab"]');
      await page.selectOption('#studio-picker','schule');
      assert.equal(await page.locator('[data-studio-fragment="0"]').getAttribute('class').then(s=>s.includes('marked')),true);
    });
    await t.test('Schmale Ansicht: keine horizontale Seitenüberläufe in vier Werkstätten',async()=>{
      for(const w of [320,390,768]){
        await page.setViewportSize({width:w,height:850});
        for(const view of ['path','writer','exam','lab']){
          await page.click('.studio-tabs [data-studio-view="'+view+'"]');
          const dims=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
          const blockers=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const b=el.getBoundingClientRect();return b.right>innerWidth+1&&b.width>0}).slice(0,10).map(el=>[el.tagName,el.id,String(el.className).slice(0,45),Math.round(el.getBoundingClientRect().right)]));
          assert.ok(dims.scroll<=w+1,view+' @'+w+'px: '+dims.scroll+' Verursacher '+JSON.stringify(blockers));
        }
      }
    });
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});