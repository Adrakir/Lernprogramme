"use strict";

const einzeln = (text, options, correct, why) => ({ text, options, correct: [correct], why });
const mehrfach = (text, options, correct, why) => ({ text, options, correct, why });

const gruppen = [
  { name: "Extras", icon: "🍫", farbe: "rot", beispiel: "Schokolade, Salzbrezeln, Limonade" },
  { name: "Öle und Fette", icon: "🫒", farbe: "gelb", beispiel: "Rapsöl, Olivenöl, Butter" },
  { name: "Nüsse und Saaten", icon: "🌻", farbe: "gelb", beispiel: "Haselnüsse, Sonnenblumenkerne" },
  { name: "Milch und Milchprodukte", icon: "🥛", farbe: "gelb", beispiel: "Milch, Quark, Naturjoghurt" },
  { name: "Hülsenfrüchte, Fisch, Fleisch und Eier", icon: "🫘", farbe: "gelb", beispiel: "Linsen, Kichererbsen, Lachs, Ei" },
  { name: "Brot, Getreide und Beilagen", icon: "🍞", farbe: "gruen", beispiel: "Vollkornbrot, Reis, Nudeln, Kartoffeln" },
  { name: "Obst und Gemüse", icon: "🥕", farbe: "gruen", beispiel: "Apfel, Paprika, Möhre" },
  { name: "Getränke", icon: "💧", farbe: "gruen", beispiel: "Leitungswasser, ungesüßter Kräutertee" },
];

const naehrstoffe = [
  ["Kohlenhydrate", "⚡", "Sie geben dir Energie, zum Beispiel beim Spielen und Denken.", "Haferflocken, Kartoffeln, Reis"],
  ["Eiweiß", "🧱", "Der Körper braucht es zum Wachsen und als Baustoff für Muskeln.", "Linsen, Eier, Joghurt"],
  ["Fette", "🫒", "Sie liefern Energie. Fett hilft dem Körper auch, bestimmte Vitamine aufzunehmen.", "Rapsöl, Nüsse, Butter"],
  ["Vitamine", "🍊", "Verschiedene Vitamine haben verschiedene Aufgaben. Vitamin C hilft zum Beispiel der Körperabwehr.", "Paprika, Orangen, Brokkoli"],
  ["Mineralstoffe", "🦴", "Ein Mineralstoff ist Calcium. Der Körper braucht es unter anderem für Knochen und Zähne.", "Naturjoghurt, calciumreiches Mineralwasser"],
  ["Wasser", "💧", "Dein Körper braucht Wasser, um Stoffe zu transportieren und seine Temperatur zu regeln.", "Leitungswasser, ungesüßter Tee, wasserreiches Gemüse"],
];

const energieSaetze = ["Ich habe Hunger!", "Ich bin satt!", "Ich möchte mich bewegen!"];
const energieKreislauf = [
  { title: "Bewegung", note: "Energie verbrauchen", icon: "👟" },
  { gap: 0 },
  { title: "Essen und Trinken", icon: "🍎" },
  { gap: 1 },
  { title: "Neue Energie", icon: "⚡" },
  { gap: 2 },
];

const fruehstueck = [
  ["Getränk", "💧", ["Wasser", "Ungesüßter Kräutertee"]],
  ["Obst oder Gemüse", "🍎", ["Apfel", "Gurke", "Möhre", "Banane"]],
  ["Brot oder Getreide", "🍞", ["Vollkornbrot", "Haferflocken", "Vollkornbrötchen"]],
  ["Milchprodukt", "🥣", ["Naturjoghurt", "Quark", "Käse", "Milch"]],
];

const getraenke = [
  { name: "Wasser", grams: 0, icon: "💧" },
  { name: "Apfelschorle", grams: 4, icon: "🍏" },
  { name: "Apfelsaft", grams: 10, icon: "🍎" },
  { name: "Cola", grams: 11, icon: "🥤" },
];

const geschichte = [
  ["Vor dem Start", "Maja hat einen kleinen Hindernisparcours aufgebaut. Stern findet die erste Station unter dem Apfelbaum. Bärli merkt, dass er kaum gefrühstückt hat.", "Was könnte Bärli vor dem Spielen noch in Ruhe essen und trinken?"],
  ["Die Pause", "Nach dem Balancieren setzt sich Stern auf die Bank. Maja hat Leitungswasser und eine Flasche Apfelschorle eingepackt. Bärli reicht allen einen Becher.", "Welches Getränk passt als Durstlöscher besonders gut?"],
  ["Der Zuckerdetektiv", "Auf der Schorle steht: 4 g Zucker je 100 ml. Auf einem Saftkarton steht: 10 g Zucker je 100 ml. Stern stellt beide nebeneinander.", "Was kann Stern vergleichen, weil auf beiden Packungen dieselbe Menge steht?"],
  ["Ein Picknick zu dritt", "Am Ende packen die Freunde ihr Picknick aus. Auf dem Tuch stehen Wasser, Möhren, Vollkornbrot und Käse. Bärli bringt ein Stück Schokolade zum Teilen mit.", "Zeige vier Bausteine für ein Pyramidenfrühstück. Wo gehört die Schokolade in der Pyramide hin?"],
];

