# Bärlis Adventskalender – 24 Türchen (2026)

**GitHub-Bestand:** Majas Wortwerkstatt, `main` unter `majas-wortwerkstatt/`.  
**Öffentliche Adresse:** https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/#advent  
**Bearbeitungsstand:** 09.11.2026. Fachliche und automatische Browserabnahme sowie reale Gerätekontrolle getrennt dokumentieren.

## Kindererlebnis

- **24 abgeschlossene, eigene Bärli-Kurzgeschichten** als fortlaufender Dezemberbogen (Maja, Bärli, Fuji, Minka; Wichtel Tomke und Tumetott). Kleine Illustration/Motiv pro Türchen sowie Bärlis vorhandenes Bild. Jeder Tür-Geschichte folgt eine Überraschung und optional eine **dreifach auswählbare Deutschfrage**, für deren erste richtige Lösung es einen Bonus-Stern gibt.
- Auf Handys **6 Türchen je Seite** in 2 × 3, auf größeren Bildschirmen 3 × 2. Vier Kalenderseiten statt eines langen 24er-Gitters. Große Schaltflächen, Vor/Zurück, Bärlis Stimme über deutsche Computerstimme mit drei Geschwindigkeiten und Stopp.
- Der Kalender öffnet sich vom **1. bis 24. Dezember**; ein Türchen darf erst ab seinem Tag geöffnet werden, ältere Dezember-Türchen können nachgeholt werden. Vor dem Dezember gibt es eine **Geschichten-Vorschau ohne Geschenk**. Die aktuelle Geräteuhr ist maßgeblich; keine serverbasierte Zeitsperre erforderlich, weil alle Belohnungen rein virtuell sind.
- Geschenke sind virtuell, dauerhaft gespeichert und verursachen weder echte Bestellungen noch Zahlungen oder Versand. Auf dem Laptop heißt der **fiktive** Shop weiterhin „Bärli AG Osnabrück“.

## Geschenke pro Tag

| Tag | Geschichte | Geschenk | Ziel |
|---:|---|---|---|
| 1 | Die geheimnisvolle Sternenpost | Rote Weihnachtsmütze | Schrank |
| 2 | Ein weiches Wolkenkissen | Blaues Kissen | Baumhaus |
| 3 | Ein Regentag voller Spuren | Gelber Regenmantel | Schrank |
| 4 | Das Buch mit dem Knisterstern | Weihnachtsbuch | Baumhaus |
| 5 | Die Wichtelweste | Wichtel-Weste | Schrank |
| 6 | Ein Baum zum Nikolaustag | Weihnachtsbaum | Baumhaus |
| 7 | Das Geheimnis der Schneekugel | Schneekugel | Schrank |
| 8 | Bärlis rasante Nomenfahrt | Bärlis Nomen-Rallye, **Level 4** | Minispiel |
| 9 | Pfützenspringen im Dezember | Rote Gummistiefel | Schrank |
| 10 | Die erste Lichterkette | Weihnachtslichterkette | Baumhaus |
| 11 | Der festliche Schneetanz | Weihnachtskleid | Schrank |
| 12 | Das Nachttisch-Rätsel | Nachttisch | Baumhaus |
| 13 | Das Rentier mit der roten Nase | Rentierpullover | Schrank |
| 14 | Die Decke mit den Sternen | Weihnachtsbettwäsche | Baumhaus |
| 15 | Die kugelrunde Überraschung | Weihnachtskugeln | Schrank |
| 16 | Das Lied der vier Glöckchen | Musikspiel „Miau, Brumm & Klavier“, **Level 4** | Minispiel |
| 17 | Das Zimmer voller Sterne | Sterntapete | Baumhaus |
| 18 | Der Schal für den Schneemann | Grüner Winter-Schal | Schrank |
| 19 | Bärlis Bücherregal | Bücherregal | Baumhaus |
| 20 | Die verschwundenen Plätzchen | Teller mit Plätzchen | Schrank |
| 21 | Weihnachtsgrüße im Radio | Bärlis Radio | Baumhaus |
| 22 | Der Weg zur Sternenwolke | Wolkenwege, **Level 4** | Minispiel |
| 23 | Die geheimnisvolle Geschenkbox | Geschenkbox | Baumhaus |
| 24 | Das Licht im Baumhaus | Kamin mit Flammen | Baumhaus |

