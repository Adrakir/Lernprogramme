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
