/* Offline-Start der bestehenden, eigenständigen Erdkunde-App auf GitHub Pages. */
const CACHE='erdkunde-v11-thementraining-20261030-v19';
const APP='./index.html';
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.add(new Request(APP,{cache:'reload'}))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('erdkunde-entdecker-pages-')||key.startsWith('erdkunde-v11-'))&&key!==CACHE).map(key=>caches.delete(key)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||request.mode!=='navigate')return;
 const url=new URL(request.url);
 if(url.origin!==location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(APP,copy)));}
  return response;
 }).catch(()=>caches.match(APP).then(cached=>cached||Response.error())));
});
