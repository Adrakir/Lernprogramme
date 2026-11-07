const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const a=html.indexOf('const c3Faces='),b=html.indexOf('// End of pure 3D game rules.',a);
assert(a>0&&b>a,'3D engine must be bundled');
const c={assert,console,structuredClone};vm.createContext(c);vm.runInContext(html.slice(a,b),c);
vm.runInContext(`
function restricted(world,ban){const queue=[c3Initial(world)],seen=new Set();for(let i=0;i<queue.length&&i<60000;i++){const s=queue[i],key=JSON.stringify(s);if(seen.has(key))continue;seen.add(key);if(c3Done(world,s))return true;for(const who of ['m','b'])for(const action of c3Actions(world,s,who))if(!ban.includes(action.kind))queue.push(c3Step(world,s,action));}return false;}
assert.equal(cloudWorlds.length,12);
cloudWorlds.forEach((world,i)=>{
 const initial=c3Initial(world),result=c3Solve(world,initial);assert(result,'Unsolvable 3D level '+(i+1));
 let s=initial,changedFace=false;
 for(const action of result.path){
  const before=JSON.stringify(s),old=c3Geometry(world,s).poses[s[action.who]],next=c3Step(world,s,action);
  assert(next,'Illegal solver action');assert.equal(JSON.stringify(s),before,'History must not mutate');
  if(action.kind==='move'){
   assert.equal(c3Shared(old,c3Geometry(world,s).poses[action.to]).length,2,'A step must cross an actual shared cube edge');
   if(old.n.some((v,j)=>v!==c3Geometry(world,next).poses[next[action.who]].n[j]))changedFace=true;
  }
  s=next;
 }
 assert(c3Done(world,s));assert.equal(s.m,world.goal);assert.equal(s.b,world.goal);
 assert(changedFace||result.path.some(a=>a.kind==='lift'||a.kind==='turn'),'Not a flat walk');
 assert(result.path.every(a=>a.kind!=='move'||c3Node(world,a.to)));
 assert.equal(c3Step(world,initial,{kind:'move',who:'m',to:'missing.top'}),null);
 const view={yaw:Math.PI/4,pitch:Math.PI/6,zoom:1},snapshot=JSON.stringify(initial),p=c3Geometry(world,initial).poses[initial.m].center;
 const fit={center:[0,0,0],scale:80};const p1=c3Project(p,view,fit);view.yaw+=Math.PI/2;view.pitch=-.6;c3Project(p,view,fit);assert.equal(JSON.stringify(initial),snapshot,'Camera rotation must not alter gameplay');
 console.log('3D level '+(i+1)+': '+result.path.length+' valid spatial actions');
});
for(const n of [7,10,11])assert.equal(restricted(cloudWorlds[n-1],['bridgePlace']),false,'Bridge must be necessary');
for(const n of [8,12])assert.equal(restricted(cloudWorlds[n-1],['lift']),false,'Lift must be necessary');
for(const n of [9,11])assert.equal(restricted(cloudWorlds[n-1],['turn']),false,'Rotating cube must be necessary');
const finalWithoutLever=structuredClone(cloudWorlds[11]);finalWithoutLever.nodes.forEach(n=>delete n.lever);assert.equal(c3Solve(finalWithoutLever,c3Initial(finalWithoutLever)),null,'Finale needs the latch so both can leave the pressure plate');
const finalWithoutPlate=structuredClone(cloudWorlds[11]);finalWithoutPlate.nodes.forEach(n=>delete n.plate);assert.equal(c3Solve(finalWithoutPlate,c3Initial(finalWithoutPlate)),null,'Finale needs cooperation at the pressure plate');
const lift=cloudWorlds[7],low=c3Initial(lift),high={...low,lift:1};
assert(c3Geometry(lift,low).edges['p.top'].some(e=>e.to==='a.top'));assert(!c3Geometry(lift,low).edges['p.top'].some(e=>e.to==='c.top'));
assert(c3Geometry(lift,high).edges['p.top'].some(e=>e.to==='c.top'));assert(!c3Geometry(lift,high).edges['p.top'].some(e=>e.to==='a.top'));
assert.equal(c3Geometry(lift,high).poses['p.top'].center[1]-c3Geometry(lift,low).poses['p.top'].center[1],1);
assert.equal(c3Step(lift,low,{kind:'lift',who:'m'}),null,'Must operate a machine from its controller');
const rotating=cloudWorlds[8],rs={...c3Initial(rotating),m:'p.left'},turned=c3Step(rotating,rs,{kind:'turn',who:'m'});assert(turned);assert.notDeepEqual(c3Geometry(rotating,rs).poses['p.left'].n,c3Geometry(rotating,turned).poses['p.left'].n);
const puzzle=cloudWorlds[6],ps=c3Initial(puzzle);assert.equal(c3Step(puzzle,ps,{kind:'bridgePlace',who:'m'}),null);assert.equal(c3Step(puzzle,{...ps,got:true},{kind:'bridgePlace',who:'m'}),null);assert(c3Step(puzzle,{...ps,got:true,bridgeRot:1},{kind:'bridgePlace',who:'m'}));
const pressure=cloudWorlds[5],held={...c3Initial(pressure),m:'a.front',b:'g.top'};assert(c3Valid(pressure,held));assert.equal(c3Step(pressure,held,{kind:'move',who:'m',to:'a.top'}),null,'Do not remove the floor beneath the other player');
assert.equal(c3Visible([0,-1,0],{yaw:.7,pitch:.5}),false);assert.equal(c3Visible([0,-1,0],{yaw:.7,pitch:-.5}),true);
`,c);
for(const s of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
assert(html.includes('play:playCloud3D'));assert(html.includes("const c3StorageKey='majas-wortwerkstatt-wolkenwege-3d-v1'"));assert(html.includes("const cloudKey='majas-wortwerkstatt-wolkenwege-v1'"));
console.log('PASS: physical face adjacency, all 12 solutions, necessary mechanisms, camera independence, occupied bridge safety and preserved legacy storage.');
