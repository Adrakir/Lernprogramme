# BioLabor 5 – Hund & Katze (Überarbeitung 10. November 2026)

## Ziel und bestehende Links
Die neue Tierkunde ist **Teil der bestehenden Biologie-App**, nicht Ersatz für deren Inhalte. Eingebunden in `BioLabor_5_Biologie_V9_2.html` über zwei neue Einträge in der Seitennavigation und zwei große Startkacheln.

- Biologie-Start: `BioLabor_5_Biologie_V9_2.html`
- Neuer Einstieg: `BioLabor_Hund_Katze.html`
- Direkt Hund: `BioLabor_Hund_Katze.html#dog/skeleton`
- Direkt Katze: `BioLabor_Hund_Katze.html#cat/skeleton`

Alle Pfade relativ zum Verzeichnis `biologie und chemie/` im Repository `Adrakir/Lernprogramme`.


## Qualitätsüberarbeitung für Lehrer und Schüler – 10. November 2026

**Echte Änderungen sind im Repository `Adrakir/Lernprogramme`, Branch `main`, committed.** Die vorhandene BioLabor-App wurde nicht durch eine neue App ersetzt. Die neue Tierkunde bleibt über dieselbe öffentliche HTML-Adresse verlinkt. Bestehende Biologie-Lernstände und ältere Tierkunde-Quizstände werden nicht überschrieben.

### Neue und überarbeitete Dateien

- `Tierkunde_Curriculum.js`: 7 Lernbereiche für Hund und Katze, je 3 fachlich erklärte Lernschritte mit Denkfragen; insgesamt **42 Lernfragen** in 14 tierbezogenen Lernwegen.
- `Tierkunde_Lernstudio.js` und `.css`: geführtes Lernen, 2 eigenständig lösbare Anwendungsaufgaben je Lernbereich/Tier (**28 Aufgaben**), inklusive Knochenbeschriftung, Zuordnung und Reihenfolge mit Pfeiltasten, Rückmeldung, Hilfen, Lehreransicht, lokaler Fortschrittsspeicherung. Bereits vorhandene Quizfragen bleiben bestehen.
- `Tierkunde_Scherenlabor.js` und `.css`: bewegliche schematische Unterkiefer-Animation, Reißzahnpaar oberer P4 / unterer M1, 5 Zahnarten-Auswahlen, Tempo über Regler, Beschreibung und direkter Fachquellenlink.
- `Tierkunde_Verhaltenslabor.js` und `.css`: 7 verschiedene Situationen (entspannt, Angst, Drohung, Abwehr, Flucht, Jagd, Spiel) mit animiertem Körperspracheschema, Sicherheitsfrage und Erklärung; auf Hunde und Katzen getrennt anwendbar (14 Szenenkombinationen).
- `Tierkunde_Bewegung.js` und `.css`: genauere schematische Trennung von 13 Brust- und 7 Lendenwirbeln plus Halsbereich, 13 Rippen pro Körperseite, sichtbare Gangphasen und orange Kraftrichtung beim Abstoß; 6 Bewegungsarten für 2 Tiere.
- `Tierkunde_Hund_Katze.js`: ruft nach jedem Bereichswechsel das Bewegungs-, Lern-, Gebiss- und Verhaltenslabor auf. Link zu fachlich betreuten veterinäranatomischen Onlineatlanten. Animierte eigene Skizzen werden nicht als exakte Präparate bezeichnet.
- `BioLabor_Hund_Katze.html`: lädt neue Styles und Scripte in der korrekten Reihenfolge.
- `BioLabor_5_Biologie_V9_2.html`: zeigt auf der ursprünglichen Biologie-Startseite die Anzahl abgeschlossener Tierkunde-Stationen von Hund und Katze jeweils getrennt an; nur lesender Zugriff auf den neuen Speicher-Key.

### Ablauf für Schülerinnen und Schüler

