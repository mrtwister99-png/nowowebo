import React, { useState, useEffect } from 'react';

interface LoyoLogoBoxProps {
  activeSection: string;
  currentPage?: string;
  className?: string;
}

export const LoyoLogoBox: React.FC<LoyoLogoBoxProps> = ({
  activeSection,
  currentPage = 'home',
  className = ''
}) => {
  // Startup neon bootup state:
  // 0: Initial uncolored state
  // 1: Boot flicker animation in progress
  // 2: Booted and fully stabilized
  const [bootPhase, setBootPhase] = useState<0 | 1 | 2>(0);
  const [flickerOpacity, setFlickerOpacity] = useState<number>(0);

  useEffect(() => {
    // 1. Initial short delay before ignition (400ms)
    const timerIgnition = setTimeout(() => {
      setBootPhase(1);

      // Flickering keyframe-like sequence (neon tube starting up)
      const steps = [
        { delay: 50, opacity: 0.8 },
        { delay: 130, opacity: 0.15 },
        { delay: 210, opacity: 0.95 },
        { delay: 300, opacity: 0.2 },
        { delay: 390, opacity: 0.85 },
        { delay: 470, opacity: 0.4 },
        { delay: 580, opacity: 1.0 },
      ];

      steps.forEach(({ delay, opacity }) => {
        setTimeout(() => {
          setFlickerOpacity(opacity);
        }, delay);
      });

      // Fully stabilized after flicker sequence
      setTimeout(() => {
        setFlickerOpacity(1);
        setBootPhase(2);
      }, 750);
    }, 450);

    return () => clearTimeout(timerIgnition);
  }, []);

  // Determine active colored shapes according to user request:
  // - Automatizace -> blue triangle pulses 100% -> 200% -> 100% + smaller triangle lights up
  // - Aplikace (fullstack) -> gold square pulses 100% -> 200% -> 100% + smaller square lights up
  // - Weby -> red circle pulses 100% -> 200% -> 100% + smaller circle lights up
  // - Outside these (uvod, etc.) -> all three lit at 100%
  const [hoveredShape, setHoveredShape] = useState<'triangle' | 'square' | 'circle' | null>(null);

  const isAutomation = activeSection === 'automatizace' || currentPage === 'automation' || hoveredShape === 'triangle';
  const isFullstack = activeSection === 'fullstack' || currentPage === 'fullstack' || hoveredShape === 'square';
  const isWebs = activeSection === 'weby' || currentPage === 'web-branding' || currentPage === 'webs' || hoveredShape === 'circle';

  const isSpecificSection = (activeSection === 'automatizace' || activeSection === 'fullstack' || activeSection === 'weby' ||
    currentPage === 'automation' || currentPage === 'fullstack' || currentPage === 'web-branding' || currentPage === 'webs' ||
    hoveredShape !== null);

  let triangleActive = true;
  let squareActive = true;
  let circleActive = true;

  if (bootPhase === 2) {
    if (isSpecificSection) {
      triangleActive = isAutomation;
      squareActive = isFullstack;
      circleActive = isWebs;
    } else {
      // Outside service sections: all three lit
      triangleActive = true;
      squareActive = true;
      circleActive = true;
    }
  }

  // Opacity for each shape during boot vs running
  const getShapeOpacity = (isActive: boolean) => {
    if (bootPhase === 0) return 0;
    if (bootPhase === 1) return flickerOpacity;
    return isActive ? 1 : 0;
  };

  const triangleOpacity = getShapeOpacity(triangleActive);
  const squareOpacity = getShapeOpacity(squareActive);
  const circleOpacity = getShapeOpacity(circleActive);

  // Kinetic pulse flags: normal shape expands from 100% to 200% and back to 100%
  // Smaller shape lights up in addition
  const isTrianglePulsing = bootPhase === 2 && isAutomation && triangleOpacity > 0;
  const isSquarePulsing = bootPhase === 2 && isFullstack && squareOpacity > 0;
  const isCirclePulsing = bootPhase === 2 && isWebs && circleOpacity > 0;

  // Interactive mouse move on logo box allows previewing all 3 shapes
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = x / rect.width;
    const normY = y / rect.height;

    // Triangle: top-left quadrant
    if (normX < 0.48 && normY < 0.6) {
      setHoveredShape('triangle');
    } else if (normX >= 0.48 && normY < 0.6) {
      // Circle: top-right quadrant
      setHoveredShape('circle');
    } else if (normY >= 0.5) {
      // Square: bottom area
      setHoveredShape('square');
    }
  };

  return (
    <div
      className={`relative w-14 h-14 sm:w-16 sm:h-16 bg-[#eeeeee] border-2 border-[#bebebe] flex items-center justify-center p-1.5 sm:p-2 shadow-xs transition-colors overflow-hidden group-hover:border-[#18181b] group-hover:bg-[#f6f6f6] shrink-0 cursor-pointer ${className}`}
      title="LoYo Interactive Dynamic Logo (Automatizace / Aplikace / Weby)"
      id="loyo-logo-box"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredShape(null)}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon emission filters tailored for light background */}
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#040b8d" floodOpacity="0.5" />
          </filter>
          <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#cda24d" floodOpacity="0.6" />
          </filter>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ac0001" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* ==================================================================== */}
        {/* BASE LAYER: NEBAREVNÉ LOGO - PERMANENTNĚ ZAPLÉ JAKO ZÁKLAD           */}
        {/* ==================================================================== */}
        <g
          id="base-uncolored-logo"
          stroke="#2f2f35"
          strokeWidth="14"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.82"
        >
          {/* Uncolored Triangle */}
          <line x1="18" y1="68" x2="46" y2="68" />
          <line x1="76" y1="68" x2="320" y2="68" />
          <line x1="320" y1="68" x2="166" y2="356" />
          <line x1="166" y1="356" x2="48" y2="120" />
          <line x1="37" y1="95" x2="18" y2="68" />

          {/* Uncolored Square */}
          <line x1="122" y1="216" x2="406" y2="216" />
          <line x1="122" y1="216" x2="122" y2="482" />
          <line x1="122" y1="482" x2="330" y2="482" />
          <line x1="362" y1="482" x2="406" y2="482" />
          <line x1="406" y1="216" x2="406" y2="422" />
          <line x1="406" y1="456" x2="406" y2="482" />

          {/* Uncolored Circle */}
          <path d="M 473.2 103.1 A 146 146 0 1 1 373.8 12.0" />
          <path d="M 417.6 32.0 A 146 146 0 0 1 444.5 55.3" />
        </g>

        {/* ==================================================================== */}
        {/* DYNAMIC COLORED LAYERS: SVÍTÍCÍ VRSTVY                                */}
        {/* ==================================================================== */}

        {/* 1. TROJÚHELNÍČEK: MODRÁ (Automatizace procesů) */}
        {/* A. Menší trojúhelníček (svítí navíc při najetí do animací / automatizací) */}
        <g
          id="triangle-blue-small"
          stroke="#040b8d"
          strokeWidth="13"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow-blue)"
          style={{
            opacity: isTrianglePulsing ? 1 : 0,
            transition: 'opacity 0.35s ease-in-out'
          }}
        >
          {/* Top horizontal stroke with gap before top-right corner from trjuhelnicekmensi.png */}
          <line x1="60" y1="110" x2="228" y2="110" />
          <line x1="254" y1="110" x2="274" y2="110" />
          {/* Right diagonal stroke with gap near top corner */}
          <line x1="274" y1="110" x2="260" y2="138" />
          <line x1="248" y1="160" x2="166" y2="314" />
          {/* Left diagonal stroke */}
          <line x1="166" y1="314" x2="82" y2="152" />
          <line x1="74" y1="136" x2="60" y2="110" />
        </g>

        {/* B. Normální trojúhelníček (zvětšuje se ze 100% na 200% a zase na 100%) */}
        <g
          id="triangle-blue"
          stroke="#040b8d"
          strokeWidth="14"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow-blue)"
          style={{
            transformOrigin: '166px 212px',
            animation: isTrianglePulsing ? 'loyo-scale-triangle-200 2.2s ease-in-out infinite' : 'none',
            opacity: triangleOpacity,
            transition: bootPhase === 1 ? 'none' : 'opacity 0.4s ease-in-out'
          }}
        >
          <line x1="18" y1="68" x2="46" y2="68" />
          <line x1="76" y1="68" x2="320" y2="68" />
          <line x1="320" y1="68" x2="166" y2="356" />
          <line x1="166" y1="356" x2="48" y2="120" />
          <line x1="37" y1="95" x2="18" y2="68" />
        </g>

        {/* 2. ČTVEREČEK: ZLATÁ (Aplikace fullstack) */}
        {/* A. Menší čtvereček (svítí navíc při najetí do aplikací) */}
        <g
          id="square-gold-small"
          stroke="#CDA24D"
          strokeWidth="13"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow-gold)"
          style={{
            opacity: isSquarePulsing ? 1 : 0,
            transition: 'opacity 0.35s ease-in-out'
          }}
        >
          {/* Top horizontal stroke with gap from ctverecekmensi.png */}
          <line x1="160" y1="252" x2="306" y2="252" />
          <line x1="334" y1="252" x2="368" y2="252" />
          {/* Right vertical stroke with corner tick and gap */}
          <line x1="368" y1="252" x2="368" y2="280" />
          <line x1="368" y1="306" x2="368" y2="446" />
          {/* Bottom horizontal stroke */}
          <line x1="160" y1="446" x2="368" y2="446" />
          {/* Left vertical stroke */}
          <line x1="160" y1="252" x2="160" y2="446" />
        </g>

        {/* B. Normální čtvereček (zvětšuje se ze 100% na 200% a zase na 100%) */}
        <g
          id="square-gold"
          stroke="#CDA24D"
          strokeWidth="14"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow-gold)"
          style={{
            transformOrigin: '264px 349px',
            animation: isSquarePulsing ? 'loyo-scale-square-200 2.2s ease-in-out infinite' : 'none',
            opacity: squareOpacity,
            transition: bootPhase === 1 ? 'none' : 'opacity 0.4s ease-in-out'
          }}
        >
          <line x1="122" y1="216" x2="406" y2="216" />
          <line x1="122" y1="216" x2="122" y2="482" />
          <line x1="122" y1="482" x2="330" y2="482" />
          <line x1="362" y1="482" x2="406" y2="482" />
          <line x1="406" y1="216" x2="406" y2="422" />
          <line x1="406" y1="456" x2="406" y2="482" />
        </g>

        {/* 3. KOLEČKO: ČERVENÁ (Tvorba webů) */}
        {/* A. Menší kolečko (svítí navíc při najetí do webů) */}
        <g
          id="circle-red-small"
          stroke="#ac0001"
          strokeWidth="13"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow-red)"
          style={{
            opacity: isCirclePulsing ? 1 : 0,
            transition: 'opacity 0.35s ease-in-out'
          }}
        >
          {/* Nested circle with gap from koleckomensi.png */}
          <path d="M 444.0 113.3 A 114 114 0 1 1 366.4 42.4" />
          <path d="M 400.6 58.0 A 114 114 0 0 1 421.6 76.2" />
        </g>

        {/* B. Normální kolečko (zvětšuje se ze 100% na 200% a zase na 100%) */}
        <g
          id="circle-red"
          stroke="#ac0001"
          strokeWidth="14"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#glow-red)"
          style={{
            transformOrigin: '340px 150px',
            animation: isCirclePulsing ? 'loyo-scale-circle-200 2.2s ease-in-out infinite' : 'none',
            opacity: circleOpacity,
            transition: bootPhase === 1 ? 'none' : 'opacity 0.4s ease-in-out'
          }}
        >
          <path d="M 473.2 103.1 A 146 146 0 1 1 373.8 12.0" />
          <path d="M 417.6 32.0 A 146 146 0 0 1 444.5 55.3" />
        </g>
      </svg>
    </div>
  );
};
