# Abnahmeplan – Majas Wortwerkstatt (Klasse 3)

**Stand:** 09.11.2026 · **Verantwortung:** Jede bearbeitende KI / entwickelnde Person dokumentiert **tatsächlich** durchgeführte Prüfungen mit Ergebnis, Betriebssystem, Browser und Commit in `PROJECT_STATE.md` und dem zugehörigen GitHub-Issue. **Nicht geprüfte Punkte nicht abhaken.**

Diese Datei enthält **Prüfschritte, keine Behauptung, dass sie bereits erfolgreich waren**.

## A. Testvorbereitung und Daten schützen

- [ ] Vor der Prüfung `main`, letzte Commits, `AGENTS.md`, `PROJECT_STATE.md` und Issues #22–#26 lesen.
- [ ] In `#einstellungen` Lernstand exportieren. Sicherungsdatei **privat** speichern; **nicht** in GitHub, Issues oder Screenshots hochladen.
- [ ] Tests möglichst in einem zweiten Browserprofil ausführen. Die lokale Datensicherung und der vorhandene Sterne-Beutel eines Kindes dürfen nicht gelöscht werden.
- [ ] Aktuellen Git-Commit, URL, Gerät, Betriebssystemversion und Browser erfassen.
- [ ] Live-Bereitstellung separat verifizieren: Die öffentliche URL muss die zuletzt aktualisierten Inhalte tatsächlich ausliefern.

## Adventskalender – manuelle Abnahme (2026)

**Automatisierte Tests liegen in `advent.test.cjs` und `e2e/advent.spec.cjs`.** Diese Kästchen erst nach echter Durchführung auf einem Gerät abhaken.

- [ ] November: Die 24 Türen sind verschlossen, die erste Geschichte ist über die Vorschau lesbar, weder Geschenke noch Sterne werden vorzeitig gutgeschrieben.
- [ ] 1. Dezember: Nur Türchen 1 darf geöffnet werden; die Weihnachtsmütze steht kostenlos im Kleiderschrank. Nach Seiten-Neuladen bleibt die Tür geöffnet; keine zweite Belohnung.
- [ ] 2.–24. Dezember: Frühere Tage dürfen nachgeholt werden, zukünftige Tage bleiben verschlossen; alle 24 kurzen Geschichten in Schrift, Audio und Motiv einzeln prüfen.
- [ ] Erste richtige Mini-Frage gibt genau einen Stern; wiederholtes Antippen, Navigieren und Neuladen geben keinen zweiten. Bei falscher Antwort gibt es eine kindgerechte Rückmeldung ohne Verlust.
- [ ] Türchen 6/12/14: kostenlose Baumhausgegenstände bleiben auch bei noch gesperrtem Baumhaus sicher in der Möbelkiste. Möbel lassen sich nach einer bestandenen Prüfung aufstellen und nach Export/Import wiederfinden.
- [ ] Türchen 8/16/22: geschenkte Level 4 der **bereits vorhandenen** Spiele gehen ohne Sternenkauf auf, haben Ton, Touch-Steuerung und Rückweg.
- [ ] Bereits gekauftes Teil: statt doppeltem Gegenstand nur einmal Ersatzsterne; vorhandene Sterne und Käufe bleiben erhalten.
- [ ] Echte iOS Safari-/iPad-/Android-Chrome-/Windows-Chrome-Tests: deutsche Vorlesestimme, Start/Stopp/Geschwindigkeit, Seitenwechsel, große Touchflächen, kein horizontales Scrollen, ausreichender Kontrast.
- [ ] Ohne Netzwerk: nach vollständigem Laden/Installation mindestens Kalender und bereits geladene Geschichten öffnen; Medienfallback und aktualisierter PWA-Cache prüfen.
- [ ] Öffentliche GitHub-Pages-Seite prüfen, nicht nur Quellcode und Desktop-Emulation. Keine personenbezogenen Kinder- oder Testdaten in GitHub hochladen.

## Baumhaus-/Shop-Abnahme (nach der November-Erweiterung)

Automatischer Basisablauf in `baumhaus.test.cjs` und `e2e/treehouse-and-shop.spec.cjs`; alle folgenden Punkte auf echten Geräten getrennt nachweisen:

- [ ] Start ohne bestandene Prüfung: Baumhaus bleibt gesperrt, Verweis auf vorhandene Abschlussprüfungen; keine Taler, keine Shop-Bestellungen.
- [ ] Einmal `hoeren:test:1` oder `nomen:test:1` zu mindestens 80 % bestehen: Baumhaus wird freigeschaltet, **nur blauer Sitzsack und Laptop** sind kostenlos da; Bärli ist sichtbar.
- [ ] Derselbe Test erneut bestanden: weiterhin nur **10 Taler** (Bestwert bleibt auch nach einem schlechteren Wiederholungsversuch). Anderer Test bestanden: weitere 10 Taler.
- [ ] Laptop im Zimmer antippen: Gelb-blauer `Bärli AG Osnabrück`-Shop öffnet sich. Dort sind keine echten Bestellungen oder Zahlungen möglich.
- [ ] Möbel, Nachttisch, Bettwäsche bestellen: jeder Kauf nur einmal möglich, Taler sinken korrekt, bestelltes Möbelstück kann über Pfeile und Tippen platziert werden, Position bleibt nach Neuladen erhalten.
- [ ] Vor 3/4/5/6/8/10 Prüfungen bleiben jeweils Tapeten/Bücher/Elektro/Weihnachten/Premium/zweites Zimmer gesperrt; nach Freischaltung bestellen und sinnvoll einrichten.
- [ ] Weihnachtsbaum und Kugeln bestellen, Baum schmücken und Schmuck abnehmen. Tapete wählen; zweites Zimmer einrichten und Möbel hinübertragen.
- [ ] Im Kleiderschrank saisonale Abteilungen `Regensachen` und `Weihnachten`, 39 passende neue Artikel sowie die alten Kleidungsstücke prüfen. Sternenkäufe und vorhandene Outfits müssen nach erneutem Öffnen unverändert bleiben.
- [ ] Auf Handy, Tablet und PC kein horizontales Scrollen, vollständige Möbelgrafiken, gut erkennbare Bedienelemente und kontrastreiche gelb-blaue Shop-Karten.
- [ ] Unter Einstellungen **alle** Lernstände inklusive `majas-wortwerkstatt-baumhaus-v1` sichern und in einem zweiten Browserprofil importieren; keine Kinder-Daten in GitHub hochladen.

## B. Mobilnavigation / Übersicht (Issue #26)

Für **iPhone Safari**, **iPad Safari**, **Android Chrome oder Edge** und **Windows Chrome/Edge**:

- [ ] Startseite zeigt **„Fit für den Kombitest“**, drei große Lernpiktogramme, den Knopf „Teste dich“, vier bebilderte Kacheln und „Alle weiteren Lernthemen“.
- [ ] Die drei Hauptkacheln führen zu `#pruefung/hoeren`, `#endungen`, `#verlaengern`; die vier Bildkacheln zu `#comics`, `#spiele`, `#lernberater`, `#baerli/schrank`. Sekundäre Links zu `#lernen` und `#abenteuer` bleiben erreichbar.
- [ ] Zurück, Weiter und Start funktionieren ohne verlorene Aufgabenstände.
- [ ] Kein horizontales Scrollen, keine abgeschnittenen Überschriften, keine verdeckten Buttons, Touchflächen ca. 44×44 px oder größer.
- [ ] `#stationen`, `#comics`, `#baerli/schrank` blättern in übersichtlichen Schritten.
- [ ] Schriftvergrößerung, hoher Kontrast, weniger Animationen und Tastaturfokus prüfen.
- [ ] Große Piktogramme und Bilder müssen zum Thema passen: Comics (Maja & Bärli lesen), Spiele (Bastelszene), Lernberater (Bärli), Kleidung (Kostümkiste); keine leeren oder doppelten Symbole. Vorgabe: [HOME_LAYOUT.md](./HOME_LAYOUT.md).


### Regression nach Rückkehr zur vertrauten Übersicht
- [ ] Alte direkte Links und Bilderbuch-Einstieg `./bilderbuecher/` nach Klick testen.
- [ ] Kleiderschrank-Kategorien auf alte Käufe und korrekte Zuordnung prüfen; besonders früher gespeicherte Hosen, Brillen und Schuhe.
- [ ] Am iPhone kontrollieren, ob Bild und Text in allen sieben Kacheln ohne Abschneiden erscheinen.