1. Tier wählen; passenden Lernbereich aufrufen.
2. Drei kurze angeleitete Schritte (Entdecken – Verstehen – Anwenden) mit Denkfragen, Hinweisen und kurzen Vorlesetexten.
3. Der darunter sichtbare bewegliche Skelett-, Zahn- oder Körpersprache-Lernbereich dient als interaktives Anschauungsmodell.
4. Zwei unterschiedliche Anwendungsaufgaben je Station; Fehlerrückmeldung erklärt die richtige Lösung.
5. Nach zwei erfolgreichen Aufgaben gilt die Station als abgeschlossen. Fortschritt auf diesem Gerät im eigenen Speicher `biolab5-tierstudio-2026`; bestehende Keys werden nicht verändert.
6. Der zuvor lange Textbereich mit Anatomielexikon bleibt über `Schulbuchwissen ... aufklappen` zugänglich.
7. Alte MCQ-Abschlusstests werden weiterhin angeboten. In der Biologie-Startansicht erscheint der Tierkunde-Fortschritt als eigene Zahl; es werden **keine** alten Sterne oder Lernstandsdaten umgerechnet.

### Fachlicher Qualitätsrahmen

- Quellen für anatomisch detaillierte Darstellungen: IMAIOS, Veterinäranatomie Hund https://www.imaios.cn/en/vet-anatomy/dog/dog-osteology2 und Katze https://www.imaios.cn/en/vet-anatomy/cat/cat-osteology2. **Keine** Copyright-Grafiken kopieren oder direkt in GitHub einbauen.
- Zahnanatomie und Zahnformeln: Merck Veterinary Manual https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals
- Gangarten: Zink & Carr, *Canine Sports Medicine and Rehabilitation*, doi:10.1002/9781119380627.ch2
- Körpersprache: RSPCA; einzelne Schwanz-, Ohr- oder Augenzeichen nie isoliert als eindeutige Emotion ausgeben.
- Unsere neuen SVGs sind **eigene dynamische Lernschemata**, keine 3D-Präparate, anatomischen Präzisionsmodelle, Motion-Capture-Daten oder Fotos. Ihre Geometrie wurde nicht von einer Tierärztin oder einem Tierarzt validiert; gerade das Skelett muss vor einer Verwendung als exakte fachliche Abbildung gegengeprüft werden.

### Tests des Überarbeitungsstands

- 49/49 automatisierte **Syntax-, Struktur-, Lehrplan-, Bildgenerator- und Frameprüfungen** erfolgreich: alle neuen JS-Dateien, HTML-Verknüpfung, beide Arten × sieben Einheiten, beide Arten × sechs Bewegungsarten mit jeweils fünf Frames, sechs Kieferstellungen.
- 16/16 zusätzliche simulierte **DOM-Interaktionsprüfungen** erfolgreich: geführte Lernschritte, Antwortkorrektur, Aufgaben zuordnen, Reihenfolge ändern, Lernstandslogik, Tierwechsel, Kieferanimation, Körperspracheszenen und Sicherheitsentscheidung.
- Ein im Zuge der Tests entdeckter Syntax-/Laufzeitfehler bei der Initialisierung der Wirbelgrafik wurde behoben und der Animationsgenerator danach erneut geprüft.
- **NICHT nachgewiesen:** erfolgreiche öffentliche Auslieferung via GitHub Pages (externer Webabruf war nicht möglich), reale Darstellung und Klicktests in iOS Safari, Android Edge oder Chrome, tatsächliche Sprachqualität und veterinäranatomische Präzision. Commit auf GitHub ≠ verifizierte GitHub-Pages-Website.

### Nächste technische Kontrollpunkte

1. Neue GitHub-Pages-Version im echten Browser öffnen; nach Asset-Cache ggf. einmal aktualisieren.
2. iPhone/Tablet/PC: alle 7 Stationen öffnen, Start/Pause/Schritt, Regler, Seitenwechsel, Kontrast, Schriftgröße und Audio prüfen.
3. Tatsächliche anatomische Bildqualität durch eine fachkundige Lehrkraft oder Tierärztin prüfen; nach Freigabe möglichst hochwertige eigene oder eindeutig lizenzierte Abbildungen einsetzen. Kein unverifiziertes Kopieren aus IMAIOS.
4. Mit Screenreader und Tastatur testen, besonders die laufend neu gezeichneten SVG-Gruppen; falls nötig eine statische Knochenliste als vollwertige Alternative anbieten.

