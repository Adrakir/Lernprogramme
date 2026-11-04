
const chemistryErrorProtocols=[
{id:'waerme',title:'Metallstab und Glasstab',focus:'Wärmeleitfähigkeit',hint:'Prüfe besonders die Deutungen: Was kann Glas? Was zeigt eine Verfärbung? Woher kommt die Energie?',lines:[
 {text:'Fragestellung: Welcher der beiden gleich großen Stäbe leitet Wärme besser weiter?'},
 {text:'Material: Metallstab, Glasstab, Halter, gleichartige Teelichter und eine Wärmequelle unter Aufsicht der Lehrkraft.'},
 {text:'Vor dem Vergleich ist das Wachs bei beiden Stäben fest. Die Anfangstemperaturen sind gleich.'},
 {text:'Beobachtung im Übungsversuch: An einer entfernten Stelle des Metallstabs wird das Wachs früher flüssig als am Glasstab.'},
 {text:'Auswertung: Glas kann grundsätzlich niemals heiß werden.',fix:'Glas leitet Wärme schlechter als typische Metalle, kann aber ebenfalls heiß werden.',why:'Schlechte Wärmeleitung bedeutet eine langsamere Weitergabe von Energie, nicht eine dauerhaft niedrige Temperatur.',other:['Glas leitet grundsätzlich besser als jedes Metall.','Glas bleibt immer bei 0 °C.']},
 {text:'Eine dunkle Stelle an der Teelichtschale misst die Wärmeleitfähigkeit genau.',fix:'Eine Verfärbung allein misst keine Wärmeleitfähigkeit; vergleiche den Wachszustand unter gleichen Bedingungen.',why:'Eine dunkle Stelle kann beispielsweise Ruß sein. Ihre Ursache und die Wärmeleitung sind damit nicht eindeutig bestimmt.',other:['Je dunkler die Schale, desto genauer ist automatisch der Messwert.','Eine dunkle Stelle bedeutet immer, dass Glas kalt ist.']},
 {text:'Der Metallstab erzeugt beim Weiterleiten die gesamte Wärme selbst.',fix:'Die Energie stammt aus der Wärmequelle und wird durch den Stab vom wärmeren zum kälteren Bereich weitergegeben.',why:'Der Stab transportiert Energie; er erzeugt sie beim Wärmeleiten nicht selbst.',other:['Die Energie kommt grundsätzlich nur aus dem Wachs.','Bei Wärmeleitung wird keine Energie übertragen.']}
]},
{id:'sieden',title:'Wasser erwärmen',focus:'Siedepunkt und Protokoll',hint:'Achte auf die Bedingungen des Siedepunkts, die Energie beim Sieden und die Trennung von Beobachtung und Deutung.',lines:[
 {text:'Fragestellung: Wie verändert sich die Temperatur von reinem Wasser beim Erwärmen und Sieden?'},
 {text:'Im Übungsversuch bleibt der Luftdruck gleich und entspricht ungefähr dem normalen Luftdruck.'},
 {text:'Beobachtung: Das Thermometer zeigt nacheinander 20 °C, 60 °C, 100 °C und beim weiteren Sieden ungefähr 100 °C.'},
 {text:'Wasser siedet unabhängig von Luftdruck und Zusammensetzung überall exakt bei 100 °C.',fix:'Reines Wasser siedet bei normalem Luftdruck ungefähr bei 100 °C; der Siedepunkt hängt unter anderem vom Druck ab.',why:'100 °C gilt als Näherungswert für reines Wasser bei Normaldruck, nicht für jede Bedingung.',other:['Wasser siedet unabhängig von allen Bedingungen bei 20 °C.','Der Luftdruck hat niemals Einfluss auf das Sieden.']},
 {text:'Während des Siedens wird überhaupt keine Energie mehr aufgenommen.',fix:'Während des Siedens wird weiter Energie aufgenommen; sie wird für den Übergang zu Wasserdampf benötigt.',why:'Eine annähernd konstante Temperatur bedeutet hier nicht, dass keine Energie übertragen wird.',other:['Das Wasser nimmt beim Sieden nur noch Salz auf.','Jede Energiezufuhr muss die Siedetemperatur sofort erhöhen.']},
 {text:'Im Abschnitt Beobachtung steht als Messwert: „Die Energie wird für den Zustandswechsel benötigt.“',fix:'Die Erklärung zum Zustandswechsel gehört in die Auswertung; in die Beobachtung gehören Messwerte und sichtbare Veränderungen.',why:'Ein Erklärsatz ist keine direkt abgelesene Zahl und muss von den Beobachtungen getrennt werden.',other:['Jede Erklärung ist automatisch ein direkt abgelesener Messwert.','Messwerte werden grundsätzlich nur ohne Einheit notiert.']},
 {text:'Die Durchführung eines echten Erhitzungsversuchs erfolgt nur nach Anleitung und unter Aufsicht der Lehrkraft.'}
]},
{id:'salz',title:'Die gesättigte Salzlösung',focus:'Löslichkeit in Wasser',hint:'Verfolge die Salzmasse: Gelöst bedeutet nicht verschwunden. Prüfe die Rechnung und was „gesättigt“ bedeutet.',lines:[
 {text:'Vorgegebener Modellwert: Bei 20 °C lösen sich in 200 g Wasser höchstens etwa 72 g Kochsalz.'},
 {text:'Durchführung im Übungsversuch: Zu dieser Wasserportion werden insgesamt 80 g Kochsalz gegeben. Die Temperatur bleibt gleich.'},
 {text:'Beobachtung: Nach genügend Zeit und Rühren bleibt ein ungelöster Bodensatz.'},
 {text:'Das gelöste Salz wurde vernichtet und existiert nicht mehr.',fix:'Gelöstes Salz ist weiterhin vorhanden; seine Teilchen sind im Wasser verteilt.',why:'Die Salzteilchen verschwinden beim Lösen nicht. Dass einzelne Körner nicht mehr sichtbar sind, bedeutet keine Vernichtung.',other:['Salz wird beim Lösen immer vollständig zu Luft.','Gelöstes Salz besteht grundsätzlich nur noch aus Wasser.']},
 {text:'Nach dem angegebenen Modellwert bleiben 18 g Salz ungelöst.',fix:'Nach dem angegebenen Modellwert bleiben 8 g Salz ungelöst: 80 g − 72 g = 8 g.',why:'Es wurden 80 g zugegeben, von denen höchstens 72 g löslich sind. Die Differenz beträgt 8 g.',other:['Es bleiben 152 g Salz ungelöst.','Es bleiben genau 80 g Salz ungelöst, obwohl sich 72 g lösen.']},
 {text:'„Gesättigt“ bedeutet: Unter unveränderten Bedingungen kann man unbegrenzt weiteres Salz lösen.',fix:'Eine gesättigte Lösung kann unter diesen Bedingungen kein weiteres Kochsalz lösen.',why:'Die Löslichkeitsgrenze ist erreicht. Bei weiterer Zugabe kann zusätzliches Salz ungelöst bleiben.',other:['Eine gesättigte Lösung muss immer sieden.','Eine gesättigte Lösung enthält grundsätzlich keinen gelösten Stoff.']},
 {text:'Die Beobachtungs- und Messbedingungen werden im Protokoll mit angegeben.'}
]},
{id:'geraete',title:'Ein Flüssigkeitsvolumen messen',focus:'Geräte und Messprotokoll',hint:'Prüfe Gerätewahl, Einheit und die Trennung zwischen Messwert und Erklärung.',lines:[
 {text:'Fragestellung: Welches Volumen hat die Wasserprobe?'},
 {text:'Zum genauen Abmessen des Volumens wird eine Reibschale mit Pistill gewählt.',fix:'Zum Abmessen des Flüssigkeitsvolumens wird ein geeigneter Messzylinder mit Skala gewählt.',why:'Eine Reibschale dient zum Zerkleinern fester Stoffe; sie ist kein Gerät zum genauen Abmessen eines Flüssigkeitsvolumens.',other:['Zum genauen Abmessen des Volumens braucht man ausschließlich eine Tiegelzange.','Ein Glasstab ersetzt jede Volumenskala.']},
 {text:'Eine Mitschülerin liest die Skala auf Augenhöhe ab.'},
 {text:'Beobachtung: Das abgelesene Flüssigkeitsvolumen beträgt 50 °C.',fix:'Beobachtung: Das abgelesene Flüssigkeitsvolumen beträgt 50 ml.',why:'Milliliter ist eine Volumeneinheit. Grad Celsius beschreibt eine Temperatur.',other:['Das Flüssigkeitsvolumen beträgt 50 Minuten.','Das Flüssigkeitsvolumen beträgt 50 Meter.']},
 {text:'Aus dem Volumen allein folgt sicher, dass die Probe reines Wasser ist.',fix:'Aus dem Volumen allein lässt sich die stoffliche Identität der Probe nicht sicher bestimmen.',why:'Verschiedene Flüssigkeiten können dasselbe Volumen haben. Ein Volumenwert allein identifiziert keinen Stoff.',other:['Jede Flüssigkeit mit 50 ml Volumen ist grundsätzlich Ethanol.','Die Einheit ml beweist die chemische Reinheit.']},
 {text:'Gerätewahl und Ablesung werden in der Durchführung beschrieben.'},
 {text:'Abgelesene Werte werden mit passenden Einheiten dokumentiert.'}
]},
{id:'brenner',title:'Brennerflammen vergleichen',focus:'Gasbrenner und Sicherheit',hint:'Unterscheide Modellwissen von echtem Handeln. Prüfe die Flammenzonen und den Umgang mit heißen Geräten.',lines:[
 {text:'Die Flammen werden in der App an einem virtuellen Modell verglichen.'},
 {text:'Im Modell gibt es eine gelbe leuchtende und eine blaue nichtleuchtende Flamme.'},
 {text:'Die gelbe Flamme kann rußen.'},
 {text:'Die heißeste Stelle der blauen Flamme liegt im Schulmodell im Standfuß.',fix:'Die heißeste Zone liegt im Schulmodell knapp oberhalb der Spitze des inneren blauen Kegels.',why:'Der Standfuß ist ein Bauteil des Brenners und nicht die heißeste Flammenzone.',other:['Die heißeste Flammenzone liegt grundsätzlich im Gasschlauch.','Die heißeste Flammenzone liegt immer unter dem Tisch.']},
 {text:'Die Temperatur eines möglicherweise heißen Geräts prüft man mit der bloßen Hand.',fix:'Möglicherweise heiße Geräte nicht anfassen; geeignete Hilfsmittel und Messverfahren nach Anleitung verwenden.',why:'Auch ohne sichtbares Glühen können Geräte heiß sein. Anfassen kann Verbrennungen verursachen.',other:['Kurzes Antippen ist immer sicher.','Nur unsichtbare Flammen können heiß sein.']},
 {text:'Nach dem virtuellen Üben darf jeder einen echten Brenner ohne Freigabe selbst bedienen.',fix:'Ein echter Brenner wird nur mit Freigabe, Anleitung und Aufsicht der Lehrkraft bedient.',why:'Ein Modell vermittelt Wissen und ersetzt keine Einweisung oder Freigabe für das reale Gerät.',other:['Ein Bildschirmbild ersetzt jede Sicherheitsanweisung.','Die Sicherheitsregeln gelten nur für unbekannte Geräte.']},
 {text:'Die Modellbilder sind schematisch und keine Temperaturmessungen.'}
]},
{id:'vergleich',title:'Salz und Zucker fair vergleichen',focus:'Experimentieren und Protokollieren',hint:'Suche Veränderungen, die einen fairen Vergleich stören, und prüfe den Umgang mit nicht gemessenen Werten.',lines:[
 {text:'Fragestellung: Welcher der beiden Stoffe löst sich unter vergleichbaren Bedingungen besser in Wasser?'},
 {text:'Für Salz werden 100 g kaltes Wasser, für Zucker 300 g heißes Wasser genommen; der Vergleich zeigt allein den Einfluss des Stoffs.',fix:'Für beide Stoffe werden gleiche Wassermassen bei gleicher Temperatur verwendet, damit andere Einflüsse möglichst gleich bleiben.',why:'Verschiedene Wassermengen und Temperaturen verändern die Lösungsbedingungen. Dann wird nicht nur der Einfluss des Stoffs verglichen.',other:['Für einen fairen Vergleich müssen möglichst alle Bedingungen verschieden sein.','Die Wassermenge ist grundsätzlich bedeutungslos.']},
 {text:'Jede Löffelspitze wird ohne Wägung pauschal als exakt 1 g eingetragen.',fix:'Stoffmengen werden gewogen und notiert; eine Löffelspitze hat keine allgemein festgelegte Masse.',why:'Löffel, Füllung und Stoff beeinflussen die Masse. Ohne Wägung ist die Angabe nicht exakt.',other:['Jede Löffelspitze wiegt unabhängig vom Stoff exakt 10 g.','Masse und Volumen sind immer dasselbe.']},
 {text:'Die Lehrkraft gibt vor, wie die Versuche sicher durchgeführt werden.'},
 {text:'Im Beobachtungsteil werden sichtbarer Bodensatz und Messwerte festgehalten.'},
 {text:'Eine nicht gemessene Zeit wird als erfundener genauer Messwert ergänzt.',fix:'Nicht gemessene Zeiten werden nicht erfunden; man kennzeichnet sie als nicht gemessen oder nicht festgehalten.',why:'Ein Protokoll soll tatsächliche Beobachtungen nachvollziehbar machen. Erfundenen Zahlen fehlt die Messgrundlage.',other:['Eine erfundene Zahl ist besser als die Angabe „nicht gemessen“.','Nicht gemessene Werte werden immer automatisch als 0 notiert.']},
 {text:'Die Auswertung bezieht sich auf die Fragestellung und die dokumentierten Beobachtungen.'}
]}
];

