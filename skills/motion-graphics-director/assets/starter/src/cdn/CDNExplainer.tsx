import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Headline, progress, linear} from '../components/Motion';
import {fonts} from '../design';
import {CDN_DURATION,CDN_SHOTS,SHOT_FRAMES} from './story';

const C={bg:'#090e17',panel:'#101925',line:'#263448',text:'#f1f5fc',muted:'#93a5bd',cyan:'#59e4ff',purple:'#ad96ff',amber:'#ffbc70',green:'#9bf3ba'};
type P={x:number;y:number};
const B:P={x:224,y:1270},E:P={x:490,y:1110},O:P={x:822,y:825};
const edges:P[]=[{x:206,y:830},{x:720,y:1370}];
type Route={a:P;b:P;c:P};
const direct:Route={a:B,b:O,c:{x:60,y:690}};
const near:Route={a:B,b:E,c:{x:280,y:1090}};
const upstream:Route={a:E,b:O,c:{x:680,y:1070}};
const point=(r:Route,t:number):P=>({x:(1-t)*(1-t)*r.a.x+2*(1-t)*t*r.c.x+t*t*r.b.x,y:(1-t)*(1-t)*r.a.y+2*(1-t)*t*r.c.y+t*t*r.b.y});
const path=(r:Route)=>`M${r.a.x},${r.a.y} Q${r.c.x},${r.c.y} ${r.b.x},${r.b.y}`;

const RouteLine:React.FC<{route:Route;color?:string;opacity?:number;dashed?:boolean;draw?:number}>=({route,color=C.line,opacity=1,dashed=false,draw=1})=><path d={path(route)} fill="none" stroke={color} opacity={opacity} strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray={dashed?'0.008 0.014':'1'} strokeDashoffset={dashed?0:1-draw}/>;

const Packet:React.FC<{route:Route;frame:number;start:number;duration:number;response?:boolean;label?:string}>=({route,frame,start,duration,response=false,label})=>{
 if(frame<start||frame>start+duration)return null;
 const t=linear(frame,start,duration); const q=response?1-t:t;const p=point(route,q);const col=response?C.cyan:C.amber;
 return <g>
  {[3,2,1].map(i=>{const tail=point(route,Math.max(0,Math.min(1,q+(response?1:-1)*i*.023)));return <circle key={i} cx={tail.x} cy={tail.y} r={7-i} fill={col} opacity={.15+.12*(3-i)}/>})}
  <circle cx={p.x} cy={p.y} r="23" fill={col} opacity=".1"/>
  {response?<rect x={p.x-10} y={p.y-10} width="20" height="20" rx="4" fill={col} transform={`rotate(45 ${p.x} ${p.y})`}/>:<circle cx={p.x} cy={p.y} r="8" fill={col}/>}
  {label&&<g transform={`translate(${p.x+20} ${p.y-37})`}><rect x="-7" y="-20" width={label.length*13+20} height="36" rx="6" fill={C.bg}/><text fill={col} fontSize="22" fontWeight="500">{label}</text></g>}
 </g>;
};

const Ping:React.FC<{p:P;frame:number;at:number;color?:string}>=({p,frame,at,color=C.cyan})=>{
 const t=linear(frame,at,26);if(t<=0||t>=1)return null;
 return <circle cx={p.x} cy={p.y} r={70+t*52} fill="none" stroke={color} strokeWidth={2.5} opacity={(1-t)*.85}/>;
};

const Node:React.FC<{p:P;kind:'browser'|'edge'|'origin';color:string;active?:number;opacity?:number;label:string;sub:string}>=({p,kind,color,active=0,opacity=1,label,sub})=><g transform={`translate(${p.x} ${p.y})`} opacity={opacity}>
 <rect x="-82" y="-72" width="164" height="144" rx="24" fill={C.panel} stroke={color} strokeWidth={2} strokeOpacity={.35+active*.65}/>
 <rect x="-75" y="-65" width="150" height="130" rx="20" fill={color} opacity={active*.07}/>
 {kind==='browser'?<g stroke={color} fill="none" strokeWidth="3"><rect x="-42" y="-33" width="84" height="61" rx="7"/><path d="M-41-16H41 M-18 42H18 M0 29V42"/><circle cx="-30" cy="-25" r="2" fill={color}/><circle cx="-21" cy="-25" r="2" fill={color}/><path d="m-11 0-10 9 10 9m22-18 10 9-10 9"/></g>:kind==='origin'?<g stroke={color} fill="none" strokeWidth="3">{[-28,0,28].map(y=><g key={y}><rect x="-43" y={y-10} width="86" height="22" rx="5"/><circle cx="-29" cy={y+1} r="2.8" fill={color}/><path d={`M-15 ${y+1}H25`}/></g>)}</g>:<g stroke={color} fill="none" strokeWidth="3"><path d="m0-39 40 22v43L0 48l-40-22v-43ZM-40-17 0 5l40-22M0 5v43M-20-28 20-6"/><path d="m-15-1 15 8 15-8" opacity=".4"/></g>}
 <text x="0" y="113" textAnchor="middle" fill={C.text} fontSize="28" fontWeight="700">{label}</text>
 <text x="0" y="144" textAnchor="middle" fill={C.muted} fontSize="20">{sub}</text>
 </g>;

