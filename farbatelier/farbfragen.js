const fragen = [
  {
    "q": "Welche drei Farben sind im Farbkreis nach Itten die Primärfarben?",
    "a": [
      "Rot, Gelb und Blau",
      "Rot, Grün und Blau",
      "Orange, Grün und Violett",
      "Gelb, Grün und Blau"
    ],
    "k": 0,
    "topic": "Farbkreis",
    "skill": "Grundfarben",
    "why": "Gelb, Rot und Blau bilden bei Itten die erste Stufe. Aus je zwei davon entstehen die drei Sekundärfarben."
  },
  {
    "q": "Du hast Gelb und Rot im Malkasten. Welche Sekundärfarbe kannst du damit mischen?",
    "a": [
      "Grün",
      "Violett",
      "Orange",
      "Blau"
    ],
    "k": 2,
    "topic": "Mischen",
    "skill": "Grundmischung",
    "why": "Vom gelben Feld bis zum roten liegt Orange in der Mitte. Probiere zuerst gleich große Portionen."
  },
  {
    "q": "Auf deiner Palette fehlt Grün. Welche beiden Primärfarben brauchst du nach Itten?",
    "a": [
      "Rot und Gelb",
      "Gelb und Blau",
      "Blau und Rot",
      "Rot und Weiß"
    ],
    "k": 1,
    "topic": "Mischen",
    "skill": "Grundmischung",
    "why": "Folge dem kurzen Weg von Gelb zu Blau. In seiner Mitte liegt Grün."
  },
  {
    "q": "Welche Reihe enthält nur Sekundärfarben aus Ittens Farbkreis?",
    "a": [
      "Gelb, Grün, Blau",
      "Rot, Orange, Violett",
      "Gelborange, Gelbgrün, Blaugrün",
      "Orange, Grün, Violett"
    ],
    "k": 3,
    "topic": "Farbkreis",
    "skill": "Grundfarben",
    "why": "Orange, Grün und Violett liegen jeweils zwischen den zwei Grundfarben, aus denen sie entstehen."
  },
  {
    "q": "Im zwölfteiligen Farbkreis ist das Feld zwischen Gelb und Orange leer. Was gehört hinein?",
    "a": [
      "Rotorange",
      "Gelborange",
      "Gelbgrün",
      "Rotviolett"
    ],
    "k": 1,
    "topic": "Farbkreis",
    "skill": "Nachbarn",
    "why": "Lies die Namen der Nachbarn zusammen. Zwischen Gelb und Orange liegt Gelb-Orange."
  },
  {
    "q": "Wie mischst du Blauviolett aus zwei Nachbarfarben dieses Feldes?",
    "a": [
      "Blau und Grün",
      "Rot und Violett",
      "Blau und Violett",
      "Blau und Orange"
    ],
    "k": 2,
    "topic": "Mischen",
    "skill": "Grundmischung",
    "why": "Im Itten-Kreis liegt Blau-Violett genau zwischen Blau und Violett."
  },
  {
    "q": "Warum zählt Gelbgrün in Ittens zwölfteiligem Farbkreis zu den Tertiärfarben?",
    "a": [
      "Es liegt Gelb genau gegenüber.",
      "Es entsteht aus zwei Primärfarben.",
      "Es enthält immer drei gleiche Farbanteile.",
      "Es entsteht aus Gelb und der Nachbarfarbe Grün."
    ],
    "k": 3,
    "topic": "Farbkreis",
    "skill": "Nachbarn",
    "why": "Gelb ist eine Grundfarbe, Grün eine Sekundärfarbe. Ihre gemeinsame Nachbarfarbe ist Gelb-Grün."
  },
  {
    "q": "Wie findest du im Farbkreis die Komplementärfarbe zu einem Farbton?",
    "a": [
      "Ich gehe durch die Mitte bis zur Gegenseite.",
      "Ich gehe ein Feld nach rechts.",
      "Ich wähle die hellste Farbe.",
      "Ich gehe ein Feld nach links."
    ],
    "k": 0,
    "topic": "Farbkreis",
    "skill": "Gegenfarben",
    "why": "Ziehe vom Startfeld eine gerade Linie durch die Kreismitte. Sechs Felder weiter triffst du die Gegenfarbe.",
    "axis": 0
  },
  {
    "q": "Welches Paar liegt sich in Ittens Farbkreis gegenüber?",
    "a": [
      "Rot und Orange",
      "Gelb und Grün",
      "Blau und Orange",
      "Violett und Blau"
    ],
    "k": 2,
    "topic": "Farbkreis",
    "skill": "Gegenfarben",
    "why": "Von Orange führt die gerade Linie durch die Kreismitte nach Blau.",
    "axis": 2
  },
  {
    "q": "Eine gelbe Sonne soll sich durch Komplementärkontrast abheben. Welcher Himmel passt?",
    "a": [
      "Violett",
      "Orange",
      "Gelborange",
      "Gelbgrün"
    ],
    "k": 0,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Violett liegt Gelb gegenüber. Berühren sich violetter Himmel und gelbe Sonne, wird ihr Unterschied gut sichtbar.",
    "axis": 0
  },
  {
    "q": "Welche Farbe liegt Rot im Farbkreis nach Itten gegenüber?",
    "a": [
      "Blau",
      "Grün",
      "Gelb",
      "Violett"
    ],
    "k": 1,
    "topic": "Farbkreis",
    "skill": "Gegenfarben",
    "why": "Gehe von Rot sechs Felder weiter. Du landest auf Grün.",
    "axis": 4
  },
  {
    "q": "Ein Blatt ist zu knallig grün. Welche Zugabe dämpft das Grün durch seine Gegenfarbe?",
    "a": [
      "Etwas Gelb",
      "Etwas Blau",
      "Etwas Weiß",
      "Etwas Rot"
    ],
    "k": 3,
    "topic": "Mischen",
    "skill": "Trüben",
    "why": "Rot liegt Grün gegenüber. Eine kleine Zugabe lässt das Grün weniger kräftig wirken.",
    "axis": 10
  },
  {
    "q": "Wie findest du beim Mischen ein leicht gedämpftes Orange?",
    "a": [
      "Gib sofort gleich viel Blau dazu.",
      "Gib Blau in kleinen Schritten dazu und vergleiche.",
      "Mische Gelb und Weiß zu gleichen Teilen.",
      "Male daneben einen blauen Punkt."
    ],
    "k": 1,
    "topic": "Mischen",
    "skill": "Trüben",
    "why": "Blau ist die Gegenfarbe zu Orange. Kleine Zugaben helfen, den gewünschten Grad der Trübung zu treffen.",
    "axis": 2
  },
  {
    "q": "Was passiert meist, wenn du komplementäre Malfarben gründlich vermischst?",
    "a": [
      "Beide Töne leuchten stärker.",
      "Es entsteht reines Weiß.",
      "Es entsteht ein gedämpfter, oft bräunlicher Ton.",
      "Die Mischung wird zur hellsten Primärfarbe."
    ],
    "k": 2,
    "topic": "Mischen",
    "skill": "Trüben",
    "why": "Beim Vermischen verlieren die Gegenfarben an Leuchtkraft. Der genaue Ton hängt von Pigmenten und Mengen ab."
  },
  {
    "q": "Zwei kräftige Gegenfarben sollen sich gegenseitig zum Leuchten bringen. Was tust du?",
    "a": [
      "Ich male sie als Flächen direkt nebeneinander.",
      "Ich verrühre beide auf der Palette.",
      "Ich mische in beide etwas Grau.",
      "Ich übermale beide mit deckendem Weiß."
    ],
    "k": 0,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "An der gemeinsamen Kante kannst du beide reinen Farbtöne sehen. Beim Verrühren entsteht ein neuer Mischton."
  },
  {
    "q": "Mia sagt: „Trüb bedeutet dunkel.“ Welche Farbprobe zeigt den Unterschied?",
    "a": [
      "Ein dunkles Nachtblau",
      "Ein schwarzer Strich",
      "Ein kräftiges, dunkles Rot",
      "Ein helles, graustichiges Grün"
    ],
    "k": 3,
    "topic": "Bildwirkung",
    "skill": "Helligkeit",
    "why": "Ein helles Grün kann zugleich wenig farbkräftig sein. Helligkeit und Leuchtkraft lassen sich getrennt beschreiben."
  },
  {
    "q": "Im Mischer steht Rot zu Grün auf 3 zu 1. Wie setzt du dieses Verhältnis mit Farbe um?",
    "a": [
      "Ein Teil Rot und drei Teile Grün",
      "Drei Teile von jeder Farbe",
      "Drei Teile Rot und ein Teil Grün",
      "Ein Teil Rot und ein Teil Grün"
    ],
    "k": 2,
    "topic": "Mischen",
    "skill": "Verhältnis",
    "why": "Zähle vier gleich große Portionen ab. Drei davon sind rot, eine ist grün."
  },
  {
    "q": "Wie prüfst du, was immer mehr Blau mit derselben Menge Orange macht?",
    "a": [
      "Bei jeder Probe ein anderes Orange wählen.",
      "Nur die Menge Blau von Probe zu Probe erhöhen.",
      "Jede Probe bei anderem Licht betrachten.",
      "Mit jeder Probe auch mehr Orange nehmen."
    ],
    "k": 1,
    "topic": "Mischen",
    "skill": "Versuch",
    "why": "Wenn nur der Blauanteil wechselt, kannst du seine Wirkung an der Reihe ablesen."
  },
  {
    "q": "Warum kann dein gemischter Farbton vom Ergebnis im digitalen Mischer abweichen?",
    "a": [
      "Jeder Bildschirm zeigt genau dieselben Farben.",
      "Ein Mischverhältnis gilt nur für blaue Farbe.",
      "Alle Malfarben bestehen aus denselben Pigmenten.",
      "Die App vereinfacht, wie echte Pigmente sich mischen."
    ],
    "k": 3,
    "topic": "Mischen",
    "skill": "Versuch",
    "why": "Die digitale Vorschau nutzt ein vereinfachtes Modell. In deinem Farbkasten bestimmen auch die verwendeten Pigmente den Ton."
  },
  {
    "q": "Ein orangefarbener Fuchs braucht einen gedämpften Fellschatten. Was probierst du?",
    "a": [
      "Etwas Blau ins Orange mischen und eine Probe malen.",
      "Reines Gelb als Schatten auftragen.",
      "Weiß ins Orange geben, bis es blass wird.",
      "Blau nur neben das unveränderte Orange malen."
    ],
    "k": 0,
    "topic": "Mischen",
    "skill": "Trüben",
    "why": "Blau liegt Orange gegenüber. Wenig Blau dämpft das Orange im Schatten, während das übrige Fell kräftig bleibt.",
    "axis": 2
  },
  {
    "q": "Welche Farbe gehört bei Itten zwischen Orange und Rot?",
    "a": [
      "Gelborange",
      "Rotviolett",
      "Rotorange",
      "Violett"
    ],
    "k": 2,
    "topic": "Farbkreis",
    "skill": "Nachbarn",
    "why": "Der Name nennt beide Nachbarn. Rot-Orange liegt auf der roten Seite von Orange."
  },
  {
    "q": "Welche Farbe liegt im zwölfteiligen Farbkreis genau gegenüber von Gelbgrün?",
    "a": [
      "Rotviolett",
      "Blauviolett",
      "Rotorange",
      "Gelborange"
    ],
    "k": 0,
    "topic": "Farbkreis",
    "skill": "Gegenfarben",
    "why": "Zähle ab Gelb-Grün sechs Schritte. Rot-Violett liegt auf der anderen Seite der Mitte.",
    "axis": 11
  },
  {
    "q": "Du gehst von Gelb über Gelborange und Orange bis Rot. Welches Feld fehlt auf dem Weg?",
    "a": [
      "Gelbgrün",
      "Rotviolett",
      "Blaugrün",
      "Rotorange"
    ],
    "k": 3,
    "topic": "Farbkreis",
    "skill": "Nachbarn",
    "why": "Die Reihenfolge lautet Gelb, Gelb-Orange, Orange, Rot-Orange, Rot."
  },
  {
    "q": "Wie viele der zwölf Felder in Ittens äußerem Ring zeigen Tertiärfarben?",
    "a": [
      "Drei",
      "Sechs",
      "Vier",
      "Neun"
    ],
    "k": 1,
    "topic": "Farbkreis",
    "skill": "Grundfarben",
    "why": "Von zwölf Feldern sind drei primär und drei sekundär. Die übrigen sechs sind Zwischenfarben."
  },
  {
    "q": "Ein Kind hat Blau und Grün gemischt. Wo passt die Probe im Farbkreis am besten hin?",
    "a": [
      "Zwischen Gelb und Grün",
      "Gegenüber von Blau",
      "Zwischen Blau und Grün",
      "Gegenüber von Grün"
    ],
    "k": 2,
    "topic": "Farbkreis",
    "skill": "Nachbarn",
    "why": "Blau und Grün sind die beiden Nachbarn des Feldes Blau-Grün."
  },
  {
    "q": "Wie wird ein deckendes Violett beim Mischen mit Weiß?",
    "a": [
      "Gelblicher",
      "Schwärzer",
      "Zur Gegenfarbe",
      "Heller"
    ],
    "k": 3,
    "topic": "Bildwirkung",
    "skill": "Helligkeit",
    "why": "Deckweiß hellt die violette Farbe auf. Vergleiche eine aufgehellte Probe mit dem ursprünglichen Violett."
  },
  {
    "q": "Du hast nur Primärfarben. Wie mischst du nach Itten die Gegenfarbe zu Gelb?",
    "a": [
      "Rot und Blau mischen",
      "Gelb und Rot mischen",
      "Gelb und Blau mischen",
      "Rot mit Weiß mischen"
    ],
    "k": 0,
    "topic": "Mischen",
    "skill": "Grundmischung",
    "why": "Gegenüber von Gelb liegt Violett. Seine beiden Grundfarben sind Rot und Blau.",
    "axis": 0
  },
  {
    "q": "Du mischst Orange. Es wirkt für deine Aprikose zu rötlich. Welche Zugabe hilft?",
    "a": [
      "Blau",
      "Gelb",
      "Violett",
      "Noch mehr Rot"
    ],
    "k": 1,
    "topic": "Mischen",
    "skill": "Grundmischung",
    "why": "Mehr Gelb verschiebt das Orange in Richtung Gelb-Orange."
  },
  {
    "q": "Dein Gelb soll sauber bleiben. Am Pinsel klebt noch Violett. Was hilft?",
    "a": [
      "Mit dem Pinsel direkt ins Gelb gehen",
      "Beide Farbnäpfe mit Wasser füllen",
      "Den Pinsel nur am Violett abstreifen",
      "Pinsel auswaschen und abstreifen"
    ],
    "k": 3,
    "topic": "Mischen",
    "skill": "Versuch",
    "why": "Saubere Borsten tragen kein Violett in den gelben Napf. So bleibt das Ausgangsgelb für weitere Versuche rein."
  },
  {
    "q": "Für ein Plakat suchst du drei benachbarte Farbtöne. Welche Reihe passt?",
    "a": [
      "Gelb, Rot, Blau",
      "Orange, Blau, Grün",
      "Gelb, Gelborange, Orange",
      "Rot, Grün, Gelb"
    ],
    "k": 2,
    "topic": "Farbkreis",
    "skill": "Nachbarn",
    "why": "Gehe von Gelb zwei Felder in Richtung Rot. Gelb-Orange und Orange folgen direkt."
  },
  {
    "q": "Im Mischer stehen Blau und Orange auf 50 zu 50. Was bedeutet das?",
    "a": [
      "Die Mischung wird halb durchsichtig.",
      "Beide haben gleich große Anteile.",
      "Blau ist doppelt so stark vertreten.",
      "Beide ergeben garantiert Mittelgrau."
    ],
    "k": 1,
    "topic": "Mischen",
    "skill": "Verhältnis",
    "why": "50 von 100 Teilen stammen von jeder Farbe. Für beide kannst du denselben Messlöffel gleich oft füllen."
  },
  {
    "q": "Für einen zweiten Versuch verdoppelst du 2 Teile Gelb und 1 Teil Violett. Was nimmst du?",
    "a": [
      "4 Teile Gelb und 2 Teile Violett",
      "3 Teile Gelb und 2 Teile Violett",
      "2 Teile Gelb und 2 Teile Violett",
      "4 Teile Gelb und 1 Teil Violett"
    ],
    "k": 0,
    "topic": "Mischen",
    "skill": "Verhältnis",
    "why": "Verdopple jede Menge. Aus zwei gelben werden vier gelbe Teile, aus einem violetten werden zwei."
  },
  {
    "q": "Warum legst du für eine Mischreihe zuerst eine Probe aus reinem Rot an?",
    "a": [
      "Damit jede Probe gleich dunkel wird.",
      "Damit Grün später besser deckt.",
      "Damit du keine Mengen abmessen musst.",
      "Damit du Veränderungen vergleichen kannst."
    ],
    "k": 3,
    "topic": "Mischen",
    "skill": "Versuch",
    "why": "Das reine Rot ist deine Vergleichsprobe. Lege die veränderten Mischungen direkt daneben."
  },
  {
    "q": "Welche Notiz hilft einer Partnerin, dein gedämpftes Grün möglichst genau nachzumischen?",
    "a": [
      "Grün und Rot, lange gerührt",
      "4 Teile Blattgrün und 1 Teil Karminrot, dieselben Farben",
      "Ein schöner Grünton für Blätter",
      "Mehrere Farben, bis es passt"
    ],
    "k": 1,
    "topic": "Mischen",
    "skill": "Verhältnis",
    "why": "Mit Farbnamen und abgezählten gleich großen Portionen kann jemand dein Rezept nachmachen."
  },
  {
    "q": "Welche Aussage ist eine Beobachtung nach einem Mischversuch?",
    "a": [
      "Die neue Probe wirkt grauer als das reine Orange.",
      "Ich vermute, dass die Probe grauer wird.",
      "Als Nächstes gebe ich Blau dazu.",
      "Ich möchte ein gedämpftes Orange erhalten."
    ],
    "k": 0,
    "topic": "Mischen",
    "skill": "Versuch",
    "why": "Eine Beobachtung beschreibt etwas Sichtbares an der fertigen Probe, etwa ihren Graustich."
  },
  {
    "q": "Welche zwei Proben zeigen am besten den Unterschied zwischen Aufhellen und Trüben?",
    "a": [
      "Rot mit Weiß und Blau mit Weiß",
      "Rot mit Grün und Grün mit Rot",
      "Rot mit Weiß und Rot mit etwas Grün",
      "Rot mit Gelb und Blau mit Gelb"
    ],
    "k": 2,
    "topic": "Bildwirkung",
    "skill": "Helligkeit",
    "why": "Beide Proben starten mit Rot. Weiß hellt es auf, seine Gegenfarbe Grün dämpft die Leuchtkraft."
  },
  {
    "q": "Eine rote Beere soll vor Blättern kräftig wirken. Welche Gestaltung nutzt ihre Gegenfarbe?",
    "a": [
      "Beere und Blätter in Rosa malen.",
      "Die Beere rot lassen und die Blätter grün malen.",
      "Die Beere mit grüner Farbe überdecken.",
      "Blätter und Beere aus derselben Mischung malen."
    ],
    "k": 1,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Rot und Grün stehen im Itten-Kreis gegenüber. Auf benachbarten Flächen betonen sie sich gegenseitig.",
    "axis": 4
  },
  {
    "q": "Für eine Landschaft willst du kräftiges und gedämpftes Blau. Wie behältst du beide?",
    "a": [
      "Das gesamte Blau mit Orange mischen.",
      "Zu beiden Portionen gleich viel Orange geben.",
      "Orange nur neben die beiden blauen Proben malen.",
      "Blau teilen und nur einer Portion etwas Orange zugeben."
    ],
    "k": 3,
    "topic": "Mischen",
    "skill": "Trüben",
    "why": "Teile die Farbe vor dem Mischen. So kannst du das reine Blau neben die mit Orange gedämpfte Probe legen."
  },
  {
    "q": "Zwei Gruppen mischen Rot und Grün und erhalten verschiedene Brauntöne. Was prüft ihr zuerst?",
    "a": [
      "Wer die längere Farbbezeichnung aufgeschrieben hat.",
      "Ob die Gruppen das Wort Braun gleich schreiben.",
      "Welche Farbtöne und Mengen beide Gruppen benutzt haben.",
      "Ob beide den Farbkreis von links betrachtet haben."
    ],
    "k": 2,
    "topic": "Mischen",
    "skill": "Versuch",
    "why": "Sowohl das Pigment als auch das Mengenverhältnis verändern den Mischton. Vergleiche die beiden Rezepte."
  },
  {
    "q": "Du malst eine violette Blüte. Wie bekommt sie einen gelben Rand und einen trüben Schatten?",
    "a": [
      "Gelb daneben malen und etwas Gelb ins Schattenviolett mischen.",
      "Gelb in die ganze Blüte mischen und den Rand violett malen.",
      "Blüte und Rand mit derselben Mischung malen.",
      "Den Schatten mit Weiß und den Rand mit Blau malen."
    ],
    "k": 0,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Gelb neben Violett schafft einen kräftigen Rand. Gelb im Violett dämpft die Farbe für den Schatten.",
    "axis": 6
  },
  {
    "q": "Welches Bild mit dem Motiv „Sonne“ zeigt ein Komplementärpaar?",
    "a": [
      "Sonne in Gelb auf Gelb-Orange",
      "Sonne in Gelb auf Violett",
      "Sonne in Gelb auf Grün",
      "Sonne in Gelb auf Orange"
    ],
    "k": 1,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Gelb und Violett liegen sich gegenüber. Hier treffen sich die beiden Farben am Rand des Motivs.",
    "axis": 0,
    "pairs": [
      [
        0,
        1
      ],
      [
        0,
        6
      ],
      [
        0,
        10
      ],
      [
        0,
        2
      ]
    ],
    "motif": "sun"
  },
  {
    "q": "Welches Bild mit dem Motiv „Blatt“ zeigt ein Komplementärpaar?",
    "a": [
      "Blatt in Grün auf Blau",
      "Blatt in Grün auf Gelb-Grün",
      "Blatt in Grün auf Rot",
      "Blatt in Grün auf Gelb"
    ],
    "k": 2,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Grün und Rot liegen sich gegenüber. Hier treffen sich die beiden Farben am Rand des Motivs.",
    "axis": 10,
    "pairs": [
      [
        10,
        8
      ],
      [
        10,
        11
      ],
      [
        10,
        4
      ],
      [
        10,
        0
      ]
    ],
    "motif": "leaf"
  },
  {
    "q": "Welches Bild mit dem Motiv „Fisch“ zeigt ein Komplementärpaar?",
    "a": [
      "Fisch in Blau auf Orange",
      "Fisch in Blau auf Blau-Violett",
      "Fisch in Blau auf Blau-Grün",
      "Fisch in Blau auf Violett"
    ],
    "k": 0,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Blau und Orange liegen sich gegenüber. Hier treffen sich die beiden Farben am Rand des Motivs.",
    "axis": 8,
    "pairs": [
      [
        8,
        2
      ],
      [
        8,
        7
      ],
      [
        8,
        9
      ],
      [
        8,
        6
      ]
    ],
    "motif": "fish"
  },
  {
    "q": "Welches Bild mit dem Motiv „Blüte“ zeigt ein Komplementärpaar?",
    "a": [
      "Blüte in Violett auf Rot-Violett",
      "Blüte in Violett auf Blau",
      "Blüte in Violett auf Rot",
      "Blüte in Violett auf Gelb"
    ],
    "k": 3,
    "topic": "Bildwirkung",
    "skill": "Kontrast",
    "why": "Violett und Gelb liegen sich gegenüber. Hier treffen sich die beiden Farben am Rand des Motivs.",
    "axis": 6,
    "pairs": [
      [
        6,
        5
      ],
      [
        6,
        8
      ],
      [
        6,
        4
      ],
      [
        6,
        0
      ]
    ],
    "motif": "flower"
  }
];

