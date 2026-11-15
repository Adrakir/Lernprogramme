(() => {
  'use strict';

  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
  })[c]);
  const timestamp = value => Number.isFinite(Date.parse(value)) ? Date.parse(value) : -Infinity;
  const formatDate = value => Number.isFinite(timestamp(value))
    ? new Intl.DateTimeFormat('de-DE', {dateStyle:'medium'}).format(new Date(value)) : 'Datum nicht gespeichert';
  const read = () => ({exams:window.BioLaborProbetest?.progress() || {}, stations:window.BioLaborSchulstoff?.progress() || []});
  function recommendations(exams) {
    const check = exams.checkResult;
    const recent = check && timestamp(check.at) >= timestamp(exams.last?.at) ? check : null;
    const practice = (exams.last?.practiceLinks || []).filter(([, , tasks]) =>
      !recent || !tasks.every(task => recent.solvedTopics.includes(task)));
    const retained = (recent?.topics || []).filter(topic => !practice.some(([open]) => open === topic));
    return {retained, practice};
  }

  function next({exams, stations}) {
    if (exams.draft) return ['#probetest/arbeit', 'Offene Arbeit fortsetzen'];
    if (exams.followupDue) return ['#probetest', 'Zum Lerncheck am Folgetag'];
    if (exams.practicePending) return ['#probetest/uebungsentwurf', 'Offene Wiederholung fortsetzen'];
    const station = stations.filter(s => s.started && s.done < s.total).sort((a,b) => timestamp(b.at)-timestamp(a.at))[0];
    const [first] = recommendations(exams).practice;
    const examNext = first ? [first[1], first[0] + ' wiederholen'] : exams.last?.reviewLink;
    if (examNext && (!station || timestamp(exams.last.at) >= timestamp(station.at))) return examNext;
    return station ? ['#schulstoff/' + station.id + '/aufgabe-' + (station.nextTask + 1), station.title + ' fortsetzen']
      : ['#schulstoff', 'Schulstoff und Laufzettel öffnen'];
  }

  const familyActivities = {
    '#klassenarbeit': ['Skelett', 'Beschriftet gemeinsam drei Knochen am Bild.',
      'Welche Knochen schützen dein Gehirn, dein Herz und deine Lunge?',
      'Der Schädel schützt das Gehirn. Rippen, Brustbein und Brustwirbelsäule bilden den schützenden Brustkorb.'],
    '#schulstoff/gebiss': ['Gebiss', 'Vergleicht im Bild Fangzähne und Reißzähne. Lasst euch zeigen, wo sie liegen.',
      'Welche Zähne halten ein Stück Nahrung fest und welche schneiden es?',
      'Die Fangzähne halten es fest. Die scharfen Reißzähne gleiten wie Scherenklingen aneinander vorbei und schneiden.'],
    '#schulstoff/pfote': ['Pfote und Zehengang', 'Vergleicht die beiden Pfotenabdrücke und beschreibt ein sichtbares Merkmal.',
      'Welcher Teil des Hinterfußes bleibt beim Gehen über dem Boden?',
      'Die Ferse bleibt beim Zehengang über dem Boden. Zehen und Ballen setzen auf.'],
    '#schulstoff/wolf': ['Herkunft und Zucht', 'Lest den Abschnitt über Wolf und Hund. Wählt danach einen Begriff aus der Zuordnung.',
      'Was ist der Unterschied zwischen Zucht und Training?',
      'Bei der Zucht werden Elterntiere mit gewünschten erblichen Merkmalen ausgewählt. Beim Training lernt ein einzelnes Tier.'],
    '#schulstoff/sinne': ['Geruchssinn', 'Verfolgt den Weg vom Duftstoff bis zum Gehirn. Erklärt danach die Aufgabe eines Suchhundes.',
      'Was tun die Riechzellen, wenn sie auf einen Duftstoff reagieren?',
      'Sie leiten Signale an das Gehirn weiter. Dort werden die Signale verarbeitet.'],
    '#schulstoff/katze': ['Körperbau und Sinne der Katze', 'Wählt ein Merkmal der Katze aus und beschreibt, wobei es ihr hilft.',
      'Warum macht eine Katze ihre Pupillen bei schwachem Licht weiter?',
      'Durch die größere Öffnung gelangt mehr von dem vorhandenen Licht ins Auge.'],
    '#koerpersprache': ['Körpersprache', 'Wählt eine Szene und beschreibt zwei sichtbare Signale. Sprecht dann über die Situation.',
      'Warum reicht Wedeln allein bei einem Hund kaum für eine sichere Deutung?',
      'Auch ein angespannter Hund kann wedeln. Steife Haltung und Knurren können zusammen Warnzeichen sein.'],
    '#schulstoff/bewegung': ['Skelett und Bewegung', 'Beugt und streckt den Unterarm. Schaut euch danach die Zeichnung zu den Gegenspielern an.',
      'Welcher Muskel hilft beim Beugen und welcher beim aktiven Strecken des Ellenbogens?',
      'Der Bizeps hilft beim Beugen. Der Trizeps hilft beim aktiven Strecken.'],
    '#schulstoff/haustier': ['Hunderassen vergleichen', 'Verändert ein Gewicht in der Tabelle und schaut auf die Punktesummen.',
      'Wie berechnest du den Wert eines Merkmals?',
      'Multipliziere die Punkte des Hundes für dieses Merkmal mit dessen Gewicht.'],
  };

  function familyToday({exams, stations}, guided) {
    const practiced = guided?.practice;
    const independent = practiced?.total > 0 && practiced.independent === practiced.total;
    const practicedRoute = guided?.track === 'tiere' ? '#schulstoff/gebiss' : '#klassenarbeit';
    const nextGuidedRoute = guided?.track === 'tiere' ? '#schulstoff/pfote' : '#schulstoff/bewegung';
    const revisited = independent && timestamp(practiced.at) >= timestamp(exams.last?.at);
    const [recommendation] = recommendations(exams).practice.filter(([,href]) =>
      !revisited || href !== practicedRoute);
    const station = stations.filter(item => item.started && item.done < item.total)
      .filter(item => !revisited || '#schulstoff/' + item.id !== practicedRoute)
      .sort((a,b) => timestamp(b.at) - timestamp(a.at))[0];
    const stationRoute = station ? '#schulstoff/' + station.id : '';
    const suggested = recommendation?.[1] || stationRoute ||
      (revisited ? nextGuidedRoute : guided ? practicedRoute : '');
    const href = Object.hasOwn(familyActivities, suggested) ? suggested : '#klassenarbeit';
    const [title, plan, question, answer] = familyActivities[href];
    const reason = recommendation && href === suggested
      ? 'In der letzten Probearbeit ist zu diesem Thema noch etwas offen.'
      : station && href === stationRoute ? 'Diese Station wurde bereits begonnen.'
        : revisited ? 'Hier könnt ihr nach der Beschriftungsrunde weiterüben.'
          : guided ? 'Diese Übung passt zum ausgewählten Lernweg.'
            : 'Ein kurzer Einstieg, den ihr gemeinsam ausprobieren könnt.';
    const action = href === stationRoute ? href + '/aufgabe-' + (station.nextTask + 1) : href;
    return `<section class="bl-today" aria-labelledby="bl-today-title">
      <h4 id="bl-today-title">Was üben wir heute?</h4>
      ${guided ? `<p>Lernweg „${guided.title}“ · ${guided.done} von 3 Schritten erledigt</p>` : ''}
      ${revisited ? '<p>Die letzte Beschriftungsrunde in diesem Lernweg gelang beim ersten Versuch ohne Tipp.</p>' : ''}
      <p><strong>Ca. 10 Minuten · ${title}</strong></p><p>${reason} ${plan}</p>
      <p><strong>Frage für zu Hause</strong> ${question}</p>
      <details><summary>Antwort zum Vergleichen</summary><p>${answer}</p></details>
      <p><a href="${action}">Passende Übung öffnen →</a></p>
      ${exams.followupDue ? '<p><a href="#probetest">Der kurze Lerncheck ist bereit →</a></p>' : ''}
    </section>`;
  }

  function renderComparison(profiles) {
    const topics = new Map();
    profiles.forEach(({report}) => report?.topics.forEach(({id,title,score,max}) => {
      const topic = topics.get(id) ?? {title, assessed:0, open:0};
      topic.assessed++;
      topic.open += Number(score < max);
      topics.set(id, topic);
    }));
    const rows = [...topics.values()].sort((a,b) => b.open - a.open || a.title.localeCompare(b.title, 'de'));
    return `<section class="bl-progress bl-comparison" aria-labelledby="bl-comparison-title">
      <h3 id="bl-comparison-title">Lernprofile im Vergleich</h3>
      <p>${profiles.length} ${profiles.length === 1 ? 'lokales Profil' : 'lokale Profile'} in diesem Browser.
        Die Übersicht verwendet die jeweils letzte abgegebene Online-Probearbeit. Die Fassungen prüfen teils unterschiedliche Themen.</p>
      ${rows.length ? `<div class="bl-comparison-scroll" tabindex="0" role="region" aria-label="Themenübersicht">
        <table><thead><tr><th scope="col">Thema</th><th scope="col">Profile mit offenen Punkten</th>
          <th scope="col">Profile mit Ergebnis zum Thema</th></tr></thead><tbody>${rows.map(topic =>
            `<tr><th scope="row">${escape(topic.title)}</th><td>${topic.open}</td><td>${topic.assessed}</td></tr>`).join('')}</tbody></table>
        </div>` : '<p>Der Themenvergleich füllt sich mit abgegebenen Probearbeiten.</p>'}
      <ul class="bl-profile-results">${profiles.map(({name, active, report}) => {
        const open = report?.topics.filter(topic => topic.score < topic.max).map(topic => topic.title) ?? [];
        return `<li><strong>${escape(name)}${active ? ' · aktives Profil' : ''}</strong>
          ${report ? `<p>Letzte Abgabe ${formatDate(report.at)}</p>
            <p>${open.length ? 'Noch offene Punkte bei ' + escape(open.join(', ')) : 'Alle automatisch prüfbaren Punkte erreicht.'}</p>
            <p>${report.explanations.length ? 'Erklärungen gemeinsam ansehen bei ' + escape(report.explanations.join(', '))
              : 'Beide Erklärungen wurden mit allen Kriterien selbst verglichen.'}</p>
            ${active ? `<a href="${report.url}">Auswertung öffnen</a>` : ''}` : '<p>Probearbeit noch offen oder bisher keine Abgabe.</p>'}
          </li>`;
      }).join('')}</ul>
      <button type="button" data-lc="profiles">Profile verwalten</button>
    </section>`;
  }

  function render(view, guided) {
    const data = read();
    const {exams, stations} = data;
    const rows = [
      ...(exams.entries || []).map(exam => ({kind:'probetest', at:exam.at, url:exam.url,
        label:'Probearbeit ' + (exam.version+1) + ' · Versuch ' + exam.number,
        result:exam.score + ' von ' + exam.max + ' Punkten automatisch geprüft · ' +
          exam.compared + ' von ' + exam.writingCount + ' Erklärtexten selbst verglichen'})),
      ...stations.filter(s => s.started).map(s => ({kind:s.id, at:s.at, url:'#schulstoff/' + s.id, label:s.title,
        result:s.done + ' von ' + s.total + ' Aufgaben bearbeitet' + (s.rating ? ' · ' + s.rating : '')})),
      ...(exams.checkResult ? [{kind:'lerncheck', at:exams.checkResult.at, url:'#probetest',
        label:'Lerncheck am Folgetag', result:exams.checkResult.right + ' von ' + exams.checkResult.total +
          ' richtig' + (exams.checkResult.topics.length ? ' · ' + exams.checkResult.topics.join(', ') : '')}] : []),
      ...(exams.observations ? [{kind:'koerpersprache', url:'#koerpersprache', at:exams.observationAt,
        label:'Körpersprache', result:exams.observations + ' von ' + exams.observationTotal + ' Szenen geprüft · ' +
          exams.observationRight + ' passende Deutungen'}] : []),
    ].sort((a,b) => timestamp(b.at)-timestamp(a.at));
    const [url,label] = next(data);
    const {retained, practice} = recommendations(exams);
    const strong = [...new Set([...(exams.last?.strong || []), ...retained])];
    const family = view === 'familie';
    const filter = view === 'lehrkraft' && rows.length ? '<label>Thema oder Aufgabentyp filtern <select data-bl-progress-filter>' +
      '<option value="">Alle Einträge</option>' + [...new Map(rows.map(r => [r.kind,r.kind==='probetest'?'Probearbeiten':r.label]))].map(([kind,name]) =>
        '<option value="' + kind + '">' + escape(name) + '</option>').join('') + '</select></label><p data-bl-filter-status role="status">' +
        rows.length + (rows.length === 1 ? ' Eintrag' : ' Einträge') + '</p>' : '';
    return '<section class="bl-progress" aria-label="Lernstand aus Stationen und Probearbeiten"><h3>' +
      (family ? 'Lernübersicht für zu Hause' : 'Stationen, Bildaufgaben und Probearbeiten') +
      '</h3><p>Die Übersicht zeigt Bearbeitungen im aktiven Profil auf diesem Gerät. Freie Erklärungen werden im Selbstvergleich geprüft.</p>' +
      (family ? familyToday(data, guided) : '') +
      (family ? '<h4>Das klappt schon</h4><p>' + (strong.length ? escape(strong.join(', ')) :
        rows.length ? 'Schaut euch gemeinsam eine bearbeitete Aufgabe an.' : 'Sobald Aufgaben bearbeitet sind, erscheinen sie hier.') +
        '</p>' + (practice.length ? '<h4>Übungshinweise aus der letzten Probearbeit</h4><p>' + escape(practice.map(([topic]) => topic).join(', ')) + '</p>' : '') : '') +
      '<p><a href="' + url + '">' + escape(label) + ' →</a></p>' + filter +
      (rows.length ? '<h4>' + (family?'Zuletzt bearbeitet':'Bearbeitete Inhalte') + '</h4><ul>' + rows.map(r =>
        '<li data-bl-result-topic="' + r.kind + '"><a href="' + r.url + '">' + escape(r.label) + '</a> · ' +
        formatDate(r.at) + '<br>' + escape(r.result) + '</li>').join('') + '</ul>'
        : exams.draft ? '<p>Ein Entwurf ist gespeichert. Ergebnisse erscheinen nach der Abgabe.</p>'
          : '<p>Noch keine Stations- oder Probearbeitsergebnisse gespeichert.</p>') +
      (family ? '<p><a href="#lehrkraft">Stationsübersicht und Druckmaterial</a></p>' : '') + '</section>';
  }

  window.BioLaborLernstand = {render, renderComparison, resumeLink:() => next(read())[0]};
})();
