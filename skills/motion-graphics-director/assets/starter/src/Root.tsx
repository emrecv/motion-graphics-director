import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, cancelRender} from 'remotion';
import {Film} from './Film';
import {filmSchema, FilmProps} from './content';
import {Eval as TypographyExample} from './examples/Typography';
import {Eval as LongCopyExample} from './examples/LongCopy';
import {CDNExplainer} from './cdn/CDNExplainer';
import {CDN_DURATION} from './cdn/story';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/barlow-condensed/600.css';
const FontGate:React.FC<{children:React.ReactNode}>=({children})=>{
 const [handle]=useState(()=>delayRender('Loading packaged fonts'));
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  let active=true;
  Promise.all([document.fonts.load('500 32px "Space Grotesk"'),document.fonts.load('700 132px "Space Grotesk"'),document.fonts.load('600 222px "Barlow Condensed"')])
   .then(loaded=>{
    if(loaded.some(faces=>faces.length===0)) throw new Error('A packaged font was not found; check the font imports.');
    if(active)setReady(true);
   }).catch(cancelRender);
  return ()=>{active=false;continueRender(handle);};
 },[handle]);
 // Resume capture only after the font-ready render has mounted and measured text.
 useEffect(()=>{if(ready)continueRender(handle);},[ready,handle]);
 return ready?<>{children}</>:null;
};
const Editorial:React.FC<React.ComponentProps<typeof Film>>=p=><FontGate><Film {...p}/></FontGate>;
const Expressive:React.FC<React.ComponentProps<typeof Film>>=p=><FontGate><Film {...p} direction="expressive"/></FontGate>;
const CDN:React.FC<{audioEnabled:boolean}>=p=><FontGate><CDNExplainer {...p}/></FontGate>;
const validateProps=({props}:{props:FilmProps})=>({props:filmSchema.parse(props)});
export const RemotionRoot:React.FC = () => <>
 {/* Literal defaults let Studio save changes back to this file. Keep story data here, separate from Film's animation logic. */}
 <Composition id="FORM-Editorial" component={Editorial} durationInFrames={600} fps={30} width={1080} height={1920} defaultProps={{
  brand:'FORM',label:'IDEAS INTO MOTION',
  headlines:['Gute Ideen.\nSpürbar machen.','Weniger Lärm.\nMehr Wirkung.','Farbe.\nForm.\nGefühl.','Ein Gedanke.\nViele Möglichkeiten.','Mach deine\nIdee bewegend.'],
  supporting:['Eine Idee ist erst der Anfang.\nGib ihr Bewegung.','KLARE FORM. KLARE RICHTUNG.','Nicht nur sehen.\nEtwas fühlen.','Ein System. Dein eigener Ausdruck.','MAKE IDEAS MOVE.'],
  footer:'FIKTIVE MARKE · MOTION STUDY',accent:'#ff512f',
  musicVolume:0,sfxVolume:1,audioEnabled:true,
 }} schema={filmSchema} calculateMetadata={validateProps}/>
 <Composition id="FORM-Expressive" component={Expressive} durationInFrames={600} fps={30} width={1080} height={1920} defaultProps={{
  brand:'FORM',label:'MAKE IT MOVE',
  headlines:['IDEEN.\nABER IN\nBEWEGUNG.','WENIGER\nLÄRM.\nMEHR WUMMS.','FARBE.\nFORM.\nGEFÜHL.','EINE IDEE.\nVIELE\nRICHTUNGEN.','MAKE\nIDEAS\nMOVE.'],
  supporting:['Gute Ideen bleiben nicht still.','Auf den Punkt. Ins Gefühl.','Laut gedacht. Klar gestaltet.','Dein Stil. Dein nächster Move.','MAKE IT MOVE.'],
  footer:'FIKTIVE MARKE · MOTION STUDY',accent:'#193cf1',
  musicVolume:0,sfxVolume:1,audioEnabled:true,
 }} schema={filmSchema} calculateMetadata={validateProps}/>
 <Composition id="Example-Typography" component={TypographyExample} durationInFrames={180} fps={30} width={1080} height={1920}/>
 <Composition id="Example-LongCopy" component={LongCopyExample} durationInFrames={210} fps={30} width={1080} height={1920}/>
 <Composition id="CDN-Explained" component={CDN} durationInFrames={CDN_DURATION} fps={30} width={1080} height={1920} defaultProps={{audioEnabled:true}}/>
 </>;
