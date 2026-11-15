'use strict';
const {test,expect}=require('@playwright/test');
const route=hash=>'/majas-wortwerkstatt/'+(hash?'#'+hash:'');
async function load(page,hash){
  await page.goto(route(hash),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#app h1').first()).toBeVisible();
}
test('Vertraute Übersicht mit drei Lernthemen und vier bebilderten Angeboten',async ({page})=>{
  await load(page);
  await expect(page.getByRole('heading',{name:'Fit für den Kombitest'})).toBeVisible();
  await expect(page.locator('.maja-classic-home .maja-quick-topic')).toHaveCount(3);
  await expect(page.locator('.maja-classic-home .maja-quick-option')).toHaveCount(4);
  await expect(page.locator('.maja-classic-home .maja-option-photo img')).toHaveCount(4);
  await expect(page.getByRole('link',{name:/Teste dich/})).toBeVisible();
  await expect(page.getByRole('link',{name:/Alle weiteren Lernthemen/})).toBeVisible();
  await page.getByRole('link',{name:/Mein Lernmodus/}).click();
  await expect(page).toHaveURL(/#lernen$/);
  await expect(page.getByRole('heading',{name:'Was möchtest du üben?'})).toBeVisible();
  await expect(page.locator('.maja-journey-card')).toHaveCount(4);
  await load(page,'abenteuer');
  await expect(page.getByRole('heading',{name:'Was möchtest du entdecken?'})).toBeVisible();
  await expect(page.locator('.maja-journey-card')).toHaveCount(4);
});
test('Hörverstehen: rote Frage, Computerstimme und Tempo bleiben gespeichert',async ({page})=>{
  await load(page,'pruefung/hoeren/ueben/1');
  await expect(page.locator('.prep-question-highlight h2')).toBeVisible();
  await expect(page.locator('[data-prep-option]')).toHaveCount(3);
  await expect(page.locator('.prep-audio-details')).not.toHaveAttribute('open','');
  await page.locator('.prep-audio-details summary').click();
  await expect(page.locator('#prep-playback-mode')).toBeVisible();
  await page.locator('#prep-playback-mode').selectOption('computer');
  await expect(page.locator('#prep-voice-row')).toBeVisible();
  await page.locator('#prep-playback-speed').selectOption('0.7');
  await expect.poll(()=>page.evaluate(()=>({
    mode:localStorage.getItem('majas-wortwerkstatt-hoer-modus-v1'),
    tempo:localStorage.getItem('majas-wortwerkstatt-hoer-tempo-v1')
  }))).toEqual({mode:'computer',tempo:'0.7'});
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#prep-playback-mode')).toHaveValue('computer');
  await expect(page.locator('#prep-playback-speed')).toHaveValue('0.7');
});
test('Comics, Kleiderschrank und Elternansicht bleiben erreichbar',async ({page})=>{
  await load(page,'comics');
  await expect(page.getByRole('heading',{name:/Comics und Bilderbücher|Alle Comics/})).toBeVisible();
  await load(page,'baerli/schrank');
  await expect(page.getByRole('heading',{name:/Zieh Bärli an|Bärlis Kleiderschrank/})).toBeVisible();
  await load(page,'erwachsene');
  await expect(page.getByRole('heading',{name:/Für Erwachsene/})).toBeVisible();
});
test('Mobile Einstieg ohne horizontalen Überlauf',async ({page},testInfo)=>{
  test.skip(!testInfo.project.name.includes('mobile'),'nur mobile Emulation');
  await load(page);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,'start page should not need horizontal scrolling').toBeLessThanOrEqual(2);
});

test('Startseiten-Bilder laden und direkte Ziele bleiben verlinkt',async ({page})=>{
  await load(page);
  const pics=page.locator('.maja-classic-home .maja-option-photo img');
  await expect(pics).toHaveCount(4);
  for(let i=0;i<4;i++){
    await expect.poll(()=>pics.nth(i).evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
  for(const hash of ['pruefung/hoeren','endungen','verlaengern','kombitest','comics','spiele','lernberater','baerli/schrank','stationen']){
    await expect(page.locator('.maja-classic-home a[href="#'+hash+'"]')).toHaveCount(1);
  }
});
test('Kleiderschrank trennt Hosen, Brillen und Hüte',async ({page})=>{
  await load(page,'baerli/schrank');
  await page.locator('a[href="#baerli/schrank/hosen"]').first().click();
  await expect(page.locator('.bw-header h1')).toHaveText('Hosen');
  await page.goto(route('baerli/schrank/brillen'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-header h1')).toHaveText('Brillen');
  await page.goto(route('baerli/schrank/huete'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.bw-header h1')).toHaveText('Hüte');
});

test('Kleiderschrank: Bildkacheln und Anprobe verändern weder Sterne noch Käufe',async ({page})=>{
  await load(page,'baerli/schrank');
  await expect(page.locator('.bw-category-sample')).toHaveCount(6);
  const before=await page.evaluate(()=>({
    outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1'),
    stars:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1')
  }));
  await page.locator('a[href="#baerli/schrank/hosen"]').first().click();
  await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id','jeans');
  // Alte Hosen unverändert vor den neuen: Jeans, Spielhose, Regenhose, Sternhose, Schlaghose.
  for(let i=0;i<4;i++)await page.locator('[data-bw-move="1"]').click();
  await expect(page.locator('.bw-product-copy strong')).toHaveText('Türkise Schlaghose');
  await expect(page.locator('.bw-figure')).toHaveAttribute('data-preview-id','schlaghose');
  await expect(page.locator('.bw-try-label')).toContainText('Anprobe');
  const after=await page.evaluate(()=>({
    outfit:localStorage.getItem('majas-wortwerkstatt-baerli-auswahl-v1'),
    stars:localStorage.getItem('majas-wortwerkstatt-sternenbeutel-v1')
  }));
  expect(after).toEqual(before);
});

test('Start setzt einen begonnenen Nomentest mit alten Aufgaben und Entwurf fort',async ({page})=>{
  await page.addInitScript(()=>{
    const key='majas-wortwerkstatt-klassenarbeiten-nov2026-v1';
    if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({
      'nomen:test:1':{answers:[{id:'n1-s0',given:'die Zeichnung',correct:true,skill:'ung'}],draft:'die Fr',done:false}
    }));
  });
  await load(page);
  await expect(page.locator('.maja-resume')).toContainText('Test 1 · Aufgabe 2 von 15');
  await page.locator('.maja-resume').click();
  await expect(page.locator('.prep-word')).toHaveText('frei');
  await expect(page.locator('#prep-answer')).toHaveValue('die Fr');
  await load(page,'pruefung/nomen/test/2');
  await expect(page.locator('.prep-word')).toHaveText('heizen');
  await load(page,'pruefung/nomen/ueben/2');
  await expect(page.locator('.prep-word')).toHaveText('retten');
});

test('Ein abgelaufener Termin lässt den Hörlernweg erreichbar',async ({page})=>{
  await page.clock.setFixedTime(new Date(2026,10,17,12));
  await load(page);
  await expect(page.locator('a.maja-quick-topic[href="#pruefung/hoeren"]')).toContainText('Hörgeschichten');
  await load(page,'pruefung');
  await expect(page.getByText('16. November')).toHaveCount(0);
  await expect(page.getByText('19. November')).toBeVisible();
  await expect(page.getByRole('link',{name:'Lernweg öffnen'})).toHaveCount(2);
});

test('Offline-Update erhält fremden Cache, Lernstand, Kauf und Prüfungsaufnahmen',async ({page,context})=>{
  await page.goto(route()+'bilderbuecher/');
  const preserved=await page.evaluate(async()=>{
    await caches.open('andere-lernapp');
    await caches.open('majas-wortwerkstatt-v14');
    const state={
      'majas-wortwerkstatt-sternenbeutel-v1':{version:1,rewards:{a:{amount:2,day:'2026-11-14'},b:{amount:2,day:'2026-11-14'}},purchases:{'item:muetze':{cost:2,day:'2026-11-14',label:'Blaue Bommelmütze'}},migrated:true},
      'majas-wortwerkstatt-baerli-auswahl-v1':{huete:'muetze'},
      'majas-wortwerkstatt-klassenarbeiten-nov2026-v1':{'nomen:test:1':{answers:[{id:'n1-s0',given:'die Zeichnung',correct:true}],done:false}}
    };
    for(const [key,value] of Object.entries(state))localStorage.setItem(key,JSON.stringify(value));
    return state;
  });
  await load(page);
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBeTruthy();
  expect(await page.evaluate(()=>caches.keys())).toEqual(expect.arrayContaining(['andere-lernapp','majas-wortwerkstatt-v15']));
  expect(await page.evaluate(()=>caches.keys())).not.toContain('majas-wortwerkstatt-v14');
  await context.setOffline(true);
  await load(page,'pruefung/hoeren/test/1');
  const partial=await page.evaluate(async()=>{
    const result=await fetch('./anna-audio/der-falsche-kuchen.mp3',{headers:{Range:'bytes=0-99'}});
    return [result.status,result.headers.get('Content-Range'),(await result.arrayBuffer()).byteLength];
  });
  expect(partial).toEqual([206,expect.stringMatching(/^bytes 0-99\//),100]);
  await page.locator('#prep-play').click();
  await expect.poll(()=>page.locator('#prep-audio').evaluate(audio=>audio.currentTime)).toBeGreaterThan(0);
  await page.locator('#prep-stop').click();
  const actual=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,JSON.parse(localStorage.getItem(key))])),Object.keys(preserved));
  expect(actual).toMatchObject(preserved);
});
