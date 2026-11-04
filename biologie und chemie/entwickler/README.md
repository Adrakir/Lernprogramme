# Chemie-Entdeckerlabor – Quellen und Offline-Ausgabe

Die bestehende öffentliche Einstiegsseite bleibt `../Chemie_Entdeckerlabor_V7_2.html`. Die Datei wird aus `template.html`, den CSS-/JS-Modulen und `manifest.json` gebaut. Keine Quellenänderung nur in der generierten HTML-Datei vornehmen.

```sh
node build-offline.cjs
node build-offline.cjs --check
```

Die Ausgabe enthält weiterhin alle Medien und Skripte inline und funktioniert ohne externe Bibliotheken oder Internetzugang. Die Quelldateien dürfen wegen gemeinsam genutzter globaler Funktionen nicht beliebig umsortiert werden; `manifest.json` hält die Reihenfolge fest.

`core.js` besitzt die zentrale Funktion `navigate()`. Module registrieren Aufräum- und Zeichenfunktionen über `ChemistryNavigation.onEnter()` und `.onLeave()`. Sie ersetzen `navigate()` nicht.

Neue Benutzerzustände werden zusätzlich in der Liste `NATIVE` in `learning-cockpit.js` registriert, damit Profilwechsel und vorhandene Sicherungen die Daten mitführen. Bestehende Speicherschlüssel bleiben erhalten. Freie Antworten werden nicht maschinell nach Schlüsselwörtern benotet: Kriterienbewertungen sind als Selbsteinschätzung gekennzeichnet.

GitHub Actions prüft den reproduzierbaren Build sowie Chromium, Firefox und WebKit. PDF-Ausgaben und gerenderte Seiten werden als Prüfarbeitsdateien im Workflow-Artefakt abgelegt. WebKit ist ein wichtiger Kompatibilitätscheck, ersetzt jedoch keinen abschließenden Test auf einem echten iPad.
