(() => {
  'use strict';

  const form = document.getElementById('cpForm');
  const questions = document.getElementById('cpQuestions');
  const status = document.getElementById('cpStatus');
  const submit = document.getElementById('cpSubmit');
  const reset = document.getElementById('cpReset');
  const result = document.getElementById('cpResult');
  const choice = (label, correct, options, image) => ({label, correct, options, image});
  const number = (label, correct, unit) => ({label, correct, unit});
  const writing = (label, model, ...criteria) => ({label, model, criteria});

  const devices = ['Becherglas', 'Holzzange (Reagenzglashalter)', 'Messzylinder', 'Reagenzglasständer', 'Reibschale mit Pistill', 'Tiegelzange'];
  const hazards = ['Brandfördernd', 'Entzündbar', 'Gewässergefährdend', 'Haut- oder augenreizend', 'Hautätzend', 'Unter Druck stehendes Gas'];
  const parts = ['Brennerrohr', 'Gasanschluss', 'Luftregler', 'Standfuß'];
  const fair = ['Beide Stäbe mit vergleichbaren Abmessungen', 'Die Stäbe an unterschiedlich warmen Orten lagern', 'Gleicher Abstand der Teelichter zur erwärmten Stelle', 'Nur einen Stab vorwärmen', 'Gleiche Ausgangstemperatur beider Stäbe', 'Vergleichbare Wärmezufuhr'];
  const fairConditions = new Set([fair[0], fair[2], fair[4], fair[5]]);
  const words = ['Auswertung', 'Bodensatz', 'Fragestellung', 'Gasschlauch', 'Glasstab', 'Schutzbrille', 'Thermometer', 'Verdunsten'];

  const tasks = [
    {
      title: 'Sicherheit',
      intro: 'Im Fachraum bemerkst du drei Situationen. Schreibe jeweils, was zu tun ist und warum.',
      fields: [
        writing('a) Eine unbekannte Flüssigkeit ist verschüttet.', 'Abstand halten, die Flüssigkeit nicht berühren und die Lehrkraft sofort informieren. Der Stoff könnte gefährlich sein.', 'Ich habe eine sichere Reaktion beschrieben.', 'Ich habe die Gefahr des unbekannten Stoffs erklärt.'),
        writing('b) Ein Gasbrenner brennt unbeaufsichtigt.', 'Die Lehrkraft sofort auf den Brenner hinweisen. Die Flamme kann einen Brand oder Verbrennungen verursachen.', 'Ich habe geschrieben, dass ich die Lehrkraft sofort informiere.', 'Ich habe Brand- oder Verbrennungsgefahr genannt.'),
        writing('c) Eine Schülerin möchte mit offenen langen Haaren am Brenner arbeiten.', 'Lange Haare vor dem Versuch zusammenbinden. Sie können Feuer fangen.', 'Ich habe das Zusammenbinden der Haare vor dem Versuch genannt.', 'Ich habe erklärt, dass offene Haare Feuer fangen können.')
      ]
    },
    {
      title: 'Gefahrstoffpiktogramme',
      intro: 'Wähle für jedes Piktogramm A bis D eine Gefahr aus, vor der es warnen kann.',
      fields: [
        choice('A', hazards[0], hazards, ['03', 'Flamme über einem Kreis']),
        choice('B', hazards[4], hazards, ['05', 'Flüssigkeit tropft auf eine Hand und ein Metallstück']),
        choice('C', hazards[3], hazards, ['07', 'Ausrufezeichen']),
        choice('D', hazards[2], hazards, ['09', 'Baum und Fisch'])
      ]
    },
    {
      title: 'Laborgeräte',
      intro: 'Wähle für jede Tätigkeit ein passendes Gerät.',
      fields: [
        choice('a) 35 mL Wasser abmessen.', devices[2], devices),
        choice('b) Einen Feststoff zerreiben.', devices[4], devices),
        choice('c) Mehrere Reagenzgläser sicher abstellen.', devices[3], devices),
        choice('d) Einen heißen Tiegel greifen.', devices[5], devices),
        choice('e) Ein Reagenzglas beim Erhitzen festhalten.', devices[1], devices)
      ]
    },
    {
      title: 'Gasbrenner',
      intro: 'Benenne die markierten Bauteile und beantworte die Fragen zur Brennerflamme.',
      burner: true,
      fields: [
        choice('a) Bauteil A', parts[0], parts),
        choice('a) Bauteil B', parts[2], parts),
        choice('b) Welche Flamme verwendest du zum Erhitzen?', 'Blaue, nicht leuchtende Heizflamme', ['Gelbe, leuchtende Flamme', 'Blaue, nicht leuchtende Heizflamme']),
        choice('c) Wo liegt im Schulmodell ihre heißeste Zone?', 'Knapp über der Spitze des inneren Flammenkegels', ['Ganz unten am Brennerrohr', 'In der Mitte des inneren Flammenkegels', 'Knapp über der Spitze des inneren Flammenkegels'])
      ]
    },
    {
      title: 'Wärmeleitung',
      intro: 'Beim fairen Vergleich von Metallstab und Glasstab bleiben die Teelichter unangezündet. Das Wachs ist anfangs fest. Auf dem Metallstab schmilzt es zuerst.',
      fields: [
        writing('a) Erkläre die Beobachtung.', 'Metall leitet Wärme besser als Glas. Dadurch wird das Wachs am Metallstab früher bis zum Schmelzen erwärmt.', 'Ich habe die bessere Wärmeleitung des Metalls mit dem früheren Schmelzen verknüpft.'),
        {...choice('b) Erste Bedingung für einen fairen Vergleich', null, fair), fair: true},
        {...choice('b) Zweite, andere Bedingung für einen fairen Vergleich', null, fair), fair: true}
      ]
    },
    {
      title: 'Siedepunkt',
      intro: 'Gehe von reinen Stoffen und normalem Luftdruck aus.',
      fields: [
        number('a) Ungefährer Siedepunkt von Wasser', 100, '°C'),
        number('a) Ungefährer Siedepunkt von Ethanol', 78, '°C'),
        writing('b) Warum bleibt die Temperatur von reinem Wasser beim Sieden trotz weiterer Energiezufuhr gleich, solange flüssiges Wasser vorhanden ist und der Druck gleich bleibt?', 'Die zugeführte Energie wird für den Übergang von flüssigem Wasser zu Wasserdampf gebraucht.', 'Ich habe erklärt, dass die Energie für den Übergang von flüssigem Wasser zu Wasserdampf gebraucht wird.')
      ]
    },
    {
      title: 'Löslichkeit',
      intro: 'Bei 20 °C lösen sich in 200 g Wasser höchstens rund 72 g Kochsalz. Du gibst 80 g hinzu, rührst und wartest bei gleichbleibenden 20 °C.',
      fields: [
        number('a) Wie viel Salz ist schließlich gelöst?', 72, 'g'),
        number('b) Wie viel Salz bleibt fest?', 8, 'g'),
        choice('c) Wie nennt man die Lösung über dem festen Salz?', 'Gesättigte Kochsalzlösung', ['Ungesättigte Kochsalzlösung', 'Gesättigte Kochsalzlösung', 'Reines Wasser'])
      ]
    },
    {
      title: 'Versuchsprotokoll',
      intro: 'Schreibe zum Teelichtversuch aus Aufgabe 5 je einen Satz.',
      fields: [
        writing('a) Durchführung – Was wurde gemacht?', 'Wir stellten unangezündete Teelichter in gleichem Abstand zur erwärmten Stelle auf und erwärmten je ein Ende der Stäbe vergleichbar.', 'Ich habe beschrieben, was wir mit den Stäben und Teelichtern gemacht haben.'),
        writing('b) Beobachtung – Was war zu sehen?', 'Das Wachs auf dem Metallstab schmolz zuerst.', 'Ich habe die Beobachtung beschrieben.'),
        writing('c) Auswertung – Was bedeutet die Beobachtung für den Materialvergleich?', 'Der Metallstab leitete Wärme in diesem Vergleich besser als der Glasstab.', 'Ich habe die Beobachtung genutzt, um die Wärmeleitung der Materialien zu vergleichen.')
      ]
    },
    {
      title: 'Lückentext',
      intro: 'Wähle für jede Lücke ein Wort aus der Wortbank. Verwende jedes Wort höchstens einmal. Zwei Wörter bleiben übrig.',
      bank: words,
      fields: [
        choice('a) Eine ___ schützt die Augen vor Spritzern.', words[5], words),
        choice('b) Die flexible Verbindung zwischen Gasversorgung und Brenner heißt ___.', words[3], words),
        choice('c) Mit einem ___ misst du die Temperatur.', words[6], words),
        choice('d) Beim ___ geht Wasser an der Oberfläche in den gasförmigen Zustand über. Das geschieht auch unterhalb des Siedepunkts.', words[7], words),
        choice('e) Bleibt beim Lösen festes Salz am Gefäßboden zurück, nennt man diese Ablagerung ___.', words[1], words),
        choice('f) Im Protokoll gibt die ___ an, was du mit dem Versuch herausfinden möchtest.', words[2], words)
      ]
    }
  ];

  const create = (tag, text, parent) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    parent.append(element);
    return element;
  };

  const entries = [];
  tasks.forEach((task, index) => {
    const card = create('section', '', questions);
    card.className = 'panel cp-task';
    const points = task.fields.reduce((total, field) => total + (field.criteria?.length || 1), 0);
    const heading = create('h3', `${index + 1}. ${task.title} · ${points} P.`, card);
    heading.id = `cpTask${index + 1}`;
    card.setAttribute('aria-labelledby', heading.id);
    create('p', task.intro, card);
    if (task.bank) {
      create('p', `Wortbank · ${task.bank.join(' · ')}`, card).className = 'cp-bank';
    }
    if (task.burner) {
      card.append(document.getElementById('cpBurner').content.cloneNode(true));
    }
    const fields = create('div', '', card);
    if (index === 1) fields.className = 'cp-symbols';
    for (const field of task.fields) {
      const group = create('div', '', fields);
      group.className = 'cp-field';
      const id = `cpAnswer${entries.length + 1}`;
      if (field.image) {
        const picture = create('img', '', group);
        picture.src = `probearbeit-ghs${field.image[0]}.png`;
        picture.alt = field.image[1];
        picture.id = `${id}Image`;
        picture.width = 64;
        picture.height = 64;
      }
      const label = create('label', field.unit ? `${field.label} (${field.unit})` : field.label, group);
      label.htmlFor = id;
      let input;
      if (field.options) {
        input = create('select', '', group);
        create('option', 'Bitte auswählen', input).value = '';
        for (const option of field.options) create('option', option, input).value = option;
      } else if (field.criteria) {
        input = create('textarea', '', group);
        input.rows = 2;
      } else {
        input = create('input', '', group);
        input.type = 'text';
        input.inputMode = 'decimal';
        input.className = 'cp-number';
      }
      input.id = id;
      if (field.image) input.setAttribute('aria-describedby', `${id}Image`);
      const feedback = create('div', '', group);
      feedback.hidden = true;
      feedback.className = 'cp-feedback';
      entries.push({field, input, feedback});
    }
  });

  const valueOf = input => input.value.trim();
  const automaticMax = entries.filter(({field}) => !field.criteria).length;
  const manualMax = entries.reduce((total, {field}) => total + (field.criteria?.length || 0), 0);
  let automaticScore = 0;

  function updateProgress() {
    const count = entries.filter(({input}) => valueOf(input)).length;
    status.textContent = `${count} von ${entries.length} Antwortfeldern ausgefüllt`;
  }

  function updateResult() {
    const checks = [...form.querySelectorAll('.cp-check input:not(:disabled)')];
    const score = checks.filter(input => input.checked).length;
    result.textContent = `Automatisch: ${automaticScore}/${automaticMax} · Selbstbewertung: ${score}/${manualMax} · Zusammen: ${automaticScore + score}/${automaticMax + manualMax} Punkte.`;
  }

  function showFeedback() {
    const creditedConditions = new Set();
    automaticScore = 0;
    for (const {field, input, feedback} of entries) {
      const answer = valueOf(input);
      input.disabled = true;
      feedback.hidden = false;
      if (field.criteria) {
        create('p', `Musterlösung · ${field.model}`, feedback);
        for (const criterion of field.criteria) {
          const label = create('label', '', feedback);
          label.className = 'cp-check';
          const check = create('input', '', label);
          check.type = 'checkbox';
          check.disabled = !answer;
          check.addEventListener('change', updateResult);
          label.append(document.createTextNode(` ${criterion} (1 P.)`));
        }
        continue;
      }

      let correct;
      let solution = field.correct;
      if (field.fair) {
        correct = fairConditions.has(answer) && !creditedConditions.has(answer);
        if (correct) creditedConditions.add(answer);
        solution = [...fairConditions].join(' · ');
      } else if (field.unit) {
        const parsed = Number(answer.replace(',', '.'));
        const tolerance = field.correct === 78 ? 0.5 : 0;
        correct = Boolean(answer) && Number.isFinite(parsed) && Math.abs(parsed - field.correct) <= tolerance;
        solution = `${field.correct} ${field.unit}`;
      } else {
        correct = answer === field.correct;
      }
      if (correct) automaticScore++;
      const verdict = correct ? 'Richtig · 1 P.' : answer ? '0 P.' : 'Keine Antwort · 0 P.';
      create('p', `${verdict} ${field.fair ? 'Mögliche Bedingungen:' : 'Lösung:'} ${solution}`, feedback);
    }
    updateResult();
  }

  form.addEventListener('input', updateProgress);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (submit.hidden) return;
    if (entries.some(({input}) => !valueOf(input)) &&
        !window.confirm('Einige Antwortfelder sind leer. Möchtest du trotzdem abgeben?')) return;
    showFeedback();
    submit.hidden = true;
    reset.hidden = false;
    document.getElementById('cpReview').hidden = false;
    result.focus();
    result.scrollIntoView({block: 'center'});
  });

  reset.addEventListener('click', () => {
    if (!window.confirm('Möchtest du alle Antworten löschen und neu beginnen?')) return;
    for (const {input, feedback} of entries) {
      input.value = '';
      input.disabled = false;
      feedback.hidden = true;
      feedback.replaceChildren();
    }
    submit.hidden = false;
    reset.hidden = true;
    document.getElementById('cpReview').hidden = true;
    result.textContent = '';
    updateProgress();
    document.getElementById('cpTitle').focus();
    document.getElementById('cpTitle').scrollIntoView({block: 'start'});
  });

  updateProgress();
  const openDirect = () => {
    if (location.hash === '#probearbeit') navigate('probearbeit');
  };
  window.addEventListener('hashchange', openDirect);
  openDirect();
})();
