import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export const LoyoAnimatedTitle: React.FC = () => {
  const [isRedFlashing, setIsRedFlashing] = useState<boolean>(false);
  const [isPremiumJumping, setIsPremiumJumping] = useState<boolean>(false);
  const devTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const premTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. DEVELOPER TRIPLE-FLASH SEQUENCE
  useEffect(() => {
    let isMounted = true;

    const triggerTripleFlash = () => {
      if (!isMounted) return;

      // 1. Flash 1
      setIsRedFlashing(true);
      setTimeout(() => {
        if (!isMounted) return;
        setIsRedFlashing(false);

        // Pause 1 (chvilinku pauza)
        setTimeout(() => {
          if (!isMounted) return;
          // 2. Flash 2 (problikne to znova)
          setIsRedFlashing(true);
          setTimeout(() => {
            if (!isMounted) return;
            setIsRedFlashing(false);

            // Pause 2 (ještě 1 pauza chvilinku)
            setTimeout(() => {
              if (!isMounted) return;
              // 3. Flash 3 (a znova to problikne)
              setIsRedFlashing(true);
              setTimeout(() => {
                if (!isMounted) return;
                setIsRedFlashing(false);

                // Wait 15 to 30 seconds before repeating
                const nextInterval = Math.floor(Math.random() * 15000) + 15000;
                devTimeoutRef.current = setTimeout(triggerTripleFlash, nextInterval);
              }, 170);
            }, 110);
          }, 130);
        }, 110);
      }, 130);
    };

    // First cycle triggers shortly after load (3.5s) so user sees it right away
    devTimeoutRef.current = setTimeout(triggerTripleFlash, 3500);

    return () => {
      isMounted = false;
      if (devTimeoutRef.current) clearTimeout(devTimeoutRef.current);
    };
  }, []);

  // 2. PREMIUM UPWARD-RIGHT POP JUMP (1 za čas poskočí mírně doprava nahoru a hned zpátky)
  useEffect(() => {
    let isMounted = true;

    const triggerPremiumJump = () => {
      if (!isMounted) return;
      setIsPremiumJumping(true);

      // Return immediately after ~220ms
      setTimeout(() => {
        if (!isMounted) return;
        setIsPremiumJumping(false);

        // Next jump after 12 to 24 seconds
        const nextJumpDelay = Math.floor(Math.random() * 12000) + 12000;
        premTimeoutRef.current = setTimeout(triggerPremiumJump, nextJumpDelay);
      }, 220);
    };

    // First jump after 5.5s
    premTimeoutRef.current = setTimeout(triggerPremiumJump, 5500);

    return () => {
      isMounted = false;
      if (premTimeoutRef.current) clearTimeout(premTimeoutRef.current);
    };
  }, []);
  return (
    <div 
      className="relative pt-1 pb-4 select-none max-w-4xl mx-auto flex flex-col items-center text-center"
      aria-label="LoYo PREMIUM DEVELOPER"
    >
      {/* Precision corner crosshairs */}
      <span 
        aria-hidden="true" 
        className="absolute -top-2.5 left-2 sm:-left-4 text-[11px] font-mono text-[#888] pointer-events-none select-none"
      >
        +
      </span>
      <span 
        aria-hidden="true" 
        className="absolute -top-2.5 right-2 sm:-right-4 text-[11px] font-mono text-[#888] pointer-events-none select-none"
      >
        +
      </span>

         {/* Top Status & Architecture Badge - continuous pulse - CENTERED */}
      <div className="flex items-center justify-center gap-2 mb-2.5 mx-auto">
        <div className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-loyo-blue opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-loyo-blue" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text- sm:text- font-extrabold uppercase tracking-widest text-[#444] bg-loyo-bar px-2 py-0.5 border border-[#c2c2c2]">
            KÓD & SYSTÉMY NA MÍRU
          </span>
          <span className="hidden xs:inline-flex items-center gap-1 font-mono text- text-loyo-blue font-bold">
            <Terminal className="w-3 h-3 inline" /> ENGINE: ONLINE
          </span>
        </div>
      </div>

      {/* Main Kinetic Typography Headline with full-width page sweep */}
      <div className="relative py-1 w-full flex justify-center">
        {/* Full-width luminous sheen beam traveling across the whole page width and over LoYo PREMIUM DEVELOPER */}
        <div 
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden pointer-events-none z-20"
        >
                  <div
            className="animate-loyo-sheen-page absolute inset-y-0 w-48 sm:w-72 md:w-96 bg-linear-to-r from-transparent via-white/85 to-transparent pointer-events-none shadow-[0_0_35px_rgba(255,255,255,0.8)]"
          />
        </div>

        <h1 className="relative z-10 font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#18181b] leading-[1.12] flex flex-wrap items-baseline justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-center">
          {/* WORD 1: LoYo with caramel fill animation: 0% -> 100% in 5s, wait 10s, return to 0% in 5s */}
          <span className="relative inline-block transition-transform duration-300 hover:scale-[1.03] text-[#18181b]">
            {/* Base dark letterform */}
            <span className="relative z-10 select-none">LoYo</span>

            {/* Caramel liquid fill overlay animated from bottom */}
            <span 
              aria-hidden="true"
              className="absolute inset-0 z-10 text-[#c67d3b] select-none pointer-events-none animate-loyo-caramel drop-shadow-[0_1px_3px_rgba(198,125,59,0.35)]"
            >
              LoYo
            </span>
          </span>

                 {/* WORD 2: PREMIUM with Continuous Glow + Periodic Upward-Right Pop Jump */}
          <span
            className={`relative inline-flex items-baseline text-loyo-blue animate-loyo-glow font-black group cursor-default transition-transform duration-200 ease-out ${
              isPremiumJumping? 'translate-x-2.5 -translate-y-2.5 scale-[1.07]' : 'translate-x-0 translate-y-0 scale-100'
            }`}
          >
            <span className="relative z-10 tracking-tight">
              PREMIUM
            </span>
          </span>

          {/* WORD 3: DEVELOPER with gentle breathing float + periodic random red "lup" flash */}
          <span
            className={`inline-block animate-loyo-float tracking-wide font-black transition-all duration-100 ${
              isRedFlashing
               ? 'text-loyo-red scale-[1.04] drop-shadow-[0_0_20px_rgba(172,0,1,0.95)]'
                : 'text-[#18181b] hover:text-loyo-red'
            }`}
          >
            DEVELOPER
          </span>
        </h1>
      </div>

      {/* Continuous Scanning 3-Color Laser Bar across the entire page width */}
      <div className="relative mt-3 pt-1 w-screen left-1/2 -translate-x-1/2 overflow-hidden">
        {/* Underline track spanning entire page */}
               <div className="h-0.75 w-full bg-[#c8c8c8] relative overflow-hidden">
                 {/* Fixed Tri-Color Gradient Foundation */}
          <div className="absolute inset-0 bg-linear-to-r from-loyo-blue via-loyo-mustard to-loyo-red" />

          {/* Active Continuous Laser Scanner moving perpetually across entire page width */}
          <div
            aria-hidden="true"
            className="animate-loyo-scanner-page absolute top-0 bottom-0 w-32 sm:w-56 bg-linear-to-r from-transparent via-white to-transparent shadow-[0_0_16px_#ffffff] z-10"
          />
        </div>
      </div>

        {/* Pillar badges below the line - clearly legible and centered */}
      <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 text- sm:text- font-mono font-bold text-[#555] pt-3">
        <span className="flex items-center gap-1.5 text-loyo-blue">
          <span className="w-2 h-2 bg-loyo-blue rounded-xs inline-block shadow-xs" />
          01. AUTOMATIZACE
        </span>
        <span className="flex items-center gap-1.5 text-[#856520]">
          <span className="w-2 h-2 bg-loyo-mustard rounded-xs inline-block shadow-xs" />
          02. FULLSTACK
        </span>
        <span className="flex items-center gap-1.5 text-loyo-red">
          <span className="w-2 h-2 bg-loyo-red rounded-xs inline-block shadow-xs" />
          03. WEBY & LOGO
        </span>
        <span className="flex items-center gap-1.5 text-[#18181b]">
          <span className="w-2 h-2 bg-[#18181b] rounded-xs inline-block shadow-xs" />
          04. KONZULTACE
        </span>
      </div>
    </div>
  );
};
