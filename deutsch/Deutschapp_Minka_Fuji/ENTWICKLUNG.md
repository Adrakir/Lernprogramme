# Erzählwerkstatt: Sprachtraining mit Minka & Fuji

Der Lernbereich **06 · Erzählsprache trainieren** ergänzt die vorhandene App.
`language.js` enthält sieben Themen mit Erklärungen, Vorher-Nachher-Beispielen,
Wortschatz, je vier Aufgaben, einem Schreibauftrag, einer Checkliste und einem
Mustertext. Die Übungen behandeln Spannungsschlingen in der Einleitung,
Bewegungs-, Wahrnehmungs- und Redeverben, Satzanfänge, Adjektive und wörtliche
Rede. Drei zusätzliche Satzzeichenübungen zeigen vorangestellte, nachgestellte
und eingeschobene Begleitsätze.

Die Einleitung-Schreibwerkstatt verlinkt den Bereich und prüft in der
Selbsteinschätzung auch Spannungsschlinge und Wortwahl. Comics, Spannungskurve,
18 Wissensaufgaben und sechs Lesegeschichten mit 72 Aufgaben bleiben erhalten.

Alle Daten liegen nur im Arbeitsspeicher der geöffneten Seite. Ein Themen- oder
Bereichswechsel erhält Eingaben; Neuladen setzt sie zurück. Eine geöffnete Hilfe,
Lösung oder ein korrigierter Fehlversuch wird nicht als unabhängiger Erstversuch
gezählt. Freie Texte werden nur mit einer transparenten Selbsteinschätzung
überarbeitet, nicht automatisch bewertet. Es werden keine Texte übertragen.

## Start und Prüfung

Zum Lernen genügt `index.html` mit den benachbarten Skripten, Styles und Bildern.
Es gibt keinen Build und keine externen Laufzeitabhängigkeiten. Die bestehende
Seite auf `chatgpt.site` wird durch Änderungen in diesem Repository nicht mit
aktualisiert.

Für die Browsertests in diesem Ordner:

```sh
npm install
npx playwright install chromium
npm test
```

Optional kann `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` auf eine vorhandene
Chromium-Datei zeigen. `DEUTSCH_APP_URL` erlaubt denselben Test gegen eine
veröffentlichte Version. Standardmäßig wird die lokale `index.html` geöffnet;
damit wird auch das Starten ohne Webserver geprüft.

Die Tests prüfen alle Aufgaben, richtige und falsche Antworten, Hilfen und
Lösungsnutzung, getrennte Schreibentwürfe, Satzzeichenübungen, bestehende
Lernbereiche und horizontale Überläufe bei 390 und 768 Pixeln.
