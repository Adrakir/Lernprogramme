# Projektstand – Majas Wortwerkstatt

**Zuletzt aktualisiert:** 09.11.2026 · **Branch:** `main` · **Repository:** [Adrakir/Lernprogramme](https://github.com/Adrakir/Lernprogramme) · **App-Ordner:** `majas-wortwerkstatt/`

> **Wichtig:** Diese Datei ist die Übergabestelle zwischen ChatGPT, GitHub Copilot und anderen KI-Assistenten. Aussagen über "fertig" beziehen sich auf gespeicherten Code, **nicht automatisch** auf browsergetestete oder öffentlich ausgerollte Funktion. Ein neuer Bearbeiter überprüft immer den aktuellen HEAD.

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