## C. Hörverstehen / Ton (Issue #22)

Auf **jedem Gerät einzeln** und jeweils in `#pruefung/hoeren/gefuehrt/1`, `#pruefung/hoeren/ueben/1` und `#pruefung/hoeren/test/1`:

- [ ] Aufnahme auswählen, „Anhören“ und „Stopp“ ausprobieren.
- [ ] Computerstimme wählen; sofern verfügbar mehrere deutsche Stimmen auswählen und tatsächlich hören.
- [ ] Geschwindigkeiten Normal (1.0), Langsam (0.85), Sehr langsam (0.7) akustisch vergleichen.
- [ ] Stimme und Tempo nach Seitenwechsel und Neuladen wiederherstellen.
- [ ] Vorlesen stoppt zuverlässig bei Navigation, Ende oder erneutem Abspielen.
- [ ] Keine überlappenden Tonspuren, keine unsinnigen Pausen/abgehackten Sätze; Fehlertext bei nicht verfügbarer Stimme.
- [ ] Rote Frage erscheint einzeln, **ohne vorzeitig sichtbare Lösung**; darunter nur die Antwortmöglichkeiten. Antwort und Bewertung funktionieren.
- [ ] Lesehilfe ist standardmäßig geschlossen und ihre Nutzung wird markiert.
- [ ] Im Abschlusstest keine Tipps oder Lösungserklärungen vor Abgabe; danach korrekte Auswertung.
- [ ] Nicht nur optisch testen: **Audio muss tatsächlich aus dem Gerät hörbar** sein.

## D. Klassenarbeiten / Didaktik (Issue #25)

- [ ] Je fünf Hörverständnis-Abschlusstests und fünf Nomen-/Verlängern-Abschlusstests starten und abschließen.
- [ ] Jede Hörfrage ist aus dem **zugehörigen** Hörtext beantwortbar; Antworten sind eindeutig und verständlich.
- [ ] Distraktoren sind plausibel, aber sachlich falsch. Keine Antwort wird ungewollt durch die Reihenfolge verraten.
- [ ] Nomen-Endungen `-ung`, `-heit`, `-keit`, `-schaft`, `-nis` mit Artikel, Großschreibung und Wortbildung prüfen.
- [ ] Verlängern durch passende längere Wortform (z. B. Hund → Hunde) und Erklärung des Endlauts prüfen; keine fachlich falschen Beispiele.
- [ ] Erst geführte Erklärung, dann selbstständige Übungen (bis zu drei Hilfen), zuletzt Tests **ohne Hilfen**.
- [ ] Bei Fehlern verständliche Erklärung und **passende** Übungsempfehlung statt bloßem „Falsch“.
- [ ] Notizen zu fachlichen Zweifelsfällen in Issue #25 dokumentieren, erst danach Änderungen mit Tests durchführen.

## E. Bärli, Comics, Spiele (Issue #23)

- [ ] Bärlis Erscheinung bleibt konsistent: braunes Fell, gelbes Ohrfähnchen, lila Grundkleidung.
- [ ] Hüte, Brillen, Pullover, Jacken, Hosen und Schuhe einzeln sowie in Kombination prüfen: **keine verrutschten Ebenen**, keine mehrfachen Gliedmaßen.
- [ ] Jede Kategorie zeigt die passenden Artikel, Preise, Schaltflächen und Vorschau-Bilder.
- [ ] Gekaufte Stücke lassen sich erneut ohne Kosten an-/ausziehen.
- [ ] Comicbilder haben unbeschnittene Figuren, lesbare Sprechblasen und konsistente Größen/Perspektiven.
- [ ] Spielsteuerung funktioniert mit Touch und Tastatur; Sterne werden nicht doppelt vergeben.

### Neue Kleidung und kostenlose Anprobe (Erweiterung 09.11.2026)

