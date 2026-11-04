const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname,manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
let html=fs.readFileSync(path.join(root,'template.html'),'utf8');
for(const part of manifest){const source=fs.readFileSync(path.join(root,part.file),'utf8');if(part.tag==='script')new vm.Script(source,{filename:part.file});const attrs=Object.entries(part.attrs||{}).map(([k,v])=>` ${k}="${String(v).replace(/"/g,'&quot;')}"`).join('');const token=`<!-- CHEMIE_SOURCE:${part.file} -->`;if(html.split(token).length!==2)throw Error('Missing or duplicate source: '+part.file);html=html.replace(token,()=>`<${part.tag}${attrs} data-chemie-source="${part.file}">${source}</${part.tag}>`);}
if(html.includes('CHEMIE_SOURCE:'))throw Error('Unresolved source marker');
const target=path.join(root,'../Chemie_Entdeckerlabor_V7_2.html');
if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==html)throw Error('Offline HTML differs from source build');console.log('Offline build matches all source modules.');}else{fs.writeFileSync(target,html);console.log('Built '+path.basename(target)+' ('+Buffer.byteLength(html)+' bytes).');}
