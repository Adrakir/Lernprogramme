const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),a=html.indexOf('// Bärli\'s schoolyard kart:'),b=html.indexOf('function render(initial=false)',a),c={assert,console};vm.createContext(c);vm.runInContext(html.slice(a,b),c);
vm.runInContext(`
assert.equal(kartCourses.length,6);
for(let level=1;level<=6;level++){
 assert.equal(kartCourses[level-1].words.length,10);
 for(const seed of [0,1,145,999999])for(let i=0;i<10;i++){
  const gate=kartGate(level,i,seed);assert.equal(gate.choices.length,3);assert.equal(gate.choices.filter(x=>x.noun).length,1);assert.equal(new Set(gate.choices.map(x=>x.word)).size,3);
  assert(/^[A-ZÄÖÜ]/.test(gate.choices[gate.lane].word));assert(['der','die','das'].includes(gate.choices[gate.lane].article));
  for(let lane=0;lane<3;lane++){const answer=kartJudge(gate,lane);assert.equal(answer.correct,lane===gate.lane);assert(answer.why.includes(answer.right));if(lane!==gate.lane)assert(/Verb|Adjektiv/.test(answer.why));}
 }
}
assert.equal(kartLane(0,-1),0);assert.equal(kartLane(2,1),2);assert.equal(kartLane(1,-1),0);assert.equal(kartLane(1,1),2);
assert.equal(kartAdvance(.9,2,5),1);assert.equal(kartAdvance(.5,-10,5),.5);assert.equal(kartAdvance(0,1,5),.2);assert(kartPassed(8,10));assert(!kartPassed(7,10));assert(!kartPassed(0,0));
const positions=new Set();for(let i=0;i<20;i++)positions.add(kartGate(1,0,i).lane);assert.equal(positions.size,3,'Noun positions vary across runs');
assert(kartBearSvg().includes('Go-Kart'));
`,c);
// Check that new levels use the shared wallet and that course names are visible in the lobby.
assert(html.includes("if(id==='kart')return n<=3?0:n<=5?2:3"));assert(html.includes("starGameReward('kart',level)"));assert(html.includes("if(id==='kart')return kartCourses[n-1].title"));assert(html.includes("if(extraCleanup){extraCleanup();extraCleanup=null;}"));
for(const [,script]of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script);
console.log('PASS: six ten-gate courses, 240 randomized gates, three lanes, noun and distractor explanations, steering bounds, time progression, 80% reward threshold, shared-wallet integration and bundled syntax.');
