import type {BereichContent, Frage, Station} from './groessen-content';

function frage(question: string, options: string[], answer: number, explain: string[]): Frage {
  return {question, options, answer, explain};
}

function station(skill: string, title: string, entdecken: Frage, regel: string, aufgabe: string,
  schritte: string[], begruenden: Frage, modell: 'clock' | 'timeunits' = 'timeunits'): Station {
  return {skill, title, entdecken, verstehen: {text: [schritte[0]], merksatz: regel,
    interactive: modell, interactiveHint: modell === 'clock' ? 'Stelle die Dauer ein. Beobachte beide Zeiger beim Übergang zur nächsten Stunde.' : 'Wähle ein Einheitenpaar. Verfolge, wann die kleinen Einheiten eine ganze große Einheit ergeben.'},
    beispiel: {aufgabe, schritte}, begruenden};
}

export const zeitContent: BereichContent = {
  intro: 'Wie lange dauert etwas? Rechne mit Sekunden, Minuten, Stunden und Tagen und finde deinen Anschluss im Fahrplan.',
  ziele: ['Einheiten wechseln', 'Gemischte Zeitangaben zerlegen', 'Dezimalstunden verstehen', 'Zeitspannen bestimmen', 'Über Mitternacht rechnen'],
  stationen: [
    station('z-einheiten', 'Sekunden, Minuten, Stunden und Tage',
      frage('Wie lange dauert eine Minute?', ['60 Sekunden','100 Sekunden'], 0, ['Genau. Der Sekundenzeiger läuft einmal herum.', 'Nach 60 Sekunden beginnt die nächste Minute.']),
      '1 min = 60 s. 1 h = 60 min. 1 Tag = 24 h.', 'Wie viele Stunden haben drei Tage?',
      ['Suche zuerst das passende Einheitenpaar.', 'Ein Tag hat 24 Stunden.', '3 · 24 h = 72 h.'],
      frage('Warum wird die Zahl beim Wechsel von Minuten zu Sekunden größer?', ['Eine Sekunde dauert länger.', 'Mehr kleine Einheiten passen in dieselbe Dauer.'], 1, ['Eine Sekunde ist kürzer als eine Minute.', 'Genau. Jede Minute enthält 60 Sekunden.'])),
    station('z-mischen', 'Volle Stunden und übrige Minuten',
      frage('Wie viele Minuten sind 1 h 20 min?', ['120 min','80 min'], 1, ['Die 1 steht für 60 Minuten.', '60 + 20 ergibt 80.']),
      'Wandle zuerst die ganzen Stunden um. Addiere dann die übrigen Minuten.', 'Wie schreibst du 145 min mit Stunden und Minuten?',
      ['Suche ganze Gruppen zu je 60 Minuten.', '2 · 60 = 120. Von 145 bleiben 25.', '145 min = 2 h 25 min.'],
      frage('Welche Schreibweise hat ganze Stunden und weniger als 60 Restminuten?', ['2 h 75 min','3 h 15 min'], 1, ['Bündle 60 der 75 Minuten zu einer weiteren Stunde.', 'Genau. 75 min ergeben 1 h 15 min.'])),
    station('z-dezimal', 'Was bedeutet eine halbe Stunde?',
      frage('Was bedeutet 0,5 h?', ['5 min','30 min','50 min'], 1, ['5 min sind ein Zwölftel einer Stunde.', 'Die Hälfte von 60 min sind 30 min.', 'Die Hälfte einer Stunde hat 30 Minuten.']),
      'Der Anteil hinter dem Komma ist ein Anteil von 60 Minuten.', 'Wie viele Minuten sind 1,75 h?',
      ['Zerlege die Angabe in volle Stunden und einen Stundenanteil.', '0,75 ist drei Viertel. 60 : 4 · 3 = 45.', '1,75 h = 60 min + 45 min = 105 min.'],
      frage('Welche Begründung passt zu 0,1 h = 6 min?', ['60 geteilt durch 10 ergibt 6.', 'Nach dem Komma zählt jede Stelle eine Minute.'], 0, ['Genau. Ein Zehntel von 60 Minuten sind 6 Minuten.', 'Das Komma gehört zur Einheit Stunde.'])),
    station('z-spanne', 'Zeitspannen am Zifferblatt',
      frage('Der Bus fährt von 8:50 bis 9:10 Uhr. Wie lange?', ['60 min','20 min'], 1, ['Zur nächsten vollen Stunde fehlen nur 10 Minuten.', '10 min bis 9 Uhr und weitere 10 min.']),
      'Gehe vom Start zur nächsten vollen Stunde und von dort zum Ziel.', 'Wie lange dauert es von 14:45 bis 16:10 Uhr?',
      ['Teile den Weg an vollen Stunden.', 'Bis 15:00 sind es 15 min, bis 16:00 weitere 60 min.', '15 + 60 + 10 = 85 min.'],
      frage('Weshalb ergibt 9,10 − 8,50 hier keinen passenden Rechenweg?', ['Uhrzeiten verwenden 60 Minuten je Stunde.', 'Zeitspannen lassen sich nur schätzen.'], 0, ['Genau. 8:50 ist keine Dezimalstunde.', 'Start und Ende reichen zum genauen Rechnen.']), 'clock'),
    station('z-nacht', 'Über Mitternacht',
      frage('Welche Uhrzeit folgt eine Minute nach 23:59 Uhr?', ['00:00 Uhr','23:60 Uhr'], 0, ['Genau. Ein neuer Tag beginnt.', 'Nach Minute 59 beginnt die nächste Stunde.']),
      'Bei einem Tageswechsel kannst du die Dauer vor und nach Mitternacht getrennt berechnen.', 'Der Nachtzug fährt um 22:50 ab und kommt am nächsten Tag um 01:20 an.',
      ['Nutze Mitternacht als Zwischenstopp.', '22:50 bis 00:00 sind 70 min. 00:00 bis 01:20 sind 80 min.', '70 + 80 = 150 min = 2 h 30 min.'],
      frage('Welche Information brauchst du bei Ankunft um 01:20 und Abfahrt um 22:50?', ['Den Wochentagsnamen.', 'An welchem Tag der Zug ankommt.'], 1, ['Der Name des Tages ist für die Dauer unerheblich.', 'Genau. Der Tageswechsel gehört zur Rechnung.']), 'clock')
  ],
  vertiefung: {skill: 'z-fahrplan', title: 'Schaffst du den Anschluss?', text: ['Ein Fahrplan enthält Fahrzeiten, Umsteigewege und Wartezeiten. Berechne, wie viel Zeit dir am Bahnsteig bleibt.'], merksatz: 'Ziehe vom Zeitfenster die benötigte Gehzeit ab.', beispiel: {aufgabe: 'Ankunft 09:48, Abfahrt 10:05, Fußweg 6 min. Wie viel Zeit bleibt?', schritte: ['Bis 10:00 sind es 12 min, danach 5 min.', '17 min − 6 min = 11 min Reserve.']}},
  merkwissen: {stuetzpunkte: [['1 min','60 Sekunden'],['1 h','60 Minuten'],['1 Tag','24 Stunden'],['¼ h','15 Minuten']], merksaetze: ['Beim Wechsel zur kleineren Einheit multiplizierst du.', 'Eine Uhrzeit nennt einen Zeitpunkt. Eine Dauer gibt an, wie viel Zeit vergeht.'], fehler: [{fehler:'1,5 h = 1 h 5 min',richtig:'0,5 h = 30 min, also 1 h 30 min.'},{fehler:'Von 23:50 bis 00:10 vergehen 40 Minuten.',richtig:'10 Minuten bis Mitternacht plus 10 Minuten danach ergeben 20 Minuten.'}], strategie: ['Markiere Start und Ende.', 'Beachte den Tag der Ankunft.', 'Rechne in einer gemeinsamen Einheit.', 'Prüfe deine Dauer durch Vorwärtszählen.']}
};