const stationen = [
  {
    id: "fit", title: "Fit durch den Tag", icon: "👟", color: "salbei", figur: "maja",
    short: "Bewegung, Trinken und Erholung",
    scene: "Maja möchte morgen mit Stern um die Wette laufen. Bärli fragt, was außer Training zu einem fitten Tag gehört.",
    prompt: "Woran würdest du denken, wenn du einen aktiven Nachmittag planst?",
    facts: [
      ["Bewegung", "Spielen, tanzen, radeln oder rennen bringen Muskeln und Kreislauf in Schwung."],
      ["Essen und Trinken", "Abwechslungsreiches Essen gibt dir Energie und liefert deinem Körper verschiedene Nährstoffe. Wasser ist ein guter Durstlöscher."],
      ["Erholung", "Pausen, ruhige Momente und Schlaf helfen dir, dich nach Anstrengung zu erholen."],
    ],
    activity: "fit", task: "Tippe auf jede Karte und entdecke, wie sie Maja bei einem aktiven Tag hilft.",
    practice: [
      mehrfach("Was hilft Maja bei einem aktiven Nachmittag?", ["Wasser einpacken", "Jede Pause auslassen", "Sich zwischendurch ausruhen", "Bewegung, die ihr Spaß macht"], [0,2,3], "Wasser, Bewegung und Erholung gehören zusammen."),
      einzeln("Wie kann Stern nach dem Spielen zur Ruhe kommen?", ["Mit Wasser im Sitzen eine Pause machen", "Sofort stärker und länger rennen", "Jeden Abend später ins Bett gehen"], 0, "Eine Pause hilft Stern, sich zu erholen."),
      einzeln("Welcher Snack kombiniert zwei verschiedene Lebensmittelgruppen?", ["Zwei Sorten Schokolade", "Gurke und Naturjoghurt", "Zwei Sorten Kekse"], 1, "Die Gurke ist Gemüse. Naturjoghurt gehört zu den Milchprodukten."),
    ],
    check: einzeln("Welcher Plan passt für Bärlis Spielnachmittag?", ["Nur rennen, ohne Trinkpause", "Den ganzen Nachmittag sitzen", "Spielen, Wasser trinken und zwischendurch eine Pause machen"], 2, "Bewegung, Trinken und Erholung ergänzen sich."),
  },
  {
    id: "labor", title: "Nährstofflabor", icon: "🧪", color: "flieder", figur: "baerli",
    short: "Energie und Baustoffe für deinen Körper",
    scene: "Bärli möchte wissen, warum sein Körper selbst beim Lesen und Schlafen Essen und Trinken braucht.",
    prompt: "Was arbeitet in deinem Körper, während du still sitzt?",
    facts: [
      ["Energie für deinen Körper", "Auch wenn du still sitzt, schlagen dein Herz und du atmest. Dein Körper braucht Energie zum Denken, Bewegen und Warmbleiben."],
      ["Mehr als Energie", "Kohlenhydrate, Fette und Eiweiß können Energie liefern. Eiweiß ist auch ein Baustoff. Vitamine und Mineralstoffe haben eigene Aufgaben."],
      ["Viele Stoffe in einem Lebensmittel", "Vollkornbrot enthält zum Beispiel Kohlenhydrate und Ballaststoffe. Unterschiedliche Lebensmittel liefern eine Mischung verschiedener Stoffe."],
    ],
    activity: "labor", task: "Öffne die Karten im Labor. Finde heraus, welcher Stoff welche Aufgaben hat.",
    practice: [
      einzeln("Welchen Baustoff braucht der Körper zum Wachsen?", ["Kohlensäure", "Eiweiß", "Wasserdampf"], 1, "Eiweiß ist ein Baustoff, den der Körper zum Wachsen und für Muskeln braucht."),
      mehrfach("Welche zwei Lebensmittel liefern zum Beispiel Eiweiß?", ["Naturjoghurt", "Leitungswasser", "Ungesüßter Tee", "Linsen"], [0,3], "Milchprodukte und Hülsenfrüchte enthalten Eiweiß."),
      einzeln("Welcher Mineralstoff hilft beim Aufbau von Knochen und Zähnen?", ["Vitamin C", "Calcium", "Ballaststoff"], 1, "Calcium ist ein Mineralstoff. Dein Körper braucht ihn unter anderem für Knochen und Zähne."),
    ],
    check: einzeln("Warum braucht dein Körper auch beim Lesen Energie?", ["Weil Herz, Gehirn und andere Organe weiterarbeiten", "Weil nur die Augen Energie brauchen", "Weil Energie nur beim Rennen gebraucht wird"], 0, "Herz, Gehirn und andere Organe brauchen auch in Ruhe Energie."),
  },
  {
    id: "ballast", title: "Ballaststoff-Spur", icon: "🌾", color: "sand", figur: "baerli",
    short: "Was Vollkorn, Gemüse und Linsen können",
    scene: "Beim Picknick hat Bärli Vollkornbrot dabei. Stern wundert sich über das Wort Ballaststoffe.",
    prompt: "Welche Lebensmittel kennst du, die Ballaststoffe enthalten?",
    facts: [
      ["Pflanzliche Fasern", "Ballaststoffe sind Bestandteile pflanzlicher Lebensmittel. Dein Körper kann viele davon kaum verdauen."],
      ["Hilfe für den Darm", "Ballaststoffe unterstützen die Verdauung. Manche binden Wasser und machen den Stuhl weicher. Ballaststoffreiche Lebensmittel können länger satt machen."],
      ["Hier findest du sie", "Vollkornbrot, Haferflocken, Linsen, Äpfel, Möhren, Nüsse und Saaten können Ballaststoffe liefern."],
    ],
    activity: "ballast", task: "Starte Bärlis Modell. Beobachte, was passiert, wenn manche Ballaststoffe Wasser binden.",
    practice: [
      mehrfach("Welche beiden Lebensmittel sind typische Ballaststoffquellen?", ["Käse", "Vollkornbrot", "Linsen", "Milch"], [1,2], "Vollkornbrot und Linsen sind pflanzliche Lebensmittel, die Ballaststoffe liefern."),
      einzeln("Welches Körperorgan unterstützen Ballaststoffe besonders?", ["Den Darm", "Das Ohr", "Die Nase"], 0, "Ballaststoffe unterstützen die Verdauung im Darm."),
      einzeln("Was passt gut zu ballaststoffreichem Essen?", ["Absichtlich weniger trinken", "Regelmäßig Wasser trinken", "Nie wieder eine Pause machen"], 1, "Trinken ist wichtig. Manche Ballaststoffe binden Wasser."),
    ],
    check: einzeln("Welche Kombination fügt Ballaststoffe zu Majas Pause hinzu?", ["Wasser und Käse", "Milch und Naturjoghurt", "Apfel und Vollkornbrot"], 2, "Apfel und Vollkornbrot sind pflanzliche Ballaststoffquellen."),
  },
  {
    id: "pyramide", title: "Ernährungspyramide", icon: "🥕", color: "salbei", figur: "maja",
    short: "Acht Lebensmittelgruppen entdecken",
    scene: "Maja räumt den Einkauf ein. Wasser, Brot, Möhren, Joghurt und Schokolade liegen nebeneinander. Wo gehören sie in der Pyramide hin?",
    prompt: "Warum ist die Pyramide unten breiter als oben?",
    facts: [
      ["Grün heißt reichlich", "Unten stehen Wasser und ungesüßter Tee. Darüber stehen Obst und Gemüse und dann Brot, Getreide und Beilagen."],
      ["Gelb heißt regelmäßig und in passenden Mengen", "Dazu zählen Milchprodukte, Hülsenfrüchte und weitere Eiweißquellen, Öle und Fette sowie Nüsse und Saaten."],
      ["Rot heißt sparsam genießen", "Süßigkeiten, salzige Knabbereien und süße Limo stehen bei den Extras. Die Pyramide hilft, verschiedene Lebensmittel zu kombinieren."],
    ],
    activity: "pyramide", task: "Tippe auf die Gruppen. Ordne danach das Lebensmittel dem passenden Feld zu.",
    practice: [
      einzeln("Wohin gehört Naturjoghurt?", ["Getränke", "Milch und Milchprodukte", "Brot, Getreide und Beilagen"], 1, "Naturjoghurt gehört zu den Milchprodukten."),
      einzeln("Wo findet Maja angebratene Kartoffeln, wenn es um die Kartoffeln als Grundzutat geht?", ["Brot, Getreide und Beilagen", "Extras", "Nüsse und Saaten"], 0, "Kartoffeln gehören zu den Beilagen. Fett zum Anbraten ist eine weitere Zutat."),
      mehrfach("Welche zwei Lebensmittel gehören zu den Extras?", ["Schokolade", "Möhren", "Limonade", "Leitungswasser"], [0,2], "Schokolade und gezuckerte Limonade zählen in der Pyramide zu den Extras."),
    ],
    check: einzeln("Wofür stehen Grün, Gelb und Rot in der Pyramide?", ["Für den Geschmack der Lebensmittel", "Für das Land, aus dem das Essen kommt", "Für eine grobe Orientierung zu den Mengen"], 2, "Die Ampelfarben sind eine Orientierung für die Mengen und fürs Kombinieren."),
  },
  {
    id: "fruehstueck", title: "Frühstücksküche", icon: "🍎", color: "pfirsich", figur: "maja",
    short: "Ein Frühstück aus vier Bausteinen bauen",
    scene: "Stern hat einen Apfel und ein Vollkornbrot. Maja fragt, welche Bausteine zum Pyramidenfrühstück aus dem Unterricht noch fehlen.",
    prompt: "Was würdest du in die Brotdose packen und was kommt in die Trinkflasche?",
    facts: [
      ["Vier Bausteine", "Unser Pyramidenfrühstück besteht aus einem Getränk, Obst oder Gemüse, Brot oder Getreide und einem Milchprodukt."],
      ["Viele Kombinationen", "Du kannst zum Beispiel Wasser, einen Apfel, Haferflocken und Naturjoghurt nehmen. Ein anderer Tag kann anders aussehen."],
      ["Milch und Wasser haben verschiedene Plätze", "Milch ist in diesem Modell ein Milchprodukt. Leitungswasser und ungesüßter Tee zählen als Getränk."],
    ],
    activity: "fruehstueck", task: "Wähle in jeder Zeile etwas aus. Dein Frühstück entsteht auf dem Tablett.",
    practice: [
      mehrfach("Stern hat Wasser und Vollkornbrot. Was ergänzt die beiden fehlenden Bausteine?", ["Gurke", "Haferflocken", "Naturjoghurt", "Ein Glas Wasser"], [0,2], "Gurke liefert den Gemüse-Baustein, Naturjoghurt den Milch-Baustein."),
      einzeln("In welche Gruppe gehören Haferflocken?", ["Milchprodukte", "Gemüse", "Brot und Getreide"], 2, "Hafer ist ein Getreide. Haferflocken füllen den Baustein Brot oder Getreide."),
      einzeln("Welches Getränk passt zu Majas Pyramidenfrühstück?", ["Ungesüßter Kräutertee", "Cola", "Gezuckerte Limonade"], 0, "Ungesüßter Kräutertee gehört zu den Getränken in unserem Modell."),
    ],
    check: einzeln("Welche Auswahl enthält alle vier Frühstücksbausteine?", ["Wasser, Möhre, Vollkornbrot und Käse", "Milch, Käse, Quark und Brot", "Möhre, Paprika, Gurke und Apfel"], 0, "Wasser, Möhre, Vollkornbrot und Käse decken die vier verschiedenen Bausteine ab."),
  },
  {
    id: "zucker", title: "Zucker-Detektiv", icon: "🔎", color: "blau", figur: "stern",
    short: "Getränke und Etiketten vergleichen",
    scene: "Stern findet zwei Flaschen. Auf beiden steht „davon Zucker“, doch die Zahlen auf den Etiketten sind verschieden.",
    prompt: "Wie kannst du den Zucker vergleichen, wenn eine Flasche größer ist?",
    facts: [
      ["Die gleiche Menge vergleichen", "Vergleiche bei Getränken die Zahlen je 100 ml. Bei festen Lebensmitteln steht die Angabe meist je 100 g."],
      ["Was „davon Zucker“ bedeutet", "Die Zahl zählt den natürlich enthaltenen und den zugesetzten Zucker zusammen. In der Zutatenliste kannst du nach Zutaten wie Zucker oder Sirup suchen."],
      ["Auch Saft enthält Zucker", "Der Zucker kann aus den Früchten stammen. Ungesüßtes Wasser enthält keinen Zucker und ist ein guter Durstlöscher."],
    ],
    activity: "zucker", task: "Wähle zwei Getränke. Vergleiche den Zucker je 100 ml oder je 200 ml. Die Werte sind Beispiele.",
    practice: [
      einzeln("Saft hat 10 g und eine Schorle 4 g Zucker, jeweils je 100 ml. Welches Getränk hat in gleicher Menge mehr Zucker?", ["Die Schorle", "Der Saft", "Beide gleich viel"], 1, "10 g sind mehr als 4 g, wenn du jeweils 100 ml vergleichst."),
      einzeln("Was zählt die Zeile „davon Zucker“?", ["Den Zucker aus der Flasche selbst", "Ausschließlich zugesetzten Haushaltszucker", "Den gesamten Zucker im Lebensmittel"], 2, "Die Zeile enthält auch natürlich vorkommenden Zucker."),
      einzeln("Eine Schorle hat 4 g Zucker je 100 ml. Wie viel Zucker steckt in zwei Gläsern mit je 100 ml?", ["2 g", "8 g", "4 g"], 1, "In jedem Glas sind 4 g. Zusammen sind es 8 g."),
    ],
    check: einzeln("Welche Angaben eignen sich für einen fairen Zuckervergleich zwischen zwei Getränken?", ["Bei beiden Getränken jeweils die Angabe je 100 ml", "Bei einem Getränk pro Glas, beim anderen pro Flasche", "Die Mengen auf der Vorderseite in beliebigen Einheiten"], 0, "Mit je 100 ml vergleichst du bei beiden Getränken die gleiche Menge."),
  },
  {
    id: "geschichte", title: "Sterns Picknickgeschichte", icon: "📖", color: "flieder", figur: "stern",
    short: "Mit den drei Freunden einen Fall lösen",
    scene: "Stern erzählt von einem Picknick mit Hindernisparcours. An jeder Station findest du eine kleine Frage für Maja und Bärli.",
    prompt: "Was könntest du in der Geschichte über das Essen und Trinken herausfinden?",
    facts: [
      ["Genau beobachten", "Achte darauf, was Maja, Stern und Bärli dabeihaben. Nutze die Hinweise in der Geschichte."],
      ["Eine Entscheidung erklären", "Du kannst zum Beispiel sagen: Ich würde Wasser mitnehmen, weil es gut gegen Durst hilft."],
      ["Verschiedene Lösungen finden", "Für ein Pyramidenfrühstück gibt es viele richtige Kombinationen. Prüfe, ob alle vier Bausteine dabei sind."],
    ],
    activity: "geschichte", task: "Lies oder höre die Geschichte Szene für Szene und denke über jede Frage nach.",
    practice: [
      mehrfach("Was passt aus dem Picknick zur grünen Hälfte der Pyramide?", ["Wasser", "Schokolade", "Möhren", "Vollkornbrot"], [0,2,3], "Wasser, Möhren und Vollkornbrot stehen alle im grünen Teil."),
      einzeln("Was ergänzt Naturjoghurt und Vollkornbrot zu einem vollständigen Pyramidenfrühstück?", ["Noch ein Brot und Käse", "Eine Möhre und Wasser", "Zwei Schokoriegel"], 1, "Obst oder Gemüse und ein Getränk fehlen. Möhre und Wasser passen."),
      einzeln("Was kann Bärli nach dem Rennen tun, um sich zu erholen?", ["Kurz hinsetzen und etwas Wasser trinken", "Die Anstrengung einfach nie unterbrechen", "Die Trinkflasche wegstellen und sofort rennen"], 0, "Eine Pause und Wasser passen gut nach dem Rennen."),
    ],
    check: einzeln("Wie kann Maja erklären, warum das Picknick aus Wasser, Möhre, Vollkornbrot und Käse zum Frühstücksmodell passt?", ["Es sind genau vier Dinge, also reicht das immer", "Jedes Lebensmittel steht für einen anderen der vier Bausteine", "Alle vier Lebensmittel stehen bei den Extras"], 1, "Bei diesem Picknick sind die vier verschiedenen Frühstücksbausteine dabei."),
  },
];

