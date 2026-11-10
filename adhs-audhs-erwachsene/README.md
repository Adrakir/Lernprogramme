# NeuroKompass – ADHS & AuDHS für Erwachsene

## Start und Veröffentlichung
- Einstieg: [index.html](./index.html)
- Nach GitHub-Pages-Veröffentlichung: https://adrakir.github.io/Lernprogramme/adhs-audhs-erwachsene/
- Stand: 2026-11-10
- Eigenständige App in diesem Unterordner; die bestehenden Schüler-Apps bleiben unverändert.
- Technisch eine eigenständige HTML-Datei ohne Framework, Tracking, Backend oder externe JS-Abhängigkeiten.

## Aktueller Funktionsumfang
1. Offizielles deutschsprachiges ASRS-v1.1-Kurzscreening (6 Fragen, Originalwortlaut; lizenzkonforme Attribution) mit Frage-spezifischer binärer Schwellenwertung und 4/6-Abklärungsgrenze.
2. **DIVA-5-Fachbereich**: Erklärung des Fachinterviews, der 18 ADHS-Kernsymptome, der 2 Lebensphasen, von Funktionsbereichen und Lizenzbedingungen. Offizieller Direktlink zum Original.
3. **Eigenständiger 18-Kriterien-Lerntrainer**, ausdrücklich **kein DIVA-5-Interview**, mit Erwachsenen- und Kindheitsbeispielen, Freitext, Entwicklung, Dauer, Lebensbereichen, Kontext und Differenzialdiagnostik.
4. 12 eigens formulierte Autismus-Lernfragen mit rein beschreibender Domänenübersicht (keine Autismusdiagnose, keine erfundene Cut-off-Schwelle).
5. AQ-10: Nur manuelle Eingabe eines bereits am offiziellen Original korrekt ermittelten Gesamtwerts; NICE-Empfehlung ab 6/10, ohne Einbindung der Originalfragen.
6. AuDHS-Lernmodul mit getrennter ADHS-/Autismus-Betrachtung und Kombinationsinterpretation ohne Pseudodiagnose.
7. Fünf fiktive Erwachsenenfälle mit Aufgaben und didaktischen Musterlösungen.
8. Druckansicht (Drucken/als PDF speichern), optionaler JSON-Export, Farbmodus, Schriftvergrößerung, mobiler Aufbau.

## Inhaltliche Grenzen und Rechtliches
- Die DIVA Foundation verbietet das freie Reproduzieren, Umformulieren oder automatisierte Auswerten des DIVA-5-Originalinterviews. **Keine** DIVA-5-Originalfragen verwenden oder den eigenen 18-Kriterien-Trainer als DIVA-5 bezeichnen. Offizieller Link: https://www.divacenter.eu/diva-5/about-diva-5/
- ASRS v1.1 kann laut NYU als elektronische Kopie genutzt werden, wenn Wortlaut erhalten bleibt und korrekt attribuiert wird: https://license.tov.med.nyu.edu/product/asrs6Qscreener
- Die nicht validierten Lernfragen erhalten keine diagnostischen Grenzwerte.
- NICE NG87/CG142: Screening allein begründet keine Diagnose.
- Eingaben verbleiben im flüchtigen Browserzustand. Das optionale JSON kann Freitextnotizen enthalten; vertraulich behandeln.
- App enthält ausschließlich Inhalte für Erwachsene.

## Technische Prüfung 2026-11-10
- JavaScript via dynamischem Syntaxcheck erfolgreich geparst.
- 9 logische Testfälle erfolgreich: Inhalte (6, 18 = 9+9, 12, 5), ASRS-Schwellen, unvollständige Auswertung, Zähler, HTML-Escaping.
- GitHub-Pages-Deployment nach Quellcodecommit erfolgreich; kein realer iOS-/Android-End-to-End-Test und keine Live-HTTP-Prüfung durchgeführt.
- Vor neuen Änderungen: Projektcode sichern, vorherige Auswertungsschwellen überprüfen, auf echten Endgeräten testen.

## Mögliche nächste Qualitätsstufe
- Accessibility-Audit mit echten Screenreadern und Tastaturnavigation.
- Browsertests auf iOS Safari, Android und Desktop, einschließlich Druck- und Exportszenarien.
- Professionelle Quellen- und Lizenzprüfung insbesondere für zusätzliche normierte Fragebögen.
- Erweiterung der Fallwerkstatt um strukturierte differentialdiagnostische Entscheidungswege.

## Eigenständiger ADHS-Übungstest (2026-11-10)

