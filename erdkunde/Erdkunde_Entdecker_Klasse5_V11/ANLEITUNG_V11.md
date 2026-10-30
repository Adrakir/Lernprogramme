# Erdkunde-Entdecker – Version 11 (Gustav Globus)

## Start

- **Öffentlich im Browser, ohne ChatGPT-Anmeldung:** https://adrakir.github.io/Lernprogramme/erdkunde/Erdkunde_Entdecker_Klasse5_V11/ – das ist der aktuelle Einstieg. Hier wird die bestehende App direkt aus GitHub Pages gestartet.

- **Direkt starten:** `index.html` in diesem Ordner im Browser öffnen oder in `G:\sebastian\Lernprogramme.html` die Kachel „Erdkunde-Entdecker“ wählen. Diese eigenständige HTML-Datei enthält die Lernmodelle und die neue Diepholzer Offline-Karte; dafür ist kein lokaler Server und keine Internetverbindung erforderlich.
- **Ein Einstieg:** `index.html` wird fortlaufend verbessert. Der datierte Zweitlink ist nur noch eine Weiterleitung; keine zusätzliche App herunterladen. In einer reinen Dateivorschau können Schaltflächen sichtbar sein, ohne dass JavaScript ausgeführt wird. Die Datei deshalb in einem Browser öffnen.
- **Zur Bearbeitung:** `entwickler/index.html` und die weiteren Dateien im Ordner `entwickler` in VS Code öffnen. Für dauerhafte Speicherung und PWA-Installation empfiehlt sich eine lokale Entwicklungsumgebung bzw. HTTPS-Bereitstellung.
- Den Menüpunkt **📐 Praxiswerkstatt** wählen. Dort sind sechs Übungsstationen und zehn zusätzliche Praxisprüfungen vorhanden.
- Die bisherigen 17 Gustav-Abenteuer, 16 Lernpfade, Quiz-Arena, Lernlabore und älteren Klassenarbeiten sind weiterhin enthalten.


## Geprüfter aktueller Stand (30.10.2026)

- **Ein Einstieg, keine zweite App:** `index.html` im GitHub-Pages-Ordner. Stand der veröffentlichten Version: Commit `34b02ad43212eebf387c1e206f82aee6f42f9429` (30.10.).
- **Für die Klassenarbeit:** Unter **Gradnetz & Atlas** gibt es die interaktive Klassenarbeit mit 18 Aufgaben. Die aktuellen Druckdateien heißen `Erdkunde_Klassenarbeit_Bebildert_2026-10-28.pdf` (10 Seiten) und `Erdkunde_Loesungen_Bebildert_2026-10-28.pdf` (11 Seiten).
- **Prüfungsfit:** Unter **Weitere App-Bereiche → Prüfungsfit** findest du acht bebilderte Lernwege, eine 24-Fragen-Probeprüfung und **Gustavs Geowerkstatt** mit je sechs Koordinaten-, Kompass- und Atlasaufgaben. Der zunächst fehlende Menüpunkt ist repariert.
- **Fehler verstehen:** In der Geowerkstatt gibt es nach falschen Antworten schrittweise Erklärungen; die Auswertung sammelt die zu wiederholenden Aufgaben und führt zum passenden Gustav-Lernweg.
- **Auch ohne Internet wieder öffnen:** Beim ersten Onlinebesuch kann der Browser die eigenständige App für spätere Offline-Starts zwischenspeichern; die Unterstützung hängt unter anderem von Browser- und Speicher-Einstellungen ab.
- **Technische Prüfung:** Die GitHub-Aktionspipeline testet Fachinhalte, die 18-Aufgaben-Klassenarbeit, die Darstellung der Ein-Datei-App und automatisierte Chromium-Browserabläufe bei 1280 px und 390 px Bildschirmbreite. Echte Hardwaretests auf iPhone/Android und Erprobungen mit Schülerinnen und Schülern sind noch ausstehend.

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
- Das vorhandene Lernheft liegt als **`Erdkunde_Lernheft_Klasse5.pdf`** vor und ist im eigenständigen `index.html` eingebettet. Die aktuelle **bebilderte Klassenarbeit (10 Seiten)** und die **bebilderten Lösungen (11 Seiten)** findest du unter **Gradnetz & Atlas**. Die Klassenarbeit umfasst auch interaktiv alle 18 PDF-Aufgaben.

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
2. `node entwickler\build-offline.js` aktualisiert die bestehende eigenständige Datei `index.html`. Eine zusätzliche App-Kopie wird nicht erzeugt.
3. `entwickler\build-pdf.ps1` erzeugt mit dem lokal installierten Microsoft Edge die aktuelle PDF-Variante. Vor erneutem Erzeugen diese Variante in PDF-Anzeigen schließen; das alte, möglicherweise gesperrte Original wird nicht verändert.

In der Browserkonsole führt `geoSelfTest()` die 46 integrierten Struktur- und Inhaltsprüfungen aus. Reale Mobilgeräte und assistive Techniken sollten zusätzlich separat geprüft werden.

