/* Bärlis Adventskalender: 24 Geschichten, echte Schrank-/Baumhausgeschenke und Spiel-Level.
 * Öffnen ab dem jeweiligen Dezembertag; ältere Türchen bleiben erreichbar.
 * Keine echten Käufe, Datenübertragung oder künstlichen Termindruck.
 */
(function(){
'use strict';
const STORE='majas-wortwerkstatt-advent-v1';
const STORIES=[
  {
    "day": 1,
    "title": "Die geheimnisvolle Sternenpost",
    "story": "✉️",
    "icon": "Als Bärli morgens die Baumhaustreppe hinaufstieg, hörte er ein leises Klingeln. Zwischen zwei Zweigen klemmte ein Brief mit einem goldenen Stern. „Für Bärli und Maja“, stand darauf. Die Wichtel Tomke und Tumetott schrieben, dass im Dezember vierundzwanzig kleine Überraschungen auf sie warteten. Bärli setzte sich auf seinen blauen Sitzsack und grinste. „Dann fangen wir heute an!“, sagte er. Draußen glitzerte der erste Frost.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-weihnachtsmuetze"
    },
    "quiz": {
      "prompt": "Welches Wort ist ein Nomen?",
      "options": [
        "glitzern",
        "Brief",
        "leise"
      ],
      "correct": 1,
      "why": "Ein Brief ist ein Gegenstand und deshalb ein Nomen."
    }
  },
  {
    "day": 2,
    "title": "Ein weiches Wolkenkissen",
    "story": "☁️",
    "icon": "Maja wollte im Baumhaus eine gemütliche Leseecke bauen. Bärli holte eine Decke, doch irgendetwas fehlte. Minka sprang auf den Sitzsack, drehte sich dreimal und miaute: „Miau!“ „Du hast recht“, lachte Maja. „Ein Kissen macht es erst richtig bequem.“ Bärli stellte sich vor, wie alle gemeinsam Geschichten lesen würden. Als die Sonne hinter den Bäumen verschwand, fühlte sich das Baumhaus plötzlich wie ein kleines Zuhause an.",
    "reward": {
      "type": "house",
      "id": "kissen"
    },
    "quiz": {
      "prompt": "Welches Wort beschreibt, wie sich das Kissen anfühlt?",
      "options": [
        "weich",
        "springen",
        "Baum"
      ],
      "correct": 0,
      "why": "Weich ist ein Adjektiv und beschreibt das Kissen."
    }
  },
  {
    "day": 3,
    "title": "Ein Regentag voller Spuren",
    "story": "🌧️",
    "icon": "Auf dem Weg zum Baumhaus klatschten dicke Regentropfen in die Pfützen. Fuji blieb vor einem winzigen Fußabdruck stehen. „Vielleicht war hier ein Wichtel unterwegs!“, flüsterte Maja. Bärli zog seine Kapuze tief ins Gesicht und folgte der Spur bis zu einem Baumstumpf. Dort lag eine rote Schleife. „Die gehört bestimmt Tomke“, vermutete er. Dann mussten alle lachen: Auf der Schleife saß eine winzige Schnecke, die ebenfalls vor dem Regen Schutz suchte.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-gelbmantel"
    },
    "quiz": {
      "prompt": "Was entdecken die Freunde auf dem Baumstumpf?",
      "options": [
        "einen Schlüssel",
        "eine rote Schleife",
        "ein Buch"
      ],
      "correct": 1,
      "why": "Auf dem Baumstumpf liegt eine rote Schleife."
    }
  },
  {
    "day": 4,
    "title": "Das Buch mit dem Knisterstern",
    "story": "📖",
    "icon": "Bärli entdeckte hinter einem Brett im Baumhaus ein dünnes Buch. Auf dem Einband funkelte ein Stern, und beim Aufschlagen knisterten die Seiten wie trockenes Laub. Maja las vor: „Wer freundlich teilt, findet doppelt so viel Freude.“ Fuji legte seine Pfote auf das Buch, als wollte er zustimmen. „Das behalten wir“, entschied Bärli. Am Abend erzählte er Minka die Geschichte noch einmal, ganz langsam und mit lustigen Stimmen.",
    "reward": {
      "type": "house",
      "id": "buch-weihnachten"
    },
    "quiz": {
      "prompt": "Was bedeutet „vorlesen“?",
      "options": [
        "einen Text laut lesen",
        "ein Bild malen",
        "ein Buch verstecken"
      ],
      "correct": 0,
      "why": "Vorlesen bedeutet, einen Text laut für andere zu lesen."
    }
  },
  {
    "day": 5,
    "title": "Die Wichtelweste",
    "story": "🧝",
    "icon": "Unter dem Fenster lag ein winziges Paket mit grünem Papier. Bärli öffnete es vorsichtig. Heraus fiel eine Weste mit goldenen Knöpfen. „Ob die mir passt?“, fragte er. Maja hielt sie an seinen Bauch. Tatsächlich! Als Bärli sich darin drehte, klimperten die Knöpfe leise wie Glöckchen. „Tomke hat gut gemessen“, sagte Maja. Bärli verbeugte sich feierlich und erklärte: „Ich bin heute der freundlichste Wichtel des ganzen Waldes!“",
    "reward": {
      "type": "wardrobe",
      "id": "saison-elfenweste"
    },
    "quiz": {
      "prompt": "Welche Endung passt zu „freundlich“ als Nomen?",
      "options": [
        "-keit",
        "-schaft",
        "-ung"
      ],
      "correct": 0,
      "why": "Aus freundlich wird die Freundlichkeit."
    }
  },
  {
    "day": 6,
    "title": "Ein Baum zum Nikolaustag",
    "story": "🎅",
    "icon": "Am Nikolausmorgen stand ein kleiner Tannenbaum vor der Baumhaustür. Niemand wusste, wer ihn hingestellt hatte. Bärli schnupperte an den Zweigen. „Er riecht nach Wald und Winter“, sagte er. Maja stellte den Baum sorgfältig in eine Ecke. Fuji schob aus Versehen eine Zapfenkugel davor, und Minka betrachtete den neuen Gast misstrauisch. Dann entschieden alle: Der Baum durfte bleiben. Aber die Lichter sollten sie erst zusammen anbringen.",
    "reward": {
      "type": "house",
      "id": "weihnachtsbaum"
    },
    "quiz": {
      "prompt": "Was stellen die Freunde im Baumhaus auf?",
      "options": [
        "einen Apfelbaum",
        "einen Tannenbaum",
        "einen Regenschirm"
      ],
      "correct": 1,
      "why": "Zum Nikolaustag kommt ein kleiner Tannenbaum ins Baumhaus."
    }
  },
  {
    "day": 7,
    "title": "Das Geheimnis der Schneekugel",
    "story": "❄️",
    "icon": "Bärli schüttelte eine Schneekugel. Tausend silberne Punkte wirbelten durch das Glas. „Wie ein richtiger Schneesturm!“, rief er. Maja sah genauer hin und entdeckte ein winziges Haus unter einer weißen Schneedecke. „Vielleicht wohnen dort die Wichtel“, überlegte sie. Bärli stellte die Kugel ans Fenster. Immer wenn er vorbeiging, schüttelte er sie ein kleines bisschen. Und jedes Mal schien die Welt im Glas noch geheimnisvoller zu werden.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-schneekugel"
    },
    "quiz": {
      "prompt": "Welches Wort ist die Mehrzahl von „Haus“?",
      "options": [
        "Hause",
        "Häuser",
        "Hausen"
      ],
      "correct": 1,
      "why": "Ein Haus, viele Häuser."
    }
  },
  {
    "day": 8,
    "title": "Bärlis rasante Nomenfahrt",
    "story": "🏎️",
    "icon": "Im Schnee hinter dem Baumhaus hatte Fuji einen kleinen Parcours markiert. Auf jedem Schild stand ein Wort: „Schlitten“, „rennen“, „warm“, „Stern“. Bärli setzte sich in sein Go-Kart. „Ich sammle nur Nomen!“, verkündete er. Bei „Schlitten“ griff er zu, bei „rennen“ fuhr er geschickt vorbei. Maja applaudierte. Am Ende des Parcours lag ein Brief: „Eine neue Runde gehört jetzt dir!“ Bärli strahlte. Lernen konnte wirklich ein Abenteuer sein.",
    "reward": {
      "type": "game",
      "id": "kart:4"
    },
    "quiz": {
      "prompt": "Welches Wort ist ein Nomen?",
      "options": [
        "rennen",
        "warm",
        "Stern"
      ],
      "correct": 2,
      "why": "Der Stern ist ein Nomen, die anderen Wörter nicht."
    }
  },
  {
    "day": 9,
    "title": "Pfützenspringen im Dezember",
    "story": "🥾",
    "icon": "Über Nacht war der Schnee geschmolzen. Auf dem Waldweg lagen riesige Pfützen. Bärli wollte trotzdem zur Wichtelpost. Er sprang über die erste Pfütze, landete in der zweiten und spritzte Fuji nass. „Oh!“, rief Bärli erschrocken. Doch Fuji schüttelte sein Fell und wedelte fröhlich mit dem Schwanz. Maja half Bärli, die nassen Pfoten abzutrocknen. „Für solche Wege brauche ich richtige Gummistiefel“, beschloss er. Jetzt konnte das nächste Abenteuer beginnen.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-gummistiefel"
    },
    "quiz": {
      "prompt": "Was ist die Mehrzahl von „Pfütze“?",
      "options": [
        "Pfützen",
        "Pfützes",
        "Pfütze"
      ],
      "correct": 0,
      "why": "Eine Pfütze, viele Pfützen."
    }
  },
  {
    "day": 10,
    "title": "Die erste Lichterkette",
    "story": "💡",
    "icon": "Maja brachte eine Lichterkette ins Baumhaus. „Nicht zu hoch“, mahnte Bärli, der auf seinem Sitzsack saß und die Leiter beobachtete. Fuji reichte die Schnur an, Minka hielt sie für ein Spielzeug. Als endlich alles hing, zählten die Freunde gemeinsam bis drei. Ein warmes Licht leuchtete an der Wand. „Jetzt sieht unser Baumhaus aus wie ein Sternenhimmel“, flüsterte Bärli. Sogar die Wichtelpost glänzte plötzlich golden.",
    "reward": {
      "type": "house",
      "id": "lichterkette"
    },
    "quiz": {
      "prompt": "Welches Wort ist ein zusammengesetztes Nomen?",
      "options": [
        "Lichterkette",
        "leuchten",
        "hell"
      ],
      "correct": 0,
      "why": "Lichterkette besteht aus Lichter und Kette."
    }
  },
  {
    "day": 11,
    "title": "Der festliche Schneetanz",
    "story": "💃",
    "icon": "Maja fand eine rote Festkleidung in der Wichtelkiste und hielt sie vor Bärli. „Ein Weihnachtskleid!“, sagte sie. „Damit können wir heute eine kleine Theateraufführung machen.“ Bärli zog es vorsichtig an und drehte sich auf dem Teppich. Fuji spielte den Winterwind, Minka den Schneesturm und Maja erzählte die Geschichte. Am Ende verbeugten sie sich alle. Niemand hatte Zuschauer gebraucht, denn zusammen spielen machte schon genug Spaß.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-weihnachtskleid"
    },
    "quiz": {
      "prompt": "Was bedeutet „sich verbeugen“?",
      "options": [
        "sich zur Begrüßung oder zum Dank neigen",
        "weggehen",
        "schnell rennen"
      ],
      "correct": 0,
      "why": "Nach einer Aufführung verbeugen sich die Darsteller oft zum Dank."
    }
  },
  {
    "day": 12,
    "title": "Das Nachttisch-Rätsel",
    "story": "🛏️",
    "icon": "Auf dem Fußboden lag ein Zettel: „Ich bin klein, stehe neben dem Bett und passe auf dein Buch auf.“ Bärli las die Zeilen zweimal. „Ein Bücherregal?“, fragte er. Maja schüttelte den Kopf. „Das steht meistens an der Wand.“ Dann hatte Bärli die Idee. „Ein Nachttisch!“ Genau in diesem Moment klopfte es an der Tür. Vor dem Baumhaus stand ein kleines Paket. Bärli konnte kaum erwarten, es auszupacken und einzurichten.",
    "reward": {
      "type": "house",
      "id": "nachttisch"
    },
    "quiz": {
      "prompt": "Welches Möbelstück gehört neben das Bett?",
      "options": [
        "Nachttisch",
        "Gartenbank",
        "Baumstamm"
      ],
      "correct": 0,
      "why": "Der Nachttisch steht normalerweise neben dem Bett."
    }
  },
  {
    "day": 13,
    "title": "Das Rentier mit der roten Nase",
    "story": "🦌",
    "icon": "Im Wald entdeckte Bärli eine Zeichnung von einem Rentier. Es hatte eine leuchtend rote Nase und ein lustiges Geweih. „Das male ich auf meinen Pullover“, sagte er. Maja half beim Zeichnen. Fuji legte seinen Kopf schief und sah zu, wie aus zwei runden Augen und einem Nasenpunkt ein freundliches Tier wurde. „Du siehst darin aus wie ein richtiges Weihnachtsrentier!“, lachte Maja. Bärli war so stolz, dass er sofort ein Foto für die Wichtelpost machen wollte.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-rentierpullover"
    },
    "quiz": {
      "prompt": "Welches Wort bezeichnet ein Tier?",
      "options": [
        "freundlich",
        "Rentier",
        "malen"
      ],
      "correct": 1,
      "why": "Das Rentier ist ein Tier und damit ein Nomen."
    }
  },
  {
    "day": 14,
    "title": "Die Decke mit den Sternen",
    "story": "🌟",
    "icon": "Am Abend wurde es im Baumhaus kühl. Bärli zog die blaue Decke über die Pfoten und schaute aus dem Fenster. „Heute würde ich am liebsten hier schlafen“, sagte er. Maja entdeckte in der Wichtelkiste eine festliche Bettwäsche. „Damit wird es noch gemütlicher.“ Gemeinsam falteten sie die Decke glatt und legten das Kissen zurecht. Draußen funkelten die ersten Sterne. Bärli gähnte zufrieden. Das Baumhaus fühlte sich immer mehr wie ein echter Lieblingsort an.",
    "reward": {
      "type": "house",
      "id": "bettwaesche-weihnachten"
    },
    "quiz": {
      "prompt": "Was ist die Mehrzahl von „Decke“?",
      "options": [
        "Decken",
        "Deckes",
        "Deck"
      ],
      "correct": 0,
      "why": "Eine Decke, viele Decken."
    }
  },
  {
    "day": 15,
    "title": "Die kugelrunde Überraschung",
    "story": "🔴",
    "icon": "Minka schlich heimlich um den Tannenbaum. An einem Zweig hing plötzlich etwas Rundes. „Wer hat denn schon geschmückt?“, wunderte sich Bärli. Hinter dem Baum kicherte Maja. Sie hatte eine bunte Christbaumkugel aufgehängt. Die zweite Kugel durfte Bärli aussuchen, die dritte befestigte er ganz unten, damit auch Minka sie sehen konnte. „Jetzt bekommt unser Baum ein richtiges Weihnachtsgesicht“, sagte er. Alle betrachteten die funkelnden Farben.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-weihnachtskugeln"
    },
    "quiz": {
      "prompt": "Wie lautet die Mehrzahl von „Kugel“?",
      "options": [
        "Kügel",
        "Kugeln",
        "Kugelns"
      ],
      "correct": 1,
      "why": "Eine Kugel, viele Kugeln."
    }
  },
  {
    "day": 16,
    "title": "Das Lied der vier Glöckchen",
    "story": "🎼",
    "icon": "Aus dem Wald klangen vier helle Glöckchentöne. Bärli lauschte ganz genau: ding, ding, dong, ding. „Ich kann das nachspielen!“, rief er und lief zum Musikspiel. Maja klatschte den Rhythmus, Fuji wippte mit der Pfote und Minka schlug mit dem Schwanz den Takt. Zuerst traf Bärli nur drei Töne. Dann versuchte er es erneut – diesmal langsam. Am Ende erklang die ganze Melodie. „Übung macht den Meister!“, jubelte er.",
    "reward": {
      "type": "game",
      "id": "melodie:4"
    },
    "quiz": {
      "prompt": "Welches Wort passt zur Musik?",
      "options": [
        "Takt",
        "Gummistiefel",
        "Schneemann"
      ],
      "correct": 0,
      "why": "Beim Musizieren gehört der Takt zum Rhythmus."
    }
  },
  {
    "day": 17,
    "title": "Das Zimmer voller Sterne",
    "story": "🎨",
    "icon": "„Unsere Wand sieht noch ziemlich leer aus“, bemerkte Maja. Bärli wollte zuerst ein riesiges Bild aufhängen. Dann entdeckten die beiden eine Tapete mit kleinen Sternen. „Damit sieht es aus, als würden wir nachts unter dem Himmel schlafen“, sagte Bärli. Sie hielten ein Muster an die Wand und stellten sich das fertige Zimmer vor. Minka sprang auf den Sitzsack, als wollte sie sagen: „Mir gefällt es!“ Schon planten die Freunde ihre nächste Einrichtungsidee.",
    "reward": {
      "type": "house",
      "id": "waende-sterne"
    },
    "quiz": {
      "prompt": "Welche Endung hat das Nomen „Freundlichkeit“?",
      "options": [
        "-heit",
        "-keit",
        "-nis"
      ],
      "correct": 1,
      "why": "Freundlichkeit endet mit -keit."
    }
  },
  {
    "day": 18,
    "title": "Der Schal für den Schneemann",
    "story": "🧣",
    "icon": "Im Garten hatte Fuji einen kleinen Schneemann entdeckt. Ihm fehlte ein Schal. Bärli holte seinen grünen Winterschal und wickelte ihn vorsichtig um den Schnee. „Nun frierst du nicht mehr“, sagte er. Maja musste lachen. „Ein Schneemann friert vielleicht nicht wie wir, aber freundlich ist es trotzdem.“ Als die Sonne am Nachmittag herauskam, hängte Bärli den Schal zum Trocknen auf. „Morgen kann ich ihn wieder tragen“, entschied er.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-gruenschal"
    },
    "quiz": {
      "prompt": "Wie schreibt man das passende Nomen?",
      "options": [
        "die Freundlichkeit",
        "die freundlichkeit",
        "die Freundlichkeid"
      ],
      "correct": 0,
      "why": "Nomen werden großgeschrieben: die Freundlichkeit."
    }
  },
  {
    "day": 19,
    "title": "Bärlis Bücherregal",
    "story": "📚",
    "icon": "Im Baumhaus stapelten sich inzwischen viele Bücher. Eines lag auf dem Tisch, drei auf dem Boden und ein weiteres neben dem Sitzsack. „Wir brauchen Ordnung“, stellte Bärli fest. Maja zeichnete ein kleines Regal auf Papier. Sie überlegte, wo es stehen könnte, ohne das Fenster zu verdecken. Fuji brachte einen Bleistift, obwohl niemand ihn darum gebeten hatte. Gemeinsam fanden sie einen Platz. „Dann können wir unsere Lieblingsgeschichten schneller wiederfinden“, freute sich Bärli.",
    "reward": {
      "type": "house",
      "id": "buecherregal"
    },
    "quiz": {
      "prompt": "Welches Wort ist die Mehrzahl von „Buch“?",
      "options": [
        "Buchs",
        "Bücher",
        "Buche"
      ],
      "correct": 1,
      "why": "Ein Buch, viele Bücher."
    }
  },
  {
    "day": 20,
    "title": "Die verschwundenen Plätzchen",
    "story": "🍪",
    "icon": "Auf dem Baumhaustisch stand ein Teller mit Plätzchen. Als Bärli zurückkam, fehlten plötzlich zwei Stück. „Ein Plätzchendieb!“, rief er. Er entdeckte Krümel auf dem Boden und folgte ihnen bis zum Sitzsack. Dort saß Minka – völlig unschuldig natürlich – und spielte mit einem Papierstern. Hinter dem Kissen fand Bärli die zwei Plätzchen wieder. Fuji hatte sie offenbar vor dem herunterfallenden Teller gerettet. Alle teilten sich die Kekse gerecht.",
    "reward": {
      "type": "wardrobe",
      "id": "saison-plaetzchen"
    },
    "quiz": {
      "prompt": "Was ist die Mehrzahl von „Plätzchen“?",
      "options": [
        "Plätzchens",
        "Plätzchen",
        "Plätzchene"
      ],
      "correct": 1,
      "why": "Ein Plätzchen, viele Plätzchen – die Form bleibt gleich."
    }
  },
  {
    "day": 21,
    "title": "Weihnachtsgrüße im Radio",
    "story": "📻",
    "icon": "Bärli stellte ein kleines Radio auf den Tisch. „Vielleicht hören wir heute Weihnachtsmusik“, hoffte er. Zuerst knisterte es, dann erklang eine fröhliche Stimme. Jemand erzählte von einem Winterfest im Nachbardorf. Maja lauschte gespannt und notierte, wann das Fest beginnen sollte. Fuji wedelte im Takt der Musik, während Minka das Radio neugierig beschnupperte. „So erfahren wir ganz neue Geschichten“, sagte Bärli. Am liebsten hätte er sofort einen eigenen Radiosender gegründet.",
    "reward": {
      "type": "house",
      "id": "radio"
    },
    "quiz": {
      "prompt": "Warum schreibt Maja etwas auf?",
      "options": [
        "um die Uhrzeit zu behalten",
        "um das Radio zu reparieren",
        "um ein Bild zu malen"
      ],
      "correct": 0,
      "why": "Sie möchte sich merken, wann das Winterfest beginnt."
    }
  },
  {
    "day": 22,
    "title": "Der Weg zur Sternenwolke",
    "story": "☁️",
    "icon": "Am Morgen lag ein Brief auf Bärlis Laptop. Darin stand: „Finde den Weg zu unserer Sternenwolke.“ Bärli entdeckte ein neues Wolkenwege-Level. Zuerst versuchte er, direkt zur anderen Seite zu laufen. Doch der Weg führte um eine Ecke und über eine kleine Brücke. „Ich muss vorher nachdenken“, sagte er. Maja zeigte auf einen sicheren Pfad. Gemeinsam fanden sie die Lösung. Als Belohnung schimmerte über dem Baumhaus ein heller Stern.",
    "reward": {
      "type": "game",
      "id": "wolkenwege:4"
    },
    "quiz": {
      "prompt": "Was hilft Bärli beim Wegpuzzle?",
      "options": [
        "vorher den Weg planen",
        "einfach immer geradeaus laufen",
        "die Augen schließen"
      ],
      "correct": 0,
      "why": "Beim Wegpuzzle hilft es, den Weg zuerst zu planen."
    }
  },
  {
    "day": 23,
    "title": "Die geheimnisvolle Geschenkbox",
    "story": "🎁",
    "icon": "Vor dem Baumhaus lag ein Paket, das mit einem roten Band verschnürt war. „Für morgen“, stand auf dem Anhänger. Bärli schüttelte es vorsichtig. Nichts klapperte. Maja lächelte und meinte: „Manche Überraschungen sind besonders schön, wenn man wartet.“ Gemeinsam stellten sie die Box in eine sichere Ecke. Dann malten sie ein kleines Dankeschön für Tomke und Tumetott. „Nur noch eine Nacht“, flüsterte Bärli und schaute sehnsüchtig zum Fenster hinaus.",
    "reward": {
      "type": "house",
      "id": "geschenk"
    },
    "quiz": {
      "prompt": "Was bedeutet „sehnsüchtig“?",
      "options": [
        "voller Erwartung und Wunsch",
        "wütend",
        "laut"
      ],
      "correct": 0,
      "why": "Sehnsüchtig bedeutet, dass man sich etwas sehr wünscht."
    }
  },
  {
    "day": 24,
    "title": "Das Licht im Baumhaus",
    "story": "🕯️",
    "icon": "Am Weihnachtsabend öffnete Bärli das letzte Türchen. Darin lag ein Brief der beiden Wichtel: „Das schönste Licht entsteht, wenn man Freude teilt.“ Maja, Fuji und Minka kamen ins Baumhaus. Sie setzten sich zusammen, erzählten ihre liebsten Dezembergeschichten und erinnerten sich an den ersten geheimnisvollen Brief. Bärli schaute auf den blauen Sitzsack, den Laptop, den Baum und all die kleinen Schätze. „Das Beste daran“, sagte er, „ist nicht das Einrichten. Das Beste seid ihr.“ Draußen leuchtete ein Stern besonders hell.",
    "reward": {
      "type": "house",
      "id": "kamin"
    },
    "quiz": {
      "prompt": "Was ist für Bärli am schönsten?",
      "options": [
        "die Freunde zusammen",
        "die teuersten Möbel",
        "das größte Geschenk"
      ],
      "correct": 0,
      "why": "Bärli freut sich am meisten über seine Freunde und die gemeinsame Zeit."
    }
  }
];
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const dateParts=()=>{const d=new Date();return {year:d.getFullYear(),month:d.getMonth(),date:d.getDate()};};
const token=(year,day)=>String(year)+'-12-'+String(day).padStart(2,'0');
const available=(day,d=dateParts())=>d.month===11&&d.date>=day;
function read(){
 let raw={};try{raw=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{}
 const opened={},answered={};
 for(const [key,obj]of Object.entries(raw.opened||{}))if(/^\d{4}-12-(0[1-9]|1\d|2[0-4])$/.test(key)&&obj===true)opened[key]=true;
 for(const [key,obj]of Object.entries(raw.answered||{}))if(/^\d{4}-12-(0[1-9]|1\d|2[0-4])$/.test(key)&&obj===true)answered[key]=true;
 return {opened,answered};
}
function save(s){try{localStorage.setItem(STORE,JSON.stringify(s));return true;}catch{return false;}}
function rewardText(gift){
 if(gift.type==='wardrobe')return bearItems.find(x=>x.id===gift.id)?.title||'Kleidung für Bärli';
 if(gift.type==='house')return window.MajaTreehouse?.products.find(x=>x.id===gift.id)?.name||'Baumhausgeschenk';
 const [id,n]=gift.id.split(':');return ((miniGames[id]?.title)||'Minispiel')+' – Level '+n;
}
function giftDestination(gift){
 if(gift.type==='wardrobe'){
  const p=bearItems.find(x=>x.id===gift.id);
  return '#baerli/schrank/'+(p?.season||'kleidung')+'/'+gift.id;
 }
 if(gift.type==='house')return '#baumhaus';
 const [game,num]=gift.id.split(':');return '#spiele/'+game+'/'+num;
}
function awardDuplicateGift(year,day){
 const current=structuredClone(starRefresh()),key='advent:ersatz:'+token(year,day);
 if(Object.hasOwn(current.rewards,key))return {ok:true};
 current.rewards[key]={amount:2,day:starDay()};
 return starCommit(current)?{ok:true}:{ok:false};
}
function deliver(story,year){
 const gift=story.reward;
 if(gift.type==='house'){
  const result=window.MajaTreehouse?.gift(gift.id);
  if(!result?.ok)return {ok:false,message:result?.message||'Baumhaus ist noch nicht bereit.'};
  if(result.already&&!awardDuplicateGift(year,story.day).ok)return {ok:false,message:'Bitte Geschenk noch einmal versuchen.'};
  return {ok:true,message:result.already?'Das Möbelstück gehört dir schon. Dafür gibt es zwei Extra-Sterne!':result.message};
 }
 const key=gift.type==='game'?'level:'+gift.id:'item:'+gift.id;
 const known=gift.type==='game'?(()=>{const [game,n]=gift.id.split(':');return Object.hasOwn(miniGames,game)&&Number.isInteger(Number(n))&&Number(n)>0&&Number(n)<=starLevelCount(game);})():bearItems.some(item=>item.id===gift.id);
 if(!known)return {ok:false,message:'Das Adventsgeschenk konnte nicht zugeordnet werden.'};
 if(starOwned(key)){
  if(!awardDuplicateGift(year,story.day).ok)return {ok:false,message:'Bitte Geschenk noch einmal versuchen.'};
  return {ok:true,message:'Diese Überraschung hast du schon. Dafür schenkt Bärli dir zwei Extra-Sterne!'};
 }
 const current=structuredClone(starRefresh());
 current.purchases[key]={cost:0,label:'Adventgeschenk: '+rewardText(gift),day:starDay()};
 return starCommit(current)?{ok:true,message:'Geschenkt! '+rewardText(gift)+' gehört jetzt dir. Es wurden keine Sterne ausgegeben.'}:{ok:false,message:'Das Geschenk konnte nicht gespeichert werden. Bitte probiere es erneut.'};
}
function awardQuiz(year,day){
 const key='advent:frage:'+token(year,day),wallet=structuredClone(starRefresh());
 if(Object.hasOwn(wallet.rewards,key))return true;
 wallet.rewards[key]={amount:1,day:starDay()};
 return starCommit(wallet);
}
function header(title,sub){
 return '<div class="adv-shell"><a class="adv-back" href="#advent">← Zum Adventskalender</a><header class="adv-heading"><div class="adv-mascot"><img src="./baerli/baerli.webp" alt="Bärli im lila Anzug mit gelbem Ohrfähnchen" width="94" height="94"></div><div><p class="adv-kicker">Majas Wortwerkstatt · Bärlis Weihnachtsabenteuer</p><h1 tabindex="-1">'+esc(title)+'</h1><p>'+esc(sub)+'</p></div></header>';
}
let notice='';
function main(page=1){
 const d=dateParts(),state=read(),maxPage=4,number=Math.max(1,Math.min(maxPage,Number(page)||1)),from=(number-1)*6;
 const opened=Object.keys(state.opened).filter(key=>key.startsWith(String(d.year)+'-')).length;
 const active=d.month===11&&d.date<=24,canShowPreview=d.month!==11;
 const info=active?'Heute darfst du Türchen '+d.date+' öffnen. Ältere Türchen bleiben verfügbar.':d.month===11?'Alle 24 Türchen des Adventskalenders können jetzt nachgelesen werden.':'Die Türchen öffnen sich vom 1. bis zum 24. Dezember. Bis dahin kannst du die Geschichte als Vorschau kennenlernen.';
 let html=header('Bärlis Adventskalender','24 kleine Geschichten, Überraschungen für Bärlis Kleiderschrank und Baumhaus und drei neue Spiel-Level.')
  +'<section class="adv-hero"><div><strong>Eine Sternenpost mit 24 Überraschungen</strong><p>'+info+'</p><p><b>'+opened+' von 24</b> Türchen in diesem Jahr geöffnet</p></div><div class="adv-hero-illustration" aria-hidden="true"><span>🌲</span><span>🌟</span><span>🏠</span></div></section>'
  +'<div class="adv-calendar" aria-label="Adventskalender, Seite '+number+' von 4">';
 for(const story of STORIES.slice(from,from+6)){
  const key=token(d.year,story.day),done=!!state.opened[key],ready=available(story.day,d);
  const status=done?'✓ Geöffnet':ready?'🎁 Jetzt öffnen':'🔒 Ab '+story.day+'. Dezember';
  html+='<a class="adv-door '+(done?'adv-open':ready?'adv-ready':'adv-locked')+'" href="#advent/tuer/'+story.day+'" aria-label="Türchen '+story.day+', '+status+'"><span class="adv-door-number">'+story.day+'</span><span class="adv-door-icon" aria-hidden="true">'+story.icon+'</span><span class="adv-door-status">'+status+'</span></a>';
 }
 html+='</div><nav class="adv-pages" aria-label="Weitere Kalendertürchen"><a class="adv-page-link '+(number===1?'adv-disabled':'')+'" href="#advent/seite/'+(number-1)+'" '+(number===1?'aria-disabled="true" tabindex="-1"':'')+'>← Vorherige sechs</a><span>Seite '+number+' von 4</span><a class="adv-page-link '+(number===4?'adv-disabled':'')+'" href="#advent/seite/'+(number+1)+'" '+(number===4?'aria-disabled="true" tabindex="-1"':'')+'>Nächste sechs →</a></nav>'
  +(canShowPreview?'<a class="adv-preview-link" href="#advent/vorschau">📖 Eine Geschichte vorab anschauen (ohne Geschenk)</a>':'')
  +'<section class="adv-explain"><h2>So funktioniert der Kalender</h2><p>Jeden Tag wartet eine kleine Bärli-Geschichte. Einige Türchen verschenken Kleidung oder Baumhaussachen, drei andere schenken ein Level eines vorhandenen Minispiels. Du brauchst keine echten Bestellungen aufzugeben. Wenn du einen Tag verpasst, kannst du sein Türchen im Dezember später nachholen.</p><p>Baumhausgeschenke liegen zuerst sicher in deiner Möbelkiste. Das Baumhaus selbst öffnet sich nach deiner ersten bestandenen Prüfung mit mindestens 80 Prozent.</p></section>'
  +'<div class="adv-actions"><a href="#baumhaus">🌳 Mein Baumhaus</a><a href="#baerli/schrank/saison">🎄 Bärlis Weihnachtsschrank</a></div></div>';
 document.querySelector('#app').innerHTML=html;
}
function details(day,preview=false){
 const d=dateParts(),n=preview?1:Number(day),story=STORIES[n-1];
 if(!story){main(1);return;}
 const state=read(),key=token(d.year,n),done=!!state.opened[key],ready=available(n,d);
 if(!preview&&!ready&&!done){
  const txt=header('Türchen '+n+' ist noch geschlossen','Die Tür öffnet sich am '+n+'. Dezember.');
  document.querySelector('#app').innerHTML=txt+'<section class="adv-wait"><div aria-hidden="true">🔒 '+story.icon+'</div><h2>Die Überraschung kommt noch!</h2><p>Bis zum '+n+'. Dezember bleibt dieses Türchen verschlossen. Möchtest du in der Zwischenzeit ein anderes Türchen ansehen?</p><a href="#advent/seite/'+(Math.floor((n-1)/6)+1)+'">Zurück zu den Türchen</a></section></div>';
  return;
 }
 const title=preview?'Ein Vorgeschmack auf den Advent':'Türchen '+n+' · '+story.title;
 const sub=preview?'Nur die Geschichte ansehen – noch keine Belohnung.':'Komm mit Bärli, Maja, Fuji und Minka auf eine kleine Entdeckungsreise.';
 const gift=story.reward,already=done,answered=!!state.answered[key];
 let html=header(title,sub)
 +'<article class="adv-story"><div class="adv-story-art"><span class="adv-big-picture" aria-hidden="true">'+story.icon+'</span><span class="adv-story-bear"><img src="./baerli/baerli.webp" alt="Bärli freut sich auf die Geschichte" width="112" height="112"></span><span class="adv-story-spark" aria-hidden="true">✨</span></div><div class="adv-story-content"><p class="adv-story-kicker">Bärlis Geschichte des Tages</p><h2>'+esc(story.title)+'</h2><p>'+esc(story.story)+'</p><div class="adv-reader"><button type="button" class="adv-listen">🔊 Geschichte vorlesen</button><label for="adv-speed">Tempo <select id="adv-speed"><option value="0.85">Gemütlich</option><option value="1">Normal</option><option value="0.7">Sehr langsam</option></select></label><button type="button" class="adv-stop">■ Stopp</button></div><p class="adv-voice-status" role="status"></p></div></article>';
 if(preview)html+='<section class="adv-prize"><h2>🎁 Die Geschenke warten ab dem 1. Dezember.</h2><p>Dieses Beispiel zeigt dir, wie die Geschichten später aussehen. Die Türchen und Geschenke bleiben bis zu ihrem Tag verschlossen.</p><a href="#advent">Zum Adventskalender</a></section>';
 else if(!already)html+='<section class="adv-prize"><span aria-hidden="true">🎁</span><h2>Eine Überraschung für Bärli!</h2><p>Das Geschenk liegt noch unter dem Geschenkpapier.</p><button type="button" class="adv-claim">🎀 Geschenk auspacken</button><p class="adv-gift-message" role="status">'+esc(notice)+'</p></section>';
 else html+='<section class="adv-prize adv-collected"><span aria-hidden="true">🎉</span><h2>Dein Adventsgeschenk</h2><strong>'+esc(rewardText(gift))+'</strong><p>Dieses Geschenk gehört dir und bleibt gespeichert.</p><a class="adv-use" href="'+giftDestination(gift)+'">'+(gift.type==='house'?'Zum Baumhaus und meiner Möbelkiste':gift.type==='game'?'Geschenktes Minispiel-Level starten':'Bärli damit anziehen')+' →</a></section>';
 if(already&&!preview){
  const q=story.quiz;
  html+='<section class="adv-quiz"><p class="adv-kicker">Bärlis freiwilliger Mini-Knobelspaß</p><h2>'+esc(q.prompt)+'</h2><div class="adv-quiz-options">'+q.options.map((option,i)=>'<button type="button" data-adv-answer="'+i+'" '+(answered?'disabled':'')+'>'+esc(option)+'</button>').join('')+'</div><p class="adv-answer-status" role="status">'+(answered?'✓ Bereits geknobelt! '+esc(q.why):'Wer richtig antwortet, bekommt einmal einen Bonus-Stern. Versuche es ohne Druck.')+'</p></section>';
 }
 html+='<nav class="adv-bottom"><a href="#advent/seite/'+(Math.floor((n-1)/6)+1)+'">← Alle Türchen dieser Seite</a>'+(n<24?'<a href="#advent/tuer/'+(n+1)+'">Nächstes Türchen →</a>':'')+'</nav></div>';
 const app=document.querySelector('#app');app.innerHTML=html;
 const listen=app.querySelector('.adv-listen'),stop=app.querySelector('.adv-stop'),feedback=app.querySelector('.adv-voice-status');
 const speak=()=>{
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){feedback.textContent='Die Vorlesestimme ist auf diesem Gerät nicht verfügbar.';return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(story.title+'. '+story.story);
  u.lang='de-DE';u.rate=Number(app.querySelector('#adv-speed').value);
  const voices=window.speechSynthesis.getVoices();
  const german=voices.find(x=>x.lang.replace('_','-').toLowerCase().startsWith('de-'));
  if(german)u.voice=german;
  u.onstart=()=>feedback.textContent='Bärli liest gerade vor.';
  u.onend=()=>feedback.textContent='Die Geschichte ist zu Ende.';
  u.onerror=()=>feedback.textContent='Die Stimme konnte nicht abgespielt werden. Du kannst selbst lesen.';
  window.speechSynthesis.speak(u);
 };
 if(listen)listen.onclick=speak;
 if(stop)stop.onclick=()=>{window.speechSynthesis?.cancel();feedback.textContent='Vorlesen gestoppt.';};
 app.querySelector('.adv-claim')?.addEventListener('click',()=>{
  // Kein zukünftiges Türchen durch gespeicherte URL oder veränderte Ansicht öffnen.
  if(!available(n,dateParts())){notice='Dieses Türchen ist noch verschlossen.';details(n);return;}
  const result=deliver(story,d.year);
  if(!result.ok){notice=result.message;details(n);return;}
  const latest=read();latest.opened[key]=true;
  if(!save(latest)){notice='Die Tür konnte nicht gespeichert werden. Du kannst sie erneut öffnen; ein Geschenk wird nicht doppelt vergeben.';details(n);return;}
  notice=result.message;window.speechSynthesis?.cancel();details(n);
  const status=document.querySelector('.adv-prize p');if(status)status.textContent=result.message;
 });
 app.querySelectorAll('[data-adv-answer]').forEach(button=>button.onclick=()=>{
  const answer=Number(button.dataset.advAnswer),status=app.querySelector('.adv-answer-status');
  if(answer!==story.quiz.correct){status.textContent='Noch nicht richtig. Hör die Geschichte noch einmal an und probiere es erneut.';return;}
  if(!awardQuiz(d.year,n)){status.textContent='Die Sternbelohnung konnte nicht gespeichert werden. Versuche es noch einmal.';return;}
  const state=read();state.answered[key]=true;
  save(state);app.querySelectorAll('[data-adv-answer]').forEach(b=>b.disabled=true);
  status.textContent='⭐ Richtig! Ein Bonus-Stern für deinen Sternenbeutel. '+story.quiz.why;
 });
}
function render(mode='',value=''){
 window.speechSynthesis?.cancel();
 notice='';
 if(mode==='tuer')details(value);
 else if(mode==='vorschau')details(1,true);
 else main(mode==='seite'?value:1);
}
window.MajaAdvent={render,read,available,stories:STORIES,deliver};
if(location.hash.startsWith('#advent')){const [page,part,arg]=location.hash.slice(1).split('/');if(page==='advent')render(part,arg);}
})();