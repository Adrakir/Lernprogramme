/* Eigenständig erstellte Lehrinhalte; Bezug: die 48 vom Nutzer bereitgestellten Fotos. */
'use strict';
const MODULES = [
 {id:'geographie',icon:'🔎',title:'Was ist Erdkunde?',subtitle:'Die Erde mit geografischem Blick entdecken',lab:'map',lessons:[
 ['Geographie erforscht die Erde','Erdkunde heißt auch Geographie. Sie untersucht Naturräume, Menschen, Wirtschaft und die Zusammenhänge zwischen ihnen. Geographinnen und Geographen stellen Fragen, beobachten, vergleichen, messen und erklären.','Frage nicht nur „Was sehe ich?“, sondern auch „Warum ist es hier so und wie verändert es sich?“'],
 ['Physische Geographie','Sie untersucht natürliche Bestandteile und Prozesse der Erde, etwa Wetter, Klima, Berge, Flüsse, Böden und Pflanzen.','Ein Vulkanausbruch ist ein Beispiel für ein physisch-geographisches Thema.'],
 ['Humangeographie','Sie untersucht, wie Menschen leben und Räume verändern: Siedlungen, Verkehr, Landwirtschaft, Industrie und Tourismus.','Warum stehen Häuser häufig an Straßen? Das ist eine humangeographische Frage.'],
 ['Räume und Zeiträume','Man kann ein Dorf, eine Region, ein Land oder die ganze Erde betrachten. Veränderungen können Stunden (Sturmflut), Jahre oder Jahrhunderte (Inselentstehung) dauern.','Bei der Insel Juist hängen Natur (Sand, Wind, Wasser) und Menschen (Tourismus, Siedlungen) zusammen.'] ]},

 {id:'perspektive',icon:'👀',title:'Draufsicht und Seitenansicht',subtitle:'Einen Ort von oben, von der Seite und als Karte verstehen',lab:'view',lessons:[
 ['Drei Blickrichtungen vergleichen','Dasselbe Gebiet kann ganz unterschiedlich aussehen: in der Draufsicht von oben, in der Seitenansicht von der Seite und als vereinfachte Karte. Jede Darstellung hilft bei anderen Fragen.','Frage immer zuerst: Von wo aus schaue ich auf den Ort?'],
 ['Draufsicht','In der Draufsicht blickst du von oben auf einen Ort. Du erkennst besonders gut Wege, Dächer, Felder, Straßenverläufe und die Lage von Dingen zueinander.','Draufsicht = Blick von oben.'],
 ['Seitenansicht','In der Seitenansicht erkennst du Höhe, Form und Gestalt besser, zum Beispiel ob ein Berg steil ist oder wie hoch ein Haus wirkt. Dafür siehst du die genaue Lage weniger gut.','Seitenansicht hilft besonders bei Höhe, Form und Steilheit.'],
 ['Vom Bild zur Karte','Eine Karte zeigt nicht alles, sondern vereinfacht. Sie verwendet Farben, Linien, Symbole und eine Legende. Dadurch kannst du Informationen schneller lesen als in einem Bild.','Karten sind keine Fotos: Sie sind vereinfachte Darstellungen mit Zeichen.'] ]},
 {id:'himmelsrichtungen',icon:'🧭',title:'Himmelsrichtungen',subtitle:'Windrose, Kompass und Wege Schritt für Schritt verstehen',lab:'compass',lessons:[
 ['Die vier Haupthimmelsrichtungen','Die vier Haupthimmelsrichtungen heißen Norden (N), Osten (O), Süden (S) und Westen (W). Auf den meisten Karten ist Norden oben, Osten rechts, Süden unten und Westen links.','Merksatz im Uhrzeigersinn: Nie Ohne Seife Waschen = N, O, S, W.'],
 ['Die Nebenhimmelsrichtungen','Zwischen zwei Haupthimmelsrichtungen liegen die Nebenhimmelsrichtungen: NO, SO, SW und NW. Sie beschreiben Zwischenrichtungen genauer.','Nordosten liegt zwischen Norden und Osten.'],
 ['So findest du eine Richtung','1. Suche auf der Windrose zuerst Norden. 2. Gehe im Uhrzeigersinn weiter. 3. Vergleiche die gesuchte Richtung mit der Lage auf der Windrose.','Arbeite immer von Norden aus und drehe dich gedanklich im Uhrzeigersinn.'],
 ['Wege beschreiben','Bei Wegen helfen Himmelsrichtungen, Abzweigungen und Orientierungspunkte. Gute Wegbeschreibungen sind eindeutig und in der richtigen Reihenfolge.','Nenne Startpunkt, Richtung und auffällige Orientierungspunkte.'] ]},
 {id:'wege',icon:'🚶',title:'Schulweg und Navigation',subtitle:'Routen, GPS und Orientierung',lab:'map',lessons:[
 ['Wegbeschreibungen','Beschreibe den Startpunkt, Straßen und wichtige Orientierungspunkte. Verwende links/rechts und Himmelsrichtungen eindeutig und nenne Abzweigungen in der richtigen Reihenfolge.','Beispiel: „Vom Bahnhof nach Osten bis zur Kreuzung, dann nach Norden zum Park.“'],
 ['Luftlinie und Wegstrecke','Die Luftlinie ist die kürzeste Verbindung zwischen zwei Orten. Eine tatsächlich begehbare Strecke folgt Wegen oder Straßen und ist meistens länger.','Eine Route ist nicht automatisch besser, nur weil sie kürzer ist. Sicherheit zählt ebenfalls.'],
 ['GPS und Satellitennavigation','GPS bestimmt über Laufzeitmessungen von Satellitensignalen die Position. Eine Karten-App kann anschließend die Route darstellen und die Weglänge schätzen.','Kartendaten können veraltet sein. In unbekanntem Gelände benötigst du zusätzlich eigene Orientierung.'],
 ['Privatsphäre beim Schulweg','Verwende für Übungsaufgaben erfundene Adressen. In dieser App müssen weder deine Wohnadresse noch der Name deiner Schule eingegeben werden.','Mit der Kartenwerkstatt kannst du einen fiktiven Schulweg zeichnen.'] ]},
 {id:'luftbild',icon:'🛩️',title:'Vom Luftbild zur Karte',subtitle:'Perspektiven, Symbole und Legende',lab:'view',lessons:[
 ['Senkrechtluftbild','Ein Senkrechtluftbild wird möglichst senkrecht von oben aufgenommen. Es eignet sich besonders gut zur Lagebestimmung von Straßen, Häusern und Flächen.','Die Dächer sind gut sichtbar, Hausfassaden weniger.'],
 ['Schrägluftbild','Ein Schrägluftbild zeigt die Landschaft von der Seite und von oben; häufig ist auch der Horizont sichtbar. Höhen und Gebäudeformen erkennt man besser.','Für genaue Entfernungen ist ein maßstabsgerechter Stadtplan meist hilfreicher.'],
 ['Aus dem Foto wird eine Karte','Eine Karte lässt unwichtige Einzelheiten weg (Generalisierung), fügt Namen hinzu und stellt die Merkmale mit Signaturen und Farben dar.','Parkplätze können mit einem P gekennzeichnet sein, Flüsse werden oft blau gezeichnet.'],
 ['Legende','Die Legende erklärt Farben, Linien, Punkte und Symbole. Ohne Legende lässt sich die Bedeutung eines Zeichens oft nicht sicher bestimmen.','Unterscheide Straßen, Gewässer, Gebäude und Grünflächen.'] ]},

 {id:'kartenlesen',icon:'🗺️',title:'Karten lesen',subtitle:'Legende, Planquadrat und Karteninformationen sicher nutzen',lab:'atlas',lessons:[
 ['So beginnst du beim Kartenlesen','Schau zuerst auf den Titel der Karte: Worum geht es? Prüfe danach Nordrichtung, Legende und Maßstab. Erst dann liest du Einzelheiten.','Titel – Nordrichtung – Legende – Maßstab: so startest du sicher.'],
 ['Farben und Signaturen verstehen','In Karten stehen Farben, Linien, Flächen und Symbole für bestimmte Informationen. Ihre Bedeutung erfährst du in der Legende.','Ohne Legende bleibt ein Zeichen oft unklar.'],
 ['Planquadrate finden','Viele Atlas-Karten sind in Felder eingeteilt. Buchstaben und Zahlen helfen dir, gesuchte Orte schnell zu finden.','Suche zuerst die Spalte, dann die Zeile.'],
 ['Informationen aus einer Karte entnehmen','Mit einer Karte kannst du Fragen beantworten, zum Beispiel wo ein Fluss verläuft, wo ein Ort liegt oder welche Gegend hoch gelegen ist.','Lies nicht nur ab, sondern vergleiche und begründe mit der Karte.'] ]},
 {id:'massstab',icon:'📏',title:'Der Kartenmaßstab',subtitle:'Verkleinerung, Größenvergleich und Rechnen',lab:'scale',lessons:[
 ['So liest du 1 : n','1 : 50.000 bedeutet: 1 cm in der Karte entspricht 50.000 cm in Wirklichkeit, also 500 m. Beide Größen müssen zuerst dieselbe Einheit haben.','100 cm = 1 m; 100.000 cm = 1 km.'],
 ['Mit dem Maßstab rechnen','Reale Entfernung = Kartenentfernung × Maßstabszahl. Beispiel: 4 cm × 50.000 = 200.000 cm = 2 km. Umgekehrt: Karte = Wirklichkeit ÷ Maßstabszahl.','Schreibe immer die Einheit zu jedem Zwischenschritt.'],
 ['Großer und kleiner Maßstab','Bei 1 : 10.000 ist der Maßstab größer als bei 1 : 1.000.000. Ein großer Maßstab zeigt einen kleineren Raum mit mehr Einzelheiten.','Je größer die Zahl rechts vom Doppelpunkt, desto stärker die Verkleinerung.'],
 ['Maßstabsleiste','Eine grafische Maßstabsleiste zeigt direkt die realen Entfernungen. Sie kann beim Vergrößern einer Karte mitvergrößert werden und bleibt damit für die Abbildung hilfreich.','Ein Lineal auf einem unkontrolliert skalierten Bildschirm ersetzt keine verlässliche Maßstabsleiste.'] ]},
 {id:'kartenarten',icon:'🗺️',title:'Kartenarten und Signaturen',subtitle:'Topographisch, physisch und thematisch',lab:'map',lessons:[
 ['Topographische Karten','Sie zeigen die Landschaft möglichst genau, zum Beispiel Straßen, Siedlungen, Gewässer und Höhenlinien. Sie dienen oft der Orientierung im Gelände.','Die Wanderkarte von Goslar ist eine topographische Karte.'],
 ['Physische Karten','Sie stellen die natürliche Oberflächengestalt vereinfacht dar. Für verschiedene Höhen werden häufig unterschiedliche Farben verwendet.','Tiefländer sind häufig grün, höher gelegene Gebiete gelb bis braun eingefärbt.'],
 ['Thematische Karten','Sie zeigen ein besonderes Thema, zum Beispiel Bevölkerungsdichte, Landwirtschaft, Solaranlagen oder Klima.','Die Freiburg-Karte mit Solaranlagen ist thematisch.'],
 ['Signaturen','Punkte markieren Orte, Linien z. B. Flüsse oder Straßen, Flächen ganze Gebiete und Symbole besondere Einrichtungen. Ihre Bedeutung erklärt die Legende.','Dieselben Farben oder Zeichen können in verschiedenen Karten etwas anderes bedeuten.'] ]},
 {id:'relief',icon:'⛰️',title:'Höhenlinien und Relief',subtitle:'Gebirge lesen, Höhenprofile verstehen',lab:'height',lessons:[
 ['Höhe über dem Meeresspiegel','Landhöhen werden üblicherweise in Metern über einer definierten Meereshöhen-Referenz angegeben. Eine Bergspitze von 850 m ist nicht 850 m über dem Talboden, wenn das Tal höher liegt.','Beachte bei Höhenangaben den Bezugspunkt.'],
 ['Höhenlinien','Eine Höhenlinie verbindet Punkte, die auf derselben Höhe liegen. Geschlossene Linien um einen Gipfel zeigen oft einen Berg.','Höhenlinien kreuzen sich auf einer gewöhnlichen topographischen Karte normalerweise nicht.'],
 ['Steil oder flach?','Liegen Höhenlinien dicht beieinander, steigt oder fällt das Gelände auf kurzer Strecke stark: steil. Große Abstände bedeuten eine geringere Steigung.','Ein und derselbe Höhenunterschied wird auf einem steilen Hang auf kürzerer Distanz überwunden.'],
 ['Höhenprofile','Ein Höhenprofil ist ein seitlicher Schnitt durch das Gelände. Man liest auf einem vorgegebenen Weg die Höhen ab und trägt sie gegen die Strecke auf.','Mit dem Regler im Höhenlabor verändert sich der Abstand der Höhenlinien.'] ]},
 {id:'atlanten',icon:'📖',title:'Mit dem Atlas arbeiten',subtitle:'Register, Planquadrate und Kartenzeichen',lab:'atlas',lessons:[
 ['Der Atlas hat mehrere Teile','Die Kartenübersicht und das Inhaltsverzeichnis führen zu Karten. Die Kartensammlung zeigt Regionen und Themen. Das alphabetische Register hilft bei der gezielten Suche nach Orten.','Suchst du den Titicacasee? Im Register unter T nachsehen.'],
 ['So liest du eine Registerangabe','Beispiel „207.1, L11“: Auf der Atlas-Karte 207.1 suchst du im Planquadrat L11. Die Notation unterscheidet sich zwischen Atlanten.','Die Seite und das Planquadrat gehören zusammen.'],
 ['Planquadrate','Buchstaben und Zahlen teilen eine Karte in leicht auffindbare Felder. Bei L11 wählst du Spalte L und Zeile 11.','Ein Planquadrat gibt einen Bereich an, noch keine genaue geografische Koordinate.'],
 ['Informationen aus Signaturen','In einer Kartenlegende erkennst du, was Punkte, Farben, Linien und Symbole bedeuten. Suche vor dem Antworten immer die zur Karte gehörende Legende.','Ein Symbol ist nicht automatisch weltweit einheitlich.'] ]},
 {id:'gradnetz',icon:'🌐',title:'Das Gradnetz der Erde',subtitle:'Breite und Länge Schritt für Schritt lesen',lab:'coords',lessons:[
 ['Breitengrade lesen','Die geografische Breite sagt, wie weit ein Ort nördlich oder südlich vom Äquator liegt. Der Äquator ist 0°. Nach Norden und Süden zählt man bis 90°.','Breite = Abstand vom Äquator.'],
 ['Längengrade lesen','Die geografische Länge sagt, wie weit ein Ort östlich oder westlich vom Nullmeridian liegt. Vom Nullmeridian zählt man nach Osten oder Westen bis 180°.','Länge = Abstand von Greenwich.'],
 ['Koordinaten Schritt für Schritt','1. Suche zuerst den Breitengrad und entscheide N oder S. 2. Suche den Längengrad und entscheide O oder W. 3. Schreibe immer zuerst die Breite, dann die Länge.','Merksatz: erst Breite, dann Länge.'],
 ['Schnittpunkt finden','Ein Ort liegt dort, wo sich der gesuchte Breitengrad und der gesuchte Längengrad schneiden. In Übungsrastern helfen dir Zeile und Spalte beim Finden.','Der gesuchte Ort ist der Schnittpunkt beider Linien.'] ]},
 {id:'projektionen',icon:'🧩',title:'Vom Globus zur Karte',subtitle:'Kartenprojektionen und Verzerrungen',lab:'projection',lessons:[
 ['Der Globus ist kugelähnlich','Die Erdoberfläche ist gekrümmt. Sie lässt sich nicht ohne Verzerrungen auf eine ebene Karte übertragen. Deshalb unterscheiden sich Kartenprojektionen.','Denke an eine Orangenschale: Flach drücken ohne Falten oder Risse geht nicht.'],
 ['Ebene, Kegel, Zylinder','Eine ebene Projektion wird auf eine Fläche, eine Kegelprojektion auf einen Kegel und eine Zylinderprojektion auf einen Zylinder übertragen. Jede eignet sich unterschiedlich.','Die Auswahl hängt davon ab, welcher Raum gezeigt und welche Eigenschaft erhalten werden soll.'],
 ['Grönland ist nicht Afrika','In der Mercatorprojektion erscheinen Gebiete in hohen Breiten flächenmäßig stark vergrößert. Grönland wirkt deshalb im Vergleich zu Afrika viel zu groß. Afrika ist tatsächlich mehr als 14-mal so groß wie Grönland.','Formtreue und Flächentreue sind verschiedene Ziele einer Projektion.'],
 ['Wichtige Verzerrungen','Karten können Flächen, Formen, Entfernungen oder Richtungen verzerren. Nicht alle Eigenschaften lassen sich gleichzeitig überall exakt erhalten.','Frage: Wofür wurde die Karte gemacht?'] ]},
 {id:'erde',icon:'🌎',title:'Kontinente und Ozeane',subtitle:'Weltkarte, Rekorde und Orientierung',lab:'world',lessons:[
 ['Sieben Kontinente','Im Lehrbuch: Europa, Asien, Afrika, Nordamerika, Südamerika, Australien und Antarktika. In anderen Modellen kann die Einteilung abweichen (z. B. Australien/Ozeanien).','Australien ist nach der im Buch verwendeten Einteilung der kleinste Kontinent.'],
 ['Ozeane der Erde','Das Buch gliedert die Weltmeere in Pazifischen, Atlantischen und Indischen Ozean. Heute ist auch die Einteilung in fünf Ozeane gebräuchlich (zusätzlich Arktischer und Südlicher Ozean).','Der Pazifik ist der größte Ozean.'],
 ['Land und Wasser','Etwa 71 % der Erdoberfläche bestehen aus Wasser und etwa 29 % aus Land. Die Erde heißt deswegen auch „blauer Planet“.','Die große Wasserfläche bedeutet nicht, dass alles Trinkwasser ist.'],
 ['Rekorde bewusst prüfen','Russland ist das flächengrößte Land; der Mount Everest ist der höchste Berg über dem Meeresspiegel; der Baikalsee ist der tiefste See. Flusslängen können je nach Messmethode unterschiedlich ausfallen.','Bei Weltrekorden muss man wissen, was genau verglichen wird.'] ]},
 {id:'sonnensystem',icon:'🪐',title:'Unser Sonnensystem',subtitle:'Sonne, Planeten, Monde und Sterne',lab:'planets',lessons:[
 ['Die Sonne ist ein Stern','Sie erzeugt durch Kernfusion Energie und strahlt Licht aus. Planeten leuchten nicht aus eigener Kraft, sondern reflektieren Sonnenlicht.','Der Mond wird von der Sonne beleuchtet, er ist kein Stern.'],
 ['Acht Planeten','Von der Sonne aus: Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun. Pluto wird seit 2006 als Zwergplanet eingeordnet.','Merksatz: Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel.'],
 ['Rotation und Umlauf','Eine Rotation ist eine Drehung um die eigene Achse. Ein Umlauf bedeutet, dass ein Planet die Sonne umkreist. Die Erde braucht für eine Rotation etwa 24 Stunden und für einen Umlauf rund 365¼ Tage.','Ein Tag und ein Jahr beschreiben unterschiedliche Bewegungen.'],
 ['Sonnensystem und Galaxie','Das Sonnensystem liegt in der Milchstraße. Diese Galaxie enthält viele Milliarden Sterne. Das Universum umfasst sehr viele Galaxien.','Ein Planet ist keine Galaxie.'] ]},
 {id:'zeitzonen',icon:'🕒',title:'Tag, Nacht und Zeitzonen',subtitle:'Erdrotation, Ortszeit und Datumsgrenze',lab:'daynight',lessons:[
 ['Tag und Nacht entstehen','Weil die Erde sich um ihre Achse dreht, wird ein Ort abwechselnd von der Sonne beschienen und liegt anschließend auf der Nachtseite. Die Erde dreht sich von Westen nach Osten.','Die Sonne selbst muss dazu nicht einmal um die Erde kreisen.'],
 ['Ortszeit und Zeitzonen','Früher richtete sich die Uhrzeit stark nach dem örtlichen Sonnenstand. Heute nutzen Länder und Regionen gesetzliche Zeitzonen, die oft politischen Grenzen folgen.','Idealisiert entsprechen 360° / 24 Stunden = 15° pro Stunde.'],
 ['Sommerzeit beachten','Deutschland nutzt im Winter MEZ (UTC+1), im Sommer MESZ (UTC+2). Andere Länder haben eigene Regeln oder verwenden keine Sommerzeit.','Bei Uhrzeitaufgaben muss die Jahreszeit bzw. Zeitzonenregel berücksichtigt werden.'],
 ['Datumsgrenze','Nahe dem 180. Längengrad im Pazifik verläuft die internationale Datumsgrenze, die politische Ausbuchtungen hat. Beim Überschreiten ändert sich das Kalenderdatum.','Richtung Westen über die Datumsgrenze: ein Kalendertag vorwärts; nach Osten: ein Tag zurück.'] ]},
 {id:'skizzen',icon:'✏️',title:'Eigene Karten zeichnen',subtitle:'Karte, Vogelperspektive und Generalisierung',lab:'map',lessons:[
 ['Vogelperspektive','Von oben gesehen erkennt man die Lage von Straßen, Gebäuden und anderen Objekten. Die Seitenansicht zeigt dagegen eher Fassaden und die Höhe.','Ein Haus wird von oben oft als Dachform dargestellt.'],
 ['Generalisieren','Die Wirklichkeit hat unendlich viele Details. In einer Skizze zeichnet man nur das Wesentliche und fasst Ähnliches zusammen.','Für einen Schulweg genügen oft Hauptstraßen, wichtige Kreuzungen und Orientierungspunkte.'],
 ['Skizzieren in Schritten','1. Gebiet und Zweck festlegen. 2. Groben Umriss zeichnen. 3. Wege, Gewässer und wichtige Objekte ergänzen. 4. Farben, Beschriftung, Nordpfeil und Legende eintragen.','Eine einfache, gut lesbare Skizze ist besser als eine überladene.'],
 ['Signaturen selbst erstellen','Nimm einheitliche Zeichen, z. B. ■ für Gebäude, ● für Treffpunkte, ▲ für Berge. Lege ihre Bedeutung einmal in einer Legende fest.','Im Kartenatelier kannst du eine fiktive Karte bauen und als SVG speichern.'] ]}
];
const Q=[];
function add(topic,rows){rows.forEach((r,i)=>{const [text,opts,answer,explain,h1,h2,h3]=r;Q.push({id:topic+'-'+(i+1),topic,text,opts,answer,explain,hints:[h1,h2,h3]})})}
add('geographie',[
 ['Welche Frage gehört zur physischen Geographie?',['Wie entsteht ein Vulkan?','Warum wächst eine Großstadt?','Wie viele Menschen pendeln?','Warum liegt ein Supermarkt hier?'],0,'Vulkane sind natürliche Prozesse an der Erdoberfläche.','Unterscheide Naturvorgang und menschliche Nutzung.','Geht es um Gestein oder um Siedlungen?','Physische Geographie untersucht Naturprozesse.'],
 ['Was untersucht die Humangeographie?',['Die Form von Wolken','Die Bewegung von Gletschern','Wie Menschen Städte verändern','Die Schichtung von Gesteinen'],2,'Die Humangeographie befasst sich mit Menschen, Siedlungen, Wirtschaft und Raum.','Denke an menschliche Tätigkeiten.','Welche Antwort beschreibt Städte und Menschen?','Humangeographie betrachtet menschlich geprägte Räume.'],
 ['Eine Sturmflut dauert wenige Stunden. Welcher Zeithorizont passt?',['langfristig','kurzfristig','jahrtausendelang','erdgeschichtlich'],1,'Eine Sturmflut kann innerhalb von Stunden ablaufen.','Achte auf die Dauer.','Wenige Stunden sind eine sehr kurze Zeit.','Geographische Veränderungen haben verschiedene Zeithorizonte.'],
 ['Was ist eine geografische Fragestellung?',['Wie heißt mein Lieblingsfilm?','Warum verändert der Wind die Dünen?','Welche Zahl folgt auf 7?','Wer gewann das Spiel?'],1,'Wind formt die Küstenlandschaft und ist ein geografischer Prozess.','Geografie untersucht Räume und ihre Veränderungen.','Achte auf Natur oder Mensch-Raum-Beziehungen.','Dünen sind typische Landschaftsformen.'],
 ['Was bezeichnet „lokal“?',['die ganze Erde','einen Kontinent','einen einzelnen Ort','alle Ozeane'],2,'Lokal bedeutet auf einen kleinräumigen Ort bezogen.','Denk an die Maßstabsebenen.','Lokal steht eher für nah als für weltweit.','Ein Stadtviertel lässt sich lokal betrachten.'],
 ['Welche Aussage zur Insel Juist verbindet Mensch und Natur?',['Die Zahlenfolge 2, 4, 6','Der Wind formt Dünen, die den Tourismus prägen','Der Planet Jupiter ist gasförmig','Eine Farbe heißt grün'],1,'Die natürliche Dünenlandschaft beeinflusst menschliche Nutzung durch den Tourismus.','Suche nach zwei Faktoren, die zusammenwirken.','Es muss Natur und menschliches Handeln vorkommen.','Tourismus ist menschlich, Dünen sind natürlich.']
]);
add('himmelsrichtungen',[
 ['Welche Richtung liegt genau zwischen Norden und Osten?',['Nordwesten','Südosten','Nordosten','Südwesten'],2,'Nordosten liegt zwischen Norden und Osten.','Nutze die achtteilige Windrose.','Beginne oben und gehe im Uhrzeigersinn.','Die Nebenrichtung verbindet die zwei Nachbarrichtungen.'],
 ['Welche Reihenfolge folgt im Uhrzeigersinn auf Norden?',['Westen, Süden, Osten','Osten, Süden, Westen','Süden, Westen, Osten','Osten, Westen, Süden'],1,'Auf der Windrose folgen im Uhrzeigersinn N – O – S – W.','Stell dir eine Uhr vor.','Oben ist Nord, rechts ist Ost.','Danach kommt unten Süd und links West.'],
 ['Du gehst zuerst nach Westen und dann nach Süden. In welcher gemeinsamen Richtung liegt dein Ziel?',['Nordwesten','Südwesten','Nordosten','Südosten'],1,'Westen und Süden ergeben gemeinsam Südwesten.','Kombiniere die beiden Richtungen.','Schau auf die untere linke Ecke der Windrose.','Die Richtung verbindet Süd und West.'],
 ['Was zeigt die markierte Spitze einer Kompassnadel ungefähr an?',['geografisch Süden','magnetisch Norden','immer den Sonnenstand','immer den Weg zum Ziel'],1,'Die markierte Nadelspitze zeigt in Richtung des magnetischen Nordens.','Ein Kompass nutzt das Erdmagnetfeld.','Magnetischer und geografischer Nordpol fallen nicht genau zusammen.','Das Instrument zeigt Richtungen, keine Ziele.'],
 ['Ein Ort liegt östlich einer Schule. Wo liegt die Schule vom Ort aus?',['nördlich','östlich','südlich','westlich'],3,'Die Gegenrichtung von Osten ist Westen.','Wechsel den Blickpunkt.','Gegenrichtungen unterscheiden sich um 180°.','N ↔ S und O ↔ W.'],
 ['Welche Richtung ist die Gegenrichtung von Südosten?',['Nordwesten','Südwesten','Nordosten','Norden'],0,'Die Gegenrichtung von SO ist NW.','Drehe dich um eine halbe Umdrehung.','Ersetze Süd durch Nord und Ost durch West.','Die entsprechende Richtung liegt diagonal gegenüber.']
]);
add('wege',[
 ['Was ist eine Luftlinie?',['die Strecke entlang jeder Straße','die kürzeste direkte Verbindung zwischen zwei Orten','die schnellste Busverbindung','ein Weg nur für Flugzeuge'],1,'Die Luftlinie ist eine direkte geometrische Verbindung; Straßenwege sind meist länger.','Vergleiche gerade und kurvige Strecke.','Eine Luftlinie berücksichtigt keine Gebäude oder Straßen.','Zwischen zwei Punkten ist eine Gerade am kürzesten.'],
 ['Warum kann die sichere Route länger als die kürzeste sein?',['Weil Sicherheit auch Verkehr und Übergänge berücksichtigt','Weil jede Karte falsch ist','Weil GPS nur Luftlinien kennt','Weil Straßen immer gerade sind'],0,'Sicherer Schulweg kann z. B. an Ampeln entlangführen.','Eine Route wird nicht nur nach Länge bewertet.','Denke an Kreuzungen und Ampeln.','Sicherheit ist ein weiteres Auswahlkriterium.'],
 ['Wozu dient GPS hauptsächlich?',['zum Messen von Niederschlag','zum Bestimmen einer Position','zum Hervorrufen von Magnetismus','zum Erzeugen von Sonnenlicht'],1,'Satelliten ermöglichen das Bestimmen einer Position auf der Erde.','GPS bedeutet ein Satellitennavigationssystem.','Eine Karte zeigt die bestimmte Position an.','Satellitensignale helfen beim Lokalisieren.'],
 ['Warum sollte man sich nicht ausschließlich auf eine Navigations-App verlassen?',['Kartendaten können unvollständig oder veraltet sein','Jede Straße ist immer gesperrt','Kompassnadeln funktionieren nie','Der Äquator ändert täglich seine Lage'],0,'Digitale Karten können veraltete Straßen oder Wege anzeigen.','Überlege, woher Apps ihre Daten haben.','Ein Wanderweg kann gesperrt werden.','Prüfe vor Ort zusätzlich Schilder und Gelände.'],
 ['Womit beginnt eine gute Wegbeschreibung?',['mit dem Schluss','mit dem Startpunkt','mit dem Wetterbericht','mit dem Atlasverlag'],1,'Der Startpunkt gibt den notwendigen Bezug für alle folgenden Wegschritte.','Ein anderer Mensch muss dir folgen können.','Ohne Ausgangsort kann man den Weg nicht einordnen.','Nenne am Anfang, wo es losgeht.']
]);
add('luftbild',[
 ['Was ist auf einem Senkrechtluftbild besonders gut zu erkennen?',['Hausfassaden von vorn','Straßenverlauf und Dachflächen','den Erdmittelpunkt','die Farbe der Erde im Inneren'],1,'Der nahezu senkrechte Blick von oben macht Straßen und Dachflächen erkennbar.','Denke an einen Blick genau von oben.','Man sieht eher Dächer als Hauswände.','Es ist wie eine Draufsicht.'],
 ['Wobei ist ein Schrägluftbild häufig hilfreicher?',['Höhe und Erscheinung von Gebäuden erkennen','Planquadrate exakt ablesen','Längengrade bestimmen','einen Maßstab auswendig lernen'],0,'Die schräge Perspektive zeigt oft Fassaden und Höhenunterschiede.','Suche nach Perspektive und Höhe.','Schräg sehen wir mehr von Hausfassaden.','Es entsteht ein räumlicher Eindruck.'],
 ['Wie nennt man das Weglassen unwichtiger Einzelheiten auf Karten?',['Rotation','Generalisierung','Kernfusion','Meridian'],1,'Generalisierung macht eine Karte einfacher und lesbarer.','Nicht alle Details passen auf eine Karte.','Vereinfachen ist eine zentrale Methode der Kartographie.','Sie gehört zur Erstellung einer Karte.'],
 ['Was erklärt die Legende einer Karte?',['die Größe aller Planeten','die Bedeutung von Farben und Zeichen','das Alter des Kartenlesers','die Uhrzeit in London'],1,'In der Legende stehen die Erklärungen von Kartensymbolen.','Suche nach Zeichenerklärungen.','Farben und Piktogramme brauchen eine Bedeutung.','Dort liest du die Signaturen nach.'],
 ['Für genaue Straßennamen und eine Wegplanung eignet sich am besten …',['ein Schrägluftbild ohne Beschriftung','ein historisches Gemälde','ein beschrifteter Stadtplan','ein Planetenfoto'],2,'Ein Stadtplan zeigt Straßennamen und Wege übersichtlich.','Du suchst ein praktisches Orientierungsmittel.','Beschriftung ist besonders wichtig.','Wähle die Darstellung der Straßen.']
]);
add('massstab',[
 ['Maßstab 1 : 10.000: Wie viele Meter sind 1 cm auf der Karte?',['10 m','100 m','1.000 m','10.000 m'],1,'10.000 cm entsprechen 100 m.','Denke an die Umrechnung cm zu m.','100 cm sind 1 m.','Teile 10.000 durch 100.'],
 ['Maßstab 1 : 50.000: Wie weit sind 4 cm in Wirklichkeit?',['200 m','20 km','2 km','200 km'],2,'4 × 50.000 cm = 200.000 cm = 2 km.','Multipliziere zuerst in Zentimetern.','100.000 cm entsprechen 1 km.','4 × 50.000 = 200.000 cm.'],
 ['Welcher Maßstab ist größer?',['1 : 1.000.000','1 : 250.000','1 : 10.000','1 : 5.000.000'],2,'1 : 10.000 hat die kleinste Maßstabszahl rechts und ist deshalb der größte Maßstab.','Achte auf die Zahl rechts vom Doppelpunkt.','Mehr Details erscheinen bei weniger starker Verkleinerung.','Je kleiner die Zahl, desto größer der Maßstab.'],
 ['Auf einer Karte im Maßstab 1 : 100.000 misst du 5 cm. Wie weit ist das?',['0,5 km','5 km','50 km','500 km'],1,'5 × 100.000 = 500.000 cm = 5 km.','Du misst in Zentimetern.','1 cm entspricht 1 km.','Fünfmal ein Kilometer sind fünf Kilometer.'],
 ['8 cm bei 1 : 2.000.000 ergeben …',['16 km','160 km','1.600 km','80 km'],1,'8 × 2.000.000 = 16.000.000 cm = 160 km.','Rechne zuerst mit der Maßstabszahl.','1 cm entspricht 20 km.','8 × 20 km = 160 km.'],
 ['Welche Aussage stimmt für den Maßstab 1 : 5.000?',['1 cm = 5 m','1 cm = 50 m','1 cm = 500 m','1 cm = 5 km'],1,'5.000 cm entsprechen 50 m.','Wandle die Zentimeter in Meter um.','Teile 5.000 durch 100.','Das Ergebnis ist zweistellig in Metern.'],
 ['Warum ist eine Maßstabsleiste nützlich?',['Sie zeigt ausschließlich Himmelsrichtungen','Sie zeigt reale Strecken grafisch','Sie ist ein Ersatz für die Legende','Sie zeigt die Uhrzeit'],1,'Mit einer Maßstabsleiste lassen sich reale Entfernungen direkt abschätzen.','Sie ist ein grafisches Lineal auf Karten.','Sie trägt Längenangaben.','Mit ihr kannst du Strecken vergleichen.'],
 ['Wie viele Zentimeter Karte sind 3 km im Maßstab 1 : 100.000?',['3 cm','30 cm','0,3 cm','300 cm'],0,'3 km = 300.000 cm; geteilt durch 100.000 = 3 cm.','Hier rechnest du rückwärts.','Zuerst Kilometer in Zentimeter verwandeln.','300.000 ÷ 100.000 = 3.']
]);
add('kartenarten',[
 ['Welche Karte zeigt besonders gut Straßen, Siedlungen und Höhenlinien?',['Klimadiagramm','topographische Karte','Sternkarte','politischer Kommentar'],1,'Topographische Karten zeigen vielfältige Objekte der Geländeoberfläche.','Du möchtest dich im Gelände orientieren.','Es geht um viele Details der Landschaft.','Wähle die genaue Geländekarte.'],
 ['Eine Karte zeigt die Verteilung von Solaranlagen. Sie ist …',['thematisch','nur physisch','eine astronomische Karte','ein Luftbild'],0,'Sie stellt ein bestimmtes Thema, hier Solarenergie, dar.','Frage: Was ist der Karteninhalt?','Die Karte zeigt gezielt nur ein Thema.','Das nennt man eine Themenkarte.'],
 ['Wofür werden in physischen Karten oft Farbstufen verwendet?',['für die Handynummern','für Geländehöhen','für Planetennamen','für die Fahrpläne'],1,'Farbstufen veranschaulichen unterschiedliche Höhenlagen.','Die Farben erklären die Oberflächengestalt.','Grün, Gelb und Braun können Höhen zeigen.','Achte auf die Höhenschichten.'],
 ['Welche Signatur eignet sich gut für den Verlauf eines Flusses?',['eine Linie','eine einzelne Kreisfläche','nur ein Stern','eine Würfelform'],0,'Flüsse verlaufen länglich und werden deshalb meist als Linien dargestellt.','Form und Information sollten zusammenpassen.','Ein Fluss hat einen Verlauf.','Man verwendet eine durchgehende Linienführung.'],
 ['Welche Aussage über Kartensymbole stimmt?',['Ihre Bedeutung steht in der jeweiligen Legende','Ein Symbol bedeutet weltweit immer dasselbe','Farben sind in Karten verboten','P ist immer ein Planet'],0,'Legenden definieren die verwendeten Kartenzeichen.','Bedeutungen unterscheiden sich je nach Kartentyp.','Eine Legende ist die Zeichenerklärung.','Suche dort das Zeichen nach.']
]);
add('relief',[
 ['Was verbinden Höhenlinien?',['Orte gleicher Temperatur','Punkte gleicher Höhe','gleich alte Gebäude','gleiche Zeitzonen'],1,'Eine Höhenlinie verbindet Stellen gleicher Höhe.','Der Name enthält das Wort Höhe.','Ein gleich hoher Hangabschnitt wird verbunden.','Die Höhenzahl gehört zu einer bestimmten Linie.'],
 ['Auf welcher Seite ist ein Hang steiler?',['Wo Höhenlinien dicht liegen','Wo Höhenlinien weit auseinanderliegen','Wo gar keine Höhe angegeben ist','Immer auf der Nordseite'],0,'Enge Höhenlinien bedeuten starken Höhenunterschied auf kurzer Strecke.','Denke an die Höhe pro Strecke.','Viel Höhenänderung auf engem Raum ist steil.','Enge Abstände bedeuten steil.'],
 ['Wie liest du die Höhe eines Berges richtig?',['immer ab dem nächsten Haus','über der Meereshöhen-Referenz','ab dem Äquator','ab dem Mond'],1,'Höhenangaben beziehen sich auf ein festgelegtes Höhendatum nahe dem mittleren Meeresspiegel.','Suche nach dem Bezugsniveau.','Ein Tal kann selbst hoch liegen.','„m über dem Meeresspiegel“ ist die übliche Angabe.'],
 ['Was ist ein Höhenprofil?',['eine Seitenansicht des Geländeverlaufs','ein politisches Diagramm','ein Planetenlauf','die Legende einer Straßenkarte'],0,'Ein Höhenprofil zeigt den Höhenverlauf längs einer Strecke von der Seite.','Ein Profil ist eine Art Querschnitt.','Der Blick erfolgt entlang einer Schnittlinie.','Es zeigt Höhen gegen die Strecke.'],
 ['Auf der Karte liegen geschlossene Linien mit nach innen steigenden Höhenzahlen. Was liegt dort vermutlich?',['eine Ebene','eine Bergkuppe','ein Flughafen','ein Flussdelta'],1,'Zum Zentrum hin steigende Höhenlinien weisen meist auf eine Erhebung hin.','Achte auf die Richtung der Höhenzunahme.','Innen ist es höher als außen.','Dort liegt eine Erhebung.']
]);
add('atlanten',[
 ['Wo suchst du einen Ort alphabetisch?',['im Kartenrand','im Register','in der Maßstabsleiste','im Höhenprofil'],1,'Das Register enthält die Ortsnamen alphabetisch.','Denke an ein alphabetisches Verzeichnis.','Es steht meist hinten im Atlas.','Du brauchst den ersten Buchstaben des Ortes.'],
 ['Was bedeutet die Angabe „207.1, L11“ in einem Atlasbeispiel?',['20 km und 7 m','Karte 207.1 und Planquadrat L11','11 Grad nördliche Breite','Länge des Buches'],1,'Die Notation verweist auf eine Kartenstelle und ein Planquadrat.','Sie besteht aus Karte und Suchfeld.','L ist der Buchstabe der Spalte, 11 die Zeile.','Zusammen führen diese Angaben zum Kartenausschnitt.'],
 ['Was ist ein Planquadrat?',['ein geografisches Land','ein durch Buchstaben und Zahlen benanntes Kartenfeld','ein Mondkrater','ein Fluss'],1,'Planquadrate teilen Karten in überschaubare Suchfelder.','Denke an Schachbrettkoordinaten.','Buchstaben und Zahlen zeigen eine Zelle.','Das Feld hilft beim Auffinden von Orten.'],
 ['Wo kannst du die zu einer Karte gehörenden Zeichen nachschlagen?',['in der Legende','im Wetterbericht','auf dem Mond','bei den Planetenbahnen'],0,'Die Legende gibt die Bedeutung der Kartenzeichen an.','Jede Karte kann andere Zeichen verwenden.','Suche die Zeichenerklärung am Kartenrand.','Dort steht die Bedeutung der Signaturen.'],
 ['Du kennst ein Thema, aber keinen Ortsnamen. Welcher Atlasteil hilft dir zuerst?',['das thematische Inhaltsverzeichnis','das Register ausschließlich nach Städten','der Maßstabsstrich','die Titelseite allein'],0,'Das Inhaltsverzeichnis führt systematisch zu Karten nach Regionen oder Themen.','Du suchst nicht alphabetisch nach einem Ort.','Gehe vom Thema zur passenden Karte.','Das Inhaltsverzeichnis sortiert nach Themen.']
]);
add('gradnetz',[
 ['Welche Linie hat die geografische Breite 0°?',['Nullmeridian','Äquator','Wendekreis des Krebses','Datumsgrenze'],1,'Der Äquator ist der Breitenkreis 0°.','Breite geht von Nord nach Süd.','Die Linie trennt Nord- und Südhalbkugel.','Sie umrundet die Erde etwa in der Mitte.'],
 ['Welcher Meridian hat 0° Länge?',['Nullmeridian','Äquator','180. Längengrad','nördlicher Wendekreis'],0,'Der Nullmeridian verläuft durch Greenwich bei London.','Längengrade werden von einer Bezugslinie aus gezählt.','Diese Linie verläuft durch Greenwich.','Die Bezeichnung enthält Null.'],
 ['Was bedeutet 20° S, 40° W?',['20° nördlich und 40° östlich','20° südlich und 40° westlich','40° südlich und 20° westlich','20° westlich und 40° nördlich'],1,'S steht für südliche Breite, W für westliche Länge.','Erst Breite, dann Länge.','S ist auf der Südhalbkugel.','W liegt westlich von Greenwich.'],
 ['Wie viele Winkelminuten hat 1 Grad?',['10','24','60','100'],2,'Ein Winkelgrad ist in 60 Winkelminuten unterteilt.','Die Einteilung ähnelt Minuten.','Es geht um Winkel-, nicht Zeitminuten.','60 kleine Teile ergeben ein Grad.'],
 ['Welcher Koordinatenwert ist eine Breite?',['80° N','120° W','170° O','160° W'],0,'Nord und Süd stehen für Breiten, Ost und West für Längen.','Breite bezeichnet Entfernung vom Äquator.','N/S sind Breitenrichtungen.','W/O kennzeichnen Längen.'],
 ['Welche Angabe ist eine sinnvolle Reihenfolge für Koordinaten?',['Länge, Breite','Breite, Länge','Uhrzeit, Datum','Maßstab, Höhe'],1,'Üblich ist zuerst die geografische Breite, dann die Länge.','Denke an die Reihenfolge im Schulbuch.','Zuerst Nord oder Süd, dann Ost oder West.','Ein Beispiel beginnt 10° N, 20° O.'],
 ['Ein Punkt liegt genau auf dem Äquator. Welche Breite hat er?',['90° N','90° S','0°','180°'],2,'Der Äquator ist per Definition der Breitenkreis 0°.','Der Äquator trennt Nord und Süd.','Es ist weder nördlich noch südlich.','Die Zählung beginnt dort.'],
 ['Was findet man bei 90° N?',['den geografischen Nordpol','Greenwich','den Südpol','den Äquator'],0,'Bei 90° nördlicher Breite liegt der Nordpol.','Die Breite reicht von 0° bis 90°.','N steht für die Nordhalbkugel.','Die äußerste Breite auf der Nordhalbkugel ist am Pol.']
]);
add('projektionen',[
 ['Warum entstehen bei der Übertragung eines Globus auf eine Karte Verzerrungen?',['Weil die Erde gekrümmt ist','Weil die Erde keine Ozeane hat','Weil Grönland wandert','Weil der Globus heller ist'],0,'Eine gekrümmte Oberfläche lässt sich nicht überall gleichzeitig unverzerrt abflachen.','Denk an das flache Auslegen einer Orangenschale.','Ein dreidimensionaler Körper wird zweidimensional dargestellt.','Krümmung erzeugt die Schwierigkeit.'],
 ['Welche Projektion nutzt einen Zylinder als Vorstellungsmodell?',['Kegelprojektion','Zylinderprojektion','ebene Projektion','Höhenprofil'],1,'Bei Zylinderprojektionen denkt man an die Übertragung auf einen Zylinder.','Lies die Form im Namen.','Ein Zylinder hat eine gebogene Mantelfläche.','Ein zylindrischer Mantel lässt sich abrollen.'],
 ['Warum wirkt Grönland auf Mercator-Weltkarten so groß?',['Die Fläche wird in hohen Breiten stark vergrößert','Grönland ist tatsächlich größer als Afrika','Der Atlantik ist klein','Die Erde hat keine Pole'],0,'Mercator vergrößert Flächen mit zunehmender Entfernung vom Äquator stark.','Grönland liegt weit im Norden.','Die Karte verzerrt Flächengrößen.','Das ist eine Eigenschaft der Projektion, nicht der Insel.'],
 ['Welche Aussage trifft für alle flachen Weltkarten zu?',['Sie sind überall längentreu','Sie enthalten irgendeine Verzerrung','Sie sind immer flächentreu','Sie zeigen immer alle Länder gleich groß'],1,'Eine ebene Weltkarte kann nicht sämtliche Eigenschaften der Kugeloberfläche verzerrungsfrei wiedergeben.','Denke an Globus gegenüber Papier.','Geometrische Projektionen haben Vor- und Nachteile.','Nicht jede Eigenschaft bleibt erhalten.'],
 ['Was ist an einer Weltkarte besonders wichtig, wenn man Länderflächen vergleichen will?',['möglichst flächentreue Projektion','möglichst viele Ortsnamen','ausschließlich rote Farbe','keine Legende'],0,'Flächentreue Projektionen eignen sich für Flächenvergleiche.','Du willst wirkliche Flächengrößen beurteilen.','Verzerrte Flächen erschweren Vergleiche.','Die Projektion sollte Flächenverhältnisse erhalten.']
]);
add('erde',[
 ['Welches ist im Schulbuch der kleinste der sieben Kontinente?',['Europa','Australien','Afrika','Antarktika'],1,'Australien ist nach der üblichen Sieben-Kontinente-Einteilung am kleinsten.','Die Kontinente unterscheiden sich stark in der Fläche.','Europa ist zwar klein, aber Australien kleiner.','Das Lehrbuch nennt Australien als Kontinent.'],
 ['Welcher Ozean ist der größte?',['Atlantischer Ozean','Indischer Ozean','Pazifischer Ozean','Arktischer Ozean'],2,'Der Pazifik ist flächenmäßig der größte Ozean.','Vergleiche die großen Wasserflächen auf dem Globus.','Der Ozean zwischen Amerika und Asien/Australien ist besonders groß.','Er heißt auch Stiller Ozean.'],
 ['Ungefähr wie viel der Erdoberfläche ist von Wasser bedeckt?',['29 %','50 %','71 %','95 %'],2,'Ungefähr 71 % der Erdoberfläche sind Wasserflächen.','Denke an den blauen Planeten.','Es ist deutlich mehr als die Hälfte.','Land hat ungefähr 29 %.'],
 ['Welcher Staat ist flächenmäßig der größte?',['China','Kanada','Russland','Australien'],2,'Russland ist das flächenmäßig größte Land der Erde.','Es erstreckt sich über Europa und Asien.','Suche ein Land mit besonders großer Ost-West-Ausdehnung.','Es grenzt an viele Länder in zwei Erdteilen.'],
 ['Welches ist der höchste Berg über dem Meeresspiegel?',['Kilimandscharo','Mont Blanc','Mount Everest','Zugspitze'],2,'Der Mount Everest erreicht rund 8.849 m über dem Meeresspiegel.','Er liegt in Asien.','Das Himalaya-Gebirge enthält die höchste Erhebung.','Der Gipfel liegt an der Grenze Nepal/China.'],
 ['Welcher See ist besonders für seine große Tiefe bekannt?',['Baikalsee','Bodensee','Steinhuder Meer','Edersee'],0,'Der Baikalsee in Russland ist mit etwa 1.642 m der tiefste See.','Er liegt in Asien.','Es geht um einen sehr großen Süßwassersee.','Er befindet sich in Sibirien.'],
 ['Welche drei Ozeane nennt die ältere Dreiteilung im Schulbuch?',['Pazifik, Atlantik, Indik','Pazifik, Mittelmeer, Ostsee','Atlantik, Ostsee, Nordsee','Indik, Kaspisches Meer, Bodensee'],0,'Das Schulbuch verwendet den Pazifischen, Atlantischen und Indischen Ozean. Andere Einteilungen zählen fünf Ozeane.','Achte auf die drei größten zusammenhängenden Weltmeerbecken.','Nordsee und Ostsee gehören zum Atlantik.','Die Dreiteilung nennt Pazifik, Atlantik und Indik.']
]);
add('sonnensystem',[
 ['Was ist die Sonne?',['ein Planet','ein Stern','ein Mond','eine Galaxie'],1,'Die Sonne ist ein Stern und erzeugt Energie durch Kernfusion.','Was leuchtet aus eigener Kraft?','Planeten reflektieren Licht.','Die Sonne ist das Zentralgestirn.'],
 ['Wie lautet die richtige Reihenfolge der ersten vier Planeten?',['Erde, Venus, Merkur, Mars','Merkur, Venus, Erde, Mars','Mars, Erde, Venus, Merkur','Venus, Merkur, Mars, Erde'],1,'Von der Sonne aus folgen Merkur, Venus, Erde und Mars.','Denke an den Merksatz des Schulbuchs.','Der Merkur ist sonnennächster Planet.','Die Erde steht an dritter Stelle.'],
 ['Welcher Planet ist der größte?',['Saturn','Erde','Neptun','Jupiter'],3,'Jupiter hat den größten Durchmesser aller Planeten des Sonnensystems.','Der größte Planet ist ein Gasriese.','Er kommt nach Mars.','Saturn ist ebenfalls riesig, aber kleiner.'],
 ['Wodurch unterscheidet sich ein Planet von einem Stern?',['Planeten erzeugen eigenes sichtbares Licht','Sterne leuchten aus eigener Energie, Planeten reflektieren Licht','Planeten besitzen keine Schwerkraft','Sterne umkreisen immer die Erde'],1,'Sterne strahlen wegen innerer Energie; Planeten sind im Wesentlichen durch reflektiertes Licht sichtbar.','Beachte die Lichtquelle.','Der Mond reflektiert ebenfalls Sonnenlicht.','Die Sonne ist ein Stern.'],
 ['Wie lange braucht die Erde ungefähr für einen Sonnenumlauf?',['24 Stunden','7 Tage','365 Tage','29 Tage'],2,'Für einen Umlauf braucht die Erde ungefähr 365¼ Tage.','Unterscheide Tag und Jahr.','Umlauf bedeutet: einmal um die Sonne.','Die Zeit entspricht einem Jahr.'],
 ['Wie viele Planeten hat unser Sonnensystem nach heutiger Einteilung?',['7','8','9','10'],1,'Es gibt acht Planeten; Pluto gilt als Zwergplanet.','Das wurde 2006 neu festgelegt.','Pluto zählt nicht zu den acht Planeten.','Zähle von Merkur bis Neptun.'],
 ['Was ist die Milchstraße?',['ein Planet','ein Ozean','unsere Galaxie','ein Mond'],2,'Das Sonnensystem befindet sich in der Galaxie Milchstraße.','Es geht um eine sehr große Sternansammlung.','Eine Galaxie enthält Milliarden Sterne.','Die Sonne ist einer ihrer Sterne.']
]);
add('zeitzonen',[
 ['Warum gibt es Tag und Nacht?',['wegen der Erddrehung','wegen der Bewegung des Mondes allein','wegen der Veränderung der Erdmasse','weil die Sonne nachts verschwindet'],0,'Die Erde dreht sich um ihre Achse, sodass Orte abwechselnd beleuchtet werden.','Die Sonne beleuchtet immer nur ungefähr eine Erdhalbkugel.','Was bringt einen Ort aus dem Licht in den Schatten?','Denke an die Rotation.'],
 ['In welche Richtung rotiert die Erde?',['Osten nach Westen','Westen nach Osten','Süden nach Norden','Norden nach Süden'],1,'Die Erde rotiert von Westen nach Osten.','Deshalb geht die Sonne scheinbar im Osten auf.','Die scheinbare Bewegung der Sonne ist entgegengesetzt.','Die echte Rotation geht west-ostwärts.'],
 ['Welche Uhrzeit gilt in Deutschland im Winter?',['UTC−1','UTC','MEZ = UTC+1','MEZ = UTC+4'],2,'Mitteleuropäische Zeit (MEZ) ist UTC+1.','In Deutschland wird im Winter Normalzeit genutzt.','MESZ liegt eine Stunde vor MEZ.','MEZ ist eine Stunde östlich der Weltzeit UTC.'],
 ['Welchen Abstand haben ideale Zeitzonen bei 24 Zonen ungefähr?',['5 Längengrade','10 Längengrade','15 Längengrade','30 Längengrade'],2,'360° ÷ 24 = 15° pro Stunde. In Wirklichkeit folgen Zeitzonen oft Staatsgrenzen.','Teile den Vollkreis durch die Tagesstunden.','Die Erde hat 360° Länge.','360 geteilt durch 24 ergibt 15.'],
 ['Was gilt beim Überqueren der Datumsgrenze nach Westen?',['ein Kalendertag vorwärts','ein Kalendertag zurück','zwei Monate vorwärts','keine Datumsänderung'],0,'Westwärts über die Datumsgrenze wird das Datum um einen Tag vorgestellt.','Es geht nur um das Kalenderdatum.','Die Richtung bestimmt die Änderung.','Nach Osten erfolgt die umgekehrte Änderung.'],
 ['Warum darf man Sommerzeit nicht bei allen Städten gleich annehmen?',['Alle Länder haben Sommerzeit','Zeitregeln unterscheiden sich nach Land und Region','Sommerzeit ist eine Erdbewegung','Städte verändern ihren Längengrad'],1,'Die Sommerzeitregelungen unterscheiden sich; manche Länder haben keine Sommerzeit.','Politische Regeln beeinflussen die Uhrzeit.','In Japan gibt es zum Beispiel keine Sommerzeit.','Nicht überall wird die Uhr verstellt.']
]);
add('skizzen',[
 ['Wie zeichnet man ein Gebäude in einer Vogelperspektive?',['als Blick von oben','immer nur als Fassade','immer kopfüber','nur als Text'],0,'In der Vogelperspektive schaust du von oben auf ein Objekt.','Stell dir einen Vogel hoch über dem Haus vor.','Du erkennst besonders die Dachform.','Es ist die Draufsicht.'],
 ['Was sollte eine gute Kartenskizze auf jeden Fall erklären?',['welcher Kuchen gegessen wurde','was die verwendeten Zeichen bedeuten','welcher Planet am hellsten ist','welche Schrift der Lehrer mag'],1,'Eine Legende macht verwendete Signaturen verständlich.','Denke an jemanden, der die Skizze nicht kennt.','Symbole müssen eindeutig sein.','Erstelle dazu eine Legende.'],
 ['Was bedeutet Generalisierung beim Skizzieren?',['wichtige Merkmale vereinfacht darstellen','jede Einzelheit zeichnen','nur farbig ausmalen','keine Wege markieren'],0,'Man reduziert den Inhalt auf die für den Zweck wesentlichen Merkmale.','Eine Skizze muss nicht alles zeigen.','Unwichtiges kann wegfallen.','Es geht um lesbare Vereinfachung.'],
 ['Welches Zeichen eignet sich als eigene Signatur für einen Berg?',['▲','♬','@','☎'],0,'Ein Dreieck kann einen Gipfel symbolisieren, wenn es in der Legende entsprechend erklärt wird.','Wähle eine leicht erkennbare Form.','Eine spitze Form erinnert an einen Berg.','Wichtig ist die Zuordnung in der Legende.'],
 ['In welcher Reihenfolge gelingt eine Kartenskizze besonders gut?',['Details, dann Umriss, dann Thema','Umriss, wichtige Inhalte, Legende','Legende ohne Karte, Schluss','nur alles ausmalen'],1,'Erst Umriss und Grenzen, dann wichtige Objekte und schließlich Zeichenerklärung.','Denk an einen groben Entwurf.','Beginne mit dem äußeren Rahmen.','Beschriftung und Legende folgen auf die Inhalte.']
]);

