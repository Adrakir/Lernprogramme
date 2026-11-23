export type Kriterium={name:string;ok:boolean;folge?:boolean};
export function folgepunkt(name:string,richtig:boolean,schluessig:boolean):Kriterium{
 return {name,ok:richtig||schluessig,folge:!richtig&&schluessig};
}
function lernziel(name:string,thema:string){
 if(/Quotientenziffer/.test(name))return 'Quotientenziffer bestimmen';
 if(/Teilzahl/.test(name))return 'Nächste Teilzahl bilden';
 if(/Abzuziehendes Vielfaches/.test(name))return 'Passendes Vielfaches berechnen';
 if(/ · (Rest|Endrest)$/.test(name))return 'Rest berechnen';
 if(/Gesamtprodukt/.test(name))return 'Teilprodukte addieren';
 if(/Teilprodukt der/.test(name))return 'Teilprodukte stellenrichtig eintragen';
 if(/Übertrag/.test(name))return 'Überträge bestimmen';
 if(/Verfügbar/.test(name))return 'Stellen entbündeln';
 if(/Ausrichtung/.test(name))return 'Zahlen stellenrichtig ausrichten';
 if(/^(Differenz|Ergebnis) · /.test(name)||/Ergebnisziffer/.test(name))return 'Ergebnisziffer bestimmen';
 return thema;
}
export function lernziele(ergebnisse:{titel:string;punkte:Kriterium[]}[]){
 const gruppen=new Map<string,{titel:string;richtig:number;folge:number;gesamt:number}>();
 for(const e of ergebnisse)for(const p of e.punkte){
  const titel=lernziel(p.name,e.titel),g=gruppen.get(titel)??{titel,richtig:0,folge:0,gesamt:0};
  g.gesamt++;if(p.folge)g.folge++;else if(p.ok)g.richtig++;gruppen.set(titel,g);
 }
 return [...gruppen.values()].sort((a,b)=>a.richtig/a.gesamt-b.richtig/b.gesamt);
}
