# Erdkunde: Stand nach Abschluss der animierten Lösungen

Stand 27.10.2026. Bestehendes Projekt Adrakir/Lernprogramme, Ordner erdkunde/Erdkunde_Entdecker_Klasse5_V11. Der Einstieg bleibt index.html.

Die 18 Aufgaben haben nach Abgabe eigene Schrittfolgen, animierte Linien und echte Kugelperspektivwechsel, Pause/Fortsetzen, statische Einzelschritte bei reduzierter Bewegung und getrennte Übertragungsfragen. Antworten und Punkte bleiben beim Vergleichen unverändert. 54 automatische Teilpunkte und 11 gemeinsam bewertete Kriterien sind getrennt.

Der ursprüngliche Zwischenstand b38d90c2b59694d60f9a5293194b93f73bdf99bb wurde vollständig gelesen und geprüft. Abschließende Korrekturen betreffen wirklich pausierbare Linien, unmittelbare Aufgabenwechsel und eindeutige Pole an der Halbkuppel. Build mit node entwickler/build-offline.js reproduziert, 590 Prüfungen bestehen. Visuelle und funktionale Browserprüfung der Halbkuppel, Erdviertel, Register, Lückentext und Zeichenlösungen erfolgreich. Noch kein echter Gerätetest oder Unterrichtsversuch.

Veröffentlichungsziel bleibt dieselbe private Website: https://erdkunde-entdecker.node-opcua.chatgpt.site, Projekt appgprj_6ae0d8a73eb881918aae6ad599612f3c. Alle PDFs erhalten. GitHub und Website werden in dieser Fortsetzung auf den geprüften Build aktualisiert; den tatsächlichen Veröffentlichungsstand über GitHub-main und Sites get_site prüfen. Keine neue App oder Site anlegen.

Mögliche spätere Schritte: zweite gleichschwere Aufgabenvariante, mit der Lehrkraft abgestimmte Auswahl von Anforderungen/Hilfsmitteln und ein kleiner Praxistest mit Kindern.

## Neuester Stand: Bilder, Tipps und Fehlerauswertung

Alle 18 interaktiven Aufgaben haben Arbeitsgrafiken und direkt geöffnete bebilderte Lösungen nach Abgabe. Je Aufgabe sind zwei optionale Tipps verfügbar; genutzte Tipps werden gespeichert und kosten keine Punkte. Der direkte Vergleich zeigt eigene Antwort, richtig/falsch/offen, richtige Lösung und Teilpunkte. Freie Zeichnungen und Begründungen bleiben manuell geprüft. Passende Empfehlungen führen in die vorhandenen Übungsbereiche und bieten einen Rückweg zur unveränderten Abgabe. Mobile Rückmeldungen sind als gestapelte Karten angelegt.

717 Prüfungen bestehen. Im Browser wurden alle 18 Aufgaben durchgegangen: jede hat eine Lösungsabbildung und einen Rückmeldungsbereich; die vier Zeichenfelder bzw. drei Gradnetzfelder haben jeweils eigene Musterbilder. Richtige/falsche/offene Antworten, zwei Tipps, manuelle Bewertung, Übungsempfehlung und Rückkehr geprüft. Kein echter Geräte-/Unterrichtstest. Die Website ist inzwischen öffentlich; Publikum bei Folgeschritten über Sites get_site prüfen und beibehalten.

## Aktuelle Druckdateien: bebilderte Fassung vom 28.10.2026

Die bisher angebotenen PDFs vom 27.10.2026 enthielten bei Aufgabe 1 keine Kugelbilder, obwohl die App diese schon zeigte. Die Druckdateien wurden deshalb separat überarbeitet und die eingebetteten App-Downloads erneuert.

- Klassenarbeit: `Erdkunde_Klassenarbeit_Bebildert_2026-10-28.pdf`, 10 Seiten.
- Musterlösungen: `Erdkunde_Loesungen_Bebildert_2026-10-28.pdf`, 11 Seiten.
- Aufgabe 1 zeigt zwei orthografische Erdkugeln mit hervorgehobenem Äquator bzw. Nullmeridian; im Test sind die Linien unbenannt.
- Zusätzliche Winkelmodelle bei Aufgabe 2, Orientierungsbilder bei Aufgaben 3/4 und bebilderte Lösungen zu 5/6 sowie 9/10. Die Unterrichtsskizzen und Zeichenaufgaben 11-18 bleiben erhalten.
- `Atlas_Abschlusstest_Klasse5.pdf` und `Atlas_Abschlusstest_Loesungen.pdf` sind die aktuellen identischen Standarddateien. Die alten datierten Dateien mit 9 bzw. 8 Seiten bleiben historische Fassungen und dürfen nicht als neueste Version verlinkt werden.
- Erzeugung: `python entwickler/build-atlas-pdf.py`, danach `node entwickler/build-offline.js`. Das benötigte Lernheft ist ebenfalls im Projekt enthalten. `window.AW_PDFS.version` ist `2026-10-28-v7`.
- Prüfung: 717 bestehende Prüfungen bestanden; PDF-Seiten visuell geprüft, Seitenzählung 10/11 und Byte-Gleichheit der eingebetteten Downloads mit den PDFs bestätigt.

Bestehende Website und Projekt-ID weiterverwenden. Den tatsächlichen Veröffentlichungsstand über Sites prüfen.


## 29.10.2026: Gustav erklärt die Atlasarbeit als Animation

