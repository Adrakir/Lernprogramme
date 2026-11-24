import {useState} from 'react';
import {blattaufgabe, themen} from '@/lib/lernatelier';
import {plainNumber} from '@/lib/groessen-core';
import {useUebungsversuch} from './uebungsversuch';
import {Speak} from './widgets';

type Rechenart = 'addition' | 'subtraktion' | 'multiplikation' | 'division';
type Status = 'selbst' | 'hilfe' | 'offen';
const rechenarten: Rechenart[] = ['addition', 'subtraktion', 'multiplikation', 'division'];

export function Kurzrunde({fach}: {fach: Rechenart}) {
  const [seed, setSeed] = useState<number | null>(null);
  const [bilanz, setBilanz] = useState<Status[]>([]);
  const [antwort, setAntwort] = useState('');
  const [hilfe, setHilfe] = useState(false);
  const [bewertung, setBewertung] = useState<Status | null>(null);
  const versuch = useUebungsversuch();
  const [ersterFehler, setErsterFehler] = useState<string | null>(null);
  function hinweisZeigen() {
    versuch.hinweis();
    setHilfe(true);
  }
  function neueAntwort() {
    versuch.zuruecksetzen();
    setErsterFehler(null);
    setAntwort('');
    setHilfe(false);
    setBewertung(null);
  }
  function starten() {
    setSeed(Math.floor(Math.random() * 1000000));
    setBilanz([]);
    neueAntwort();
  }
  const index = bilanz.length;
  const a = blattaufgabe(index === 2 ? 'sach' : fach, (seed ?? 0) + index * 7919, rechenarten.indexOf(fach));
  const zehner = Math.round(a.antwort / 10) * 10;
  const frage = index === 1 ? a.text.replace('Zeige deine Zwischenschritte.', 'Runde dein Ergebnis auf den nächsten Zehner.') : a.text;
  const erwartet = index === 1 ? zehner : a.antwort;
  const weg = index === 1 ? a.weg + ' Auf Zehner gerundet: ' + zehner + '.' : a.weg;
  const [x, y] = a.werte;
  const tipps = {
    addition: `Beginne rechts mit ${x % 10} + ${y % 10}. Welche Ziffer bleibt bei den Einern und was trägst du zu den Zehnern weiter?`,
    subtraktion: `Bei den Einern stehen ${x % 10} und ${y % 10}. Du brauchst einen Zehner. Schau auf die Null in der Zehnerspalte: Von welcher Stelle kannst du zuerst tauschen?`,
    multiplikation: `Zerlege ${y} in ${y - y % 10} und ${y % 10}. Multipliziere beide Teile mit ${x} und addiere die Teilprodukte.`,
    division: `Prüfe die Zehnerstelle im Quotienten. Passt ${y} nach dem Herunterholen keinmal in die nächste Teilzahl? Auch diese Stelle braucht eine Ziffer.`
  };
  const tipp = index === 1 ? 'Rechne zuerst genau. Die Einerstelle entscheidet: Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.' : index === 2 ? a.weg.split(':')[0] + '. Zeichne die Mengen und rechne noch einmal.' : tipps[fach];
  function pruefen() {
    if (bewertung || plainNumber(antwort) === null || antwort.trim() === ersterFehler) return;
    const richtig = plainNumber(antwort) === erwartet;
    const status = versuch.pruefen(themen[fach] + ' · ' + ['Schriftlich rechnen', 'Ergebnis runden', 'Sachaufgabe'][index], frage, richtig);
    if (!richtig && ersterFehler === null) {
      setErsterFehler(antwort.trim());
      hinweisZeigen();
    } else if (status) setBewertung(status);
  }
  return <section className="panel"><h2>Kurzrunde mit drei Aufgaben</h2>
    {seed === null ? <><p>Rechne im Heft, runde ein Ergebnis und löse eine Sachaufgabe.</p><button className="btn" onClick={starten}>Kurzrunde starten</button></> :
      index === 3 ? <div role="status"><p>{bilanz.filter(s => s === 'selbst').length} von 3 selbstständig gelöst. Mit Hinweis gelöst: {bilanz.filter(s => s === 'hilfe').length}. Noch üben: {bilanz.filter(s => s === 'offen').length}.</p><button className="btn" onClick={starten}>Neue Kurzrunde</button></div> :
      <><h3>Aufgabe {index + 1} von 3</h3><p>{frage} <Speak text={frage}/></p>
        <form onSubmit={e => {e.preventDefault(); pruefen();}}>
          <label>{index === 1 ? 'Gerundetes Ergebnis' : 'Ergebnis'} {a.einheit && 'in ' + a.einheit}<input inputMode="numeric" value={antwort} disabled={!!bewertung} onChange={e => setAntwort(e.target.value)}/></label>
          {!bewertung && <div className="ad-actions"><button className="btn" disabled={plainNumber(antwort) === null || antwort.trim() === ersterFehler}>{ersterFehler === null ? 'Ergebnis prüfen' : 'Korrektur prüfen'}</button><button type="button" className="btn ghost" onClick={hinweisZeigen}>Hinweis zeigen</button></div>}
        </form>
        {hilfe && !bewertung && <p role="status">{ersterFehler !== null && <b>Versuche es noch einmal. </b>}{tipp} <Speak text={tipp}/></p>}
        {bewertung && <div role="status"><p><b>{bewertung === 'offen' ? 'Vergleiche deinen Rechenweg.' : 'Richtig gerechnet.'}</b> {weg} Ergebnis: {erwartet} {a.einheit}.</p><button className="btn" onClick={() => {setBilanz([...bilanz, bewertung]); neueAntwort();}}>{index === 2 ? 'Runde auswerten' : 'Nächste Kurzaufgabe'}</button></div>}
      </>}
  </section>;
}
