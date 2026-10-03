import React, { useState, useEffect, useRef, useCallback } from 'react';

const SIDE_KEYS = ['FRONT','RIGHT','BACK','LEFT'] as const;
const ALL_KEYS = ['FRONT','RIGHT','BACK','LEFT','TOP','BOTTOM'] as const;
type FaceKey = typeof ALL_KEYS[number];
interface FaceDef { key: FaceKey; rotX:number; rotY:number; baseRot:string; bg:string; text:string; neonBorder:string; neonText:string; neonGlow:string; labelNormal:string; labelNeon:string; }

const FACE_DEFS: Record<FaceKey, FaceDef> = {
  FRONT: { key:'FRONT', rotX:24, rotY:-48, baseRot:'', bg:'#040b8d', text:'white', neonBorder:'#4a7bff', neonText:'#6b9bff', neonGlow:'#040b8d', labelNormal:'L', labelNeon:'LoYo' },
  RIGHT: { key:'RIGHT', rotX:-22, rotY:-118, baseRot:'rotateY(90deg)', bg:'#CDA24D', text:'black', neonBorder:'#ffcc5c', neonText:'#ffde8a', neonGlow:'#CDA24D', labelNormal:'o', labelNeon:'Loyo' },
  BACK: { key:'BACK', rotX:24, rotY:-228, baseRot:'rotateY(180deg)', bg:'#ac0001', text:'white', neonBorder:'#ff1a1a', neonText:'#ff4a4a', neonGlow:'#ac0001', labelNormal:'Y', labelNeon:'loYO' },
  LEFT: { key:'LEFT', rotX:-22, rotY:62, baseRot:'rotateY(-90deg)', bg:'#616161', text:'white', neonBorder:'#cccccc', neonText:'#ffffff', neonGlow:'#888888', labelNormal:'o', labelNeon:'lOYO' },
  TOP: { key:'TOP', rotX:68, rotY:-28, baseRot:'rotateX(90deg)', bg:'#f8f8f6', text:'black', neonBorder:'#fff', neonText:'#fff', neonGlow:'#f8f8f6', labelNormal:'', labelNeon:'LoYo' },
  BOTTOM: { key:'BOTTOM', rotX:-112, rotY:-28, baseRot:'rotateX(-90deg)', bg:'#111', text:'white', neonBorder:'#fff', neonText:'#fff', neonGlow:'#666', labelNormal:'', labelNeon:'Loyo' },
};
const FACE_LIST = ALL_KEYS.map(k=>FACE_DEFS[k]);

interface LoyoLogoBoxProps { activeSection:string; currentPage?:string; className?:string; defaultFace?:FaceKey; perspective?:number }

