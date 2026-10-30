# Erzählwerkstatt: Sprachtraining mit Minka & Fuji

Der Lernbereich **06 · Erzählsprache trainieren** ergänzt die vorhandene App.
`language.js` enthält sieben Themen mit Erklärungen, Vorher-Nachher-Beispielen,
Wortschatz, je vier Aufgaben, einem Schreibauftrag, einer Checkliste und einem
Mustertext. Die Übungen behandeln Spannungsschlingen in der Einleitung,
Bewegungs-, Wahrnehmungs- und Redeverben, Satzanfänge, Adjektive und wörtliche
Rede. Drei zusätzliche Satzzeichenübungen zeigen vorangestellte, nachgestellte
und eingeschobene Begleitsätze.

Die Einleitung-Schreibwerkstatt verlinkt den Bereich und prüft in der
Selbsteinschätzung auch Spannungsschlinge und Wortwahl. Comics, Spannungskurve,
18 Wissensaufgaben und sechs Lesegeschichten mit 72 Aufgaben bleiben erhalten.

Die Daten der Bereiche 01–06 liegen nur im Arbeitsspeicher der geöffneten Seite. Ein Themen- oder
Bereichswechsel erhält Eingaben; Neuladen setzt sie zurück. Eine geöffnete Hilfe,
Lösung oder ein korrigierter Fehlversuch wird nicht als unabhängiger Erstversuch
gezählt. Freie Texte werden nur mit einer transparenten Selbsteinschätzung
überarbeitet, nicht automatisch bewertet. Es werden keine Texte übertragen.

## Start und Prüfung

Zum Lernen genügt `index.html` mit den benachbarten Skripten, Styles und Bildern.
Es gibt keinen Build und keine externen Laufzeitabhängigkeiten. Die bestehende
Seite auf `chatgpt.site` wird durch Änderungen in diesem Repository nicht mit
aktualisiert.

Für die Browsertests in diesem Ordner:

```sh
npm install
npx playwright install chromium
npm test
```

Optional kann `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` auf eine vorhandene
Chromium-Datei zeigen. `DEUTSCH_APP_URL` erlaubt denselben Test gegen eine
veröffentlichte Version. Standardmäßig wird die lokale `index.html` geöffnet;
damit wird auch das Starten ohne Webserver geprüft.

Die Tests prüfen alle Aufgaben, richtige und falsche Antworten, Hilfen und
Lösungsnutzung, getrennte Schreibentwürfe, Satzzeichenübungen, bestehende
Lernbereiche und horizontale Überläufe bei 390 und 768 Pixeln.

## Geführter Lehrgang · Bereich 07

`course-data.js` enthält die Lerninhalte, `course.js` die Bedienung und
`course.css` die Darstellung. Acht Lernstationen führen über Orientierung,
Spannungsschlingen, Bewegungs-, Wahrnehmungs- und Redeverben, Satzanfänge,
Adjektive und wörtliche Rede zum Schreibprojekt in Station 9.

Jede Lernstation bietet vier kommentierte Animationsschritte, eine gemeinsame
und eine selbstständige Aufgabe, einen Merksatz und eine freiwillige Schreibprobe
mit Mustertext. Die 16 Aufgaben verwenden Zuordnungen, kontextbezogene Auswahl
und antippbare Satzbausteine mit Rücknahmefunktion. Hinweise sind gestuft.
Mit Lösung bearbeitete Aufgaben öffnen den nächsten Schritt, werden aber nicht
als selbstständig gelöst gezählt. Die Bilanz zählt nur die acht Selbstaufgaben
im aktuellen Durchgang. Ein Stationsabschluss ist eine transparente
Selbsteinschätzung, keine automatische Kompetenzbescheinigung.

Die 32 Animationsschritte lassen sich einzeln wählen oder mit 6,5 Sekunden pro
Schritt abspielen. Wiedergabe pausiert beim Verlassen des Bereichs und bei einem
verborgenen Dokument. Betriebssystemeinstellung `prefers-reduced-motion` sowie
eine eigene Abschaltmöglichkeit erhalten alle Inhalte ohne Bewegung. Die Bilder
stammen aus der bestehenden App; es gibt keine zusätzlichen Medienabrufe.

Nur der Lehrgang speichert Fortschritt und Texte im Browserspeicher unter
`minka-fuji-lehrgang-v1`. Eingaben werden kurz verzögert gespeichert, beim
Verlassen sofort. Gespeicherte Strukturen werden beim Einlesen normalisiert.
Bei blockiertem oder defektem Speicher bleibt die Sitzung nutzbar und zeigt die
Speichergrenze an. Texte werden nicht übertragen. Ein bewusst bestätigter
Neustart setzt ausschließlich den Lehrgang zurück. Wiederholen einer Station
erhält ihre Schreibprobe. In der letzten Station sind Plan, Text, Checkliste,
Lesefassung, UTF-8-TXT-Export und eine Druckansicht verfügbar. Nach einer
Textänderung müssen Überarbeitungshäkchen erneut gesetzt werden.