- Direktlink: [uebungstest.html](./uebungstest.html)
- Eigenständig formulierter Übungsfragebogen für **Erwachsene** (kein DIVA-5, ASRS, WURS-k oder validierter Screeningtest).
- 18 Themen aus den Bereichen Aufmerksamkeit/Organisation und Aktivität/Impulsivität, jeweils mit einer eigenen Frage für das Erwachsenenalter und einer retrospektiven Frage für die Zeit vor dem zwölften Geburtstag (36 Antworten).
- Fünf weitere Fragen zu den Auswirkungen auf Beruf, Haushalt, Beziehungen, soziale Kontakte sowie Freizeit/Selbstbild. Insgesamt 41 Antworten.
- Mehrseitige, mobilfreundliche Schrittfolge mit Zurück/Weiter, „Weiß ich nicht“, Fortschrittsanzeige und optionalen Beispielsnotizen.
- Automatische **rein beschreibende** Auswertung: Häufigkeiten der Antworten „oft“/„sehr oft“ nach Bereich und Lebensphase, unklare Antworten, Belastung pro Lebensbereich. Keine klinischen Cut-offs, Diagnosewahrscheinlichkeit oder Subtypen-Klassifikation.
- Druck-/PDF-Funktion über den Browser, freiwilliger JSON-Export, Kontrast- und Schriftanpassung, ein fiktiver Demo-Fall mit sichtbarer Kennzeichnung.
- Keine automatische Speicherung und kein Netzwerkversand persönlicher Antworten; nur externe Informationslinks werden durch aktives Anklicken geöffnet.
- Verlinkung aus der NeuroKompass-Startseite, Navigation und DIVA-5-Infoseite.
- Quelle für fachliche Diagnostikgrenzen: https://www.nice.org.uk/guidance/ng87/chapter/recommendations und für DIVA-5-Nutzungsbedingungen https://www.divacenter.eu/faq/.

### Technische Prüfung
- Browser-Skript syntaktisch geprüft, 18 Fragen in 2 Bereichen (9/9), 5 Beeinträchtigungsbereiche, insgesamt 41 Felder.
- GitHub Pages für spätere Releases prüfen; manueller Endgerätetest (echtes iPhone, Android, Desktop) noch ausstehend.

## Visualisiertes Lernen – 2026-11-10

