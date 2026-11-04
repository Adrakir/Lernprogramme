'use strict';
const recordedStories={
 room:'Ben’s room is upstairs. His mum is downstairs. Ben and Mia listen to music.',
 parcel:'A postman brings a parcel for Mia’s dad. Her dad is in the garden.',
 cousin:'Lily sends Ben a message. They meet on Saturday at Ben’s place.',
 pet:'Mia is eleven. Her pet is a white rabbit.'
};
for(const story of listeningStories){story.text=recordedStories[story.word];story.audioFile='audio/'+story.word+'.mp3'}
let recordedPlayer=null;
const stopDeviceAndRecording=stopAudio;
stopAudio=function(){if(recordedPlayer){const previous=recordedPlayer;recordedPlayer=null;previous.onended=null;previous.onerror=null;previous.pause();previous.removeAttribute('src');previous.load()}stopDeviceAndRecording()};
const speakWithDevice=speak;
speak=function(text,onEnd=()=>{},onError=()=>{},options={}){
 const story=listeningStories.find(s=>s.text===text);
 if(!story){speakWithDevice(text,onEnd,onError,options);return}
 stopAudio();const epoch=audioEpoch;const player=new Audio(story.audioFile);recordedPlayer=player;player.playbackRate=options.rate??Number($('#speed').value||1);
 const fail=()=>{if(epoch!==audioEpoch||recordedPlayer!==player)return;stopAudio();$('#audio-status').textContent='Aufnahme konnte nicht starten. Nutze den Lesetext oder versuche es erneut.';onError()};
 player.onended=()=>{if(epoch!==audioEpoch||recordedPlayer!==player)return;recordedPlayer=null;$('#audio-status').textContent='Aufnahme beendet.';onEnd()};player.onerror=fail;
 $('#audio-status').textContent='Britische Sprachaufnahme · Noble Nigel';
 try{const result=player.play();if(result?.catch)result.catch(fail)}catch{fail()}
};
const introWithRecordedAudio=applicationIntro;
applicationIntro=function(){introWithRecordedAudio();const note=$('#workspace .small-text');if(note)note.textContent='Vier Hörgeschichten mit gespeicherter britischer Sprachaufnahme. „Langsam hören“ spielt sie langsamer ab. Einzelne Vokabeln nutzen weiterhin die Gerätestimme. Alternativ kannst du den Text lesen.'};
