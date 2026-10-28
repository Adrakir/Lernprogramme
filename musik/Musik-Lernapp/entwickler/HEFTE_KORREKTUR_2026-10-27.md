# Musikhefte: fachliche und didaktische Korrektur

Die vorhandenen Dateien `documents/lernheft-musik.pdf` und
`documents/arbeitsheft-musik.pdf` wurden überarbeitet. Es bleibt bei 42 bzw.
71 Seiten, 34 Erklärthemen und 27 Lernschritten mit 81 Aufgaben.

## Gefundene Probleme und Änderungen

| Stelle | Änderung |
| --- | --- |
| Arbeitsheft, Schreibflächen | 97 Antwortlinien sind jetzt beschriftet, kürzer und gestrichelt. Sie stehen weiter unter dem Notenbild und wirken nicht mehr wie eine sechste Notenlinie. |
| Notenbilder in beiden Heften | Die Linien von 152 vorhandenen Notensystemen sind dunkler. Die fünf Linien bleiben gleichmäßig angeordnet. |
| Lernheft S. 6 | Linien und Zwischenräume von unten gezählt; Notenköpfe auf Linie 2 und in Zwischenraum 2 eindeutig zugeordnet. Hilfslinien werden direkt unter bzw. über einem vollständigen System gezeigt. Lage und Notenwert sind sprachlich getrennt. |
| Arbeitsheft S. 33-34, Lösung S. 65 | Beschriftetes Modell, genaue Bildaufgabe und passende Bildlösung ergänzt. In G liegt Kopf A auf Linie 2 und Kopf B im vierten Zwischenraum. In B werden Liniennummern tatsächlich eingetragen. |
| Lernheft S. 17 | Halbe Pause im 4/4-Takt auf 3 und 4; zwei Viertelnoten auf 1 und 2. Neue Notation, Zeitspur und Erklärung stimmen überein. Die Teilung bei Stille auf 2 und 3 wird erklärt. |
| Arbeitsheft S. 4 | Stille auf 2 und 3 durch zwei Viertelpausen dargestellt. Die Aufgabenstellung und Lösung bleiben zutreffend. |
| Arbeitsheft S. 23, 26-27 und 32; Lösungen S. 64 | Zusammenhängende Beispielreihe für die halbe Pause auf 3 und 4; Tonanfänge auf 1 und 2. Aufgaben, Lerncheck und Lösungen angepasst. Ganze und halbe Pause im Fünfliniensystem gegenübergestellt. |
| Arbeitsheft S. 20 | Singular in der Wertetafel berichtigt: ein Schlag, ein halber Schlag, ein Viertel eines Schlags. |
| Beide PDFs | Korrekturdatum in der Fußzeile. Inhaltsverweise und Seitenzahlen erhalten; betroffener Rücksprung von S. 65 auf S. 34 wieder eingesetzt. |
| App | Links zu den vorhandenen PDFs mit neuem Versionsparameter; eigener aktueller PDF-Cache. Bereits offline gespeicherte Hefte werden bei der Service-Worker-Aktualisierung nach Möglichkeit neu geladen. |

## Fachliche Grundlagen

- [ChorVerband NRW: D1 - Notenschrift](https://www.cvnrw.de/fileadmin/user_upload/dokumente/d-massnahmen/D1-Notenschrift.pdf), insbesondere fünf Linien, Zählrichtung, Hilfslinien, Noten- und Pausenwerte.
- [Johann-Andreas-Schmeller-Gymnasium: Grundwissen Musik](https://www.jas-gymnasium.de/fileadmin/user_upload/documents/eltern_schuelerservice/grundwissen/musik/GrundwissenMusik.pdf), Notenwerte, Pausenwerte, Punktierung und Takt.
- [LilyPond: Writing rests](https://lilypond.org/doc/v2.27/Documentation/notation/writing-rests.html), feste Pausenwerte und mittige Ganztaktpause.

Die Rechnungen im Heft beziehen sich auf Viertelschläge in 3/4 und 4/4.
Die Notenbilder behandeln Rhythmus; Tonhöhen werden ohne Schlüssel nicht benannt.
Die Pausengruppierung hält die Gliederung des 4/4-Takts sichtbar.

## Prüfung

- Alle 113 finalen PDF-Seiten gerendert und in Gesamtansichten geprüft; geänderte Fachgrafiken zusätzlich groß angesehen.
- Unveränderte Seitenzahlen und 81 Aufgaben überprüft; 10 PDF-Verweise im Lernheft und 61 im Arbeitsheft vorhanden.
- Textpositionen auf Seitenbegrenzungen und neue Textblöcke auf ausreichenden Platz geprüft.
- Geänderte Pausenfolgen gegen die zugehörigen Lösungen geprüft.
- JavaScript-Syntax von `documents.js`, `contents.js` und `sw.js` geprüft.
- Offline-Aktualisierung mit vorhandenem altem PDF-Cache sowie Range-Abruf der neuen PDF im Node-Test geprüft.

## Reproduzierbar bearbeiten

`python musik/Musik-Lernapp/entwickler/korrigiere-hefte.py` im Git-Checkout
liest den ursprünglichen Stand `2d7bbb18548e4f96e5498c47e13e568b11a31d7c`.
Benötigt werden Python, PyMuPDF, reportlab und DejaVu Sans im üblichen
Linux-Schriftverzeichnis. Alternativ gibt `--quellen ORDNER` zwei originale,
unveränderte Ausgangs-PDFs vor. Die bearbeiteten Dateien werden an ihren
bisherigen Pfaden geschrieben. Das Skript ist für genau diese Ausgangsfassung
ausgelegt und soll nicht auf spätere redaktionell geänderte Fassungen angewandt werden.
