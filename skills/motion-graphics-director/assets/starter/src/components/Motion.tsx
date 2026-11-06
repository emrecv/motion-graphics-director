import React, {useMemo} from 'react';
import {Easing, interpolate} from 'remotion';
import {fonts} from '../design';

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const progress = (frame:number, start:number, length:number) => interpolate(frame,[start,start+length],[0,1],{easing:ease,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const linear = (frame:number,start:number,length:number) => interpolate(frame,[start,start+length],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

export const Reveal:React.FC<{children:React.ReactNode;frame:number;delay?:number;size?:number;color?:string;style?:React.CSSProperties}> = ({children,frame,delay=0,size=132,color,style}) => <div style={{overflow:'hidden',paddingBottom:size*.13,marginBottom:-size*.13}}><div style={{fontSize:size,lineHeight:1.01,fontWeight:700,letterSpacing:'-0.065em',color,transform:`translateY(${(1-progress(frame,delay,26))*112}%)`,...style}}>{children}</div></div>;

type TextStyle = {family: string; weight: number; tracking: number};
export type HeadlineLine = {text: string; size: number; measuredWidth: number};
let measureContext: CanvasRenderingContext2D | null = null;

// This is called only after FontGate has mounted its children with loaded fonts.
export function measureLine(text: string, size: number, style: TextStyle): number {
 if (typeof document === 'undefined') throw new Error('Headline measurement requires a browser and loaded fonts.');
 if (!document.fonts.check(`${style.weight} ${size}px "${style.family}"`, text)) {
  throw new Error(`Headline font is not loaded: ${style.family}. Mount it inside FontGate.`);
 }
 measureContext ??= document.createElement('canvas').getContext('2d');
 if (!measureContext) throw new Error('Canvas text measurement is unavailable.');
 measureContext.font = `${style.weight} ${size}px "${style.family}"`;
 measureContext.fontKerning = 'normal';
 // Canvas letterSpacing matches the browser's shaped text, including the final
 // tracked glyph. The fallback covers browsers without that newer property.
 if ('letterSpacing' in measureContext) {
  measureContext.letterSpacing = `${style.tracking * size}px`;
  return measureContext.measureText(text).width;
 }
 return (measureContext as CanvasRenderingContext2D).measureText(text).width + Array.from(text).length * style.tracking * size;
}

export function layoutHeadline(text: string, size: number, width: number, condensed: boolean): HeadlineLine[] {
 const style: TextStyle = {family: condensed ? fonts.display : fonts.body, weight: condensed ? 600 : 700, tracking: condensed ? -.025 : -.065};
 const minimum = 72;
 const available = width - 2; // Small rounding allowance at the clipping edge.
 const paragraphs = text.split('\n').map(line => line.trim().replace(/\s+/g, ' '));
 if (paragraphs.some(line => !line) || paragraphs.length > 3) {
  throw new Error('Headline needs one to three nonempty lines. Remove empty lines or use a dedicated layout.');
 }
 const measured = (line: string, fontSize: number): HeadlineLine => ({text: line, size: fontSize, measuredWidth: measureLine(line, fontSize, style)});
 const fitSingle = (line: string): HeadlineLine | null => {
  if (measureLine(line, minimum, style) > available) return null;
  let low = minimum, high = Math.max(minimum, size);
  for (let i = 0; i < 16; i++) {
   const middle = (low + high) / 2;
   if (measureLine(line, middle, style) <= available) low = middle; else high = middle;
  }
  return measured(line, Math.floor(low * 100) / 100);
 };
 // Preserve intentional line breaks and their scale hierarchy where they fit.
 if (paragraphs.length > 1) {
  const explicit = paragraphs.map(fitSingle);
  if (explicit.every((line): line is HeadlineLine => line !== null)) return explicit;
 }
 const wrap = (fontSize: number): string[] | null => {
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
   let line = '';
   for (const word of paragraph.split(' ')) {
    if (measureLine(word, fontSize, style) > available) return null;
    const next = line ? `${line} ${word}` : word;
    if (line && measureLine(next, fontSize, style) > available) {lines.push(line); line = word;} else line = next;
   }
   if (line) lines.push(line);
  }
  return lines.length <= 3 ? lines : null;
 };
 if (!wrap(minimum)) {
  const word = paragraphs.flatMap(line => line.split(' ')).find(word => measureLine(word, minimum, style) > available);
  throw new Error(word
   ? `Headline word "${word}" cannot fit at the readable minimum of ${minimum}px. Add an intentional break or use a dedicated layout.`
   : `Headline needs more than three lines at ${minimum}px. Shorten the copy or use a dedicated layout.`);
 }
 let low = minimum, high = Math.max(minimum, size);
 for (let i = 0; i < 16; i++) {const middle = (low + high) / 2; if (wrap(middle)) low = middle; else high = middle;}
 const finalSize = Math.floor(low * 100) / 100;
 return wrap(finalSize)!.map(line => measured(line, finalSize));
}

export const Headline:React.FC<{text:string;frame:number;delay?:number;size?:number;color?:string;width?:number;condensed?:boolean;align?:'left'|'center'}> = ({text,frame,delay=6,size=132,color,width=840,condensed=false,align='left'}) => {
 const lines = useMemo(() => layoutHeadline(text, size, width, condensed), [text, size, width, condensed]);
 return <div style={{width,textAlign:align,fontFamily:condensed?fonts.display:fonts.body}}>{lines.map((line,i)=><Reveal key={i} frame={frame} delay={delay+i*6} size={line.size} color={color} style={{whiteSpace:'nowrap',letterSpacing:condensed?'-0.025em':'-0.065em',fontWeight:condensed?600:700}}>{line.text}</Reveal>)}</div>;
};

export const Orbit:React.FC<{frame:number;color:string;size?:number;mode?:'flower'|'rings'|'fan'}> = ({frame,color,size=700,mode='flower'}) => {
 const p=progress(frame,4,45); const rot=progress(frame,0,105)*70;
 return <svg width={size} height={size} viewBox="0 0 800 800" style={{overflow:'visible',transform:`rotate(${rot}deg) scale(${.5+.5*p})`,opacity:p}}>
 {mode==='flower'?Array.from({length:8},(_,i)=><ellipse key={i} cx="400" cy="400" rx={65+50*p} ry={245} fill="none" stroke={color} strokeWidth="2.4" transform={`rotate(${i*22.5} 400 400)`}/>):mode==='rings'?Array.from({length:8},(_,i)=><ellipse key={i} cx="400" cy="400" rx={100+i*30} ry={80+i*31} fill="none" stroke={color} strokeWidth="3" transform={`rotate(${i*9*progress(frame,10,75)} 400 400)`}/>):Array.from({length:12},(_,i)=><rect key={i} x="352" y="95" width="96" height="610" rx="48" fill={color} opacity={1-i*.035} transform={`rotate(${i*15*p} 400 400)`}/>)}
 </svg>;
};

export const BrandMark:React.FC<{size?:number;color?:string}> = ({size=44,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 48 48"><path d="M3 3h42v10H13v9h26v10H13v13H3z" fill={color}/><circle cx="39" cy="39" r="6" fill={color}/></svg>;
