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
  const symbols = {"03": "data:image/png;base64,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", "05": "data:image/png;base64,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", "07": "data:image/png;base64,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", "09": "data:image/png;base64,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"};
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
        picture.src = symbols[field.image[0]];
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