add('perspektive',[
 ['Woran erkennst du eine Draufsicht?',['Man schaut von oben auf einen Ort','Man sieht nur die Vorderseite eines Hauses','Man schaut von unten nach oben','Man sieht nur den Himmel'],0,'In der Draufsicht blickt man von oben auf einen Ort.','Stell dir einen Vogel über dem Ort vor.','Dächer und Wege sind oft gut zu erkennen.','Draufsicht bedeutet Blick von oben.'],
 ['Welche Aussage passt zur Seitenansicht?',['Sie zeigt besonders gut Höhe und Form','Sie zeigt immer das Gradnetz der Erde','Sie ist dasselbe wie eine Karte','Sie zeigt nur Symbole'],0,'In der Seitenansicht erkennst du Höhe, Form und Steilheit besonders gut.','Denke an einen Berg von der Seite.','Dann siehst du Auf- und Abstieg besser.','Seitenansicht betont Höhe und Form.'],
 ['Was macht eine Karte mit der Wirklichkeit?',['Sie vereinfacht und benutzt Zeichen','Sie fotografiert alles genau','Sie zeigt nur Häuserdächer','Sie verzerrt absichtlich ohne Regel'],0,'Eine Karte vereinfacht und verwendet Farben, Linien und Symbole.','Denke an Legende und Signaturen.','Nicht alles wird so gezeigt wie im Foto.','Eine Karte ist eine vereinfachte Darstellung.'],
 ['Was sieht man in einer Draufsicht meist besser als in einer Seitenansicht?',['Die Lage von Straßen und Gebäuden','Die genaue Höhe eines Turmes','Die Steilheit eines Hanges','Die Vorderseite eines Hauses'],0,'Von oben erkennst du die Lage von Wegen und Gebäuden besonders gut.','Achte auf das Wort Lage.','Dafür ist die Draufsicht geeignet.','Draufsicht zeigt besonders gut Anordnung und Lage.'],
 ['Welche Reihenfolge ist sinnvoll, wenn du drei Darstellungen vergleichst?',['Zuerst Blickrichtung klären, dann Merkmale vergleichen','Zuerst raten, dann malen','Nur die Farben vergleichen','Nur die Überschrift lesen'],0,'Zuerst klärst du die Blickrichtung, dann vergleichst du Merkmale.','Frage zuerst: von oben, von der Seite oder als Karte?','Danach suchst du gleiche Objekte.','So gelingt der Vergleich verständlich.']
]);
add('kartenlesen',[
 ['Womit solltest du beim Kartenlesen beginnen?',['Mit Titel und Legende','Mit dem schwierigsten Detail','Mit der Rückseite der Karte','Mit einem Zufallsort'],0,'Titel und Legende zeigen dir, worum es geht und was die Zeichen bedeuten.','Schau zuerst, welche Art Karte du vor dir hast.','Dann verstehst du die Signaturen besser.','Titel und Legende sind ein guter Start.'],
 ['Was erklärt die Legende?',['Die Bedeutung von Farben und Zeichen','Die Entstehung der Erde','Die Hausordnung der Schule','Die Wettervorhersage'],0,'Die Legende erklärt Farben, Linien, Flächen und Symbole.','Sie ist der Schlüssel zur Karte.','Ohne Legende bleibt vieles unklar.','Kartenzeichen werden in der Legende erklärt.'],
 ['Wie findest du das Planquadrat C4?',['Spalte C und Zeile 4','Spalte 4 und Zeile C','Nur irgendwo in der Mitte','Immer rechts unten'],0,'Bei Planquadraten suchst du zuerst die Spalte mit dem Buchstaben und dann die Zeile mit der Zahl.','Buchstabe = Spalte.','Zahl = Zeile.','Der Schnittpunkt liegt in C4.'],
 ['Welche Frage passt zu einer Karte?',['Wo verläuft der Fluss?','Wie riecht der Wald?','Wie laut ist das Auto gerade?','Wie schmeckt das Wasser?'],0,'Karten helfen bei Lage-, Verlauf- und Orientierungsfragen.','Eine Karte zeigt räumliche Informationen.','Gerüche und Geschmäcker zeigt sie nicht.','Sie beantwortet vor allem Fragen zur Lage im Raum.'],
 ['Warum ist der Maßstab beim Kartenlesen wichtig?',['Weil man damit Entfernungen einschätzen kann','Weil er die Farben schöner macht','Weil er die Himmelsrichtungen ersetzt','Weil er den Titel erklärt'],0,'Mit dem Maßstab kannst du abschätzen, wie groß Strecken in Wirklichkeit sind.','Maßstab verbindet Karte und Wirklichkeit.','So kannst du Entfernungen berechnen oder vergleichen.','Der Maßstab hilft beim Einschätzen von Entfernungen.']
]);

