# Chemie-Entdeckerlabor – Quellen und Offline-Ausgabe

Die bestehende öffentliche Einstiegsseite bleibt `../Chemie_Entdeckerlabor_V7_2.html`. Die Datei wird aus `template.html`, den CSS-/JS-Modulen und `manifest.json` gebaut. Keine Quellenänderung nur in der generierten HTML-Datei vornehmen.

```sh
node build-offline.cjs
node build-offline.cjs --check
```

Die Ausgabe enthält weiterhin alle Medien und Skripte inline und funktioniert ohne externe Bibliotheken oder Internetzugang. Die Quelldateien dürfen wegen gemeinsam genutzter globaler Funktionen nicht beliebig umsortiert werden; `manifest.json` hält die Reihenfolge fest.

`core.js` besitzt die zentrale Funktion `navigate()`. Module registrieren Aufräum- und Zeichenfunktionen über `ChemistryNavigation.onEnter()` und `.onLeave()`. Sie ersetzen `navigate()` nicht.

Neue Benutzerzustände werden zusätzlich in der Liste `NATIVE` in `learning-cockpit.js` registriert, damit Profilwechsel und vorhandene Sicherungen die Daten mitführen. Bestehende Speicherschlüssel bleiben erhalten. Freie Antworten werden nicht maschinell nach Schlüsselwörtern benotet: Kriterienbewertungen sind als Selbsteinschätzung gekennzeichnet.

GitHub Actions prüft den reproduzierbaren Build sowie Chromium, Firefox und WebKit. PDF-Ausgaben und gerenderte Seiten werden als Prüfarbeitsdateien im Workflow-Artefakt abgelegt. WebKit ist ein wichtiger Kompatibilitätscheck, ersetzt jedoch keinen abschließenden Test auf einem echten iPad.

## Forscherlabor: Lösen, Sieden und Flammen

Über **Forscherlabor → Teilchenkino** sind die Wasser-, Salz- und Zuckeranimationen erreichbar. Ein hervorgehobener Direktzugang oben im Bereich **Löslichkeit** öffnet ebenfalls gezielt diese Station, auch wenn vorher ein anderer Forscherlabor-Reiter aktiv war. Der Temperaturregler bietet 20–60 °C in Einerschritten sowie Direktknöpfe für 20, 40 und 60 °C. Die Löslichkeitswerte zwischen den bisherigen Stützstellen werden linear interpoliert; die Stützstellen und Speicherschlüssel bleiben unverändert. Gut sichtbarer Vergleich: 500 g Zucker in 200 ml Wasser bei 20 °C bzw. 60 °C.

Unter den ersten beiden Denkaufträgen stehen aufklappbare Bild-Erklärungen: Löffelmassen mit Waagen als ausdrücklich erfundenes Rechenbeispiel und zwei Heizkurven mit gleichem Siedeplateau. Das Siedelabor erklärt Start, Einzelschritte und den Neustart bei einem Einstellungswechsel. Die Diagrammachse ist ausdrücklich ungefüllt.

Im **Flammenforscher** steuert ein Luftregler die animierte Überblendung der gelben und blauen Flammenmodelle. Die bisherigen beiden Auswahlknöpfe stellen die Endpunkte ein. Die Prozentanzeige ist nur eine Modell-Reglerstellung, keine Messung.

`node tests/deep-stations-smoke.cjs` (vom übergeordneten Chemie-Ordner aus, mit installiertem Playwright im Modul-Suchpfad) prüft diese Funktionen auf Desktop- und Smartphone-Breite. Der Test läuft auch in `tests/run-suite.cjs`.

Unter Denkauftrag 3 erklärt eine aufklappbare Bildfolge die Flammenzonen; im Flammenbild markiert ein pulsierender Ring die gewählte Zone. **Labor aufbauen** hat zehn Gerätemissionen: Beim Messzylinder wählt man zusätzlich aus 10, 50, 100, 250 und 500 ml die passende Größe. Neu sind Teelicht, Holzstab, Wachsstücke mit animiertem Wärmeleitungsversuch (Kupfer, Eisen, Holz) und Trichter mit Filterpapier. Denkauftrag 4 wertet den Wärmeleitungsversuch aus.

