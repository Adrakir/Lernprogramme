---
applyTo: "biologie und chemie/**"
---
# Chemie-Entdeckerlabor – GitHub Copilot

Die verbindlichen Arbeitsregeln stehen in `biologie und chemie/AGENTS.md` – vor Änderungen lesen.

Kurzfassung: Niemals die generierte `Chemie_Entdeckerlabor_V7_2.html` direkt bearbeiten; Module in `entwickler/` ändern, mit `node entwickler/build-offline.cjs` bauen und mit `--check` verifizieren. Tests über `tests/run-suite.cjs` mit `NODE_PATH` auf `entwickler/node_modules` und `CHEMIE_BROWSER` für die Browserwahl. Zielgruppe Klasse 5: kindgerechte Erklärungen mit Begründung, Sicherheit nur virtuell und unter Aufsicht, Simulationen als vereinfachte Modelle kennzeichnen. Nach dem Push den GitHub-Pages-Link mit `?v=<commit-hash>` ausgeben.
