# Prüfung aus Lehrer- und Schülersicht – 27.10.2026

Die Einschätzung beruht auf der fachlichen und didaktischen Durchsicht sowie Funktionsprüfungen. Sie ist kein Bericht über Tests mit einer echten Schulklasse.

| Sicht | Befund | Änderung |
|---|---|---|
| Lehrer | Die PDF-Aufgaben 11–18 waren kein zusammenhängender interaktiver Prüfungsversuch. | Neue Klassenarbeit mit allen 18 PDF-Aufgaben und gemeinsamer Abgabe. |
| Lehrer | Zeichnungen brauchen nachvollziehbare Kriterien. | Vier Kriterien für die vier Ansichten, sechs für das Gradnetz, eines für die Begründung. |
| Lehrer | Automatisch prüfbare Antworten und Zeichenleistungen müssen erkennbar bewertet werden. | 20 Teilpunkte für PDF 1–10, 34 weitere Teilpunkte für Beschriftungen/Zuordnungen; 11 Punkte aus der gemeinsamen Bewertungscheckliste. Keine automatische Schulnote. |
| Lehrer | Lösungen während der Bearbeitung beeinflussen die Leistung. | Musterlösungen, Rückmeldungen und Kriterien erscheinen nach bestätigter Abgabe. |
| Schüler | Mehrere Testeinstiege führten zu älteren Fassungen. | „Interaktive Klassenarbeit · 18 Aufgaben“ auf der Startseite und in der Testübersicht; ältere Tests unter aufklappbarem Bereich. |
| Schüler | Lange Seiten und fehlende Übersicht erschweren die Bearbeitung. | Eine Aufgabe pro Bildschirm, nummerierte Navigation und Liste offener Aufgaben vor der Abgabe. |
| Schüler | Zeichnen auf einem Touchgerät ist nicht immer einfach. | Zwei Stiftfarben, einzelne Striche zurücknehmen, große Flächen; Tastaturbeschreibung als gemeinsam zu bewertende Alternative. |
| Schüler | Unterbrechungen dürfen Antworten nicht verlieren. | Eigener gespeicherter Versuch mit Zeichnungen und Beschriftungen; Wiederaufnahme und bestätigter Neustart. |

## Fachliche Zuordnung

1–10: bisherige Wissens-, Ansichten-, Karten- und Atlasaufgaben. 11: Halbkugeln und Pole; 12: Erdviertel am Kreuz; 13: vier Zeichenfelder; 14: Halbkuppel, Pole, Mittelpunkt und Gradangaben; 15: drei Originalsätze mit fünf Lücken; 16: Draufsicht/Seitenansicht an Haus und Globus; 17: Breitenkreise, Meridiane und Schnittpunkt einzeichnen; 18: vier Viertelkugeln an einer Kugelzeichnung.

## Grenzen

Freihandzeichnungen und freie Begründungen werden anhand der Musterlösungen gemeinsam bewertet. Die Checkliste kann lokal von jedem Nutzer geöffnet werden und ist kein geschütztes schulisches Notensystem. Lernstände gelten für das Gerät und den Browser. Neue Inhalte ersetzen keine bereits heruntergeladene alte HTML-Datei.

## Ausgeführte Kontrollen

203 automatische Prüfungen, darunter vollständige und leere Klassenarbeit, Teilpunkte, falsche Richtungsangaben und gespeicherte Antworten/Zeichenpfade. Im Browser geprüft: Einstieg über die Startseite, Beschriftungen und Lückentext, Markieren mit Richtungstasten, Zeichenmarkierung und Rückgängig, Wiederaufnahme nach Neuladen, offene Aufgaben vor Abgabe, endgültige Abgabe, gesperrte Antworten und gemeinsame Bewertung mit drei Zuständen. In einer 375 Pixel breiten Ansicht hatte die Seite keinen seitlichen Überlauf; Zeichenfelder stehen untereinander. Ein echter Geräteversuch mit jedem iOS-/Android-Browser bleibt offen.

## Reparatur des vorhandenen Einstiegs

Der Einstieg bleibt `index.html`; der frühere datierte App-Link leitet nur noch dorthin. Ein reproduzierbarer Startabbruch bei gespeichertem Werkstattwert `null` ist abgefangen. Ein sichtbarer Starthinweis erläutert, wenn interaktive Inhalte nicht geladen wurden. Der defekte Lernheft-Link ist ersetzt und das vorhandene PDF in der Ein-Datei-App eingebettet. Die 18 Aufgaben und gültige Lernstände bleiben erhalten. Die genaue vom Nutzer geöffnete Datei bzw. Adresse ist weiterhin unbekannt; damit ist noch nicht nachgewiesen, dass sein konkreter Fehler dieselbe Ursache hatte.

Die identische App und alle vorhandenen PDFs wurden anschließend als private Website bereitgestellt: https://erdkunde-entdecker.node-opcua.chatgpt.site. Veröffentlichung erfolgreich bestätigt; der direkte Cloud-Browser-Aufruf zeigt erwartungsgemäß die ChatGPT-Anmeldung. Die Inhaltsprüfung erfolgte an der bytegleichen lokalen App. 235 automatische Prüfungen bestehen einschließlich Start mit ungültigen Speicherwerten, eingebettetem Lernheft und alter Linkweiterleitung. Das Mehrgeräte-Livequiz benötigt weiterhin den gesonderten Node.js-Server; die statische Bereitstellung betreibt diesen Server nicht.

