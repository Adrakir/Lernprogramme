# Erdkunde-Entdecker – Klasse 5 · Version 7.0

## Inhalt des Komplettpakets

- **index.html**: die gesamte Lernapp als eine eigenständige HTML-Datei zum Öffnen ohne Server (abhängig von lokalen Dateibeschränkungen des Mobilbrowsers).
- **entwickler/**: die für Webhosting oder VS Code aufgeteilte Fassung mit `index.html`, JavaScript, CSS, Kartendaten, Symbolen, Manifest und Service Worker.
- **live-server.js**: optionaler Mehrgeräte-Quizserver ohne zusätzliche Node.js-Pakete.
- **Erdkunde_Lernheft_Klasse5.pdf**: das Lernheft aus Version 6.
- **10_Uebungsklassenarbeiten_Erdkunde.pdf**, **10_Uebungsklassenarbeiten_Loesungen.pdf** und **10_Tests_Ausfuehrliche_Loesungswege_V6.pdf**: die bisherigen Druckmaterialien.
- **PRUEFBERICHT_V7.md**: technische Prüfung, didaktische Bewertung und bekannte Grenzen.

## Was neu ist

**Sechs neue Forscherstationen** ergänzen vier bisherige Versuche: interaktiver Globus, gemeinsames 3D-Gebäudemodell aus unterschiedlichen Blickwinkeln, Windrose mit einstellbarem Richtungspfeil, Kartenzeichen, Koordinaten mit freien Eingaben und Zeichenatelier mit eigener schriftlicher Begründung. Es gibt **zehn spezifische Teilkompetenzen**, gezielte Übungsvorschläge sowie einen Lehrkraftbereich mit Themenauswahl, Basis-/Standard-/Transferniveau (in den neuen Praxisaufgaben), Kompetenzbericht zum Drucken und Sicherung/Import des Lernstands. Die bestehenden 16 Lernstrecken, 13 Lernlabore, Quiz- und Prüfungsangebote bleiben erhalten.

## Ohne Server lernen

Die **index.html im Hauptordner** öffnen. Für Desktop-Browser funktioniert das üblicherweise; bei iOS können lokale HTML-Dateien im Dateimanager nur eingeschränkt ausführbar sein. Dann die App über HTTPS veröffentlichen und als Website öffnen. Alle Standardübungen und die Teamrunde *an einem Gerät* benötigen keinen Online-Server.

## Installierbare PWA (mit Offline-Speicherung)

Den **Inhalt des Ordners `entwickler`** auf einer HTTPS-Website als Webverzeichnis veröffentlichen. Dadurch sind `manifest.webmanifest`, `service-worker.js`, die Icons und Skripte an den korrekten relativen Adressen. Die Datei `index.html` des Entwicklerordners als Startseite öffnen. Nach einem vollständigen ersten Laden und erfolgreicher Installation des Service Workers können die vorgesehenen Dateien offline aus dem Cache geladen werden. Einige Browser bieten anschließend „Zum Home-Bildschirm“ oder „Installieren“ an. Diese Funktion steht unter `file://` nicht zur Verfügung. Der Lernstand bleibt lokal im Browser und wird nicht automatisch zwischen Geräten synchronisiert.

## Mehrgeräte-Livequiz im vertrauten WLAN

Auf einem Laptop oder einem lokal erreichbaren Rechner muss **Node.js** installiert sein. Im **Hauptordner dieses Pakets** ein Terminal öffnen und starten:

```sh
node live-server.js
```

Die Lehrkraft öffnet `http://localhost:8787/`. Zwei weitere Geräte im selben WLAN öffnen `http://IP-DES-LAPTOPS:8787/` (die lokale IP-Adresse des Laptops einsetzen; WLAN und Firewall müssen die Verbindung zulassen). Über **„🌐 Livequiz“** erstellt die Lehrkraft einen Raumcode, beide Teams melden sich mit dem Code an und beantworten dieselbe Frage. Die Lösung erscheint erst, nachdem beide Teams geantwortet haben. Die Lehrkraft schaltet zur nächsten Aufgabe. Die Ergebnisse werden **nur im Arbeitsspeicher** des Servers gespeichert und gehen mit dessen Neustart verloren. Das lokale Livequiz ist **nicht für das offene Internet gedacht**. Für Fernzugriff sind eine geeignete HTTPS-Bereitstellung sowie zusätzliche Schutzmaßnahmen nötig.

Ein **lokales Teamquiz an einem Gerät** bleibt unabhängig davon verfügbar.

## Lernstände und Datenschutz

In **„Lehrkraft“ → „Lernstand exportieren“** wird eine JSON-Datei ausgegeben; über „Lernstand importieren“ kann sie nach Bestätigung geladen werden. Das ersetzt die bisher auf diesem Gerät gespeicherten Daten. Diese Dateien können Leistungen enthalten und sollten vertraulich behandelt werden. Der optionale Live-Server erhebt keine Namen und speichert keine dauerhaften Schülerprofile.

## Grenzen bei der Bewertung

Die **automatisch korrigierten** Praxisaufgaben prüfen z. B. Richtung, Kartenzeichen oder Koordinaten. **Zeichnungen und selbst verfasste Erklärungen werden nicht automatisch benotet**: Es erscheinen nachvollziehbare Musterbeispiele und Selbstkontrollkriterien. Die Kompetenzanzeige ist eine Lernhilfe, keine verlässliche Schulnote. Ein ausgeblendetes Thema ist aus der Themenübersicht entfernt, aber nicht technisch gesperrt. Die zehn druckbaren Klassenarbeiten sind weiterhin aus Version 6 und enthalten nicht automatisch alle neuen Praxisaufgaben.

## Technische Voraussetzungen

Moderner Browser mit JavaScript und Canvas/SVG. Die Offline-HTML-Datei braucht keine zusätzliche Bibliothek. Für die optionale Live-Funktion: Node.js 18+ auf einem Rechner, der im Netz erreichbar ist. Für PWA-Installation: HTTPS (oder `localhost`). 
