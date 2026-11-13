const assert = require('node:assert/strict');

module.exports = async function checkInteractive(page, home, {capture = false} = {}) {
  const root = page.locator('#main .bp-root');
  const getButton = (name) => root.getByRole('button', {name, exact: true});
  await page.goto(home + '#probetest');
  await getButton('Arbeit 1 starten').click();
  await page.waitForURL('**#probetest/arbeit');
  if (capture) await page.screenshot({path:'bio-probetest-mobile.png'});
  assert.equal(await root.locator('.bp-picture svg image').count(), 1);
  assert.equal(await root.getByText('Musterantwort', {exact: false}).count(), 0);
  await root.getByText('Becken', {exact: true}).click();
  await getButton('Weiter →').click();
  assert.equal(await root.locator('.bk-dentition').count(), 1);
  await root.getByText('Reißzähne', {exact: true}).click();
  await getButton('Weiter →').click();
  const matching = root.locator('[data-bp-row]');
  await matching.nth(0).selectOption('2');
  await matching.nth(1).selectOption('0');
  await matching.nth(2).selectOption('1');
  await root.getByRole('button', {name:'Aufgabe 8, offen',exact:true}).click();
  await root.locator('[data-bp-writing]').fill('Die Eckzähne halten fest.');
  assert.match(await root.locator('[aria-current="step"]').getAttribute('aria-label'), /beantwortet/);
  await getButton('Speichern und pausieren').click();
  await page.reload();
  await getButton('Arbeit fortsetzen').click();
  assert.equal(await root.locator('[data-bp-writing]').inputValue(), 'Die Eckzähne halten fest.');
  await root.getByRole('button', {name:'Aufgabe 1, beantwortet',exact:true}).click();
  assert.equal(await root.locator('input:checked').inputValue(), '0');
  await getButton('Arbeit abgeben').click();
  assert.match(await root.locator('[data-bp-pending]').innerText(), /5 Aufgaben sind noch offen/);
  await getButton('Weiter bearbeiten').click();
  assert.equal(await root.locator('[data-bp-pending]').count(), 0);
  await getButton('Arbeit abgeben').click();
  await getButton('Jetzt abgeben').click();
  await page.waitForURL('**#probetest/auswertung');
  assert.match(await root.locator('header').innerText(), /4 von 11 Punkten/);
  assert.match(await root.locator('[data-bp-review="0"]').innerText(), /Richtig: Schulterblatt/);
  const writing = root.locator('[data-bp-review="7"]');
  assert.match(await writing.innerText(), /Die Eckzähne halten fest/);
  await writing.locator('input').first().check();
  await writing.getByRole('button', {name:'Selbstvergleich speichern'}).click();
  assert.match(await root.locator('header').innerText(), /Erklärtexte verglichen: 1 von 2/);
  await getButton('Fehler gezielt wiederholen').click();
  await page.waitForURL('**#probetest/wiederholen');
  assert.match(await root.locator('.bp-picture figcaption').innerText(), /Katze/);
  await getButton('Antwort prüfen').click();
  assert.match(await root.locator('[data-bp-notice]').innerText(), /Beantworte zuerst/);
  await root.getByText('Becken', {exact:true}).click();
  await getButton('Antwort prüfen').click();
  assert.match(await root.locator('.bp-note').innerText(), /Noch unsicher[\s\S]*Schulterblatt/);
  await page.reload();
  assert.ok(await root.locator('.bp-checked').count());
  await getButton('Weiter →').click();
  const topics = await page.evaluate(() => JSON.parse(localStorage.getItem('biolab5-probetest-1')).round.topics);
  assert.ok(topics.includes('zahnvergleich'));
  const data = await page.evaluate(() => window.BioLaborProbetestInhalte);
  for (const topic of topics.slice(1)) {
    const task = data.retry[topic][0];
    if (task.rows) {
      for (const [i, [, correct]] of task.rows.entries()) await root.locator('[data-bp-row]').nth(i).selectOption(String(correct));
    } else {
      await root.locator('input[name="bp-answer"]').nth(task.correct).check();
    }
    await getButton('Antwort prüfen').click();
    assert.match(await root.locator('.bp-note').innerText(), /Richtig/);
    await getButton(topic === topics.at(-1) ? 'Ergebnis anzeigen' : 'Weiter →').click();
  }
  assert.match(await root.locator('header').innerText(), new RegExp((topics.length - 1) + ' von ' + topics.length));
  await getButton('Offene Themen erneut üben').click();
  assert.match(await root.locator('.bp-panel h2').innerText(), /flacher Knochen/);
  assert.match(await root.locator('header').innerText(), /Aufgabe 1 von 1/);
  await page.goto(home + '#probetest');
  await root.getByRole('heading', {name:'Abgegebene Arbeiten'}).waitFor();
  await getButton('Arbeit 2 starten').click();
  await page.waitForURL('**#probetest/arbeit');
  await getButton('Speichern und pausieren').click();
  await root.getByText('Arbeit 1 · 4 von 11 automatisch geprüften Punkten', {exact:false}).waitFor();
  assert.equal(await root.getByText('Arbeit 2 ist noch offen.', {exact:true}).count(),1);

  await page.goto(home + '#koerpersprache');
  await getButton('Szene 2 · Katze').click();
  assert.equal(await root.locator('.bp-observation-image svg').getAttribute('aria-label'), 'Katze, schematische Darstellung');
  await getButton('Ohren').click();
  assert.equal(await getButton('Deutung prüfen').count(),0);
  await getButton('Rute').click();
  await getButton('Deutung prüfen').click();
  assert.match(await root.locator('[data-bo-notice]').innerText(), /kurze Begründung/);
  await root.getByText('Die Katze wirkt unsicher und sucht Abstand.', {exact:true}).click();
  await root.locator('[data-bo-writing]').fill('Die Ohren liegen an und die Rute ist tief.');
  await getButton('Deutung prüfen').click();
  assert.match(await root.locator('.bp-note').innerText(), /Das passt/);
  if (capture) await page.locator('.bp-observation-image').screenshot({path:'bio-beobachtung-mobile.png'});
  await page.reload();
  assert.match(await root.locator('.bp-note').innerText(), /Das passt/);

  async function openProfiles() {
    await page.locator('#lcOpen').click();
    await page.locator('#lcTabs [data-tab="profile"]').click();
  }
  await openProfiles();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', {name:'Sicherung als JSON'}).click();
  const chunks = [];
  for await (const chunk of await (await downloaded).createReadStream()) chunks.push(chunk);
  const {store} = JSON.parse(Buffer.concat(chunks));
  const key = 'biolab5-probetest-1';
  assert.match(store.profiles.Standard.native[key], /Die Ohren liegen an/);
  assert.equal(JSON.parse(store.profiles.Standard.native[key]).completed[0].phase, 'results');
  assert.equal(store.profiles.Testprofil.native[key], undefined);
  await page.locator('#lcProfile').selectOption('Testprofil');
  await page.getByRole('button', {name:'Profil wechseln'}).click();
  await getButton('Ohren').waitFor();
  assert.equal(await root.locator('.bp-note').count(),0);
  await openProfiles();
  await page.locator('#lcProfile').selectOption('Standard');
  await page.getByRole('button', {name:'Profil wechseln'}).click();
  await root.locator('.bp-note').waitFor();
  assert.match(await root.locator('.bp-note').innerText(), /Das passt/);

  await page.goto(home + '#lehrkraft');
  assert.equal(await root.locator('.bp-station').count(),10);
  assert.equal(await root.locator('.bp-qr svg').count(),10);
  if (capture) {
    await page.setViewportSize({width:1280,height:900});
    await page.screenshot({path:'bio-lehrkraft-desktop.png'});
    await page.pdf({path:'bio-stationen-print.pdf',preferCSSPageSize:true});
  }
  const station = root.locator('[data-bl-route="schulstoff/gebiss"]');
  assert.match(await station.innerText(), /Lernziel[\s\S]*Vertiefung/);
  assert.match(await station.locator('.bp-qr').getAttribute('href'), /adrakir\.github\.io.*#schulstoff\/gebiss$/);
  await station.getByRole('link',{name:'Station öffnen',exact:true}).click();
  await page.getByRole('heading',{name:'Das Raubtiergebiss',exact:true}).waitFor();
};
