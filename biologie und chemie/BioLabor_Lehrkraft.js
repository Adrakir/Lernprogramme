(() => {
  'use strict';

  const page = 'BioLabor_5_Biologie_V9_2.html';
  const base = 'https://adrakir.github.io/Lernprogramme/biologie%20und%20chemie/' + page;
  const stations = [
    ['schulstoff/wolf', 'Wolf oder Hund?', 'S. 24–27 · Station 1',
      'Gemeinsamkeiten erkennen und Domestikation, Zucht und Training unterscheiden.',
      'Erklärt zu zweit, warum ein gezähmter Wolf und ein Haushund nicht dasselbe sind.'],
    ['schulstoff/gebiss', 'Das Raubtiergebiss', 'S. 26–27 und 34–35 · Station 2',
      'Zahnformen beschriften und ihre Funktion beim Fressen erklären.',
      'Vergleicht das Gebiss des Hundes mit dem des Menschen. Zeigt an je einem Zahn, wie seine Form zur Aufgabe passt.'],
    ['schulstoff/pfote', 'Pfote und Skelett', 'S. 25 · Station 3',
      'Pfotenabdrücke lesen und Zehen- von Sohlengängern unterscheiden.',
      'Zeichnet einen typischen Hunde- und Katzenabdruck. Erklärt, warum Krallen auf verschiedenen Untergründen unterschiedlich gut sichtbar sind.'],
    ['schulstoff/katze', 'Körperbau und Gebiss der Katze', 'S. 25 und 34–37',
      'Dieselben Knochen bei Hund und Katze finden und ihre Funktion erläutern.',
      'Wählt zwei markierte Bereiche und beschreibt, welche Rolle sie beim Absprung oder bei der Landung spielen.'],
    ['schulstoff/sinne', 'Sinne und Hunde im Einsatz', 'S. 27, 31, 34–35 und 37',
      'Die Rolle von Riechschleimhaut und Riechzellen erklären und Beispiele für den Einsatz von Hunden nennen.',
      'Beschreibt den Weg vom Duftstoff bis zum Gehirn und erklärt, was ein Spürhund zusätzlich lernen muss.'],
    ['schulstoff/bewegung', 'Bewegungssystem des Menschen', 'S. 231–233',
      'Wirbelsäule, Knochen und Gelenke beschreiben und das Gegenspielerprinzip erklären.',
      'Beugt und streckt den Unterarm. Zeichnet, welcher Muskel bei der jeweiligen Bewegung zieht.'],
    ['schulstoff/haustier', 'Ein Hund als Haustier?', 'S. 28–29',
      'Kriterien gewichten und eine Entscheidung anhand von Punkten begründen.',
      'Gebt Haltung oder Bewegung ein anderes Gewicht. Prüft, ob sich die Rangfolge ändert, und begründet das Ergebnis.'],
    ['koerpersprache', 'Körpersprache beobachten', 'Bildaufgabe · Hund und Katze',
      'Mindestens zwei sichtbare Merkmale benennen und eine Deutung mit der Situation begründen.',
      'Vergleicht die beiden geduckten Katzen. Erklärt, warum Blick und Bewegungsrichtung für die Deutung wichtig sind.'],
    ['probetest', 'Interaktive Probeklassenarbeit', 'Drei Fassungen · 9 Aufgaben je Fassung',
      'Bildbeschriftung, Zuordnung und schriftliches Erklären selbstständig üben.',
      'Wählt nach der Auswertung einen Übungsschwerpunkt. Löst die Wiederholungsfrage und erklärt, was sich gegenüber der ersten Aufgabe verändert hat.'],
    ['print', 'Probeklassenarbeiten zum Drucken', 'Drei Fassungen · 33 Punkte je Fassung',
      'Eine komplette Arbeit mit getrennt zuschaltbaren Lösungen und Erwartungshorizont bearbeiten.',
      'Lasst anschließend zwei Begründungen anhand des Erwartungshorizonts im Tandem vergleichen.'],
  ];

  const plans = [
    [12,'Einzelarbeit, dann Partnervergleich','Mindestens zwei gemeinsame Merkmale nennen und Domestikation mit einem eigenen Satz erklären.'],
    [15,'Partnerarbeit','Zahnart und Funktion korrekt verknüpfen und die Scherenwirkung erklären.'],
    [12,'Partnerarbeit','Abdruck mit einem Merkmal begründen und Zehengang am Modell zeigen.'],
    [12,'Einzelarbeit oder Tandem','Zwei entsprechende Knochen finden und ihre Lage am Skelett beschreiben.'],
    [10,'Einzelarbeit','Duftstoff, Riechzellen und Gehirn in eine sinnvolle Reihenfolge bringen.'],
    [15,'Partnerarbeit','Muskel, Sehne, Knochen und Gelenk am Beispiel des Unterarms verknüpfen.'],
    [15,'Tandem','Die Entscheidung mit zwei Kriterien und einer nachvollziehbaren Rechnung begründen.'],
    [8,'Einzelarbeit, dann Austausch','Zwei Bildsignale beschreiben und die Deutung auf die Situation beziehen.'],
    [20,'Einzelarbeit','Eine Fassung bearbeiten. Auswahl und Zuordnung auswerten und Texte mit Kriterien vergleichen.'],
    [45,'Einzelarbeit','Eine Fassung bearbeiten und danach mit dem Erwartungshorizont abgleichen.']
  ];

  function mount(root) {
    const codes = window.BioLaborStationsQR || {};
    root.innerHTML = `<div class="bs-school bp-root bp-teacher">
      <header class="bs-heading bp-heading"><h1>Lehrkraft · Stationen und Material</h1>
        <p>Öffne eine Station über den Link oder scanne ihren QR-Code. Jede Karte enthält ein Lernziel und eine Vertiefung.</p>
        <div class="button-row bp-no-print"><button type="button" class="btn" data-bl-print>Stationskarten drucken / PDF</button>
          <a class="btn secondary" href="#schulstoff">Zur Schulstoffübersicht</a></div>
      </header>
      <div class="bl-teacher-options bp-no-print"><label>Stationskarten anzeigen <select data-bl-stations><option value="all">Alle zehn Karten</option><option value="required">Nur Pflichtstationen</option><option value="choice">Nur Wahlstationen</option></select></label>
      <p data-bl-station-status role="status">10 Karten sichtbar</p></div><div class="bp-teacher-grid">
      ${stations.map(([route,title,book,goal,task], index) => {
        const [minutes, format, criterion] = plans[index];
        const type = index < 3 ? 'required' : 'choice';
        const url = base + '#' + route;
        return `<article class="bs-panel bp-station" data-bl-route="${route}" data-bl-station-type="${type}">
          <div><h2>${title}</h2><p class="bp-station-book">${book}</p></div>
          <div class="bp-station-text"><p class="bl-station-meta">${type === 'required' ? 'Pflichtstation' : 'Wahlstation'} · ca. ${minutes} Min. · ${format}</p><p><strong>Lernziel</strong> ${goal}</p><p><strong>Erfolgskriterium</strong> ${criterion}</p><p><strong>Vertiefung</strong> ${task}</p></div>
          <div class="bp-station-links">${codes[route] ? `<a class="bp-qr" href="${url}" aria-label="QR-Code zu ${title}">
            <svg viewBox="0 0 ${codes[route][0]} ${codes[route][0]}" role="img" aria-label="QR-Code zur Station" shape-rendering="crispEdges">
              <rect width="100%" height="100%" fill="#fff"/><path fill="#13231f" d="${codes[route][1]}"/></svg></a>` : ''}
            <div class="bp-no-print"><a class="btn secondary" href="#${route}">Station öffnen</a>
              <button type="button" class="btn secondary" data-bl-copy="${url}">Link kopieren</button></div>
            <p data-bl-notice role="status" class="bp-no-print"></p>
          </div>
        </article>`;
      }).join('')}
      </div>
    </div>`;
    const content = root.firstElementChild;
    content.querySelector('[data-bl-stations]').addEventListener('change', event => {
      const kind = event.target.value;
      const cards = [...content.querySelectorAll('[data-bl-station-type]')];
      cards.forEach(card => {card.hidden = kind !== 'all' && card.dataset.blStationType !== kind;});
      content.querySelector('[data-bl-station-status]').textContent = cards.filter(card => !card.hidden).length + ' Karten sichtbar';
    });
    content.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-bl-print')) {
        window.print();
      } else if (button.dataset.blCopy) {
        const notice = button.closest('article').querySelector('[data-bl-notice]');
        try {
          await navigator.clipboard.writeText(button.dataset.blCopy);
          notice.textContent = 'Direktlink kopiert.';
        } catch {
          const field = document.createElement('input');
          field.type = 'text';
          field.readOnly = true;
          field.value = button.dataset.blCopy;
          field.setAttribute('aria-label', 'Direktlink zum Kopieren');
          notice.replaceChildren('Direktlink zum Kopieren', field);
          field.select();
        }
      }
    });
  }
  window.BioLaborLehrkraft = {mount};
})();