const pruefungen = [
  { title: "Majas aktiver Tag", tasks: [
    ["fit", einzeln("Maja war lange auf dem Spielplatz. Was hilft ihr, sich zu erholen?", ["Noch schneller laufen", "Eine ruhige Pause machen", "Die Trinkflasche stehen lassen"], 1, "Eine Pause gibt dem Körper Zeit zur Erholung.")],
    ["labor", einzeln("Was liefert unter anderem Energie für Bewegung?", ["Kohlenhydrate", "Kohlensäure", "Calcium allein"], 0, "Kohlenhydrate können deinem Körper Energie liefern.")],
    ["ballast", mehrfach("In welchen zwei Brotdosen findest du eine typische Ballaststoffquelle?", ["In der mit Haferflocken", "In der mit Käsewürfeln", "In der mit einer Möhre", "In der mit einem gekochten Ei"], [0,2], "Haferflocken und Möhren enthalten Ballaststoffe.")],
    ["pyramide", einzeln("Was bedeutet Grün in der Pyramide?", ["Sparsam genießen", "Nur im Sommer essen", "Reichlich auswählen"], 2, "Grün steht für eine reichliche Auswahl aus diesen Gruppen.")],
    ["fruehstueck", einzeln("Bärli hat Wasser, Brot und Quark. Welche Auswahl füllt den noch fehlenden Baustein?", ["Apfel", "Milch", "Haferflocken"], 0, "Apfel gehört zu Obst oder Gemüse.")],
    ["zucker", einzeln("Bei einem Getränk steht „davon Zucker: 5 g je 100 ml“. Wie viel Zucker steckt in 100 ml?", ["0 g", "5 g", "50 g"], 1, "Die Angabe bezieht sich bereits auf 100 ml.")],
    ["pyramide", einzeln("Wohin gehören Kichererbsen?", ["Getränke", "Extras", "Hülsenfrüchte, Fisch, Fleisch und Eier"], 2, "Kichererbsen sind Hülsenfrüchte.")],
    ["geschichte", mehrfach("Was kann Maja beim Picknick zum Durstlöschen mitnehmen?", ["Leitungswasser", "Cola", "Ungezuckerten Kräutertee", "Gezuckerte Limonade"], [0,2], "Wasser und ungesüßter Kräutertee sind gute Durstlöscher.")],
  ]},
  { title: "Bärlis Frühstück", tasks: [
    ["fit", mehrfach("Was hilft Bärli nach einem aktiven Tag, sich zu erholen?", ["Schlafen", "Ohne Pause weiterturnen", "Ruhig lesen", "Absichtlich wach bleiben"], [0,2], "Schlaf und ruhige Beschäftigung können bei der Erholung helfen.")],
    ["labor", einzeln("Welche Aufgabe hat Eiweiß im Körper?", ["Es ersetzt Wasser", "Es dient als Baustoff", "Es färbt Lebensmittel grün"], 1, "Eiweiß dient dem Körper unter anderem als Baustoff für Muskeln.")],
    ["ballast", einzeln("Warum können manche Ballaststoffe den Stuhl weicher machen?", ["Sie binden Wasser", "Sie verwandeln sich in Luft", "Sie ersetzen alle Getränke"], 0, "Manche Ballaststoffe können Wasser binden.")],
    ["pyramide", einzeln("Zu welcher Gruppe gehört Rapsöl?", ["Getränke", "Nüsse und Saaten", "Öle und Fette"], 2, "Rapsöl ist ein Speiseöl.")],
    ["fruehstueck", mehrfach("Welche zwei passen als Getreidebaustein in Bärlis Frühstück?", ["Haferflocken", "Naturjoghurt", "Vollkornbrot", "Gurke"], [0,2], "Haferflocken und Vollkornbrot sind Getreideprodukte.")],
    ["zucker", einzeln("Eine Schorle enthält 3 g Zucker je 100 ml. Wie viel sind es bei 200 ml?", ["3 g", "6 g", "9 g"], 1, "200 ml sind doppelt so viel. 3 g plus 3 g ergeben 6 g.")],
    ["pyramide", einzeln("Auf welcher Ebene steht Schokolade?", ["An der Spitze bei den Extras", "Ganz unten bei den Getränken", "Bei Obst und Gemüse"], 0, "Schokolade gehört zu den Extras oben in der Pyramide.")],
    ["geschichte", einzeln("Stern hat einen Apfel, Naturjoghurt, Wasser und Brot dabei. Welche Änderung behält alle vier Bausteine?", ["Das Wasser weglassen", "Den Joghurt durch noch mehr Brot ersetzen", "Den Apfel durch Gurke ersetzen"], 2, "Gurke und Apfel gehören zum selben Baustein, Obst oder Gemüse.")],
  ]},
  { title: "Stern liest Etiketten", tasks: [
    ["fit", einzeln("Maja hat Sport und möchte Wasser mitnehmen. Wann passt eine Trinkpause?", ["Erst am nächsten Morgen", "Auch zwischendurch, wenn sie durstig ist", "Nur wenn sie vorher gewonnen hat"], 1, "Maja kann auch zwischendurch etwas trinken.")],
    ["labor", einzeln("Warum braucht dein Körper Wasser?", ["Um unter anderem seine Temperatur zu regeln", "Weil es alle Baustoffe ersetzt", "Weil es wie Zucker Energie liefert"], 0, "Wasser hilft unter anderem beim Regeln der Körpertemperatur.")],
    ["ballast", mehrfach("Welche zwei Lebensmittel liefern typischerweise Ballaststoffe?", ["Linsen", "Quark", "Ei", "Apfel"], [0,3], "Linsen und Äpfel sind pflanzliche Ballaststoffquellen.")],
    ["pyramide", einzeln("Welche Gruppe steht ganz unten?", ["Extras", "Getränke", "Nüsse und Saaten"], 1, "Getränke wie Wasser und ungesüßter Tee bilden die Basis.")],
    ["fruehstueck", einzeln("Stern wählt Wasser, Haferflocken und eine Banane. Welche Ergänzung passt?", ["Apfel", "Reis", "Quark"], 2, "Quark ergänzt den Milchprodukt-Baustein.")],
    ["zucker", einzeln("Ein Getränk hat 6 g Zucker je 100 ml, das andere 8 g je 100 ml. Was lässt sich direkt vergleichen?", ["Wie viel Zucker die gleiche Menge enthält", "Welches Getränk größer abgefüllt ist", "Wie viele Schlucke jede Person braucht"], 0, "Beide Werte beziehen sich auf dieselben 100 ml.")],
    ["zucker", einzeln("Apfelsaft hat laut Etikett 10 g Zucker je 100 ml. Was kannst du daraus ablesen?", ["Der ganze Zucker wurde zugesetzt", "100 ml enthalten insgesamt 10 g Zucker", "Apfelsaft enthält keinen natürlichen Zucker"], 1, "„Davon Zucker“ gibt die Gesamtmenge an.")],
    ["geschichte", einzeln("Für die Pause hat Bärli Käse, Möhren und Wasser. Welcher Baustein fehlt?", ["Milchprodukt", "Obst oder Gemüse", "Brot oder Getreide"], 2, "Käse, Möhren und Wasser sind dabei. Brot oder Getreide fehlt.")],
  ]},
  { title: "Picknick auf der Wiese", tasks: [
    ["fit", einzeln("Welche Beschäftigung zählt zu Bewegung?", ["Mit Stern über den Hof tanzen", "Das Fahrrad nur anschauen", "Im Sitzen ein Bild ausmalen"], 0, "Beim Tanzen bewegst du den Körper und setzt Muskeln ein.")],
    ["labor", einzeln("Welches Beispiel zeigt eine Aufgabe von Fett?", ["Es ersetzt alle Vitamine", "Es hilft bei der Aufnahme bestimmter Vitamine", "Es enthält grundsätzlich keine Energie"], 1, "Der Körper braucht Fett auch zur Aufnahme mancher Vitamine.")],
    ["ballast", einzeln("Welches Brot ist meistens ballaststoffreicher?", ["Ein Brötchen aus hellem Weizenmehl", "Das hängt nur vom Belag ab", "Ein Vollkornbrot"], 2, "Vollkornprodukte enthalten meist mehr Ballaststoffe als Produkte aus hellem Mehl.")],
    ["pyramide", mehrfach("Welche zwei gehören in die Gruppe Nüsse und Saaten?", ["Sonnenblumenkerne", "Kartoffeln", "Haselnüsse", "Kichererbsen"], [0,2], "Sonnenblumenkerne sind Saaten. Haselnüsse sind Nüsse.")],
    ["fruehstueck", einzeln("Was sind im Unterricht die vier Frühstücksbausteine?", ["Getränk, Obst oder Gemüse, Brot oder Getreide und Milchprodukt", "Brot, Getreide, Nudeln und Reis", "Getränk, Süßigkeiten, Nüsse und Öl"], 0, "Das Pyramidenfrühstück kombiniert diese vier verschiedenen Bausteine.")],
    ["zucker", einzeln("Auf einem festen Müsli steht „davon Zucker: 12 g je 100 g“. Womit lässt sich das direkt vergleichen?", ["Mit einem Getränk je Flasche", "Mit einem anderen Müsli je 100 g", "Mit einem anderen Müsli je Esslöffel"], 1, "Vergleiche bei festen Lebensmitteln die gleiche Masse.")],
    ["pyramide", einzeln("Warum ist die Pyramide an der Spitze besonders schmal?", ["Extras passen dort in kleinerer Menge hin", "Alle Lebensmittel oben sind klein", "Alle Lebensmittel oben sind leicht"], 0, "Oben stehen die Extras, für die kleinere Mengen vorgesehen sind.")],
    ["geschichte", mehrfach("Welche zwei Dinge helfen Bärli direkt nach einem langen Spiel?", ["Wasser trinken", "Die ganze Zeit schneller rennen", "Eine kurze Pause machen", "Die Trinkflasche wegwerfen"], [0,2], "Eine Trinkpause hilft ihm, sich von der Anstrengung zu erholen.")],
  ]},
  { title: "Die große Entdeckerrunde", tasks: [
    ["fit", einzeln("Bärli will fit durch den Tag kommen. Was gehört außer Bewegung und Essen dazu?", ["Immer das gleiche Spiel", "Den ganzen Tag wach bleiben", "Trinken und Erholung"], 2, "Der Körper braucht auch Wasser und Erholung.")],
    ["labor", mehrfach("Welche zwei Aussagen über Nährstoffe stimmen?", ["Kohlenhydrate können Energie liefern", "Eiweiß hilft dem Körper beim Wachsen", "Vitamine ersetzen alle anderen Stoffe", "Alle Lebensmittel enthalten genau einen Stoff"], [0,1], "Kohlenhydrate können Energie liefern. Eiweiß dient unter anderem als Baustoff.")],
    ["ballast", einzeln("Welches Beispiel verbindet eine Ballaststoffquelle mit einem Getränk zum Durstlöschen?", ["Käse und Milch", "Linsen und Wasser", "Milch und ein Ei"], 1, "Linsen liefern Ballaststoffe. Wasser ist ein guter Durstlöscher.")],
    ["pyramide", einzeln("Wo gehört ein Glas Milch im Pyramidenmodell hin?", ["Zu Milch und Milchprodukten", "Unten zu den grünen Getränken", "Oben zu den Extras"], 0, "Milch zählt in diesem Modell zu den Milchprodukten.")],
    ["fruehstueck", mehrfach("Welche zwei Dinge ergänzen Wasser und eine Möhre zu einem Pyramidenfrühstück?", ["Ein Apfel", "Ein Vollkornbrötchen", "Käse", "Ungesüßter Tee"], [1,2], "Das Brötchen ergänzt Getreide. Käse ergänzt Milchprodukte.")],
    ["zucker", einzeln("Ein Getränk hat 7 g Zucker je 100 ml. Wie viel steckt in zwei gleich großen Portionen zu je 100 ml?", ["7 g", "17 g", "14 g"], 2, "7 g plus 7 g ergeben 14 g.")],
    ["pyramide", einzeln("Welche Gruppe hat in der Pyramide die Ampelfarbe Gelb?", ["Öle und Fette", "Wasser und ungesüßter Tee", "Süße Limonade"], 0, "Öle und Fette stehen im gelben Bereich.")],
    ["geschichte", einzeln("Stern erklärt seine Auswahl für das Picknick. Welche Begründung passt?", ["Ich nehme Limo, weil sie zur grünen Basis gehört.", "Ich nehme Wasser mit, weil ich nach dem Spielen durstig sein kann.", "Ich lege die Gurke zu den Milchprodukten, weil sie Wasser enthält."], 1, "Wasser ist ein passender Durstlöscher für die Spielpause.")],
  ]},
];

