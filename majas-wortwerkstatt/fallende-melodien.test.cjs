const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),a=html.indexOf('const melodySongs='),b=html.indexOf('function render(initial=false)',a);
const nodes=new Map(),oscillators=[],listeners=new Map();let nextFrame,context;
class Element{constructor(){this.style={};this.classList={toggle(){},add(){},remove(){}};this.dataset={};this.value='';this.checked=false;this.hidden=false;}append(el){nodes.set('[data-note-id="'+el.dataset.noteId+'"]',el);}scrollIntoView(){}setPointerCapture(){} }
function node(key){if(!nodes.has(key))nodes.set(key,new Element());return nodes.get(key);}
const pads=Array.from({length:4},()=>new Element()),barHolders=Array.from({length:4},()=>new Element());
const board={dataset:{level:'1'},innerHTML:'',querySelector(s){if(s.includes('.falling-bars'))return barHolders[Number(s.match(/data-lane="(\d)"/)[1])];return node(s);},querySelectorAll(s){return s==='[data-pad]'?pads:s==='.falling-bars'?barHolders:[];}};
const param=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){},setTargetAtTime(){}});
class Audio{constructor(){context=this;this.currentTime=10;this.state='suspended';this.destination={};}async resume(){this.state='running';}close(){this.state='closed';}createOscillator(){const o={frequency:param(),connect(){},disconnect(){},start(at){this.started=at;},stop(at){this.stopped=at;}};oscillators.push(o);return o;}createGain(){return {gain:param(),connect(){},disconnect(){}};}createBiquadFilter(){return {frequency:param(),connect(){},disconnect(){}};}}
const c={assert,console,Math,Set,Map,Number,JSON,Array,String,window:{AudioContext:Audio,addEventListener(k,f){listeners.set(k,f);},removeEventListener(k){listeners.delete(k);}},document:{hidden:false,createElement(){return new Element();},addEventListener(k,f){listeners.set(k,f);},removeEventListener(k){listeners.delete(k);}},localStorage:{getItem(){return null;},setItem(){}},requestAnimationFrame(f){nextFrame=f;return 1;},cancelAnimationFrame(){},setTimeout,clearTimeout,escapeHtml:s=>s,starGameReward:()=>({message:'2 Sterne'}),prepFireworks:()=>()=>{}};
vm.createContext(c);vm.runInContext(html.slice(a,b),c);c.board=board;
vm.runInContext(`
for(const song of melodySongs){const chart=melodyChart(song);assert.equal(chart.length,melodyNotes(song).length);assert.equal(chart[0].at,3);for(let i=0;i<chart.length;i++){const n=chart[i];assert(n.lane>=0&&n.lane<4);assert(n.duration>0);assert.equal(melodyBar(n,n.at).bottom,350);assert(Math.abs(melodyBar(n,n.at+n.duration).top-350)<1e-9);if(i)assert(n.at>chart[i-1].at+chart[i-1].duration);assert.equal(melodyHit(chart,n.lane,n.at),n);assert(melodyHoldOK(n,n.at,n.at+n.duration));assert(!melodyHoldOK(n,n.at,n.at+.01));}assert.equal(melodyHit(chart,0,-100),null);}
const chart=melodyChart(melodySongs[0]);chart[0].state='hit';assert.equal(melodyHit(chart,chart[0].lane,chart[0].at),null);
playMelody(board);
`,c);
(async()=>{
 node('#fall-sound').value='piano';node('#fall-speed').value='.65';node('#fall-guide').checked=true;
 assert.equal(oscillators.length,0,'No sound before an explicit action');
 await node('#fall-start').onclick();assert.equal(context.state,'running');assert.equal(oscillators.length,32,'The entire guide melody must be audible without hitting any notes');assert.equal(oscillators[0].started,13);assert(oscillators.every(o=>o.stopped>o.started));
 context.currentTime=13;nextFrame();pads[1].onpointerdown({preventDefault(){},pointerId:1});assert.equal(oscillators.length,33,'A hit must play its own tone');context.currentTime=13.65;nextFrame();assert.match(node('#fall-status').textContent,/Gut getroffen/);
 node('#fall-pause').onclick();assert.equal(node('#fall-pause').textContent,'Weiter mit Ton');assert(oscillators.slice(1,32).every(o=>o.stopped<=context.currentTime+.13),'Pause must cancel future guide sounds');
 await node('#fall-pause').onclick();assert.equal(node('#fall-pause').textContent,'Pause');assert(oscillators.length>33,'Resume must reschedule the audible melody');
 vm.runInContext('extraCleanup()',c);assert.equal(context.state,'closed');assert.equal(listeners.size,0);
 console.log('PASS: four-lane chart, falling geometry, onset windows, sustained holds, audible guide schedule, played hit sound, pause/resume audio cancellation, cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1;});