Alle Geschenk-IDs zeigen auf vorhandene Bestandskataloge; keine echten Warenkorbtransaktionen. Die 32+7 Saisonartikel und die bestehende Kleidung bleiben erhalten.

## Technische Umsetzung und Kompatibilität

- `baerli-advent.js`: 24 eigene Geschichten, Fragen, Datumsprüfung, Türchen-Navigation, Geschenklogik, Vorlesen, Bonus-Stern. `baerli-advent.css`: Bildkarten, responsives Türchenraster, große Bedienelemente, Textkarte und Startseitenbanner. Die Dateien dürfen bei einer anderen KI nicht mit einer früheren Home-Version überschrieben werden.
- `index.html`: Route `#advent`, Unterrouten `#advent/seite/1–4`, `#advent/tuer/1–24`, `#advent/vorschau`; freundlicher bebilderter Hinweis zusätzlich zur unveränderten 3+4-Startkartenübersicht, plus Links im Abenteuermodus und Bärli-Schrank.
- `majas-wortwerkstatt-advent-v1`: Neu, unter dem bereits exportierten Sicherungspräfix. `opened` und `answered` sind jahresbezogene Tags der Form `YYYY-12-DD`. Kein personenbezogenes Datum.
- **Schrankgeschenke:** im bestehenden `majas-wortwerkstatt-sternenbeutel-v1` als kostenlose `purchases['item:<id>']` gespeichert; bestehende Sterne bleiben unberührt. **Minispielgeschenke:** `purchases['level:<spiel>:<level>']` mit Preis 0. Wer das Level bereits besitzt, erhält stattdessen 2 Ersatzsterne. **Bettwäsche/Möbel:** `window.MajaTreehouse.gift(id)` schreibt einen `orders[id]=0`-Eintrag; `clean()` akzeptiert kostenlose Geschenke. Geschenke landen **zunächst in der Möbelkiste** und verändern nicht das anfangs leere Baumhaus. Die eigentliche Baumhaus-Freischaltung (erste Prüfung ≥80%) wird dadurch nicht umgangen.
- **Fragebelohnung:** `starWallet.rewards['advent:frage:YYYY-12-DD']={amount:1,...}`, nur nach richtiger Antwort. Belohnungen sind idempotent; ein bereits besessenes Türchen-Geschenk erzeugt höchstens einmal die 2 Ersatzsterne.
- Serviceworker cached Advent-JS/CSS separat; bei Änderungen an Bildern/Styles `?v` der Referenzen und den Cache-Namen erhöhen. Alte Schrankkäufe, Baumhausbestellungen, Prüfungsergebnisse und der bestehende Starwallet-Key bleiben unverändert.

## Abnahme

1. `node majas-wortwerkstatt/advent.test.cjs` prüft alle 24 Geschichten, Zuordnungen, 3 Minispiellevel, Speicher- und Routenschema.
2. `npx playwright test e2e/advent.spec.cjs` prüft in Chrome-Desktop/Tablet/Handyemulation die November-Vorschau, 1. Dezember Tür 1, Bonusstern, 6. Dezember Baumgeschenk bei noch gesperrtem Baumhaus, 8. Dezember Minispiel-Level, 24. Dezember letztes Geschenk und Wiederholungsfestigkeit. Screenshots liegen als GitHub-Actions-Artefakt `maja-advent-calendar-review`.
3. Zusätzlich komplette `npm run lint`, alle Node-Regressionen und Browser-Regressionen; Ergebnis und GitHub-Pages-Deployment anhand verifizierter Runs im `PROJECT_STATE.md` festhalten.
4. **Ausstehend:** echte Hörprobe mit Safari/iPhone/iPad/Android (Stimme, Stopp, Tempo), Sichtprüfung der Bildergeschichten und der Schrank-/Möbelkombinationen auf realen Geräten. Die Chromium-Emulation belegt diese Eigenschaften **nicht**.