## Architektur
- `BioLabor_Hund_Katze.html`: eigenständige HTML-Einstiegsseite mit Zurück-Link zu BioLabor.
- `Tierkunde_Hund_Katze.css`: responsives Design, Hell-/Dunkelmodus, Druck, Zoom.
- `Tierkunde_Hund_Katze.js`: Daten, selbst gezeichnete SVGs, Navigation, Körpersprache, Quiz, lokale Bestleistung.
- `BioLabor_5_Biologie_V9_2.html`: bestehende App; **nur additive Verknüpfung** am Ende (Marker `biotiere-promo`). Alle anderen Inhalte, Quizstände und Speicher-Keys erhalten.

## Inhalt
Beide Arten separat über Tierwechsler:
1. Anklickbares schematisches Skelett: 9 interaktive Gruppen mit „Was ist das?“ und „Warum so?“; 23 zusätzliche Knochen-/Bauteilbeschreibungen; Zoom.
2. Abstammung: Hund aus früheren Wolfs-Linien, Katze aus der afrikanisch-vorderasiatischen Wildkatze; Domestikation als Vorgang über Generationen, beim Hund Zeit/Ort nicht als gesichert behaupten.
3. Gebiss: 42 bleibende Zähne Hund (12/4/16/10), 30 Katze (12/4/10/4); 28/26 Milchzähne; Reißzähne als Scherwerkzeug, Vergleich zu Pflanzenfressern.
4. Jagd: Sinnesorgane, typische Schritte und Körperbau; Unterschiede zwischen Rassen bzw. Individuen.
5. Bewegung: Gehen, Laufen, Anschleichen, Springen; Zehengänger; Knochen, Sehnen, Gelenke.
6. Körpersprache: entspannt, Angst, Drohen, Angriff/Abwehr, Flucht, Jagd, Spiel; Zeichnungen, Körpermerkmale, Sicherheitsverhalten. **Einzelne Signale nie isoliert bewerten.**
7. Vergleich Hund/Katze und Quellen.
8. 24 interaktive Multiple-Choice-Fragen (10 Hund, 10 Katze, 4 gemeinsam), Erklärungen/Hinweise, lokaler Bestwert.
Zusatzfunktionen: vereinfachter deutscher Browser-Vorleser, anpassbare Schriftgröße, kontrastreiche Darstellung, Drucken.

## Fachliche Quellen
- Veterinäranatomie (Knochen): American College of Veterinary Surgeons, https://www.acvs.org/small-animal/fractured-limbs/
- Typische Wirbelzahlen: https://flexikon.doccheck.com/de/Wirbels%C3%A4ule_%28Veterin%C3%A4rmedizin%29
- Gebiss: Merck Veterinary Manual, https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals
- Stammesgeschichte Hund: Smithsonian, https://www.si.edu/stories/your-dog-little-wolfy
- Stammgeschichte Katze: Library of Congress, https://www.loc.gov/everyday-mysteries/categories/zoology/item/how-did-cats-become-domesticated/
- Körpersprache: RSPCA, https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding und https://www.rspca.org.uk/adviceandwelfare/pets/cats/behaviour


## Neu: animiertes Skelett- und Bewegungslabor (10. November 2026)

**In GitHub integriert, vorhandene Seiten und Speicherstände beibehalten.**

Dateien:
- `Tierkunde_Bewegung.js` — SVG-Skelettrig, per 2-Segment-Gelenkberechnung bewegliche Vorder- und Hinterbeine, Wirbelsäule, Rippen, Schädel, Becken, Schwanz; getrennte Bewegungsprofile für Hund und Katze.
- `Tierkunde_Bewegung.css` — verbesserte Darstellung, Farben, große Bedienelemente, Fokus, responsives Layout, Druckansicht.
- `BioLabor_Hund_Katze.html` lädt die zwei Dateien nach dem bestehenden Programm.
- `Tierkunde_Hund_Katze.js` ruft `window.BioSkeletonLab.mount({animal,section,bone,gait})` nach jedem Rendern auf und erhält damit Tier- und Bereichswechsel.

Die neue Animationsansicht erscheint in den Stationen **Skelett** und **Fortbewegung**. Die ältere Zeichnung wird in einen aufklappbaren Referenzbereich verschoben und nicht gelöscht.

