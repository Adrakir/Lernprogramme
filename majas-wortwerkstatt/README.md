# Majas Wortwerkstatt – Deutsch Klasse 3

Eine eigenständige, interaktive Deutschlernapp mit Maja, Bärli, Fuji und Minka. Schwerpunkt sind Hörverstehen, Wortbildung, Nomen-Endungen und Rechtschreibung. Comics, kleine Spiele, Sternenbeutel und Kleidung ergänzen das Üben.

- **Öffentlicher Einstieg:** https://adrakir.github.io/Lernprogramme/majas-wortwerkstatt/
- **Quellcode:** https://github.com/Adrakir/Lernprogramme/tree/main/majas-wortwerkstatt
- **Für KI-/Entwicklungs-Fortsetzung:** [AGENTS.md](./AGENTS.md), [PROJECT_STATE.md](./PROJECT_STATE.md) und [HOME_LAYOUT.md](./HOME_LAYOUT.md) **zuerst lesen**.

## So benutzt ein Kind die App

1. Auf der Startseite direkt **Hören**, **Endungen**, **Verlängern**, **Teste dich**, **Comics**, **Spiele**, **Bärli hilft dir** oder **Bärlis Kleidung** auswählen. Die zusätzlichen Wege **Deutsch lernen** / **Abenteuer erleben** sind über kleine Zusatzlinks erreichbar.
2. Im Lernbereich ein Thema auswählen. Bei den Klassenarbeiten zuerst **geführt lernen**, dann **üben**, dann den **Abschlusstest** bearbeiten.
3. Beim Hören zwischen **Aufnahme** und **Computerstimme** wählen. Das Tempo lässt sich auf **Normal**, **Langsam** oder **Sehr langsam** stellen. Eine Frage wird rot hervorgehoben; Antworten werden darunter ausgewählt.
4. Wenn nötig **Bärli, hilf mir!** für Hinweise benutzen. In Abschlusstests werden die Hinweise nicht angeboten.
5. Im Abenteuerbereich Geschichten lesen, Spiele spielen oder Bärli mit eigenen Sternen einkleiden.

Die Auswahl der Computerstimmen hängt von den Stimmen ab, die auf dem jeweiligen Gerät und im Browser vorhanden sind. Die App kann nicht garantieren, dass jede gewünschte Stimme überall verfügbar ist.

## Bärlis Kleiderschrank (Erweiterung 09.11.2026)

Im Bereich **Bärlis Kleidung** gibt es jetzt zwölf weitere Sachen in den sechs Kategorien Hüte, Brillen, Pullover/Jacken, Hosen, Schals und Schuhe. Die Kategorien haben Beispielbilder mit Artikelzahl. Beim Blättern wird die gewählte Kleidung **probeweise direkt auf Bärli gezeigt**, ohne sie zu kaufen oder Sterne abzuziehen. Erst **Für … Sterne kaufen** erwirbt ein Stück; bereits gekaufte Artikel lassen sich weiter an- und ausziehen. Bestehende Kleidung und gespeicherte Sterne bleiben erhalten. Die visuelle Abnahme auf realen Geräten ist noch offen.

Die aktuelle Prüfung der 10 Klassenarbeits-Tests und der Comic-Originalbilder steht in [QA_BEFUNDE_2026-11-09.md](./QA_BEFUNDE_2026-11-09.md).

## Hörprüfungen und Comic-Kino (aktualisiert 09.11.2026)

In den fünf Hörverständnis-Abschlusstests ist die vollständige Lesevorlage verborgen; die Fragen werden einzeln rot hervorgehoben. Während geführter Übungen ist eine Lesehilfe weiterhin verfügbar. Erneutes Tippen auf „Anhören“ startet die laufende Aufnahme erneut. Die Wahl zwischen Aufnahme, deutschen Gerätestimmen und drei Geschwindigkeiten bleibt erhalten.

Die Schulcomics haben deutlich erkennbare Sprechblasen unter den Zeichnungen. Bei Detektivcomics können Sprechblasen **am Bild** oder **darunter** angezeigt werden: auf großen Bildschirmen ist die Bildvariante voreingestellt, auf Handys die lesefreundliche Darstellung darunter. Beide Comicarten unterstützen Vorlesen pro Bild und Vergrößern. Die Stimmen selbst sind abhängig von Browser und Gerät.

