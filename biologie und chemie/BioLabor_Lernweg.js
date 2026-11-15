(() => {
  'use strict';

  const themes = {
  "life": [
    "Samen, Flamme und Roboter verändern sich. Welches Beispiel besteht aus Zellen?",
    "Prüfe Wachstum, Reizreaktion und Stoffwechsel. Wann keimt ein Samen?",
    "Begründe mit zwei Kennzeichen, warum eine Flamme kein Lebewesen ist."
  ],
  "skeleton": [
    "Suche Schädel, Brustkorb und Becken im Bild.",
    "Ordne zu, was die drei Bereiche schützen oder tragen.",
    "Erkläre, wie die Rippen Herz und Lunge schützen."
  ],
  "spine": [
    "Betrachte die Wirbelsäule von der Seite. Wo erkennst du ihre Bögen?",
    "Finde einen Wirbel, eine Bandscheibe und den Wirbelkanal.",
    "Vergleiche die Wirbelsäulen von Mensch und Hund und erkläre, wie ihre Form zur Bewegung passt."
  ],
  "bone": [
    "Vergleiche die Außenschicht mit den Bälkchen im Knochen.",
    "Verfolge die Schichten von der Knochenhaut zur Markhöhle.",
    "Erkläre, warum Knochenbälkchen Stabilität bei wenig Gewicht ermöglichen."
  ],
  "models": [
    "Welche Papierform trägt deiner Vermutung nach die größere Last?",
    "Verändere nur die Form. Papiermenge, Länge und Belastung bleiben gleich.",
    "Beschreibe deine Beobachtung und nenne eine Grenze des Modells."
  ],
  "joints": [
    "Beuge einen Finger und bewege die Schulter. Welche Richtungen sind möglich?",
    "Untersuche Scharnier und Kugel im Modell.",
    "Begründe, welches Modell zur Beugung im oberen Sprunggelenk passt."
  ],
  "muscles": [
    "Beuge den Unterarm. Welche Seite des Oberarms fühlt sich fester an?",
    "Verfolge die Kraft vom Muskel über die Sehne zum Knochen.",
    "Erkläre, welcher Muskel den Unterarm streckt. Prüfe im Hebel-Labor, wie die Länge des Kraftarms wirkt."
  ],
  "wolf": [
    "Wolf und Hund laufen auf den Zehen. Welche weiteren Merkmale teilen sie?",
    "Vergleiche Abstammung, Domestikation und gezielte Zucht.",
    "Erkläre am Hütehund, was durch Zucht gefördert werden kann und was Training braucht."
  ],
  "gebiss": [
    "Finde Eckzahn und Reißzahn. Welche Form erkennst du?",
    "Verfolge im Kiefermodell, wie die Reißzähne aneinander vorbeigleiten.",
    "Vergleiche Hund und Kaninchen. Erkläre, wie die Zahnform zur Nahrung passt."
  ],
  "pfote": [
    "Vergleiche die Abdrücke. Wo siehst du Krallenspuren?",
    "Verfolge am Hinterbein den Weg vom Knie über das Sprunggelenk zu den Zehen.",
    "Erkläre, warum eine Katze auf weichem Boden auch Krallenspuren hinterlassen kann."
  ],
  "katze": [
    "Finde das Schulterblatt bei Hund und Katze.",
    "Nutze dieselbe Markierung in beiden Bildern und beschreibe die Lage zum Oberarm.",
    "Erkläre, wie Hinterbeine und Ballen beim Springen oder Landen zusammenwirken."
  ],
  "sinne": [
    "Wo treffen Duftstoffe auf die Riechschleimhaut?",
    "Verfolge den Weg von den Riechzellen zum Gehirn.",
    "Erkläre, welche Fähigkeit einem Rettungshund hilft und was er zusätzlich lernen muss."
  ],
  "bewegung": [
    "Beuge und strecke deinen Unterarm. Was wird dabei bewegt?",
    "Ordne Muskel, Sehne, Knochen und Gelenk nach ihrem Beitrag zur Bewegung.",
    "Vergleiche die Wirbelsäulen von Mensch, Hund, Giraffe und Ringelnatter. Begründe jeweils einen Zusammenhang mit der Lebensweise."
  ],
  "haustier": [
    "Lies die Steckbriefe und wähle, was der Familie wichtig ist.",
    "Vergib Gewichte und Punkte. Rechne an einem Beispiel Gewicht mal Punkte.",
    "Ändere eine Gewichtung und erkläre, ob sich die Rangfolge verändert."
  ]
};
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char]);

  function lesson(id, school = false) {
    if (!Object.hasOwn(themes, id)) return '';
    const steps = ['Schau hin', 'Untersuche', 'Erkläre selbst'];
    return '<details class="bl-guide"><summary>Geführter Lernweg</summary><ol>' +
      themes[id].map((text, i) => '<li><b>' + steps[i] + '</b><p>' + text + '</p></li>').join('') +
      '</ol><div class="button-row">' + (school
        ? '<button type="button" class="btn small" data-bl-jump="[data-bl-school-tasks]">Zu den Aufgaben</button>'
        : '<button type="button" class="btn small" data-action="tab" data-id="practice">Thema üben</button>') +
      '</div></details>';
  }

  let directoryQuery = '';

  const normalize = text => text.toLocaleLowerCase('de').normalize('NFC');
  const plain = text => normalize(text).normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ß', 'ss');
  const searchTokens = text => normalize(text).match(/[\p{L}\p{N}]+/gu) || [];

  function matchesDirectory(text, tokens) {
    const original = normalize(text);
    const expanded = original.replace(/[äöüß]/g, char => ({ä:'ae', ö:'oe', ü:'ue', ß:'ss'}[char]));
    const simplified = plain(text);
    return tokens.every(term => expanded.includes(term) || simplified.includes(plain(term)));
  }

  function searchSummary(tokens, count) {
    if (!tokens.length) return '';
    return count === 0 ? 'Kein passendes Thema gefunden.' : count + (count === 1 ? ' passender Eintrag' : ' passende Einträge');
  }

  function directory(items) {
    const direct = [
      ['#schulstoff/gebiss', 'Gebisse vergleichen · Hund, Katze, Mensch und Kaninchen'],
      ['#klassenarbeit/gebiss/mensch', 'Gebiss beschriften und Gebiss-Probetest'],
      ['#klassenarbeit/mensch', 'Skelett beschriften und Skelett-Probetest'],
      ['#probetest/archiv', 'Archiv der Probeklassenarbeiten'],
      ['#schulstoff/katze', 'Körperbau und Gebiss der Katze'],
      ['#schulstoff/pfote', 'Pfote, Skelett und Zehengang'],
      ['#schulstoff/haustier', 'Ein Hund als Haustier? Hunderassen vergleichen'],
      ['BioLabor_Hund_Katze.html#dog/skeleton', 'Hund erforschen'],
      ['BioLabor_Hund_Katze.html#cat/skeleton', 'Katze erforschen'],
    ];
    const tokens = searchTokens(directoryQuery);
    let shown = 0;
    const links = [...items.map(item => ['#' + item.id, item.title]), ...direct].map(([url, label]) => {
      const visible = matchesDirectory(label, tokens);
      shown += Number(visible);
      return '<li' + (visible ? '' : ' hidden') + '><a href="' + escape(url) + '">' + escape(label) + '</a></li>';
    }).join('');
    return '<section class="panel bl-directory" id="bio-themen" tabindex="-1"><h2>Alle Themen und Funktionen</h2>' +
      '<div class="bl-directory-controls"><label>Inhalte suchen <input type="search" data-bl-search placeholder="z. B. Wirbelsäule, Spiele oder Druck" value="' +
      escape(directoryQuery) + '"></label><button type="button" class="btn small secondary" data-bl-search-clear' +
      (directoryQuery ? '' : ' hidden') + '>Suche löschen</button></div>' +
      '<p role="status" data-bl-search-status>' + searchSummary(tokens, shown) + '</p><ul>' + links + '</ul></section>';
  }

  function focus(target, scroll = false) {
    if (!target) return;
    if (!target.hasAttribute('tabindex') && !target.matches('button,a,summary,input,select')) target.tabIndex = -1;
    target.focus({preventScroll:true});
    if (scroll) target.scrollIntoView({block:'start', behavior:'instant'});
  }

  function readAloud(label, text) {
    return '<button type="button" class="btn small secondary bl-read" data-action="speak" data-text="' +
      escape(text) + '">' + escape(label) + '</button>' +
      '<button type="button" class="btn small secondary bl-read" data-action="stopAudio">Vorlesen stoppen</button>';
  }

  function readQuestion(prompt, description, options = [], rows = []) {
    const parts = [prompt, description];
    if (rows.length) parts.push('Ordne diese Begriffe zu. ' + rows.join('. ') + '.');
    if (options.length) parts.push('Antwortmöglichkeiten. ' + options.join('. ') + '.');
    return readAloud('Aufgabe vorlesen', parts.filter(Boolean).join(' '));
  }

  function bindMain() {
    const root = document.getElementById('main');
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-bl-jump],[data-bl-cockpit],[data-bl-search-clear]');
      if (button?.dataset.blJump) {
        const target = root.querySelector(button.dataset.blJump);
        if (button.hasAttribute('data-bl-open-details') && target?.parentElement.matches('details')) {
          target.parentElement.open = true;
        }
        focus(target, true);
      }
      if (button?.dataset.blCockpit) window.LernCockpit?.open(button.dataset.blCockpit);
      if (button?.hasAttribute('data-bl-search-clear')) {
        const input = button.closest('.bl-directory').querySelector('[data-bl-search]');
        input.value = '';
        input.dispatchEvent(new Event('input', {bubbles:true}));
        input.focus();
      }
    });
    root.addEventListener('input', event => {
      if (!event.target.matches('[data-bl-search]')) return;
      const section = event.target.closest('.bl-directory');
      directoryQuery = event.target.value;
      const tokens = searchTokens(directoryQuery);
      const items = [...section.querySelectorAll('li')];
      items.forEach(item => {item.hidden = !matchesDirectory(item.textContent, tokens);});
      section.querySelector('[data-bl-search-clear]').hidden = !directoryQuery;
      section.querySelector('[data-bl-search-status]').textContent = searchSummary(tokens, items.filter(item => !item.hidden).length);
    });
  }

  const profileKey = 'lerncockpit-bio-2026';
  const standaloneFontKey = 'biolab5-tierkunde-2026-font';
  const animalFontSizes = {normal: '1', large: '1.125', xl: '1.25'};
  const standaloneThemeKey = 'biolab5-tierkunde-2026-theme';
  const darkPreference = matchMedia('(prefers-color-scheme: dark)');

  function readProfileState() {
    try { return JSON.parse(localStorage.getItem(profileKey)); }
    catch { return null; }
  }

  function profileIdentity(state) {
    return JSON.stringify([state?.active || 'Standard', state?.nativeRevision || 0]);
  }

  const openedProfile = profileIdentity(readProfileState());
  function acceptsAnimalWrites() {
    return profileIdentity(readProfileState()) === openedProfile;
  }

  function applyAnimalTheme(theme) {
    const dark = theme === 'dark' || (theme === 'system' && darkPreference.matches);
    document.body.classList.toggle('dark', dark);
    document.body.classList.toggle('tier-contrast', theme === 'contrast');
    const control = document.getElementById('theme');
    if (control) control.setAttribute('aria-pressed', String(dark));
  }

  function animalSettings() {
    let settings;
    let standaloneTheme;
    let standaloneFont;
    try {
      const state = readProfileState();
      settings = state?.profiles?.[state.active]?.settings;
      standaloneTheme = localStorage.getItem(standaloneThemeKey);
      standaloneFont = localStorage.getItem(standaloneFontKey);
    } catch {}
    const root = document.documentElement;
    const motion = settings?.motion || 'system';
    if (root.dataset.bioMotion !== motion) {
      root.dataset.bioMotion = motion;
      document.dispatchEvent(new Event('biolab-motion-change'));
    }
    applyAnimalFont(settings?.font || standaloneFont || 'normal');
    applyAnimalTheme(settings?.theme || standaloneTheme || 'system');
    return settings || {};
  }

  function applyAnimalFont(font) {
    const root = document.documentElement;
    root.dataset.bioFont = Object.hasOwn(animalFontSizes, font) ? font : 'normal';
    root.style.setProperty('--scale', animalFontSizes[root.dataset.bioFont]);
  }

  function setAnimalFont(font) {
    if (!acceptsAnimalWrites()) return false;
    applyAnimalFont(font);
    try {
      const state = readProfileState();
      const settings = state?.profiles?.[state.active]?.settings;
      if (settings) {
        settings.font = font;
        localStorage.setItem(profileKey, JSON.stringify(state));
      } else {
        localStorage.setItem(standaloneFontKey, font);
      }
    } catch {}
    return true;
  }

  function setAnimalTheme(theme) {
    if (!acceptsAnimalWrites()) return;
    applyAnimalTheme(theme);
    try {
      const state = readProfileState();
      const settings = state?.profiles?.[state.active]?.settings;
      if (settings) {
        settings.theme = theme;
        localStorage.setItem(profileKey, JSON.stringify(state));
      } else {
        localStorage.setItem(standaloneThemeKey, theme);
      }
    } catch {}
  }

  if (document.getElementById('theme')) {
    const syncProfile = () => {
      if (!acceptsAnimalWrites()) location.reload();
      else animalSettings();
    };
    window.addEventListener('pageshow', syncProfile);
    window.addEventListener('storage', event => {
      if (event.key === profileKey || event.key === standaloneThemeKey || event.key === standaloneFontKey || event.key === null) syncProfile();
    });
    darkPreference.addEventListener('change', animalSettings);
  }

  function animalRoute() {
    try { return decodeURIComponent(location.hash.slice(1)).split('/'); }
    catch { return []; }
  }

  window.BioLaborLernweg = {animalRoute, lesson, directory, focus, bindMain, animalSettings, setAnimalTheme, setAnimalFont, acceptsAnimalWrites, readAloud, readQuestion};
})();
