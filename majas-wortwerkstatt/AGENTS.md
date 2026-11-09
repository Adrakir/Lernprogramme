# AI-Handoff: Majas Wortwerkstatt (Klasse 3)

**Geltungsbereich:** Nur Dateien unter `majas-wortwerkstatt/`. Andere Lernprogramme im Repository nicht ohne Auftrag verändern.

## Immer in dieser Reihenfolge anfangen
1. Den aktuellen Default-Branch `main` und die letzten Commits lesen.
2. `majas-wortwerkstatt/PROJECT_STATE.md`, [HOME_LAYOUT.md](./HOME_LAYOUT.md) und diese Datei lesen.
3. Die GitHub-Issues [#22](https://github.com/Adrakir/Lernprogramme/issues/22) bis [#26](https://github.com/Adrakir/Lernprogramme/issues/26) prüfen. Aktualisierten Stand mit der tatsächlichen Implementierung abgleichen.
4. `majas-wortwerkstatt/README.md`, `index.html`, `mobile-start.css`, `maja-plus.js` und vorhandene Tests prüfen.
5. **Die erste noch offene Aufgabe** aus `PROJECT_STATE.md` oder den Issues übernehmen, nicht eine neue App oder einen Parallel-Entwurf erstellen.

## Projekt und Ziele
- Interaktive, kindgerechte Deutschapp Klasse 3 mit Maja, Bärli, Fuji und Minka.
- Mobile first; iPhone, iPad, Android, Windows; große Touchflächen, gute Kontraste, klarer Fokus, Bilder und Audio.
- Für Kinder kurze Seiten und klare Zurück-/Weiter-Navigation. **Ausnahme: Die ausdrücklich gewünschte Startseite hat drei Lernkarten und darunter vier bebilderte Angebotskarten (3+4), wie in HOME_LAYOUT.md festgelegt.** Andere Überblicksseiten möglichst auf vier Einträge begrenzen.
- **Startseite:** Die vertraute Übersicht „Fit für den Kombitest“ mit 3 großen Themenpiktogrammen, „Teste dich“ und 4 bebilderten Kacheln **nicht wieder durch nur zwei Moduskarten ersetzen**. [HOME_LAYOUT.md](./HOME_LAYOUT.md) zuerst lesen.
- Lernmodus (sekundärer Link): Erklären → gemeinsam üben → selbstständig üben → Tests → Fehler gezielt verbessern.
- Abenteuermodus: Comics, Spiele und Bärlis Kleidung; pädagogischer Inhalt bleibt erkennbar.
- Keine unnötigen langen Scrollseiten; Bilder und Beschriftungen passen zusammen.
- Öffentlicher Einstieg: https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/ (nicht ohne echten Aufruf als live verifiziert melden).

## Technische Einordnung
- Einstieg: `index.html`; eingebettete Hauptlogik/Hash-Router in `render()`.
- Styling: `mobile-start.css`; zusätzliche bestehende CSS-Dateien nicht löschen.
- Fortschritt / Sicherung: `maja-plus.js` exportiert/importiert `localStorage`-Schlüssel mit Präfix `majas-wortwerkstatt`.
- Existierende Speicher-Keys, besonders `majas-wortwerkstatt-sternenbeutel-v1`, `majas-wortwerkstatt-baerli-auswahl-v1`, `majas-wortwerkstatt-klasse3-v1`, `majas-wortwerkstatt-lernweg-v1`, `majas-wortwerkstatt-klassenarbeiten-nov2026-v1`, müssen rückwärtskompatibel bleiben.
- Neue Stimmauswahl und Geschwindigkeiten unter `majas-wortwerkstatt-hoer-*`, damit die Einstellungen in die vorhandene JSON-Sicherung eingehen.
- Keine personenbezogenen Kinder-Lerndaten, privaten Exportdateien oder Geheimnisse in GitHub hochladen.
- Das bisher große `index.html` schrittweise modularisieren, nicht ungeprüft vollständig überschreiben.

## Wichtige Laufzeit-Überlagerung (Stand 09.11.2026)
- `baerli-kleiderschrank.js` wird **nach** der Inline-Logik geladen und überschreibt `showBearWardrobe`, `showBear`, `showHome` und `showComicHub`. Vor Änderungen am Kleiderschrank beide Implementierungen ansehen; die **zuletzt geladene** Version ist im Browser wirksam.
- Neue Navigationsmodi in `render()` gehören zur **gleichen `if/else if`-Kette**. Ein zweites alleinstehendes `if` kann die Seite direkt wieder durch `showHome()` ersetzen (behoben in Commit `aab4096`).
- Browser-Smoke-Tests liegen in `e2e/smoke.spec.cjs` und werden mit `playwright.config.cjs` ausgeführt. Desktop-/Mobil-/Tablet-Emulation ist **kein echter Safari-/Android-Gerätetest**.
- Die verbindlichen manuellen Prüfschritte stehen in [QA_CHECKLIST.md](./QA_CHECKLIST.md).
- Bei mehreren bearbeitenden KI-Assistenten immer Dateiversion/SHA unmittelbar vor dem Schreiben erneut lesen und bei Konflikt nicht ungeprüft überschreiben.

## Adventskalender – zusätzliche Runtime (November 2026)
- Adventmodul `baerli-advent.js` wird **nach** `baerli-kleiderschrank.js` geladen, weil es die fertig ergänzten Artikel per `bearItems` referenziert. `baerli-baumhaus.js` wird zuvor geladen und exportiert `window.MajaTreehouse.gift(id)`. Reihenfolge und `#advent`-Route im Haupt-`render()` bewahren; bei Direktstart vor Laden des letzten Scripts rendert das Adventmodul die eigene Initialseite.
- Adventdatum nach lokaler Gerätezeit in Dezember; kein vorzeitiges Ausgeben über reine URL. Geschenke als kostenlose Einträge in **vorhandenem** Sternenbeutel/Baumhauskatalog, keine neue zusätzliche Preiswährung. Baumhaus-Levelbedingung und gespeicherte Lernstände nicht umgehen.
- Neue Speicherkennung `majas-wortwerkstatt-advent-v1`, wird vom bestehenden Präfix-Backup erfasst. Bei Änderungen an Datums-/Geschenkschema `ADVENT_KONZEPT.md`, `advent.test.cjs`, `e2e/advent.spec.cjs` aktualisieren; echte Safari-/Audioabnahme separat dokumentieren.
- Die vier 2×3-Handy-Kalenderseiten sind Absicht: **kein 24er-Raster auf einer Scrollseite** und **keine Änderung der vertrauten 3+4-Startübersicht**.

## Neues Baumhaus und Saison-Schrank (November 2026)
- **Routen:** `#baumhaus`, `#baumhaus/shop`, `#baumhaus/shop/<kategorie>`; `#baerli/schrank/saison`, `#baerli/schrank/regen`, `#baerli/schrank/weihnachten`. Kein zweites Hash-Routing aufbauen. `window.MajaTreehouse.render` gehört zur Haupt-`render()`-Route und muss vor dem großen Inline-Skript geladen werden.
- **Dateien:** `baerli-baumhaus.js/.css` für Zimmer, Shop, Prüfungs-Taler und Ausstattung, `baerli-saison.js` für 39 Saisonartikel, `baerli-kleiderschrank.js` für die bisherigen und saisonalen Anproben. Neue Artikel nie durch Änderung alter IDs ersetzen.
- **Freischaltung:** 10 Bärli-Taler nur einmal je unterschiedlichem bestandenen Abschlusstest (5 Hören, 5 Nomen, jeweils >=80 % und vollständig). Bereits bestandene Tests werden dauerhaft als Bestwert unter `majas-wortwerkstatt-baumhaus-v1` gespiegelt. Vorhandene `prepKey`-/Sternenbeutel-Schlüssel niemals zurücksetzen; Baumhaus nutzt eine eigene Spielwährung.
- **Auslieferung:** bei JS-/CSS-Updates versionsgebundene Links und `sw.js`-Cache-Versionsnummer erhöhen; neue statische Dateien in `CORE` ergänzen. GitHub Pages `success` und Regressionstest `success` unabhängig prüfen.
- **Testdateien:** `baumhaus.test.cjs`, `baerli-inventar.test.cjs`, `e2e/treehouse-and-shop.spec.cjs` (einschließlich Weihnachtsschmuck, Bettwäsche, Taler-/Freischaltsicherung). Echte Gerätetests bleiben gesondert offen.
- **Fiktiver Shop:** Bärli AG Osnabrück ist nur ein Spiel-Store; keine echten Waren, Konten oder Zahlungen. Lernstandsdaten ausschließlich lokal, nie in GitHub veröffentlichen.

## Prüfungen vor einem Commit
```bash
node majas-wortwerkstatt/mobile-start.test.cjs
node majas-wortwerkstatt/experience.test.cjs
```
Außerdem relevante bestehende `*.test.cjs` ausführen. Die Node-Tests sind nur statische Checks; Audio, Bildschirmgrößen, echte Interaktion und visuelle Overlays brauchen separate Browsertests (Issue #22, #23, #24).

## So eine Arbeit abschließen / einer anderen KI übergeben
1. Funktion in vorhandener App implementieren, vorhandene Links und Zustände erhalten.
2. Tests und Geräte-/Browser-Status im Commit bzw. Issue notieren; fehlende echte Tests als **nicht verifiziert** kennzeichnen.
3. `PROJECT_STATE.md` aktualisieren: Was ist fertig? Was wurde getestet? Was bleibt? Was soll als Nächstes geschehen?
4. Passendes GitHub-Issue ergänzen/schließen, nur wenn alle Abnahmekriterien erfüllt sind.
5. Commit-Link und öffentliche Seite nennen, **aber nur behaupten, dass GitHub Pages aktualisiert ist, wenn die Bereitstellung überprüft wurde**.

## Prompt für einen neuen Chat / anderen KI-Assistenten
> Setze die Arbeit an `Adrakir/Lernprogramme/majas-wortwerkstatt` fort. Lies zuerst `AGENTS.md` und `PROJECT_STATE.md`, dann die offenen GitHub-Issues #22–#26 und die jüngsten Commits. Prüfe den tatsächlichen Zustand; erledige die nächste offene Aufgabe in der bestehenden App und aktualisiere danach Tests, `PROJECT_STATE.md` und das Issue. Erhalte alle vorhandenen Spiele, Comics, Audios, Sterne und Lernstände. Nichts erfinden oder als live behaupten, ohne es zu prüfen.

- **Kompatibilität:** Die Datei `baerli-kleiderschrank.js` darf die bekannte Startseite nicht erneut mit einem veralteten `showHome`-Wrapper verändern. Kleidungsslot-Aliase und alte lokale Käufe erhalten.
