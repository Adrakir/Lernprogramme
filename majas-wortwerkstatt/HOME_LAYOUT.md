# Startseite / Bildkonzept – Majas Wortwerkstatt

**Entscheidung am 09.11.2026 auf Grundlage des Nutzer-Screenshots.** Diese Datei schützt das gewählte Oberflächenkonzept vor unbeabsichtigtem Umbau durch andere KI-Assistenten.

## Verbindliche Startseite (`#`, `#start`)

Die ursprüngliche **Kombitest-Übersicht** ist ausdrücklich gewünscht. Sie darf nicht wieder durch die alleinige Wahl zwischen „Deutsch lernen“ und „Abenteuer erleben“ ersetzt werden.

1. Überschrift **„Fit für den Kombitest“**, kurze Einleitung.
2. **Drei große Piktogrammkacheln in einer Reihe:** Hören (16. November), Endungen (-ung/-heit/...), Verlängern (Hund → Hunde).
3. Breiter, besonders erkennbarer Knopf **„Teste dich“** zu `#kombitest`.
4. Überschrift **„Was möchtest du danach machen?“**, danach **vier Kacheln als 2×2-Raster**:
   - **Comics** mit Bild `./baerli/leseecke.webp` → `#comics`
   - **Spiele** mit Bild `./baerli/werkstatt.webp` → `#spiele`
   - **Bärli hilft dir** mit Bärli-Foto `./baerli/baerli.webp` → `#lernberater`
   - **Bärlis Kleidung** mit Kostüm-Bild `./baerli/kostuemkiste.webp` → `#baerli/schrank`
5. **„Alle weiteren Lernthemen“** → `#stationen`.
6. Zusätzlich kurze, nicht dominierende Links zu **Lernmodus** `#lernen`, **Abenteuermodus** `#abenteuer`, **Bärlibuch** `./bilderbuecher/` und **Einstellungen** `#einstellungen`.

**Gestaltung:** Große Piktogramme (auf schmalen Smartphones mindestens etwa 61×61 CSS-Pixel), gut erkennbare Bilder statt gleich aussehender Buch-Symbole, ausreichend großer Text und Touchflächen. Die App hat eine übersichtliche Seite mit kurzen Sektionen – kein langes, ungeordnetes Menü. Bilder und Beschriftungen müssen thematisch zusammenpassen.

## Warum die Struktur wiederhergestellt wurde

Eine zwischenzeitliche Version zeigte auf der Startseite nur zwei große Modus-Karten. Dadurch waren die direkten Einstiegspunkte aus der vertrauten Übersicht nicht mehr zu sehen. Außerdem suchte `baerli-kleiderschrank.js` weiterhin nach den alten Kachel-CSS-Klassen und konnte deren Symbole/Bilder daher nicht ergänzen.

Die beiden Modi bleiben **als Zusatzangebote** erhalten. Der HTML-Code für die Startseite liegt in `index.html` in `showHome()`. Das zusätzliche Skript `baerli-kleiderschrank.js` darf **`showHome` nicht mehr überschreiben**; dort wurde die veraltete Wrapper-Logik entfernt. Die statischen Guards liegen in `mobile-start.test.cjs` und Browser-Smoke-Checks in `e2e/smoke.spec.cjs`.

## Festgestellter Kleiderschrank-Konflikt

Die bestehende App verwendet in zwei Implementierungen verschiedene Kategorienamen (z. B. `hose` vs. `hosen`, `brille` vs. `brillen`). Die nachgeladene Datei `baerli-kleiderschrank.js` ist zur Laufzeit maßgeblich. Die Zuordnung der älteren `bearItems` und die Migration gespeicherter Outfits wurden auf die Slots `huete`, `brillen`, `pullover`, `hosen`, `schals`, `schuhe` ergänzt. Vor einem größeren Refactor unbedingt alte Käufe und Kombinationen im Browser überprüfen.

## Abnahme / Einschränkungen

- [x] Quellcode aktualisiert und im GitHub-Repository gespeichert.
- [x] 8 Inline-Skripte und weitere JS-Quelldateien syntaktisch kontrolliert; 12 statische Integrationsprüfungen bestanden.
- [x] Bilddateien und Bilderbuch-Einstiegsdatei im GitHub-Repository gefunden.
- [ ] **Nicht bestätigt:** tatsächliche Darstellung der öffentlichen GitHub-Pages-Version auf einem iPhone.
- [ ] **Nicht bestätigt:** vollständige Bedienung aller Übungen, Spiele, Comics und Audios.
- [ ] **Nicht bestätigt:** volle Browser-/Playwright-Tests und GitHub-Actions-Ergebnis.

**Nächster Schritt:** [QA_CHECKLIST.md](./QA_CHECKLIST.md) und Issues [#22](https://github.com/Adrakir/Lernprogramme/issues/22), [#23](https://github.com/Adrakir/Lernprogramme/issues/23), [#24](https://github.com/Adrakir/Lernprogramme/issues/24), [#26](https://github.com/Adrakir/Lernprogramme/issues/26) abarbeiten und Befunde in [PROJECT_STATE.md](./PROJECT_STATE.md) protokollieren.
