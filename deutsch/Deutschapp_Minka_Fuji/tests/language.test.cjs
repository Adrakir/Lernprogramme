const { test } = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const { chromium } = require('playwright');

const app = process.env.DEUTSCH_APP_URL || pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const solutions = {
  schlingen:[1,2,0,1], gehen:[1,2,0,1], sehen:[2,0,1,2],
  sagen:[1,0,2,1], satzanfaenge:[0,1,2,1,2,0,1,2], adjektive:[1,2,0,1], rede:[1,1,0,2,0,1],
  praeteritum:['war','hatte','ging','kam','sah','sprach','lief','fand','nahm','gab','las','schrieb','dachte','wusste','rief','schwamm',1,2,0,1],
  erzaehlverben:[1,0,2,1,'griff','kroch','roch','zuckte'], erzaehlaufbau:[1,0,2,1], gefuehle:[2,0,1,1], schreibcheck:[0,1,2,1]
};
const practice=vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../language-practice.js'),'utf8')+'\nMF_LANGUAGE_PRACTICE');
const topicIds=['einleitung','schlingen','erzaehlaufbau','schluss','ueberschrift','praeteritum','satzanfaenge','gehen','sehen','sagen','erzaehlverben','adjektive','rede','gefuehle','gedanken','sinne','schreibcheck'];
const baseCount=Object.values(solutions).reduce((total,answers)=>total+answers.length,0);
const taskCount=baseCount+topicIds.length*30;
test('Alle Themen des Lernplakats haben je 30 Zusatzaufgaben mit konkreten Erklärungen',()=>{
  assert.deepEqual(Object.keys(practice).sort(),[...topicIds].sort());
  for(const id of topicIds){
    const tasks=practice[id];
    assert.equal(tasks.length,30,id);
    assert.equal(new Set(tasks.map(q=>JSON.stringify([q.text,q.options]))).size,30,id);
    for(const level of ['erkennen','begruenden','anwenden'])assert.equal(tasks.filter(q=>q.level===level).length,10,`${id}: ${level}`);
    for(const q of tasks){
      assert.ok(q.explain.length>=40,`${id}: ${q.title} · Erklärung`);
      if(q.level==='anwenden')assert.ok(q.type==='open'&&q.answer.length>=15,`${id}: ${q.title} · Muster`);
      else assert.ok(q.options[q.answer]&&new Set(q.options).size===q.options.length,`${id}: ${q.title} · Auswahl`);
    }
  }
});
test('Erzählwerkstatt: Interaktionen, Lernbilanz, Schreibtexte und mobile Darstellung', async t => {
  const browser = await chromium.launch({
    headless:true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {}),
    args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']
  });
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function open(){
    await page.goto(app);
    await page.evaluate(()=>localStorage.removeItem('minka-fuji-sprachwerkstatt-v1'));
    await page.reload();
    await page.click('[data-page="sprache"]');
    await page.click('[data-language-topic="schlingen"]');
  }
  async function answer(index){
    if(typeof index==='string') await page.fill('#language-word-answer',index);
    else if(await page.locator('#language-gap').count()) await page.selectOption('#language-gap', String(index));
    else await page.click(`[data-language-answer="${index}"]`);
    await page.click('#language-check');
  }
  try {
    await t.test('Alle Grundlagen lassen sich lösen; Wortschatz und Mustertexte sind erreichbar',async()=>{
      await open();assert.equal(await page.locator('[data-language-topic]').count(),topicIds.length);
      for(const [id,answers] of Object.entries(solutions)){
        await page.click(`[data-language-topic="${id}"]`);
        const bank=page.locator('.language-wordbank');
        await bank.locator('summary').click();
        if(id==='praeteritum') assert.equal(await bank.locator('tbody tr').count(),16);
        else assert.ok(await bank.locator('.language-word').count()>=4);
        for(let i=0;i<answers.length;i++){
          await page.selectOption('#language-jump',String(i));await answer(answers[i]);
          assert.match(await page.locator('#language-answer-feedback').textContent(),/^Richtig\./);
          assert.equal(await page.locator('#language-check').isDisabled(),true);
        }
        assert.ok((await page.locator('#language-score').textContent()).startsWith(`${answers.length} von ${answers.length+30} bearbeitet · ${answers.length} beim ersten Versuch`));
        await page.locator('.language-writing details summary').click();
        assert.ok((await page.locator('.language-writing details .model-text').textContent()).length>100);
      }
      assert.ok((await page.locator('#language-total').textContent()).startsWith(`${baseCount} von ${taskCount} Aufgaben bearbeitet · ${baseCount} beim ersten Versuch`));
      await page.click('[data-language-topic="rede"]');
      await page.fill('#language-draft','Minka fragte: „Kommst du mit?“');
      await page.click('#language-repeat');
      assert.match(await page.locator('#language-score').textContent(),/0 von 36 bearbeitet/);
      assert.ok((await page.locator('#language-total').textContent()).startsWith(`${baseCount-6} von ${taskCount} Aufgaben bearbeitet`));
      assert.equal(await page.locator('#language-draft').inputValue(),'Minka fragte: „Kommst du mit?“');
    });
    await t.test('Verbesserungen, Hilfen und geöffnete Lösungen zählen nicht als unabhängiger Erstversuch',async()=>{
      await open();await answer(0);
      assert.match(await page.locator('#language-answer-feedback').textContent(),/noch nicht/);
      await answer(1);
      assert.match(await page.locator('#language-score').textContent(),/1 von 34 bearbeitet · 0 beim ersten Versuch/);
      await page.selectOption('#language-jump','1');await page.click('#language-hint');await answer(2);
      await page.selectOption('#language-jump','2');await page.click('#language-solution summary');
      await page.waitForFunction(total=>document.querySelector('#language-total').textContent.startsWith(`3 von ${total}`),taskCount);
      await answer(0);
      assert.match(await page.locator('#language-score').textContent(),/3 von 34 bearbeitet · 0 beim ersten Versuch/);
      await page.click('[data-language-topic="gehen"]');await page.click('[data-language-topic="schlingen"]');
      assert.equal(await page.locator('#language-jump').inputValue(),'2');
      assert.equal(await page.locator('#language-check').isDisabled(),true);
    });
    await t.test('Direkteinstiege und getippte Verbformen mit Korrektur und Enter',async()=>{
      await page.goto(app);
      await page.getByRole('button',{name:/Zum Lernplakat-Training/}).click();
      assert.equal(await page.locator('#sprache').isVisible(),true);
      await page.goto(`${app}#praeteritum`);
      assert.equal(await page.locator('#language-heading').textContent(),'Präsens und Präteritum');
      await answer('bin');
      assert.match(await page.locator('#language-answer-feedback').textContent(),/noch nicht/);
      const input=page.locator('#language-word-answer');
      assert.equal(await input.inputValue(),'bin');
      await input.fill('   ');
      assert.equal(await page.locator('#language-check').isDisabled(),true);
      await input.fill(' War ');
      await input.press('Enter');
      assert.match(await page.locator('#language-answer-feedback').textContent(),/^Richtig\./);
      assert.match(await page.locator('#language-score').textContent(),/1 von 50 bearbeitet · 0 beim ersten Versuch/);
      await page.goto(`${app}#erzaehlverben`);
      assert.equal(await page.locator('#language-heading').textContent(),'Mehr Verben fürs Erzählen');
    });
    await t.test('Schülerweg: von der Merkkarte zur Begründung und zur eigenen Lösung',async()=>{
      await page.goto(`${app}#einleitung`);
      await page.click('#language-to-training');
      assert.equal(await page.locator('#language-task-title').evaluate(el=>el===document.activeElement),true);
      await page.getByRole('button',{name:'Begründen (10)'}).click();
      assert.match(await page.locator('#language-task .question-text').textContent(),/Welche Regel/);
      await answer(1);
      assert.match(await page.locator('#language-answer-feedback').textContent(),/noch nicht/);
      await answer(0);
      assert.match(await page.locator('#language-answer-feedback').textContent(),/^Richtig\./);
      await page.getByRole('button',{name:'Selbst schreiben (10)'}).click();
      const draft='Am Montag suchten Minka und Fuji im Schuppen nach dem Ball. <b>Eigener Text</b>';
      await page.fill('#language-open-answer',draft);
      await page.getByRole('button',{name:'Mit Musterlösung vergleichen'}).click();
      assert.equal(await page.locator('#language-solution').evaluate(el=>el.open),true);
      assert.match(await page.locator('#language-solution').textContent(),/Trinkflasche.*Zeitpunkt/s);
      assert.match(await page.locator('#language-score').textContent(),/2 von 30 bearbeitet · 0 beim ersten Versuch/);
      await page.click('#language-next-task');
      assert.equal(await page.locator('#language-open-answer').inputValue(),'');
      await page.click('#language-prev-task');
      assert.equal(await page.locator('#language-open-answer').inputValue(),draft);
      assert.equal(await page.locator('#language-task b').count(),0);
      await page.click('#language-repeat');
      await page.getByRole('button',{name:'Selbst schreiben (10)'}).click();
      assert.equal(await page.locator('#language-open-answer').inputValue(),draft);
      assert.match(await page.locator('#language-score').textContent(),/0 von 30 bearbeitet/);
    });
    await t.test('Alle 510 Zusatzaufgaben zeigen die zugehörige Lösung und Erklärung',async()=>{
      await open();
      const failures=await page.evaluate(({practice,solutions})=>{
        const failures=[];
        for(const [id,tasks] of Object.entries(practice)){
          document.querySelector('[data-language-topic="'+id+'"]').click();
          const jump=document.getElementById('language-jump');
          const base=solutions[id]?.length||0;
          if(jump.options.length!==base+30)failures.push(id+': count');
          tasks.forEach((q,i)=>{
            jump.value=String(base+i);
            jump.dispatchEvent(new Event('change'));
            const solution=document.querySelector('#language-solution');
            const expected=q.type==='open'?q.answer:q.options[q.answer];
            if(solution.querySelector('strong').textContent!==expected||!solution.textContent.includes(q.explain)) failures.push(id+': solution '+i);
            if(q.type!=='open'){
              document.querySelector('[data-language-answer="'+q.answer+'"]').click();
              document.getElementById('language-check').click();
              if(!document.getElementById('language-answer-feedback').textContent.startsWith('Richtig.'))failures.push(id+': score '+i);
            }
          });
        }
        return failures;
      },{practice,solutions});
      assert.deepEqual(failures,[]);
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
      assert.equal(await page.locator('#language-draft').inputValue(),draft);
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
      for(const width of [320,390,768]){
        await page.setViewportSize({width,height:844});await page.click('[data-page="sprache"]');
        for(const id of topicIds){
          await page.click(`[data-language-topic="${id}"]`);
          await page.locator('.language-wordbank summary').click();
          const size=await page.evaluate(()=>({
            content:document.documentElement.scrollWidth,
            viewport:innerWidth,
            overflow:[...document.querySelectorAll('#sprache *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1)
              .slice(0,8).map(el=>el.id||el.className||el.tagName)
          }));
          assert.ok(size.content<=size.viewport+1,`${id}: ${size.content} > ${size.viewport} (${size.overflow.join(', ')})`);
          for(const button of await page.locator('#language-topics button').all()){
            assert.ok((await button.boundingBox()).height>=44);
          }
        }
      }
    });
    await t.test('Keine JavaScript-Laufzeitfehler',()=>assert.deepEqual(errors,[]));
  } finally {await browser.close();}
});