const GLOSSARY = [
 ['Atlas','Sammlung von geografischen Karten, oft mit Register und Kartenverzeichnissen.'],['Äquator','Breitenkreis bei 0°, trennt Nord- und Südhalbkugel.'],['Breitengrad','Winkelentfernung eines Ortes vom Äquator nach N oder S.'],['Datumsgrenze','Linie nahe 180° Länge, an der das Kalenderdatum beim Überqueren wechselt.'],['Erdachse','Gedachte Linie durch Nord- und Südpol, um die sich die Erde dreht.'],['Erdrotation','Drehung der Erde um ihre eigene Achse.'],['Farbige Höhenschichten','Farben, die Geländehöhenbereiche darstellen.'],['Generalisierung','Vereinfachung von Karteninhalten für gute Lesbarkeit.'],['Geographie','Wissenschaft über die Erde, ihre Räume und das Verhältnis von Mensch und Natur.'],['Gradnetz','Netz aus Breitenkreisen und Meridianen.'],['Himmelsrichtungen','Orientierung: Norden, Osten, Süden, Westen und dazwischenliegende Richtungen.'],['Höhenlinie','Verbindung von Punkten gleicher Höhe.'],['Höhenprofil','Seitlicher Schnitt durch den Höhenverlauf des Geländes.'],['Humangeographie','Untersucht wie Menschen Räume nutzen und verändern.'],['Kartenskizze','Stark vereinfachte, zweckbezogene Karte.'],['Kartenprojektion','Verfahren zur Übertragung der gekrümmten Erde auf eine flache Karte.'],['Koordinaten','Werte von Breite und Länge zur Ortsbestimmung.'],['Legende','Erklärung von Zeichen, Linien und Farben einer Karte.'],['Luftlinie','Direkte Verbindung zweier Orte.'],['Längengrad','Winkelabstand nach Osten oder Westen vom Nullmeridian.'],['Maßstab','Verhältnis einer Entfernung auf der Karte zur Entfernung in Wirklichkeit.'],['Maßstabsleiste','Grafische Darstellung von Entfernungen in einer Karte.'],['Meridian','Längenhalbkreis von einem Pol zum anderen.'],['MEZ','Mitteleuropäische Zeit, in Deutschland im Winter UTC+1.'],['MESZ','Mitteleuropäische Sommerzeit, in Deutschland im Sommer UTC+2.'],['Nullmeridian','Meridian mit 0° geografischer Länge, verläuft durch Greenwich.'],['Ozean','Sehr großes zusammenhängendes Weltmeer.'],['Ortszeit','Nach dem Sonnenstand eines Ortes bestimmte oder lokal verwendete Zeit.'],['Physische Geographie','Untersucht natürliche Merkmale und Prozesse der Erde.'],['Planquadrat','Durch Buchstaben und Zahlen gekennzeichnetes Suchfeld in einer Karte.'],['Rotation','Drehung um die eigene Achse.'],['Schrägluftbild','Schräg von oben aufgenommenes Luftbild.'],['Senkrechtluftbild','Nahezu senkrecht von oben aufgenommenes Luftbild.'],['Signatur','Kartensymbol, das ein geografisches Merkmal darstellt.'],['Thematische Karte','Karte, die gezielt ein geografisches Thema zeigt.'],['Topographische Karte','Detaillierte Karte mit Siedlungen, Wegen, Gewässern und Geländeformen.'],['Windrose','Grafische Darstellung der Himmelsrichtungen.'],['Zeitzone','Gebiet mit gleicher gesetzlicher Uhrzeit.']
];
GLOSSARY.push(['Draufsicht','Blick von oben auf einen Ort.'],['Seitenansicht','Blick von der Seite auf einen Ort oder eine Landschaft.'],['Kartenlesen','Informationen gezielt aus Titel, Legende, Maßstab und Kartenbild entnehmen.']);
const PLANETS=[
 ['Merkur',58,4879,0.24,'☿'],['Venus',108,12104,0.615,'♀'],['Erde',150,12756,1,'🌍'],['Mars',228,6792,1.88,'♂'],['Jupiter',778,142984,11.86,'♃'],['Saturn',1429,120536,29.46,'♄'],['Uranus',2871,51118,84.02,'♅'],['Neptun',4495,49528,164.8,'♆']
];

