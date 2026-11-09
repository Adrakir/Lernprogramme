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
for(const item of additions){if(!bearItems.some(existing=>existing.id===item.id))bearItems.push({...item,group:'kleidung'});}
const sectionDefs=[
 ['huete','Hüte','🎩','Was bekommt Bärli auf den Kopf?'],
 ['brillen','Brillen','👓','Such eine Brille aus.'],
 ['pullover','Pullover','🧥','Ein kuscheliges Oberteil aussuchen.'],
 ['hosen','Hosen','👖','Welche Hose passt heute?'],
 ['schals','Schals','🧣','Etwas Warmes um den Hals.'],
 ['schuhe','Schuhe','👟','Schuhe zum Herumlaufen.'],
 ['spielzeug','Spielzeug','🧸','Damit kann Bärli spielen.'],
 ['schule','Schulsachen','🎒','Sachen für die Schule.']
];
const clothing=sectionDefs.slice(0,6),extra=sectionDefs.slice(6);
const slotOf=item=>item.slot||(item.id==='hut'||item.id==='krone'?'huete':item.id==='schal'?'schals':item.group==='spielzeug'?'spielzeug':item.group==='schule'?'schule':'pullover');
const descriptor=key=>sectionDefs.find(x=>x[0]===key);
const htmlEsc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
if(bearOutfit.kleidung){
 const old=bearItems.find(x=>x.id===bearOutfit.kleidung);
 if(old&&!bearOutfit[slotOf(old)])bearOutfit[slotOf(old)]=old.id;
 delete bearOutfit.kleidung;
 try{localStorage.setItem(bearOutfitKey,JSON.stringify(bearOutfit));}catch{}
}
let wardrobeIndex=0;
function ownedAndWorn(){return bearItems.filter(x=>starOwned('item:'+x.id)&&bearOutfit[slotOf(x)]===x.id);}
function bearFigure(compact=false){
 const equipped=ownedAndWorn();
 return '<div class="bw-figure'+(compact?' bw-small':'')+'"><img src="'+imagePath+'" alt="Bärli mit seinem gelben Ohrfähnchen. Ausgewählte Kleidung wird darüber angezeigt." width="600" height="600">'
 +'<svg viewBox="0 0 450 450" aria-hidden="true"><g stroke="#574951" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
 +equipped.sort((a,b)=>['hosen','pullover','schuhe','schals','huete','brillen','schule','spielzeug'].indexOf(slotOf(a))-['hosen','pullover','schuhe','schals','huete','brillen','schule','spielzeug'].indexOf(slotOf(b))).map(x=>x.art).join('')+'</g></svg>'
 +'</div>';
}
function subPreview(item){
 const slot=slotOf(item);
 const box=({huete:'92 0 272 126',brillen:'119 70 210 96',pullover:'90 157 275 140',hosen:'115 255 218 153',schals:'120 148 220 140',schuhe:'104 359 245 86',spielzeug:'0 273 450 170',schule:'0 280 180 155'})[slot];
 return '<span class="bw-item-picture"><svg viewBox="'+box+'" role="img" aria-label="Zeichnung von '+htmlEsc(item.title)+'"><g stroke="#574951" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">'+item.art+'</g></svg></span>';
}
function wardrobeMain(mode='kleidung'){
 const current=mode==='extras'?'extras':'kleidung';
 const options=current==='extras'?extra:clothing;
 return '<div class="bw-page"><a class="bw-back" href="#">← Zur Startseite</a>'
 +'<header class="bw-header"><p class="kicker">Bärlis Laden und Anziehzimmer</p><h1 tabindex="-1">Zieh Bärli an!</h1><p>Tippe auf ein Bild. Jede Sache hat ihre eigene Seite.</p></header>'
 +'<section class="bw-intro">'+bearFigure()+'<div><p class="bw-balance">⭐ '+starCount(starBalance())+' im Beutel</p><p>Du kannst Bärli mehrere Sachen gleichzeitig anziehen. Was du gekauft hast, bleibt dir erhalten.</p><div class="bw-worn">'+(ownedAndWorn().map(x=>'<span>'+htmlEsc(x.title)+'</span>').join('')||'<span>Bärli trägt sein Lieblingsoutfit</span>')+'</div></div></section>'
 +'<nav class="bw-tabs" aria-label="Bereiche"><a href="#baerli/schrank/kleidung" '+(current==='kleidung'?'aria-current="page"':'')+'>👕 Kleidung</a><a href="#baerli/schrank/extras" '+(current==='extras'?'aria-current="page"':'')+'>🧸 Extras</a></nav>'
 +'<div class="bw-category-grid">'+options.map(([id,label,emoji])=>'<a href="#baerli/schrank/'+id+'" class="bw-category"><span class="bw-emoji" aria-hidden="true">'+emoji+'</span><strong>'+label+'</strong><span class="bw-chevron">›</span></a>').join('')+'</div></div>';
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
 +'<section class="bw-focus">'+bearFigure(true)+'<div class="bw-product">'+subPreview(item)
 +'<div class="bw-product-copy"><strong>'+htmlEsc(item.title)+'</strong><span>'+(has?'✓ Gehört dir':item.stars+' ⭐ Sterne')+'</span></div>'
 +'<div class="bw-action">'+(has?'<button type="button" class="primary" data-bw-equip="'+htmlEsc(item.id)+'" aria-pressed="'+worn+'">'+(worn?'Ausziehen':'Bärli anziehen')+'</button>':'<button type="button" class="primary" data-bw-buy="'+htmlEsc(item.id)+'" '+(starBalance()<item.stars?'disabled':'')+'>Für '+item.stars+' Sterne kaufen</button>')+'</div>'
 +'<p class="bw-wallet">⭐ '+starBalance()+' Sterne verfügbar</p><p class="bw-message" id="bw-status" role="status">'+htmlEsc(message)+'</p></div></section>'
 +'<nav class="bw-pagination" aria-label="Weitere Sachen"><button type="button" data-bw-move="-1" '+(wardrobeIndex===0?'disabled':'')+'>← Zurück</button><span>'+String(wardrobeIndex+1)+' von '+things.length+'</span><button type="button" data-bw-move="1" '+(wardrobeIndex===things.length-1?'disabled':'')+'>Weiter →</button></nav>'
 +'<nav class="bw-bottom"><a href="#baerli/schrank/'+groupNames[(pos-1+groupNames.length)%groupNames.length]+'">← '+sectionDefs[(pos-1+groupNames.length)%groupNames.length][1]+'</a><a href="#baerli/schrank/'+groupNames[(pos+1)%groupNames.length]+'">'+sectionDefs[(pos+1)%groupNames.length][1]+' →</a></nav></div>';
}
showBearWardrobe=function(category='kleidung',message='',index=0){
 const key=descriptor(category)?category:category==='extras'?'extras':'kleidung';
 const isItem=Boolean(descriptor(key));
 app.innerHTML=isItem?wardrobeSection(key,message,index):wardrobeMain(key);
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
 if(page==='schrank'){const parts=location.hash.slice(1).split('/');showBearWardrobe(parts[2]||'kleidung');return;}
 previousShowBear(page);
};
const previousShowHome=showHome;
showHome=function(){
 previousShowHome();
 const extend=app.querySelector('.maja-quick-topic[href="#verlaengern"] .maja-topic-symbol');
 if(extend){extend.innerHTML='<span class="bw-word-icon" aria-hidden="true"><b>Hund</b><span>↓</span><b>Hunde</b></span>';extend.closest('a')?.querySelector('small')?.replaceChildren('Hund → Hunde');}
 const comic=app.querySelector('.maja-quick-option[href="#comics"] .maja-option-icon');
 if(comic)comic.innerHTML='<svg viewBox="0 0 42 42" class="bw-comic-icon" aria-hidden="true"><rect x="3" y="4" width="36" height="34" rx="4" fill="#fff7ef" stroke="#284d45" stroke-width="2"/><path d="M21 4v34M3 23h36" stroke="#284d45" stroke-width="2"/><circle cx="11" cy="15" r="4" fill="#ebb574"/><circle cx="29" cy="29" r="4" fill="#c68672"/><path d="M24 9h12v8H24l3 4v-4" fill="white" stroke="#284d45" stroke-width="1.5"/></svg>';
 const wardrobe=app.querySelector('.maja-quick-option[href="#baerli/schrank"] .maja-option-icon');
 if(wardrobe)wardrobe.innerHTML='<img class="bw-tile-bear" src="'+imagePath+'" alt="" loading="lazy">';
 const menu=app.querySelector('.maja-quick-options');
 if(menu&&!menu.querySelector('[href="./bilderbuecher/"]')){
   menu.insertAdjacentHTML('beforeend','<a href="./bilderbuecher/" class="maja-quick-option bw-books-tile"><span class="maja-option-icon" aria-hidden="true">📚</span><span><strong>Bärlibuch</strong><small>Bilderbücher anschauen</small></span></a>');
 }
};
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
