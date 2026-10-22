# Kartenquelle: Mühlenkampschule und Umgebung

Die neue Offline-Karte wird aus **echten OpenStreetMap-Geometrien** gezeichnet.
Sie ist kein Foto, keine Live-Tilekarte und keine frei erfundene Umgebung.
Für die Unterrichtskarte werden Gebäude, Straßen, Waldflächen und Wasserläufe
ausgewählt und vereinfacht eingefärbt.

- **Quelle:** https://www.openstreetmap.org/api/0.6/map?bbox=8.349,52.594,8.375,52.609
- **Abrufdatum:** 21.10.2026
- **Attribution:** © OpenStreetMap-Mitwirkende
- **Lizenz:** Open Database License (ODbL) 1.0, https://www.openstreetmap.org/copyright
  und https://opendatacommons.org/licenses/odbl/1-0/
- **Ausgangsdaten:** `entwickler/diepholz.osm`
- **Ausgewählter Datensatz:** `entwickler/diepholz-data.js`, 3.668 Kartenobjekte.
- **Erzeugung:** `node entwickler\build-map.js`; anschließend
  `node entwickler\build-offline.js`.

Schulbezug: Mühlenkampschule Grundschule, Lüderstraße 72, 49356 Diepholz,
OSM-Objekt https://www.openstreetmap.org/way/148632628.
Der Schulmarker liegt ungefähr bei 52,60172° N, 8,36177° O.
Die weiteren Fundorte werden aus den tatsächlich vorhandenen Supermarkt-,
Wald- und Flussobjekten ausgewählt. Die App verlinkt das jeweilige OSM-Objekt.
Sie behauptet keine aktuellen Öffnungszeiten und empfiehlt keine sichere
Schulwegroute. Kartendaten können unvollständig oder veraltet sein.

Der Kartenausschnitt und der ausgewählte Geodatensatz stehen unter der ODbL;
bei Weitergabe bleiben Quellenangabe und Lizenzhinweis erhalten. Eigene
Lerntexte und eigene schematische Gebäude-/Bergmodelle sind davon getrennt.
