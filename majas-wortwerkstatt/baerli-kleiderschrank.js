/* Bärlis bebilderter Kleiderschrank: kurze, getrennte Seiten statt Scroll-Liste. */
(function(){
'use strict';
if(typeof bearItems==='undefined'||typeof starOwned!=='function')return;
const imagePath='./baerli/baerli.webp';
const additions=[
 {id:'kuschelmuetze',title:'Blaue Kuschelmütze',stars:3,slot:'huete',art:'<path d="M127 77Q130 15 225 17Q322 14 320 77L298 87Q220 71 147 88Z" fill="#5c9fc3"/><path d="M133 75Q224 62 315 75" stroke="#d3e8ec" stroke-width="13"/><circle cx="227" cy="10" r="17" fill="#f5d6aa"/>'},
 {id:'sonnenhut',title:'Gelber Sonnenhut',stars:4,slot:'huete',art:'<path d="M157 66Q158 16 227 22Q295 24 299 66Z" fill="#f4c85e"/><path d="M110 81Q226 49 346 81Q226 111 110 81Z" fill="#f4c85e"/><path d="M166 63Q230 77 294 63" stroke="#bf785f" stroke-width="10" fill="none"/>'},
 {id:'lesebrille',title:'Runde Lesebrille',stars:3,slot:'brillen',art:'<g fill="none" stroke="#4c4565" stroke-width="7"><circle cx="187" cy="113" r="29"/><circle cx="270" cy="113" r="29"/><path d="M215 111Q229 104 241 111M157 105L139 103M299 103L314 101"/></g>'},
 {id:'sonnenbrille',title:'Coole Sonnenbrille',stars:5,slot:'brillen',art:'<path d="M155 92h62l-7 38q-26 20-46-4Zm84 0h63l-10 34q-22 24-49 3Z" fill="#35495b" stroke="#d7b35a" stroke-width="5"/><path d="M216 101q10-7 24 0M154 101l-18-7m167 7 16-7" stroke="#d7b35a" stroke-width="6" fill="none"/>'},
 {id:'regenbogenpullover',title:'Regenbogenpullover',stars:4,slot:'pullover',art:'<path d="M154 180L121 212L135 276L168 266L178 240L178 281L278 281L282 242L302 267L334 276L344 213L293 179L270 165Q224 188 181 165Z" fill="#77b9c1" stroke="#577e80" stroke-width="4"/><path d="M177 219Q224 196 280 219M180 236Q229 211 277 236M179 254Q226 232 277 254" stroke-width="9" fill="none" stroke="#f6d279"/><path d="M174 279H282" stroke="#416d75" stroke-width="9"/>'},
 {id:'sternpullover',title:'Türkiser Sternenpullover',stars:6,slot:'pullover',art:'<path d="M154 180L120 214L138 274L168 266L177 243L178 282L279 282L281 241L305 267L337 275L344 212L292 180L271 165Q222 188 184 165Z" fill="#3d9a97" stroke="#2a6765" stroke-width="4"/><path d="m228 192 9 21 23 2-17 15 5 24-20-12-20 12 5-24-17-15 23-2Z" fill="#ffda73"/><path d="M176 280h105" stroke="#23605b" stroke-width="9"/>'},
 {id:'jeans',title:'Blaue Jeans',stars:4,slot:'hosen',art:'<path d="M167 273H281L298 390L250 395L225 325L205 395L153 390Z" fill="#4779ae" stroke="#2f5279" stroke-width="5"/><path d="M168 286h113M223 291v34M176 309h23m56 0h22" stroke="#a7c4db" stroke-width="4" fill="none"/>'},
 {id:'regenhose',title:'Gelbe Regenhose',stars:5,slot:'hosen',art:'<path d="M167 270H281L300 390H249L226 325L203 390H152Z" fill="#ecc357" stroke="#b0873b" stroke-width="5"/><path d="M168 287h112M153 382h49m49 0h49" stroke="#f5ecbc" stroke-width="8" fill="none"/>'},
 {id:'sternhose',title:'Lila Sternenhose',stars:6,slot:'hosen',art:'<path d="M166 272H283L300 388H249L227 326L204 388H151Z" fill="#a57ab6" stroke="#684a79" stroke-width="4"/><path d="m183 322 4 9 9 2-7 7 2 10-8-5-8 5 2-10-7-7 9-2Zm80 7 4 9 10 1-7 7 1 10-8-5-8 5 2-10-7-7 9-1Z" fill="#f7df83"/>'},
 {id:'tuerkiser-schal',title:'Türkiser Schal',stars:3,slot:'schals',art:'<path d="M151 173Q226 195 287 173L292 195Q259 210 226 211L240 266L210 272L199 211Q168 208 147 191Z" fill="#42a69c" stroke="#2d817c" stroke-width="4"/><path d="M208 254l31-5M207 263l33-5" stroke="#d5eee3" stroke-width="5" fill="none"/>'},
 {id:'turnschuhe',title:'Türkise Turnschuhe',stars:4,slot:'schuhe',art:'<path d="M133 386q19-6 56 0l29 20q6 14-10 18h-81q-21-3-14-20Z" fill="#49a6a2" stroke="#2d6264" stroke-width="4"/><path d="M247 386q35-9 59 0l26 22q4 15-10 17h-78q-17-1-17-15Z" fill="#49a6a2" stroke="#2d6264" stroke-width="4"/><path d="M118 411h97m15 0h101" stroke="#fff4db" stroke-width="7"/>'},
 {id:'stiefel',title:'Rote Winterstiefel',stars:6,slot:'schuhe',art:'<path d="M139 374h59v26l31 11q8 17-13 20h-94q-15-5-7-18l24-14Z" fill="#bc5b56" stroke="#834345" stroke-width="5"/><path d="M250 374h58v28l28 11q7 17-13 18h-91q-16-3-8-18l26-14Z" fill="#bc5b56" stroke="#834345" stroke-width="5"/><path d="M140 378h58m52 0h58" stroke="#fff4df" stroke-width="9"/>'}
];

// Erweiterungen: unveränderliche IDs, damit Käufe und alte Outfits gültig bleiben.
const newWardrobePieces=[
 {id:'abenteuercap',title:'Grüne Abenteuercap',stars:4,slot:'huete',art:'<path d="M145 79Q144 17 226 22Q307 17 309 82L293 97Q227 74 154 98Z" fill="#509b79" stroke="#2b6d57" stroke-width="5"/><path d="M153 88Q227 60 302 88Q259 115 185 106Z" fill="#32765d" stroke="#235b48" stroke-width="4"/><path d="m213 48 13 7 13-7-4 16h-18Z" fill="#f7d878"/>'},
 {id:'partyhut',title:'Bunter Partyhut',stars:5,slot:'huete',art:'<path d="M225 4L145 87Q225 106 307 87Z" fill="#ef98ab" stroke="#985a74" stroke-width="5"/><path d="M186 52l61 12M167 73l116 16" stroke="#ffe7a1" stroke-width="13"/><circle cx="225" cy="5" r="15" fill="#65c4bb"/>'},
 {id:'forscherbrille',title:'Blaue Forscherbrille',stars:4,slot:'brillen',art:'<g fill="#8ecadf" fill-opacity=".27" stroke="#377192" stroke-width="6"><rect x="153" y="95" width="66" height="43" rx="12"/><rect x="237" y="95" width="66" height="43" rx="12"/></g><path d="M220 109q8-6 17 0m-84-5-16-5m167 5 15-5" stroke="#377192" stroke-width="6" fill="none"/>'},
 {id:'herzbrille',title:'Rosa Herzbrille',stars:5,slot:'brillen',art:'<g fill="#f2a0be" fill-opacity=".37" stroke="#ab4a7b" stroke-width="6"><path d="M182 101Q164 83 151 102Q138 119 182 148Q225 118 212 101Q199 84 182 101Z"/><path d="M270 101Q253 83 240 102Q227 119 270 148Q313 118 300 101Q287 84 270 101Z"/></g><path d="M216 111q11-6 22 0" stroke="#ab4a7b" stroke-width="5" fill="none"/>'},
 {id:'ringelpullover',title:'Rot-weißer Ringelpullover',stars:5,slot:'pullover',art:'<path d="M154 181L120 214L138 275L168 266L178 241V284H280V241L307 266L337 275L344 214L292 181L271 166Q227 187 182 166Z" fill="#fae6dc" stroke="#b65d59" stroke-width="5"/><path d="M175 220h104m-104 24h104m-104 24h104M130 241l37-10m139 0 33 10" stroke="#c05e63" stroke-width="12"/>'},
 {id:'blauejacke',title:'Blaue Abenteuerjacke',stars:6,slot:'pullover',art:'<path d="M157 180L124 214L139 277L169 265L179 242V288H279V242L305 265L337 276L344 214L293 181L269 166Q226 186 184 166Z" fill="#528cbc" stroke="#2a5d83" stroke-width="5"/><path d="M226 177V288M186 233h28m27 0h29M181 280h98" stroke="#f6e0af" stroke-width="6"/><path d="m209 188 17 22 18-22" fill="none" stroke="#ebf6f5" stroke-width="8"/>'},
 {id:'schlaghose',title:'Türkise Schlaghose',stars:5,slot:'hosen',art:'<path d="M167 276H282L278 331L312 396Q281 406 247 395L225 327L205 395Q174 405 141 395L176 331Z" fill="#51ada6" stroke="#2d7376" stroke-width="5"/><path d="M168 289h114m-57 0v39M146 387q30 10 60 0m41 0q31 10 61 0" stroke="#c5e9d9" stroke-width="5" fill="none"/>'},
 {id:'kordhose',title:'Braune Kordhose',stars:5,slot:'hosen',art:'<path d="M166 275H283L301 390L248 397L225 328L205 397L151 390Z" fill="#ab7756" stroke="#714b38" stroke-width="5"/><path d="M176 304l-9 76m30-77-7 79m65-80 9 81m18-80 8 76" stroke="#d6ae85" stroke-width="5"/><path d="M167 289h116m-58 0v38" stroke="#714b38" stroke-width="5"/>'},
 {id:'punkteschal',title:'Blauer Punkteschal',stars:4,slot:'schals',art:'<path d="M149 177Q225 195 287 174L295 198Q256 216 223 211L235 268L202 274L197 211Q166 207 146 191Z" fill="#5f96c2" stroke="#315f90" stroke-width="5"/><g fill="#f7dfa4"><circle cx="172" cy="190" r="5"/><circle cx="215" cy="198" r="5"/><circle cx="261" cy="189" r="5"/><circle cx="212" cy="231" r="5"/><circle cx="218" cy="252" r="5"/></g>'},
 {id:'winterschal',title:'Roter Kuschelschal',stars:5,slot:'schals',art:'<path d="M147 176Q224 198 292 174L300 195Q270 215 238 211L253 276L224 283L207 214Q169 211 143 194Z" fill="#ce6171" stroke="#8e4051" stroke-width="5"/><path d="M159 188q62 24 129-2m-74 56 31-9m-28 25 33-10" fill="none" stroke="#f4cac8" stroke-width="7"/>'},
 {id:'lilasneaker',title:'Lila Sternensneaker',stars:5,slot:'schuhe',art:'<path d="M138 386Q168 374 195 391L220 406Q229 427 210 427H128Q106 420 120 401Z" fill="#ac93cf" stroke="#645392" stroke-width="5"/><path d="M247 386Q277 374 304 391L332 407Q342 427 320 427H240Q222 420 235 402Z" fill="#ac93cf" stroke="#645392" stroke-width="5"/><path d="M127 418h89m20 0h94" stroke="#fff2d6" stroke-width="8"/><path d="m165 393 5 10 11 1-8 7 2 10-10-5-10 5 2-10-8-7 11-1Zm114 0 5 10 11 1-8 7 2 10-10-5-10 5 2-10-8-7 11-1Z" fill="#ffdf8f"/>'},
 {id:'streifenstiefel',title:'Blaue Regenstiefel',stars:5,slot:'schuhe',art:'<path d="M140 372H199V400L229 413Q237 431 215 431H121Q108 423 120 408L140 398Z" fill="#519abb" stroke="#2b6681" stroke-width="5"/><path d="M250 372H309V400L339 413Q346 431 324 431H231Q217 423 232 408L250 398Z" fill="#519abb" stroke="#2b6681" stroke-width="5"/><path d="M141 381h58m51 0h59M122 421h103m8 0h101" stroke="#f7d88d" stroke-width="8"/>'}
];
additions.push(...newWardrobePieces,...(window.MajaBaerliNeueSachen||[]));

for(const item of additions){if(!bearItems.some(existing=>existing.id===item.id))bearItems.push({...item,group:'kleidung'});}
const sectionDefs=[
 ['huete','Hüte','🎩','Was bekommt Bärli auf den Kopf?'],
 ['brillen','Brillen','👓','Such eine Brille aus.'],
 ['pullover','Pullover','🧥','Ein kuscheliges Oberteil aussuchen.'],
 ['hosen','Hosen','👖','Welche Hose passt heute?'],
 ['schals','Schals','🧣','Etwas Warmes um den Hals.'],
 ['schuhe','Schuhe','👟','Schuhe zum Herumlaufen.'],
 ['spielzeug','Spielzeug','🧸','Damit kann Bärli spielen.'],
 ['schule','Schulsachen','🎒','Sachen für die Schule.'],
 ['taschen','Taschen & Körbe','🎒','Eine Tasche für Bärlis Ausflüge.'],
 ['handlinks','Linke Pfote','🔎','Bärli hält etwas links im Bild.'],
 ['handrechts','Rechte Pfote','☂️','Bärli hält etwas rechts im Bild.']
];
const clothing=sectionDefs.slice(0,6),extra=sectionDefs.slice(6);
const slotOf=item=>item.slot||({hut:'huete',oberteil:'pullover',hose:'hosen',brille:'brillen',hals:'schals',schuhe:'schuhe',spielzeug:'spielzeug',schule:'schule'}[item.group])||(item.id==='hut'||item.id==='krone'?'huete':item.id==='schal'?'schals':'pullover');
const descriptor=key=>sectionDefs.find(x=>x[0]===key);
const htmlEsc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
// Preserve equipped items from both older wardrobe implementations.
let migrationChanged=false;
for(const legacy of ['kleidung','hut','oberteil','hose','brille','hals','schuhe']){
 const id=bearOutfit[legacy],old=bearItems.find(x=>x.id===id);
 if(!old)continue;
 const target=slotOf(old);
 if(!bearOutfit[target])bearOutfit[target]=old.id;
 if(legacy!==target){delete bearOutfit[legacy];migrationChanged=true;}
}
if(migrationChanged){try{localStorage.setItem(bearOutfitKey,JSON.stringify(bearOutfit));}catch{}}
let wardrobeIndex=0;
function ownedAndWorn(){return bearItems.filter(x=>starOwned('item:'+x.id)&&bearOutfit[slotOf(x)]===x.id);}
function bearFigure(compact=false,previewItem=null){
 // Auch ganze Outfit-Kombinationen bleiben eine reine Vorschau ohne Speichern/Kauf.
 const previews=Array.isArray(previewItem)?previewItem:previewItem?[previewItem]:[];
 const previewSlots=new Set(previews.map(slotOf));
 const equipped=ownedAndWorn().filter(item=>!previewSlots.has(slotOf(item)));
 equipped.push(...previews);
 return '<div class="bw-figure'+(compact?' bw-small':'')+'" data-preview-id="'+htmlEsc(previews.map(item=>item.id).join(','))+'"><img src="'+imagePath+'" alt="Bärli mit seinem gelben Ohrfähnchen. Ausgewählte Kleidung wird darüber angezeigt." width="600" height="600">'
 +'<svg viewBox="0 0 450 450" aria-hidden="true"><g stroke="#574951" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
 +equipped.sort((a,b)=>['hosen','pullover','schuhe','schals','huete','brillen','taschen','handlinks','handrechts','schule','spielzeug'].indexOf(slotOf(a))-['hosen','pullover','schuhe','schals','huete','brillen','taschen','handlinks','handrechts','schule','spielzeug'].indexOf(slotOf(b))).map(x=>x.art).join('')+'</g></svg>'
 +'</div>';
}
function subPreview(item){
 const slot=slotOf(item);
 const box=({huete:'92 0 272 126',brillen:'119 70 210 96',pullover:'90 157 275 140',hosen:'115 255 218 153',schals:'120 148 220 140',schuhe:'104 359 245 86',spielzeug:'0 273 450 170',schule:'0 280 180 155',taschen:'0 240 165 190',handlinks:'0 242 155 190',handrechts:'320 242 130 185'})[slot];
 return '<span class="bw-item-picture"><svg viewBox="'+box+'" role="img" aria-label="Zeichnung von '+htmlEsc(item.title)+'"><g stroke="#574951" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">'+item.art+'</g></svg></span>';
}
// Outfit-Ideen sind Vorschauen, keine automatischen Käufe.
const outfitIdeas=[
 {id:'schule',title:'Schul-Bärli',emoji:'🎒',ids:['bw26-wolkenhoodie','jeans','bw26-schulrucksack','bw26-buntstift']},
 {id:'regen',title:'Regen-Bärli',emoji:'☔',ids:['bw26-regenmantel','bw26-winterhose','streifenstiefel','bw26-regenschirm']},
 {id:'detektiv',title:'Detektiv-Bärli',emoji:'🔎',ids:['hut','bw26-latzhose','bw26-lupe','bw26-fernglas']},
 {id:'musik',title:'Musik-Bärli',emoji:'🎵',ids:['ringelpullover','bw26-karohose','bw26-mikrofon','bw26-trommel']}
];
function outfitItems(idea){return idea.ids.map(id=>bearItems.find(item=>item.id===id)).filter(Boolean);}
function wardrobeOutfits(id='',message=''){
 const chosen=outfitIdeas.find(idea=>idea.id===id);
 if(!chosen)return '<div class="bw-page"><a class="bw-back" href="#baerli/schrank/kleidung">← Zur Kleidung</a><header class="bw-header"><p class="kicker">Bärlis Outfit-Ideen</p><h1 tabindex="-1">Was macht Bärli heute?</h1><p>Du kannst alle Kombinationen kostenlos anschauen.</p></header><div class="bw-outfit-grid">'
  +outfitIdeas.map(idea=>'<a class="bw-outfit-card" href="#baerli/schrank/set-'+idea.id+'"><span aria-hidden="true">'+idea.emoji+'</span><strong>'+htmlEsc(idea.title)+'</strong><small>'+outfitItems(idea).length+' passende Sachen</small></a>').join('')+'</div></div>';
 const things=outfitItems(chosen),owned=things.filter(x=>starOwned('item:'+x.id));
 return '<div class="bw-page"><a class="bw-back" href="#baerli/schrank/outfits">← Alle Outfit-Ideen</a>'
  +'<header class="bw-header"><p class="kicker">Kostenlose Anprobe · '+chosen.emoji+'</p><h1 tabindex="-1">'+htmlEsc(chosen.title)+'</h1><p>Diese Sachen passen zusammen. Nur bereits gekaufte Teile kannst du dauerhaft anziehen.</p></header>'
  +'<section class="bw-set-try">'+bearFigure(true,things)+'<div><h2>Das gehört zum Outfit</h2><div class="bw-set-items">'
  +things.map(item=>'<a href="#baerli/schrank/'+slotOf(item)+'/'+item.id+'"><span>'+htmlEsc(item.title)+'</span><small>'+(starOwned('item:'+item.id)?'✓ Vorhanden':item.stars+' ⭐ Noch nicht gekauft')+'</small></a>').join('')+'</div>'
  +'<p class="bw-set-explain">Die Vorschau kostet keine Sterne. Fehlende Sachen werden nicht automatisch gekauft.</p>'
  +'<button type="button" class="primary" data-bw-set="'+chosen.id+'" '+(!owned.length?'disabled':'')+'>Meine vorhandenen '+owned.length+' Sachen anziehen</button>'
  +'<p id="bw-status" class="bw-message" role="status">'+htmlEsc(message)+'</p></div></section></div>';
}

function wardrobeMain(mode='kleidung'){
 const current=mode==='extras'?'extras':'kleidung';
 const options=current==='extras'?extra:clothing;
 return '<div class="bw-page"><a class="bw-back" href="#">← Zur Startseite</a>'
 +'<header class="bw-header"><p class="kicker">Bärlis Laden und Anziehzimmer</p><h1 tabindex="-1">Zieh Bärli an!</h1><p>Tippe auf ein Bild. Jede Sache hat ihre eigene Seite.</p></header>'
 +'<section class="bw-intro">'+bearFigure()+'<div><p class="bw-balance">⭐ '+starCount(starBalance())+' im Beutel</p><p>Kombiniere Kleidung, Taschen und Utensilien. Alles Gekaufte bleibt erhalten.</p><div class="bw-worn">'+(ownedAndWorn().map(x=>'<span>'+htmlEsc(x.title)+'</span>').join('')||'<span>Bärli trägt sein Lieblingsoutfit</span>')+'</div></div></section>'
 +'<nav class="bw-tabs" aria-label="Bereiche"><a href="#baerli/schrank/kleidung" '+(current==='kleidung'?'aria-current="page"':'')+'>👕 Kleidung</a><a href="#baerli/schrank/extras" '+(current==='extras'?'aria-current="page"':'')+'>🧸 Extras</a></nav>'
 +'<div class="bw-category-grid">'+options.map(([id,label,emoji])=>{const sample=bearItems.find(item=>slotOf(item)===id);const count=bearItems.filter(item=>slotOf(item)===id).length;return '<a href="#baerli/schrank/'+id+'" class="bw-category"><span class="bw-category-sample" aria-hidden="true">'+(sample?subPreview(sample):'<span class="bw-emoji">'+emoji+'</span>')+'</span><strong>'+label+'</strong><small>'+count+' Sachen</small></a>';}).join('')+'</div>'+(current==='kleidung'?'<a href="#baerli/schrank/outfits" class="bw-set-link">🎭 Outfit-Ideen mit Bärli entdecken →</a>':'')+'</div>';
}
function wardrobeSection(category,message='',i=0){
 const desc=descriptor(category);
 const things=bearItems.filter(x=>slotOf(x)===category);
 if(!desc||!things.length)return wardrobeMain();
 wardrobeIndex=Math.max(0,Math.min(i,things.length-1));
 const item=things[wardrobeIndex],has=starOwned('item:'+item.id),worn=bearOutfit[category]===item.id&&has;
 const groupNames=sectionDefs.map(x=>x[0]),pos=groupNames.indexOf(category);
 return '<div class="bw-page bw-single"><a class="bw-back" href="#baerli/schrank/'+(pos<6?'kleidung':'extras')+'">← Alle '+(pos<6?'Kleidungsstücke':'Extras')+'</a>'
 +'<header class="bw-header"><p class="kicker">'+desc[2]+' Bärlis Kleiderschrank</p><h1 tabindex="-1">'+desc[1]+'</h1><p>'+desc[3]+'</p></header>'
 +'<section class="bw-focus"><div class="bw-dress-preview">'+bearFigure(true,item)+'<p class="bw-try-label">'+(worn?'✓ Bärli trägt das schon':has?'Anprobe – gehört dir':'Anprobe – noch nicht gekauft')+'</p></div><div class="bw-product">'+subPreview(item)
 +'<div class="bw-product-copy"><strong>'+htmlEsc(item.title)+'</strong><span>'+(has?'✓ Gehört dir':item.stars+' ⭐ Sterne')+'</span></div>'
 +'<div class="bw-action">'+(has?'<button type="button" class="primary" data-bw-equip="'+htmlEsc(item.id)+'" aria-pressed="'+worn+'">'+(worn?'Ausziehen':'Bärli anziehen')+'</button>':'<button type="button" class="primary" data-bw-buy="'+htmlEsc(item.id)+'" '+(starBalance()<item.stars?'disabled':'')+'>Für '+item.stars+' Sterne kaufen</button>')+'</div>'
 +'<p class="bw-wallet">⭐ '+starBalance()+' Sterne verfügbar</p><p class="bw-message" id="bw-status" role="status">'+htmlEsc(message)+'</p></div></section>'
 +'<nav class="bw-pagination" aria-label="Weitere Sachen"><button type="button" data-bw-move="-1" '+(wardrobeIndex===0?'disabled':'')+'>← Zurück</button><span>'+String(wardrobeIndex+1)+' von '+things.length+'</span><button type="button" data-bw-move="1" '+(wardrobeIndex===things.length-1?'disabled':'')+'>Weiter →</button></nav>'
 +'<nav class="bw-bottom"><a href="#baerli/schrank/'+groupNames[(pos-1+groupNames.length)%groupNames.length]+'">← '+sectionDefs[(pos-1+groupNames.length)%groupNames.length][1]+'</a><a href="#baerli/schrank/'+groupNames[(pos+1)%groupNames.length]+'">'+sectionDefs[(pos+1)%groupNames.length][1]+' →</a></nav></div>';
}
showBearWardrobe=function(category='kleidung',message='',index=0){
 const isSet=category==='outfits'||outfitIdeas.some(idea=>'set-'+idea.id===category);
 const key=isSet?category:descriptor(category)?category:category==='extras'?'extras':'kleidung';
 const isItem=Boolean(descriptor(key));
 app.innerHTML=isSet?wardrobeOutfits(key.startsWith('set-')?key.slice(4):'',message):isItem?wardrobeSection(key,message,index):wardrobeMain(key);
 app.querySelectorAll('[data-bw-set]').forEach(button=>button.onclick=()=>{
   const idea=outfitIdeas.find(x=>x.id===button.dataset.bwSet);
   if(!idea)return;
   const pieces=outfitItems(idea).filter(item=>starOwned('item:'+item.id));
   if(!pieces.length){showBearWardrobe(key,'Noch keine Sachen aus diesem Outfit gekauft.');return;}
   for(const item of pieces)bearOutfit[slotOf(item)]=item.id;
   try{localStorage.setItem(bearOutfitKey,JSON.stringify(bearOutfit));}catch{}
   showBearWardrobe(key,pieces.length+' vorhandene Sachen angezogen. Es wurden keine Sterne ausgegeben.');
 });
 app.querySelectorAll('[data-bw-move]').forEach(button=>button.onclick=()=>{
   showBearWardrobe(key,'',wardrobeIndex+Number(button.dataset.bwMove));
   app.querySelector('.bw-header h1')?.focus({preventScroll:true});
 });
 app.querySelectorAll('[data-bw-buy]').forEach(button=>button.onclick=()=>{
   const id=button.dataset.bwBuy,item=bearItems.find(x=>x.id===id),result=starPurchase('item:'+id);
   if(result.ok&&item){bearOutfit[slotOf(item)]=id;try{localStorage.setItem(bearOutfitKey,JSON.stringify(bearOutfit));}catch{}}
   showBearWardrobe(key,result.message,wardrobeIndex);
 });
 app.querySelectorAll('[data-bw-equip]').forEach(button=>button.onclick=()=>{
   const id=button.dataset.bwEquip,item=bearItems.find(x=>x.id===id);
   if(!item||!starOwned('item:'+id))return;
   if(bearOutfit[key]===id)delete bearOutfit[key];else bearOutfit[key]=id;
   try{localStorage.setItem(bearOutfitKey,JSON.stringify(bearOutfit));}catch{}
   showBearWardrobe(key,'Bärlis Outfit wurde gespeichert.',wardrobeIndex);
 });
};
const previousShowBear=showBear;
showBear=function(page){
 if(page==='schrank'){const parts=location.hash.slice(1).split('/');const aliases={hut:'huete',oberteil:'pullover',hose:'hosen',brille:'brillen',hals:'schals',schuhe:'schuhe',uebersicht:'kleidung',seite2:'extras'};const category=aliases[parts[2]]||parts[2]||'kleidung';
 const id=parts[3],pieces=bearItems.filter(item=>slotOf(item)===category);
 const selected=id?Math.max(0,pieces.findIndex(item=>item.id===id)):0;
 showBearWardrobe(category,'',selected);return;}
 previousShowBear(page);
};
// The home page is now rendered directly in index.html; do not overwrite its picture cards.
// The Bilderbuch route is linked there. Only the separate comic hub gets its existing banner.
const previousShowComicHub=showComicHub;
showComicHub=function(){
 previousShowComicHub();
 const header=app.querySelector('.maja-page-hub .maja-hub-header');
 if(header)header.insertAdjacentHTML('afterend','<section class="bw-comic-banner"><img src="'+imagePath+'" alt="Bärli" loading="lazy"><div><strong>Bärlis Bilderbuch-Regal</strong><p>Schau die Bilderbücher von Maja und Bärli an.</p><a class="primary" href="./bilderbuecher/">Zum Bärlibuch →</a></div></section>');
};
if(!location.hash||location.hash==='#'||location.hash==='#start')showHome();
else if(location.hash.startsWith('#baerli/schrank'))showBear('schrank');
else if(location.hash==='#comics')showComicHub();
})();
