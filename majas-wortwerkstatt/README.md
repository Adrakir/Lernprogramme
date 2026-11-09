# Majas Wortwerkstatt – Deutsch Klasse 3

Eine eigenständige, interaktive Deutschlernapp mit Maja, Bärli, Fuji und Minka. Schwerpunkt sind Hörverstehen, Wortbildung, Nomen-Endungen und Rechtschreibung. Comics, kleine Spiele, Sternenbeutel und Kleidung ergänzen das Üben.

- **Öffentlicher Einstieg:** https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/
- **Quellcode:** https://github.com/Adrakir/Lernprogramme/tree/main/majas-wortwerkstatt
- **Für KI-/Entwicklungs-Fortsetzung:** [AGENTS.md](./AGENTS.md) und [PROJECT_STATE.md](./PROJECT_STATE.md) **zuerst lesen**.

## So benutzt ein Kind die App

1. Auf der Startseite **Deutsch lernen** oder **Abenteuer erleben** wählen.
2. Im Lernbereich ein Thema auswählen. Bei den Klassenarbeiten zuerst **geführt lernen**, dann **üben**, dann den **Abschlusstest** bearbeiten.
3. Beim Hören zwischen **Aufnahme** und **Computerstimme** wählen. Das Tempo lässt sich auf **Normal**, **Langsam** oder **Sehr langsam** stellen. Eine Frage wird rot hervorgehoben; Antworten werden darunter ausgewählt.
4. Wenn nötig **Bärli, hilf mir!** für Hinweise benutzen. In Abschlusstests werden die Hinweise nicht angeboten.
5. Im Abenteuerbereich Geschichten lesen, Spiele spielen oder Bärli mit eigenen Sternen einkleiden.

Die Auswahl der Computerstimmen hängt von den Stimmen ab, die auf dem jeweiligen Gerät und im Browser vorhanden sind. Die App kann nicht garantieren, dass jede gewünschte Stimme überall verfügbar ist.

## Für Eltern und Lehrkräfte

- `#erwachsene`: Übersicht mit tatsächlich vorhandenen Bearbeitungen; ein fehlender Wert wird **nicht** als Leistungsurteil interpretiert.
- `#lernweg` und `#tagesplan`: kurze Lernabschnitte mit klaren Schritten.
- `#einstellungen`: Schriftgröße, Kontrast, weniger Animation und **Lernstand exportieren/importieren**.
- **Wichtig:** Der Lernstand wird lokal im Browser gespeichert. Es gibt keine automatische Synchronisierung zwischen verschiedenen Geräten. Vor Browserwechsel, privatem Modus oder Löschen von Browserdaten eine JSON-Sicherung exportieren. Der Export darf nicht öffentlich in GitHub hochgeladen werden.

## Kurzer technischer Einstieg

- `index.html` enthält die Hauptlogik, Hash-Navigation, Klassenarbeitsfragen, Bärlis Kleiderschrank und verschiedene bestehende Spiele.
- `mobile-start.css` enthält die kompakten Kindermenüs und Stilergänzungen für Hörverstehen und Kleiderschrank.
- `maja-plus.js` enthält ergänzende Lernfunktionen und die lokale Datensicherung.
- Andere JavaScript-, CSS-, Medien- und Comicdateien im Ordner gehören zur bestehenden App und dürfen nicht ungeprüft gelöscht werden.

### Statische Prüfungen

Vom Repository-Hauptverzeichnis aus:

```bash
node majas-wortwerkstatt/mobile-start.test.cjs
node majas-wortwerkstatt/experience.test.cjs
```

Außerdem vorhandene weitere Tests aus `majas-wortwerkstatt/*.test.cjs` ausführen. Reale Bedienung, Audio und Bildpassung müssen zusätzlich in Browsern geprüft werden. Die offenen Abnahmearbeiten stehen in [PROJECT_STATE.md](./PROJECT_STATE.md) und in den verknüpften GitHub-Issues.

## So kann ChatGPT mit GitHub, Copilot oder eine andere KI weitermachen

Zum Start eines neuen Chats diese Anweisung nutzen:

> Bearbeite die bestehende App `Adrakir/Lernprogramme/majas-wortwerkstatt`. Lies zuerst `AGENTS.md` und `PROJECT_STATE.md` im App-Ordner und die dort verlinkten GitHub-Issues. Setze die nächste offene Aufgabe im bestehenden Projekt um, überprüfe die betroffenen Funktionen und schreibe danach Fortschritt und offene Punkte zurück in `PROJECT_STATE.md`. Erhalte bestehende Inhalte und Speicherstände.

Das ist die verlässliche, gemeinsame Grundlage – nicht der private Verlauf einer bestimmten KI-Unterhaltung.
