// Vertiefungen und Hilfen für die Lernmodule von MatheKompass.
import type {Topic} from './math.ts';

export type Pruefung =
  | {kind: 'zahl'; felder: {label: string; wert: number; einheit?: string}[]}
  | {kind: 'wahl'; optionen: string[]; richtig: number};

export type Vertiefungsaufgabe = {
  typ: 'Knobeln' | 'Begründen' | 'Sachproblem';
  titel: string;
  aufgabe: string;
  pruefung: Pruefung;
  tipp: string;
  loesung: string[];
};

export type ModulHilfe = {
  merksaetze: string[];
  beispiel: {aufgabe: string; schritte: string[]};
  fehler: {fehler: string; richtig: string}[];
  strategie: string[];
};

export type ModulInhalt = {hilfe: ModulHilfe; vertiefung: Vertiefungsaufgabe[]};

const zahl = (...felder: {label: string; wert: number; einheit?: string}[]): Pruefung => ({kind: 'zahl', felder});
const wahl = (richtig: number, ...optionen: string[]): Pruefung => ({kind: 'wahl', optionen, richtig});

export const modulInhalte: Record<Topic, ModulInhalt> = {
  data: {
    hilfe: {
      merksaetze: [
        'In einer Urliste stehen alle Daten in der Reihenfolge, in der sie erhoben wurden.',
        'In der Strichliste ist der fünfte Strich ein Querstrich. Ein Fünferbündel zählt 5.',
        'Ein Diagramm braucht einen Titel, beschriftete Achsen, eine Einheit und gleich große Zahlenschritte.',
        'Lies zuerst Titel, Achsen und Schrittweite. Erst dann liest du Werte ab.',
      ],
      beispiel: {
        aufgabe: '24 Kinder wurden befragt: 9 Rad, 6 Bus, 7 zu Fuß, 2 Auto. Welche Schrittweite passt für ein Säulendiagramm?',
        schritte: [
          'Der größte Wert ist 9.',
          'Mit Schrittweite 1 brauchst du 9 Kästchen nach oben, mit Schrittweite 2 nur 5.',
          'Schrittweite 2 passt gut: 0, 2, 4, 6, 8, 10.',
          'Ungerade Werte wie 9 oder 7 liegen genau zwischen zwei Gitterlinien.',
          'Probe: 9 + 6 + 7 + 2 = 24. Alle Kinder sind erfasst.',
        ],
      },
      fehler: [
        {fehler: 'Ein Fünferbündel wird als 4 gezählt.', richtig: 'Vier senkrechte Striche und ein Querstrich sind 5.'},
        {fehler: 'Die Säulenhöhe wird in Kästchen abgelesen, ohne auf die Skala zu achten.', richtig: 'Erst die Schrittweite bestimmen: Bei Schrittweite 2 bedeuten 4 Kästchen den Wert 8.'},
        {fehler: 'Zwei Diagramme werden nur nach der Höhe der Säulen verglichen.', richtig: 'Vergleiche die Zahlenwerte. Bei verschiedenen Skalen können gleich hohe Säulen verschiedene Werte zeigen.'},
      ],
      strategie: ['Titel lesen: Worum geht es?', 'Achsen lesen: Was ist dargestellt, in welcher Einheit?', 'Schrittweite bestimmen: Wie viel zählt ein Kästchen?', 'Werte ablesen, rechnen und mit Einheit antworten.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Der fehlende Rest', aufgabe: 'In einer Klasse mit 28 Kindern wurde nach dem Lieblingstier gefragt. Hund: 9, Katze: 7, Pferd: 5. Alle anderen haben „Hamster“ gewählt. Wie viele Kinder haben „Hamster“ gewählt?', pruefung: zahl({label: 'Hamster', wert: 7, einheit: 'Kinder'}), tipp: 'Addiere zuerst die bekannten Werte.', loesung: ['9 + 7 + 5 = 21', '28 − 21 = 7', '7 Kinder haben „Hamster“ gewählt.']},
      {typ: 'Begründen', titel: 'Gleich hoch, aber nicht gleich viel', aufgabe: 'Lea sagt: „In Diagramm A ist die Säule für Rad doppelt so hoch wie in Diagramm B. Also fahren an Schule A doppelt so viele Kinder Rad.“ Wann stimmt das nicht?', pruefung: wahl(0, 'Wenn die beiden Diagramme verschiedene Schrittweiten haben.', 'Wenn die Säulen verschiedene Farben haben.', 'Wenn die Diagramme verschiedene Titel haben.'), tipp: 'Was bedeutet ein Kästchen in jedem Diagramm?', loesung: ['Die Höhe einer Säule hängt von der Skala ab.', 'Zählt in A ein Kästchen 5 und in B ein Kästchen 10, kann eine doppelt so hohe Säule denselben Wert zeigen.', 'Darum vergleichst du immer die abgelesenen Zahlen.']},
      {typ: 'Sachproblem', titel: 'Ein Diagramm planen', aufgabe: 'Für ein Balkendiagramm sind die Werte 35, 60, 45 und 80 gegeben. Du hast 8 Kästchen Platz. Welche Schrittweite wählst du, damit der längste Balken genau passt?', pruefung: zahl({label: 'Schrittweite', wert: 10}), tipp: 'Teile den größten Wert durch die Anzahl der Kästchen.', loesung: ['Der größte Wert ist 80.', '80 : 8 = 10', 'Mit Schrittweite 10 reicht der längste Balken genau bis zum Rand. 35 und 45 liegen zwischen zwei Gitterlinien.']},
    ],
  },
  numbers: {
    hilfe: {
      merksaetze: [
        'Unser Zahlensystem ist ein Zehnersystem: 10 Einer sind 1 Zehner, 10 Zehner sind 1 Hunderter.',
        'Große Zahlen gliederst du von rechts in Dreiergruppen: Einer, Tausender, Millionen, Milliarden.',
        'Eine Million hat 6 Nullen (1.000.000), eine Milliarde hat 9 Nullen (1.000.000.000).',
        'Fehlt eine Stelle im Zahlwort, steht in der Zahl dort eine 0.',
      ],
      beispiel: {
        aufgabe: 'Schreibe als Zahl: zwei Millionen vierzigtausendfünf.',
        schritte: ['Gliedere das Zahlwort: zwei Millionen | vierzigtausend | fünf.', 'Millionen: 2', 'Tausendergruppe: 040, denn jede Gruppe hat drei Stellen.', 'Einergruppe: 005', 'Zahl: 2.040.005'],
      },
      fehler: [
        {fehler: 'Zweitausendvierzig wird als 20040 geschrieben.', richtig: 'Tausendergruppe 2, Einergruppe 040: 2.040.'},
        {fehler: 'Bei 5.307 hat die 3 den Wert 3.', richtig: 'Die 3 steht an der Hunderterstelle. Ihr Wert ist 300.'},
        {fehler: '99.999 ist größer als 100.000, weil die Ziffern größer sind.', richtig: 'Zuerst die Anzahl der Stellen vergleichen: 100.000 hat sechs Stellen und ist größer.'},
      ],
      strategie: ['Zahl von rechts in Dreiergruppen gliedern.', 'Stellenwerttafel benutzen.', 'Leere Stellen mit 0 füllen.', 'Beim Vergleichen erst die Stellenanzahl, dann von links Ziffer für Ziffer prüfen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Ziffernkarten', aufgabe: 'Du hast die Ziffernkarten 3, 0, 7, 1, 5 und 9. Bilde mit jeder Karte genau einmal die größte und die kleinste sechsstellige Zahl.', pruefung: zahl({label: 'größte Zahl', wert: 975310}, {label: 'kleinste Zahl', wert: 103579}), tipp: 'Eine sechsstellige Zahl darf nicht mit 0 beginnen.', loesung: ['Größte Zahl: Ziffern absteigend ordnen: 975.310', 'Kleinste Zahl: aufsteigend ordnen, aber die 0 darf nicht vorne stehen.', 'Also kommt die 1 nach vorne, dann die 0: 103.579']},
      {typ: 'Begründen', titel: 'Tausend Millionen', aufgabe: 'Tim sagt: „Eine Milliarde sind tausend Millionen.“ Stimmt das?', pruefung: wahl(0, 'Ja, denn 1.000 · 1.000.000 = 1.000.000.000.', 'Nein, eine Milliarde sind 100 Millionen.', 'Nein, eine Milliarde sind 10.000 Millionen.'), tipp: 'Zähle die Nullen: Eine Million hat 6, eine Milliarde 9.', loesung: ['1.000.000 hat 6 Nullen, 1.000 hat 3 Nullen.', 'Beim Multiplizieren kommen 3 Nullen dazu: 9 Nullen.', 'Tim hat recht: 1.000 Millionen = 1 Milliarde.']},
      {typ: 'Sachproblem', titel: 'Tausender zählen', aufgabe: 'Ein Stadion hat im Jahr 2.450.000 Besucher. Wie viele Tausender stecken in dieser Zahl?', pruefung: zahl({label: 'Tausender', wert: 2450}), tipp: 'Wie oft passt 1.000 in die Zahl?', loesung: ['2.450.000 : 1.000 = 2.450', 'In der Zahl stecken 2.450 Tausender.', 'Achtung: Die Tausenderziffer allein ist 0. Gefragt sind aber alle Tausender.']},
    ],
  },
  round: {
    hilfe: {
      merksaetze: [
        'Beim Runden entscheidet nur die Ziffer rechts neben der Rundungsstelle. Sie heißt Prüfziffer.',
        'Prüfziffer 0, 1, 2, 3 oder 4: abrunden. Prüfziffer 5, 6, 7, 8 oder 9: aufrunden.',
        'Gerundete Zahlen kennzeichnest du mit ≈ oder mit „etwa“ oder „rund“.',
        'Ein Überschlag prüft, ob ein Ergebnis die richtige Größenordnung hat.',
      ],
      beispiel: {
        aufgabe: 'Runde 3.964.581 auf Zehntausender.',
        schritte: ['Rundungsstelle finden: Die Zehntausenderziffer ist 6.', 'Prüfziffer rechts daneben: 4.', '4 bedeutet abrunden: Die 6 bleibt.', 'Alle Stellen rechts davon werden 0: 3.964.581 ≈ 3.960.000.'],
      },
      fehler: [
        {fehler: 'Schrittweise von rechts runden: 1.348 → 1.350 → 1.400.', richtig: 'Nur die Zehnerziffer 4 entscheidet: abrunden. 1.348 ≈ 1.300.'},
        {fehler: '49.962 auf Hunderter gerundet ergibt 49.1000.', richtig: 'Aus 9 Hundertern werden 10 Hunderter, also 1 Tausender mehr: 49.962 ≈ 50.000.'},
        {fehler: 'Gerundete Werte werden mit = geschrieben.', richtig: 'Schreibe ≈, denn der Wert ist nur ungefähr gleich.'},
      ],
      strategie: ['Rundungsstelle markieren.', 'Prüfziffer rechts davon ansehen.', 'Auf- oder abrunden und Überträge beachten.', 'Rechts der Rundungsstelle Nullen schreiben und ≈ setzen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Rückwärts runden', aufgabe: 'Eine natürliche Zahl wurde auf Hunderter gerundet. Das Ergebnis ist 3.500. Welche Zahl ist die kleinste und welche die größte, die das sein kann?', pruefung: zahl({label: 'kleinste Zahl', wert: 3450}, {label: 'größte Zahl', wert: 3549}), tipp: 'Ab welcher Zahl rundet man auf 3.500 auf? Bis zu welcher Zahl rundet man auf 3.500 ab?', loesung: ['Aufgerundet wird ab der Prüfziffer 5: 3.450 ≈ 3.500.', '3.449 würde auf 3.400 gerundet.', 'Abgerundet wird bis zur Prüfziffer 4: 3.549 ≈ 3.500.', '3.550 würde schon auf 3.600 gerundet.']},
      {typ: 'Begründen', titel: 'Ist das plausibel?', aufgabe: 'Mia rechnet 398 · 21 = 8.358. Ihr Überschlag ist 400 · 20 = 8.000. Was sagt der Überschlag?', pruefung: wahl(0, 'Das Ergebnis ist plausibel, denn 8.358 liegt in der Nähe von 8.000.', 'Das Ergebnis ist falsch, weil es nicht genau 8.000 ist.', 'Das Ergebnis müsste über 80.000 liegen.'), tipp: 'Ein Überschlag zeigt die Größenordnung, nicht das genaue Ergebnis.', loesung: ['400 · 20 = 8.000', '8.358 hat dieselbe Größenordnung.', 'Ein Ergebnis wie 835 oder 83.580 hätte der Überschlag als falsch entlarvt.']},
      {typ: 'Sachproblem', titel: 'Einnahmen beim Schulfest', aufgabe: 'Beim Schulfest werden 289 Würstchen zu je 2 € und 412 Getränke zu je 1 € verkauft. Überschlage die Einnahmen. Runde dazu die Anzahlen auf Hunderter.', pruefung: zahl({label: 'Überschlag', wert: 1000, einheit: '€'}), tipp: '289 ≈ 300 und 412 ≈ 400.', loesung: ['300 · 2 € = 600 €', '400 · 1 € = 400 €', 'Überschlag: 600 € + 400 € = 1.000 €', 'Genau sind es 578 € + 412 € = 990 €.']},
    ],
  },
  mental: {
    hilfe: {
      merksaetze: [
        'Zerlegen: 47 + 38 = 47 + 30 + 8 = 85.',
        'Ergänzen: Für 1.000 − 674 rechnest du von 674 bis 700 (26) und dann bis 1.000 (300). Ergebnis: 326.',
        'Nachbaraufgabe: 9 · 7 = 10 · 7 − 7 = 63.',
        'Punkt vor Strich. Was in Klammern steht, rechnest du zuerst.',
      ],
      beispiel: {aufgabe: 'Rechne geschickt: 25 · 17 · 4', schritte: ['Beim Multiplizieren darfst du die Faktoren tauschen.', '25 · 4 = 100', '100 · 17 = 1.700']},
      fehler: [
        {fehler: '8 + 2 · 5 = 50', richtig: 'Punkt vor Strich: 2 · 5 = 10, dann 8 + 10 = 18.'},
        {fehler: '100 − 37 = 73', richtig: 'Ergänze: 37 + 63 = 100. Das Ergebnis ist 63.'},
        {fehler: '6 · 0 = 6', richtig: 'Eine Zahl mal 0 ergibt immer 0.'},
      ],
      strategie: ['Zahlen ansehen: Gibt es einen Rechenvorteil?', 'Zerlegen, ergänzen oder Faktoren tauschen.', 'Schritt für Schritt rechnen.', 'Mit der Umkehraufgabe prüfen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Geschickt multiplizieren', aufgabe: 'Rechne geschickt: 4 · 13 · 25', pruefung: zahl({label: 'Ergebnis', wert: 1300}), tipp: 'Welche zwei Faktoren ergeben zusammen 100?', loesung: ['4 · 25 = 100', '100 · 13 = 1.300']},
      {typ: 'Knobeln', titel: 'Zahlenrätsel', aufgabe: 'Ich denke mir eine Zahl. Ich verdopple sie und addiere 7. Dann erhalte ich 51. Welche Zahl habe ich mir gedacht?', pruefung: zahl({label: 'gedachte Zahl', wert: 22}), tipp: 'Rechne rückwärts: Mache jeden Schritt rückgängig.', loesung: ['51 − 7 = 44', '44 : 2 = 22', 'Probe: 22 · 2 + 7 = 51']},
      {typ: 'Begründen', titel: 'Fast hundert', aufgabe: 'Warum ist 99 · 6 im Kopf leicht zu rechnen?', pruefung: wahl(0, 'Weil 99 · 6 = 100 · 6 − 6 = 594.', 'Weil 99 eine Primzahl ist.', 'Weil man nur 9 · 6 rechnen muss: 54.'), tipp: '99 ist 1 weniger als 100.', loesung: ['99 · 6 bedeutet 99 sechsmal.', '100 · 6 = 600. Das ist 6 zu viel.', '600 − 6 = 594']},
    ],
  },
  line: {
    hilfe: {
      merksaetze: [
        'Auf dem Zahlenstrahl werden die Zahlen nach rechts größer.',
        'Gleich große Abstände bedeuten gleich große Zahlenschritte.',
        'Schrittweite = Unterschied zweier beschrifteter Zahlen : Anzahl der Abstände dazwischen.',
        'Der Abstand zweier Zahlen ist ihre Differenz.',
      ],
      beispiel: {aufgabe: 'Zwischen 0 und 1.000 liegen 5 gleich große Abstände. Welche Zahl steht am dritten Strich nach 0?', schritte: ['Unterschied: 1.000 − 0 = 1.000', 'Schrittweite: 1.000 : 5 = 200', 'Drei Schritte: 3 · 200 = 600', 'Am dritten Strich steht 600.']},
      fehler: [
        {fehler: 'Es werden die Striche gezählt statt der Abstände.', richtig: 'Zwischen 6 Strichen liegen nur 5 Abstände. Teile durch die Zahl der Abstände.'},
        {fehler: 'Jeder kleine Strich bedeutet automatisch 1.', richtig: 'Bestimme die Schrittweite immer aus zwei Beschriftungen.'},
        {fehler: 'Ein Zahlenstrahl beginnt immer bei 0.', richtig: 'Ein Ausschnitt kann bei jeder Zahl beginnen, zum Beispiel bei 2.500.'},
      ],
      strategie: ['Zwei beschriftete Zahlen suchen.', 'Die Abstände dazwischen zählen.', 'Die Schrittweite berechnen.', 'Von einer bekannten Zahl aus in Schritten weiterzählen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Die Mitte kennen', aufgabe: 'Die Zahl 4.000 liegt genau in der Mitte zwischen 3.200 und einer anderen Zahl. Welche Zahl ist das?', pruefung: zahl({label: 'andere Zahl', wert: 4800}), tipp: 'Wie weit ist 3.200 von 4.000 entfernt?', loesung: ['Abstand: 4.000 − 3.200 = 800', 'Auf der anderen Seite liegt die Zahl genauso weit entfernt.', '4.000 + 800 = 4.800']},
      {typ: 'Begründen', titel: 'Ein falscher Zahlenstrahl', aufgabe: 'Ben beschriftet gleich weit entfernte Striche mit 0, 10, 20, 50, 100. Was ist falsch?', pruefung: wahl(0, 'Die Zahlenschritte sind nicht gleich groß, obwohl die Abstände gleich sind.', 'Ein Zahlenstrahl darf nicht bei 0 beginnen.', 'Zahlen über 50 darf man nicht eintragen.'), tipp: 'Vergleiche die Sprünge zwischen den Zahlen.', loesung: ['Die Sprünge sind 10, 10, 30, 50.', 'Gleiche Abstände müssen gleiche Zahlenschritte haben.', 'Richtig wäre zum Beispiel: 0, 10, 20, 30, 40.']},
      {typ: 'Sachproblem', titel: 'Viertel-Schritte', aufgabe: 'Zwischen 2.000 und 3.000 liegen 4 gleich große Abstände. Welche Zahl steht am dritten Strich nach 2.000?', pruefung: zahl({label: 'Zahl', wert: 2750}), tipp: 'Bestimme zuerst die Schrittweite.', loesung: ['Schrittweite: 1.000 : 4 = 250', 'Drei Schritte: 3 · 250 = 750', '2.000 + 750 = 2.750']},
    ],
  },
  units: {
    hilfe: {
      merksaetze: [
        'Eine Größe besteht aus Maßzahl und Einheit: 3 m, 250 g, 45 min.',
        'Längen: 1 cm = 10 mm, 1 dm = 10 cm, 1 m = 10 dm, 1 km = 1.000 m. Gewichte: 1 g = 1.000 mg, 1 kg = 1.000 g, 1 t = 1.000 kg.',
        'Zeit: 1 h = 60 min, 1 min = 60 s, 1 Tag = 24 h. Hier rechnest du nicht mit 10 oder 100.',
        'Geld: 1 € = 100 ct. Beträge schreibst du mit zwei Stellen nach dem Komma: 3,05 €.',
        'Vor dem Vergleichen oder Rechnen bringst du alle Größen in dieselbe Einheit.',
      ],
      beispiel: {aufgabe: 'Was ist länger: 2,3 m oder 225 cm?', schritte: ['Gleiche Einheit wählen: cm.', '2,3 m = 230 cm', '230 cm > 225 cm', 'Also ist 2,3 m länger.']},
      fehler: [
        {fehler: '1 h 30 min = 1,30 h', richtig: '30 min sind eine halbe Stunde: 1 h 30 min = 1,5 h = 90 min.'},
        {fehler: '3 € 5 ct = 3,5 €', richtig: '5 ct sind 0,05 €: 3 € 5 ct = 3,05 €.'},
        {fehler: 'Beim Umrechnen in die kleinere Einheit wird geteilt.', richtig: 'Bei der kleineren Einheit brauchst du mehr Einheiten: Du multiplizierst. 4 m = 400 cm.'},
      ],
      strategie: ['Was ist gegeben, was ist gesucht?', 'Die passende Umrechnungszahl suchen.', 'Zur kleineren Einheit multiplizieren, zur größeren teilen.', 'Prüfen: Ist das Ergebnis realistisch?'],
    },
    vertiefung: [
      {typ: 'Sachproblem', titel: 'Kinozeit', aufgabe: 'Ein Film beginnt um 15:45 Uhr und dauert 1 h 50 min. Um wie viel Uhr endet er?', pruefung: zahl({label: 'Stunde', wert: 17}, {label: 'Minute', wert: 35}), tipp: 'Rechne zuerst bis zur vollen Stunde.', loesung: ['15:45 Uhr + 15 min = 16:00 Uhr', 'Es bleiben 1 h 35 min.', '16:00 Uhr + 1 h 35 min = 17:35 Uhr']},
      {typ: 'Begründen', titel: 'Komma bei Gewichten', aufgabe: 'Paula meint: „1,5 kg sind 1.005 g.“ Was stimmt?', pruefung: wahl(0, '1,5 kg = 1.500 g, denn 0,5 kg sind 500 g.', 'Paula hat recht.', '1,5 kg = 150 g'), tipp: 'Wie viel Gramm ist ein halbes Kilogramm?', loesung: ['1 kg = 1.000 g', '0,5 kg ist die Hälfte davon: 500 g.', '1,5 kg = 1.000 g + 500 g = 1.500 g']},
      {typ: 'Sachproblem', titel: 'Zwei Pakete', aufgabe: 'Ein Paket wiegt 2 kg 350 g, ein zweites 1.800 g. Wie viel Gramm wiegen beide zusammen?', pruefung: zahl({label: 'zusammen', wert: 4150, einheit: 'g'}), tipp: 'Rechne 2 kg 350 g zuerst in Gramm um.', loesung: ['2 kg 350 g = 2.350 g', '2.350 g + 1.800 g = 4.150 g', 'Das sind 4 kg 150 g.']},
    ],
  },
  stats: {
    hilfe: {
      merksaetze: [
        'Die absolute Häufigkeit ist eine Anzahl. Die relative Häufigkeit ist ein Anteil am Ganzen.',
        'Arithmetisches Mittel: Summe aller Werte geteilt durch ihre Anzahl.',
        'Der Modalwert ist der häufigste Wert. Die Spannweite ist größter Wert minus kleinster Wert.',
        'Einzelne sehr große oder kleine Werte (Ausreißer) können den Mittelwert stark verändern.',
      ],
      beispiel: {aufgabe: 'Weitsprungweiten in cm: 310, 280, 350, 280, 330. Bestimme Mittelwert, Modalwert und Spannweite.', schritte: ['Summe: 310 + 280 + 350 + 280 + 330 = 1.550', 'Mittelwert: 1.550 : 5 = 310 cm', 'Modalwert: 280 cm, denn 280 kommt zweimal vor.', 'Spannweite: 350 cm − 280 cm = 70 cm']},
      fehler: [
        {fehler: 'Mittelwert von 2, 4, 9: (2 + 4 + 9) : 2', richtig: 'Teile durch die Anzahl der Werte, hier 3: 15 : 3 = 5.'},
        {fehler: 'Der Modalwert ist der größte Wert.', richtig: 'Der Modalwert ist der Wert, der am häufigsten vorkommt.'},
        {fehler: 'In Klasse A fahren 12 Kinder Rad, in B nur 10. Also ist der Anteil in A größer.', richtig: 'Vergleiche Anteile: 12 von 30 sind 40 %, 10 von 20 sind 50 %. In B ist der Anteil größer.'},
      ],
      strategie: ['Werte ordnen.', 'Die passende Kenngröße wählen.', 'Rechnen und mit Einheit antworten.', 'Beurteilen: Beschreibt das Ergebnis die Daten gut?'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Der fehlende Wert', aufgabe: 'Fünf Kinder haben im Mittel 8 Punkte. Vier Kinder haben 6, 9, 7 und 10 Punkte. Wie viele Punkte hat das fünfte Kind?', pruefung: zahl({label: 'Punkte', wert: 8}), tipp: 'Wie viele Punkte haben alle fünf zusammen?', loesung: ['Summe aller Punkte: 5 · 8 = 40', 'Vier Kinder: 6 + 9 + 7 + 10 = 32', 'Das fünfte Kind: 40 − 32 = 8 Punkte']},
      {typ: 'Begründen', titel: 'Ein irreführender Durchschnitt', aufgabe: 'Fünf Kinder bekommen im Monat 15 €, 16 €, 17 €, 18 € und 84 € Taschengeld. Jemand sagt: „Im Durchschnitt bekommt jedes Kind 30 €.“ Was ist richtig?', pruefung: wahl(0, 'Der Mittelwert stimmt, beschreibt aber die meisten Kinder schlecht.', 'Der Mittelwert ist falsch berechnet.', 'Jedes Kind bekommt genau 30 €.'), tipp: 'Berechne den Mittelwert und vergleiche ihn mit den einzelnen Beträgen.', loesung: ['15 + 16 + 17 + 18 + 84 = 150', '150 : 5 = 30. Der Mittelwert ist 30 €.', 'Vier von fünf Kindern bekommen aber höchstens 18 €. Der Ausreißer 84 € hebt den Mittelwert stark an.']},
      {typ: 'Sachproblem', titel: 'Anteile vergleichen', aufgabe: 'In der 5a (25 Kinder) sind 10 Kinder im Sportverein, in der 5b (20 Kinder) sind es 9. In welcher Klasse ist der Anteil größer?', pruefung: wahl(1, 'In der 5a', 'In der 5b', 'Der Anteil ist gleich groß.'), tipp: 'Rechne beide Anteile in Prozent um.', loesung: ['5a: 10 von 25 = 40 von 100 = 40 %', '5b: 9 von 20 = 45 von 100 = 45 %', 'In der 5b ist der Anteil größer, obwohl dort weniger Kinder im Verein sind.']},
    ],
  },
  arithmetic: {
    hilfe: {
      merksaetze: [
        'Beim schriftlichen Rechnen stehen die Stellen genau untereinander: Einer unter Einer, Zehner unter Zehner.',
        'Addition, Subtraktion und Multiplikation beginnst du rechts, die Division links.',
        'Punkt vor Strich. Was in Klammern steht, rechnest du zuerst.',
        'Mit Überschlag und Umkehraufgabe prüfst du dein Ergebnis.',
      ],
      beispiel: {
        aufgabe: 'Berechne 4.072 − 1.586 schriftlich.',
        schritte: [
          'Einer: 2 − 6 geht nicht. Entbündle einen Zehner: 12 − 6 = 6. Es bleiben 6 Zehner.',
          'Zehner: 6 − 8 geht nicht. Die Hunderterstelle ist 0, also entbündelst du einen Tausender: 10 Hunderter. Dann einen Hunderter zu Zehnern: 16 − 8 = 8. Es bleiben 9 Hunderter.',
          'Hunderter: 9 − 5 = 4',
          'Tausender: 3 − 1 = 2',
          'Ergebnis: 2.486. Probe: 2.486 + 1.586 = 4.072',
        ],
      },
      fehler: [
        {fehler: '503 − 278 = 375, weil in jeder Spalte die kleinere von der größeren Ziffer abgezogen wird.', richtig: 'Ist die obere Ziffer zu klein, entbündelst du: 503 − 278 = 225.'},
        {fehler: '12 + 3 · 4 = 60', richtig: 'Punkt vor Strich: 3 · 4 = 12, dann 12 + 12 = 24.'},
        {fehler: '7.208 : 4 = 182, weil die 0 im Ergebnis vergessen wird.', richtig: 'Jede heruntergeholte Ziffer braucht eine Ergebnisziffer: 7.208 : 4 = 1.802.'},
      ],
      strategie: ['Einen Überschlag rechnen.', 'Sauber stellengerecht aufschreiben.', 'Rechnen und Überträge notieren.', 'Mit der Umkehraufgabe prüfen und mit dem Überschlag vergleichen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Das größte Produkt', aufgabe: 'Setze die Ziffern 2, 4, 6 und 8 so in □□ · □□ ein, dass das Produkt möglichst groß wird. Wie groß ist es?', pruefung: zahl({label: 'größtes Produkt', wert: 5248}), tipp: 'Die größten Ziffern gehören an die Zehnerstellen. Probiere dann beide Möglichkeiten für die Einer aus.', loesung: ['8 und 6 kommen an die Zehnerstellen.', '84 · 62 = 5.208', '82 · 64 = 5.248', 'Das größte Produkt ist 5.248.']},
      {typ: 'Begründen', titel: 'Geteilt und mal', aufgabe: 'Jonas rechnet 36 : 4 · 3 = 3, weil er zuerst 4 · 3 rechnet. Was stimmt?', pruefung: wahl(0, 'Punktrechnungen rechnest du von links nach rechts: 36 : 4 = 9, dann 9 · 3 = 27.', 'Jonas hat recht, Mal kommt vor Geteilt.', 'Das Ergebnis ist 12.'), tipp: 'Mal und geteilt sind gleichrangig.', loesung: ['Bei gleichrangigen Rechenarten rechnest du von links nach rechts.', '36 : 4 = 9', '9 · 3 = 27']},
      {typ: 'Sachproblem', titel: 'Ausflug ins Museum', aufgabe: '112 Kinder und 8 Lehrkräfte fahren ins Museum. Ein Bus hat 50 Plätze. Der Eintritt kostet für Kinder 4 € und für Lehrkräfte 6 €. Wie viele Busse braucht man? Wie viel kostet der Eintritt insgesamt?', pruefung: zahl({label: 'Busse', wert: 3}, {label: 'Eintritt', wert: 496, einheit: '€'}), tipp: 'Zähle zuerst alle Personen. Bei einem Rest brauchst du einen weiteren Bus.', loesung: ['Personen: 112 + 8 = 120', '120 : 50 = 2 Rest 20. Man braucht 3 Busse.', 'Eintritt: 112 · 4 € = 448 € und 8 · 6 € = 48 €', 'Zusammen: 448 € + 48 € = 496 €']},
    ],
  },
  divisibility: {
    hilfe: {
      merksaetze: [
        'Teilbar durch 2: letzte Ziffer gerade. Durch 5: letzte Ziffer 0 oder 5. Durch 10: letzte Ziffer 0.',
        'Teilbar durch 3 oder 9: Die Quersumme ist durch 3 oder 9 teilbar.',
        'Teilbar durch 4: Die Zahl aus den letzten beiden Ziffern ist durch 4 teilbar.',
        'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst. 1 ist keine Primzahl.',
      ],
      beispiel: {aufgabe: 'Ist 2.346 durch 2, 3, 4, 5 und 9 teilbar?', schritte: ['Letzte Ziffer 6 ist gerade: teilbar durch 2.', 'Quersumme: 2 + 3 + 4 + 6 = 15. 15 ist durch 3 teilbar, aber nicht durch 9.', 'Letzte zwei Ziffern: 46. 46 ist nicht durch 4 teilbar.', 'Letzte Ziffer ist nicht 0 oder 5: nicht teilbar durch 5.', '2.346 ist durch 2 und 3 teilbar, nicht durch 4, 5 und 9.']},
      fehler: [
        {fehler: '143 ist durch 3 teilbar, weil die letzte Ziffer 3 ist.', richtig: 'Für 3 zählt die Quersumme: 1 + 4 + 3 = 8. 143 ist nicht durch 3 teilbar.'},
        {fehler: '1 ist eine Primzahl.', richtig: '1 hat nur einen Teiler. Primzahlen haben genau zwei.'},
        {fehler: '9 ist eine Primzahl, weil sie ungerade ist.', richtig: '9 = 3 · 3 hat die Teiler 1, 3 und 9.'},
      ],
      strategie: ['Die passende Teilbarkeitsregel auswählen.', 'Letzte Ziffer(n) oder Quersumme bestimmen.', 'Die Regel anwenden.', 'Mit einer Division prüfen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Die fehlende Ziffer', aufgabe: 'Welche Ziffer musst du für □ einsetzen, damit 4□2 durch 9 teilbar ist?', pruefung: zahl({label: 'Ziffer', wert: 3}), tipp: 'Die Quersumme muss durch 9 teilbar sein.', loesung: ['Quersumme: 4 + □ + 2 = 6 + □', 'Die nächste durch 9 teilbare Zahl ist 9. Also □ = 3.', 'Probe: 432 : 9 = 48']},
      {typ: 'Begründen', titel: 'Von 9 auf 3', aufgabe: 'Ist jede durch 9 teilbare Zahl auch durch 3 teilbar?', pruefung: wahl(0, 'Ja, denn 9 = 3 · 3. Jedes Vielfache von 9 ist auch ein Vielfaches von 3.', 'Nein, zum Beispiel 18.', 'Nur bei geraden Zahlen.'), tipp: 'Schreibe 9 als Produkt.', loesung: ['9 = 3 · 3', 'Eine durch 9 teilbare Zahl ist n · 9 = n · 3 · 3.', 'Also ist sie auch durch 3 teilbar. Umgekehrt gilt das nicht: 12 ist durch 3, aber nicht durch 9 teilbar.']},
      {typ: 'Sachproblem', titel: 'Gruppen bilden', aufgabe: '24 Kinder sollen in gleich großen Gruppen arbeiten. Eine Gruppe hat mindestens 2 und höchstens 12 Kinder. Wie viele verschiedene Gruppengrößen sind möglich?', pruefung: zahl({label: 'Gruppengrößen', wert: 6}), tipp: 'Suche alle Teiler von 24.', loesung: ['Teiler von 24: 1, 2, 3, 4, 6, 8, 12, 24', 'Zwischen 2 und 12 liegen: 2, 3, 4, 6, 8, 12', 'Es gibt 6 mögliche Gruppengrößen.']},
    ],
  },
  geometry: {
    hilfe: {
      merksaetze: [
        'Eine Strecke hat zwei Endpunkte, ein Strahl einen Anfangspunkt, eine Gerade keinen Endpunkt.',
        'Spitzer Winkel: kleiner als 90°. Rechter Winkel: 90°. Stumpfer Winkel: zwischen 90° und 180°. Gestreckter Winkel: 180°.',
        'Im Koordinatensystem nennst du zuerst den x-Wert (nach rechts), dann den y-Wert (nach oben): P(3|5).',
        'Bei der Achsenspiegelung haben Punkt und Bildpunkt denselben Abstand zur Spiegelachse.',
      ],
      beispiel: {aufgabe: 'Spiegle A(2|3) an der senkrechten Achse durch x = 4.', schritte: ['Abstand von A zur Achse: 4 − 2 = 2', 'Der Bildpunkt liegt auf der anderen Seite, ebenfalls 2 entfernt: 4 + 2 = 6.', 'Die y-Koordinate bleibt gleich: 3.', 'Bildpunkt: A′(6|3)']},
      fehler: [
        {fehler: 'P(2|5) wird 2 nach oben und 5 nach rechts eingetragen.', richtig: 'Erst x, dann y: 2 nach rechts, 5 nach oben.'},
        {fehler: 'Ein Winkel von 100° ist spitz.', richtig: 'Er ist größer als 90° und kleiner als 180°: stumpf.'},
        {fehler: 'Jedes Rechteck hat 4 Symmetrieachsen.', richtig: 'Ein Rechteck, das kein Quadrat ist, hat nur 2: die beiden Mittellinien.'},
      ],
      strategie: ['Eine Skizze anfertigen.', 'Die Fachbegriffe prüfen.', 'Geodreieck genau anlegen.', 'Das Ergebnis an der Zeichnung kontrollieren.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Die vierte Ecke', aufgabe: 'Drei Ecken eines Rechtecks sind A(1|1), B(6|1) und C(6|4). Wo liegt die vierte Ecke D?', pruefung: zahl({label: 'x', wert: 1}, {label: 'y', wert: 4}), tipp: 'Zeichne die drei Punkte in ein Koordinatensystem.', loesung: ['AB ist waagerecht, BC senkrecht.', 'D liegt über A und auf derselben Höhe wie C.', 'D(1|4)']},
      {typ: 'Begründen', titel: 'Quadrat und Rechteck', aufgabe: 'Ist jedes Quadrat auch ein Rechteck?', pruefung: wahl(0, 'Ja. Ein Quadrat hat vier rechte Winkel, und gegenüberliegende Seiten sind gleich lang.', 'Nein, weil beim Quadrat alle Seiten gleich lang sind.', 'Nur wenn es auf einer Ecke steht.'), tipp: 'Welche Eigenschaften braucht ein Rechteck?', loesung: ['Ein Rechteck hat vier rechte Winkel und gegenüberliegende Seiten gleicher Länge.', 'Ein Quadrat erfüllt das. Zusätzlich sind alle Seiten gleich lang.', 'Jedes Quadrat ist ein besonderes Rechteck, aber nicht jedes Rechteck ist ein Quadrat.']},
      {typ: 'Sachproblem', titel: 'Winkel auf der Uhr', aufgabe: 'Wie groß ist der kleinere Winkel zwischen den Uhrzeigern um genau 3 Uhr? Und um genau 4 Uhr?', pruefung: zahl({label: '3 Uhr', wert: 90, einheit: '°'}, {label: '4 Uhr', wert: 120, einheit: '°'}), tipp: 'Der ganze Kreis hat 360°. Zwischen zwei Stundenzahlen liegen 360° : 12.', loesung: ['360° : 12 = 30° zwischen zwei Stundenzahlen', '3 Uhr: 3 · 30° = 90°', '4 Uhr: 4 · 30° = 120°']},
    ],
  },
  measure: {
    hilfe: {
      merksaetze: [
        'Der Umfang ist die Länge des Randes. Rechteck: U = 2 · (a + b).',
        'Der Flächeninhalt sagt, wie viele Einheitsquadrate hineinpassen. Rechteck: A = a · b.',
        'Volumen eines Quaders: V = a · b · c. Oberfläche: O = 2 · (a · b + a · c + b · c).',
        'Flächeneinheiten haben die Umrechnungszahl 100, Volumeneinheiten die Umrechnungszahl 1.000.',
      ],
      beispiel: {aufgabe: 'Ein Quader ist 5 cm lang, 3 cm breit und 2 cm hoch. Berechne Volumen und Oberfläche.', schritte: ['V = 5 cm · 3 cm · 2 cm = 30 cm³', 'Flächenpaare: 5 · 3 = 15, 5 · 2 = 10, 3 · 2 = 6 (jeweils cm²)', 'O = 2 · (15 + 10 + 6) cm² = 62 cm²']},
      fehler: [
        {fehler: 'Rechteck 6 cm × 4 cm: U = 6 · 4 = 24 cm', richtig: 'U = 2 · (6 + 4) cm = 20 cm. 24 cm² ist der Flächeninhalt.'},
        {fehler: '1 m² = 10 dm²', richtig: '1 m² = 10 dm · 10 dm = 100 dm².'},
        {fehler: 'Oberfläche des Quaders: a · b + a · c + b · c', richtig: 'Jede Fläche kommt zweimal vor: O = 2 · (a · b + a · c + b · c).'},
      ],
      strategie: ['Eine Skizze mit Maßen anfertigen.', 'Alle Maße in dieselbe Einheit bringen.', 'Die passende Formel wählen.', 'Einheit prüfen: cm, cm² oder cm³?'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Gleicher Umfang, größte Fläche', aufgabe: 'Ein Rechteck hat den Umfang 24 cm. Seine Seiten sind ganze Zentimeter lang. Wie groß ist der größtmögliche Flächeninhalt?', pruefung: zahl({label: 'Flächeninhalt', wert: 36, einheit: 'cm²'}), tipp: 'Länge + Breite = 12 cm. Probiere 11 + 1, 10 + 2, … aus.', loesung: ['a + b = 24 cm : 2 = 12 cm', '11 · 1 = 11, 10 · 2 = 20, 9 · 3 = 27, 8 · 4 = 32, 7 · 5 = 35, 6 · 6 = 36', 'Das Quadrat mit 6 cm Seitenlänge hat den größten Flächeninhalt: 36 cm².']},
      {typ: 'Begründen', titel: 'Doppelte Kanten', aufgabe: 'Stimmt die Aussage: „Verdoppelt man alle Kanten eines Würfels, verdoppelt sich sein Volumen“?', pruefung: wahl(0, 'Nein, das Volumen wird 8-mal so groß, denn 2 · 2 · 2 = 8.', 'Ja, das stimmt.', 'Nein, das Volumen wird 4-mal so groß.'), tipp: 'Probiere es mit einem Würfel mit 1 cm und einem mit 2 cm Kantenlänge aus.', loesung: ['Würfel mit 1 cm Kante: V = 1 cm³', 'Würfel mit 2 cm Kante: V = 2 · 2 · 2 cm³ = 8 cm³', 'Jede der drei Richtungen verdoppelt sich: 2 · 2 · 2 = 8.']},
      {typ: 'Sachproblem', titel: 'Das Aquarium', aufgabe: 'Ein Aquarium ist 60 cm lang, 30 cm breit und 40 cm hoch. Wie viele Liter Wasser passen hinein?', pruefung: zahl({label: 'Volumen', wert: 72, einheit: 'l'}), tipp: '1 l = 1 dm³ = 1.000 cm³.', loesung: ['V = 60 cm · 30 cm · 40 cm = 72.000 cm³', '72.000 cm³ = 72 dm³', '72 dm³ = 72 l']},
    ],
  },
  fractions: {
    hilfe: {
      merksaetze: [
        'Der Nenner sagt, in wie viele gleich große Teile das Ganze geteilt ist. Der Zähler sagt, wie viele Teile gemeint sind.',
        'Erweitern und Kürzen ändern den Wert eines Bruchs nicht.',
        'Gleicher Nenner: Der größere Zähler ergibt den größeren Bruch. Gleicher Zähler: Der kleinere Nenner ergibt den größeren Bruch.',
        'Brüche mit gleichem Nenner addierst du, indem du die Zähler addierst. Der Nenner bleibt.',
      ],
      beispiel: {aufgabe: 'Berechne 3/4 von 20 €.', schritte: ['1/4 von 20 €: 20 € : 4 = 5 €', '3/4 sind dreimal so viel: 3 · 5 € = 15 €', '3/4 von 20 € sind 15 €.']},
      fehler: [
        {fehler: '1/2 + 1/4 = 2/6', richtig: 'Erst gleichnamig machen: 2/4 + 1/4 = 3/4.'},
        {fehler: '1/8 ist größer als 1/4, weil 8 größer als 4 ist.', richtig: 'Bei 8 Teilen ist jedes Teil kleiner: 1/8 < 1/4.'},
        {fehler: 'Beim Erweitern wird nur der Zähler multipliziert.', richtig: 'Zähler und Nenner werden mit derselben Zahl multipliziert: 2/3 = 4/6.'},
      ],
      strategie: ['Ein Bruchbild skizzieren.', 'Wenn nötig, gleiche Nenner herstellen.', 'Rechnen.', 'Kürzen und mit dem Bild vergleichen.'],
    },
    vertiefung: [
      {typ: 'Sachproblem', titel: 'Pizza teilen', aufgabe: 'Lena isst 1/4 einer Pizza, Tom isst 3/8. Wie viele Achtel der Pizza bleiben übrig?', pruefung: zahl({label: 'übrig', wert: 3, einheit: 'Achtel'}), tipp: 'Schreibe 1/4 in Achteln.', loesung: ['1/4 = 2/8', '2/8 + 3/8 = 5/8 sind gegessen.', '8/8 − 5/8 = 3/8 bleiben übrig.']},
      {typ: 'Begründen', titel: 'Welcher Bruch ist größer?', aufgabe: 'Ist 2/3 größer als 3/5?', pruefung: wahl(0, 'Ja, denn 2/3 = 10/15 und 3/5 = 9/15.', 'Nein, weil 3 und 5 größer sind als 2 und 3.', 'Beide Brüche sind gleich groß.'), tipp: 'Bringe beide Brüche auf den Nenner 15.', loesung: ['2/3 = 10/15 (mit 5 erweitert)', '3/5 = 9/15 (mit 3 erweitert)', '10/15 > 9/15, also ist 2/3 größer.']},
      {typ: 'Sachproblem', titel: 'Der Schulweg', aufgabe: 'In einer Klasse sind 24 Kinder. 3/8 kommen mit dem Bus, 1/3 mit dem Rad, der Rest zu Fuß. Wie viele Kinder kommen zu Fuß?', pruefung: zahl({label: 'zu Fuß', wert: 7, einheit: 'Kinder'}), tipp: 'Berechne zuerst die Anzahl für Bus und Rad.', loesung: ['Bus: 24 : 8 · 3 = 9 Kinder', 'Rad: 24 : 3 = 8 Kinder', 'Zu Fuß: 24 − 9 − 8 = 7 Kinder']},
    ],
  },
  decimals: {
    hilfe: {
      merksaetze: [
        'Nach dem Komma folgen Zehntel, Hundertstel und Tausendstel: 2,35 = 2 + 3/10 + 5/100.',
        'Nullen am Ende nach dem Komma ändern den Wert nicht: 0,5 = 0,50.',
        'Beim Vergleichen gehst du von links Stelle für Stelle vor.',
        'Beim schriftlichen Addieren und Subtrahieren steht Komma unter Komma.',
        'Mal 10, 100 oder 1.000: Das Komma rückt 1, 2 oder 3 Stellen nach rechts.',
      ],
      beispiel: {aufgabe: 'Ordne der Größe nach: 0,7 · 0,65 · 0,705', schritte: ['Auf drei Nachkommastellen ergänzen: 0,700 · 0,650 · 0,705', 'Zehntel vergleichen: 6 ist kleiner als 7. Also ist 0,65 am kleinsten.', '0,700 und 0,705: Die Tausendstel entscheiden.', '0,65 < 0,7 < 0,705']},
      fehler: [
        {fehler: '0,45 > 0,5, weil 45 größer als 5 ist.', richtig: 'Vergleiche die Zehntel: 4 < 5. Also 0,45 < 0,5.'},
        {fehler: '3,2 + 1,45 = 4,47', richtig: 'Komma unter Komma: 3,20 + 1,45 = 4,65.'},
        {fehler: '2,5 · 10 = 2,50', richtig: 'Das Komma rückt eine Stelle nach rechts: 2,5 · 10 = 25.'},
      ],
      strategie: ['Die Stellenwerttafel nutzen.', 'Mit Nullen auf gleich viele Nachkommastellen ergänzen.', 'Rechnen: Komma unter Komma.', 'Mit einem Überschlag prüfen.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Genau in der Mitte', aufgabe: 'Welche Zahl liegt genau in der Mitte zwischen 2,4 und 2,5?', pruefung: zahl({label: 'Mitte', wert: 2.45}), tipp: 'Schreibe 2,4 als 2,40 und 2,5 als 2,50.', loesung: ['2,4 = 2,40 und 2,5 = 2,50', 'Dazwischen liegen 10 Hundertstel. Die Hälfte sind 5 Hundertstel.', '2,40 + 0,05 = 2,45']},
      {typ: 'Begründen', titel: 'Zahlen dazwischen', aufgabe: 'Gibt es zwischen 0,3 und 0,4 noch weitere Zahlen?', pruefung: wahl(0, 'Ja, unendlich viele, zum Beispiel 0,35 oder 0,301.', 'Nein, 0,4 folgt direkt auf 0,3.', 'Ja, aber nur die Zahl 0,35.'), tipp: 'Denke an Hundertstel und Tausendstel.', loesung: ['0,3 = 0,30 und 0,4 = 0,40. Dazwischen liegen 0,31, 0,32, …, 0,39.', 'Zwischen 0,31 und 0,32 liegen wieder 0,311, 0,312, …', 'Man kann immer weiter verfeinern. Es gibt unendlich viele Zahlen dazwischen.']},
      {typ: 'Sachproblem', titel: 'Einkauf im Schreibwarenladen', aufgabe: 'Mia kauft 3 Hefte zu je 1,25 € und einen Stift für 2,40 €. Sie bezahlt mit 10 €. Wie viel Wechselgeld bekommt sie?', pruefung: zahl({label: 'Wechselgeld', wert: 3.85, einheit: '€'}), tipp: 'Rechne zuerst den Preis der Hefte aus.', loesung: ['Hefte: 3 · 1,25 € = 3,75 €', 'Zusammen: 3,75 € + 2,40 € = 6,15 €', 'Wechselgeld: 10,00 € − 6,15 € = 3,85 €']},
    ],
  },
  angles: {
    hilfe: {
      merksaetze: [
        'Ein Winkel besteht aus einem Scheitel und zwei Schenkeln. Er wird in Grad (°) gemessen.',
        'Spitz: unter 90°. Recht: 90°. Stumpf: zwischen 90° und 180°. Gestreckt: 180°. Überstumpf: zwischen 180° und 360°.',
        'Nebenwinkel ergeben zusammen 180°. Scheitelwinkel sind gleich groß.',
        'An Parallelen sind Stufenwinkel und Wechselwinkel gleich groß.',
        'Winkelsumme im Dreieck: 180°. Winkelsumme im Viereck: 360°.',
      ],
      beispiel: {
        aufgabe: 'In einem Dreieck ist α = 48° und β = 67°. Wie groß ist γ? Welche Dreiecksart liegt vor?',
        schritte: [
          'Die Winkelsumme im Dreieck ist 180°.',
          'Bekannte Winkel addieren: 48° + 67° = 115°.',
          'Rest berechnen: γ = 180° − 115° = 65°.',
          'Alle drei Winkel sind kleiner als 90°: Das Dreieck ist spitzwinklig.',
          'Probe: 48° + 67° + 65° = 180°.',
        ],
      },
      fehler: [
        {fehler: 'Am Geodreieck wird die falsche Skala abgelesen, zum Beispiel 50° statt 130°.', richtig: 'Lies an der Skala, die am Schenkel unter der Nullkante mit 0° beginnt, und vergleiche mit deiner Schätzung.'},
        {fehler: 'Nebenwinkel werden für gleich groß gehalten.', richtig: 'Gleich groß sind Scheitelwinkel. Nebenwinkel ergänzen sich zu 180°.'},
        {fehler: 'Im Viereck wird mit 180° gerechnet.', richtig: 'Ein Viereck besteht aus zwei Dreiecken. Seine Winkelsumme ist 360°.'},
      ],
      strategie: ['Schätzen: spitz, recht oder stumpf?', 'Beziehung suchen: Nebenwinkel, Scheitelwinkel, Stufen- oder Wechselwinkel, Winkelsumme?', 'Rechnen mit 180° oder 360°.', 'Prüfen: Passt das Ergebnis zur Zeichnung und zur Schätzung?'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Drei gleiche Winkel', aufgabe: 'In einem Dreieck sind alle drei Winkel gleich groß. Wie groß ist jeder Winkel?', pruefung: zahl({label: 'Jeder Winkel', wert: 60, einheit: '°'}), tipp: 'Die drei gleichen Winkel teilen sich die Winkelsumme.', loesung: ['Die Winkelsumme ist 180°.', '180° : 3 = 60°.', 'Ein solches Dreieck ist gleichseitig.']},
      {typ: 'Begründen', titel: 'Zwei stumpfe Winkel?', aufgabe: 'Tim behauptet: „Ein Dreieck kann zwei stumpfe Winkel haben.“ Stimmt das?', pruefung: wahl(1, 'Ja, zum Beispiel 100° und 100°.', 'Nein, zwei stumpfe Winkel sind zusammen schon mehr als 180°.', 'Nur bei großen Dreiecken.'), tipp: 'Ein stumpfer Winkel ist größer als 90°.', loesung: ['Zwei stumpfe Winkel sind jeweils größer als 90°.', 'Zusammen wären sie größer als 180°.', 'Für den dritten Winkel bliebe nichts übrig. Die Aussage ist falsch.']},
      {typ: 'Sachproblem', titel: 'Die Uhr um 4 Uhr', aufgabe: 'Wie groß ist der kleinere Winkel zwischen Stunden- und Minutenzeiger um genau 4 Uhr?', pruefung: zahl({label: 'Winkel', wert: 120, einheit: '°'}), tipp: 'Zwischen zwei benachbarten Zahlen auf dem Zifferblatt liegen 360° : 12 = 30°.', loesung: ['Der Minutenzeiger zeigt auf 12, der Stundenzeiger auf 4.', 'Dazwischen liegen 4 Abschnitte zu je 30°.', '4 · 30° = 120°.']},
    ],
  },
  symmetry: {
    hilfe: {
      merksaetze: [
        'Achsensymmetrisch: Beim Falten an der Symmetrieachse liegen beide Hälften genau aufeinander.',
        'Punkt und Bildpunkt sind gleich weit von der Achse entfernt. Ihre Verbindungslinie steht senkrecht auf der Achse.',
        'Punktsymmetrisch: Nach einer halben Drehung (180°) um das Zentrum passt die Figur wieder auf sich.',
        'Drehsymmetrisch: Die Figur passt nach einer Drehung um weniger als 360° wieder auf sich.',
        'Jedes Quadrat ist ein Rechteck und eine Raute. Jedes Rechteck und jede Raute ist ein Parallelogramm.',
      ],
      beispiel: {
        aufgabe: 'Spiegle P(2|7) an der senkrechten Achse x = 5.',
        schritte: [
          'Abstand zur Achse: 5 − 2 = 3 nach links.',
          'Auf der anderen Seite 3 nach rechts: 5 + 3 = 8.',
          'Bei einer senkrechten Achse bleibt der y-Wert gleich: 7.',
          'Ergebnis: P′(8|7).',
        ],
      },
      fehler: [
        {fehler: 'Die Diagonalen eines Rechtecks werden als Symmetrieachsen angesehen.', richtig: 'Beim Falten an einer Diagonalen passen die Hälften nicht aufeinander. Ein Rechteck hat nur die zwei Mittellinien als Achsen.'},
        {fehler: 'Beim Spiegeln wird der Punkt nur bis zur Achse verschoben.', richtig: 'Der Bildpunkt liegt auf der anderen Seite genauso weit von der Achse entfernt.'},
        {fehler: '„Jedes Rechteck ist ein Quadrat.“', richtig: 'Umgekehrt: Jedes Quadrat ist ein Rechteck. Ein Rechteck braucht keine vier gleich langen Seiten.'},
      ],
      strategie: ['Falten in Gedanken oder mit Papier: Wo passt es?', 'Im Gitter: Kästchen bis zur Achse zählen und gleich weit weitergehen.', 'Drehen: Wie oft passt die Figur bei einer ganzen Umdrehung?', 'Vierecke: Eigenschaften prüfen (parallele Seiten, gleich lange Seiten, rechte Winkel).'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Achsen des Achtecks', aufgabe: 'Wie viele Symmetrieachsen hat ein regelmäßiges Achteck?', pruefung: zahl({label: 'Symmetrieachsen', wert: 8}), tipp: 'Ein regelmäßiges Vieleck hat so viele Achsen wie Ecken.', loesung: ['Vier Achsen verlaufen durch gegenüberliegende Ecken.', 'Vier Achsen verlaufen durch die Mitten gegenüberliegender Seiten.', 'Zusammen sind es 8 Achsen.']},
      {typ: 'Begründen', titel: 'Raute oder Quadrat?', aufgabe: 'Welche Aussage ist richtig?', pruefung: wahl(2, 'Jede Raute ist ein Quadrat.', 'Kein Quadrat ist eine Raute.', 'Jedes Quadrat ist eine Raute, aber nicht jede Raute ist ein Quadrat.'), tipp: 'Vergleiche die Eigenschaften: Was braucht eine Raute, was zusätzlich ein Quadrat?', loesung: ['Eine Raute braucht vier gleich lange Seiten.', 'Ein Quadrat hat vier gleich lange Seiten und zusätzlich vier rechte Winkel.', 'Also ist jedes Quadrat eine Raute. Eine Raute mit schiefen Winkeln ist aber kein Quadrat.']},
      {typ: 'Sachproblem', titel: 'Das Windrad', aufgabe: 'Ein Windrad hat 3 gleiche Flügel. Um welchen kleinsten Winkel muss es sich drehen, bis es wieder genau gleich aussieht?', pruefung: zahl({label: 'Drehwinkel', wert: 120, einheit: '°'}), tipp: 'Bei einer vollen Umdrehung passt das Windrad dreimal.', loesung: ['Eine volle Drehung hat 360°.', 'Das Windrad passt in 3 Lagen.', '360° : 3 = 120°.']},
    ],
  },
  solids: {
    hilfe: {
      merksaetze: [
        'Körper werden durch Flächen, Kanten und Ecken beschrieben.',
        'Würfel und Quader haben 8 Ecken, 12 Kanten und 6 Flächen.',
        'Ein Prisma hat zwei gleiche, parallele Grundflächen. Eine Pyramide hat eine Grundfläche und eine Spitze.',
        'Es gibt genau 11 verschiedene Würfelnetze. Beim Spielwürfel ergeben gegenüberliegende Augenzahlen 7.',
        'Schrägbild: Vorderfläche in wahrer Größe, Tiefe im 45°-Winkel und halb so lang, verdeckte Kanten gestrichelt.',
      ],
      beispiel: {
        aufgabe: 'Für ein Kantenmodell eines Quaders mit 6 cm Länge, 4 cm Breite und 3 cm Höhe wird Draht gebraucht. Wie viel?',
        schritte: [
          'Ein Quader hat 12 Kanten: je 4 gleich lange in jeder Richtung.',
          '4 · 6 cm = 24 cm, 4 · 4 cm = 16 cm, 4 · 3 cm = 12 cm.',
          'Zusammen: 24 cm + 16 cm + 12 cm = 52 cm.',
          'Antwort: Man braucht 52 cm Draht.',
        ],
      },
      fehler: [
        {fehler: 'Bei einem Würfel werden nur die sichtbaren Kanten gezählt (9).', richtig: 'Auch verdeckte Kanten zählen. Ein Würfel hat 12 Kanten.'},
        {fehler: 'Jede Anordnung aus sechs Quadraten wird für ein Würfelnetz gehalten.', richtig: 'Probiere das Falten in Gedanken. Fünf Quadrate in einer Reihe oder ein 2-mal-3-Block ergeben keinen Würfel.'},
        {fehler: 'Im Schrägbild wird die Tiefe in voller Länge gezeichnet.', richtig: 'Die Tiefe wird im Heft halb so lang und schräg im Winkel von 45° gezeichnet.'},
      ],
      strategie: ['Körper benennen: Gibt es eine Spitze, zwei gleiche Grundflächen oder gekrümmte Flächen?', 'Systematisch zählen: zuerst vorne, dann hinten, dann die Verbindungen.', 'Netze in Gedanken falten: Eine Fläche als Boden festlegen und die anderen hochklappen.', 'Bauplan: Zahlen addieren für die Anzahl, größte Zahl für die Höhe.'],
    },
    vertiefung: [
      {typ: 'Knobeln', titel: 'Fehlende Augenzahl', aufgabe: 'Bei einem Spielwürfel liegt oben die 2. Welche Zahl liegt unten?', pruefung: zahl({label: 'Unten', wert: 5}), tipp: 'Gegenüberliegende Augenzahlen ergeben zusammen 7.', loesung: ['Oben und unten liegen sich gegenüber.', '7 − 2 = 5.', 'Unten liegt die 5.']},
      {typ: 'Begründen', titel: 'Kanten der Pyramide', aufgabe: 'Wie viele Kanten hat eine Pyramide mit einem Sechseck als Grundfläche?', pruefung: zahl({label: 'Kanten', wert: 12}), tipp: 'Zähle die Kanten der Grundfläche und die Kanten zur Spitze getrennt.', loesung: ['Die Grundfläche hat 6 Kanten.', 'Von jeder der 6 Ecken führt eine Kante zur Spitze.', '6 + 6 = 12 Kanten.']},
      {typ: 'Sachproblem', titel: 'Den Würfel vervollständigen', aufgabe: 'Ein Würfelgebäude besteht aus 2 · 2 · 2 Würfeln. Wie viele kleine Würfel braucht man noch, um daraus einen Würfel mit 3 Würfeln Kantenlänge zu bauen?', pruefung: zahl({label: 'Zusätzliche Würfel', wert: 19}), tipp: 'Berechne, wie viele Würfel der große Würfel insgesamt hat.', loesung: ['Der große Würfel hat 3 · 3 · 3 = 27 Würfel.', 'Vorhanden sind 2 · 2 · 2 = 8 Würfel.', '27 − 8 = 19 Würfel fehlen.']},
    ],
  },
};
