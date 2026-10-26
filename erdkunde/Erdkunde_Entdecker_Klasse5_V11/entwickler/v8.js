/* V8: Gustav Globus explains geography and uses verified place/photo references. */
'use strict';
const v8={zoom:17,choice:null};
const V8_OSM_CENTER={lat:52.6094,lon:8.3639}; // verified school coordinates
const V8_REAL_PHOTO='https://commons.wikimedia.org/wiki/Special:FilePath/GFS_Diepholz_2014.JPG?width=900';
const V8_GFS_SOURCE='https://commons.wikimedia.org/wiki/File:GFS_Diepholz_2014.JPG';
const V8_SITES=[
 ['Graf-Friedrich-Schule','Thouarsstraße 18','https://commons.wikimedia.org/wiki/File:GFS_Diepholz_2014.JPG',true],
 ['BBZ-Ulderup','Schlesierstraße 13','https://www.architektur-bildarchiv.de/image/Berufsbildungszentrum-Diepholz-69506.html',false],
 ['Hallenbad Delfin','Thouarsstraße 1','https://www.architektur-bildarchiv.de/image/Hallenbad-Delfin-Diepholz-69419.html',false],
 ['Mediothek','Thouarsstraße 19','https://www.architektur-bildarchiv.de/image/Mediothek-Diepholz-69539.html',false],
 ['Polizeiinspektion','Dr.-Klatte-Straße 1','https://www.architektur-bildarchiv.de/image/Polizeiinspektion-%28Dr.-Klatte-Stra%C3%9Fe%29-Diepholz-69420.html',false],
 ['Lidl','Carl-Schwarze-Straße 1','https://www.openstreetmap.org/search?query=Lidl%20Carl-Schwarze-Stra%C3%9Fe%201%20Diepholz',false]
];
const V8_EXPLAIN={
 compass:'Suche zuerst Norden. Dann gehe im Uhrzeigersinn weiter: Osten, Süden, Westen. Die Zwischenrichtungen liegen dazwischen.',
 scale:'Beim Maßstab 1 : 5.000 entspricht 1 Zentimeter auf der Karte 5.000 Zentimetern in Wirklichkeit, also 50 Metern.',
 coords:'Bestimme die geografische Breite vom Äquator aus: Nord oder Süd. Danach folgt die Länge vom Nullmeridian aus: Ost oder West.',
 atlas:'Lies zuerst den Kartentitel, dann die Legende. Für Planquadrate suchst du den Buchstaben und die Zahl.',
 view:'Aus der Draufsicht erkennst du die Lage von Straßen und Dächern. In der Seitenansicht siehst du Fassaden und Höhen. Eine Karte ist keine Seitenansicht.',
 height:'Eng stehende Höhenlinien zeigen steile Hänge; weit auseinanderliegende Linien zeigen flachere Hänge.',
 daynight:'Eine Erdhalbkugel wird von der Sonne beleuchtet. Weil die Erde rotiert, wechseln sich Tag und Nacht ab.',
 clock:'Gehe bei Zeitzonen zuerst von der Ausgangszeit aus. Rechne dann die Zeitverschiebung hinzu oder ziehe sie ab.',
 flight:'Rechne Abflugzeit, Flugzeit und Zeitverschiebung in der richtigen Reihenfolge. Den Tageswechsel musst du mitnehmen.',
 planets:'Die Planeten umkreisen die Sonne; sie sind unterschiedlich groß und unterschiedlich weit von ihr entfernt.',
 projection:'Eine Kugel lässt sich nicht verzerrungsfrei auf ein flaches Papier übertragen. Deshalb verändern Kartenprojektionen Flächen oder Formen.',
 map:'In einer Kartenskizze zeigst du nur das Wichtigste und erklärst deine Zeichen in der Legende.',
 world:'Kontinente bestehen aus Landflächen; Ozeane aus Wasserflächen. Eine Drehung des Globus verändert nur deinen Blickwinkel, nicht die Lage.',
};
const V8_TOPIC_EXPLAIN={
 geographie:'Erdkunde untersucht die Erde und das Zusammenspiel von Natur und Menschen.',
 perspektive:'Stell dir eine Drohne über einem Gebäude vor: Du siehst das Dach. Von der Straße aus siehst du Fenster und Eingang.',
 himmelsrichtungen:'Auf einer Karte findest du mit der Windrose die vier Haupt- und vier Nebenhimmelsrichtungen.',
 wege:'Ein guter Weg hat einen Start, ein Ziel und eindeutige Richtungsangaben.',
 luftbild:'Beim Senkrechtluftbild blickst du von oben herab. Ein Schrägluftbild zeigt die Dinge aus einem Winkel.',
 kartenlesen:'Titel, Legende, Maßstab und Nordrichtung helfen dir beim Kartenlesen.',
 massstab:'Ein großer Maßstab zeigt einen kleineren Ausschnitt mit mehr Einzelheiten.',
 kartenarten:'Jede Karte hat einen Zweck. Die Legende verrät dir die Bedeutung ihrer Zeichen.',
 relief:'Höhenlinien verbinden Orte gleicher Höhe. Dichte Linien zeigen steilere Hänge.',
 atlanten:'Mit Register und Planquadrat findest du Orte schnell im Atlas.',
 gradnetz:'Jeder Ort bekommt zwei Koordinaten: erst Breite, dann Länge.',
 projektionen:'Ein Globus ist rund. Eine flache Weltkarte muss die Erdoberfläche verzerren.',
 erde:'Kontinente und Ozeane bilden zusammen die Erdoberfläche.',
 sonnensystem:'Acht Planeten kreisen um die Sonne. Unser Heimatplanet heißt Erde.',
 zeitzonen:'Durch die Erddrehung haben Orte der Welt unterschiedliche Tageszeiten.',
 skizzen:'Zeichne in deiner Kartenskizze Wichtiges vereinfacht und füge eine Legende hinzu.'
};
function v8Gustav(msg){return `<div class="v8-gustav" role="note"><img class="v8-character" src="gustav-globus.webp" alt="Gustav Globus, ein freundlicher gezeichneter Globus mit Forscherhut"><div class="v8-talk"><strong>🌍 Gustav Globus erklärt</strong><p>${esc(msg)}</p></div></div>`}
function v8SiteGrid(){return `<div class="v8-sites">${V8_SITES.map((s,i)=>`<div class="v8-site"><div class="v8-site-tag">${i+1}. ${esc(s[0])}</div><div class="mini">${esc(s[1])}, 49356 Diepholz</div>${s[3]?`<a href="${s[2]}" target="_blank" rel="noopener noreferrer">📷 Originalfoto der Schule ansehen ↗</a>`:`<a href="${s[2]}" target="_blank" rel="noopener noreferrer">${i===5?'Standort auf Karte öffnen ↗':'Originalfoto bei Bildarchiv ansehen ↗'}</a>`}</div>`).join('')}</div>`}
function v8OsmFrame(zoom=17,unique='main'){
 // OSM embedding uses a real, externally maintained map; center stays exactly the same at every zoom.
 const m={14:[.023,.036],15:[.011,.018],16:[.0055,.009],17:[.0028,.0047],18:[.0014,.0024]}[zoom]||[.0028,.0047];
 const [lat,lon]=[V8_OSM_CENTER.lat,V8_OSM_CENTER.lon];
 const bbox=[lon-m[1]/2,lat-m[0]/2,lon+m[1]/2,lat+m[0]/2].map(x=>x.toFixed(6)).join('%2C');
 const url='https://www.openstreetmap.org/export/embed.html?bbox='+bbox+'&layer=mapnik&marker='+lat+'%2C'+lon;
 return `<div class="v8-map"><iframe title="Echte OpenStreetMap-Karte des Schulzentrums Diepholz, Zoomstufe ${zoom}" src="${url}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="mini">Kartendaten: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap-Mitwirkende</a> · Internet erforderlich · <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}" target="_blank" rel="noopener noreferrer">In OSM öffnen ↗</a></div></div>`;
}
function v8ViewLesson(){return `<section class="v8-lesson">
 <h3>Diepholz: echte Karte und nachgewiesene Gebäude</h3>
 <p>Gustav untersucht das Schulzentrum rund um die <strong>Graf-Friedrich-Schule</strong>. Die Karte stammt von OpenStreetMap. Sie ist eine <strong>vereinfachte, echte Draufsicht</strong> auf Straßen und Gebäude, kein erfundenes Luftbild.</p>
 ${v8OsmFrame(17,'view')}
 <h3>Echte Gebäude – kein erfundenes Aussehen</h3>
 <p>Nur zur Graf-Friedrich-Schule liegt hier ein offen nachgewiesenes, frei verwendbares Gebäudeoriginal vor. Für die anderen Orte verlinken wir überprüfbare Referenzen. Solange keine verwendbaren Gebäudeaufnahmen vorliegen, zeigen wir keine erfundenen Seitenansichten.</p>
 <div class="v8-real-photo"><img src="${V8_REAL_PHOTO}" loading="lazy" alt="Originalfotografie der Graf-Friedrich-Schule in Diepholz, als Ansicht von außen" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="v8-photo-fallback" hidden>Das Originalfoto kann ohne Internet nicht angezeigt werden. Öffne die verlinkte Originalquelle.</div><p class="mini">Graf-Friedrich-Schule: Originalfotografie (2014), Max U., gemeinfrei. <a href="${V8_GFS_SOURCE}" target="_blank" rel="noopener noreferrer">Quelle und Bildlizenz ↗</a></p></div>
 ${v8SiteGrid()}
 <div class="v8-comparison"><div><h4>⬇️ Draufsicht</h4><p>Du blickst von <b>oben</b> auf den Ort: Straßen, Dächer und die Lage zueinander werden sichtbar.</p></div><div><h4>➡️ Seitenansicht</h4><p>Du schaust <b>von der Straße oder Seite</b> auf das einzelne Gebäude: Fassade, Fenster, Eingänge und Gebäudehöhe.</p></div></div>
 <div class="v8-question"><b>Forscherfrage von Gustav:</b> Wo kannst du Straßenkreuzungen besser erkennen?<div class="v8-buttons"><button type="button" data-v8="quiz:top">In der Draufsicht</button><button type="button" data-v8="quiz:side">In der Seitenansicht</button></div><p id="v8-view-feedback" role="status"></p></div>
 </section>`}
