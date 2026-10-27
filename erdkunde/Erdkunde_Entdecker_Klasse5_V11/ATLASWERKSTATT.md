# Gradnetz- und Atlaswerkstatt · verbessert am 26.10.2026

Start über `index.html` und **Gradnetz & Atlas**. Die Ein-Datei-App enthält die Lernmodelle, Küstenkonturen, Druck-PDFs und alle 20 Ortsdaten. Die neuen Funktionen benötigen keine externen Laufzeitdienste.

## Die sieben umgesetzten Verbesserungen

1. **Selbst Punkte markieren.** Auf der Welt- oder Regionalkarte antippen, den gewählten Punkt mit Richtungstasten oder den Pfeiltasten im fokussierten Kartenbereich verschieben und prüfen. Ortsnamen und Lösungslinien bleiben zunächst verborgen. Ablesetoleranz: 1° auf Regionalkarten, 3° auf der Weltkarte; beim Testpunkt 1°. Ein Grad entspricht dabei keiner überall gleichen Entfernung in Kilometern.
2. **20 echte Orte in allen vier Erdvierteln.** Drei Sucharten mit jeweils 20 Ortsaufgaben und 20 Aufgaben zum Markieren. Quellen sind bei jedem Ort verlinkt, Ortslagen auf 0,1° gerundet. Die Auswahl enthält Prag, Lissabon, San Francisco, Alice Springs, Berlin, Paris, London, Rom, Kairo, Tokio, New York, Mexiko-Stadt, Rio de Janeiro, Buenos Aires, Santiago, Sydney, Kapstadt, Wellington, Frankfurt am Main und Frankfurt (Oder).
3. **Abrufbare Hilfen.** Im Selbstübungsmodus beginnen Ortsaufgaben ohne Lösungslinien. Tipps führen von Erdviertel und Karte über Breite und Länge zur ausdrücklich angeforderten Lösung. Geführter Suchweg und Animation bleiben gesondert verfügbar. Beim Lückentext sind die erklärenden Bilder anfangs geschlossen. Geöffnete Hilfen werden in der Übungsstatistik berücksichtigt; eine angezeigte Musterlösung gilt nicht als selbstständig gelöste Aufgabe.
4. **Gezielte Fehlerrückmeldungen.** Die Punktprüfung unterscheidet vertauschte Koordinaten, falsche Nord-/Süd- bzw. Ost-/Westlage, passende Breite bei falscher Länge, passende Länge bei falscher Breite und unpassende Kartenauswahl. Bei einer fehlenden Koordinate wird auch erkannt, wenn die bereits gegebene Koordinate noch einmal eingetragen wurde. Dezimalkomma und gültige Richtungsangaben werden geprüft.
5. **Realistischere Registerarbeit.** Alphabetisches, durchsuchbares Modellregister mit 20 Orten, Land, Region, Kartenverweis und Planquadrat. Sechs Aufgaben erfordern die Wahl von Eintrag, Karte und Suchfeld. Frankfurt am Main und Frankfurt (Oder) zeigen, warum die Region wichtig ist. Planquadrate werden auf der ausgewählten Karte eingeblendet. Modell-Kartenkennzeichen ersetzen keine echten Atlasseiten; Seitenzahlen hängen von der Ausgabe ab.
6. **Vier klare Lernschritte und Zoom.** Verstehen → Selbst üben → Atlas benutzen → Abschlusstest. Die bisherige Hauptnavigation ist auf fünf häufige Bereiche begrenzt; die übrigen Bereiche bleiben unter „Weitere App-Bereiche“ erreichbar. Karten und Globus lassen sich mit + / − vergrößern und seitlich verschieben. Tastaturbedienung, große Bedienelemente, Farbkontrast und reduzierte Bewegung werden berücksichtigt.
7. **Abschlusstest und Druckdateien.** Zehn mehrteilige Aufgaben mit insgesamt 20 Punkten: Grundlagen, Erdviertel, Ansichten, Kartenarbeit und Atlasarbeit zählen je vier Punkte. Richtige Teilantworten werden einzeln gewertet. Ein eigener Kartenpunkt, das Ablesen eines Punktes und zwei unterscheidbare Frankfurt-Einträge prüfen die Anwendung. Eine Aufgabe pro Bildschirm, nummerierte Navigation und lokal zwischengespeicherte Antworten erleichtern das Bearbeiten. Nach Abgabe bleibt der Versuch unverändert; Auswertung und Musterlösungen zeigen Teilpunkte und passende Übungsbereiche. Ein neuer Versuch benötigt bei vorhandenen Antworten eine Bestätigung. Die Farb-PDFs umfassen neun Aufgabenseiten und acht Lösungsseiten und sind in der Ein-Datei-App eingebettet. Die freie Begründung zur letzten Aufgabe wird bewusst nicht automatisch benotet. Die Auswertung dient als Lernhinweis und vergibt keine Schulnote.

Die bisherigen acht Erdviertelaufgaben, vier Blickzuordnungen und fünf Lücken bleiben enthalten. Bestehende Werkstatt-Erfolge bleiben erhalten. Versuche und Hilfen werden pro Bereich lokal gespeichert; Wiederholungen zählen als weitere Versuche. Der Werkstatt-Reset betrifft nur die Werkstattdaten.

## Fachliche Hinweise

Breitenkreise verlaufen parallel zum Äquator. Ein Meridian ist ein Halbkreis von Pol zu Pol; zwei gegenüberliegende Meridiane bilden einen ganzen Längenkreis. Äquator, Nullmeridian und 180°-Meridian sind Grenzen zwischen Erdvierteln. Am Pol gibt es keine eindeutige östliche oder westliche Länge. Die Datumsgrenze verläuft nur ungefähr am 180°-Meridian.