- [ ] Sechs Kategorien zeigen jeweils Kleidungsbild und passende Artikelanzahl; neue zwölf Artikel sind in den richtigen Kategorien auffindbar.
- [ ] Vor dem Kauf wird das aktuelle Stück als **Anprobe** auf Bärli gezeigt; beim Umblättern oder Verlassen werden **keine Sterne ausgegeben und keine Käufe verändert**.
- [ ] Bereits getragenes Kleidungsstück derselben Kategorie wird in der Anprobe nur vorübergehend ersetzt; der gespeicherte Outfit-Stand bleibt unverändert, bis tatsächlich gekauft/angezogen wird.
- [ ] Die neuen Hüte, Brillen, Jacken, Hosen, Schals und Schuhe auf echtem Smartphone/Tablet/PC kombiniert prüfen (Augen frei, keine überstehenden/fehlenden Füße, keine schiefen Hüte).
- [ ] Bestehenden Lernstand inklusive älterer Kleidungs-IDs importieren; neue Gegenstände kaufen, erneut anziehen, Seite neu laden und den Sterne-Bestand vergleichen.

## F. Lernstand / Elternbereich (Issue #22)

- [ ] Ein paar Aufgaben lösen, Sterne verdienen und Kleidung kaufen; Browser neu starten und Stand erneut prüfen.
- [ ] `#erwachsene` zeigt nur tatsächlich bearbeitete Tests und kennzeichnet fehlende Daten korrekt.
- [ ] `#einstellungen` → JSON-Sicherung exportieren; in einem **Testprofil** importieren. Aufgaben, Sterne, Käufe und Einstellungen vergleichen.
- [ ] Ein ungültiges JSON wird ohne Datenverlust abgewiesen.
- [ ] Keine personenbezogenen Daten auf öffentliche GitHub-Seiten oder in Issues übernehmen.
- [ ] Keine irreführende Synchronisierungsbehauptung: Lernstände bleiben ohne Import/Export im Browser.

## G. Technische Tests / CI (Issue #24)

Vom Repository-Hauptverzeichnis:

```bash
node majas-wortwerkstatt/mobile-start.test.cjs
node majas-wortwerkstatt/experience.test.cjs
# Weitere passende *.test.cjs im App-Ordner ebenfalls ausführen
```

- [ ] Node-Prüfungen lokal oder in GitHub Actions erfolgreich ausgeführt; Link zum Lauf erfassen.
- [ ] Keine JS-Syntaxfehler, JS-Exceptions, 404 für Bilder, CSS oder Audio.
- [ ] Echter Browsertest von Start-, Lern-, Hör-, Comic-, Spiel-, Schrank- und Elternrouten.
- [ ] WCAG-nahe Basisprüfung: Fokus sichtbar, Beschriftungen, Alternativtexte, ausreichend Kontrast und vergrößerte Schrift.
- [ ] Nach jedem Update der Prüfprotokolle und Issues offene Punkte korrekt stehen lassen.

## H. PWA, Sicherungs-Erinnerung und Lernserie (neu, 09.11.2026)

- [ ] PWA auf echtem iPhone/iPad/Android installieren („Zum Home-Bildschirm“); Start im Vollbild, korrektes Bärli-Icon.
- [ ] Flugmodus: bereits besuchte Seiten laden offline; nach erneuter Verbindung kommen neue Versionen an (Seite neu laden).
- [ ] Nach 5 Lerntagen ohne Export erscheint die Sicherungs-Erinnerung unter `#einstellungen` und `#erwachsene`; nach erfolgtem Export verschwindet sie.
- [ ] Lernserie: an drei aufeinanderfolgenden Lerntagen gibt es genau einen Bonus-Stern (Sternenbeutel kontrollieren, kein Doppelbonus am selben Tag).
- [ ] Fehlertrainer: richtig nachgeübte Aufgabe erscheint nach 1 Tag erneut als „Wiederholung fällig“ (Gerätedatum prüfen, nicht manipulieren).
- [ ] „🔊 Auswahl vorlesen“ in `#lernen`/`#abenteuer` ist auf dem Gerät hörbar und stoppt beim Seitenwechsel.

## I. Protokollvorlage zum Kopieren

| Datum | Commit | Gerät / OS | Browser | Route / Test | Ergebnis | Fehler / Folge-Issue |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | SHA | z. B. iPhone / iOS ... | Safari ... | Hören – Stimmen & Tempo | **nicht geprüft / bestanden / Fehler** | Link / Beschreibung |

**Mindestregel:** „Code gespeichert“, „statische Prüfung bestanden“, „Browserprüfung bestanden“ und „öffentlich bereitgestellt“ sind vier unterschiedliche Status. Niemals vermischen.
