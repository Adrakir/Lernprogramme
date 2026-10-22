# Erdkunde-Entdecker – Version 11 (Gustav Globus)

## Start

- **Direkt starten:** `index.html` in diesem Ordner im Browser öffnen oder in `G:\sebastian\Lernprogramme.html` die Kachel „Erdkunde-Entdecker“ wählen. Diese eigenständige HTML-Datei enthält die Lernmodelle und die neue Diepholzer Offline-Karte; dafür ist kein lokaler Server und keine Internetverbindung erforderlich.
- **Zur Bearbeitung:** `entwickler/index.html` und die weiteren Dateien im Ordner `entwickler` in VS Code öffnen. Für dauerhafte Speicherung und PWA-Installation empfiehlt sich eine lokale Entwicklungsumgebung bzw. HTTPS-Bereitstellung.
- Den Menüpunkt **📐 Praxiswerkstatt** wählen. Dort sind sechs Übungsstationen und zehn zusätzliche Praxisprüfungen vorhanden.
- Die bisherigen 17 Gustav-Abenteuer, 16 Lernpfade, Quiz-Arena, Lernlabore und älteren Klassenarbeiten sind weiterhin enthalten.

## Neu in V11

1. **Ansichten:** eine erfundene Umgebung aus Draufsicht, Seitenansicht und Kartenskizze untersuchen. Die Ansichten sind **schematische Modelle**, keine Originalgebäude Diepholz.
2. **Himmelsrichtungen:** auf einem nordausgerichteten Raster tatsächlich einen Schritt gehen.
3. **Kartenlesen:** Symbole mithilfe der Legende interpretieren und Planquadrate auswählen.
4. **Gradnetz:** Breiten- und Längengrad getrennt selbst eingeben; Gustav meldet zurück, welcher Teil noch unsicher ist.
5. **Maßstab:** echte Zahleneingabe mit Berechnung in Metern oder Kilometern. Beispiel 8 cm bei 1 : 2.000.000 = **160 km**.
6. **Höhenlinien:** ein Berg wird auf zwei zusammengehörigen Darstellungen verändert: Seitenprofil und Draufsicht von oben.
7. **Zehn neue Praxisprüfungen:** je acht Aufgaben. Eigene Einträge ohne sofortige Lösung; ausführliche Auflösung am Schluss. Ausdruck der Aufgaben und separater Lösungen direkt aus der App.
8. **Diagnostik:** Trefferquoten einzelner Teilfertigkeiten ohne automatische Benotung freier Begründungen.

## Didaktische Hinweise

In der Praxiswerkstatt bei jeder Aufgabe zuerst die Grafik lesen, danach selbst lösen, erst dann „Antwort überprüfen“ wählen. Die aufklappbare Hilfe bietet eine Schrittfolge. Unter „Eigene Begründung“ kann der Schüler die Lösung erklären und mit Gustavs Musterantwort vergleichen; die App benotet diesen Text bewusst nicht automatisch.

Die neuen Aufgabenkarten sind eigens entwickelte Übungskarten und enthalten **keine amtlichen Orts- oder Höhenangaben**. Die realen Diepholzer Kartenfunktionen aus V8 bleiben unter den vorhandenen Ansichten/Maßstäben. Für externe OpenStreetMap-Karten und Originalfotos ist gegebenenfalls Internet erforderlich.

## Technik und Grenzen

- Dateiöffnungen auf iPhone/Android können je nach Browser anders behandelt werden; das Paket ersetzt keine vollständigen Tests auf realen Endgeräten.
- Lernstand wird im Browser lokal gespeichert, soweit der Browser lokalen Speicher für die jeweilige URL erlaubt. Bei Nutzung per `file://` ist dies browserabhängig.
- Der vorhandene Export der älteren Lernstandsdaten enthält neue V11-Praxiswerte möglicherweise nicht. Daher bei Gerätewechsel die V11-Diagnose nicht als dauerhaft gesichert voraussetzen.
- Das neue, bebilderte Lernheft liegt als `lernheft.html` und als **`Erdkunde_Lernheft_Klasse5_final.pdf`** vor (22 Seiten). Der ursprüngliche PDF-Dateiname kann noch in einer Anzeige gesperrt sein und wurde deshalb nicht überschrieben. Frühere Korrektur-Zwischenstände können ebenfalls noch geöffnet sein. Alle neuen Lernheft-Links zeigen auf die finale Variante. Die **neuen** zehn Praxisprüfungen und Lösungen lassen sich weiterhin direkt aus der V11-App ausdrucken.
- Ein vollständiger Fachcheck aller alten Aufgaben und Browser-Praxistests auf jedem Gerät kann nicht garantiert werden.

