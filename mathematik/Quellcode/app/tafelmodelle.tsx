import {useRef, useState} from 'react';
import {Buendeln} from './additionsraster';
import {Punktefeld} from './multiplikationsuebungen';
import {Buendel} from './groessen-modelle';
import {aufgabe} from '@/lib/multiplikation';

const punkte = aufgabe('zerlegen', 0);
const [reihen, spalten] = punkte.zahlen;
const modelle = {
  uebertrag: ['Übertrag zeigen', 'Was wird aus 8 + 5 Einern, wenn du zehn davon bündelst?', '8 + 5 = 13. In der Einerspalte bleibt die 3. Der gebündelte Zehner kommt als Übertrag in die Zehnerspalte.'],
  punkte: ['Punktefeld zerlegen', 'Wie kannst du die Punkte nach der zehnten Spalte teilen und die beiden Felder zum Rechnen nutzen?', reihen+' · '+spalten+' = '+reihen+' · 10 + '+reihen+' · '+(spalten-10)+' = '+reihen*10+' + '+reihen*(spalten-10)+' = '+reihen*spalten+'.'],
  minuten: ['Minuten bündeln', 'Der Regler steht zu Beginn bei 59 Minuten. Was ändert sich, wenn eine Minute hinzukommt?', '59 Minuten + 1 Minute = 60 Minuten. Der erste Balken ist voll: Das ist genau eine Stunde.']
} as const;
type Modell = keyof typeof modelle;

export function Tafelmodelle() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [modell, waehlen] = useState<Modell>('uebertrag');
  const [loesung, zeigen] = useState(false);
  const [runde, zurueck] = useState(0);
  function neu() { zeigen(false); zurueck(n => n + 1); }
  function oeffnen(id: Modell) { waehlen(id); neu(); dialog.current?.showModal(); }
  const [titel, frage, erklaerung] = modelle[modell];
  return <section className="panel"><h2>Modelle für die Tafel</h2>
    <div className="ad-actions">{(Object.keys(modelle) as Modell[]).map(id =>
      <button className="btn ghost" key={id} onClick={() => oeffnen(id)}>{modelle[id][0]}</button>)}</div>
    <dialog className="tafel-dialog" ref={dialog} aria-labelledby="tafel-titel" onClose={neu}>
      <div className="tafel-kopf"><h2 id="tafel-titel">{titel}</h2><button className="btn ghost" onClick={() => dialog.current?.close()}>Schließen</button></div>
      <p className="tafel-frage">{frage}</p>
      {dialog.current?.open && <div key={runde} className="tafel-modell">
        {modell === 'uebertrag' && <Buendeln summe={13} stelle={0}/>}
        {modell === 'punkte' && <Punktefeld a={punkte}/>}
        {modell === 'minuten' && <Buendel paar={['min','h',60]} tafel/>}
      </div>}
      <div className="ad-actions"><button className="btn" aria-expanded={loesung} onClick={() => zeigen(!loesung)}>{loesung ? 'Ergebnis ausblenden' : 'Ergebnis einblenden'}</button><button className="btn ghost" onClick={neu}>Modell zurücksetzen</button></div>
      {loesung && <p className="tafel-frage" role="status">{erklaerung}</p>}
    </dialog>
  </section>;
}
