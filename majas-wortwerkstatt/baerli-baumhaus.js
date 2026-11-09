/* Bärlis Baumhaus und fiktiver Shop – keine echten Käufe, Konten oder Übertragungen.
 * Freischaltung ausschließlich aus den zehn bestehenden Prüfungsergebnissen (>=80%).
 * 10 Bärli-Taler je erstmals bestandenem Test; Wiederholungen bringen keine neuen Taler.
 * Eigener Schlüssel mit Lernstand-Backup-kompatiblem Präfix.
 */
(function(){
'use strict';
const KEY='majas-wortwerkstatt-baumhaus-v1';
const PREP='majas-wortwerkstatt-klassenarbeiten-nov2026-v1';
const PASS=80, PER_EXAM=10;
const categories=[
 {id:'moebel',label:'Möbel & Bettwäsche',icon:'🛏️',need:1,desc:'Bett, Nachttisch, Bettwäsche und gemütliche Möbel'},
 {id:'deko',label:'Dekoration',icon:'🪴',need:1,desc:'Kissen, Bilder, Pflanzen und Lichter'},
 {id:'tapeten',label:'Tapeten & Wände',icon:'🎨',need:3,desc:'Gestalte die Wände im Baumhaus'},
 {id:'buecher',label:'Bücher',icon:'📚',need:4,desc:'Neue Geschichten für Bärlis Bibliothek'},
 {id:'technik',label:'Elektrogeräte',icon:'📻',need:5,desc:'Radio, Uhr, Fernseher und Beleuchtung'},
 {id:'weihnachten',label:'Weihnachten',icon:'🎄',need:6,desc:'Baum, Kugeln, Lichter und Geschenke'},
 {id:'premium',label:'Besondere Möbel',icon:'✨',need:8,desc:'Die große Wunschliste'},
 {id:'extra',label:'Extra-Raum',icon:'🚪',need:10,desc:'Ein zweites Zimmer im Baumhaus'}
];
const item=(id,name,category,price,kind,color,desc)=>({id,name,category,price,kind,color,desc});
const products=[
 item('bett','Gemütliches Holzbett','moebel',16,'bed','#b88057','Das erste Bett für Bärli.'),
 item('nachttisch','Nachttisch aus Holz','moebel',7,'nightstand','#bf8d61','Für Wecker, Buch oder Lampe.'),
 item('bettwaesche-blau','Blaue Bettwäsche','moebel',6,'bedding','#76a9d4','Kuschelige Decke und Kissen.'),
 item('bettwaesche-sterne','Sternenbettwäsche','moebel',7,'bedding','#a58dc3','Mit funkelnden Sternen.'),
 item('bettwaesche-weihnachten','Weihnachtsbettwäsche','moebel',8,'bedding','#c8656d','Mit Wintermotiven.'),
 item('schreibtisch','Schreibtisch','moebel',12,'desk','#b88c5e','Hier kann Bärli schreiben.'),
 item('stuhl','Gelber Stuhl','moebel',6,'chair','#e0be6e','Zum Sitzen am Schreibtisch.'),
 item('buecherregal','Bücherregal','moebel',13,'bookshelf','#a97759','Platz für Geschichten.'),
 item('kleiderschrank','Kleiderschrank','moebel',17,'wardrobe','#b59172','Für weitere Bärli-Sachen.'),
 item('tisch','Runder Holztisch','moebel',9,'table','#c69d70','Für Kekse und Spiele.'),
 item('sofa','Türkises Sofa','moebel',18,'sofa','#70aaa6','Eine kuschelige Sitzecke.'),
 item('teppich','Runder Kuschelteppich','moebel',6,'rug','#e5b897','Weich für Bärlis Pfoten.'),
 item('truhe','Schatztruhe','moebel',8,'chest','#c48f58','Ein Platz für kleine Schätze.'),
 item('kommode','Kommode','moebel',11,'dresser','#c39c73','Mit zwei Schubladen.'),
 item('sitzsack-gruen','Grüner Sitzsack','moebel',8,'beanbag','#84b68d','Ein zweiter weicher Platz.'),
 item('waende-wolken','Wolkentapete','tapeten',7,'wallpaper','#c6def1','Leichte Wolken an der Wand.'),
 item('waende-wald','Waldtapete','tapeten',8,'wallpaper','#b2cfb4','Ein Zimmer im grünen Wald.'),
 item('waende-sterne','Sterntapete','tapeten',8,'wallpaper','#cbbddd','Bunte Sterne auf sanftem Lila.'),
 item('waende-regen','Regentapete','tapeten',7,'wallpaper','#bddae5','Blauer Regentag.'),
 item('waende-weihnachten','Weihnachtstapete','tapeten',10,'wallpaper','#eed2c7','Rot und Grün zur Weihnachtszeit.'),
 item('waende-regenbogen','Regenbogentapete','tapeten',9,'wallpaper','#f4d4ae','Viele freundliche Farben.'),
 item('buch-abenteuer','Abenteuerbuch','buecher',4,'book','#dcab69','Spannende Entdeckungen.'),
 item('buch-tiere','Tierbuch','buecher',4,'book','#8fbc8c','Alles über Tiere.'),
 item('buch-detektiv','Detektivbuch','buecher',5,'book','#80a9c4','Fälle zum Miträtseln.'),
 item('buch-maerchen','Märchenbuch','buecher',5,'book','#a792cc','Märchen zum Vorlesen.'),
 item('buch-weihnachten','Weihnachtsbuch','buecher',5,'book','#cf7779','Winterliche Geschichten.'),
 item('buch-sprache','Wörterzauberbuch','buecher',6,'book','#e6c46b','Sprachspiele und neue Wörter.'),
 item('buch-sterne','Buch der Sterne','buecher',6,'book','#648fae','Eine Reise zum Nachthimmel.'),
 item('radio','Bärlis Radio','technik',8,'radio','#7da7cb','Mit sichtbaren Lautsprechern.'),
 item('wecker','Blauer Wecker','technik',6,'clock','#8daed0','Damit Bärli pünktlich aufsteht.'),
 item('fernseher','Kleiner Fernseher','technik',18,'tv','#7296a5','Ein Bildschirm im Baumhaus.'),
 item('musikanlage','Musikanlage','technik',13,'radio','#8876a4','Musik für gemütliche Tage.'),
 item('ventilator','Mini-Ventilator','technik',8,'fan','#8abcc3','Für Sommertage.'),
 item('leselampe','Leselampe','technik',6,'lamp','#f0c577','Licht am Abend.'),
 item('tablet','Bärlis Lerntablet','technik',14,'tv','#82a4c8','Ein zusätzliches Gerät.'),
 item('pflanze','Zimmerpflanze','deko',5,'plant','#83b293','Bringt Grün ins Baumhaus.'),
 item('poster','Sternenposter','deko',4,'poster','#98a8cf','Ein Bild für die Wand.'),
 item('uhr','Wanduhr','deko',6,'clock','#e3bd85','Die Zeit im Blick.'),
 item('spiegel','Kleiner Spiegel','deko',6,'mirror','#b8d5e4','Mit goldenem Rahmen.'),
 item('kissen','Blaues Kissen','deko',4,'pillow','#87a9cc','Passt zum Sitzsack.'),
 item('schneekugel','Schneekugel','deko',7,'globe','#b3d6e2','Mit einem funkelnden Stern.'),
 item('laterne','Sternenlaterne','deko',5,'lamp','#e9bd75','Ein warmes Licht.'),
 item('geschenk','Geschenkbox','deko',5,'gift','#d78d94','Zum Dekorieren.'),
 item('weihnachtsbaum','Weihnachtsbaum','weihnachten',14,'tree','#528b66','Den Baum im Zimmer aufstellen.'),
 item('kugeln','Bunte Christbaumkugeln','weihnachten',5,'ornaments','#c96e7b','Zum Schmücken.'),
 item('lichterkette','Weihnachtslichterkette','weihnachten',8,'garland','#e4bf74','Eine funkelnde Girlande.'),
 item('strumpf','Nikolausstiefel','weihnachten',5,'stocking','#c96a69','Für kleine Überraschungen.'),
 item('schneemann','Kleiner Schneemann','weihnachten',7,'snowman','#a9cbd6','Winterdeko.'),
 item('kranz','Adventskranz','weihnachten',7,'wreath','#79a787','Ein grüner Kranz.'),
 item('weihnachtsposter','Weihnachtsbild','weihnachten',5,'poster','#d29394','Ein festliches Bild.'),
 item('kamin','Kamin mit Flammen','premium',21,'fireplace','#bd8064','Für das große Baumhaus.'),
 item('leseecke','Gemütliche Leseecke','premium',19,'sofa','#a18aba','Ein besonderer Rückzugsplatz.'),
 item('fernrohr','Sternenfernrohr','premium',16,'telescope','#81a4b4','Zum Sterneentdecken.'),
 item('zimmer2','Zweites Baumhauszimmer','extra',20,'room','#7b9b79','Eine zweite einrichtbare Etage.')
];
const known=new Map(products.map(p=>[p.id,p]));
if(known.size!==products.length)throw Error('Doppelte Baumhaus-Artikel-ID');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,low,high)=>Math.max(low,Math.min(high,n));
const getCat=id=>categories.find(c=>c.id===id);
const day=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date());
const idExam=(topic,n)=>topic+':test:'+n;
function examScores(){
 let source={};try{source=JSON.parse(localStorage.getItem(PREP)||'{}')||{};}catch{}
 const out={};
 for(const topic of ['hoeren','nomen'])for(let n=1;n<=5;n++){
  const key=idExam(topic,n),s=source[key],target=topic==='hoeren'?5:15;
  if(!s?.done||!Array.isArray(s.answers)||s.answers.length!==target||s.assisted)continue;
  if(!s.answers.every(a=>a&&typeof a.correct==='boolean'))continue;
  const pct=Math.round(100*s.answers.filter(a=>a.correct).length/target);
  if(pct>=PASS)out[key]=pct;
 }
 return out;
}
function clean(){
 let raw={};try{raw=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{}
 const best={};
 if(raw.best&&typeof raw.best==='object')for(const [key,value] of Object.entries(raw.best)){
  if(/^(hoeren|nomen):test:[1-5]$/.test(key)&&Number.isFinite(value)&&value>=PASS&&value<=100)best[key]=value;
 }
 const orders={};
 if(raw.orders&&typeof raw.orders==='object')for(const [key,amount] of Object.entries(raw.orders)){
  const p=known.get(key);if(p&&amount===p.price)orders[key]=p.price;
 }
 const placed=[];
 if(Array.isArray(raw.placed))for(const p of raw.placed){
  if(!p||!Object.hasOwn(orders,p.id)||!known.has(p.id)||['wallpaper','room'].includes(known.get(p.id).kind)||placed.some(x=>x.id===p.id))continue;
  placed.push({id:p.id,x:clamp(Number(p.x)||50,8,92),y:clamp(Number(p.y)||68,32,86),room:p.room===2&&orders.zimmer2?2:1});
 }
 let wallpaper={1:'',2:''};
 if(raw.wallpaper&&typeof raw.wallpaper==='object')for(const i of [1,2]){
  const id=raw.wallpaper[i];if(orders[id]&&known.get(id)?.kind==='wallpaper')wallpaper[i]=id;
 }
 const positions={};
 for(const id of ['start-sitzsack','start-laptop']){
  const p=raw.positions?.[id],fallback=id==='start-sitzsack'?{x:25,y:77}:{x:78,y:76};
  positions[id]={x:clamp(Number(p?.x)||fallback.x,8,92),y:clamp(Number(p?.y)||fallback.y,34,86)};
 }
 return {best,orders,placed,wallpaper,positions,room:raw.room===2&&orders.zimmer2?2:1};
}
function store(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
function stateRead(){
 const state=clean(),scores=examScores();
 let changed=false;
 for(const [key,value] of Object.entries(scores))if(!state.best[key]||value>state.best[key]){state.best[key]=value;changed=true;}
 if(changed)store(state);
 return state;
}
function stats(state){const passed=Object.keys(state.best).length,spent=Object.values(state.orders).reduce((n,c)=>n+c,0);return {passed,earned:passed*PER_EXAM,spent,balance:Math.max(0,passed*PER_EXAM-spent)};}
const bought=(state,id)=>Object.hasOwn(state.orders,id);
const catOpen=(state,c)=>stats(state).passed>=c.need;
function iconArt(kind,fill){
 const f=esc(fill||'#88b6af'),dark='#49605a',wood='#876b57',white='#fff8e7';
 const obj={
 beanbag:'<path d="M19 89Q-1 66 22 38Q28 1 64 13Q101 5 110 44Q130 86 92 100Q48 116 19 89Z" fill="'+f+'"/><path d="M30 74q23 24 66 3" stroke="#d6e9f7" stroke-width="5" fill="none"/>',
 laptop:'<rect x="25" y="14" width="79" height="57" rx="5" fill="#416ca6"/><rect x="31" y="20" width="67" height="45" rx="2" fill="#e6d377"/><path d="M13 78h103l-11 18H24Z" fill="#5879b5"/><circle cx="64" cy="44" r="10" fill="#5174bb"/><text x="64" y="49" fill="#ffeb9a" text-anchor="middle" font-size="11" font-weight="bold">B</text>',
 bed:'<rect x="12" y="43" width="104" height="46" rx="6" fill="'+f+'"/><rect x="15" y="24" width="25" height="58" rx="6" fill="'+wood+'"/><rect x="38" y="43" width="70" height="31" rx="7" fill="#f3e0bf"/><rect x="45" y="44" width="31" height="16" rx="7" fill="#d9e8ec"/><path d="M18 88v13m92-13v13" stroke="'+wood+'" stroke-width="9"/>',
 bedding:'<rect x="14" y="35" width="101" height="52" rx="9" fill="'+f+'"/><rect x="19" y="38" width="35" height="20" rx="8" fill="'+white+'"/><path d="m78 55 5 9 11 2-8 7 2 11-10-5-9 5 1-11-8-7 11-2Z" fill="#f8e5a8"/>',
 nightstand:'<rect x="25" y="30" width="81" height="65" rx="7" fill="'+f+'"/><path d="M29 49h73m-73 22h73" stroke="'+wood+'" stroke-width="5"/><circle cx="66" cy="59" r="4" fill="'+white+'"/><path d="M34 96v10m63-10v10" stroke="'+wood+'" stroke-width="8"/>',
 desk:'<rect x="12" y="39" width="104" height="17" rx="4" fill="'+f+'"/><path d="M26 54v52m75-52v52" stroke="'+wood+'" stroke-width="10"/><rect x="68" y="11" width="34" height="26" fill="#f8e6c3"/>',
 chair:'<rect x="35" y="21" width="58" height="54" rx="8" fill="'+f+'"/><path d="M27 68h73v14H27Z" fill="'+wood+'"/><path d="M38 80v26m50-26v26" stroke="'+wood+'" stroke-width="8"/>',
 bookshelf:'<rect x="19" y="9" width="92" height="99" rx="6" fill="'+f+'"/><path d="M22 43h86M22 79h86" stroke="'+wood+'" stroke-width="7"/><path d="M33 19v22m15-25v25m16-18v18m15-22v22M34 53v23m19-20v20m22-21v21m17-17v17" stroke="#e8dfb2" stroke-width="10"/>',
 wardrobe:'<rect x="24" y="8" width="84" height="100" rx="6" fill="'+f+'"/><path d="M66 10v96" stroke="'+wood+'" stroke-width="5"/><circle cx="56" cy="62" r="5" fill="'+white+'"/><circle cx="77" cy="62" r="5" fill="'+white+'"/>',
 table:'<ellipse cx="64" cy="44" rx="51" ry="22" fill="'+f+'"/><path d="M64 62v35m-20 0h40" stroke="'+wood+'" stroke-width="12"/>',
 sofa:'<rect x="12" y="49" width="106" height="42" rx="14" fill="'+f+'"/><path d="M17 51V29q7-14 28-5h39q28-8 30 16v13" stroke="'+dark+'" stroke-width="10" fill="'+f+'"/><path d="M19 88v12m94-12v12" stroke="'+wood+'" stroke-width="8"/>',
 rug:'<ellipse cx="65" cy="70" rx="56" ry="28" fill="'+f+'"/><ellipse cx="65" cy="69" rx="39" ry="15" fill="none" stroke="#f4dfaf" stroke-width="7"/>',
 chest:'<rect x="17" y="38" width="96" height="57" rx="9" fill="'+f+'"/><path d="M18 55h95M46 39v57m39-57v57" stroke="'+wood+'" stroke-width="8"/><rect x="56" y="53" width="17" height="26" rx="5" fill="#f3d58a"/>',
 dresser:'<rect x="18" y="18" width="94" height="87" rx="6" fill="'+f+'"/><path d="M25 46h80M25 77h80" stroke="'+wood+'" stroke-width="7"/><circle cx="66" cy="60" r="5" fill="'+white+'"/><circle cx="66" cy="89" r="5" fill="'+white+'"/>',
 wallpaper:'<path d="M15 15h98v93H15Z" fill="'+f+'"/><path d="m25 34 12-12 12 12 13-12 13 12 13-12 14 12M25 70l12-12 12 12 13-12 13 12 13-12 14 12" fill="none" stroke="#f4efdf" stroke-width="7"/>',
 book:'<path d="M21 11h88v97H21Z" fill="'+f+'"/><path d="M32 13v93" stroke="'+white+'" stroke-width="7"/><path d="M49 43h47M49 57h37" stroke="'+white+'" stroke-width="6"/><path d="m72 70 6 11 12 2-9 8 2 12-11-6-11 6 2-12-9-8 12-2Z" fill="#ffe4a2"/>',
 radio:'<rect x="12" y="27" width="105" height="68" rx="12" fill="'+f+'"/><circle cx="45" cy="62" r="22" fill="#e2d9bf" stroke="'+dark+'" stroke-width="6"/><circle cx="92" cy="51" r="8" fill="#fff0c1"/><path d="M77 73h28M25 24l77-14" stroke="'+dark+'" stroke-width="5"/>',
 clock:'<circle cx="65" cy="56" r="42" fill="'+f+'" stroke="'+dark+'" stroke-width="8"/><path d="M65 30v27l16 12" stroke="'+white+'" stroke-width="7" fill="none" stroke-linecap="round"/>',
 tv:'<rect x="10" y="21" width="110" height="72" rx="9" fill="'+dark+'"/><rect x="18" y="29" width="94" height="55" rx="3" fill="'+f+'"/><path d="M65 94v13m-30 0h60" stroke="'+dark+'" stroke-width="7"/>',
 fan:'<circle cx="65" cy="45" r="36" fill="#e7f3f2" stroke="'+dark+'" stroke-width="6"/><path d="M65 45q-8-42 15-25t-15 25q39-14 35 12T65 45q-24 40-39 17t39-17" fill="'+f+'"/><path d="M65 80v27m-24 0h48" stroke="'+dark+'" stroke-width="8"/>',
 lamp:'<path d="M40 18h51l18 55H22Z" fill="'+f+'" stroke="'+dark+'" stroke-width="5"/><path d="M65 73v30m-24 0h48" stroke="'+wood+'" stroke-width="8"/>',
 plant:'<path d="M34 64h62l-10 42H44Z" fill="#bd8b6c"/><path d="M64 68V16M63 56Q15 30 33 12q33 3 30 44m2-8Q117 7 100 20q-24 0-35 28" fill="'+f+'" stroke="'+dark+'" stroke-width="5"/>',
 poster:'<rect x="21" y="12" width="90" height="92" rx="4" fill="'+f+'" stroke="'+wood+'" stroke-width="10"/><path d="m66 26 10 22 23 4-17 16 3 23-19-11-19 11 3-23-18-16 24-4Z" fill="#f7db9d"/>',
 mirror:'<ellipse cx="65" cy="55" rx="36" ry="47" fill="#d8ebed" stroke="'+f+'" stroke-width="12"/><path d="m49 43 24-22m-16 37 28-27" stroke="#ffffff" stroke-width="7"/>',
 pillow:'<rect x="21" y="24" width="88" height="75" rx="26" fill="'+f+'"/><path d="m65 39 6 17 17 4-13 12 3 17-13-9-13 9 2-17-13-12 18-4Z" fill="#ffe2a3"/>',
 globe:'<circle cx="65" cy="53" r="43" fill="#d8e6ed" stroke="'+dark+'" stroke-width="7"/><path d="m65 18 10 21 24 3-17 15 4 24-21-12-21 12 3-24-17-15 24-3Z" fill="'+f+'"/><path d="M26 98h78v14H26Z" fill="'+wood+'"/>',
 gift:'<rect x="24" y="31" width="83" height="74" rx="7" fill="'+f+'"/><path d="M65 31v74M24 57h83" stroke="#f7e5a4" stroke-width="11"/><path d="M65 29Q22-6 40 8q13-6 25 21Q78-2 94 8q9 12-29 21" stroke="#f7e5a4" stroke-width="6" fill="none"/>',
 tree:'<path d="M65 4 25 54h19L14 86h101L86 54h20Z" fill="'+f+'" stroke="'+dark+'" stroke-width="6"/><path d="M60 86v24h13V86" fill="'+wood+'"/><circle cx="65" cy="25" r="7" fill="#ffdb87"/><circle cx="43" cy="67" r="7" fill="#d77a87"/><circle cx="85" cy="80" r="7" fill="#e6ca82"/>',
 ornaments:'<path d="M45 9v32m44-27v29" stroke="'+dark+'" stroke-width="7"/><circle cx="45" cy="66" r="29" fill="'+f+'"/><circle cx="91" cy="74" r="23" fill="#e9cb82"/>',
 garland:'<path d="M9 29Q34 84 65 31T121 29" fill="none" stroke="'+dark+'" stroke-width="8"/><g fill="'+f+'"><circle cx="27" cy="48" r="11"/><circle cx="64" cy="39" r="11"/><circle cx="103" cy="47" r="11"/></g>',
 stocking:'<path d="M34 10h54v60q5 10 26 13 10 21-13 24H36Q17 94 34 76Z" fill="'+f+'"/><path d="M34 18h54" stroke="'+white+'" stroke-width="17"/>',
 snowman:'<circle cx="65" cy="76" r="34" fill="#f7f7f1" stroke="#b5cbd0" stroke-width="5"/><circle cx="65" cy="31" r="23" fill="#f7f7f1" stroke="#b5cbd0" stroke-width="5"/><path d="M35 15h59" stroke="'+dark+'" stroke-width="9"/><circle cx="58" cy="29" r="3" fill="'+dark+'"/><circle cx="72" cy="29" r="3" fill="'+dark+'"/><path d="m65 36 14 5-14 3" fill="#edb170"/><circle cx="65" cy="65" r="4" fill="'+dark+'"/>',
 wreath:'<circle cx="65" cy="56" r="40" fill="none" stroke="'+f+'" stroke-width="26"/><circle cx="42" cy="49" r="7" fill="#d87480"/><circle cx="83" cy="75" r="7" fill="#d87480"/><path d="M51 15q13 32 26 0" stroke="#e7bd73" stroke-width="13"/>',
 fireplace:'<rect x="20" y="26" width="93" height="83" rx="5" fill="'+f+'"/><rect x="37" y="46" width="59" height="55" fill="'+dark+'"/><path d="M46 89q-9-27 8-33 0 18 11 20 10-25 16-14 17 29-14 38Z" fill="#e7ac69"/><path d="M14 28h103" stroke="'+wood+'" stroke-width="13"/>',
 telescope:'<path d="m27 30 72-23 10 24-72 27Z" fill="'+f+'" stroke="'+dark+'" stroke-width="6"/><path d="M67 47v54m-27 6 27-50 28 50" stroke="'+wood+'" stroke-width="8"/>',
 room:'<path d="M28 14h76v99H28Z" fill="'+f+'" stroke="'+wood+'" stroke-width="8"/><path d="M52 25h32v88H52Z" fill="#b6d2df"/><circle cx="77" cy="72" r="5" fill="#f8e3ac"/>'
 };
 return '<svg class="bh-art" viewBox="0 0 130 120" role="img" aria-hidden="true"><g stroke-linejoin="round" stroke-linecap="round">'+(obj[kind]||obj.poster)+'</g></svg>';
}
function preview(p){return iconArt(p.kind,p.color);}
function htmlHead(title,sub=''){
 return '<div class="bh-shell"><a href="#" class="bh-back">← Zur Startseite</a><div class="bh-title"><span class="bh-title-icon" aria-hidden="true">🌳</span><div><p class="bh-kicker">Maja und Bärli · Belohnungswelt</p><h1 tabindex="-1">'+esc(title)+'</h1><p>'+esc(sub)+'</p></div></div>';
}
function statHeader(s){
 const t=stats(s);
 return '<div class="bh-stats"><span>🏆 <b>'+t.passed+' von 10</b> Prüfungen bestanden</span><span>🪙 <b>'+t.balance+'</b> Bärli-Taler verfügbar</span><span>📦 '+Object.keys(s.orders).length+' Bestellungen</span></div>';
}
function closed(){
 const s=stateRead(),t=stats(s);
 return htmlHead('Bärlis Baumhaus','Hier wächst mit deinen bestandenen Tests ein eigenes Zimmer.')
  +statHeader(s)+'<section class="bh-locked"><div class="bh-lock-picture" aria-hidden="true">🌳🏠</div><h2>Das Baumhaus ist noch verschlossen</h2><p>Bestehe deinen ersten Abschlusstest mit mindestens <strong>80 Prozent</strong>. Danach dürfen Bärli und du einziehen.</p><p>Im Zimmer wartet anfangs nur ein <strong>blauer Sitzsack</strong>. Bärli bringt seinen Laptop mit, über den der gelb-blaue Shop geöffnet wird.</p><a class="bh-yellow" href="#pruefung">Jetzt für die Prüfungen üben →</a><p class="bh-subtle">Jeder der zehn verschiedenen Abschlusstests kann einmal 10 Bärli-Taler bringen.</p></section></div>';
}
let message='',shopPage=0,selected='start-sitzsack';
function statusMsg(){return message?'<p class="bh-message" role="status" aria-live="polite">'+esc(message)+'</p>':'';}
function sceneObject(id,x,y,s,t){
 const p=known.get(id),isFree=id.startsWith('start-');
 if(!isFree&&!p)return '';
 const kind=id==='start-sitzsack'?'beanbag':id==='start-laptop'?'laptop':p.kind;
 const fill=id==='start-sitzsack'?'#649ace':id==='start-laptop'?'#e9c96e':p.color;
 const title=id==='start-sitzsack'?'Blauer Sitzsack':id==='start-laptop'?'Bärlis Laptop · Shop öffnen':p.name;
 const cls='bh-object bh-'+kind+(selected===id?' bh-selected':'');
 return '<button class="'+cls+'" type="button" data-bh-select="'+esc(id)+'" title="'+esc(title)+'" aria-label="'+esc(title)+'" aria-pressed="'+(selected===id)+'" style="left:'+x+'%;top:'+y+'%;z-index:'+Math.floor(y)+'">'+iconArt(kind,fill)+'<span>'+esc(id==='start-laptop'?'Shop öffnen':title)+'</span></button>';
}
function wallpaperStyle(s,room){
 const id=s.wallpaper[room],p=known.get(id);
 return {color:p?.color||'#f4e0bb',name:p?.name||'Holzwände',id};
}
function roomObjects(s,room){
 const starter=room===1?[{id:'start-sitzsack',...s.positions['start-sitzsack']},{id:'start-laptop',...s.positions['start-laptop']}]:[];
 return [...starter,...s.placed.filter(x=>x.room===room)];
}
function showRoom(){
 const s=stateRead(),t=stats(s);
 if(t.passed<1){document.querySelector('#app').innerHTML=closed();return;}
 const room=s.room,objects=roomObjects(s,room),wall=wallpaperStyle(s,room),current=objects.find(x=>x.id===selected);
 const html=htmlHead('Bärlis Baumhaus','Richte dein Zimmer nach deinen Wünschen ein. Der blaue Sitzsack und der Laptop waren von Anfang an dabei.')
  +statHeader(s)
  +'<nav class="bh-nav"><a href="#baumhaus/shop" class="bh-yellow">🛒 Bärli AG Osnabrück</a><a href="#baerli/schrank" class="bh-secondary">👕 Bärlis Kleidung</a><a href="#pruefung" class="bh-secondary">🏆 Prüfungen</a></nav>'
  +(bought(s,'zimmer2')?'<div class="bh-rooms"><button type="button" data-bh-room="1" aria-pressed="'+(room===1)+'">🌳 Mein erstes Zimmer</button><button type="button" data-bh-room="2" aria-pressed="'+(room===2)+'">⭐ Zweites Zimmer</button></div>':'')
  +'<div class="bh-room-info"><strong>'+ (room===1?'Mein Baumhauszimmer':'Mein zweites Zimmer') +'</strong><small>Wand: '+esc(wall.name)+'</small></div>'
  +'<div class="bh-room-stage" style="--bh-wall:'+wall.color+';" role="group" aria-label="Einrichtbares Baumhauszimmer">'
  +'<div class="bh-tree-outside" aria-hidden="true">🌳 <span>🍃</span></div><div class="bh-wall"></div><div class="bh-ceiling"></div><div class="bh-window" aria-hidden="true"><span>☁️</span></div>'
  +(wall.id?'<div class="bh-wall-pattern bh-'+esc(wall.id)+'" aria-hidden="true"></div>':'')
  +'<div class="bh-floor"></div><div class="bh-bear" aria-label="Bärli steht im Baumhaus"><img src="./baerli/baerli.webp" alt="Bärli im lila Anzug" width="85" height="85"><span>Bärli</span></div>'
  +objects.map(o=>sceneObject(o.id,o.x,o.y,s,t)).join('')
  +'<div class="bh-tiny-status">Tippe auf ein Möbelstück und richte es ein.</div></div>'
  +'<section class="bh-editor" aria-label="Möbel platzieren"><h2>Zimmer einrichten</h2><p>Wähle einen Gegenstand unten aus. Mit den Pfeilen oder einem Tipp auf eine freie Stelle im Zimmer kannst du ihn verschieben.</p>'
  +'<div class="bh-object-list">'+objects.map(x=>'<button type="button" data-bh-choose="'+esc(x.id)+'" aria-pressed="'+(selected===x.id)+'">'+esc(x.id==='start-sitzsack'?'🔵 Blauer Sitzsack':x.id==='start-laptop'?'💻 Bärlis Laptop':known.get(x.id)?.name||x.id)+'</button>').join('')+'</div>'
  +(current?'<div class="bh-editor-controls"><span class="bh-selection">Ausgewählt: <strong>'+esc(current.id==='start-sitzsack'?'Blauer Sitzsack':current.id==='start-laptop'?'Bärlis Laptop':known.get(current.id)?.name||current.id)+'</strong></span><div class="bh-arrows"><button data-bh-move="left" aria-label="Nach links schieben">←</button><button data-bh-move="up" aria-label="Nach oben schieben">↑</button><button data-bh-move="down" aria-label="Nach unten schieben">↓</button><button data-bh-move="right" aria-label="Nach rechts schieben">→</button></div>'
   +(current.id.startsWith('start-')?'': '<button type="button" data-bh-pack class="bh-secondary">In die Kiste legen</button>')
   +(bought(s,'zimmer2')&&!current.id.startsWith('start-')?'<button type="button" data-bh-transfer class="bh-secondary">In das andere Zimmer bringen</button>':'')
   +'</div>':'<p>Du hast noch keine Möbel in diesem Zimmer.</p>')
  +'</section>'
  +(s.placed.filter(x=>!objects.some(o=>o.id===x.id)).length?'<p class="bh-subtle">Weitere Möbel stehen im anderen Zimmer.</p>':'')
  +'<section class="bh-owned"><h2>Meine Bestellungen</h2><p>Schrank und Weihnachtsdeko kannst du unabhängig davon sammeln.</p><div class="bh-owned-list">'
  +products.filter(p=>bought(s,p.id)&&p.kind!=='room').map(p=>{
    const placed=s.placed.some(x=>x.id===p.id),activeWallpaper=s.wallpaper[room]===p.id;
    return '<button type="button" data-bh-add="'+p.id+'">'+preview(p)+'<span>'+esc(p.name)+'</span><small>'+(p.kind==='wallpaper'?(activeWallpaper?'An der Wand':'An die Wand'):placed?'Im Zimmer / einlagern':'Aufstellen')+'</small></button>';
  }).join('')+'</div></section>'
  +statusMsg()+'<div class="bh-bottom"><a href="#baumhaus/shop">Weitere Sachen bei Bärli AG bestellen →</a><a href="#einstellungen">Baumhaus sichern</a></div></div>';
 const app=document.querySelector('#app');app.innerHTML=html;
 app.querySelectorAll('[data-bh-room]').forEach(b=>b.onclick=()=>{s.room=Number(b.dataset.bhRoom);store(s);selected=s.room===1?'start-sitzsack':null;message='';showRoom();});
 app.querySelectorAll('[data-bh-choose]').forEach(b=>b.onclick=()=>{selected=b.dataset.bhChoose;message='Mit den Pfeilen oder durch Tippen im Zimmer verschieben.';showRoom();});
 app.querySelectorAll('[data-bh-select]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(b.dataset.bhSelect==='start-laptop'){location.hash='#baumhaus/shop';return;}selected=b.dataset.bhSelect;message='Ausgewählt. Du kannst dieses Möbelstück verschieben.';showRoom();});
 app.querySelectorAll('[data-bh-move]').forEach(b=>b.onclick=()=>{const o=roomObjects(s,room).find(x=>x.id===selected);if(!o)return;const delta={left:[-6,0],right:[6,0],up:[0,-5],down:[0,5]}[b.dataset.bhMove];place(s,o.id,clamp(o.x+delta[0],8,92),clamp(o.y+delta[1],34,86));message='Position gespeichert.';showRoom();});
 const stage=app.querySelector('.bh-room-stage');
 stage.onclick=e=>{if(!selected||!roomObjects(s,room).some(x=>x.id===selected)||e.target.closest('button'))return;const rect=stage.getBoundingClientRect();const x=clamp(Math.round((e.clientX-rect.left)/rect.width*100),8,92),y=clamp(Math.round((e.clientY-rect.top)/rect.height*100),34,86);place(s,selected,x,y);message='Bärli hat die Sache an den neuen Platz gestellt.';showRoom();};
 app.querySelector('[data-bh-pack]')?.addEventListener('click',()=>{s.placed=s.placed.filter(o=>o.id!==selected);store(s);selected=null;message='Das Möbelstück steht jetzt sicher in der Kiste. Du kannst es erneut aufstellen.';showRoom();});
 app.querySelector('[data-bh-transfer]')?.addEventListener('click',()=>{const object=s.placed.find(o=>o.id===selected);if(object){object.room=room===1?2:1;store(s);selected=null;message='Das Möbelstück wurde in das andere Zimmer gebracht.';showRoom();}});
 app.querySelectorAll('[data-bh-add]').forEach(b=>b.onclick=()=>{
  const p=known.get(b.dataset.bhAdd);if(!p)return;
  if(p.kind==='wallpaper'){s.wallpaper[room]=p.id;store(s);message=p.name+' ist jetzt an der Wand.';showRoom();return;}
  const existing=s.placed.find(x=>x.id===p.id);if(existing){s.placed=s.placed.filter(x=>x.id!==p.id);selected=null;message='In die Möbelkiste gelegt.';}
  else{const count=s.placed.filter(x=>x.room===room).length;const spots=[[44,77],[65,78],[52,64],[31,60],[77,62],[35,78],[64,58],[83,80],[20,54],[50,81]];const [x,y]=spots[count%spots.length];s.placed.push({id:p.id,x,y,room});selected=p.id;message=p.name+' wurde aufgestellt.';}
  store(s);showRoom();
 });
}
function place(s,id,x,y){
 if(id.startsWith('start-'))s.positions[id]={x,y};
 else{const o=s.placed.find(p=>p.id===id);if(o){o.x=x;o.y=y;}}
 store(s);
}
function shopHero(s){return '<div class="bh-shop-brand"><span aria-hidden="true">💻</span><div><strong>Bärli AG Osnabrück</strong><small>Der gelb-blaue Shop für dein Baumhaus</small></div><span class="bh-shop-star" aria-hidden="true">★</span></div>';}
function showShop(category='',page=0){
 const s=stateRead(),t=stats(s);if(t.passed<1){document.querySelector('#app').innerHTML=closed();return;}
 const cat=getCat(category);shopPage=Math.max(0,Number(page)||0);
 let html=htmlHead('Bärlis Laptop-Shop','Hier bestellst du mit selbst verdienten Bärli-Talern. Das ist nur ein Spiel – keine echten Bestellungen.')
  +shopHero(s)+statHeader(s)
  +'<nav class="bh-nav"><a href="#baumhaus" class="bh-secondary">← Mein Baumhaus</a><a href="#pruefung" class="bh-secondary">Weitere Taler verdienen</a></nav>';
 if(!cat){
  html+='<section class="bh-shop-cats" aria-label="Shop-Kategorien">'+categories.map(c=>{
    const unlocked=catOpen(s,c);
    return '<a class="bh-shop-cat" href="#baumhaus/shop/'+c.id+'"><span class="bh-cat-icon" aria-hidden="true">'+c.icon+'</span><strong>'+esc(c.label)+'</strong><small>'+esc(c.desc)+'</small><span class="bh-cat-status">'+(unlocked?'✓ Freigeschaltet':'🔒 Ab '+c.need+' bestandenen Prüfungen')+'</span></a>';
  }).join('')+'</section>';
 }else{
  const unlocked=catOpen(s,cat),list=products.filter(p=>p.category===cat.id),size=4,max=Math.max(0,Math.ceil(list.length/size)-1);shopPage=clamp(shopPage,0,max);
  html+='<a class="bh-back" href="#baumhaus/shop">← Alle Abteilungen</a><section class="bh-cat-heading"><span class="bh-cat-icon" aria-hidden="true">'+cat.icon+'</span><div><h2>'+esc(cat.label)+'</h2><p>'+esc(cat.desc)+'</p></div></section>';
  if(!unlocked)html+='<p class="bh-shop-lock">🔒 Hier fehlen noch <strong>'+Math.max(0,cat.need-t.passed)+'</strong> bestandene Prüfungen. Du kannst die Sachen schon anschauen.</p>';
  html+='<div class="bh-shop-products">'+list.slice(shopPage*size,(shopPage+1)*size).map(p=>{
    const owned=bought(s,p.id),available=unlocked&&t.balance>=p.price;
    return '<article class="bh-product"><div class="bh-product-art">'+preview(p)+'</div><div class="bh-product-copy"><h3>'+esc(p.name)+'</h3><p>'+esc(p.desc)+'</p><strong>🪙 '+p.price+' Bärli-Taler</strong></div><button type="button" data-bh-buy="'+p.id+'" '+(owned||!available?'disabled':'')+'>'+(owned?'✓ Bereits bestellt':!unlocked?'Noch gesperrt':!available?'Taler fehlen':'Jetzt bestellen')+'</button></article>';
  }).join('')+'</div>';
  html+='<nav class="bh-shop-pages"><button type="button" data-bh-page="-1" '+(shopPage===0?'disabled':'')+'>← Zurück</button><span>Seite '+(shopPage+1)+' von '+(max+1)+'</span><button type="button" data-bh-page="1" '+(shopPage===max?'disabled':'')+'>Weiter →</button></nav>';
 }
 html+=statusMsg()+'<p class="bh-safe-note">Nur Spielgeld: keine Anmeldung, keine Zahlungsdaten, kein echter Versand.</p></div>';
 const app=document.querySelector('#app');app.innerHTML=html;
 app.querySelectorAll('[data-bh-page]').forEach(b=>b.onclick=()=>{message='';showShop(cat.id,shopPage+Number(b.dataset.bhPage));});
 app.querySelectorAll('[data-bh-buy]').forEach(b=>b.onclick=()=>{
  const p=known.get(b.dataset.bhBuy);if(!p||!catOpen(s,getCat(p.category))||bought(s,p.id))return;
  if(stats(s).balance<p.price){message='Noch nicht genug Bärli-Taler. Übe einen weiteren Abschlusstest.';showShop(cat.id,shopPage);return;}
  s.orders[p.id]=p.price;
  if(p.kind==='wallpaper')s.wallpaper[s.room]=p.id;
  else if(p.kind==='room')s.room=2;
  else{
   const n=s.placed.length,positions=[[45,77],[65,76],[55,60],[33,62],[78,61],[22,77],[63,55],[82,78]];
   const [x,y]=positions[n%positions.length];s.placed.push({id:p.id,x,y,room:s.room});
  }
  if(!store(s)){message='Die Bestellung konnte nicht gespeichert werden. Bitte erneut versuchen.';showShop(cat.id,shopPage);return;}
  message=p.name+' bestellt! Es wurden '+p.price+' Bärli-Taler abgezogen. Bärli hat die Lieferung ins Baumhaus gebracht.';
  showShop(cat.id,shopPage);
 });
}
function render(segment='',section=''){
 message='';
 if(segment==='shop')showShop(section);
 else showRoom();
}
window.MajaTreehouse={render,examScores,stateRead,stats,products,categories};
})();