## Siedetemperatur: Wasser und Alkohol

Direkt unter der Überschrift der Seite **Siedetemperatur** steht ein interaktiver Vergleich. Er zeigt Ethanol mit ca. 78 °C und Wasser mit ca. 100 °C. Ein Temperaturregler steuert zwei Bechergläser mit Thermometern, Dampfblasen und Verdunstung sowie eine Doppel-Heizkurve. Ein Knopf spielt die vorhandene Ethanol-Modellkurve ab. Ein zweiter öffnet das Messlabor im Forscher-Campus. Ein Sicherheitshinweis betont: Ethanol ist leicht entzündlich und wird nur virtuell erhitzt.

## Forscher-Campus

- **Messlabor:** Die Stoffwahl `#v4HeatSubst` (Wasser oder Ethanol) ist getrennt von `#v4Substance` im Lösungsversuch. Heizleistung (W) und Luftdruck (hPa) lassen sich frei eingeben. Die Siedetemperatur wird über eine vereinfachte Clausius-Clapeyron-Näherung berechnet. Eigene Messwerte erscheinen als violette Rauten und werden mit exportiert.
- **Teilchenlupe:** Sie hat die Stufen ×1, ×2, ×4 und ×8 und wird DPR-gerecht und unverzerrt gezeichnet. Bei ×4 und ×8 sind Wassermoleküle (O/H), Ionen mit Hydrathülle, Zuckermoleküle und das Ionengitter zu sehen.
- **Finde die Laborfehler:** Es gibt sieben gezeichnete Laborszenen mit je vier versteckten Gefahren und harmlosen Ablenkstellen. Lösungskarten erscheinen erst, wenn eine Gefahr gefunden ist.

## Lernheft: Übersicht mit Bildern und Nachüben

Die Lernheft-Seite zeigt Bilder direkt in den Kapiteln: acht Gerätezeichnungen (aus `art` in `core.js`, befüllt über `content-corrections.js`), das Laborszenen-Bild aus dem gedruckten Lernheft (zur Laufzeit vom Sicherheitskapitel geklont, keine doppelte Einbettung), ein Flammenvergleich und die Topf-Grafik. Bei **Labor-Missionen** führt ein eigener Knopf zurück zur Lernübersicht.

Beim persönlichen Nachüben (**Deine Fehler verstehen und verbessern**) werden eigene Fehler aus der Klassenarbeit um weitere Fragen aus dem `quizBank` zu denselben Themen ergänzt, bis mindestens sechs Aufgaben bereitstehen. Die vier Materialstäbe im Wärmeleitfähigkeits-Vergleich zeigen echte Materialoberflächen (Kupfer, Stahl, Holzmaserung, Kunststoff); die Erwärmung liegt als oranger Schleier darüber.

## Lernpfad: Schritt „Erklären“

Jedes Kapitel hat zuerst einen Satzbaukasten mit Lückenauswahl, Prüfung und Übernahme ins Textfeld. Danach folgt eine automatische Schlüsselwort-Rückmeldung zu jedem Kriterium mit Tipps. Erkannte Kriterien werden in der Selbsteinschätzung vorab angehakt.

`node tests/campus-upgrades-smoke.cjs` prüft diese Erweiterungen.
## Lernheft und Laborbild

`Lernheft_Chemiearbeit.pdf` (11 Seiten) liegt im selben Ordner wie die Offline-HTML und ist auf der Lernheft-Seite sowie in der Probearbeit verlinkt. Das Laborbild von Seite 1 des Lernhefts ist direkt in **Sicher experimentieren → Finde 6 Gefahren** eingebaut (als eingebettetes JPEG); die sechs Klickstellen entsprechen der Lösung auf Lernheft-Seite 11.

