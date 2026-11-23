import {useState} from 'react';
import {blattaufgabe, familienhilfe, notieren, themen} from '@/lib/lernatelier';
import {plainNumber} from '@/lib/groessen-core';
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
  function neueAntwort() {
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
  function pruefen() {
    if (bewertung || !antwort.trim()) return;
    const status = plainNumber(antwort) === erwartet ? (hilfe ? 'hilfe' : 'selbst') : 'offen';
    setBewertung(status);
    notieren(themen[fach] + ' · ' + ['Schriftlich rechnen', 'Ergebnis runden', 'Sachaufgabe'][index], frage, status, false, true, hilfe);
  }
  return <section className="panel"><h2>Kurzrunde mit drei Aufgaben</h2>
    {seed === null ? <><p>Rechne im Heft, runde ein Ergebnis und löse eine Sachaufgabe.</p><button className="btn" onClick={starten}>Kurzrunde starten</button></> :
      index === 3 ? <div role="status"><p>{bilanz.filter(s => s === 'selbst').length} von 3 selbstständig gelöst. Mit Hinweis gelöst: {bilanz.filter(s => s === 'hilfe').length}. Noch üben: {bilanz.filter(s => s === 'offen').length}.</p><button className="btn" onClick={starten}>Neue Kurzrunde</button></div> :
      <><h3>Aufgabe {index + 1} von 3</h3><p>{frage} <Speak text={frage}/></p>
        <form onSubmit={e => {e.preventDefault(); pruefen();}}>
          <label>{index === 1 ? 'Gerundetes Ergebnis' : 'Ergebnis'} {a.einheit && 'in ' + a.einheit}<input inputMode="numeric" value={antwort} disabled={!!bewertung} onChange={e => setAntwort(e.target.value)}/></label>
          {!bewertung && <div className="ad-actions"><button className="btn" disabled={!antwort.trim()}>Ergebnis prüfen</button><button type="button" className="btn ghost" onClick={() => setHilfe(true)}>Hinweis zeigen</button></div>}
        </form>
        {hilfe && <p>{index === 1 ? 'Schau auf die Einerstelle. Ab fünf rundest du auf.' : index === 2 ? a.weg : familienhilfe[fach][0]}</p>}
        {bewertung && <div role="status"><p><b>{bewertung === 'offen' ? 'Vergleiche deinen Rechenweg.' : 'Richtig gerechnet.'}</b> {weg} Ergebnis: {erwartet} {a.einheit}.</p><button className="btn" onClick={() => {setBilanz([...bilanz, bewertung]); neueAntwort();}}>{index === 2 ? 'Runde auswerten' : 'Nächste Kurzaufgabe'}</button></div>}
      </>}
  </section>;
}
