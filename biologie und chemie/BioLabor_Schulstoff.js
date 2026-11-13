(() => {
  'use strict';

  const mainPage = 'BioLabor_5_Biologie_V9_2.html';
  const animalPage = 'BioLabor_Hund_Katze.html';
  const storageKey = 'biolab5-schulstoff-1';
  const school = id => mainPage + '#schulstoff' + (id ? '/' + id : '');
  const main = route => mainPage + '#' + route;
  const animal = route => animalPage + '#' + route;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  const choice = (prompt, correct, ...options) => ({prompt, correct, options});
  const count = (prompt, correct) => ({prompt, correct, number: true});
  const match = (pairs, order) => pairs.map(([prompt, answer]) => choice(prompt, answer, ...order));
  const map = (pairs, indices) => match(pairs, indices.map(index => pairs[index][1]));
  const task = (title, questions, reason, hint = '') => ({title, questions, reason, hint});
  const writing = (title, prompt, sample) => ({title, prompt, sample});

  const wolfTerms = [
    ['Domestikation', 'Z · Über viele Generationen entwickelt sich aus einem Wildtier ein Haustier.'],
    ['Zucht', 'U · Menschen wählen Elterntiere mit bestimmten Merkmalen aus.'],
    ['Rasse', 'C · Tiere derselben Art mit bestimmten vererbbaren Merkmalen.'],
    ['Hütehund', 'H · Ein ausgebildeter Hund hilft, eine Herde zusammenzuhalten.'],
    ['Qualzucht', 'T · Erbliche Zuchtmerkmale können Schmerzen, Leiden oder Schäden verursachen.'],
  ];
  const toothTerms = [
    ['Schneidezähne des Hundes', 'S · Kleine Stücke abbeißen oder Fleischreste abschaben.'],
    ['Eckzähne des Hundes', 'C · Packen und festhalten.'],
    ['Reißzähne des Hundes', 'H · Fleisch und Sehnen wie eine Schere schneiden.'],
    ['Unterkiefer des Hundes', 'E · Bewegt sich vor allem auf und ab.'],
    ['Nagezähne des Kaninchens', 'R · Nagen Pflanzenteile ab und wachsen nach.'],
    ['Mahlzähne des Kaninchens', 'E · Zermahlen Pflanzenteile.'],
  ];
  const pawTerms = [
    ['Zehengänger', 'Z · Die Ferse bleibt beim Auftreten über dem Boden.'],
    ['Hundekrallen', 'E · Können Halt geben und bleiben sichtbar.'],
    ['Ballen', 'H · Polstern und dämpfen Schritte.'],
    ['Katzenkrallen', 'E · Sind im normalen Abdruck meist nicht sichtbar.'],
    ['Sohlengänger', 'N · Der Fuß kann mit Ferse und Sohle aufsetzen.'],
  ];
  const skeletonTerms = [
    'Schädel', 'Schulterblatt', 'Wirbelsäule', 'Becken', 'Oberschenkelknochen',
    'Fersenbereich am Sprunggelenk', 'Hinterpfote', 'Schien- und Wadenbein',
    'Rippen', 'Vorderpfote', 'Elle und Speiche', 'Oberarmknochen',
  ];
  const catOrder = [2, 0, 3, 1, 11, 8, 10, 4, 7, 5, 6, 9];

  const lessons = {
    wolf: {
      title: 'Wolf oder Hund?', source: 'Stationsarbeit Hund · Station 1 und Bioskop 1, S. 24–27',
      intro: 'Wie erkennst du die Verwandtschaft? Was hat sich durch das Zusammenleben mit Menschen und durch Zucht verändert?',
      facts: [
        'Hunde stammen von frühen Wolfspopulationen ab. Wie die Annäherung genau begann, ist offen. Nahrung in der Nähe von Menschen ist eine mögliche Erklärung.',
        'Ein freilebendes Wolfsrudel ist meist eine Familie aus Elterntieren und Nachwuchs. Duftmarken zeigen, welches Gebiet die Familie nutzt. Wölfe können gemeinsam größere Beutetiere verfolgen. Die Jagd läuft je nach Situation verschieden ab.',
        'Wolf und Hund laufen auf den Zehen, riechen gut und haben normalerweise 42 bleibende Zähne. Durch gezielte Zucht entstanden Hunderassen mit unterschiedlichen erblichen Merkmalen. Erfahrungen und Training beeinflussen das Verhalten ebenfalls.',
      ],
      tasks: [
        task('Merkmale zuordnen', [
          ['A · Gehört zur Ordnung der Raubtiere.', 'Beide'],
          ['B · Hat normalerweise 42 bleibende Zähne.', 'Beide'],
          ['C · Läuft auf den Zehen.', 'Beide'],
          ['D · Hat einen sehr guten Geruchssinn.', 'Beide'],
          ['E · Die Wildform lebt frei und jagt selbst.', 'Wolf'],
          ['F · Die Wildform hält sich meist von Menschen fern.', 'Wolf'],
          ['G · Bildet in freier Wildbahn Familienrudel aus Eltern und Jungtieren.', 'Wolf'],
          ['H · Es gibt zahlreiche gezüchtete Rassen.', 'Hund'],
          ['I · Die Schulterhöhe unterscheidet sich je nach Rasse stark.', 'Hund'],
          ['J · Der Mensch hat diese Haustierform gezielt weitergezüchtet.', 'Hund'],
          ['K · Häufiges Bellen ist bei vielen Tieren dieser Haustierform typisch.', 'Hund'],
          ['L · Je nach Rasse kommen Schlappohren und Ringelruten vor.', 'Hund'],
        ].map(([p, a]) => choice(p, a, 'Wolf', 'Hund', 'Beide')),
        'Verwandte Tiere teilen Merkmale. Körpergröße, Ohrform oder Farbe allein reichen zum Unterscheiden kaum aus.'),
        task('Lückensätze zur Abstammung', map([
          ['Der Hund stammt von frühen Populationen des … ab.', 'Wolfs'],
          ['Eine Wolfsfamilie nennt man …', 'Rudel'],
          ['In Menschennähe fanden Tiere möglicherweise …', 'Futter'],
          ['Später begleiteten Hunde Menschen bei der …', 'Jagd'],
          ['Manche wurden eingesetzt, um ein Grundstück zu bewachen. Sie waren …', 'Wachhunde'],
        ], [3, 2, 4, 0, 1]), 'Die ersten Haushunde entstanden über viele Generationen. Die gezielte Zucht von Rassen kam später hinzu.'),
        {...task('Begriffe mit Lösungswort', map(wolfTerms, [2, 4, 0, 3, 1]), 'Domestikation beschreibt die Entstehung einer Haustierform. Gezielte Auswahl für erbliche Merkmale ist Zucht.'), word: 'ZUCHT'},
        writing('Verwandtschaft erklären', 'Nenne drei Gemeinsamkeiten. Erkläre dann, wie verschiedene Hunderassen entstanden sind.',
          'Hund und Wolf sind Zehengänger, riechen gut und haben ein ähnliches Gebiss. Über viele Generationen wählten Menschen Hunde mit gewünschten erblichen Merkmalen aus. So entstanden beispielsweise Unterschiede in Größe, Fell oder Körperbau.'),
      ],
      links: [[animal('dog/origin'), 'Abstammung im Tierkunde-Labor'], [animal('dog/hunt'), 'Jagd und Bewegung'], ['#schulstoff/sinne', 'Hunde im Einsatz'], ['#schulstoff/haustier', 'Hunderassen bewerten']],
    },
    gebiss: {
      title: 'Das Raubtiergebiss', source: 'Stationsarbeit Hund · Station 2 und Bioskop 1, S. 26–27, 34–35',
      intro: 'Zähle die Zähne einer Seite. Vergleiche dann, wie Hund, Katze, Mensch und Kaninchen Nahrung zerkleinern.',
      facts: [
        'Schneidezähne beißen kleine Stücke ab. Lange Eckzähne (Fangzähne) packen und halten fest. Die oberen und unteren Reißzähne gleiten aneinander vorbei wie Scherenklingen. Beim Hund sind das je Seite der letzte vordere Backenzahn oben und der erste hintere Backenzahn unten.',
        'Das vollständige bleibende Hunde- und Wolfsgebiss hat in der Regel 42 Zähne. Die Hauskatze hat normalerweise 30. Beim Menschen sind es mit Weisheitszähnen bis zu 32. Seine breiten Mahlflächen helfen, unterschiedliche Nahrung zu zerkleinern.',
        'Beim Kaninchen folgt auf die nachwachsenden Nagezähne eine Zahnlücke. Hinten zermahlen die Backenzähne Pflanzen. Die Form der Zähne verrät, welche Aufgaben sie erfüllen.',
      ],
      tasks: [
        {...task('Zähne des Hundes zählen', [
          ...['Schneidezähne', 'Eckzähne', 'Vordere Backenzähne', 'Hintere Backenzähne']
            .flatMap((label, i) => [count(label + ', oben', [3, 1, 4, 2][i]), count(label + ', unten', [3, 1, 4, 3][i])]),
          count('Zähne insgesamt', 42),
        ], 'Eine Oberkieferhälfte hat 10 Zähne und eine Unterkieferhälfte 11. Links und rechts zusammen ergibt das (10 + 11) × 2 = 42.', 'Zähle eine Seite oben und unten. Verdopple anschließend die Summe.'), table: true},
        task('Lücken zur Nahrung', map([
          ['Ein vollständiges bleibendes Hundegebiss hat … Zähne.', '42'],
          ['Zum Packen nutzt der Hund seine …', 'Eckzähne'],
          ['Mit ihnen hält er seine … fest.', 'Beute'],
          ['Reißzähne zerschneiden …', 'Fleisch'],
          ['Kaninchen zerkleinern mit ihren Mahlzähnen …', 'Pflanzen'],
        ], [3, 4, 0, 2, 1]), 'Die scharfen Reißzähne schneiden, die flachen Kauflächen des Kaninchens mahlen.'),
        {...task('Zahnformen mit Lösungswort', map(toothTerms, [4, 3, 0, 5, 2, 1]), 'Reißzähne zählen zu den Backenzähnen. Eckzähne und Reißzähne erfüllen verschiedene Aufgaben.'), word: 'SCHERE'},
        writing('Hund und Kaninchen vergleichen', 'Nenne zwei Unterschiede und erkläre jeweils, wie sie zur Nahrung passen.',
          'Der Hund kann mit langen Eckzähnen Nahrung packen. Seine scharfen Reißzähne schneiden Fleisch und Sehnen. Beim Kaninchen nagen die vorderen Zähne Pflanzenteile ab. Seine breiten Backenzähne zermahlen sie durch seitliche Kaubewegungen.'),
      ],
      links: [[animal('dog/teeth'), 'Reißzahnschere bewegen'], [animal('cat/teeth'), 'Katzengebiss erforschen'], [main('klassenarbeit/gebiss/hund'), 'Hundegebiss beschriften'], [main('klassenarbeit/gebiss/mensch'), 'Menschengebiss beschriften']],
    },
    pfote: {
      title: 'Pfote und Skelett', source: 'Stationsarbeit Hund · Station 3 und Bioskop 1, S. 25',
      intro: 'Finde heraus, woran du Pfotenspuren erkennst und wie Knochen, Ballen und Krallen bei der Fortbewegung zusammenarbeiten.',
      facts: [
        'Bei Hund und Katze bleibt die Ferse beim Gehen über dem Boden. Menschen sind Sohlengänger. Der nach hinten ragende Knick am Hinterbein gehört zum Sprunggelenk mit der Ferse. Das Knie sitzt weiter oben, näher am Rumpf.',
        'Ein typischer Pfotenabdruck zeigt vier Zehenballen und einen großen Mittelballen. Hundekrallen hinterlassen oft Spuren. Katzen ziehen ihre Krallen beim normalen Gehen meist ein. Auf weichem Boden oder beim Abspringen können auch Katzenkrallen Spuren hinterlassen.',
      ],
      diagram: 'paws',
      tasks: [
        task('Das Skelett im Lückentext', map([
          ['Der … schützt das Gehirn.', 'Schädel'],
          ['Die … setzt sich im Schwanz fort.', 'Wirbelsäule'],
          ['Die … schützen mit dem Brustkorb Herz und Lunge.', 'Rippen'],
          ['Das … verbindet die Hinterbeine mit dem Rumpf.', 'Becken'],
          ['Der tiefe Knick am Hinterbein liegt am …', 'Sprunggelenk'],
        ], [4, 1, 3, 0, 2]), 'Bei Hund und Katze liegen Knie und Sprunggelenk an verschiedenen Stellen. Das hoch stehende Fersenbein gehört zum Bereich des Sprunggelenks.'),
        task('Pfotenspur beschriften', [
          choice('A · Teil oberhalb eines kleinen Ballens', 'Krallenabdruck', 'Mittelballen', 'Krallenabdruck', 'Zehenballen'),
          choice('B · Eines der vier kleinen Polster', 'Zehenballen', 'Krallenabdruck', 'Zehenballen', 'Mittelballen'),
          choice('C · Das große Polster hinter den Zehen', 'Mittelballen', 'Mittelballen', 'Krallenabdruck', 'Zehenballen'),
          choice('Bei welcher Spur siehst du hier Krallen?', 'Linke Spur', 'Rechte Spur', 'Linke Spur', 'Bei beiden'),
        ], 'Die linke Spur ist typisch für einen Hund. Die rechte Spur passt zu einer Katze mit eingezogenen Krallen. Zeichne beide Spuren anschließend selbst und beschrifte sie.'),
        {...task('Zehengang mit Lösungswort', map(pawTerms, [4, 3, 2, 0, 1]), 'Ballen dämpfen beim Auftreten. Krallen geben dem Hund auf weichem Untergrund Halt.'), word: 'ZEHEN'},
        writing('Sohlen- und Zehengang vergleichen', 'Wenn du magst, gehe ein paar Schritte normal und dann auf den Zehenspitzen. Was hörst und spürst du? Was hilft dem Hund beim schnellen Laufen?',
          'Auf den Zehenspitzen können meine Schritte leiser sein, und ich spüre meine Waden stärker. Beim Hund ist der ganze Bewegungsapparat an den Zehengang angepasst. Das verlängert die wirksame Beinlänge. Kräftige Hinterbeine sorgen für Vortrieb, Ballen dämpfen die Landung.'),
      ],
      links: [[animal('dog/motion'), 'Laufbewegung beim Hund'], [animal('cat/motion'), 'Katzensprung ansehen'], [main('klassenarbeit/hund'), 'Hundeskelett beschriften'], ['#schulstoff/katze', 'Knochen von Hund und Katze vergleichen']],
    },
    katze: {
      title: 'Körperbau und Gebiss der Katze', source: 'Arbeitsblatt Körperbau und Gebiss der Katze · Bioskop 1, S. 25 und 34–37',
      intro: 'Übertrage zwölf Markierungen vom Hund auf die Katze. Erkläre dann, welche Merkmale beim Anschleichen, Springen und Fressen helfen.',
      facts: [
        'Hund und Katze haben denselben Grundbauplan. Am Vorderbein folgen auf das Schulterblatt der Oberarm, Elle und Speiche und die Vorderpfote. Am Hinterbein folgen auf das Becken Oberschenkel, Schien- und Wadenbein und die Hinterpfote.',
        'Die Hauskatze stammt von der Falbkatze ab. In der Nähe früher Siedlungen fanden diese Wildkatzen Beutetiere wie Mäuse. Katzenjunge sind Nesthocker. Sie werden mit geschlossenen Augen geboren und sind zunächst auf die Mutter angewiesen.',
        'Eine Katze jagt meist allein. Sie ortet Beute mit beweglichen Ohren, schleicht auf gepolsterten Pfoten und springt aus kurzer Entfernung. Kräftige Hinterbeine und die bewegliche Wirbelsäule helfen beim Sprung. Einziehbare Krallen bleiben beim Gehen geschont und können beim Festhalten ausgefahren werden.',
        'Bei schwachem Licht weiten sich die Pupillen. So gelangt mehr Licht ins Auge. In völliger Dunkelheit helfen Gehör und Tasthaare bei der Orientierung. Hund und Wolf können bei der Verfolgung ihre Laufleistung und ihren Geruchssinn nutzen.',
      ],
      diagram: 'skeletons',
      tasks: [
        task('Markierungen an Hund und Katze zuordnen', catOrder.map((index, i) =>
          choice('Katze ' + String.fromCharCode(65 + i), String(index + 1), ...skeletonTerms.map((_, j) => String(j + 1)))),
        'Beide Skelette zeigen dieselbe Reihenfolge der Knochen an Vorder- und Hinterbein.', 'Suche erst die großen Orientierungspunkte: Kopf, Rücken, Schulter und Becken.'),
        task('Die zwölf Teile benennen', match(skeletonTerms.map((term, i) => ['Hund ' + (i + 1), term]),
          [...skeletonTerms].sort((a, b) => a.localeCompare(b, 'de'))), 'Der Fersenbereich liegt tiefer als das Knie. Elle und Speiche liegen am Vorderbein, Schien- und Wadenbein am Hinterbein.'),
        task('Merkmale der Katze erklären', [
          choice('Womit packt eine Katze Beute?', 'Eckzähne', 'Schneidezähne', 'Eckzähne', 'Hinterste Mahlflächen'),
          choice('Welche kleinen Zähne sitzen ganz vorn vor den Fangzähnen?', 'Schneidezähne', 'Reißzähne', 'Schneidezähne', 'Hintere Backenzähne'),
          choice('Womit zerschneidet sie Fleisch?', 'Reißzähne', 'Schneidezähne', 'Eckzähne', 'Reißzähne'),
          choice('Was unterstützen kräftige Hinterbeine besonders?', 'Den Absprung', 'Die Geruchswahrnehmung', 'Den Absprung', 'Das Zerschneiden der Nahrung'),
          choice('Was geschieht bei wenig Licht?', 'Die Pupillen werden weiter.', 'Die Pupillen werden weiter.', 'Die Pupillen werden schmaler.', 'Die Pupillen schließen sich.'),
        ], 'Spitze Fangzähne packen. Scharfe Reißzähne schneiden. Kleine Schneidezähne sitzen vorne vor den Fangzähnen.'),
        writing('Jagdweisen vergleichen', 'Erkläre je zwei Merkmale, die der Katze beim Anschleichen und Springen und dem Wolf bei der Verfolgung helfen.',
          'Weiche Ballen machen die Schritte der Katze leise. Ihre kräftigen Hinterbeine ermöglichen einen schnellen Absprung. Der Wolf kann eine Spur mit der Nase aufnehmen. Kräftige Beine und der Zehengang helfen ihm beim schnellen, ausdauernden Laufen.'),
      ],
      links: [[main('klassenarbeit/katze'), 'Katzenskelett beschriften'], [main('klassenarbeit/gebiss/katze'), 'Katzengebiss beschriften'], [animal('cat/hunt'), 'Schleichjagd entdecken'], [animal('cat/origin'), 'Abstammung der Katze']],
    },
    sinne: {
      title: 'Sinne, Körpersprache und Hunde im Einsatz', source: 'Heftnotizen „Hunde haben Berufe“ und Bioskop 1, S. 27, 31, 34–35, 37',
      intro: 'Lies mehrere Signale zusammen. Finde heraus, wie der Geruchssinn eines Hundes bei verschiedenen Aufgaben hilft.',
      facts: [
        'Die Riechschleimhaut des Hundes bietet eine größere Fläche als beim Menschen. Dort nehmen Riechzellen Duftstoffe auf und senden Signale ans Gehirn. Ein trainierter Suchhund kann dadurch einer Geruchsspur folgen oder einen bestimmten Geruch anzeigen.',
        'Rettungshunde suchen vermisste Menschen, auch bei Einsätzen der Feuerwehr. Spürhunde bei Polizei oder Bundeswehr können bestimmte Gerüche anzeigen. Hütehunde lenken Herden. Jagdhunde können Wild aufspüren oder apportieren.',
        'Assistenzhunde unterstützen eine Person im Alltag. Ein Blindenführhund ist ein Assistenzhund. Therapiehunde begleiten Fachkräfte bei therapeutischen Angeboten. Je nach Aufgabe sind verschiedene Fähigkeiten und gezieltes Training nötig.',
        'Achte auf Ohren, Blick, Maul, Fell, Rute und Körperhaltung. Vorderkörper tief, Hinterteil hoch und lockere Bewegungen können beim Hund Spiel ankündigen. Ducken, angelegte Ohren und eingezogene Rute können Angst zeigen. Ein steifer Körper mit hochgezogenen Lippen kann eine Drohung sein.',
        'Eine Katze kann bei einer freundlichen Begrüßung den Schwanz aufrecht tragen. Heftiges Schwanzschlagen zusammen mit angelegten Ohren kann Anspannung zeigen. Ein einzelnes Signal ist mehrdeutig. Bei Rückzug, Knurren oder Fauchen gibst du dem Tier Raum.',
      ],
      tasks: [
        task('Welche Aufgabe passt?', map([
          ['Eine verschüttete Person finden', 'Rettungshund'],
          ['Einen vorher trainierten Geruch anzeigen', 'Spürhund'],
          ['Eine Schafherde lenken', 'Hütehund'],
          ['Einer blinden Person auf Wegen helfen', 'Blindenführhund'],
          ['Mit einer Fachkraft eine Therapiestunde begleiten', 'Therapiehund'],
        ], [3, 4, 0, 2, 1]), 'Rettungs- und Spürhunde arbeiten mit Gerüchen. Blindenführhunde lernen andere Aufgaben, etwa Hindernisse zu umgehen.'),
        task('Körpersprache lesen', [
          choice('Hund mit Vorderkörper tief, Hinterteil hoch und lockerer Haltung', 'Spielaufforderung', 'Drohen', 'Spielaufforderung', 'Rückzug'),
          choice('Hund geduckt, Ohren angelegt, Rute eingezogen', 'Angst oder Unsicherheit', 'Angst oder Unsicherheit', 'Entspannt', 'Spielaufforderung'),
          choice('Hund mit steifem Körper und sichtbaren Zähnen, der knurrt', 'Drohsignal', 'Freude', 'Jagd auf Beute', 'Drohsignal'),
          choice('Hund richtet die Ohren auf ein Geräusch, sein Körper bleibt locker', 'Aufmerksam', 'Rückzug', 'Aufmerksam', 'Drohsignal'),
          choice('Katze duckt sich, faucht und weicht zurück. Was passt?', 'Abstand und einen freien Rückweg geben.', 'Schnell streicheln.', 'Abstand und einen freien Rückweg geben.', 'Den Weg versperren.'),
        ], 'Ein Verhalten deutest du anhand mehrerer Signale und der Situation. Geduckt allein kann eine Katze beispielsweise auch beim Anschleichen sein.'),
        writing('Vom Aufbau zur Funktion', 'Erkläre, wie die Nase einem Rettungshund hilft. Verwende die Begriffe Riechschleimhaut, Riechzellen und Gehirn.',
          'In der großen Riechschleimhaut sitzen viele Riechzellen. Sie reagieren auf Duftstoffe und leiten Signale ans Gehirn weiter. Ein trainierter Hund kann den Geruch von Menschen erkennen, ihm folgen und einen Fund anzeigen.'),
        writing('Eine Begegnung deuten', 'Ein Hund wedelt und senkt locker den Vorderkörper. Die Katze legt die Ohren an und zieht sich zurück. Beschreibe beide Tiere. Was könnten ihre Signale bedeuten?',
          'Die lockere Spielverbeugung des Hundes deutet auf eine Einladung zum Spielen hin. Die Katze weicht zurück und legt die Ohren an. Sie möchte wahrscheinlich Abstand. Eine ähnliche Schwanzbewegung kann bei verschiedenen Tieren etwas anderes bedeuten.'),
      ],
      links: [[animal('dog/signals'), 'Hundesignale beobachten'], [animal('cat/signals'), 'Katzensignale beobachten'], ['#schulstoff/wolf', 'Zu Wolf und Hund']],
    },
    bewegung: {
      title: 'Skelett, Knochen, Gelenke und Muskeln', source: 'Heft und Arbeitsblätter zum Bewegungssystem · Bioskop 1, S. 231–233',
      intro: 'Erkläre, wie Knochen, Gelenke und Muskeln zusammenarbeiten. Vergleiche die Wirbelsäulen von Mensch, Hund, Giraffe und Ringelnatter.',
      facts: [
        'Der Schädel schützt das Gehirn. Der Brustkorb umgibt Herz und Lunge. Das Becken trägt und leitet Gewicht auf die Beine weiter. Arm und Bein folgen einem ähnlichen Grundmuster: ein langer Knochen oben, zwei darunter, danach viele kleinere Hand- oder Fußknochen.',
        'Die fünf Wirbelsäulenabschnitte sind Hals (7), Brust (12), Lende (5), Kreuzbein (5 verwachsene Wirbel) und Steißbein (meist 3–5 Wirbel). Vier Steißwirbel ergeben insgesamt 33. Die 32 im Heft ergeben sich, wenn du mit drei Steißwirbeln rechnest.',
        'Die doppelte S-Form hilft beim aufrechten Stehen und federt zusammen mit Bandscheiben Belastungen ab. Im Wirbelkanal liegt das Rückenmark. Zwischen den Wirbeln treten Nerven aus. Typische Halswirbel besitzen kleine Öffnungen in den Querfortsätzen. Brustwirbel tragen Rippen. Lendenwirbel haben kräftige Wirbelkörper.',
        'Beim Hund verläuft der Rumpfabschnitt der Wirbelsäule überwiegend waagerecht. Die Giraffe hat wie der Mensch sieben Halswirbel, die bei ihr viel länger sind. Die Ringelnatter hat viele beweglich verbundene Wirbel. Das hilft ihr beim Schlängeln.',
        'Beim Röhrenknochen schützen und stabilisieren die kompakte Knochenschicht und die inneren Knochenbälkchen. Die Knochenhaut enthält Blutgefäße und Nerven. Im roten Knochenmark entstehen Blutzellen. Knochen werden laufend umgebaut und können sich an Belastungen anpassen.',
        'Gelenkkopf und Gelenkpfanne passen aufeinander. Knorpel und Gelenkschmiere erleichtern das Gleiten. Die Gelenkkapsel umhüllt das Gelenk. Bänder verbinden Knochen mit Knochen. Sehnen übertragen Muskelkraft auf Knochen. Unter der Muskelhülle liegen Muskelfaserbündel aus einzelnen Muskelfasern.',
      ],
      tasks: [
        task('Hand und Fuß zuordnen', map([
          ['Kleine Knochen direkt am Handgelenk', 'Handwurzelknochen'],
          ['Knochen in der Handfläche', 'Mittelhandknochen'],
          ['Knochen in den Fingern', 'Fingerknochen'],
          ['Knochen zwischen Fußwurzel und Zehen', 'Mittelfußknochen'],
          ['Unterarmknochen auf der Daumenseite', 'Speiche'],
          ['Unterarmknochen auf der Kleinfingerseite', 'Elle'],
        ], [3, 5, 0, 2, 4, 1]), 'Die Hand gliedert sich in Handwurzel, Mittelhand und Finger. Der Fuß gliedert sich ähnlich in Fußwurzel, Mittelfuß und Zehen.'),
        task('Wirbelsäule und Wirbeltypen', [
          ...map([
            ['Abschnitt 1 · ganz oben', 'Halswirbelsäule'],
            ['Abschnitt 2', 'Brustwirbelsäule'],
            ['Abschnitt 3', 'Lendenwirbelsäule'],
            ['Abschnitt 4', 'Kreuzbein'],
            ['Abschnitt 5 · ganz unten', 'Steißbein'],
          ], [3, 2, 0, 4, 1]),
          choice('Welcher Wirbeltyp ist in der Buchzeichnung B dargestellt?', 'Halswirbel', 'Brustwirbel', 'Lendenwirbel', 'Halswirbel'),
          choice('Welcher Wirbeltyp ist in der Buchzeichnung C dargestellt?', 'Brustwirbel', 'Lendenwirbel', 'Brustwirbel', 'Halswirbel'),
          choice('Welcher Wirbeltyp ist in der Buchzeichnung A dargestellt?', 'Lendenwirbel', 'Lendenwirbel', 'Brustwirbel', 'Halswirbel'),
        ], 'In der Buchzeichnung auf S. 233 hat B Öffnungen in den Querfortsätzen. A ist kräftig gebaut. C gehört zu den Wirbeln, an denen Rippen ansetzen.'),
        task('Gelenke, Knochen und Muskeln', [
          ...map([
            ['Schulter und Hüfte', 'Kugelgelenk'],
            ['Daumenwurzel', 'Sattelgelenk'],
            ['Drehung zwischen erstem und zweitem Halswirbel', 'Drehgelenk'],
            ['Fingermittelgelenk', 'Scharniergelenk'],
          ], [2, 3, 0, 1]),
          choice('Was füllt den Gelenkspalt?', 'Gelenkschmiere', 'Knochenmark', 'Gelenkschmiere', 'Muskelfasern'),
          choice('Was verbindet Muskel und Knochen?', 'Sehne', 'Band', 'Knorpel', 'Sehne'),
          choice('Was umschließt den Gelenkraum?', 'Gelenkkapsel', 'Sehne', 'Gelenkkapsel', 'Bandscheibe'),
          choice('Wo entstehen Blutzellen?', 'Im roten Knochenmark', 'Im Gelenkspalt', 'Im roten Knochenmark', 'In der Knochenhaut'),
        ], 'Schulter und Hüfte sind Kugelgelenke. Das obere Sprunggelenk wirkt vor allem wie ein Scharnier. Der Ellenbogen hat einen Scharnieranteil und ist auch an der Drehbewegung des Unterarms beteiligt.'),
        writing('Vier Wirbelsäulen vergleichen', 'Beschreibe je ein Merkmal der Wirbelsäule von Mensch, Hund, Ringelnatter und Giraffe. Erkläre, wozu es passt.',
          'Beim Menschen hilft die doppelte S-Form beim aufrechten Gehen. Beim Hund verbindet der überwiegend waagerechte Rumpfabschnitt Vorder- und Hinterkörper. Die Ringelnatter schlängelt mit vielen beweglich verbundenen Wirbeln. Die langen Halswirbel der Giraffe ermöglichen es ihr, hoch gelegene Blätter zu erreichen.'),
      ],
      links: [[main('klassenarbeit/mensch'), 'Skelett des Menschen beschriften'], [main('learn/spine'), 'Wirbelsäulen-Labor'], [main('learn/bone'), 'Röhrenknochen erkunden'], [main('learn/joints'), 'Gelenke erkunden'], [main('learn/muscles'), 'Muskeln erkunden']],
    },
    haustier: {
      title: 'Ein Hund als Haustier?', source: 'Bioskop 1, S. 28–29 · Gewichten und begründen',
      intro: 'Stell dir eine Familie in einer Kleinstadt mit kleinem Garten vor. Felder und Wald sind etwas weiter entfernt. Welchen Bedürfnissen eines Hundes kann die Familie im Alltag gerecht werden?',
      facts: [
        'Lies die drei Steckbriefe. Entscheide, was der Familie wichtig ist. Wähle pro Merkmal eine Gewichtung von 1 (weniger wichtig) bis 3 (sehr wichtig) und gib jedem Hund 1 bis 4 Punkte dafür, wie gut er zum Beispielhaushalt passt.',
        'Die App multipliziert Punkte × Gewichtung und addiert die Werte. Ändere danach ein besonders wichtiges Merkmal und beobachte, ob sich das Ergebnis ändert. Gesundheit, Bedürfnisse und Verhalten unterscheiden sich auch zwischen einzelnen Hunden derselben Rasse.',
      ],
      matrix: true,
      tasks: [
        writing('Die Entscheidung begründen', 'Welcher Hund passt nach deiner Tabelle am besten zur Familie? Begründe mit zwei Kriterien. Was müsste die Familie vor einer echten Entscheidung noch klären?',
          'In meiner Tabelle zählt die Haltung besonders stark. Die Familie sollte klären, wie viel Bewegung sie täglich ermöglichen und wie sie Pflege und Kosten übernehmen kann. Die Punktzahl ergibt sich aus meinen Gewichten und Bewertungen und kann sich bei einer anderen Familie ändern.'),
      ],
      links: [['#schulstoff/wolf', 'Domestikation und Zucht'], ['#schulstoff/sinne', 'Hunde im Einsatz']],
    },
  };

  const stationIds = ['wolf', 'gebiss', 'pfote'];
  const referenceLinks = [
    ['Zahnzahl und Zahnformen · Merck Veterinary Manual', 'https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals'],
    ['Wirbelsäule · Institut für Qualität und Wirtschaftlichkeit im Gesundheitswesen', 'https://www.ncbi.nlm.nih.gov/books/NBK279468/'],
    ['Wolfsfamilien · DBBW', 'https://www.dbb-wolf.de/mehr/faq/faq-biologie-des-wolfes'],
    ['Abstammung der Hauskatze · Library of Congress', 'https://www.loc.gov/everyday-mysteries/browse-all-questions/item/how-did-cats-become-domesticated/'],
    ['Körpersprache beim Hund · RSPCA', 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding'],
    ['Gesundheit beim Chihuahua · VCA Animal Hospitals', 'https://vcahospitals.com/knowles-snapper-creek/know-your-pet/luxating-patella-in-dogs'],
    ['Medikamentenempfindlichkeit · VCA Animal Hospitals', 'https://vcahospitals.com/know-your-pet/multidrug-resistance-mutation-'],
    ['Hüftgelenk · VCA Animal Hospitals', 'https://vcahospitals.com/roberts/know-your-pet/joint-subluxations-in-dogs'],
    ['Körpersprache bei der Katze · RSPCA', 'https://www.rspca.org.uk/adviceandwelfare/pets/cats/behaviour'],
  ];

  const badges = {
    wolf: 'Station 1',
    gebiss: 'Station 2',
    pfote: 'Station 3',
    katze: 'Arbeitsblatt',
    sinne: 'Buch und Heft',
    bewegung: 'Buch, Heft und Arbeitsblätter',
    haustier: 'Bewertungstabelle',
  };

  function shortcuts(links) {
    return '<div class="bs-links">' + links.map(([url, label]) =>
      '<a href="' + escape(url) + '">' + escape(label) + '</a>').join('') + '</div>';
  }

  function linkCard(title, description, links) {
    return '<aside class="bs-panel bs-context"><strong>' + escape(title) + '</strong><p>' +
      escape(description) + '</p>' + shortcuts(links) + '</aside>';
  }

  const movementTasks = {hand: 0, wirbelsaeule: 1, gelenke: 2};

  function forTopic(topic) {
    if (topic === 'skeleton') {
      return linkCard('Vom Skelett zum Körperbau', 'Vergleiche Hand und Fuß oder finde dieselben Knochen bei Hund und Katze.',
        [[school('bewegung/hand'), 'Hand und Fuß zuordnen'], [school('katze'), 'Hund und Katze zuordnen']]);
    }
    const task = {spine: 'wirbelsaeule', bone: 'gelenke', joints: 'gelenke', muscles: 'gelenke'}[topic];
    if (!task) return '';
    return linkCard('Mit dem Schulstoff üben', 'Bearbeite die Aufgaben zu Wirbelsäule, Knochen, Gelenken und Muskeln.',
      [[school('bewegung/' + task), 'Zu den Aufgaben']]);
  }

  function forAnimal(section, species) {
    const targets = {
      skeleton: ['katze', 'pfote'],
      origin: species === 'cat' ? ['katze', 'wolf'] : ['wolf', 'haustier'],
      teeth: species === 'cat' ? ['katze', 'gebiss'] : ['gebiss', 'katze'],
      hunt: species === 'cat' ? ['katze', 'sinne'] : ['wolf', 'sinne'],
      motion: ['pfote', 'katze'],
      signals: ['sinne'],
      compare: ['katze', 'gebiss'],
      quiz: [],
    };
    const selected = (targets[section] || []).map(id => [school(id), lessons[id].title]);
    return linkCard('Aufgaben aus Buch und Heft', 'Übe passend zu dieser Lernstation.',
      [...selected, [school(), 'Alle Aufgaben']]);
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  }

  function saveLesson(id, values) {
    try {
      const progress = readProgress();
      progress[id] = values;
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Die Übungen bleiben auch ohne Browserspeicher nutzbar.
    }
  }

  function renderOverview() {
    const progress = readProgress();
    return `
      <section class="bs-panel">
        <h2>Stationsarbeit Hund</h2>
        <p>Beginne an einer beliebigen Station. Prüfe deine Antworten und trage die Lösungswörter in deinen Laufzettel ein.</p>
        <div class="bs-cards">
          ${stationIds.map(id => {
            const entry = progress[id] || {};
            const done = Object.values(entry.done || {}).filter(Boolean).length;
            return `<article class="bs-card"><small>${badges[id]}</small><h3><a href="#schulstoff/${id}">${lessons[id].title}</a></h3>
              <p>${done} von 4 Aufgaben bearbeitet</p>
              <p>${entry.word ? 'Lösungswort: <b>' + lessons[id].tasks[2].word + '</b>' : 'Lösungswort offen'}
              ${entry.rating ? ' · ' + escape(entry.rating) : ''}</p></article>`;
          }).join('')}
        </div>
      </section>
      <section class="bs-panel">
        <h2>Weitere Aufgaben aus Buch und Heft</h2>
        <div class="bs-cards">
          ${Object.entries(lessons).slice(3).map(([id, lesson]) =>
            `<article class="bs-card"><small>${badges[id]}</small><h3><a href="#schulstoff/${id}">${lesson.title}</a></h3>
              <p>${lesson.source}</p></article>`).join('')}
        </div>
      </section>
      <details class="bs-panel"><summary>Fachquellen</summary>
        ${shortcuts(referenceLinks.map(([label, href]) => [href, label]))}
      </details>`;
  }

  // Eigene Markierungen auf den bereits in der App verwendeten Skelettabbildungen.
  const points = {
    hund: [[85,62],[275,124],[455,77],[542,97],[555,168],[616,350],[613,440],[571,284],[372,168],[333,450],[347,331],[288,203]],
    katze: [[91,103],[233,112],[377,26],[506,60],[498,130],[585,281],[495,318],[528,235],[309,117],[275,314],[311,217],[273,161]],
  };
  const numberPositions = {
    hund: [[67,10],[239,13],[411,12],[568,12],[676,168],[686,344],[659,437],[678,263],[462,255],[323,493],[239,346],[175,218]],
    katze: [[69,31],[203,48],[351,13],[504,10],[646,111],[653,256],[628,330],[640,195],[375,167],[256,345],[218,228],[162,146]],
  };

  const skeletonFunctions = [
    'Umschließt und schützt das Gehirn. Der Kiefer trägt die Zähne.',
    'Hier setzt der Oberarm an. Muskeln verbinden das Schulterblatt mit dem Rumpf und bewegen es beim Laufen mit.',
    'Stützt den Rumpf, schützt das Rückenmark und setzt sich im Schwanz fort. Beim Sprung kann sich der Rücken beugen und strecken.',
    'Verbindet die Hinterbeine mit dem Rumpf. Über das Becken gelangt die Kraft aus den Hinterbeinen auf den Körper.',
    'Verbindet Hüfte und Knie. Die Muskeln am Oberschenkel strecken das Bein beim Absprung.',
    'Das Fersenbein gehört zum Sprunggelenk. Hier zieht die Achillessehne, wenn das Hinterbein den Körper abstößt.',
    'Zehen und Ballen setzen auf. Die Ballen polstern den Schritt.',
    'Die Knochen liegen zwischen Knie und Sprunggelenk. Das kräftigere Schienbein trägt den größeren Teil der Last.',
    'Die gebogenen Rippen bilden zusammen mit anderen Knochen den Brustkorb und schützen Herz und Lunge.',
    'Zehen und Ballen stützen das Tier. Die Vorderbeine nehmen bei der Landung einen großen Teil der Belastung auf.',
    'Elle und Speiche verbinden Ellenbogen und Vorderpfote. Sie stützen den Körper über die Vorderbeine.',
    'Der Oberarmknochen liegt zwischen Schulter und Ellenbogen. Beide Gelenke verändern beim Laufen den Winkel des Vorderbeins.',
  ];

  function skeletonImage(species, label, order, height) {
    const imageHeight = species === 'hund' ? 472 : 348;
    return `<figure class="bs-figure"><div class="bs-skeleton-scroll" aria-label="${label}, vergrößerbare Zeichnung"><div class="bs-skeleton-view" style="aspect-ratio:720/${height}"><svg viewBox="0 0 720 ${height}" role="img"
      aria-label="${label}, Seitenansicht mit zwölf markierten Bereichen">
      <rect width="720" height="${height}" rx="14" fill="white"/>
      <image href="Skelettbilder/${species}.webp" x="18" y="0" width="690" height="${imageHeight}"/>
      ${order.map((point, i) => {
        const [x, y] = points[species][point];
        const [mx, my] = numberPositions[species][point];
        const mark = species === 'hund' ? i + 1 : String.fromCharCode(65 + i);
        return `<g class="bs-annotation" data-bs-bone-line="${point}"><line x1="${x}" y1="${y}" x2="${mx}" y2="${my + 8}"/>
          <circle class="bs-dot" cx="${x}" cy="${y}" r="5"/><circle class="bs-mark" cx="${mx}" cy="${my + 8}" r="15"/>
          <text x="${mx}" y="${my + 14}">${mark}</text></g>`;
      }).join('')}</svg>${order.map((point, i) => {
        const [x, y] = numberPositions[species][point];
        const mark = species === 'hund' ? i + 1 : String.fromCharCode(65 + i);
        return `<button type="button" data-bs-bone="${point}" data-bs-animal="${species}"
          aria-label="${label} ${mark}" aria-pressed="false" tabindex="${i === 0 ? 0 : -1}"
          style="--x:${100*x/720}%;--y:${100*(y+8)/height}%"><span>${mark}</span></button>`;
      }).join('')}</div></div><figcaption>${label} · <a href="https://commons.wikimedia.org/wiki/File:${species === 'hund'
        ? 'SqueletteChienChauveau1990.jpg' : 'SqueletteChatChauveau1990.jpg'}">Bildquelle</a></figcaption></figure>`;
  }

  function pawShape(x, claws) {
    const toes = [[-41,69],[-16,48],[14,46],[40,64]];
    return `<g transform="translate(${x} 0)">
      ${toes.map(([tx, ty]) => `<ellipse cx="${tx}" cy="${ty}" rx="13" ry="16"/>
        ${claws ? `<path d="M${tx - 4} ${ty - 20}q4 -10 9 -13l1 14Z"/>` : ''}`).join('')}
      <path d="M-35 133C-35 123-27 117-17 107Q0 87 17 107C27 117 35 123 35 133Q36 149 0 146Q-36 149-35 133Z"/>
    </g>`;
  }

  function showDiagram(id) {
    if (id === 'skeletons') {
      return '<div class="bs-figures" data-bs-skeleton>' + skeletonImage('hund', 'Hund', skeletonTerms.map((_, i) => i), 527) +
        skeletonImage('katze', 'Katze', catOrder, 374) + '</div>' +
        '<div class="bs-skeleton-tools"><button type="button" class="bs-action" data-bs-bone-mode aria-pressed="false">Knochen am Bild entdecken</button>' +
        '<button type="button" class="bs-action bs-secondary" data-bs-skeleton-zoom aria-pressed="false">Bilder vergrößern</button></div>' +
        '<p data-bs-bone-result role="status">Schalte „Knochen am Bild entdecken“ ein und wähle eine Markierung. Mit den Pfeiltasten wechselst du zwischen den Markierungen eines Tiers.</p>';
    }
    if (id === 'paws') {
      return `<figure class="bs-figure bs-paws"><svg viewBox="0 0 360 177" role="img"
        aria-label="Zwei Pfotenabdrücke. A zeigt auf eine Spitze, B auf ein kleines Polster und C auf das große Polster der linken Spur.">
        <rect width="360" height="177" rx="12" fill="#eff7f2"/>
        <g fill="#608777">${pawShape(112, true)}${pawShape(259, false)}</g>
        ${[[96,17,58,22],[70,69,34,68],[112,125,55,134]].map(([x,y,mx,my],i) =>
          `<g class="bs-annotation"><line x1="${x}" y1="${y}" x2="${mx}" y2="${my}"/>
          <circle class="bs-mark" cx="${mx}" cy="${my}" r="12"/>
          <text x="${mx}" y="${my+5}">${'ABC'[i]}</text></g>`).join('')}
        </svg><figcaption>Typische Pfotenspuren, vereinfacht</figcaption></figure>`;
    }
    return '';
  }

  function input(question, name, value) {
    if (question.options) {
      return `<select name="${name}"><option value="">Auswählen</option>${question.options.map(option =>
        `<option${option === value ? ' selected' : ''}>${escape(option)}</option>`).join('')}</select>`;
    }
    return `<input name="${name}" type="${question.number ? 'number' : 'text'}"
      ${question.number ? 'min="0" max="99" step="1"' : 'maxlength="24"'}
      value="${escape(value || '')}" autocomplete="off">`;
  }

  function renderTask(entry, index, saved) {
    const prefix = 'task-' + index;
    if (!entry.questions) {
      return `<section class="bs-task"><h3>${index + 1}. ${entry.title}</h3>
        <label class="bs-write">${entry.prompt}<textarea name="${prefix}" rows="3">${escape(saved.answers[prefix] || '')}</textarea></label>
        <details class="bs-hint"><summary>Musterantwort zum Vergleichen</summary><p>${entry.sample}</p></details>
        <label class="bs-check"><input type="checkbox" data-bs-written="${index}"${saved.done[index] ? ' checked' : ''}>
          Antwort mit der Musterlösung verglichen</label></section>`;
    }
    const fields = entry.questions.map((question, i) => `<label class="bs-field"><span>${escape(question.prompt)}</span>
      ${input(question, prefix + '-' + i, saved.answers[prefix + '-' + i])}<small></small></label>`).join('');
    return `<form class="bs-task" data-bs-task="${index}"><h3>${index + 1}. ${entry.title}</h3>
      <div class="bs-fields${entry.table ? ' bs-counts' : ''}">${fields}
      ${entry.word ? `<label class="bs-field"><span>Lösungswort aus den Buchstaben</span>
        ${input({}, prefix + '-word', saved.answers[prefix + '-word'])}<small></small></label>` : ''}</div>
      ${entry.hint ? `<details class="bs-hint"><summary>Tipp anzeigen</summary><p>${entry.hint}</p></details>` : ''}
      <button type="submit" class="bs-action">Antworten prüfen</button>
      <p class="bs-result" role="status">${saved.done[index] ? '✓ Schon einmal richtig gelöst.' : ''}</p>
      </form>`;
  }

  const breeds = [
    ['Kurzhaar-Chihuahua', 'Mexiko · 15–23 cm · 1,5–3 kg', 'Klein und leicht. Braucht tägliche Bewegung, Zuwendung und einen geschützten Ruheplatz.', 'Bei kleinen Hunden wie dem Chihuahua kann die Kniescheibe leichter aus ihrer Führung rutschen.'],
    ['Langhaar-Collie', 'Großbritannien · ca. 50–60 cm · 25–30 kg', 'Braucht Bewegung und Beschäftigung. Das lange Fell muss regelmäßig gepflegt werden.', 'Einige Collies reagieren erblich bedingt besonders empfindlich auf bestimmte Medikamente.'],
    ['Deutscher Schäferhund', 'Deutschland · ca. 55–65 cm · 25–40 kg', 'Groß und kräftig. Braucht täglich Bewegung, Beschäftigung und Training.', 'Bei Schäferhunden können Fehlentwicklungen des Hüftgelenks vorkommen.'],
  ];
  const criteria = ['Aussehen', 'Herkunft', 'Schulterhöhe', 'Gewicht', 'Wesen', 'Gesundheit', 'Haltung'];
  const examples = [[2,3,4,2],[1,1,1,1],[1,2,1,1],[2,2,2,2],[3,4,4,3],[2,3,1,1],[3,4,3,3]];

  function renderMatrix() {
    return `<section class="bs-panel"><h2>Steckbriefe vergleichen</h2>
      <div class="bs-cards">${breeds.map(([name, size, note, health]) => `<article class="bs-card"><h3>${name}</h3>
        <p><b>${size}</b></p><p>${note}</p><p>${health}</p></article>`).join('')}</div>
      <h2>Bewertungstabelle</h2>
      <div class="bs-links"><button type="button" class="bs-action" data-bs-matrix="example">Rechenbeispiel laden</button>
        <button type="button" class="bs-action bs-secondary" data-bs-matrix="clear">Tabelle leeren</button></div>
      <div class="bs-table-wrap" tabindex="0" role="region" aria-label="Bewertungstabelle mit horizontalem Scrollen">
      <table class="bs-table"><thead><tr><th scope="col">Merkmal</th><th scope="col">Gewicht<br>1–3</th>
      ${breeds.map(([name]) => `<th scope="col">${name}<br>Punkte · Wert</th>`).join('')}</tr></thead>
      <tbody>${criteria.map((criterion, row) => `<tr><th scope="row">${criterion}</th>
        <td><select data-bs-cell="${row}-0" aria-label="Gewicht für ${criterion}"><option value="">–</option>
        ${[1,2,3].map(n => `<option>${n}</option>`).join('')}</select></td>
        ${breeds.map(([name], i) => `<td><div class="bs-score"><select data-bs-cell="${row}-${i+1}" aria-label="Punkte für ${criterion}, ${name}">
          <option value="">–</option>${[1,2,3,4].map(n => `<option>${n}</option>`).join('')}</select>
          <span data-bs-value="${row}-${i+1}">–</span></div></td>`).join('')}</tr>`).join('')}</tbody>
      <tfoot><tr><th scope="row" colspan="2">Summe</th>${breeds.map((_, i) => `<td data-bs-sum="${i+1}">–</td>`).join('')}</tr></tfoot></table></div>
      <p class="bs-result" data-bs-matrix-result role="status"></p>
      <section class="bs-matrix-chart" aria-label="Punktesummen im Vergleich">
        ${breeds.map(([name], i) => `<div><b>${name}</b><div class="bs-bar-track" aria-hidden="true"><span data-bs-bar="${i}"></span></div>
          <output data-bs-bar-value="${i}">–</output></div>`).join('')}
      </section>
    </section>`;
  }

  function bindMatrix(root, saved, save) {
    const fields = [...root.querySelectorAll('[data-bs-cell]')];
    const rows = criteria.map((_, i) => fields.slice(i * 4, (i + 1) * 4));
    fields.forEach(field => { field.value = saved.matrix?.[field.dataset.bsCell] || ''; });
    function update() {
      const sums = [0, 0, 0];
      const completed = [0, 0, 0];
      saved.matrix = Object.fromEntries(fields.map(field => [field.dataset.bsCell, field.value]));
      rows.forEach(([weight, ...scores]) => scores.forEach((score, index) => {
        const value = Number(weight.value) * Number(score.value);
        root.querySelector('[data-bs-value="' + score.dataset.bsCell + '"]').textContent = value || '–';
        sums[index] += value;
        completed[index] += Number(value > 0);
      }));
      sums.forEach((sum, i) => {
        const value = completed[i] ? sum : '–';
        root.querySelector('[data-bs-sum="' + (i + 1) + '"]').textContent = value;
        root.querySelector('[data-bs-bar-value="' + i + '"]').textContent = value;
        root.querySelector('[data-bs-bar="' + i + '"]').style.width = (sum / (criteria.length * 3 * 4) * 100) + '%';
      });
      const result = root.querySelector('[data-bs-matrix-result]');
      if (completed.every(total => total === criteria.length)) {
        const leaders = breeds.filter((_, i) => sums[i] === Math.max(...sums)).map(([name]) => name);
        result.textContent = (leaders.length > 1 ? 'Gleichstand an der Spitze: ' : 'Höchste Punktzahl: ') + leaders.join(' und ') + '. Begründe deine Bewertung.';
      } else {
        result.textContent = 'Ergänze alle Gewichte und Punkte. Bis dahin siehst du Zwischensummen.';
      }
    }
    update();
    fields.forEach(field => field.addEventListener('change', () => { update(); save(); }));
    root.querySelectorAll('[data-bs-matrix]').forEach(button => button.addEventListener('click', () => {
      rows.forEach((row, i) => row.forEach((field, j) => {
        field.value = button.dataset.bsMatrix === 'example' ? examples[i][j] : '';
      }));
      update();
      save();
    }));
  }

  function bindSkeleton(root) {
    const figures = root.querySelector('[data-bs-skeleton]');
    if (!figures) return;
    const controls = root.querySelector('[data-bs-bone-mode]');
    const zoom = root.querySelector('[data-bs-skeleton-zoom]');
    const reading = root.querySelector('[data-bs-bone-result]');
    const instruction = reading.textContent;
    const buttons = [...figures.querySelectorAll('[data-bs-bone]')];
    const show = bone => {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.bsBone === bone)));
      figures.querySelectorAll('[data-bs-bone-line]').forEach(mark =>
        mark.classList.toggle('bs-active-bone', mark.dataset.bsBoneLine === bone));
      reading.textContent = bone === undefined ? instruction : skeletonTerms[bone] + '. ' + skeletonFunctions[bone];
    };
    controls.addEventListener('click', () => {
      const on = controls.getAttribute('aria-pressed') !== 'true';
      controls.setAttribute('aria-pressed', String(on));
      controls.textContent = on ? 'Beschriftungen ausblenden' : 'Knochen am Bild entdecken';
      figures.classList.toggle('bs-skeleton-active', on);
      show();
      if (on) reading.textContent = 'Tippe eine Markierung an. Der gleiche Knochen leuchtet bei beiden Tieren auf.';
    });
    zoom.addEventListener('click', () => {
      const on = figures.classList.toggle('bs-skeleton-large');
      zoom.setAttribute('aria-pressed', String(on));
      zoom.textContent = on ? 'Bilder verkleinern' : 'Bilder vergrößern';
      figures.querySelectorAll('.bs-skeleton-scroll').forEach(view => {
        if (on) view.tabIndex = 0;
        else {
          view.removeAttribute('tabindex');
          view.scrollLeft = 0;
        }
      });
    });
    figures.addEventListener('click', event => {
      const button = event.target.closest('[data-bs-bone]');
      if (!button) return;
      buttons.filter(peer => peer.dataset.bsAnimal === button.dataset.bsAnimal)
        .forEach(peer => { peer.tabIndex = peer === button ? 0 : -1; });
      show(button.dataset.bsBone);
    });
    figures.addEventListener('keydown', event => {
      const delta = {ArrowLeft:-1, ArrowUp:-1, ArrowRight:1, ArrowDown:1}[event.key];
      if (!delta || !event.target.matches('[data-bs-bone]')) return;
      event.preventDefault();
      const peers = buttons.filter(button => button.dataset.bsAnimal === event.target.dataset.bsAnimal);
      const next = peers[(peers.indexOf(event.target) + delta + peers.length) % peers.length];
      event.target.tabIndex = -1;
      next.tabIndex = 0;
      next.focus();
    });
  }

  function bindLesson(root, id, lesson, saved) {
    const save = () => saveLesson(id, saved);
    root.querySelectorAll('[data-bs-task]').forEach(form => {
      const index = Number(form.dataset.bsTask);
      const entry = lesson.tasks[index];
      const inputs = [...form.querySelectorAll('select, input')];
      inputs.forEach(field => field.addEventListener('input', () => {
        saved.answers[field.name] = field.value;
        field.removeAttribute('aria-invalid');
        field.closest('label').querySelector('small').textContent = '';
        form.querySelector('.bs-result').textContent = '';
        save();
      }));
      form.addEventListener('submit', event => {
        event.preventDefault();
        const expected = entry.questions.map(question => question.correct);
        if (entry.word) expected.push(entry.word);
        let right = 0;
        let unanswered = 0;
        inputs.forEach((field, i) => {
          const value = field.value.trim();
          const correct = value.toLocaleUpperCase('de') === String(expected[i]).toLocaleUpperCase('de');
          saved.answers[field.name] = field.value;
          right += Number(correct);
          unanswered += Number(!value);
          field.setAttribute('aria-invalid', String(!correct));
          field.closest('label').querySelector('small').textContent = correct ? '✓ Richtig' : value ? 'Noch einmal prüfen' : 'Noch offen';
        });
        const allCorrect = right === expected.length;
        if (allCorrect) {
          saved.done[index] = true;
          if (entry.word) saved.word = true;
          save();
        }
        const result = form.querySelector('.bs-result');
        result.textContent = allCorrect ? '✓ ' + entry.reason + (entry.word ? ' Der Laufzettel zeigt dein Lösungswort.' : '') :
          right + ' von ' + expected.length + ' richtig. ' +
          (unanswered ? 'Ergänze die offenen Felder und prüfe erneut.' : 'Sieh dir die markierten Felder noch einmal an.');
      });
    });
    root.querySelectorAll('textarea').forEach(field => field.addEventListener('input', () => {
      saved.answers[field.name] = field.value;
      save();
    }));
    root.querySelectorAll('[data-bs-written]').forEach(box => box.addEventListener('change', () => {
      saved.done[box.dataset.bsWritten] = box.checked;
      save();
    }));
    root.querySelector('[data-bs-rating]')?.addEventListener('change', event => {
      saved.rating = event.target.value;
      save();
    });
    if (lesson.matrix) bindMatrix(root, saved, save);
  }

  function mount(root, id, target) {
    const lesson = Object.hasOwn(lessons, id) ? lessons[id] : undefined;
    if (!lesson) {
      root.innerHTML = '<div class="bs-school"><header class="bs-heading"><h1>Schulstoff & Stationsarbeit</h1>' +
        '<p>Aufgaben aus Buch, Heft und Arbeitsblättern zur Vorbereitung auf die Klassenarbeit.</p></header>' +
        renderOverview() + '</div>';
      return;
    }
    const saved = readProgress()[id] || {};
    saved.answers ||= {};
    saved.done ||= {};
    const rating = ['🟢 Kann ich erklären', '🟡 Ich bin noch unsicher', '🔴 Das übe ich noch'];
    root.innerHTML = `<div class="bs-school"><header class="bs-heading"><a href="#schulstoff">← Zum Laufzettel</a>
      <h1>${lesson.title}</h1><p>${lesson.source}</p></header>
      <section class="bs-panel"><h2>Das brauchst du</h2><p>${lesson.intro}</p>
        <details class="bs-hint"><summary>Lernwissen aufklappen</summary><ul>${lesson.facts.map(fact => `<li>${fact}</li>`).join('')}</ul></details>
        ${shortcuts(lesson.links)}</section>
      ${lesson.diagram ? `<section class="bs-panel"><h2>Schau genau hin</h2>${showDiagram(lesson.diagram)}</section>` : ''}
      ${window.BioLaborModelle?.has(id) ? '<section class="bm-section" data-bs-modelle></section>' : ''}
      ${lesson.matrix ? renderMatrix() : ''}
      <section class="bs-panel"><h2>Deine Aufgaben</h2>${lesson.tasks.map((entry, index) => renderTask(entry, index, saved)).join('')}</section>
      ${stationIds.includes(id) ? `<section class="bs-panel"><h2>Wie sicher bist du?</h2>
        <label class="bs-field"><span>Meine Einschätzung für den Laufzettel</span><select data-bs-rating><option value="">Auswählen</option>
          ${rating.map(level => `<option${level === saved.rating ? ' selected' : ''}>${level}</option>`).join('')}</select></label>
        ${shortcuts([['#schulstoff', 'Zurück zum Laufzettel']])}</section>` : ''}
    </div>`;
    bindLesson(root, id, lesson, saved);
    bindSkeleton(root);
    window.BioLaborModelle?.mount(root.querySelector('[data-bs-modelle]'), id);
    if (id === 'bewegung' && Object.hasOwn(movementTasks, target)) {
      const exercise = root.querySelector('[data-bs-task="' + movementTasks[target] + '"] h3');
      exercise.tabIndex = -1;
      requestAnimationFrame(() => {
        if (exercise.isConnected) exercise.focus();
      });
    }
  }

  window.BioLaborSchulstoff = {mount, forTopic, forAnimal, linkCard, school};
})();
