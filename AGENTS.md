# Arbeitsregeln für bestehende Lernapps

- **Keine neue App anlegen:** Alle Fachprogramme im Repository `Adrakir/Lernprogramme` weiterentwickeln und die bestehenden öffentlichen URLs erhalten.
- **Erdkunde-Quelle:** `erdkunde/Erdkunde_Entdecker_Klasse5_V11/entwickler/` enthält die aufgeteilten JS-/CSS-Quelldateien; `erdkunde/Erdkunde_Entdecker_Klasse5_V11/index.html` ist die gebündelte Offline-Ausgabe. Quellcode und Ausgabe dürfen nicht auseinanderlaufen.
- **Große Dateien:** GitHubs Contents-API liefert bei `index.html` (>1 MB) keinen normalen UTF-8-Inhalt. Zum Lesen die Blob-SHA ermitteln und die Git-Blob-API verwenden; zum Schreiben Git-Data-Blobs/-Trees/-Commits statt der Contents-API. Fehler nicht durch Leeren/Überschreiben der HTML-Datei umgehen.
- **Reproduzierbar bauen:** Im Erdkunde-Ordner `node entwickler/build-offline.js`; baut die bestehende `index.html` aus `entwickler/`. Vorher Quellen und PDFs beibehalten, danach unbedingt mit dem gebündelten Ergebnis abgleichen.
- **Vor Veröffentlichung testen:** `node entwickler/atlas-schulung.test.cjs` und `node entwickler/atlaswerkstatt.test.cjs`, außerdem bestehende Fachtests. Aktuelle `main`-SHA vor dem Commit prüfen und keine fremden zwischenzeitlichen Änderungen überschreiben.
- **Nach Veröffentlichung:** GitHub-Pages-Status prüfen und öffentliches Startdokument, Atlas-Schulung, Bildmaterial und PDF-Verlinkungen testen. GitHub-Pages-Erfolg allein beweist nicht, dass alle Übungen funktionieren.
- **Lernstände:** Vorhandene Storage-Schlüssel und Schülerantworten bei Änderungen erhalten. Dateinamen der publizierten Einstiegsseiten nicht ändern.
