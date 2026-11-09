# Chemie-Entdeckerlabor – Arbeitsregeln für KI-Agenten

Diese Regeln gelten für alle Arbeiten im Ordner `biologie und chemie/`.

## Goldene Regeln

1. **Niemals `Chemie_Entdeckerlabor_V7_2.html` direkt bearbeiten.** Die Datei wird aus den Modulen in `entwickler/` generiert.
2. Quellmodule ändern, dann bauen: `node entwickler/build-offline.cjs` (aus dem Ordner `biologie und chemie/`), danach `node entwickler/build-offline.cjs --check` (muss „matches all source modules“ melden).
3. Die Modulreihenfolge steht in `entwickler/manifest.json`. Neue Module dort registrieren.
4. Vor jedem Build: `node --check` auf jedes geänderte JS-Modul.
5. Keine projektübergreifenden Änderungen (siehe `.github/copilot-instructions.md`).

## Tests

- Playwright 1.x liegt in `entwickler/node_modules`. Vor Testläufen setzen: `NODE_PATH=<repo>/biologie und chemie/entwickler/node_modules`.
- Komplette Suite: `node tests/run-suite.cjs` (aus `biologie und chemie/`; schreibt `chemie-test-artifacts/` ins Arbeitsverzeichnis – daher aus einem Scratch-Ordner starten).
- Browserwahl: Umgebungsvariable `CHEMIE_BROWSER=chromium|firefox|webkit`. Vor dem Push mindestens Chromium und WebKit grün; Firefox für die geänderten Bereiche.
- Wichtige Einzeltests: `deep-stations-smoke.cjs` (Forscherlabor, 12 Gerätemissionen), `campus-upgrades-smoke.cjs` (Ethanol-Vergleich, Teilchenlupe, Laborszenen, Skizzenlabor, Erklär-Schritte), `exam-visuals-smoke.cjs` (Abschlusstest + Druck), `learning-upgrade-smoke.cjs` (Lernpfad).
- Bei flakigen Klicks: Die App nutzt `scroll-behavior:smooth` (nur bei `prefers-reduced-motion:no-preference`). In Tests nach `goto` per `addInitScript` `scroll-behavior:auto` erzwingen.

## Windows/PowerShell-Fallstricke

- Nicht-ASCII-Zeichen (Umlaute, ×, Emojis) werden beim Pipen in `node -` zerstört. Skripte als `.cjs`-Datei schreiben und ausführen.
- Dateien mit `[IO.File]::ReadAllText/WriteAllText` und UTF-8 **ohne BOM** bearbeiten; `Get-Content` nur mit `-Encoding UTF8`.
- PowerShell 5: kein `&&` – stattdessen `;` und `if($?){...}`.

## Inhaltliche Leitplanken

- Zielgruppe Klasse 5: kurze Sätze, „du“-Anrede, kindgerechte Erklärungen – nach jeder Antwort erklären **warum** (auch warum falsche Optionen falsch sind).
- Sicherheit: keine praktischen Brenner-/Erhitzungsanleitungen; immer „nur unter Aufsicht der Lehrkraft“, Ethanol ist leicht entzündlich und wird nur virtuell erhitzt. Temperaturen als Näherungswerte (≈) angeben.
- Fachliche Fixpunkte: Wasser siedet ≈ 100 °C, Ethanol ≈ 78 °C (Normaldruck); Siedepunkt steigt mit Druck (Schnellkochtopf) und sinkt mit Höhe (Everest ≈ 70 °C); in 100 g Wasser lösen sich bei 20 °C ≈ 36 g Kochsalz; Rühren beschleunigt das Lösen, verschiebt aber nicht die Löslichkeitsgrenze.
- Simulationen immer als vereinfachte Modelle kennzeichnen.
- Freitext-Prüfungen sind Schlüsselwort-basiert und ersetzen keine Benotung – entsprechende Hinweise beibehalten.
- `Lernheft_Chemiearbeit.pdf` (11 Seiten) ist das gedruckte Begleitheft; das Laborbild in „Finde 6 Gefahren“ stammt von Seite 1, die Lösungen stehen auf Seite 11.

## Nach jedem Push

1. `git push` ausführen und Commit-Hash notieren.
2. Live-Link mit Cache-Brecher ausgeben: `https://adrakir.github.io/Lernprogramme/biologie%20und%20chemie/Chemie_Entdeckerlabor_V7_2.html?v=<commit-hash>`
3. Per `curl` prüfen, dass GitHub Pages die neue Dateigröße liefert (Pages braucht manchmal 1–2 Minuten).
4. Niemals `entwickler/node_modules/` oder persönliche Lernstände committen.
