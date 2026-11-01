# Neuvertonung – Folge 4 fertig, Folgen 1 bis 3 vorbereitet

Folge 4 verwendet jetzt dieselben natürlichen Figurenstimmen wie die bereits neu vertonten Folgen 5 bis 7. Folgen 1 bis 3 sind weiterhin in ihrer bisherigen Fassung vorhanden.

## Vorbereiteter Auftrag

Die vorhandenen Dialoge der Folgen 1 bis 4 werden ohne Sprecherbezeichnungen und Regieanweisungen vorgelesen. Die Figuren erhalten dieselben Seed-Audio-Stimmen wie in den fertigen Folgen 5 bis 7: Paul = Reid, Herr Welt = Arthur, Gustav = Benji. Die Originaltexte, Szenen und Zuordnungen stehen in `plan.json`; die sechs zusammenhängenden Sprecheraufnahmen mit ihren genauen Texten und Parametern in `masters.json`.

Für Folge 4 wurde `4_Paul.wav` wiederverwendet; `4_Herr_Welt.wav` und `4_Gustav.wav` sind nach ausdrücklicher Zustimmung zur Verwendung vorhandener Credits hinzugekommen. Kosten: 5,4 vorhandene Credits (82,7 vorher, 77,3 danach). Es wurden keine Credits gekauft. Die drei Aufnahmen für Folgen 1 bis 3 wurden in diesem Schritt nicht beauftragt.

## Reproduzierbarer Schnitt für Folge 4

`revoice_folge4.py` im übergeordneten Ordner verwendet ausschließlich die gespeicherten Aufnahmen und Transkripte. Der Schnitt braucht weder einen Sprachdienst noch Credits. Benötigt werden NumPy, SciPy, Pillow, DejaVu-Schriften und FFmpeg. Aufruf: `python revoice_folge4.py --original /pfad/zum/original.mp4 --work /tmp/folge4`. Die unveränderte Originalgrafik stammt aus `filme/videos/folge-4.mp4` im Commit `44e8415f18d0b1426db61ba34396116eff8bbcbc`; der Renderer prüft ihre Blob-SHA.

Die elf Szenen werden an tatsächlichen Sprachgrenzen ausgerichtet. Die Spuren behalten ihr Tempo und ihre Tonhöhe; nur die Dauer der Erklärgrafiken ändert sich. Die Denkpause vor der Antwort bleibt erhalten. `folge4_timeline.json` dokumentiert Quellbereiche, Szenenzeiten, Transkriptvergleich und technische Prüfung. Laufzeit: 89,733 Sekunden, H.264/AAC, 1280 × 720, 15 Bilder/s, 48-kHz-Stereo. Bild und Ton werden separat auf vollständige Laufzeit sowie gemeinsam mit strenger Fehlerprüfung dekodiert. Die subjektive Hörprüfung wurde nicht durchgeführt; phonetische Varianten der automatischen Transkription stehen unverändert in den Nachweisen.

Die vorhandenen öffentlichen Videopfade bleiben erhalten. App, Videoseite und Cache laden für Folge 4 die neue Fassung. Der manuell ausführbare GitHub-Workflow `erdkunde-film4.yml` baut diese Vertonung aus den gespeicherten Spuren nach und ersetzt sie nicht mehr durch eSpeak.

Die Verstärkung berücksichtigt jetzt auch den tatsächlichen Spitzenwert jeder Aufnahme; die Eingangsspuren werden nicht mehr hart abgeschnitten. Die alte eingebrannte Textleiste wird verdeckt und durch auf die tatsächlichen Sprachintervalle begrenzte Untertitel ersetzt. Frage- und Denkpausen bleiben dadurch ohne weiterlaufende Sprechuntertitel.