### Neue Seite
- [visualisieren.html](./visualisieren.html) (öffentlicher Link: https://adrakir.github.io/Lernprogramme/adhs-audhs-erwachsene/visualisieren.html).
- Acht Lernstationen: Aufmerksamkeit (Reize ein-/ausblenden), Planung (Schrittfolge), Impulsivität (Impuls–Pause–Antwort), Sensorik (Reizregler), Entwicklung (Kindheit / Erwachsenenalter), AuDHS (zwei einzeln und gemeinsam untersuchte Bereiche), didaktischer Auswertungsvergleich (fiktive Balken) sowie ein Wissenstest mit vier Rückmeldungen.
- Fünf eigens gezeichnete und im Repo gespeicherte SVG-Vektorbilder: `assets/aufmerksamkeit.svg`, `assets/planung.svg`, `assets/impulsivitaet.svg`, `assets/reizverarbeitung.svg`, `assets/au-dhs.svg`. Keine Stockbilder, keine externe Bildbibliothek.
- Animationen über HTML/CSS/JavaScript ohne externes Skript und ohne Tracking. Für Bewegung gibt es einen Pausenknopf und `prefers-reduced-motion`-Unterstützung.
- Illustrationen mit Alternativtexten, reagierender mobilen Darstellung und Tastatur-freundlichen Steuerelementen.

### Integration
- `index.html`: neuer Navigationslink und Vorschaubereiche mit eigenen Illustrationen; Animationen aus den Bereichen Autismus, AuDHS, DIVA-5, Fallwerkstatt und Auswertung erreichbar.
- `uebungstest.html`: Illustrationen für Aufmerksamkeit, Hyperaktivität/Impulsivität und Alltagsauswirkungen werden abhängig vom aktuellen Fragebereich angezeigt. Direktlinks führen zur passenden Animation. Die 41 Antwortfelder, ihre Werte und die reine Lern-Auswertung bleiben unverändert.

### Verifikation
- Alle drei Inline-Skripte konnten syntaktisch interpretiert werden.
- Link- und Bildpfade anhand der GitHub-Dateien geprüft; fünf SVG-Dateien enthalten Bildtitel und Beschreibungen.
- 15 simulierte DOM-Laufzeittests für die visuellen Interaktionen bestanden; dies ist **kein** tatsächlicher Browser-, iOS- oder Android-Test.
- Inhaltliche Referenzen: https://www.nice.org.uk/guidance/ng87/chapter/recommendations und https://www.nice.org.uk/guidance/cg142/chapter/recommendations sowie https://www.divacenter.eu/diva-5/about-diva-5/.
- Keine medizinische oder diagnostische Aussage aus den Modellen ableiten.

### Offene Endgeräte-Checks
- iPhone Safari, Android (Chrome/Edge), Desktopbrowser inkl. Dark Mode, Screenreader, `prefers-reduced-motion` und browserseitige PDF-Druckausgabe manuell prüfen.

## Verbesserungsrunde – 10. November 2026 (Erwachsenen-App)

### 1. Freiwillige lokale Wiederaufnahme
- Haupt-App und `uebungstest.html` besitzen getrennte, ausdrücklich aktivierbare lokale Sicherungen (`localStorage`). Vor Einwilligung wird **nichts automatisch dauerhaft gespeichert**; der Speicherknopf zeigt den aktiven Zustand an.
- Die Sicherungen behalten Antworten, Notizen und (in der Haupt-App) ausdrücklich importierte Übungsdaten. Sie werden beim erneuten Laden nur dann wiederhergestellt, wenn die lokale Speicherung zuvor eingeschaltet wurde.
- Deaktivieren entfernt die gespeicherte Kopie. Zusätzlich existieren Löschknöpfe. Auf geteilten Geräten ist die Speicherung nicht empfohlen; browserseitiger Speicher ist nicht verschlüsselt.
- Export bleibt manuell, und passende JSON-Dateien können wieder importiert werden. Der Import prüft Struktur, Antwortbereiche, Zeichenzahl und Dateigröße (max. 256 KB) und lehnt fehlerhafte Dateien ab.

### 2. Getrennte gemeinsame Ergebnisübersicht
- Die Haupt-App akzeptiert den JSON-Export des 41-Antworten-Übungstests und zeigt Häufigkeiten für Erwachsen-/Kindheitsangaben und fünf Lebensbereiche **getrennt** von ASRS, Autismus, AQ-10 und dem eigenständigen Kriterien-Trainer.
- Kein validierter gemeinsamer ADHS-/AuDHS-Gesamtscore, keine automatische Diagnose. Übungsdaten sind als fiktiver Fall markiert, wenn sie im Übungsmodus erzeugt wurden.
- Haupt-App-JSON-Exporte können ebenfalls wieder eingelesen werden; ein neuer Export kann die importierten Übungsdaten und den bestätigten AQ-10-Originalwert enthalten. Auch der AQ-10-Wert bleibt beim Export-/Import-Rundlauf erhalten.

### 3. Erweiterte Fallarbeit
- [falltrainer.html](./falltrainer.html): sechs fiktive Erwachsenenfälle (Anna, Robert, Mira, Daniel, Samira, Leonie) mit drei Entscheidungen pro Fall = 18 didaktische Aufgaben.
- Zu jeder Entscheidung gibt es eine gezielte Hilfe und eine fachlich begründete Rückmeldung. Bearbeitungsstand, richtige Entscheidungen, Fallstatus, Ergebnisse und Druckansicht sind integriert.
- Separater direkt im Browser aufrufbarer Lehrkraftbereich mit Unterrichtsablauf, Reflexionsfragen und einem transparenten 8-Punkte-Bewertungsraster für Fallanalysen.
- Die Lernpunktzahl ist ausdrücklich **keine** ADHS-/Autismus-/AuDHS-Diagnostik.
- Kein Zwang, persönliche Gesundheitsangaben in einer Unterrichtssituation zu machen.

### 4. Lesbarkeit, Barrierefreiheit und Qualität
- Beschriftete Radiogruppen im Hauptformular; größere Schrift auch für Fragebeschriftungen und Hinweise; kontrastreiche Darstellung, responsive Navigation und Tastaturbedienung.
- Automatisierte Browserregression in [qa-browser.cjs](./qa-browser.cjs), GitHub Action `.github/workflows/adhs-audhs-browser-tests.yml` (Chromium, Ubuntu 24.04); 18 Szenarien inklusive Speichern, Import, Export, sämtlicher Fallentscheidungen und 390px-Mobilansicht.
- Diese Browser-Tests ersetzen keine manuelle Prüfung in iOS Safari, Android Chrome/Edge, mit VoiceOver/TalkBack oder gedrucktem PDF.
- Diagnoseverfahren bleiben nach Rechte- und Fachgrenzen getrennt; DIVA-5 wird nicht nachgebaut.

### Nächste manuelle Abnahme
1. Safari auf einem echten iPhone: Touch-Ziele, Radioauswahl und Dateiimport, Rückkehr aus dem Hintergrund.
2. Android Chrome/Edge: Kontrastwechsel, Tastatur, Schriftgröße, Import und Export.
3. Tastatur und Screenreader: Navigation, Beschriftung aller Bedienelemente, richtige Fokus-Reihenfolge, Feedbackansage.
4. Druck/als PDF speichern: Seitenumbrüche, Lesbarkeit und Vollständigkeit der Ergebnisübersichten.

### Letzte bestätigte Tests
- 18 von 18 Chromium-Browserszenarien erfolgreich; GitHub-Pages-Deployment erfolgreich (10.11.2026). Prüfprotokoll in der GitHub Action. Ein tatsächlicher Test auf iOS Safari und Android Chrome/Edge ist weiterhin offen.
