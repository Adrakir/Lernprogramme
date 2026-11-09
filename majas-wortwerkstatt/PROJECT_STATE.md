# Projektstand – Majas Wortwerkstatt

**Zuletzt aktualisiert:** 09.11.2026 · **Branch:** `main` · **Repository:** [Adrakir/Lernprogramme](https://github.com/Adrakir/Lernprogramme) · **App-Ordner:** `majas-wortwerkstatt/`

> **Wichtig:** Diese Datei ist die Übergabestelle zwischen ChatGPT, GitHub Copilot und anderen KI-Assistenten. Aussagen über "fertig" beziehen sich auf gespeicherten Code, **nicht automatisch** auf browsergetestete oder öffentlich ausgerollte Funktion. Ein neuer Bearbeiter überprüft immer den aktuellen HEAD.

### Bärlis neues Baumhaus, Bärli AG-Shop und Regen-/Weihnachtskleidung (09.11.2026)

- [x] **Baumhaus:** neue Route `#baumhaus`; anfangs verschlossen, Freischaltung nach mindestens **einem vollständig bestandenen Abschlusstest mit >=80 %**. Der erste Raum beginnt nur mit Bärli, blauem Sitzsack und anklickbarem Bärli-Laptop; der Laptop öffnet `#baumhaus/shop`. Kein Austausch der bisherigen Startseite oder vier bebilderten Kacheln.
- [x] **Belohnungslogik:** nur zehn verschiedene bestehende Prüfungsschlüssel `hoeren:test:1..5`, `nomen:test:1..5`; 10 **Bärli-Taler** je erstmals bestandenem Test (keine Dopplung bei Wiederholungen, Bestwert wird beim erfolgreichen Abschluss unverzüglich gespeichert). Shopgeld **getrennt** von Sternen, Käufen und Lernstand. Bei gespeicherten älteren Prüfungsergebnissen nachträgliche Freischaltung ohne Neustart.
- [x] **Gelb-blauer fiktiver Shop „Bärli AG Osnabrück“:** 54 virtuelle Artikel in acht Abteilungen – Möbel samt Bett, drei Bettwäschen und Nachttisch; Deko; Tapeten; Bücher; Elektrogeräte; Weihnachtsausstattung; besondere Möbel; zweites Zimmer. Abteilungsfreischaltungen bei 1/1/3/4/5/6/8/10 bestandenen Prüfungen; jedes Objekt nur einmal bestellbar, keine realen Käufe.
- [x] **Raumeinrichtung:** Einkauf stellt bewegliche Artikel automatisch auf; Möbel auswählen, Pfeile oder Klick/Tipp auf Raum zum Verschieben, Einlagern und wieder Aufstellen, Tapete auswählen, Weihnachtsbaum mit Kugeln schmücken, Möbel zwischen zwei Räumen verschieben. Bettwäsche wird beim Kauf an ein vorhandenes Bett angelegt. Layout für Handy/Tablet/Desktop, Originalfigur Bärli sichtbar.
- [x] **39 weitere Kleidungsstücke/Utensilien** in `baerli-saison.js`, **10 Regensachen und 29 Weihnachtsartikel**, darunter Weihnachtsmütze, Weihnachtskleid, Rentierpullover, Nikolausmantel, Regenmantel, Regenmütze, Gummistiefel, kleiner Baum, Christbaumkugeln, Lichterkette, Kerze und Winterlesebuch. Eigene Schrankabteilung `#baerli/schrank/saison` mit zwei bebilderten Unterkategorien; alle alten Gegenstände bleiben erhalten.
- [x] **Speicher-/Backup-Kompatibilität:** neuer eigener Schlüssel `majas-wortwerkstatt-baumhaus-v1` unter bestehendem Exportpräfix; bestehende `majas-wortwerkstatt-sternenbeutel-v1`, `majas-wortwerkstatt-baerli-auswahl-v1`, `majas-wortwerkstatt-klassenarbeiten-nov2026-v1` bleiben unverändert. `sw.js` offline Cache `v8`, eigene JS/CSS-Dateien im PWA-Cache.
- [x] **Automatisierte Tests ergänzt:** `baumhaus.test.cjs`, `baerli-inventar.test.cjs`, `e2e/treehouse-and-shop.spec.cjs` – Prüfungsschwelle, Doppelzählung, Platzieren, Bettwäsche, Weihnachtskugeln, zweites Zimmer, echte Klickabläufe und mobile Viewports. Screenshots werden als GitHub-Actions-Artefakt `maja-baumhaus-shop-review` erzeugt. **GitHub-Actions-CI inklusive Chromium-Emulation erfolgreich:** [Run #42715386734](https://github.com/Adrakir/Lernprogramme/actions/runs/42715386734), **GitHub Pages erfolgreich veröffentlicht:** [Run #42715386752](https://github.com/Adrakir/Lernprogramme/actions/runs/42715386752) (Commit `5818712b6`). Saison-Screenshots für Desktop, Tablet und Handy-Emulation unter dem CI-Artefakt `maja-saison-schrank-review` gesichtet; Weihnachtsmütze und Regenponcho sichtbar und ohne überlaufende Buttons.
- [ ] **Offen:** echte Geräteabnahme auf Safari/iPhone/iPad sowie Android, manuelle Betrachtung aller 54 Artikel-Illustrationen und kombinierter Saison-Outfits. Keine echten Versandvorgänge, Konten oder Zahlungsabwicklung erwünscht.

### Bärlis Schrank erneut erweitert (09.11.2026)
- [x] **38 neue Artikel:** 18 Kleidungsstücke in den sechs vorhandenen Kategorien und 20 Utensilien in drei zusätzlichen Fächern (**Taschen & Körbe**, **Linke Pfote**, **Rechte Pfote**). Jede Sache hat eine eigene SVG-Zeichnung mit festen `bw26-*`-Artikel-IDs und Sternpreis zwischen 3 und 7. Der Katalog liegt getrennt in [`baerli-neue-sachen.js`](./baerli-neue-sachen.js) und wird **vor** dem Kleiderschrank-Modul geladen.
- [x] **Vier Outfit-Ideen:** Schul-Bärli, Regen-Bärli, Detektiv-Bärli, Musik-Bärli; Mehrfach-Anprobe ohne Ausgabe von Sternen. „Meine vorhandenen Sachen anziehen“ setzt nur bereits erworbene Artikel auf die jeweiligen Slots; keine automatischen Käufe. Direkte Links führen aus den Sets zu den einzelnen Artikeln.
- [x] **Bestehende Daten erhalten:** Die ursprünglichen Speicherkennungen `majas-wortwerkstatt-sternenbeutel-v1` und `majas-wortwerkstatt-baerli-auswahl-v1` bleiben unverändert; bisherige Artikel und Käufe werden übernommen. Kleidung/Taschen/linke Pfote/rechte Pfote können unabhängig kombiniert werden. Die Anprobe speichert keine Auswahl.
- [x] **Prüfungen erfolgreich:** Node-Inventartest [`baerli-inventar.test.cjs`](./baerli-inventar.test.cjs), Playwright-Tests [`e2e/wardrobe-expansion.spec.cjs`](./e2e/wardrobe-expansion.spec.cjs) samt Kauf, Speichern, Outfit-Set, Bildschirmüberlauf und Navigation. GitHub-Actions-Regressionslauf [#42708381940](https://github.com/Adrakir/Lernprogramme/actions/runs/42708381940) **success**.
- [x] **Öffentliche Bereitstellung erfolgreich:** GitHub-Pages-Lauf [#42708380739](https://github.com/Adrakir/Lernprogramme/actions/runs/42708380739) **success** für Commit `71f5afc1a`. PWA-Cache `v6` enthält den neuen Katalog. Öffentliche URL unverändert und ohne ChatGPT-Anmeldung: https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/
- [x] **Bildkontrolle:** Neun Chromium-Screenshots für die drei neuen Fächer (Desktop, Tablet, Handy-Emulation) erzeugt und gesichtet; dabei kein offensichtliches Abschneiden der Bedienelemente.
- [ ] **Offen:** Die Position der grafisch gezeichneten Utensilien auf Bärlis fotorealistischer Grundfigur bei vielen Kombinationen und die tatsächliche Safari-/iPad-/Android-Bedienung müssen zusätzlich menschlich abgenommen werden. Automatische Screenshots ersetzen keinen realen Gerätetest.

### Mobile Comic-Bildkontrolle und Einzelschritte (09.11.2026)
- [x] **Echte Chromium-Screenshots geprüft:** GitHub-Actions-Bilder für `lesezeichen`, `melody-und-die-hausaufgaben` und `tom-und-der-schulhund` in Desktop-/Handy-Emulation gesichtet. Die beispielhaften Panels und Sprechblasen waren lesbar, ohne offensichtliche horizontale Abschnitte. Die bisherige Handydarstellung war zu lang.
- [x] **Mobil jeweils ein Bild statt Bildstapel:** Das Comic-Kino blendet auf schmalen Ansichten die übrigen Bilder einer Seite aus und zeigt Vorheriges/Nächstes Bild + Fortschritt. Nach dem letzten Bild führt Weiter direkt zum bereits bestehenden Link für die nächste Comicseite. Vorlesen synchronisiert das sichtbare Bild; Zoom bleibt erhalten. Desktop behält seine Panels.
- [x] **Browser-Regression für Mobilnavigation:** `e2e/learning-and-comics.spec.cjs` prüft Bildwechsel, keine horizontale Überbreite und Weiterleitung über Comicseiten hinweg. Die CI-Screenshots werden über `maja-comic-visual-review` bereitgestellt.
- [x] **Offline-PWA-Update:** Comic-JS-Version `20261109e`, Cache `v5`.
- [ ] **Noch offen:** Ergebnis des neuesten GitHub-Actions-Laufs zur Endfassung kontrollieren; alle Comics und sämtliche realen iPhone-/iPad-/Android-Geräte optisch und akustisch abnehmen. Einzelne Stichproben sind kein vollständiger Bild-Review.

### Anschließende Hörtest- und Comicverbesserung (09.11.2026)
- [x] **Prüfungsgerechter Hörtest:** Volltext im Abschlusstest verborgen; Lesehilfe in Übung/Anleitung erhalten; erneut auf „Anhören“ startet die Aufnahme neu. Keine Änderungen an alten Lernständen.
- [x] **Comicbläschen besser lesbar:** Schulcomic-Dialoge als Sprechblasen unter Bildern; Detektivcomics mit umschaltbarer Darstellung, auf Desktop standardmäßig im Bild und auf schmalen Geräten lesefreundlich darunter; wirkungslosen Umschalter bei Schulcomics verborgen.
- [x] **Neue vollständige Chromium-Tests:** `e2e/learning-and-comics.spec.cjs` für 5 Hörtests, 5 Rechtschreibtests, mobile Beispiele, 8 Comiceinstiege, Bildvergrößerung und Sprechblasenmodus. Node-Test `pruefungen-comics.test.cjs` prüft Testdaten/Comicdateien; GitHub-Actions-Workflow erweitert. Mindestens ein CI-Lauf nach Testintegration erfolgreich: [Run 42698714838](https://github.com/Adrakir/Lernprogramme/actions/runs/42698714838).
- [x] **Offline-Aktualisierung:** Comic-JS/CSS-Dateiversionen erhöht und PWA-Cache auf v3 aktualisiert.
- [ ] **Bleibt offen:** Auf echten Geräten Comic-Sprechblasenpositionen, Bilder/Zoom und tatsächlichen Ton hören; abschließende menschliche Bildqualitätskontrolle. CI-Emulation ersetzt keine Geräteabnahme.

### Qualitätsprüfung und Schrank-Erweiterung (09.11.2026)
- [x] **Zehn Klassenarbeitstest-Sets quellcodeseitig geprüft:** 5 Hörtests mit je 5 Fragen und zugeordneten MP3-Dateien; 5 Rechtschreibtests mit je 15 Aufgaben. Die Lösungen wurden gegen Texte/Wortformen kontrolliert. Prüfbericht: [QA_BEFUNDE_2026-11-09.md](./QA_BEFUNDE_2026-11-09.md).
- [x] **Spelling-Korrektur:** In Test 4 bei `Stock` unplausibles `Stogg` durch `Stok` ersetzt und verräterischen Hinweis `Stoc_` neutralisiert.
- [x] **Comic-Originaltafeln gesichtet:** drei achtteilige Schulcomic-Sheets, fünf 24-teilige Detektiv-Sheets und Toms separate Duschgrafik; unterschiedliche Sprechblasenlösungen dokumentiert. **Keine komplette Live-Pixelabnahme.**
- [x] **Bärlis Kleiderschrank erweitert:** zwölf neue Teile (je zwei pro Kleidungskategorie), bebilderte Kategorien mit Stückzahl und unverbindliche Anprobe auf Bärli. Alte IDs, Speicherstände, Käufe und Sternenbeutel unverändert; PWA-Cache für neuen Stand auf v2 erhöht.
- [x] **Statische Integration der Anprobe überprüft:** JavaScript syntaktisch valide; zwölf eindeutige neue IDs, sechs Bildkategorien, Legacy-Migration `hose` → `hosen`, keine Änderung der gespeicherten Auswahl durch reine Anprobe. Node-/Playwright-Regressionstests ergänzt.
- [ ] **Offen:** Playwright-/GitHub-Actions-Lauf nach diesen Commits sowie reale iOS-/Android-/Windows-Browser- und Audioabnahme (Issues #22, #23, #25, #26). Bild- und Sprechblasenpositionen, neue SVG-Kombinationen, Kauf und Export/Import visuell prüfen.

## 1. Bereits im GitHub-Code umgesetzt

- [x] **Vertraute Startseite wiederhergestellt:** `Fit für den Kombitest`, drei größere Themenpiktogramme, „Teste dich“, vier bebilderte Auswahlkacheln und „Alle weiteren Lernthemen“. [HOME_LAYOUT.md](./HOME_LAYOUT.md) dokumentiert die verbindliche Nutzerentscheidung; `#lernen` und `#abenteuer` bleiben als zusätzliche Links bestehen.
- [x] **Zusätzliche Modi erhalten:** `#lernen` mit Hören/Nomen-Endungen/Verlängern/Klassenarbeit und `#abenteuer` mit Comics/Spielen/Bärli/Kleidung bestehen als optionale Unterseiten.
- [x] **Lange Archive verkürzt:** `#stationen` und `#comics` seitenweise mit höchstens vier Einträgen; Links zu allen bisherigen Inhalten erhalten.
- [x] **Hörverständnis-Bedienung:** Aufnahme oder Gerät-Computerstimme; deutsche Stimmen aus dem Browser auswählbar; Tempo 1, 0.85 und 0.7; Anhören/Stopp; roter Frageblock; Antworten einzeln.
- [x] **Vorlese-Einstellungen portierbar:** Neue Einstellungen unter `majas-wortwerkstatt-hoer-*`, alte `maja-prep-voice-*` werden weiterhin eingelesen.
- [x] **Geführtes Üben und Testen:** Vorhandene Lernwege mit Hinweisen und fünf Tests je Thema beibehalten; Bärlis Hilfe deutlicher benannt.
- [x] **Fehlerdiagnose:** Nach einem Test werden Fehler nach Hör-Fragetyp bzw. Verlängern/Nomen-Endungen gruppiert und passende Übungsschritte angezeigt.
- [x] **Elternübersicht:** Zeigt die tatsächlich absolvierten Abschlusstests mit höchstem gemessenen Testergebnis, ohne aus fehlenden Daten einen Lernstand zu erfinden.
- [x] **Kleiderschrank:** Hüte, Pullover/Jacken, Hosen, Brillen, Schals und Schuhe als zusätzliche Kaufoptionen; kombinierbare Kategorien und kleine, bebilderte Seiten.
- [x] **Speicherkompatibilität:** vorhandener Sternenbeutel, Outfitauswahl und lokale Lernstände nicht umbenannt; die bereits bestehende JSON-Export-/Importfunktion aus `maja-plus.js` bleibt verfügbar.
- [x] **Übergabe-Grundlage:** `AGENTS.md`, diese Statusdatei, `README.md`, Root-Pointer `MAJA_WEITERMACHEN.md`, Copilot-Instruktionen, Node-Tests, GitHub-Issues und CI-Workflow angelegt.

### Neu ergänzt (09.11.2026, Fortsetzung)
- [x] **Navigationsfehler behoben:** `render()` nutzt für `#lernen` / `#abenteuer` nun eine zusammenhängende `if/else if`-Kette, sodass die Startseite das gewählte Menü nicht unmittelbar überschreibt. [Commit aab4096](https://github.com/Adrakir/Lernprogramme/commit/aab409612dc9a598579f17535bc351c6a3bc92b5).
- [x] **Regressionstest ergänzt:** `mobile-start.test.cjs` kontrolliert die korrekte Route-Verzweigung. [Commit b156a88](https://github.com/Adrakir/Lernprogramme/commit/b156a88c0077a630d3b3e765f8e9210b90b864c7).
- [x] **Menschliche Abnahme als Markdown gesichert:** [QA_CHECKLIST.md](./QA_CHECKLIST.md); Audio, Geräte, Wortbildung, Kleidung, Speicherstand und Berichtsformat.
- [x] **GitHub Copilot angebunden:** [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) verweist auf die bestehende Arbeitsdokumentation.
- [x] **Playwright-Smoke-Tests angelegt:** `package.json`, `playwright.config.cjs`, `e2e/smoke.spec.cjs`; CI-Workflow `.github/workflows/maja-regression.yml` enthält einen Chromium-Job.
- [ ] **Browser-Smoke-Tests tatsächlich erfolgreich ausgeführt:** noch nicht bestätigt. `npm install` und Playwright-Browser konnten in dieser Sitzung nicht lokal heruntergeladen werden; GitHub-Action-Status separat kontrollieren.
- [ ] **Manuelle echte Gerätetests:** weiterhin offen, Issue #22.
- [ ] **Zweite Kleiderschrank-Implementierung konsolidieren:** `baerli-kleiderschrank.js` wird nach `index.html` geladen. Der veraltete `showHome`-Wrapper wurde entfernt und Slot-Aliase korrigiert, die übrigen doppelten Kleiderschrank-Funktionen sind noch zu konsolidieren. [Issue #24](https://github.com/Adrakir/Lernprogramme/issues/24).


### Korrektur der Nutzerbeanstandung: Oberfläche und Funktionen (09.11.2026)
- [x] **Bisherige Startseitenstruktur zurückgeholt:** drei Hauptthemen, Prüfungsfeld, vier Fotokacheln, weitere Lernangebote. Die Zwischenversion mit nur zwei Moduskarten war nicht die gewünschte Startseite.
- [x] **Bilder überprüft:** `baerli/leseecke.webp`, `werkstatt.webp`, `baerli.webp`, `kostuemkiste.webp` und der Einstieg `bilderbuecher/index.html` sind im Repository vorhanden.
- [x] **Funktionaler Konflikt behoben:** veralteter Startseiten-Wrapper im später geladenen `baerli-kleiderschrank.js` entfernt; alte Kategorien für Hüte, Brillen, Hosen, Schals und Schuhe auf die aktiven Slots gemappt; bestehende Auswahlen übernommen.
- [x] **Tests angepasst:** `mobile-start.test.cjs` und `e2e/smoke.spec.cjs` prüfen jetzt den ursprünglichen 3+4-Einstieg und die sekundären Modi.
- [x] **Quellcodeprüfung:** acht Inline-Skripte und vier weitere JS-Dateien syntaktisch geprüft; zwölf statische Code-/Verknüpfungschecks bestanden.
- [ ] **Browsertests und Live-Pages nicht bestätigt:** die öffentliche Seite konnte in dieser Sitzung nicht geöffnet werden. Weder tatsächliche iPhone-Darstellung noch Ton-/Spielablauf oder Playwright-Lauf als erfolgreich behaupten.
- [ ] **Weitere Funktionen prüfen:** Issues #22, #23, #24, #25 und #26 weiterführen. Besonders Spielwege, Bilderbuch, Hören, Sternenbeutel und Comics auf Geräten testen.

### Verbesserungsrunde (09.11.2026, GitHub Copilot)
- [x] **CI repariert:** Browser-Job auf `ubuntu-24.04` gepinnt (Playwright 1.56 unterstützt `ubuntu-latest`=26.04 nicht). Drei beim Startseiten-Restore verlorene Integrationen wiederhergestellt: Link `#erwachsene` (Lernübersicht), Aufruf `window.MajaRealAudio?.mount(...)` in `render()`, Maja-Stimme (`maja-melody.mp3`) im Lernberater. `comic-kino.test.cjs` an die gewollte Abschnitts-Anhörung (`Hörtraining in Abschnitten`) angepasst.
- [x] **Playwright lokal erstmals erfolgreich:** 16 Smoke- und 8 axe-Tests bestanden (Chromium-Emulation Desktop/Tablet/Mobil). Veraltete Erwartung „Alle Comics“ → „Comics und Bilderbücher“ korrigiert. **Kein echter Geräte-/Safari-Test.**
- [x] **Kleiderschrank konsolidiert (Issue #24, Teil 1):** Die tote Inline-UI (`bear-category-grid`, 86 Zeilen) aus `index.html` entfernt; `baerli-kleiderschrank.js` ist die einzige Implementierung. Daten (`bearItems`, `bearGroups`), Speicher-Keys, Käufe und Slot-Migration unverändert.
- [x] **Modularisierung begonnen (Issue #24, Teil 2):** 319 KB Base64-Diktataudio nach `diktat-audio.js` ausgelagert; `index.html` von 803 KB auf 484 KB reduziert. Im Browser verifiziert (6 Einträge, keine Fehler).
- [x] **Barrierefreiheits-Audit (Issue #26):** `e2e/a11y.spec.cjs` mit `@axe-core/playwright` prüft 8 Seiten auf WCAG-2A/-AA-Verstöße (serious/critical). Aktuell 0 Befunde. Ersetzt keine manuelle Prüfung mit Screenreader/Geräten.
- [x] **PWA:** `manifest.webmanifest`, `sw.js` (HTML immer netz-zuerst, statische Dateien cache-zuerst) und Icons aus dem Bärli-Foto. App ist offline nutzbar und auf Tablets installierbar. Lernstände bleiben ausschließlich in `localStorage`.
- [x] **Export-Erinnerung:** Nach 5 Lerntagen ohne Sicherung erscheint in `#einstellungen` und `#erwachsene` ein Hinweis auf den JSON-Export (`maja-plus.js`, Schlüssel unverändert `majas-wortwerkstatt-plus-2026-11`).
- [x] **Wiederholen mit Abstand + Lernserie:** Richtig nachgeübte Fehler werden nach 1/3/7 Tagen erneut fällig (Fehlertrainer und Tagesplan zeigen fällige Wiederholungen). Lernserie: an jedem dritten Lerntag in Folge gibt es 1 Bonus-Stern (`rewards`-Eintrag `streak:<Datum>`, bestehende Sternenbeutel-Validierung).
- [x] **Vorlesehilfe:** Knopf „🔊 Auswahl vorlesen“ in `#lernen` und `#abenteuer` liest die Menüpunkte mit der Gerätestimme vor; bricht beim Seitenwechsel ab; deaktiviert sich ohne Sprachausgabe.
- [x] **ESLint:** `eslint.config.cjs` + `npm run lint` (0 Befunde); Lint-Schritt im CI-Browser-Job ergänzt.
- [ ] **GitHub-Actions-Ergebnis nach diesem Push kontrollieren** (vorher schlugen alle Läufe fehl).
- [ ] **Echte Geräte weiterhin offen:** TTS-Hörbarkeit, PWA-Installation auf iOS/Android, Bonus-Stern und Diktat auf iPhone/iPad/Android sind **nicht geprüft** (Issue #22). Chromium-Emulation ersetzt keine Gerätekontrolle.

## 2. Bereits überprüft

- [x] GitHub-Updates über den verbundenen Connector erfolgreich geschrieben.
- [x] Nach den ersten Audio-/Kleiderschrankänderungen ließen sich alle acht Inline-JavaScript-Abschnitte als JavaScript parsen.
- [x] Statische Quellcode-Kontrollen für vorhandene Routen, Audioelemente, Speicher-Keys, Fehlerklassifikation und CSS durchgeführt.
- [ ] **Noch auszuführen:** Node-Regressionstests auf einer vollständigen Arbeitskopie ausführen; GitHub-Actions-Workflow `.github/workflows/maja-regression.yml` wurde erstellt, sein Erfolg ist noch **nicht** bestätigt.
- [x] **Nach den letzten Änderungen:** Acht eingebettete JavaScript-Abschnitte erneut geparst; 14 von 14 zusätzlichen statischen Quellcodekontrollen bestanden (kein Browser-End-to-End-Test).
- [ ] **Nicht geprüft:** tatsächliche GitHub-Pages-Auslieferung und Laufzeit auf echten Geräten.
- [x] **09.11.2026 (Copilot):** Alle 13 statischen Node-Tests, `npm run lint` und 24 lokale Playwright-Tests (Smoke + axe) erfolgreich ausgeführt; Diktataudio, PWA, Erinnerung, Lernserie und Vorlesehilfe zusätzlich einzeln im Chromium geprüft.

## 3. Offene Aufgaben – in dieser Reihenfolge

| Priorität | Aufgabe | GitHub |
|---|---|---|
| P0 | Manuelle Audio- und Bedienungstests auf iPhone/iPad/Android/Windows inklusive Sicherungsimport, Stimmenliste und langsamer Wiedergabe | [#22](https://github.com/Adrakir/Lernprogramme/issues/22) |
| P0 | Kleidung pixelgenau am Bärli-Bild, Comic-Sprechblasen, Köpfe und Proportionen prüfen und ggf. korrigieren | [#23](https://github.com/Adrakir/Lernprogramme/issues/23) |
| P0 | Alle Hör-/Rechtschreibtests und Vorschläge der Fehlerdiagnose fachlich gegen Aufgaben und Texte validieren | [#25](https://github.com/Adrakir/Lernprogramme/issues/25) |
| P1 | Alle übrigen großen Unterseiten in kindgerechte Schritte aufteilen; Touch-/Fokus-/Kontrast-Audit | [#26](https://github.com/Adrakir/Lernprogramme/issues/26) |
| P1 | Großes HTML weiter modularisieren (Kleiderschrank-Duplikat entfernt, Diktataudio ausgelagert); keinen unbeprüften Totalrewrite | [#24](https://github.com/Adrakir/Lernprogramme/issues/24) |
| P1 | PWA-Installation und Offline-Betrieb auf echten iOS-/Android-Geräten prüfen | [#22](https://github.com/Adrakir/Lernprogramme/issues/22) |

**Nächste einzelne Arbeit:** Issue #22 beginnen. Wenn kein Gerät/Browsertest möglich ist, die Grenzen klar notieren und mit #25 (inhaltliche Prüfung) fortfahren. Keine QA als erledigt markieren, wenn sie nicht tatsächlich stattgefunden hat.

## 4. Wichtige Routen

- Start: `#` oder ohne Hash
- Lernmodus: `#lernen`
- Abenteuermodus: `#abenteuer`
- Hörkurs: `#pruefung/hoeren`
- Hörtraining: `#pruefung/hoeren/gefuehrt/1`, `#pruefung/hoeren/ueben/1`, `#pruefung/hoeren/test/1`
- Nomen/Verlängern: `#pruefung/nomen`
- Stationen: `#stationen/1` bis `#stationen/2` (abhängig von der Anzahl)
- Comics: `#comics/1` ff. (dynamisch, abhängig von vorhandenen Comics)
- Bärlis Kleiderschrank: `#baerli/schrank` und z. B. `#baerli/schrank/hose`
- Elternübersicht: `#erwachsene`
- Lernstand sichern: `#einstellungen`

## 5. Speicherschutz und Tests

Keine alten `localStorage`-Keys ändern oder beim Initialisieren löschen. Beim Testen immer auch eine Sicherung **vor** dem Update verwenden; mit bestehendem Sternenstand und gekaufter Kleidung.

```bash
node majas-wortwerkstatt/mobile-start.test.cjs
node majas-wortwerkstatt/experience.test.cjs
# Danach die weiteren vorhandenen majas-wortwerkstatt/*.test.cjs
```

Diese Befehle sind nicht gleichbedeutend mit visuellem Browser-QA. Audioausgabe hängt u. a. von Browser, Betriebssystem, deutschen Gerätestimmen und den lokalen Benutzerrechten ab.

## 6. Übergabeprotokoll (bei jeder KI-Fortsetzung ausfüllen)

| Datum / Bearbeiter | Änderung / Commit | Verifiziert (wie?) | Weiter offen |
|---|---|---|---|
| 09.11.2026 / ChatGPT | Kindgerechte Hubs, paginierte Archive, Audio, Feedback, Elternsicht, Kleidung; Tests, Copilot-Regeln, GitHub-Issues und CI-Workflow angelegt | GitHub-Commits bestätigt; 8/8 Inline-Scripts geparst und 14/14 statische Prüfungen bestanden. Node und echte Browser noch nicht ausgeführt | Issues #22–#26; Node-/Actions-Lauf, Browser-/Audio- und Bildprüfung |
| 09.11.2026 / ChatGPT – Fortsetzung | Router-Fix [aab4096](https://github.com/Adrakir/Lernprogramme/commit/aab409612dc9a598579f17535bc351c6a3bc92b5); neue QA-Checkliste, Copilot-Hinweise, Playwright-Smoke-Tests, CI-Browserjob, Issues #22/#24/#26 ergänzt | Neue JS-Test- und Konfigurationsdateien syntaktisch geprüft, Router-Kette und zentrale UI-Schlüssel statisch kontrolliert; GitHub-Dateien erfolgreich geschrieben. **Kein erfolgreicher Node-, Playwright-, Actions- oder echter Gerätetest nachgewiesen.** | GitHub-Actions-Ergebnis prüfen, Fehler falls vorhanden beheben; danach Audio auf echten Geräten und Sichtkontrolle an Bärli/Comics (Issues #22–#26) |
| 09.11.2026 / GitHub Copilot | CI-Fix (ubuntu-24.04, drei Regressionen des Startseiten-Restores behoben), Kleiderschrank konsolidiert, Diktataudio nach `diktat-audio.js` (index 803→484 KB), axe-Audit `e2e/a11y.spec.cjs`, PWA (`manifest.webmanifest`, `sw.js`, Icons), Export-Erinnerung, Wiederholen 1/3/7 Tage, Lernserien-Bonus-Stern, Vorlesen-Knopf in den Hubs, ESLint | 13/13 statische Node-Tests, ESLint 0 Befunde, 24/24 lokale Playwright-Tests (Chromium-Emulation); SW/Manifest/Erinnerung/Streak/Vorlesen einzeln im Chromium verifiziert. **Nicht geprüft: echte iOS-/Android-Geräte, hörbare Tonausgabe, GitHub-Actions-Lauf nach diesem Push, Live-Pages.** | Actions-Ergebnis kontrollieren; Issues #22 (Geräte inkl. PWA), #23 (Optik), #25 (Didaktik) weiterführen |

**Regel:** Nach jeder relevanten Änderung mindestens diese Tabelle und die Checkboxen aktualisieren. Anfragen anderer KI-Systeme sollen sich auf diese Datei, die Issues und die Git-Historie stützen, nicht auf frühere Chats.