Ein Ortsname plus ein Grad führt über das Ortsregister zur Karte; der fehlende Grad wird abgelesen. Ein einzelner Grad ohne weitere Ortsinformation legt normalerweise keinen eindeutigen Punkt fest. Die Ortsdaten sind gerundete Referenzpunkte, keine exakten Adressen. Die kleinen Koordinatenabweichungen aus den Unterrichtsskizzen werden in den Ortsbeispielen nicht als exakte Städteposition ausgegeben.

## Quellen und Lizenzen

- NOAA: https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html
- NOAA, Nullmeridian/180°/Datumsgrenze: https://oceanservice.noaa.gov/facts/longitude.html
- GeoNames, CC BY 4.0: vollständige Einzelquellen stehen in `entwickler/atlasdaten.js` und im Quellenbereich der App. Die 16 neu ergänzten Orte wurden am 26.10.2026 anhand dieser Einträge überprüft.
- Alice Springs: Place Names Register, Northern Territory Government: https://www.ntlis.nt.gov.au/placenames/print_extract.jsp?id=22272
- Küstenkonturen: Natural Earth, Public Domain. Grafiken und Lernkarten sind eigene Modelle; keine Verlagskarten werden kopiert.

## Entwicklung und Prüfung

- `python entwickler/build-atlas-pdf.py`: erzeugt die beiden PDFs und die eingebetteten Druckdateien. Benötigt ReportLab und die im Skript angegebenen DejaVu-Schriften.
- `node entwickler/build-offline.js`: erzeugt `index.html` mit allen eingebetteten Abhängigkeiten.
- `node entwickler/atlaswerkstatt.test.cjs`: prüft Koordinaten, Richtungen, Vertauschungen, Projektion, 20 Ortslagen, Registerfelder, Lücken, zehn Testaufgaben, Teilpunkte, Fehlrichtungen, Ablesetoleranzen, Registerfelder und lokale Ressourcen.

Die Ergänzungen wurden im Browser durchgespielt; die Druck-PDFs wurden gerendert und visuell geprüft. Eine schmale Browseransicht ersetzt keinen Test auf jedem echten iOS-/Android-Gerät. Der Offline-Cache im Entwickler-Modus verwendet einen eigenen Cache-Namensraum und entfernt keine Caches anderer Lernapps.

Die zuvor fehlenden V11-Startdateien wurden aus dem vorhandenen vollständigen Paket ergänzt. Bereits im Repository vorhandene neuere Ansichten-, Kartenexpeditions- und OSM-Dateien bleiben erhalten.

## Zeichenteil nach den Unterrichtsskizzen (27.10.2026)

Teil B ergänzt die Aufgaben 11–15: Gradnetz und beschriftete Halbkugeln, die vier Erdviertel, die Vier-Felder-Zeichnung (Breitenkreise/Meridiane jeweils vom Äquator und vom Pol), ein Halbkugel mit Nordpol, Südpol, Äquator, Erdmittelpunkt und 0°/90° und die fünf Lücken aus der Vorlage. In der App kann mit Maus, Finger oder Stift gezeichnet werden; Tastaturtexte sind als Alternative möglich. Striche lassen sich einzeln zurücknehmen. Zeichnungen und Texte werden getrennt vom bestehenden Testversuch lokal gespeichert. Lösungen werden erst auf ausdrücklichen Wunsch geöffnet. Es gibt keine automatische Zeichenbewertung: Teil A zählt weiter 20 Punkte, Teil B wird gemeinsam anhand der Musterlösung geprüft. Im Druck-PDF stehen die gleichen Aufgaben auf den Seiten 4–6.

## Abgleich mit den vier Originalfotos

Die beschrifteten Erklärbilder sind nun direkt beim Öffnen der Werkstatt sichtbar, unter „Deine Unterrichtsskizzen“. Sie folgen der Anordnung auf den Fotos: waagerechte Teilung in Nord-/Südhalbkugel; auseinandergezogene West-/Osthälfte mit Nullmeridian dazwischen; Nord- und Südpol; Breiten- und Längenkreise; Erdviertelkreuz; vier Ansichten; Halbkugel mit Achse bis zum Südpol und Erdmittelpunkt. Die Ergänzung eines 45°-Winkels wurde entfernt. Die linke Äquatorseite ist fachlich korrekt mit 0° Breite bezeichnet.

Der Übungs- und Testlückentext verwendet wieder die drei Sätze der Vorlage, einschließlich „Die Längenkreise verlaufen vom ... zum ...“. Ein eigener Hinweis erläutert Meridian/Längenhalbkreis. Acht nummerierte Beschriftungsfelder im Test ersetzen die vorherigen leeren Halbkugelkreise. App und PDF werden aus denselben Vektormodellen in atlasdaten.js erzeugt; so bleiben Beschriftungen und Formen abgestimmt.

## PDF-Zusatzblätter: Draufsicht, Linien und Viertelkugeln

Die Seiten 7–9 ergänzen Ansichten desselben Hauses und des Globus, drei große freie Kugeln zum Einzeichnen der Linien sowie eine farbige Kugelzeichnung zum Beschriften der vier Erdviertel. Die Lösungen stehen auf den Seiten 6–8 der Lösungsdatei. Die vorderen Seiten mit Originalskizzen und Lückentext bleiben enthalten. Zusatzaufgaben 16–18 werden anhand der Musterlösung geprüft und sind nicht Teil der automatisch bewerteten 20 Punkte. Die Vorderansicht erläutert ausdrücklich, dass sich die Erdviertel auf der Rückseite fortsetzen und der 180°-Meridian dort die zweite Ost-/Westgrenze bildet.