Sechs animierte Bewegungen: **Gehen**, **Traben**, **Schnell laufen**, **Springen**, **Anschleichen**, **Strecken**. Steuerung: automatischer Start (außer bei System-Einstellung „Bewegungen reduzieren“), Pause/Wiedergabe, Einzelschritt, Neustart, Geschwindigkeit 0,5–2×, Zeitleiste, Beschriftungen, optionaler Körperumriss und Zoom. Bei Anklicken eines Knochenbereichs stehen die Erklärungen auch direkt bei der Animation. SVG wird zur Schonung von Mobilgeräten auf ungefähr 30 Zeichnungen/Sekunde begrenzt. Die animierte SVG-Bühne wird nicht als ständig aktualisierte Screenreader-Live-Region behandelt.

**Biologische Grenze:** Die Animation ist ein qualitatives Lernmodell mit gelenkig beweglichen Knochen, **keine** aus Motion Capture, Röntgen oder exakten anatomischen Gelenkwinkeln berechnete Bewegung. Körperformen, Gelenkwinkel und Proportionen sind schematisch; die gezeigten Zusammenhänge sollen verständlich und nicht als medizinische Bildgebung interpretiert werden.

### Tests
- JS-Syntax beider Dateien erfolgreich.
- **12 Varianten** (6 Gänge × 2 Arten) mit je **8 Einzelbildern** = **96 SVG-Frames** auf valide Koordinaten, 4 bewegliche Gliedmaßen und 13 schematische sichtbare Rippen geprüft.
- **17/17** syntaktische, strukturelle, DOM-simulierte Bedien- und Inhaltsprüfungen erfolgreich: unter anderem Initialisierung, Abspielen, Anhalten, Schritt, Tierwechsel, Bewegung beibehalten und ältere Zeichnung erhalten.
- **Noch offen:** tatsächliche visuelle Prüfung in Chromium/WebKit und auf physischen Mobilgeräten, Tonvorlese-Kontrolle und externe GitHub-Pages-Auslieferung. Nicht von simulierten Tests auf reale Browserkompatibilität schließen.

### Empfehlungen für die nächste Überarbeitung
- Veterinäranatomische Detailgrafiken und die Modellproportionen von einer sachkundigen Lehrkraft/Anatomiefachperson prüfen lassen.
- Playwright/Browser-Tests mit echten Klicks, Animationframes und Responsive Screenshots vor Ort ergänzen.
- Die SVG-Szenen sind vollständig im Repo und ohne Fremd-CDN nutzbar.

## Teststatus
- Syntaxprüfung neuer JS-Datei erfolgreich (`new Function`).
- 22 von 22 **simulierten DOM-/Routen-/Interaktionsprüfungen** erfolgreich (Hund, Katze, SVG-Klick, Zoom, 7 Stationen, Quizantwort, Wechsel, Integration).
- Sechs eingebettete Skripte im bisherigen BioLabor syntaktisch geprüft; bestanden.
- **Noch nicht nachgewiesen:** tatsächlicher iOS-/Android-/Desktop-Browsertest, Bildschirmleser, Sprachausgabe auf echten Geräten, GitHub-Pages-Deploy-Status. Die simulierten Tests dürfen nicht als echte Gerätetests bezeichnet werden.

## Regeln für Änderungen
- Bestehende BioLabor-Datei und Speicherstände nicht ersetzen oder löschen.
- Quellen / biologisch korrekte Erklärungen beibehalten. SVGs sind explizit schematisch, keine anatomisch maßstabsgetreuen Präparate.
- Änderungen der Lernstationen in `Tierkunde_Hund_Katze.js`, der Ansicht in CSS. Danach JavaScript-Syntax und die Routen beider Tierarten testen.
- Weitere Verbesserungsmöglichkeiten: hochwertige, lizenzgeprüfte anatomische Detailillustrationen anstelle vereinfachter SVG-Grafiken; echte mobile Browsertests; individuelle Audio-Stimmen.


## Fortschritt 11. November 2026 – Forschercheck und bessere Bedienung

### Geänderte Dateien

