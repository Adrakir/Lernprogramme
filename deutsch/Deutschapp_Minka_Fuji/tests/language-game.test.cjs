const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {chromium}=require('playwright');
const app=process.env.DEUTSCH_APP_URL||pathToFileURL(path.resolve(__dirname,'../index.html')).href;

test('Themenquiz: 17 Runden, Punkte, Erklärungen, Timer und Handy-Layout',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:320,height:780}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(app+'#sprache');
  const coverage=await page.evaluate(()=>{
    const pick=s=>document.querySelector(s);
    const topics=[...document.querySelectorAll('[data-language-topic]')].map(b=>b.dataset.languageTopic);
    return topics.map(id=>{
      pick('[data-language-topic="'+id+'"]').click();
      const pool=MF_LANGUAGE_PRACTICE[id];
      const topic=pick('#language-heading').textContent;
      pick('#language-game-open').click();
      pick('#language-game-start').click();
      const title=pick('#language-game-title').textContent;
      const played=[],feedback=[];
      for(let i=0;i<8;i++){
        const name=pick('#language-game-question').textContent;
        const prompt=pick('.language-game-text').textContent;
        const question=pool.find(q=>q.title===name&&q.text===prompt);
        if(!question)throw Error(name);
        played.push(name);
        pick('[data-game-answer="'+question.answer+'"]').click();
        feedback.push(pick('#language-game-feedback').textContent.includes(question.explain));
        pick('#language-game-next').click();
      }
      const result=pick('#language-game-result').textContent;
      const details=document.querySelectorAll('#language-game-body details').length;
      pick('#language-game-close').click();
      return {title,topic,unique:new Set(played).size,feedback,result,details};
    });
  });
  assert.equal(coverage.length,17);
  for(const item of coverage){
    assert.equal(item.title,'Quiz · '+item.topic);
    assert.equal(item.unique,8);
    assert.ok(item.feedback.every(Boolean));
    assert.equal(item.result,'8 von 8 Punkten');
    assert.equal(item.details,8);
  }

  await page.locator('[data-language-topic="praeteritum"]').click();
  const open=page.locator('#language-game-open');
  await open.press('Enter');
  const clock=page.locator('#language-game-clock');
  assert.equal(await clock.isChecked(),false);
  await clock.check();
  await page.clock.install();
  await page.locator('#language-game-start').click();
  assert.equal(await page.locator('#language-game-time').textContent(),'45 s');
  const widths=await page.locator('#language-game').evaluate(el=>({width:el.clientWidth,content:el.scrollWidth}));
  assert.ok(widths.content<=widths.width+1);
  await page.clock.fastForward(46000);
  assert.match(await page.locator('#language-game-feedback').textContent(),/Zeit abgelaufen.*Lösung/s);
  assert.equal(await page.locator('[data-game-answer]').first().isDisabled(),true);
  assert.equal(await page.locator('#language-game-points').textContent(),'0 Punkte');
  await page.locator('#language-game-next').click();
  assert.equal(await page.locator('#language-game-time').textContent(),'45 s');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#language-game').isVisible(),false);
  assert.equal(await open.evaluate(el=>el===document.activeElement),true);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
