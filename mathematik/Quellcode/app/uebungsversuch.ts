import {useRef} from 'react';
import {notieren} from '@/lib/lernatelier';

export function useUebungsversuch() {
  const stand = useRef({versuche: 0, hilfe: false, abgeschlossen: false});
  function hinweis() { stand.current.hilfe = true; }
  function zuruecksetzen() {
    stand.current = {versuche: 0, hilfe: false, abgeschlossen: false};
  }
  function pruefen(ziel: string, frage: string, richtig: boolean) {
    const s = stand.current;
    if (s.abgeschlossen) return;
    s.versuche++;
    const status = richtig ? (s.hilfe || s.versuche > 1 ? 'hilfe' : 'selbst') : 'offen';
    notieren(ziel, frage, status, false, s.versuche === 1, s.hilfe);
    s.abgeschlossen = richtig;
    return status;
  }
  return {hinweis, zuruecksetzen, pruefen};
}
