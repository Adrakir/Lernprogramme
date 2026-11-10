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
