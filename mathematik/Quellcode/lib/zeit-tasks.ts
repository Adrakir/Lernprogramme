import type {Skill} from './groessen-tasks';
import {fmtNum, type NumberField, type Trap} from './groessen-core.ts';

export function uhr(min: number) {
  const m = min % 1440;
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}
function feld(id: string, answer: number, suffix: string, traps?: Trap[]): NumberField {
  return {kind:'number', id, answer, suffix, traps};
}
export const zeitSkills: Skill[] = [
  {id:'z-einheiten', bereich:'zeit', title:'Zeiteinheiten wechseln', goal:'Ich rechne mit 60 und 24 in beide Richtungen.', make(r, lv) {
    const [gross, klein, faktor] = r.pick<readonly [string,string,number]>(lv === 3 ? [['h','s',3600],['Tage','min',1440]] as const : [['min','s',60],['h','min',60],['Tage','h',24]] as const);
    const n = r.int(2,12), runter = lv === 1 || (lv === 3 && r.int(0,1) === 1);
    const wert = runter ? n : n*faktor, ziel = runter ? klein : gross, erg = runter ? n*faktor : n;
    return {prompt:`Rechne um: ${wert} ${runter ? gross : klein} = wie viele ${ziel}?`, fields:[feld('a',erg,ziel)], hints:['Ist die Zieleinheit größer oder kleiner?',`Eine große Einheit enthält ${faktor} kleine Einheiten.`,`Rechne ${wert} ${runter ? '·' : ':'} ${faktor}.`], solution:[`${wert} ${runter ? '·' : ':'} ${faktor} = ${erg}. Ergebnis: ${erg} ${ziel}.`]};
  }},
  {id:'z-mischen', bereich:'zeit', title:'Gemischte Angaben', goal:'Ich bündle und zerlege Zeitangaben.', make(r,lv) {
    const h=r.int(1,8), m=r.int(1,59), rest=r.int(1,59), total=h*60+m;
    if(lv===1) return {prompt:`Wie viele Minuten sind ${h} h ${m} min?`,fields:[feld('a',total,'min',[{value:h*100+m,message:'Eine Stunde hat 60 Minuten. Wandle die Stunden zuerst um.'}])],hints:['Wandle zuerst die Stunden um.','1 h = 60 min.',`Addiere ${m} zu ${h} · 60.`],solution:[`${h} · 60 + ${m} = ${total} min.`]};
    const seconds=lv===3, value=seconds ? total*60+rest : total;
    return {prompt:`Zerlege ${value} ${seconds?'Sekunden':'Minuten'} in volle Stunden und übrige Minuten${seconds?' und Sekunden':''}.`,fields:[feld('h',h,'h'),feld('m',m,'min'),...(seconds?[feld('s',rest,'s')]:[])],hints:['Beginne mit der größten Einheit.',seconds?'1 h = 3.600 s.':'1 h = 60 min.','Teile mit Rest. Bündle aus dem Rest so viele volle Einheiten wie möglich.'],solution:[`${total} min = ${h} · 60 min + ${m} min.`,...(seconds?[`${value} s = ${total} · 60 s + ${rest} s.`]:[])]};
  }},
  {id:'z-dezimal',bereich:'zeit',title:'Dezimalstunden',goal:'Ich wechsle zwischen Dezimalstunden und Minuten.',make(r,lv){
    const h=r.int(1,5), m=r.pick(lv===1?[15,30,45]:[6,12,18,24,36,42,48,54]), dec=h+m/60,total=h*60+m, reverse=lv===3;
    return {prompt:reverse?`Schreibe ${total} Minuten als Dezimalstunden.`:`Wie viele Minuten sind ${fmtNum(dec)} Stunden?`,fields:[feld('a',reverse?dec:total,reverse?'h':'min')],hints:['Trenne die vollen Stunden vom Rest.','Eine Stunde enthält 60 Minuten.',reverse?`Teile die übrigen ${m} Minuten durch 60.`:`Multipliziere ${fmtNum(m/60)} mit 60 und addiere die vollen Stunden in Minuten.`],solution:[`${h} h = ${h*60} min. ${fmtNum(m/60)} h = ${m} min.`,`${fmtNum(dec)} h = ${total} min.`]};
  }},
  ...(['z-spanne','z-nacht','z-fahrplan'] as const).map((id):Skill=>({id,bereich:'zeit',title:{'z-spanne':'Zeitspannen','z-nacht':'Tageswechsel','z-fahrplan':'Anschluss im Fahrplan'}[id],goal:id==='z-fahrplan'?'Ich plane Umstiege mit Gehzeit und Verspätung.':'Ich berechne die Dauer zwischen zwei Uhrzeiten.',vertiefung:id==='z-fahrplan',make(r,lv){
    const nacht=id==='z-nacht', plan=id==='z-fahrplan';
    const start=(nacht? (lv===3?22:23):r.int(7,17))*60+r.int(35,55);
    const stop=nacht?1440+r.int(1, lv*40):start+r.int(30,45)+(lv-1)*40;
    const dauer=stop-start, weg=plan?r.int(3,12):0, spaet=plan&&lv>1?r.int(4,15):0, zusatz=plan&&lv===3?r.int(2,8):0;
    const prompt=plan?`Planmäßige Ankunft ${uhr(start)} Uhr, Anschluss ${uhr(stop)} Uhr. Der Weg dauert ${weg} min.${spaet?' Dein Zug kommt '+spaet+' min später an.':''}${zusatz?' Für den Fahrkartenkauf brauchst du weitere '+zusatz+' min.':''} Wie viele Minuten bleiben übrig?`:`Start um ${uhr(start)} Uhr, Ende ${nacht?'am folgenden Tag':'am selben Tag'} um ${uhr(stop)} Uhr. Wie lange dauert es${lv===3?' in ganzen Stunden und Restminuten':' in Minuten'}?`;
    const zwischen=nacht?1440:(Math.floor(start/60)+1)*60;
    const erg=dauer-weg-spaet-zusatz;
    return {prompt,fields:!plan&&lv===3?[feld('h',Math.floor(dauer/60),'h'),feld('m',dauer%60,'min')]:[feld('a',erg,'min')],hints:['Markiere beide Uhrzeiten auf einer Zeitlinie.',`Nutze ${uhr(zwischen)} Uhr als Zwischenstopp.`,plan?'Ziehe Gehzeit und alle weiteren benötigten Minuten vom Zeitfenster ab.':'Zähle die Teilstrecken zusammen. 60 Minuten bilden eine Stunde.'],solution:[`${uhr(start)} bis ${uhr(zwischen)}: ${zwischen-start} min. Weiter bis ${uhr(stop)}: ${stop-zwischen} min.`,`Zusammen ${dauer} min = ${Math.floor(dauer/60)} h ${dauer%60} min.`,...(plan?[`Reserve: ${dauer} − ${weg}${spaet?' − '+spaet:''}${zusatz?' − '+zusatz:''} = ${erg} min.`]:[])]};
  }}))
];
