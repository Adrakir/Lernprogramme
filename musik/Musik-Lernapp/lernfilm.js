'use strict';
// Die Mitmach-Zeitspur erklärt die 27 bestehenden Lernschritte ohne zusätzliche Lernstände.
// Eine Viertelnote umfasst hier vier Sechzehntel-Teilzeiten.
const filmGuides={
 puls:['Fuji geht gleichmäßig weiter, auch wenn seine Hände nicht klatschen.','Sprich die Zahlen weiter. Auf 2 und 4 bleibt der Ton still.'],
 viertel:['Jede Viertelnote beginnt genau auf einer Zahl.','Vier neue Töne passen in vier Schläge.'],
 teile:['Zwei Achtel beginnen auf 1 und auf „und“. Der Balken fügt keine Zeit hinzu.','Tippe oben auf „Balken“ oder „Punkt“, um die passende Note groß zu sehen.'],
 halbe:['Eine halbe Note beginnt auf 1 und klingt auf 2 weiter.','Auf 2 keinen neuen Ton beginnen! Erst auf 3 beginnt die nächste Note.'],
 ganze:['Die ganze Note beginnt einmal und klingt vier Schläge lang.','Zähle 1, 2, 3, 4 und halte dabei nur einen Ton.'],
 tempo:['Das Tempo ändert die Geschwindigkeit, nicht die Zahl der Schläge.','Höre das Beispiel und ändere danach unter „Ton einstellen“ die Geschwindigkeit.'],
 achtel:['Kä-se: zwei gleich lange Achtel beginnen auf „1“ und „1 und“.','Ein Schritt mit dem Fuß, aber zwei kurze Tonanfänge.'],
 sechzehntel:['Scho-ko-la-de: vier Sechzehntel passen in einen Schlag.','Zähle langsam „1 – e – und – a“. Der nächste Schritt beginnt erst auf 2.'],
 familie:['Eine halbe Note dauert so lange wie zwei Viertel oder vier Achtel.','Achte auf die Zahl der Tonanfänge: Gleiche Dauer muss nicht gleich klingen.'],
 stille:['Auf 1 klingt ein Ton. Auf 2 ist tatsächlich Stille.','Ein gehaltener Ton und eine Pause sind nicht dasselbe.'],
 viertelpause:['Auf 2 liegt eine Viertelpause: Der Fuß zählt weiter, aber du spielst nichts.','Beginne den nächsten Ton erst auf 3.'],
 'lange-pausen':['Die halbe Pause bedeutet zwei Schläge Stille.','Die Ganztaktpause richtet sich nach der Taktart: 3/4 hat drei, 4/4 vier Schläge.'],
 'kurze-pausen':['Die Achtelpause dauert nur „und“, die Sechzehntelpause eine Viertel-Teilzeit.','Auf Pausenfeldern bleibt es still. Der nächste Ton muss trotzdem pünktlich einsetzen.'],
 generalpause:['Fuji schweigt auf 2, während Minka noch spielt.','Auf 3 und 4 schweigen beide: gemeinsame Stille heißt Generalpause.'],
 system:['Fünf Linien ergeben ein Notensystem. Die Taktangabe steht am Anfang.','Im 3/4-Takt zählen wir insgesamt drei Viertelschläge.'],
 dreiertakt:['Die halbe Note belegt 1 und 2; die Viertelnote beginnt auf 3.','Rechne: 2 + 1 = 3. Nicht die Zahl der Notenzeichen entscheidet.'],
 vierertakt:['Die halbe Note klingt auf 1 und 2, die Pause liegt auf 3.','Die letzte Viertelnote beginnt auf 4: 2 + 1 + 1 = 4.'],
 striche:['Nach Schlag 4 folgt unmittelbar die nächste 1.','Der Taktstrich braucht keine zusätzliche Zeit.'],
 woerter:['Jedes Rhythmuswort dauert genau einen Schlag.','Ananas ist kurz – kurz – länger: zwei Sechzehntel und eine Achtel.'],
 zaehlen:['Nicht jede Zählsilbe bedeutet einen neuen Ton.','Der Ton auf „1 und“ kann bis zum Ende der Teilzeit „1 a“ weiterklingen.'],
 luecken:['Die vorhandenen Werte ergeben zwei Schläge. Im 4/4-Takt fehlen noch zwei.','Die grauen Felder sind eine Lücke – keine notierte Pause. Wähle eine halbe Note.'],
 fehler:['Eine halbe und eine Viertelnote ergeben erst drei Schläge.','Im 4/4-Takt fehlt ein Schlag: eine weitere Viertelnote würde passen.'],
 verboten:['Nur das vorher vereinbarte Muster ist im Spiel verboten.','Vergleiche genau, auf welcher Zahl Ton oder Stille liegt.'],
 punkt:['Eine punktierte halbe Note dauert 2 + 1 = 3 Schläge.','Der Punkt steht rechts am Kopf: Er ergänzt die Hälfte des Grundwerts.'],
 'punkt-im-takt':['Eine punktierte Viertelnote dauert 1½ Schläge.','Die Achtel beginnt erst auf „2 und“, nicht schon auf 2.'],
 'punktierte-achtel':['Die punktierte Achtel klingt über 1, e und „und“.','Erst auf „1 a“ beginnt die Sechzehntelnote: ¾ + ¼ = 1 Schlag.'],
 abschluss:['Vier Takte bilden ein kleines Rhythmusstück.','Probiere erst jeden Takt einzeln; danach die ganze Folge.']
};
function filmBars(d){
 if(d.key==='abschluss')return [['q','e','e','q','q'],['q','qr','h'],['qd','e','h'],['h','q','q']];
 if(d.key==='striche')return [Array(4).fill('q'),Array(4).fill('q')];
 if(d.key==='generalpause')return [['q','qr','hr'],['q','q','hr']];
 if(d.key==='stille')return [['h','q','q'],['q','qr','h']];
 if(d.key==='fehler')return [['h','q']];
 return [d.pattern];
}
function filmRow(d,ids,barIndex){
 const total=d.m*4,states=Array(total).fill(null).map(()=>({kind:'gap',id:null,start:false}));
 let time=0;
 for(const id of ids){
  const amount=id==='?'?Math.max(0,total-time):val(id,d.m);
  const kind=id==='?'?'gap':get(id).rest?'rest':'note';
  for(let i=time;i<Math.min(total,time+amount);i++)states[i]={kind,id,start:i===time};
  time+=amount;
 }
 return states;
}
function filmBeatLabel(states,b){
 const start=b*4,segment=states.slice(start,start+4),onsets=segment.reduce((a,c,i)=>a+(c.kind==='note'&&c.start?1:0),0);
 const rest=segment.every(c=>c.kind==='rest'),gap=segment.every(c=>c.kind==='gap');
 if(gap)return 'Hier fehlt ein Notenwert; die Zeit muss noch ergänzt werden.';
 if(rest)return 'Ein ganzer Schlag Stille. Weiterzählen, aber nichts spielen.';
 if(onsets===0&&segment.some(c=>c.kind==='note'))return 'Der vorherige Ton klingt weiter. Nicht neu beginnen.';
 const starts=segment.map((c,i)=>c.kind==='note'&&c.start?['Zahl','e','und','a'][i]:null).filter(Boolean);
 if(onsets>1)return onsets+' neue Töne in diesem Schlag, auf '+starts.join(', ')+'.';
 if(onsets===1&&segment.some(c=>c.kind==='rest'))return 'Ein Ton beginnt; im selben Schlag ist auch Stille.';
 if(onsets===1)return 'Ein Ton beginnt hier. Die restlichen Teilzeiten gehören zu seiner Dauer.';
 return 'Der Puls läuft weiter. Prüfe Klang und Stille.';
}
function filmMarkup(d){
 const bars=filmBars(d),copy=filmGuides[d.key]||['Schaue auf die Zeitwerte.','Zähle dabei gleichmäßig weiter.'];
 const labels=d.key==='generalpause'?['Fuji','Minka']:d.key==='stille'?['Ton halten','Ton mit Pause']:bars.map((_,i)=>bars.length===1?'Beispiel':'Takt '+(i+1));
 const rows=bars.map((ids,b)=>{const states=filmRow(d,ids,b),style='style="--film-beats:'+d.m+'"';
  return '<div class="filmRow"><div class="filmRowTitle">'+labels[b]+'</div><div class="filmBeatGrid" '+style+'>'+Array.from({length:d.m},(_,i)=>{
   const segment=states.slice(i*4,i*4+4);
   const cells=segment.map((part,j)=>{
    const info=part.kind==='gap'?'noch offen':part.kind==='rest'?'Stille':part.start?'neuer Ton':'Ton halten';
    const icon=part.kind==='gap'?'?':part.kind==='rest'?'–':part.start?'●':'━';
    return '<span class="filmCell film-'+part.kind+(part.start?' film-onset':'')+'" title="'+info+'" aria-hidden="true">'+icon+'</span>';
   }).join('');
   return '<button type="button" class="filmBeat" data-film-bar="'+b+'" data-film-beat="'+i+'" aria-pressed="'+(b===0&&i===0)+'" aria-label="'+labels[b]+', Schlag '+(i+1)+': '+filmBeatLabel(states,i)+'"><strong>'+ (i+1)+'</strong><span class="filmCellStrip">'+cells+'</span></button>';
  }).join('')+'</div></div>';
 }).join('');
 const note=d.key==='luecken'||d.key==='fehler'?'<p class="filmCaution">Graue Felder zeigen <strong>fehlende Notenwerte</strong>, keine Pausen. Erst rechnen, dann ergänzen.</p>':'';
 const musicTip=d.key==='stille'?'<p class="filmCaution">Die zwei Reihen werden <strong>nacheinander</strong> abgespielt: einmal Klang halten, einmal Klang mit echter Pause.</p>':d.key==='generalpause'?'<p class="filmCaution">Die beiden Reihen gehören zu <strong>zwei gleichzeitig spielenden Stimmen</strong>. Achte darauf, wer gerade schweigt.</p>':'';
 return '<section id="film" class="filmCard" aria-label="Interaktive Schlag-für-Schlag-Erklärung" data-film-key="'+d.key+'">'+
 '<div class="filmTitle"><img class="filmPortrait" src="images/fuji-musiklehrer.webp" width="48" height="48" alt="Fuji erklärt die Zeitspur"><div><span class="eyebrow">Fuji zeigt es dir</span><h3>Schlag für Schlag verstehen</h3></div></div>'+
 '<p class="filmLead">'+copy[0]+'</p><p class="filmHint">'+copy[1]+'</p>'+
 '<div class="filmLegend"><span><b class="filmDot">●</b> neuer Ton</span><span><b class="filmLine">━</b> halten</span><span><b class="filmRest">–</b> Stille</span><span><b class="filmGap">?</b> fehlt noch</span></div>'+
 '<div class="filmRows">'+rows+'</div>'+note+musicTip+
 '<p id="filmInfo" class="filmInfo" role="status">'+(filmBeatLabel(filmRow(d,bars[0],0),0))+'</p>'+
 '<div class="filmActions"><button type="button" id="filmPrevious">← Zurück</button><button type="button" id="filmNext">Nächsten Schlag →</button><button type="button" class="primary" id="filmPlay">▶ Mit Ton abspielen</button><button type="button" id="filmStop">Stopp</button></div>'+
 '<details class="filmDetails"><summary>Wie lese ich die kleinen Kästchen?</summary><p>Die große Zahl ist der Grundschlag. Die vier kleinen Felder darunter heißen Zahl, e, und und a. Ein Punkt bedeutet: Hier beginnt ein Ton. Der Strich bedeutet: Derselbe Ton klingt weiter. Ein Gedankenstrich bedeutet: Hier ist eine Pause. Ein Fragezeichen bedeutet: Der Takt ist noch nicht vollständig. Du kannst auf jede große Zahl tippen.</p></details></section>';
}
function filmBind(d){
 const panel=document.querySelector('#film');if(!panel)return;
 const bars=filmBars(d),beats=d.m;
 let chosen=0;
 function show(pos,announcement){
  const total=d.key==='generalpause'?beats:beats*bars.length;chosen=Math.min(total-1,Math.max(0,pos));
  const row=Math.floor(chosen/beats),beat=chosen%beats,states=filmRow(d,bars[row],row);
  panel.querySelectorAll('[data-film-beat]').forEach(button=>{
   const current=(d.key==='generalpause'||+button.dataset.filmBar===row)&&+button.dataset.filmBeat===beat;
   button.classList.toggle('filmSelected',current);button.setAttribute('aria-pressed',String(current));
  });
  const descriptor=bars.length>1?(d.key==='generalpause'?'Beide Stimmen':d.key==='stille'?(row===0?'Ton halten':'Ton mit Pause'):'Takt '+(row+1))+' · ':'';
  const info=panel.querySelector('#filmInfo');
  if(info)info.textContent=descriptor+'Schlag '+(beat+1)+': '+(d.key==='generalpause'?'Fuji: '+filmBeatLabel(filmRow(d,bars[0],0),beat)+' Minka: '+filmBeatLabel(filmRow(d,bars[1],1),beat):filmBeatLabel(states,beat))+(announcement?' '+announcement:'');
 }
 panel.querySelectorAll('[data-film-beat]').forEach(button=>button.onclick=()=>{stop();show(+button.dataset.filmBar*beats+(+button.dataset.filmBeat));});
 panel.querySelector('#filmPrevious').onclick=()=>{stop();show(chosen-1);};
 panel.querySelector('#filmNext').onclick=()=>{stop();show(chosen+1);};
 panel.querySelector('#filmStop').onclick=()=>{stop();show(chosen,'Angehalten.');};
 panel.querySelector('#filmPlay').onclick=()=>{
  const lengths=bars.map(ids=>ids.map(id=>id==='?'?{u:Math.max(0,beats*4-ids.filter(x=>x!=='?').reduce((a,x)=>a+val(x,beats),0)),rest:true}:id));
  const seq=d.key==='generalpause'?[{u:4,freq:330,extra:440},{u:4,freq:440},{u:8,rest:true}]:lengths.flat();show(0,'Erst wird eingezählt.');
  play(seq,beats,{leadIn:true,fullDuration:true,silentClick:true,hideEvents:true,
   onProgress({units}){
    if(!document.querySelector('#film')||view!=='learn')return;
    if(units<0){panel.querySelector('#filmInfo').textContent='Fuji zählt ein. Warte bis nach der letzten Zahl.';return;}
    const bar=Math.min(bars.length-1,Math.floor(units/(beats*4)));
    const time=units%(beats*4);
    const step=(d.key==='generalpause'?0:bar)*beats+Math.min(beats-1,Math.floor(time/4));
    if(step!==chosen)show(step);
   },
   onComplete(){if(document.querySelector('#film')===panel)show(chosen,'Fertig. Jetzt kannst du es selbst Schritt für Schritt versuchen.');}
  });
 };
 show(0);
}
