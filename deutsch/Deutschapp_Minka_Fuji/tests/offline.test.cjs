const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
test('Deutsch-App bleibt nach Erstladen offline benutzbar und sichert Texte lokal',async()=>{
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg'};
 const server=http.createServer(async(req,res)=>{
  let url;try{url=new URL(req.url,'http://localhost')}catch{res.writeHead(400).end();return;}
  const local=path.resolve(ROOT,'.'+decodeURIComponent(url.pathname));
  if(!local.startsWith(ROOT+path.sep)&&local!==ROOT){res.writeHead(403).end();return;}
  const full=local===ROOT?path.join(ROOT,'index.html'):local;
  try{const b=await fs.readFile(full);res.writeHead(200,{'content-type':types[path.extname(full)]||'application/octet-stream','cache-control':'no-store'});res.end(b);}
  catch{res.writeHead(404).end('missing');}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({serviceWorkers:'allow'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:'+port+'/index.html#studio');
  await page.evaluate(()=>navigator.serviceWorker.ready);
  const cache=await page.evaluate(async()=>{
    const names=await caches.keys();const c=await caches.open(names.find(n=>n.startsWith('minka-fuji-deutsch-')));
    const script=(name)=>'./'+Array.from(document.querySelectorAll('script[src]')).map(el=>el.getAttribute('src')).find(src=>src.startsWith(name+'?'));
    const keys=['./index.html',script('studio.js'),script('language-practice.js'),script('language.js'),script('upgrade.js'),'./upgrade-data.js?v=1','./assets/scene-1.webp','./assets/scene-1.jpg','./assets/guides.jpg','./assets/whale.webp','./assets/whale.jpg',script('image-compat.js')];
    return Promise.all(keys.map(async k=>({key:k,available:!!await c.match(k)})));
  });
  assert.ok(cache.every(x=>x.available),JSON.stringify(cache));
  await page.click('[data-page="studio"]');await page.click('[data-studio-view="builder"]');
  await page.selectOption('#up-scene','waldkarte');
  assert.equal(await page.locator('.up-scene svg').count(),6);
  await context.setOffline(true);
  await page.reload();
  const clip=await page.evaluate(async()=>{
   const response=await fetch('./assets/audio/fluestern.mp3',{headers:{Range:'bytes=0-99'}});
   return {status:response.status,length:(await response.arrayBuffer()).byteLength,range:response.headers.get('Content-Range')};
  });
  assert.equal(clip.status,206);assert.equal(clip.length,100);assert.match(clip.range,/^bytes 0-99\/\d+$/);
  await page.locator('[data-page="sprache"]').click();
  await page.locator('[data-language-topic="schluss"]').click();
  assert.equal(await page.locator('#language-jump option').count(),30);
  await page.getByRole('button',{name:'Selbst schreiben (10)'}).click();
  await page.locator('#language-solution summary').click();
  assert.match(await page.locator('#language-solution').textContent(),/Käfer.*Ursache/s);
  await page.locator('[data-page="entdecken"]').click();
  await page.waitForFunction(()=>document.querySelector('#comic-image')?.naturalWidth>0);
  assert.ok(await page.locator('#comic-image').evaluate(img=>img.naturalWidth>0),'Comic-Bild ist offline sichtbar');
  await page.locator('[data-page="studio"]').click();
  await page.click('[data-page="studio"]');await page.click('[data-studio-view="builder"]');
  assert.equal(await page.locator('#up-scene').inputValue(),'waldkarte');
  assert.equal(await page.locator('.up-scene svg').count(),6);
  await page.click('[data-studio-view="portfolio"]');
  await page.fill('#up-reading-text','Das ist mein Text für das Offline-Lernen.');
  await page.reload();
  await page.click('[data-page="studio"]');await page.click('[data-studio-view="portfolio"]');
  assert.match(await page.locator('#up-reading-text').inputValue(),/Offline-Lernen/);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
});
