(() => {
  'use strict';

  const boneWhy = {
    mensch: {
      skull: 'Die festen Schädelknochen bilden eine schützende Kapsel um das Gehirn.',
      clavicle: 'Das Schlüsselbein hält die Schulter auf Abstand zum Brustkorb. Dadurch kann der Arm in viele Richtungen bewegt werden.',
      humerus: 'Der lange, stabile Oberarmknochen wirkt als Hebel. Muskeln bewegen ihn an der Schulter und beugen oder strecken den Arm am Ellenbogen.',
      sternum: 'Das flache Brustbein liegt vorn in der Mitte. Über Rippenknorpel verbindet es viele Rippen mit der Vorderseite des Brustkorbs.',
      ribs: 'Die gebogenen Rippen umschließen Herz und Lunge. Bewegliche Verbindungen lassen den Brustkorb beim Einatmen weiter werden.',
      spine: 'Die doppelte S-Form hilft beim aufrechten Stehen und federt mit den Bandscheiben Stöße beim Gehen ab.',
      forearm: 'Elle und Speiche sind zwei getrennte Knochen. Die Speiche kann sich um die Elle bewegen, wenn du die Handfläche drehst.',
      pelvis: 'Das breite Becken stützt den Rumpf und leitet sein Gewicht im aufrechten Stand auf die Beine weiter.',
      hand: 'Viele kleine Knochen und Gelenke machen die Hand beweglich. Der Daumen kann den anderen Fingern gegenüberstehen und präzises Greifen ermöglichen.',
      femur: 'Der kräftige Oberschenkelknochen trägt viel Körpergewicht. Als langer Hebel hilft er beim Gehen, Laufen und Aufstehen.',
      kneecap: 'Die Kniescheibe liegt vorn in der Sehne des Oberschenkelmuskels. Dort verbessert sie dessen Hebel, wenn das Knie gestreckt wird.',
      tibia: 'Das Schienbein ist dick und stabil, weil es einen großen Teil des Gewichts vom Knie zum Fuß weiterleitet.',
      fibula: 'Das schlankere Wadenbein trägt weniger Gewicht als das Schienbein. Sein unteres Ende bildet den Außenknöchel und stabilisiert das Sprunggelenk.',
      foot: 'Fußwurzel, Mittelfuß und Zehen bilden mit Muskeln und Bändern Fußgewölbe. Sie verteilen die Last und helfen beim Abrollen.',
    },
    katze: {
      skull: 'Der feste Schädel schützt das Gehirn. Die kurze Schnauze bringt das Gebiss nahe an die Kiefergelenke. Die langen Eckzähne können Beute festhalten.',
      shoulder: 'Das flache Schulterblatt ist durch Muskeln mit dem Rumpf verbunden. Beim Anschleichen und Laufen kann es sich am Brustkorb mitbewegen.',
      spine: 'Die Wirbelsäule kann sich stark beugen und strecken. Das hilft beim Zusammenziehen vor einem Sprung und bei langen Schritten im Galopp.',
      pelvis: 'Das Becken bietet Ansatzflächen für kräftige Muskeln der Hinterbeine. Über die Hüftgelenke wird der Schub beim Abspringen auf den Rumpf übertragen.',
      tail: 'Der Schwanz besteht aus vielen kleinen, beweglich verbundenen Wirbeln. Die Katze kann ihn beim Balancieren und beim Richtungswechsel bewegen.',
      humerus: 'Der Oberarmknochen ist ein Hebel zwischen Schulter und Ellenbogen. Beim Landen können Vorderbeine mit gebeugten Gelenken und arbeitenden Muskeln Stöße abfangen.',
      frontPaw: 'Die Katze läuft auf Zehen und Ballen. Weiche Ballen dämpfen den Auftritt beim Anschleichen. Die Krallen lassen sich meist einziehen.',
      ribs: 'Die gebogenen Rippen bilden einen beweglichen Brustkorb. Er schützt Herz und Lunge und kann sich beim Atmen weiten.',
      femur: 'Der Oberschenkelknochen ist ein stabiler Hebel. Kräftige Muskeln strecken beim Sprung Hüfte und Knie und drücken den Körper nach oben.',
      hindPaw: 'Die Katze setzt die Zehen und Ballen auf. Das Sprunggelenk liegt höher und kann sich vor dem Absprung beugen, damit sich das Hinterbein kräftig strecken kann.',
    },
    hund: {
      skull: 'Der Schädel schützt das Gehirn und trägt das Gebiss. Seine Form und die Länge der Schnauze unterscheiden sich je nach Rasse. Die Kiefer tragen Zähne zum Festhalten und Zerteilen.',
      shoulder: 'Das flache Schulterblatt wird durch Muskeln am Brustkorb gehalten. Seine Bewegung unterstützt den Schritt des Vorderbeins.',
      spine: 'Die Wirbel schützen das Rückenmark. Bei schnellem Galopp können sich bewegliche Rückenabschnitte beugen und strecken und so die Schritte verlängern.',
      pelvis: 'Das stabile Becken verbindet den Rumpf mit den Hinterbeinen. Kräftige Muskeln setzen daran an und übertragen beim Anlaufen den Schub nach vorn.',
      tail: 'Die beweglichen Schwanzwirbel setzen die Wirbelsäule fort. Der Hund kann die Rute zur Verständigung bewegen. Ihre Form und Länge sind je nach Rasse verschieden.',
      humerus: 'Der Oberarmknochen überträgt Kräfte zwischen Schulter und Ellenbogen. Die Vorderbeine stützen und bremsen den Körper beim Aufsetzen.',
      frontPaw: 'Der Hund ist ein Zehengänger. Zehen und Ballen tragen das Gewicht und dämpfen den Auftritt. Die Krallen lassen sich nicht einziehen und können auf weichem Boden Halt geben.',
      ribs: 'Die gebogenen Rippen umgeben Herz und Lunge. Bewegliche Verbindungen lassen den Brustkorb beim Atmen weiter werden, auch wenn der Hund rennt.',
      femur: 'Der Oberschenkelknochen wirkt als Hebel für die Muskeln des Hinterbeins. Beim Strecken von Hüfte und Knie entsteht der Schub zum Laufen.',
      hindPaw: 'Die Hinterpfote stützt sich auf Zehen und Ballen. Beim Abstoßen überträgt sie die Kraft des Hinterbeins auf den Boden.',
    },
  };

  const toothLabels = {
    incisor: 'Schneidezahn',
    canine: 'Eckzahn',
    premolar: 'Vorderer Backenzahn',
    molar: 'Hinterer Backenzahn',
    carnassial: 'Reißzahnpaar',
  };

  const toothWhy = {
    mensch: {
      incisor: ['Suche ganz vorn nach einer geraden Kante.', 'Die flache, scharfe Schneide funktioniert wie eine Klinge. Damit beißt du Stücke ab, etwa von einem Apfel.'],
      canine: ['Suche direkt hinter den Schneidezähnen.', 'Die leicht spitze Krone kann ein Stück Nahrung festhalten und einreißen. Menschliche Eckzähne ragen viel weniger hervor als die Fangzähne von Hund und Katze.'],
      premolar: ['Suche zwischen Eckzahn und den großen hinteren Backenzähnen.', 'Die Kaufläche hat meist zwei Höcker. Zwischen diesen Höckern wird Nahrung beim Zubeißen zerdrückt.'],
      molar: ['Suche ganz hinten nach einem breiten Zahn.', 'Die breite Kaufläche mit mehreren Höckern zermahlt Nahrung. So werden unterschiedliche Lebensmittel vor dem Schlucken in kleinere Stücke geteilt.'],
    },
    katze: {
      incisor: ['Suche die kleinen Zähne ganz vorn.', 'Die kleinen Schneidezähne greifen feine Stücke. Die Katze nutzt sie auch beim Pflegen ihres Fells.'],
      canine: ['Suche den langen, spitzen Fangzahn vor den Backenzähnen.', 'Der lange, spitze Eckzahn dringt gut ein und hält Beute fest. Deshalb heißt er auch Fangzahn.'],
      premolar: ['Suche einen spitzen Backenzahn hinter dem Eckzahn.', 'Die scharfen Höcker der vorderen Backenzähne helfen, Fleisch zu zerteilen. Der letzte obere vordere Backenzahn gehört zum Reißzahnpaar.'],
      molar: ['Suche den kleinen hintersten Zahn im Oberkiefer.', 'Dieser obere hintere Backenzahn ist klein. Die Katze hat wenig breite Mahlfläche und zerteilt Fleisch vor allem mit scharfen Zahnkanten.'],
      carnassial: ['Suche zwei gegenüberliegende Zähne mit langen Schneidkanten.', 'Der letzte obere vordere Backenzahn (P4) und der erste untere hintere Backenzahn (M1) gleiten aneinander vorbei. So schneiden sie Fleisch wie die Klingen einer Schere.'],
    },
    hund: {
      incisor: ['Suche die kleinen Zähne ganz vorn, vor dem langen Eckzahn.', 'Die kleinen Schneidezähne können dünne Stücke abknabbern. Die kurzen Schneiden lassen sich gut dicht an ein Stück Nahrung führen.'],
      canine: ['Suche den langen Zahn unmittelbar hinter den Schneidezähnen.', 'Der lange, leicht gebogene Eckzahn dient zum Greifen und Festhalten. Seine Spitze kann in Nahrung eindringen.'],
      premolar: ['Suche einen spitzen Backenzahn hinter dem Eckzahn.', 'Spitze Höcker helfen, Stücke zu fassen und zu zerteilen. Der vierte obere vordere Backenzahn ist Teil des Reißzahnpaars.'],
      molar: ['Suche einen breiten Zahn hinter den Schneidkanten des Reißzahnpaars.', 'Hinter dem Reißzahnpaar hat der Hund weitere Backenzähne mit breiteren Kauflächen. Mit ihnen kann er Nahrung zusätzlich zerdrücken.'],
      carnassial: ['Suche zwei gegenüberliegende Zähne mit langen Schneidkanten.', 'Der vierte obere vordere Backenzahn (P4) und der erste untere hintere Backenzahn (M1) arbeiten wie zwei Scherenklingen. Sie schneiden Stücke von zäher Nahrung ab.'],
    },
  };

  // Eine Seite des bleibenden Gebisses, von vorn (links) nach hinten (rechts).
  // Position und Umriss sind vereinfacht. Die Zahnzahl je Kieferhälfte stimmt.
  const jaws = {
    mensch: {count: 'Bis zu 32 bleibende Zähne mit Weisheitszähnen',
      upper: [['i',68,25],['i',101,25],['c',138,27],['p',178,31],['p',220,31],['m',265,42],['m',318,43],['m',372,38]],
      lower: [['i',68,25],['i',101,25],['c',138,27],['p',178,31],['p',220,31],['m',265,42],['m',318,43],['m',372,38]],
      marks: [['incisor',80,96,59,30],['canine',151,99,156,30],['premolar',193,101,254,30],['molar',286,169,365,226]]},
    katze: {count: '30 bleibende Zähne',
      upper: [['i',54,15],['i',75,15],['i',96,15],['f',126,30],['s',193,24],['s',235,37],['r',288,70],['t',366,25]],
      lower: [['i',55,14],['i',76,14],['i',97,14],['f',135,29],['s',212,30],['s',257,36],['r',306,64]],
      marks: [['incisor',82,96,52,30],['canine',141,107,141,30],['premolar',250,100,230,30],
        ['molar',379,91,396,30],['carnassial',326,104,397,226,[344,172]]]},
    hund: {count: '42 bleibende Zähne',
      upper: [['i',42,15],['i',62,15],['i',82,17],['f',108,29],['s',153,19],['s',184,25],['s',221,34],['r',267,58],['m',331,41],['t',379,25]],
      lower: [['i',44,15],['i',64,15],['i',84,17],['f',115,28],['s',152,17],['s',180,23],['s',213,27],['s',250,29],['r',288,55],['m',349,30],['t',385,22]],
      marks: [['incisor',70,96,49,30],['canine',122,107,139,30],['premolar',237,99,227,30],
        ['molar',350,101,399,30],['carnassial',295,104,406,226,[317,172]]]},
  };
  const outlines = {
    i: 'M0 0H1L.91 25Q.5 33 .09 25Z',
    c: 'M0 0H1Q.9 22 .49 36Q.15 27 0 0Z',
    f: 'M0 0H1Q.86 34 .35 58Q.08 44 0 0Z',
    p: 'M0 0H1L.95 22Q.75 39 .51 29Q.28 40 .08 23Z',
    m: 'M0 0H1L.95 25Q.85 36 .66 29Q.51 38 .37 29Q.18 36 .06 23Z',
    s: 'M0 0H1L.95 17L.73 26L.59 20L.41 41L.13 22Z',
    r: 'M0 0H1L.95 18L.71 30L.59 25L.38 43L.14 26Z',
    t: 'M0 0H1L.91 20Q.55 33 .08 17Z',
  };

  function toothDiagram(id, selected, interactive, {showMarker = true, highlight = false} = {}) {
    const jaw = jaws[id];
    const selection = jaw.marks[selected];
    const [, px, py, mx, my, second] = selection || [];
    const line = (x, y) => `<line x1="${mx}" y1="${my}" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r="4.5"/>`;
    const group = type => ({i: 'incisor', c: 'canine', f: 'canine', p: 'premolar', s: 'premolar', m: 'molar', t: 'molar'})[type];
    const row = (teeth, y, flipped) => teeth.map(([type, x, w]) => {
      const key = type === 'r' ? (flipped ? 'molar' : 'premolar') : group(type);
      const active = highlight && (selection?.[0] === key || (type === 'r' && selection?.[0] === 'carnassial'));
      return `<path class="bk-tooth${active ? ' bm-tooth-active' : ''}" d="${outlines[type]}"
        transform="translate(${x} ${y}) scale(${w} ${flipped ? -1 : 1})"/>`;
    }).join('');
    const markers = interactive ? jaw.marks.map(([key, , , x, y], i) =>
      `<button type="button" class="bk-marker" data-point="${i}" aria-pressed="${i === selected}"
       aria-label="${i + 1}. ${toothLabels[key]}" style="--x:${x / 4.6}%;--y:${y / 2.6}%">${i + 1}</button>`).join('') : '';
    return `<figure class="bk-figure bk-dentition">
      <div class="bk-picture" style="aspect-ratio:460/260"><svg viewBox="0 0 460 260" role="img"
       aria-label="Schematische Seitenansicht einer Kieferhälfte, vorn links">
        <path class="bk-gum" d="M31 79Q140 47 250 56L422 59L420 79Z M31 189L420 189L421 208L249 213Q143 219 31 189Z"/>
        ${row(jaw.upper, 77, false)}${row(jaw.lower, 191, true)}
        ${showMarker && selection ? line(px,py) + (second ? line(...second) : '') : ''}
        ${showMarker && !interactive && selection ? `<circle class="bk-start" cx="${mx}" cy="${my}" r="10"/>` : ''}
      </svg>${markers}</div>
      <figcaption>Vorn links · Oberkiefer oben</figcaption>
    </figure>`;
  }

  const markLocations = {
    bones: {
      skull: 'Die Linie endet am knöchernen Kopf, der Augen und Gehirn umgibt.',
      clavicle: 'Die Linie endet an einem schmalen Knochen oberhalb des Brustkorbs zwischen Brustbein und Schulter.',
      shoulder: 'Die Linie endet an einer flachen, dreieckigen Knochenplatte seitlich am vorderen Rumpf, oberhalb des Ansatzes des Vorderbeins.',
      humerus: 'Die Linie endet am langen Knochen zwischen Schulter und Ellenbogen.',
      forearm: 'Die Linie endet an den beiden nebeneinanderliegenden Knochen zwischen Ellenbogen und Handgelenk.',
      hand: 'Die Linie endet unterhalb des Handgelenks an den kleinen Knochen, aus denen die Fingerknochen hervorgehen.',
      sternum: 'Die Linie endet am länglichen Knochen genau in der Mitte der Brust, zwischen den vorderen Enden der gepaarten, gebogenen Knochen.',
      ribs: 'Die Linie endet an einem der gepaarten, bogenförmigen Knochen, die vom Rücken aus seitlich um die Brust herumführen.',
      spine: 'Die Linie endet an der Kette kleiner aufeinanderfolgender Knochen entlang des Rückens.',
      pelvis: 'Die Linie endet an einer breiten Knochenstruktur am unteren oder hinteren Ende des Rumpfs. Dort setzen die Beine beziehungsweise Hinterbeine an.',
      femur: 'Die Linie endet am langen Knochen des Beins zwischen Hüftgelenk und Knie.',
      kneecap: 'Die Linie endet an dem kleinen Knochen vorn auf dem Kniegelenk.',
      tibia: 'Die Linie endet am breiteren Knochen des Unterschenkels zwischen Knie und Sprunggelenk.',
      fibula: 'Die Linie endet am schmaleren Knochen an der Außenseite des Unterschenkels.',
      foot: 'Die Linie endet unterhalb des Sprunggelenks an den Knochen von Fuß und Zehen.',
      frontPaw: 'Die Linie endet am untersten Abschnitt des Vorderbeins bei den Zehen.',
      hindPaw: 'Die Linie endet am untersten Abschnitt des Hinterbeins bei den Zehen.',
      tail: 'Die Linie endet an den kleinen aufeinanderfolgenden Knochen, die hinter dem Becken den Schwanz bilden.',
    },
    teeth: {
      incisor: 'Die Linie endet an einem kleinen flachen Zahn mit kurzer Schneidkante ganz vorn.',
      canine: 'Die Linie endet an einem langen, spitzen Zahn. Vor ihm sitzen kleinere Zähne, hinter ihm die Zähne mit Kauflächen oder mehreren Höckern.',
      premolar: 'Die Linie endet in der mittleren Zahnreihe. Vor dem markierten Zahn liegt ein einzelner spitzer Zahn, dahinter liegen breitere Zähne.',
      molar: 'Die Linie endet an einem breiten Zahn mit Kaufläche im hinteren Abschnitt der Zahnreihe.',
      carnassial: 'Zwei Linien markieren einen oberen und einen unteren Zahn im hinteren Abschnitt. Ihre langen, scharfen Kanten gleiten beim Schließen des Kiefers aneinander vorbei.',
    },
  };
  const specimenNames = {mensch:'Mensch', hund:'Hund', katze:'Katze'};

  function describeMark(type, species, part) {
    const location = markLocations[type]?.[part];
    if (!location) return '';
    const label = type === 'bones' ? 'Skelett von ' : 'Gebiss von ';
    return label + specimenNames[species] + '. ' + location;
  }

  function markedPicture(figure, description) {
    return figure + (description ? '<details class="bk-image-text"><summary>Bildbeschreibung</summary><p>' + description + '</p></details>' : '');
  }

  window.BioLaborAnatomie = {boneWhy, toothLabels, toothWhy, jaws, toothDiagram, describeMark, markedPicture};
})();
