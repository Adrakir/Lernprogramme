/* Die nächsten sieben Gustav-Lernabenteuer schließen die noch offenen Buchkapitel ab. */
'use strict';
G9_MISSIONS.push(
{id:'forscherblick',topic:'geographie',icon:'🔎',name:'Gustavs Forschungsbrille',tag:'Was ist Erdkunde?',place:'Fiktive Küstenlandschaft',lab:'world',goal:'Natur und menschengemachte Veränderungen unterscheiden',kind:'geofocus',experiment:'geofocus',simple:'Physische Geographie untersucht die Natur, Humangeographie den Menschen und seine Nutzung des Raums.',n:5,scenes:[
 ['Zwei Fragen an einen Ort','Gustav sieht einen Strand und einen kleinen Hafen.','Warum entstand der Strand? Und warum stehen dort Häuser?','Geographie untersucht natürliche und menschliche Vorgänge und ihr Zusammenspiel.'],
 ['Gustavs Naturbrille','Gustav schaltet seine Forschungsbrille auf Natur.','Jetzt untersuche ich Dünen, Wasser, Sand und Wetter.','Physische Geographie beschäftigt sich mit den natürlichen Erscheinungen der Erde.'],
 ['Gustavs Menschenbrille','Die Brille zeigt Hafen, Häuser und Wege.','Menschen verändern ihre Umgebung. Das kann auch die Natur beeinflussen.','Humangeographie fragt zum Beispiel nach Siedlungen, Verkehr und Wirtschaft.']
],samples:['Düne, Fluss und Wind: natürliche Phänomene.','Hafen und Straßen: vom Menschen geschaffen.','Ein Deich zeigt besonders anschaulich, wie Menschen auf Naturbedingungen reagieren.']},
{id:'wegelupe',topic:'wege',icon:'🚶',name:'Der knifflige Schulweg',tag:'Orientierung und Navigation',place:'Fiktives Schulviertel',lab:'compass',goal:'Wege vergleichen und eindeutig beschreiben',kind:'route',experiment:'route',simple:'Eine gute Route berücksichtigt nicht nur Entfernung, sondern auch sichere Querungsmöglichkeiten.',n:5,scenes:[
 ['Gustav sucht den Weg','Gustav hat zwei Möglichkeiten, zur Schule zu gehen.','Der kürzeste Weg muss nicht immer der beste sein.','Beim Vergleichen von Wegen sind Entfernung, Orientierung und sichere Querungen wichtig.'],
 ['Der Plan zeigt zwei Wege','Die erste Strecke ist kürzer. Die zweite führt über eine geregelte Querung.','Ich schaue auf Kreuzungen und lege eine deutliche Wegbeschreibung an.','Auf einer Karte können zwei unterschiedliche Wege zum selben Ziel führen.'],
 ['Welche Route wählst du?','Gustav soll beide Routen vergleichen und seine Entscheidung begründen.','Achte auf Start, Ziel, Himmelsrichtungen und wichtige Wegpunkte.','Dieses Modell ist fiktiv und keine aktuelle Verkehrsempfehlung.']
],samples:['Eine Wegbeschreibung beginnt beim Startpunkt.','Sie nennt Abzweigungen in der richtigen Reihenfolge.','Die sichere Straßenüberquerung kann wichtiger sein als wenige Meter Umweg.']},
{id:'luftblick',topic:'luftbild',icon:'🛩️',name:'Gustavs Drohnenkamera',tag:'Luftbild und Karte',place:'Fiktives Wohnviertel',lab:'view',goal:'Luftbildarten erkennen und die Wirkung der Flughöhe erklären',kind:'camera',experiment:'camera',simple:'Ein Senkrechtluftbild zeigt von oben, ein Schrägluftbild von schräg oben. Mit zunehmender Flughöhe werden kleine Details schwerer erkennbar.',n:5,scenes:[
 ['Die Drohne steigt','Gustav betrachtet einen fiktiven Ort von einem Flugzeug aus.','Von oben sehe ich die Straßen anders als vom Boden.','Ein Luftbild bildet einen realen Ausschnitt fotografisch ab; Karten vereinfachen zusätzlich.'],
 ['Senkrecht oder schräg?','Die Kamera wird ausgerichtet. Dächer oder Fassaden kommen stärker ins Bild.','Senkrecht = nach unten, schräg = seitlicher Blick auf die Gebäude.','Beim Schrägluftbild können verdeckte Flächen und Perspektivverkürzungen auftreten.'],
 ['Immer höher hinaus','Beim Weitersteigen rücken Einzelheiten optisch zusammen.','Kleinere Gegenstände kann ich jetzt kaum unterscheiden.','Die wahrnehmbaren Details hängen auch von Auflösung und Flughöhe ab.']
],samples:['Senkrechtaufnahme: vor allem Dächer und Lage.','Schrägaufnahme: Fassaden und Baukörper erkennbar.','Kartenzeichen erscheinen im Stadtplan, nicht automatisch im Luftbild.']},
{id:'kartenwechsel',topic:'kartenarten',icon:'🗺️',name:'Drei Karten – ein Ort',tag:'Kartenarten und Signaturen',place:'Fiktive Region',lab:'map',goal:'Topografische, physische und thematische Karten unterscheiden',kind:'maptypes',experiment:'maptypes',simple:'Topografische Karten zeigen viele Geländeobjekte. Physische Karten betonen Geländeformen. Thematische Karten stellen ein bestimmtes Thema dar.',n:5,scenes:[
 ['Gustav braucht Orientierung','Gustav möchte zu einem See fahren und öffnet eine Karte.','Welche Informationen brauche ich für meinen Weg?','Topografische Karten helfen beim Orientieren anhand verschiedener Landschaftsmerkmale.'],
 ['Gustav erkundet Berge','Die Karte betont nun Gebirge, Tiefland und Gewässer.','Hier kann ich die Höhenunterschiede leichter erkennen.','Physische Karten zeigen vor allem Geländeformen und Höhenstufen.'],
 ['Ein ganz bestimmtes Thema','Gustav prüft, wo besonders viel Wald liegt.','Das ist eine thematische Karte: Sie konzentriert sich auf eine Fragestellung.','Die Legende erklärt in jedem Fall die verwendeten Farben und Zeichen.']
],samples:['Topografisch: Wege, Orte, Gewässer, Höhenlinien.','Physisch: Höhenstufen, Berge und Gewässer.','Thematisch: zum Beispiel Waldanteile oder Bevölkerungsdichte.']},
{id:'atlasdetektiv',topic:'atlanten',icon:'📖',name:'Geheimcode im Atlas',tag:'Atlas und Register',place:'Fiktive Atlasübung',lab:'atlas',goal:'Registereinträge, Kartenseiten und Planquadrate nutzen',kind:'atlasgrid',experiment:'atlasgrid',simple:'Im Atlasregister findest du die Kartenseite und das Planquadrat. Ein Feld wie C3 bedeutet: Spalte C, Zeile 3.',n:5,scenes:[
 ['Ein geheimnisvoller Eintrag','Im Register findet Gustav einen Hinweis: „Seite 24, C3“.','Die Seite öffne ich zuerst. Dann suche ich das Planquadrat.','Das Register ist alphabetisch sortiert und verweist auf die Kartenseiten.'],
 ['Ein Raster erscheint','Oben stehen Buchstaben, am Rand Zahlen.','Erst C suchen, dann 3 – und schon habe ich das Feld!','Das Planquadrat entsteht am Schnitt der beschrifteten Spalte und Zeile.'],
 ['Gustav prüft sein Ergebnis','Der gesuchte Ort liegt tatsächlich im Feld C3.','Der Code ist kein Breiten- oder Längengrad, sondern ein Atlas-Suchfeld.','Planquadrate sind von Karte zu Karte unterschiedlich eingeteilt.']
],samples:['Seite 24, C3: zuerst Kartenseite 24 öffnen.','C ist die Spalte; 3 ist die Zeile.','Breiten- und Längengrade benutzt du zur globalen Ortsbestimmung, Planquadrate im Atlas.']},
{id:'wasserplanet',topic:'erde',icon:'🌊',name:'Gustav auf dem Wasserplaneten',tag:'Kontinente und Ozeane',place:'Erde',lab:'world',goal:'Sieben Kontinente sowie die Land-Wasser-Verteilung verstehen',kind:'water',experiment:'water',simple:'Rund 71 % der Erdoberfläche sind von Wasser bedeckt. Wir unterscheiden sieben Kontinente; heute werden meist fünf Ozeane bezeichnet.',n:5,scenes:[
 ['Ein blauer Blick aus dem All','Gustav staunt: Auf der Erde ist sehr viel Wasser zu sehen.','Warum nennt man die Erde manchmal Wasserplanet?','Etwa 71 Prozent der Erdoberfläche bestehen aus Wasserflächen.'],
 ['Kontinente entdecken','Gustav lernt die sieben Kontinente kennen.','Nicht alles Land gehört zu demselben Kontinent.','Asien, Afrika, Nordamerika, Südamerika, Antarktika, Europa und Australien werden im Schulbuch unterschieden.'],
 ['Die großen Ozeane','Gustav schaut auf die Meere und Ozeane.','Das Schulbuch nennt drei große Ozeane; oft werden heute fünf Ozeane unterschieden.','Pazifik, Atlantik, Indischer Ozean, Arktischer und Südlicher Ozean bilden die verbreitete Fünfer-Einteilung.']
],samples:['Die Erde besitzt etwa 71 Prozent Wasserfläche.','Asien ist flächenmäßig der größte Kontinent.','Der Pazifische Ozean ist der größte Ozean.']},
{id:'kartenatelier',topic:'skizzen',icon:'✏️',name:'Gustav zeichnet einen Plan',tag:'Eigene Karten zeichnen',place:'Fiktiver Stadtplan',lab:'map',goal:'Eine verständliche Kartenskizze mit Legende gestalten',kind:'sketch',experiment:'sketch',simple:'Eine Kartenskizze lässt Unwichtiges weg und zeigt Wichtiges mit vereinbarten Zeichen. Titel, Nordpfeil und Legende helfen beim Lesen.',n:5,scenes:[
 ['Aus dem Chaos wird ein Plan','Gustav soll einen fiktiven Schulweg zeichnen. Das Luftbild ist zu unübersichtlich.','Ich nehme nur wichtige Objekte und Wege in die Skizze auf.','Karten werden für ihren Zweck vereinfacht – das heißt Generalisierung.'],
 ['Gustavs Zeichenatelier','Gustav verwendet Farben und Zeichen für Schule, Wege und Grünflächen.','Damit alle meine Symbole verstehen, brauche ich eine Legende.','Eine Skizze benötigt verständliche Kartenzeichen.'],
 ['Das Kartenmeisterstück','Jetzt fehlen nur noch Überschrift und Nordpfeil.','Kannst du mir helfen, eine eigene kleine Karte anzufertigen?','Eine Kartenskizze ist nicht automatisch maßstabsgetreu.']
],samples:['Blau für ein Gewässer, Grün für eine Grünfläche – wenn die Legende das so erklärt.','Die Himmelsrichtung wird durch einen Nordpfeil sichtbar.','Nur wichtige Informationen einzeichnen, nicht alle Einzelheiten.']}
);
Object.assign(G9_QUESTIONS,{
forscherblick:[
['Welche Frage gehört zur physischen Geographie?',['Wie entstehen Dünen?','Warum pendeln Menschen?','Wie groß ist die Einkaufsstraße?','Wie viele Busse fahren?'],0,'Dünen werden durch natürliche Vorgänge wie Wind und Sandtransport geformt.'],
['Was untersucht die Humangeographie besonders?',['Wie Menschen ihren Lebensraum nutzen','Nur die Wolkenbildung','Nur die Erdrotation','Nur die Entstehung von Gebirgen'],0,'Siedlungen, Wirtschaft, Verkehr und Bevölkerung gehören zu typischen Fragen der Humangeographie.'],
['Ein Deich wurde zum Schutz vor Hochwasser gebaut. Was zeigt das?',['Mensch und Natur beeinflussen sich','Der Deich ist ein Planet','Wasser fließt nie','Es ist kein geografisches Thema'],0,'Menschen bauen Deiche als Reaktion auf natürliche Hochwassergefahren.']
],
wegelupe:[
['Was gehört zu einer guten Wegbeschreibung?',['Startpunkt, Wegepunkte und eindeutige Richtungen','Nur der Name des Ziels','Ausschließlich Entfernungen ohne Bezug','Ungeordnete Hinweise'],0,'Ein Weg ist leichter nachvollziehbar, wenn die Angaben in der tatsächlichen Reihenfolge stehen.'],
['Ein kürzerer Weg hat eine ungesicherte Querung. Was gilt?',['Der kürzeste Weg ist nicht automatisch der geeignetste','Nur die Länge ist wichtig','Die Karte ersetzt alle Verkehrsregeln','Querungen sind egal'],0,'Sichere Querungen sind neben der Länge wichtige Auswahlkriterien.'],
['Warum kontrolliert Gustav die Nordrichtung?',['Um links, rechts und Himmelsrichtungen richtig einzuordnen','Um die Wettertemperatur zu berechnen','Damit Häuser höher werden','Damit Straßen kürzer werden'],0,'Nur mit bekannter Kartenausrichtung lassen sich geografische Richtungen sicher ablesen.']
],
luftblick:[
['Was ist ein Senkrechtluftbild?',['Eine Aufnahme fast senkrecht von oben','Ein Bild nur vom Straßenniveau','Eine Zeichnung des Sonnensystems','Eine Tabelle'],0,'Die Kamera blickt nahezu senkrecht nach unten.'],
['Was sieht man im Schrägluftbild oft besser?',['Häuserfassaden und räumliche Tiefe','Alle Dächer unverzerrt in gleichem Maßstab','Jedes Planquadrat','Die ganze Rückseite jedes Gebäudes'],0,'Schrägaufnahmen zeigen Fassaden und Tiefenwirkung; dabei können Objekte verdeckt werden.'],
['Warum verschwinden kleine Einzelheiten beim Aufsteigen?',['Sie werden im Bild immer kleiner','Die Gebäude verschwinden wirklich','Der Maßstab wird gleich groß','Es wird automatisch Nacht'],0,'Bei gleicher Bildauflösung nehmen kleine Gegenstände mit zunehmender Aufnahmehöhe weniger Bildpunkte ein.']
],
kartenwechsel:[
['Welche Karte betont Höhenstufen und Relief?',['Physische Karte','Karte der Bevölkerungszahlen','Fahrplan','Wettertagebuch'],0,'Physische Karten stellen besonders gut Landhöhen und Geländeformen dar.'],
['Eine Karte zeigt die Verteilung von Wäldern. Welche Kartenart ist das?',['Thematische Karte','Himmelskarte','Stets topografische Karte','Immer Schrägluftbild'],0,'Thematische Karten stellen ausgewählte Sachverhalte dar, zum Beispiel die Waldverteilung.'],
['Was kann eine topografische Karte enthalten?',['Siedlungen, Wege, Gewässer und Höheninformationen','Nur eine einzige Statistik','Nur Sternbilder','Nur Länderflaggen'],0,'Topografische Karten stellen viele Landschaftsmerkmale zusammen dar.']
],
atlasdetektiv:[
['Im Register steht „Seite 24, C3“. Was machst du zuerst?',['Karte auf Seite 24 öffnen','Gradnetz bei 24° S suchen','Einen Kreis um C3 auf dem Globus malen','Nur das Inhaltsverzeichnis lesen'],0,'Der Registereintrag nennt zuerst die Kartenseite.'],
['Was bedeutet C3 in einem Atlasgitter?',['Spalte C und Zeile 3','Dritter Kontinent','Drei Grad westliche Länge','Die Höhe über dem Meer'],0,'Planquadrate kombinieren Buchstaben-Spalte und Zahlen-Zeile.'],
['Wozu dient das Atlasregister?',['Orte alphabetisch auffinden','Immer die Wettervorhersage zu lesen','Nur Höhenlinien zu zeichnen','Sonnenstunden zu messen'],0,'Das Register ist eine alphabetische Suchhilfe für Orte.']
],
wasserplanet:[
['Wie groß ist ungefähr der Wasserflächenanteil der Erde?',['71 Prozent','20 Prozent','50 Prozent','95 Prozent'],0,'Etwa 71 Prozent der Erdoberfläche sind von Wasser bedeckt.'],
['Welcher Kontinent ist flächenmäßig am größten?',['Asien','Europa','Australien','Antarktika'],0,'Asien ist mit Abstand der größte Kontinent.'],
['Welcher Ozean ist am größten?',['Pazifischer Ozean','Indischer Ozean','Arktischer Ozean','Südlicher Ozean'],0,'Der Pazifik bedeckt die größte Meeresfläche.']
],
kartenatelier:[
['Was bedeutet Generalisieren bei einer Karte?',['Unwichtige Einzelheiten weglassen','Jede Dachpfanne einzeichnen','Die Karte unlesbar machen','Höhenangaben absichtlich vertauschen'],0,'Generalisieren bedeutet, Informationen für die Darstellung sinnvoll zu vereinfachen.'],
['Was gehört zu einer verständlichen Kartenskizze?',['Titel, Nordpfeil und Legende','Nur eine bunte Fläche','Unbeschriftete Symbole','Nur das Datum'],0,'Eine gute Kartenskizze erklärt ihren Inhalt mit Titel, Richtung und Zeichenlegende.'],
['Was musst du über den Maßstab einer freien Skizze wissen?',['Sie muss nicht maßstabsgetreu sein','Sie ist immer 1 : 1','Sie zeigt alle Entfernungen exakt','Sie ersetzt jede Vermessung'],0,'Handgezeichnete Skizzen sind häufig nicht maßstabsgetreu, sofern keine genaue Messung durchgeführt wurde.']
]
});
