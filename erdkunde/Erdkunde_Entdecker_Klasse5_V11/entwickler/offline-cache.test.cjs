'use strict';
/* Simuliert Serviceworker-Aktivierung und Offline-Navigation ohne Netzwerk. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const src=fs.readFileSync(path.join(__dirname,'..','service-worker.js'),'utf8');
 const prefix='erdkunde-v11-thementraining-20261030-';
 const existing=[prefix+'v16',prefix+'v17',prefix+'v18',prefix+'v19','erdkunde-entdecker-pages-old','unrelated-project'];
 const removed=[],handlers={};
 const cache={
  keys:async()=>existing.slice(),
  delete:async key=>{removed.push(key);return true;},
  open:async()=>({add:async()=>undefined,put:async()=>undefined}),
  match:async key=>key==='./index.html'?{ok:true,offline:true}:null
 };
 const scope='https://example.test/Lernprogramme/erdkunde/Erdkunde_Entdecker_Klasse5_V11/';
 const self={
  addEventListener:(event,handler)=>{handlers[event]=handler;},
  skipWaiting:async()=>undefined,
  clients:{claim:async()=>undefined},
  registration:{scope},
  location:{origin:new URL(scope).origin}
 };
 const ctx={self,caches:cache,URL,Promise,Request,location:{origin:new URL(scope).origin},
  fetch:async()=>{throw Error('Network unavailable')},Response:{error:()=>({ok:false})}};
 vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'service-worker.js'});
 let activation;
 handlers.activate({waitUntil:work=>{activation=work}});
 await activation;
 for(const key of [prefix+'v16',prefix+'v17',prefix+'v18','erdkunde-entdecker-pages-old'])
  assert.ok(removed.includes(key),'Alten Cache entfernen: '+key);
 assert.ok(!removed.includes(prefix+'v19'),'Aktuelle Version bleibt erhalten');
 assert.ok(!removed.includes('unrelated-project'),'Caches anderer Apps werden nicht geloescht');
 let reply;
 handlers.fetch({request:{method:'GET',mode:'navigate',url:scope+'index.html'},
  waitUntil:()=>undefined,respondWith:work=>{reply=work}});
 assert.ok(reply,'Offline-Anfrage wird abgefangen');
 const response=await reply;
 assert.ok(response.offline,'Bereits gespeicherte HTML-App startet ohne Netzwerk');
 console.log('PASS: alte Erdkunde-Caches entfernt, fremde Caches erhalten, Offline-Start erfolgreich.');
})().catch(e=>{console.error(e);process.exitCode=1;});
