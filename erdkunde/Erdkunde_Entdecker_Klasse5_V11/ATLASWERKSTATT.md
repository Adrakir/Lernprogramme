# Gradnetz- und Atlaswerkstatt · 26.10.2026

Start über `index.html` und den neuen Menüpunkt **Gradnetz & Atlas**. Auch auf der Startseite und in den Lernpfaden Gradnetz/Atlanten ist ein Zugang eingebaut. Der bisherige App-Inhalt bleibt erhalten.

## Vier Bereiche

- **Gradnetz entdecken:** orthografisch projizierte, drehbare Modellkugel mit Breitenkreisen, Meridianen, markiertem Schnittpunkt und Breitenwinkel. Blick vom Äquator und auf beide Pole; Linienarten einzeln anzeigen. Rückseiten sind gestrichelt. Drehung ist anhaltbar, stoppt beim Verlassen und beachtet reduzierte Bewegung.
- **Erdviertel:** farbige Weltkarte, Vergleich der vier Halbkugeln und acht Zuordnungsaufgaben einschließlich Äquator, Nullmeridian, 180°-Meridian und Polen.
- **Blickrichtungen:** vier Modelle wie die vier Felder der Unterrichtsskizze. Selbst Formen zuordnen und einzeln begründete Rückmeldung erhalten.
- **Orte im Atlas:** drei Sucharten mit je vier Beispielen (Prag, Lissabon, San Francisco, Alice Springs). Fünf anwählbare Schritte, abspielbarer Suchweg, Komma-Eingabe, Prüfung der Himmelsrichtung, Hilfen, Modellregister und erläuterte Planquadrate. 12 Ortsaufgaben + 8 Erdviertelaufgaben + 4 Blickzuordnungen = 24 unterschiedliche bewertbare Teilaufgaben.

Ein Ortsname plus ein Grad führt über das Ortsregister zur Karte; der fehlende Grad wird abgelesen. Ein einzelner Grad ohne weitere Ortsinformation legt normalerweise keinen eindeutigen Punkt fest. Das Modellregister enthält nur die vier Übungsorte. Es ersetzt kein weltweites Ortsverzeichnis. Echte Atlasseitenzahlen hängen von Ausgabe und Auflage ab und werden hier nicht vorgetäuscht.

Die Ortslagen sind auf 0,1° gerundet. Die numerische Rückmeldung akzeptiert ±0,16° als Ablesetoleranz, prüft aber Nord/Süd bzw. Ost/West gesondert. Der Punkt 23,6° S / 133,8° O aus der Skizze wird nur als Nähe von Alice Springs bezeichnet. Die App verwendet den nachgewiesenen Referenzpunkt 23,7° S / 133,9° O. Prag liegt bei rund 50,1° N, nicht 50,9° N.

## Quellen

- NOAA: https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html
- NOAA, Datumsgrenze/180°: https://oceanservice.noaa.gov/facts/longitude.html
- GeoNames (CC BY 4.0): https://www.geonames.org/3067696/prague.html · https://www.geonames.org/2267057/lisbon.html · https://www.geonames.org/5391959/san-francisco.html
- Northern Territory Government, Place Names Register: https://www.ntlis.nt.gov.au/placenames/print_extract.jsp?id=22272
- Bereits enthaltene Küstenkonturen: Natural Earth, Public Domain. Neue Grafiken sind eigene SVG-Lernmodelle.

## Entwicklung und Prüfung

`node entwickler/build-offline.js` erzeugt die startfähige Ein-Datei-App. `node entwickler/atlaswerkstatt.test.cjs` prüft die fachlichen Berechnungen, Eingaben und Ressourcen. Die Werkstatt verwendet keine externen Laufzeitbibliotheken. Ihr Fortschritt liegt separat unter `geo-atlaswerkstatt-v1` und kann nach Rückfrage innerhalb der Werkstatt zurückgesetzt werden. Die übrigen App-Lernstände bleiben dabei erhalten.

Im GitHub-Stand fehlten die Hauptdatei und mehrere Entwickler-Abhängigkeiten. Diese wurden aus dem vorhandenen vollständigen V11-Paket ergänzt. Bereits im Repository vorhandene neuere Dateien (Ansichten, Kartenexpedition und OSM-Daten) wurden beibehalten und in die Ein-Datei-App eingebunden.
