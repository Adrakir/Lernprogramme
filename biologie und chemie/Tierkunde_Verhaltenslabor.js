/* BioLabor 5: Körpersprache bei Hund und Katze im selben Kontext beobachten. */
(() => {
  'use strict';

  const SCENES = {
    greet: {
      label: 'Freudige Begrüßung',
      context: 'Eine vertraute Person kommt nach Hause. Das Tier nähert sich freiwillig.',
      dog: ['Locker', 'Weicher Körper, das Tier kommt in einem lockeren Gang näher.', 'Oft weite, lockere Bewegungen.'],
      cat: ['Nach vorn oder locker seitlich', 'Lockere Schritte. Die Katze kann sich an einem vertrauten Menschen reiben.', 'Häufig aufgerichtet, die Spitze kann gebogen sein.'],
      question: 'Was spricht in dieser Situation für eine freundliche Begrüßung?',
      choices: ['Das Tier kommt freiwillig näher und bewegt sich locker.', 'Der Hund wedelt. Der Rest der Haltung ist egal.', 'Die Katze hat vier Pfoten am Boden.'],
      explanation: 'Entscheidend ist das Zusammenspiel aus vertrauter Situation, freiwilliger Annäherung und lockerer Haltung.',
    },
    relax: {
      label: 'Entspannt',
      context: 'Das Tier steht in seiner vertrauten Umgebung und kann sich frei bewegen.',
      dog: ['Locker, in natürlicher Stellung', 'Das Gewicht verteilt sich auf die Beine, der Körper wirkt weich.', 'Locker in seiner natürlichen Haltung.'],
      cat: ['Locker, in natürlicher Stellung', 'Die Katze steht oder bewegt sich ohne sichtbare Anspannung.', 'Locker getragen, ohne heftiges Schlagen.'],
      question: 'Welche Beobachtungen passen zusammen?',
      choices: ['Lockere Haltung und freie Bewegung in vertrauter Umgebung.', 'Steifer Körper und deutliches Zurückweichen.', 'Fauchen und ein hoch aufgewölbter Rücken.'],
      explanation: 'Bei Entspannung wirken Bewegungen und Körperhaltung locker. Wie Ohren und Schwanz dabei stehen, hängt auch vom Tier ab.',
    },
    fear: {
      label: 'Angst',
      context: 'Ein plötzliches Geräusch erschreckt das Tier. Es versucht, sich kleiner zu machen.',
      dog: ['Nach hinten gelegt', 'Kopf und Körper sind gesenkt. Der Hund kann zurückweichen.', 'Tief, manchmal zwischen die Hinterbeine gezogen.'],
      cat: ['Seitlich oder nach hinten abgeflacht', 'Die Katze duckt sich und sucht möglicherweise ein Versteck.', 'Tief, oft dicht am Körper.'],
      question: 'Wie hilfst du einem Tier, das sich vor dem Geräusch fürchtet?',
      choices: ['Lass ihm Abstand und halte den Rückzugsweg frei.', 'Geh gleich näher heran und halte es fest.', 'Versperre den Weg, damit du es besser beobachten kannst.'],
      explanation: 'Mit Abstand und einem freien Rückzugsweg kann sich das Tier selbst in Sicherheit bringen.',
    },
    threat: {
      label: 'Drohen',
      context: 'Jemand kommt näher. Das Tier ist angespannt und warnt, zum Beispiel durch Knurren oder Fauchen.',
      dog: ['Je nach Situation nach vorn oder zurück', 'Der Körper kann steif sein. Manche Hunde zeigen die Zähne.', 'Oft steif oder mit kurzen, angespannten Bewegungen.'],
      cat: ['Häufig seitlich oder flach nach hinten', 'Die Katze kann den Rücken aufwölben, ihr Fell sträuben und fauchen.', 'Kann gesträubt wirken.'],
      question: 'Wozu kann ein Warnsignal dienen?',
      choices: ['Es kann Abstand schaffen, bevor es zu einer Auseinandersetzung kommt.', 'Es lädt sicher zum Spielen ein.', 'Es zeigt, dass Anfassen das Tier sofort beruhigt.'],
      explanation: 'Knurren oder Fauchen sind Warnsignale. Ruhig Abstand lassen und das Tier nicht bedrängen.',
    },
    attack: {
      label: 'Abwehr',
      context: 'Das Tier wird in die Enge gedrängt. Es kann nach vorn ausweichen, schnappen oder mit der Pfote abwehren.',
      dog: ['Häufig zurückgezogen', 'Der Hund kann sich versteifen und kurz nach vorn schnellen.', 'Angespannt. Die genaue Haltung kann unterschiedlich sein.'],
      cat: ['Oft flach nach hinten', 'Die Katze kann mit einer angehobenen Vorderpfote abwehren.', 'Angespannt, manchmal gesträubt.'],
      question: 'Was tust du, wenn ein Tier sich abwehrt?',
      choices: ['Ruhig Distanz schaffen und einen Erwachsenen holen.', 'Die Hand näher heranhalten.', 'Zwischen das Tier und seinen Rückzugsweg treten.'],
      explanation: 'Mit Abstand sinkt der Druck auf das Tier. Lass einen Erwachsenen helfen, statt nach dem Tier zu greifen.',
    },
    flee: {
      label: 'Flucht',
      context: 'Das Tier bewegt sich rasch vom Auslöser weg und sucht einen sicheren Ort.',
      dog: ['Häufig nach hinten', 'Der Hund wendet sich ab und läuft weg.', 'Beim Weglaufen oft niedrig.'],
      cat: ['Häufig nach hinten', 'Die Katze flüchtet in Deckung, zum Beispiel unter ein Möbelstück.', 'Häufig tief oder dicht am Körper.'],
      question: 'Woran erkennst du Flucht in dieser Szene am besten?',
      choices: ['Das Tier bewegt sich vom Auslöser weg.', 'Das Tier hat Ohren.', 'Die Katze schaut kurz zur Seite.'],
      explanation: 'Bei Flucht ist die Bewegungsrichtung der wichtigste Hinweis in dieser Szene. Lass das Tier weglaufen.',
    },
    hunt: {
      label: 'Jagd',
      context: 'Ein kleines Tier bewegt sich. Hund und Katze richten ihre Aufmerksamkeit darauf.',
      dog: ['Aufmerksam zum Reiz gerichtet, je nach Ohrenform', 'Der Hund kann wittern, fixieren oder plötzlich hinterherlaufen.', 'Haltung und Bewegung hängen von der Jagdphase ab.'],
      cat: ['Zum Geräusch oder Ziel gerichtet', 'Die Katze kann mit niedrigem Körper anschleichen oder lauern.', 'Beim Lauern oft tief und mit wenig Bewegung.'],
      question: 'Was hilft, Anschleichen von Angst zu unterscheiden?',
      choices: ['Schau, wohin das Tier blickt und ob es sich einem Ziel nähert oder sich zurückzieht.', 'Eine tiefe Haltung bedeutet immer Angst.', 'Die Farbe des Fells zeigt die Absicht.'],
      explanation: 'Eine geduckte Haltung kann in beiden Situationen vorkommen. Ziel, Richtung und Umgebung geben weitere Hinweise.',
    },
    play: {
      label: 'Spiel',
      context: 'Das Tier hat einen vertrauten Spielpartner oder ein Spielzeug und kann jederzeit aufhören.',
      dog: ['Beweglich, Körper wirkt locker', 'Bei einer Spielverbeugung gehen Vorderkörper und Vorderbeine tief. Das Hinterteil bleibt höher.', 'Oft locker und lebhaft bewegt.'],
      cat: ['Beweglich und oft zum Spielzeug gerichtet', 'Die Katze kann eine Pfote anheben, lauern und ein Spielzeug anspringen.', 'Beweglich, je nach Spielphase unterschiedlich getragen.'],
      question: 'Welche Beobachtung passt zur Spielverbeugung des Hundes?',
      choices: ['Der Vorderkörper geht tief, das Hinterteil bleibt oben.', 'Der Hund versucht, sich hinter einem Möbelstück zu verstecken.', 'Der Hund steht steif, warnt und weicht zurück.'],
      explanation: 'Die Verbeugung kann eine Einladung zum Spiel sein. Auch hier gehören lockere Bewegungen und die Situation zum Gesamtbild.',
    },
  };

  const features = ['Ohren', 'Körper', 'Schwanz'];
  const animalNames = {dog: 'Hund', cat: 'Katze'};
  const answerOrder = Object.keys(SCENES);
  const animations = new Set(['greet', 'flee', 'play']);
  const state = {scene: 'greet', answer: null, markers: true, paused: false, large: false};

  function figure(animal, scene, markers = state.markers) {
    const cat = animal === 'cat';
    const low = ['fear', 'flee', 'hunt'].includes(scene);
    const warn = ['threat', 'attack'].includes(scene);
    const earsBack = ['fear', 'flee'].includes(scene) || warn;
    const bow = !cat && scene === 'play';
    const [headY, frontY, backY] = bow ? [151, 151, 111]
      : scene === 'fear' ? [149, 147, 145]
      : scene === 'hunt' ? [146, 145, 132]
      : scene === 'flee' ? [132, 140, 133]
      : scene === 'attack' ? [134, 140, 125]
      : [cat ? 108 : 102, 122, 122];
    const headX = low || bow || scene === 'attack' ? 122 : 142;
    const fill = cat ? '#7eb4ab' : '#cd965f';
    const dark = cat ? '#386d66' : '#805633';
    const light = cat ? '#c8e1d9' : '#edcda3';
    const arch = cat && scene === 'threat' ? 65 : Math.min(frontY, backY) - 18;
    const body = `M${headX + 24} ${headY + 13} Q188 ${frontY + 13} 222 ${frontY}
      Q267 ${arch} 331 ${backY - 6} Q369 ${backY - 6} 384 ${backY + 17}
      Q386 ${backY + 43} 353 ${backY + 49} Q305 ${frontY + 36} 265 ${frontY + 54}
      Q209 ${frontY + 65} 186 ${frontY + 32} L${headX + 9} ${headY + 29}Z`;
    const tails = {
      greet: cat ? `Q410 123 415 72Q420 43 442 52` : `Q415 134 453 94`,
      fear: cat ? `Q419 190 429 210` : `Q410 190 373 205`,
      threat: cat ? `Q407 121 411 83Q418 64 431 68` : `Q417 139 452 125`,
      attack: cat ? `Q411 164 451 183` : `Q411 153 442 148`,
      flee: `Q421 167 463 167`,
      hunt: `Q422 171 466 169`,
      play: cat ? `Q425 144 446 117` : `Q417 116 451 83`,
      relax: cat ? `Q416 145 427 186Q435 198 451 195` : `Q414 153 436 174`,
    };
    const tailStart = [377, backY + 20];
    const earPoint = cat ? [headX + (earsBack ? -19 : 20), headY - (earsBack ? 22 : 24)]
      : [headX + (earsBack ? 19 : 12), headY - (earsBack ? 12 : 6)];
    const ears = cat
      ? earsBack
        ? `M${headX - 12} ${headY - 14}l-17 -18l30 7m9 2l29 -9l-14 24`
        : `M${headX - 19} ${headY - 16}l3 -36l22 28l23 -20l-2 35`
      : earsBack
        ? `M${headX + 4} ${headY - 18}q23 -5 31 10q-5 12 -24 12Z`
        : `M${headX + 3} ${headY - 23}q20 -8 26 13q-3 28 -17 29q-10 -11 -9 -42Z`;
    const muzzle = cat
      ? `M${headX - 25} ${headY + 2}q-18 8 -5 23q24 15 46 2l7 -23Z`
      : `M${headX - 20} ${headY - 4}l-32 15q-7 10 3 20q18 12 54 0l9 -26Z`;
    const legFront = scene === 'flee' ? `M221 ${frontY + 40}l-31 34l-35 15`
      : cat && ['attack', 'play'].includes(scene) ? `M217 ${frontY + 44}l-24 29l-44 -14`
      : bow ? `M215 ${frontY + 44}l-41 24h-36`
      : low ? `M224 ${frontY + 37}l-18 38h-22` : `M222 ${frontY + 42}l-12 58h-23`;
    const legBack = scene === 'flee' ? `M354 ${backY + 37}l38 32l29 9`
      : low ? `M349 ${backY + 37}l21 25l-24 19h-16`
      : `M352 ${backY + 39}l15 27l-16 ${58 - 27 + 122 - backY}h-23`;
    const dot = (i, x, y, tx, ty) => `<g class="behavior-marker"><line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}"/>
      <circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 5}">${i}</text></g>`;
    const tailPoint = {
      greet: cat ? [442,52] : [453,94],
      fear: cat ? [429,210] : [373,205],
      threat: cat ? [431,68] : [452,125],
      attack: cat ? [451,183] : [442,148],
      flee: [463,167],
      hunt: [466,169],
      play: cat ? [446,117] : [451,83],
      relax: cat ? [451,195] : [436,174],
    }[scene];
    return `<svg viewBox="0 0 520 252" role="img" aria-label="${animalNames[animal]}, ${SCENES[scene].label}, schematische Darstellung">
      <path class="behavior-ground" d="M23 234H497"/>
      <g class="${scene === 'flee' ? 'behavior-flee' : ''}">
        <g fill="none" stroke="${dark}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round">
          <path d="${legFront}" opacity=".48" transform="translate(22 -3)"/>
          <path d="${legBack}" opacity=".48" transform="translate(19 -3)"/>
          <path class="${animations.has(scene) && scene !== 'flee' ? 'behavior-tail' : ''}" d="M${tailStart.join(' ')} ${tails[scene]}" stroke-width="${cat && scene === 'threat' ? 21 : 13}"/>
        </g>
        <path d="${body}" fill="${fill}" stroke="${dark}" stroke-width="3"/>
        <path d="${legFront} ${legBack}" fill="none" stroke="${dark}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${legFront} ${legBack}" fill="none" stroke="${fill}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
        ${cat ? `<path d="M250 ${frontY + 2}l11 20m14 -28l12 19m13 -24l11 18" stroke="${dark}" stroke-width="4" opacity=".5" fill="none"/>`
          : `<path d="M222 ${frontY + 3}q26 0 32 21q-8 23 -40 20l-16 -18Z" fill="${light}" opacity=".8"/>`}
        <ellipse cx="${headX}" cy="${headY}" rx="${cat ? 30 : 32}" ry="30" fill="${fill}" stroke="${dark}" stroke-width="3"/>
        <path d="${muzzle}" fill="${light}" stroke="${dark}" stroke-width="3"/>
        <path d="${ears}" fill="${dark}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="${headX - (cat ? 16 : 19)}" cy="${headY - 4}" r="${scene === 'fear' ? 4.8 : 3.8}" fill="#233a33"/>
        <circle cx="${headX - (cat ? 33 : 49)}" cy="${headY + 12}" r="4.5" fill="#233a33"/>
        ${cat ? `<path d="M${headX - 23} ${headY + 17}l-27 -4m26 9l-28 5" fill="none" stroke="${dark}" stroke-width="1.6"/>` : ''}
        ${warn ? `<path d="M${headX - 36} ${headY + 23}q11 -5 22 1" stroke="${dark}" stroke-width="2.5" fill="none"/>` : ''}
      </g>
      ${scene === 'play' && cat ? '<circle cx="81" cy="219" r="12" fill="#e3a54e" stroke="#8d5724" stroke-width="2"/>' : ''}
      ${markers ? `<g class="${scene === 'flee' ? 'behavior-flee' : ''}">${dot(1, 63, 50, ...earPoint)
        + dot(2, 268, 33, 271, frontY + 17) + dot(3, 470, 45, ...tailPoint)}</g>` : ''}
    </svg>`;
  }

  function animalCard(animal) {
    const scene = SCENES[state.scene];
    return `<figure class="behavior-animal">
      <figcaption>${animalNames[animal]}</figcaption>
      <div class="behavior-stage">${figure(animal, state.scene)}</div>
      <dl>${scene[animal].map((text, index) =>
        `<div><dt><span aria-hidden="true">${index + 1}</span> ${features[index]}</dt><dd>${text}</dd></div>`).join('')}</dl>
    </figure>`;
  }

  function render(focus) {
    const root = document.getElementById('behavior-lab');
    if (!root) return;
    const scene = SCENES[state.scene];
    const offset = answerOrder.indexOf(state.scene) % scene.choices.length;
    const order = scene.choices.map((_, i) => (i + offset) % scene.choices.length);
    root.classList.toggle('behavior-paused', state.paused);
    root.classList.toggle('behavior-large', state.large);
    root.innerHTML = `<header class="behavior-head">
      <h3>Hund und Katze im direkten Vergleich</h3>
      <p>Wähle eine Situation und vergleiche Ohren, Körper und Schwanz.</p>
    </header>
    <div class="behavior-picks" role="group" aria-label="Situation auswählen">
      ${Object.entries(SCENES).map(([key, item]) => `<button type="button" data-scene="${key}" aria-pressed="${state.scene === key}">${item.label}</button>`).join('')}
    </div>
    <div class="behavior-context"><h4>${scene.label}</h4><p>${scene.context}</p></div>
    <div class="behavior-tools">
      <button type="button" data-behavior-tool="size" aria-pressed="${state.large}">${state.large ? 'Bilder verkleinern' : 'Bilder vergrößern'}</button>
      <button type="button" data-behavior-tool="markers" aria-pressed="${state.markers}">Bildmarkierungen</button>
      ${animations.has(state.scene) ? `<button type="button" data-behavior-tool="motion" aria-pressed="${state.paused}">${state.paused ? 'Animation fortsetzen' : 'Animation pausieren'}</button>` : ''}
    </div>
    <div class="behavior-compare">${animalCard('dog')}${animalCard('cat')}</div>
    <div class="behavior-story">
      <h4>${scene.question}</h4>
      <div class="behavior-choices" role="group" aria-label="Antwort auswählen">
        ${order.map(i => `<button type="button" data-behavior-answer="${i}" aria-pressed="${state.answer === i}">${scene.choices[i]}</button>`).join('')}
      </div>
      ${state.answer === null ? '' : `<p class="behavior-result ${state.answer === 0 ? 'correct' : 'wrong'}" role="status">
        <strong>${state.answer === 0 ? 'Richtig.' : 'Schau noch einmal hin.'}</strong> ${scene.explanation}</p>`}
    </div>
    <p class="behavior-source">Schematische Zeichnungen. Ein einzelnes Zeichen reicht selten aus.
      <a href="https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding">Quelle Hund</a> ·
      <a href="https://www.rspca.org.uk/adviceandwelfare/pets/cats/behaviour">Quelle Katze</a>
    </p>`;
    if (focus) root.querySelector(focus)?.focus({preventScroll: true});
  }

  function mount({section}) {
    if (section !== 'signals') return;
    const content = document.getElementById('content');
    if (!content || document.getElementById('behavior-lab')) return;
    const root = document.createElement('section');
    root.id = 'behavior-lab';
    root.className = 'behavior-lab';
    root.setAttribute('aria-label', 'Körpersprache von Hund und Katze');
    const title = content.querySelector('.page-title');
    content.insertBefore(root, title?.nextElementSibling ?? content.firstElementChild);
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      const {scene, behaviorAnswer, behaviorTool} = button.dataset;
      if (scene && scene !== state.scene) {
        state.scene = scene;
        state.answer = null;
        render(`[data-scene="${scene}"]`);
      } else if (behaviorAnswer !== undefined) {
        state.answer = Number(behaviorAnswer);
        render(`[data-behavior-answer="${behaviorAnswer}"]`);
      } else if (behaviorTool) {
        if (behaviorTool === 'markers') state.markers = !state.markers;
        if (behaviorTool === 'motion') state.paused = !state.paused;
        if (behaviorTool === 'size') state.large = !state.large;
        render(`[data-behavior-tool="${behaviorTool}"]`);
      }
    });
    render();
  }

  window.BioBehaviorLab = {mount, SCENES, figure};
  const [, section] = decodeURIComponent(location.hash.slice(1)).split('/');
  mount({section});
})();