## Ansichten, bewegte Modelle und Diepholzer Karte – Überarbeitung 21.10.2026

- Beim ersten Modell sind **Seitenansicht, Schrägansicht, Draufsicht und Kartenskizze** gleichzeitig vergleichbar. Das zweite, L-förmige Gebäude hat eine passende Schräg- und Draufsicht. Alle Ansichten verwenden gemeinsame räumliche Punkte.
- Gustavs Drohnenkamera und der Gebäudecomic kippen die tatsächliche Gebäudegeometrie sichtbar zwischen Ansichten. Auch eine veränderte Flughöhe wird interpoliert. „Bewegung anhalten“ und „Blickwechsel animieren“ steuern die Animation; die Systemeinstellung für reduzierte Bewegung wird berücksichtigt.
- Die Gradnetz-Beschriftungen stehen außerhalb der Zeichenfläche; Breite und Länge haben getrennte Farben und eindeutige Randwerte.
- Jeder der 16 Lernpfade hat einen bildgestützten Einstieg mit vier methodischen Schritten, Themafarbe, Erklärung und Zugang zum Themenquiz.
- „So beginnst du beim Kartenlesen“ enthält zusätzlich eine interaktive Beispielkarte: Titel, Nordpfeil, Legende und Maßstab lassen sich einzeln untersuchen.
- Die echte Offline-Karte rund um die **Mühlenkampschule, Lüderstraße 72**, zeigt OSM-Geodaten mit Schule, Netto-Supermarkt, Waldfläche und Hinterlohne. Nummerierte Fundorte, Zoom und fünf Entdeckeraufträge helfen beim Lesen. Quelle, Lizenz und Datumsstand stehen sichtbar dabei und in `DIEPHOLZ_KARTENQUELLE.md`. Das ist kein Live-Luftbild und keine sichere Schulwegempfehlung.
- Die fünf Aufgaben der Kartenexpedition werden erst nach dem passenden Kartenfund bzw. der richtigen Richtungsantwort freigeschaltet. Der aktuelle Auftrag, Zoom und ausgewählte Fundort werden lokal im Browser gespeichert; nach Abschluss zeigt die Startseite die Zahl abgeschlossener Expeditionen auf diesem Gerät.
- Im Höhenlinien-Labor verändert sich derselbe 200-m-Modellberg gleichzeitig im Seitenprofil und in der Draufsicht. Ein Regler und eine Animation zeigen den Zusammenhang zwischen Breite, Steilheit und Linienabstand.
- Die Ein-Datei-App enthält Gustav und die Kartengeometrien direkt. Für die Lernmodelle und die neue Diepholzer Karte ist kein Internet nötig. Nur ausdrücklich verlinkte aktuelle Onlinekarten, Originalfotos und externe Quellen benötigen Internet.

### Entwicklung und Neuerzeugung

1. `node entwickler\build-map.js` erzeugt den ausgewählten OSM-Datensatz aus `entwickler\diepholz.osm`.
2. `node entwickler\build-offline.js` erzeugt die eigenständigen Dateien `index.html` und `lernheft.html`.
3. `entwickler\build-pdf.ps1` erzeugt mit dem lokal installierten Microsoft Edge die aktuelle PDF-Variante. Vor erneutem Erzeugen diese Variante in PDF-Anzeigen schließen; das alte, möglicherweise gesperrte Original wird nicht verändert.

In der Browserkonsole führt `geoSelfTest()` die 46 integrierten Struktur- und Inhaltsprüfungen aus. Reale Mobilgeräte und assistive Techniken sollten zusätzlich separat geprüft werden.
