# Neuvertonung Folgen 1–3, 1. November 2026

Die Filme nutzen Reid für Paul, Arthur für Herrn Welt und Benji für Gustav. Die vorhandenen Paul- und Herr-Welt-Aufnahmen wurden wiederverwendet. Drei kürzere Gustav-Aufträge und eine gezielte Korrektur von Szene 4 in Folge 3 kosteten insgesamt 11,9 vorhandene Credits. Es wurden keine Credits gekauft.

Die drei Filme dauern 57,267 / 67,867 / 72,533 Sekunden. Die Diagramme verwenden dieselbe Farbgebung, Kartenprojektion und bereits vorhandene Figurenillustration wie die späteren Folgen. Untertitel folgen tatsächlich erkannten Wortgrenzen; Denkpausen bleiben erhalten. Die Originalaufnahmen werden verlustfrei als FLAC gespeichert. Jeder FLAC wurde durch Vergleich des dekodierten PCM gegen den ursprünglichen WAV geprüft.

Reproduktion ohne weitere Generierung:

```bash
python filme/quelle/revoice_folgen123.py --work /tmp/erdkunde123
```

Voraussetzungen: Python mit NumPy, SciPy, Pillow und Basemap; FFmpeg und DejaVu-Schriften. `masters.json` enthält die exakten Texte und Stimmenparameter. `*_transcript.json` enthält die für den Schnitt verwendeten Erkennungsergebnisse; die Rohvarianten bleiben als `*_transcript_raw.json` erhalten. `folge1_timeline.json` bis `folge3_timeline.json` dokumentieren Quellen, Schnittgrenzen, Lautstärke und Untertitel. Die missverständliche Passage aus der langen Gustav-Aufnahme von Folge 3 wird durch `3_Gustav_szene4.flac` ersetzt.

Alle drei finalen MP4 wurden vollständig und streng dekodiert. AAC-Lautheit: −16,05 / −15,93 / −16,03 LUFS; True Peak: −1,52 / −1,51 / −1,46 dBTP. Keine Änderung von Sprechtempo oder Tonhöhe. Keine subjektive Hörprüfung möglich; Transkription, Sichtprüfung und technische Messungen ersetzen keine Hörprüfung.
