(function(){
const NS='http://www.w3.org/2000/svg',WL=1000,TAU=Math.PI*2;
const $=id=>document.getElementById(id);
const svg=$('scene'),stage=$('ride');
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=[[2200,1000],[2400,985],[2900,870],[3150,900],[3700,720],[3950,760],[4600,520],[4850,570],[5500,330],[5700,370],[6300,250],[6550,250],[6800,170],[6950,200],[7300,40],[7450,70],[7800,-120],[7950,-90],[8250,-260],[8350,-250],[8700,-50],[9200,300],[9800,800],[10400,1000]];
const SUMMIT=R[18];
const slice=(a,b)=>R.filter(p=>p[0]>=a&&p[0]<=b);
const SEG={swim:[[300,WL],[2150,WL]],t1:[[2150,WL],[2200,1000],[2400,985]],bike:slice(2400,6300),t2:[[6300,250],[6550,250]],run:slice(6550,8250)};
function poly(pts){let L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));return{pts,L,len:L[L.length-1]}}
for(const k in SEG)SEG[k]=poly(SEG[k]);
function at(s,t){t=Math.max(0,Math.min(1,t));const d=t*s.len;let i=1;while(i<s.L.length-1&&s.L[i]<d)i++;const a=s.pts[i-1],b=s.pts[i],f=(d-s.L[i-1])/((s.L[i]-s.L[i-1])||1);return{x:a[0]+(b[0]-a[0])*f,y:a[1]+(b[1]-a[1])*f,ang:Math.atan2(b[1]-a[1],b[0]-a[0])}}
const P={hero:.05,swim:.30,t1:.34,bike:.67,t2:.71,run:.94};
const ss=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
const mix=(a,b,t)=>a+(b-a)*t;
function key(k,p){for(let i=1;i<k.length;i++)if(p<=k[i][0]){const a=k[i-1],b=k[i];return a[1]+(b[1]-a[1])*ss((p-a[0])/(b[0]-a[0]||1))}return k[k.length-1][1]}
const ZK=[[0,1.1],[.30,1.1],[.37,.78],[.66,.78],[.73,.95],[.93,.95],[1,.85]];
const ZKm=[[0,1.15],[.30,1.15],[.37,.8],[.66,.8],[.73,1],[.93,1],[1,.85]];
const YK=[[0,150],[.30,150],[.37,60],[.66,60],[.73,40],[.93,40],[1,360]];
const YKm=[[0,170],[.30,170],[.37,190],[.66,190],[.73,170],[.93,170],[1,240]];
const LK=[[0,1],[.92,1],[1,0]];
const FK=[[0,1100],[.31,1100],[.38,850],[.65,850],[.72,1100]];

