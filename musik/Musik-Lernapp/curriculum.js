'use strict';
// ============================================================================
// CURRICULUM - Reines Datenmodul (kein Programmcode).
// Hier stehen alle Lernschritte des Lernwegs. Du kannst Texte, Fragen und
// Reihenfolge direkt bearbeiten. Nach jeder Aenderung die App einmal mit
// index.html#pruefstand oeffnen - der Pruefstand meldet unvollstaendige
// Schritte und Fragen, deren Antwort nicht unter den Optionen ist.
//
// Felder je Lernschritt:
//   key       eindeutiger Kurzname des Schritts
//   title     Ueberschrift im Lernweg
//   goal      Lernziel ("Ich kann ...")
//   topic     Themennummer 0-5 (Notenwerte, Pausen, Beschriften, Takte,
//             Rhythmus, Punktierte Noten)
//   fuji      Fujis Erklaerung
//   rule      Merksatz
//   hints     Fujis drei Tipps (Liste)
//   questions Fragenliste; die erste Frage wird gemeinsam geloest, die
//             weiteren selbststaendig. Jede Frage: q (Fragetext),
//             options (Antwortmoeglichkeiten), answer (richtige Antwort,
//             muss in options stehen), why (Begruendung) sowie je nach
//             Aufgabe ids/m/sub/meter fuer das Notenbild.
//   weitere   Felder: minka (Minkas Beitrag), scene (Bildszene), model/
//             pattern/steps (Beispiel und Hoermodell), m/sub/mis
//             (Taktart, Unterteilung, typische Missverstaendnisse).
// ============================================================================
const MUSIC_PATH=[
 {
  "key": "puls",
  "title": "Erst den Puls spüren",
  "goal": "Ich kann gleichmäßige Schläge weiterführen, auch wenn ich nicht klatsche.",
  "fuji": "Ich gehe vier gleich große Schritte. Jeder Schritt ist ein Grundschlag: der Puls.",
  "minka": "Ich klatsche nur auf 1 und 3. Meine Pfoten gehen trotzdem auf allen vier Schlägen.",
  "pattern": [
   "q",
   "qr",
   "q",
   "qr"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Gehe am Platz: 1, 2, 3, 4. Sprich die Zahlen in gleichen Abständen. Wiederhole das viermal. Noch brauchst du die Notenzeichen nicht zu kennen.",
   "Gehe weiter und klatsche nur auf 1 und 3. Auf 2 und 4 bleiben die Hände still. Der Fuß setzt seinen Schritt fort. Vier Schritte, aber nur zwei Klatscher!",
   "Der Puls ist das gleichmäßige Zeitgerüst. Der Rhythmus ist das Muster aus Tonanfängen, Dauern und Stille. Weniger Klatscher machen den Puls nicht langsamer."
  ],
  "mis": "„Auf der stillen Stelle hört die Zeit auf.“ Nein: Du gehst auf 2 und 4 genauso weiter wie auf 1 und 3.",
  "rule": "Der Puls läuft weiter. Klang und Stille liegen auf diesem Puls.",
  "hints": [
   "Zeige auf die vier Zahlen. Jede Zahl bekommt einen Schritt.",
   "Trenne die Aufgaben: Der Fuß geht; die Hände wählen die Klatschstellen.",
   "Zähle Schritte und Klatscher getrennt. Bei zwei Durchgängen verdoppelst du beide Anzahlen."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-puls",
  "questions": [
   {
    "q": "Wie viele Schritte und Klatscher hat das Beispiel?",
    "answer": "4 Schritte, 2 Klatscher",
    "options": [
     "4 Schritte, 2 Klatscher",
     "2 Schritte, 2 Klatscher",
     "4 Schritte, 4 Klatscher"
    ],
    "ids": [
     "q",
     "hr",
     "q"
    ],
    "m": 4,
    "why": "Auf 2 und 3 klatsche ich nicht; vier Schritte. Zwei Klatscher liegen auf 1 und 4. Die Stille nimmt trotzdem zwei Schläge ein.",
    "meter": false
   },
   {
    "q": "Vier Schläge, Klatscher nur auf 2: Was stimmt?",
    "answer": "4 Schritte, 1 Klatscher",
    "options": [
     "4 Schritte, 1 Klatscher",
     "1 Schritt, 1 Klatscher",
     "4 Schritte, 2 Klatscher"
    ],
    "ids": null,
    "m": 4,
    "why": "Vier Schritte, ein Klatscher. Der Rhythmus hat einen Tonanfang; der Puls hat vier Schläge.",
    "meter": false
   },
   {
    "q": "Zwei Durchgänge mit je vier Schlägen und Klatschern auf 1 und 3 ergeben …",
    "answer": "8 Schritte, 4 Klatscher",
    "options": [
     "8 Schritte, 4 Klatscher",
     "4 Schritte, 4 Klatscher",
     "8 Schritte, 8 Klatscher"
    ],
    "ids": null,
    "m": 4,
    "why": "Acht Schritte und vier Klatscher. Jeder der zwei Durchgänge enthält vier Schritte und zwei Klatscher.",
    "meter": false
   }
  ]
 },
 {
  "key": "viertel",
  "title": "Die Viertelnote: ein Schlag",
  "goal": "Ich erkenne eine Viertelnote und beginne für jede Viertelnote einen neuen Ton.",
  "fuji": "Brot hat eine Silbe. Bei jedem Schlag sage ich einmal Brot.",
  "minka": "Der Kopf der Viertelnote ist ausgefüllt. Am Hals hängt kein Fähnchen.",
  "pattern": [
   "q",
   "q",
   "q",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Schau auf eine Note: schwarzer ovaler Kopf, Hals, kein Fähnchen. Das ist eine Viertelnote. In diesem Heft dauert sie einen Grundschlag.",
   "Zähle vier Schläge. Sprich auf jeder Zahl Brot und klatsche gleichzeitig einmal. Vier Zeichen bedeuten hier vier neue Tonanfänge.",
   "Jeder Ton dauert bis zur nächsten Zahl. Auf 4 beginnt der letzte Ton; er endet erst, wenn der nächste Schlag beginnen würde. Die Ziffer 4 ist der Anfang dieses Schlags."
  ],
  "mis": "„Die letzte Note ist schon beim Sprechen der 4 fertig.“ Nein: Auch Schlag 4 hat eine volle Dauer.",
  "rule": "Eine Viertelnote dauert einen Schlag. Brot ist die Wortstütze dafür.",
  "hints": [
   "Suche den ausgefüllten Kopf und den Hals ohne Fähnchen.",
   "Jede Viertelnote erhält genau eine Zahl.",
   "Bei lauter Viertelnoten sind Zahl der Zeichen, Tonanfänge und Schläge gleich."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-viertel",
  "questions": [
   {
    "q": "Vier Viertelnoten dauern …",
    "answer": "4 Schläge",
    "options": [
     "4 Schläge",
     "2 Schläge",
     "1 Schlag"
    ],
    "ids": [
     "q",
     "q",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Vier Viertelnoten; viermal Brot. Jede Viertelnote nimmt einen Schlag ein: 1 + 1 + 1 + 1 = 4.",
    "meter": false
   },
   {
    "q": "Drei Viertelnoten ergeben …",
    "answer": "3 Schläge, 3 Tonanfänge",
    "options": [
     "3 Schläge, 3 Tonanfänge",
     "3 Schläge, 1 Tonanfang",
     "1 Schlag, 3 Tonanfänge"
    ],
    "ids": [
     "q",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Drei Schläge und drei Tonanfänge. Brot - Brot - Brot. Das Bild ist eine kurze Folge, kein vollständiger 4/4-Takt.",
    "meter": false
   },
   {
    "q": "Wie erkennst du die Viertelnote?",
    "answer": "Ausgefüllter Kopf, Hals, kein Fähnchen",
    "options": [
     "Ausgefüllter Kopf, Hals, kein Fähnchen",
     "Leerer Kopf, Hals",
     "Ausgefüllter Kopf, zwei Fähnchen"
    ],
    "ids": [
     "q"
    ],
    "m": 4,
    "why": "Die Viertelnote hat einen ausgefüllten Kopf und einen Hals ohne Fähnchen. Ihr Zeitwert ist ein Schlag.",
    "meter": false
   }
  ]
 },
 {
  "key": "teile",
  "title": "Kopf, Hals, Fähnchen und Balken",
  "goal": "Ich beschrifte die Bestandteile und erkenne, dass ein Balken keine zusätzliche Note ist.",
  "fuji": "Der Notenkopf ist der ovale Teil. Der Notenhals ist der lange Strich.",
  "minka": "Ein Balken verbindet kurze Noten. Ich zähle ihre Köpfe, nicht ihre Striche!",
  "pattern": [
   "e",
   "e"
  ],
  "m": 4,
  "sub": 2,
  "steps": [
   "Folge den Beschriftungen im Bild. Kopf und Hals gehören zu einer Note. Ein Fähnchen sitzt am Hals einer einzelnen kurzen Note.",
   "Zwei Achtelnoten können durch einen Balken verbunden sein. Sie haben zwei Köpfe, also zwei Tonanfänge. Der Balken ersetzt ihre einzelnen Fähnchen; er fügt keine Zeit hinzu.",
   "Ein Punkt rechts neben dem Kopf verlängert später den Wert. Hier lernst du nur seine Stelle. Eine Note muss nicht alle Bestandteile haben: Die ganze Note hat zum Beispiel keinen Hals."
  ],
  "mis": "„Ein Balken verbindet alles zu einem einzigen Ton.“ Nein: Jeder Kopf zeigt weiterhin einen eigenen Tonanfang.",
  "rule": "Köpfe zählen Tonanfänge. Fähnchen und Balken helfen, den Wert zu erkennen.",
  "hints": [
   "Beginne beim ovalen Teil: Das ist der Kopf.",
   "Zähle jeden Kopf einmal. Ein Balken ist keine weitere Note.",
   "Achtel haben einen Balken, Sechzehntel zwei. Ihre Dauer folgt später."
  ],
  "model": "parts",
  "topic": 2,
  "scene": "lesson-teile",
  "questions": [
   {
    "q": "Zwei Köpfe mit einem Balken bedeuten …",
    "answer": "2 Noten, 2 Tonanfänge",
    "options": [
     "2 Noten, 2 Tonanfänge",
     "1 Note, 1 Tonanfang",
     "3 Noten, 3 Tonanfänge"
    ],
    "ids": [
     "e",
     "e"
    ],
    "m": 4,
    "why": "Zwei Noten und zwei Tonanfänge. Der Balken ersetzt die Fähnchen der beiden Achtelnoten.",
    "meter": false
   },
   {
    "q": "Hat die Viertelnote ein Fähnchen?",
    "answer": "Nein: Kopf und Hals genügen",
    "options": [
     "Nein: Kopf und Hals genügen",
     "Ja: ein Fähnchen",
     "Ja: zwei Fähnchen"
    ],
    "ids": [
     "q"
    ],
    "m": 4,
    "why": "Ausgefüllter Kopf und Hals; kein Fähnchen. Das ist die Viertelnote.",
    "meter": false
   },
   {
    "q": "Vier verbundene Sechzehntel haben …",
    "answer": "4 Köpfe, 2 Balken, 4 Tonanfänge",
    "options": [
     "4 Köpfe, 2 Balken, 4 Tonanfänge",
     "2 Köpfe, 4 Balken, 2 Tonanfänge",
     "4 Köpfe, 1 Balken, 1 Tonanfang"
    ],
    "ids": [
     "s",
     "s",
     "s",
     "s"
    ],
    "m": 4,
    "why": "Vier Köpfe und zwei durchgehende Balken. Es bleiben vier Noten mit vier Tonanfängen.",
    "meter": false
   }
  ]
 },
 {
  "key": "halbe",
  "title": "Die halbe Note: beginnen und halten",
  "goal": "Ich halte einen Ton zwei Schläge lang, ohne ihn auf dem zweiten Schlag neu zu beginnen.",
  "fuji": "Ich singe ein langes „maa“. Es läuft über zwei Schläge weiter.",
  "minka": "Ein leerer Kopf mit Hals bedeutet: halbe Note. Zwei Schläge, ein Tonanfang!",
  "pattern": [
   "h",
   "h"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Erkenne die halbe Note am leeren Kopf mit Hals. Sie dauert zwei Schläge. Zum Hören eignet sich ein gesungener Ton besser als ein kurzer Klatscher.",
   "Erste Note: Beginne maa auf 1. Zähle 2 im Kopf und singe weiter. Erst mit Beginn von 3 hört dieser Ton auf; dort beginnt die zweite halbe Note.",
   "Zweite Note: Beginne auf 3 und halte über 4 bis zum Taktende. Die Zeitspur zeigt vier Schläge, aber nur zwei Startpunkte. Blau ohne Startpunkt bedeutet: weiterhalten."
  ],
  "mis": "„Auf 2 muss ich noch einmal singen.“ Nein: Die erste Note klingt auf 2 weiter. Ein neuer Ton beginnt erst auf 3.",
  "rule": "Halbe Note: zwei Schläge Klang, nur ein Tonanfang.",
  "hints": [
   "Der leere Kopf mit Hals zeigt zwei Schläge.",
   "Lege zwei Finger auf die Zeitspur. Nur am ersten Finger beginnt die Note.",
   "Rechne zuerst die Dauer. Zähle danach die Köpfe für die Tonanfänge."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-halbe",
  "questions": [
   {
    "q": "Zwei halbe Noten beginnen auf …",
    "answer": "1 und 3",
    "options": [
     "1 und 3",
     "1 und 2",
     "1, 2, 3 und 4"
    ],
    "ids": [
     "h",
     "h"
    ],
    "m": 4,
    "why": "Erste Note auf 1, halten über 2. Zweite Note auf 3. Gesamt vier Schläge. Auf 2 und 4 wird kein neuer Ton begonnen.",
    "meter": false
   },
   {
    "q": "Halbe Note, dann Viertelnote: Wann beginnt die Viertelnote?",
    "answer": "Auf 3",
    "options": [
     "Auf 3",
     "Auf 2",
     "Auf 4"
    ],
    "ids": [
     "h",
     "q"
    ],
    "m": 4,
    "why": "2 + 1 = 3 Schläge, zwei Tonanfänge. Die Viertelnote beginnt auf 3, nach den zwei Schlägen der halben Note.",
    "meter": false
   },
   {
    "q": "Halbe Note oder zwei Viertel: Was stimmt?",
    "answer": "Gleiche Dauer, verschiedene Tonanfänge",
    "options": [
     "Gleiche Dauer, verschiedene Tonanfänge",
     "Gleiche Dauer und gleiche Tonanfänge",
     "Die Halbe dauert länger"
    ],
    "ids": [
     "q",
     "q"
    ],
    "m": 4,
    "why": "Beide dauern zwei Schläge. Die halbe Note hat einen durchgehenden Ton; zwei Viertelnoten haben zwei Tonanfänge.",
    "meter": false
   }
  ]
 },
 {
  "key": "ganze",
  "title": "Die ganze Note: vier Schläge Klang",
  "goal": "Ich unterscheide vier Schläge Dauer von vier neuen Tonanfängen.",
  "fuji": "Mein leerer Kopf hat keinen Hals. Ich beginne nur einmal.",
  "minka": "Ich zähle vier Schläge mit und höre einen langen Ton.",
  "pattern": [
   "w"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Die ganze Note hat einen leeren ovalen Kopf ohne Hals. In unseren Vierteltakten dauert sie vier Schläge. Ihr Name bedeutet nicht, dass jede einzelne Note einen Takt füllt.",
   "Beginne maa auf 1. Halte auf 2, 3 und 4 weiter. Beende den Ton erst am Ende des vierten Schlags, dort, wo die nächste 1 beginnen würde.",
   "Zum Vergleich singe viermal kurz ma: auf 1, 2, 3 und 4. Diese vier Viertelnoten dauern zusammen genauso lange, haben aber vier Anfänge. Eine ganze Note hat nur einen."
  ],
  "mis": "„Vier Schläge heißt viermal anschlagen.“ Nein: Die ganze Note hält einen einzigen Ton vier Schläge lang.",
  "rule": "Dauer und Tonanfänge sind zwei verschiedene Fragen.",
  "hints": [
   "Die ganze Note hat keinen Hals.",
   "Zähle 1 bis 4, aber beginne nur auf 1.",
   "Zwei halbe Noten dauern 2 + 2; eine ganze Note dauert 4."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-ganze",
  "questions": [
   {
    "q": "Eine ganze Note im Viertelpuls bedeutet …",
    "answer": "4 Schläge Klang, 1 Tonanfang",
    "options": [
     "4 Schläge Klang, 1 Tonanfang",
     "4 Schläge Klang, 4 Tonanfänge",
     "1 Schlag Klang, 1 Tonanfang"
    ],
    "ids": [
     "w"
    ],
    "m": 4,
    "why": "Beginn auf 1; weitergehalten; vier Schläge und ein Tonanfang. Die Zählbewegung läuft während des gehaltenen Tons weiter.",
    "meter": false
   },
   {
    "q": "Eine Ganze und zwei Halbe haben …",
    "answer": "gleiche Dauer, 1 beziehungsweise 2 Tonanfänge",
    "options": [
     "gleiche Dauer, 1 beziehungsweise 2 Tonanfänge",
     "verschiedene Dauer, je 2 Tonanfänge",
     "gleiche Dauer und je 1 Tonanfang"
    ],
    "ids": [
     "h",
     "h"
    ],
    "m": 4,
    "why": "Beide dauern vier Schläge. Zwei halbe Noten haben zwei Tonanfänge; eine ganze Note hat einen.",
    "meter": false
   },
   {
    "q": "Passt eine ganze Note in ein Zeitfenster mit drei Viertelschlägen?",
    "answer": "Nein: Sie ist einen Schlag zu lang",
    "options": [
     "Nein: Sie ist einen Schlag zu lang",
     "Ja: Ganze bedeutet immer ein ganzer Takt",
     "Nein: Sie ist einen Schlag zu kurz"
    ],
    "ids": null,
    "m": 4,
    "why": "Nein. Eine ganze Note dauert vier Schläge und ist für dieses Zeitfenster einen Schlag zu lang.",
    "meter": false
   }
  ]
 },
 {
  "key": "tempo",
  "title": "Langsam und schnell: das Tempo",
  "goal": "Ich weiß, dass das Tempo die Schlagabstände ändert, aber die Notenwerte im gleichen Verhältnis bleiben.",
  "fuji": "Bei langsamem Puls liegen meine Schritte weiter auseinander.",
  "minka": "Die halbe Note braucht immer zwei Schläge, auch beim schnelleren Puls.",
  "pattern": [
   "h",
   "q",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Sprich 1, 2, 3, 4 langsam und gleichmäßig. Wiederhole es etwas schneller. Verändere dabei alle Schlagabstände gemeinsam. Das ist eine Tempoänderung.",
   "Die Folge oben dauert in beiden Tempi vier Schläge: halbe Note zwei, dann zweimal ein Schlag. Der lange Ton bleibt doppelt so lang wie eine Viertelnote.",
   "Bei 60 Viertelschlägen pro Minute dauert ein Schlag eine Sekunde. Die halbe Note dauert zwei Sekunden. Bei 120 dauert ein Schlag eine halbe Sekunde, die halbe Note also eine Sekunde. Sekunden sind Zusatzwissen; die Schläge bleiben entscheidend."
  ],
  "mis": "„Schnelleres Tempo macht aus der halben Note eine Viertelnote.“ Nein: Es bleibt dieselbe Note über zwei schnellere Schläge.",
  "rule": "Tempo ändert die Geschwindigkeit. Notenwerte ordnen die Dauer in Schlägen.",
  "hints": [
   "Sprich das gleiche Zählmuster in zwei Geschwindigkeiten.",
   "Eine halbe Note bleibt doppelt so lang wie eine Viertelnote.",
   "Tempo 120: Jeder Viertelschlag dauert eine halbe Sekunde."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-tempo",
  "questions": [
   {
    "q": "Eine Halbe bei Tempo 60 dauert …",
    "answer": "2 Schläge und 2 Sekunden",
    "options": [
     "2 Schläge und 2 Sekunden",
     "1 Schlag und 2 Sekunden",
     "2 Schläge und 1 Sekunde"
    ],
    "ids": [
     "h"
    ],
    "m": 4,
    "why": "Zwei Schläge und zwei Sekunden bei Tempo 60; auch bei Tempo 120 zwei Schläge, dort aber nur eine Sekunde.",
    "meter": false
   },
   {
    "q": "Die Folge Halbe, Viertel, Viertel wird schneller gespielt. Was bleibt?",
    "answer": "4 Schläge, 3 Tonanfänge",
    "options": [
     "4 Schläge, 3 Tonanfänge",
     "3 Schläge, 4 Tonanfänge",
     "2 Schläge, 3 Tonanfänge"
    ],
    "ids": [
     "h",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Es bleiben vier Schläge und drei Tonanfänge. Die Folge braucht lediglich weniger Zeit in Sekunden.",
    "meter": false
   },
   {
    "q": "Eine Ganze bei Tempo 120 dauert …",
    "answer": "4 Schläge und 2 Sekunden",
    "options": [
     "4 Schläge und 2 Sekunden",
     "4 Schläge und 4 Sekunden",
     "2 Schläge und 2 Sekunden"
    ],
    "ids": [
     "w"
    ],
    "m": 4,
    "why": "Bei Tempo 120 dauert jeder Viertelschlag ½ Sekunde. Eine ganze Note hat vier Schläge: 4 × ½ = 2 Sekunden.",
    "meter": false
   }
  ]
 },
 {
  "key": "achtel",
  "title": "Zwei Achtel teilen einen Schlag",
  "goal": "Ich verteile zwei gleich lange Achtelnoten auf einen Schlag.",
  "fuji": "Ich spreche Kä auf der Zahl und se genau in der Mitte bis zur nächsten Zahl.",
  "minka": "Kä-se dauert zusammen einen Schlag. Jede Silbe gehört zu einer Achtelnote.",
  "pattern": [
   "e",
   "e",
   "q",
   "h"
  ],
  "m": 4,
  "sub": 2,
  "steps": [
   "Eine Achtelnote hat schwarzen Kopf, Hals und ein Fähnchen. In einer Zweiergruppe ersetzt ein Balken die Fähnchen. Jede Achtel dauert einen halben Schlag.",
   "Teile Schlag 1: Sprich 1 und. Kä beginnt auf 1, se auf und. Beide Hälften dauern gleich lange. Der Fuß macht auf der Zahl einen Schritt; auf und kommt kein zusätzlicher Viertelschritt.",
   "Im Beispiel dauern die beiden Achtel gemeinsam Schlag 1. Die Viertelnote beginnt auf 2. Die halbe Note beginnt auf 3 und hält über 4. Blaue Felder zeigen klingende Zeit; nur die Startpunkte zeigen neue Tonanfänge."
  ],
  "mis": "„Zwei Achtel brauchen zwei Schläge, weil es zwei Köpfe sind.“ Nein: ½ + ½ = 1 Schlag, aber zwei Tonanfänge.",
  "rule": "Kä-se: zwei gleichmäßige Tonanfänge in einem Schlag.",
  "hints": [
   "Zähle 1 und 2 und. Zahl und und sind gleich weit auseinander.",
   "Ein Paar Achtel nimmt nur einen Viertelschlag ein.",
   "Eine halbe Note dauert zwei Schläge. Pro Schlag brauchst du zwei Achtel."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-achtel",
  "questions": [
   {
    "q": "Wann beginnt die zweite Achtel im Paar auf Schlag 1?",
    "answer": "Auf dem und nach 1",
    "options": [
     "Auf dem und nach 1",
     "Auf 2",
     "Auf 3"
    ],
    "ids": [
     "e",
     "e",
     "q"
    ],
    "m": 4,
    "why": "Zweite Achtel auf und; ein Schlag zusammen. Die Viertelnote beginnt auf 2. Zwei kurze Töne verbrauchen nicht zwei ganze Schläge.",
    "meter": false
   },
   {
    "q": "Vier Achtelnoten ergeben …",
    "answer": "2 Schläge, 4 Tonanfänge",
    "options": [
     "2 Schläge, 4 Tonanfänge",
     "4 Schläge, 4 Tonanfänge",
     "1 Schlag, 4 Tonanfänge"
    ],
    "ids": [
     "e",
     "e",
     "e",
     "e"
    ],
    "m": 4,
    "why": "Zwei Schläge, vier Tonanfänge. Kä-se | Kä-se; jedes Wort dauert einen Schlag.",
    "meter": false
   },
   {
    "q": "Wie viele Achtel dauern so lange wie eine Halbe?",
    "answer": "4 Achtel",
    "options": [
     "4 Achtel",
     "2 Achtel",
     "8 Achtel"
    ],
    "ids": [
     "h"
    ],
    "m": 4,
    "why": "Vier Achtelnoten dauern ebenso zwei Schläge. Es werden vier Tonanfänge statt eines durchgehenden Tons.",
    "meter": false
   }
  ]
 },
 {
  "key": "sechzehntel",
  "title": "Vier Sechzehntel in einem Schlag",
  "goal": "Ich verteile vier gleiche Teilzeiten langsam und gleichmäßig auf einen Viertelschlag.",
  "fuji": "Scho-ko-la-de hat vier Silben. Alle vier passen in einen Schlag.",
  "minka": "Zwei Balken zeigen Sechzehntel. Jede dauert ein Viertel eines Schlags.",
  "pattern": [
   "s",
   "s",
   "s",
   "s",
   "q",
   "h"
  ],
  "m": 4,
  "sub": 4,
  "steps": [
   "Die Sechzehntelnote hat zwei Fähnchen. In einer Gruppe erkennst du zwei Balken. Ein Sechzehntel dauert ¼ Schlag; vier davon ergeben einen ganzen Viertelschlag.",
   "Übe zuerst nur Schlag 1 sehr langsam. Sprich 1 e und a in vier gleichen Abständen. Dazu passen Scho, ko, la, de. Die nächste Zahl 2 folgt erst nach der vierten Teilzeit.",
   "Im Beispiel liegen vier kurze Tonanfänge innerhalb von Schlag 1. Die Viertelnote beginnt auf 2; die halbe Note auf 3. Der Fuß bleibt bei 1, 2, 3, 4. Er geht nicht auf jeder Schokoladensilbe."
  ],
  "mis": "„Vier Sechzehntel sind vier Viertelschläge.“ Nein: Vier Köpfe können in nur einem Schlag liegen.",
  "rule": "Scho-ko-la-de: vier gleichmäßige Tonanfänge in einem Schlag.",
  "hints": [
   "Lege vier kleine Gegenstände zwischen zwei Viertelschläge.",
   "Jede Teilzeit ist ein Viertel des Schlags.",
   "Zwei Achtel und vier Sechzehntel füllen beide einen Schlag."
  ],
  "model": "timeline",
  "topic": 0,
  "scene": "lesson-sechzehntel",
  "questions": [
   {
    "q": "Vier Sechzehntel ergeben …",
    "answer": "1 Schlag, 4 Tonanfänge",
    "options": [
     "1 Schlag, 4 Tonanfänge",
     "4 Schläge, 4 Tonanfänge",
     "2 Schläge, 4 Tonanfänge"
    ],
    "ids": [
     "s",
     "s",
     "s",
     "s"
    ],
    "m": 4,
    "why": "1 e und a. Jede Sechzehntelnote ¼ Schlag, alle vier zusammen ein Schlag. Alle Teilzeiten sind gleich lang.",
    "meter": false
   },
   {
    "q": "Wie viele Sechzehntel dauern zwei Schläge?",
    "answer": "8 Sechzehntel",
    "options": [
     "8 Sechzehntel",
     "4 Sechzehntel",
     "2 Sechzehntel"
    ],
    "ids": null,
    "m": 4,
    "why": "Acht Sechzehntel, also acht Tonanfänge. Vier je Schlag mal zwei Schläge ergibt acht.",
    "meter": false
   },
   {
    "q": "Zwei Achtel und vier Sechzehntel haben …",
    "answer": "gleiche Dauer, 2 beziehungsweise 4 Tonanfänge",
    "options": [
     "gleiche Dauer, 2 beziehungsweise 4 Tonanfänge",
     "gleiche Dauer und gleiche Tonanfänge",
     "verschiedene Dauer"
    ],
    "ids": [
     "e",
     "e"
    ],
    "m": 4,
    "why": "Beide Folgen dauern einen Schlag. Zwei Achtel haben zwei Tonanfänge, vier Sechzehntel vier.",
    "meter": false
   }
  ]
 },
 {
  "key": "familie",
  "title": "Gleiche Zeit, verschiedene Rhythmen",
  "goal": "Ich vergleiche Gesamtzeit und Tonanfänge getrennt.",
  "fuji": "Ich tausche eine halbe Note gegen zwei Viertelnoten.",
  "minka": "Die Zeit bleibt gleich. Aber ich höre jetzt zwei Anfänge statt einem.",
  "pattern": [
   "h"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Betrachte die Wertetafel. Jeder Schritt nach rechts halbiert den einzelnen Wert. Um dieselbe Zeit zu füllen, brauchst du doppelt so viele Zeichen.",
   "Beispiel zwei Schläge: eine halbe Note = zwei Viertelnoten = vier Achtelnoten = acht Sechzehntelnoten. Die Summe bleibt stets zwei Schläge.",
   "Höre oder singe die Folgen nacheinander. Ein langer Ton klingt anders als viele kurze. Frage deshalb immer zuerst „Wie lange insgesamt?“ und danach „Wie viele neue Tonanfänge?“."
  ],
  "mis": "„Gleiche Gesamtdauer heißt gleicher Rhythmus.“ Nein: Ein langer Ton und vier kurze Töne haben andere Anfänge.",
  "rule": "Zeitwerte addieren; Tonanfänge an den Köpfen zählen.",
  "hints": [
   "Eine Viertelnote kann durch zwei Achtel ersetzt werden.",
   "Verdopple die Anzahl beim Halbieren des einzelnen Werts.",
   "Noten ohne Pause: Jeder Kopf ist ein Tonanfang, auch wenn die Summe gleich bleibt."
  ],
  "model": "family",
  "topic": 0,
  "scene": "lesson-familie",
  "questions": [
   {
    "q": "Eine Halbe entspricht der Dauer von …",
    "answer": "2 Vierteln, 4 Achteln, 8 Sechzehnteln",
    "options": [
     "2 Vierteln, 4 Achteln, 8 Sechzehnteln",
     "2 Vierteln, 2 Achteln, 2 Sechzehnteln",
     "4 Vierteln, 8 Achteln, 16 Sechzehnteln"
    ],
    "ids": [
     "h"
    ],
    "m": 4,
    "why": "Zwei Viertel, vier Achtel, acht Sechzehntel. Alle Folgen dauern zwei Schläge.",
    "meter": false
   },
   {
    "q": "Drei Viertel dauern so lange wie …",
    "answer": "6 Achtel",
    "options": [
     "6 Achtel",
     "3 Achtel",
     "12 Achtel"
    ],
    "ids": [
     "q",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Sechs Achtel dauern 6 × ½ = 3 Schläge. Drei Viertel haben drei, sechs Achtel sechs Tonanfänge.",
    "meter": false
   },
   {
    "q": "Vier Schläge lassen sich füllen mit …",
    "answer": "2 Halben oder 4 Vierteln",
    "options": [
     "2 Halben oder 4 Vierteln",
     "4 Halben oder 2 Vierteln",
     "1 Halben oder 4 Vierteln"
    ],
    "ids": [
     "h",
     "h"
    ],
    "m": 4,
    "why": "Zwei halbe Noten oder vier Viertelnoten ergeben vier Schläge. Die erste Folge hat zwei, die zweite vier Zeichen und Tonanfänge.",
    "meter": false
   }
  ]
 },
 {
  "key": "stille",
  "title": "Pause oder gehaltener Ton?",
  "goal": "Ich kann hören und erklären, ob ein Ton weiterklingt oder ob es still wird.",
  "fuji": "Bei einer Pause singe und spiele ich für eine bestimmte Zeit nicht.",
  "minka": "Weiterhalten ist etwas anderes: Der Ton klingt noch. Bei Stille bleibt der Puls trotzdem.",
  "pattern": [
   "q",
   "qr",
   "h"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Vergleiche die zwei Zeitspuren im Bild. Oben: halbe Note und zwei Viertel. Der erste Ton klingt auf 1 und 2. Unten: Viertelnote, Viertelpause, halbe Note. Auf 2 ist wirklich Stille.",
   "Singe unten auf 1 ein kurzes maa. Beende es genau zu Beginn von 2. Gehe auf 2 weiter, singe aber nicht. Auf 3 beginnt ein neuer Ton, der über 4 hält.",
   "Zum Hören singt eine zweite Person beide Folgen. Du zeigst auf die Zeitspur. Eine Pause hörst du nicht als eigenen Klang; du erkennst ihre Dauer zwischen den klingenden Stellen."
  ],
  "mis": "„Kein neuer Klatscher bedeutet immer Pause.“ Nein: Es könnte ein gehaltener Ton sein. Deshalb üben wir lange Werte auch singend.",
  "rule": "Weiterhalten = Klang bleibt. Pause = Stille. In beiden Fällen zählt die Zeit.",
  "hints": [
   "Blau bedeutet Klang, grau bedeutet Stille. Ein Startpunkt zeigt einen neuen Ton.",
   "Eine Note ohne neuen Startpunkt wird weitergehalten.",
   "Eine Pause hat kein Klangfeld und keinen Tonanfang, aber eine Dauer."
  ],
  "model": "compare",
  "topic": 1,
  "scene": "lesson-stille",
  "questions": [
   {
    "q": "Im Beispiel: Was geschieht auf 2 und auf 4?",
    "answer": "2 still; 4 Ton von 3 weiterhalten",
    "options": [
     "2 still; 4 Ton von 3 weiterhalten",
     "2 weiterhalten; 4 still",
     "2 und 4 neue Töne beginnen"
    ],
    "ids": [
     "q",
     "qr",
     "h"
    ],
    "m": 4,
    "why": "Auf 2 ist Stille; auf 4 wird der Ton von 3 weitergehalten. Zwei Tonanfänge: auf 1 und 3.",
    "meter": false
   },
   {
    "q": "Zwei Halbe: Was geschieht auf 2?",
    "answer": "Der Ton von 1 klingt weiter",
    "options": [
     "Der Ton von 1 klingt weiter",
     "Es ist still",
     "Ein neuer Ton beginnt"
    ],
    "ids": [
     "h",
     "h"
    ],
    "m": 4,
    "why": "Auf 2 klingt die erste halbe Note weiter. Tonanfänge auf 1 und 3; keine Pause.",
    "meter": false
   },
   {
    "q": "Viertel, halbe Pause, Viertel: Wann setzt der zweite Ton ein?",
    "answer": "Auf 4",
    "options": [
     "Auf 4",
     "Auf 2",
     "Auf 3"
    ],
    "ids": [
     "q",
     "hr",
     "q"
    ],
    "m": 4,
    "why": "Auf 2 und 3 ist Stille, weil die halbe Pause zwei Schläge dauert. Der zweite Ton beginnt auf 4.",
    "meter": false
   }
  ]
 },
 {
  "key": "viertelpause",
  "title": "Die Viertelpause hält einen Schlag frei",
  "goal": "Ich zähle einen stillen Schlag vollständig und setze danach pünktlich wieder ein.",
  "fuji": "Das geschwungene Zeichen ist eine Viertelpause: ein Schlag Stille.",
  "minka": "Ich lasse den Ton auf 2 aus und beginne auf 3 wieder. Den stillen Schlag überspringe ich nicht.",
  "pattern": [
   "q",
   "qr",
   "q",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Eine Viertelpause dauert genauso lange wie eine Viertelnote: einen Schlag. Der Unterschied liegt in der Ausführung: Note klingt, Pause schweigt.",
   "Zähle 1, 2, 3, 4 gleichmäßig. Klatsche auf 1. Auf 2 gehen nur Fuß und inneres Zählen weiter. Klatsche dann auf 3 und 4. Es gibt drei Klatscher in vier Schlägen.",
   "Als Stütze darfst du beim Lernen auf 2 leise still sagen. In der fertigen Aufführung bleibt die Pause auch mit der Stimme still. Eine helfende Person darf den Puls vormachen."
  ],
  "mis": "„Ich überspringe die Pause und klatsche sofort den nächsten Ton.“ Dann wird die Folge zu kurz. Warte einen ganzen Schlag.",
  "rule": "Viertelpause: ein Schlag Zeit, kein Tonanfang.",
  "hints": [
   "Die Pause zählt in der Rechnung mit: ein Schlag.",
   "Schreibe unter die vier Zeichen 1, 2, 3, 4.",
   "Zähle nur Notenköpfe als Klatscher; das Pausenzeichen hat keinen Kopf."
  ],
  "model": "timeline",
  "topic": 1,
  "scene": "lesson-viertelpause",
  "questions": [
   {
    "q": "Viertel, Viertelpause, Viertel, Viertel ergeben …",
    "answer": "4 Schläge, 3 Tonanfänge",
    "options": [
     "4 Schläge, 3 Tonanfänge",
     "3 Schläge, 3 Tonanfänge",
     "4 Schläge, 4 Tonanfänge"
    ],
    "ids": [
     "q",
     "qr",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Stille auf 2; Töne auf 3 und 4. Vier Schläge: 1 + 1 + 1 + 1. Nur drei Tonanfänge.",
    "meter": false
   },
   {
    "q": "Viertelpause am Anfang: Wann hörst du den ersten Ton?",
    "answer": "Auf 2",
    "options": [
     "Auf 2",
     "Auf 1",
     "Auf 3"
    ],
    "ids": [
     "qr",
     "q",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Vier Schläge, drei Klatscher. Der erste Ton erklingt auf 2, denn auf 1 steht die Pause.",
    "meter": false
   },
   {
    "q": "Die dritte von vier Vierteln wird zur Viertelpause. Was stimmt?",
    "answer": "4 Schläge; Töne auf 1, 2 und 4",
    "options": [
     "4 Schläge; Töne auf 1, 2 und 4",
     "3 Schläge; Töne auf 1, 2 und 3",
     "4 Schläge; Töne auf allen Zahlen"
    ],
    "ids": [
     "q",
     "q",
     "qr",
     "q"
    ],
    "m": 4,
    "why": "Klatscher auf 1, 2 und 4; Stille auf 3. Gesamtdauer unverändert vier Schläge.",
    "meter": false
   }
  ]
 },
 {
  "key": "lange-pausen",
  "title": "Halbe Pause und Ganztaktpause",
  "goal": "Ich erkenne die Lage der langen Pausenzeichen und lese eine Ganztaktpause im Zusammenhang.",
  "fuji": "Die halbe Pause sitzt auf einer Linie: zwei Schläge Stille.",
  "minka": "Die ganze Pause hängt unter einer Linie. Mittig allein kann sie einen ganzen Takt Stille bedeuten.",
  "pattern": [
   "q",
   "hr",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Die halbe Pause ist ein Rechteck auf einer Linie. Sie dauert zwei Schläge. Im Beispiel unten endet der erste Ton nach 1; auf 2 und 3 bleibt es still. Der nächste Ton beginnt auf 4.",
   "Das Rechteck der ganzen Pause hängt unter einer Linie. Sein fester Wert ist vier Viertelschläge. Die Lage ist entscheidend: ganze hängt, halbe sitzt.",
   "Steht das hängende Zeichen allein mittig in einem sonst leeren Takt, bezeichnet es gewöhnlich eine Ganztaktpause. Dann bleibt der ganze Takt still: bei 3/4 drei Schläge, bei 4/4 vier. Die Taktart lernst du gleich genauer."
  ],
  "mis": "„Das hängende Zeichen bedeutet immer vier Schläge.“ Für eine Ganztaktpause musst du die Taktart mitlesen.",
  "rule": "Halbe sitzt: zwei. Ganze hängt. Ganztaktpause: so lang wie der ganze Takt.",
  "hints": [
   "Suche die Linie: Sitzt das Rechteck darauf oder hängt es darunter?",
   "Eine halbe Pause nimmt zwei aufeinanderfolgende Schläge ein.",
   "Für die Ganztaktpause entscheidet die obere Zahl der Taktart über die Schlagzahl."
  ],
  "model": "longrests",
  "topic": 1,
  "scene": "lesson-lange-pausen",
  "questions": [
   {
    "q": "Viertel, halbe Pause, Viertel: Wo ist Stille?",
    "answer": "Auf 2 und 3",
    "options": [
     "Auf 2 und 3",
     "Nur auf 2",
     "Auf 3 und 4"
    ],
    "ids": [
     "q",
     "hr",
     "q"
    ],
    "m": 4,
    "why": "Auf 2 und 3 still; 1 + 2 + 1 = 4 Schläge. Der zweite Ton beginnt erst auf 4.",
    "meter": false
   },
   {
    "q": "Halbe Note und halbe Pause: Was stimmt?",
    "answer": "1 und 2 Klang; 3 und 4 Stille",
    "options": [
     "1 und 2 Klang; 3 und 4 Stille",
     "1 Klang; 2, 3 und 4 Stille",
     "Alle vier Schläge Klang"
    ],
    "ids": [
     "h",
     "hr"
    ],
    "m": 4,
    "why": "Vier Schläge. Die halbe Note klingt auf 1 und 2; die halbe Pause bleibt auf 3 und 4 still.",
    "meter": false
   },
   {
    "q": "Eine Ganztaktpause im 3/4-Takt dauert …",
    "answer": "3 Schläge Stille",
    "options": [
     "3 Schläge Stille",
     "4 Schläge Stille",
     "2 Schläge Stille"
    ],
    "ids": null,
    "m": 4,
    "why": "Drei Schläge im 3/4-Takt, vier im 4/4-Takt. Die mittige Ganztaktpause füllt jeweils den gesamten leeren Takt.",
    "meter": false
   }
  ]
 },
 {
  "key": "kurze-pausen",
  "title": "Achtelpause und Sechzehntelpause",
  "goal": "Ich halte auch kurze stille Teilzeiten ein, ohne den nächsten Ton vorzuziehen.",
  "fuji": "Eine Achtelpause dauert einen halben Schlag. Ihr Zeichen hat ein Häkchen.",
  "minka": "Die Sechzehntelpause hat zwei Häkchen und dauert ein Viertel eines Schlags.",
  "pattern": [
   "e",
   "er",
   "s",
   "sr",
   "e",
   "h"
  ],
  "m": 4,
  "sub": 4,
  "steps": [
   "Erste Gruppe: Achtelnote und Achtelpause. Zähle 1 und. Auf 1 beginnt der Ton; auf und ist Stille. ½ Klang + ½ Stille = ein Schlag.",
   "Zweite Gruppe: Sechzehntelnote, Sechzehntelpause, Achtelnote. Zähle 2 e und a. Ton auf 2, Stille auf e, neuer Ton auf und; dieser hält über a. ¼ + ¼ + ½ = ein Schlag.",
   "Auf 3 beginnt die halbe Note, die über 4 hält. Beginne langsam. Der Fuß geht nur auf den Zahlen. Die Pausen können kurz sein; sie dürfen nicht verschwinden."
  ],
  "mis": "„Ich klatsche das Pausenzeichen mit.“ Nein: Es zählt zur Zeit, aber nicht zu den Tonanfängen.",
  "rule": "Achtelpause = ½ Schlag Stille. Sechzehntelpause = ¼ Schlag Stille.",
  "hints": [
   "Teile den Schlag zunächst in zwei oder vier gleich große Felder.",
   "Ein Häkchen: halber Schlag; zwei Häkchen: Viertel eines Schlags.",
   "Lies die Felder von links nach rechts. Ein Pausenfeld wird still durchlaufen."
  ],
  "model": "timeline",
  "topic": 1,
  "scene": "lesson-kurze-pausen",
  "questions": [
   {
    "q": "Achtelnote und Achtelpause in Schlag 1: Was stimmt?",
    "answer": "Ton auf 1, Stille auf und",
    "options": [
     "Ton auf 1, Stille auf und",
     "Ton auf 1, Stille auf 2",
     "Stille auf 1, Ton auf und"
    ],
    "ids": [
     "e",
     "er"
    ],
    "m": 4,
    "why": "½ + ½ = 1 Schlag. Ton auf der Zahl 1, Stille auf und. Der nächste Schlag beginnt erst danach.",
    "meter": false
   },
   {
    "q": "Achtelpause, dann Achtelnote: Wann beginnt der Ton?",
    "answer": "Auf und",
    "options": [
     "Auf und",
     "Auf der Zahl 1",
     "Auf der Zahl 2"
    ],
    "ids": [
     "er",
     "e"
    ],
    "m": 4,
    "why": "Ton auf und; davor auf 1 Stille. Achtelpause und Achtelnote ergeben zusammen einen Schlag.",
    "meter": false
   },
   {
    "q": "Sechzehntel, Sechzehntelpause, Sechzehntel, Sechzehntel: Was ist richtig?",
    "answer": "Stille auf e; Töne auf 1, und und a",
    "options": [
     "Stille auf e; Töne auf 1, und und a",
     "Stille auf und; Töne auf 1, e und a",
     "Stille auf a; Töne auf 1, e und und"
    ],
    "ids": [
     "s",
     "sr",
     "s",
     "s"
    ],
    "m": 4,
    "why": "Stille auf e. Tonanfänge auf 1, und und a. Vier Viertel eines Schlags ergeben insgesamt einen Schlag.",
    "meter": false
   }
  ]
 },
 {
  "key": "generalpause",
  "title": "Wenn alle schweigen: Generalpause",
  "goal": "Ich unterscheide die Pause einer Stimme von einer gemeinsamen Pause aller Beteiligten.",
  "fuji": "Wenn ich schweige, kann Minka trotzdem weiterspielen.",
  "minka": "Erst wenn alle Stimmen gleichzeitig aussetzen, schweigen wir gemeinsam.",
  "pattern": [
   "q",
   "qr",
   "hr"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Lies im Bild beide Stimmen untereinander. Auf 1 spielen beide. Auf 2 schweigt Fuji, aber Minka spielt eine Viertelnote. Das ist eine Pause nur in Fujis Stimme.",
   "Auf 3 und 4 haben beide eine halbe Pause. Niemand spielt in diesem Beispiel. Das ist gemeinsames Schweigen; eine Generalpause betrifft alle Stimmen. Die Abkürzung G. P. kann darauf hinweisen.",
   "Hier ist die gemeinsame Stille durch die halben Pausen genau zwei Schläge lang. Beide zählen innerlich weiter. Im nächsten Takt setzen sie gemeinsam auf 1 ein. In anderen Stücken entscheidet die Notation über die Dauer."
  ],
  "mis": "„Generalpause heißt besonders lange Pause.“ Nein: Entscheidend ist, dass alle Stimmen gleichzeitig schweigen.",
  "rule": "Eine Stimme pausiert: Einzelpause. Alle schweigen gemeinsam: Generalpause.",
  "hints": [
   "Prüfe für jede Zählzeit beide Stimmen.",
   "Wenn auch nur eine Stimme klingt, schweigen nicht alle.",
   "Die Pausenwerte geben die Dauer; das Wort Generalpause beschreibt, wer schweigt."
  ],
  "model": "general",
  "topic": 1,
  "scene": "lesson-generalpause",
  "questions": [
   {
    "q": "Im Modell schweigen beide Stimmen …",
    "answer": "auf 3 und 4",
    "options": [
     "auf 3 und 4",
     "nur auf 2",
     "auf allen vier Schlägen"
    ],
    "ids": null,
    "m": 4,
    "why": "Minka spielt auf 2. Auf 3 und 4 schweigen beide; gemeinsame Stille zwei Schläge.",
    "meter": false
   },
   {
    "q": "Kind A pausiert auf 2, Kind B spielt: Generalpause?",
    "answer": "Nein: Eine Stimme spielt weiter",
    "options": [
     "Nein: Eine Stimme spielt weiter",
     "Ja: Jede Pause ist eine Generalpause",
     "Ja: Ein Schlag ist lang genug"
    ],
    "ids": null,
    "m": 4,
    "why": "Nein. Nur Kind A pausiert; Kind B klingt weiter. Es fehlt das gleichzeitige Schweigen aller Stimmen.",
    "meter": false
   },
   {
    "q": "Alle schweigen einen Schlag gemeinsam. Kann das eine Generalpause sein?",
    "answer": "Ja: Entscheidend ist, dass alle schweigen",
    "options": [
     "Ja: Entscheidend ist, dass alle schweigen",
     "Nein: Sie muss vier Schläge dauern",
     "Nein: Sie muss mindestens zwei Takte dauern"
    ],
    "ids": null,
    "m": 4,
    "why": "Ein Schlag gemeinsame Stille. Ja, auch eine kurze gemeinsame Pause kann eine Generalpause sein.",
    "meter": false
   }
  ]
 },
 {
  "key": "system",
  "title": "Notenlinien und Taktangabe lesen",
  "goal": "Ich finde die fünf Linien, die Taktangabe und die Grenzen eines Takts.",
  "fuji": "Ich suche zuerst die Zahlen am Anfang der Notenlinien.",
  "minka": "Wir lesen hier Rhythmus. Die gleichen Tonhöhen lenken uns nicht von den Zeitwerten ab.",
  "pattern": [
   "h",
   "q"
  ],
  "m": 3,
  "sub": 1,
  "steps": [
   "Ein Notensystem hat fünf Linien und vier Zwischenräume. Zähle die Linien von unten nach oben. Bei Melodien zeigen Kopfposition und Notenschlüssel die Tonhöhe; hier üben wir nur Dauern in einer Rhythmuszeile.",
   "Am Anfang steht die Taktangabe: 3 über 4. Oben steht die Zahl der Viertelschläge im vollständigen Takt: drei. Unten steht die 4 für die Viertelnote als Zähleinheit. Es bedeutet nicht vier Linien oder vier Noten.",
   "Der senkrechte Strich rechts begrenzt den Takt. Zwischen Anfang und diesem Strich stehen eine halbe und eine Viertelnote: zwei plus ein Schlag. Das füllt die drei geforderten Schläge."
  ],
  "mis": "„3/4 bedeutet drei von vier Noten.“ Nein: Oben wird die Zahl der Schläge angegeben, unten ihre Zähleinheit.",
  "rule": "Erst die Taktangabe lesen; dann die Zeitwerte zählen.",
  "hints": [
   "Zähle nur die waagerechten Linien; die senkrechte ist ein Taktstrich.",
   "Obere Zahl: Anzahl der Schläge. Untere 4: Viertel ist die Zähleinheit.",
   "Eine halbe Note braucht zwei Schläge, obwohl sie nur einen Kopf hat."
  ],
  "model": "system",
  "topic": 3,
  "scene": "lesson-system",
  "questions": [
   {
    "q": "Was bedeutet 3 über 4?",
    "answer": "3 Schläge; Viertel ist die Zähleinheit",
    "options": [
     "3 Schläge; Viertel ist die Zähleinheit",
     "3 Noten auf 4 Linien",
     "4 Schläge; Drittel ist die Zähleinheit"
    ],
    "ids": [
     "h",
     "q"
    ],
    "m": 3,
    "why": "Fünf Linien, vier Zwischenräume; oben drei Schläge, Viertel als Zähleinheit. 2 + 1 = 3.",
    "meter": true
   },
   {
    "q": "Muss jeder 4/4-Takt vier Notenköpfe haben?",
    "answer": "Nein: Zwei Halbe füllen ihn auch",
    "options": [
     "Nein: Zwei Halbe füllen ihn auch",
     "Ja: Oben steht die Zahl der Köpfe",
     "Nein: Er muss immer acht Köpfe haben"
    ],
    "ids": [
     "h",
     "h"
    ],
    "m": 4,
    "why": "Vier Viertelschläge pro vollständigem Takt. Nicht unbedingt vier Köpfe: Zwei halbe Noten füllen ihn ebenfalls.",
    "meter": true
   },
   {
    "q": "Ein Notensystem hat …",
    "answer": "5 Linien und 4 Zwischenräume",
    "options": [
     "5 Linien und 4 Zwischenräume",
     "4 Linien und 5 Zwischenräume",
     "3 Linien und 4 Zwischenräume"
    ],
    "ids": [
     "q",
     "q",
     "q"
    ],
    "m": 3,
    "why": "3 über 4 am linken Anfang; drei ovale ausgefüllte Köpfe innerhalb; senkrechter Taktstrich rechts.",
    "meter": true
   }
  ]
 },
 {
  "key": "dreiertakt",
  "title": "3/4: drei Schläge pro Takt",
  "goal": "Ich fülle und prüfe einen vollständigen 3/4-Takt, indem ich Dauern addiere.",
  "fuji": "Ich zähle 1, 2, 3 | 1, 2, 3. Die 1 darf sich etwas stärker anfühlen.",
  "minka": "Es müssen drei Schläge sein. Es können mehr oder weniger als drei Zeichen sein.",
  "pattern": [
   "h",
   "q"
  ],
  "m": 3,
  "sub": 1,
  "steps": [
   "Lies 3 über 4: drei Viertelschläge pro vollständigem Takt. Sprich 1, 2, 3 in gleichen Abständen. Die nächste 1 folgt ohne zusätzliche Wartezeit.",
   "Im Modell nimmt die halbe Note die Schläge 1 und 2 ein. Deshalb beginnt die Viertelnote erst auf 3. Rechne: 2 + 1 = 3. Zwei Notenköpfe reichen für drei Schläge.",
   "Ersetze die letzte Viertelnote durch eine Viertelpause. Die Summe bleibt 2 + 1 = 3. Es ist auf 3 still; der Takt bleibt vollständig. Pausen werden mitgerechnet."
  ],
  "mis": "„Ein 3/4-Takt braucht drei Zeichen.“ Nein: Entscheidend sind drei Schläge Gesamtdauer.",
  "rule": "3/4-Takt: Zeitwerte zusammen drei Viertelschläge.",
  "hints": [
   "Schreibe den Sollwert 3 auf.",
   "Eine halbe Note oder halbe Pause zählt zwei Schläge.",
   "Rechne Soll minus vorhandene Dauer: 3 - 2."
  ],
  "model": "timeline",
  "topic": 3,
  "scene": "lesson-dreiertakt",
  "questions": [
   {
    "q": "3/4: Halbe Note plus genau eine Note. Welche passt?",
    "answer": "Viertelnote",
    "options": [
     "Viertelnote",
     "Halbe Note",
     "Ganze Note"
    ],
    "ids": [
     "h",
     "?"
    ],
    "m": 3,
    "why": "Vorhanden zwei; es fehlt ein Schlag. Eine Viertelnote ergänzt 2 + 1 = 3. Sie beginnt auf 3.",
    "meter": true
   },
   {
    "q": "3/4: Zwei Achtel, Viertel, Viertelpause. Wann beginnt die Viertelnote?",
    "answer": "Auf 2",
    "options": [
     "Auf 2",
     "Auf dem und nach 1",
     "Auf 3"
    ],
    "ids": [
     "e",
     "e",
     "q",
     "qr"
    ],
    "m": 3,
    "why": "½ + ½ + 1 + 1 = 3 Schläge, vollständig. Die Viertelnote beginnt auf 2. Auf 3 liegt die Viertelpause.",
    "meter": true
   },
   {
    "q": "Halbe Pause und eine Note füllen 3/4. Welche Note passt?",
    "answer": "Viertelnote",
    "options": [
     "Viertelnote",
     "Halbe Note",
     "Achtelnote"
    ],
    "ids": [
     "hr",
     "?"
    ],
    "m": 3,
    "why": "Eine Viertelnote passt. Im Bild zuerst halbe Pause auf 1 und 2, danach Viertelnote auf 3. Andersherum wäre ebenfalls drei Schläge, klänge aber anders.",
    "meter": true
   }
  ]
 },
 {
  "key": "vierertakt",
  "title": "4/4: vier Schläge pro Takt",
  "goal": "Ich fülle einen 4/4-Takt und prüfe die Reihenfolge von Klang und Stille.",
  "fuji": "Vier Viertelschläge: 1, 2, 3, 4. Dann kommt die nächste 1.",
  "minka": "Halbe Note, Viertelpause, Viertelnote: drei Zeichen, aber vier Schläge.",
  "pattern": [
   "h",
   "qr",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Lies 4 über 4: vier Viertelschläge pro vollständigem Takt. Die untere 4 hat dieselbe Bedeutung wie im 3/4-Takt: Viertel ist unsere Zähleinheit.",
   "Die halbe Note beginnt auf 1 und hält über 2. Die Viertelpause beginnt auf 3. Die letzte Viertelnote beginnt auf 4. Addiere: 2 + 1 + 1 = 4.",
   "Prüfe anschließend die Ausführung: Singe über 1 und 2, bleibe auf 3 still, singe neu auf 4. Die Rechnung prüft die Taktlänge; Singen und Zählen prüfen, ob du das Muster richtig ausführst."
  ],
  "mis": "„Die Pause macht den Takt zu kurz.“ Nein: Sie hat einen Zeitwert und gehört in die Rechnung.",
  "rule": "4/4-Takt: vier Schläge, auch mit Pausen und langen Noten.",
  "hints": [
   "Zähle Pausen genauso zur Dauer wie Noten.",
   "Unterteile kurze Noten: Zwei Achtel zählen zusammen einen Schlag.",
   "Die ganze Note klingt vier Schläge; vier Viertelpausen bleiben vier Schläge still."
  ],
  "model": "timeline",
  "topic": 3,
  "scene": "lesson-vierertakt",
  "questions": [
   {
    "q": "4/4: Halbe Note, Viertelpause, Lücke. Welche Note fehlt?",
    "answer": "Viertelnote",
    "options": [
     "Viertelnote",
     "Halbe Note",
     "Achtelnote"
    ],
    "ids": [
     "h",
     "qr",
     "?"
    ],
    "m": 4,
    "why": "2 + 1 = 3, es fehlt ein Schlag. Viertelnote auf 4 ergänzt auf vier.",
    "meter": true
   },
   {
    "q": "4/4: Viertel, Viertelpause, zwei Achtel, Viertel. Was stimmt?",
    "answer": "Vollständig; Stille auf 2",
    "options": [
     "Vollständig; Stille auf 2",
     "Zu kurz; die Pause zählt nicht",
     "Vollständig; Stille auf 3"
    ],
    "ids": [
     "q",
     "qr",
     "e",
     "e",
     "q"
    ],
    "m": 4,
    "why": "Ja: 1 + 1 + ½ + ½ + 1 = 4. Tonanfänge auf 1, 3, dem und nach 3 und 4; Stille auf 2.",
    "meter": true
   },
   {
    "q": "Können vier Viertelpausen einen 4/4-Takt füllen?",
    "answer": "Ja: vier Schläge Stille",
    "options": [
     "Ja: vier Schläge Stille",
     "Nein: Ein Takt braucht immer einen Ton",
     "Nein: Pausen haben keinen Zeitwert"
    ],
    "ids": [
     "qr",
     "qr",
     "qr",
     "qr"
    ],
    "m": 4,
    "why": "Ja. Jede Viertelpause dauert einen Schlag. Vier Viertelpausen ergeben vier Schläge Stille und füllen den 4/4-Takt.",
    "meter": true
   }
  ]
 },
 {
  "key": "striche",
  "title": "Taktstriche: Grenzen ohne Extrazeit",
  "goal": "Ich unterscheide Taktstrich, Doppelstrich und Schlussstrich und gehe im Puls weiter.",
  "fuji": "Der Taktstrich ordnet die Schläge in Gruppen.",
  "minka": "Er verlangt keine Pause. Nach der 4 kommt gleich die nächste 1.",
  "pattern": [
   "q",
   "q",
   "q",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Ein einfacher Taktstrich ist eine dünne senkrechte Linie durch das System. Er trennt Takte. Ein Doppelstrich besteht aus zwei dünnen Linien und kann einen Abschnitt begrenzen.",
   "Der Schlussstrich besteht aus einer dünnen Linie links und einer dicken rechts. Er zeigt das Ende des Stücks. Keiner dieser Striche ist ein Noten- oder Pausenwert.",
   "Zwei 4/4-Takte mit je vier Viertelnoten dauern acht Schläge: 1, 2, 3, 4 | 1, 2, 3, 4. Zwischen 4 und 1 bleibt genau derselbe Schlagabstand wie sonst."
  ],
  "mis": "„Am Taktstrich muss ich einen Schlag warten.“ Nein: Zusätzliche Stille wäre eine Pause und müsste als Dauer notiert sein.",
  "rule": "Taktstriche ordnen Zeit. Sie fügen keine Zeit hinzu.",
  "hints": [
   "Zähle die Striche und prüfe ihre Dicke.",
   "Die Taktzahl mal die Schlagzahl ergibt die Gesamtzahl.",
   "Nur ein Pausenzeichen verlangt eine bestimmte Dauer Stille."
  ],
  "model": "barlines",
  "topic": 3,
  "scene": "lesson-striche",
  "questions": [
   {
    "q": "Zwei vollständige 4/4-Takte dauern …",
    "answer": "8 Schläge; Taktstriche zählen nicht mit",
    "options": [
     "8 Schläge; Taktstriche zählen nicht mit",
     "9 Schläge; am Strich warten",
     "4 Schläge insgesamt"
    ],
    "ids": null,
    "m": 4,
    "why": "Taktstrich; Doppelstrich; Schlussstrich. Zwei 4/4-Takte dauern acht Schläge. Die Trennlinie zählt nicht mit.",
    "meter": true
   },
   {
    "q": "Drei vollständige 3/4-Takte dauern …",
    "answer": "9 Schläge",
    "options": [
     "9 Schläge",
     "10 Schläge",
     "12 Schläge"
    ],
    "ids": null,
    "m": 4,
    "why": "Neun Schläge: 1 2 3 | 1 2 3 | 1 2 3. Gleichmäßig über die Striche weiterzählen.",
    "meter": true
   },
   {
    "q": "Dünne Linie links und dicke Linie rechts bedeutet …",
    "answer": "Schlussstrich; kein eigener Zeitwert",
    "options": [
     "Schlussstrich; kein eigener Zeitwert",
     "Generalpause; vier Schläge Stille",
     "Doppelstrich; ein extra Schlag"
    ],
    "ids": null,
    "m": 4,
    "why": "Vier Viertelnoten, rechts dünne und dann dicke Linie. Der Schlussstrich beendet das Stück; er hat keinen zusätzlichen Pausenwert.",
    "meter": true
   }
  ]
 },
 {
  "key": "woerter",
  "title": "Brot, Käse, Schokolade und Ananas",
  "goal": "Ich benutze die Wörter als Stütze für gleichmäßige Unterteilungen und übertrage sie auf Noten.",
  "fuji": "Brot, Käse, Schokolade und Ananas: Jede ganze Wortgruppe dauert hier einen Schlag. Ananas hat drei Tonanfänge.",
  "minka": "Brot hat einen, Käse zwei, Schokolade vier und Ananas drei Tonanfänge. Bei Ananas sind die ersten zwei ganz kurz, die letzte Silbe ist länger.",
  "pattern": [
   "q",
   "e",
   "e",
   "s",
   "s",
   "s",
   "s",
   "s",
   "s",
   "e"
  ],
  "m": 4,
  "sub": 4,
  "steps": [
   "Die Wortstütze ordnet die Silben: Brot = eine Viertelnote; Kä-se = zwei Achtelnoten; Scho-ko-la-de = vier Sechzehntelnoten; A-na-nas = zwei Sechzehntelnoten und eine Achtelnote. Alle vier Gruppen dauern jeweils genau einen Viertelschlag.",
   "Im Beispiel sagst du auf Schlag 1 Brot, auf Schlag 2 Kä-se, auf Schlag 3 Scho-ko-la-de und auf Schlag 4 A-na-nas. Nur gleich lange Noten werden gleich schnell gesprochen: Bei Ananas ist nas doppelt so lang wie A oder na.",
   "Zähle die Tonanfänge: 1 + 2 + 4 + 3 = 10. Die vier Wortgruppen dauern trotzdem zusammen nur vier Schläge. A-na-nas liegt auf 4, 4 e und 4 und; die letzte Silbe klingt über 4 a weiter."
  ],
  "mis": "„Mehr Silben bedeuten mehr Schläge.“ Nein: Jede Wortgruppe dauert einen Schlag. Bei Ananas dauern die Silben außerdem unterschiedlich lang.",
  "rule": "Die Wortgruppe füllt einen Schlag; ihre Silben zeigen die Unterteilung.",
  "hints": [
   "Trenne die Wörter mit Strichen in ganze Viertelschläge.",
   "Brot: 1 Viertel. Käse: 2 Achtel. Schokolade: 4 Sechzehntel. Ananas: 2 Sechzehntel plus 1 Achtel.",
   "Zähle die Silben für die Tonanfänge. Rechne die Notenwerte für die Dauer: Ananas = ¼ + ¼ + ½ Schlag."
  ],
  "model": "timeline",
  "topic": 4,
  "scene": "lesson-woerter",
  "questions": [
   {
    "q": "Brot | Kä-se | Brot | Brot ergibt …",
    "answer": "4 Schläge, 5 Tonanfänge",
    "options": [
     "4 Schläge, 5 Tonanfänge",
     "5 Schläge, 5 Tonanfänge",
     "4 Schläge, 4 Tonanfänge"
    ],
    "ids": [
     "q",
     "e",
     "e",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Zwei Achtel auf Schlag 2. Vier Schläge und fünf Tonanfänge: 1 + 2 + 1 + 1.",
    "meter": true
   },
   {
    "q": "Brot | Scho-ko-la-de | Kä-se ergibt …",
    "answer": "3 Schläge, 7 Tonanfänge",
    "options": [
     "3 Schläge, 7 Tonanfänge",
     "7 Schläge, 7 Tonanfänge",
     "3 Schläge, 3 Tonanfänge"
    ],
    "ids": [
     "q",
     "s",
     "s",
     "s",
     "s",
     "e",
     "e"
    ],
    "m": 3,
    "why": "Brot | Scho-ko-la-de | Kä-se. Drei Schläge und sieben Tonanfänge: 1 + 4 + 2.",
    "meter": true
   },
   {
    "q": "Kä-se | Brot | Scho-ko-la-de | Kä-se ergibt …",
    "answer": "4 Schläge, 9 Tonanfänge",
    "options": [
     "4 Schläge, 9 Tonanfänge",
     "9 Schläge, 4 Tonanfänge",
     "4 Schläge, 8 Tonanfänge"
    ],
    "ids": [
     "e",
     "e",
     "q",
     "s",
     "s",
     "s",
     "s",
     "e",
     "e"
    ],
    "m": 4,
    "why": "Zwei Achtel, Viertel, vier Sechzehntel, zwei Achtel. Vier Gruppen à ein Schlag; neun Tonanfänge.",
    "meter": true
   }
  ]
 },
 {
  "key": "zaehlen",
  "title": "Zählen zeigt die genaue Startstelle",
  "goal": "Ich ordne kurze Noten genau der Zahl oder einer Zwischenstelle zu.",
  "fuji": "Mein Fuß geht auf 1, 2, 3 und 4. Dazwischen kann ich kleinere Stellen zählen.",
  "minka": "Bei 1 e und a gibt es vier Teilzeiten. Die Zahl ist nur die erste davon.",
  "pattern": [
   "s",
   "s",
   "e",
   "q",
   "h"
  ],
  "m": 4,
  "sub": 4,
  "steps": [
   "Für Achtel teilst du einen Schlag in Zahl und und. Für Sechzehntel brauchst du vier gleich lange Stellen: Zahl, e, und, a. Das e ist hier eine Zählsilbe, kein Tonname.",
   "Im ersten Schlag des Modells beginnen Sechzehntel auf 1 und e. Die Achtel beginnt auf und und dauert über a weiter. Deshalb gibt es drei, nicht vier Tonanfänge.",
   "Die Viertelnote beginnt auf 2; die halbe auf 3 und hält über 4. Zähle weiter, auch wenn kein neuer Ton beginnt. Mehr Zählsilben bedeuten nicht automatisch mehr gespielte Töne."
  ],
  "mis": "„Auf jeder Zählsilbe muss ich einen Ton spielen.“ Nein: Einige Teilstellen gehören zu gehaltenen Tönen oder zu Pausen.",
  "rule": "Die Zählhilfe läuft durch. Nur am Beginn einer Note kommt ein neuer Ton.",
  "hints": [
   "Schreibe vier gleich große Teilfelder: 1 | e | und | a.",
   "Eine Achtel belegt zwei Sechzehntel-Teilfelder.",
   "Ein neues Zeichen startet erst nach dem vollständigen Wert des vorherigen."
  ],
  "model": "timeline",
  "topic": 4,
  "scene": "lesson-zaehlen",
  "questions": [
   {
    "q": "Sechzehntel, Sechzehntel, Achtel in einem Schlag: Startstellen?",
    "answer": "1, e, und; auf a weiterhalten",
    "options": [
     "1, e, und; auf a weiterhalten",
     "1, und, a; auf e weiterhalten",
     "1, 2, 3; auf 4 weiterhalten"
    ],
    "ids": [
     "s",
     "s",
     "e"
    ],
    "m": 4,
    "why": "Zweites Sechzehntel auf e; Achtel auf und, halten über a. ¼ + ¼ + ½ = 1 Schlag.",
    "meter": false
   },
   {
    "q": "Achtel, Sechzehntel, Sechzehntel: Startstellen?",
    "answer": "1, und, a; auf e weiterhalten",
    "options": [
     "1, und, a; auf e weiterhalten",
     "1, e, und; auf a weiterhalten",
     "1, e, a; auf und still"
    ],
    "ids": [
     "e",
     "s",
     "s"
    ],
    "m": 4,
    "why": "Achtel auf 1, Sechzehntel auf und, Sechzehntel auf a. Die Teilstelle e gehört noch zur Achtelnote.",
    "meter": false
   },
   {
    "q": "Bei zwei Achteln musst du auf e und a …",
    "answer": "den vorherigen Ton weiterhalten",
    "options": [
     "den vorherigen Ton weiterhalten",
     "zwei neue Töne spielen",
     "immer still bleiben"
    ],
    "ids": [
     "e",
     "e"
    ],
    "m": 4,
    "why": "Achtel auf 1 und auf und. Auf e und a beginnt kein neuer Ton; dort dauert jeweils die vorherige Achtel weiter.",
    "meter": false
   }
  ]
 },
 {
  "key": "luecken",
  "title": "Eine Lücke im Takt sicher ergänzen",
  "goal": "Ich finde den fehlenden Zeitwert mit Sollwert, vorhandener Dauer und Differenz.",
  "fuji": "Ich rate nicht nach der Größe der Lücke. Ich rechne mit der Taktangabe.",
  "minka": "Erst wie viel Zeit fehlt, dann welches Zeichen diese Zeit füllt.",
  "pattern": [
   "q",
   "e",
   "e",
   "?"
  ],
  "m": 4,
  "sub": 2,
  "steps": [
   "Schritt 1: Lies 4/4. Der vollständige Takt soll vier Schläge haben. Schritt 2: Zähle nur die bereits gegebenen Werte: Viertel 1, zwei Achtel zusammen 1. Vorhanden sind also zwei Schläge.",
   "Schritt 3: Rechne 4 - 2 = 2. Gesucht ist hier genau eine Note mit zwei Schlägen: eine halbe Note. Sie beginnt auf 3 und hält über 4.",
   "Kontrolle: 1 + ½ + ½ + 2 = 4. Singe oder spiele die fertige Folge mit durchgehendem Puls. Die Rechnung prüft die Länge; die Ausführung prüft Startstellen und Halten. Beides gehört zusammen."
  ],
  "mis": "„Eine große Lücke verlangt eine große Note.“ Der Abstand im Druck ist keine zuverlässige Dauerangabe. Entscheidend ist die Rechnung.",
  "rule": "Soll - vorhanden = fehlende Dauer. Danach ein passendes Zeichen wählen.",
  "hints": [
   "Lies zuerst die obere Zahl der Taktangabe.",
   "Zähle die gegebenen Pausen mit; das Fragezeichen zählt noch nicht.",
   "A: 4 - 2. B: 3 - (1 + 1). A verlangt Klang, B ausdrücklich Stille."
  ],
  "model": "timeline",
  "topic": 3,
  "scene": "lesson-luecken",
  "questions": [
   {
    "q": "3/4: Viertel, Lücke, Viertelpause. Welche Note fehlt?",
    "answer": "Viertelnote",
    "options": [
     "Viertelnote",
     "Halbe Note",
     "Achtelnote"
    ],
    "ids": [
     "q",
     "?",
     "qr"
    ],
    "m": 3,
    "why": "Soll 3; vorhanden 1 + 1 = 2; fehlt 1. Eine Viertelnote in der Mitte. 1 + 1 + 1 = 3.",
    "meter": true
   },
   {
    "q": "4/4: Halbe Note, Lücke. Welche einzelne Note passt?",
    "answer": "Halbe Note",
    "options": [
     "Halbe Note",
     "Viertelnote",
     "Ganze Note"
    ],
    "ids": [
     "h",
     "?"
    ],
    "m": 4,
    "why": "Eine halbe Note fehlt: 4 - 2 = 2. Sie beginnt auf 3, hält über 4. Zwei halbe Noten ergeben vier Schläge.",
    "meter": true
   },
   {
    "q": "3/4: Zwei Viertel, Lücke für eine Pause. Was passt?",
    "answer": "Viertelpause auf 3",
    "options": [
     "Viertelpause auf 3",
     "Halbe Pause auf 3",
     "Achtelpause auf 2"
    ],
    "ids": [
     "q",
     "q",
     "?"
    ],
    "m": 3,
    "why": "Eine Viertelpause fehlt: 3 - 2 = 1. Sie beginnt auf 3. Der Takt hat zwei Schläge Klang und einen Schlag Stille.",
    "meter": true
   }
  ]
 },
 {
  "key": "fehler",
  "title": "Takt-Detektive: zu kurz, passend, zu lang",
  "goal": "Ich beurteile vollständige Übungstakte mit einer Rechnung und verbessere einen Fehler.",
  "fuji": "Ein Takt kann ordentlich aussehen und trotzdem die falsche Summe haben.",
  "minka": "Wir prüfen hier vollständige Takte ohne Auftakt: genau die geforderte Schlagzahl.",
  "pattern": [
   "h",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Im Modell steht 4/4, also sollen vier Schläge enthalten sein. Eine halbe plus eine Viertelnote ergeben nur 2 + 1 = 3. Es fehlt ein Schlag.",
   "Zur Verbesserung kannst du eine Viertelnote hinzufügen: 2 + 1 + 1 = 4. Oder verlängere die Viertel zur halben Note: 2 + 2 = 4. Beides passt zeitlich, klingt aber unterschiedlich.",
   "Prüfregel: Summe kleiner als Soll = zu kurz; gleich = passend; größer = zu lang. Die Pausen zählen mit. Zum Beispiel halbe + halbe + Viertelpause: 2 + 2 + 1 = 5, also ein Schlag zu lang."
  ],
  "mis": "„Viele Zeichen heißt zu lang.“ Nicht unbedingt: Acht Achtel passen in 4/4. Rechne die Werte, nicht die Zeichen.",
  "rule": "Für vollständige Übungstakte zählt die Summe aller Noten und Pausen.",
  "hints": [
   "Lies die Taktart für jede Aufgabe neu.",
   "Pausen geben genauso Zeit wie Noten.",
   "Bei B stehen 2 + 2 Schläge; gebraucht werden nur 3. Prüfe, ob bloßes Weglassen wirklich genügt."
  ],
  "model": "errors",
  "topic": 3,
  "scene": "lesson-fehler",
  "questions": [
   {
    "q": "3/4: Viertel und Viertelpause. Was fehlt?",
    "answer": "1 Schlag",
    "options": [
     "1 Schlag",
     "2 Schläge",
     "Nichts"
    ],
    "ids": [
     "q",
     "qr"
    ],
    "m": 3,
    "why": "Summe 2; Soll 3; ein Schlag fehlt. Viertelnote ergänzt 1 + 1 + 1 = 3.",
    "meter": true
   },
   {
    "q": "4/4: Halbe, Viertel, Viertelpause. Ist er vollständig?",
    "answer": "Ja: 2 + 1 + 1 = 4",
    "options": [
     "Ja: 2 + 1 + 1 = 4",
     "Nein: 2 + 1 = 3",
     "Nein: Drei Zeichen können keinen 4/4-Takt füllen"
    ],
    "ids": [
     "h",
     "q",
     "qr"
    ],
    "m": 4,
    "why": "Passend: 2 + 1 + 1 = 4. Drei Zeichen, aber vier Schläge. Die Viertelpause ist der letzte Schlag.",
    "meter": true
   },
   {
    "q": "Zwei Halbe im 3/4-Takt: Welche Verbesserung passt?",
    "answer": "Eine Halbe zur Viertelnote ändern",
    "options": [
     "Eine Halbe zur Viertelnote ändern",
     "Eine Halbe einfach weglassen",
     "Eine Viertelpause hinzufügen"
    ],
    "ids": [
     "h",
     "h"
    ],
    "m": 3,
    "why": "2 + 2 = 4, ein Schlag zu viel. Nur Weglassen eines Zeichens ist hier unmöglich: Dann blieben zwei Schläge. Ändere stattdessen eine halbe zur Viertelnote: 2 + 1 = 3.",
    "meter": true
   }
  ]
 },
 {
  "key": "verboten",
  "title": "Das Spiel: der verbotene Rhythmus",
  "goal": "Ich vergleiche ein Muster genau und unterscheide die Spielregel von einem Taktfehler.",
  "fuji": "Muster V ist musikalisch richtig. Nur im Spiel klatschen wir genau dieses Muster nicht nach.",
  "minka": "Eine Pause an anderer Stelle macht einen anderen Rhythmus, auch bei gleicher Taktlänge.",
  "pattern": [
   "q",
   "qr",
   "q",
   "q"
  ],
  "m": 4,
  "sub": 1,
  "steps": [
   "Merke Muster V: Ton auf 1, Stille auf 2, Töne auf 3 und 4. Die Leitung spielt einen vollständigen Takt vor. Erst im folgenden Antworttakt reagieren wir.",
   "Ist das vorgespielte Muster genau V, bleiben wir im ganzen Antworttakt still. Bei einem anderen Muster klatschen wir es im Antworttakt nach, einschließlich seiner stillen Stellen. Wir reden nicht mitten in der Pause.",
   "Zum Vergleich: Ton auf 1 und 2, Stille auf 3, Ton auf 4 ist ein anderes Muster. Beide Takte dauern vier Schläge; die Pausen liegen anders. „Verboten“ ist nur die vorher vereinbarte Spielregel, kein musikalischer Fehler."
  ],
  "mis": "„Alle Takte mit Pausen sind verboten.“ Nein: Nur das genaue vereinbarte Muster V ist im Spiel tabu.",
  "rule": "Gleiche Dauer reicht nicht. Vergleiche Startstellen, Dauern und Pausen.",
  "hints": [
   "Lerne V erst langsam: 1 Klang, 2 still, 3 Klang, 4 Klang.",
   "Vergleiche jede Zählzeit der beiden Muster.",
   "Bei genauer Übereinstimmung ist der ganze Antworttakt still, nicht nur die Pause in V."
  ],
  "model": "timeline",
  "topic": 4,
  "scene": "lesson-verboten",
  "questions": [
   {
    "q": "V hat die Pause auf 2. Das gleiche Muster wird gespielt. Was tust du danach?",
    "answer": "Im ganzen Antworttakt schweigen",
    "options": [
     "Im ganzen Antworttakt schweigen",
     "Nur auf 2 schweigen und sonst klatschen",
     "Immer nachklatschen"
    ],
    "ids": [
     "q",
     "qr",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Pause auf 2; genau gleich. Im gesamten Antworttakt schweigen. Muster V selbst ist ein korrekter 4/4-Takt.",
    "meter": true
   },
   {
    "q": "A hat die Pause auf 3 statt auf 2. Ist A genau das Merkmuster V?",
    "answer": "Nein: Im Antworttakt auf 1, 2 und 4 klatschen",
    "options": [
     "Nein: Im Antworttakt auf 1, 2 und 4 klatschen",
     "Ja: Im ganzen Antworttakt schweigen",
     "Nein: A ist deshalb ein Taktfehler"
    ],
    "ids": [
     "q",
     "q",
     "qr",
     "q"
    ],
    "m": 4,
    "why": "Anderes Muster, Pause auf 3 statt 2. Im Antworttakt nachklatschen: auf 1, 2 und 4; auf 3 still bleiben.",
    "meter": true
   },
   {
    "q": "B ist genau V: Töne auf 1, 3 und 4. Was stimmt?",
    "answer": "Zeitlich richtig; im Antworttakt schweigen",
    "options": [
     "Zeitlich richtig; im Antworttakt schweigen",
     "Zeitlich falsch; im Antworttakt klatschen",
     "Zeitlich richtig; im Antworttakt klatschen"
    ],
    "ids": [
     "q",
     "qr",
     "q",
     "q"
    ],
    "m": 4,
    "why": "Genau V. Tonanfänge auf 1, 3 und 4. Daher im gesamten Antworttakt schweigen.",
    "meter": true
   }
  ]
 },
 {
  "key": "punkt",
  "title": "Der Verlängerungspunkt: Hälfte dazu",
  "goal": "Ich berechne einen punktierten Wert mit Grundwert plus halbem Grundwert.",
  "fuji": "Der kleine Punkt rechts neben dem Kopf verlängert die Note.",
  "minka": "Er verdoppelt sie nicht! Ich nehme nur die Hälfte des ursprünglichen Werts dazu.",
  "pattern": [
   "hd"
  ],
  "m": 3,
  "sub": 1,
  "steps": [
   "Eine halbe Note dauert zwei Schläge. Halbiere zuerst diesen Grundwert: Die Hälfte von zwei ist eins. Der Punkt fügt genau diesen einen Schlag hinzu.",
   "Rechnung: 2 + 1 = 3. Eine punktierte halbe Note dauert also drei Schläge und beginnt nur einmal. Singe auf 1, halte über 2 und 3 bis zum Taktende.",
   "Wende dieselbe Regel auf eine Viertelnote an: Grundwert 1, Hälfte ½, zusammen 1½. Auf eine Achtel: ½ + ¼ = ¾. Ein Punkt über oder unter dem Kopf kann ein anderes Zeichen sein; hier geht es um den Punkt rechts daneben."
  ],
  "mis": "„Der Punkt bedeutet immer einen zusätzlichen Schlag.“ Nein: Der Zusatz hängt vom Grundwert ab. Nur bei der Halben ist es ein ganzer Schlag.",
  "rule": "Punktierter Wert = Grundwert + die Hälfte dieses Grundwerts.",
  "hints": [
   "Bestimme erst den Wert ohne Punkt.",
   "Halbiere diesen Wert, nicht die Zahl der Köpfe.",
   "Der Punkt addiert die Hälfte, nicht noch einmal den ganzen Grundwert."
  ],
  "model": "dotrule",
  "topic": 5,
  "scene": "lesson-punkt",
  "questions": [
   {
    "q": "Eine punktierte Halbe dauert …",
    "answer": "3 Schläge: 2 + 1",
    "options": [
     "3 Schläge: 2 + 1",
     "4 Schläge: 2 + 2",
     "2½ Schläge: 2 + ½"
    ],
    "ids": [
     "hd"
    ],
    "m": 3,
    "why": "Halbe 2, Hälfte 1, Summe 3. Viertel 1 + ½ = 1½. Ein Punkt fügt bei unterschiedlichen Grundwerten unterschiedlich viel Zeit hinzu.",
    "meter": false
   },
   {
    "q": "Eine punktierte Achtel dauert …",
    "answer": "¾ Schlag: ½ + ¼",
    "options": [
     "¾ Schlag: ½ + ¼",
     "1 Schlag: ½ + ½",
     "1½ Schläge: 1 + ½"
    ],
    "ids": [
     "ed"
    ],
    "m": 3,
    "why": "Achtel ½, Hälfte davon ¼; ½ + ¼ = ¾ Schlag. Das sind drei Sechzehntel-Teilzeiten.",
    "meter": false
   },
   {
    "q": "Eine punktierte Viertel dauert …",
    "answer": "1½ Schläge: 1 + ½",
    "options": [
     "1½ Schläge: 1 + ½",
     "2 Schläge: 1 + 1",
     "½ Schlag: 1 - ½"
    ],
    "ids": [
     "qd"
    ],
    "m": 3,
    "why": "Richtig ist 1 + ½ = 1½. Zwei Schläge wären 1 + 1, also eine Verdopplung; das macht der Punkt nicht.",
    "meter": false
   }
  ]
 },
 {
  "key": "punkt-im-takt",
  "title": "Punktierte Halbe und Viertel im Takt",
  "goal": "Ich setze nach einer punktierten Note an der richtigen Zählstelle wieder ein.",
  "fuji": "Eine punktierte Halbe hält drei Schläge. Im 3/4-Takt passt sie allein.",
  "minka": "Bei punktierter Viertel plus Achtel ist lang wirklich dreimal so lang wie kurz.",
  "pattern": [
   "qd",
   "e",
   "h"
  ],
  "m": 4,
  "sub": 2,
  "steps": [
   "Zur Erinnerung: Punktierte Halbe = 3 Schläge. Im 4/4-Takt bleibt danach ein Schlag; eine Viertelnote kann auf 4 beginnen. Im 3/4-Takt füllt die punktierte Halbe den ganzen Takt.",
   "Im Modell beginnt die punktierte Viertelnote auf 1. Zähle 1 und 2 und: Sie klingt durch die ersten drei halben Teilzeiten, also auf 1, auf dem und nach 1 und auf 2.",
   "Die Achtelnote beginnt erst auf dem und nach 2. Sie füllt die vierte halbe Teilzeit. Danach beginnt auf 3 die halbe Note und hält über 4. Rechnung: 1½ + ½ + 2 = 4."
  ],
  "mis": "„Die Achtel folgt auf 2.“ Zu früh: Die punktierte Viertel klingt auf 2 noch. Die Achtel beginnt auf dem und danach.",
  "rule": "Punktierte Viertel + Achtel: drei halbe Teile lang, ein halber Teil kurz.",
  "hints": [
   "Nutze bei der punktierten Viertel Achtel-Teilzeiten: Zahl und Zahl und.",
   "Eine punktierte Viertel belegt drei halbe Teilzeiten.",
   "Nach 1½ + ½ sind zwei Schläge vorbei; die nächste Note beginnt auf 3."
  ],
  "model": "timeline",
  "topic": 5,
  "scene": "lesson-punkt-im-takt",
  "questions": [
   {
    "q": "4/4: Punktierte Halbe und eine Note. Was passt?",
    "answer": "Viertelnote auf 4",
    "options": [
     "Viertelnote auf 4",
     "Viertelnote auf 3",
     "Achtelnote auf 4"
    ],
    "ids": [
     "hd",
     "?"
    ],
    "m": 4,
    "why": "Drei Schläge vorhanden, einer fehlt. Viertelnote auf 4. 3 + 1 = 4.",
    "meter": true
   },
   {
    "q": "3/4: Punktierte Viertel, Achtel, Lücke. Welche Note fehlt?",
    "answer": "Viertelnote auf 3",
    "options": [
     "Viertelnote auf 3",
     "Halbe Note auf 3",
     "Achtelnote auf 2"
    ],
    "ids": [
     "qd",
     "e",
     "?"
    ],
    "m": 3,
    "why": "3 - (1½ + ½) = 1. Viertelnote auf 3. Vorher beginnt die Achtel auf dem und nach 2.",
    "meter": true
   },
   {
    "q": "Im Modell: Wann beginnt die Achtel nach der punktierten Viertel?",
    "answer": "Auf dem und nach 2",
    "options": [
     "Auf dem und nach 2",
     "Auf 2",
     "Auf dem und nach 1"
    ],
    "ids": [
     "qd",
     "e",
     "h"
    ],
    "m": 4,
    "why": "Die punktierte Viertel belegt drei Achtel-Teilzeiten: 1, und nach 1, 2. Erst auf und nach 2 beginnt die Achtel.",
    "meter": true
   }
  ]
 },
 {
  "key": "punktierte-achtel",
  "title": "Punktierte Achtel und punktierte Pause",
  "goal": "Ich führe drei kurze Teilzeiten als zusammenhängenden Klang oder als Stille aus.",
  "fuji": "Punktierte Achtel: ½ + ¼ = ¾ Schlag. Danach passt ein Sechzehntel.",
  "minka": "Auch eine Pause kann einen Verlängerungspunkt haben. Dann wird ihre Stille länger.",
  "pattern": [
   "ed",
   "s",
   "q",
   "h"
  ],
  "m": 4,
  "sub": 4,
  "steps": [
   "Teile Schlag 1 in 1 e und a. Die punktierte Achtel beginnt auf 1 und hält über e und und. Sie dauert drei Sechzehntel-Teilzeiten. Erst auf a beginnt die Sechzehntelnote.",
   "Rechne: ¾ + ¼ = 1. Die Viertelnote im Modell beginnt auf 2, die halbe Note auf 3. Innerhalb des ersten Schlags gibt es nur zwei Tonanfänge: auf 1 und a.",
   "Bei einer punktierten Pause gilt dieselbe Regel. Eine punktierte Achtelpause bedeutet auf 1, e und und Stille; ein anschließendes Sechzehntel klingt auf a. In Noten werden Pausen manchmal aufgeteilt, um die Zählzeiten deutlicher zu zeigen."
  ],
  "mis": "„Punktierte Achtel und Sechzehntel sind zwei gleich lange Töne.“ Nein: Die erste dauert drei Teilzeiten, die zweite eine.",
  "rule": "Punktierte Achtel + Sechzehntel: 3 + 1 Sechzehntel-Teile = ein Schlag.",
  "hints": [
   "Halbiere zuerst die Achtel: ihre Hälfte ist ein Sechzehntel.",
   "Lege für die lange Stelle drei der vier Teilfelder zusammen.",
   "Der Punkt ändert die Dauer. Note bleibt Klang, Pause bleibt Stille."
  ],
  "model": "timeline",
  "topic": 5,
  "scene": "lesson-punktierte-achtel",
  "questions": [
   {
    "q": "Punktierte Achtel plus Sechzehntel: Startstellen?",
    "answer": "1 und a",
    "options": [
     "1 und a",
     "1 und und",
     "1 und e"
    ],
    "ids": [
     "ed",
     "s"
    ],
    "m": 4,
    "why": "Start auf 1; halten über e und und; kurzer Ton auf a. ¾ + ¼ = 1 Schlag. Zwei Tonanfänge.",
    "meter": false
   },
   {
    "q": "Punktierte Achtelpause plus Sechzehntel: Was stimmt?",
    "answer": "Still auf 1, e und und; Ton auf a",
    "options": [
     "Still auf 1, e und und; Ton auf a",
     "Ton auf 1; still auf a",
     "Still auf 1; Ton auf e"
    ],
    "ids": [
     "erd",
     "s"
    ],
    "m": 4,
    "why": "Stille auf 1, e und und. Sechzehntel-Tonanfang auf a. Zusammen ein Schlag; nur ein Tonanfang.",
    "meter": false
   },
   {
    "q": "Eine punktierte Viertelpause dauert …",
    "answer": "1½ Schläge Stille",
    "options": [
     "1½ Schläge Stille",
     "2 Schläge Stille",
     "1½ Schläge Klang"
    ],
    "ids": [
     "qrd"
    ],
    "m": 4,
    "why": "1 + ½ = 1½ Schläge Stille. Die punktierte Viertelnote dauert genauso lange, klingt aber durchgehend.",
    "meter": false
   }
  ]
 },
 {
  "key": "abschluss",
  "title": "Unser vier Takte langes Rhythmusstück",
  "goal": "Ich verbinde Taktprüfung, richtige Startstellen, Halten und Pausen zu einer Aufführung.",
  "fuji": "Wir proben erst jeden Takt einzeln. Danach verbinden wir sie im gleichen Puls.",
  "minka": "Bei Schwierigkeiten gehen wir zum passenden Lernschritt zurück. Das ist eine gute Übestrategie.",
  "pattern": [
   "q",
   "e",
   "e",
   "q",
   "q"
  ],
  "m": 4,
  "sub": 2,
  "steps": [
   "Takt 1: Viertel, zwei Achtel, Viertel, Viertel. Sprich Brot | Kä-se | Brot | Brot. Takt 2: Viertel, Viertelpause, Halbe. Auf 2 still, auf 3 beginnen und über 4 halten.",
   "Takt 3: Punktierte Viertel, Achtel, Halbe. Startstellen 1, und nach 2, 3. Takt 4: Halbe, Viertelnote, Lücke. Rechne 4 - (2 + 1) = 1; ergänze eine Viertelnote auf 4.",
   "Probe in vier Durchgängen: Zeitwerte prüfen; Zählstellen sprechen; singend Klang und Stille zeigen; klatschen oder spielen. Beim Klatschen markieren wir nur Tonanfänge: Der kurze Klatschklang allein zeigt lange Tondauern nicht zuverlässig."
  ],
  "mis": "„Ich muss alles sofort im schnellen Tempo schaffen.“ Übe langsam und richtig. Verbinde erst zwei Takte, dann vier.",
  "rule": "Erst verstehen und zählen, dann ausführen, zuletzt ohne Hilfen spielen.",
  "hints": [
   "Jeder der vier vollständigen Takte soll vier Schläge haben.",
   "In Takt 4 sind 2 + 1 = 3 Schläge vorhanden.",
   "Punktierte Viertel hält drei Achtel-Teilzeiten; die folgende Achtel beginnt auf und nach 2."
  ],
  "model": "piece",
  "topic": 4,
  "scene": "lesson-abschluss",
  "questions": [
   {
    "q": "Takt 2: Viertel, Viertelpause, Halbe. Was geschieht auf 4?",
    "answer": "Ton von 3 weiterhalten",
    "options": [
     "Ton von 3 weiterhalten",
     "Still bleiben",
     "Neuen Ton beginnen"
    ],
    "ids": [
     "q",
     "qr",
     "h"
    ],
    "m": 4,
    "why": "Die halbe Note beginnt auf 3 und klingt über 4. Auf 4 gibt es weder Pause noch neuen Tonanfang.",
    "meter": true
   },
   {
    "q": "Vier vollständige 4/4-Takte dauern …",
    "answer": "16 Schläge",
    "options": [
     "16 Schläge",
     "17 Schläge",
     "12 Schläge"
    ],
    "ids": null,
    "m": 4,
    "why": "Viertelnote in die Lücke, Beginn auf 4. Gesamtes Stück: 4 × 4 = 16 Schläge. Der Taktstrich gibt keine zusätzliche Zeit.",
    "meter": true
   },
   {
    "q": "Takt 3: Punktierte Viertel, Achtel, Halbe. Startstellen?",
    "answer": "1, und nach 2, 3",
    "options": [
     "1, und nach 2, 3",
     "1, 2, 3",
     "1, und nach 1, 3"
    ],
    "ids": [
     "qd",
     "e",
     "h"
    ],
    "m": 4,
    "why": "Auf 1, und nach 2 und 3. Am Übergang zwischen Takt 2 und 3 bleibt der Abstand bis zur nächsten 1 im gleichen Puls.",
    "meter": true
   }
  ]
 }
];