export const LoyoLogoBox: React.FC<LoyoLogoBoxProps> = ({activeSection,currentPage='home',className='',defaultFace='FRONT', perspective=600})=>{
  const init = FACE_DEFS[defaultFace];
  const [rotX,setRotX]=useState(init.rotX); const [rotY,setRotY]=useState(init.rotY);
  const [face,setFace]=useState<FaceKey>(init.key); const [isNeon,setIsNeon]=useState(false);
  const [phase,setPhase]=useState<'idle'|'exploding'|'imploding'>('idle');
  const holdRef=useRef<number|null>(null); const switchRef=useRef<number|null>(null); const implodeRef=useRef<number|null>(null);
  const holding=useRef(false); const exploded=useRef(false);

  const rotateNext=useCallback(()=>{
    if(phase!=='idle')return;
    if(!isNeon){ const idx=SIDE_KEYS.indexOf(face as any); const n=(idx+1)%SIDE_KEYS.length; const k=SIDE_KEYS[n] as FaceKey; const d=FACE_DEFS[k]; setRotX(d.rotX); setRotY(p=>p-90); setFace(k); }
    else{ const others=FACE_LIST.filter(f=>f.key!==face); const pick=others[Math.floor(Math.random()*others.length)]; setRotX(pick.rotX); setRotY(p=>{ const cur=((p%360)+360)%360; const tgt=((pick.rotY%360)+360)%360; let diff=tgt-cur; if(diff>180)diff-=360; if(diff<-180)diff+=360; return p+diff;}); setFace(pick.key); }
  },[face,isNeon,phase]);

  useEffect(()=>{
    if(phase!=='idle')return;
    let target:FaceKey|null=null;
    if(activeSection==='automatizace'||currentPage==='automation')target='FRONT';
    else if(activeSection==='fullstack'||currentPage==='fullstack')target='RIGHT';
    else if(activeSection==='weby'||currentPage==='web-branding')target='BACK';
    if(target&&target!==face){ const d=FACE_DEFS[target]; const ci=SIDE_KEYS.indexOf(face as any); const ti=SIDE_KEYS.indexOf(target as any); if(ci!==-1&&ti!==-1){ const steps=(ti-ci+SIDE_KEYS.length)%SIDE_KEYS.length; setRotX(d.rotX); setRotY(p=>p-90*steps);} setFace(target); }
  },[activeSection,currentPage,face,phase]);

  const startHold=useCallback(()=>{ if(phase!=='idle')return; holding.current=true; exploded.current=false;
    holdRef.current=window.setTimeout(()=>{ exploded.current=true; setPhase('exploding');
      switchRef.current=window.setTimeout(()=>{ setIsNeon(v=>!v); setPhase('imploding');
        implodeRef.current=window.setTimeout(()=>{ setPhase('idle'); exploded.current=false; },600);
      },600);
    },600);
  },[phase]);
  const endHold=useCallback(()=>{ const was=holding.current; const ex=exploded.current; holding.current=false;
    if(holdRef.current){ clearTimeout(holdRef.current); holdRef.current=null; }
    if(!ex&&was&&phase==='idle')rotateNext();
  },[phase,rotateNext]);

  useEffect(()=>{
    return ()=>{
      if(holdRef.current) clearTimeout(holdRef.current);
      if(switchRef.current) clearTimeout(switchRef.current);
      if(implodeRef.current) clearTimeout(implodeRef.current);
    };
  },[]);

  const isExpl=phase==='exploding'; const isImpl=phase==='imploding';
  const scale=isExpl?0.9:isImpl?1.12:1; const tiltX=isExpl?-12:0; const tiltY=isExpl?-13:0;

  return(
    <div id="loyo-logo-box" className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 cursor-pointer select-none bg-transparent ${className}`}
      onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold} onTouchStart={startHold} onTouchEnd={endHold}
      onKeyDown={e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); rotateNext(); } }} role="button" tabIndex={0} aria-label="LoYo logo - přepnout stranu">
      <div className="relative w-full h-full flex items-center justify-center" style={{perspective:`${perspective}px`}}>
        <div className="relative" style={{width:'58%',height:'58%',transformStyle:'preserve-3d',transform:`rotateX(${rotX+tiltX}deg) rotateY(${rotY+tiltY}deg) scale(${scale})`,transition: isImpl?'transform 0.6s cubic-bezier(0.68,-0.55,0.265,1.55)':'transform 0.6s cubic-bezier(0.23,1,0.32,1)'}}>
          {FACE_LIST.map(f=>{
            const d=FACE_DEFS[f.key]; const isTB=f.key==='TOP'||f.key==='BOTTOM'; const show=isNeon||(SIDE_KEYS as readonly FaceKey[]).includes(f.key as any);
            const bg=isNeon?'#0a0a0a':d.bg; const border=isNeon?`2px solid ${d.neonBorder}`:'3px solid black';
            const shadow=isNeon?`0 0 10px ${d.neonBorder},0 0 20px ${d.neonBorder}`:'2.5px 2.5px 0px 0px black';
            return(
              <div key={f.key} className="absolute inset-0 flex items-center justify-center" style={{transform:`${f.baseRot} translateZ(22px)`,backgroundColor:bg,border,boxShadow:shadow,backfaceVisibility:'hidden'}}>
                {show&&<span className="font-black leading-none select-none text-[16px] sm:text-[18px]" style={{color:isNeon?d.neonText:d.text,textShadow:isNeon?`0 0 7px ${d.neonGlow}`:'none'}}>{isNeon?d.labelNeon:d.labelNormal|| (isTB?'•':'')}</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
