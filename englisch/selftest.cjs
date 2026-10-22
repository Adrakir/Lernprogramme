'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function app() {
  const nodes = new Map();
  const listeners = [];
  const document = {
    body: { classList: { toggle() {} } },
    activeElement: null,
    querySelector(selector) {
      if (!nodes.has(selector)) {
        nodes.set(selector, {
          value: selector === '#scope' ? 'unit1' : selector === '#direction' ? 'de-en' : '',
          innerHTML: '', textContent: '', hidden: false, disabled: false,
          setAttribute() {}, insertAdjacentHTML() {},
          focus() { document.activeElement = this; }
        });
      }
      return nodes.get(selector);
    },
    querySelectorAll() { return []; },
    addEventListener(type, listener) { if (type === 'click') listeners.push(listener); }
  };
  const storage = new Map();
  const context = vm.createContext({
    document, console, setTimeout, clearTimeout, setInterval, clearInterval,
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value)
    },
    window: { addEventListener() {}, matchMedia: () => ({ matches: false }) }
  });
  for (const file of ['data.js', 'image-map.js', 'application-data.js', 'app.js', 'learning.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
  }
  return {
    run: code => vm.runInContext(code, context),
    node: selector => document.querySelector(selector),
    document, listeners
  };
}

test('269 cards have stable IDs, both canonical answers and existing image files', () => {
  const a = app();
  assert.equal(a.run('vocab.length'), 269);
  assert.equal(a.run("vocab.filter(v=>v.unit==='unit1').length"), 79);
  assert.equal(a.run('vocab.every((v,i)=>v.id===i&&v.en&&v.de&&v.example)'), true);
  for (const direction of ['de-en', 'en-de']) {
    a.node('#direction').value = direction;
    assert.equal(a.run('vocab.every(v=>variants(v).includes(norm(target(v).split(";")[0])))'), true);
  }
  const files = a.run('vocab.flatMap(v=>[v.image&&v.image.replaceAll(" ","-"),v.contextImage]).filter(Boolean)');
  for (const file of files) assert.ok(fs.existsSync(path.join(__dirname, 'assets', file + '.webp')), file);
});

test('articles, verb to, contractions and typography remain accepted', () => {
  const a = app();
  assert.equal(a.run('norm("  she’s…  ")'), "she's");
  assert.equal(a.run('variants(vocab.find(v=>v.en==="listen")).includes("to listen")'), true);
  assert.equal(a.run('variants(vocab.find(v=>v.en==="she’s")).includes("she is")'), true);
  a.node('#direction').value = 'en-de';
  assert.equal(a.run('variants(vocab.find(v=>v.en==="phone")).includes("Handy")'), true);
});

test('hang out is not taught as the literal hängen', () => {
  const a = app();
  a.node('#direction').value = 'en-de';
  assert.equal(a.run('variants(vocab.find(v=>v.en==="hang out")).includes("hängen")'), false);
  assert.equal(a.run('variants(vocab.find(v=>v.en==="hang out")).includes("abhängen")'), true);
});

test('feedback distinguishes casing, spelling, empty and wrong translations', () => {
  const a = app();
  for (const [answer, type] of [['English', 'correct'], ['english', 'case'], ['Englsh', 'spelling'], ['', 'empty'], ['French', 'translation']]) {
    assert.equal(a.run(`answerType(${JSON.stringify(answer)},['English'])`), type);
  }
  a.node('#direction').value = 'en-de';
  assert.match(a.run('correctionHint("case",vocab.find(v=>v.en==="listen"))'), /Deutsche Nomen/);
});

test('writing offers another attempt, then moves focus to the next-word button', () => {
  const a = app();
  a.run('mode="write";pool=[vocab.find(v=>v.en==="phone")];pos=0;renderWrite()');
  a.node('#entry').value = 'phon';
  a.run('checkWrite()');
  assert.equal(a.run('answered'), false);
  assert.equal(a.run('writeAttempts'), 1);
  a.node('#entry').value = 'phone';
  a.run('checkWrite()');
  assert.equal(a.run('answered'), true);
  assert.equal(a.run('scores[pool[0].id].correct'), 0);
  assert.equal(a.document.activeElement, a.node('#write-next button'));
  assert.match(a.node('#feedback').innerHTML, /nach Unterstützung/);
});

test('independent first answers still count as successful practice', () => {
  const a = app();
  a.run('mode="write";pool=[vocab.find(v=>v.en==="phone")];pos=0;renderWrite()');
  a.node('#entry').value = 'phone';
  a.run('checkWrite()');
  assert.equal(a.run('scores[pool[0].id].correct'), 1);
});

test('hearing the English solution counts as support only in German-English writing', () => {
  for (const direction of ['de-en', 'en-de']) {
    const a = app();
    a.node('#direction').value = direction;
    a.run('mode="write";pool=[vocab.find(v=>v.en==="phone")];pos=0;renderWrite()');
    const button = { disabled: false, dataset: { action: 'speak' } };
    a.listeners.at(-1)({ target: { closest: () => button } });
    assert.equal(a.run('tip'), direction === 'de-en' ? 1 : 0);
    a.node('#entry').value = direction === 'de-en' ? 'phone' : 'Telefon';
    a.run('checkWrite()');
    assert.equal(a.run('scores[pool[0].id].correct'), direction === 'de-en' ? 0 : 1);
  }
});

test('gap prompts contain necessary cues and spoken solutions omit German cues', () => {
  const a = app();
  assert.equal(a.run('applicationTasks.filter(t=>t.kind==="gap").every(t=>t.text.includes("___")&&t.answers.length)'), true);
  for (const [word, cue] of [['English', 'Englisch'], ['listen', 'zuhören'], ['mum', 'britisches Wort'], ['an hour', 'a oder an']]) {
    assert.equal(a.run(`applicationTasks.find(t=>t.kind==="gap"&&t.word===${JSON.stringify(word)}).text.includes(${JSON.stringify(cue)})`), true);
  }
  assert.equal(a.run('applicationSentence(applicationTasks.find(t=>t.kind==="gap"&&t.word==="English"))'), 'I speak English.');
  assert.equal(a.run('applicationSentence(applicationTasks.find(t=>t.kind==="gap"&&t.word==="an hour"))'), 'We play for an hour.');
  assert.equal(a.run('applicationSentence(applicationTasks.find(t=>t.kind==="dialogue"))').includes('Yes, we can meet.'), true);
});

test('learning pictures and colours have meaningful text alternatives', () => {
  const a = app();
  a.run('mode="quiz"');
  assert.match(a.run('pictureContent(vocab.find(v=>v.en==="phone"))'), /alt="Lernbild: das Telefon/);
  assert.match(a.run('pictureContent(vocab.find(v=>v.visual?.type==="colour"))'), /aria-label="Farbe: /);
});

test('all story questions have one correct answer and two distinct distractors', () => {
  const a = app();
  assert.equal(a.run('listeningStories.every(s=>s.questions.length===3&&s.questions.every(q=>new Set([q[1],...q[2]]).size===3))'), true);
  assert.equal(a.run('applicationTasks.filter(t=>t.kind==="dialogue").every(t=>new Set([t.answer,...t.wrong]).size===3)'), true);
});