## Interaktive Erklär-Aufgaben

Alle freien Schreibaufgaben besitzen eine automatische Schlüsselwort-Prüfung mit Tipps pro Kriterium: Abschlusstest Teil B (4 Schreibaufgaben), Probeklassenarbeit im Forscher-Campus (Aufgaben 9–12), Probearbeit zum Lernheft (Vorab-Ankreuzen erkannter Kriterien) und die Topfboden-Frage auf der Wärmeleitfähigkeits-Seite. Der virtuelle Brennerführerschein begründet jede Antwort: warum die gewählte Option falsch ist und warum die richtige stimmt.

## Skizzenlabor und Forscherprotokoll

Im Forscherprotokoll (Lernzentrale) ist das Material von der Durchführung getrennt: ankreuzbare Materialliste plus eigene Einträge. Das **Skizzenlabor** stellt 17 Gerätesymbole bereit (Stativ, Dreifuß, Drahtnetz, Gasbrenner, Teelicht, Becherglas, Stäbe u. v. m.), die per Antippen eingefügt und per Ziehen platziert werden. Dazu kommen Freihandstift, Beschriftungen, PNG-Export und Übernahme der Geräteliste ins Material. Station 4 verlinkt direkt dorthin.

## Weitere Ergänzungen

- Gerätemissionen 11 und 12: Schnellkochtopf (höherer Druck → Sieden erst über 100 °C) und Mount Everest (niedriger Druck → Sieden bei ca. 70 °C), beide mit animierten Szenen. Mission 5 zeigt eine korrekte Dreifuß-Drahtnetz-Zeichnung.
- Lerntrainer: 64 Fragen (40 neue) mit Begründungen, warum die richtige Antwort stimmt und die Ablenker nicht.
- Stoffeigenschaften im Alltag: Schritt-für-Schritt-Anleitung und animierte Magnet-, Stromkreis- und Schwimmtests.
- Wärmeleitfähigkeit: Die vier Vergleichsstäbe tragen Material-Markierungen; in der Heftskizze ist der Metallstab (Metallverlauf) klar vom Glasstab (transparent) unterschieden.
- `tests/protocol-wood-smoke.cjs` wartet nach der Hash-Navigation auf die Seite (behebt WebKit-Flakiness).
## Interaktiv-Paket (Etappen 1–4)

- **GHS-Lernkartei** (Modul `ghs-lernkartei.js`, Seite Sicherheit): alle 9 Piktogramme als große SVGs mit Erklär-Großansicht und Zuordnungsspiel Symbol→Flasche inkl. Begründungen; Probearbeits-Piktogramme auf 96 px vergrößert.
- **Interaktiv-Extras** (Modul `interaktiv-extras.js`): Eiswürfel-Heizkurve (−20…110 °C, antippbare Zustandsabschnitte mit Teilchenbildern) auf der Siedetemperatur-Seite; Aggregatzustands-Sortierspiel (9 Beispiele) bei Stoffe & Körper; Sand/Öl-Test mit „gelöst vs. geschmolzen“-Merkkasten bei Löslichkeit; Brenner-Bedienfolge-Spiel mit Fehlerfolgen (falsche Reihenfolge zeigt die Gefahr) auf der Gasbrenner-Seite; Geräte-Galerie zeigt beim Antippen Handhabung + häufigen Fehler; der Wissenscheck nennt am Ende die schwierigsten Themen.
- **Skizzenlabor**: Beschriften über Eingabefeld (Enter fügt ein), ausgewählte Teile per Pfeiltasten verschiebbar (Shift = große Schritte), Entf löscht.
- **Firefox-Testfixes**: `scroll-behavior:smooth` gilt nur noch bei `prefers-reduced-motion:no-preference`; Tests erzwingen per `addInitScript` auto-Scrolling, weil sanftes Scrollen Playwright-Klicks in Firefox verfehlen ließ.
- Das eingebettete Laborbild ist auf 900 px/67 KB verkleinert.