// Zusatzaufgaben: nachvollziehbar generierte Zahlen- und Gradnetzvarianten.
// Jede Aufgabe ist eigenständig aus einer exakten Lösung konstruiert.
const EXTRA_SCALES=[
 [5000,2,'m'],[5000,7,'m'],[10000,3,'m'],[10000,6,'m'],
 [20000,4,'m'],[20000,8,'m'],[25000,2,'m'],[25000,6,'m'],
 [50000,2,'km'],[50000,8,'km'],[100000,2,'km'],[100000,7,'km'],
 [200000,3,'km'],[200000,6,'km'],[250000,4,'km'],[250000,8,'km'],
 [500000,2,'km'],[500000,6,'km'],[1000000,4,'km'],[1000000,9,'km'],
 [2000000,3,'km'],[2000000,7,'km']
];
EXTRA_SCALES.forEach(([n,cm,unit],i)=>{
 const actual=cm*n/(unit==='m'?100:100000),other=[actual/10,actual*10,actual*2];
 const options=[actual,...other].map(x=>(Number.isInteger(x)?humanNum(x):String(x).replace('.',','))+' '+unit);
 const order=[...options];const targetIndex=i%4;[order[0],order[targetIndex]]=[order[targetIndex],order[0]];
 Q.push({id:'massstab-var-'+(i+1),topic:'massstab',text:`Ein Kartenausschnitt hat den Maßstab 1 : ${new Intl.NumberFormat('de-DE').format(n)}. Auf der Karte misst ein Weg ${cm} cm. Wie lang ist er in Wirklichkeit?`,opts:order,answer:targetIndex,
 explain:`${cm} cm × ${new Intl.NumberFormat('de-DE').format(n)} = ${new Intl.NumberFormat('de-DE').format(cm*n)} cm = ${String(actual).replace('.',',')} ${unit}.`,
 hints:[`Bei 1 : ${new Intl.NumberFormat('de-DE').format(n)} steht die Zahl rechts für echte Zentimeter je Karten-Zentimeter.`,
 `Multipliziere die ${cm} cm mit der Zahl ${new Intl.NumberFormat('de-DE').format(n)}.`,
 `Für Meter teile Zentimeter durch 100; für Kilometer durch 100.000.`]});
});
function humanNum(n){return new Intl.NumberFormat('de-DE',{maximumFractionDigits:2}).format(n)}
const EXTRA_COORDS=[[10,30,'N','W'],[20,40,'S','O'],[30,60,'N','O'],[40,70,'S','W'],[50,100,'N','W'],[60,80,'S','O'],[15,45,'N','O'],[25,75,'S','W'],[35,110,'N','W'],[45,120,'S','O'],[55,90,'N','O'],[65,130,'S','W'],[5,20,'N','W'],[10,95,'S','O'],[35,145,'N','O'],[25,160,'S','W']];
EXTRA_COORDS.forEach(([la,lo,ns,ow],i)=>{
 const wrongNs=ns==='N'?'S':'N',wrongOw=ow==='O'?'W':'O';
 const correct=`${la}° ${ns}, ${lo}° ${ow}`;
 let opts=[correct,`${la}° ${wrongNs}, ${lo}° ${ow}`,`${la}° ${ns}, ${lo}° ${wrongOw}`,`${lo}° ${ns}, ${la}° ${ow}`];
 let ix=i%4;[opts[0],opts[ix]]=[opts[ix],opts[0]];
 Q.push({id:'gradnetz-var-'+(i+1),topic:'gradnetz',text:`Ein Ort liegt ${la}° ${ns==='N'?'nördlich':'südlich'} des Äquators und ${lo}° ${ow==='O'?'östlich':'westlich'} von Greenwich. Welche Koordinaten sind korrekt?`,opts,answer:ix,
 explain:`Die Breite wird zuerst mit N/S und danach die Länge mit O/W angegeben: ${correct}.`,
 hints:['Der Äquator ist die Bezugslinie für die geografische Breite.',`Überlege, ob die erste Angabe ${ns==='N'?'N oder S':'S oder N'} tragen muss.`,`Zuerst kommt der Breitengrad, anschließend der Längengrad; richte die Kürzel nach den angegebenen Richtungen aus.`]});
});