// Reserve one unseen transfer task per concept for rounds which used the entire pool.
const transferfragen = [
 {skill:'Grundfarben',q:'Du hast zwölf Farbsteine. Welche drei legst du zuerst, um Ittens Kreis aufzubauen?',a:['Grün, Orange, Violett','Gelb, Rot, Blau','Weiß, Grau, Schwarz','Rot, Grün, Blau'],k:1,why:'Die drei Grundfarben stehen im gleichen Abstand. Zwischen je zwei von ihnen kommt später eine Sekundärfarbe.'},
 {skill:'Grundmischung',q:'Deine gemalte Pflaume soll violett werden. Mit welchem Paar beginnst du?',a:['Gelb und Blau','Gelb und Rot','Rot und Blau','Orange und Grün'],k:2,why:'Violett liegt im Itten-Kreis zwischen Rot und Blau.'},
 {skill:'Nachbarn',q:'Ein Schal soll von Blau über eine Zwischenfarbe zu Grün übergehen. Welcher Streifen gehört in die Mitte?',a:['Blau-Grün','Gelb-Grün','Violett','Gelb-Orange'],k:0,why:'Blau-Grün grenzt im Farbkreis direkt an Blau und Grün.'},
 {skill:'Gegenfarben',q:'Dein Farbkreis hängt schräg an der Tafel. Wie findest du trotzdem die Gegenfarbe von Orange?',a:['Das oberste Feld nehmen','Das Feld rechts daneben wählen','Zwei Felder weitergehen','Von Orange gerade durch die Mitte gehen'],k:3,axis:2,why:'Die Lage der Tafel ändert die Farbpaare nicht. Gegenüber von Orange liegt Blau.'},
 {skill:'Trüben',q:'Eine violette Wolke soll weniger kräftig wirken. Welche Farbe probierst du in winziger Menge aus?',a:['Blau','Gelb','Weiß','Rot'],k:1,axis:6,why:'Gelb ist die Gegenfarbe von Violett. Etwas Gelb in der violetten Mischung kann die Leuchtkraft dämpfen.'},
 {skill:'Kontrast',q:'Welche zwei Papierstreifen kannst du als Gegenfarben direkt aneinanderlegen?',a:['Rot und Gelb','Blau und Grün','Gelb-Grün und Rot-Violett','Orange und Rot'],k:2,axis:11,why:'Gelb-Grün und Rot-Violett liegen einander im zwölfteiligen Farbkreis gegenüber.'},
 {skill:'Helligkeit',q:'Ein Kind malt nachts ein kräftiges Dunkelblau. Welche Beschreibung passt?',a:['Dunkel und farbkräftig zugleich','Hell und getrübt','Immer mit Weiß gemischt','Ohne erkennbaren Farbton'],k:0,why:'Dunkel beschreibt die Helligkeit. Auch ein dunkler Farbton kann kräftig leuchten.'},
 {skill:'Verhältnis',q:'Für eine Kulisse brauchst du dreimal so viel Mischung aus einem Teil Rot und zwei Teilen Gelb. Was füllst du ein?',a:['2 Rot, 3 Gelb','3 Rot, 2 Gelb','1 Rot, 6 Gelb','3 Rot, 6 Gelb'],k:3,why:'Verdreifache beide Zutaten. Drei rote und sechs gelbe Teile ergeben wieder das Verhältnis eins zu zwei.'},
 {skill:'Versuch',q:'Welche Reihe zeigt am besten die Wirkung von Weiß auf dasselbe Blau?',a:['Anderes Blau in jedem Feld','Gleiche Blaumenge, schrittweise mehr Weiß','Immer zugleich mehr Blau und Gelb','Drei verschiedene Papiere ohne Vergleichsprobe'],k:1,why:'Halte das Blau und die Bedingungen gleich. Dann kannst du Änderungen gezielt der Weißzugabe zuordnen.'}
];
