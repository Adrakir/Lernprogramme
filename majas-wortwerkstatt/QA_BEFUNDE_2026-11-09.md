# Qualitätsprüfung – Hörtests, Rechtschreibung, Comics und Bärlis Schrank

**Stand:** 09.11.2026 · **Quelle:** GitHub-Code auf `main`, die gespeicherten WebP-Originalgrafiken und SVG-Kleidungsdefinitionen.  
**Wichtig:** Quellcode- und Originalbildkontrolle sind **kein** Live-Test mit realem iPhone/Safari/Android und **keine** akustische Abnahme.

## 1. Fünf Hörverständnis-Abschlusstests
| Test | Zugehörige Geschichte | Fragen | Prüfung des Lösungsschlüssels |
|---|---|---:|---|
| 1 | Der falsche Kuchen | 5 | Antworten im Storytext begründet |
| 2 | Rettung für eine Schnecke | 5 | Antworten im Storytext begründet |
| 3 | Der Koffer mit dem Loch | 5 | Antworten im Storytext begründet |
| 4 | Das Fenster voller Sterne | 5 | Antworten im Storytext begründet |
| 5 | Die letzte Kastanie | 5 | Antworten im Storytext begründet |

Alle fünf MP3-Dateien liegen unter `anna-audio/`. Die Fragen sind nach Inhalt und hinterlegtem Storytext auf schlüssige Lösungen und plausible falsche Antworten geprüft. Keine eindeutig falsche richtige Antwort aufgefallen. **Offen:** Audios tatsächlich anhören, mögliche Pausen/Stimmfehler prüfen und auf realen Geräten verifizieren, dass Audio, Tempo, Stop, Lesehilfe und Antworten richtig funktionieren (Issue #22). Schriftliche Textprüfung kann Klang nicht beurteilen.

## 2. Fünf Rechtschreib-Abschlusstests
Je Test **15 Aufgaben**: fünf Nomenbildungen (`-ung`, `-heit`, `-keit`, `-schaft`, `-nis`), fünf Mehrzahlformen zum Verlängern und fünf Schreibentscheidungen. In Summe **75 Aufgaben**. Die im Code hinterlegten Wortpaare und Lösungen wurden auf Wortbildung, Großschreibung, Artikel, Pluralform und abweichende Antwortoptionen geprüft. Die fünf Sets enthalten unterschiedliche Wörter.

- Die bekannten Formen (z. B. `die Zeichnung`, `das Erlebnis`, `die Kenntnis`, `der Wald → die Wälder`, `das Kalb → die Kälber`) sind sprachlich korrekt. Bei `kennen → die Kenntnis` liegt eine Stammveränderung vor: ggf. in der geführten Erklärung ausdrücklich erläutern, statt eine rein mechanische Endungsanfügung vorzutäuschen.
- **Konkrete Korrektur in Test 4:** `Stock` stand dem künstlichen, unplausiblen Distraktor `Stogg` gegenüber. Jetzt `Stock` vs. `Stok`, und statt des die Lösung vorwegnehmenden `Stoc_` wird `Sto…` angezeigt. Änderung im `index.html`-Code vorgenommen.
- **Offen:** alle 75 Aufgaben anschließend in der tatsächlichen Testansicht durchspielen: keine Lösung vor Abgabe, Fehlererklärung/Ergebnis und Sterne korrekt, Eingabe per Handy-Tastatur.

## 3. Originalgrafiken und Comicdarstellung
Gesehen wurden alle drei achtteiligen Schulcomic-Bildtafeln (`baerli/comics/`) sowie die fünf jeweils 24-teiligen Detektiv-/Schulcomic-Bildtafeln (`baerli/tagescomics/`); zusätzlich die separate Duschszene `tom-dusche.webp` und das Bärli-Grundbild.

- Die Bildtafeln enthalten kindgerechte, thematisch zusammenhängende Szenen; Bärlis gelbes Ohrfähnchen und lila Grundoutfit sind in den geprüften Originalen überwiegend erkennbar.
- **Gestaltungsunterschied:** Schulcomics (`showSchoolComic`) legen die Dialoge unter das Bild, Detektivcomics (`showDetective`) erzeugen CSS-Sprechblasen am/auf dem Bild. Das ist nicht durchgängig einheitlich; für klassische Comics sollten Dialoge als Blasen wirken.
- **Noch nicht bestanden/abgehakt:** visuelle Browserabnahme aller 24er-Comicseiten auf zugeschnittene Köpfe, überlagerte Personen, Sprechblasenposition und Lesbarkeit bei 320–390 px Breite. Die Positionierungsdaten im Code enthalten 24 Einträge pro Detektivcomic, beweisen aber keine korrekte Pixelposition.
- Die separate Darstellung Toms unter dem Duschkopf existiert als `tom-dusche.webp` und ist in der Story für Bild 2 hinterlegt; kein voll bekleideter Duschkörper in dieser Einzelgrafik.

## 4. Bärlis Kleiderschrank – Erweiterung
**12 neue eindeutig benannte und bepreiste Teile**, je zwei in Hüte/Brillen/Pullover/Hosen/Schals/Schuhe:
- Grüne Abenteuercap, bunter Partyhut
- Blaue Forscherbrille, rosa Herzbrille
- Rot-weißer Ringelpullover, blaue Abenteuerjacke
- Türkise Schlaghose, braune Kordhose
- Blauer Punkteschal, roter Kuschelschal
- Lila Sternensneaker, blaue Regenstiefel

Die sechs Kleidungskategorien zeigen nun bebilderte Artikelsymbole mit Stückzahl. Beim Durchblättern erscheint eine **Anprobe direkt auf Bärli**, ohne `localStorage` zu verändern oder Sterne auszugeben; tatsächlicher Erwerb passiert weiterhin ausschließlich per Kaufknopf. Alte Item-IDs und die Legacy-Slotmigration bleiben erhalten. Ein statischer Integrationstest bestätigte 12 neue eindeutige IDs, korrekte Migration von `hose` nach `hosen`, sechs bebilderte Kategorien und die Vorschau-Markierung.

**Offen:** Positionierung aller SVG-Ebenen auf realem iPhone/iPad/Desktop visuell kontrollieren, besonders Hüte/Brillen/Schals bei Kombinationen sowie alle Sterne-/Kauf-/Backup-Vorgänge in echten Browsern. Playwright-Regressionsprüfung für die Anprobe ergänzt; Ergebnis in dieser Sitzung nicht ausgeführt bzw. bestätigt.

## 5. Fortsetzung: Testabläufe und Comicdarstellung (09.11.2026)

- **Hörabschlusstests:** In den fünf echten Prüfungswegen ist die Lesevorlage während des Tests nicht mehr aufklappbar. Aufnahme und Computerstimme bleiben wählbar, inklusive Normal/Langsam/Sehr langsam; erneutes Tippen auf „Anhören“ startet die laufende Aufnahme von vorne. Im geführten Lernweg und in den Übungen bleibt die gekennzeichnete Lesehilfe erhalten. Fragen, Antwortoptionen, Bewertung und Erläuterungen bleiben bestehen.
- **Schulcomics:** Die zwei Dialoge pro Bild bekommen deutliche Sprechblasenform mit Sprechblasen-Zeiger; sie bleiben **unter** dem Bild, sodass Köpfe und Szenen nicht von Text verdeckt werden.
- **Detektivcomics:** Auf breitem Display erscheinen Sprechblasen bei neuen Nutzungen standardmäßig am Bild, auf schmalen Displays zunächst darunter. Die Wahl wird gespeichert und kann geändert werden. Der in Schulcomics bisher funktionslose Umschalter ist ausgeblendet; Bildvergrößerung und abschnittsweises Vorlesen bleiben erhalten.
- **Automatisierte QA:** `e2e/learning-and-comics.spec.cjs` enthält komplette Testläufe für fünf Hörtests (je 5 Fragen) und fünf Rechtschreibtests (je 15 Aufgaben), zwei Mobil-Samples, acht Comic-Einstiege mit Zoom/Überlauf sowie Umschaltung der Comic-Sprechblasen. `pruefungen-comics.test.cjs` prüft zusätzlich die Datensätze und Medienpfade. Die Node-Tests sind im CI-Workflow verknüpft.
- **Nachweis:** Ein GitHub-Actions-Lauf nach Integration der neuen Prüfungen und des Comic-Umschalters war erfolgreich: [Run 42698714838](https://github.com/Adrakir/Lernprogramme/actions/runs/42698714838), einschließlich Node-/Chromium-Jobs. Dieser Lauf ist **keine** Prüfung auf echtem iPhone/iPad/Android. Weitere visuelle Vergleichsscreenshots der Schul-/Detektivcomics werden durch den Workflow bereitgestellt; Sichtkontrolle und Browser-Hardwareabnahme bleiben gesondert offen.
- **Cache:** Neue CSS-/JS-Versionen und PWA-Cache `v3`, damit installierte Versionen die Änderungen erhalten können.

## 5. Nächste Abnahme
1. Auf Testprofil alte Kleiderkäufe importieren; alle sechs Kategorien und neue Teile kombinieren. Visuelle Screenshots / mobile Kontrollliste an Issue #23.
2. Alle 10 Tests in Live-App auf echten Geräten vollständig durchspielen und bei Fehlern Frage, Antwort, Begründung, Gerät dokumentieren (Issues #22 und #25).
3. Nach der Abnahme `PROJECT_STATE.md`, die betreffenden Issues und diesen Befund aktualisieren; erledigt nur markieren, was wirklich nachgewiesen ist.