// Flugzeiten: feste Winterzeit-Szenarien, inkl. Datumswechsel.
const FLIGHT_Q=[
 ['Frankfurt: Montag 11:15 Uhr MEZ, Flugzeit 3 Stunden, Lissabon liegt im Januar eine Stunde zurück. Wann Ankunft?',['Montag 13:15 Uhr','Montag 14:15 Uhr','Montag 15:15 Uhr','Dienstag 13:15 Uhr'],0,'11:15 + 3 Stunden = 14:15 MEZ; in Lissabon ist es eine Stunde früher: Montag 13:15 Uhr.'],
 ['Frankfurt: Mittwoch 14:30 Uhr MEZ, Flugzeit 8 Stunden. Mumbai ist im Januar 4½ Stunden voraus. Wann Ankunft?',['Mittwoch 22:30 Uhr','Donnerstag 03:00 Uhr','Donnerstag 02:30 Uhr','Mittwoch 18:00 Uhr'],1,'14:30 + 8 Stunden = 22:30 MEZ; Mumbai + 4½ Stunden = Donnerstag 03:00 Uhr.'],
 ['Frankfurt: Freitag 22:40 Uhr MEZ, Flugzeit 12 Stunden. Mexiko-Stadt liegt im Januar 7 Stunden zurück. Wann Ankunft?',['Samstag 03:40 Uhr','Samstag 10:40 Uhr','Freitag 15:40 Uhr','Sonntag 03:40 Uhr'],0,'Freitag 22:40 + 12 Stunden = Samstag 10:40 MEZ; minus 7 Stunden = Samstag 03:40 Uhr.'],
 ['Frankfurt: Samstag 20:00 Uhr MEZ, Flugzeit 22 Stunden. Sydney ist im Januar 10 Stunden voraus. Wann Ankunft?',['Sonntag 18:00 Uhr','Montag 04:00 Uhr','Sonntag 08:00 Uhr','Montag 18:00 Uhr'],1,'Samstag 20:00 + 22 Stunden = Sonntag 18:00 MEZ, plus 10 Stunden = Montag 04:00 Uhr.'],
 ['San Francisco: Freitag 13:00 Uhr (UTC−8), Flugzeit 11 h 45 min. Tokio nutzt UTC+9. Wann Ankunft?',['Samstag 06:45 Uhr','Samstag 17:45 Uhr','Freitag 23:45 Uhr','Sonntag 17:45 Uhr'],1,'Freitag 13:00 Uhr in San Francisco = Freitag 21:00 UTC. +11:45 = Samstag 08:45 UTC; +9 = Samstag 17:45 Uhr in Tokio.']
];
FLIGHT_Q.forEach((r,i)=>Q.push({id:'flugzeit-'+(i+1),topic:'zeitzonen',text:r[0],opts:r[1],answer:r[2],explain:r[3],hints:['Rechne die lokale Abflugzeit zuerst in eine gemeinsame Referenzzeit um.','Addiere die Flugzeit, bevor du auf die Zielortzeit wechselst.','Achte bei Addition und Zeitverschiebung besonders auf den Wochentag.']}));

