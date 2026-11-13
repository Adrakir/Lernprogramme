(() => {
  'use strict';

  const art = (label, content, box = '0 0 600 320') =>
    `<svg class="bm-art" viewBox="${box}" role="img" aria-label="${label}">${content}</svg>`;
  const line = (d, color = '#397465', width = 2) =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const text = (x, y, label) => `<text x="${x}" y="${y}">${label}</text>`;
  const options = (label, key, values, current) => `<div class="bm-options" role="group" aria-label="${label}">
    ${values.map(([id, name]) => `<button type="button" data-bm-key="${key}" data-bm-value="${id}"
      aria-pressed="${id === current}">${name}</button>`).join('')}</div>`;
  const range = (label, value) => `<label class="bm-range">${label}
    <input type="range" min="0" max="100" value="${value}" data-bm-range></label>`;
  const note = (title, description) => `<div class="bm-reading"><h3>${title}</h3><p>${description}</p></div>`;
  const left = '#235f54', bone = '#e5c68e', violet = '#6865a1', orange = '#ac5632';

  const ancestry = [
    ['Frühe Wolfspopulationen', 'Hunde stammen von frühen Wolfspopulationen ab. Heutige Wölfe und heutige Hunde sind verwandte Linien. Ein wildes Wolfsrudel ist meist eine Familie.', 'Wild lebende Vorfahren'],
    ['Nähe zum Menschen', 'Nahrungsreste könnten einige Tiere angelockt haben. Wie die Annäherung genau begann, ist offen. Über viele Generationen entstand die Haustierform. Das nennt man Domestikation.', 'Entstehung der Haustierform'],
    ['Gezielte Zucht', 'Menschen wählten später Elterntiere mit bestimmten vererbbaren Merkmalen aus. So entstanden etwa Unterschiede in Größe oder Fell. Training beeinflusst, was ein einzelner Hund lernt.', 'Entstehung verschiedener Rassen'],
  ];

  function ancestryModel({step}) {
    const sky = '<path d="M0 203l92-85 39 32 72-68 110 103 98-84 126 101 63-28v85H0Z" fill="#bfd9cb"/><path d="M0 214q125-40 260-8t340-4v118H0Z" fill="#d7e9de"/>';
    const trees = [52, 90, 140, 472, 514, 558].map((x, i) =>
      `<path d="M${x} 205l-14 0 14 -${50 + i % 3 * 13} 14 ${50 + i % 3 * 13}Z" fill="#6a9984"/>`).join('');
    const tracks = [188, 251, 319].map((x, i) => `<g transform="translate(${x} ${234-i*11})" fill="#397465">
      <ellipse cy="7" rx="7" ry="5"/><circle cx="-6" cy="-1" r="2.5"/><circle cx="0" cy="-4" r="2.5"/><circle cx="6" cy="-1" r="2.5"/></g>`).join('');
    const camp = '<path d="M362 213v-49l39-34 40 34v49Z" fill="#f1cf91" stroke="#86573b" stroke-width="3"/><path d="M352 170l49-43 50 43M392 213v-29h19v29" fill="none" stroke="#86573b" stroke-width="4"/>';
    const split = line('M92 160h135q36 0 65-51t72-51h133M227 160h270M227 160q36 0 65 51t72 51h133', '#9ec5b4', 10) +
      [58, 160, 262].map((y, i) => `<circle cx="498" cy="${y}" r="${13 + i * 4}" fill="${['#387967','#b56d47','#696795'][i]}"/>`).join('') +
      '<circle cx="92" cy="160" r="22" fill="#387967"/>' + text(56, 208, 'Haushund') + text(385, 294, 'Rassenvielfalt');
    const body = step === '2' ? split : sky + trees + tracks + (step === '1' ? camp : '') +
      text(32, 291, step === '0' ? 'Lebensraum und Spuren' : 'Spuren nahe einer Siedlung');
    return {
      image: art(ancestry[Number(step)][2], body),
      controls: options('Entwicklungsschritt', 'step', ancestry.map(([title], i) => [String(i), title]), step),
      reading: note(...ancestry[Number(step)]),
    };
  }

  const animalNames = {hund: 'Hund', katze: 'Katze', mensch: 'Mensch'};
  const dentition = [
    ['incisor', 'Schneidezähne'], ['canine', 'Eckzähne'], ['premolar', 'Vordere Backenzähne'],
    ['molar', 'Hintere Backenzähne'], ['carnassial', 'Reißzähne'],
  ];

  function teethModel({species, part}) {
    const {jaws, toothWhy, toothDiagram} = window.BioLaborAnatomie;
    const available = dentition.filter(([key]) => jaws[species].marks.some(([mark]) => mark === key));
    const selected = available.find(([key]) => key === part) || available[0];
    const index = jaws[species].marks.findIndex(([key]) => key === selected[0]);
    const [, reason] = toothWhy[species][selected[0]];
    return {
      image: '<div class="bm-dental">' + toothDiagram(species, index, false, {showMarker: false, highlight: true}) + '</div>',
      controls: options('Gebiss auswählen', 'species', Object.entries(animalNames), species) +
        options('Zahngruppe auswählen', 'part', available, selected[0]),
      reading: note(animalNames[species] + ' · ' + selected[1], reason) +
        `<p class="bm-count">${jaws[species].count}. Die Zeichnung zeigt eine Seite.</p>`,
    };
  }

  function shearModel({value}) {
    const gap = (100 - value) * .43;
    const blade = 'M136 125H395L366 158L296 151L254 183L222 153L153 155Z';
    const lower = 'M200 214L236 187L270 197L304 170L339 198L400 184L422 214Z';
    const body = '<path d="M119 87h327l-31 38H139Z" fill="#e6cda4"/>' +
      `<path d="${blade}" fill="#ba7750" stroke="#693f32" stroke-width="3"/><g transform="translate(0 ${gap})">
      <path d="M145 213h302l-33 39H154Z" fill="#e6cda4"/><path d="${lower}" fill="#5b9781" stroke="#305e51" stroke-width="3"/></g>` +
      line('M213 143L121 56H51', orange) + text(49, 46, 'Oberer Reißzahn') +
      line(`M307 ${194 + gap}L380 278h133`, left) + text(386, 304, 'Unterer Reißzahn') +
      line('M472 199v-44m-8 10l8-10 8 10', left, 4);
    return {
      image: art('Zwei scharfkantige Reißzähne in Seitenansicht. Der untere Zahn bewegt sich zum oberen.', body),
      slider: range('Unterkiefer schließen', value),
      reading: note(value < 40 ? 'Maul geöffnet' : value < 80 ? 'Zähne nähern sich' : 'Die Zahnkanten gleiten aneinander vorbei',
        'Bei Hund und Katze bilden zwei Backenzähne pro Seite eine Schere. Der obere Reißzahn ist der letzte vordere Backenzahn. Der untere ist der erste hintere Backenzahn. Die Kanten schneiden Fleisch beim Schließen des Kiefers.'),
    };
  }

  const contacts = {
    human: ['Mensch', 'Sohlengang', 'Beim normalen Gehen berührt beim Aufsetzen zunächst oft die Ferse den Boden. Dann rollt der Fuß über die Sohle zu den Zehen ab.'],
    dog: ['Hund', 'Zehengang', 'Die Ferse liegt am hoch stehenden Sprunggelenk. Die Zehen und Ballen tragen das Gewicht. Der lange Abschnitt darunter gehört zum Fuß.'],
    cat: ['Katze', 'Zehengang', 'Die Katze tritt ebenfalls auf Zehen und Ballen auf. Beim normalen Gehen bleiben die Krallen meist eingezogen.'],
  };

  function footModel({species}) {
    const human = species === 'human';
    const cat = species === 'cat';
    const points = human ? [[205,45],[244,117],[233,241],[338,251],[397,261]]
      : [[233,45],[202,110],[333,161],[292,238],[245,261]];
    const [[x0,y0],[x1,y1],[x2,y2],[x3,y3],[x4,y4]] = points;
    const contact = human ? 'M225 270h176' : cat ? 'M229 270h42' : 'M220 270h49';
    const limb = `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}L${x4} ${y4}`;
    const heel = human ? [222,253] : [x2,y2];
    const body = '<path d="M0 273h600v47H0Z" fill="#d7e8de"/>' + line('M35 273h530','#8aa99a',2) +
      line(limb,'#997b58',26) + line(limb,bone,20) + line(contact,left,8) +
      `<circle cx="${x1}" cy="${y1}" r="11" fill="#a3a0d0"/><circle cx="${x2}" cy="${y2}" r="12" fill="#a3a0d0"/>` +
      line(`M${x1} ${y1}l-72 -36H64`,violet) + text(64, 63, 'Knie') +
      line(`M${heel.join(' ')}l67 -21h92`,violet) + text(human ? 305 : 404, human ? 221 : 129, 'Ferse') +
      text(45, 301, human ? 'Bodenkontakt entlang der Sohle' : 'Bodenkontakt an den Zehen');
    return {
      image: art(contacts[species][0] + ', Hinterbein oder Bein mit markiertem Bodenkontakt', body),
      controls: options('Bein vergleichen', 'species', Object.entries(contacts).map(([key, entry]) => [key, entry[0]]), species),
      reading: note(contacts[species][1], contacts[species][2]),
    };
  }

  function pupilModel({value}) {
    const light = Math.round(value);
    const width = 72 - light * .655;
    const palette = light < 45 ? '#344854' : '#e2efe0';
    const iris = light < 45 ? '#bbbd6c' : '#9dab50';
    const body = `<rect width="600" height="320" fill="${palette}"/>
      <path d="M58 170Q170 42 300 83Q430 42 542 170Q424 254 300 232Q176 254 58 170Z" fill="#997b69" opacity=".58"/>` +
      [167, 433].map(x => `<path d="M${x - 104} 168Q${x} 59 ${x + 104} 168Q${x} 253 ${x - 104} 168Z" fill="#223c3d"/>
        <clipPath id="bm-eye-${x}"><path d="M${x - 99} 168Q${x} 66 ${x + 99} 168Q${x} 245 ${x - 99} 168Z"/></clipPath>
        <g clip-path="url(#bm-eye-${x})"><circle cx="${x}" cy="164" r="81" fill="${iris}"/>
        <circle cx="${x}" cy="164" r="72" fill="none" stroke="#758644" stroke-width="9" stroke-dasharray="1 3"/>
        <ellipse cx="${x}" cy="164" rx="${width}" ry="68" fill="#182528"/>
        <circle cx="${x - 16}" cy="131" r="9" fill="#fff" opacity=".88"/></g>`).join('') +
      '<path d="M286 207l28 0-14 13Z" fill="#864b4c"/>';
    return {
      image: art('Katzenaugen im Modell. Die dunklen Pupillen ändern ihre Breite mit dem Licht.', body),
      slider: range('Lichtmenge im Modell', value),
      reading: note(light > 70 ? 'Helles Licht · schmale Pupille' : light < 32 ? 'Schwaches Licht · weite Pupille' : 'Mittlere Helligkeit',
        'Bei wenig Licht öffnet sich die Pupille weiter. So gelangt mehr Licht ins Auge. Bei hellem Licht wird die Pupille schmal. In völliger Dunkelheit helfen der Katze ihr Gehör und ihre Tasthaare.'),
    };
  }

  function scentModel({species}) {
    const dog = species === 'dog';
    const contour = dog ? 'M209 105Q302 30 490 100Q535 122 531 167Q507 228 323 233L108 214Q61 203 66 174Q77 143 209 105Z'
      : 'M289 105Q358 42 473 99Q521 128 512 173Q500 226 334 232H149Q105 224 118 195L86 185Q77 176 101 164L142 141Z';
    const folds = dog ? 'M174 164q-12-33 22-42t43 19t31-3t37-19t30 17t39 0t35-12t30 18'
      : 'M184 168q10-26 42-25t53 6t66-12t67 5';
    const body = `<path d="${contour}" fill="#eadcc7" stroke="#7c6e5c" stroke-width="3"/>
      <path d="M92 184Q198 211 340 184T494 148" fill="none" stroke="#ac927c" stroke-width="12" stroke-linecap="round"/>
      <path d="${folds}" fill="none" stroke="#468774" stroke-width="13" stroke-linecap="round"/>` +
      line('M91 183q25 2 47-11m-12-3l13 2-7 10',left,3) +
      line(dog ? 'M344 134l43-71h103' : 'M348 153l39-90h103',left) + text(362, 50, 'Riechschleimhaut') +
      text(67, 256, 'Luft mit Duftstoffen') + line('M132 234l-26-29',left);
    return {
      image: art('Vereinfachter Nasenquerschnitt. Grün markiert ist die Riechschleimhaut.', body),
      controls: options('Nase vergleichen', 'species', [['dog','Hund'], ['human','Mensch']], species),
      reading: note(dog ? 'Viel Platz für Riechzellen' : 'Auch Menschen riechen mit Riechzellen',
        dog ? 'Beim Hund ist die Fläche der Riechschleimhaut größer. Dort reagieren viele Riechzellen auf Duftstoffe und senden Signale ans Gehirn. Ein trainierter Hund kann bestimmte Gerüche finden und anzeigen.'
          : 'Die Riechzellen liegen im oberen Bereich der Nasenhöhle. Auch sie leiten Signale ans Gehirn weiter. Das Modell vergleicht die Form und zeigt keine gemessenen Flächen.'),
    };
  }

  function behaviorModel({scene, markers, motion}) {
    const {SCENES, figure} = window.BioBehaviorLab;
    const current = SCENES[scene];
    const labels = ['Ohren', 'Körper', 'Schwanz'];
    return {
      image: '<div class="bm-behavior' + (motion === 'play' ? ' bm-playing' : '') + '">' +
        ['dog','cat'].map(species => `<figure><figcaption>${species === 'dog' ? 'Hund' : 'Katze'}</figcaption>${figure(species, scene, markers === 'show')}
          <dl>${current[species].map((value, i) => `<div><dt>${i + 1}. ${labels[i]}</dt><dd>${value}</dd></div>`).join('')}</dl>
          </figure>`).join('') + '</div>',
      controls: options('Situation wählen', 'scene', Object.entries(SCENES).map(([key, entry]) => [key, entry.label]), scene) +
        options('Hinweispunkte', 'markers', [['show','Hinweispunkte an'], ['hide','Hinweispunkte aus']], markers) +
        options('Bewegung', 'motion', [['still','Standbild'], ['play','Animation']], motion),
      reading: note(current.label, current.context + ' Vergleiche Ohren, Körper und Schwanz der beiden Tiere.'),
    };
  }

  const spineParts = [
    ['Halswirbelsäule', '#559f92', 'Sieben Halswirbel tragen den Kopf und helfen beim Drehen und Nicken.'],
    ['Brustwirbelsäule', '#748bc1', 'Zwölf Brustwirbel sind mit den Rippen verbunden. Gemeinsam stützen sie den Brustkorb.'],
    ['Lendenwirbelsäule', '#ca9847', 'Fünf kräftige Lendenwirbel tragen einen großen Teil des Oberkörpergewichts.'],
    ['Kreuzbein', '#bf6d57', 'Fünf verwachsene Wirbel bilden das Kreuzbein. Es leitet das Gewicht von der Wirbelsäule zum Becken.'],
    ['Steißbein', '#8b75a5', 'Das Steißbein besteht meist aus drei bis fünf Wirbeln. Mit vier Steißwirbeln zählt man insgesamt 33.'],
  ];

  function spineModel({part}) {
    const curve = y => 292 + 24 * Math.sin((y - 38) / 39) - 11 * Math.cos(y / 24);
    const outline = '<path d="M269 24Q218 7 199 46L190 74L207 80L207 104Q238 110 241 128Q210 172 212 222Q198 268 220 291H350Q362 263 351 230Q361 178 339 128Q327 98 330 64Q326 32 269 24Z" fill="#dbe9e2"/>';
    const groups = [[64,7,6.6], [112,12,7.3], [202,5,9.8], [253,1,24], [279,1,12]];
    const spine = groups.map(([start, count, size], i) => {
      const [name, color] = spineParts[i];
      const center = start + (count - 1) * size / 2;
      const on = Number(part) === i;
      return `<g opacity="${on ? 1 : .45}">
      ${Array.from({length: count}, (_, j) => {
        const y = start + j * size;
        return `<rect x="${curve(y) - 14}" y="${y - size * .39}" width="${i === 4 ? 17 : 28 + i * 2}" height="${size * .78}"
          rx="3" fill="${color}" stroke="#425a55" stroke-width="${on ? 1.5 : .7}"/>`;
      }).join('')}${on ? line(`M${curve(center)+14} ${center}L385 ${center}h27`, color, 3) +
        text(419, center + 6, ['Hals','Brust','Lende','Kreuzbein','Steißbein'][i]) : ''}<title>${name}</title></g>`;
    }).join('');
    const [name, , reason] = spineParts[Number(part)];
    return {
      image: art('Menschliche Wirbelsäule in Seitenansicht. Markiert ist: ' + name, outline + spine),
      controls: options('Abschnitt auswählen', 'part', spineParts.map(([name], i) => [String(i), name]), part),
      reading: note(name, reason + ' Von der Seite erkennst du die doppelte S-Form. Zusammen mit den Bandscheiben hilft sie, Belastungen abzufedern.'),
    };
  }

  const boneParts = [
    ['outer','Knochenhaut','Diese dünne Hülle enthält Blutgefäße und Nerven. Sie trägt zur Versorgung und Heilung des Knochens bei.'],
    ['dense','Kompakte Schicht','Die feste äußere Knochenschicht gibt dem Röhrenknochen Stabilität.'],
    ['mesh','Knochenbälkchen','Das Netz aus Knochenbälkchen stützt die Knochenenden und hält sie vergleichsweise leicht.'],
    ['marrow','Markhöhle','Sie liegt im Schaft. Bei Erwachsenen enthält sie häufig gelbes, fettreiches Knochenmark. Blutzellen entstehen im roten Knochenmark, zum Beispiel in vielen Knochenbälkchenräumen.'],
  ];

  function longBoneModel({part}) {
    const shapes = [
      ['M111 107Q58 76 43 125Q32 167 62 199Q86 216 116 190L465 190Q526 225 549 171Q567 111 529 99Q503 87 468 110Z','#a7624f','#7f5142',3],
      ['M116 117Q73 91 55 128Q43 169 70 187Q88 199 115 179L471 179Q524 211 539 167Q551 121 523 110Q500 100 470 120Z','#e2b97c','#9c744b',2],
      ['M65 133Q79 102 118 129L157 151L118 169Q91 193 71 177Q57 158 65 133ZM469 132Q514 104 529 132Q538 155 521 178Q507 191 469 168L437 150Z','url(#bm-bone-mesh)','#9b6d52',2],
      ['M147 142Q153 133 177 133H426Q439 136 450 149Q440 160 424 165H177Q153 165 147 156Z','#bf7062','#955648',2],
    ];
    const body = '<defs><pattern id="bm-bone-mesh" width="19" height="13" patternUnits="userSpaceOnUse">' +
      '<rect width="19" height="13" fill="#fae4b2"/><path d="M-8 8L2 1l8 6 9 -5m-15 11l6-6 7 6" fill="none" stroke="#b78659" stroke-width="1.3"/></pattern></defs>' +
      shapes.map(([d,fill,stroke,width], i) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>${boneParts[i][0] === part
        ? `<path d="${d}" fill="none" stroke="#287565" stroke-width="4" stroke-dasharray="7 4"/>` : ''}`).join('') +
      '<path d="M49 126q-15 32 10 62m483-66q14 28-8 61" fill="none" stroke="#92b5c4" stroke-width="6"/>' +
      line('M113 231H488', '#9cb9a9') + text(40, 257, 'Knochenende') + text(268, 257, 'Schaft') + text(442, 257, 'Knochenende');
    const [,name,reason] = boneParts.find(([id]) => part === id);
    return {
      image: art('Längsschnitt eines Röhrenknochens. Markiert ist: ' + name, body),
      controls: options('Knochenbereich auswählen','part',boneParts.map(([id,name]) => [id,name]),part),
      reading: note(name, reason),
    };
  }

  function elbowModel({value}) {
    const bend = value * .94;
    const rad = bend * Math.PI / 180;
    const point = (x,y) => [292 + x*Math.cos(rad) + y*Math.sin(rad), 201 - x*Math.sin(rad) + y*Math.cos(rad)];
    const [fx,fy] = point(13, 60);
    const [bx,by] = point(-23, 44);
    const biceps = 16 + value * .17;
    const triceps = 30 - value * .13;
    const body = line('M291 45V200','#937752',27) + line('M291 45V200',bone,21) +
      `<g transform="rotate(${-bend} 292 201)">
      <path d="M286 201q-7 38 8 93m14-93q-2 37 7 92" fill="none" stroke="#ad8a5f" stroke-width="13" stroke-linecap="round"/>
      <path d="M286 202q-7 38 8 92m14-92q-2 37 7 91" fill="none" stroke="#efd3a1" stroke-width="8" stroke-linecap="round"/>
      </g>` + '<circle cx="292" cy="201" r="15" fill="#a19acc" stroke="#5e5d8f" stroke-width="3"/>' +
      line(`M305 56Q${305+biceps} 105 ${310+biceps} 161L${fx} ${fy}`,'#ba6c54',8) +
      line(`M282 54Q${282-triceps} 111 ${274-triceps} 171L${bx} ${by}`,'#6c8aa2',8) +
      `<ellipse cx="${311+biceps*.75}" cy="120" rx="${biceps*.62}" ry="${58-value*.18}" fill="#c16f55"/>
      <ellipse cx="${277-triceps*.65}" cy="116" rx="${triceps*.5}" ry="${39+value*.16}" fill="#6c8aa2"/>` +
      text(394, 91, 'Bizeps') + line('M338 106l52-20',orange) +
      text(86, 89, 'Trizeps') + line('M166 83l80 29','#587c97') +
      text(60, 221, 'Ellenbogengelenk') + line('M207 215l66-13',violet);
    return {
      image: art('Oberarm und Unterarm mit Ellenbogengelenk, Bizeps und Trizeps. Der Unterarm bewegt sich mit dem Regler.', body),
      slider: range('Unterarm beugen', value),
      reading: note(value >= 55 ? 'Der Arm ist gebeugt' : 'Der Arm ist eher gestreckt',
        'Beim Beugen zieht sich der Bizeps zusammen. Seine Sehne überträgt den Zug auf den Unterarm. Beim aktiven Strecken zieht vor allem der Trizeps. Muskeln können ziehen. Für die Gegenbewegung brauchen sie Gegenspieler.'),
    };
  }

  const checks = {
    ancestryModel: ['Wodurch entstanden später viele unterschiedliche Hunderassen?',
      ['Durch gezielte Auswahl von Elterntieren.', 'Jeder Hund änderte sein Fell, weil er es wollte.'], 0,
      ['Richtig. Züchter wählten Elterntiere mit vererbbaren Merkmalen aus.', 'Fellmerkmale werden vererbt. Die Auswahl der Elterntiere wirkt über Generationen.']],
    teethModel: ['Welche Zähne halten beim Hund ein Stück Nahrung fest?',
      ['Die Reißzähne.', 'Die langen Eckzähne.'], 1,
      ['Die Reißzähne schneiden. Schau dir die langen Zähne weiter vorn an.', 'Richtig. Die spitzen Eckzähne greifen und halten fest.']],
    shearModel: ['Was tun die beiden Reißzähne beim Schließen?',
      ['Ihre Kanten gleiten aneinander vorbei.', 'Sie pressen mit zwei flachen Flächen aufeinander.'], 0,
      ['Richtig. So schneiden sie wie eine Schere.', 'Flache Flächen sind zum Zermahlen geeignet. Reißzähne haben scharfe Kanten.']],
    footModel: ['Wo liegt beim Hund die Ferse?',
      ['Direkt auf dem Boden.', 'Am Knick über der Pfote.'], 1,
      ['Die Pfote berührt den Boden. Die Ferse steht beim Hund höher.', 'Richtig. Der Knick gehört zum Sprunggelenk.']],
    pupilModel: ['Was beobachtest du, wenn es dunkler wird?',
      ['Die Pupille wird weiter.', 'Die Pupille wird schmaler.'], 0,
      ['Richtig. So kann mehr Licht ins Auge gelangen.', 'Schmale Pupillen siehst du bei hellem Licht. Stell den Regler dunkler und beobachte die Pupille.']],
    scentModel: ['Was nehmen Riechzellen auf?',
      ['Duftstoffe in der eingeatmeten Luft.', 'Farben aus der Umgebung.'], 0,
      ['Richtig. Die Zellen reagieren auf Duftstoffe und senden Signale ans Gehirn.', 'Farben nehmen die Augen wahr. Riechzellen reagieren auf Duftstoffe.']],
    spineModel: ['Welcher Abschnitt trägt die Rippen?',
      ['Die Lendenwirbelsäule.', 'Die Brustwirbelsäule.'], 1,
      ['Die Lendenwirbel liegen darunter und tragen viel Gewicht.', 'Richtig. Brustwirbel und Rippen gehören zum Brustkorb.']],
    longBoneModel: ['Was stützt den Knochen innen und spart Gewicht?',
      ['Ein Netz aus Knochenbälkchen.', 'Die Haut über dem Arm.'], 0,
      ['Richtig. Das Netz verteilt Kräfte auf viele kleine Bälkchen.', 'Die Haut liegt außerhalb des Knochens. Im Inneren stützen ihn Knochenbälkchen.']],
    elbowModel: ['Welcher Muskel zieht beim aktiven Beugen?',
      ['Der Trizeps.', 'Der Bizeps.'], 1,
      ['Der Trizeps zieht beim aktiven Strecken.', 'Richtig. Der Bizeps zieht über seine Sehne am Unterarm.']],
  };

  const activities = {
    wolf: [['Abstammung', 'Vom Wolf zum Haushund', ancestryModel, {step:'0'}]],
    gebiss: [
      ['Gebisse vergleichen','Drei Gebisse, verschiedene Aufgaben',teethModel,{species:'hund',part:'incisor'}],
      ['Reißzahnschere','Was passiert beim Zubeißen?',shearModel,{value:10}],
    ],
    pfote: [['Bodenkontakt','Wer setzt die Ferse auf?',footModel,{species:'dog'}]],
    katze: [
      ['Gebiss','Das Gebiss der Katze',teethModel,{species:'katze',part:'carnassial'}],
      ['Pupillen','Wie verändert Licht die Pupillen?',pupilModel,{value:45}],
    ],
    sinne: [
      ['Körpersprache','Dieselbe Situation bei Hund und Katze',behaviorModel,{scene:'greet',markers:'show',motion:'still'}],
      ['Geruchssinn','Was macht die Hundenase so empfindlich?',scentModel,{species:'dog'}],
    ],
    bewegung: [
      ['Wirbelsäule','Fünf Abschnitte, fünf Aufgaben',spineModel,{part:'0'}],
      ['Röhrenknochen','Was steckt im Knochen?',longBoneModel,{part:'outer'}],
      ['Gelenk und Muskeln','Wie beugt sich der Arm?',elbowModel,{value:15}],
    ],
  };

  function mount(root, lesson) {
    const available = activities[lesson];
    if (!root || !available) return;
    let active = 0;
    const states = available.map(([, , , defaults]) => ({...defaults}));
    root.innerHTML = '<div class="bm-shell"><div class="bm-top"><h2>Lernlabor</h2>' +
      '<div data-bm-tabs></div></div><div class="bm-body"><div class="bm-visual"><div data-bm-image></div>' +
      '<p class="bm-caption">Vereinfachtes Modell</p></div><div class="bm-info"><h3 data-bm-title></h3>' +
      '<div data-bm-controls></div><div data-bm-slider></div><div data-bm-reading></div><div data-bm-challenge></div></div></div></div>';
    const tabs = root.querySelector('[data-bm-tabs]');
    const title = root.querySelector('[data-bm-title]');
    const image = root.querySelector('[data-bm-image]');
    const controls = root.querySelector('[data-bm-controls]');
    const slider = root.querySelector('[data-bm-slider]');
    const reading = root.querySelector('[data-bm-reading]');
    reading.setAttribute('aria-live','polite');
    const challenge = root.querySelector('[data-bm-challenge]');
    let challengeKey;

    function renderCheck(view) {
      const state = states[active];
      const scene = state.scene;
      const key = active + '/' + (scene || '');
      if (key === challengeKey) return;
      challengeKey = key;
      const behavior = scene && window.BioBehaviorLab.SCENES[scene];
      const check = behavior
        ? [behavior.question, behavior.choices, 0, [behavior.explanation, behavior.explanation, behavior.explanation]]
        : checks[view.name];
      const [prompt, answers, correct, reasons] = check;
      const isOpen = challenge.querySelector('details')?.open;
      challenge.innerHTML = `<details class="bm-challenge"${isOpen ? ' open' : ''}>
        <summary>Beobachtung prüfen</summary><p>${prompt}</p>
        <div class="bm-options" role="group" aria-label="Antwort auswählen">${answers.map((answer, i) =>
          `<button type="button" data-bm-answer="${i}" aria-pressed="false">${answer}</button>`).join('')}</div>
        <p role="status"></p></details>`;
      challenge.querySelectorAll('[data-bm-answer]').forEach(button => button.addEventListener('click', () => {
        const selected = Number(button.dataset.bmAnswer);
        challenge.querySelectorAll('[data-bm-answer]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        challenge.querySelector('[role="status"]').textContent = (selected === correct ? '✓ ' : '↗ ') + reasons[selected];
      }));
    }

    function render(input = false) {
      const [, heading, view] = available[active];
      const result = view(states[active]);
      const focus = root.contains(document.activeElement) ? document.activeElement.dataset.bmKey : null;
      image.innerHTML = result.image;
      if (reading.innerHTML !== result.reading) reading.innerHTML = result.reading;
      if (input) return;
      if (available.length > 1) tabs.innerHTML = options('Modell auswählen','tab',available.map(([name],i) => [String(i),name]),String(active));
      title.textContent = heading;
      controls.innerHTML = result.controls || '';
      slider.innerHTML = result.slider || '';
      renderCheck(view);
      if (focus) root.querySelector('[data-bm-key="' + focus + '"][aria-pressed="true"]')?.focus({preventScroll:true});
    }

    root.addEventListener('click', event => {
      const button = event.target.closest('button[data-bm-key]');
      if (!button) return;
      const {bmKey, bmValue} = button.dataset;
      if (bmKey === 'tab') active = Number(bmValue);
      else states[active][bmKey] = bmValue;
      render();
    });
    root.addEventListener('input', event => {
      if (!event.target.hasAttribute('data-bm-range')) return;
      states[active].value = Number(event.target.value);
      render(true);
    });
    render();
  }

  window.BioLaborModelle = {mount, has: lesson => Object.hasOwn(activities, lesson)};
})();
