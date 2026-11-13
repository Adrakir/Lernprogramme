(() => {
  'use strict';

  // Jede Zeile beschreibt einen eigenen Punkt. Gleichwertige Formulierungen zählen.
  const versions = [
    [
      ['Gebiss', 'Ein Hund packt ein zähes Stück Nahrung und schneidet es ab. Nenne für beide Vorgänge die passende Zahnart. Erkläre, wie das Zerschneiden funktioniert.', [
        'Die langen Eckzähne (Fangzähne) packen und halten das Stück.',
        'Die Reißzähne schneiden es ab.',
        'Beim Schließen gleiten die scharfen Kanten oben und unten wie Scherenklingen aneinander vorbei.',
      ]],
      ['Geruchssinn', 'Ein Rettungshund folgt dem Geruch einer vermissten Person. Erkläre, was die Riechschleimhaut, die Riechzellen und das Gehirn dabei leisten.', [
        'In der großen Riechschleimhaut befinden sich viele Riechzellen.',
        'Riechzellen reagieren auf Duftstoffe und senden Signale ans Gehirn.',
        'Das Gehirn verarbeitet die Signale. So kann der trainierte Hund den Geruch erkennen und der Spur folgen.',
      ]],
      ['Körpersprache', 'Ein Hund senkt locker den Vorderkörper und hält das Hinterteil hoch. Eine Katze legt die Ohren an und weicht zurück. Deute beide Signale und beschreibe, wie du auf die Katze reagierst.', [
        'Der Hund zeigt wahrscheinlich eine Spielaufforderung.',
        'Die Katze möchte wahrscheinlich Abstand oder fühlt sich unsicher.',
        'Ich lasse der Katze Abstand und halte den Rückzugsweg frei.',
      ]],
    ],
    [
      ['Gebiss', 'Auf einer Seite des Hundegebisses liegen oben 10 und unten 11 Zähne. Berechne die Gesamtzahl. Erkläre, warum du verdoppeln musst, und nenne eine Aufgabe der Schneidezähne.', [
        'Die Rechnung ergibt (10 + 11) × 2 = 42 Zähne.',
        'Die Angaben gelten für eine Seite. Der Hund hat eine linke und eine rechte Kieferhälfte.',
        'Schneidezähne können kleine Stücke abbeißen oder Fleischreste abschaben.',
      ]],
      ['Geruchssinn', 'Ein Spürhund findet einen zuvor eingeübten Geruch. Was ist an der Riechschleimhaut des Hundes im Vergleich zum Menschen anders? Wozu sind Riechzellen da? Was hat der Hund dafür gelernt?', [
        'Die Riechschleimhaut des Hundes hat eine größere Fläche.',
        'Riechzellen reagieren auf Duftstoffe und leiten Signale weiter.',
        'Der Hund hat gelernt, einen bestimmten Geruch zu suchen und anzuzeigen.',
      ]],
      ['Körpersprache', 'Ein Hund steht steif, zeigt die Zähne und knurrt. Beschreibe zwei Signale, deute die Situation und erkläre, wie du dich verhältst.', [
        'Zwei Beobachtungen werden genannt, etwa steifer Körper, sichtbare Zähne oder Knurren.',
        'Die Zeichen zusammen deuten darauf hin, dass der Hund warnt und Abstand möchte.',
        'Ich halte Abstand, bedränge den Hund nicht und lasse ihm einen freien Rückzugsweg.',
      ]],
    ],
    [
      ['Gebiss', 'Vergleiche Katze und Mensch. Nenne einen auffälligen Zahn der Katze und seine Aufgabe. Erkläre, wozu Menschen die breiten Kauflächen ihrer hinteren Backenzähne nutzen.', [
        'Ein passender Zahn wird genannt, etwa Fangzahn (Eckzahn) oder Reißzahn.',
        'Die Aufgabe passt zur Zahnart. Der Fangzahn hält fest oder der Reißzahn zerschneidet Fleisch.',
        'Die breiten Kauflächen der menschlichen Backenzähne zermahlen oder zerdrücken unterschiedliche Nahrung.',
      ]],
      ['Geruchssinn', 'Ein Hund schnuppert an einer Wegkreuzung und folgt dann einer Spur. Erkläre, wie Duftstoffe zu einem Signal für das Gehirn werden. Nenne einen Vorteil der großen Riechschleimhaut.', [
        'Mit der eingeatmeten Luft gelangen Duftstoffe zur Riechschleimhaut.',
        'Riechzellen reagieren darauf und leiten Signale an das Gehirn weiter.',
        'Die größere Fläche bietet Platz für viele Riechzellen. Das hilft, Gerüche aufzunehmen und Spuren zu unterscheiden.',
      ]],
      ['Körpersprache', 'Eine Katze duckt sich vor einem Spielzeug, fixiert es und schleicht darauf zu. Eine andere duckt sich bei einem lauten Geräusch, legt die Ohren an und weicht zurück. Deute beide Situationen. Warum reicht Ducken allein zur Beurteilung nicht aus?', [
        'Die erste Katze zeigt wahrscheinlich Spiel- oder Jagdverhalten. Sie nähert sich einem Ziel.',
        'Die zweite Katze wirkt ängstlich oder unsicher und versucht, Abstand zu gewinnen.',
        'Dieselbe Körperhaltung kann Verschiedenes bedeuten. Weitere Merkmale und die Situation helfen bei der Deutung.',
      ]],
    ],
  ];

  function schoolExam(version, first, solved) {
    const tasks = versions[version];
    const points = tasks.reduce((sum, [, , criteria]) => sum + criteria.length, 0);
    return `<section class="panel printpage bs-exam-sheet${solved ? ' solutions-sheet' : ''}">
      <div class="printlogo">BioLabor 5 · Biologie · Klasse 5</div>
      <h2>${solved ? 'Lösungen zur Übungsklassenarbeit' : 'Übungsklassenarbeit'} ${version + 1} · Teil C</h2>
      <p>${solved ? 'Erwartungshorizont. Jede erfüllte Zeile zählt 1 Punkt. Gleichwertige Formulierungen zählen.'
        : 'Gebiss, Geruchssinn und Körpersprache. Antworte in eigenen Worten.'}</p>
      ${tasks.map(([title, prompt, criteria], index) => `<div class="printcard bs-exam-task">
        <h3>${first + index}. ${title}<span>${criteria.length} Punkte</span></h3>
        ${solved ? `<ol>${criteria.map(criterion => `<li>${criterion}</li>`).join('')}</ol>`
          : `<p>${prompt}</p><div class="bs-exam-lines" aria-hidden="true"><span></span><span></span><span></span><span></span></div>`}
      </div>`).join('')}
      <p class="bs-exam-total">Teil C: ${solved ? '' : '______ / '}${points} Punkte</p>
    </section>`;
  }

  window.BioLaborPruefung = {
    schoolExam,
    points: version => versions[version].reduce((sum, [, , criteria]) => sum + criteria.length, 0),
  };
})();
