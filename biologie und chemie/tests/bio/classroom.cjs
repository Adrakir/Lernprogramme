const assert = require('node:assert/strict');

module.exports = async function checkClassroom(browser, home) {
  const context = await browser.newContext({acceptDownloads:true, viewport:{width:390,height:844}, reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(home);
    const start = page.getByRole('link', {name:'Ich schreibe bald eine Klassenarbeit',exact:true});
    const box = await start.boundingBox();
    assert.ok(box.y >= 0 && box.y + box.height <= 844);
    await start.click();
    await page.getByRole('heading',{name:'Ich schreibe bald eine Klassenarbeit',exact:true}).waitFor();
    await page.getByRole('link',{name:'Skelett und Bewegung',exact:true}).click();
    await page.getByRole('link',{name:'Bewegungssystem verstehen',exact:true}).click();
    const pathway = page.locator('.bl-path-context');
    assert.match(await pathway.innerText(),/Schritt 1 von 3/);
    await page.reload();
    await pathway.getByRole('link',{name:'Weiter zum Üben',exact:true}).click();
    await page.locator('#bio-klassenarbeit .bk-picture').waitFor();
    assert.match(await pathway.innerText(),/Schritt 2 von 3/);
    await pathway.getByRole('link',{name:'Weiter zur Probearbeit',exact:true}).click();
    await page.getByRole('heading',{name:'Interaktive Probeklassenarbeit',exact:true}).waitFor();
    assert.match(await pathway.innerText(),/Schritt 3 von 3/);
    await pathway.getByRole('link',{name:'Zurück zum Lernweg',exact:true}).click();
    assert.equal(await page.locator('.bl-path-steps [aria-current="step"] h2').innerText(),'Probearbeit');
    await page.setViewportSize({width:320,height:740});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
    await page.getByRole('link',{name:'Hund und Katze',exact:true}).click();
    await page.getByRole('link',{name:'Gebiss beschriften',exact:true}).click();
    assert.equal(new URL(page.url()).hash,'#klassenarbeit/gebiss/hund');

    const profileKey = 'lerncockpit-bio-2026';
    const examKey = 'biolab5-probetest-1';
    const savedExam = await page.evaluate(({profileKey,examKey}) => {
      const exam = window.BioLaborProbetestInhalte.versions[0];
      const answers = Object.fromEntries(exam.map((q,i) => [i,q.criteria ? q.sample
        : q.rows ? Object.fromEntries(q.rows.map(([,answer],row) => [row,answer])) : q.correct]));
      const reviews = Object.fromEntries(exam.flatMap((q,i) =>
        q.criteria ? [[i,{done:true,checked:q.criteria.map(() => true)}]] : []));
      const complete = {version:0,phase:'results',at:'2026-11-12T13:00:00Z',answers,reviews};
      const open = {...complete,answers:{...answers,1:2},reviews:{...reviews,7:{done:true,checked:[true,false]}}};
      const store = JSON.parse(localStorage.getItem(profileKey));
      const toSave = entry => JSON.stringify({completed:{0:entry},exam:entry});
      const active = store.profiles[store.active];
      const backup = toSave(open);
      active.native = {...active.native,[examKey]:backup};
      store.profiles['Zweites Profil'] = {...active,native:{[examKey]:toSave(complete)}};
      store.profiles['Ohne Abgabe'] = {...active,native:{}};
      localStorage.setItem(examKey,backup);
      localStorage.setItem(profileKey,JSON.stringify(store));
      return backup;
    }, {profileKey,examKey});

    await page.goto(home + '#lehrkraft');
    await page.reload();
    await page.getByRole('button',{name:'Lernprofile vergleichen',exact:true}).click();
    const comparison = page.locator('.bl-comparison');
    assert.match(await comparison.innerText(),/3 lokale Profile/);
    const topic = comparison.getByRole('row').filter({hasText:'Gebiss und Zahnfunktionen'});
    assert.deepEqual(await topic.getByRole('cell').allTextContents(),['1','2']);
    assert.match(await comparison.locator('.bl-profile-results li').first().innerText(),/Erklärungen gemeinsam ansehen bei Gebiss/);
    assert.match(await comparison.locator('.bl-profile-results li').last().innerText(),/bisher keine Abgabe/);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), examKey),savedExam);

    await page.locator('#lcTabs [data-tab="familie"]').click();
    const today = page.locator('.bl-today');
    assert.match(await today.innerText(),/10 Minuten · Gebiss/);
    assert.match(await today.innerText(),/Frage für zu Hause/);
    assert.equal(await today.getByRole('link').getAttribute('href'),'#schulstoff/gebiss');
    await today.getByText('Antwort zum Vergleichen',{exact:true}).click();
    await today.getByText('Die Fangzähne halten es fest.',{exact:false}).waitFor();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button',{name:'Aktives Profil als Datei speichern',exact:true}).click();
    const downloaded = await downloadPromise;
    const chunks = [];
    for await (const chunk of await downloaded.createReadStream()) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    const data = JSON.parse(buffer);
    assert.equal(data.kind,'learning-profile');
    assert.equal(data.name,'Standard');
    assert.equal(data.profile.native[examKey],savedExam);
    assert.doesNotMatch(buffer.toString(),/Zweites Profil|Ohne Abgabe/);
    const transfer = page.locator('#lcProfileTransfer');
    await transfer.setInputFiles({name:'falsch.json',mimeType:'application/json',
      buffer:Buffer.from(JSON.stringify({...data,app:'chem'}))});
    const add = page.getByRole('button',{name:'Profildatei hinzufügen',exact:true});
    await add.click();
    await page.getByText('Bitte eine einzelne BioLabor-Profildatei verwenden.',{exact:false}).waitFor();
    assert.equal(await page.evaluate(key => Object.keys(JSON.parse(localStorage.getItem(key)).profiles).length,profileKey),3);

    await transfer.setInputFiles({name:'Lernprofil.json',mimeType:'application/json',buffer});
    await add.click();
    await page.getByText('Profil „Standard (2)“ hinzugefügt.',{exact:false}).waitFor();
    const store = await page.evaluate(key => JSON.parse(localStorage.getItem(key)),profileKey);
    assert.equal(store.active,'Standard');
    assert.equal(Object.keys(store.profiles).length,4);
    assert.equal(store.profiles['Standard (2)'].native[examKey],savedExam);
    assert.notEqual(store.profiles['Zweites Profil'].native[examKey],savedExam);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), examKey),savedExam);
    await page.locator('#lcTabs [data-tab="profile"]').click();
    await page.locator('#lcProfile').selectOption('Standard (2)');
    await Promise.all([
      page.waitForEvent('load'),
      page.getByRole('button',{name:'Profil wechseln',exact:true}).click()
    ]);
    await page.locator('#lcOpen').click();
    await page.locator('#lcTabs [data-tab="familie"]').click();
    assert.match(await page.locator('.bl-today').innerText(),/10 Minuten · Gebiss/);
    assert.deepEqual(errors,[]);
  } finally {
    await context.close();
  }
};
