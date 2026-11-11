/* BioLabor 5 · Forschercheck: Transferaufgaben nach jeder Lernstation. */
(function(){
'use strict';
const SECTIONS=['skeleton','origin','teeth','hunt','motion','signals','compare'];
const CASES={
 dog:{
  skeleton:{title:'Warum federt der Hund die Landung ab?',story:'Ein Hund springt von einer niedrigen Stufe. Seine Vorderbeine beugen sich bei der Landung.',question:'Warum schützen die beweglichen Gelenke den Körper?',options:['Die Knochen werden beim Springen weich.','Muskeln bremsen die Bewegung, während sich Gelenke beugen.','Die Zähne tragen das Körpergewicht.'],correct:1,hint:'Welche Teile ziehen an Knochen, und welche erlauben Bewegung?',why:'Knochen geben Halt, Gelenke ermöglichen das Beugen, und Muskeln bremsen die Landung. Sehnen übertragen die Muskelkraft auf Knochen.',wrong:['Knochen bleiben hart. Sie werden nicht weich, um einen Sprung abzufedern.','','Zähne helfen beim Fressen, nicht beim Abfedern.'],observe:'Beobachte im Skelettlabor das Schulter- und Ellbogengelenk bei der Landung.'},
  origin:{title:'Ein Wolf ist noch kein Haushund',story:'Ein junger Wolf wird von Menschen aufgezogen und ist ihnen gegenüber zutraulich.',question:'Ist damit bereits eine neue Haustierart entstanden?',options:['Ja, jedes zahme Tier ist sofort domestiziert.','Ja, wenn der Wolf einen Namen bekommt.','Nein. Domestikation verändert Populationen über viele Generationen.'],correct:2,hint:'Ist „zahm“ dasselbe wie „über Generationen verändert“?',why:'Ein einzelnes Tier kann zahm werden. Domestikation betrifft dagegen Veränderungen in der Abstammungslinie über viele Generationen.',wrong:['Zahmheit eines einzelnen Tieres ist keine Domestikation.','Ein Name verändert keine Abstammungslinie.',''],observe:'Unterscheide Zähmung, Domestikation und spätere Zucht.'},
  teeth:{title:'Festhalten und Zerschneiden',story:'Ein Hund nimmt ein großes Stück tierischer Nahrung auf und trennt es in kleinere Stücke.',question:'Welches Zahn-Team erfüllt diese Aufgaben?',options:['Fangzähne halten fest, Reißzähne schneiden scherenartig.','Schneidezähne atmen, Backenzähne hören.','Alle Zähne erfüllen dieselbe Aufgabe.'],correct:0,hint:'Lange spitze Zähne greifen; scharfe Kanten schneiden.',why:'Fangzähne dienen unter anderem dem Packen und Festhalten. Die Reißzähne (oben P4, unten M1) schneiden mit aneinander vorbeigleitenden Kanten.',wrong:['','Zähne können weder hören noch atmen.','Zahnformen unterscheiden sich und sind an verschiedene Aufgaben angepasst.'],observe:'Schließe im Reißzahnlabor den Unterkiefer langsam und beobachte die orange markierten Kanten.'},
  hunt:{title:'Der Hund findet eine Spur',story:'Ein Hund riecht an einer Stelle, läuft einige Meter, bleibt stehen und prüft die Luft erneut.',question:'Welche Erklärung passt zu dieser Suche?',options:['Er folgt Hinweisen des Geruchssinns und überprüft seine Richtung.','Er kann Beute nur mit den Augen finden.','Alle Hunde jagen immer auf dieselbe Weise.'],correct:0,hint:'Welches Sinnesorgan nutzt der Hund besonders beim Verfolgen von Spuren?',why:'Hunde können mithilfe ihrer Nase sehr gut Geruchsspuren verfolgen. Wahrnehmung, Bewegung und Erfahrung wirken zusammen; Unterschiede zwischen Rassen und Individuen sind groß.',wrong:['','Hunde nutzen mehrere Sinne, nicht ausschließlich die Augen.','Jagd- und Suchverhalten unterscheiden sich zwischen Hunden.'],observe:'Unterscheide Beobachten, Suchen, Verfolgen und Zugreifen.'},
  motion:{title:'Der diagonal versetzte Trab',story:'Beim Traben bewegt ein Hund oft Vorderbein links und Hinterbein rechts ungefähr gleichzeitig.',question:'Wie bezeichnet man dieses Bewegungsmuster?',options:['Beide Vorderbeine setzen immer gleichzeitig auf.','Diagonal gegenüberliegende Beine bilden ein Paar.','Alle vier Beine bleiben am Boden.'],correct:1,hint:'Vergleiche Vorderbein links mit Hinterbein rechts.',why:'Im Trab bewegen sich die diagonal gegenüberliegenden Beinpaare ungefähr gemeinsam. So kann ein Hund gleichmäßig und energiesparend laufen.',wrong:['Das beschreibt nicht den typischen Trab.','','Beim Trab gibt es bewegte Schwungphasen und je nach Geschwindigkeit kurze Flugphasen.'],observe:'Schalte im Bewegungslabor auf „Traben“ und pausiere die Animation.'},
  signals:{title:'Ein wedelnder Schwanz genügt nicht',story:'Ein unbekannter Hund wedelt mit dem Schwanz, steht aber steif, schaut starr und knurrt leise.',question:'Was ist die sicherste Deutung und Reaktion?',options:['Wedeln bedeutet immer Freude: sofort streicheln.','Die gesamte Körpersprache beachten und Abstand halten.','Knurren ignorieren und schnell heranlaufen.'],correct:1,hint:'Beachte Körperanspannung, Blick, Lautäußerung und Situation zusammen.',why:'Schwanzbewegungen sind allein kein sicherer Beweis für Freude. Steife Haltung und Knurren sind wichtige Warnsignale. Abstand geben und das Tier nicht bedrängen.',wrong:['Ein einzelnes Schwanzsignal reicht zur Einschätzung nicht aus.','','Knurren ist ein Warnsignal, kein Spielaufruf.'],observe:'Vergleiche in der Körpersprache-Animation „Entspannt“ und „Drohen“. Immer auch auf den Zusammenhang achten.'},
  compare:{title:'Zwei Raubtiere – zwei Gebisse',story:'Ein Hund und eine Katze gehören beide zur Ordnung der Raubtiere. Trotzdem unterscheiden sich ihre Zähne.',question:'Welche Aussage ist wissenschaftlich korrekt?',options:['Beide besitzen immer 42 bleibende Zähne.','Hunde haben normalerweise 42 und Katzen 30 bleibende Zähne.','Katzen haben 42, Hunde 30 bleibende Zähne.'],correct:1,hint:'Vergleiche die Zahnzahlen in der Gegenüberstellung.',why:'Der erwachsene Hund besitzt normalerweise 42 bleibende Zähne, die erwachsene Katze 30. Beide haben Fang- und Reißzähne, aber unterschiedlich viele Backenzähne.',wrong:['Die Zahlen unterscheiden sich bei Hund und Katze.','','Die Zahnzahlen wurden vertauscht.'],observe:'Zähle im Vergleich die bleibenden Zähne und erkläre die jeweilige Ernährungsweise.'}
 },
 cat:{
  skeleton:{title:'Warum ist die Katze so biegsam?',story:'Eine Katze richtet sich beim Strecken auf und kann ihren Rücken deutlich beugen.',question:'Was unterstützt besonders diese Beweglichkeit?',options:['Eine bewegliche Wirbelsäule mit zahlreichen Gelenken.','Ein völlig starrer Rücken.','Die Fangzähne im Oberkiefer.'],correct:0,hint:'Welche Knochenreihe verläuft vom Hals über den Rücken zum Schwanz?',why:'Viele Wirbel bilden zusammen die bewegliche Wirbelsäule. Besonders ihre Lendenregion kann sich bei der Katze stark beugen und strecken.',wrong:['','Ein starrer Rücken würde diese Bewegung nicht ermöglichen.','Fangzähne bewegen den Rücken nicht.'],observe:'Beobachte im Skelettlabor den Rücken und die Verbindung zum Becken.'},
  origin:{title:'Mäuse an einem Getreidespeicher',story:'Vor Tausenden Jahren finden Wildkatzen Mäuse in der Nähe menschlicher Getreidespeicher.',question:'Warum konnte diese Situation die Entwicklung der Hauskatze begünstigen?',options:['Die Mäuse lockten Wildkatzen in die Nähe der Menschen.','Die Katzen wurden dadurch über Nacht zu Haustieren.','Alle Wildkatzen verschwanden sofort.'],correct:0,hint:'Wo fanden die Tiere Nahrung, und wie lange dauert Domestikation?',why:'Wo Menschen Getreide lagerten, lebten Mäuse. Wildkatzen konnten dort Beute finden. Über viele Generationen begünstigte dies ein engeres Zusammenleben mit Menschen.',wrong:['','Domestikation findet nicht in einer Nacht statt.','Wildkatzenlinien leben weiterhin frei.'],observe:'Halte auseinander, was die Tiere anzog, und wie sich Populationen später veränderten.'},
  teeth:{title:'Eine scharfe Zahnschere',story:'Eine Katze frisst tierische Nahrung. Zwei besondere Backenzähne arbeiten dabei scherenartig.',question:'Welche Zähne bilden das Reißzahnpaar?',options:['Oben der vierte Prämolar und unten der erste Molar.','Zwei Schneidezähne an der Schnauzenspitze.','Ein oberer Fangzahn und ein unterer Fangzahn.'],correct:0,hint:'Die Reißzähne sind besonders geformte Backenzähne.',why:'Auch bei Katzen arbeiten der obere P4 und der untere M1 als Reißzahnschere. Die scharfen Kanten schneiden Nahrung.',wrong:['','Schneidezähne sind nicht das beschriebene Reißzahnpaar.','Fangzähne dienen vor allem dem Packen und Festhalten.'],observe:'Bewege den Kiefer im Reißzahnlabor und suche die orange markierten Backenzähne.'},
  hunt:{title:'Leise anschleichen, plötzlich springen',story:'Eine Katze lauert geduckt auf eine Maus und springt aus kurzer Entfernung.',question:'Welche Körpermerkmale unterstützen das besonders?',options:['Weiche Pfotenballen, beweglicher Rücken und kräftige Hinterbeine.','Ein unbeweglicher Rücken und flache Mahlzähne.','Nur der Geruchssinn, nicht die Muskeln.'],correct:0,hint:'Denke an leises Auftreten, Absprung und Zielgenauigkeit.',why:'Pfotenballen dämpfen das Auftreten. Bewegliche Wirbelsäule und kräftige Hinterbeine unterstützen Anschleichen und kurze Sprünge.',wrong:['','Ein starrer Rücken hilft nicht bei einem kräftigen Sprung.','Wahrnehmung und Muskeln müssen zusammenwirken.'],observe:'Verbinde Sinnesorgane, Haltung und den kurzen Sprint der Katze.'},
  motion:{title:'Kraftvoller Katzensprung',story:'Eine Katze geht vor einem Sprung tief in die Hocke und stößt sich ab.',question:'Welche Bewegung erzeugt vor allem den Absprung?',options:['Die Hinterbeine strecken sich kraftvoll.','Der Schwanz schiebt den Boden nach hinten.','Die Ohren drücken den Körper nach oben.'],correct:0,hint:'Wo sitzen die großen Muskeln, die den Boden beim Absprung wegdrücken?',why:'Muskeln der Hintergliedmaßen strecken Hüft-, Knie- und Sprunggelenke. Dabei übertragen die Pfoten Kraft auf den Boden.',wrong:['','Der Schwanz hilft beim Balancieren, stößt den Körper aber nicht vom Boden ab.','Ohren sind Sinnesorgane, keine Sprungfedern.'],observe:'Im Bewegungslabor „Springen“ wählen: erst Beugen, dann Strecken, dann Landen.'},
  signals:{title:'Eine Katze zieht sich zurück',story:'Eine Katze duckt sich, legt die Ohren an und versucht, hinter ein Möbelstück zu gelangen.',question:'Wie sollte ein Kind reagieren?',options:['Die Katze festhalten und zu sich ziehen.','Sie verfolgen, damit sie nicht allein ist.','Abstand halten, Rückzugsort frei lassen und Erwachsene fragen.'],correct:2,hint:'Die Katze sucht selbst einen sicheren Ort.',why:'Geduckte Haltung, angelegte Ohren und Rückzug können auf Angst oder Unwohlsein hinweisen. Nicht bedrängen, nicht hinterherlaufen und Abstand halten.',wrong:['Festhalten kann die Angst verstärken und Abwehr auslösen.','Verfolgen nimmt dem Tier den sicheren Rückzug.',''],observe:'Die Signale müssen immer zusammen mit dem Anlass und der gesamten Körpersprache betrachtet werden.'},
  compare:{title:'Hund und Katze laufen auf Zehen',story:'Beide Tiere bewegen sich normalerweise auf den Zehen. Bei den Krallen gibt es Unterschiede.',question:'Welche Aussage trifft zu?',options:['Katzen können ihre Krallen meist einziehen, Hunde normalerweise nicht.','Beide laufen ständig auf der ganzen Fußsohle.','Hunde können die Krallen immer vollständig einziehen.'],correct:0,hint:'Vergleiche Pfoten und Krallen, aber bedenke Ausnahmen.',why:'Hund und Katze sind Zehengänger. Katzen können ihre Krallen in der Regel zurückziehen; bei Hunden ist dies normalerweise nicht möglich. Es gibt individuelle und artspezifische Ausnahmen.',wrong:['','Beide laufen überwiegend auf den Zehenballen.','Hundekrallen sind normalerweise nicht einziehbar.'],observe:'Erkläre mit dem Körperbau, wie sich Hund und Katze fortbewegen.'}
 }
};
const STORAGE='biolab5-tiertransfer-202611';
let saved={dog:{},cat:{}};
try{const raw=localStorage.getItem(STORAGE);if(raw){const data=JSON.parse(raw);if(data&&typeof data.dog==='object'&&typeof data.cat==='object'){saved={dog:data.dog,cat:data.cat}}}}catch(e){}
const state={animal:'dog',section:'skeleton',selected:null,showHint:false,answerChecked:false,attempts:0};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const $=id=>document.getElementById(id);
function doneCount(animal){return SECTIONS.filter(k=>saved[animal]&&saved[animal][k]===true).length}
function store(){try{localStorage.setItem(STORAGE,JSON.stringify(saved))}catch(e){}}
function illustration(section,animal){
 const cat=animal==='cat';
 const common='<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vereinfachtes, selbst gezeichnetes Funktionsmodell: '+section+'" class="ft-picture"><defs><linearGradient id="ft-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9f7ee"/><stop offset="1" stop-color="#d8edf3"/></linearGradient></defs><rect x="1" y="1" width="638" height="218" rx="24" fill="url(#ft-bg)" stroke="#cbded5"/>';
 const tag=(x,y,t)=>'<text x="'+x+'" y="'+y+'" fill="#235648" font-family="system-ui,sans-serif" font-weight="800" font-size="19" text-anchor="middle">'+t+'</text>';
 const badge=(x,y,t)=>'<rect x="'+(x-80)+'" y="'+(y-26)+'" width="160" height="50" rx="13" fill="#fff" stroke="#bad8cb"/>'+tag(x,y+6,t);
 const arrow='<path d="M0 0L16 0M9 -7L17 0L9 7" stroke="#25846b" stroke-width="4" fill="none" stroke-linecap="round"/>';
 let body='';
 if(section==='skeleton'){
  body='<path d="M105 148L235 82L383 146" stroke="#b79870" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="235" cy="82" r="19" fill="#ddba88" stroke="#916d43" stroke-width="5"/><path d="M234 79Q294 16 366 60" stroke="#8cbf9f" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M323 115Q408 66 462 111" stroke="#e08e50" stroke-width="7" fill="none"/>'+tag(165,186,'Knochen')+tag(300,33,'Muskel')+tag(476,145,'Sehne')+'<circle cx="235" cy="82" r="35" fill="none" stroke="#e4a65d" stroke-dasharray="7 7" stroke-width="3"/>'+tag(395,189,'Gelenk');
 }else if(section==='origin'){
  body=badge(110,92,cat?'Wildkatze':'Wolfslinie')+'<g transform="translate(209 89)">'+arrow+'</g>'+badge(322,92,'Nähe zu Menschen')+'<g transform="translate(421 89)">'+arrow+'</g>'+badge(533,92,'Haustier')+tag(322,179,'Viele Generationen · nicht nur ein Tag');
 }else if(section==='teeth'){
  const tooth=(x,y,d)=>'<path d="M'+x+' '+y+'l20 '+d+' 10 '+(-d)+' 12 '+d+' 12 '+(-d)+' 19 '+(-d)+'" fill="none" stroke="#bd864e" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>';
  body='<path d="M126 73Q317 20 516 77M126 152Q317 198 516 148" stroke="#cfb18a" stroke-width="21" fill="none" stroke-linecap="round"/>'+tooth(263,74,32)+tooth(291,147,-32)+'<path d="M320 68L320 154" stroke="#d27542" stroke-width="4" stroke-dasharray="5 6"/>'+tag(145,38,'Oberkiefer')+tag(507,198,'Unterkiefer')+tag(431,111,'P4 / M1')+tag(178,190,cat?'30 Zähne':'42 Zähne');
 }else if(section==='hunt'){
  body='<circle cx="170" cy="105" r="60" fill="#bedbd6" stroke="#629d8e" stroke-width="4"/><path d="M140 81Q165 52 193 82M141 125Q173 149 194 120" fill="none" stroke="#36786b" stroke-width="6"/>'+tag(170,177,cat?'Lauern':'Spuren')+'<g transform="translate(250 103)">'+arrow+'</g>'+'<circle cx="397" cy="102" r="19" fill="#e9b56e"/><path d="M430 100Q480 80 532 118" stroke="#d29a50" stroke-width="6" fill="none" stroke-dasharray="8 12"/>'+tag(425,174,'Bewegung erkennen');
 }else if(section==='motion'){
  const pts=[[130,128],[240,78],[356,132],[475,74]];
  body=pts.map((p,i)=>'<g class="ft-paw paw-'+i+'"><ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="28" ry="22" fill="#6a9b86"/>'+[-19,-6,9,24].map((dx,j)=>'<circle cx="'+(p[0]+dx)+'" cy="'+(p[1]-30-(j%2)*4)+'" r="8" fill="#6a9b86"/>').join('')+'</g>').join('')+'<path d="M100 181Q308 193 527 170" fill="none" stroke="#e1a565" stroke-width="4" stroke-dasharray="7 10"/>'+tag(320,45,cat?'Beugen → Strecken → Springen':'Diagonalpaare beim Traben');
 }else if(section==='signals'){
  body='<path d="M144 134Q170 75 225 133L232 159L150 159Z" fill="#93bba9" stroke="#538874" stroke-width="5"/><path d="M157 115L142 59L190 91M215 111L235 61L196 94" stroke="#538874" fill="#c0dfce" stroke-width="7" stroke-linejoin="round"/><path d="M234 147Q282 99 302 144" stroke="#d09054" stroke-width="10" fill="none" stroke-linecap="round"/>'+tag(170,193,'Ohren')+badge(421,92,'Körperhaltung')+badge(421,158,'Situation')+'<path d="M254 122L329 122" stroke="#3c8b75" stroke-width="3" stroke-dasharray="7 7"/>';
 }else{
  body=badge(173,86,'Hund')+badge(455,86,'Katze')+tag(173,150,'42 Zähne')+tag(455,150,'30 Zähne')+tag(317,199,'Beide: Zehengänger');
 }
 return common+body+'<text x="21" y="207" fill="#5d7e70" font-size="13" font-family="system-ui">Schematische Lernzeichnung · keine anatomisch maßstabsgetreue Darstellung</text></svg>';
}
function render(){
 const root=$('ft-lab');if(!root)return;
 const c=CASES[state.animal][state.section];
 const answered=saved[state.animal][state.section]===true;
 let html='<div class="ft-heading"><div><small>NEU · PRAXIS-CHECK</small><h3>🔎 Forscherfall: '+esc(c.title)+'</h3><p>Übertrage dein Wissen auf eine neue Situation – wie in einer Klassenarbeit.</p></div><span class="ft-progress">'+doneCount(state.animal)+' / 7 geschafft</span></div>';
 html+='<div class="ft-visual">'+illustration(state.section,state.animal)+'</div>';
 html+='<div class="ft-story"><span>📖 Beobachtung</span><p>'+esc(c.story)+'</p></div>';
 html+='<div class="ft-question"><strong>'+esc(c.question)+'</strong><div class="ft-options" role="group" aria-label="Wähle eine Lösung">'+c.options.map((opt,i)=>'<button type="button" data-ft="select" data-num="'+i+'" aria-pressed="'+(state.selected===i)+'" '+(state.answerChecked&&state.selected===i?'class="'+(i===c.correct?'ft-correct':'ft-incorrect')+'"':'')+'>'+String.fromCharCode(65+i)+'. '+esc(opt)+'</button>').join('')+'</div></div>';
 html+='<div class="ft-actions"><button type="button" data-ft="hint">💡 Denkhinweis</button><button class="ft-primary" type="button" data-ft="check" '+(state.selected===null?'disabled':'')+'>Antwort prüfen</button><button type="button" data-ft="repeat">↻ Wiederholen</button></div>';
 if(state.showHint)html+='<p class="ft-hint">💡 '+esc(c.hint)+'</p>';
 if(state.answerChecked){
  const good=state.selected===c.correct;
  html+='<div class="ft-result '+(good?'good':'bad')+'" role="status" aria-live="polite"><strong>'+(good?'✓ Richtig – sehr gut begründet!':'Noch nicht richtig – schau genauer hin.')+'</strong><p>'+(good?esc(c.why):esc(c.wrong[state.selected]||c.hint))+'</p>'+(good?'<p><b>Forscherauftrag:</b> '+esc(c.observe)+'</p>':'<p>Wähle eine andere Antwort und prüfe erneut. Du kannst auch den Denkhinweis verwenden.</p>')+'</div>';
 }
 if(answered)html+='<div class="ft-success"><strong>🏅 Diesen Forscherfall hast du gelöst.</strong><span> '+doneCount(state.animal)+' von 7 Fällen für '+(state.animal==='cat'?'Katze':'Hund')+' abgeschlossen.</span></div>';
 html+='<div class="ft-footer"><span>Die Zeichnung erklärt die Funktion vereinfacht. Für genaue Anatomie nutze den Schulstoff und die verlinkten veterinärmedizinischen Quellen.</span><button type="button" data-ft="next">Nächste Station →</button></div>';
 root.innerHTML=html;
}
function mount(args){
 const main=$('content');
 if(!main||!args||!CASES[args.animal]||!CASES[args.animal][args.section])return;
 if(state.animal!==args.animal||state.section!==args.section){state.animal=args.animal;state.section=args.section;state.selected=null;state.showHint=false;state.answerChecked=false;state.attempts=0}
 let root=$('ft-lab');
 if(!root){root=document.createElement('section');root.id='ft-lab';root.className='ft-lab';root.setAttribute('aria-label','Forschercheck: Wissen anwenden');}
 const ref=main.querySelector('.ls-reference');
 main.insertBefore(root,ref||null);
 render();
}
document.addEventListener('click',function(event){
 const button=event.target.closest('[data-ft]');
 if(!button)return;
 const root=$('ft-lab');
 if(!root||!root.contains(button))return;
 const action=button.dataset.ft;
 if(action==='select'){state.selected=Number(button.dataset.num);state.answerChecked=false}
 if(action==='hint')state.showHint=true;
 if(action==='repeat'){state.selected=null;state.showHint=false;state.answerChecked=false;state.attempts=0}
 if(action==='check'&&state.selected!==null){
  state.answerChecked=true;
  state.attempts++;
  if(state.selected===CASES[state.animal][state.section].correct){
   saved[state.animal][state.section]=true;store();
  }
 }
 if(action==='next'){
  const index=SECTIONS.indexOf(state.section);
  const next=SECTIONS[(index+1)%SECTIONS.length];
  const nav=document.querySelector('#sections [data-section="'+next+'"]');
  if(nav){nav.click();return;}
 }
 render();
});
window.BioTransferLab={mount,getProgress:()=>JSON.parse(JSON.stringify(saved)),selfTest:function(){return SECTIONS.length===7&&['dog','cat'].every(a=>SECTIONS.every(s=>CASES[a]&&CASES[a][s]&&CASES[a][s].options.length===3&&Number.isInteger(CASES[a][s].correct)&&CASES[a][s].correct>=0&&CASES[a][s].correct<3))}};
const route=decodeURIComponent(location.hash.slice(1)).split('/');
mount({animal:route[0]==='cat'?'cat':'dog',section:SECTIONS.includes(route[1])?route[1]:'skeleton'});
})();