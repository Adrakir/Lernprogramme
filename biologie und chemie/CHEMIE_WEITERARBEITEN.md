# Chemie-App – vollständige Navigation und Funktionsschutz

Stand: 09.11.2026 · GitHub Pages: `biologie und chemie/Chemie_Entdeckerlabor_V7_2.html` (Anzeige 8.0/8.1).

## Warum die App vorher kleiner aussah
Die frühere Startseite mit allen Werkstätten wurde in Version 8.0 in ein standardmäßig geschlossenes HTML-`details` verschoben. Die Hauptfunktionen waren im Quellcode noch vorhanden, aber am Start nicht sichtbar.

## Was jetzt wieder erreichbar ist
Die Startseite zeigt vier eindeutig bebilderte Bereiche mit insgesamt 22 direkt anklickbaren Einstiegen:

- **Grundlagen (8):** Stoffe und Körper, Laborgeräte, Sicherheit, Löslichkeit, Wärmeleitfähigkeit, Siedetemperatur, Gasbrenner, Experimente planen.
- **Experimentieren (6):** Labor-Missionen, Forscherlabor mit Animationen, virtuelles Labor, Forscherwerkstatt V5, Forschungscampus V6, Lernzentrale.
- **Spielen (2):** Chemie-Spielwelt, Wissenscheck.
- **Üben und Tests (6):** Geführter Lernpfad, Übungen, Protokoll-Fehlertrainer, Probearbeit, Abschlusstest, Lernheft.

Die drei Einstiege Lernen / Üben / Klassenarbeit bleiben als Schnellzugang stehen. Die neuen Bereiche erscheinen zusätzlich statt die alten zu ersetzen. Alle Visualisierungen sind eingebettete SVG-Zeichnungen; die komplette HTML-Datei bleibt offline verwendbar. Bestehende Speicherschlüssel und Lernstände werden nicht verändert.

## Für weitere Arbeit mit anderen Assistenten
- Änderungen nur an `entwickler/template.html`, `entwickler/dashboard-access.css`, `entwickler/dashboard-access.js` und ggf. weiteren Quellen vornehmen.
- `entwickler/manifest.json` hält die Einbindungsreihenfolge fest.
- Nach Änderungen `node entwickler/build-offline.cjs` ausführen und die generierte `Chemie_Entdeckerlabor_V7_2.html` mitcommitten.
- `node entwickler/build-offline.cjs --check` und `node tests/run-suite.cjs` ausführen. GitHub Actions führt Browser- und Drucktests automatisiert durch.
- `tests/dashboard-smoke.cjs` sichert Sichtbarkeit, Navigation und Parität aller früheren Hauptseiten ab.

## Noch gesondert zu prüfen
Reale Bedienung auf iPhone/iPad, alle Unteranimationen einzeln, Audioqualität und inhaltliche Korrektheit einzelner Experimente; ein Browser-Smoke-Test allein beweist diese Punkte nicht.

## PC-first Erlebniswelt (November 2026)

Die Startseite wird zusätzlich durch `entwickler/desktop-studio.css` und `entwickler/desktop-studio.js` gestaltet. Große Laborillustration, drei **steuerbare Bildschirmmodelle** (Löslichkeit/Siedepunkt/Flammenbild), ein direkt spielbarer Vier-Fragen-Wissenscheck und fachbezogene Illustrationen für alle 22 Navigationskarten. Die vorhandenen vollständigen Experimente, Spiele und Tests bleiben unverändert.

Die Vorschau dient dem intuitiven Einstieg und ersetzt **nicht** die ausführlichen Animationen in `deep`, `v4lab`, `v5academy` und `chem6`. Keine Leistungsdaten werden durch das Kurzquiz überschrieben. Fokus: großzügige PC-Ansicht; Tablet und Smartphone bleiben benutzbar. Für jede Veränderung: `node entwickler/build-offline.cjs`, `node tests/run-suite.cjs`; die automatische Testmatrix prüft Chromium, Firefox und WebKit.

## PC-Qualität: Originalanimationen und Spiele sichtbar

Die Startseite zeigt jetzt direkt vier große animierte Vorschaukarten: Teilchenkino (Deep), virtuelles Chemielabor (V4), Sicherheitsdetektiv und Escape-Room (V4-Spielwelt). Die Karten öffnen die **originalen, umfangreichen** Lernbereiche und keine abgespeckten Ersatzspiele. Die geführten Lernpfade werden darunter als kompakte Leiste gezeigt. Auf PCs startet die Themenübersicht mit „Alle Bereiche“ und 22 sichtbaren Einstiegen, auf Mobilgeräten zunächst mit Grundlagen. `appearance.css` behält den grauen Hintergrund, nutzt aber hellere und kontrastreichere Arbeitsflächen. Bitte bei zukünftigen Bearbeitungen nicht wieder die Bereiche standardmäßig verstecken. Alle Speicherstände und übrigen 24 Seiten bleiben erhalten.
