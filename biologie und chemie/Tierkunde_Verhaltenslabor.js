/* BioLabor 5 – Körpersprache beobachten. Kein Tierverhalten aus einem Einzelzeichen ableiten. */
(function(){
'use strict';
const SCENES={
 relax:{label:'Entspannt',icon:'☀️',desc:'Lockere Körperhaltung und fließende Bewegungen können auf Entspannung hinweisen.',ears:'neutral',tail:'locker',context:'Das Tier hat Ruhe und ausreichend Platz.',safe:'Beobachten',why:'Auch bei einem entspannten Tier entscheidet die Situation; nicht ungefragt anfassen.'},
 fear:{label:'Ängstlich',icon:'😟',desc:'Geduckter Körper, angelegte Ohren oder Rückzug können Angst anzeigen.',ears:'angelegt',tail:'tief',context:'Ein fremdes Geräusch erschreckt das Tier.',safe:'Abstand lassen',why:'Nicht bedrängen und einen Rückzugsweg frei lassen.'},
 threat:{label:'Drohen',icon:'⚠️',desc:'Angespanntes Stehen, Zähnezeigen, Knurren oder Fauchen können eine Warnung sein.',ears:'verändert',tail:'angespannt',context:'Eine fremde Person kommt dem Tier zu nahe.',safe:'Abstand lassen',why:'Warnsignale ernst nehmen. Nicht in die Enge treiben.'},
 attack:{label:'Abwehr',icon:'🛑',desc:'Ein Tier kann sich verteidigen, wenn es keinen Ausweg sieht.',ears:'verändert',tail:'angespannt',context:'Das Tier wurde in die Enge gedrängt.',safe:'Abstand lassen',why:'Ruhig Distanz schaffen und Hilfe von Erwachsenen holen. Nicht dazwischen greifen.'},
 flee:{label:'Flucht',icon:'💨',desc:'Das Tier richtet die Bewegung vom Auslöser weg aus. Angst und Flucht sind nicht dasselbe wie Angriff.',ears:'nach hinten',tail:'tief',context:'Das Tier sucht einen sicheren Rückzugsort.',safe:'Abstand lassen',why:'Ein fliehendes Tier nie verfolgen oder einfangen wollen.'},
 hunt:{label:'Jagd',icon:'🔎',desc:'Gebückte Haltung und konzentrierter Blick können beim Beobachten oder Lauern auftreten.',ears:'aufmerksam',tail:'kontrolliert',context:'Das Tier beobachtet ein sich bewegendes Objekt.',safe:'Beobachten',why:'Nicht mitten in die Jagdsituation eingreifen; Abstand wahren.'},
 play:{label:'Spiel',icon:'🎾',desc:'Lockere Bewegungen und typische Spielsignale können Spielabsicht zeigen. Beim Hund ist die Spielverbeugung häufig.',ears:'beweglich',tail:'lebhaft',context:'Das Tier hat freiwillig Kontakt zu einem bekannten Spielpartner.',safe:'Beobachten',why:'Spielsignale mit Körperspannung und Situation abgleichen; nicht jedes wilde Rennen ist Spiel.'}
};
const state={animal:'dog',scene:'relax',answer:null,learned:{}};
const el=s=>document.getElementById(s);
const n=v=>Number(v).toFixed(1).replace(/\.0$/,'');
function figure(){
 const k=state.scene,t=SCENES[k],cat=state.animal==='cat',fear=['fear','flee','hunt'].includes(k),aggr=['threat','attack'].includes(k);
 const yy=fear?206:k==='play'&& !cat?195:k==='threat'&&cat?150:176;
 const hY=yy-30,earY=hY-36,tailBase={x:524,y:yy+13};
 const bodyPath=k==='threat'&&cat?'M245 '+(yy+40)+'Q310 '+(yy-76)+' 406 '+(yy-57)+'Q469 '+(yy-53)+' 522 '+(yy+44)+'Q431 '+(yy+104)+' 280 '+(yy+88)+'Z':'M244 '+(yy+37)+'Q315 '+(yy-32)+' 454 '+(yy+9)+'Q517 '+(yy+19)+' 522 '+(yy+45)+'Q430 '+(yy+106)+' 282 '+(yy+87)+'Z';
 const tail=k==='fear'||k==='flee'?'M524 '+(yy+43)+'Q553 '+(yy+95)+' 568 '+(yy+120):
 (k==='threat'&&cat?'M521 '+(yy+18)+'Q564 '+(yy-120)+' 605 '+(yy-56)+'Q625 '+(yy-11)+' 624 '+(yy+9):
 k==='hunt'?'M523 '+(yy+44)+'Q571 '+(yy+66)+' 614 '+(yy+40):
 'M522 '+(yy+39)+'Q587 '+(yy+2)+' 627 '+(yy-30));
 const legs=fear?
 '<path d="M296 '+(yy+74)+'l-33 40h-43M459 '+(yy+66)+'l-20 47h-39" stroke="#4d8070" stroke-width="22" stroke-linecap="round" fill="none"/>':
 k==='play'&&!cat?
 '<path d="M288 '+(yy+85)+'l-77 65h-51M462 '+(yy+86)+'l22 70h-30" stroke="#4d8070" stroke-width="23" fill="none" stroke-linecap="round"/>':
 '<path d="M295 '+(yy+84)+'l-12 92h-31M468 '+(yy+80)+'l14 96h-28" stroke="#4d8070" stroke-width="24" fill="none" stroke-linecap="round"/>';
 const ears=cat?
 (fear||aggr?'<path d="M145 '+(earY+15)+'l-39 13l42 -39M192 '+(earY+11)+'l49 13l-45 -45" fill="#8bbb9f" stroke="#4d8070" stroke-width="5"/>':
 '<path d="M143 '+(earY+21)+'l-16 -53l49 30l40 -30l3 54" fill="#9fc9b1" stroke="#4d8070" stroke-width="5"/>'):
 (fear||aggr?'<path d="M146 '+(earY+11)+'l-27 29m90 -31l31 28" stroke="#4d8070" stroke-width="20" stroke-linecap="round"/>':
 '<path d="M148 '+earY+'q-36 -53 -37 14m108 -11q33 -55 31 10" stroke="#4d8070" stroke-width="21" stroke-linecap="round" fill="none"/>');
 const eyes=aggr?'<path d="M175 '+(hY+9)+'l18 0" stroke="#173f35" stroke-width="5"/>':
 '<ellipse cx="184" cy="'+(hY+9)+'" rx="'+(fear?7:5)+'" ry="'+(fear?8:6)+'" fill="#1c4a3b"/>';
 const mouth=aggr?'<path d="M131 '+(hY+34)+'q25 16 50 2m-30 6l9 8l9 -9" stroke="#603f32" stroke-width="4" fill="none"/>':'<path d="M131 '+(hY+38)+'q23 9 44 -1" fill="none" stroke="#527468" stroke-width="3"/>';
 const motion=k==='play'?'behavior-wag':k==='flee'?'behavior-flee':'';
 return '<svg viewBox="0 0 760 380" role="img" aria-label="Schematisches Bild zum Verhalten: '+t.label+'"><rect width="760" height="380" rx="17" fill="#eff7f1"/>'+
 '<path d="M35 349H719" stroke="#b6d8c1" stroke-width="3" stroke-dasharray="11 9"/>'+
 '<g class="'+motion+'">'+legs+'<path d="'+bodyPath+'" fill="'+(aggr?'#c6ad94':'#a2c7ad')+'" stroke="#4b8070" stroke-width="5"/>'+
 '<path d="'+tail+'" fill="none" stroke="'+(k==='threat'&&cat?'#a18767':'#769d89')+'" stroke-width="'+(k==='threat'&&cat?'23':'18')+'" stroke-linecap="round" class="'+(k==='play'?'behavior-tail':'')+'"/>'+
 '<path d="M234 '+(yy+32)+'Q190 '+(hY-8)+' 160 '+(hY+12)+'Q120 '+(hY-9)+' 111 '+(hY+23)+'Q95 '+(hY+54)+' 129 '+(hY+67)+'Q193 '+(hY+78)+' 241 '+(hY+48)+'Z" fill="#b1d5be" stroke="#4b8070" stroke-width="5"/>'+
 ears+eyes+mouth+
 (cat?'<path d="M110 '+(hY+36)+'l-45 -9m44 17l-51 1m144 -14l45 -12" stroke="#779889" stroke-width="2"/>':'')+'</g>'+
 '<rect x="29" y="24" width="190" height="45" rx="12" fill="#fff" fill-opacity=".95"/><text x="46" y="54" font-size="22" font-weight="900" fill="#225c48">'+t.icon+' '+t.label+'</text>'+
 '<text x="42" y="371" font-size="13" fill="#527a68">Vereinfachte Körperspracheskizze · immer die Gesamtsituation bewerten</text></svg>';
}
function render(){
 const root=el('behavior-lab');if(!root)return;
 const t=SCENES[state.scene];
 root.innerHTML='<div class="behavior-head"><div><small>👀 FALLLABOR · KÖRPERSPRACHE</small><h3>Was möchte das Tier zeigen?</h3><p>Vergleiche Haltung, Ohren, Schwanz und Umgebung. Ein Zeichen allein reicht nicht.</p></div><span>7 Situationen</span></div>'+
 '<div class="behavior-picks" role="group" aria-label="Situation auswählen">'+Object.entries(SCENES).map(([k,x])=>'<button type="button" data-scene="'+k+'" aria-pressed="'+(state.scene===k)+'">'+x.icon+' '+x.label+'</button>').join('')+'</div>'+
 '<div class="behavior-stage">'+figure()+'</div>'+
 '<div class="behavior-hints"><div><b>👂 Ohren</b><span>'+t.ears+'</span></div><div><b>🐾 Haltung</b><span>'+t.desc+'</span></div><div><b>🐕 Schwanz</b><span>'+t.tail+'</span></div></div>'+
 '<div class="behavior-story"><b>Situation:</b> '+t.context+' <p><b>Forscherfrage:</b> Wie sollte sich ein Mensch jetzt verhalten?</p>'+
 '<div class="behavior-choices" role="group" aria-label="Sichere Reaktion auswählen">'+['Abstand lassen','Beobachten','Sofort streicheln'].map(x=>'<button type="button" data-answer="'+x+'" aria-pressed="'+(state.answer===x)+'">'+x+'</button>').join('')+'</div>'+
 (state.answer?'<p class="behavior-result '+(state.answer===t.safe?'correct':'wrong')+'" role="status"><b>'+(state.answer===t.safe?'✓ Gute Entscheidung!':'↗ Überlege noch einmal.')+'</b> '+t.why+'</p>':'')+'</div>';
}
function mount(params){
 if(params.section!=='signals')return;
 state.animal=params.animal==='cat'?'cat':'dog';state.scene='relax';state.answer=null;
 const content=el('content');if(!content)return;
 const root=document.createElement('section');root.id='behavior-lab';root.className='behavior-lab';
 const ref=content.querySelector('.ls-reference');content.insertBefore(root,ref||null);
 root.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.scene){state.scene=b.dataset.scene;state.answer=null;render()}
 if(b.dataset.answer){state.answer=b.dataset.answer;render()}
 });
 render();
}
window.BioBehaviorLab={mount,SCENES,figure};
const init=decodeURIComponent(location.hash.slice(1)).split('/');
if((init[1]||'skeleton')==='signals')mount({animal:init[0]==='cat'?'cat':'dog',section:'signals'});
})();
