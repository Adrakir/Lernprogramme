// Größen-Werkstatt: Inhalte der geführten Lernpfade, Vertiefungen und Hilfen.
import type {Bereich, Visual} from './groessen-core';

export type Interactive = 'stairs' | 'ruler' | 'balance' | 'wallet' | 'rect' | 'cuboid' | 'jug' | 'grid';

export type Frage = {question: string; options: string[]; answer: number; explain: string[]};

export type Station = {
  skill: string;
  title: string;
  /** Einstiegsfrage: Vorwissen aktivieren, ohne Bewertung. */
  entdecken: Frage;
  /** Erklärung in kurzen Absätzen, ein Merksatz und ein interaktives Modell. */
  verstehen: {text: string[]; merksatz: string; interactive: Interactive; interactiveHint: string};
  /** Gemeinsam gelöstes Beispiel, Schritt für Schritt aufdeckbar. */
  beispiel: {aufgabe: string; visual?: Visual; schritte: string[]};
  /** Begründen oder Fehler finden. */
  begruenden: Frage;
};

export type BereichContent = {
  intro: string;
  ziele: string[];
  stationen: Station[];
  vertiefung: {skill: string; title: string; text: string[]; merksatz: string; beispiel: {aufgabe: string; visual?: Visual; schritte: string[]}};
  merkwissen: {
    stuetzpunkte: [string, string][];
    merksaetze: string[];
    fehler: {fehler: string; richtig: string}[];
    strategie: string[];
  };
};

const pruefen = ['Lies die Aufgabe genau. Was ist gegeben, was ist gesucht?', 'Bringe alle Größen in dieselbe Einheit.', 'Rechne und schreibe die Einheit dazu.', 'Prüfe: Ist das Ergebnis realistisch?'];

