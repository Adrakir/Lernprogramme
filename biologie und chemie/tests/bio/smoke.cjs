const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const {createServer} = require('node:http');
const {once} = require('node:events');
const {join, resolve, sep, extname} = require('node:path');
const {chromium, firefox, webkit} = require('playwright');
const checkInteractive = require('./interactive.cjs');

const browserName = process.env.BIO_BROWSER || 'chromium';
const folder = resolve(__dirname, '../..');
const contentTypes = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp'};
const schoolKey = 'biolab5-schulstoff-1';
const legacyAnswer = 'Ein vorhandener Entwurf aus der bisherigen Version.';

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const file = resolve(folder, '.' + decodeURIComponent(url.pathname));
  if (file.startsWith(folder + sep) && contentTypes[extname(file)]) {
    try {
      const data = await fs.readFile(file);
      response.writeHead(200, {'Content-Type': contentTypes[extname(file)] + (extname(file) === '.webp' ? '' : '; charset=utf-8')});
      response.end(data);
      return;
    } catch (error) {
      if (error.code !== 'ENOENT') console.error(error);
    }
  }
  response.writeHead(404).end();
});

async function run() {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  let browser;
  try {
    const executablePath = process.env.BIO_BROWSER_EXECUTABLE;
    browser = await {chromium, firefox, webkit}[browserName].launch({executablePath});
    const base = 'http://127.0.0.1:' + server.address().port;
    const home = base + '/BioLabor_5_Biologie_V9_2.html';
    const context = await browser.newContext({acceptDownloads: true, viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
        errors.push(response.status() + ' ' + response.url());
      }
    });
    await page.addInitScript(({key, answer}) => {
      if (!localStorage.getItem('bio-smoke-seeded')) {
        localStorage.setItem(key, JSON.stringify({wolf: {answers: {'task-3': answer}, done: {3: true}}}));
        localStorage.setItem('bio-smoke-seeded', '1');
      }
    }, {key: schoolKey, answer: legacyAnswer});
    await page.goto(home);
    const start = page.getByRole('link', {name: 'Für die Klassenarbeit üben'});
    const box = await start.boundingBox();
    assert.ok(box.y >= 0 && box.y + box.height < 844, 'Der Einstieg liegt im ersten Bildschirm.');
    await start.click();
    await page.getByText('1 von 4 Aufgaben bearbeitet', {exact: true}).waitFor();
    await page.getByRole('link', {name: 'Wolf oder Hund?', exact: true}).click();
    const draft = page.locator('textarea[name="task-3"]');
    assert.equal(await draft.inputValue(), legacyAnswer);
    const assignment = page.locator('[data-bs-task="0"]');
    const firstField = assignment.locator('select').first();
    await firstField.selectOption('Hund');
    await assignment.getByRole('button', {name: 'Antworten prüfen'}).click();
    assert.match(await assignment.locator('#task-0-0-feedback').innerText(), /Tipp:.*Biologie/);
    assert.equal(await firstField.getAttribute('aria-describedby'), 'task-0-0-feedback');
    assert.equal(await firstField.getAttribute('aria-invalid'), 'true');
    await firstField.selectOption('Beide');
    await assignment.getByRole('button', {name: 'Antworten prüfen'}).click();
    assert.equal(await assignment.locator('#task-0-0-feedback').innerText(), '✓ Richtig');

    async function openBackup() {
      await page.locator('#lcOpen').click();
      await page.locator('#lcTabs [data-tab="profile"]').click();
    }
    async function closeBackup() {
      await page.locator('#lcClose').click();
    }
    const profile = page.locator('#lcProfile');
    await openBackup();
    page.once('dialog', dialog => dialog.accept('Testprofil'));
    await page.getByRole('button', {name: 'Neues Profil anlegen'}).click();
    await draft.waitFor();
    assert.equal(await draft.inputValue(), '');
    await draft.fill('Nur im zweiten Profil.');
    const otherTab = await context.newPage();
    await otherTab.goto(home + '#schulstoff/wolf');
    const otherDraft = otherTab.locator('textarea[name="task-3"]');
    assert.equal(await otherDraft.inputValue(), 'Nur im zweiten Profil.');
    await openBackup();
    assert.equal(await profile.inputValue(), 'Testprofil');
    await profile.selectOption('Standard');
    await page.getByRole('button', {name: 'Profil wechseln'}).click();
    await draft.waitFor();
    assert.equal(await draft.inputValue(), legacyAnswer);
    await otherTab.waitForFunction(expected => document.querySelector('textarea[name="task-3"]')?.value === expected, legacyAnswer);
    await otherTab.close();
    await openBackup();
    const downloaded = page.waitForEvent('download');
    await page.getByRole('button', {name: 'Sicherung als JSON'}).click();
    const download = await downloaded;
    const chunks = [];
    for await (const chunk of await download.createReadStream()) chunks.push(chunk);
    const backup = Buffer.concat(chunks);
    const {store} = JSON.parse(backup);
    assert.equal(JSON.parse(store.profiles.Standard.native[schoolKey]).wolf.answers['task-3'], legacyAnswer);
    assert.equal(JSON.parse(store.profiles.Testprofil.native[schoolKey]).wolf.answers['task-3'], 'Nur im zweiten Profil.');
    await closeBackup();
    await draft.fill('Nach dem Export geändert.');
    await openBackup();
    await page.locator('#lcImportFile').setInputFiles({name: 'bio-test.json', mimeType: 'application/json', buffer: backup});
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', {name: 'Sicherung überprüfen und importieren'}).click();
    await page.waitForFunction(expected => document.querySelector('textarea[name="task-3"]')?.value === expected, legacyAnswer);
    assert.equal(await draft.inputValue(), legacyAnswer);

    await page.goto(home + '#schulstoff/katze');
    await page.getByRole('button', {name: 'Knochen am Bild entdecken'}).click();
    await page.getByRole('button', {name: 'Hund 1', exact: true}).click();
    assert.equal(await page.locator('[data-bs-bone][aria-pressed=true]').count(), 2);
    await page.getByRole('button', {name: 'Pupillen', exact: true}).click();
    const slider = page.locator('[data-bm-range]');
    await slider.focus();
    await slider.press('End');
    await page.getByText('Helles Licht · schmale Pupille', {exact: true}).waitFor();
    await page.goto(base + '/BioLabor_Hund_Katze.html#dog/teeth');
    await page.locator('#content .bs-context a[href$="/gebiss"]').click();
    await page.getByRole('heading', {name: 'Das Raubtiergebiss', exact: true}).waitFor();

    await page.goto(home + '#print');
    await page.locator('.bs-exam-sheet').first().waitFor();
    assert.equal(await page.locator('.bs-exam-sheet').count(), 3);
    assert.equal(await page.locator('.solutions-sheet').count(), 0);
    for (const version of [1, 3]) {
      await page.getByRole('link', {name: 'Arbeit ' + version, exact: true}).click();
      await page.getByRole('link', {name: 'Arbeit ' + version, exact: true}).and(page.locator('[aria-current="page"]')).waitFor();
      await page.getByRole('heading', {name: 'Übungsklassenarbeit ' + version + ' · Teil C', exact: true}).waitFor();
      assert.equal(await page.locator('.bs-exam-sheet .bs-exam-task').count(), 3);
    }
    await page.getByRole('link', {name: 'Arbeit 2', exact: true}).click();
    await page.getByRole('heading', {name: 'Übungsklassenarbeit 2 · Teil C', exact: true}).waitFor();
    assert.equal(await page.locator('.printpage').count(), 3);
    assert.match(await page.locator('.printpage').first().innerText(), /Gesamtpunkte:.*33/);
    const sheet = page.locator('.bs-exam-sheet');
    assert.equal(await sheet.locator('.bs-exam-task').count(), 3);
    assert.match(await sheet.innerText(), /25\. Gebiss[\s\S]+26\. Geruchssinn[\s\S]+27\. Körpersprache/);
    await page.getByRole('button', {name: 'Lösungsblätter zusätzlich anzeigen'}).click();
    assert.equal(await page.locator('.bs-exam-sheet.solutions-sheet li').count(), 9);
    assert.equal(await page.locator('.printpage').count(), 6);
    if (browserName === 'chromium' && process.env.BIO_PDF_OUTPUT) {
      await page.setViewportSize({width: 1280, height: 960});
      await page.pdf({path: process.env.BIO_PDF_OUTPUT, preferCSSPageSize: true});
    }
    await checkInteractive(page, home, {capture: browserName === 'chromium' && Boolean(process.env.BIO_CAPTURE)});
    assert.deepEqual(errors, []);
    console.log('BioLabor (' + browserName + '): Einstieg, Rückmeldung, Profilwechsel, Export/Import, Modelle, Druck, Probearbeiten, Wiederholung, Bildbeobachtung und Stationslinks geprüft.');
  } finally {
    await browser?.close();
    server.close();
  }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