Neue automatische Tests: `e2e/learning-and-comics.spec.cjs` und `pruefungen-comics.test.cjs`. Ergebnisse und offene echte Gerätetests stehen in [QA_BEFUNDE_2026-11-09.md](./QA_BEFUNDE_2026-11-09.md).

### Comics ohne lange Scrollseiten auf Smartphones

Auf schmalen Displays ist pro Comicseite jetzt zunächst **nur ein Bild sichtbar**. Über „Vorheriges Bild“ und „Nächstes Bild“ blättert das Kind durch die Szenen; nach der letzten Szene führt der Weiter-Knopf direkt zur nächsten Comicseite oder zur passenden Übersicht. Die Anzeige „Bild x von y“ zeigt den Fortschritt. Bildvergrößerung und Comic-Kino-Vorlesen bleiben erhalten. Auf Desktop bleiben mehrere Panels pro Seite sichtbar. Die Originalbildtafeln wurden dabei nicht neu generiert oder ersetzt.

## Für Eltern und Lehrkräfte

- `#erwachsene`: Übersicht mit tatsächlich vorhandenen Bearbeitungen; ein fehlender Wert wird **nicht** als Leistungsurteil interpretiert.
- `#lernweg` und `#tagesplan`: kurze Lernabschnitte mit klaren Schritten.
- `#einstellungen`: Schriftgröße, Kontrast, weniger Animation und **Lernstand exportieren/importieren**.
- **Wichtig:** Der Lernstand wird lokal im Browser gespeichert. Es gibt keine automatische Synchronisierung zwischen verschiedenen Geräten. Vor Browserwechsel, privatem Modus oder Löschen von Browserdaten eine JSON-Sicherung exportieren. Der Export darf nicht öffentlich in GitHub hochgeladen werden.

## Kurzer technischer Einstieg

- `index.html` enthält die Hauptlogik, Hash-Navigation, Klassenarbeitsfragen und verschiedene bestehende Spiele. Das Diktataudio liegt ausgelagert in `diktat-audio.js`; der Kleiderschrank vollständig in `baerli-kleiderschrank.js`.
- `mobile-start.css` enthält die kompakten Kindermenüs und Stilergänzungen für Hörverstehen und Kleiderschrank.
- `maja-plus.js` enthält ergänzende Lernfunktionen, die lokale Datensicherung, die Export-Erinnerung sowie Wiederholungs- und Lernserienlogik.
- `manifest.webmanifest`, `sw.js` und `icons/` machen die App offline nutzbar und installierbar (PWA). Lernstände bleiben ausschließlich in `localStorage`.
- Andere JavaScript-, CSS-, Medien- und Comicdateien im Ordner gehören zur bestehenden App und dürfen nicht ungeprüft gelöscht werden.

### Qualitätssicherung und andere KI-Assistenten

- [QA_CHECKLIST.md](./QA_CHECKLIST.md) ist die gemeinsame, reproduzierbare manuelle Abnahme für Audio, Navigation, Rechtschreibung, Comics, Kleidung und Lernstand.
- [PROJECT_STATE.md](./PROJECT_STATE.md) enthält den **aktuellen Umsetzungs- und Prüfstand**; er muss nach jeder Änderung fortgeschrieben werden.
- [AGENTS.md](./AGENTS.md) erklärt auch, welche spätere JS-Datei zur Laufzeit bestehende Funktionen überschreibt.
- GitHub Copilot erhält zusätzlich zentrale Hinweise über [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).

**Automatische Chromium-Browsertests (simulierte Bildschirmgrößen):**

```bash
cd majas-wortwerkstatt
npm install
npx playwright install chromium
npm run test:browser
```

Die Datei `e2e/smoke.spec.cjs` prüft die beiden Einstiege, Hörverstehen samt Einstellungen, Hauptbereiche und horizontalen Überlauf; `e2e/a11y.spec.cjs` führt zusätzlich ein axe-Audit (WCAG 2A/AA) auf acht Seiten aus. Am 09.11.2026 liefen alle Tests lokal in der Chromium-Emulation erfolgreich. Das Ersetzen echter iOS/Android-Tests durch Chromium-Emulation ist nicht zulässig.

Zusätzlich steht `npm run lint` (ESLint) zur Verfügung und läuft auch im CI-Workflow.

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

> **Startseitenentscheidung:** Die vertraute Kombitest-Übersicht mit drei großen Lernpiktogrammen und vier bebilderten Kacheln ist verbindlich. Bitte [HOME_LAYOUT.md](./HOME_LAYOUT.md) vor UI-Änderungen lesen.
