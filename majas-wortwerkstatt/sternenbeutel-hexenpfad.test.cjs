const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const wallet=html.slice(html.indexOf('const starWalletKey='),html.indexOf('function bearPicture('));
const roads=html.slice(html.indexOf('const witchPaths='),html.indexOf('function playWitchPath('));
const items=html.slice(html.indexOf('const bearItems=['),html.indexOf('const bearOutfitKey='));
function context(initial={},learned=0,outfit={}){
 const storage=new Map(Object.entries(initial));let fail=false;
 const c={assert,console,structuredClone,Intl,Date,Set,Map,Object,Number,JSON,Math,progress:new Set(Array.from({length:learned},(_,i)=>'q'+i)),bearOutfit:outfit,miniGames:Object.fromEntries(['wolkenwege','hexenpfad','woerterfang','memory','satzpuzzle'].map(id=>[id,{title:id}])),syncStars:()=>{},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('storage blocked');storage.set(k,v);}},cloudDirs:[[-1,0],[0,1],[1,0],[0,-1]]};
 vm.createContext(c);vm.runInContext(items+roads+wallet,c);return {run:s=>vm.runInContext(s,c),storage,fail:()=>fail=true};
}
const c=context();
c.run(`
assert.equal(starBalance(),0);
assert.equal(starLevelOpen('hexenpfad',1),true);assert.equal(starLevelOpen('hexenpfad',3),true);
assert.equal(starLevelOpen('hexenpfad',4),false);assert.equal(starLevelOpen('hexenpfad',0),false);
assert.equal(starLevelOpen('notagame',1),false);
assert.equal(starPurchase('item:hut').ok,false);assert.equal(starBalance(),0);
assert.equal(starGameReward('hexenpfad',4).amount,0);
assert.equal(starGameReward('hexenpfad',1).amount,2);
assert.equal(starGameReward('hexenpfad',1).amount,0);assert.equal(starBalance(),2);
assert.equal(starGameReward('hexenpfad',2).amount,2);assert.equal(starBalance(),4);
assert.equal(starPurchase('item:hut').ok,true);assert.equal(starBalance(),1);
assert.equal(starPurchase('item:hut').already,true);assert.equal(starBalance(),1);
assert.equal(starOwned('item:hut'),true);
assert.equal(starPurchase('level:hexenpfad:4').ok,false);assert.equal(starBalance(),1);
assert.equal(starGameReward('hexenpfad',3).amount,2);assert.equal(starBalance(),3);
assert.equal(starPurchase('level:hexenpfad:4').ok,true);assert.equal(starBalance(),1);
assert.equal(starLevelOpen('hexenpfad',4),true);assert.equal(starOwned('item:hut'),true);
assert.equal(starGameReward('hexenpfad',4).amount,2);assert.equal(starBalance(),3);
assert.equal(starPurchase('level:memory:2').ok,true);assert.equal(starBalance(),0);
assert.equal(starPurchase('level:memory:3').ok,false);assert.equal(starBalance(),0);
assert.equal(starPurchase('level:memory:99').ok,false);
assert.equal(progress.size,0);
const today=starDay();starDay=()=>today+'-later';
assert.equal(starGameReward('hexenpfad',1).amount,1);assert.equal(starGameReward('hexenpfad',1).amount,0);
assert.equal(starBalance(),1);
for(const [i,level]of witchLevels.entries()){
 assert(witchFindPath(level,level.solution),'Unsolvable witch level '+(i+1));
 assert.equal(witchFindPath(level,{}),null);
 assert.equal(new Set(level.path.map(p=>p.join(','))).size,level.path.length);
 for(const kind of ['straight','bend'])assert(Object.values(level.solution).filter(t=>t.kind===kind).length<=level.inventory[kind]);
 const broken=structuredClone(level.solution);delete broken[Object.keys(broken)[0]];assert.equal(witchFindPath(level,broken),null);
}
`);
const restored=context(Object.fromEntries(c.storage));restored.run(`assert.equal(starOwned('item:hut'),true);assert.equal(starLevelOpen('hexenpfad',4),true);assert.equal(starLevelOpen('memory',2),true);assert.equal(starTotals(starWallet).spent,8);`);
const legacy=context({'majas-wortwerkstatt-wolkenwege-v1':JSON.stringify({completed:{'7':true},sessions:{'11':{}}})},13,{kleidung:'hut'});
legacy.run(`assert.equal(progress.size,13);for(const id of ['hut','ball','heft','schal'])assert(starOwned('item:'+id));assert.equal(starLevelOpen('wolkenwege',8),true);assert.equal(starLevelOpen('wolkenwege',12),true);assert.equal(starBalance(),15);assert.equal(starTotals(starWallet).spent,0);`);
const blocked=context({},0);blocked.run(`starGameReward('hexenpfad',1);starGameReward('hexenpfad',2);assert.equal(starBalance(),4);`);blocked.fail();blocked.run(`assert.equal(starPurchase('item:hut').ok,false);assert.equal(starBalance(),4);assert.equal(starOwned('item:hut'),false);`);
for(const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
assert(html.includes("if(!starLevelOpen(id,n))"),'Direct URLs must check purchases');
console.log('PASS: all 12 road puzzles, inventory, boundaries, purchases, no overdraft, no repeat charges, rewards, daily limits, persistence, migration, save failure and script syntax.');
