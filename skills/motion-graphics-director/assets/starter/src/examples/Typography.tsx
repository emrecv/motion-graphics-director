import React, {useEffect, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, Easing, interpolate, useCurrentFrame} from 'remotion';

/** Editable creative controls. All animation is deterministic and frame-driven. */
export const design = {
  cream: '#F5F0E7',
  cobalt: '#2145E8',
  orange: '#EB5939',
  lines: ['Weniger', 'Lärm.', 'Mehr', 'Fokus.'],
  wordmark: 'FORM',
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const progress = (f: number, start: number, end: number) => interpolate(f, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const Eval: React.FC = () => {
  const frame = useCurrentFrame();
  const [fontReady] = useState(() => delayRender('Wait for Space Grotesk'));
  useEffect(() => {
    Promise.all([document.fonts.load('700 180px "Space Grotesk"'), document.fonts.load('500 24px "Space Grotesk"')])
      .then(() => continueRender(fontReady)).catch(cancelRender);
  }, [fontReady]);
  const gather = progress(frame, 5, 34);
  const exit = progress(frame, 111, 130);
  const brand = progress(frame, 129, 147);
  // Top margin and lower 320px remain clear of typical portrait-player overlays.
  return <AbsoluteFill style={{background: design.cream, color: design.cobalt, fontFamily: 'Space Grotesk', overflow: 'hidden'}}>
    <div style={{position:'absolute', left:104, top:335, width:872, height:90}}>
      {[0,1,2,3,4].map((n) => <div key={n} style={{position:'absolute', left:(1-gather)*n*128, top:(1-gather)*[0,42,15,65,26][n], width:170 + gather*34, height:12, background:design.orange, opacity: n === 0 ? 1-exit : 1-gather, transform:`rotate(${(1-gather)*[-6,8,-4,5,-9][n]}deg)`}}/>)}
    </div>
    <div style={{position:'absolute', left:96, top:540, width:888, transform:`translateY(${-exit*48}px)`, clipPath:`inset(0 0 ${exit*100}% 0)`}}>
      {design.lines.map((line, i) => {
        const enter = progress(frame, 3 + i*3, 23 + i*3);
        return <div key={line} style={{height:184, overflow:'hidden'}}><div style={{fontSize:174, fontWeight:700, lineHeight:'184px', letterSpacing:'-8px', transform:`translateY(${(1-enter)*190}px)`}}>{line}</div></div>;
      })}
    </div>
    <div style={{position:'absolute',left:96,top:730,width:888,overflow:'hidden',textAlign:'center'}}>
      <div style={{fontSize:274,fontWeight:700,letterSpacing:'-16px',lineHeight:1.2,transform:`translateY(${(1-brand)*350}px)`}}>{design.wordmark}</div>
    </div>
    <div style={{position:'absolute',left:438,top:1140,width:204,height:12,background:design.orange,transform:`scaleX(${brand})`,transformOrigin:'center'}}/>
  </AbsoluteFill>;
};
