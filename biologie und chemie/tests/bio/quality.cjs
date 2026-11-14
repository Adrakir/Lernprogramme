const assert = require('node:assert/strict');

module.exports = async function checkQuality(page, home) {
  const open = async hash => {
    await page.goto(home + '#' + hash);
    await page.evaluate(route => {
      if (location.hash !== '#' + route) throw new Error('Unexpected route');
      return new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
    }, hash);
  };
  await page.setViewportSize({width:320,height:740});
  const releaseLabel = /\b(?:Version\s+\d+|V\d+(?:[._]\d+)?)\b/i;
  for (const route of ['home','bio8','print','lehrkraft']) {
    await open(route);
    assert.doesNotMatch(await page.title(),releaseLabel,route);
    assert.doesNotMatch(await page.locator('body').innerText(),releaseLabel,route);
  }
  await open('learn/skeleton');
  const views = page.getByRole('group',{name:'Skelettansicht'});
  const headView = views.getByRole('button',{name:'Kopf',exact:true});
  await headView.click();
  assert.equal(await headView.getAttribute('aria-pressed'),'true');
  const skeleton = page.getByRole('group',{name:'Kopfansicht mit Schädel und Unterkiefer.'});
  assert.deepEqual(await skeleton.getByRole('button').evaluateAll(markers => markers.map(marker => marker.dataset.feature)),['schaedel','kiefer']);
  assert.equal(await skeleton.locator('[data-skeleton-overview]:visible').count(),0);
  const jaw = skeleton.getByRole('button',{name:'2: Unterkiefer',exact:true});
  assert.ok((await jaw.boundingBox()).width>=44);
  await jaw.press('Enter');
  assert.match(await page.locator('#diagramInfo').innerText(),/Kauen und Sprechen/);
  const skeletonLabels = page.locator('#main .feature-grid button:visible');
  assert.equal(await skeletonLabels.count(),2);
  for (const [name,features] of [
    ['Brustkorb & Wirbelsäule',['wirbelsaeule','rippen','brustbein','rippenknorpel']],
    ['Arm & Hand',['schluesselbein','schulterblatt','oberarm','elle','speiche','handwurzel','mittelhand','finger']],
    ['Becken',['becken']],
    ['Bein & Fuß',['oberschenkel','kniescheibe','schienbein','wadenbein','fusswurzel','mittelfuss','zehen','gelenkknorpel']]
  ]) {
    const view = views.getByRole('button',{name,exact:true});
    await view.click();
    assert.equal(await view.getAttribute('aria-pressed'),'true',name);
    const figure = page.getByRole('group',{name:name+' am menschlichen Skelett',exact:true});
    const markers = figure.getByRole('button');
    assert.deepEqual(await markers.evaluateAll(elements => elements.map(element => element.dataset.feature)),features,name);
    assert.deepEqual(await skeletonLabels.evaluateAll(elements => elements.map(element => element.dataset.feature)),features,name);
    assert.ok(await figure.evaluate(svg => {
      const crop = svg.viewBox.baseVal;
      return [...svg.querySelectorAll('[data-feature]:not([hidden]) circle')].every(circle => {
        const {cx,cy,r}=circle;
        const x=cx.baseVal.value,y=cy.baseVal.value,radius=r.baseVal.value;
        return x-radius>=crop.x && x+radius<=crop.x+crop.width && y-radius>=crop.y && y+radius<=crop.y+crop.height;
      });
    }),name);
    assert.equal(await page.locator('#diagramInfo').innerText(),'Wähle eine Stelle aus.');
  }
  await views.getByRole('button',{name:'Gesamt',exact:true}).click();
  assert.equal(await skeletonLabels.count(),23);
  assert.equal(await page.locator('#main .illust-frame svg [data-feature]:not([hidden])').count(),23);
  await open('home');
  await page.getByRole('button',{name:'Alle Themen', exact:true}).click();
  const directory = page.locator('.bl-directory');
  assert.equal(await directory.evaluate(el => el === document.activeElement),true);
  await directory.getByRole('searchbox').fill('Wirbelsäule');
  assert.ok(await directory.getByRole('link',{name:'Wirbelsäule', exact:true}).isVisible());
  assert.equal(await directory.getByRole('link',{name:'Spiele & Detektive', exact:true}).count(),0);
  await directory.getByRole('link',{name:'Wirbelsäule', exact:true}).press('Enter');
  await page.getByRole('heading',{name:/Wirbelsäule/}).first().waitFor();
  await page.waitForFunction(() => document.activeElement.matches('main h1'));
  assert.ok(await page.getByText('Geführter Lernweg',{exact:true}).isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),0);

  const main = page.locator('#main');
  const skip = page.getByRole('link', {name:'Zum Lerninhalt springen'});
  await skip.focus();
  await skip.press('Enter');
  assert.equal(await main.evaluate(el => el === document.activeElement),true);
  assert.ok(page.url().endsWith('#learn/spine'));
  const menu = page.getByRole('button',{name:'Lernmenü öffnen'});
  await menu.focus();
  await menu.press('Enter');
  assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
  await page.waitForFunction(() => document.activeElement.closest('#sidebar') !== null);
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'),'false');
  assert.equal(await menu.evaluate(el => el === document.activeElement),true);
  assert.equal(await page.locator('#sidebar').evaluate(el => el.inert),true);

  const learningSteps = main.getByRole('group',{name:'Lernschritt wählen'});
  await learningSteps.getByRole('button',{name:/Lernwissen/}).press('Enter');
  const selected = learningSteps.getByRole('button',{name:/Lernwissen/,pressed:true});
  assert.equal(await selected.evaluate(el => el === document.activeElement),true);
  await learningSteps.getByRole('button',{name:/Entdecken/}).click();
  assert.equal(await main.getByRole('group',{name:/Wirbelsäule/}).locator('[role="button"]').count()>0,true);

  for (const route of ['assess','print','print/3']) {
    await open(route);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),0,route);
  }

  await open('glossary');
  await page.locator('#glossaryTopic').selectOption('spine');
  assert.match(await page.locator('#glossaryResults').innerText(), /Bandscheibe/);
  assert.doesNotMatch(await page.locator('#glossaryResults').innerText(), /Knochenmark/);

  await open('schulstoff/haustier');
  await page.getByRole('button',{name:'Rechenbeispiel laden'}).click();
  assert.equal(await page.locator('.bs-table-wrap').evaluate(el => el.scrollWidth - el.clientWidth),0);
  assert.equal(await page.locator('[data-bs-bar-value="0"]').innerText(),'43');

  await open('schulstoff/katze');
  await page.getByRole('button',{name:'Knochen am Bild entdecken'}).click();
  await page.locator('[data-bs-figure="hund"] button[aria-label="Hund 1"]').click();
  await page.locator('[data-bs-species="katze"]').click();
  assert.equal(await page.locator('[data-bs-figure="hund"]').isVisible(),false);
  const active = page.locator('[data-bs-figure="katze"] button[aria-pressed="true"]');
  assert.ok(await active.isVisible());
  assert.ok((await active.boundingBox()).width>=44);
  await page.locator('[data-bl-motion]').selectOption('2');
  assert.match(await page.locator('.bl-motion-compare').innerText(),/Landung|Landen/);

  await page.locator('#lcOpen').click();
  await page.locator('#lcTabs [data-tab="familie"]').click();
  await page.getByRole('heading',{name:'Lernübersicht für zu Hause',exact:true}).waitFor();
  assert.match(await page.locator('.bl-progress').innerText(),/Probearbeit 1[\s\S]*4 von 11/);
  await page.locator('#lcClose').focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => !!document.activeElement.closest('#lcModal')),true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.id),'lcClose');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id),'lcOpen');

  await page.evaluate(() => {
    const key = 'biolab5-probetest-1';
    const stored = JSON.parse(localStorage.getItem(key));
    stored.followup = {at:'2020-01-01T00:00:00Z', topics:['schulter'], done:false};
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await open('probetest');
  await page.reload();
  await page.getByRole('button',{name:'Lerncheck starten',exact:true}).click();
  const exercise = page.locator('.bp-root');
  await exercise.getByRole('heading',{name:'Fehler gezielt wiederholen',exact:true}).waitFor();
  assert.ok(await exercise.getByRole('radio',{name:'Schulterblatt'}).isVisible());
  await exercise.getByRole('radio',{name:'Schulterblatt'}).check();
  await exercise.getByRole('button',{name:'Antwort prüfen'}).click();
  await exercise.getByRole('button',{name:'Ergebnis anzeigen'}).click();
  assert.match(await exercise.innerText(),/1 von 1/);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('biolab5-probetest-1')).followup.done),true);

  await page.locator('#lcOpen').click();
  await page.locator('#lcTabs [data-tab="familie"]').click();
  assert.match(await page.locator('.bl-progress').innerText(), /Lerncheck am Folgetag[\s\S]*1 von 1 richtig/);
  await page.locator('#lcClose').click();

  await open('probetest/archiv/1');
  await page.getByRole('heading',{name:'Auswertung · Arbeit 1',exact:true}).waitFor();
  assert.match(await page.locator('.bp-topic-results').innerText(), /Skelett und Knochen[\s\S]*0 von 1 Punkten/);
  await page.getByText('Aufgabe 1 · Skelett und Knochen · Noch üben',{exact:true}).click();
  const archivedPicture = page.locator('.bp-review[open] .bk-image-text');
  await archivedPicture.getByText('Bildbeschreibung',{exact:true}).click();
  assert.match(await archivedPicture.innerText(),/dreieckigen Knochenplatte/);

  await open('probetest/arbeit');
  await page.getByRole('button',{name:'Aufgabe 1, offen',exact:true}).click();
  const reader = page.getByRole('button',{name:'Aufgabe vorlesen',exact:true});
  await reader.waitFor();
  await page.evaluate(() => {
    window.__spoken = '';
    const synth = window.speechSynthesis || {getVoices:() => []};
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    synth.speak = utterance => {window.__spoken = utterance.text;};
    synth.cancel = () => {window.__spoken = '';};
    if (!window.speechSynthesis) window.speechSynthesis = synth;
  });
  await reader.click();
  assert.match(await page.evaluate(() => window.__spoken),/Hüftgelenk und Knie.*Antwortmöglichkeiten/);
  await page.getByRole('button',{name:'Vorlesen stoppen',exact:true}).click();
  assert.equal(await page.evaluate(() => window.__spoken),'');
  await page.getByRole('button',{name:'Aufgabe vorlesen',exact:true}).click();
  await page.getByRole('button',{name:'Weiter →',exact:true}).click();
  assert.equal(await page.evaluate(() => window.__spoken),'');
  await page.getByText('Bildbeschreibung',{exact:true}).click();
  assert.match(await page.locator('.bk-image-text').innerText(),/langen, spitzen Zahn/);
  assert.doesNotMatch(await page.locator('.bk-image-text').innerText(),/Eckzahn/);

  await open('koerpersprache');
  await page.getByRole('button',{name:'Szene 1 · Hund',exact:true}).click();
  const ears = page.getByRole('button',{name:'Ohren beschreiben',exact:true});
  await ears.press('Enter');
  assert.equal(await ears.getAttribute('aria-pressed'),'true');
  assert.equal(await ears.evaluate(el => el === document.activeElement),true);
  await page.getByRole('button',{name:'Rute beschreiben',exact:true}).press('Enter');
  assert.match(await page.locator('.bp-status').innerText(),/2 von 3/);
  await page.getByRole('button',{name:'Merkmale vorlesen',exact:true}).click();
  assert.match(await page.evaluate(() => window.__spoken),/Ohren sind beweglich/);

  await open('lehrkraft');
  await page.locator('[data-bl-stations]').selectOption('required');
  assert.equal(await page.locator('.bp-station:visible').count(),3);
  assert.equal(await page.getByText('Erfolgskriterium',{exact:true}).filter({visible:true}).count(),3);
  await page.locator('[data-bl-stations]').selectOption('all');
  assert.equal(await page.locator('.bp-station:visible').count(),10);
};