Die Schulung ist in die vorhandene App integriert: Thema/Lernpfad `atlanten`, Lernbegleiter (Einstieg und Entdecken-Schritt), Atlaswerkstatt/Atlas-Lernlabor und das bestehende Comic-Abenteuer `atlasdetektiv` (Geheimcode im Atlas). Auf der Startseite führt „Gustav erklärt Atlasarbeit“ direkt zur Schulung. Keine zweite App.

Zehn steuerbare Schritte: Suchauftrag, Register, Planquadrat, Koordinaten, Kartenwahl, Breite, Länge, Schnittpunkt, Ergebnis und eigene Übung. Gustav erklärt in einer Sprechblase, optional per Browser-Vorlesen. Beispiele: Prag, Lissabon, San Francisco und Alice Springs. Geografische Linien werden über requestAnimationFrame aufgebaut; Pause/Fortsetzen behält den erreichten Stand. Bei reduzierter Bewegung stehen vollständige Einzelbilder bereit. Kein automatischer Schrittwechsel. Seiten-/Bereichswechsel und verborgenes Browserfenster stoppen Animation und eigene Sprachausgabe.

Die Praxis verlangt 52° N / 8° O (Klick/Tippen, Pfeiltasten oder Richtungsknöpfe) plus zwei Antworten. Rückmeldung und Musterpunkt erscheinen erst nach Prüfen. Gespeicherte Klassenarbeitsantworten bleiben unabhängig. Das Comic-Abenteuer hat zehn Kapitel und acht Übungsfragen; die vorhandene Forscherprobe bleibt erreichbar. Die separate 19-seitige Schulungs-PDF ist verlinkt.

Prüfung: 720 bestehende Prüfungen und 96 gezielte neue Prüfungen bestanden. Browser: Einstieg aus Lernpfad und Startseite, Lernbegleiter und Comic, vier Beispielauswahlen, Breite/Süd und Länge/West, Pause/Fortsetzen, Praxisbewertung und Markierung per Klick/Richtungsknöpfen sowie Wiederaufnahme geprüft. Kein echter iOS-/Android-Gerätetest. Vorlesestimmen hängen vom Browser/Betriebssystem ab.

Quellen: `entwickler/atlas-schulung.js`, `atlas-schulung.css`, `atlas-schulung.test.cjs`. Ausgabe mit `node entwickler/build-offline.js` bauen; beide Tests ausführen. GitHub Pages bleibt der öffentliche Einstieg.


## 29.10.2026: Drei zusätzliche praktische Prüfungsfit-Stationen

In der **bestehenden** App ist im Bereich **Prüfungsfit** die Geowerkstatt erreichbar (kein neuer Einstieg):

- **Gradnetz:** Sechs Aufgaben auf einer 30°-Modellkarte, Schnittpunkt durch Tippen oder barrierearme Richtungstasten setzen, Korrektur mit markierten Linien.
- **Gedrehte Karten:** Sechs Orientierungsaufgaben mit wechselndem Nordpfeil; acht mögliche Himmelsrichtungen, jeweils mit Begründung.
- **Atlasregister:** Sechs Aufgaben mit gleichnamigen Orten (Frankfurt/Neustadt/Oldenburg), Bundesland, Kartenbuchstabe und auswählbarem Planquadrat.

Jede Station zeigt Hinweise, nach dem Prüfen sofortige Begründungen und am Ende ein unbenotetes Ergebnis. Die bestehenden acht Lernwege, 48 Fragen, die 24-Fragen-Probe und die 18-Aufgaben-Klassenarbeit bleiben erhalten. Neues Ergebnis-Storage `erdkunde-pruefungsfit-praxis-v1`; vorhandene Lernstände unberührt. Quellen `entwickler/pruefungsfit-praxis.js` und `.css`, Test `entwickler/pruefungsfit-praxis.test.cjs`. Die publizierte Offline-`index.html` wurde mit den aktualisierten Quellen gleichlaufend erweitert. Die Modellkarte ist ausdrücklich nicht flächentreu; Atlasregistereinträge sind Übungsdaten, keine Schulatlas-Seitenangaben. **Echte Gerätetests und Unterrichtsversuche sind noch ausstehend.**

**Nachprüfung 29.10.2026:** SVG-Beschriftungen für Smartphone-Ansicht vergrößert. Nach der Auswahl bleiben Tastaturfokus und Tastennavigation beim Neuzeichnen der Praxisstationen möglichst auf demselben Bedienfeld. Diese Verbesserung wurde an den Quell- und gebündelten HTML-Dateien parallel vorgenommen.


## 30.10.2026: Vier Erdviertel und Kartenwahl

Im bestehenden Gustav-Atlas-Lernpfad erklaert die Weltgrafik die vier Erdviertel (Nordwest, Nordost, Suedwest, Suedost) und die Bezugslinien Aequator und Nullmeridian. Die lernende Person waehlt das Erdviertel und die anschliessende Kontinentkarte; nach Pruefung folgen begruendete Rueckmeldungen. Es wird die Abfolge Weltkarte -> Kontinentkarte -> genauere Regionalkarte geuebt. Der zuvor fachlich falsche Nordost/Suedost-Hinweis der Kompasspraxis ist korrigiert. GitHub Actions testet nun auch die Praxisstationen. Versionsgleiche HTML-Pruefung ignoriert reine Unterschiede in Einrueckung oder Leerzeilen. Weiterhin ein Projekt, keine neue App.
