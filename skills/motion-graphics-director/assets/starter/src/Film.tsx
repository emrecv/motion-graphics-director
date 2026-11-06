import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FilmProps, SHOTS} from './content';
import {BrandMark, Headline, Orbit, progress, linear} from './components/Motion';
import {palette,fonts} from './design';

export type Direction='editorial'|'expressive';
const {cream,ink,blue,acid,pink}=palette;

export function luminance(hex:string):number {
 const channels=[1,3,5].map(offset=>parseInt(hex.slice(offset,offset+2),16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
export function contrastRatio(a:string,b:string):number {
 const [low,high]=[luminance(a),luminance(b)].sort((x,y)=>x-y);
 return (high+.05)/(low+.05);
}
export function contrastColor(background:string,preferred?:string,minimum=4.5):string {
 if(preferred&&contrastRatio(background,preferred)>=minimum)return preferred;
 return contrastRatio(background,cream)>contrastRatio(background,ink)?cream:ink;
}

const Header:React.FC<{brand:string;label:string;color:string}> = ({brand,label,color}) => <div style={{position:'absolute',left:88,right:100,top:92,display:'flex',alignItems:'center',justifyContent:'space-between',color,fontSize:22,letterSpacing:'.03em'}}><div style={{display:'flex',gap:13,alignItems:'center',fontWeight:700,fontSize:32,letterSpacing:'-.05em'}}><BrandMark size={29}/>{brand}<span style={{fontSize:15,alignSelf:'flex-start'}}>®</span></div><div style={{fontSize:17,letterSpacing:'.12em'}}>{label}</div></div>;

const Footer:React.FC<{scene:number;color:string;footer:string;frame:number}> = ({scene,color,footer,frame}) => <div style={{position:'absolute',left:88,right:100,bottom:254,color}}><div style={{height:1,background:color,opacity:.3,marginBottom:23}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:17,letterSpacing:'.08em'}}><span>{SHOTS[scene].chapter}</span><span>0{scene+1} / 05</span></div><div style={{fontSize:13,letterSpacing:'.12em',opacity:.55,marginTop:22}}>{footer}</div></div>;

const EditorialScene:React.FC<{scene:number;frame:number;props:FilmProps}> = ({scene,frame:f,props:p}) => {
 const dark=scene===1||scene===4; const bg=dark?ink:scene===2?p.accent:cream; const fg=contrastColor(bg,dark?cream:ink);
 const accentGraphic=contrastColor(bg,p.accent,2.5);
 const title=p.headlines[scene];
 return <AbsoluteFill style={{background:bg,color:fg}}>
 <Header brand={p.brand} label={p.label} color={fg}/>
 {scene===0&&<>
  <div style={{position:'absolute',left:88,top:300}}><Headline text={title} frame={f} size={140}/></div>
  <div style={{position:'absolute',left:120,top:700}}><Orbit frame={f-8} size={750} color={accentGraphic}/></div>
  <div style={{position:'absolute',left:88,top:1370,width:740,fontSize:26,lineHeight:1.4,whiteSpace:'pre-line',opacity:progress(f,42,22)}}>{p.supporting[scene]}</div>
  <div style={{position:'absolute',left:814,top:1330,fontSize:82,transform:`rotate(${-45+45*progress(f,35,30)}deg)`,opacity:progress(f,35,30)}}>↗</div>
 </>}
 {scene===1&&<>
  <div style={{position:'absolute',left:88,top:290}}><Headline text={title} frame={f} size={128}/></div>
  <div style={{position:'absolute',left:158,top:760,width:700,height:640}}>{Array.from({length:9},(_,i)=>{const t=progress(f,12+i*2,42);return <div key={i} style={{position:'absolute',width:590,height:48,borderRadius:28,left:55+(1-t)*Math.sin(i*4)*180,top:46+i*62,background:i===4?accentGraphic:cream,opacity:i===4?1:.16+.5*t,transform:`rotate(${(1-t)*(i-4)*11}deg) scaleX(${.25+.75*t})`}}/>})}</div>
  <div style={{position:'absolute',left:88,top:1460,width:840,fontSize:22,letterSpacing:'.04em',whiteSpace:'pre-line',opacity:progress(f,62,20)}}>{p.supporting[scene]}</div>
 </>}
 {scene===2&&<>
  <div style={{position:'absolute',left:88,top:270}}><Headline text={title} frame={f} size={182}/></div>
  <div style={{position:'absolute',left:400,top:835}}><Orbit frame={f-10} size={710} color={fg} mode="rings"/></div>
  <div style={{position:'absolute',left:88,top:1320,width:285,fontSize:26,lineHeight:1.45,whiteSpace:'pre-line',opacity:progress(f,45,22)}}>{p.supporting[scene]}</div>
 </>}
 {scene===3&&<>
  <div style={{position:'absolute',left:88,top:290}}><Headline text={title} frame={f} size={128}/></div>
  <div style={{position:'absolute',left:88,top:790,width:892,height:600,display:'flex',gap:16}}>{[0,1,2].map(i=><div key={i} style={{flex:1,position:'relative',background:i===0?ink:i===1?p.accent:'#d2d0c7',overflow:'hidden',transform:`translateY(${(1-progress(f,15+i*7,35))*680}px)`}}><div style={{position:'absolute',top:20,left:20,fontSize:20,color:contrastColor(i===0?ink:i===1?p.accent:'#d2d0c7')}}>0{i+1}</div>{i===0?<div style={{position:'absolute',left:-175,top:60}}><Orbit frame={f-20} color={cream} size={600}/></div>:i===1?<div style={{position:'absolute',left:-100,top:120}}><Orbit frame={f-25} color={contrastColor(p.accent)} size={500} mode="fan"/></div>:<div style={{position:'absolute',left:-130,top:130}}><Orbit frame={f-30} color={ink} size={500} mode="rings"/></div>}</div>)}</div>
  <div style={{position:'absolute',left:88,top:1450,width:840,fontSize:24,whiteSpace:'pre-line',opacity:progress(f,64,20)}}>{p.supporting[scene]}</div>
 </>}
 {scene===4&&<>
  <div style={{position:'absolute',left:88,top:300}}><Headline text={title} frame={f} size={128}/></div>
  <div style={{position:'absolute',left:88,top:890,display:'flex',alignItems:'center',gap:30,opacity:progress(f,27,30),transform:`translateY(${60*(1-progress(f,27,30))}px)`}}><BrandMark size={155} color={accentGraphic}/><span style={{fontWeight:700,fontSize:Math.min(200,650/(p.brand.length*.65)),letterSpacing:'-.09em'}}>{p.brand}</span></div>
  <div style={{position:'absolute',left:88,top:1290,width:840,fontSize:30,letterSpacing:'-.03em',whiteSpace:'pre-line',opacity:progress(f,48,22)}}>{p.supporting[scene]} <span style={{color:accentGraphic,marginLeft:22}}>↗</span></div>
 </>}
 <Footer scene={scene} color={fg} footer={p.footer} frame={f}/>
 </AbsoluteFill>;
};

const ExpressiveScene:React.FC<{scene:number;frame:number;props:FilmProps}> = ({scene,frame:f,props:p}) => {
 const bg=[p.accent,acid,pink,p.accent,ink][scene]; const fg=contrastColor(bg,scene===0||scene===3?acid:scene===4?pink:ink);
 const graphic=contrastColor(bg,scene===0?pink:scene===1?blue:scene===2?blue:scene===3?pink:acid,2.5);
 const words=p.headlines[scene];
 return <AbsoluteFill style={{background:bg,color:fg}}>
  <Header brand={p.brand} label={p.label} color={fg}/>
  <div style={{position:'absolute',left:88,top:scene===4?330:300,transform:`rotate(${-3*progress(f,4,35)}deg)`,transformOrigin:'left center',zIndex:2}}><Headline text={words} frame={f} size={222} width={820} condensed/></div>
  <div style={{position:'absolute',top:scene===2?815:870,left:scene===1?250:230,transform:`rotate(${progress(f,0,100)*-80}deg)`,opacity:progress(f,16,25)}}><Orbit frame={f-12} color={graphic} size={740} mode={scene%2===0?'fan':'flower'}/></div>
  <div style={{position:'absolute',left:80,top:1405,maxWidth:840,background:fg,color:bg,borderRadius:80,padding:'20px 30px',fontSize:28,letterSpacing:'-.03em',whiteSpace:'pre-line',transform:`rotate(-6deg) translateX(${(1-progress(f,40,30))*-650}px)`,zIndex:3}}>{scene===4?`${p.brand} — ${p.supporting[scene]}`:p.supporting[scene]} <span style={{marginLeft:25}}>↗</span></div>
  <Footer scene={scene} color={fg} footer={p.footer} frame={f}/>
 </AbsoluteFill>;
};

const Soundtrack:React.FC<{props:FilmProps}> = ({props:p}) => <>
 {[
  {f:12,file:'open-air.wav',v:.5},{f:38,file:'pluck.wav',v:.5},
  {f:120,file:'impact-soft.wav',v:.65},{f:152,file:'click-soft.wav',v:.8},
  {f:240,file:'open-air.wav',v:.5},{f:254,file:'tick.wav',v:.45},{f:260,file:'tick.wav',v:.5},{f:266,file:'tick.wav',v:.6},
  {f:360,file:'close-air.wav',v:.5},{f:387,file:'click-crisp.wav',v:.4},
  {f:480,file:'impact-soft.wav',v:.7},{f:522,file:'glass-soft.wav',v:.5},
 ].map((s,i)=><Sequence key={i} from={s.f}><Audio src={staticFile('audio/'+s.file)} volume={p.sfxVolume*s.v}/></Sequence>)}
 </>;

export const Film:React.FC<FilmProps&{direction?:Direction}> = ({direction='editorial',...props}) => {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{fontFamily:fonts.body,background:ink}}>
 {SHOTS.map((s,i)=>{const local=f-s.from;if(local<0||local>s.duration+18)return null; const t=progress(local,0,18); return <AbsoluteFill key={s.id} style={{clipPath:i===0?'none':`inset(${(1-t)*100}% 0 0 0)`}}>{direction==='editorial'?<EditorialScene scene={i} frame={local} props={props}/>:<ExpressiveScene scene={i} frame={local} props={props}/>}</AbsoluteFill>})}
 {props.audioEnabled&&<Soundtrack props={props}/>}
 </AbsoluteFill>;
};