function v8ScaleLesson(){const zoom=v8.zoom;const zlabels={14:'Weit herausgezoomt: größerer Gebietsausschnitt, weniger Details',15:'Übersicht: Stadt und Umgebung',16:'Näher: Straßen und Stadtteile erkennbar',17:'Nah: Schulzentrum und angrenzende Straßen',18:'Sehr nah: Einzelne Gebäude und Wege gut sichtbar'};return `<section class="v8-lesson"><h3>🗺️ Diepholz: dieselbe Karte mit unterschiedlichem Zoom</h3>
 <p>Der Kartenausschnitt bleibt <strong>um dieselbe Graf-Friedrich-Schule zentriert</strong>. Mit den Tasten verändern wir nur den dargestellten Bereich. Anders als bei erfundenen Maßstabsbildern stammen die Straßen und Gebäude aus realen Kartendaten.</p>
 <div class="v8-zoom"><button type="button" data-v8="zoom:-1" ${zoom<=14?'disabled':''}>− Ausschnitt vergrößern</button><span>Zoomstufe <strong>${zoom}</strong></span><button type="button" data-v8="zoom:1" ${zoom>=18?'disabled':''}>+ Näher heran</button></div>
 ${v8OsmFrame(zoom,'scale')}
 <div class="v8-note"><strong>${zlabels[zoom]}</strong><p>Je mehr du hineinzoomst, desto <b>kleiner</b> wird der gezeigte Ausschnitt und desto <b>mehr Details</b> erkennst du.</p></div>
 <p class="mini"><strong>Wichtig:</strong> Die Zoomstufe ist noch keine exakte Maßstabszahl 1 : n. Diese hängt bei einer Bildschirmkarte auch von Bildschirmgröße und Auflösung ab. Die genauen Maßstabsrechnungen übst du direkt darunter.</p>
 <div class="v8-comparison"><div><b>Großer Maßstab · Beispiel 1 : 5.000</b><p>1 cm Karte = 50 m Wirklichkeit. Kleiner Ausschnitt, viele Details.</p></div><div><b>Kleiner Maßstab · Beispiel 1 : 100.000</b><p>1 cm Karte = 1 km Wirklichkeit. Großer Ausschnitt, weniger Details.</p></div></div></section>`;}
