import {groessenangabe} from './groessen-core.ts';

export function gewichtPruefen(text:string, gramm:number, inGramm:boolean) {
  const menge=groessenangabe(text,'masse');
  if(!menge)return 'Schreibe eine Zahl mit g oder kg.';
  if(menge.basis!==gramm*1000)return 'Prüfe die Menge: 1 kg entspricht 1.000 g.';
  if(inGramm && menge.einheiten.some(u=>u!=='g'))return 'Die Menge stimmt. Gib sie jetzt vollständig in Gramm an.';
  return 'Richtig: '+gramm.toLocaleString('de-DE')+' g.';
}
export function uebertraege(a:number,b:number){
  const stellen:string[]=[];let uebertrag=0;
  for(let i=0;a||b;i++){
    uebertrag=Math.floor((a%10+b%10+uebertrag)/10);
    if(uebertrag) stellen.push(['Einern','Zehnern','Hundertern','Tausendern'][i]);
    a=Math.floor(a/10); b=Math.floor(b/10);
  }
  return stellen;
}
export function divisionsTipp(q:number,eingabe:number|null,d:number){
  if(eingabe===Number(String(q).replace('0','')) && q>=100) return 'Prüfe die Zehnerstelle: Welche Ziffer steht dort, wenn der Divisor keinmal passt?';
  if(eingabe!==null && eingabe!==q && Math.floor(eingabe/10)===Math.floor(q/10))
    return 'Hunderter und Zehner stimmen. Wie oft passt '+d+' in die letzte Teilzahl? Prüfe die Einerstelle.';
  return 'Prüfe die Zehnerstelle im Quotienten. Hole eine Ziffer nach der anderen herunter und kontrolliere mit der Multiplikation.';
}
export function zeitZerlegen(minuten:number){return {stunden:Math.floor(minuten/60),minuten:minuten%60};}
