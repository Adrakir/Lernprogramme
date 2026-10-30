# Paul und Gustav Globus – Überarbeitung Folgen 4 bis 7

**Status:** freigegebene Produktionsgrundlage / Plan, noch keine neuen MP4-Fassungen.  
**Zielgruppe:** Gymnasium Niedersachsen, Klasse 5 (ca. 10–11 Jahre).  
**Bestehende App:** `erdkunde/Erdkunde_Entdecker_Klasse5_V11/index.html` (bleibt unverändert der App-Einstieg).  
**Bestehende Videothek:** `erdkunde/Erdkunde_Entdecker_Klasse5_V11/filme/index.html`.  
**Bestehende Originalvideos:** `filme/videos/folge-4.mp4` bis `folge-7.mp4`.

## 1. Analyse der aktuellen Fassungen

Die Quellprogramme `filme/quelle/build_folge4.py` bis `build_folge7.py` verwenden Pillow und Kartenprojektionen für gezeichnete 2D/3D-Ansichten; das Bild wird nur mit 12 bzw. 15 fps ausgegeben. Die Dialoge werden mit `espeak` und Pitch-Änderungen für die drei Figuren synthetisiert. Die deutschen Sprechtexte sind vorhanden. Die Inhalte erklären überwiegend korrekt, aber die Animation kann die eigentlich entscheidenden Schritte stärker abbilden. Folge 7 behandelt die gerundete Lage von Hannover korrekt als ungefähre Position.

Die Neufassung darf die bestehenden sieben Filme, URLs, PDF-Dateien, interaktiven Tests, Übungsstände und Browser-Speicherstände nicht vorzeitig ersetzen. Der Austausch erfolgt erst nach Abnahme.

## 2. Verbindliches Seriensystem

### Figuren

* Paul: schlank, blond, etwa 11 Jahre, blauer Pullover, neugierige Mimik; freundlich, kurze verständliche Fragen, gelegentlich authentischer Denkfehler.
* Lehrer Welt: freundlicher erwachsener Erdkundelehrer mit Brille, ruhige Stimme, verbindet Fragen mit Schulstoff.
* Gustav Globus: sprechender Globus mit warmem Charakter; für wissenschaftliche Ansichten erscheint eine große **geografisch korrekte** Erdkugel mit eigener getrennt gezeichneter Gesichtsebene. Die Gesichtsmerkmale dürfen geografische Linien nicht verdecken.

Alle Figuren behalten in jedem Film dieselben Farben, Körperproportionen, Kleidungsdetails und Stimmen.

### Bild und Ton

* Ziel: 1920×1080, 16:9, 25 oder 30 fps, H.264 MP4 mit AAC-Ton. Für GitHub Pages bei Bedarf eine zusätzlich komprimierte Fassung. Ohne Seiten-Scrollen und mit responsiver Wiedergabe.
* Fachgrafiken als skalierbare Vektorgrafik oder hochaufgelöste 3D-Projektion. Kontinente, Äquator, Meridiane und Pole geografisch korrekt. Immer nur die gerade benötigten Linien hervorheben.
* Farbcode: **Rot** = geografische Breite / Breitenkreis, **Türkis/Grün** = geografische Länge / Meridian, **Gelb** = gesuchter Ort/Schnittpunkt. Die vier Viertelkugeln erhalten vier zusätzlich unterscheidbare, kontrastreiche Flächenfarben.
* Typografie: große deutsche Beschriftungen, maximal ein Hauptbegriff und ein Merksatz im Bild, keine Texttafeln über der Erdkugel; auch auf iPhone prüfen.
* Tonziel: drei natürlich klingende deutsche Stimmen mit unterscheidbarer Sprechhaltung; echte Pausen nach Fragen und zwischen Lernschritten, durchgängige Aussprache von N/O/S/W und Gradangaben. Keine eSpeak-Endfassung. Hintergrundmusik leise, Sprache deutlich vorn, Lautheit über alle Folgen konsistent, niemals abgeschnittene Silben.
* Gleichbleibender Titel, serieller Einstieg, kurze Wiederholung, ein Lernziel, eine animierte Kern-Erklärung, Anwendung, Frage mit Denkpause, Lösung und Zusammenfassung.
* Zugänglichkeit: überprüfte Untertitel (.srt), Player mit Bedienelementen, Ton optional, Pausieren möglich, keine automatisch startenden Videos; keine schnellen blinkenden Effekte.

## 3. Folge 4: Vier Erdviertelkugeln – Pilot

