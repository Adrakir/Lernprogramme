# Qualitätssicherung der Musikapp – 30.10.2026

## Transparente Einordnung
Die bisherigen Codeprüfungen und isolierten Funktionstests waren **keine vollständige Geräteprüfung**. Die nach einer Prüfung gemeldeten Darstellungsfehler auf dem iPhone belegen diese Lücke. Eine „fehlerfrei“-Aussage ist daher nicht gerechtfertigt.

## Festgestellte und korrigierte Mängel

1. Der Lernbereich „Notenkopf / Notenhals / Fähnchen / Balken / Punkt“ zeigte nach der Auswahl „Punkt“ weiterhin eine Grafik mit zwei Achtelnoten. Jede der fünf Optionen hat nun ein passendes, eigenes Beispiel. Bei „Punkt“ wird eine Viertelnote einer punktierten Viertelnote gegenübergestellt.
2. Die Notenzeile wurde auf volle Feldbreite gestreckt und mit einem universellen Hinweis zum seitlichen Wischen versehen, auch wenn nichts außerhalb des sichtbaren Bereichs lag. Kurze Notenzeilen haben nun eine begrenzte Breite, und das falsch eingesetzte Wischtextfeld wurde entfernt. Der Balkenvergleich wird selbst bei schmalen Bildschirmen auf die verfügbare Breite skaliert. Lange Notenzeilen behalten Scrollschaltflächen.
3. In sechs von 216 Aufgaben war die Erklärung nach inhaltlicher Durchsicht für Klasse 5 zu knapp (nur eine Rechnung). Sie wurde um den jeweiligen Notenwert, die Taktart und die logische Begründung ergänzt.

## Ausgeführte isolierte Prüfungen
- Alle 27 Lernschritte und 216 Fragen aus den beiden Datenmodulen programmatisch geladen.
- Für jede Frage Antwortauswahl, Lösungszuordnung und eine hinreichend ausführliche Erklärung überprüft: keine Beanstandung.
- Quellcode der geänderten JavaScript-Dateien auf Syntax geprüft.
- Die fünf grafischen Notenbeispiele auf Aufbau und die neue CSS-/Offline-Version auf Konsistenz geprüft.

## Neu hinzugefügte automatisierte Tests
- `tests/current-check.cjs` enthält Regressionstests zu den fünf Notenbestandteilen, ihren Grafiken und der falschen Wischanweisung.
- `tests/browser-check.cjs` prüft die **laufende Website in Headless Chromium** bei 390 Pixeln, 320 Pixeln und Desktopbreite: Startnavigation, Punkt-Vergleich, Balkenbeispiel, kurze und lange Notenzeilen, sichtbare Scrollknöpfe sowie deren Wirkung. Er erzeugt dabei Screenshots.
- `.github/workflows/musik-qualitaet.yml` führt `npm test` und den Chromium-Browsertest nach Änderungen automatisch aus. Er speichert die Screenshots als GitHub-Actions-Artefakt.

## Noch nicht bestanden oder verifiziert
- Der gesamte GitHub-Actions-Lauf und die dort generierten Screenshots **konnten in dieser Sitzung nicht abgerufen oder als bestanden bestätigt werden**. Die Testautomatik ist eingerichtet, nicht nachweislich abgeschlossen.
- Echte Hardware- und Bedienungstests mit iPhone Safari, Android Browser, Tablet, Tastatur und Screenreader wurden nicht durchgeführt.
- Klangqualität und Echtzeit-Audiowiedergabe lassen sich durch Syntax-, DOM- und Berechnungstests nicht zuverlässig beurteilen.
- Eine visuelle Abnahme sämtlicher 27 Lektionen und aller Druck-PDF-Seiten steht ebenfalls aus.

## Testzugänge
GitHub-Workflow: https://github.com/Adrakir/Lernprogramme/actions/workflows/musik-qualitaet.yml

Öffentliche App: https://adrakir.github.io/Lernprogramme/musik/Musik-Lernapp/

