'use strict';
// Eindeutige Einzelbilder; Familienbilder dienen nur als Kontext.
const newPictureWords=['pencil','pen','ruler','rubber','sharpener','pencil case','schoolbag','exercise book','board','chair','desk','marker','classroom','garden','park','beach'];
for(const v of vocab){
  const key=v.en.replace(/^to /,'').toLowerCase();
  if(newPictureWords.includes(key))v.image=key;
  if(['mum','dad','mother','father','parents','brother','sister','grandma','grandpa'].includes(key)){
    v.contextImage='family-scene';
    v.contextAlt='Ein Familienbeispiel: Mutter, Großmutter, Großvater und Vater hinten; Bruder und Schwester vorne.';
  }
}
for(const v of vocab.filter(v=>newPictureWords.includes(v.image)))if(!images.includes(v.en))images.push(v.en);
