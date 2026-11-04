'use strict';
const improvedPictures=['bell','board','exercise book','football','hamster','house','music','pencil','phone','rubber','schoolbag','blazer','tie','upstairs','downstairs','umbrella'];
for(const v of vocab){const key=v.en.replace(/^to /,'').toLowerCase();if(improvedPictures.includes(key)){
 const asset=key.replaceAll(' ','-')+'-v10';
 if(['upstairs','downstairs'].includes(key)){v.contextImage=asset;v.contextAlt=key==='upstairs'?'Roter Punkt im oberen Stockwerk':'Roter Punkt im unteren Stockwerk';v.contextCaption='Der rote Punkt zeigt das gemeinte Stockwerk.';delete v.image;}
 else{v.image=asset;delete v.contextImage;delete v.contextCaption;if(!images.includes(v.en))images.push(v.en)}
}}
for(const en of ['pet','cute','scary','boring']){const v=vocab.find(x=>x.en===en);if(v?.image){v.contextImage=v.image;v.contextAlt='Ein mögliches Beispiel, keine eindeutige Darstellung des Begriffs';v.contextCaption=en==='pet'?'Beispiel: Eine Katze kann ein Haustier sein.':'Ein mögliches Beispiel. Menschen können das unterschiedlich empfinden.';delete v.image;}}
