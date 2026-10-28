const { test } = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require('playwright');

const app = process.env.DEUTSCH_APP_URL || pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const solutions = {
  schlingen:[1,2,0,1], gehen:[1,2,0,1], sehen:[2,0,1,2],
  sagen:[1,0,2,1], satzanfaenge:[0,1,2,1], adjektive:[1,2,0,1], rede:[1,1,0,2]
};
test('Erzählwerkstatt: Interaktionen, Lernbilanz, Schreibtexte und mobile Darstellung', async t => {
  const browser = await chromium.launch({
    headless:true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {}),
    args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']
  });
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function open(){await page.goto(app);await page.click('[data-page="sprache"]');}
  async function answer(index){
    if(await page.locator('#language-gap').count()) await page.selectOption('#language-gap', String(index));
    else await page.click(`[data-language-answer="${index}"]`);
    await page.click('#language-check');
  }
  try {
    await t.test('Alle 28 Aufgaben lassen sich lösen; Wortschatz und Mustertexte sind erreichbar',async()=>{
      await open();assert.equal(await page.locator('[data-language-topic]').count(),7);
      for(const [id,answers] of Object.entries(solutions)){
        await page.click(`[data-language-topic="${id}"]`);
        const bank=page.locator('.language-theory + article details');
        await bank.locator('summary').click();
        assert.ok(await bank.locator('.language-word').count()>=4);
        for(let i=0;i<answers.length;i++){
          await page.selectOption('#language-jump',String(i));await answer(answers[i]);
          assert.match(await page.locator('#language-answer-feedback').textContent(),/^Richtig\./);
          assert.equal(await page.locator('#language-check').isDisabled(),true);
        }
        assert.match(await page.locator('#language-score').textContent(),/4 von 4 bearbeitet · 4 beim ersten Versuch/);
        await page.locator('.language-writing details summary').click();
        assert.ok((await page.locator('.language-writing details .model-text').textContent()).length>100);
      }
      assert.match(await page.locator('#language-total').textContent(),/28 von 28 Aufgaben bearbeitet · 28 beim ersten Versuch/);
      await page.fill('#language-draft','Minka fragte: „Kommst du mit?“');
      await page.click('#language-repeat');
      assert.match(await page.locator('#language-score').textContent(),/0 von 4 bearbeitet/);
      assert.match(await page.locator('#language-total').textContent(),/24 von 28 Aufgaben bearbeitet/);
      assert.equal(await page.locator('#language-draft').inputValue(),'Minka fragte: „Kommst du mit?“');
    });
    await t.test('Verbesserungen, Hilfen und geöffnete Lösungen zählen nicht als unabhängiger Erstversuch',async()=>{
      await open();await answer(0);
      assert.match(await page.locator('#language-answer-feedback').textContent(),/noch nicht/);
      await answer(1);
      assert.match(await page.locator('#language-score').textContent(),/1 von 4 bearbeitet · 0 beim ersten Versuch/);
      await page.selectOption('#language-jump','1');await page.click('#language-hint');await answer(2);
      await page.selectOption('#language-jump','2');await page.click('#language-solution summary');
      await page.waitForFunction(()=>document.querySelector('#language-total').textContent.startsWith('3 von 28'));
      await answer(0);
      assert.match(await page.locator('#language-score').textContent(),/3 von 4 bearbeitet · 0 beim ersten Versuch/);
      await page.click('[data-language-topic="gehen"]');await page.click('[data-language-topic="schlingen"]');
      assert.equal(await page.locator('#language-jump').inputValue(),'2');
      assert.equal(await page.locator('#language-check').isDisabled(),true);
    });
    await t.test('Entwürfe und Checklisten bleiben je Thema erhalten, auch beim Wechsel des Lernbereichs',async()=>{
      await open();await page.click('#language-review');
      assert.match(await page.locator('#language-writing-feedback').textContent(),/Schreibe zuerst/);
      const draft='Minka spähte durch den Spalt. Fuji lauschte. <img src=x onerror=alert(1)>';
      await page.fill('#language-draft',draft);await page.check('[data-language-check="0"]');
      await page.click('#language-review');assert.match(await page.locator('#language-writing-feedback').textContent(),/Prüfe diese Punkte/);
      await page.click('[data-language-topic="gehen"]');assert.equal(await page.locator('#language-draft').inputValue(),'');
      await page.fill('#language-draft','Fuji trottete durch den Garten.');
      await page.click('[data-language-topic="schlingen"]');assert.equal(await page.locator('#language-draft').inputValue(),draft);
      assert.equal(await page.locator('[data-language-check="0"]').isChecked(),true);
      assert.equal(await page.locator('#language-lesson img').count(),0);
      await page.click('#language-to-intro');await page.fill('#draft','Am Herbstnachmittag suchte Minka ihren Ball.');
      await page.click('#schreiben [data-go="sprache"]');
      assert.equal(await page.locator('#language-draft').inputValue(),draft);
      await page.click('[data-page="schreiben"]');assert.equal(await page.locator('#draft').inputValue(),'Am Herbstnachmittag suchte Minka ihren Ball.');
      assert.equal(await page.locator('#writing-checks input').count(),9);
      await page.click('[data-page="sprache"]');
      for(const check of await page.locator('[data-language-check]').all())await check.check();
      await page.click('#language-review');assert.match(await page.locator('#language-writing-feedback').textContent(),/Selbsteinschätzung/);
      await page.reload();await page.click('[data-page="sprache"]');
      assert.equal(await page.locator('#language-draft').inputValue(),'');
    });
    await t.test('Satzzeichen einzeln prüfen, korrigieren und beim Themenwechsel erhalten',async()=>{
      await page.click('[data-language-topic="rede"]');
      await page.click('[data-punct-check="0"]');assert.match(await page.locator('#punct-feedback-0').textContent(),/zuerst/);
      await page.selectOption('[data-punct="0-0"]','1');
      for(const j of [1,2,3])await page.selectOption(`[data-punct="0-${j}"]`,'0');
      await page.click('[data-punct-check="0"]');assert.match(await page.locator('#punct-feedback-0').textContent(),/Zeichen 1/);
      const expected=['Fuji fragte: „Hörst du das?“','„Ich bleibe hier“, sagte Fuji.','„Unter dem Steg“, flüsterte Minka, „liegt etwas.“'];
      for(let i=0;i<3;i++){
        for(const select of await page.locator(`[data-punct^="${i}-"]`).all())await select.selectOption('0');
        await page.click(`[data-punct-check="${i}"]`);
        assert.equal(await page.locator(`#punct-preview-${i}`).textContent(),expected[i]);
        assert.match(await page.locator(`#punct-feedback-${i}`).textContent(),/^Richtig\./);
      }
      await page.click('[data-language-topic="sehen"]');await page.click('[data-language-topic="rede"]');
      assert.equal(await page.locator('#punct-preview-2').textContent(),expected[2]);
      await page.click('[data-punct-solution="2"]');assert.match(await page.locator('#punct-feedback-2').textContent(),/^Lösung:/);
    });
    await t.test('Comics, Spannungskurve, 18 Wissensaufgaben und 72 Leseaufgaben bleiben erreichbar',async()=>{
      await page.click('[data-page="entdecken"]');await page.click('#scene-next');
      assert.match(await page.locator('#scene-count').textContent(),/2 von 6/);
      await page.click('[data-page="spannung"]');await page.click('[data-station="3"]');
      assert.match(await page.locator('#curve-explanation').textContent(),/Höhepunkt/);
      await page.click('[data-page="ueben"]');assert.match(await page.locator('#quiz-position').textContent(),/von 18/);
      await page.click('[data-page="lesen"]');const stories=await page.locator('#reading-story option').count();assert.equal(stories,6);
      let tasks=0;for(const option of await page.locator('#reading-story option').all()){
        await page.selectOption('#reading-story',await option.getAttribute('value'));
        // The final menu entry opens the feedback page; it is not a task.
        tasks+=(await page.locator('#reading-jump option').count())-1;
      }
      assert.equal(tasks,72);
    });
    await t.test('Auf Handy und Tablet kein horizontaler Überlauf; Touch-Ziele bleiben erreichbar',async()=>{
      for(const width of [390,768]){
        await page.setViewportSize({width,height:844});await page.click('[data-page="sprache"]');
        for(const id of Object.keys(solutions)){
          await page.click(`[data-language-topic="${id}"]`);
          await page.locator('.language-theory + article details summary').click();
          const size=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:innerWidth}));
          assert.ok(size.content<=size.viewport+1,`${id}: ${size.content} > ${size.viewport}`);
          for(const button of await page.locator('#language-topics button').all()){
            assert.ok((await button.boundingBox()).height>=44);
          }
        }
      }
    });
    await t.test('Keine JavaScript-Laufzeitfehler',()=>assert.deepEqual(errors,[]));
  } finally {await browser.close();}
});
