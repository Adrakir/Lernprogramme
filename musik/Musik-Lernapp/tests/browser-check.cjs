// Real Chromium smoke test without extra npm dependencies.
// Run: node tests/browser-check.cjs
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const http=require('node:http'),{spawn}=require('node:child_process');
const {setTimeout:delay}=require('node:timers/promises');
const root=path.resolve(__dirname,'..');
const artifacts=path.join(__dirname,'artifacts');
fs.mkdirSync(artifacts,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost/').pathname);
  const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,'');
  const file=path.resolve(root,relative);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const info=fs.statSync(file);
  if(!info.isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(404);res.end(String(err.message));}
});
const errors=[],checks=[];
const check=(condition,message)=>{checks.push(message);assert.ok(condition,message);};
function findBrowser(){
 const options=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
 const found=options.find(f=>fs.existsSync(f));
 if(!found)throw Error('No Chrome/Chromium installation. Set CHROME_BIN.');
 return found;
}
async function serve(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function waitFor(getter,timeout=10000){
 const start=Date.now();
 while(Date.now()-start<timeout){try{const value=await getter();if(value)return value;}catch{}
  await delay(150);
 }
 throw Error('Timeout waiting for browser condition');
}
async function main(){
 const url=await serve();
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'music-browser-'));
 const chrome=spawn(findBrowser(),['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--autoplay-policy=no-user-gesture-required','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
 let ws,seq=0;const pending=new Map();
 try{
  const debuggerFile=path.join(profile,'DevToolsActivePort');
  const port=await waitFor(()=>fs.existsSync(debuggerFile)&&Number(fs.readFileSync(debuggerFile,'utf8').split('\n')[0]));
  const tab=await waitFor(async()=>{const r=await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent(url),{method:'PUT'});return r.ok?await r.json():null;});
  ws=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  ws.addEventListener('message',event=>{
   const data=JSON.parse(event.data.toString());
   if(data.id){const p=pending.get(data.id);if(p){pending.delete(data.id);data.error?p.reject(Error(data.error.message)):p.resolve(data.result);}}
   if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.text);
  });
  const cdp=(method,params={})=>new Promise((resolve,reject)=>{
   const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));
  });
  const expression=async src=>{
   const r=await cdp('Runtime.evaluate',{expression:src,returnByValue:true,awaitPromise:true,userGesture:true});
   if(r.exceptionDetails)throw Error('Browser expression: '+(r.exceptionDetails.text||JSON.stringify(r.exceptionDetails)));
   return r.result.value;
  };
  await cdp('Page.enable');await cdp('Runtime.enable');
  const sizes=[{width:390,height:844,name:'iphone'},{width:320,height:730,name:'small-phone'},{width:1366,height:850,name:'desktop'}];
  for(const size of sizes){
   await cdp('Emulation.setDeviceMetricsOverride',{width:size.width,height:size.height,screenWidth:size.width,screenHeight:size.height,deviceScaleFactor:1,mobile:size.width<800});
   await cdp('Page.navigate',{url:url});
   await waitFor(()=>expression('Boolean(document.querySelector("#simpleStudent")||document.querySelector("#guideResume"))'));
   await expression('document.querySelector("#simpleStudent")?.click()');
   await waitFor(()=>expression('Boolean(document.querySelector("#guideResume"))'));
   check(await expression('document.querySelectorAll(".cleanAction").length')===3,'Three student start choices at '+size.name);
   await expression('pathSelect(MUSIC_PATH.findIndex(d=>d.key==="teile"),1)');
   await waitFor(()=>expression('Boolean(document.querySelector("#anatomyExample"))'));
   await expression('document.querySelector(\'[data-anatomy="4"]\').click()');
   check(await expression('document.querySelector("#anatomyExample").textContent.includes("1½ Schläge")'),'Dot duration demonstration at '+size.name);
   await expression('document.querySelector(\'[data-anatomy="3"]\').click()');
   check(await expression('document.querySelector("#anatomyExample").textContent.includes("zwei Achtelnoten")'),'Two eighth notes shown at '+size.name);
   check(await expression('(document.querySelector(".partBeamExample .pathScore").scrollWidth-document.querySelector(".partBeamExample .pathScore").clientWidth)<3'),'Short bar fits without scrolling at '+size.name);
   const screenshot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
   fs.writeFileSync(path.join(artifacts,size.name+'-balken.png'),Buffer.from(screenshot.data,'base64'));
   await expression('pathSelect(MUSIC_PATH.findIndex(d=>d.key==="abschluss"),1)');
   await waitFor(()=>expression('Boolean(document.querySelector(".pathScore"))'));
   if(size.width<800){
    const hasOverflow=await expression('Array.from(document.querySelectorAll(".pathScore")).some(x=>x.scrollWidth>x.clientWidth+3)');
    check(hasOverflow,'Long music score is actually scrollable at '+size.name);
    check(await expression('Array.from(document.querySelectorAll(".mobileScrollControls")).some(x=>!x.hidden)'),'Visible arrows for a long score at '+size.name);
    await expression('document.querySelector(".mobileScrollControls [data-mobile-scroll=right]").click()');
    check(await expression('Array.from(document.querySelectorAll(".pathScore")).some(x=>x.scrollLeft>0)'),'Right arrow really scrolls at '+size.name);
   }
   check(await expression('document.querySelectorAll("nav.mainNav button").length')===5,'Five main navigation choices at '+size.name);
  }
  console.log('PASS: '+checks.length+' real Chromium checks ('+checks.join(', ')+')');
  if(errors.length)console.warn('Browser exception reports: '+errors.slice(0,12).join('; '));
 }finally{
  try{ws?.close()}catch{}
  chrome.kill('SIGTERM');server.close();
  fs.rmSync(profile,{recursive:true,force:true});
 }
}
main().catch(e=>{console.error('FAIL: '+e.stack);process.exitCode=1;server.close();});
