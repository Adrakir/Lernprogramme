# Projektstand – Majas Wortwerkstatt

**Zuletzt aktualisiert:** 09.11.2026 · **Branch:** `main` · **Repository:** [Adrakir/Lernprogramme](https://github.com/Adrakir/Lernprogramme) · **App-Ordner:** `majas-wortwerkstatt/`

> **Wichtig:** Diese Datei ist die Übergabestelle zwischen ChatGPT, GitHub Copilot und anderen KI-Assistenten. Aussagen über "fertig" beziehen sich auf gespeicherten Code, **nicht automatisch** auf browsergetestete oder öffentlich ausgerollte Funktion. Ein neuer Bearbeiter überprüft immer den aktuellen HEAD.

## 1. Bereits im GitHub-Code umgesetzt

- [x] **Einstieg vereinfacht:** Startseite mit `#lernen` und `#abenteuer`; zwei gut erkennbare Auswahlfelder, Bärli-Bild.
- [x] **Vier Ziele pro Modus:** Lernweg Hören, Nomen-Endungen, Verlängern, Klassenarbeit; Abenteuer Comics, Spiele, Bärli hilft, Kleiderschrank.
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
- [ ] **Zweite Kleiderschrank-Implementierung konsolidieren:** `baerli-kleiderschrank.js` wird nach `index.html` geladen und überschreibt dessen Funktionen. Bis zur Konsolidierung beide Stellen berücksichtigen, [Issue #24](https://github.com/Adrakir/Lernprogramme/issues/24).

## 2. Bereits überprüft

- [x] GitHub-Updates über den verbundenen Connector erfolgreich geschrieben.
- [x] Nach den ersten Audio-/Kleiderschrankänderungen ließen sich alle acht Inline-JavaScript-Abschnitte als JavaScript parsen.
- [x] Statische Quellcode-Kontrollen für vorhandene Routen, Audioelemente, Speicher-Keys, Fehlerklassifikation und CSS durchgeführt.
- [ ] **Noch auszuführen:** Node-Regressionstests auf einer vollständigen Arbeitskopie ausführen; GitHub-Actions-Workflow `.github/workflows/maja-regression.yml` wurde erstellt, sein Erfolg ist noch **nicht** bestätigt.
- [x] **Nach den letzten Änderungen:** Acht eingebettete JavaScript-Abschnitte erneut geparst; 14 von 14 zusätzlichen statischen Quellcodekontrollen bestanden (kein Browser-End-to-End-Test).
- [ ] **Nicht geprüft:** tatsächliche GitHub-Pages-Auslieferung und Laufzeit auf echten Geräten.

## 3. Offene Aufgaben – in dieser Reihenfolge

| Priorität | Aufgabe | GitHub |
|---|---|---|
| P0 | Manuelle Audio- und Bedienungstests auf iPhone/iPad/Android/Windows inklusive Sicherungsimport, Stimmenliste und langsamer Wiedergabe | [#22](https://github.com/Adrakir/Lernprogramme/issues/22) |
| P0 | Kleidung pixelgenau am Bärli-Bild, Comic-Sprechblasen, Köpfe und Proportionen prüfen und ggf. korrigieren | [#23](https://github.com/Adrakir/Lernprogramme/issues/23) |
| P0 | Alle Hör-/Rechtschreibtests und Vorschläge der Fehlerdiagnose fachlich gegen Aufgaben und Texte validieren | [#25](https://github.com/Adrakir/Lernprogramme/issues/25) |
| P1 | Alle übrigen großen Unterseiten in kindgerechte Schritte aufteilen; Touch-/Fokus-/Kontrast-Audit | [#26](https://github.com/Adrakir/Lernprogramme/issues/26) |
| P1 | Großes HTML schrittweise modularisieren, Browsertests und CI ergänzen; keinen unbeprüften Totalrewrite | [#24](https://github.com/Adrakir/Lernprogramme/issues/24) |

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

**Regel:** Nach jeder relevanten Änderung mindestens diese Tabelle und die Checkboxen aktualisieren. Anfragen anderer KI-Systeme sollen sich auf diese Datei, die Issues und die Git-Historie stützen, nicht auf frühere Chats.
