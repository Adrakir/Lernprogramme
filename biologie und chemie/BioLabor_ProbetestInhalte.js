(() => {
  'use strict';

  const skills = {
    skelett: ['Skelett und Knochen', '#klassenarbeit'],
    gebiss: ['Gebiss und Zahnfunktionen', '#schulstoff/gebiss'],
    pfote: ['Pfote und Zehengang', '#schulstoff/pfote'],
    herkunft: ['Abstammung und Zucht', '#schulstoff/wolf'],
    sinne: ['Geruchssinn', '#schulstoff/sinne'],
    pupillen: ['Katzenaugen bei Licht und Dunkelheit', '#schulstoff/katze'],
    koerper: ['Körpersprache', '#koerpersprache'],
    bewegung: ['Gelenke, Muskeln und Wirbelsäule', '#schulstoff/bewegung'],
  };
  const choice = (skill, prompt, options, correct, why, picture) =>
    ({skill, prompt, options, correct, why, picture});
  const pair = (skill, prompt, rows, options, why) => ({skill, prompt, rows, options, why});
  const write = (skill, prompt, criteria, sample) => ({skill, prompt, criteria, sample});
  const skeleton = (species, key, options, correct, why) =>
    choice('skelett', 'Welcher Knochenbereich ist markiert?', options, correct, why, ['bones', species, key]);
  const teeth = (species, key, options, correct, why) =>
    choice('gebiss', 'Welche Zahnart ist markiert?', options, correct, why, ['teeth', species, key]);

  const versions = [
    [
      skeleton('hund', 'shoulder', ['Becken', 'Schulterblatt', 'Rippen'], 1, 'Am Schulterblatt setzt der Oberarm an. Das Becken verbindet dagegen Rumpf und Hinterbeine.'),
      teeth('katze', 'carnassial', ['Reißzähne', 'Eckzähne', 'Schneidezähne'], 0, 'Die beiden markierten Backenzähne gleiten beim Zubeißen wie Scherenklingen aneinander vorbei.'),
      pair('pfote', 'Ordne Mensch, Hund und Katze die passende Beschreibung zu.', [['Mensch', 2], ['Hund', 0], ['Katze', 1]],
        ['Zehengang, Krallen bleiben sichtbar', 'Zehengang, Krallen beim Gehen meist eingezogen', 'Sohlengang'], 'Hund und Katze gehen auf den Zehen. Beim Menschen kann die Ferse aufsetzen.'),
      choice('herkunft', 'Wie entstanden viele unterschiedliche Hunderassen?', ['Hunde änderten im Laufe ihres Lebens absichtlich ihr Fell.', 'Menschen wählten Elterntiere mit bestimmten vererbbaren Merkmalen aus.', 'Alle Unterschiede entstanden beim Training.'], 1, 'Zucht wirkt über Generationen durch die Auswahl von Elterntieren. Training verändert, was ein einzelnes Tier kann.'),
      choice('sinne', 'Worauf reagieren Riechzellen in der Hundenase?', ['Auf Geräusche', 'Auf Farben', 'Auf Duftstoffe in der Luft'], 2, 'Riechzellen reagieren auf Duftstoffe und senden Signale ans Gehirn.'),
      choice('koerper', 'Eine Katze legt die Ohren an, faucht und weicht zurück. Was passt zu dieser Situation?', ['Sie möchte wahrscheinlich Abstand.', 'Sie lädt sicher zum Spielen ein.', 'Sie freut sich darauf, angefasst zu werden.'], 0, 'Angelegte Ohren, Fauchen und Zurückweichen weisen zusammen auf Unsicherheit und den Wunsch nach Abstand hin.'),
      pair('bewegung', 'Ordne den Teilen der Wirbelsäule ihre Aufgaben zu.', [['Brustwirbel', 1], ['Bandscheiben', 2], ['Wirbelkanal', 0]],
        ['Schützt das Rückenmark', 'Hier setzen die Rippen an', 'Verteilen Druck zwischen Wirbeln'], 'Die Wirbelsäule stützt den Körper, schützt das Rückenmark und bleibt durch ihre beweglichen Verbindungen biegsam.'),
      write('gebiss', 'Ein Hund packt ein zähes Stück Nahrung und schneidet es ab. Erkläre, welche Zähne dabei welche Aufgabe haben.',
        ['Eckzähne packen oder halten fest.', 'Reißzähne schneiden, weil ihre Kanten aneinander vorbeigleiten.'],
        'Die langen Eckzähne halten das Stück fest. Die Reißzähne gleiten beim Schließen wie Scherenklingen aneinander vorbei und schneiden das Stück ab.'),
      write('sinne', 'Erkläre, wie ein trainierter Rettungshund eine Geruchsspur verfolgen kann.',
        ['Riechzellen nehmen Duftstoffe auf und senden Signale ans Gehirn.', 'Das Gehirn verarbeitet die Signale. Der trainierte Hund erkennt den gesuchten Geruch und folgt ihm.'],
        'In der großen Riechschleimhaut reagieren Riechzellen auf Duftstoffe. Sie leiten Signale an das Gehirn weiter. Der trainierte Hund kann einen bestimmten Geruch erkennen und seiner Spur folgen.'),
    ],
    [
      skeleton('katze', 'femur', ['Vorderpfote', 'Schulterblatt', 'Oberschenkelknochen'], 2, 'Der Oberschenkelknochen liegt am Hinterbein zwischen Hüfte und Knie.'),
      teeth('hund', 'canine', ['Schneidezahn', 'Eckzahn', 'Hinterer Backenzahn'], 1, 'Der lange Eckzahn sitzt hinter den Schneidezähnen und kann Nahrung packen und festhalten.'),
      pair('herkunft', 'Ordne die Begriffe ihren Erklärungen zu.', [['Domestikation', 2], ['Gezielte Zucht', 0], ['Training', 1]],
        ['Elterntiere mit gewünschten Merkmalen auswählen', 'Ein einzelnes Tier lernt eine Aufgabe', 'Eine Haustierform entsteht über viele Generationen'],
        'Domestikation und Zucht verändern Populationen über Generationen. Beim Training lernt ein einzelnes Tier.'),
      choice('pfote', 'Wo findest du beim Hund die Ferse?', ['Unten an den Krallenspitzen.', 'Am tiefsten Punkt des Mittelballens.', 'Am hoch stehenden Sprunggelenk.'], 2, 'Der Knick am Hinterbein über der Pfote ist der Fersenbereich am Sprunggelenk.'),
      choice('pupillen', 'Was verändert sich bei einer Katze, wenn es dämmert?', ['Die Pupillen werden weiter.', 'Die Pupillen schließen sich.', 'Die Pupillen werden schmaler.'], 0, 'Weite Pupillen lassen mehr von dem schwachen Licht ins Auge.'),
      choice('koerper', 'Ein Hund senkt locker den Vorderkörper. Das Hinterteil bleibt hoch. Welche Deutung passt am besten?', ['Er schläft.', 'Er zeigt wahrscheinlich eine Spielaufforderung.', 'Er zeigt sicher einen Angriff.'], 1, 'Der tiefe Vorderkörper, das hohe Hinterteil und die lockere Bewegung passen zur Spielverbeugung.'),
      pair('bewegung', 'Ordne den Strukturen ihre Aufgaben zu.', [['Sehne', 2], ['Gelenkknorpel', 0], ['Bänder', 1]],
        ['Erleichtert das Gleiten der Gelenkflächen', 'Verbinden Knochen und stabilisieren Gelenke', 'Überträgt den Zug eines Muskels auf den Knochen'],
        'Muskeln ziehen über Sehnen. Gelenkknorpel und Bänder haben andere Aufgaben am Gelenk.'),
      write('koerper', 'Ein Hund steht steif und knurrt, während jemand näherkommt. Erkläre, warum du Abstand lässt.',
        ['Steife Haltung und Knurren werden gemeinsam als Warnsignale gedeutet.', 'Abstand und ein freier Rückzugsweg helfen, das Tier nicht weiter zu bedrängen.'],
        'Der steife Körper und das Knurren sind gemeinsam ein Warnsignal. Ich halte Abstand und lasse dem Hund Platz zum Zurückweichen.'),
      write('bewegung', 'Erkläre, was Bizeps und Trizeps beim aktiven Beugen und Strecken des Ellenbogens tun.',
        ['Beim Beugen zieht der Bizeps über seine Sehne am Unterarm.', 'Beim aktiven Strecken zieht der Trizeps als Gegenspieler.'],
        'Der Bizeps zieht beim Beugen über eine Sehne am Unterarm. Beim aktiven Strecken zieht der Trizeps. Deshalb heißen sie Gegenspieler.'),
    ],
    [
      skeleton('hund', 'ribs', ['Rippen', 'Wirbelsäule', 'Becken'], 0, 'Die gebogenen Rippen umgeben mit dem übrigen Brustkorb Herz und Lunge.'),
      teeth('mensch', 'molar', ['Eckzahn', 'Schneidezahn', 'Hinterer Backenzahn'], 2, 'Die breiten Kauflächen der hinteren Backenzähne zerdrücken oder zermahlen Nahrung.'),
      pair('gebiss', 'Ordne jeder Zahnart ihre typische Aufgabe zu.', [['Schneidezähne', 1], ['Fangzähne', 2], ['Reißzähne', 0]],
        ['Mit scharfen Kanten schneiden', 'Kleine Stücke abbeißen', 'Packen und festhalten'],
        'Zähne unterscheiden sich in ihrer Form, weil sie unterschiedliche Aufgaben haben.'),
      choice('pfote', 'Eine typische Spur hat vier kleine Ballen, einen großen Ballen und keine sichtbaren Krallenspitzen. Welche Erklärung passt?', ['Die Ferse eines Menschen hat die kleinen Abdrücke gemacht.', 'Es kann eine Katze gewesen sein, die beim Gehen ihre Krallen eingezogen hatte.', 'Jede Hundepfote zieht ihre Krallen beim Gehen ein.'], 1, 'Katzen hinterlassen bei normalem Gehen oft keine sichtbaren Krallenspuren. Eine einzelne Spur liefert einen Hinweis, der Untergrund spielt ebenfalls eine Rolle.'),
      choice('herkunft', 'Welche Aussage beschreibt die Herkunft der Haushunde?', ['Sie stammen von frühen Wolfspopulationen ab.', 'Sie stammen von heutigen Katzen ab.', 'Alle Hunderassen entstanden in einem einzigen Wurf.'], 0, 'Heutige Wölfe und Haushunde sind verwandt. Die Haustierform entwickelte sich über viele Generationen.'),
      choice('sinne', 'Warum hilft dem Hund die größere Riechschleimhaut?', ['Sie lässt mehr Licht in die Nase.', 'Sie bewegt die Ohren beim Riechen.', 'Sie bietet viel Fläche für Riechzellen.'], 2, 'Die Riechschleimhaut enthält Riechzellen, die auf Duftstoffe reagieren.'),
      choice('bewegung', 'Wie hilft die doppelte S-Form der Wirbelsäule beim Gehen?', ['Sie arbeitet mit den Bandscheiben zusammen und hilft, Belastungen abzufedern.', 'Sie ersetzt alle Muskeln im Rücken.', 'Sie macht alle Wirbel starr.'], 0, 'Die Krümmungen und Bandscheiben unterstützen die Beweglichkeit und verteilen Belastungen.'),
      write('koerper', 'Eine Katze duckt sich vor einem Spielzeug und schleicht darauf zu. Eine zweite duckt sich bei Lärm und weicht zurück. Begründe die unterschiedlichen Deutungen.',
        ['Bei der ersten Katze deuten Annäherung und Blick zum Spielzeug auf Jagd oder Spiel.', 'Bei der zweiten deuten Lärm und Rückzug auf Angst oder Unsicherheit.'],
        'Die erste Katze nähert sich gezielt dem Spielzeug, wie beim Anschleichen. Die zweite Katze bewegt sich vom Geräusch weg und wirkt unsicher. Die Richtung hilft beim Deuten.'),
      write('skelett', 'Nenne zwei Baumerkmale der Hinterbeine oder Pfoten, die einer Katze beim Sprung und bei der Landung helfen.',
        ['Kräftige Muskeln der Hinterbeine strecken die Beine und sorgen für den Absprung.', 'Beim Landen dämpfen Ballen und nachgebende Gelenke den Stoß.'],
        'Beim Absprung streckt die Katze ihre kräftigen Hinterbeine und stößt sich ab. Bei der Landung dämpfen die Ballen und die sich beugenden Gelenke den Stoß.'),
    ],
  ];

  // In der Wiederholung bleibt die Teilkompetenz gleich, der Fall wechselt.
  const focus = [
    ['schulter', 'reisszahn', 'pfote', 'herkunft', 'sinne', 'koerper', 'wirbelsaeule', 'zahnvergleich', 'sinne'],
    ['oberschenkel', 'fangzahn', 'herkunft', 'pfote', 'pupillen', 'spiel', 'gelenk', 'koerper', 'muskeln'],
    ['rippen', 'mahlen', 'zahnvergleich', 'krallen', 'herkunft', 'sinne', 'wirbelsaeule', 'richtung', 'sprung'],
  ];
  const retry = {
    pfote: [
      choice('pfote', 'Auf einer Zeichnung berühren beim Gehen die Zehen den Boden. Die Ferse steht deutlich höher. Wie heißt diese Gangart?', ['Zehengang', 'Sohlengang', 'Krallengang'], 0, 'Beim Zehengang tragen die Zehen und Ballen. Die Ferse bleibt über dem Boden.'),
      choice('pfote', 'Nach einem Sprung setzt die Katze mit der Pfote auf. Welche Struktur polstert den Auftritt?', ['Die Ohren', 'Die Ballen', 'Die Schneidezähne'], 1, 'Ballen geben beim Aufsetzen nach und dämpfen so den Stoß.'),
      choice("pfote", "Beim Gehen bleibt die Ferse eines Hundes über dem Boden. Wie nennt man seine Gangart?", ["Zehengang","Sohlengang","Flug"], 0, "Der Hund stützt sich beim Gehen auf die Zehen."),
    ],
    herkunft: [
      choice('herkunft', 'In einer Familie lernt ein Hund, auf einen Pfiff zurückzukommen. Wie nennt man das?', ['Domestikation', 'Training', 'Gezielte Zucht'], 1, 'Training verändert, was dieses einzelne Tier kann. Domestikation und Zucht wirken über Generationen.'),
      choice('herkunft', 'Menschen wählen über viele Generationen besonders kleine Hunde als Elterntiere aus. Was beschreibt das?', ['Gezielte Zucht', 'Eine Übung für einzelne Tiere', 'Einen Wechsel der Jahreszeit'], 0, 'Erbliche Merkmale können durch die wiederholte Auswahl von Elterntieren häufiger werden.'),
      choice("herkunft", "Ein Hund lernt, auf ein bestimmtes Zeichen zu sitzen. Was erklärt dieses Verhalten?", ["Übung und Erfahrung","Eine neue Zahnform","Eine neue Rasse"], 0, "Das Reagieren auf dieses Zeichen lernt der Hund beim Training."),
    ],
    sinne: [
      choice('sinne', 'Beim Schnuppern gelangen Duftstoffe in die Nase. Wohin schicken Riechzellen ihre Signale?', ['Zu den Ballen', 'Zu den Zähnen', 'Zum Gehirn'], 2, 'Im Gehirn werden die Signale verarbeitet. So kann der Hund Gerüche unterscheiden.'),
      choice('sinne', 'Ein Spürhund erkennt einen vertrauten Geruch in der Luft. Was hilft ihm dabei?', ['Eine große Fläche mit vielen Riechzellen.', 'Eine besonders breite Kaufläche.', 'Bewegliche Krallen.'], 0, 'Die Riechzellen nehmen Duftstoffe auf. Das Gehirn verarbeitet ihre Signale.'),
      choice("sinne", "Ein Hund schnuppert an einer Jacke. Welche Zellen erfassen Duftstoffe?", ["Riechzellen","Muskelzellen","Knochenzellen"], 0, "Riechzellen reagieren auf Duftstoffe und leiten Signale ans Gehirn."),
    ],
    koerper: [
      choice('koerper', 'Ein Hund wedelt mit der Rute, steht aber steif und knurrt. Was ist eine passende Reaktion?', ['Näher herangehen, weil er wedelt.', 'Abstand lassen und die gesamte Haltung beachten.', 'Den Hund am Halsband festhalten.'], 1, 'Wedeln allein sagt wenig aus. Steife Haltung und Knurren sind in dieser Situation wichtige Warnsignale.'),
      choice('koerper', 'Eine Katze bewegt sich mit lockerem Körper und aufrechtem Schwanz freiwillig auf eine vertraute Person zu. Was ist die plausibelste Deutung?', ['Sie möchte wahrscheinlich freundlich Kontakt aufnehmen.', 'Sie versucht gerade zu fliehen.', 'Aufrechter Schwanz bedeutet immer Drohen.'], 0, 'Freiwillige Annäherung, lockere Bewegung und der Kontext passen zu einer freundlichen Begrüßung.'),
      choice("koerper", "Ein Hund duckt sich nach einem Geräusch und weicht zurück. Welches Merkmal hilft beim Deuten?", ["Die Bewegungsrichtung","Die Fellfarbe","Die Zahnzahl"], 0, "Das Zurückweichen passt dazu, dass der Hund Abstand sucht."),
    ],
    schulter: [
      skeleton('katze', 'shoulder', ['Becken', 'Schulterblatt', 'Oberarmknochen'], 1, 'Das Schulterblatt liegt über dem Vorderbein. Dort setzt der Oberarm an.'),
      choice('skelett', 'Beim Laufen bewegt sich ein flacher Knochen oberhalb des Vorderbeins mit. Welcher?', ['Schulterblatt','Rippen','Becken'], 0, 'Das Schulterblatt gehört zur Schulter. Muskeln halten es beweglich am Rumpf.'),
      choice("skelett", "Welcher flache Knochen gehört zum Schultergürtel und bildet mit dem Oberarm das Schultergelenk?", ["Becken","Schulterblatt","Schienbein"], 1, "Das Schulterblatt trägt die Gelenkpfanne für den Oberarmkopf."),
    ],
    oberschenkel: [
      skeleton('hund', 'femur', ['Schulterblatt', 'Oberschenkelknochen', 'Hinterpfote'], 1, 'Der lange Knochen verbindet das Hüftgelenk mit dem Knie.'),
      choice('skelett', 'Welcher Knochen liegt zwischen Becken und Knie?', ['Oberarmknochen','Oberschenkelknochen','Rippe'], 1, 'Der Oberschenkelknochen beginnt an der Hüfte und endet am Knie.'),
      choice("skelett", "Bei einer Katze soll der Knochen zwischen Hüfte und Knie markiert werden. Welcher ist es?", ["Elle","Oberschenkelknochen","Schienbein"], 1, "Der Oberschenkelknochen verbindet Hüfte und Knie."),
    ],
    rippen: [
      skeleton('katze', 'ribs', ['Becken','Schädel','Rippen'], 2, 'Die gebogenen Knochen bilden mit der Brustwirbelsäule und dem Brustbein den Brustkorb.'),
      choice('skelett', 'Welche gebogenen Knochen schützen Herz und Lunge?', ['Rippen','Beckenknochen','Schienbeine'], 0, 'Die Rippen umgeben die Brusthöhle.'),
      choice("skelett", "Welche Knochen bilden zusammen mit Brustbein und Brustwirbeln den Brustkorb?", ["Rippen","Mittelfußknochen","Schulterblätter"], 0, "Die Rippen umgeben und schützen mit dem Brustkorb Herz und Lunge."),
    ],
    reisszahn: [
      teeth('hund', 'carnassial', ['Schneidezähne','Reißzähne','Eckzähne'], 1, 'Die beiden scharfkantigen Backenzähne bilden eine Schere.'),
      choice('gebiss', 'Welche Zähne gleiten beim Zubeißen aneinander vorbei, um ein Stück Fleisch abzutrennen?', ['Schneidezähne','Eckzähne','Reißzähne'], 2, 'Die Reißzähne schneiden wie Scherenklingen.'),
      choice("gebiss", "Beim Schließen des Hundemauls gleiten zwei scharfkantige Zähne aneinander vorbei. Was tun sie?", ["Sie filtern Luft.","Sie schneiden Nahrung.","Sie halten den Unterkiefer fest."], 1, "Die Reißzähne arbeiten beim Schneiden ähnlich wie Scherenklingen."),
    ],
    fangzahn: [
      teeth('katze', 'canine', ['Eckzahn','Schneidezahn','Hinterer Backenzahn'], 0, 'Dieser lange Zahn dient zum Greifen und Festhalten.'),
      choice('gebiss', 'Ein Wolf hält Nahrung mit einem langen, spitzen Zahn fest. Welche Zahnart hilft ihm?', ['Eckzahn','Reißzahn','Schneidezahn'], 0, 'Eckzähne greifen und halten fest.'),
      choice("gebiss", "Welche Zahnform hilft einem Hund besonders dabei, ein Stück Nahrung zu packen?", ["Ein langer spitzer Eckzahn","Ein flacher Mahlzahn","Eine breite Kaufläche"], 0, "Die Spitze des Eckzahns erleichtert das Greifen und Festhalten."),
    ],
    mahlen: [
      choice('gebiss', 'Mit welchen Zähnen zermahlst du ein Stück Brot?', ['Lange Fangzähne','Breite hintere Backenzähne','Schneidezähne'], 1, 'Die breiten Kauflächen zerkleinern die Nahrung durch Druck und Reibung.'),
      choice('gebiss', 'Welche Zahnform eignet sich besonders zum Zermahlen?', ['Eine breite Kaufläche','Eine sehr lange Spitze','Eine schmale Schneide'], 0, 'Eine breite Kaufläche kann Nahrung zerdrücken und mahlen.'),
      choice("gebiss", "Ein Kaninchen zerreibt Pflanzenfasern. Welche Zahnfläche hilft dabei?", ["Eine breite Mahlfläche","Eine lange Fangzahnspitze","Eine einzelne scharfe Kante"], 0, "Breitere Mahlflächen zerreiben die Pflanzenteile."),
    ],
    zahnvergleich: [
      pair('gebiss', 'Ein Wolf packt ein Stück Nahrung und schneidet es in zwei Teile. Ordne die Aufgaben zu.', [['Packen und halten',1],['Schneiden',0]],
        ['Reißzähne','Eckzähne'], 'Die langen Eckzähne halten fest. Die scharfkantigen Reißzähne schneiden.'),
      choice('gebiss', 'Welche Kombination erklärt das Zerteilen eines zähen Fleischstücks beim Wolf?', ['Reißzähne halten fest und Eckzähne zermahlen.', 'Eckzähne halten fest und Reißzähne schneiden.', 'Schneidezähne übernehmen beide Aufgaben allein.'], 1, 'Eckzähne und Reißzähne haben unterschiedliche Aufgaben beim Packen und Schneiden.'),
      choice("gebiss", "Warum eignen sich flache Backenzähne des Kaninchens und Reißzähne des Hundes für verschiedene Aufgaben?", ["Flache Zähne zerreiben, scharfe Reißzähne schneiden.","Beide dienen nur dem Festhalten.","Reißzähne zermahlen, flache Zähne schneiden."], 0, "Zahnform und Ernährungsweise hängen zusammen."),
    ],
    krallen: [
      choice('pfote', 'Warum zeigt ein typischer Katzenabdruck beim normalen Gehen oft keine Krallenspitzen?', ['Die Katze zieht ihre Krallen meist ein.','Die Katze hat keine Krallen.','Nur die Ferse berührt den Boden.'], 0, 'Eingezogene Krallen berühren den Boden meist nicht.'),
      choice('pfote', 'Eine Katzenspur im weichen Boden zeigt ausnahmsweise Krallenspitzen. Wodurch ist das möglich?', ['Beim Abstoßen waren die Krallen ausgefahren.','Katzen laufen immer mit ausgefahrenen Krallen.','Die Krallenspitzen gehören zur Ferse.'], 0, 'Die Katze kann ihre Krallen ausfahren. Bei kräftigem Abstoßen können sie Spuren hinterlassen.'),
      choice("pfote", "Auf festem Boden sieht man bei einer Spur vier kleine Krallenabdrücke. Zu welchem Tier passt sie eher?", ["Hund","Hauskatze","Mensch"], 0, "Bei einem typischen Hundeabdruck können die Krallen Spuren hinterlassen."),
    ],
    pupillen: [
      choice('pupillen', 'Eine Katze kommt aus einem dunklen Zimmer ans helle Fenster. Wie verändert sich die Pupille?', ['Sie wird schmaler.', 'Sie wird weiter.', 'Sie bleibt gleich groß.'], 0, 'Bei heller Umgebung begrenzt eine schmale Pupille die Lichtmenge im Auge.'),
      choice('pupillen', 'Nach dem Ausschalten der Lampe bleibt schwaches Licht im Zimmer. Warum wird die Pupille der Katze weiter?', ['So kann mehr Licht ins Auge fallen.', 'So hört die Katze lauter.', 'So fallen weniger Lichtstrahlen ins Auge.'], 0, 'Die weitere Pupille lässt mehr vom vorhandenen Licht ins Auge.'),
      choice("pupillen", "Helles Sonnenlicht fällt ins Zimmer. Warum verengt die Katze ihre Pupillen?", ["Damit weniger Licht ins Auge fällt.","Damit sie leiser auftreten kann.","Damit die Augen wärmer werden."], 0, "Die Pupille regelt, wie viel Licht ins Auge gelangt."),
    ],
    spiel: [
      choice('koerper', 'Ein Hund bewegt sich locker um einen vertrauten Hund herum, senkt die Brust und springt dann seitlich weg. Was passt?', ['Er lädt wahrscheinlich zum Spielen ein.', 'Er ist auf jeden Fall aggressiv.', 'Er schläft.'], 0, 'Die Spielverbeugung und die lockere Bewegung passen zur Einladung zum Spielen.'),
      choice('koerper', 'Woran erkennst du bei einem lockeren Hund die Spielverbeugung?', ['Vorderkörper unten und Hinterteil oben.', 'Ohren angelegt, Rute eingezogen und Rückzug.', 'Steife Haltung und tiefes Knurren.'], 0, 'Bei der Spielverbeugung sinkt der Vorderkörper, während das Hinterteil oben bleibt.'),
      choice("koerper", "Der Hund senkt den Vorderkörper, hält das Hinterteil oben und hüpft locker weg. Welche Deutung passt?", ["Spielaufforderung","Schlaf","Starre Drohhaltung"], 0, "Eine lockere Spielverbeugung passt in dieser Situation zu einer Spieleinladung."),
    ],
    richtung: [
      choice('koerper', 'Eine Katze duckt sich am Gartentor. Welcher zusätzliche Hinweis spricht eher für Anschleichen?', ['Sie flüchtet vom Tor weg.', 'Sie bewegt sich langsam und aufmerksam auf ein Ziel zu.', 'Sie ist getigert.'], 1, 'Bei tiefer Haltung hilft die Bewegungsrichtung. Annäherung an ein Ziel passt zum Anschleichen.'),
      choice('koerper', 'Eine geduckte Katze bewegt sich nach einem Knall rasch unter ein Sofa. Welche Deutung passt?', ['Sie schleicht sich an den Knall an.', 'Sie flieht wahrscheinlich vor dem Geräusch.', 'Ihre Haltung zeigt eindeutig Freude.'], 1, 'Sie bewegt sich vom Auslöser weg und sucht Deckung.'),
      choice("koerper", "Zwei Katzen ducken sich. Eine nähert sich einer Maus, die andere läuft nach einem Knall weg. Welcher Hinweis unterscheidet die Szenen?", ["Die Bewegungsrichtung zum Auslöser oder davon weg","Die Anzahl ihrer Pfoten","Die Größe des Raums"], 0, "Bewegungsrichtung und Anlass helfen, ähnliche Körperhaltungen zu unterscheiden."),
    ],
    wirbelsaeule: [
      choice('bewegung', 'Was liegt zwischen beweglichen Wirbelkörpern und hilft beim Abfedern?', ['Bandscheiben','Rippen','Gelenkbänder der Hand'], 0, 'Bandscheiben verteilen Druck und dämpfen Stöße zwischen Wirbeln.'),
      choice('bewegung', 'Welche Struktur verläuft geschützt im Wirbelkanal?', ['Die Rippen','Das Rückenmark','Die Oberschenkelsehne'], 1, 'Der Wirbelkanal wird von den Wirbeln gebildet und umgibt das Rückenmark.'),
      choice("bewegung", "Was unterstützt die Wirbelsäule dabei, Belastungen zwischen beweglichen Wirbeln zu verteilen?", ["Bandscheiben","Schneidezähne","Ballen"], 0, "Die elastischen Bandscheiben verteilen Druck."),
    ],
    gelenk: [
      choice('bewegung', 'Beim Strecken eines Beins zieht ein Muskel an einem Knochen. Was überträgt den Zug?', ['Gelenkknorpel','Eine Sehne','Ein Gelenkband'], 1, 'Sehnen übertragen Muskelkraft. Bänder verbinden Knochen miteinander.'),
      choice('bewegung', 'Was überzieht die Enden der Knochen und erleichtert ihr Gleiten im Gelenk?', ['Der Gelenkknorpel','Der Bizeps','Die Sehne'], 0, 'Gelenkknorpel bildet eine glatte Schicht auf den Gelenkflächen.'),
      choice("bewegung", "Ein Band und eine Sehne liegen in Gelenknähe. Was verbindet ein Muskel über seine Sehne?", ["Den Muskel mit dem Knochen","Zwei Knochen direkt","Zwei Wirbelkanäle"], 0, "Sehnen übertragen Muskelkraft auf den Knochen."),
    ],
    muskeln: [
      choice('bewegung', 'Ein Kind hebt eine Flasche zum Oberarm. Welcher Muskel unterstützt das Beugen?', ['Trizeps','Bizeps','Gelenkknorpel'], 1, 'Der Bizeps zieht am Unterarm und beugt den Ellenbogen.'),
      choice('bewegung', 'Ein Kind streckt den zuvor gebeugten Arm aktiv. Welcher Gegenspieler zieht nun?', ['Der Trizeps','Der Bizeps','Die Bandscheibe'], 0, 'Der Trizeps streckt den Ellenbogen.'),
      choice("bewegung", "Du legst nach dem Beugen den Arm wieder gerade auf den Tisch. Welcher Muskel streckt den Unterarm aktiv?", ["Trizeps","Bizeps","Brustwirbel"], 0, "Der Trizeps ist ein Strecker des Ellenbogengelenks."),
    ],
    sprung: [
      choice('skelett', 'Eine Katze springt von einem niedrigen Hocker auf den Boden. Was hilft, die Landung abzufedern?', ['Harte Zähne','Ballen und sich beugende Gelenke','Die Ohrmuscheln'], 1, 'Ballen und nachgebende Gelenke dämpfen den Stoß.'),
      choice('skelett', 'Eine Katze springt auf eine Mauer. Was erzeugt vor allem den Abstoß?', ['Das Strecken der kräftigen Hinterbeine.','Das Bewegen der Ohren.','Das Einziehen des Kopfes.'], 0, 'Kräftige Muskeln strecken die Hinterbeine und übertragen den Schub auf den Körper.'),
      choice("skelett", "Beim Landen beugt eine Katze ihre Beine. Was verändert das?", ["Die Bewegung wird über einen längeren Weg abgebremst.","Die Krallen ziehen den Brustkorb nach oben.","Der Schwanz ersetzt die Hinterbeine."], 0, "Nachgebende Gelenke und Ballen helfen, die Landung abzufedern."),
    ],
  };

  const observations = [
    {
      animal: 'dog', label: 'Hund', scene: 'play',
      context: 'Der Hund steht einem vertrauten Spielpartner gegenüber und bewegt sich locker.',
      signals: ['Die Ohren sind beweglich.', 'Der Vorderkörper ist tief, das Hinterteil bleibt oben.', 'Die Rute ist locker und lebhaft.'],
      answer: 1,
      interpretations: ['Der Hund sucht wahrscheinlich Schutz.', 'Der Hund lädt wahrscheinlich zum Spielen ein.', 'Der Hund droht mit steifer Haltung.'],
      reason: 'Der tiefe Vorderkörper und das hohe Hinterteil sind typisch für eine Spielverbeugung. Die lockere Haltung und die vertraute Situation passen dazu.',
      sample: 'Der Hund senkt den Vorderkörper und lässt das Hinterteil oben. Seine Rute wirkt locker. Zusammen mit dem vertrauten Spielpartner spricht das für eine Spielaufforderung.',
    },
    {
      animal: 'cat', label: 'Katze', scene: 'fear',
      context: 'Neben der Katze fällt etwas laut herunter. Sie zieht sich vom Geräusch weg.',
      signals: ['Die Ohren liegen seitlich oder hinten an.', 'Der Körper duckt sich dicht zum Boden.', 'Die Rute liegt tief am Körper.'],
      answer: 2,
      interpretations: ['Die Katze begrüßt jemanden.', 'Die Katze verfolgt ein Ziel vor sich.', 'Die Katze wirkt unsicher und sucht Abstand.'],
      reason: 'Geduckte Haltung, angelegte Ohren und die tiefe Rute passen zum Erschrecken. Die Bewegung weg vom Geräusch hilft bei der Deutung.',
      sample: 'Die Katze legt die Ohren an und duckt sich. Sie zieht sich vom lauten Geräusch zurück. Deshalb wirkt sie ängstlich oder unsicher.',
    },
    {
      animal: 'cat', label: 'Katze', scene: 'hunt',
      context: 'Ein Spielzeug bewegt sich vor der Katze. Sie schaut darauf und bewegt sich langsam in seine Richtung.',
      signals: ['Die Ohren sind nach vorn zum Reiz gerichtet.', 'Die Katze hält den Körper tief.', 'Die Rute bleibt tief und bewegt sich wenig.'],
      answer: 0,
      interpretations: ['Die Katze schleicht sich an das Spielzeug an.', 'Die Katze flieht vor dem Spielzeug.', 'Die Katze begrüßt eine Person.'],
      reason: 'Ein tiefer Körper allein kann auch Angst zeigen. Hier richtet die Katze Kopf und Bewegung auf ein Ziel. Das passt zum Anschleichen.',
      sample: 'Die Katze hält den Körper tief und richtet ihre Ohren nach vorn. Sie bewegt sich auf das Spielzeug zu. Das sieht nach Anschleichen aus.',
    },
    {
      animal: 'dog', label: 'Hund', scene: 'threat',
      context: 'Jemand kommt dem Hund zu nahe. Der Hund knurrt.',
      signals: ['Die Ohren sind angespannt zurückgelegt.', 'Der Körper wirkt steif.', 'Die Rute wirkt angespannt.'],
      answer: 1,
      interpretations: ['Der Hund ist entspannt.', 'Der Hund warnt und möchte wahrscheinlich Abstand.', 'Der Hund lädt zum Spielen ein.'],
      reason: 'Knurren und steife Haltung sind zusammen Warnsignale. Abstand und ein freier Rückzugsweg nehmen den Druck aus der Situation.',
      sample: 'Der Hund steht steif und hält die Rute angespannt. Dazu knurrt er. Wahrscheinlich warnt er die Person. Ich halte Abstand.',
    },
  ];

  window.BioLaborProbetestInhalte = {skills, versions, focus, retry, observations};
})();