Den letzten Prüfstand der App und die GitHub-Action-Läufe nur dann als „bestanden“ bezeichnen, wenn Logs und Ergebnisstatus tatsächlich erfolgreich sind.

## Abschließende, **tatsächlich ausgeführte** Prüfung (30.10.2026)

**GitHub-Actions-Lauf:** https://github.com/Adrakir/Lernprogramme/actions/runs/41064419722

Ergebnis: **success**. Die vollständige npm-Testsuite wurde in der GitHub-Runner-Umgebung mit Node.js 22 ausgeführt:

- **2.832 Assertions bestanden:** 27 vollständig durchgespielte Lernwege mit vier Phasen, 216 gültige Aufgaben, Auswertung und Hilfe, 27 Lehrkraft-Aufträge, sechs Spiele, erstellte Rhythmusstücke, Prüfungen, Speicherung, PDF-Zuordnungen und WAV-Erzeugung.
- **Offline-Tests bestanden:** intaktes Cache-Update, Rollback bei fehlerhafter Aktualisierung, Start ohne Verbindung, JavaScript, CSS, Bilder, optionale PDF-Dateien und PDF-Byte-Ranges.
- **50 echte Headless-Chromium-Browserchecks bestanden:** 320 px, 390 px und 1.366 px; 27 Lernschritte × vier Ansichten, Navigation, Übungswahl, Prüfungen, PDFs, ausgewählte Notenbestandteile, tatsächliche WAV-Erzeugung, keine ungewollte horizontale Seitenausdehnung, funktionsfähige Seitwärts-Pfeile bei langen Notenzeilen, kein Scrollbedarf bei kurzen Beispielen, passende Schaltflächen und **null unbehandelte JavaScript-Ausnahmen**.
- **Drei echte Browser-Screenshots** aus dem grünen Lauf gesichert: GitHub-Actions-Artefakt „musik-browser-screenshots“ im oben verlinkten Lauf.

**Tatsächlich aufgedeckte Fehler und Korrekturen:**
1. Laufzeitfehler `$(...).forEach is not a function`: Verwechslung zwischen Einzel- und Mehrfachauswahl der Notenbestandteile (`$` und `$$`) an drei Stellen. In `path.js` korrigiert; Wiederholungstests nun ohne Fehler.
2. Falsch zugeordnete Hörbeispiele beim Wechsel zwischen Notenkopf, Fähnchen, Balken und Punkt: nun werden die ausgewählten Notenwerte auch akustisch demonstriert.
3. Der Knoten der neu eingesetzten Beispielgrafik wurde nach `replaceWith` ein zweites Mal über den geleerten Zwischencontainer abgerufen; dieses Problem verursachte **sechs abgefangene Browserskript-Ausnahmen**. Der einzusetzende DOM-Knoten wird jetzt vor der Verschiebung zwischengespeichert, und die Ausnahmeprüfung ist Pflicht im CI.
4. Auf 320-Pixel-Displays umgebrochene Beschriftungen der Notenbestandteile: jetzt zwei Spalten mit lesbaren Namen.
5. Schwebender Audioknopf über Lerntext: im minimierten Zustand auf schmalen Geräten während des Lernwegs ausgeblendet; die Klangsteuerung hat dafür einen eigenen erreichbaren Knopf in der Erklärung.
6. Die anfänglich zu knappen sechs Aufgabenerklärungen sind erweitert.
7. Die Testautomatik selbst enthielt zeitweise fehlerhafte CSS-Selektoren und einen nicht robusten Aufräumvorgang des Chromium-Profils; korrigiert. Ein harmloser Hinweis, wenn temporäre Browserdateien beim Aufräumen gesperrt bleiben, wird weiterhin protokolliert, beeinflusst das Prüfergebnis nicht.

**Veröffentlichter und getester Quellstand:** Alle Codeänderungen und der verbesserte Browsercheck wurden über Pull Request #1 in `main` übernommen (Merge-Commit `d34cd2bb4cd01a50bc91712b9bf59e3a1c3a5d8a`). Startseite und Service Worker verwenden identisch Version `klarheit41`. Vorhandene Schüler-Lernstände und Speicherkennungen bleiben unverändert.

