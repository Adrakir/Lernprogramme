# BioLabor 5 – Hund & Katze (Stand 10. November 2026)

## Ziel und bestehende Links
Die neue Tierkunde ist **Teil der bestehenden Biologie-App**, nicht Ersatz für deren Inhalte. Eingebunden in `BioLabor_5_Biologie_V9_2.html` über zwei neue Einträge in der Seitennavigation und zwei große Startkacheln.

- Biologie-Start: `BioLabor_5_Biologie_V9_2.html`
- Neuer Einstieg: `BioLabor_Hund_Katze.html`
- Direkt Hund: `BioLabor_Hund_Katze.html#dog/skeleton`
- Direkt Katze: `BioLabor_Hund_Katze.html#cat/skeleton`

Alle Pfade relativ zum Verzeichnis `biologie und chemie/` im Repository `Adrakir/Lernprogramme`.

## Architektur
- `BioLabor_Hund_Katze.html`: eigenständige HTML-Einstiegsseite mit Zurück-Link zu BioLabor.
- `Tierkunde_Hund_Katze.css`: responsives Design, Hell-/Dunkelmodus, Druck, Zoom.
- `Tierkunde_Hund_Katze.js`: Daten, selbst gezeichnete SVGs, Navigation, Körpersprache, Quiz, lokale Bestleistung.
- `BioLabor_5_Biologie_V9_2.html`: bestehende App; **nur additive Verknüpfung** am Ende (Marker `biotiere-promo`). Alle anderen Inhalte, Quizstände und Speicher-Keys erhalten.

## Inhalt
Beide Arten separat über Tierwechsler:
1. Anklickbares schematisches Skelett: 9 interaktive Gruppen mit „Was ist das?“ und „Warum so?“; 23 zusätzliche Knochen-/Bauteilbeschreibungen; Zoom.
2. Abstammung: Hund aus früheren Wolfs-Linien, Katze aus der afrikanisch-vorderasiatischen Wildkatze; Domestikation als Vorgang über Generationen, beim Hund Zeit/Ort nicht als gesichert behaupten.
3. Gebiss: 42 bleibende Zähne Hund (12/4/16/10), 30 Katze (12/4/10/4); 28/26 Milchzähne; Reißzähne als Scherwerkzeug, Vergleich zu Pflanzenfressern.
4. Jagd: Sinnesorgane, typische Schritte und Körperbau; Unterschiede zwischen Rassen bzw. Individuen.
5. Bewegung: Gehen, Laufen, Anschleichen, Springen; Zehengänger; Knochen, Sehnen, Gelenke.
6. Körpersprache: entspannt, Angst, Drohen, Angriff/Abwehr, Flucht, Jagd, Spiel; Zeichnungen, Körpermerkmale, Sicherheitsverhalten. **Einzelne Signale nie isoliert bewerten.**
7. Vergleich Hund/Katze und Quellen.
8. 24 interaktive Multiple-Choice-Fragen (10 Hund, 10 Katze, 4 gemeinsam), Erklärungen/Hinweise, lokaler Bestwert.
Zusatzfunktionen: vereinfachter deutscher Browser-Vorleser, anpassbare Schriftgröße, kontrastreiche Darstellung, Drucken.

## Fachliche Quellen
- Veterinäranatomie (Knochen): American College of Veterinary Surgeons, https://www.acvs.org/small-animal/fractured-limbs/
- Typische Wirbelzahlen: https://flexikon.doccheck.com/de/Wirbels%C3%A4ule_%28Veterin%C3%A4rmedizin%29
- Gebiss: Merck Veterinary Manual, https://www.merckvetmanual.com/digestive-system/dental-development-and-anatomy/dentition-and-dental-nomenclature-of-animals
- Stammesgeschichte Hund: Smithsonian, https://www.si.edu/stories/your-dog-little-wolfy
- Stammgeschichte Katze: Library of Congress, https://www.loc.gov/everyday-mysteries/categories/zoology/item/how-did-cats-become-domesticated/
- Körpersprache: RSPCA, https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding und https://www.rspca.org.uk/adviceandwelfare/pets/cats/behaviour

## Teststatus
- Syntaxprüfung neuer JS-Datei erfolgreich (`new Function`).
- 22 von 22 **simulierten DOM-/Routen-/Interaktionsprüfungen** erfolgreich (Hund, Katze, SVG-Klick, Zoom, 7 Stationen, Quizantwort, Wechsel, Integration).
- Sechs eingebettete Skripte im bisherigen BioLabor syntaktisch geprüft; bestanden.
- **Noch nicht nachgewiesen:** tatsächlicher iOS-/Android-/Desktop-Browsertest, Bildschirmleser, Sprachausgabe auf echten Geräten, GitHub-Pages-Deploy-Status. Die simulierten Tests dürfen nicht als echte Gerätetests bezeichnet werden.

## Regeln für Änderungen
- Bestehende BioLabor-Datei und Speicherstände nicht ersetzen oder löschen.
- Quellen / biologisch korrekte Erklärungen beibehalten. SVGs sind explizit schematisch, keine anatomisch maßstabsgetreuen Präparate.
- Änderungen der Lernstationen in `Tierkunde_Hund_Katze.js`, der Ansicht in CSS. Danach JavaScript-Syntax und die Routen beider Tierarten testen.
- Weitere Verbesserungsmöglichkeiten: hochwertige, lizenzgeprüfte anatomische Detailillustrationen anstelle vereinfachter SVG-Grafiken; echte mobile Browsertests; individuelle Audio-Stimmen.
