# Konfiguration und Betrieb

## Zentrale Einstellungen

Die Lernprogramme sind derzeit eine Sammlung eigenständiger Apps. Es gibt keine
gemeinsame Build-Konfiguration, Paketverwaltung oder zentrale
Konfigurationsdatei für alle Fächer. Fachbezogene Einstellungen und Anleitungen
gehören deshalb in den jeweiligen App-Ordner. Die Fächerübersicht liegt in
[Lernprogramme.html](./Lernprogramme.html).

## Voraussetzungen

- Aktueller Browser (empfohlen: Microsoft Edge, Chrome oder Firefox).
- Bildschirm und Eingabegerät mit Touch- oder Mausbedienung; die Apps sollen
  ebenfalls auf Tablets und Smartphones nutzbar sein.
- Internetverbindung nur dann, wenn eine App externe Inhalte wie Kartendaten
  lädt. Andere Inhalte können je nach App auch lokal verfügbar sein.

## App-Einstiegspunkte

| App | Startdatei |
|---|---|
| Lernprogramm-Übersicht | [Lernprogramme.html](./Lernprogramme.html) |
| Deutsch | [deutsch/Deutschapp_Minka_Fuji/index.html](./deutsch/Deutschapp_Minka_Fuji/index.html) |
| Englisch | [englisch/index.html](./englisch/index.html) |
| Mathematik | [mathematik/MatheKompass/MatheKompass.html](./mathematik/MatheKompass/MatheKompass.html) |
| Musik | [musik/Musik-Lernapp/index.html](./musik/Musik-Lernapp/index.html) |
| Biologie | [biologie und chemie/BioLabor_5_Biologie_V9_2.html](./biologie%20und%20chemie/BioLabor_5_Biologie_V9_2.html) |
| Chemie | [biologie und chemie/Chemie_Entdeckerlabor_V7_2.html](./biologie%20und%20chemie/Chemie_Entdeckerlabor_V7_2.html) |
| Erdkunde | [erdkunde/Erdkunde_Entdecker_Klasse5_V11/index.html](./erdkunde/Erdkunde_Entdecker_Klasse5_V11/index.html) |

## Lernstand

- Lernstände werden, sofern die jeweilige App dies unterstützt und der Browser
  es erlaubt, im lokalen Browserspeicher des Geräts abgelegt.
- Der lokale Browserspeicher ist pro Browser und Gerät getrennt. Ein Wechsel
  des Browsers oder Geräts übernimmt den Lernstand nicht automatisch.
- Browserdaten nicht löschen, wenn vorhandene Lernstände erhalten bleiben sollen.
- Die Übersicht liest gespeicherte Lerninformationen ausgewählter Apps aus,
  sofern diese im selben Browser verfügbar sind. Sie ist kein zentraler
  Datenspeicher.
- Die Erzählwerkstatt speichert Antworten laut Übersicht nur während der
  geöffneten Sitzung.

## Änderungen und Pflege

### MatheKompass

Die Offline-App wird aus `mathematik/MatheKompass/Quellcode` mit
`npm run build:offline` gebaut. Prüfung: `npm run typecheck` und
`npm run test:learning`. Dafür werden die Projektabhängigkeiten benötigt,
nicht aber zum Starten der fertigen HTML-Datei.

Bestehende Lernstandsschlüssel bleiben erhalten. Lernwegpositionen liegen
zusätzlich unter `mathe-kompass-path-<Thema>`. Diese Positionen werden nicht
mit der Sicherung des Tagestrainings exportiert. Die Sicherung dieses
Trainingsbereichs unterstützt alte 14- und neue 30-Aufgaben-Diagnosen.

1. Bestehende fachspezifische Anleitungen und Prüfberichte im App-Ordner vor
   Änderungen lesen.
2. Die Startdatei und alle zugehörigen lokalen Bilder, Skripte und Materialien
   gemeinsam erhalten. Relative Dateipfade nicht unbeabsichtigt ändern.
3. Nach einer Änderung die betroffene App aus ihrer gespeicherten Startdatei
   erneut öffnen und die geänderten Interaktionen prüfen.
4. Bei Kartenmaterial externe Datenquellen und deren Nutzungsbedingungen
   beachten; Quellenhinweise in der App sichtbar lassen.

## Erdkunde-Materialien

Die Erdkunde-App, begleitende Anleitungen und Lernhefte liegen in
[erdkunde/Erdkunde_Entdecker_Klasse5_V11/](./erdkunde/Erdkunde_Entdecker_Klasse5_V11/).
Die Projektanleitung dort beschreibt bei Bedarf, ob ein lokaler Webserver
erforderlich ist. PDFs können im Browser geöffnet werden; eine Datei, die gerade
in einem PDF-Viewer geöffnet ist, lässt sich unter Umständen nicht ersetzen.