/* V5: vertiefende, selbst erklaerte Uebungen zu den vier Schwerpunkten. */
const FOCUS_TOPICS=['perspektive','himmelsrichtungen','kartenlesen','gradnetz'];
function focusAdd(topic,stem,options,correct,explain,hints){
  if(new Set(options).size!==4 || correct<0 || correct>3)throw Error('Fehler in Schwerpunktfrage: '+stem);
  const n=Q.filter(q=>q.topic===topic&&q.id.startsWith('v5-')).length+1;
  const rot=(n*3+FOCUS_TOPICS.indexOf(topic))%4;
  const opts=[...options],val=opts[correct];
  for(let i=0;i<rot;i++)opts.unshift(opts.pop());
  const idx=opts.indexOf(val);
  Q.push({id:'v5-'+topic+'-'+n,topic,text:stem,opts,answer:idx,explain,hints:hints||[
    'Prüfe, welcher Fachbegriff im Aufgabentext gefragt ist.',
    'Ueberlege, welche Merkmale für das Thema besonders wichtig sind.',
    explain]});
}
const PR=[
 ['Was ist an einem Haus in der Draufsicht besonders gut sichtbar?','die Form des Daches',['die Vorderseite der Eingangstuer','die Höhe des Erdgeschosses','die Wandfarbe hinter dem Haus'],'Von oben blickst du direkt auf das Dach.'],
 ['Was ist an einem Haus in der Seitenansicht besonders gut sichtbar?','die Höhe der Fassade',['die genaue Dachflaeche','die Straßenfuehrung','die Lage aller Grundstuecke'],'Von der Seite siehst du Höhe und Fassade.'],
 ['Du willst die Lage von drei Spielplaetzen vergleichen. Welche Darstellung eignet sich?','Draufsicht oder Stadtplan',['reine Seitenansicht','Foto nur eines Schildes','Blick durch ein Fenster'],'Draufsicht und Stadtplan zeigen, wo Dinge zueinander liegen.'],
 ['Du willst den Anstieg eines Berges beurteilen. Welche Darstellung hilft besonders?','Seitenprofil',['reine Draufsicht ohne Höhenlinien','Bevoelkerungskarte','Farbkarte von Ländern'],'Das Seitenprofil zeigt den Höhenverlauf entlang einer Strecke.'],
 ['Was erkennt man in einem Senkrechtluftbild im Vergleich zum Schraeglufthbild häufig besser?','Grundrisse und Lageverhältnisse',['Höhe einer Hauswand','Fenster von vorn','die Steilheit einer Fassade'],'Senkrecht von oben sind Lage und Grundriss erkennbar.'],
 ['Warum hat eine Karte oft weniger Einzelheiten als ein Luftbild?','Sie wird für Übersichtlichkeit generalisiert',['Sie ist immer falsch','Es gibt auf Karten keine Straßen','Luftbilder haben keine Gebäude'],'Karten lassen Unwichtiges weg und betonen wichtige Informationen.'],
 ['Welche Ansicht zeigt einen Bahnhof mit Schienenverlauf besonders übersichtlich?','Draufsicht',['Hausfront im Seitenblick','Innenaufnahme eines Zuges','Nahaufnahme einer Fahrkarte'],'Schienenfuehrungen sind von oben gut sichtbar.'],
 ['Welches Bild eignet sich eher zum Beschreiben der Silhouette einer Kirche?','Seitenansicht',['Draufsicht des Daches','Maßstabsleiste','politische Weltkarte'],'Eine Silhouette zeigt Aussenform und Höhe von der Seite.'],
 ['Ein Baum verdeckt in einem Schraeglufthbild eine Straße. Welche Darstellung hilft eher, sie zu finden?','Senkrechtluftbild oder Stadtplan',['Seitenansicht desselben Baumes','Nahaufnahme der Blätter','Foto des Himmels'],'Blickrichtung und Kartensignaturen erleichtern die Lagebestimmung.'],
 ['Was beschreibt die Draufsicht zutreffend?','Blick möglichst senkrecht von oben',['Blick direkt aus Bodenniveau','Blick ausschließlich aus dem Keller','Blick nur waagerecht nach Osten'],'Draufsicht bedeutet von oben auf das Objekt schauen.'],
 ['Worin besteht ein Unterschied zwischen Draufsicht und Seitenansicht?','Von oben erkennt man Lage, von der Seite Höhe und Form',['Beide zeigen nur Text','Nur die Seitenansicht enthaelt Farben','Beide sind immer maßstabsgerechte Karten'],'Blickwinkel ändert, welche Informationen hervortreten.'],
 ['Was ist eine Vogelperspektive im Schulversuch?','ein Blick von oben auf die Gegenstaende',['ein Blick aus dem Keller','ein Blick nur auf den Boden','ein Bild ohne Perspektive'],'Ein Vogel oberhalb der Szene schaut auf die Anordnung hinab.'],
 ['Ein Bus wird in der Seitenansicht gezeichnet. Was sieht man besonders?','Tueren und Fenster an der Seite',['ausschließlich das Dach','Straßenkreuzungen von oben','einen Atlasplan'],'Die Seitenansicht zeigt die Seitenflächen des Busses.'],
 ['Ein Bus wird von oben gezeichnet. Was sieht man besonders?','Dach und Grundflaeche',['alle Sitze von der Seite','Ruecklichter in voller Höhe','die vordere Stossstange frontal'],'Beim Blick von oben fallen Dach und Flächenform auf.'],
 ['Welche Darstellung ist sinnvoll für die Frage: Wo liegt der See relativ zur Schule?','Kartenskizze mit Nordpfeil',['Fotografie einer Hauswand','Seitenansicht einer Bank','Himmelsportraet'],'Eine Kartenskizze verdeutlicht Lagebeziehungen.'],
 ['Warum benoetigt eine Kartenskizze eine Legende?','Damit Zeichen eindeutig verstanden werden',['Damit Fotos lauter werden','Damit das Blatt dicker wird','Damit alle Wege gerade werden'],'Die Legende erklaert Symbole und Farben.'],
 ['Welche Ansicht ist ein Höhenprofil?','seitlicher Schnitt durch einen Berg',['Luftbild von Wolken','Karte mit Planquadraten','Globus von oben'],'Höhenprofile geben den Verlauf von Höhen entlang eines Schnitts wieder.'],
 ['Was bleibt gleich, wenn du ein Haus von oben und von der Seite betrachtest?','Es ist dasselbe Haus',['Die sichtbare Dachform','Die erkennbare Fassadenflaeche','Der Blickwinkel'],'Nur die Blickrichtung wechselt, nicht der Gegenstand.'],
 ['Bei welcher Ansicht sieht man Gebäudehöhen weniger gut ohne Zusatzangaben?','Senkrechtluftbild',['klassische Seitenansicht','Ansicht auf Augenhöhe','Seitenprofil mit Höhenangaben'],'Aus der Draufsicht allein sind vertikale Höhen schwer zu lesen.'],
 ['Wie unterscheidet sich eine topografische Karte vom echten Foto?','Sie zeigt vereinfachte Symbole, Namen und meist Maßstabsangaben',['Sie bildet jede Wolke ab','Sie ersetzt Himmelsrichtungen durch Farben','Sie zeigt nur einzelne Fenster'],'Eine Karte arbeitet mit Signaturen, Auswahl und Beschriftungen.']
];
PR.forEach(([t,c,b,e])=>focusAdd('perspektive',t,[c,...b],0,e,['Stell dir vor, du wechselst deine Blickposition.','Frage: Geht es um die Lage oder um Höhe und Form?',e]));
const dirs=[['N','Norden'],['NO','Nordosten'],['O','Osten'],['SO','Südosten'],['S','Süden'],['SW','Südwesten'],['W','Westen'],['NW','Nordwesten']];
dirs.forEach(([d,name],i)=>{
 let other=[dirs[(i+1)%8][1],dirs[(i+3)%8][1],dirs[(i+5)%8][1]];
 focusAdd('himmelsrichtungen','Auf einer nach Norden ausgerichteten Karte zeigt der Pfeil nach '+d+'. Welche Himmelsrichtung bedeutet das?',[name,...other],0,'Die Abkuerzung '+d+' steht für '+name+'.');
 const against=dirs[(i+4)%8][1];
 focusAdd('himmelsrichtungen','Du blickst nach '+name+'. Welche Richtung liegt genau hinter dir?',[against,dirs[(i+2)%8][1],dirs[(i+1)%8][1],dirs[(i+6)%8][1]],0,'Die Gegenrichtung liegt um 180 Grad versetzt: '+name+' und '+against+'.');
});
const turnNames=['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'];
for(let i=0;i<16;i++){
 const first=i%8,step=i<8?2:1,target=(first+step)%8;
 focusAdd('himmelsrichtungen','Du stehst mit Blick nach '+turnNames[first]+' und drehst dich '+(step===2?'um 90 Grad':'um 45 Grad')+' nach rechts. Wohin schaust du?',[turnNames[target],turnNames[(target+1)%8],turnNames[(target+2)%8],turnNames[(target+4)%8]],0,'Auf der Windrose führt eine Rechtsdrehung im Uhrzeigersinn von '+turnNames[first]+' nach '+turnNames[target]+'.');
}
const MAPQ=[
 ['Auf der Karte sind Gewässer blau eingefarbt. Wo schaust du nach, um die Bedeutung sicher zu prüfen?','in die Legende',['in das Schülerheft','an den Kartenrand ohne Zeichen','nur auf die Uhr'],'Die Legende erklaert die verwendeten Farben.'],
 ['Du findest die Angabe „134, D6“ im Atlasregister. Wofür steht D6?','Planquadrat',['Maßstab','Höhe des Ortes','Gradnetzbreite'],'D ist die Spalte, 6 die Zeile.'],
 ['Was gehoert in eine gut lesbare Kartenskizze?','Ueberschrift, Nordrichtung und Legende',['alle einzelnen Grasbueschel','nur möglichst viele Farben','gar keine Beschriftungen'],'Karten brauchen Orientierung und eine Zeichenerklaerung.'],
 ['Eine schwarze Linie ist in der Legende als Bahnstrecke beschrieben. Was bedeutet sie in der Karte?','Eisenbahnlinie',['Grenze eines Ozeans','größe eines Baumes','Breitengrad'],'Bedeutungen sind der Legende zu entnehmen.'],
 ['Was bedeutet die Kartenbeschriftung „N“ neben einem Nordpfeil?','Norden',['Neptun','Niedrigwasser','Naechste Seite'],'Der Nordpfeil zeigt die Ausrichtung der Karte.'],
 ['Wozu dient der Kartentitel?','Er erklaert Thema oder Gebiet',['Er ersetzt jeden Weg','Er zeigt das Wetter morgen','Er gibt immer den Breitengrad an'],'Der Titel verraet, was die Karte darstellt.'],
 ['Ein Parkplatz ist mit dem Zeichen P markiert. Was ist P?','Kartensignatur',['Höhenlinie','Luftlinie','Maßstabszahl'],'P ist ein Zeichen für eine Einrichtung.'],
 ['Eine Wanderkarte zeigt geschlossene braune Höhenlinien. Was wird dargestellt?','Höhenformen des Geländes',['Parkscheinautomaten','Längenhalbkreise','Flugzeiten'],'Braune Höhenlinien zeigen oft die Form der Erdoberflaeche.'],
 ['Eine Karte zeigt die Verteilung von Solaranlagen. Welche Kartenart ist sie?','thematische Karte',['reine politische Weltkarte','Senkrechtluftbild','unbeschriftetes Foto'],'Das besondere Thema ist die Verteilung der Solaranlagen.'],
 ['Wofür ist eine topografische Karte besonders nuetzlich?','Wege, Gewässer und Höhen erkennen',['Wetter in 50 Jahren bestimmen','Farben von Planeten vergleichen','Uhrzeiten addieren'],'Topografische Karten helfen bei der Orientierung.'],
 ['Auf einer Legende steht: Grün = Wald. Welche Aussage ist korrekt?','Grüne Flächen dieser Karte zeigen Wald',['Grün ist auf allen Weltkarten immer Wald','Jeder Park ist ein Ozean','Grün bedeutet immer Stadt'],'Die Legende gilt für die jeweilige Karte.'],
 ['Die Karte zeigt zwei Doerfer und eine Straße dazwischen. Was kannst du daraus ablesen?','Lage und Verbindung der Orte',['Lautstaerke jedes Autos','die Farbe aller Haustiere','alle Telefonnummern'],'Eine Karte beschreibt raeumliche Beziehungen.'],
 ['Welche Angabe ist zum Messen einer realen Entfernung besonders wichtig?','Maßstab',['Autor des Schulbuchs','Himmelsfarbe','Papierfarbe'],'Der Maßstab verbindet Kartendistanz und Wirklichkeit.'],
 ['Was stellt eine blaue Linie auf einer Karte oft dar?','einen Fluss, wenn die Legende das bestaetigt',['immer einen Breitengrad','immer einen Wanderweg','immer eine Stadtgrenze'],'Zuerst in der Legende nachsehen; Farben allein können variieren.'],
 ['Was ist ein Planquadrat?','ein Feld zur Orientierung durch Buchstaben und Zahlen',['ein Teil des Kompasses','ein Linienmaßstab','ein Planet'],'Im Planquadrat suchst du die Schnittstelle von Spalte und Zeile.'],
 ['Welcher Kartentyp hilft dir beim Vergleich der Bevoelkerungsdichte?','thematische Bevoelkerungskarte',['Luftbild einer Hausfassade','Wetterkarte nur mit Wolken','Straßenfoto einer Kreuzung'],'Die thematische Karte hat ein spezielles Untersuchungsthema.'],
 ['Was bedeutet „Generalisierung“ bei Karten?','Vereinfachung wichtiger Inhalte',['genaue Nachzeichnung jeder Fensterscheibe','Austausch von Nord und Sued','Weglassen der Legende'],'Nur Wichtiges wird dargestellt; Kleinigkeiten werden reduziert.'],
 ['Warum sind Kartenzeichen sinnvoll?','Sie vermitteln Informationen platzsparend',['Sie machen alle Karten maßstabslos','Sie ersetzen jede Richtung','Sie zeigen nur den Titel'],'Ein Symbol kann viele Worte ersetzen.'],
 ['Welche Reihenfolge hilft beim Lesen einer fremden Karte?','Titel, Orientierung, Legende, dann Einzelheiten',['zuerst raten, dann weglegen','nur die kleinste Schrift suchen','Maßstab grundsaetzlich ignorieren'],'Lies schrittweise die grundlegenden Kartenbestandteile.'],
 ['Woran erkennst du, dass eine Karte nach Osten statt nach Norden ausgerichtet ist?','am Nordpfeil, der nicht nach oben zeigt',['an der Blattgröße','an den Buchstaben A bis Z','am Preis des Atlasses'],'Die Kartenorientierung kann abweichen; der Nordpfeil gibt Klarheit.'],
 ['Du suchst im Atlas einen Ortsnamen. Welches Hilfsmittel nutzt du?','alphabetisches Register',['nur den Einband','nur die Windrose','das Reifenprofil'],'Das Register führt zu Kartenseiten und Planquadraten.'],
 ['In einer Karte sind mehrere Gebiete rosa und rosa ist als Siedlung erklaert. Was liest du ab?','Lage der Siedlungsflächen',['Tiefen der Ozeane','Lichtstärke der Sonne','Windgeschwindigkeit'],'Flächensignaturen markieren bestimmte Nutzungen.'],
 ['Du findest eine Bergspitze mit 850 m. Was bezeichnet die Zahl?','Höhe des Gipfels über dem angegebenen Höhenbezug',['Breite des Berges in Kilometern','Länge des Wanderwegs','Anzahl der Berge'],'Berg-Höhenangaben sind keine Weglängen.'],
 ['Auf einer Karte ist ein See blau dargestellt. Welche Frage kannst du damit beantworten?','Wo liegt der See?',['Wie schmeckt sein Wasser?','Was kostet jedes Boot?','Wie laut rauscht das Wasser?'],'Eine Karte hilft besonders bei raeumlichen Fragen.']
];
MAPQ.forEach(([t,c,b,e])=>focusAdd('kartenlesen',t,[c,...b],0,e,['Lies zunaechst die Frage genau.','Nutze Titel, Legende, Nordpfeil oder Raster der Karte.',e]));
for(let i=0;i<16;i++){
 const x=String.fromCharCode(65+(i%8)),row=((i+Math.floor(i/8)*3)%8)+1;
 const wrong=[String.fromCharCode(65+((i+2)%8))+row,x+((row%8)+1),String.fromCharCode(65+((i+3)%8))+((row%8)+1)];
 focusAdd('kartenlesen','Auf deiner Karte wird die gesuchte Stelle durch Spalte '+x+' und Zeile '+row+' angegeben. Welches Planquadrat ist richtig?',[x+row,...wrong],0,'Die korrekte Schreibweise ist zuerst der Buchstabe '+x+', danach die Zeilenzahl '+row+'.');
}
const testCoords=[[-30,-50],[-20,40],[40,-20],[20,30],[0,-40],[-10,0],[30,50],[-40,10],[10,-10],[50,20],[0,0],[-50,-30],[-30,20],[20,-50],[40,40],[-10,10],[10,20],[-20,-10],[30,0],[-40,-40],[50,-10],[0,30],[-50,40],[10,-30]];
function coordTxt(a,b){return (a===0?'0° Breite':Math.abs(a)+'° '+(a>0?'N':'S'))+', '+(b===0?'0° Länge':Math.abs(b)+'° '+(b>0?'O':'W'))}
testCoords.forEach(([lat,lon],i)=>{
 const wrong1=coordTxt(lat===0?10:-lat,lon);
 const wrong2=coordTxt(lat,lon===0?10:-lon);
 const wrong3=coordTxt(lon,lat);
 let opts=[coordTxt(lat,lon),wrong1,wrong2,wrong3];
 if(new Set(opts).size<4)opts[3]=coordTxt(lat===50?40:lat+10,lon===50?40:lon+10);
 focusAdd('gradnetz','Ein Punkt liegt bei '+(lat===0?'0° Breite':Math.abs(lat)+'° '+(lat>0?'nördlicher':'südlicher')+' Breite')+' und '+(lon===0?'0° Länge':Math.abs(lon)+'° '+(lon>0?'östlicher':'westlicher')+' Länge')+'. Welche Koordinaten sind richtig?',opts,0,'Erst Breite (N/S), dann Länge (O/W): '+coordTxt(lat,lon)+'.',[
  'Erst die Breite bestimmen: N, S oder 0°.',
  'Dann die Länge bestimmen: O, W oder 0°.',
  'Schreibe beides in genau dieser Reihenfolge.']);
});
for(let i=0;i<20;i++){
 const lat=[-40,-30,-20,-10,0,10,20,30,40][i%9];
 const lon=[-40,-30,-20,-10,0,10,20,30,40][(i*3)%9];
 const dir=i%4;
 const dLat=dir===0?10:dir===1?-10:0,dLon=dir===2?10:dir===3?-10:0;
 let opts=[coordTxt(lat+dLat,lon+dLon),coordTxt(lat-dLat,lon-dLon),coordTxt(lat+dLon,lon+dLat),coordTxt(lat,lon)];
 if(new Set(opts).size!==4){opts=[coordTxt(lat+dLat,lon+dLon),coordTxt(lat+20,lon+20),coordTxt(lat-20,lon-20),coordTxt(lat,lon)]}
 focusAdd('gradnetz','Ein Schiff startet bei '+coordTxt(lat,lon)+' und fährt genau 10° '+['nach Norden','nach Süden','nach Osten','nach Westen'][dir]+'. Welche Koordinate hat es danach?',opts,0,'Beim Bewegen nach Norden/Süden ändert sich nur die Breite, nach Osten/Westen nur die Länge. Ziel: '+opts[0]+'.');
}
