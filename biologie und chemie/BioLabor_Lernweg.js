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

  function directory(items) {
    const animals = ['Hund', 'Katze'].map((name, i) => '<li><a href="BioLabor_Hund_Katze.html#' +
      (i ? 'cat' : 'dog') + '/skeleton">' + name + ' erforschen</a></li>').join('');
    return '<section class="panel bl-directory" id="bio-themen" tabindex="-1"><h2>Alle Themen und Funktionen</h2>' +
      '<label>Inhalte suchen <input type="search" data-bl-search placeholder="z. B. Wirbelsäule, Spiele oder Druck"></label>' +
      '<p role="status" data-bl-search-status></p><ul>' + items.map(item =>
        '<li><a href="#' + escape(item.id) + '">' + escape(item.title) + '</a></li>').join('') + animals + '</ul></section>';
  }

  function focus(target, scroll = false) {
    if (!target) return;
    if (!target.hasAttribute('tabindex') && !target.matches('button,a,summary,input,select')) target.tabIndex = -1;
    target.focus({preventScroll:true});
    if (scroll) target.scrollIntoView({block:'start', behavior:'instant'});
  }

  function bindMain() {
    const root = document.getElementById('main');
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-bl-jump],[data-bl-cockpit]');
      if (button?.dataset.blJump) focus(root.querySelector(button.dataset.blJump), true);
      if (button?.dataset.blCockpit) window.LernCockpit?.open(button.dataset.blCockpit);
    });
    root.addEventListener('input', event => {
      if (!event.target.matches('[data-bl-search]')) return;
      const section = event.target.closest('.bl-directory');
      const query = event.target.value.toLocaleLowerCase('de').trim();
      const items = [...section.querySelectorAll('li')];
      items.forEach(item => {item.hidden = !item.textContent.toLocaleLowerCase('de').includes(query);});
      section.querySelector('[data-bl-search-status]').textContent = query
        ? items.filter(item => !item.hidden).length + ' passende Einträge' : '';
    });
  }

  function animalSettings() {
    let settings;
    try {
      const state = JSON.parse(localStorage.getItem('lerncockpit-bio-2026'));
      settings = state?.profiles?.[state.active]?.settings;
    } catch {}
    const root = document.documentElement;
    root.dataset.bioMotion = settings?.motion || 'system';
    if (settings?.font) root.style.setProperty('--scale', {normal:'1', large:'1.125', xl:'1.25'}[settings.font] || '1');
    if (settings?.theme) {
      document.body.classList.toggle('dark', settings.theme === 'dark' ||
        (settings.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches));
      document.body.classList.toggle('tier-contrast', settings.theme === 'contrast');
    }
    return settings || {};
  }

  window.BioLaborLernweg = {lesson, directory, focus, bindMain, animalSettings};
})();