export const content: Record<Bereich, BereichContent> = {
  // ===================================================================
  laenge: {
    intro: 'Längen begegnen dir überall: beim Messen mit dem Lineal, beim Weg zur Schule oder beim Basteln. In diesem Lernpfad lernst du, Längen zu schätzen, genau zu messen, umzurechnen und mit ihnen zu rechnen.',
    ziele: ['Längen mit Stützpunkten schätzen', 'Mit dem Lineal genau messen', 'Zwischen mm, cm, dm, m und km umrechnen', 'Längen mit Komma schreiben', 'Mit Längen rechnen und Sachaufgaben lösen'],
    stationen: [
      {
        skill: 'l-vorstellen', title: 'Längen vorstellen',
        entdecken: {question: 'Wie breit ist ungefähr dein kleiner Finger?', options: ['etwa 1 mm', 'etwa 1 cm', 'etwa 1 dm', 'etwa 1 m'], answer: 1,
          explain: ['1 mm ist so dick wie eine Bankkarte. Dein Finger ist breiter.', 'Genau. Die Breite des kleinen Fingers ist ein guter Stützpunkt für 1 cm.', '1 dm ist etwa die Breite deiner Hand ohne Daumen. Der Finger ist schmaler.', '1 m ist ein großer Schritt. Das ist viel zu lang.']},
        verstehen: {
          text: ['Um Längen gut zu schätzen, brauchst du Stützpunkte. Das sind Gegenstände, deren Länge du kennst.', '1 mm: Dicke einer Bankkarte. 1 cm: Breite des kleinen Fingers. 1 dm: Breite einer Hand ohne Daumen. 1 m: ein großer Schritt. 1 km: etwa eine Viertelstunde zu Fuß.', 'Beim Schätzen vergleichst du den Gegenstand mit dem passenden Stützpunkt: Wie oft passt der Stützpunkt hinein?'],
          merksatz: 'Schätzen heißt: mit einem bekannten Stützpunkt vergleichen. Die Einheit muss zur Größe des Gegenstands passen.',
          interactive: 'stairs', interactiveHint: 'Tippe eine Einheit auf der Treppe an und sieh dir ihren Stützpunkt an.',
        },
        beispiel: {aufgabe: 'Wie lang ist eine Tafel im Klassenraum etwa?', schritte: ['Stützpunkt wählen: 1 m ist ein großer Schritt.', 'Vergleichen: Die Tafel ist etwa 3 bis 4 große Schritte lang.', 'Ergebnis: Die Tafel ist etwa 3,5 m lang.', 'Prüfen: 3,5 cm wäre so klein wie ein Radiergummi, 3,5 km viel zu lang. 3,5 m ist realistisch.']},
        begruenden: {question: 'Mia sagt: „Mein Schulweg ist 2 m lang.“ Was stimmt?', options: ['Das kann stimmen.', 'Die Zahl passt, aber die Einheit ist falsch. Gemeint sind wohl 2 km.', 'Gemeint sind 2 cm.'], answer: 1,
          explain: ['2 m sind nur zwei große Schritte. Das ist kein Schulweg.', 'Richtig. 2 km sind etwa 25 Minuten zu Fuß. Das passt zu einem Schulweg.', '2 cm sind noch viel kürzer als 2 m.']},
      },
      {
        skill: 'l-messen', title: 'Genau messen',
        entdecken: {question: 'Ein Stift liegt am Lineal. Sein linkes Ende ist bei 2 cm, sein rechtes Ende bei 9 cm. Wie lang ist er?', options: ['9 cm', '7 cm', '11 cm'], answer: 1,
          explain: ['9 cm stimmt nur, wenn der Stift bei 0 beginnt.', 'Genau. Du rechnest Ende minus Anfang: 9 cm − 2 cm = 7 cm.', 'Anfang und Ende werden nicht addiert.']},
        verstehen: {
          text: ['Beim Messen legst du den Anfang des Gegenstands an die 0 des Lineals. Dann liest du am Ende ab.', 'Zwischen zwei Zentimeterstrichen liegen 10 kleine Striche. Jeder kleine Abstand ist 1 mm.', 'Liegt der Gegenstand nicht an der 0, rechnest du: Ende minus Anfang.'],
          merksatz: 'Anfang an die 0 legen. Ganze Zentimeter zählen, dann die Millimeter dazuzählen: 6 cm 4 mm = 64 mm = 6,4 cm.',
          interactive: 'ruler', interactiveHint: 'Verschiebe das Ende des Streifens und lies seine Länge in cm und mm ab.',
        },
        beispiel: {aufgabe: 'Ein Schlüssel liegt am Lineal. Er beginnt bei 0 und endet 3 Striche nach der 5.', visual: {type: 'ruler', start: 0, length: 53, object: 'schluessel'}, schritte: ['Ganze Zentimeter: Der Schlüssel reicht bis über die 5. Das sind 5 cm.', 'Millimeter: Nach der 5 kommen noch 3 kleine Striche. Das sind 3 mm.', 'Zusammen: 5 cm 3 mm = 53 mm = 5,3 cm.']},
        begruenden: {question: 'Ben legt das Lineal so an, dass der Stift bei 1 cm beginnt. Am Ende liest er 8 cm ab. Er schreibt: „Der Stift ist 8 cm lang.“ Was ist sein Fehler?', options: ['Er hat keinen Fehler gemacht.', 'Er hat nicht bei 0 angelegt. Der Stift ist 7 cm lang.', 'Er hätte in Millimetern messen müssen.'], answer: 1,
          explain: ['Doch: Der Stift beginnt nicht bei 0.', 'Richtig. Ende minus Anfang: 8 cm − 1 cm = 7 cm.', 'Die Einheit ist nicht das Problem, sondern der Anfang.']},
      },
      {
        skill: 'l-umrechnen', title: 'Längen umrechnen',
        entdecken: {question: 'Wie viele Zentimeter hat 1 Meter?', options: ['10', '100', '1.000'], answer: 1,
          explain: ['1 m hat 10 dm. In Zentimetern ist es mehr.', 'Genau. 1 m = 10 dm = 100 cm.', '1.000 mm sind 1 m. In Zentimetern sind es 100.']},
        verstehen: {
          text: ['Die Längeneinheiten bilden eine Treppe: km, m, dm, cm, mm.', 'Zwischen mm, cm, dm und m ist die Umrechnungszahl 10. Zwischen m und km ist sie 1000.', 'Gehst du zur kleineren Einheit (Treppe hinunter), wird die Maßzahl größer: Du rechnest mal. Gehst du zur größeren Einheit (Treppe hinauf), wird die Maßzahl kleiner: Du teilst.'],
          merksatz: 'Kleinere Einheit, größere Maßzahl. 1 km = 1000 m, 1 m = 10 dm, 1 dm = 10 cm, 1 cm = 10 mm.',
          interactive: 'stairs', interactiveHint: 'Wähle eine Start- und eine Zieleinheit. Die Treppe zeigt dir, womit du rechnest.',
        },
        beispiel: {aufgabe: 'Rechne um: 4 m = ? cm', visual: {type: 'stairs', bereich: 'laenge', from: 'm', to: 'cm'}, schritte: ['Von m nach cm geht es zwei Stufen nach unten.', 'Jede Stufe: mal 10. Zwei Stufen: mal 100.', '4 · 100 = 400', 'Also: 4 m = 400 cm.']},
        begruenden: {question: 'Lena rechnet: 3 km = 300 m. Was sagst du dazu?', options: ['Richtig.', 'Falsch. Zwischen km und m ist die Umrechnungszahl 1000. 3 km = 3.000 m.', 'Falsch. 3 km = 30 m.'], answer: 1,
          explain: ['Lena hat mit 100 gerechnet. Das ist die falsche Umrechnungszahl.', 'Richtig. Kilo bedeutet tausend: 1 km = 1000 m.', '30 m wären noch weniger. Die Maßzahl muss größer werden.']},
      },
      {
        skill: 'l-komma', title: 'Kommaschreibweise',
        entdecken: {question: 'Was bedeutet 1,25 m?', options: ['1 m und 25 cm', '1 m und 25 mm', '125 m'], answer: 0,
          explain: ['Genau. Die zwei Stellen nach dem Komma geben bei Metern die Zentimeter an.', 'Bei Metern stehen nach dem Komma zuerst Dezimeter, dann Zentimeter.', '125 m ist viel zu lang. Das Komma trennt die ganzen Meter ab.']},
        verstehen: {
          text: ['Das Komma trennt die ganzen Einheiten von den Teilen.', 'Bei Metern gilt: Die 1. Stelle nach dem Komma sind Dezimeter, die 2. Stelle Zentimeter, die 3. Stelle Millimeter.', 'Bei Kilometern stehen nach dem Komma drei Stellen für die Meter: 2,450 km = 2 km 450 m.'],
          merksatz: 'Die Ziffern nach dem Komma gehören in die Stellenwerttafel: 3,07 m = 3 m 0 dm 7 cm = 307 cm.',
          interactive: 'stairs', interactiveHint: 'Gib eine Kommazahl ein und sieh, wie sie in anderen Einheiten aussieht.',
        },
        beispiel: {aufgabe: 'Schreibe 3 m 7 cm mit Komma in Metern.', schritte: ['Nach dem Komma stehen bei Metern zuerst die Dezimeter, dann die Zentimeter.', '3 m 7 cm hat 0 dm und 7 cm.', 'Also: 3,07 m.', 'Achtung: 3,7 m wären 3 m 70 cm.']},
        begruenden: {question: 'Tim schreibt: 2 km 50 m = 2,50 km. Stimmt das?', options: ['Ja, das stimmt.', 'Nein. Bei km gibt es drei Stellen nach dem Komma. 2 km 50 m = 2,050 km.', 'Nein. Es sind 2,5 km.'], answer: 1,
          explain: ['2,50 km bedeutet 2 km 500 m.', 'Richtig. 1 km = 1000 m, deshalb braucht man drei Stellen: 2,050 km.', '2,5 km = 2 km 500 m. Das ist zu viel.']},
      },
      {
        skill: 'l-rechnen', title: 'Mit Längen rechnen',
        entdecken: {question: 'Ein Brett ist 1 m lang. Du sägst 35 cm ab. Wie lang ist der Rest?', options: ['65 cm', '75 cm', '34 cm'], answer: 0,
          explain: ['Genau. 1 m = 100 cm. 100 cm − 35 cm = 65 cm.', 'Rechne noch einmal: 100 − 35.', 'Du hast 1 von 35 abgezogen. Rechne zuerst 1 m in cm um.']},
        verstehen: {
          text: ['Du kannst Längen nur addieren oder subtrahieren, wenn sie in derselben Einheit stehen.', 'Wähle am besten die kleinste vorkommende Einheit. Dann rechnest du ohne Komma.', 'Am Ende kannst du das Ergebnis wieder in eine passende Einheit umrechnen.'],
          merksatz: 'Erst in dieselbe Einheit umrechnen, dann rechnen. Die Einheit gehört zum Ergebnis.',
          interactive: 'ruler', interactiveHint: 'Stelle zwei Längen ein und vergleiche sie.',
        },
        beispiel: {aufgabe: 'Ein Regal ist 1,20 m breit. Daneben steht ein Schrank mit 85 cm. Wie breit sind beide zusammen?', schritte: ['Gleiche Einheit wählen: 1,20 m = 120 cm.', '120 cm + 85 cm = 205 cm.', 'Umrechnen: 205 cm = 2,05 m.', 'Antwort: Beide sind zusammen 2,05 m breit.']},
        begruenden: {question: 'Jonas rechnet: 2 m + 30 cm = 32. Was ist falsch?', options: ['Nichts.', 'Er hat Meter und Zentimeter einfach addiert. Richtig: 200 cm + 30 cm = 230 cm.', 'Er hätte multiplizieren müssen.'], answer: 1,
          explain: ['32 ohne Einheit ist keine Länge, und 2 m sind mehr als 30 cm.', 'Richtig. Erst umrechnen: 2 m = 200 cm. Dann addieren.', 'Bei zwei Teilstücken, die zusammengelegt werden, wird addiert.']},
      },
    ],
    vertiefung: {skill: 'l-massstab', title: 'Maßstab und Karten',
      text: ['Auf Karten und Plänen ist alles verkleinert. Der Maßstab sagt, wie stark.', 'Maßstab 1 : 1000 bedeutet: 1 cm auf dem Plan sind 1000 cm = 10 m in Wirklichkeit.', 'Für die wirkliche Länge rechnest du: Länge auf der Karte mal Maßstabszahl. Danach rechnest du in eine passende Einheit um.'],
      merksatz: 'Wirkliche Länge = Kartenlänge · Maßstabszahl. Danach in m oder km umrechnen.',
      beispiel: {aufgabe: 'Auf einer Karte im Maßstab 1 : 25.000 sind zwei Orte 4 cm voneinander entfernt. Wie weit ist es in Wirklichkeit?', visual: {type: 'map', cm: 4, scale: 25000}, schritte: ['4 cm · 25.000 = 100.000 cm', '100.000 cm = 1.000 m', '1.000 m = 1 km', 'Die Orte sind 1 km voneinander entfernt.']}},
    merkwissen: {
      stuetzpunkte: [['1 mm', 'Dicke einer Bankkarte'], ['1 cm', 'Breite des kleinen Fingers'], ['1 dm', 'Breite einer Hand ohne Daumen'], ['1 m', 'ein großer Schritt'], ['1 km', 'etwa eine Viertelstunde zu Fuß']],
      merksaetze: ['1 km = 1.000 m', '1 m = 10 dm = 100 cm = 1.000 mm', '1 dm = 10 cm', '1 cm = 10 mm', 'Treppe hinunter: mal. Treppe hinauf: geteilt durch.'],
      fehler: [{fehler: '3 km = 300 m', richtig: '3 km = 3.000 m (Umrechnungszahl 1000)'}, {fehler: '2 m 5 cm = 2,5 m', richtig: '2 m 5 cm = 2,05 m'}, {fehler: '2 m + 30 cm = 32 m', richtig: '200 cm + 30 cm = 230 cm'}, {fehler: 'Lineal bei 1 statt bei 0 angelegt', richtig: 'Ende minus Anfang rechnen'}],
      strategie: pruefen,
    },
  },
  // ===================================================================
  masse: {
    intro: 'Ob beim Einkaufen, Backen oder beim Wiegen deines Schulranzens: Gewichte sind wichtig. Du lernst Gewichte zu schätzen, eine Waage abzulesen, umzurechnen und mit Gewichten zu rechnen.',
    ziele: ['Gewichte mit Stützpunkten schätzen', 'Mit der Balkenwaage arbeiten', 'Zwischen mg, g, kg und t umrechnen', 'Gewichte mit Komma schreiben', 'Mit Gewichten rechnen und Sachaufgaben lösen'],
    stationen: [
      {
        skill: 'm-vorstellen', title: 'Gewichte vorstellen',
        entdecken: {question: 'Was wiegt ungefähr 1 kg?', options: ['eine Büroklammer', 'eine Packung Zucker', 'ein Auto'], answer: 1,
          explain: ['Eine Büroklammer wiegt etwa 1 g.', 'Genau. Eine Packung Zucker oder eine Flasche mit 1 l Wasser wiegt etwa 1 kg.', 'Ein Auto wiegt etwa 1 t = 1.000 kg.']},
        verstehen: {
          text: ['Auch für Gewichte gibt es Stützpunkte.', '1 mg: ein Sandkorn. 1 g: eine Büroklammer. 1 kg: eine Packung Zucker. 1 t: ein kleines Auto.', 'Im Alltag sagen wir „Gewicht“. In der Physik heißt die Größe „Masse“.'],
          merksatz: 'Leichte Dinge in g, schwere Dinge in kg, sehr schwere Dinge in t.',
          interactive: 'balance', interactiveHint: 'Lege Gewichtsstücke auf die Waage, bis sie im Gleichgewicht ist.',
        },
        beispiel: {aufgabe: 'Wie schwer ist ein Schulranzen mit Büchern etwa?', schritte: ['Stützpunkt: 1 kg ist eine Packung Zucker.', 'Ein gepackter Ranzen ist etwa so schwer wie 4 bis 5 Packungen Zucker.', 'Ergebnis: etwa 5 kg.', 'Prüfen: 5 g wäre so leicht wie 5 Büroklammern. 5 t wären so schwer wie ein Elefant.']},
        begruenden: {question: 'Paul sagt: „Mein Hund wiegt 20 g.“ Was meinst du?', options: ['Das kann stimmen.', 'Die Einheit passt nicht. Ein Hund wiegt etwa 20 kg.', 'Ein Hund wiegt 20 t.'], answer: 1,
          explain: ['20 g sind nur 20 Büroklammern.', 'Richtig. 20 kg sind etwa 20 Packungen Zucker. Das passt zu einem mittelgroßen Hund.', '20 t wiegt ein Lastwagen.']},
      },
      {
        skill: 'm-waage', title: 'Mit der Waage wiegen',
        entdecken: {question: 'Eine Balkenwaage ist im Gleichgewicht. Links liegt ein Apfel, rechts liegen 100 g und 50 g. Wie schwer ist der Apfel?', options: ['100 g', '150 g', '50 g'], answer: 1,
          explain: ['Rechts liegen zwei Gewichtsstücke. Zähle beide.', 'Genau. Im Gleichgewicht sind beide Seiten gleich schwer: 100 g + 50 g = 150 g.', 'Rechts liegt mehr als 50 g.']},
        verstehen: {
          text: ['Eine Balkenwaage ist im Gleichgewicht, wenn beide Seiten gleich schwer sind.', 'Liegt auf einer Seite der Gegenstand, liest du sein Gewicht an der anderen Seite ab: Du addierst alle Gewichtsstücke.', 'Liegen auf der Gegenstandsseite noch Gewichtsstücke, ziehst du diese ab.'],
          merksatz: 'Gleichgewicht: links gleich schwer wie rechts. Alle Gewichtsstücke einer Seite addieren.',
          interactive: 'balance', interactiveHint: 'Lege Gewichtsstücke auf die rechte Schale und bringe die Waage ins Gleichgewicht.',
        },
        beispiel: {aufgabe: 'Links liegt ein Buch, rechts 500 g, 200 g und 50 g. Die Waage ist im Gleichgewicht.', visual: {type: 'balance', left: [{label: 'Buch'}], right: [500, 200, 50]}, schritte: ['Beide Seiten sind gleich schwer.', 'Rechts: 500 g + 200 g + 50 g = 750 g.', 'Das Buch wiegt 750 g.']},
        begruenden: {question: 'Links liegen ein Päckchen und 100 g. Rechts liegen 500 g. Die Waage ist im Gleichgewicht. Emma sagt: „Das Päckchen wiegt 600 g.“', options: ['Richtig.', 'Falsch. Das Päckchen wiegt 500 g − 100 g = 400 g.', 'Falsch. Das Päckchen wiegt 500 g.'], answer: 1,
          explain: ['Das Gewichtsstück liegt auf derselben Seite wie das Päckchen. Es hilft dem Päckchen.', 'Richtig. Päckchen und 100 g wiegen zusammen 500 g. Also wiegt das Päckchen 400 g.', 'Links liegt noch ein Gewichtsstück neben dem Päckchen.']},
      },
      {
        skill: 'm-umrechnen', title: 'Gewichte umrechnen',
        entdecken: {question: 'Wie viele Gramm sind 1 kg?', options: ['100 g', '1.000 g', '10 g'], answer: 1,
          explain: ['100 g ist eine Tafel Schokolade, kein Kilogramm.', 'Genau. Kilo bedeutet tausend: 1 kg = 1.000 g.', '10 g sind nur 10 Büroklammern.']},
        verstehen: {
          text: ['Die Gewichtseinheiten bilden eine Treppe: t, kg, g, mg.', 'Zwischen zwei Stufen ist die Umrechnungszahl immer 1000.', 'Treppe hinunter: mal 1000. Treppe hinauf: geteilt durch 1000.'],
          merksatz: '1 t = 1.000 kg, 1 kg = 1.000 g, 1 g = 1.000 mg.',
          interactive: 'stairs', interactiveHint: 'Wähle Start- und Zieleinheit und beobachte die Umrechnungszahl.',
        },
        beispiel: {aufgabe: 'Rechne um: 3.500 g = ? kg', visual: {type: 'stairs', bereich: 'masse', from: 'g', to: 'kg'}, schritte: ['Von g nach kg geht es eine Stufe nach oben.', 'Eine Stufe nach oben: geteilt durch 1000.', '3.500 : 1000 = 3,5', 'Also: 3.500 g = 3,5 kg.']},
        begruenden: {question: 'Ali rechnet: 2 t = 200 kg. Was stimmt?', options: ['Richtig.', 'Falsch. 2 t = 2.000 kg.', 'Falsch. 2 t = 20 kg.'], answer: 1,
          explain: ['Ali hat mit 100 gerechnet.', 'Richtig. Bei Gewichten ist die Umrechnungszahl 1000.', '20 kg wären viel zu wenig.']},
      },
      {
        skill: 'm-komma', title: 'Kommaschreibweise',
        entdecken: {question: 'Was bedeutet 2,5 kg?', options: ['2 kg 5 g', '2 kg 500 g', '25 kg'], answer: 1,
          explain: ['2 kg 5 g schreibt man 2,005 kg.', 'Genau. 0,5 kg ist ein halbes Kilogramm, also 500 g.', '25 kg ist zehnmal so viel.']},
        verstehen: {
          text: ['Bei Kilogramm stehen nach dem Komma drei Stellen für die Gramm.', '1,250 kg = 1 kg 250 g = 1.250 g.', 'Fehlen Stellen, füllst du mit Nullen auf: 2 kg 5 g = 2,005 kg.'],
          merksatz: 'Umrechnungszahl 1000, also drei Stellen nach dem Komma: 4 kg 75 g = 4,075 kg.',
          interactive: 'stairs', interactiveHint: 'Gib ein Gewicht mit Komma ein und lies es in g ab.',
        },
        beispiel: {aufgabe: 'Schreibe 1 kg 80 g mit Komma in kg.', schritte: ['Nach dem Komma stehen drei Stellen für Gramm.', '80 g sind 080 g.', 'Also: 1,080 kg (auch 1,08 kg).']},
        begruenden: {question: 'Nina schreibt: 3 kg 50 g = 3,50 kg. Was sagst du?', options: ['Richtig.', 'Falsch. 3,50 kg sind 3 kg 500 g. Richtig ist 3,050 kg.', 'Falsch. Richtig ist 3,5 g.'], answer: 1,
          explain: ['3,50 kg bedeutet 3 kg 500 g.', 'Richtig. Bei kg braucht man drei Stellen für die Gramm.', 'Die Einheit Gramm ist hier falsch.']},
      },
      {
        skill: 'm-rechnen', title: 'Mit Gewichten rechnen',
        entdecken: {question: 'Ein Rucksack wiegt 2 kg. Du packst eine Trinkflasche mit 750 g ein. Wie schwer ist er jetzt?', options: ['2.750 g', '752 g', '9,5 kg'], answer: 0,
          explain: ['Genau. 2 kg = 2.000 g. 2.000 g + 750 g = 2.750 g = 2,75 kg.', 'Du hast 2 und 750 addiert, ohne umzurechnen.', 'Das ist viel zu viel.']},
        verstehen: {
          text: ['Wie bei Längen gilt: Erst alle Gewichte in dieselbe Einheit bringen, dann rechnen.', 'Bei Sachaufgaben hilft eine kleine Skizze oder Tabelle.', 'Prüfe am Ende, ob das Ergebnis realistisch ist.'],
          merksatz: 'Gleiche Einheit, dann rechnen. Ergebnis mit Einheit und Antwortsatz.',
          interactive: 'balance', interactiveHint: 'Lege mehrere Gewichtsstücke auf und addiere sie.',
        },
        beispiel: {aufgabe: 'Für einen Kuchen braucht man 250 g Mehl, 125 g Zucker und 200 g Butter. Wie viel ist das zusammen?', schritte: ['Alle Angaben stehen schon in g.', '250 g + 125 g + 200 g = 575 g.', 'Antwort: Zusammen sind es 575 g.']},
        begruenden: {question: 'Ein Paket darf höchstens 5 kg wiegen. Es wiegt 4,8 kg. Darf ein Buch mit 300 g noch hinein?', options: ['Ja, es ist noch Platz.', 'Nein. 4,8 kg + 0,3 kg = 5,1 kg. Das ist zu schwer.', 'Ja, denn 300 g ist weniger als 5 kg.'], answer: 1,
          explain: ['Rechne aus, wie schwer das Paket dann ist.', 'Richtig. Es fehlen nur 200 g bis 5 kg.', 'Es kommt auf das Gesamtgewicht an.']},
      },
    ],
    vertiefung: {skill: 'm-preis', title: 'Preise und Gewichte',
      text: ['Im Supermarkt steht oft ein Grundpreis, zum Beispiel „Preis pro kg“.', 'So kannst du verschiedene Packungsgrößen vergleichen.', 'Rechne dazu beide Angebote auf dieselbe Menge um, zum Beispiel auf 1 kg.'],
      merksatz: 'Preise vergleichen: Beide Angebote auf dieselbe Menge umrechnen.',
      beispiel: {aufgabe: 'Packung A: 500 g für 2,40 €. Packung B: 1 kg für 4,20 €. Welche ist günstiger?', schritte: ['A auf 1 kg umrechnen: 1 kg = 2 · 500 g.', '2 · 2,40 € = 4,80 € pro kg.', 'B kostet 4,20 € pro kg.', 'B ist günstiger.']}},
    merkwissen: {
      stuetzpunkte: [['1 mg', 'ein Sandkorn'], ['1 g', 'eine Büroklammer'], ['100 g', 'eine Tafel Schokolade'], ['1 kg', 'eine Packung Zucker'], ['1 t', 'ein kleines Auto']],
      merksaetze: ['1 t = 1.000 kg', '1 kg = 1.000 g', '1 g = 1.000 mg', 'Die Umrechnungszahl ist immer 1000.', 'Bei kg stehen drei Stellen nach dem Komma.'],
      fehler: [{fehler: '2 t = 200 kg', richtig: '2 t = 2.000 kg'}, {fehler: '3 kg 50 g = 3,50 kg', richtig: '3 kg 50 g = 3,050 kg'}, {fehler: 'Gewichtsstück auf der Gegenstandsseite dazugezählt', richtig: 'Gewichtsstück abziehen'}],
      strategie: pruefen,
    },
  },
  // ===================================================================
  geld: {
    intro: 'Mit Geld rechnest du beim Einkaufen, beim Sparen und beim Teilen. Du lernst Münzen und Scheine zu zählen, Euro und Cent umzurechnen, Preise zu addieren, Wechselgeld zu bestimmen und Preise zu vervielfachen oder zu teilen.',
    ziele: ['Münzen und Scheine sicher zählen', 'Euro und Cent umrechnen', 'Preise addieren und subtrahieren', 'Wechselgeld berechnen', 'Preise vervielfachen und teilen'],
    stationen: [
      {
        skill: 'g-muenzen', title: 'Münzen und Scheine',
        entdecken: {question: 'Wie viel Geld sind zwei 2-€-Münzen und eine 50-ct-Münze?', options: ['4,50 €', '2,52 €', '5 €'], answer: 0,
          explain: ['Genau. 2 € + 2 € + 50 ct = 4,50 €.', 'Eine 2-€-Münze ist 2 Euro wert, nicht 2 Cent.', 'Rechne noch einmal: 4 € und 50 ct.']},
        verstehen: {
          text: ['Es gibt Münzen zu 1 ct, 2 ct, 5 ct, 10 ct, 20 ct, 50 ct, 1 € und 2 €.', 'Scheine gibt es zu 5 €, 10 €, 20 €, 50 €, 100 €, 200 € und 500 €.', 'Beim Zählen beginnst du mit dem größten Wert. Dann zählst du weiter.'],
          merksatz: 'Groß nach klein zählen: erst Scheine, dann Euro-Münzen, dann Cent-Münzen.',
          interactive: 'wallet', interactiveHint: 'Tippe Münzen und Scheine an. Die Summe wird mitgezählt.',
        },
        beispiel: {aufgabe: 'Wie viel Geld liegt hier?', visual: {type: 'coins', items: [1000, 200, 100, 50, 20, 20]}, schritte: ['Sortieren: 10 €, 2 €, 1 €, 50 ct, 20 ct, 20 ct.', 'Euro: 10 € + 2 € + 1 € = 13 €.', 'Cent: 50 ct + 20 ct + 20 ct = 90 ct.', 'Zusammen: 13,90 €.']},
        begruenden: {question: 'Lea soll 1,35 € mit möglichst wenigen Münzen legen. Welche Auswahl ist richtig?', options: ['1 € + 20 ct + 10 ct + 5 ct', '50 ct + 50 ct + 20 ct + 10 ct + 5 ct', '1 € + 10 ct + 10 ct + 10 ct + 5 ct'], answer: 0,
          explain: ['Richtig. Vier Münzen. Immer zuerst die größte passende Münze nehmen.', 'Der Betrag stimmt, aber es sind fünf Münzen. 1 € ersetzt zwei 50-ct-Münzen.', 'Der Betrag stimmt, aber 20 ct ersetzt zwei 10-ct-Münzen.']},
      },
      {
        skill: 'g-umrechnen', title: 'Euro und Cent',
        entdecken: {question: 'Wie viele Cent sind 1 Euro?', options: ['10 ct', '100 ct', '1.000 ct'], answer: 1,
          explain: ['10 ct ist eine Münze. 1 € ist mehr.', 'Genau. 1 € = 100 ct.', 'Das wären 10 €.']},
        verstehen: {
          text: ['Die Umrechnungszahl zwischen Euro und Cent ist 100.', 'Beim Schreiben mit Komma stehen immer zwei Stellen für die Cent: 3 € 5 ct = 3,05 €.', 'Von € nach ct: mal 100. Von ct nach €: geteilt durch 100.'],
          merksatz: '1 € = 100 ct. Bei Geld stehen immer zwei Stellen nach dem Komma.',
          interactive: 'stairs', interactiveHint: 'Gib einen Betrag ein und vergleiche € und ct.',
        },
        beispiel: {aufgabe: 'Schreibe 2 € 7 ct mit Komma.', schritte: ['Zwei Stellen nach dem Komma für die Cent.', '7 ct sind 07.', 'Also: 2,07 €.', 'Achtung: 2,70 € wären 2 € 70 ct.']},
        begruenden: {question: 'Max schreibt: 450 ct = 45,0 €. Was stimmt?', options: ['Richtig.', 'Falsch. 450 ct = 4,50 €.', 'Falsch. 450 ct = 0,45 €.'], answer: 1,
          explain: ['Max hat nur durch 10 geteilt.', 'Richtig. 450 : 100 = 4,50.', '0,45 € sind 45 ct.']},
      },
      {
        skill: 'g-rechnen', title: 'Preise addieren',
        entdecken: {question: 'Ein Heft kostet 1,20 €, ein Stift 0,95 €. Wie viel kostet beides zusammen?', options: ['2,15 €', '1,115 €', '2,05 €'], answer: 0,
          explain: ['Genau. 120 ct + 95 ct = 215 ct = 2,15 €.', 'Komma unter Komma schreiben. Geld hat zwei Stellen nach dem Komma.', 'Rechne noch einmal die Cent: 20 ct + 95 ct = 115 ct.']},
        verstehen: {
          text: ['Beim schriftlichen Rechnen mit Geld steht Komma unter Komma.', 'Du kannst auch alles in Cent umrechnen. Dann rechnest du ohne Komma.', 'Ein Kassenzettel hilft, alle Preise geordnet zu addieren.'],
          merksatz: 'Komma unter Komma. Oder: alles in Cent rechnen und am Ende in Euro zurückverwandeln.',
          interactive: 'wallet', interactiveHint: 'Lege einen Betrag mit Münzen und Scheinen.',
        },
        beispiel: {aufgabe: 'Kassenzettel: Brot 2,49 €, Milch 1,19 €, Äpfel 2,80 €.', visual: {type: 'receipt', lines: [['Brot', 249], ['Milch', 119], ['Äpfel', 280]]}, schritte: ['In Cent: 249 + 119 + 280.', '249 + 119 = 368. 368 + 280 = 648.', '648 ct = 6,48 €.']},
        begruenden: {question: 'Sara rechnet 3,50 € + 2,8 € = 3,78 €. Was ist passiert?', options: ['Alles richtig.', 'Sie hat 2,8 € wie 28 ct behandelt. 2,8 € = 2,80 €. Ergebnis: 6,30 €.', 'Sie hätte subtrahieren müssen.'], answer: 1,
          explain: ['3,78 € ist kleiner als 3,50 € + 2 €. Das kann nicht stimmen.', 'Richtig. Komma unter Komma: 3,50 + 2,80 = 6,30.', 'Bei „zusammen“ wird addiert.']},
      },
      {
        skill: 'g-wechselgeld', title: 'Wechselgeld',
        entdecken: {question: 'Du kaufst etwas für 3,60 € und bezahlst mit 5 €. Wie viel bekommst du zurück?', options: ['1,40 €', '2,40 €', '1,60 €'], answer: 0,
          explain: ['Genau. Von 3,60 € bis 4 € sind es 40 ct, bis 5 € noch 1 €.', 'Zähle noch einmal: 3,60 € plus 2,40 € ergibt 6 €.', '1,60 € ist zu viel. Prüfe: 3,60 € + 1,60 € = 5,20 €.']},
        verstehen: {
          text: ['Wechselgeld ist der Unterschied zwischen dem bezahlten Betrag und dem Preis.', 'An der Kasse wird oft ergänzt: vom Preis in Schritten bis zum bezahlten Betrag.', 'Zuerst bis zum nächsten vollen Euro, dann bis zum Schein.'],
          merksatz: 'Wechselgeld = bezahlt − Preis. Ergänzen: erst bis zum vollen Euro, dann weiter.',
          interactive: 'wallet', interactiveHint: 'Lege das Wechselgeld mit möglichst wenigen Münzen.',
        },
        beispiel: {aufgabe: 'Einkauf für 7,35 €, bezahlt mit 10 €.', schritte: ['Von 7,35 € bis 7,40 €: 5 ct.', 'Von 7,40 € bis 8 €: 60 ct.', 'Von 8 € bis 10 €: 2 €.', 'Zusammen: 2 € + 60 ct + 5 ct = 2,65 €.']},
        begruenden: {question: 'Bei einem Einkauf von 4,70 € gibt jemand 20 € und bekommt 16,30 € zurück. Stimmt das?', options: ['Ja.', 'Nein. Richtig sind 15,30 €.', 'Nein. Richtig sind 15,70 €.'], answer: 1,
          explain: ['Probe: 4,70 € + 16,30 € = 21 €. Das ist 1 € zu viel.', 'Richtig. Probe: 4,70 € + 15,30 € = 20 €.', 'Probe: 4,70 € + 15,70 € = 20,40 €.']},
      },
      {
        skill: 'g-malteilen', title: 'Vervielfachen und teilen',
        entdecken: {question: 'Ein Eis kostet 1,50 €. Wie viel kosten 4 Eis?', options: ['6 €', '4,50 €', '5,50 €'], answer: 0,
          explain: ['Genau. 4 · 1,50 € = 4 · 150 ct = 600 ct = 6 €.', 'Du hast 1,50 € und 3 € addiert. Rechne 4 · 1,50 €.', 'Prüfe: 1,50 € + 1,50 € + 1,50 € + 1,50 €.']},
        verstehen: {
          text: ['Mehrere gleiche Dinge kaufen: Preis mal Anzahl.', 'Einen Betrag gerecht teilen: Betrag geteilt durch Anzahl der Personen.', 'Rechne am besten in Cent. Dann vermeidest du Kommafehler.'],
          merksatz: 'Mal: viele gleiche Preise. Geteilt: gerecht aufteilen. In Cent rechnen hilft.',
          interactive: 'wallet', interactiveHint: 'Lege einen Preis mehrmals und zähle die Summe.',
        },
        beispiel: {aufgabe: 'Drei Freunde teilen sich eine Pizza für 13,50 €. Wie viel zahlt jeder?', schritte: ['In Cent: 13,50 € = 1.350 ct.', '1.350 ct : 3 = 450 ct.', '450 ct = 4,50 €.', 'Probe: 3 · 4,50 € = 13,50 €.']},
        begruenden: {question: 'Zwei Kinder teilen 7 €. Ein Kind sagt: „Jeder bekommt 3,05 €.“', options: ['Richtig.', 'Falsch. 7 € : 2 = 3,50 €.', 'Falsch. Jeder bekommt 3 €.'], answer: 1,
          explain: ['Probe: 2 · 3,05 € = 6,10 €. Das ist zu wenig.', 'Richtig. 700 ct : 2 = 350 ct = 3,50 €.', 'Dann bleibt 1 € übrig.']},
      },
    ],
    vertiefung: {skill: 'g-ueberschlag', title: 'Überschlagen beim Einkaufen',
      text: ['Beim Einkaufen musst du oft schnell wissen, ob dein Geld reicht.', 'Dazu rundest du die Preise auf volle Euro auf und addierst.', 'Rundest du immer auf, weißt du: Wenn der Überschlag reicht, reicht das Geld sicher.'],
      merksatz: 'Überschlag: Preise aufrunden und addieren. So bist du auf der sicheren Seite.',
      beispiel: {aufgabe: 'Du hast 10 €. Du möchtest Saft für 1,89 €, Kekse für 2,29 € und Käse für 3,49 € kaufen.', schritte: ['Aufrunden: 2 € + 3 € + 4 € = 9 €.', '9 € sind weniger als 10 €.', 'Das Geld reicht sicher.', 'Genau gerechnet: 7,67 €.']}},
    merkwissen: {
      stuetzpunkte: [['1 ct', 'kleinste Münze'], ['50 ct', 'größte Cent-Münze'], ['2 €', 'größte Münze'], ['5 €', 'kleinster Schein'], ['500 €', 'größter Schein']],
      merksaetze: ['1 € = 100 ct', 'Geld hat immer zwei Stellen nach dem Komma.', 'Wechselgeld = bezahlt − Preis', 'Probe: Preis + Wechselgeld = bezahlter Betrag'],
      fehler: [{fehler: '2 € 5 ct = 2,5 €', richtig: '2 € 5 ct = 2,05 €'}, {fehler: '450 ct = 45 €', richtig: '450 ct = 4,50 €'}, {fehler: '3,50 € + 2,8 € = 3,78 €', richtig: '3,50 € + 2,80 € = 6,30 €'}],
      strategie: pruefen,
    },
  },
  // ===================================================================
  flaeche: {
    intro: 'Wie groß ist ein Zimmer, ein Beet oder ein Blatt Papier? Dafür misst man Flächen. Du lernst Flächen auszuzählen, Rechtecke zu berechnen, Umfang und Flächeninhalt zu unterscheiden, Flächeneinheiten umzurechnen und zusammengesetzte Flächen zu bestimmen.',
    ziele: ['Flächen mit Einheitsquadraten auszählen', 'Den Flächeninhalt von Rechteck und Quadrat berechnen', 'Umfang und Flächeninhalt unterscheiden', 'Flächeneinheiten umrechnen', 'Zusammengesetzte Flächen berechnen'],
    stationen: [
      {
        skill: 'f-auszaehlen', title: 'Flächen auszählen',
        entdecken: {question: 'Welche Figur ist größer: ein Rechteck aus 3 · 4 Kästchen oder eines aus 2 · 6 Kästchen?', options: ['das Rechteck 3 · 4', 'das Rechteck 2 · 6', 'Beide sind gleich groß.'], answer: 2,
          explain: ['Zähle die Kästchen: 3 · 4 = 12.', 'Zähle die Kästchen: 2 · 6 = 12.', 'Genau. Beide bestehen aus 12 Kästchen. Sie haben denselben Flächeninhalt, obwohl sie verschieden aussehen.']},
        verstehen: {
          text: ['Der Flächeninhalt gibt an, wie viele Einheitsquadrate in eine Figur passen.', 'Ein Kästchen mit 1 cm Seitenlänge hat den Flächeninhalt 1 cm² (Quadratzentimeter).', 'Zwei halbe Kästchen ergeben zusammen ein ganzes.'],
          merksatz: 'Flächeninhalt = Anzahl der Einheitsquadrate. 1 cm² ist ein Quadrat mit 1 cm Seitenlänge.',
          interactive: 'grid', interactiveHint: 'Tippe Kästchen an, um eine Figur zu bauen. Die Fläche wird mitgezählt.',
        },
        beispiel: {aufgabe: 'Wie groß ist die Fläche der Figur? Jedes Kästchen ist 1 cm².', visual: {type: 'grid', w: 5, h: 3, full: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1]], half: [[3, 0, 'bl'], [4, 1, 'tl']]}, schritte: ['Ganze Kästchen zählen: 7.', 'Halbe Kästchen: 2. Zwei halbe sind ein ganzes.', 'Zusammen: 7 + 1 = 8 Kästchen.', 'Die Fläche ist 8 cm².']},
        begruenden: {question: 'Zwei Figuren bestehen aus je 10 Kästchen, sehen aber verschieden aus. Ole sagt: „Die längere Figur hat mehr Fläche.“', options: ['Ole hat recht.', 'Ole hat nicht recht. Beide haben 10 cm² Fläche.', 'Das kann man nicht entscheiden.'], answer: 1,
          explain: ['Die Form ist egal, es zählt die Anzahl der Kästchen.', 'Richtig. Gleich viele Einheitsquadrate bedeuten gleich große Fläche.', 'Doch: Man zählt die Kästchen.']},
      },
      {
        skill: 'f-rechteck', title: 'Rechteck und Quadrat',
        entdecken: {question: 'Ein Rechteck hat 5 Reihen mit je 4 Kästchen. Wie viele Kästchen sind es?', options: ['9', '20', '18'], answer: 1,
          explain: ['5 + 4 ist die Anzahl von Reihen und Spalten, nicht von Kästchen.', 'Genau. 5 Reihen mit je 4 Kästchen: 5 · 4 = 20.', '18 ist der Umfang, nicht die Anzahl der Kästchen.']},
        verstehen: {
          text: ['Du musst die Kästchen nicht einzeln zählen. In einer Reihe liegen so viele Kästchen, wie das Rechteck lang ist. Es gibt so viele Reihen, wie das Rechteck breit ist.', 'Deshalb gilt: Flächeninhalt = Länge mal Breite, kurz A = a · b.', 'Beim Quadrat sind alle Seiten gleich lang: A = a · a.'],
          merksatz: 'Rechteck: A = a · b. Quadrat: A = a · a. Beide Seiten in derselben Einheit, das Ergebnis in Quadrat-Einheiten.',
          interactive: 'rect', interactiveHint: 'Verändere Länge und Breite. Beobachte, wie sich die Fläche ändert.',
        },
        beispiel: {aufgabe: 'Ein Rechteck ist 7 cm lang und 4 cm breit. Berechne den Flächeninhalt.', visual: {type: 'rect', a: '7 cm', b: '4 cm', ratio: 4 / 7}, schritte: ['Formel: A = a · b.', 'Einsetzen: A = 7 cm · 4 cm.', 'Rechnen: A = 28 cm².']},
        begruenden: {question: 'Ein Rechteck ist 2 m lang und 50 cm breit. Kim rechnet: A = 2 · 50 = 100 m². Was ist falsch?', options: ['Nichts.', 'Die Seiten haben verschiedene Einheiten. 200 cm · 50 cm = 10.000 cm² = 1 m².', 'Kim hätte addieren müssen.'], answer: 1,
          explain: ['100 m² wäre so groß wie ein Klassenraum. Das Rechteck ist aber nur 2 m lang.', 'Richtig. Erst in dieselbe Einheit umrechnen.', 'Für die Fläche wird multipliziert.']},
      },
      {
        skill: 'f-umfang', title: 'Umfang und Flächeninhalt',
        entdecken: {question: 'Ein Gartenbeet bekommt einen Zaun. Was muss man berechnen?', options: ['den Umfang', 'den Flächeninhalt', 'das Volumen'], answer: 0,
          explain: ['Genau. Der Zaun läuft am Rand entlang. Das ist der Umfang.', 'Der Flächeninhalt beschreibt das Innere, zum Beispiel wie viel Rasen man säen kann.', 'Volumen braucht man bei Körpern, nicht bei Flächen.']},
        verstehen: {
          text: ['Der Umfang ist die Länge des Randes. Er wird in Längeneinheiten angegeben, zum Beispiel cm.', 'Der Flächeninhalt beschreibt das Innere. Er wird in Flächeneinheiten angegeben, zum Beispiel cm².', 'Rechteck: U = 2 · (a + b) und A = a · b.'],
          merksatz: 'Umfang = Rand (cm). Flächeninhalt = Innen (cm²). U = 2 · (a + b), A = a · b.',
          interactive: 'rect', interactiveHint: 'Verändere die Seiten. Vergleiche Umfang und Fläche.',
        },
        beispiel: {aufgabe: 'Ein Rechteck ist 6 cm lang und 3 cm breit. Berechne Umfang und Flächeninhalt.', visual: {type: 'rect', a: '6 cm', b: '3 cm', ratio: 0.5}, schritte: ['Umfang: U = 2 · (6 cm + 3 cm) = 2 · 9 cm = 18 cm.', 'Flächeninhalt: A = 6 cm · 3 cm = 18 cm².', 'Die Zahlen sind gleich, aber die Einheiten sind verschieden: cm und cm².']},
        begruenden: {question: 'Zwei Rechtecke haben beide den Umfang 20 cm. Haben sie dann auch denselben Flächeninhalt?', options: ['Ja, immer.', 'Nein. Ein Rechteck 9 cm · 1 cm hat 9 cm², eines mit 5 cm · 5 cm hat 25 cm².', 'Man kann es nicht ausrechnen.'], answer: 1,
          explain: ['Probiere es mit dem Rechteck-Baukasten aus.', 'Richtig. Gleicher Umfang bedeutet nicht gleiche Fläche.', 'Doch, mit den Seitenlängen kann man rechnen.']},
      },
      {
        skill: 'f-einheiten', title: 'Flächeneinheiten',
        entdecken: {question: 'Ein Quadrat hat 1 dm Seitenlänge. Wie viele Zentimeterquadrate passen hinein?', options: ['10', '100', '1.000'], answer: 1,
          explain: ['In eine Reihe passen 10. Es gibt aber 10 Reihen.', 'Genau. 10 Reihen mit je 10 Quadraten: 10 · 10 = 100. Also 1 dm² = 100 cm².', '1.000 brauchst du später beim Volumen.']},
        verstehen: {
          text: ['Bei Flächen ist die Umrechnungszahl 100, weil Länge und Breite jeweils mal 10 genommen werden: 10 · 10 = 100.', 'Die Treppe: km², ha, a, m², dm², cm², mm².', 'Ar (a) und Hektar (ha) nutzt man für Grundstücke und Felder: 1 a = 100 m² (ein Quadrat mit 10 m Seite), 1 ha = 100 a.'],
          merksatz: 'Flächeneinheiten: Umrechnungszahl 100. 1 m² = 100 dm² = 10.000 cm².',
          interactive: 'stairs', interactiveHint: 'Wähle zwei Flächeneinheiten und sieh die Umrechnungszahl.',
        },
        beispiel: {aufgabe: 'Rechne um: 3 m² = ? dm²', visual: {type: 'stairs', bereich: 'flaeche', from: 'm2', to: 'dm2'}, schritte: ['Von m² nach dm² geht es eine Stufe nach unten.', 'Eine Stufe: mal 100.', '3 · 100 = 300', 'Also: 3 m² = 300 dm².']},
        begruenden: {question: 'Jan rechnet: 5 m² = 50 dm². Was meinst du?', options: ['Richtig.', 'Falsch. Bei Flächen ist die Umrechnungszahl 100: 5 m² = 500 dm².', 'Falsch. 5 m² = 5.000 dm².'], answer: 1,
          explain: ['Jan hat mit 10 wie bei Längen gerechnet.', 'Richtig. 1 m² = 100 dm², weil 10 · 10 = 100.', '1.000 ist die Umrechnungszahl beim Volumen.']},
      },
      {
        skill: 'f-zusammengesetzt', title: 'Zusammengesetzte Flächen',
        entdecken: {question: 'Wie kann man den Flächeninhalt einer L-förmigen Figur berechnen?', options: ['Man zerlegt sie in zwei Rechtecke und addiert.', 'Man multipliziert alle Seiten.', 'Man addiert alle Seiten.'], answer: 0,
          explain: ['Genau. Zerlegen oder ergänzen sind die beiden Strategien.', 'Das ergibt keine Fläche.', 'Das wäre der Umfang.']},
        verstehen: {
          text: ['Zusammengesetzte Figuren kannst du in Rechtecke zerlegen. Du berechnest jedes Rechteck und addierst.', 'Oder du ergänzt die Figur zu einem großen Rechteck und ziehst das fehlende Stück ab.', 'Bei einem Rahmen rechnest du: großes Rechteck minus inneres Rechteck.'],
          merksatz: 'Zerlegen und addieren oder ergänzen und subtrahieren.',
          interactive: 'grid', interactiveHint: 'Baue eine L-Figur aus Kästchen und zähle die Fläche.',
        },
        beispiel: {aufgabe: 'Ein L-förmiges Zimmer: großes Rechteck 6 m · 4 m, davon fehlt eine Ecke von 2 m · 2 m.', visual: {type: 'lshape', dims: {W: 6, H: 4, cutW: 2, cutH: 2}, unit: 'm'}, schritte: ['Ergänzen: großes Rechteck 6 m · 4 m = 24 m².', 'Fehlende Ecke: 2 m · 2 m = 4 m².', 'Abziehen: 24 m² − 4 m² = 20 m².']},
        begruenden: {question: 'Ein Bilderrahmen ist außen 30 cm · 20 cm, innen 24 cm · 14 cm. Wie berechnest du die Fläche des Rahmens?', options: ['30 · 20 + 24 · 14', '30 · 20 − 24 · 14', '(30 − 24) · (20 − 14)'], answer: 1,
          explain: ['Das Innere gehört nicht zum Rahmen. Es wird abgezogen.', 'Richtig. 600 cm² − 336 cm² = 264 cm².', 'Das wäre nur ein kleines Rechteck in einer Ecke.']},
      },
    ],
    vertiefung: {skill: 'f-sachaufgaben', title: 'Flächen im Alltag',
      text: ['Im Alltag geht es oft darum, wie viel Material man braucht: Fliesen, Rasen, Farbe oder Teppich.', 'Berechne zuerst die Fläche. Teile dann durch die Fläche, die ein Stück oder eine Packung bedeckt.', 'Wenn eine Packung nicht reicht, musst du aufrunden. Halbe Packungen kann man nicht kaufen.'],
      merksatz: 'Bedarf = Gesamtfläche : Fläche pro Stück. Bei Packungen immer aufrunden.',
      beispiel: {aufgabe: 'Ein Boden ist 4 m · 3 m groß. Ein Paket Laminat reicht für 2 m². Wie viele Pakete braucht man?', visual: {type: 'rect', a: '4 m', b: '3 m', ratio: 0.75}, schritte: ['Fläche: 4 m · 3 m = 12 m².', 'Pakete: 12 m² : 2 m² = 6.', 'Man braucht 6 Pakete.']}},
    merkwissen: {
      stuetzpunkte: [['1 cm²', 'Fingernagel'], ['1 dm²', 'Fläche einer Hand'], ['1 m²', 'großes Plakat'], ['1 a', 'Quadrat mit 10 m Seitenlänge, etwa ein großer Klassenraum mal anderthalb'], ['1 ha', 'Quadrat mit 100 m Seitenlänge, etwas größer als ein Fußballfeld']],
      merksaetze: ['Rechteck: A = a · b, U = 2 · (a + b)', 'Quadrat: A = a · a, U = 4 · a', 'Flächeneinheiten: Umrechnungszahl 100', '1 m² = 100 dm² = 10.000 cm²', '1 a = 100 m², 1 ha = 100 a, 1 km² = 100 ha'],
      fehler: [{fehler: 'Umfang in cm² angeben', richtig: 'Umfang in cm, Fläche in cm²'}, {fehler: '5 m² = 50 dm²', richtig: '5 m² = 500 dm²'}, {fehler: '2 m · 50 cm = 100 m²', richtig: '200 cm · 50 cm = 10.000 cm² = 1 m²'}, {fehler: 'Bei Rahmen das Innere dazuzählen', richtig: 'außen minus innen'}],
      strategie: pruefen,
    },
  },
  // ===================================================================
  volumen: {
    intro: 'Wie viel passt in eine Kiste, ein Aquarium oder eine Flasche? Das gibt das Volumen an. Du lernst Volumen mit Würfeln zu bestimmen, Quader zu berechnen, Volumeneinheiten umzurechnen und mit Litern zu arbeiten.',
    ziele: ['Volumen mit Einheitswürfeln bestimmen', 'Das Volumen von Quader und Würfel berechnen', 'Volumeneinheiten umrechnen', 'Liter und Milliliter verwenden', 'Sachaufgaben zum Volumen lösen'],
    stationen: [
      {
        skill: 'v-wuerfel', title: 'Würfel zählen',
        entdecken: {question: 'Ein Quader ist aus 2 Schichten gebaut. Jede Schicht hat 3 · 2 Würfel. Wie viele Würfel sind es?', options: ['7', '12', '10'], answer: 1,
          explain: ['3 + 2 + 2 addiert nur die Kantenlängen.', 'Genau. Eine Schicht hat 6 Würfel, zwei Schichten haben 12.', 'Zähle Schicht für Schicht: 6 + 6.']},
        verstehen: {
          text: ['Das Volumen gibt an, wie viele Einheitswürfel in einen Körper passen.', 'Ein Würfel mit 1 cm Kantenlänge hat das Volumen 1 cm³ (Kubikzentimeter).', 'Beim Zählen gehst du in Schichten vor: Würfel einer Schicht mal Anzahl der Schichten.'],
          merksatz: 'Volumen = Anzahl der Einheitswürfel. Schichtweise zählen: eine Schicht mal Anzahl der Schichten.',
          interactive: 'cuboid', interactiveHint: 'Baue einen Quader aus Würfeln und zähle die Schichten.',
        },
        beispiel: {aufgabe: 'Wie viele Würfel hat der Quader?', visual: {type: 'cuboid', a: 4, b: 2, c: 3}, schritte: ['Untere Schicht: 4 · 2 = 8 Würfel.', 'Es gibt 3 Schichten.', '3 · 8 = 24 Würfel.', 'Das Volumen ist 24 cm³, wenn jeder Würfel 1 cm³ hat.']},
        begruenden: {question: 'Lars zählt bei einem Quader nur die Würfel, die er sieht. Was ist das Problem?', options: ['Kein Problem.', 'Er übersieht die verdeckten Würfel im Inneren und hinten.', 'Er müsste die Kanten zählen.'], answer: 1,
          explain: ['Viele Würfel sind von vorne nicht sichtbar.', 'Richtig. Deshalb zählt man Schichten: Länge mal Breite mal Höhe.', 'Kanten sagen etwas über Längen, nicht über das Volumen.']},
      },
      {
        skill: 'v-quader', title: 'Quader berechnen',
        entdecken: {question: 'Eine Kiste ist 5 cm lang, 3 cm breit und 2 cm hoch. Wie viele 1-cm-Würfel passen hinein?', options: ['10', '30', '15'], answer: 1,
          explain: ['5 + 3 + 2 = 10 ist die Summe der Kanten.', 'Genau. 5 · 3 = 15 Würfel pro Schicht, 2 Schichten: 30.', '15 ist nur eine Schicht.']},
        verstehen: {
          text: ['Beim Quader liegen Länge mal Breite Würfel in einer Schicht. Es gibt so viele Schichten, wie der Quader hoch ist.', 'Deshalb gilt: V = a · b · c (Länge mal Breite mal Höhe).', 'Beim Würfel sind alle Kanten gleich lang: V = a · a · a.'],
          merksatz: 'Quader: V = a · b · c. Würfel: V = a · a · a. Alle Kanten in derselben Einheit, Ergebnis in Kubik-Einheiten.',
          interactive: 'cuboid', interactiveHint: 'Verändere Länge, Breite und Höhe. Beobachte das Volumen.',
        },
        beispiel: {aufgabe: 'Ein Schuhkarton ist 30 cm lang, 20 cm breit und 10 cm hoch. Berechne das Volumen.', visual: {type: 'box', a: '30 cm', b: '20 cm', c: '10 cm'}, schritte: ['Formel: V = a · b · c.', 'V = 30 cm · 20 cm · 10 cm.', '30 · 20 = 600, 600 · 10 = 6.000.', 'V = 6.000 cm³ = 6 dm³ = 6 l.']},
        begruenden: {question: 'Ein Würfel hat die Kantenlänge 3 cm. Tom rechnet: V = 3 · 3 = 9 cm³. Was fehlt?', options: ['Nichts.', 'Die dritte Kante. V = 3 · 3 · 3 = 27 cm³.', 'Man muss addieren.'], answer: 1,
          explain: ['3 · 3 ist nur die Grundfläche (eine Schicht).', 'Richtig. Es gibt 3 Schichten mit je 9 Würfeln.', 'Für Volumen wird multipliziert.']},
      },
      {
        skill: 'v-einheiten', title: 'Volumeneinheiten',
        entdecken: {question: 'Wie viele 1-cm-Würfel passen in einen Würfel mit 1 dm Kantenlänge?', options: ['10', '100', '1.000'], answer: 2,
          explain: ['Das ist nur eine Reihe.', 'Das ist nur eine Schicht.', 'Genau. 10 · 10 · 10 = 1.000. Also 1 dm³ = 1.000 cm³.']},
        verstehen: {
          text: ['Bei Volumen ist die Umrechnungszahl 1000, weil Länge, Breite und Höhe jeweils mal 10 genommen werden: 10 · 10 · 10 = 1.000.', 'Die Treppe: m³, dm³, cm³, mm³.', 'Vergleiche: Länge 10, Fläche 100, Volumen 1000.'],
          merksatz: 'Volumeneinheiten: Umrechnungszahl 1000. 1 m³ = 1.000 dm³, 1 dm³ = 1.000 cm³.',
          interactive: 'stairs', interactiveHint: 'Wähle zwei Volumeneinheiten und vergleiche die Umrechnungszahl.',
        },
        beispiel: {aufgabe: 'Rechne um: 4 dm³ = ? cm³', visual: {type: 'stairs', bereich: 'volumen', from: 'dm3', to: 'cm3'}, schritte: ['Von dm³ nach cm³ geht es eine Stufe nach unten.', 'Eine Stufe: mal 1000.', '4 · 1.000 = 4.000', 'Also: 4 dm³ = 4.000 cm³.']},
        begruenden: {question: 'Mila rechnet: 2 m³ = 200 dm³. Was sagst du?', options: ['Richtig.', 'Falsch. Die Umrechnungszahl ist 1000: 2 m³ = 2.000 dm³.', 'Falsch. 2 m³ = 20 dm³.'], answer: 1,
          explain: ['Mila hat mit 100 gerechnet wie bei Flächen.', 'Richtig. 10 · 10 · 10 = 1.000.', '20 wäre die Umrechnung bei Längen.']},
      },
      {
        skill: 'v-liter', title: 'Liter und Milliliter',
        entdecken: {question: 'Wie viel Wasser passt in einen Würfel mit 1 dm Kantenlänge?', options: ['1 ml', '1 l', '10 l'], answer: 1,
          explain: ['1 ml ist nur ein Fingerhut voll.', 'Genau. 1 dm³ = 1 l. Ein Liter ist genau ein Würfel mit 10 cm Kante.', '10 l wäre ein großer Eimer.']},
        verstehen: {
          text: ['Für Flüssigkeiten nutzt man Liter (l) und Milliliter (ml).', '1 l = 1 dm³ und 1 ml = 1 cm³. Es sind nur andere Namen für dieselben Volumen.', '1 l = 1.000 ml. Ein Messbecher zeigt, wie viel Flüssigkeit darin ist.'],
          merksatz: '1 l = 1 dm³ = 1.000 ml = 1.000 cm³.',
          interactive: 'jug', interactiveHint: 'Fülle den Messbecher und lies ml und l ab.',
        },
        beispiel: {aufgabe: 'Ein Messbecher zeigt 750 ml. Wie viele Liter sind das?', visual: {type: 'jug', ml: 750, max: 1000, step: 250}, schritte: ['1 l = 1.000 ml.', '750 ml : 1.000 = 0,75 l.', 'Es sind 0,75 l, also drei Viertel Liter.']},
        begruenden: {question: 'Ein Aquarium hat 60 dm³ Volumen. Fynn sagt: „Da passen 6 Liter hinein.“', options: ['Richtig.', 'Falsch. 60 dm³ = 60 l.', 'Falsch. Es sind 600 l.'], answer: 1,
          explain: ['Fynn hat geteilt. Dabei sind dm³ und l gleich groß.', 'Richtig. 1 dm³ = 1 l, also 60 dm³ = 60 l.', 'Die Maßzahl bleibt gleich.']},
      },
      {
        skill: 'v-sachaufgaben', title: 'Volumen im Alltag',
        entdecken: {question: 'Ein Aquarium ist 50 cm lang, 30 cm breit und 40 cm hoch. Wie viele Liter passen etwa hinein?', options: ['6 l', '60 l', '600 l'], answer: 1,
          explain: ['Rechne in dm: 5 · 3 · 4.', 'Genau. 5 dm · 3 dm · 4 dm = 60 dm³ = 60 l.', '600 l wären etwa vier volle Badewannen.']},
        verstehen: {
          text: ['Bei Sachaufgaben rechnest du die Kanten am besten in dm um. Dann ergibt sich das Volumen direkt in dm³ = l.', 'Achte darauf, ob ein Gefäß ganz voll ist oder nur bis zu einer bestimmten Höhe gefüllt wird.', 'Prüfe, ob das Ergebnis realistisch ist.'],
          merksatz: 'In dm rechnen, dann ist dm³ gleich Liter.',
          interactive: 'cuboid', interactiveHint: 'Stelle die Maße eines Aquariums ein und lies das Volumen in Litern ab.',
        },
        beispiel: {aufgabe: 'Eine Kiste ist 4 dm lang, 3 dm breit und 2 dm hoch. Sie wird mit Sand gefüllt. Wie viele Liter Sand braucht man?', visual: {type: 'box', a: '4 dm', b: '3 dm', c: '2 dm'}, schritte: ['V = 4 dm · 3 dm · 2 dm = 24 dm³.', '1 dm³ = 1 l.', 'Man braucht 24 l Sand.']},
        begruenden: {question: 'Ein Becken ist 2 m lang, 1 m breit und 50 cm hoch. Wie rechnest du richtig?', options: ['2 · 1 · 50 = 100 m³', '20 dm · 10 dm · 5 dm = 1.000 dm³ = 1.000 l', '2 + 1 + 0,5 = 3,5 m³'], answer: 1,
          explain: ['Die Höhe steht in cm, die anderen Kanten in m.', 'Richtig. Alles in dm umrechnen, dann ist das Ergebnis direkt in Litern.', 'Volumen wird multipliziert, nicht addiert.']},
      },
    ],
    vertiefung: {skill: 'v-oberflaeche', title: 'Oberfläche von Quadern',
      text: ['Die Oberfläche ist die Summe aller Flächen, die einen Körper begrenzen.', 'Ein Quader hat 6 Rechtecke: je zwei gleiche oben und unten, vorne und hinten, links und rechts.', 'O = 2 · (a · b + a · c + b · c). Die Oberfläche ist eine Fläche, deshalb in cm².'],
      merksatz: 'Volumen: Wie viel passt hinein (cm³)? Oberfläche: Wie viel Papier braucht man zum Bekleben (cm²)?',
      beispiel: {aufgabe: 'Ein Würfel hat die Kantenlänge 4 cm. Berechne die Oberfläche.', visual: {type: 'cuboid', a: 4, b: 4, c: 4}, schritte: ['Ein Würfel hat 6 gleiche Quadrate.', 'Ein Quadrat: 4 cm · 4 cm = 16 cm².', 'O = 6 · 16 cm² = 96 cm².']}},
    merkwissen: {
      stuetzpunkte: [['1 cm³', 'ein Spielwürfel'], ['1 ml', 'ein Fingerhut'], ['1 l', 'eine Milchtüte'], ['10 l', 'ein Eimer'], ['1 m³', 'ein Würfel mit 1 m Kante, 1.000 l']],
      merksaetze: ['Quader: V = a · b · c', 'Würfel: V = a · a · a', 'Volumeneinheiten: Umrechnungszahl 1000', '1 l = 1 dm³ = 1.000 ml', '1 ml = 1 cm³'],
      fehler: [{fehler: '2 m³ = 200 dm³', richtig: '2 m³ = 2.000 dm³'}, {fehler: 'Würfel 3 cm: V = 9 cm³', richtig: 'V = 3 · 3 · 3 = 27 cm³'}, {fehler: '60 dm³ = 6 l', richtig: '60 dm³ = 60 l'}, {fehler: 'Kanten in verschiedenen Einheiten multipliziert', richtig: 'Zuerst alle Kanten in dieselbe Einheit umrechnen'}],
      strategie: pruefen,
    },
  },
};

/** Vergleich der Umrechnungszahlen über alle Bereiche (für die Hilfen). */
export const uzVergleich: [string, string, string][] = [
  ['Länge', '10 (m → km: 1000)', '1 m = 10 dm'],
  ['Gewicht', '1000', '1 kg = 1.000 g'],
  ['Geld', '100', '1 € = 100 ct'],
  ['Fläche', '100', '1 m² = 100 dm²'],
  ['Volumen', '1000', '1 dm³ = 1.000 cm³'],
];