let W=1000,mob=false,sky,sun,far,mid,world,fg,refl,pop,birds=[];
function build(){
  svg.innerHTML='';
  mob=innerWidth<700;
  W=1000*innerWidth/innerHeight;
  svg.setAttribute('viewBox',`0 0 ${W} 1000`);
  sky=el('rect',{x:-10,y:-10,width:W+20,height:1020,class:'c-sky'},svg);
  const defs=el('defs',{},svg);
  let r=rng(5);
  const tz=el('pattern',{id:'terrazzo',width:220,height:220,patternUnits:'userSpaceOnUse'},defs);
  const tzc=['c-deco','c-far','c-deco2','c-cream','c-far2'];
  for(let i=0;i<26;i++){const x=r()*220,y=r()*220,rr=2+r()*7,c=tzc[i%5];if(i%3)el('circle',{cx:x,cy:y,r:rr,class:c},tz);else el('polygon',{points:`${x},${y} ${x+rr*2},${y+rr*.6} ${x+rr*.4},${y+rr*1.8}`,class:c},tz)}
  const st=el('pattern',{id:'stripes',width:28,height:28,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},defs);el('rect',{width:12,height:28,class:'c-cream'},st);
  const hs=el('pattern',{id:'hstripes',width:20,height:20,patternUnits:'userSpaceOnUse'},defs);el('rect',{width:20,height:9,class:'c-cream'},hs);
  const sc=el('pattern',{id:'scallop',width:90,height:56,patternUnits:'userSpaceOnUse'},defs);
  el('path',{d:'M8,20 A18,18 0 0 1 44,20',class:'arc'},sc);el('path',{d:'M53,48 A18,18 0 0 1 89,48',class:'arc'},sc);
  sky=el('rect',{x:-10,y:-10,width:W+20,height:1020,class:'c-sky'},svg);
  const R0=mob?110:160;
  sun=el('g',{},svg);
  const sclip=el('clipPath',{id:'sunclip'},defs);el('circle',{r:R0},sclip);
  el('circle',{r:R0,class:'c-sun'},sun);
  const sg=el('g',{'clip-path':'url(#sunclip)'},sun);
  for(let i=0;i<5;i++)el('rect',{x:-R0,y:R0*.15+i*R0*.19,width:R0*2,height:R0*(.04+i*.025),class:'c-sky'},sg);
  el('circle',{r:R0*.42,cx:-R0*.18,cy:-R0*.22,class:'c-deco2',opacity:.0},sun);
  birds=[0,1,2,3].map(()=>el('path',{d:'M-14,-4 Q-7,-10 0,0 Q7,-10 14,-4',class:'bird'},svg));
  far=el('g',{},svg);mid=el('g',{},svg);
  r=rng(7);let kk=0;
  for(let x=-600;x<W+1800;kk++){const h=200+r()*190,w=h*(.9+r()*.4),t=kk%4,c1=['c-far','c-deco','c-far2','c-far'][kk%4],c2=['c-far2','c-far','c-deco','c-deco'][kk%4];
    if(t===0){el('polygon',{points:`${x-w},0 ${x},${-h} ${x},0`,class:c1},far);el('polygon',{points:`${x},${-h} ${x+w},0 ${x},0`,class:c2},far)}
    else if(t===1){const rr=w*.8;el('path',{d:`M${x-rr},0 A${rr},${rr} 0 0 1 ${x+rr},0 Z`,class:c1},far);el('path',{d:`M${x-rr*.55},0 A${rr*.55},${rr*.55} 0 0 1 ${x+rr*.55},0 Z`,class:c2},far);el('path',{d:`M${x-rr*.25},0 A${rr*.25},${rr*.25} 0 0 1 ${x+rr*.25},0 Z`,class:c1},far)}
    else if(t===2){el('polygon',{points:`${x-w},0 ${x},${-h} ${x+w},0`,class:c1},far);el('polygon',{points:`${x-w},0 ${x},${-h} ${x+w},0`,fill:'url(#stripes)',opacity:.55},far)}
    else{const rr=h*.9;el('path',{d:`M${x-rr},0 L${x-rr},${-rr*.2} A${rr},${rr} 0 0 1 ${x},${-rr*1.2} L${x},0 Z`,class:c1},far);el('rect',{x:x,y:-rr*.75,width:rr*.7,height:rr*.75,class:c2},far)}
    x+=230+r()*240}
  r=rng(21);
  const mp=[];for(let x=-600;x<W+3400;){mp.push([x,110+r()*150,1.2+r()*.5]);x+=330+r()*320}
  el('rect',{x:-1000,y:0,width:W+6000,height:3000,class:'c-lake'},mid);
  for(const[x,h,k]of mp){const w=h*k;el('path',{d:`M${x-w},0 A${w},${h*.5} 0 0 0 ${x+w},0 Z`,class:'c-lake2'},mid)}
  kk=0;for(const[x,h,k]of mp){const w=h*k;kk++;
    el('path',{d:`M${x-w},0 A${w},${h} 0 0 1 ${x+w},0 Z`,class:'c-mid'},mid);
    el('path',{d:`M${x},${-h} A${w},${h} 0 0 1 ${x+w},0 L${x},0 Z`,class:'c-mid2'},mid);
    if(kk%3===0)el('path',{d:`M${x-w},0 A${w},${h} 0 0 1 ${x+w},0 Z`,fill:'url(#terrazzo)'},mid);
    const n=1+(r()*3|0);for(let j=0;j<n;j++){const tx=x-w*.9+r()*w*1.8,th=26+r()*22;const ty=-Math.sqrt(Math.max(0,1-((tx-x)/w)**2))*h;if(ty<-20){if(r()<.5){el('line',{x1:tx,y1:ty+4,x2:tx,y2:ty-th*.7,class:'trunk'},mid);el('circle',{cx:tx,cy:ty-th*.9,r:th*.45,class:j%2?'c-deco':'c-far2'},mid)}else{el('rect',{x:tx-th*.2,y:ty-th*1.6,width:th*.4,height:th*1.7,rx:th*.2,class:'c-mid2'},mid)}}}}
  for(let i=0;i<10;i++){const x=-400+r()*(W+3000),y=40+r()*200;el('path',{d:`M${x},${y} a16,16 0 0 1 32,0 a16,16 0 0 1 32,0`,class:'arc'},mid)}
  world=el('g',{},svg);
  el('rect',{x:-3000,y:WL,width:16000,height:5000,class:'c-lake'},world);
  el('rect',{x:-3000,y:WL+24,width:16000,height:5000,fill:'url(#scallop)'},world);
  refl=el('g',{},world);
  for(let i=0;i<6;i++)el('line',{y1:WL+26+i*30,y2:WL+26+i*30,class:'refl','stroke-width':14-i*1.8},refl);
  for(const bx of[900,1650]){const bg=el('g',{transform:`translate(${bx},${WL+4})`},world);el('path',{d:'M-28,0 A28,28 0 0 1 28,0 Z',class:'c-acc'},bg);el('path',{d:'M-28,0 A28,28 0 0 1 0,-28 L0,0 Z',class:'c-deco'},bg)}
  el('polygon',{points:`2000,${WL} 2200,${WL-4} 2450,${WL-12} 2450,${WL+70}`,class:'c-deco'},world);
  const md='M'+R.map(p=>p.join(',')).join(' L')+` L10400,5000 L2200,5000 Z`;
  const cp=el('clipPath',{id:'mclip'},defs);el('path',{d:md},cp);
  el('path',{d:md,class:'c-main'},world);
  const fcg=el('g',{'clip-path':'url(#mclip)'},world);
  el('rect',{x:2000,y:-600,width:9000,height:5000,fill:'url(#terrazzo)',opacity:.55},fcg);
  let fi=0;const fcls=['c-main2','c-mid','c-deco','c-far2'];
  for(let i=1;i<R.length-1;i++){const a=R[i],b=R[i+1];if(a[1]<R[i-1][1]&&a[1]<b[1]){
    const c=fcls[fi%4];fi++;
    el('polygon',{points:`${a[0]},${a[1]} ${b[0]},${b[1]} ${b[0]+160},${b[1]+600} ${a[0]+40},${a[1]+900}`,class:c},fcg);
    if(fi%2)el('polygon',{points:`${a[0]},${a[1]} ${b[0]},${b[1]} ${b[0]+160},${b[1]+600} ${a[0]+40},${a[1]+900}`,fill:'url(#stripes)',opacity:.35},fcg);
    const cx=a[0]+90,cy=a[1]+520;for(let j=3;j>0;j--)el('path',{d:`M${cx-j*55},${cy} A${j*55},${j*55} 0 0 1 ${cx+j*55},${cy} Z`,class:['','c-cream','c-acc','c-deco'][j]},fcg)}}
  el('polygon',{points:'8250,-260 8350,-250 8445,-196 8380,-178 8340,-140 8300,-178 8245,-130 8200,-176 8120,-140 8065,-163',class:'c-snow'},world);
  el('line',{x1:2600,y1:972,x2:2600,y2:900,class:'pole'},world);
  el('polygon',{id:'t1flag',points:'2600,900 2660,915 2600,930',class:'c-acc'},world);
  el('line',{x1:8300,y1:-256,x2:8300,y2:-440,class:'pole'},world);
  el('polygon',{id:'flag',points:'8300,-440 8400,-415 8300,-390',class:'c-acc'},world);
  el('polyline',{points:slice(2400,6300).concat([[6550,250]]).map(p=>`${p[0]},${p[1]+16}`).join(' '),class:'road'},world);
  [.12,.3,.48,.66,.84].forEach((tt,i)=>{const b=at(SEG.bike,tt),bg=el('g',{transform:`translate(${b.x+40},${b.y+2})`},world);el('rect',{x:-8,y:-38,width:16,height:38,rx:8,class:'c-cream'},bg);el('rect',{x:-8,y:-38,width:16,height:12,rx:6,class:'c-acc'},bg)});
  const cs=el('g',{transform:'translate(6470,250)'},world);
  el('line',{x1:0,y1:0,x2:0,y2:-120,class:'pole2'},cs);
  el('path',{d:'M-70,-112 L-70,-150 A70,40 0 0 1 70,-150 L70,-112 Z',class:'sign-bg'},cs);
  el('text',{x:0,y:-151,class:'sign-t'},cs).textContent='COL';
  el('text',{x:0,y:-124,class:'sign-n'},cs).textContent='1 023 m';
  pop=el('circle',{r:0,class:'pop'},world);
  buildAthlete();
  fg=el('g',{},svg);
  el('rect',{x:-10,y:0,width:W+100,height:400,class:'c-lake'},fg);
  el('rect',{x:-10,y:30,width:W+100,height:400,fill:'url(#scallop)'},fg);
}
let A={};
function buildAthlete(){
  const g=el('g',{},world);A.g=g;
  const sw=el('g',{},g);A.sw=sw;
  const cl=el('clipPath',{id:'aboveWater'},el('defs',{},sw));el('rect',{x:-400,y:-400,width:800,height:406},cl);
  el('ellipse',{cx:-20,cy:20,rx:100,ry:15,class:'c-lake2'},sw);
  A.kick=[el('line',{class:'limb deep'},sw),el('line',{class:'limb deep'},sw)];
  A.wake=[0,1,2].map(()=>el('line',{class:'wave'},sw));
  A.foam=[0,1,2].map(()=>el('circle',{r:5,class:'c-snow'},sw));
  const up=el('g',{'clip-path':'url(#aboveWater)'},sw);
  A.arms=[0,1].map(()=>[el('line',{class:'limb w14'},up),el('line',{class:'limb w12'},up)]);
  A.head=el('g',{},up);
  el('circle',{cx:62,cy:-2,r:21,class:'c-acc'},A.head);el('path',{d:'M41,-2 A21,21 0 0 1 62,-23 L62,-2 Z',class:'c-deco'},A.head);
  el('line',{x1:68,y1:-6,x2:80,y2:-6,class:'goggle'},A.head);
  A.splash=[0,1,2].map(()=>el('circle',{r:6,class:'c-snow'},sw));
  const cy=el('g',{},g);A.cy=cy;
  A.speed=[0,1,2,3].map(()=>el('line',{class:'speed'},cy));
  A.cyb=el('g',{},cy);const cb=A.cyb;
  A.armB=[el('line',{class:'limb w9 back'},cb),el('line',{class:'limb w8 back'},cb)];
  A.legB=[el('line',{class:'limb w12 back'},cb),el('line',{class:'limb w11 back'},cb),el('line',{class:'shoe back'},cb)];
  A.crankB=el('line',{class:'limb w5 back'},cb);
  A.spokes=[];
  for(const x of[-55,55]){el('circle',{cx:x,cy:-34,r:32,class:'wheel'},cb);el('circle',{cx:x,cy:-34,r:24,class:'rim'},cb);A.spokes.push([x,el('line',{class:'spoke'},cb),el('line',{class:'spoke'},cb),el('line',{class:'spoke'},cb)]);el('circle',{cx:x,cy:-34,r:5,class:'c-fig'},cb)}
  el('path',{d:'M-55,-34 L0,-30 L-12,-90 Z M0,-30 L42,-88 L-12,-90 M42,-88 L55,-34',class:'frame'},cb);
  el('path',{d:'M42,-88 L46,-98 L60,-99 Q70,-99 68,-88 Q66,-80 58,-82',class:'bars'},cb);
  el('line',{x1:-12,y1:-90,x2:-14,y2:-100,class:'limb w5'},cb);
  el('line',{x1:-28,y1:-102,x2:-4,y2:-102,class:'saddle'},cb);
  el('circle',{cx:0,cy:-30,r:9,class:'c-fig'},cb);
  A.torso=el('line',{class:'torso'},cb);
  A.headG=el('g',{},cb);
  el('circle',{cx:0,cy:0,r:15,class:'c-fig'},A.headG);el('circle',{cx:9,cy:3,r:3,class:'c-cream'},A.headG);
  el('path',{d:'M-17,-2 Q-14,-20 6,-19 Q20,-17 22,-4 L4,-6 L-26,4 Z',class:'c-acc'},A.headG);
  el('line',{x1:6,y1:-2,x2:18,y2:-1,class:'goggle'},A.headG);
  A.legF=[el('line',{class:'limb w12'},cb),el('line',{class:'limb w11'},cb),el('line',{class:'shoe'},cb)];
  A.crank=el('line',{class:'limb w5'},cb);
  A.armF=[el('line',{class:'limb w9'},cb),el('line',{class:'limb w8'},cb)];
  const rn=el('g',{},g);A.rn=rn;
  A.dust=[0,1,2,3].map(()=>el('circle',{class:'c-far'},rn));
  A.rBody=el('g',{},rn);const b=A.rBody;
  A.rLegB=[el('line',{class:'limb w12 back'},b),el('line',{class:'limb w11 back'},b)];
  A.rArmB=[el('line',{class:'limb w10 back'},b),el('line',{class:'limb w9 back'},b)];
  A.rTorso=el('line',{class:'torso'},b);
  A.rHead=el('circle',{r:15,class:'c-fig'},b);
  A.rCap=el('path',{class:'c-acc'},b);
  A.rLegF=[el('line',{class:'limb w12'},b),el('line',{class:'limb w11'},b)];
  A.rArmF=[el('line',{class:'limb w10'},b),el('line',{class:'limb w9'},b)];
}
const L=(e,a,b)=>{e.setAttribute('x1',a[0]);e.setAttribute('y1',a[1]);e.setAttribute('x2',b[0]);e.setAttribute('y2',b[1])};
const sv=(e,o)=>{for(const k in o)e.setAttribute(k,o[k])};
const pt=(o,l,a)=>[o[0]+l*Math.cos(a),o[1]+l*Math.sin(a)];
const pv=(o,l,a)=>[o[0]+l*Math.sin(a),o[1]+l*Math.cos(a)];
function ik(h,p,l1,l2,fwd){const dx=p[0]-h[0],dy=p[1]-h[1],d=Math.min(Math.hypot(dx,dy),l1+l2-.01),a=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*Math.max(d,.001)))))*fwd;return[h[0]+l1*Math.cos(a-c),h[1]+l1*Math.sin(a-c)]}
function drawSwim(ph,t){
  const sh=[30,-2];
  A.arms.forEach(([u,f],i)=>{const th=Math.PI+((ph+i*Math.PI)%TAU),rec=th<TAU?Math.sin(th-Math.PI):0,e=pt(sh,42,th),h=pt(e,40,th+rec*1.5);L(u,sh,e);L(f,e,h)});
  A.kick.forEach((e,i)=>{const k=Math.sin(ph*3+i*Math.PI)*12;L(e,[-100,22],[-150,22+k])});
  A.foam.forEach((e,i)=>{const k=(ph*1.5+i/3)%1;sv(e,{cx:-150-k*40,cy:-4-Math.sin(k*Math.PI)*16,r:6*(1-k)+1})});
  A.wake.forEach((e,i)=>{const o=((t*60+i*45)%140);L(e,[-130-o,4+i*6],[-170-o-i*20,4+i*6])});
  const breathe=Math.max(0,Math.sin(ph/2))**4;
  A.head.setAttribute('transform',`rotate(${-breathe*22},62,4)`);
  A.splash.forEach((e,i)=>{const th=(ph%Math.PI)/Math.PI,on=th>.8,k=on?(th-.8)/.2:0;sv(e,{cx:110+i*12+k*10,cy:-6-k*(24-i*6),r:on?6-i:0})});
}
const POSE={seat:{hip:[-16,-106],sh:[30,-132],hand:[60,-97],head:[50,-146]},stand:{hip:[6,-114],sh:[46,-134],hand:[62,-98],head:[64,-146]},tuck:{hip:[-18,-104],sh:[30,-120],hand:[62,-86],head:[52,-130]}};
const lerp2=(a,b,t)=>[mix(a[0],b[0],t),mix(a[1],b[1],t)];
function drawBike(ph,wph,st,tk,spd,t){
  const q=k=>lerp2(lerp2(POSE.seat[k],POSE.stand[k],st),POSE.tuck[k],tk);
  const sway=Math.sin(ph)*st,bob=Math.abs(Math.sin(ph))*4*st;
  const hip=q('hip'),sh=q('sh'),hand=q('hand'),hd=q('head');
  hip[0]+=sway*4;hip[1]+=bob;sh[0]+=sway*2;sh[1]+=bob*.6;hd[1]+=bob*.6;
  const bb=[0,-30];
  [[A.legB,A.crankB,ph+Math.PI],[A.legF,A.crank,ph]].forEach(([leg,cr,a])=>{const p=pt(bb,19,a);const k=ik(hip,p,53,53,1);L(leg[0],hip,k);L(leg[1],k,p);L(leg[2],[p[0]-6,p[1]+2],[p[0]+14,p[1]+2]);L(cr,bb,p)});
  [A.armB,A.armF].forEach((arm,i)=>{const s=[sh[0]-i*0,sh[1]],h=[hand[0]-(1-i)*4,hand[1]],e=ik(s,h,30,28,-1);L(arm[0],s,e);L(arm[1],e,h)});
  L(A.torso,hip,sh);
  A.headG.setAttribute('transform',`translate(${hd[0]},${hd[1]}) rotate(${mix(-6,8,tk)})`);
  A.cyb.setAttribute('transform',`rotate(${sway*-2.5},0,0)`);
  A.spokes.forEach(([x,...ss])=>ss.forEach((s,i)=>{const a=wph+i*Math.PI/3;L(s,pt([x,-34],24,a),pt([x,-34],24,a+Math.PI))}));
  A.speed.forEach((e,i)=>{const len=40+spd*110,o=((t*900*spd+i*97)%260),y=-28-i*36;L(e,[-80-o,y],[-80-o-len,y]);e.setAttribute('opacity',Math.min(1,spd)*.9*(1-o/260))});
}
function drawRun(ph,fin,lean){
  const bob=Math.abs(Math.sin(ph))*6*(1-fin),hip=[0,-98+bob],sh=[mix(14,6,fin),-152+bob];
  L(A.rTorso,hip,sh);sv(A.rHead,{cx:sh[0]+10,cy:-174+bob});
  const hx=sh[0]+10,hy=-174+bob;
  sv(A.rCap,{d:`M${hx-16},${hy-2} A16,16 0 0 1 ${hx+16},${hy-4} L${hx+24},${hy+2} Z`});
  const leg=(e,p,side)=>{const t=mix(.7*Math.sin(p),side*.12,fin),b=mix(.15+1.3*Math.max(0,Math.cos(p)),.05,fin),k=pv(hip,48,t),f=pv(k,50,t-b);L(e[0],hip,k);L(e[1],k,f);return f};
  const arm=(e,p,side)=>{const a=mix(-.7*Math.sin(p),Math.PI+side*.55,fin),el2=pv(sh,32,a),f=mix(a+1.5,a,fin),h=pv(el2,30,f);L(e[0],sh,el2);L(e[1],el2,h)};
  const f1=leg(A.rLegF,ph,1);leg(A.rLegB,ph+Math.PI,-1);arm(A.rArmF,ph+Math.PI,1);arm(A.rArmB,ph,-1);
  A.rBody.setAttribute('transform',`rotate(${lean*(1-fin)})`);
  A.dust.forEach((e,i)=>{const k=((ph/Math.PI)+i/4)%1;sv(e,{cx:-20-k*70,cy:-4-k*14,r:fin?0:9*(1-k)})});
}
const cam={x:0,y:0,z:1,ang:0,init:false,st:0,tk:0,cr:0,wh:0,spd:0,ld:null};
const fin0=v=>Number.isFinite(v)?v:0;
const ui={hero:$('ov-hero'),swim:$('ov-swim'),bike:$('ov-bike'),run:$('ov-run'),finish:$('ov-finish'),hud:$('hud'),bars:[...document.querySelectorAll('#hud .bar i')],km:$('hud-km'),alt:$('hud-alt'),disc:$('hud-disc')};
function win(p,a,b,r=.02){return ss((p-a)/r)*(1-ss((p-b)/r))}
function show(e,o){e.style.opacity=o;e.style.transform=`translateY(${(1-o)*24}px)`;e.style.visibility=o<.01?'hidden':'visible'}
let prog=0,last=0;
function readScroll(){const r=stage.getBoundingClientRect(),h=r.height-innerHeight;prog=Math.max(0,Math.min(1,-r.top/h))}
function frame(ts){
  const t=ts/1000,dt=Math.min(.1,last?t-last:.016);last=t;
  const p=window.__aixProg??prog;let pos,mode,sub=0;
  if(p<P.hero){pos=at(SEG.swim,0);mode='swim'}
  else if(p<P.swim){sub=(p-P.hero)/(P.swim-P.hero);pos=at(SEG.swim,sub);mode='swim'}
  else if(p<P.t1){sub=(p-P.swim)/(P.t1-P.swim);pos=at(SEG.t1,sub);mode='t1'}
  else if(p<P.bike){sub=(p-P.t1)/(P.bike-P.t1);pos=at(SEG.bike,sub);mode='bike'}
  else if(p<P.t2){sub=(p-P.bike)/(P.t2-P.bike);pos=at(SEG.t2,sub);mode='t2'}
  else if(p<P.run){sub=(p-P.t2)/(P.run-P.t2);pos=at(SEG.run,sub);mode='run'}
  else{pos=at(SEG.run,1);mode='finish'}
  const z=key(mob?ZKm:ZK,p),lead=mob?0:-W*.12*key(LK,p);
  const tx=pos.x+lead/z,ty=pos.y-key(mob?YKm:YK,p);
  const k=cam.init?1-Math.exp(-dt*9):1;cam.init=true;
  cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;cam.z+=(z-cam.z)*k;
  world.setAttribute('transform',`translate(${W/2},500) scale(${cam.z}) translate(${-cam.x},${-cam.y})`);
  const dy=850-cam.y;
  far.setAttribute('transform',`translate(${-cam.x*.1},${672+dy*.08})`);
  mid.setAttribute('transform',`translate(${-cam.x*.28},${672+dy*.16})`);
  fg.setAttribute('transform',`translate(${-(cam.x*1.3)%60},${key(FK,p)})`);
  const sx=mob?W*.78:W*.86-cam.x*.01,sy=(mob?250:330)-p*120+dy*.03;
  sun.setAttribute('transform',`translate(${sx},${sy}) rotate(${p*30})`);
  const swx=cam.x+(sx-W/2)/cam.z;
  [...refl.children].forEach((e,i)=>{const hw=(120-i*16)*(1+.06*Math.sin(t*1.5+i)),o=Math.sin(t*.8+i)*14;sv(e,{x1:swx-hw+o,x2:swx+hw+o})});
  refl.setAttribute('opacity',1-ss((p-.28)/.06));
  birds.forEach((b,i)=>{const bx=((i*290+t*(22+i*4)-cam.x*.06)%(W+300)+W+300)%(W+300)-150,by=(mob?150:170)+i*36+Math.sin(t*1.3+i)*8;b.setAttribute('transform',`translate(${bx},${by}) scale(${.8+i*.12},${.5+.5*Math.abs(Math.sin(t*6+i*1.7))})`)});
  const dist=p*30000;
  let swimO=0,bikeO=0,runO=0;
  if(mode==='swim')swimO=1;else if(mode==='t1'){swimO=1-ss(sub*2);bikeO=ss(sub*2-1)}else if(mode==='bike')bikeO=1;else if(mode==='t2'){bikeO=1-ss(sub*2);runO=ss(sub*2-1)}else runO=1;
  const ta=(mode==='bike'||mode==='t1')?pos.ang:0;cam.ang+=(ta-cam.ang)*Math.min(1,k*1.5);
  A.g.setAttribute('transform',`translate(${pos.x},${pos.y})`);
  sv(A.sw,{transform:`translate(0,${Math.sin(t*2)*3}) scale(${1.3*(.2+.8*swimO)})`,opacity:swimO>0?1:0});
  sv(A.cy,{transform:`rotate(${cam.ang*180/Math.PI}) scale(${1.35*(.2+.8*bikeO)})`,opacity:bikeO>0?1:0});
  sv(A.rn,{transform:`scale(${.2+.8*runO})`,opacity:runO>0?1:0});
  if(mode==='t1'||mode==='t2'){const q=sub;sv(pop,{cx:pos.x,cy:pos.y-80,r:60+q*240,opacity:Math.sin(Math.PI*q),'stroke-width':14*(1-q)+2})}else pop.setAttribute('opacity',0);
  if(swimO)drawSwim(t*2.2+dist*.004,t);
  if(cam.ld===null)cam.ld=dist;const dd=fin0(dist-cam.ld);cam.ld=dist;
  for(const kk of['st','tk','cr','wh','spd'])cam[kk]=fin0(cam[kk]);
  const grade=-pos.ang;
  const stT=mode==='bike'&&grade>.33?1:0,tkT=mode==='bike'&&grade<-.04?1:0;
  const kb=Math.min(1,fin0(k)*.8);cam.st+=(stT-cam.st)*kb;cam.tk+=(tkT-cam.tk)*kb;
  cam.cr+=dd*.011*(1-cam.tk*.92)*(1-cam.st*.25);cam.wh+=dd*.035;
  const spd=Math.max(0,Math.min(1,Math.abs(dd)/40))*(.25+cam.tk*.75);cam.spd+=(spd-cam.spd)*Math.min(1,fin0(k));
  if(bikeO)drawBike(cam.cr,cam.wh,cam.st,cam.tk,cam.spd,t);
  const fin=ss((p-P.run)/.025);
  if(runO)drawRun(dist*.01,fin,-pos.ang*12+4);
  const fw=Math.sin(t*4)*10;$('flag').setAttribute('points',`8300,-440 ${8400+fw*.3},${-415+fw} 8300,-390`);
  $('t1flag').setAttribute('points',`2600,900 ${2660+fw*.2},${915+fw*.6} 2600,930`);
  show(ui.hero,1-ss((p-.02)/.04));
  show(ui.swim,win(p,P.hero+.01,P.swim-.01));
  show(ui.bike,win(p,P.t1,P.bike-.01));
  show(ui.run,win(p,P.t2,P.run-.005));
  show(ui.finish,ss((p-P.run-.005)/.02));
  ui.hud.style.opacity=ss((p-.03)/.03)*(1-ss((p-.95)/.02));
  const segs=[[P.hero,P.swim],[P.t1,P.bike],[P.t2,P.run]];
  const f=i=>Math.max(0,Math.min(1,(p-segs[i][0])/(segs[i][1]-segs[i][0])));
  segs.forEach((_,i)=>ui.bars[i].style.transform=`scaleX(${f(i)})`);
  ui.km.textContent=(f(0)*2+f(1)*100+f(2)*13).toFixed(1).replace('.',',');
  ui.alt.textContent=Math.round(231+Math.max(0,(WL-pos.y))/(WL-SUMMIT[1])*(1562-231)).toLocaleString('fr-FR');
  const en=document.documentElement.lang==='en';
  ui.disc.textContent=p<P.t1?(en?'Swim':'Natation'):p<P.t2?(en?'Bike':'Vélo'):(en?'Run':'Trail');
  requestAnimationFrame(frame);
}
build();readScroll();
addEventListener('scroll',readScroll,{passive:true});
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{build();readScroll()},80)});
requestAnimationFrame(frame);
})();
