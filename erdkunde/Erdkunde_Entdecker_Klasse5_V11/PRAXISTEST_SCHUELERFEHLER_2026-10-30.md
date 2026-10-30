# Erdkunde-Entdecker: Systematischer Praxistest mit simulierten Schülerantworten

**Stand:** 30.10.2026  
**Projekt:** Adrakir/Lernprogramme, bestehende App `erdkunde/Erdkunde_Entdecker_Klasse5_V11/index.html`  
**Testtyp:** Reproduzierbare Node.js-Tests und Chromium-Browser-Smoke-Tests. **Keine Untersuchung mit echten Kindern**, kein echter iOS-/Android-Hardwaretest.

## Geprüfte Kompetenzbereiche

| Bereich | Typisches Missverständnis | Gewünschte Rückmeldung | Nachgewiesener Ablauf |
|---|---|---|---|
| Gradnetz | Breite und Länge vertauscht | N/S ist Breite; O/W ist Länge; zuerst Breite | Diagnose, Schrittfolge, freiwillige Verstehensfrage |
| Gradnetz | Breite richtig, Länge falsch | Korrekte Teilleistung würdigen; O/W am Nullmeridian erklären | Diagnose und Kontrolle mit richtiger und falscher Auswahl |
| Gradnetz | Länge richtig, Breite falsch | Korrekte Teilleistung würdigen; N/S am Äquator erklären | Diagnose und Kontrolle |
| Kompass | Bildschirmoberkante ist fälschlich Norden | Roten Nordpfeil lesen, Karte gedanklich drehen | Alle sechs Kompassaufgaben mit richtiger und falscher Auswahl |
| Atlas | Gleichnamige Orte werden verwechselt | Ortsname und Bundesland vergleichen | Alle sechs Registeraufgaben mit beiden Antworttypen |
| Atlas | Richtiges Register, falsches Planquadrat | Buchstabe = Spalte, Zahl = Zeile | Gezielter Test der Fehlerursache |
| Bedienung | Schüler lässt Eingabe leer | Erst zur Eingabe auffordern, keine Lösung verraten | Leere Antwort und nachträgliche Bearbeitung |
| Lernen | Fehler trotz Erklärung wiederholt | Verständnisfrage mit zweiter Chance | Erst falsche, danach richtige Verstehensantwort |
| Diagnose | Fehlerauswertung wechselt den Bereich | Vorherigen Testwert nicht überschreiben; passende Schulung öffnen | Prüfung der drei Lernweg-Ziele |

## Automatisierte Ergebnisse

- `entwickler/praxis-schuelerfehler.test.cjs`: **185 Prüfungen erfolgreich**, darunter 18 korrekte und 18 absichtlich falsche Praxislösungen sowie 36 Verstehensfragenabläufe.
- `entwickler/pruefungsfit.test.cjs`: 260 Prüfungen erfolgreich.
- `entwickler/atlas-schulung.test.cjs`: 128 Prüfungen erfolgreich.
- `entwickler/atlaswerkstatt.test.cjs`: 727 Prüfungen erfolgreich.
- Weitere Prüfung der Praxisstationen sowie reproduzierbarer Ein-Datei-Build erfolgreich.
- `entwickler/browser-smoke.test.cjs`: Chromium mit 1280 × 850 und 390 × 844 px bestanden: Start, kompakte Navigation, Prüfungsfit, Geowerkstatt, falsche Antwort, zweiter Versuch einer Verstehensfrage, Kompass, Atlas, horizontales Layout, keine ungefangenen JavaScript-Fehler.
- Erfolgreicher GitHub-Actions-Lauf: https://github.com/Adrakir/Lernprogramme/actions/runs/40995819390
- Erfolgreicher GitHub-Pages-Deployment-Lauf: https://github.com/Adrakir/Lernprogramme/actions/runs/40995819303

## Umsetzung

Bei falschen Antworten zeigt Gustav jetzt die plausibelste Fehlerursache und einen Lösungsweg. Eine zusätzliche, freiwillige Konzeptfrage macht die Lernrückmeldung überprüfbar. Ein falscher Konzeptversuch erlaubt eine neue Auswahl; der ursprüngliche Aufgabenscore bleibt unverändert. Die Ergebnisansicht unterscheidet geklärte und offene Verstehensfragen und bietet den passenden Prüfungsfit-Lernweg an.

## Fachliche Einschränkungen

Ein bestandener automatisierter Test ist **kein Beleg für pädagogische Wirksamkeit**. Die Fehlerdiagnose identifiziert auf Grundlage der gewählten Antwort *mögliche* Denkfehler; die tatsächlichen Gedanken eines Kindes sind nicht beobachtbar. Die Verstehensfrage prüft vor allem die Regelkenntnis nach Erklärung, nicht langfristigen Transfer auf neue Karten. Die Simulation ersetzt weder echte Lernende noch Sprachverständlichkeit, Touch-Usability, Screenreader und Vorlesestimmen auf Endgeräten.

## Empfohlener echter Schüler-Praxistest (noch nicht durchgeführt)

1. Mit 4–6 Lernenden der 5. Klasse je eine Gradnetz-, Kompass- und Registeraufgabe **ohne Tipp** lösen lassen. Vor der Korrektur kurz fragen: „Wie bist du vorgegangen?“
2. Bei einem Fehler Gustavs Lösung zeigen, danach den freiwilligen Verstehenscheck und eine **neue** Aufgabe ohne Hilfe bearbeiten lassen.
3. Als Lehrkraft je Lernenden notieren: verstandener Auftrag, selbstständig begonnen, richtige Begründung, Hilfe benötigt, Touch-/Leseschwierigkeiten, Bedarf an erneuter Übung.
4. Gleiche Aufgaben auf mindestens einem echten iPhone, einem Android-Gerät und einem Desktop-Browser prüfen; gegebenenfalls Sprachsteuerung und reduzierte Bewegung testen.
5. Rückmeldungen in konkret belegte Fehlermeldungen und Verbesserungen überführen. Keine persönliche Schülerdaten in GitHub speichern.

**Abnahmekriterium für didaktische Reife:** Die große Mehrheit kann nach der Erklärung eine vergleichbare, aber neue Aufgabe ohne Lösungsbild bearbeiten und ihre Entscheidung mit Breite/Länge, Nordpfeil oder Registereintrag begründen. Dieses Kriterium ist noch nicht anhand echter Lernender geprüft.
