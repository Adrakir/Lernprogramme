const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {chromium}=require('playwright');
const url=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
test('Hauptteil-Werkstatt: alle Themen, Niveaus, Hilfen, Texte und mobile Darstellung',async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:850}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(url);
    await page.click('[data-page="hauptteil"]');
    assert.equal(await page.locator('#body-map [data-body-topic]').count(),13);
    assert.equal(await page.locator('#body-progress').getAttribute('max'),'39');
    assert.match(await page.locator('#body-current-title').textContent(),/Gefühle/);
    await page.click('[data-body-option="0"]');
    await page.click('#body-hint');
    assert.ok((await page.locator('#body-hint-text').textContent()).length>10);
    await page.click('#body-check');
    assert.match(await page.locator('#body-response').textContent(),/Noch nicht richtig/);
    await page.click('#body-solution-toggle');
    assert.match(await page.locator('#body-full-solution').textContent(),/Richtige Antwort: B/);
    await page.click('#body-reset-question');
    assert.equal(await page.locator('#body-full-solution').isVisible(),false);
    for(let topic=0;topic<13;topic++){
      await page.click('[data-body-topic="'+topic+'"]');
      assert.ok((await page.locator('#body-before').textContent()).length>8);
      assert.ok((await page.locator('#body-after').textContent()).length>8);
      assert.equal(await page.locator('#body-steps li').count(),4);
      for(let level=0;level<3;level++){
        await page.click('[data-body-level="'+level+'"]');
        assert.equal(await page.locator('#body-options button').count(),3);
        let solved=false;
        for(let answer=0;answer<3;answer++){
          await page.click('[data-body-option="'+answer+'"]');
          await page.click('#body-check');
          if((await page.locator('#body-response').textContent()).startsWith('Richtig.')){solved=true;break;}
          assert.match(await page.locator('#body-response').textContent(),/Noch nicht richtig/);
        }
        assert.ok(solved,'Thema '+topic+' Stufe '+level);
        assert.equal(await page.locator('#body-next').isEnabled(),true);
        await page.click('#body-solution-toggle');
        assert.match(await page.locator('#body-full-solution').textContent(),/Richtige Antwort:/);
      }
      await page.fill('#body-draft','Minka dachte nach. Dann schlich sie zur Tür.');
      await page.locator('[data-body-check="0"]').check();
    }
    assert.match(await page.locator('#body-progress-text').textContent(),/39 von 39/);
    await page.reload();
    await page.click('[data-page="hauptteil"]');
    assert.match(await page.locator('#body-progress-text').textContent(),/39 von 39/);
    await page.click('[data-body-topic="0"]');
    assert.match(await page.locator('#body-draft').inputValue(),/schlich/);
    for(const width of [320,390,768]){
      await page.setViewportSize({width,height:850});
      for(const topic of [0,3,7,12]){
        await page.click('[data-body-topic="'+topic+'"]');
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Breitenüberlauf bei '+width+'px, Thema '+topic);
      }
    }
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});