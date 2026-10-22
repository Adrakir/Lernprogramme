'use strict';
const fs=require('node:fs'),path=require('node:path');
const xml=fs.readFileSync(path.join(__dirname,'diepholz.osm'),'utf8');
const decode=s=>s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const tags=s=>Object.fromEntries([...s.matchAll(/<tag\s+([^>]+)\/>/g)].map(m=>{const a=attrs(m[1]);return [a.k,a.v]}));
const nodes=new Map(),features=[];
const wanted=t=>t.highway||t.building||t.waterway||t.landuse==='forest'||t.natural==='wood'||t.shop==='supermarket'||t.amenity==='school';
for(const m of xml.matchAll(/<node\s+([^>]+?)(?:\/>|>([\s\S]*?)<\/node>)/g)){
 const a=attrs(m[1]),p=[+a.lon,+a.lat],t=tags(m[2]||'');
 nodes.set(a.id,p);
 if(wanted(t))features.push({id:'node/'+a.id,tags:t,points:[p]});
}
for(const m of xml.matchAll(/<way\s+([^>]+)>([\s\S]*?)<\/way>/g)){
 const a=attrs(m[1]),t=tags(m[2]);
 if(!wanted(t))continue;
 const points=[...m[2].matchAll(/<nd ref="(\d+)"\/>/g)].map(n=>nodes.get(n[1])).filter(Boolean);
 if(points.length>1)features.push({id:'way/'+a.id,tags:t,points});
}
const data={source:'https://www.openstreetmap.org/api/0.6/map?bbox=8.349,52.594,8.375,52.609',attribution:'© OpenStreetMap-Mitwirkende, ODbL 1.0',snapshot:'2026-10-21',bounds:[8.349,52.594,8.375,52.609],features};
fs.writeFileSync(path.join(__dirname,'diepholz-data.js'),'/* OSM-Geodaten: Quelle und ODbL-Lizenz in DIEPHOLZ_KARTENQUELLE.md. */\nconst GEO_DIEPHOLZ='+JSON.stringify(data)+';\n');
console.log(features.length+' echte Kartenobjekte');
console.log(features.filter(f=>f.tags.shop==='supermarket'||f.tags.waterway==='river'||f.tags.landuse==='forest'||f.tags.natural==='wood'||f.tags.amenity==='school').map(f=>({id:f.id,name:f.tags.name,kind:f.tags.shop||f.tags.waterway||f.tags.landuse||f.tags.natural||f.tags.amenity})));
