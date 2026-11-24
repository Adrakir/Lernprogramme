import {useRef} from 'react';
import {notieren} from '@/lib/lernatelier';

export type Versuch = {aufgabenId:string;versuche:number;hilfe:boolean;abgeschlossen:boolean};
export function useUebungsversuch(alt?:Versuch) {
  const stand = useRef(alt ?? {aufgabenId: '', versuche: 0, hilfe: false, abgeschlossen: false});
  function hinweis() { stand.current.hilfe = true; }
  function zuruecksetzen() {
    stand.current = {aufgabenId: '', versuche: 0, hilfe: false, abgeschlossen: false};
  }
  function pruefen(ziel: string, frage: string, richtig: boolean, wiederholung = false) {
    const s = stand.current;
    if (s.abgeschlossen) return;
    if (!s.aufgabenId) s.aufgabenId = Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16).padStart(8,'0')).join('');
    s.versuche++;
    const status = richtig ? (s.hilfe || s.versuche > 1 ? 'hilfe' : 'selbst') : 'offen';
    notieren(ziel, frage, status, wiederholung, s.versuche === 1, s.hilfe, {aufgabenId:s.aufgabenId,versuche:s.versuche});
    s.abgeschlossen = richtig;
    return status;
  }
  return {stand,hinweis, zuruecksetzen, pruefen};
}
