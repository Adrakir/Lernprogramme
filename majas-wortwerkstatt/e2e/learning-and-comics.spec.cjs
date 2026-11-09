'use strict';
/*
 * Real Chromium interaction tests for the November exam journeys and comic display.
 * Emulated mobile viewport is NOT a real iOS/Android/audio test.
 */
const {test,expect}=require('@playwright/test');
const route=hash=>'/majas-wortwerkstatt/#'+hash;
const desktop=testInfo=>testInfo.project.name.includes('desktop');
const mobile=testInfo=>testInfo.project.name.includes('mobile');
const hearingTracks=['der-falsche-kuchen','rettung-fuer-eine-schnecke','der-koffer-mit-dem-loch','das-fenster-voller-sterne','die-letzte-kastanie'];

async function completeExam(page,topic,n){
  await page.goto(route('pruefung/'+topic+'/test/'+n),{waitUntil:'domcontentloaded'});
  await expect(page.locator('#app h1')).toContainText('Abschlusstest '+n);
  const questions=await page.evaluate(({topic,n})=>prepTasks(topic,'test',n).map(q=>({type:q.type,answer:q.answer})),{topic,n});
  expect(questions).toHaveLength(topic==='hoeren'?5:15);
  await expect(page.locator('#prep-help')).toHaveCount(0);
  if(topic==='hoeren'){
    await expect(page.locator('#prep-reading')).toHaveCount(0);
    await expect(page.locator('.prep-exam-note')).toContainText('Hörtext nicht sichtbar');
    await expect(page.locator('#prep-audio')).toHaveAttribute('src',new RegExp(hearingTracks[n-1]+'.mp3'));
    await expect(page.locator('#prep-playback-mode')).toBeVisible();
    await expect(page.locator('#prep-playback-speed')).toBeVisible();
  }
  for(const [index,q] of questions.entries()){
    await expect(page.locator('#prep-result')).toBeHidden();
    await expect(page.locator('#prep-question .kicker')).toContainText('Aufgabe '+(index+1));
    if(q.type==='write')await page.locator('#prep-answer').fill(q.answer);
    else await page.locator('[data-prep-option]').filter({hasText:q.answer}).first().click();
    await page.locator('#prep-check').click();
  }
  await expect(page.locator('#prep-result')).toBeVisible();
  await expect(page.locator('#prep-result .prep-score')).toContainText(questions.length+' / '+questions.length+' richtig');
  await expect(page.locator('#prep-result .prep-review li')).toHaveCount(questions.length);
  await expect(page.locator('#prep-result .prep-review .prep-wrong')).toHaveCount(0);
  // Completed result survives reload and never invents uncompleted answers.
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#prep-result .prep-review li')).toHaveCount(questions.length);
}
for(let n=1;n<=5;n++){
  test('Hörverständnistest '+n+' – fünf Fragen, ohne Textspoiler, korrekte Bewertung',async ({page},testInfo)=>{
    test.skip(!desktop(testInfo),'alle vollständigen Testdurchläufe nur im Desktop-Projekt');
    await completeExam(page,'hoeren',n);
  });
  test('Rechtschreibtest '+n+' – 15 Aufgaben, richtige Erklärungen nach Abgabe',async ({page},testInfo)=>{
    test.skip(!desktop(testInfo),'alle vollständigen Testdurchläufe nur im Desktop-Projekt');
    await completeExam(page,'nomen',n);
  });
}
test('Hörtest auf Mobilemulation, ohne Textvorlage und Lösungsspoiler',async ({page},testInfo)=>{
  test.skip(!mobile(testInfo),'ein mobiler Prüfdurchlauf');
  await completeExam(page,'hoeren',1);
});
test('Rechtschreibtest auf Mobilemulation, Eingaben und Abschluss',async ({page},testInfo)=>{
  test.skip(!mobile(testInfo),'ein mobiler Prüfdurchlauf');
  await completeExam(page,'nomen',5);
});
const comicSamples=[
 'schulgeschichten/lesezeichen/1',
 'schulgeschichten/wortkarten/1',
 'schulgeschichten/papierboot/1',
 'tagescomic/melody-und-die-hausaufgaben/1',
 'tagescomic/tom-und-der-schulhund/1',
 'tagescomic/buecherkiste/1',
 'tagescomic/blaue-punkte/1',
 'tagescomic/lesefenster/1'
];
test('Acht Comic-Einstiege – Bilder, Vergrößern, keine Querscroller',async ({page},testInfo)=>{
  test.skip(testInfo.project.name.includes('tablet'),'Desktop und Mobile reichen hier');
  for(const hash of comicSamples){
    await page.goto(route(hash),{waitUntil:'domcontentloaded'});
    const school=hash.startsWith('schulgeschichten/');
    const artwork=page.locator(school?'.comic-art':'.detective-art').first();
    await expect(artwork).toBeVisible();
    await expect(page.locator('.kino-panel-wrap')).toHaveCount(school?2:4);
    await expect(page.locator('.kino-dialog')).toHaveCount(1);
    await page.locator('[data-kino-zoom="0"]').click();
    await expect(page.locator('.kino-dialog')).toHaveAttribute('open','');
    await expect(page.locator('.kino-zoom-art .comic-art,.kino-zoom-art .detective-art')).toHaveCount(1);
    await page.locator('.kino-close').click();
    await expect(page.locator('.kino-dialog')).not.toHaveAttribute('open','');
    const overshoot=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overshoot,hash+' must fit viewport').toBeLessThanOrEqual(2);
  }
});
test('Detektivcomic: Sprechblasenstellung bleibt manuell wählbar',async ({page},testInfo)=>{
  test.skip(testInfo.project.name.includes('tablet'),'Desktop und Mobilansicht');
  await page.goto(route('tagescomic/melody-und-die-hausaufgaben/1'),{waitUntil:'domcontentloaded'});
  const setting=page.locator('#kino-separate');
  await expect(setting).toBeVisible();
  await expect(setting).toBeChecked({checked:mobile(testInfo)});
  await setting.setChecked(!mobile(testInfo));
  await expect(page.locator('.detective-panels')).toHaveClass(/kino-separated/);
  await setting.setChecked(false);
  await expect(page.locator('.detective-panels')).not.toHaveClass(/kino-separated/);
});
