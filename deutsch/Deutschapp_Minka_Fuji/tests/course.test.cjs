const { test }=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const fs=require('node:fs/promises');
const {chromium}=require('playwright');
const app=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;
const solutions=[
  [{gaps:[1,2,0,3]},{choice:0}],
  [{choice:1},{choice:0}],
  [{gaps:[1,0]},{gaps:[2,0]}],
  [{gaps:[0,2]},{choice:1}],
  [{gaps:[0,1,2]},{choice:2}],
  [{pieces:[2,3,0,1]},{pieces:[2,3,0,1]}],
  [{gaps:[1,2,0]},{choice:2}],
  [{gaps:[0,1,2,1]},{pieces:[2,3,1,4,5,0]}]
];
const story='Minkas Entdeckung\n\nAn einem Herbstnachmittag suchte Minka mit Fuji im Garten ihren Ball. Hinter dem Schuppen kratzte etwas. Vorsichtig schlich Minka näher. Fuji spähte durch den schmalen Türspalt. „Hörst du das?“, fragte Minka. Unter einem Topf steckte ein Igel. Gemeinsam hoben sie den Topf an. Erleichtert sahen sie dem Igel nach. <script>window.unwanted=true</script>';
test('Geführter Lehrgang: Animation, Lernweg, Speicherung und eigenes Schreibprojekt',async t=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const open=async()=>{await page.goto(app);await page.click('[data-page="lehrgang"]');};
  const choose=async answer=>{
    if(answer.gaps)for(let i=0;i<answer.gaps.length;i++)await page.selectOption(`[data-course-gap="${i}"]`,String(answer.gaps[i]));
    if(answer.choice!==undefined)await page.click(`[data-course-choice="${answer.choice}"]`);
    if(answer.pieces)for(const i of answer.pieces)await page.click(`[data-course-piece="${i}"]`);
    await page.click('#course-check');
  };
  try {
    await t.test('Beispiele lassen sich schrittweise, automatisch und ohne Bewegung bedienen',async()=>{
      await open();assert.equal(await page.locator('[data-course-lesson]').count(),9);
      await page.clock.install();
      await page.click('#course-frame-next');assert.match(await page.locator('#course-film-window').textContent(),/Wann und wo/);
      await page.click('#course-play');await page.clock.runFor(6700);
      assert.match(await page.locator('#course-film-window').textContent(),/Was tun die beiden/);
      await page.click('#course-play');const paused=await page.locator('#course-film-window').textContent();
      await page.clock.runFor(6000);assert.equal(await page.locator('#course-film-window').textContent(),paused);
      await page.check('#course-motion');assert.equal(await page.locator('#course-play').isDisabled(),true);
      await page.click('#course-frame-next');assert.match(await page.locator('#course-film-window').textContent(),/So fließt der Anfang/);
      await page.uncheck('#course-motion');
      await page.click('#course-play');await page.clock.runFor(6700);await page.click('[data-page="lesen"]');
      const frame=await page.locator('#course-film-window').textContent();await page.clock.runFor(6000);
      assert.equal(await page.locator('#course-film-window').textContent(),frame);
      await page.click('[data-page="lehrgang"]');
    });
    await t.test('Satzbausteine funktionieren auch mit der Tastatur und können zurückgenommen werden',async()=>{
      await page.click('[data-course-lesson="5"]');await page.click('[data-course-phase="1"]');
      await page.locator('[data-course-piece="2"]').press('Space');
      assert.equal(await page.locator('[data-course-piece="2"]').isDisabled(),true);
      assert.equal(await page.locator('.course-built').textContent(),'Vorsichtig');
      assert.equal(await page.evaluate(()=>document.activeElement.dataset.coursePiece),'0');
      await page.locator('#course-undo').press('Enter');assert.match(await page.locator('.course-built').textContent(),/Noch kein Baustein/);
      assert.equal(await page.locator('#course-check').isDisabled(),true);
      await page.click('[data-course-phase="0"]');await page.click('[data-course-lesson="0"]');
    });
    await t.test('Alle acht Lernstationen mit 16 Übungen, Beispielen und Schreibproben durchlaufen',async()=>{
      for(let i=0;i<8;i++){
        await page.click(`[data-course-lesson="${i}"]`);
        for(let frame=0;frame<4;frame++){
          await page.click(`[data-course-frame="${frame}"]`);
          assert.ok((await page.locator('#course-film-window .course-explain p').textContent()).length>50);
        }
        await page.click('#course-step-next');
        assert.equal(await page.locator('#course-step-next').isDisabled(),true);
        await choose(solutions[i][0]);assert.match(await page.locator('#course-task-feedback').textContent(),/^Richtig\./);
        await page.click('#course-step-next');await choose(solutions[i][1]);
        assert.match(await page.locator('#course-task-feedback').textContent(),/^Richtig\./);
        await page.click('#course-step-next');
        await page.fill('#course-mini-draft',`Meine Schreibprobe aus Station ${i+1}: Minka schlich zur Tür.`);
        await page.check('#course-remember');await page.click('#course-step-next');
      }
      assert.match(await page.locator('#course-overall').textContent(),/8 von 9 Stationen abgeschlossen/);
      assert.match(await page.locator('#course-overall').textContent(),/8 von 8 beim ersten Versuch/);
    });
    await t.test('Schreibprojekt mit Plan, Überarbeitung, sicherem Text und TXT-Export abschließen',async()=>{
      assert.equal(await page.locator('#course-final-next').isDisabled(),true);
      const plan={who:'Minka und Fuji',when:'Herbstnachmittag',where:'Garten',start:'Minka sucht den Ball, Fuji hilft',clue:'Kratzen im Schuppen',resolution:'Ein Igel steckt unter einem Topf. Gemeinsam befreien sie ihn.'};
      for(const [key,text]of Object.entries(plan))await page.fill(`[data-course-plan="${key}"]`,text);
      await page.click('#course-final-next');await page.fill('#course-final-title','Minkas Entdeckung');await page.fill('#course-final-draft',story);
      await page.click('#course-final-next');
      for(const check of await page.locator('[data-course-final-check]').all())await check.check();
      await page.fill('#course-final-draft',story+'\nEnde.');
      assert.equal(await page.locator('[data-course-final-check]:checked').count(),0);
      assert.equal(await page.locator('#course-final-next').isDisabled(),true);
      for(const check of await page.locator('[data-course-final-check]').all())await check.check();
      await page.click('#course-final-next');assert.equal(await page.locator('#course-reading-copy script').count(),0);
      assert.equal(await page.evaluate(()=>window.unwanted),undefined);
      const downloading=page.waitForEvent('download');await page.click('#course-download');const download=await downloading;
      assert.equal(download.suggestedFilename(),'Meine_Minka_Fuji_Geschichte.txt');
      const content=await fs.readFile(await download.path(),'utf8');assert.ok(content.includes(story));assert.ok(content.includes('MEIN ERZÄHLPLAN'));assert.ok(content.includes(plan.resolution));
      await page.evaluate(()=>document.body.classList.add('course-printing'));await page.emulateMedia({media:'print'});
      assert.equal(await page.locator('#course-map').isVisible(),false);assert.equal(await page.locator('#course-reading-copy').isVisible(),true);
      assert.equal(await page.locator('#course-download').isVisible(),false);
      await page.emulateMedia({media:'screen'});await page.evaluate(()=>document.body.classList.remove('course-printing'));
      await page.click('#course-final-finish');assert.match(await page.locator('#course-overall').textContent(),/9 von 9 Stationen abgeschlossen/);
      assert.match(await page.locator('#course-final-feedback').textContent(),/alle neun Stationen/);
      await page.clock.runFor(500);await page.reload();await page.click('[data-page="lehrgang"]');
      assert.match(await page.locator('#course-overall').textContent(),/9 von 9 Stationen abgeschlossen/);
      assert.equal(await page.locator('#course-reading-copy h3').textContent(),'Minkas Entdeckung');
      await page.click('[data-course-lesson="0"]');await page.click('[data-course-phase="3"]');
      assert.match(await page.locator('#course-mini-draft').inputValue(),/Station 1/);
    });
    await t.test('Fehler, Korrekturen und Musterlösungen bleiben transparent; Wiederholen erhält Entwürfe',async()=>{
      await page.click('#course-repeat');
      for(const [i,value]of [0,2,0,3].entries())await page.selectOption(`[data-course-gap="${i}"]`,String(value));
      await page.click('#course-check');assert.match(await page.locator('#course-task-feedback').textContent(),/Baustein 1/);
      await page.selectOption('[data-course-gap="0"]','1');await page.click('#course-check');
      await page.click('#course-step-next');await page.click('#course-hint');await choose({choice:0});
      assert.match(await page.locator('#course-overall').textContent(),/7 von 8 beim ersten Versuch/);
      await page.click('#course-step-next');assert.match(await page.locator('#course-mini-draft').inputValue(),/Station 1/);
      await page.click('#course-repeat');await page.click('#course-task-model summary');
      await page.waitForFunction(()=>!document.getElementById('course-step-next').disabled);
      assert.equal(await page.locator('#course-step-next').isEnabled(),true);
      await page.click('#course-step-next');await page.click('#course-task-model summary');await page.click('#course-step-next');
      assert.match(await page.locator('#course-stage').textContent(),/mit der Musterlösung/);
      assert.match(await page.locator('#course-overall').textContent(),/7 von 8 beim ersten Versuch/);
    });
    await t.test('Lernweg bleibt auf schmalem Handy und Tablet bedienbar',async()=>{
      for(const width of [320,390,768]){
        await page.setViewportSize({width,height:900});
        for(let i=0;i<9;i++){
          await page.click(`[data-course-lesson="${i}"]`);
          if(i<8)await page.click('[data-course-phase="0"]');
          const size=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,width:innerWidth}));
          assert.ok(size.actual<=size.width+1,`Station ${i+1}: ${size.actual} > ${size.width}`);
          if(i<8){await page.click('[data-course-phase="2"]');const taskSize=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(taskSize<=width+1);}
        }
      }
    });
    await t.test('Bewegungsreduktion wird aus der Geräteeinstellung übernommen',async()=>{
      await page.emulateMedia({reducedMotion:'reduce'});await page.click('[data-course-lesson="0"]');await page.click('[data-course-phase="0"]');
      assert.equal(await page.locator('#course-play').isDisabled(),true);assert.equal(await page.locator('#course-motion').isChecked(),true);
      await page.click('[data-course-frame="2"]');assert.match(await page.locator('#course-film-window').textContent(),/Ausgangssituation/);
      await page.emulateMedia({reducedMotion:'no-preference'});
    });
    await t.test('Zurücksetzen erfordert eine bewusste Auswahl und kann abgebrochen werden',async()=>{
      await page.click('#course-reset');await page.click('#course-reset-cancel');
      assert.match(await page.locator('#course-overall').textContent(),/8 von 9 Stationen/);
      await page.click('#course-reset');await page.click('#course-reset-yes');
      assert.match(await page.locator('#course-overall').textContent(),/0 von 9 Stationen/);
      await page.click('[data-course-lesson="8"]');await page.click('[data-course-phase="1"]');
      assert.equal(await page.locator('#course-final-draft').inputValue(),'');
      await page.click('[data-course-phase="3"]');
      assert.equal(await page.locator('#course-download').isDisabled(),true);assert.equal(await page.locator('#course-print').isDisabled(),true);
    });
    await t.test('Kein Browserspeicher und fehlerhafte Altdaten verhindern das Lernen nicht',async()=>{
      const blocked=await browser.newPage();
      await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')};});
      await blocked.goto(app);await blocked.click('[data-page="lehrgang"]');
      assert.match(await blocked.locator('#course-storage').textContent(),/kein Speichern/);
      await blocked.click('[data-course-phase="1"]');assert.equal(await blocked.locator('[data-course-gap]').count(),4);await blocked.close();
      const corrupt=await browser.newPage();
      await corrupt.addInitScript(()=>localStorage.setItem('minka-fuji-lehrgang-v1',JSON.stringify({version:1,current:999,lessons:{orientierung:{phase:-5,frame:100,records:[{values:['bad'],solved:true,first:'bad'}]}},final:{phase:999,plan:{who:{}},draft:[],checks:'not-an-array',done:true}})));
      await corrupt.goto(app);await corrupt.click('[data-page="lehrgang"]');
      assert.match(await corrupt.locator('#course-overall').textContent(),/0 von 9/);assert.match(await corrupt.locator('#course-heading').textContent(),/Orientierung/);await corrupt.close();
    });
    await t.test('Keine JavaScript-Laufzeitfehler im vollständigen Lernweg',()=>assert.deepEqual(errors,[]));
  }finally{await browser.close();}
});
