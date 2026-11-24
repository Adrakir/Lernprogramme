import {useRef,type ReactNode} from 'react';
export function Rastertasten({children,loeschen}:{children:ReactNode;loeschen:(k:string,v:string)=>void}){
 const rahmen=useRef<HTMLDivElement>(null),letztes=useRef<HTMLInputElement|null>(null);
 function bedienen(aktion:number){
   const felder=Array.from(rahmen.current?.querySelectorAll<HTMLInputElement>('input:not(:disabled)')??[]);
   if(!felder.length)return;
   const i=felder.indexOf(letztes.current!);
   const ziel=felder[i<0?0:Math.min(felder.length-1,Math.max(0,i+aktion))];
   if(aktion===0&&ziel.dataset.feld)loeschen(ziel.dataset.feld,'');
   ziel.focus();ziel.select();
 }
 return <div ref={rahmen} onFocus={e=>{if(e.target instanceof HTMLInputElement)letztes.current=e.target;}}>
 {children}<div className="ad-actions rastertasten">{[[-1,'Vorherige Stelle'],[0,'Stelle löschen'],[1,'Nächste Stelle']].map(([n,label])=><button key={label} className="btn ghost" onClick={()=>bedienen(Number(n))}>{label}</button>)}</div></div>;
}