Der Direktlink endet auf `index.html#lehrgang` oder `/#lehrgang`.
`tests/course.test.cjs` prüft den gesamten Lernweg, Hilfen und Verbesserungen,
Wiederaufnahme, Textschutz, Export, Druckansicht, Speicherfehler,
Bewegungsreduktion und Breiten von 320, 390 und 768 Pixeln. `npm test` führt
diese Prüfungen zusammen mit den Regressionstests der bisherigen App aus.

## Erzählstudio · Neuer Startbereich (Oktober 2026)

Das Erzählstudio ist in der **bestehenden** App integriert und über `#studio` direkt
erreichbar. Die bisherigen Lernbereiche 01–08 sind erhalten.

- `studio-data.js`: sieben verbundene Lernschritte, sechs unterschiedliche
  Erzählsituationen, 20 Bild-/Reizwort-Klassenarbeiten, sechs Textlabor-Texte,
  transparentes Kriterienraster und je eine mögliche Musterstruktur.
- `studio-art.js`: vier kontextbezogene Vektorszenen pro Geschichte/Bildarbeit,
  inzwischen insgesamt 64 dynamisch erzeugte, lokale SVG-Szenen (offline).
- `studio.js`: sieben Ansichten innerhalb einer App: Lernweg, vollständige
  Schreibwerkstatt, Klassenarbeits-Trainer und Textlabor.
- `studio.css`: kontrastreiche responsive Oberfläche mit SVG-Spannungskurve,
  Markierlegende, reduzierter Animation und Druckansicht.
- `tests/studio.test.cjs`: Browsertests für Lernführung, verschiedene Figuren,
  Texteingabe, lokale Wiederaufnahme, Prüfung, Raster, Markierungen und
  320-/390-/768-px-Ansichten. `npm test` umfasst auch die bestehenden Tests.

**Bewertung:** Das Kriterienraster mit sechs Kriterien und 0–2 Punkten je
Kriterium ist eine reine Selbsteinschätzung, keine automatische Sprachkorrektur
und keine Schulnote. Das Textlabor prüft nur eindeutige vorgegebene
Textmarkierungen, keine frei geschriebenen Formulierungen.

**Datenschutz:** Lernweg, Entwürfe, Markierungen und Prüfungstexte bleiben unter
`minka-fuji-studio-v1` im lokalen Browser. Keine Übertragung und keine
Gerätesynchronisation. Export als UTF-8-TXT und eine A4-Druckansicht sind
vorhanden. Alte Speicherstände des geführten Lehrgangs und der Hauptteil-Werkstatt
werden nicht gelöscht oder migriert.

**Bilderdidaktik:** Die grafischen Bilder zeigen eine mögliche Ausgangslage;
Bildunterschriften sind Orientierungsangebote. Bei offenen Schreibaufträgen
sind abweichende, aber logisch aufgebaute Geschichten zulässig. Ein
Musterstruktur-Vorschlag erscheint erst nach der Abgabe zur Selbstprüfung.

## Schreibakademie · Vertiefungen und QA

- `academy-extra.js`: 12 zusätzliche differenzierte Klassenarbeitsvarianten,
  insgesamt 20 Bild- und Reizwortaufgaben mit gestuften Hilfen und
  vierteiligen Musterstrukturen.
- `academy-data.js`: 12 Diagnoseaufgaben über sechs Kompetenzbereiche,
  12 Schreibreparaturen in drei Stufen, handlungsbezogene Begründungen.
- `academy.js`: Lerncoach, Reparaturwerkstatt, sieben gespeicherte
  Textversionen, Wortdiff, gerätebasierte, abschnittsweise Sprachausgabe mit Pause/Weiter, Schriftgröße,
  kontrastreichere Ansicht, Lehrerblätter und vier tägliche Mini-Aufgaben.
- `academy-tools.js`: vergrößerbare Bildszenen und manuelle, sechsfarbige
  Markierung eigener Textausschnitte. Diese Markierung ist keine
  automatische semantische Bewertung.
- `manifest.webmanifest`, `icon.svg`, `sw.js`: installierbare Offline-
  Progressive-Web-App auf unterstützten HTTPS-Browsern.
- `tests/academy.test.cjs`: Browserregression für die neuen Funktionen,
  unter anderem Mobilbreiten von 320, 390 und 768 Pixeln.
- `academy.css`: responsive Werkstätten, Bildlupe, Markierungsfarben,
  Vorlesebedienung und getrennte A4-Druckseiten für Schüler und Lehrer.

Das Lehrerblatt bietet eine **mögliche Musterstruktur** statt einer
einzig richtigen Geschichte. Eigene Schülertexte werden bewusst nicht
automatisch benotet, interpretiert oder an Dritte übertragen.
Druckvorlagen können im Browser als PDF gespeichert werden; die
GitHub-Web-App selbst benötigt dazu keinen PDF-Server.
