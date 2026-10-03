import React, { useState } from 'react';

interface Props {
  size?: number;
  perspective?: number;
  showInfo?: boolean;
  className?: string;
}

// Obycejna kostka z prilohy - levy -90, pravy +90, cista bez kolecka
export const ZakladniKostkaLoyo90: React.FC<Props> = ({ size = 88, perspective = 700, showInfo = false, className = '' }) => {
  const [rotation, setRotation] = useState(0); // 0: L, 1: o, 2: Y, 3: o
  const faces = [
    { bg: '#040b8d', text: 'L', glow: '#2a3cff' },
    { bg: '#CDA24D', text: 'o', glow: '#ffcc66' },
    { bg: '#ac0001', text: 'Y', glow: '#ff3333' },
    { bg: '#2E2E2E', text: 'o', glow: '#ffffff' },
  ];
  const current = faces[((rotation % 4) + 4) % 4];

  const rotateLeft = () => setRotation(r => r - 1);
  const rotateRight = () => setRotation(r => r + 1);

  return (
    <div className={`relative select-none ${className}`} style={{ width: size, height: size, perspective: `${perspective}px` }}>
      <div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s cubic-bezier(0.2,0.9,0.3,1)', transform: `rotateY(${rotation * 90}deg)` }}
        onClick={rotateLeft}
        onContextMenu={(e) => { e.preventDefault(); rotateRight(); }}
        title="Levy klik -90°, pravy +90°"
      >
        {faces.map((face, idx) => (
          <div
            key={idx}
            className="absolute inset-0 flex items-center justify-center font-black text-white border-[3px] border-black"
            style={{
              background: face.bg,
              transform: `rotateY(${idx * 90}deg) translateZ(${size / 2}px)`,
              boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 20px ${face.glow}40`,
              backfaceVisibility: 'hidden',
            }}
          >
            <span style={{ fontSize: size * 0.45, textShadow: `0 0 12px ${face.glow}` }}>{face.text}</span>
          </div>
        ))}
      </div>
      {showInfo && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap opacity-60">{current.bg} • {rotation * 90}°</div>}
    </div>
  );
};

export default ZakladniKostkaLoyo90;
