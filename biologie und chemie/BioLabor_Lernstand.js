(() => {
  'use strict';

  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
  })[c]);
  const timestamp = value => Date.parse(value) || 0;
  const formatDate = value => timestamp(value)
    ? new Intl.DateTimeFormat('de-DE', {dateStyle:'medium'}).format(new Date(value)) : 'Datum nicht gespeichert';
  const read = () => ({exams:window.BioLaborProbetest?.progress() || {}, stations:window.BioLaborSchulstoff?.progress() || []});
  function next({exams, stations}) {
    if (exams.draft) return ['#probetest/arbeit', 'Offene Arbeit fortsetzen'];
    if (exams.followupDue) return ['#probetest', 'Kurzen Lerncheck starten'];
    const station = stations.filter(s => s.started && s.done < s.total).sort((a,b) => timestamp(b.at)-timestamp(a.at))[0];
    if (exams.last?.next && (!station || timestamp(exams.last.at) >= timestamp(station.at))) return exams.last.next;
    return station ? ['#schulstoff/' + station.id, station.title + ' fortsetzen']
      : ['#schulstoff', 'Schulstoff und Laufzettel öffnen'];
  }

  function render(view) {
    const data = read();
    const {exams, stations} = data;
    const rows = [
      ...(exams.entries || []).map(exam => ({kind:'probetest', at:exam.at, url:exam.url,
        label:'Probearbeit ' + (exam.version+1),
        result:exam.score + ' von ' + exam.max + ' Punkten automatisch geprüft · ' +
          exam.compared + ' von ' + exam.writingCount + ' Erklärtexten selbst verglichen'})),
      ...stations.filter(s => s.started).map(s => ({kind:s.id, at:s.at, url:'#schulstoff/' + s.id, label:s.title,
        result:s.done + ' von ' + s.total + ' Aufgaben bearbeitet' + (s.rating ? ' · ' + s.rating : '')})),
      ...(exams.checkResult ? [{kind:'lerncheck', at:exams.checkResult.at, url:'#probetest',
        label:'Lerncheck am Folgetag', result:exams.checkResult.right + ' von ' + exams.checkResult.total +
          ' richtig' + (exams.checkResult.topics.length ? ' · ' + exams.checkResult.topics.join(', ') : '')}] : []),
      ...(exams.observations ? [{kind:'koerpersprache', url:'#koerpersprache', at:exams.observationAt,
        label:'Körpersprache', result:exams.observations + ' von 4 Szenen bearbeitet'}] : []),
    ].sort((a,b) => timestamp(b.at)-timestamp(a.at));
    const [url,label] = next(data);
    const strong = [...new Set([...(exams.last?.strong || []), ...(exams.checkResult?.topics || [])])];
    const practice = exams.last?.topics || [];
    const family = view === 'familie';
    const filter = view === 'lehrkraft' && rows.length ? '<label>Thema oder Aufgabentyp filtern <select data-bl-progress-filter>' +
      '<option value="">Alle Einträge</option>' + [...new Map(rows.map(r => [r.kind,r.kind==='probetest'?'Probearbeiten':r.label]))].map(([kind,name]) =>
        '<option value="' + kind + '">' + escape(name) + '</option>').join('') + '</select></label><p data-bl-filter-status role="status">' +
        rows.length + ' Einträge</p>' : '';
    return '<section class="bl-progress" aria-label="Lernstand aus Stationen und Probearbeiten"><h3>' +
      (family ? 'Lernübersicht für zu Hause' : 'Stationen, Bildaufgaben und Probearbeiten') +
      '</h3><p>Die Übersicht zeigt Bearbeitungen im aktiven Profil auf diesem Gerät. Freie Erklärungen werden im Selbstvergleich geprüft.</p>' +
      (family ? '<h4>Das klappt schon</h4><p>' + (strong.length ? escape(strong.join(', ')) :
        rows.length ? 'Schaut euch gemeinsam eine bearbeitete Aufgabe an.' : 'Sobald Aufgaben bearbeitet sind, erscheinen sie hier.') +
        '</p><h4>Das üben wir als Nächstes</h4>' + (practice.length ? '<p>' + escape(practice.join(', ')) + '</p>' : '') : '') +
      '<p><a href="' + url + '">' + escape(label) + ' →</a></p>' + filter +
      (rows.length ? '<h4>' + (family?'Zuletzt bearbeitet':'Bearbeitete Inhalte') + '</h4><ul>' + rows.map(r =>
        '<li data-bl-result-topic="' + r.kind + '"><a href="' + r.url + '">' + escape(r.label) + '</a> · ' +
        formatDate(r.at) + '<br>' + escape(r.result) + '</li>').join('') + '</ul>'
        : '<p>Noch keine Stations- oder Probearbeitsergebnisse gespeichert.</p>') +
      (family ? '<p><a href="#lehrkraft">Stationsübersicht und Druckmaterial</a></p>' : '') + '</section>';
  }

  window.BioLaborLernstand = {render, resumeLink:() => next(read())[0]};
})();
