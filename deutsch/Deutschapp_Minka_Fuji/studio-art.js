'use strict';
/* Kleine offline verfügbare Vektor-Bildgeschichten. Bilder sind bewusst offen:
   Sie zeigen die Ausgangslage, nicht eine einzige zwingende Lösung. */
window.MF_STUDIO_ART=(()=>{
  const palettes={
    garden:['#d6effa','#b2dfaa','#5a947a'],school:['#f5e4c4','#d2b8a6','#a78571'],lake:['#deefff','#abd6f2','#588cbb'],
    library:['#fff0d1','#d6ba93','#89684f'],forest:['#e2f5dc','#a4d3aa','#477a5f'],shelter:['#eaf6f1','#bddacf','#6e9b91'],museum:['#f4e9dc','#dcc5ad','#907a68'],planetarium:['#192940','#30466a','#94baff'],kite:['#e6f5ff','#b8e7bb','#629b89'],music:['#e9e8fc','#b0b6e5','#686ca3'],
    park:['#dcf5fa','#bde8c1','#629e83'],bike:['#d9eafa','#a9c4df','#6a8daa'],concert:['#f4e5f4','#ddbadb','#7c5b85']
  };
  const theme={
    schuppen:'garden',pokal:'school',steg:'lake',bibliothek:'library',wald:'forest',musik:'music',
    'bild-kiste':'park','bild-fahrrad':'bike','bild-konzerthaus':'concert','bild-bibliothek':'library','bild-drachen':'kite','bild-konzert':'music','bild-tierheim':'shelter','bild-theater':'concert','bild-planetarium':'planetarium','bild-museum':'museum'
  };
  const circle=(x,y,r,fill)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
  const rect=(x,y,w,h,fill,rx=0)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'"/>';
  const line=(x1,y1,x2,y2,color='#516c7f',w=3)=>'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" fill="none" stroke="'+color+'" stroke-width="'+w+'" stroke-linecap="round"/>';
  const person=(x,y,shirt='#627ec0')=>'<g>'+circle(x,y-18,7,'#dbaf8c')+rect(x-7,y-9,14,20,shirt,5)+line(x-3,y+11,x-8,y+22,'#3e5666',3)+line(x+3,y+11,x+8,y+22,'#3e5666',3)+line(x-6,y-4,x-13,y+6,'#d6a47e',3)+line(x+6,y-4,x+13,y+6,'#d6a47e',3)+'</g>';
  const shelf=(x)=>rect(x,30,54,84,'#835c43',3)+Array.from({length:7},(_,i)=>rect(x+5+i*7,35+(i%2)*3,6,25,['#a6d9dd','#e1ab6c','#7d9dc9','#d8888b'][i%4],1)).join('')+rect(x+5,64,44,4,'#f3dba6',1)+Array.from({length:6},(_,i)=>rect(x+5+i*8,70,7,27,['#9dcfc7','#f3c3a0','#a4add9'][i%3],1)).join('');
  const tree=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')">'+rect(-5,0,10,52,'#89674f',2)+circle(0,-4,23,'#5a9876')+circle(-14,8,18,'#72ac80')+circle(17,9,18,'#87bf8c')+'</g>';
  function background(type,index,p){
    const floor=rect(0,103,240,32,p[1])+line(0,105,240,105,p[2],2);
    switch(type){
      case 'garden':
        return tree(19,57,.65)+tree(215,56,.65)+rect(68,51,118,53,'#c59f76',4)+
          '<path d="M60 52 L127 17 L192 52 Z" fill="#925e58"/>'+rect(121,64,36,40,'#715c56',2)+rect(80,66,25,22,'#bfe8ed',2)+
          (index===0?circle(43,99,12,'#e66d61'):index===1?'':index===2?'<path d="M122 70 L154 66" stroke="#303c55" stroke-width="4"/>':'')+floor;
      case 'school':
        return rect(10,13,220,92,'#f6e6ca',6)+rect(18,23,45,46,'#c9e3ef',4)+rect(177,23,45,46,'#c9e3ef',4)+rect(79,71,84,32,'#b89b7d',3)+
          (index===0?'<path d="M110 48 L123 36 L136 48" fill="none" stroke="#ecb454" stroke-width="6"/>':index===1?rect(96,49,52,6,'#ae7e62',3):index===2?rect(188,72,11,31,'#c89b54',2):'<path d="M167 20 Q125 62 167 103" fill="#a24c68" stroke="#e8b7c5" stroke-width="3"/>')+floor;
      case 'lake':
        return circle(206,26,17,'#fff2a7')+'<path d="M0 74 Q48 40 86 70 T170 66 T240 68 L240 99 L0 99Z" fill="#9ebdc0"/>'+
          rect(0,82,240,53,'#76acd4')+Array.from({length:5},(_,i)=>line(12+i*47,92+(i%2)*10,43+i*47,92+(i%2)*10,'#d4f5fb',2)).join('')+
          rect(0,65,103,11,'#98785a',3)+Array.from({length:5},(_,i)=>rect(i*18,68,9,43,'#947557',1)).join('')+
          (index>1?line(67,72,78,90,'#e5c6a2',4):'');
      case 'library':
        return rect(0,10,240,96,'#f7e9d3')+shelf(14)+shelf(90)+shelf(168)+rect(0,103,240,32,'#cba884')+
          (index===0?'<path d="M63 76 L80 85 L82 60 L63 55Z" fill="#fff6e8"/>':index===1?rect(72,71,21,13,'#fff5dd',2):'');
      case 'forest':
        return tree(33,40,.95)+tree(113,38,.68)+tree(218,36,.83)+'<path d="M60 135 Q99 93 126 103 T183 133" fill="none" stroke="#cfb98c" stroke-width="20"/>'+
          (index===1?rect(151,46,6,58,'#876c56',2)+rect(134,51,41,16,'#f4dea3',2):'');
      case 'music':
        return rect(8,18,224,89,'#dadbfa',6)+rect(34,28,91,59,'#ebf5fb',3)+Array.from({length:5},(_,i)=>line(36,35+i*10,118,35+i*10,'#8f9cc8',1.5)).join('')+
          rect(170,45,43,60,'#8a7baa',3)+rect(176,50,31,48,'#d7d7ed',2)+floor;
      case 'park':
        return tree(214,33,.76)+'<path d="M18 104 L49 45 L81 104" stroke="#da8968" stroke-width="6" fill="none"/>'+
          '<path d="M49 46 L86 79 L72 86 L49 62Z" fill="#f2c875"/>'+
          rect(106,78,84,7,'#9d765d',3)+rect(111,85,6,19,'#826348')+rect(179,85,6,19,'#826348')+floor;
      case 'bike':
        return circle(196,28,17,'#f9e7ae')+'<path d="M0 99 Q58 74 128 93 T240 88 L240 135 L0 135Z" fill="#8ebb9f"/>'+
          '<circle cx="85" cy="97" r="20" fill="none" stroke="#36586a" stroke-width="4"/>'+'<circle cx="155" cy="97" r="20" fill="none" stroke="#36586a" stroke-width="4"/>'+'<path d="M85 97 L114 58 L128 97 L85 97 L155 97 L128 97 L142 61 L166 61" stroke="#36586a" stroke-width="4" fill="none" stroke-linejoin="round"/>'+
          (index===1?Array.from({length:11},(_,i)=>line(i*23,10,(i*23)-7,25,'#71a9d0',2)).join(''):'');
      case 'concert':
        return rect(0,0,240,104,'#3f305b')+'<path d="M0 0 Q15 28 30 0 Q48 30 65 0 L65 105 L0 105Z" fill="#a24c76"/>'+
          '<path d="M175 0 Q192 30 210 0 Q226 28 240 0 L240 105 L175 105Z" fill="#a24c76"/>'+
          rect(70,100,105,7,'#c18a72',2)+Array.from({length:5},(_,i)=>circle(88+i*16,17,3,'#f8e6a8')).join('')+
          (index===2?rect(65,0,111,101,'#293047',2):'');
      case 'shelter':
        return rect(0,12,240,92,'#dfede6',4)+rect(30,38,160,66,'#d0d7ce',3)+
          Array.from({length:8},(_,i)=>line(39+i*19,42,39+i*19,101,'#80908b',2)).join('')+
          rect(40,39,139,5,'#9fbaa9',1)+rect(36,98,147,7,'#628a78')+
          (index===1?'<path d="M184 44 L199 58 L184 74" stroke="#9a8068" stroke-width="4" fill="none"/>':'')+
          (index===2?'<path d="M70 97L90 87L100 97" fill="#b9895e"/>':'')+floor;
      case 'museum':
        return rect(0,0,240,101,'#eadfce')+Array.from({length:3},(_,i)=>rect(15+i*85,22,53,60,'#af9680',2)).join('')+
          Array.from({length:3},(_,i)=>rect(19+i*85,27,45,50,'#f4eadd',2)).join('')+
          (index===1?'<path d="M103 39 L143 44 L136 65 L112 64Z" fill="#c2a46c" stroke="#806843" stroke-width="2"/>':'')+
          (index===3?rect(186,45,25,58,'#796c67',2):'')+floor;
      case 'planetarium':
        return rect(0,0,240,135,'#15223b',8)+
          circle(172,28,24,'#354e8c')+circle(180,23,8,'#6476b7')+
          Array.from({length:21},(_,i)=>circle((i*49+33)%235,(i*23+17)%92,1.8,i%3?'#dce9ff':'#f4d88b')).join('')+
          '<path d="M0 120Q120 50 240 120V135H0Z" fill="#283656"/>'+
          (index===1?circle(62,59,8,'#e85e70'):index===3?rect(66,94,106,18,'#697e9b',4):'');
      case 'kite':
        return tree(209,49,.6)+'<path d="M0 105Q90 93 240 105V135H0Z" fill="#8fc5a2"/>'+
          '<path d="M76 47L97 18L118 47L98 78Z" fill="#efba73" stroke="#b87068" stroke-width="3"/>'+
          '<path d="M97 78Q128 90 110 101" fill="none" stroke="#e4e4e9" stroke-width="2" stroke-dasharray="4 3"/>'+
          (index===2?rect(163,48,52,49,'#d4b18b',2)+'<path d="M157 48L187 22L220 48Z" fill="#ad7565"/>':'')+floor;
      default:return floor;
    }
  }
  function foreground(type,index,icon){
    const x=[150,157,158,143][index],y=[78,84,90,83][index];
    const label=String(icon||'✨').replace(/[&<>"']/g,'');
    const graphic='<text x="'+x+'" y="'+y+'" font-size="37" text-anchor="middle" dominant-baseline="middle">'+label+'</text>';
    let extra='';
    if(type==='garden'){extra=index===2?'<path d="M90 98 L138 89 L153 98" fill="none" stroke="#8b7159" stroke-width="5"/>':index===3?person(59,93,'#c07f9c'):'';}
    if(type==='school')extra=person(index%2?40:197,90,'#597ba3');
    if(type==='lake')extra=index===0?person(67,62,'#db856e'):index===2?'<path d="M0 75 L65 75" stroke="#bb9f7c" stroke-width="5"/>':person(84,70,'#d98776');
    if(type==='forest')extra=person(80,91,'#728cc5');
    if(type==='park')extra=person(80,90,'#cc8c6d');
    if(type==='music')extra=index%2===0?person(67,96,'#c17f91'):'';
    return extra+graphic;
  }
  function render(id,index,icon){
    const type=theme[id]||'park',p=palettes[type],gradient='scene-'+id.replace(/[^a-z0-9-]/g,'')+'-'+index;
    return '<svg viewBox="0 0 240 135" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+
      '<defs><linearGradient id="'+gradient+'" x2="0" y2="1"><stop stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient></defs>'+
      rect(0,0,240,135,'url(#'+gradient+')',8)+background(type,index,p)+foreground(type,index,icon)+
      '<rect x="1.5" y="1.5" width="237" height="132" rx="8" fill="none" stroke="'+p[2]+'" stroke-width="3"/></svg>';
  }
  return Object.freeze({render});
})();