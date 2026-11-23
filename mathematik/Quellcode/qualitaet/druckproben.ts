import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {additionsheft} from '../lib/addition-heft.ts';
import {subtraktionsheft} from '../lib/subtraktion-heft.ts';
import {malheft} from '../lib/multiplikation-heft.ts';
import {divisionsheft} from '../lib/division-heft.ts';
import {namen as plus} from '../lib/addition.ts';
import {namen as minus} from '../lib/subtraktion.ts';
import {namen as mal} from '../lib/multiplikation.ts';
import {namen as geteilt} from '../lib/division.ts';
import {unterrichtsheft} from '../lib/unterricht-heft.ts';
import {blattaufgabe,faecher} from '../lib/lernatelier.ts';
const dir=process.argv[2];mkdirSync(dir,{recursive:true});
function speichern(n:string,d:ReturnType<typeof malheft>){writeFileSync(join(dir,n+'.pdf'),Buffer.from(d.output('arraybuffer')));}
function alle<T extends string>(name:string,keys:T[],heft:(ziele:T[],seed:number)=>ReturnType<typeof malheft>){for(const k of keys)speichern(name+'-'+k,heft([k],987654));}
alle('addition',[...Object.keys(plus) as (keyof typeof plus)[],'raster','raster3'],additionsheft);
alle('subtraktion',[...Object.keys(minus) as (keyof typeof minus)[],'raster','nullkette'],subtraktionsheft);
alle('division',Object.keys(geteilt) as (keyof typeof geteilt)[],divisionsheft);
alle('multiplikation',Object.keys(mal) as (keyof typeof mal)[],malheft);
speichern('klassenarbeit',unterrichtsheft(faecher.map((f,i)=>blattaufgabe(f,9876,i)),'Klassenarbeit A'));
for(const f of ['daten','geometrie'] as const)speichern('zeichnen-'+f,unterrichtsheft([0,1,2].map(i=>blattaufgabe(f,987*i+1,i)),'Zeichnen im Heft',true));