- `Tierkunde_Transferlabor.js` und `.css` (neu): 14 anwendungsorientierte Fallaufgaben, sieben für Hund und sieben für Katze. Jede Lernstation enthält eine eigenständig gezeichnete Funktionsskizze, eine Beobachtungsgeschichte, drei Antwortmöglichkeiten, Denkhinweis und Erklärung zur gewählten Lösung.
- `Tierkunde_Hund_Katze.js`: Forschercheck wird bei jedem Tier- und Stationswechsel nach den bisherigen Lern-, Gebiss-, Skelett- und Verhaltensmodulen angebunden.
- `BioLabor_Hund_Katze.html`: neues CSS/JavaScript ergänzt; Beschriftung der neuen Aufgabe im Einstieg; `aria-live` vom gesamten dynamischen Lernbereich entfernt, um unbeabsichtigtes Vorlesen des kompletten Seiteninhalts bei jedem Wechsel zu vermeiden.
- `BioLabor_5_Biologie_V9_2.html`: bestehende Biologie-Startseite bleibt erhalten und zeigt die Zahl absolvierter Forscherfälle je Tier zusätzlich an.

### Didaktische Ergänzungen

1. Schüler übertragen ihr Wissen zu Skelett, Domestikation, Gebiss, Jagd, Fortbewegung, Körpersprache und Vergleich in neue Alltagssituationen.
2. Unpassende Antworten werden ausdrücklich erklärt, statt nur mit „falsch“ markiert. Die Situation kann sofort erneut bearbeitet werden.
3. Körperhaltung und Sicherheit werden im Kontext beurteilt; ein einzelnes Signal (z. B. Schwanzwedeln) wird nicht als eindeutiger Gefühlsbeweis vermittelt.
4. Die 14 neuen SVG-Funktionsskizzen sind vereinfachte didaktische Modelle aus sieben Grafiktypen, keine Fotos, CT-Aufnahmen oder maßstabsgetreuen Knochengrafiken.
5. Der neue Fortschritt liegt ausschließlich lokal im getrennten Schlüssel `biolab5-tiertransfer-202611`. Vorherige Quizstände und Lernstudio-Daten bleiben unverändert. Der Forschercheck kann beliebig oft wiederholt werden.
6. Funktionen für reduziertes Bewegungstempo (Betriebssystemeinstellung), Tastaturfokus sowie große Touch-Ziele sind im neuen Modul berücksichtigt.

### Prüfung des neuen Moduls

- JavaScript-Syntax des neuen und des erweiterten Hauptmoduls geprüft.
- Selbsttest aller 14 Kombinationen (beide Tiere × sieben Lernstationen) mit je drei Antwortmöglichkeiten bestanden.
- In einem simulierten DOM alle 14 Stationsansichten erzeugt; die Skizzen- und Auswahl-Elemente waren vorhanden.
- Falsche und richtige Antwort, Erklärtext und lokale Fortschrittsspeicherung in der simulierten Umgebung geprüft.
- Die CSS-/JS-Verknüpfung und die Startseiten-Erweiterung mit dem Repositorycode abgeglichen.
- **Nicht verifiziert:** tatsächliche öffentliche GitHub-Pages-Auslieferung und reale Darstellung oder Klicktests in iOS Safari, Android oder Desktop-Browsern. Das bleibt eine offene manuelle Qualitätssicherung.
- **Fachliche Grenze:** Die schematischen Bildproportionen wurden nicht anatomisch extern begutachtet; für exakte Knochenformen und Gelenkgeometrie sind veterinärmedizinische Atlanten und fachkundige Freigabe erforderlich.

### Direkter Einstieg

- https://adrakir.github.io/Lernprogramme/biologie%20und%20chemie/BioLabor_5_Biologie_V9_2.html
- https://adrakir.github.io/Lernprogramme/biologie%20und%20chemie/BioLabor_Hund_Katze.html
- Hund: `#dog/skeleton`; Katze: `#cat/skeleton`. Der Forschercheck erscheint unter dem jeweiligen Lern- beziehungsweise Anschauungsbereich.

### Fachliche Orientierung

- RSPCA, Körpersprache Hund: https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding
- RSPCA, Körpersprache Katze: https://www.rspca.org.uk/adviceandwelfare/pets/cats/behaviour
- Merck Veterinary Manual, Zahnaufbau und -bezeichnungen: https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals
