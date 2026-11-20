const fragen = [
  {
    "q": "Welche drei Farben sind im Farbkreis nach Itten die Primärfarben?",
    "a": [
      "Rot, Gelb und Blau",
      "Rot, Grün und Blau",
      "Orange, Grün und Violett",
      "Gelb, Grün und Blau"
    ],
    "k": 0
  },
  {
    "q": "Du hast Gelb und Rot im Malkasten. Welche Sekundärfarbe kannst du damit mischen?",
    "a": [
      "Grün",
      "Violett",
      "Orange",
      "Blau"
    ],
    "k": 2
  },
  {
    "q": "Auf deiner Palette fehlt Grün. Welche beiden Primärfarben brauchst du nach Itten?",
    "a": [
      "Rot und Gelb",
      "Gelb und Blau",
      "Blau und Rot",
      "Rot und Weiß"
    ],
    "k": 1
  },
  {
    "q": "Welche Reihe enthält nur Sekundärfarben aus Ittens Farbkreis?",
    "a": [
      "Gelb, Grün, Blau",
      "Rot, Orange, Violett",
      "Gelborange, Gelbgrün, Blaugrün",
      "Orange, Grün, Violett"
    ],
    "k": 3
  },
  {
    "q": "Im zwölfteiligen Farbkreis ist das Feld zwischen Gelb und Orange leer. Was gehört hinein?",
    "a": [
      "Rotorange",
      "Gelborange",
      "Gelbgrün",
      "Rotviolett"
    ],
    "k": 1
  },
  {
    "q": "Wie mischst du Blauviolett aus zwei Nachbarfarben dieses Feldes?",
    "a": [
      "Blau und Grün",
      "Rot und Violett",
      "Blau und Violett",
      "Blau und Orange"
    ],
    "k": 2
  },
  {
    "q": "Warum zählt Gelbgrün in Ittens zwölfteiligem Farbkreis zu den Tertiärfarben?",
    "a": [
      "Es liegt Gelb genau gegenüber.",
      "Es entsteht aus zwei Primärfarben.",
      "Es enthält immer drei gleiche Farbanteile.",
      "Es entsteht aus Gelb und der Nachbarfarbe Grün."
    ],
    "k": 3
  },
  {
    "q": "Wie findest du im Farbkreis die Komplementärfarbe zu einem Farbton?",
    "a": [
      "Ich gehe durch die Mitte bis zur Gegenseite.",
      "Ich gehe ein Feld nach rechts.",
      "Ich wähle die hellste Farbe.",
      "Ich gehe ein Feld nach links."
    ],
    "k": 0
  },
  {
    "q": "Welches Paar liegt sich in Ittens Farbkreis gegenüber?",
    "a": [
      "Rot und Orange",
      "Gelb und Grün",
      "Blau und Orange",
      "Violett und Blau"
    ],
    "k": 2
  },
  {
    "q": "Eine gelbe Sonne soll sich durch Komplementärkontrast abheben. Welcher Himmel passt?",
    "a": [
      "Violett",
      "Orange",
      "Gelborange",
      "Gelbgrün"
    ],
    "k": 0
  },
  {
    "q": "Welche Farbe liegt Rot im Farbkreis nach Itten gegenüber?",
    "a": [
      "Blau",
      "Grün",
      "Gelb",
      "Violett"
    ],
    "k": 1
  },
  {
    "q": "Ein Blatt ist zu knallig grün. Welche Zugabe dämpft das Grün durch seine Gegenfarbe?",
    "a": [
      "Etwas Gelb",
      "Etwas Blau",
      "Etwas Weiß",
      "Etwas Rot"
    ],
    "k": 3
  },
  {
    "q": "Wie findest du beim Mischen ein leicht gedämpftes Orange?",
    "a": [
      "Gib sofort gleich viel Blau dazu.",
      "Gib Blau in kleinen Schritten dazu und vergleiche.",
      "Mische Gelb und Weiß zu gleichen Teilen.",
      "Male daneben einen blauen Punkt."
    ],
    "k": 1
  },
  {
    "q": "Was passiert meist, wenn du komplementäre Malfarben gründlich vermischst?",
    "a": [
      "Beide Töne leuchten stärker.",
      "Es entsteht reines Weiß.",
      "Es entsteht ein gedämpfter, oft bräunlicher Ton.",
      "Die Mischung wird zur hellsten Primärfarbe."
    ],
    "k": 2
  },
  {
    "q": "Zwei kräftige Gegenfarben sollen sich gegenseitig zum Leuchten bringen. Was tust du?",
    "a": [
      "Ich male sie als Flächen direkt nebeneinander.",
      "Ich verrühre beide auf der Palette.",
      "Ich mische in beide etwas Grau.",
      "Ich übermale beide mit deckendem Weiß."
    ],
    "k": 0
  },
  {
    "q": "Mia sagt: „Trüb bedeutet dunkel.“ Welche Farbprobe zeigt den Unterschied?",
    "a": [
      "Ein dunkles Nachtblau",
      "Ein schwarzer Strich",
      "Ein kräftiges, dunkles Rot",
      "Ein helles, graustichiges Grün"
    ],
    "k": 3
  },
  {
    "q": "Im Mischer steht Rot zu Grün auf 3 zu 1. Wie setzt du dieses Verhältnis mit Farbe um?",
    "a": [
      "Ein Teil Rot und drei Teile Grün",
      "Drei Teile von jeder Farbe",
      "Drei Teile Rot und ein Teil Grün",
      "Ein Teil Rot und ein Teil Grün"
    ],
    "k": 2
  },
  {
    "q": "Wie prüfst du, was immer mehr Blau mit derselben Menge Orange macht?",
    "a": [
      "Bei jeder Probe ein anderes Orange wählen.",
      "Nur die Menge Blau von Probe zu Probe erhöhen.",
      "Jede Probe bei anderem Licht betrachten.",
      "Mit jeder Probe auch mehr Orange nehmen."
    ],
    "k": 1
  },
  {
    "q": "Warum kann dein gemischter Farbton vom Ergebnis im digitalen Mischer abweichen?",
    "a": [
      "Jeder Bildschirm zeigt genau dieselben Farben.",
      "Ein Mischverhältnis gilt nur für blaue Farbe.",
      "Alle Malfarben bestehen aus denselben Pigmenten.",
      "Die App vereinfacht, wie echte Pigmente sich mischen."
    ],
    "k": 3
  },
  {
    "q": "Ein orangefarbener Fuchs braucht einen gedämpften Fellschatten. Was probierst du?",
    "a": [
      "Etwas Blau ins Orange mischen und eine Probe malen.",
      "Reines Gelb als Schatten auftragen.",
      "Weiß ins Orange geben, bis es blass wird.",
      "Blau nur neben das unveränderte Orange malen."
    ],
    "k": 0
  },
  {
    "q": "Welche Farbe gehört bei Itten zwischen Orange und Rot?",
    "a": [
      "Gelborange",
      "Rotviolett",
      "Rotorange",
      "Violett"
    ],
    "k": 2
  },
  {
    "q": "Welche Farbe liegt im zwölfteiligen Farbkreis genau gegenüber von Gelbgrün?",
    "a": [
      "Rotviolett",
      "Blauviolett",
      "Rotorange",
      "Gelborange"
    ],
    "k": 0
  },
  {
    "q": "Du gehst von Gelb über Gelborange und Orange bis Rot. Welches Feld fehlt auf dem Weg?",
    "a": [
      "Gelbgrün",
      "Rotviolett",
      "Blaugrün",
      "Rotorange"
    ],
    "k": 3
  },
  {
    "q": "Wie viele der zwölf Felder in Ittens äußerem Ring zeigen Tertiärfarben?",
    "a": [
      "Drei",
      "Sechs",
      "Vier",
      "Neun"
    ],
    "k": 1
  },
  {
    "q": "Ein Kind hat Blau und Grün gemischt. Wo passt die Probe im Farbkreis am besten hin?",
    "a": [
      "Zwischen Gelb und Grün",
      "Gegenüber von Blau",
      "Zwischen Blau und Grün",
      "Gegenüber von Grün"
    ],
    "k": 2
  },
  {
    "q": "Wie wird ein deckendes Violett beim Mischen mit Weiß?",
    "a": [
      "Gelblicher",
      "Schwärzer",
      "Zur Gegenfarbe",
      "Heller"
    ],
    "k": 3
  },
  {
    "q": "Du hast nur Primärfarben. Wie mischst du nach Itten die Gegenfarbe zu Gelb?",
    "a": [
      "Rot und Blau mischen",
      "Gelb und Rot mischen",
      "Gelb und Blau mischen",
      "Rot mit Weiß mischen"
    ],
    "k": 0
  },
  {
    "q": "Du mischst Orange. Es wirkt für deine Aprikose zu rötlich. Welche Zugabe hilft?",
    "a": [
      "Blau",
      "Gelb",
      "Violett",
      "Noch mehr Rot"
    ],
    "k": 1
  },
  {
    "q": "Dein Gelb soll sauber bleiben. Am Pinsel klebt noch Violett. Was hilft?",
    "a": [
      "Mit dem Pinsel direkt ins Gelb gehen",
      "Beide Farbnäpfe mit Wasser füllen",
      "Den Pinsel nur am Violett abstreifen",
      "Pinsel auswaschen und abstreifen"
    ],
    "k": 3
  },
  {
    "q": "Für ein Plakat suchst du drei benachbarte Farbtöne. Welche Reihe passt?",
    "a": [
      "Gelb, Rot, Blau",
      "Orange, Blau, Grün",
      "Gelb, Gelborange, Orange",
      "Rot, Grün, Gelb"
    ],
    "k": 2
  },
  {
    "q": "Im Mischer stehen Blau und Orange auf 50 zu 50. Was bedeutet das?",
    "a": [
      "Die Mischung wird halb durchsichtig.",
      "Beide haben gleich große Anteile.",
      "Blau ist doppelt so stark vertreten.",
      "Beide ergeben garantiert Mittelgrau."
    ],
    "k": 1
  },
  {
    "q": "Für einen zweiten Versuch verdoppelst du 2 Teile Gelb und 1 Teil Violett. Was nimmst du?",
    "a": [
      "4 Teile Gelb und 2 Teile Violett",
      "3 Teile Gelb und 2 Teile Violett",
      "2 Teile Gelb und 2 Teile Violett",
      "4 Teile Gelb und 1 Teil Violett"
    ],
    "k": 0
  },
  {
    "q": "Warum legst du für eine Mischreihe zuerst eine Probe aus reinem Rot an?",
    "a": [
      "Damit jede Probe gleich dunkel wird.",
      "Damit Grün später besser deckt.",
      "Damit du keine Mengen abmessen musst.",
      "Damit du Veränderungen vergleichen kannst."
    ],
    "k": 3
  },
  {
    "q": "Welche Notiz hilft einer Partnerin, dein gedämpftes Grün möglichst genau nachzumischen?",
    "a": [
      "Grün und Rot, lange gerührt",
      "4 Teile Blattgrün und 1 Teil Karminrot, dieselben Farben",
      "Ein schöner Grünton für Blätter",
      "Mehrere Farben, bis es passt"
    ],
    "k": 1
  },
  {
    "q": "Welche Aussage ist eine Beobachtung nach einem Mischversuch?",
    "a": [
      "Die neue Probe wirkt grauer als das reine Orange.",
      "Ich vermute, dass die Probe grauer wird.",
      "Als Nächstes gebe ich Blau dazu.",
      "Ich möchte ein gedämpftes Orange erhalten."
    ],
    "k": 0
  },
  {
    "q": "Welche zwei Proben zeigen am besten den Unterschied zwischen Aufhellen und Trüben?",
    "a": [
      "Rot mit Weiß und Blau mit Weiß",
      "Rot mit Grün und Grün mit Rot",
      "Rot mit Weiß und Rot mit etwas Grün",
      "Rot mit Gelb und Blau mit Gelb"
    ],
    "k": 2
  },
  {
    "q": "Eine rote Beere soll vor Blättern kräftig wirken. Welche Gestaltung nutzt ihre Gegenfarbe?",
    "a": [
      "Beere und Blätter in Rosa malen.",
      "Die Beere rot lassen und die Blätter grün malen.",
      "Die Beere mit grüner Farbe überdecken.",
      "Blätter und Beere aus derselben Mischung malen."
    ],
    "k": 1
  },
  {
    "q": "Für eine Landschaft willst du kräftiges und gedämpftes Blau. Wie behältst du beide?",
    "a": [
      "Das gesamte Blau mit Orange mischen.",
      "Zu beiden Portionen gleich viel Orange geben.",
      "Orange nur neben die beiden blauen Proben malen.",
      "Blau teilen und nur einer Portion etwas Orange zugeben."
    ],
    "k": 3
  },
  {
    "q": "Zwei Gruppen mischen Rot und Grün und erhalten verschiedene Brauntöne. Was prüft ihr zuerst?",
    "a": [
      "Wer die längere Farbbezeichnung aufgeschrieben hat.",
      "Ob die Gruppen das Wort Braun gleich schreiben.",
      "Welche Farbtöne und Mengen beide Gruppen benutzt haben.",
      "Ob beide den Farbkreis von links betrachtet haben."
    ],
    "k": 2
  },
  {
    "q": "Du malst eine violette Blüte. Wie bekommt sie einen gelben Rand und einen trüben Schatten?",
    "a": [
      "Gelb daneben malen und etwas Gelb ins Schattenviolett mischen.",
      "Gelb in die ganze Blüte mischen und den Rand violett malen.",
      "Blüte und Rand mit derselben Mischung malen.",
      "Den Schatten mit Weiß und den Rand mit Blau malen."
    ],
    "k": 0
  }
];