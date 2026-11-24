import {useRef} from 'react';
import {notieren} from '@/lib/lernatelier';

export function useUebungsversuch() {
  const stand = useRef({aufgabenId: '', versuche: 0, hilfe: false, abgeschlossen: false});
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
  return {hinweis, zuruecksetzen, pruefen};
}