const _v8LabView=labView,_v8LabScale=labScale,_v8RenderLab=renderLab,_v8RenderLesson=renderLesson,_v8RenderGuide=renderGuide;
labView=function(){return v8Gustav(V8_EXPLAIN.view)+v8ViewLesson()};
labScale=function(){return v8Gustav('Jetzt vergleichen wir echte Kartenausschnitte von Diepholz. Anschließend rechnen wir den Maßstab mit festen Streckenwerten.')+v8ScaleLesson()+`<section class="v8-practice"><h3>Maßstabsrechnung zum Üben</h3>${_v8LabScale()}</section>`;};
renderLab=function(){return (state.lab==='view'||state.lab==='scale'?'':v8Gustav(V8_EXPLAIN[state.lab]||'Beobachte genau. Überlege zuerst und prüfe danach deine Vermutung.'))+_v8RenderLab()};
renderLesson=function(){const msg=V8_TOPIC_EXPLAIN[state.topic]||'Gehe Schritt für Schritt vor.';return v8Gustav(msg)+_v8RenderLesson()};
renderGuide=function(){return (state.topic?v8Gustav(V8_TOPIC_EXPLAIN[state.topic]||'Entdecke die Aufgabe in Ruhe.'):v8Gustav('Wähle einen Lernpfad aus. Ich führe dich Schritt für Schritt durch jede Einheit.'))+_v8RenderGuide()};
document.addEventListener('click',event=>{let el=event.target.closest('[data-v8]');if(!el)return;const cmd=el.dataset.v8;if(cmd.startsWith('zoom:')){v8.zoom=Math.min(18,Math.max(14,v8.zoom+Number(cmd.split(':')[1])));render();return;}if(cmd.startsWith('quiz:')){const feedback=document.getElementById('v8-view-feedback');if(feedback)feedback.textContent=cmd==='quiz:top'?'✅ Richtig! In der Draufsicht siehst du die Straßenkreuzungen und ihre Lage besonders gut.':'Noch nicht. In der Seitenansicht siehst du vor allem Fassaden und Gebäudehöhen; probiere die Draufsicht.';}},true);
