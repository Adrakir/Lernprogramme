# Bewertung MatheKompass (Oktober 2026)

Die Bewertung wurde aus drei Blickwinkeln vorgenommen. Danach wurden die
wichtigsten Mängel behoben.

## Sicht der Lehrkraft

Stärken
- Breite Abdeckung für Klasse 5: 12 Lernmodule, Kopftraining, Größen-Werkstatt,
  Diagnose, Thementests, Klassenarbeiten.
- Geführte Lernwege mit den Phasen Entdecken, Verstehen, Gemeinsam lösen,
  Selbst versuchen, Begründen.
- Die Lösungswege unterscheiden zwischen selbst gelöst und angesehen.

Mängel (behoben)
- Die zwölf Module hatten nur „Verstehen“ und „Üben“. Vertiefung, Modultest und
  Hilfen fehlten. Das passte nicht zur Größen-Werkstatt.
- Fachliche und sprachliche Fehler in den Aufgabengeneratoren:
  - Das Wechselgeld war immer von 20 €.
  - Bei der Multiplikation mit einer Ziffer zeigte die Lösung „5.950 · 0 = 0“.
  - Die Tipps zur Teilbarkeit verwiesen auch bei 10 auf die Quersumme.
  - Bei den Teileraufgaben waren die falschen Antworten offensichtlich (n+1, n+2).
  - Die Lösung beim Kürzen war rückwärts notiert.
  - Bei Dezimalzahlen und Brüchen fehlten die Lösungsschritte.
  - In den Lösungen fehlten Einheiten (m², dm³).
  - Bei zusammengesetzten Flächen waren beide Rechtecke gleich groß.
  - Geldbeträge standen als „5,5 €“.
  - Wenn zwei Werte gleich waren, lautete die Antwort „Unterschied 0“.
  - Grammatik: „1 Kinder“, „A und B und C“.
  - Große Zahlen standen ohne Tausenderpunkt.

Offen
- Es gibt viele überlappende Testformate: Tagestraining, Zusatzkurs, interaktive
  Tests, Thementests, Klassenarbeiten, Mission. Die Seitenleiste ist jetzt
  gegliedert. Eine inhaltliche Zusammenlegung sollte im Fachteam entschieden
  werden.

## Sicht der Schülerin / des Schülers

Mängel (behoben)
- Neue Nutzer bekamen als Empfehlung „schriftlich rechnen“. Jetzt beginnt die
  Empfehlung bei Modul 01. Danach schlägt sie das nächste offene Modul vor oder
  wiederholt ein unsicheres Thema.
- Auf dem Smartphone nahm der Kontrast-Knopf eine eigene Zeile ein, und die
  Reiter liefen über den Rand.
- Die Seitenleiste hatte rund 29 Einträge ohne Gliederung. Jetzt ist sie in
  Themen, Größen-Werkstatt, Üben & Prüfen und Nachschlagen aufgeteilt.

## Sicht des Entwicklers

Mängel (behoben)
- Es gab keine automatische Prüfung (CI). Neu ist `.github/workflows/mathe-tests.yml`.
  Der Workflow prüft die Typen, führt die Tests aus, baut die App und vergleicht
  das Ergebnis mit `MatheKompass.html`.
- Es gab keine Prüfung aller Aufgabengeneratoren. Neu ist ein dauerhafter Test
  für alle Themen, Aufgabentypen, Stufen und mehrere Startwerte. Er prüft auf
  NaN/undefined, ob die Lösung unter den Optionen ist und ob Tipps und Lösung
  vorhanden sind.
- Es gab keine Gesamtsicherung des Lernstands. Neu sind Export und Import aller
  `mathe-kompass*`-Schlüssel.

Offen
- Ein Teil des Quellcodes besteht aus sehr langen Zeilen und ist schwer zu warten.
- Das Bundle ist rund 1,2 MB groß. Es ist eine einzelne Offline-Datei; das ist
  so gewollt.
