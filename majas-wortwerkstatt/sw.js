/* Service Worker für Majas Wortwerkstatt.
 * Update-freundlich: HTML immer zuerst aus dem Netz (Fallback Cache),
 * übrige Dateien aus dem Cache mit Nachladen. Keine Lerndaten im Cache –
 * Lernstände bleiben ausschließlich in localStorage. */
'use strict';
const CACHE='majas-wortwerkstatt-v16';
const CORE=[
  './mobile-start.css',
  './maja-plus.css',
  './maja-plus.js',
  './comic-kino.js',
  './comic-kino.css',
  './comic-studio.js',
  './comic-studio.css',
  './comic-bubbles.js',
  './comic-bubbles.css',
  './figurenstimmen.js',
  './figurenstimmen.css',
  './baerli-neue-sachen.js',
  './baerli-saison.js',
  './baerli-baumhaus.js',
  './baerli-baumhaus.css',
  './baerli-advent.js',
  './baerli-advent.css',
  './baerli-kleiderschrank.js',
  './baerli-kleiderschrank.css',
  './diktat-audio.js',
  './manifest.webmanifest',
  './baerli/baerli.webp',
  './baerli/leseecke.webp',
  './baerli/werkstatt.webp',
  './baerli/kostuemkiste.webp',
  ...['das-fahrrad-das-klingelte', 'das-fenster-voller-sterne', 'das-fernrohr-aus-pappe', 'das-lesezeichen-im-buch', 'der-falsche-kuchen', 'der-kiesel-im-schuh', 'der-koffer-mit-dem-loch', 'der-schatten-an-der-wand', 'die-geheime-trommel', 'die-letzte-kastanie', 'die-muetze-im-apfelbaum', 'die-pfuetze-mit-dem-himmel', 'ein-brief-ohne-namen', 'rettung-fuer-eine-schnecke']
    .map(name=>'./anna-audio/'+name+'.mp3')
];
const shellUrl=new URL('index.html',self.registration.scope).href;

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const shell=await fetch(shellUrl,{cache:'reload'});
    if(!shell.ok)throw new Error('Wortwerkstatt konnte nicht vorgeladen werden.');
    const markup=await shell.clone().text();
    // Keep the exact query versions referenced by the offline HTML.
    const links=[...markup.matchAll(/(?:src|href)="(\.\/[\w.-]+\.(?:css|js)(?:\?[^"]+)?)"/g)];
    const files=CORE.filter(file=>!links.some(([,link])=>link.split('?')[0]===file));
    await cache.addAll([...new Set([...files,...links.map(([,link])=>link)])].map(file=>new Request(file,{cache:'reload'})));
    await cache.put(shellUrl,shell);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>/^majas-wortwerkstatt-v\d+$/.test(key)&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function audioRange(request,response){
  const range=/^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range'));
  if(!range||(!range[1]&&!range[2]))return fetch(request);
  const audio=await response.blob();
  const start=range[1]?Number(range[1]):Math.max(0,audio.size-Number(range[2]));
  const end=range[1]&&range[2]?Math.min(Number(range[2]),audio.size-1):audio.size-1;
  if(start>end||start>=audio.size){
    return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+audio.size}});
  }
  const chunk=audio.slice(start,end+1,audio.type);
  return new Response(chunk,{status:206,headers:{
    'Accept-Ranges':'bytes','Content-Type':audio.type,'Content-Length':String(chunk.size),
    'Content-Range':'bytes '+start+'-'+end+'/'+audio.size
  }});
}
async function serve(request,url){
  const cache=await caches.open(CACHE);
  const isShell=url.pathname===new URL(self.registration.scope).pathname||url.pathname===new URL(shellUrl).pathname;
  if(request.mode==='navigate'||(request.headers.get('accept')||'').includes('text/html')){
    try{
      const response=await fetch(request);
      // The installed shell and its assets stay paired for offline use.
      if(response.ok&&!isShell)await cache.put(request,response.clone()).catch(()=>{});
      return response;
    }catch{
      return await cache.match(isShell?shellUrl:request)||new Response('Diese Seite ist offline noch nicht verfügbar.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
  }
  const cached=await cache.match(request);
  if(request.headers.has('range')){
    return cached&&url.pathname.endsWith('.mp3')?audioRange(request,cached):fetch(request);
  }
  if(cached)return cached;
  const response=await fetch(request);
  if(response.status===200)await cache.put(request,response.clone()).catch(()=>{});
  return response;
}

self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method==='GET'&&url.href.startsWith(self.registration.scope))event.respondWith(serve(request,url));
});