const nachfragen = {
  fit: [
    einzeln("Maja springt draußen Seil. Was gehört zu einer guten Pause?", ["Weiter springen und nichts trinken", "Sich kurz hinsetzen und Wasser trinken", "Erst zu Hause am Abend etwas trinken"], 1, "Eine kurze Erholungspause und Wasser unterstützen Maja beim Spielen."),
    einzeln("Was packt Stern für einen bewegten Nachmittag ein?", ["Wasser und einen abwechslungsreichen Snack", "Nur eine leere Trinkflasche", "Zwei Spielsachen und nichts zu trinken"], 0, "Wasser hilft gegen Durst. Ein Snack kann später Energie liefern."),
  ],
  labor: [
    einzeln("Was braucht Bärlis Körper auch im Schlaf?", ["Energie, damit Herz und Atmung weiterarbeiten", "Energie erst wieder beim Frühstück", "Energie nur, wenn er sich im Schlaf umdreht"], 0, "Auch beim Schlafen arbeiten Organe und verbrauchen Energie."),
    einzeln("Welche Aussage über Kohlenhydrate und Eiweiß stimmt?", ["Beide Stoffe sind dasselbe", "Eiweiß ist ein Baustoff. Kohlenhydrate können Energie liefern.", "Kohlenhydrate sind nur im Wasser. Eiweiß ist nur im Brot."], 1, "Kohlenhydrate können Energie liefern. Eiweiß braucht der Körper unter anderem zum Wachsen."),
  ],
  ballast: [
    einzeln("Was kann Stern essen, wenn er eine ballaststoffreiche Beilage sucht?", ["Eine Portion Kichererbsen", "Einen Löffel Naturjoghurt", "Eine Scheibe Käse"], 0, "Kichererbsen sind Hülsenfrüchte und liefern Ballaststoffe."),
    einzeln("Bärli tauscht sein helles Brötchen gegen ein Vollkornbrötchen. Was ist meist anders?", ["Das Vollkornbrötchen enthält meist weniger Ballaststoffe.", "Die Mehlart kann bei Ballaststoffen keine Rolle spielen.", "Das Vollkornbrötchen enthält meist mehr Ballaststoffe."], 2, "Vollkorn enthält mehr Bestandteile des ganzen Korns und meist mehr Ballaststoffe."),
  ],
  pyramide: [
    einzeln("Maja räumt Butter und Haselnüsse ein. Wie ordnet sie richtig zu?", ["Beides gehört zu Obst und Gemüse.", "Butter gehört zu Ölen und Fetten, Haselnüsse zu Nüssen und Saaten.", "Butter und Haselnüsse stehen beide unten bei Getränken."], 1, "Butter ist ein Streichfett. Haselnüsse sind Nüsse."),
    einzeln("Bärli legt einen Apfel und einen Keks aus. Welche Zuordnung stimmt?", ["Apfel: Obst und Gemüse. Keks: Extras.", "Apfel: Extras. Keks: Obst und Gemüse.", "Beide gehören zu den Getränken."], 0, "Der Apfel ist Obst. Kekse gehören in die Spitze der Pyramide zu den Extras."),
  ],
  fruehstueck: [
    einzeln("Welches zweite Frühstück passt zu allen vier Bausteinen?", ["Wasser, Vollkornbrötchen und zwei Äpfel", "Käse, Joghurt, Quark und Milch", "Ungesüßter Tee, Gurke, Haferflocken und Naturjoghurt"], 2, "Tee ist das Getränk, Gurke ist Gemüse, Haferflocken sind Getreide und Naturjoghurt ist ein Milchprodukt."),
    einzeln("Stern hat Tee, Gurke und Käse. Was fehlt noch für ein Pyramidenfrühstück?", ["Ein Vollkornbrötchen", "Eine Banane", "Noch ein Glas Tee"], 0, "Brot oder Getreide fehlt noch. Ein Vollkornbrötchen passt."),
  ],
  zucker: [
    einzeln("Auf zwei Flaschen steht 3 g und 8 g Zucker, beide je 100 ml. Was kann Maja sagen?", ["Die erste Flasche ist größer.", "Bei gleich viel Getränk enthält das zweite mehr Zucker.", "Beide Getränke enthalten gleich viel Zucker."], 1, "Gleiche Getränkemenge, unterschiedliche Grammzahl: 8 g sind mehr als 3 g."),
    einzeln("Ein Glas hat 100 ml Apfelschorle mit 5 g Zucker. Wie viel Zucker steckt in 200 ml derselben Schorle?", ["5 g", "15 g", "10 g"], 2, "200 ml sind zweimal 100 ml. Zweimal 5 g ergeben 10 g."),
  ],
  geschichte: [
    einzeln("Stern bringt Wasser, Brot, Quark und Apfel mit. Warum passt das zum Frühstücksmodell?", ["Wasser und Apfel gehören beide zu den Getränken.", "Jedes davon gehört zu einem anderen der vier Frühstücksbausteine.", "Ein Frühstück besteht immer aus genau diesen vier Lebensmitteln."], 1, "Wasser, Brot, Quark und Apfel stehen für vier verschiedene Bausteine. Du kannst auch anders kombinieren."),
    einzeln("Stern ersetzt im Frühstück die Möhre durch eine Birne. Was bleibt gleich?", ["Die Birne füllt weiterhin den Baustein Obst oder Gemüse.", "Die Birne füllt jetzt den Baustein Getreide.", "Der Baustein Obst oder Gemüse fällt weg."], 0, "Möhre und Birne sind verschiedene Lebensmittel. Im Frühstücksmodell gehören beide zum selben Baustein."),
  ],
};