**Lernziel:** Erdviertelkugeln aus der Lage zu Äquator und Null-/180°-Meridian begründen. Die Reihenfolge Nord/Süd vor Ost/West ist eine übliche Benennungskonvention, kein Naturgesetz.

| Szene | Richtwert | Dialog / Visualisierung |
|---|---:|---|
| 1 | 0–10 s | Paul: „Gustav, den Äquator kenne ich. Aber wo sind die vier Erdviertel?“ Drei Figuren im Klassenzimmer, Gustav schwebt zur Erde |
| 2 | 10–24 s | Gustav: „Der Äquator teilt in Nord und Süd.“ Roten Äquator schrittweise rund um den Globus zeichnen; nördliche und südliche Halbkugel getrennt einfärben |
| 3 | 24–40 s | Gustav: „Der Nullmeridian und der gegenüberliegende 180-Grad-Meridian teilen in Ost und West.“ Zwei echte Pol-zu-Pol-Linien einzeichnen, Globus langsam drehen |
| 4 | 40–64 s | Bei stillstehendem Äquator nacheinander **Nordost**, **Nordwest**, **Südost**, **Südwest** über die gesamte jeweilige Erdviertelkugel markieren. Geografische Grenzen und Labels müssen an der Kugel mitdrehen |
| 5 | 64–78 s | Paul: „Warum heißt es Nordost und nicht Ostnord?“ Gustav: „Wir nennen bei diesen Erdvierteln zuerst Nord oder Süd und danach Ost oder West.“ Kurze Zweischritt-Animation mit zwei Pfeilen |
| 6 | 78–94 s | Deutschland auf dem Globus realistisch markieren. Lehrer Welt: „Nördlich des Äquators und östlich des Nullmeridians – welches Viertel?“ 3 Sekunden Pause, dann „Nordostviertel!“ |
| 7 | 94–100 s | Merksatz als Abschluss und Ausblick |

**Fachliche Abnahme:** Die vier Erdviertelkugeln sind **keine vier 90°-Längensektoren**, sondern Kombinationen von jeweils 90° Breite (Äquator bis Pol) und 180° Länge (0° bis 180° Ost/West). Deutschland = Nordostviertel. Äquator = 0° Breite, Nullmeridian = 0° Länge.

## 4. Folge 5: Seitenansicht und Draufsicht

**Lernziel:** Die Perspektive verändert die Darstellung, nicht die Erde. Beim Blick direkt über dem Nordpol liegt dieser in der Mitte, die Breitenkreise sind konzentrische Kreise, Meridiane verlaufen radial.

| Szene | Kernanimation |
|---|---|
| Einstieg | Paul hält zwei Bilder hoch und fragt, ob es dieselbe Erde sei |
| Seitenansicht | Glatter 3D-Globus, markierte Pole, Äquator; Kurven der Meridiane mit korrekter räumlicher Tiefe |
| Kamerafahrt | Kamera bewegt sich *kontinuierlich* über dem Globus zum Nordpol, während Gustav erklärt |
| Draufsicht | Pol in der Mitte, Breitenkreise als Kreise, Meridiane als Strahlen; Äquator am äußeren sichtbaren Rand (schematischer Nordpolblick) |
| Alltagstransfer | Derselbe Schulhauskörper von der Seite und aus der Luft; Fenster vs. Dach |
| Denkfrage | „Wo liegt der Nordpol in der Draufsicht?“ – Denkpause und auflösende Einblendung |

**Didaktische Warnung:** Eine Draufsicht meint immer eine konkret benannte Blickrichtung (z.B. vom Nordpol); nicht jede Draufsicht zeigt die Nordhalbkugel. Der Äquator gehört in die Polansicht an die Horizontgrenze, nicht als Kreis mitten in der Nordhälfte.

## 5. Folge 6: Gradnetz und gebogene Meridiane

**Lernziel:** geografische Breite N/S zuerst, geografische Länge O/W danach; der Ort liegt am Schnittpunkt der beiden Linien.

| Szene | Kernanimation |
|---|---|
| Einstieg | Paul sucht einen Ort ohne Straßennamen, Herr Welt stellt zwei Fragen |
| Breite | Roter 52°-N-Breitenkreis wächst vom Gradnetzrand auf eine ruhige Erdkugel |
| Länge | Grüner 10°-O-Meridian wird von einem Pol aus über die Kugel verfolgt |
| Schnittpunkt | Gelber Punkt leuchtet auf: **52° N, 10° O** |
| Bogenverlauf | Gustav zeigt animierte wandernde Markierung auf **derselben** Meridianlinie; nicht einfach gerade durch den Innenraum ziehen |
| Kontrolle | „Welche Zahl lesen wir zuerst?“ – 3 Sekunden Pause; anschließend Merksatz |

