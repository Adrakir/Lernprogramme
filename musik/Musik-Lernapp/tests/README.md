# Aktuelle Prüfungen

Abhängigkeiten mit `npm ci` installieren (Node 24.15 oder neuer), dann `npm test` ausführen.

- `current-check.cjs` lädt alle Skripte aus der tatsächlichen index.html in ihrer Reihenfolge in eine jsdom-Testumgebung. Sie prüft die aktuelle Oberfläche, 27 vollständige Lernwege, 216 Antworten, unterstützte und selbstständige Wertung, Themen und Direktlinks, 27 Lehreraufträge, Heftseiten, 96 erzeugte Rhythmusstücke, alle 47 Werkstattaufgaben, Spiele, Sicherung, blockierten Speicher und synthetisierte Audiodaten.
- `offline-check.cjs` prüft den Service Worker isoliert: vollständiges Caching, Verhalten bei unterbrochenem Update, Erhalt alter Caches bis zur erfolgreichen Installation, optionale PDF-Speicherung, PDF-Aktualisierung und Bytebereiche.
- Der integrierte Browser-Prüfstand ist weiterhin über `?pruefstand=1` erreichbar. Er prüft 36 grundlegende Ansichten und Datenbedingungen.

Die übrigen älteren `*-check.cjs`-Dateien sind historische Teststände der früheren Oberfläche mit einem vereinfachten DOM-Modell. Sie nehmen unter anderem vier Navigationsbereiche, JPG-Bilder und alte Cache-Namen an und sind nicht Bestandteil des aktuellen Testbefehls. Die aktuelle Suite ersetzt ihre relevanten Szenarien und lädt auch wegweiser.js; die historischen Dateien werden als Referenz behalten.

Browserprüfung erfolgt zusätzlich am tatsächlich laufenden Site-Preview; jsdom ersetzt keine Prüfung realer Audiowiedergabe, Darstellung oder eines physischen iPhones.