const schriftaufgabe = (text, beispiel, kriterien) => ({ text, beispiel, kriterien });
const schriftaufgaben = [
  [
    schriftaufgabe("Im Energiekreis fehlen drei Sätze. Ergänze die Lücken in der richtigen Reihenfolge: Bewegung → (1) → Essen und Trinken → (2) → neue Energie → (3).", "1. Ich habe Hunger. 2. Ich bin satt. 3. Ich möchte mich bewegen.", ["Deine drei Sätze stehen in der richtigen Reihenfolge.", "Man versteht, wie Hunger, Essen, Sättigung und Bewegung im Modell zusammenhängen."]),
    schriftaufgabe("Bärli meint: „Wenn ich still lese, braucht mein Körper keine Energie.“ Erkläre ihm in einem Satz, was sein Körper beim Lesen trotzdem tut.", "Dein Körper braucht auch beim Lesen Energie, weil zum Beispiel dein Herz weiter schlägt, du atmest und dein Gehirn arbeitet.", ["Du schreibst, dass der Körper auch beim Lesen Energie braucht.", "Du nennst mindestens ein passendes Beispiel, etwa Herzschlag, Atmung oder Denken."]),
  ],
  [
    schriftaufgabe("Stelle ein Pyramidenfrühstück zusammen. Schreibe neben jedes der vier Lebensmittel, zu welchem Baustein es gehört.", "Wasser – Getränk, Gurke – Obst oder Gemüse, Haferflocken – Brot oder Getreide, Naturjoghurt – Milchprodukt.", ["Alle vier verschiedenen Bausteine sind vertreten.", "Du ordnest jedes Lebensmittel seinem passenden Baustein zu. Andere passende Lebensmittel sind möglich."]),
    schriftaufgabe("Maja nimmt für ihre Brotdose Vollkornbrot. Erkläre, was daran dem Darm helfen kann.", "Vollkornbrot enthält Ballaststoffe. Sie unterstützen die Verdauung im Darm.", ["Du verwendest das Wort Ballaststoffe.", "Du erklärst, dass sie die Verdauung unterstützen."]),
  ],
  [
    schriftaufgabe("Die Apfelschorle enthält 4 g Zucker je 100 ml. Der Apfelsaft enthält 10 g Zucker je 100 ml. Berechne die Zuckermenge für je 200 ml. Schreibe beide Ergebnisse mit Einheit auf.", "Apfelschorle: 4 g + 4 g = 8 g. Apfelsaft: 10 g + 10 g = 20 g.", ["Du verdoppelst beide Angaben und erhältst 8 g und 20 g.", "Du schreibst die Einheit g zu beiden Ergebnissen."]),
    schriftaufgabe("Stern will eine kleine Flasche Schorle und einen großen Saftkarton vergleichen. Erkläre, welche Angabe er auf beiden Verpackungen suchen soll und warum.", "Stern sucht bei beiden Getränken „davon Zucker je 100 ml“. So vergleicht er gleich viel Getränk, obwohl die Packungen unterschiedlich groß sind.", ["Du nennst die Zuckermenge je 100 ml auf beiden Packungen.", "Du erklärst, dass damit dieselbe Getränkemenge verglichen wird."]),
  ],
  [
    schriftaufgabe("Beschrifte die Lebensmittel für das Picknick. Nenne die Pyramiden-Gruppe für Leitungswasser, Möhren, Vollkornbrot und Schokolade.", "Leitungswasser – Getränke, Möhren – Obst und Gemüse, Vollkornbrot – Brot, Getreide und Beilagen, Schokolade – Extras.", ["Du ordnest Wasser, Möhren und Vollkornbrot den drei passenden Gruppen zu.", "Du ordnest Schokolade den Extras zu."]),
    schriftaufgabe("Nach dem Parcours braucht Bärli eine Pause. Was kann er jetzt tun? Nenne zwei Dinge und begründe eins davon.", "Bärli setzt sich auf die Bank und trinkt Wasser. Wasser löscht seinen Durst nach dem Spielen.", ["Du nennst zwei passende Dinge, zum Beispiel ruhen und trinken.", "Du begründest mindestens einen Vorschlag."]),
  ],
  [
    schriftaufgabe("Trage je einen Fachbegriff ein. (1) Dieser Stoff dient als Baustoff für Muskeln. (2) Diese pflanzlichen Bestandteile helfen der Verdauung. (3) Dieser Mineralstoff ist wichtig für Knochen und Zähne.", "1. Eiweiß. 2. Ballaststoffe. 3. Calcium.", ["Deine Antworten passen in die angegebenen Lücken.", "Für Eiweiß sind auch Protein und für Calcium ist auch Kalzium richtig."]),
    schriftaufgabe("Maja stellt aus Wasser, Äpfeln, Haferflocken und Quark ein Frühstück zusammen. Tausche genau ein Lebensmittel aus und erkläre, warum alle vier Bausteine weiterhin enthalten sind.", "Ich tausche den Apfel gegen eine Möhre. Möhre und Apfel gehören beide zum Baustein Obst oder Gemüse. Wasser, Haferflocken und Quark bleiben dabei.", ["Du tauschst genau ein Lebensmittel aus.", "Dein Ersatz gehört zum gleichen Baustein und du erklärst das."]),
  ],
];