## Didaktische Weiterentwicklung: Lösungen verstehen

**Aus Lehrersicht:** Zu jeder der 18 Aufgaben ist ein Lernziel sichtbar. Die Bearbeitungsphase enthält keine Lösungshilfe; Lösungswege werden erst nach endgültiger Abgabe freigegeben. Die Erklärung zerlegt räumliche und kartografische Handlungen in kleine Schritte. Die Teilpunkte bleiben nachvollziehbar; Zeichnungen und freie Begründungen werden weiterhin gemeinsam bewertet. Korrekte alternative Formulierungen und fachlich passende Zeichnungen zählen, nicht dekorative Gestaltung.

**Aus Schülersicht:** Jede Animation lässt sich selbst starten, pausieren, wiederholen und schrittweise lesen. Blau und Violett werden immer auch als Breite/N–S und Länge/O–W bezeichnet. Beim Wechsel der Perspektive bewegt sich die Kugelgeometrie. Die eigene abgegebene Antwort bleibt sichtbar. Eine neue Erklärfrage mit getrennt abrufbarer Vergleichsantwort schließt jeden Lösungsweg ab.

**Noch sinnvoll, hier nicht zusätzlich eingeführt:** eine zweite, fachlich gleichwertige Aufgabenvariante für einen späteren Abruf ohne vorherige Musterlösung; eine mit der Lehrkraft abgestimmte Auswahl nach Anforderungsbereichen; anschließend ein kleiner Praxistest mit Kindern zu Lesetempo, Touchbedienung und Missverständnissen. Ein funktionierender Bildschirmtest belegt noch keine Lernwirksamkeit im Unterricht.

## Abschlussprüfung am 27.10.2026

Die Linien werden jetzt wie der Perspektivwechsel über eine gemeinsame pausierbare Wiedergabe aufgebaut. Beim Öffnen einer Lösung steht das vollständige erste Bild still; Bewegung beginnt durch Abspielen oder einen gewählten Einzelschritt. Pause hält auch den Linienaufbau an, Fortsetzen übernimmt den erreichten Stand. Der Nordpol sitzt im Halbkuppelmodell auf der Oberfläche, der Südpol ist an der fortgesetzten Achse markiert.

Das sanfte Seitenscrollen ist in der Atlaswerkstatt ausgeschaltet. Dadurch bleiben Aufgabenwechsel nach langer Auswertung unmittelbar bedienbar. Browserprüfung: fünf schnelle Wechsel zwischen den Aufgaben 18, 9, 15, 17 und 14, alle jeweils mit einem Klick erfolgreich; Register bis Feld B3, Erdviertel, Halbkuppel, kompletter Lückentext und Zeichenlösung geprüft. Abgegebene Antworten und automatische Teilpunkte bleiben erhalten, manuelle Bewertung wird getrennt gespeichert.

590 automatische Prüfungen bestanden, einschließlich Pause/Fortsetzen für Linien und Kugelblick sowie Stop bei verborgenem Fenster und Verlassen des Bereichs. Prüfung in der Desktop-Browservorschau; kein neuer echter iOS-/Android-Gerätetest und kein Unterrichtsversuch.

## Bilder, Tipps und gezielte Rückmeldung in der interaktiven Klassenarbeit

Alle 18 Aufgaben wurden auf Arbeits- und Lösungsabbildungen geprüft. Zusätzliche Arbeitsmodelle zeigen Gradgrenzen ohne vorgegebene Endwerte, ein unbeschriftetes Erdviertelmodell sowie die Linienarten zum Lückentext. Das Register hat eine ergänzende Modellkarte. Nach Abgabe ist zu jeder Aufgabe eine vollständige bebilderte Lösung direkt geöffnet; die steuerbaren Animationen bleiben zusätzlich verfügbar. Zeichenlösungen zeigen jedes der vier beziehungsweise drei Felder einzeln.

Je Aufgabe gibt es zwei bewusst abrufbare Denkanstöße. Geöffnete Tipps bleiben im Versuch gespeichert und werden in der Auswertung vermerkt, ohne Punktabzug. Die Abgabe zeigt jede Teilantwort einschließlich ausgewählter Antworttexte, Kennzeichnung richtig/falsch/offen, richtiger Lösung und Teilpunkten. Unbeantwortete Aufgaben gelten als offen; Zeichnungen und Begründungen werden nicht automatisch als Fehler eingestuft. Die gemeinsame Bewertung aktualisiert Übersicht und Übungsempfehlung sofort.

Empfehlungen führen passend zur Aufgabe zu Globus, Erdvierteln, Ansichten, Kartenmarkierung, Register, Ortssuche, Lückentext oder Zeichnen. Ein Rückweg öffnet die unveränderte abgegebene Aufgabe. Mehrere Aufgaben desselben Übungsbereichs werden in der Gesamtübersicht zusammengefasst. Auf schmalen Ansichten werden Antwortvergleich und Übersicht als gestapelte Karten dargestellt.

717 automatische Prüfungen einschließlich Arbeits-/Lösungsbildern für alle 18 Aufgaben, Lösungssperre vor Abgabe, Hilfenspeicherung, Antworttexten, HTML-Escaping, korrekter Trennung manueller/offener Antworten und unveränderten 54 automatischen Punkten bestanden. Browserprüfung: Tipps, richtige/falsche/offene Antworten, Bilder, manuelle Bewertung und Empfehlung mit Rückweg erfolgreich. Kein echter Gerätetest oder Unterrichtsversuch.