const StateTag:React.FC<{x:number;y:number;text:string;color:string;opacity?:number}>=({x,y,text,color,opacity=1})=><g transform={`translate(${x} ${y})`} opacity={opacity}><rect x={-text.length*7.4-18} y="-23" width={text.length*14.8+36} height="43" rx="21" fill={C.bg} stroke={color} strokeOpacity=".5"/><text textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="22" fontWeight="700" letterSpacing="1">{text}</text></g>;

const Network:React.FC<{scene:number;f:number}>=({scene,f})=>{
 const hasCDN=scene>=2;const intro=scene===2?progress(f,10,32):1;
 const miss=scene===3,hit=scene===4,summary=scene===5;
 const cached=hit||summary||(miss&&f>=135);
 const originDim=hit||summary;
 return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,fontFamily:fonts.body}}>
  {!hasCDN&&<>
   <RouteLine route={direct} dashed/>
   <RouteLine route={direct} color={C.purple} opacity={.38} draw={progress(f,8,32)}/>
   <Packet route={direct} frame={f} start={25} duration={55} label="request"/>
   <Packet route={direct} frame={f} start={88} duration={65} response label="hero.webp"/>
   <Ping p={O} frame={f} at={80} color={C.purple}/><Ping p={B} frame={f} at={153}/>
   <StateTag x={545} y={725} text={scene===0?'ORIGIN REQUEST':'LONG ROUND TRIP'} color={C.purple} opacity={progress(f,12,20)}/>
  </>}
  {hasCDN&&<g opacity={intro}>
   {edges.map((p,i)=><g key={i} opacity={scene===2?.8:.23}><RouteLine route={{a:p,b:O,c:{x:p.x,y:690+i*290}}} dashed/><circle cx={p.x} cy={p.y} r="34" fill={C.panel} stroke={C.cyan} strokeWidth="1.5"/><path d={`M${p.x-10} ${p.y}h20m-10-10v20`} stroke={C.cyan} strokeWidth="2"/><text x={p.x} y={p.y+61} textAnchor="middle" fill={C.muted} fontSize="18">EDGE {i+2}</text></g>)}
   <RouteLine route={near} color={C.cyan} opacity={.55} draw={intro}/>
   <RouteLine route={upstream} color={C.line} opacity={originDim?.42:1} dashed/>
   {miss&&<>
    <Packet route={near} frame={f} start={23} duration={24} label="request"/>
    <Packet route={upstream} frame={f} start={56} duration={35} label="fetch"/>
    <Packet route={upstream} frame={f} start={100} duration={34} response label="hero.webp"/>
    <Packet route={near} frame={f} start={142} duration={22} response/>
    <Ping p={E} frame={f} at={47} color={C.amber}/><Ping p={O} frame={f} at={91} color={C.purple}/><Ping p={E} frame={f} at={134}/><Ping p={B} frame={f} at={164}/>
   </>}
   {hit&&<>
    <Packet route={near} frame={f} start={25} duration={23} label="request"/>
    <Packet route={near} frame={f} start={57} duration={23} response label="hero.webp"/>
    <Ping p={E} frame={f} at={48}/><Ping p={B} frame={f} at={80}/>
   </>}
   {summary&&<><Packet route={near} frame={f} start={24} duration={23}/><Packet route={near} frame={f} start={56} duration={23} response/><Ping p={B} frame={f} at={79}/></>}
   <Node p={E} kind="edge" color={C.cyan} active={cached?1:.35} label="CDN edge" sub={cached?'Fresh cached copy':'Nearby cache'}/>
   <StateTag x={E.x} y={E.y-115} text={miss?(f<47?'LOOKUP':f<135?'CACHE MISS':'STORED'):hit?'CACHE HIT':summary?'NEARBY COPY':'EDGE CACHE'} color={miss&&f>=47&&f<135?C.amber:C.cyan}/>
   {cached&&<g opacity={miss?progress(f,135,12):1} transform={`translate(${E.x+67} ${E.y+36})`}><circle r="22" fill={C.green}/><path d="m-9 0 6 6 13-14" fill="none" stroke={C.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g>}
   {hit&&<StateTag x={785} y={1040} text="NO ORIGIN TRIP" color={C.muted} opacity={progress(f,90,20)}/>} 
  </g>}
  <Node p={B} kind="browser" color={C.cyan} label="Browser" sub="The visitor" active={(!hasCDN&&f>=153)||(miss&&f>=164)||(hit&&f>=80)||summary?1:.2}/>
  <Node p={O} kind="origin" color={C.purple} label="Origin" sub="Your server" opacity={originDim?.36:1} active={(!hasCDN&&f>=80&&f<110)||(miss&&f>=91&&f<115)?1:.15}/>
  {hit&&f>=80&&<StateTag x={B.x} y={B.y-115} text="DELIVERED" color={C.green} opacity={progress(f,80,15)}/>}
 </svg>;
};

