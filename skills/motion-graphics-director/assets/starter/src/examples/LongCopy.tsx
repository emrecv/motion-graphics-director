import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Editable visual system; all timing is in composition frames at 30 fps.
const DESIGN = {
  paper: '#F4F0E5', ink: '#20251F', line: '#C7CABD', tile: '#E3E5DB',
  accent: '#3654F5', white: '#FFFFFF',
};
const COPY = ['Aus vielen einzelnen', 'Aufgaben wird ein', 'übersichtlicher', 'nächster Schritt.'];
const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const progress = (frame: number, from: number, to: number) => ease(interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const scattered = [
  [180, 1006, -16], [474, 1058, 11], [854, 1010, 22],
  [329, 1232, 15], [698, 1268, -13], [918, 1440, -21],
  [133, 1515, 22], [435, 1628, -10], [732, 1654, 15],
];

export const Eval: React.FC = () => {
  const f = useCurrentFrame();
  const order = progress(f, 26, 78);
  const select = progress(f, 91, 126);
  const resolve = progress(f, 121, 143);
  const arrow = progress(f, 108, 143);
  return <AbsoluteFill style={{background: DESIGN.paper, fontFamily: 'Space Grotesk', color: DESIGN.ink, overflow: 'hidden'}}>
    {/* Static typography gives the entire sentence a full seven-second reading hold. */}
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute'}}>
      <path d="M96 137h888" stroke={DESIGN.ink} strokeWidth="2" />
      <circle cx="103" cy="100" r="7" fill={DESIGN.accent}/>
      <circle cx="127" cy="100" r="7" fill={DESIGN.accent}/>
      <circle cx="151" cy="100" r="7" fill={DESIGN.accent}/>
      {/* The open frame denotes one next action, never an app screenshot. */}
      <rect x="688" y="1208" width="226" height="226" rx="40" fill="none" stroke={DESIGN.accent} strokeWidth="2" opacity={resolve * .28}/>
      <path d="M512 1321H651M629 1300L651 1321L629 1342" stroke={DESIGN.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-arrow} opacity={arrow}/>
      {scattered.map(([sx, sy, rotation], i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const tx = 163 + col * 123;
        const ty = 1198 + row * 123;
        const phase = progress(f, 26 + i * 1.4, 73 + i * .7);
        const chosen = i === 4;
        const x = chosen ? mix(mix(sx, tx, phase), 801, select) : mix(sx, tx, phase);
        const y = chosen ? mix(mix(sy, ty, phase), 1321, select) : mix(sy, ty, phase);
        const size = chosen ? mix(94, 186, select) : 94;
        const turn = mix(rotation, 0, phase);
        const fill = chosen ? DESIGN.accent : DESIGN.tile;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${turn})`}>
          <rect x={-size/2} y={-size/2} width={size} height={size} rx={mix(18,32,chosen ? select : 0)} fill={fill} stroke={chosen ? DESIGN.accent : DESIGN.line} strokeWidth="2"/>
          {chosen ? <path d={`M${mix(-20,-36,select)} 0H${mix(20,36,select)}M${mix(8,18,select)} ${mix(-12,-18,select)}L${mix(20,36,select)} 0L${mix(8,18,select)} ${mix(12,18,select)}`} fill="none" stroke={DESIGN.white} strokeWidth={mix(3,6,select)} strokeLinecap="round" strokeLinejoin="round"/> : <>
            <circle cx="-19" cy="0" r="4" fill={DESIGN.ink} opacity={.45}/>
            <path d="M-5 0H22" stroke={DESIGN.ink} strokeWidth="3" strokeLinecap="round" opacity={.45}/>
          </>}
        </g>;
      })}
      {/* The vacated position preserves the relationship between whole and next step. */}
      <rect x="239" y="1274" width="94" height="94" rx="18" fill="none" stroke={DESIGN.line} strokeWidth="2" strokeDasharray="5 7" opacity={select}/>
      <path d="M96 1775h888" stroke={DESIGN.ink} strokeWidth="2"/>
      <path d="M96 1775h888" stroke={DESIGN.accent} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(f,0,209)}/>
    </svg>
    <div style={{position:'absolute', top:235, left:96, right:80, fontSize:79, lineHeight:1.15, fontWeight:500, letterSpacing:'-3.1px'}}>
      {COPY.map((line, i) => <div key={line} style={{whiteSpace:'nowrap', color:i >= 2 ? DESIGN.accent : DESIGN.ink, fontWeight:i >= 2 ? 700 : 500}}>{line}</div>)}
    </div>
    <div style={{position:'absolute', left:98, top:813, width:110, height:8, background:DESIGN.accent}} />
  </AbsoluteFill>;
};
