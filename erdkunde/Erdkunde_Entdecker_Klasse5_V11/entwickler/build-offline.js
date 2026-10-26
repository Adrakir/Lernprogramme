/* node entwickler\build-offline.js – reproduzierbare Ein-Datei-Ausgabe. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.dirname(__dirname),image='data:image/webp;base64,'+fs.readFileSync(path.join(__dirname,'gustav-globus.webp')).toString('base64');
function bundle(file){
 let html=fs.readFileSync(path.join(__dirname,file),'utf8');
 html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,f)=>'<style>\n'+fs.readFileSync(path.join(__dirname,f),'utf8')+'\n</style>');
 html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,f)=>'<script>\n/* '+f+' */\n'+fs.readFileSync(path.join(__dirname,f),'utf8').replace(/<\/script/gi,'<\\/script')+'\n</script>');
 html=html.replaceAll('src="gustav-globus.webp"','src="'+image+'"').replaceAll('../Erdkunde_Lernheft_Klasse5_final.pdf','Erdkunde_Lernheft_Klasse5_final.pdf');
 html=html.replace(/<link rel="(?:manifest|apple-touch-icon)"[^>]+>/g,'');
 fs.writeFileSync(path.join(root,file),html);
 console.log(file+': '+Buffer.byteLength(html)+' Bytes');
}
bundle('index.html');
// Das separat erstellte Lernheft ist nicht in jedem Quellpaket enthalten.
if(fs.existsSync(path.join(__dirname,'lernheft.html')))bundle('lernheft.html');