const koerperZuordnung = [
  { aufgabe: "Du bewegst dich viel: Du fährst Rad, läufst und skatest.", stoff: "Kohlenhydrate", buchstabe: "K", grund: "Kohlenhydrate können deinem Körper Energie für Bewegung liefern." },
  { aufgabe: "Deine Knochen und Zähne sind stabil.", stoff: "Mineralstoffe", buchstabe: "A", grund: "Der Mineralstoff Calcium ist unter anderem wichtig für Knochen und Zähne." },
  { aufgabe: "Dein Körper speichert Energie als Reserve.", stoff: "Fett", buchstabe: "L", grund: "Körperfett dient als Energiespeicher. Der Körper kann überschüssige Energie aus verschiedenen Nährstoffen darin speichern." },
  { aufgabe: "Nährstoffe werden durch deinen Körper transportiert.", stoff: "Flüssigkeit", buchstabe: "O", grund: "Wasser ist Bestandteil des Blutes und hilft beim Transport von Nährstoffen." },
  { aufgabe: "Dein Körper baut Muskeln auf und wächst.", stoff: "Eiweiß", buchstabe: "R", grund: "Eiweiß ist ein wichtiger Baustoff. Für kräftige Muskeln sind auch Bewegung und Erholung wichtig." },
  { aufgabe: "Deine Körperabwehr kann gut arbeiten.", stoff: "Vitamine", buchstabe: "I", grund: "Vitamine unterstützen verschiedene Körperfunktionen, zum Beispiel die Körperabwehr. Auch mit genügend Vitaminen kannst du krank werden." },
  { aufgabe: "Deine Verdauung wird unterstützt.", stoff: "Ballaststoffe", buchstabe: "E", grund: "Ballaststoffe unterstützen die Verdauung im Darm. Regelmäßiges Trinken und Bewegung helfen ebenfalls." },
];