**Fachliche Abnahme:** Breitenkreise sind zum Äquator parallel, Meridiane verbinden die Pole. Der Meridian erscheint je nach Blickwinkel gebogen. Eine Kugelansicht zeigt nur die sichtbare Hälfte; Rückseite nicht falsch vorn zeichnen. Koordinatenpunkt soll eindeutig auf dem Schnittpunkt liegen.

## 6. Folge 7: Orte im Atlas finden

**Lernziel:** eine geeignete Atlas-Karte auswählen und aus ihren Randwerten/gekrümmten Linien Koordinaten finden.

| Szene | Kernanimation |
|---|---|
| Kartenwahl | Inhaltsverzeichnis/Legende einer schematischen, gut lesbaren Deutschlandkarte; nicht jede Karte besitzt ein Gradnetz |
| Rand | Deutliche Gradbeschriftungen an den zutreffenden Kartenrändern; Ableserichtung sichtbar machen |
| Breite | **52° N** am Rand suchen und rote Linie entlangfahren |
| Länge | **10° O** suchen und grüne Meridianlinie entlangfahren |
| Ort | Gelber Schnittpunkt erscheint; **Hannover liegt in der Nähe**. Exakter Standort Hannover ca. 52,4° N, 9,7° O |
| Gekrümmte Projektion | Zweite Karte mit **gebogenem** Längengrad und einer daran entlanglaufenden gelben Markierung; nicht geradlinig abkürzen |
| Zwischenwerte | Ablesen zwischen beschrifteten Graden mit sichtbar nachvollziehbarer Schätzung |
| Selbsttest | 50° N, 12° O: zuerst Breite, dann Länge, Schnittpunkt. Bei falscher Antwort Schritt erneut visualisieren |

**Fachliche Abnahme:** Kartenprojektionen können gekrümmte Meridiane verursachen; die Gradwerte gelten auch dann. Bei einer Karte ohne Gradnetz die Koordinaten nicht als frei ablesbar behaupten. Hannover 52° N, 10° O ist ausdrücklich eine gerundete Lageangabe.

## 7. Auslieferung und Qualitätssicherung

1. **Pilot Folge 4:** Charakter-Design und 10–15 Sekunden mit neuer Sprechertechnik erproben; erst nach hörbarer und sichtbarer Qualitätssteigerung komplette Folge erstellen.
2. **Vier Neufassungen** mit identischen Figuren und Stimmen fertigstellen, bestehende Versionen bis zur Freigabe unverändert lassen; etwaige Plan-/Sprachsyntheselimits vorher prüfen.
3. **Fachprüfung:** Linienführung, Erdviertel, Ansichten, Gradnetz, Kartenrand und Koordinatenschnittpunkte fachlich testen. Mindestens eine Karte je Folge mit kontrollierten Referenzpunkten.
4. **Schüler- und Lehrerprüfung:** ohne Vorwissen verständlich, gesprochener Satz entspricht dem sichtbaren Bild, Antwortzeit ausreichend, keine Überladung.
5. **Technikprüfung:** Bild/Ton synchron, keine abgeschnittenen Sprecherrollen, Tonqualität, fehlerfreie MP4 und Untertitel, mobile Darstellung, iMac/Safari, iPad, Android und Desktop; Audio auch über einfache Lautsprecher verständlich.
6. **Veröffentlichung:** Neue MP4, Poster und SRT zunächst unter eigenen Versionsdateinamen auf GitHub hochladen. Erst nach Abnahme die Videoquellen in bestehender App und Videothek umschalten; alte Versionen zur Rückkehr erhalten. Erdkunde-Quellcode und Offline-Bundle müssen synchron bleiben, vorhandene Tests grün.

### Produktionsgrenze

Die bisherigen vier Fassungen 4–7 können mit dem lokalen eSpeak-Renderer technisch überarbeitet werden, aber **wirklich natürlich klingende Dialoge** erfordern einen geeigneten deutschen TTS-Dienst bzw. entsprechende Stimmen. Das kostenlose HeyGen-Videokontingent ist nach den ersten drei Folgen ausgeschöpft; es wird deshalb nicht behauptet, dass schon neue professionelle Stimmen oder vier neue Videos gerendert wurden.
