# Prüfung der Verständlichkeit – Rhythmuswerkstatt Version 43

## Prüfmaßstab
Zielgruppe: Schülerinnen und Schüler der 5. Klasse. Fachlich richtige Sätze allein reichen nicht: Für jeden der 27 Lernschritte muss erkennbar sein, **wann** ein Ton neu beginnt, **wie lange** er klingt, wann eine **Pause** liegt und wie die Zählzeiten verlaufen.

## Didaktische Schwachstellen der vorherigen Version
1. Lange Erklärungen zu Halten, Pausen und Zählzeiten waren ohne eine anschauliche mitlaufende Zeitspur schwer nachzuvollziehen.
2. Die Schüler mussten von einer Notengrafik selbst auf die Zählzeiten 1 – e – und – a schließen.
3. Lücken im Takt konnten mit tatsächlichen Pausen verwechselt werden.
4. Mehrere vorhandene Ton- und Notenbildsteuerungen waren gleichzeitig sichtbar; der Einstieg wurde dadurch unübersichtlich.
5. Die Generalpause erfordert eine gemeinsame Darstellung von Fuji und Minka: Die Stimmen sind gleichzeitig zu betrachten, nicht hintereinander.

## Im vorhandenen Lernweg umgesetzt
- **27 unterschiedliche kurze Anleitungen** mit Fokus auf je einen Fachbegriff und einen Mitmachauftrag. Die bisherigen ausführlichen drei Erklärschritte bleiben erhalten.
- In der Phase **Beispiel** erscheint **Fuji zeigt es dir – Schlag für Schlag verstehen**. Jeder Grundschlag ist anklickbar.
- Vier Teilzeiten pro Schlag ermöglichen auch gemischte Sechzehntel-/Achtelfolgen. Die Legende unterscheidet **neuer Ton (●)**, **halten (━)**, **Stille (–)** und **noch fehlende Notenwerte (?)**.
- **Vorheriger/Nächster Schlag**, **Mit Ton abspielen** und **Stopp**; mitlaufende Hervorhebung während der WAV-Wiedergabe, erklärender Rückmeldungstext. Der Film verändert keinen Lernstand.
- Bei **Generalpause** stehen Fuji und Minka in zwei gleichzeitig sichtbaren Zeilen. Das Klangbeispiel gibt den gemeinsamen Zeitablauf korrekt wieder.
- Beim **Abschlussstück** werden vier vollständige Takte angezeigt; bei den **Taktstrichen** zwei Takte.
- Bei **Taktlücken** werden graue Felder ausdrücklich *nicht* als Pausen ausgegeben. Schüler sollen zuerst die fehlende Dauer berechnen.
- Die alte Notenbild-, Puls- und Tempofunktion ist unter **Weitere Hörmöglichkeiten** ausklappbar statt doppelt gleichberechtigt angezeigt.
- Große Bedienflächen, Umbruch auf 320/390 Pixeln, Tastaturbedienung über native Schaltflächen, sichtbarer Fokus und Abschaltung unnötiger Übergänge bei `prefers-reduced-motion`.

## Fachlich differenzierte Beispielsituationen
- Ganze/halbe Viertelnoten: Startpunkt gegen gehaltenen Klang.
- Achtel/Sechzehntel: 1 und bzw. 1 e und a; die Grundschläge bleiben erhalten.
- Brot, Käse, Schokolade, Ananas: 1/2/4/3 Tonanfänge pro Wortgruppe, bei Ananas zwei Sechzehntel und eine Achtel.
- Viertel-, Achtel-, Sechzehntel-, halbe und Ganztaktpause: fehlende Tonanfänge als echte Stille unterscheiden.
- 3/4 und 4/4: vorhandene Dauer und Sollwert gegenüberstellen.
- Punktierte halbe, Viertel- und Achtelnoten: Grundwert plus Hälfte; korrekte Wiedereinsatzstelle.
- Fehler- und Lückenaufgaben: absichtlich unvollständige Folge gegen vollständigen Takt abgrenzen.

## Verifizierte automatische Prüfungen
[Erfolgreicher GitHub-Actions-Test 41071483416](https://github.com/Adrakir/Lernprogramme/actions/runs/41071483416)

- 1.147 fachliche Assertions, darunter 216 Fragen und 151 Notenbilder.
- **27 von 27** animierten Einheiten mit eigenen Erklärungen, gültigen Taktzellen und zugänglichen Schaltflächen geprüft.
- 2.844 Regressionstest-Assertions zu allen Lernwegen und Fragen.
- **89 Chromium-Browsertests** auf 320, 390 und 1366 Pixeln einschließlich Schrittwechsel, Tonerzeugung, Generalpause und Bildschirmüberlauf.
- Offline-Test bestanden. Beide PDF-Hefte mit 42 bzw. 71 Seiten und vollständig auslesbarem Text geprüft.
- Eigene Tests unter `tests/film-check.cjs` und erweiterte `tests/browser-check.cjs`, als Teil der regulären CI.

## Grenzen
Eine automatische Prüfung kann nicht beweisen, dass jedes Kind jeden Satz versteht. Eine reale Erprobung mit Schülerinnen und Schülern und einer Musiklehrkraft, insbesondere auf iPhone Safari, ist weiterhin wichtig. Die Wahrnehmung des Klangs und die Bedienung per VoiceOver sind nicht durch den Chromium-Lauf allein abgedeckt. Die PDF-Grafiken wurden nicht vollständig Seite für Seite visuell begutachtet.