**Nach wie vor nicht behauptet:** Ein Headless-Chromium-Lauf ersetzt kein haptisches Testen auf physischem iPhone mit Safari und auf Android, keine echte Beurteilung der Tonqualität über Lautsprecher, keinen umfangreichen Screenreader-/VoiceOver-Test und keine pixelgenaue Sichtprüfung aller PDF-Seiten. Dies sind verbleibende reale Abnahmen, nicht bestandene Tests.

## Nachtrag: verifizierte Gesamtprüfung Version 42 (30.10.2026)

**Freigegebener Stand:** Pull Request [#2](https://github.com/Adrakir/Lernprogramme/pull/2) nach erfolgreichem Testlauf in main übernommen (Merge-Commit 35120000450ad8eb866e61439011bbbbc809ee72). Die Cache-Version lautet klarheit42.

**Bestandene Tests:** [GitHub Actions 41068714071](https://github.com/Adrakir/Lernprogramme/actions/runs/41068714071), Status success.
- 1.147 musikfachliche Assertierungen: 27 Lernschritte, 216 Fragen, 151 Notenbilder und vier Rhythmuswörter.
- 2.844 funktionale Assertierungen: alle Lernwege, Antwort-/Lösungsauswahl, Navigation, Lehreraufträge, Übungen, Sicherung und Wiederherstellung.
- Offline-Tests bestanden: unterbrochene Updates, Cache-Konsistenz, optionale Offline-PDFs, Start ohne Netzwerk.
- 65 Chromium-Browserprüfungen bei 320, 390 und 1366 Pixeln: alle 27 Lektionen in vier Lernphasen, mobile Scrollpfeile, WAV-Tonerzeugung, Notenbalken, Ananas-Worttakt, Navigation und kein unbeabsichtigtes Seitenüberlaufen.
- Sechs Screenshots im Workflow-Artefakt gespeichert; die 320- und 390-Pixel-Ansichten wurden auch visuell angesehen.
- Beide PDF-Hefte mit pypdf geöffnet. Lernheft: 42 Seiten, 60.760 auslesbare Zeichen, 0 textleere Seiten. Arbeitsheft: 71 Seiten, 88.229 auslesbare Zeichen, 0 textleere Seiten.

**Inhaltliche Verbesserungen:** Brot = Viertel; Käse = zwei Achtel; Schokolade = vier Sechzehntel; Ananas = zwei Sechzehntel plus eine Achtel. Die vier Gruppen füllen einen 4/4-Takt und ergeben zehn Tonanfänge. Bei Ananas dauert die letzte Silbe doppelt so lang wie die ersten beiden. Der geführte Lernweg, Worttakt-Baukasten, hörbare Notenbeispiele, Übungsfragen und Unterrichtsstationen wurden angeglichen. Der neue Fachtest tests/content-check.cjs gehört jetzt zu npm test.

**Grenzen der Prüfung:**
1. Chromium-Emulation ist kein realer iPhone-Safari-Test. Touchgesten, VoiceOver und subjektive Klangqualität sind noch nicht vollständig abgenommen.
2. Die PDFs sind lesbar und ihre Seitenzahlen stimmen, aber nicht alle 113 Seiten wurden einzeln visuell auf Layout- oder inhaltliche Fehler geprüft.
3. Auf 320-Pixel-Screenshots liegt die schwebende Klangsteuerung bei einzelnen Scrollpositionen nahe an anderen Bedienelementen. Eine tatsächliche Touchkollision wurde nicht nachgewiesen.
4. GitHub-Pages-Erreichbarkeit und sofortige Auslieferung der neuen Version sind nicht durch einen separaten Live-Netzwerktest bestätigt.

Diese Abnahme belegt eine deutlich umfassendere Qualitätssicherung, aber keine absolute Fehlerfreiheit.
