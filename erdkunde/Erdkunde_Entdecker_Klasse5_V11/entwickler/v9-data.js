/* Gustav Globus – zehn originelle, fachlich geprüfte Comic-Missionen. */
'use strict';
const G9_MISSIONS=[
{id:'blicke',topic:'perspektive',icon:'🏫',name:'Über den Dächern',tag:'Diepholz · Ansichten',place:'Diepholz',lab:'view',goal:'Draufsicht, Schrägblick und Seitenansicht sicher unterscheiden',kind:'building',scenes:[
 ['Gustav startet die Drohne','Beim Schulzentrum in Diepholz will Gustav wissen: Wie sieht dasselbe Gebäude aus verschiedenen Blickrichtungen aus?','Ein echtes Gebäude darf ich nicht einfach neu erfinden. Darum verwenden wir für die Lage die reale Karte und für die Fassade nur ein belegtes Originalfoto.','Im Karten-Lernlabor warten die Originalquellen. In dieser Comic-Szene üben wir mit einem ausdrücklich erfundenen Modellhaus.'],
 ['Der Blick von oben','Die Drohne steigt senkrecht nach oben. Plötzlich sieht Gustav Wege, Dächer und Grundstücke fast wie Formen auf Papier.','Jetzt erkenne ich, welches Haus neben dem anderen liegt. Aber die Vorderseite und die Gebäudehöhe sehe ich viel schlechter.','Draufsicht bedeutet von oben. Eine Karte stellt diese Lage zusätzlich vereinfacht dar.'],
 ['Gustav schaut von der Straße','Gustav landet und betrachtet das Modellhaus aus Augenhöhe. Dachform, Türen, Fenster und die Höhe werden deutlicher.','Hier sehe ich die Fassade. Dafür ist mir nicht mehr klar, wie alle Straßen hinter dem Gebäude verlaufen.','Seitenansicht: Blick von der Seite. Sie zeigt Höhe und Form, nicht die ganze Anordnung.'],
 ['Der große Vergleich','Gustav legt eine Karte, eine Draufsicht und eine Seitenansicht nebeneinander. Die Klasse entdeckt dieselben Objekte in jeder Ansicht.','Drei Bilder desselben Ortes – und drei verschiedene Aufgaben! Jetzt kannst du sie selbst vergleichen.','Prüfe: Von wo wird geschaut? Was ist sichtbar? Welche Informationen gehen verloren?']
],samples:['Ein Hausdach und Straßenkreuzungen von oben: Draufsicht.','Ein Hauseingang mit Fenstern auf Augenhöhe: Seitenansicht.','Farben, Wege und Gebäudesymbole mit Legende: Karte.'],simple:'Draufsicht = von oben, Seitenansicht = von der Seite, Karte = vereinfacht und mit Zeichen.',experiment:'perspective',n:10},
{id:'kompass',topic:'himmelsrichtungen',icon:'🧭',name:'Der verdrehte Kompass',tag:'Himmelsrichtungen',place:'Expedition',lab:'compass',goal:'Haupt- und Nebenhimmelsrichtungen sicher bestimmen',kind:'compass',scenes:[
 ['Der verlorene Weg','Gustav steht mit seinem Team an einer Kreuzung. Auf dem Zettel steht: Gehe erst nach Norden, dann nach Nordosten.','Die Karte liegt schief! Wohin soll ich überhaupt gehen?','Richte eine Karte zuerst nach der Nordrichtung aus.'],
 ['Vier Hauptwege','Gustav zeichnet N oben, O rechts, S unten und W links auf die Windrose.','Nie Ohne Seife Waschen: So merke ich mir den Uhrzeigersinn.','Hauptrichtungen: N – O – S – W.'],
 ['Vier Zwischenwege','Zwischen Norden und Osten entdeckt Gustav Nordosten. Ebenso gibt es Südosten, Südwesten und Nordwesten.','Die Hälfte zwischen zwei Hauptrichtungen ist eine Nebenrichtung!','Achte auf die Reihenfolge: N – NO – O – SO – S – SW – W – NW.'],
 ['Gustavs Wegfinder','Das Team darf den Weg nur fortsetzen, wenn es die nächste Richtung richtig erkennt.','Zeig mit der Windrose selbst, wohin ich jetzt laufen soll!','Beschreibe Wege mit Start, Richtung, Abzweigung und Ziel.']
],samples:['Rechts auf einer nordausgerichteten Karte: Osten.','Zwischen Süden und Westen: Südwesten.','Gegenüber von Nordosten: Südwesten.'],simple:'N oben. Im Uhrzeigersinn folgen O, S und W. NO liegt dazwischen.',experiment:'bearing',n:10},
{id:'schatz',topic:'gradnetz',icon:'📍',name:'Der Schatz im Gradnetz',tag:'Breiten- und Längengrade',place:'Weltreise',lab:'coords',goal:'Koordinaten mit Nord/Süd und Ost/West korrekt angeben',kind:'grid',scenes:[
 ['Die geheimnisvolle Nachricht','Gustav findet eine Flaschenpost: „Der Schatz liegt bei 20° N, 30° O.“','Zwei Zahlen? Dann brauchen wir auch zwei Richtungen auf der Erdkugel!','Koordinaten bestehen aus geografischer Breite und Länge.'],
 ['Der Äquator als Startlinie','Gustav färbt die waagerechten Breitenkreise ein und zeigt den Äquator bei 0°.','Nördlich heißt N, südlich heißt S. Der Äquator trennt die Halbkugeln.','Die Breite reicht von 0° bis 90° N oder S.'],
 ['Greenwich als Startlinie','Nun leuchtet der Nullmeridian bei 0° Länge. Gustav zeigt Meridiane, die von Pol zu Pol verlaufen.','Östlich heißt O, westlich heißt W. Meridiane treffen sich an den Polen.','Die Länge reicht bis 180° Ost oder West.'],
 ['Die Schatzsuche','Auf dem Kreuzungspunkt von 20° N und 30° O blinkt die Schatztruhe. Gustav möchte wissen, ob du sie finden kannst.','Erst die Breite, dann die Länge – sonst fahre ich zum falschen Ort!','Erst waagerechte Breite bestimmen, dann senkrechte Länge, dann Schnittpunkt markieren.']
],samples:['20° N, 30° O = 20 Grad nördlich, 30 Grad östlich.','0° Breite = Äquator.','0° Länge = Nullmeridian.'],simple:'Breite = Nord/Süd vom Äquator. Länge = Ost/West vom Nullmeridian. Immer Breite zuerst.',experiment:'coord',n:10},
{id:'zoom',topic:'massstab',icon:'📏',name:'Die schrumpfende Stadt',tag:'Diepholz · Maßstab',place:'Diepholz',lab:'scale',goal:'Große und kleine Maßstäbe verstehen und Entfernungen umrechnen',kind:'scale',scenes:[
 ['Gustav schaut auf Diepholz','Gustav sieht das Schulzentrum auf einer Karte. Aber wie passen Straßen und Gebäude auf einen kleinen Bildschirm?','Die Karte zeigt alles verkleinert. Wie viel kleiner, sagt mir der Maßstab!','Bei 1 : 10.000 steht 1 cm für 10.000 cm = 100 m.'],
 ['Hineinzoomen','Gustav zoomt näher heran. Einzelne Gebäude und Wege werden sichtbar; die Umgebung verschwindet aus dem Bild.','Jetzt ist die Karte detaillierter – obwohl mein Bildschirm gleich groß bleibt.','Ein großer Maßstab hat eine kleinere Zahl hinter dem Doppelpunkt.'],
 ['Herauszoomen','Nun sieht Gustav eine größere Umgebung, aber einzelne Wege sind nicht mehr so genau erkennbar.','Großer Ausschnitt, weniger Einzelheiten: kleiner Maßstab!','Beim kleinen Maßstab steht eine größere Maßstabszahl, etwa 1 : 1.000.000.'],
 ['Der Maßstabsrechner','Gustav misst auf einer Übungskarte 3 cm bei 1 : 50.000.','3 × 50.000 cm = 150.000 cm. Und das sind 1,5 km!','Zuerst multiplizieren, danach cm in m oder km umrechnen. Bildschirm-Zoom ist nicht automatisch ein exaktes 1:n-Verhältnis.']
],samples:['1 : 5.000 → 1 cm entspricht 50 m.','1 : 100.000 → 1 cm entspricht 1 km.','3 cm bei 1 : 50.000 → 1,5 km.'],simple:'Maßstab 1 : 10.000 heißt: 1 cm in der Karte = 10.000 cm in echt.',experiment:'scale',n:10},
{id:'berge',topic:'relief',icon:'⛰️',name:'Gustav auf dem Gipfel',tag:'Höhenlinien und Gelände',place:'Gebirge',lab:'height',goal:'Höhenlinien und Hangneigung vergleichen',kind:'mountain',scenes:[
 ['Der steile Aufstieg','Gustav wandert durch ein Gebirge. Auf der Karte wirken zwei Wege ähnlich lang, aber einer ist viel steiler.','Wie kann ich auf einer flachen Karte erkennen, wo es bergauf geht?','Höhenlinien verbinden Punkte gleicher Höhe.'],
 ['Die Linien rücken zusammen','Gustav stellt das Gelände steiler. Auf der Höhenlinienkarte rücken die Linien zusammen.','Wenn die gleiche Höhe auf kürzerer Strecke überwunden wird, ist der Hang steiler.','Dicht beieinander = steil.'],
 ['Der sichere Wanderweg','Gustav sucht einen weniger steilen Weg und begründet seine Wahl.','Weit auseinanderliegende Linien helfen mir, flachere Hänge zu finden.','Vergleiche immer den Höhenunterschied und den Abstand der Linien.']
],samples:['Eng gestaffelte Höhenlinien: steiler Hang.','Gleiche Höhe auf einer Linie.','Steilheit und absolute Höhe sind nicht dasselbe.'],simple:'Höhenlinien = Orte gleich hoch. Eng = steil, weit = flacher.',experiment:'height',n:5},
{id:'tag',topic:'zeitzonen',icon:'☀️',name:'Gustav jagt die Sonne',tag:'Tag, Nacht und Zeit',place:'Erde',lab:'daynight',goal:'Erdrotation und Tag-Nacht-Wechsel erklären',kind:'sun',scenes:[
 ['Gustav ist noch müde','In Deutschland ist es morgens hell, während Freunde anderswo auf der Erde schlafen.','Warum scheint die Sonne nicht überall gleichzeitig?','Nur die der Sonne zugewandte Erdhalbkugel wird direkt beleuchtet.'],
 ['Die Erde dreht sich','Gustav betrachtet die Erddrehung von West nach Ost in etwa 24 Stunden.','Drehen wir die Erde, wandern Orte in den hellen und den dunklen Bereich.','Der Wechsel von Tag und Nacht entsteht durch Erdrotation.'],
 ['Eine Welt voller Uhrzeiten','Gustav vergleicht Uhrzeiten und entdeckt die Datumsgrenze.','Die Erde hat Zeitzonen. Beim Überschreiten der Datumsgrenze kann das Datum wechseln.','Zeitzonen sind politisch festgelegt und verlaufen nicht überall genau entlang von Meridianen.']
],samples:['Sonnenzugewandte Seite: Tag.','Abgewandte Seite: Nacht.','Die Erde dreht sich west–ost in ungefähr 24 Stunden.'],simple:'Tag und Nacht entstehen, weil die Erde sich dreht.',experiment:'sun',n:5},
{id:'legende',topic:'kartenlesen',icon:'🗺️',name:'Die geheime Kartenlegende',tag:'Karten lesen',place:'Schulweg',lab:'atlas',goal:'Kartenzeichen, Nordpfeil und Legenden sicher lesen',kind:'legend',scenes:[
 ['Eine Karte ohne Schlüssel','Gustav hat eine Karte gefunden, aber die Zeichen sind verwischt.','Ist die blaue Linie ein Fluss oder eine Straße? Ohne Legende kann ich es nicht sicher sagen.','Kartenzeichen sind vereinbart; die Legende erklärt ihre Bedeutung.'],
 ['Der Schlüssel zur Karte','Gustav erstellt eine Legende mit Symbolen für Wasser, Wald, Straßen und Gebäude.','Jetzt kann ich die Karte lesen: Die Farben und Symbole haben Bedeutung.','Zuerst Titel und Legende prüfen, dann Nordrichtung und Maßstab.'],
 ['Die richtige Route','Gustav sucht einen Weg zu einem markierten Ort im Planquadrat D3.','Zuerst Spalte D, dann Zeile 3 – gefunden!','Ein Planquadrat ist ein Suchfeld aus Buchstabe und Zahl.']
],samples:['Blaue Linie kann für ein Gewässer stehen – Legende prüfen.','Planquadrat D3: Spalte D, Zeile 3.','Ein Symbol ohne Legende kann missverstanden werden.'],simple:'Titel lesen, Legende verstehen, Nordpfeil prüfen, dann Ort finden.',experiment:'legend',n:5},
{id:'karte',topic:'projektionen',icon:'🌏',name:'Die krumme Weltkarte',tag:'Kartenprojektion',place:'Weltall',lab:'projection',goal:'Erkennen, warum Weltkarten Flächen oder Formen verzerren',kind:'projection',scenes:[
 ['Der Globus soll flach werden','Gustav versucht, eine runde Orange ohne Risse flach auf den Tisch zu legen.','Das geht gar nicht ohne Schneiden oder Verzerren!','Auf der Kugel ist die Erdoberfläche gekrümmt.'],
 ['Grönland wird riesig','Auf einer Mercator-Weltkarte wirkt Grönland im Verhältnis zu Afrika viel zu groß.','Die Karte ist nützlich, aber nicht flächentreu.','Mercator erhält lokale Winkel, aber verzerrt Flächen besonders zu den Polen.'],
 ['Die Karte hat einen Zweck','Gustav vergleicht Weltkarten und fragt nach dem gewünschten Nutzen.','Keine flache Weltkarte kann gleichzeitig überall Winkel und Flächen exakt darstellen.','Verwende für Größenvergleiche flächentreue Projektionen.']
],samples:['Mercator: starke Flächenvergrößerung polnah.','Globus: Darstellung einer Kugel ohne flächige Abwicklung.','Flächentreue Karte: für Größenvergleich geeignet.'],simple:'Eine Kugel wird nicht ohne Verzerrung flach. Karten haben verschiedene Zwecke.',experiment:'projection',n:5},
{id:'rettung',topic:'gradnetz',icon:'🚢',name:'Notruf auf dem Meer',tag:'Koordinaten · Seenot',place:'Atlantik',lab:'coords',goal:'Koordinaten zur Orientierung richtig angeben und anwenden',kind:'ship',scenes:[
 ['Der Notruf','Ein Schiff funkt: „Wir brauchen Hilfe bei 10° S, 20° W!“','Wir brauchen genaue Koordinaten, damit die Rettung uns findet.','Zuerst Breite (S), danach Länge (W).'],
 ['Gustav zeichnet das Gradnetz','Er markiert den Äquator und den Nullmeridian. Dann läuft er 10° nach Süden und 20° nach Westen.','Jetzt weiß ich genau, welches Feld ich suchen muss.','Breitenkreise waagerecht, Meridiane von Pol zu Pol.'],
 ['Rettung erfolgreich','Gustav übermittelt den richtigen Schnittpunkt an die Rettungsleitstelle.','Eine vertauschte Himmelsrichtung könnte das Schiff an einen völlig anderen Ort führen!','Koordinaten mit Vorzeichen und Himmelsrichtung sorgfältig prüfen.']
],samples:['10° S, 20° W = südlich und westlich.','10° N, 20° W läge auf der falschen Halbkugel.','Koordinaten geben einen Punkt an, nicht automatisch eine Fahrstrecke.'],simple:'Schiffsort = Breite N/S, Länge O/W, an ihrem Schnittpunkt.',experiment:'coord',n:5},
{id:'planeten',topic:'sonnensystem',icon:'🪐',name:'Auf Planetenreise',tag:'Sonnensystem',place:'Weltall',lab:'planets',goal:'Sonne, Sterne, Planeten und Monde auseinanderhalten',kind:'space',scenes:[
 ['Gustav hebt ab','Gustav startet mit seinem Forschungsschiff im Sonnensystem. Die Sonne strahlt aus eigener Kraft.','Warum leuchtet die Sonne, aber die Erde nicht?','Die Sonne ist ein Stern; Planeten reflektieren hauptsächlich Sonnenlicht.'],
 ['Acht Planeten','Gustav reist von Merkur über Venus und Erde bis zu Neptun.','Pluto ist ein Zwergplanet, kein neunter Planet.','Die Planetenfolge beginnt Merkur – Venus – Erde – Mars.'],
 ['Unser Platz im All','Gustav blickt zurück: Erde, Sonnensystem und Milchstraße werden sichtbar.','Unsere Milchstraße ist eine Galaxie mit sehr vielen Sternen.','Ein Mond umkreist einen Planeten; ein Planet umkreist einen Stern.']
],samples:['Sonne = Stern, sie leuchtet selbst.','Erde = Planet, reflektiert Sonnenlicht.','Mond = natürlicher Begleiter eines Planeten.'],simple:'Sonne ist ein Stern. Die Erde ist ein Planet. Unser Mond umkreist die Erde.',experiment:'planets',n:5}
];
/* Unverwechselbare, eigene Transferaufgaben; weitere kommen aus der vorhandenen Aufgabenbank. */
const G9_QUESTIONS={
blicke:[
['Auf einer Aufnahme erkennst du Dächer und den Verlauf einer Kreuzung. Welche Blickrichtung ist das?',['Draufsicht','Seitenansicht','Ansicht von unten','Keine der Ansichten'],0,'Die Lage der Dächer und Straßen lässt sich am besten von oben erkennen.'],
['Gustav möchte die Höhe einer Fassade sehen. Welche Ansicht hilft?',['Seitenansicht','Draufsicht','Nur Planquadrat','Weltkarte'],0,'Die Fassade siehst du von der Seite; von oben erkennst du hauptsächlich das Dach.'],
['Was ist der Unterschied zwischen Draufsicht und Stadtplan?',['Ein Stadtplan ist generalisiert und nutzt Signaturen','Ein Stadtplan ist immer ein Foto','Eine Draufsicht hat keine Straßen','Es gibt keinen Unterschied'],0,'Eine reale Draufsicht zeigt viele Details; Karten vereinfachen und beschriften.'],
['Ein Haus steht direkt neben einem Sportplatz. Wo erkennst du ihre Lage zueinander am besten?',['Draufsicht','Seitenansicht','Nur ein Portraitfoto','Nur eine Uhr'],0,'Die Anordnung der Flächen ist von oben besser zu vergleichen.'],
['Was ist auf einer Seitenansicht eines Hauses besonders gut zu erkennen?',['Tür und Fenster der Fassade','Die gesamte Dachfläche','Alle Straßen der Stadt','Alle Planquadrate'],0,'Bei einer Ansicht auf Augenhöhe blickst du auf Fassade, Türen und Fenster.'],
['Ein Schüler behauptet, eine Straßenkarte sei eine Seitenansicht. Was stimmt?',['Eine Straßenkarte entspricht einer vereinfachten Draufsicht','Karten zeigen Gebäude immer von der Straße','Beides ist identisch','Eine Karte zeigt nur Himmel'],0,'Karten zeigen räumliche Lage von oben in vereinfachter Form.']
],
kompass:[
['Welche Himmelsrichtung liegt auf einer nordausgerichteten Karte rechts?',['Osten','Westen','Norden','Süden'],0,'Auf einer nordausgerichteten Karte: N oben, O rechts, S unten, W links.'],
['Welche Richtung liegt zwischen Norden und Westen?',['Nordwesten','Nordosten','Südwesten','Südosten'],0,'Die Nebenrichtung aus N und W heißt Nordwesten.'],
['Gustav geht nach Südosten. In welche zwei Hauptrichtungen bewegt er sich?',['Süden und Osten','Norden und Westen','Süden und Westen','Norden und Osten'],0,'Südosten liegt zwischen Süden und Osten.'],
['Welche Richtung liegt Nordosten gegenüber?',['Südwesten','Südosten','Nordwesten','Osten'],0,'Gegenüber von Nordosten liegt Südwesten (Drehung um 180°).'],
['Welche Richtung folgt im Uhrzeigersinn direkt auf Süden?',['Südwesten','Südosten','Nordosten','Nordwesten'],0,'Die acht Himmelsrichtungen heißen N, NO, O, SO, S, SW, W, NW.'],
['Die Karte ist gedreht. Wie findest du zuerst die Himmelsrichtungen?',['Nordpfeil suchen und Karte ausrichten','Oben ist immer Norden','Rote Farbe suchen','Blind nach rechts gehen'],0,'Nicht jede Karte liegt nordorientiert! Prüfe den Nordpfeil.']
],
schatz:[
['Was wird bei Koordinaten üblicherweise zuerst angegeben?',['Breitengrad','Längengrad','Uhrzeit','Kartenfarbe'],0,'Die geographische Breite steht vor der Länge.'],
['Was misst die geografische Breite?',['Nördlich oder südlich vom Äquator','Westlich oder östlich vom Nullmeridian','Wassertiefe','Entfernung zum Mond'],0,'Die Breite wird ab Äquator 0° nach Norden oder Süden gezählt.'],
['Was bedeutet 30° W?',['30 Grad westlich vom Nullmeridian','30 Grad südlich vom Äquator','30 Grad östlich vom Nullmeridian','30 Meter unter Wasser'],0,'W steht für westliche Länge vom Nullmeridian aus.'],
['Welches Koordinatenpaar liegt auf der Nord- und Osthalbkugel?',['20° N, 30° O','20° S, 30° O','20° N, 30° W','20° S, 30° W'],0,'N bedeutet Nordhalbkugel, O bedeutet östlich des Nullmeridians.'],
['Wo liegt 0° Breite?',['Am Äquator','Am Nordpol','Am Nullmeridian','In Greenwich'],0,'Der Äquator ist der Ausgangs-Breitenkreis 0°.'],
['Welche Linien treffen sich an Nord- und Südpol?',['Längenhalbkreise','Alle Breitenkreise','Straßen auf Karten','Maßstabsleisten'],0,'Meridiane verlaufen von Pol zu Pol und treffen sich an beiden Polen.']
],
zoom:[
['Was bedeutet Maßstab 1 : 10.000?',['1 cm auf Karte sind 100 m in echt','1 cm sind 10 km','10.000 km sind 1 cm','Karte ist unverkleinert'],0,'10.000 cm sind 100 Meter, daher 1 cm = 100 m.'],
['Welcher Maßstab zeigt bei gleicher Kartengröße mehr Einzelheiten?',['1 : 5.000','1 : 50.000','1 : 500.000','1 : 5.000.000'],0,'Je kleiner die Zahl hinter dem Doppelpunkt, desto größer der Maßstab und desto detaillierter die Karte.'],
['Wie weit sind 2 cm auf einer Karte 1 : 100.000 in Wirklichkeit?',['2 km','20 km','200 m','20 m'],0,'2 × 100.000 cm = 200.000 cm = 2 km.'],
['Bei 1 : 50.000 misst Gustav 3 cm. Wie weit ist das?',['1,5 km','15 km','150 km','150 m'],0,'3 × 50.000 cm = 150.000 cm = 1,5 km.'],
['Was gilt beim Herauszoomen aus einer Onlinekarte?',['Der sichtbare Ausschnitt wird größer','Die echte Stadt schrumpft','Alle Gebäude werden größer','Der Bildschirm misst mehr Zentimeter'],0,'Herauszoomen zeigt mehr Fläche, meist mit weniger Details.'],
['Warum darf Gustav Zoomstufe 17 nicht pauschal als Maßstab 1 : 17 bezeichnen?',['Zoom hängt von Anzeige und Projektion ab','Alle Zoomstufen sind Maßstabszahlen','Beim Zoomen ändert sich die echte Entfernung','Karten haben keine Skalierung'],0,'Zoomstufen sind keine universellen 1:n-Maßstabsangaben.']
],
berge:[
['Was bedeutet dicht beieinanderliegende Höhenlinien?',['Steiler Hang','Flacher Hang','Tiefer See','Breiter Wald'],0,'Für denselben Höhenunterschied ist die waagerechte Strecke kürzer: steiler.'],
['Was verbinden Höhenlinien?',['Orte gleicher Höhe','Orte gleicher Einwohnerzahl','Orte gleicher Uhrzeit','Nord- und Südpol'],0,'Alle Punkte einer Höhenlinie haben dieselbe Höhe über dem Bezugsniveau.'],
['Bei gleicher Höhendifferenz liegen die Linien weit auseinander. Der Hang ist …',['flacher','steiler','immer höher','immer tiefer'],0,'Größerer horizontaler Abstand bedeutet geringere Hangneigung.']
],
tag:[
['Warum gibt es Tag und Nacht?',['Wegen der Erdrotation','Weil die Sonne täglich ausgeht','Wegen des Mondes','Weil die Erde flach ist'],0,'Die Erde dreht sich; Orte wechseln zwischen beleuchteter und abgewandter Seite.'],
['Welche Seite der Erde hat gerade Tag?',['Die der Sonne zugewandte','Die der Sonne abgewandte','Immer die Nordhalbkugel','Immer die Südhalbkugel'],0,'Direktes Sonnenlicht erreicht nur die zugewandte Hälfte.'],
['In welcher Richtung dreht sich die Erde?',['Von West nach Ost','Von Ost nach West','Nur nach Norden','Gar nicht'],0,'Die Erde rotiert von West nach Ost.']
],
legende:[
['Wie heißt die Erklärung der Kartenzeichen?',['Legende','Äquator','Meridian','Atmosphäre'],0,'Die Legende erklärt Signaturen und Farben.'],
['Was suchst du zuerst bei Planquadrat D3?',['Spalte D, dann Zeile 3','Breitengrad 3','Hausnummer 3','Immer das Kartenende'],0,'Buchstabe zeigt Spalte, Zahl zeigt Zeile.'],
['Wozu nutzt du den Nordpfeil?',['Die Kartenausrichtung erkennen','Die Temperatur ablesen','Die Höhe messen','Die Schiffsgröße bestimmen'],0,'Der Nordpfeil zeigt, wo Norden auf der Karte liegt.']
],
karte:[
['Warum ist eine Weltkarte nicht an allen Stellen verzerrungsfrei?',['Weil die runde Erdoberfläche flach dargestellt wird','Weil die Erde ein Würfel ist','Weil Grönland größer als Afrika ist','Weil es keine Längengrade gibt'],0,'Eine Kugelfläche lässt sich nicht ohne Verzerrung vollständig auf eine Ebene abbilden.'],
['Wo ist die Flächenverzerrung bei Mercator besonders stark?',['Nahe den Polen','Nur am Äquator','Nur in Städten','Nirgendwo'],0,'Die Mercatorprojektion vergrößert Flächen zu hohen Breiten stark.'],
['Welche Projektion eignet sich besser für faire Flächengrößenvergleiche?',['Eine flächentreue Karte','Immer Mercator','Jede beliebige Karte','Nur eine Straßenkarte'],0,'Flächentreue Karten erhalten Flächenverhältnisse auf Kosten anderer Eigenschaften.']
],
rettung:[
['10° S, 20° W – auf welchen beiden Seiten liegt der Ort?',['Südlich vom Äquator, westlich von Greenwich','Nördlich und östlich','Nördlich und westlich','Südlich und östlich'],0,'S = südliche Breite, W = westliche Länge.'],
['Warum muss ein Schiffsnotruf beide Koordinaten enthalten?',['Erst beide bestimmen die genaue geografische Position','Eine Zahl ist die Fahrzeit','Man braucht nur die Uhrzeit','Beide sind die gleiche Angabe'],0,'Nur die Kombination aus Breite und Länge bestimmt den Schnittpunkt.'],
['Was bedeutet die Änderung von 10° S zu 10° N?',['Wechsel auf die Nordhalbkugel','Gleicher Ort','Nur 10 Meter Unterschied','Wechsel in den Pazifik garantiert'],0,'Süd- und Nordbreite liegen auf verschiedenen Seiten des Äquators.']
],
planeten:[
['Welcher Himmelskörper leuchtet selbst?',['Sonne','Erde','Mond','Mars'],0,'Die Sonne erzeugt als Stern eigenes Licht.'],
['Wie viele anerkannte Planeten hat unser Sonnensystem?',['Acht','Neun','Sechs','Zwölf'],0,'Seit der IAU-Klassifikation von 2006 zählt Pluto zu den Zwergplaneten.'],
['Was umkreist der Mond der Erde?',['Die Erde','Nur die Sonne direkt','Den Jupiter','Die Milchstraße'],0,'Der Mond ist ein natürlicher Begleiter der Erde.']
]
};