const TimingBar:React.FC<{scene:number;f:number}>=({scene,f})=>{
 if(scene!==1&&scene!==4)return null;
 const hit=scene===4; const t=linear(f,25,hit?55:128);const done=t>=1;
 return <div style={{position:'absolute',top:648,left:88,width:904,opacity:progress(f,12,20)}}>
  <div style={{display:'flex',justifyContent:'space-between',fontSize:19,letterSpacing:'.08em',color:done?C.cyan:C.muted,marginBottom:14}}><span>{hit?'NEARBY CACHE':'DISTANT ORIGIN'}</span><span>{done?'RESPONSE RECEIVED':'WAITING FOR RESPONSE'}</span></div>
  <div style={{height:5,background:C.line,borderRadius:5}}><div style={{width:`${(hit?30:100)*t}%`,height:5,background:hit?C.cyan:C.purple,borderRadius:5}}/></div>
 </div>;
};

const CDNAudio:React.FC=()=> <>
 {[{f:25,file:'click-soft.wav',v:.6},{f:153,file:'glass-soft.wav',v:.5},{f:335,file:'impact-soft.wav',v:.5},{f:380,file:'open-air.wav',v:.6},{f:587,file:'click-crisp.wav',v:.65},{f:674,file:'select.wav',v:.75},{f:768,file:'click-soft.wav',v:.65},{f:800,file:'glass-bright.wav',v:.65},{f:979,file:'glass-soft.wav',v:.65}].map((x,i)=><Sequence key={i} from={x.f}><Audio src={staticFile('audio/'+x.file)} volume={x.v}/></Sequence>)}
 </>;

export const CDNExplainer:React.FC<{audioEnabled:boolean}>=({audioEnabled})=>{
 const frame=useCurrentFrame();const scene=Math.min(CDN_SHOTS.length-1,Math.floor(frame/SHOT_FRAMES));const f=frame-scene*SHOT_FRAMES;const shot=CDN_SHOTS[scene];
 return <AbsoluteFill style={{background:C.bg,color:C.text,fontFamily:fonts.body,overflow:'hidden'}}>
  <AbsoluteFill style={{backgroundImage:'linear-gradient(rgba(117,145,185,.2) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(117,145,185,.2) 1.5px,transparent 1.5px)',backgroundSize:'60px 60px',backgroundPosition:'0 0'}}/>
  <AbsoluteFill style={{backgroundImage:'radial-gradient(ellipse at 50% 55%,transparent 15%,rgba(9,14,23,.55) 85%)'}}/>
  <div style={{position:'absolute',left:88,right:88,top:92,display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:20,letterSpacing:'.1em'}}><span><span style={{color:C.cyan}}>◈</span> WEB / EXPLAINED</span><span style={{color:C.muted,fontSize:18}}>01 — CDN</span></div>
  <div style={{position:'absolute',left:88,top:216,color:C.cyan,fontSize:21,letterSpacing:'.13em',opacity:progress(f,0,12)}}>{String(scene+1).padStart(2,'0')} / {shot.label}</div>
  <div style={{position:'absolute',left:88,top:280}}><Headline text={shot.title} frame={f} size={108} width={904} delay={0}/></div>
  <div style={{position:'absolute',left:88,top:520,fontSize:33,lineHeight:1.42,color:C.muted,whiteSpace:'pre-line',opacity:progress(f,15,17),transform:`translateY(${12*(1-progress(f,15,17))}px)`}}>{shot.body}</div>
  <TimingBar scene={scene} f={f}/>
  <Network scene={scene} f={f}/>
  <div style={{position:'absolute',left:88,top:1450,display:'flex',gap:28,fontSize:18,letterSpacing:'.05em',color:C.muted}}><span><span style={{color:C.amber}}>●</span> REQUEST</span><span><span style={{color:C.cyan}}>◆</span> RESPONSE</span></div>
  <div style={{position:'absolute',left:88,top:1495,right:88,borderTop:`1px solid ${C.line}`,paddingTop:25,display:'flex',gap:14,alignItems:'center',fontSize:25,color:scene===3?C.amber:C.cyan,opacity:progress(f,25,20)}}><span style={{fontSize:16}}>●</span><span>{scene===1&&f>=153?'The full round trip is complete.':shot.status}</span></div>
  <div style={{position:'absolute',left:88,right:88,top:1606,display:'flex',gap:9}}>{CDN_SHOTS.map((_,i)=><div key={i} style={{height:3,flex:1,background:C.line}}><div style={{height:3,background:C.cyan,width:`${i<scene?100:i>scene?0:linear(f,0,179)*100}%`}}/></div>)}</div>
  <div style={{position:'absolute',left:88,right:88,top:1645,display:'flex',justifyContent:'space-between',fontSize:17,color:C.muted}}><span>ILLUSTRATIVE ROUTES · NOT A SPEED BENCHMARK</span><span>{String(scene+1).padStart(2,'0')} / 06</span></div>
  {audioEnabled&&<CDNAudio/>}
 </AbsoluteFill>;
};
