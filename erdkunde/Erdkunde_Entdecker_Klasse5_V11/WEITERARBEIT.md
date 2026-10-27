# Übergabe: bestehende Erdkundeapp weiter verbessern

Stand 27.10.2026. Der Nutzer möchte im neuen Chat weiterarbeiten. Keine neue App anlegen. Die vorhandene App in Adrakir/Lernprogramme fortführen.

## Bestehendes Projekt

- GitHub: Adrakir/Lernprogramme, Ordner erdkunde/Erdkunde_Entdecker_Klasse5_V11.
- Hauptstand vor diesem Zwischenstand: ed0b72204aeb268e8c596b4343d81526faa24ea6 auf main.
- Bestehende Website: https://erdkunde-entdecker.node-opcua.chatgpt.site (privat, Anmeldung mit ChatGPT).
- Sites-Projekt-ID unverändert: appgprj_6ae0d8a73eb881918aae6ad599612f3c.
- Sites-Checkout: /workspace/sites/erdkunde-entdecker, Hostingmanifest .openai/hosting.json, statisches dist/.
- Website derzeit noch Stand c48f9fde9f94a2fb08d894fabc045482ba6de975 im Sites-Quellrepository. Die hier gesicherten animierten Lösungen sind NOCH NICHT online veröffentlicht.
- Lokaler GitHub-Dateibaum: /workspace/scratch/fa49777ae51b/repos/Lernprogramme (kein lokaler Git-Checkout; GitHub-Connector verwenden oder richtigen Checkout anlegen).

## Nutzerwünsche

Die aktuelle Klassenarbeit soll die hochgeladenen Originalskizzen exakt abdecken: Halb- und Viertelkugeln, Pole, Äquator/Nullmeridian, vier Ansichten (Linien/Ringe/Bögen/Speichen), Halbkuppel mit Erdmittelpunkt, Linien selbst einzeichnen, Draufsicht/Seitenansicht, Atlas und der genaue Lückentext. Die PDF hat 9 Aufgaben- und 8 Lösungsseiten. Alle 18 Aufgaben sind bereits interaktiv vorhanden.

Neu gewünscht: verständliche ANIMIERTE Lösungen und hohe methodisch-didaktische Qualität. Der Nutzer ist frustriert von zusätzlichen App-Dateien und mehrfachen Starts. index.html bleibt der Einstieg; die alte datierte HTML-Kopie ist nur noch eine Weiterleitung.

## Zwischenstand dieses Arbeitszweigs

Geändert: entwickler/atlaswerkstatt.js, atlaswerkstatt.css, atlaswerkstatt.test.cjs, service-worker.js sowie ATLASWERKSTATT.md und LEHRER_SCHUELER_PRUEFUNG.md.

- Alle 18 Aufgaben haben eigene Lösungspläne mit 4–5 kleinen Schritten, Lernziel, eigener Übertragungsfrage und getrennt aufklappbarer Vergleichsantwort.
- Lösungen werden erst nach endgültiger Abgabe sichtbar; abgegebene Antworten und Punkte bleiben erhalten.
- Lernziel steht bereits vor der Bearbeitung fest. Nach Abgabe unterscheidet ein Lernhinweis unbeantwortete Aufgaben von Fehlern und passenden Antworten.
- Karten: zuerst Breite, dann Länge, dann Schnittpunkt; beim Ablesen vom Punkt zum Rand. Nur hervorgehobene Wege werden nachgezeichnet.
- Perspektivwechsel: echte Kugelprojektion wird per requestAnimationFrame vom Äquator zum Pol gekippt; keine bloße Bildüberblendung.
- Pause, Weiter/Zurück, Wiederholung; automatischer Schrittwechsel nach 10 Sekunden nur auf Wunsch. Reduzierte Bewegung: statische Einzelschritte, kein Autoplay.
- Aufgaben-/Bereichswechsel und verborgenes Browserfenster stoppen die Wiedergabe. Rückseitige Linien bleiben gestrichelt.
- Statische vollständige Lösungen und Teilpunkte bleiben zusätzlich aufklappbar. Freihandzeichnungen und Begründung werden weiterhin manuell anhand von 11 Kriterien geprüft; 54 automatische Punkte bleiben getrennt.

## Prüfung und offene Arbeit

`node entwickler/atlaswerkstatt.test.cjs`: 565 Prüfungen bestanden. Alle 18 Lösungspläne und deren Grafiken rendern; vor Abgabe keine Lösung, reduzierte Bewegung berücksichtigt, Punktzahlen unverändert. JavaScript-Syntax und eingebettete Ausgabe geprüft.

Browserprüfung am lokal gebauten index.html: Abgabe, Sperrung, Wiederaufnahme, eigene Antworten/Teilpunkte, Einzelschritte, Play/Pause, echter Blickwechsel, Autoplay-Fortschritt und Stop beim Aufgabenwechsel funktionieren. In 375 px breiter Ansicht kein Seitenüberlauf; Vier-Felder-Grafiken stehen untereinander. Ein erster Klick unmittelbar nach Aufgabenwechsel reagierte in der automatisierten schmalen Vorschau einmal nicht, der nächste funktionierte: ggf. noch gezielt auf Fokus/Übergang prüfen. Kein echter iOS-/Android-Gerätetest und kein Unterrichtsversuch durchgeführt.

Noch zu tun:
1. Letzte visuelle Fach-/Bedienprüfung: Halbkuppel, Viertel, Register, Lückentext und Freihandlösungen. Pause/Weiter nach Perspektivwechsel sowie Stop bei Bereichswechsel prüfen.
2. `node entwickler/build-offline.js` erneut ausführen. Dieser Zwischenstandsbranch enthält absichtlich nur die geänderten Quellen und Doku; index.html auf dem Branch ist noch der ältere main-Build. Lokal ist ein neuer Build vorhanden, aber vor Veröffentlichung IMMER reproduzierbar neu bauen.
3. Tests nach letzten Änderungen ausführen; dann Quellen UND erzeugten index.html im ursprünglichen GitHub-main speichern. Nebenläufige Änderungen am main vor einem Ref-Update prüfen.
4. Bestehendes Sites-Projekt öffnen (get_site + frisches Source-Write-Credential, niemals neue Site anlegen), aktualisierten index.html nach dist/index.html übernehmen. Alle vorhandenen PDFs in dist erhalten. Mit Sites-Workflowhelper packen/synchronisieren und dieselbe private Website aktualisieren. Sites-Skill lesen, Publikum beibehalten. Credentials nicht speichern/ausgeben.
5. Nutzer den bestehenden Browser-Link und kurze Bedienung nennen: Klassenarbeit abgeben → Aufgabe auswählen → Lösungsweg abspielen. Keine neue App-Datei anbieten.

Sinnvolle spätere Vorschläge, noch NICHT umgesetzt: zweite gleichschwere Aufgabenvariante zum späteren Abruf, abgestimmte Anforderungsbereiche und Hilfsmittel, kurzer Praxistest mit Kindern. Nicht behaupten, die Browserprüfung belege bereits Lernwirksamkeit oder Eignung als geschützte benotete Prüfung.
