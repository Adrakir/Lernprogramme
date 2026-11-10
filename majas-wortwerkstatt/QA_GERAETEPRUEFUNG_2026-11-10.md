# Geräte-, Bild- und Tonprüfung – Majas Wortwerkstatt
**Prüfdatum:** 10.11.2026  
**Bereich:** `majas-wortwerkstatt/` in [Adrakir/Lernprogramme](https://github.com/Adrakir/Lernprogramme)  
**Prüfstand:** Browser-Kompatibilitätslauf [#42724331700](https://github.com/Adrakir/Lernprogramme/actions/runs/42724331700) erfolgreich für App-Commit `46bff023c234d13ea5366fa224f689e1d1631559`. Weitere Feinkorrektur am 320px-Hörmenü wurde nach diesem Lauf ergänzt; sie ist gesondert durch den neuesten CI-Lauf nachzuweisen.

## Zusammenfassung

**Technische Browserprüfung durchgeführt und bestanden; reale Geräte-Hörprobe weiterhin offen.** Tests dürfen nicht als reale Hardwaretests, physische Audio-Abnahme oder vollständige professionelle Illustrationsabnahme ausgegeben werden.

| Prüfebene | Prüfumfang | Ergebnis |
|---|---|---|
| Chromium-Regression | Vorhandene App-Funktionen, Klassenarbeiten, Schrank, Baumhaus, Advent, Comics | Bestanden, Run #42724331700 |
| WebKit / Safari-Engine | Touch-/Mobil- und iPad-Größen, Hörsteuerung, MP3-Ressourcen, Comics, Schrank, Shop, Advent | Bestanden, **keine physische Apple-Hardware** |
| Android-ähnlicher Chromium | Touch, 393 × 873 Pixel, dieselben Abläufe | Bestanden, **kein echtes Android-Gerät** |
| Firefox Desktop | 1280 × 850 Pixel, dieselben Abläufe | Bestanden |
| Sehr kleines WebKit-Smartphone | 320 × 650 Pixel, kein horizontales Scrollen | Bestanden; Titel- und Auswahlfeldfeinschliff umgesetzt |
| Automatische Barrierefreiheit | WCAG 2 A/AA, schwere und kritische axe-Verstöße auf Baumhaus, Advent, Saison-Schrank | Keine schweren Verstöße im Test |
| Audioressourcen | Alle fünf zugeordneten Klassenarbeits-MP3s antworten HTTP 200, nicht leer und gültige MP3-Kennung; Tempo und Stopp bedienbar | Bestanden – **Klang und Lautsprecher nicht bewertet** |
| Bild- und Kleidungsdarstellung | 35 Cross-Engine-Screenshots sowie 43 Screenshots (39 Saisonartikel, 4 Outfit-Sets); weitere Comic-Screenshots auf Desktop/Mobile | Technisch und stichprobenartig visuell geprüft; echte Gerätedarstellung offen |

## Reproduzierbare Belege

- `.github/workflows/maja-regression.yml`: separater Job **WebKit/Safari + Android + Firefox compatibility audit (emulation)**.
- `playwright.device.config.cjs`: iPhone-artiges WebKit (390 × 844), iPad-artiges WebKit (810 × 1080), Android-Chromium (393 × 873), Desktop-Firefox (1280 × 850), kleines WebKit-Telefon (320 × 650).
- `e2e/device-audit.spec.cjs`: JavaScript-Ausnahmen, Bildladefehler, horizontales Überlaufen, 5 MP3-Dateien, Abspielrate, Stopp, gespeicherte Modus-/Stimmwahl, Comic-Zoom und Seitenwechsel, Schrank-Anprobe ohne Kauf, Laptop-Shop und axe-Basisprüfung.
- `e2e/wardrobe-expansion.spec.cjs`: separate Bildmatrix mit **allen 39** Regen-/Weihnachtsartikeln und 4 Outfitideen.
- GitHub-Actions-Artefakte: `maja-browser-engine-device-audit`, `maja-alle-saison-outfits`, `maja-comic-visual-review` (in den jeweiligen erfolgreichen Workflowläufen).
- Die Tests verwenden **künstlich angelegte Prüfungsstände** in neuen Browserprofilen; es wurden **keine Kinder-Lernstände** hochgeladen oder verändert.

## Gefundene und behobene Probleme

1. **320px-Überschriften:** „Hörverständnis“ und sehr lange Comic-Titel brachen mitten im Wort um. In `mobile-start.css` wurden unter 360px die dekorativen Titelicons ausgeblendet und Schrift/Innenabstand gezielt angepasst. Letzte 320px-WebKit-Screenshots zeigen die vollständige Überschrift.
2. **Hörsteuerung zu weit unten:** Auf Mobilgeräten stand eine große „Jetzt mit echten Stimmen!“-Werbekarte vor dem eigentlichen Hörtext. `figurenstimmen.js` setzt für den Hör-Lernpfad nur noch einen kleinen Link **nach** dem Audioplayer. Die eigentlichen Hörknöpfe stehen damit deutlich weiter oben. Browserprüfung darauf in `e2e/device-audit.spec.cjs` ergänzt.
3. **Computerstimmen-Auswahl auf kleinen Telefonen:** Ein schmales Select zeigte „Computersti…“ abgeschnitten. Spezielle Schrift-/Abstandsregeln für <=360px hinzugefügt, alle anderen Viewports unverändert. Neuer CSS-/SW-Cacheversionierungsvorgang notwendig.
4. **Code-Test nach CSS-Versionierung:** Der alte statische `mobile-start.test.cjs` suchte hart codiert einen alten CSS-Cacheparameter. Der Test wurde auf versionierte, gültige Referenzen und den tatsächlichen Lesbarkeits-Fix aktualisiert.

## Sichtprüfung und verbleibende Bildrisiken

- Bärlis 39 Regen-/Weihnachtsartikel wurden einzeln als Vorschaubilder aufgenommen und in Bildtafeln betrachtet; Bärlis Kopf und Gesicht sind sichtbar, Hüte/Schals/Schuhe und Handobjekte liegen grundsätzlich in den vorgesehenen Bereichen. Auch alle 4 Outfit-Sets wurden fotografiert.
- Die Kleidung wird als **flache SVG-Überlagerung einer realistisch gerenderten Bärli-Figur** gezeichnet. Sie ist technisch funktional, aber kein fotorealistisch angepasstes Kostüm. Das ist eine noch mögliche **künstlerische Qualitätsverbesserung**, nicht automatisch ein Programmfehler.
- Comic-Screenshots zeigen lesbare Dialoge und unbeschnittene Hauptfiguren in den betrachteten Stichproben. Schulcomic-Sprechblasen sind unter den Bildern, bei Detektivcomics kann zwischen im Bild und unter dem Bild umgeschaltet werden. Nicht jede Szene jeder Comicseite wurde einzeln von einem Menschen abgenommen.
- Kein verifiziertes Urteil über reale Safari-Sprachausgabe, abgehackte Stimmen, Lautstärkeunterschiede, Bluetooth, Bildschirmschoner, iOS-Safe-Areas oder die installierte iOS-/Android-PWA.

## Was zwingend auf echter Hardware bleibt

Die Anwenderin kann die tatsächliche iPhone-/iPad-/Android-Abnahme vornehmen. Bitte pro Gerät nach Möglichkeit nur diese vier kurzen Checks durchführen und Fehler mit Gerät/OS/Browser melden:

1. [Hörverstehen – Übung](https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/#pruefung/hoeren/ueben/1): Originalaufnahme und Computerstimme **wirklich hören**; Normal/Langsam/Sehr langsam und Stopp prüfen, kein abgehackter Ton.
2. [Bärlis Comic](https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/#tagescomic/melody-und-die-hausaufgaben/1): Bild wechseln/vergrößern, Sprechblasen lesen, Vorlesen tatsächlich hören und stoppen.
3. [Bärlis Saison-Schrank](https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/#baerli/schrank/saison): Mütze anprobieren, keine überraschende Sternabbuchung, kein abgeschnittener Körper und keine verdeckten Knöpfe.
4. [Baumhaus](https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/#baumhaus) und [Adventskalender](https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/#advent): auf Touchgeräten öffnen und blättern; Baumhaus braucht zuvor eine bestandene Prüfung. PWA-Offlinefunktion separat nach Installation testen.

**Datenhinweis:** Lernstände bleiben lokal im Browser. Vor Testwechseln oder Neuinstallation privat unter Einstellungen exportieren; Sicherung niemals in öffentliche GitHub-Issues hochladen.

## Verbindlicher Status für andere KI-Assistenten

**Bestanden:** statische Tests, Chromium, WebKit, Firefox, Touch-Emulation, die genannten Bild-/Routenkontrollen.  
**Noch nicht verifiziert:** echte physische Geräte, hörbare Ausgabe und die vollständige menschliche Qualitätssichtung aller Comics und Kleidungsüberlagerungen.  
**Arbeitsregel:** Neue Tests und Korrekturen gegen aktuellen `main` prüfen; nach Änderungen `GitHub Pages`-Erfolg anhand des passenden Commit-SHA verifizieren. Auf keinen Fall ungetestete Device-Abnahme mit grünem Status versehen.
