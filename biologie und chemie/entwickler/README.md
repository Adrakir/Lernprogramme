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

## Lernpfad: Schritt „Erklären“

Jedes Kapitel hat zuerst einen Satzbaukasten mit Lückenauswahl, Prüfung und Übernahme ins Textfeld. Danach folgt eine automatische Schlüsselwort-Rückmeldung zu jedem Kriterium mit Tipps. Erkannte Kriterien werden in der Selbsteinschätzung vorab angehakt.

`node tests/campus-upgrades-smoke.cjs` prüft diese Erweiterungen.