(function(){
'use strict';
const KEY='chemie5-protocol-errors-v1',cases=chemistryErrorProtocols,el=id=>document.getElementById(id);
const empty=()=>({chosen:[],repairs:{},unlocked:false,done:false,assisted:false});
let data={current:0,cases:cases.map(empty)},warning=false;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Array.isArray(saved.cases)){data.current=Math.max(0,Math.min(cases.length-1,Number.isInteger(saved.current)?saved.current:0));data.cases=cases.map((c,i)=>{const v=saved.cases[i]||{};return{chosen:Array.isArray(v.chosen)?v.chosen.filter(n=>Number.isInteger(n)&&n>=0&&n<c.lines.length):[],repairs:typeof v.repairs==='object'&&v.repairs?v.repairs:{},unlocked:!!v.unlocked,done:!!v.done,assisted:!!v.assisted}})}}catch(e){warning=true}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){warning=true}};
const choices=(line,i)=>{const a=[line.fix,...line.other];const offset=i%3;return a.slice(offset).concat(a.slice(0,offset))};
const current=()=>data.cases[data.current];
function total(){const n=data.cases.filter(c=>c.done).length;el('peTotal').textContent=`${n} von 6 Protokollen verbessert.`+(warning?' Speichern ist in diesem Browser eingeschränkt.':' Dein Stand wird in diesem Browser gespeichert.');if(n===6)complete('protocoltrainer')}
function drawSolution(){const c=cases[data.current],root=el('peSolutionBody');root.replaceChildren();const list=document.createElement('ol');c.lines.forEach(line=>{const li=document.createElement('li');li.textContent=line.fix||line.text;list.appendChild(li)});root.appendChild(list);c.lines.forEach((line,i)=>{if(!line.fix)return;const p=document.createElement('p');p.className='pe-explain';p.textContent=`Satz ${i+1}: ${line.why}`;root.appendChild(p)})}
function repairs(){
 const c=cases[data.current],s=current();el('peRepairs').hidden=!s.unlocked;el('peSolution').hidden=!s.done;el('peRepairInputs').replaceChildren();
 c.lines.forEach((line,i)=>{if(!line.fix)return;const field=document.createElement('div');field.className='pe-repair';const old=document.createElement('p');old.textContent=`Fehlerhafter Satz ${i+1}: ${line.text}`;const label=document.createElement('label');label.textContent='Passende Verbesserung auswählen';const select=document.createElement('select');select.dataset.peSentence=String(i);select.setAttribute('aria-label',`Verbesserung für Satz ${i+1}`);const blank=document.createElement('option');blank.value='';blank.textContent='Bitte wählen';select.appendChild(blank);choices(line,i).forEach((text,k)=>{const op=document.createElement('option');op.value=String(k);op.textContent=text;select.appendChild(op)});select.value=typeof s.repairs[i]==='string'?s.repairs[i]:'';select.addEventListener('change',()=>{s.repairs[i]=select.value;save()});label.appendChild(select);const feedback=document.createElement('p');feedback.className='pe-status';feedback.id='peRepairStatus'+i;field.append(old,label,feedback);el('peRepairInputs').appendChild(field)});drawSolution();el('peRepairFeedback').textContent=s.done?'Alle drei Verbesserungen passen. Öffne das Musterprotokoll zum Vergleichen.':'Wähle für jeden Fehler eine passende Verbesserung.';
}
function render(){
 const c=cases[data.current],s=current();el('peCase').value=String(data.current);el('peCaseTitle').textContent=`${data.current+1}. ${c.title} · ${c.focus}`;el('peSentences').replaceChildren();
 c.lines.forEach((line,i)=>{const label=document.createElement('label');label.className='pe-line';const input=document.createElement('input');input.type='checkbox';input.dataset.peLine=String(i);input.checked=s.chosen.includes(i);input.addEventListener('change',()=>{s.chosen=input.checked?[...new Set([...s.chosen,i])]:s.chosen.filter(n=>n!==i);save()});const span=document.createElement('span');span.textContent=`${i+1}. ${line.text}`;label.append(input,span);el('peSentences').appendChild(label)});
 el('peFeedback').textContent=s.unlocked?'Die drei fehlerhaften Aussagen wurden gefunden. Bearbeite nun die Verbesserungen.':'Markiere die drei fehlerhaften Sätze.';el('peFeedback').className='feedback';el('peHintText').hidden=true;el('peSolution').open=false;repairs();total();save();
}
cases.forEach((c,i)=>{const op=document.createElement('option');op.value=String(i);op.textContent=`${i+1}. ${c.title}`;el('peCase').appendChild(op)});
el('peCase').addEventListener('change',()=>{data.current=Number(el('peCase').value);render()});
el('peCheck').addEventListener('click',()=>{
 const c=cases[data.current],s=current(),errors=c.lines.map((l,i)=>l.fix?i:-1).filter(i=>i>=0),found=errors.filter(i=>s.chosen.includes(i)).length,falseAlarms=s.chosen.filter(i=>!errors.includes(i)).length,ok=found===3&&falseAlarms===0;
 el('peFeedback').textContent=ok?'Richtig: Du hast alle drei Fehler gefunden und keine richtige Aussage markiert. Verbessere nun die Sätze.':`${found} von 3 Fehlern gefunden; ${falseAlarms} richtige Aussage(n) fälschlich markiert. Überarbeite deine Auswahl.`;el('peFeedback').className='feedback '+(ok?'good':'bad');
 window.LernCockpit?.record({id:'chem-protocol-find-'+c.id,topic:'method',correct:ok,assisted:s.assisted,mode:'übung',skill:'anwenden'});
 if(ok){s.unlocked=true;repairs()}else s.assisted=true;save();
});
el('peHint').addEventListener('click',()=>{current().assisted=true;el('peHintText').textContent=cases[data.current].hint;el('peHintText').hidden=false;save()});
el('peRepairCheck').addEventListener('click',()=>{
 const c=cases[data.current],s=current();let n=0;c.lines.forEach((line,i)=>{if(!line.fix)return;const selected=s.repairs[i],ok=typeof selected==='string'&&selected!==''&&choices(line,i)[Number(selected)]===line.fix;if(ok)n++;el('peRepairStatus'+i).textContent=ok?'Richtig. '+line.why:selected?'Noch nicht passend. '+line.why:'Wähle zuerst eine Verbesserung aus.'});
 const ok=n===3;el('peRepairFeedback').textContent=ok?'Alle drei Verbesserungen sind richtig. Das korrigierte Musterprotokoll ist jetzt verfügbar.':`${n} von 3 Verbesserungen passen. Lies die Erklärungen und versuche es erneut.`;window.LernCockpit?.record({id:'chem-protocol-repair-'+c.id,topic:'method',correct:ok,assisted:s.assisted,mode:'übung',skill:'erklären'});if(ok){s.done=true;el('peSolution').hidden=false;el('peSolution').open=true;total()}else s.assisted=true;save();
});
el('peReset').addEventListener('click',()=>{data.cases[data.current]=empty();render()});el('peNext').addEventListener('click',()=>{data.current=(data.current+1)%cases.length;render();el('peCaseTitle').focus()});
function print(solutions){
 let root=document.getElementById('cePrintDocument');if(!root){root=document.createElement('div');root.id='cePrintDocument';document.body.appendChild(root)}root.replaceChildren();
 cases.forEach((c,index)=>{const page=document.createElement('section');page.className='pe-print-case';const h=document.createElement('h1');h.textContent=`${index+1}. ${c.title}`;const intro=document.createElement('p');intro.textContent=solutions?'Korrigiertes Musterprotokoll mit Erklärungen.':'Fiktives Übungsprotokoll: Markiere genau drei fehlerhafte Aussagen und verbessere sie. Name: __________________';const list=document.createElement('ol');c.lines.forEach((line,i)=>{const li=document.createElement('li');li.textContent=solutions?(line.fix||line.text):line.text;if(solutions&&line.fix){const why=document.createElement('p');why.textContent='Erklärung: '+line.why;li.appendChild(why)}list.appendChild(li)});page.append(h,intro,list);if(!solutions){const prompt=document.createElement('p');prompt.textContent='Meine Verbesserungen mit Begründung:';page.appendChild(prompt);for(let i=0;i<6;i++){const rule=document.createElement('div');rule.className='ce-print-line';page.appendChild(rule)}}root.appendChild(page)});window.ChemistryExamVisuals?.stop();document.body.classList.add('ce-printing');window.print();
}
el('pePrint').addEventListener('click',()=>print(false));el('pePrintSolutions').addEventListener('click',()=>print(true));
const card=document.createElement('button');card.type='button';card.className='card clickable';card.setAttribute('aria-label','Protokoll-Fehlertrainer öffnen');card.innerHTML='<span class="card-top"><span class="topic-icon">🔍</span><span class="topic-code">ÜBEN</span></span><span class="card-h3">Protokolle mit Fehlern</span><span class="card-p">Sechs Protokolle prüfen, je drei Fehler finden, verbessern und erklären.</span><span class="card-link">Fehlerdetektiv werden →</span>';card.addEventListener('click',()=>navigate('protocoltrainer'));const finalCard=document.querySelector('[aria-label="Abschlusstest zur Klassenarbeit öffnen"]');el('homeCards').insertBefore(card,finalCard||null);
render();const direct=()=>{if(location.hash==='#protokollfehler')navigate('protocoltrainer')};window.addEventListener('hashchange',direct);direct();
})();

