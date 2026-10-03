import React, { useState, useCallback } from 'react';

interface Props {
  className?: string;
  perspective?: number;
  size?: number; // base size 300
  showInfo?: boolean;
}

export const ZakladniKostkaLoyo90: React.FC<Props> = ({ className = '', perspective = 1400, size = 300, showInfo = true }) => {
  const [rot, setRot] = useState(0);

  const handleLeft = useCallback(() => {
    setRot((r) => r - 90);
  }, []);

  const handleRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setRot((r) => r + 90);
  }, []);

  const half = size / 2;

  return (
    <div className={`zakl-kostka-root ${className}`}>
      <style>{`
        .zakl-kostka-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          -webkit-user-select: none;
        }
        .zakl-scene {
          width: ${size + 200}px;
          height: ${size + 200}px;
          perspective: ${perspective}px;
          perspective-origin: 50% 45%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .zakl-cube-wrapper {
          width: ${size}px;
          height: ${size}px;
          transform-style: preserve-3d;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }
        .zakl-cube {
          width: ${size}px;
          height: ${size}px;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(-18deg) rotateY(var(--rot));
          transition: transform 0.6s cubic-bezier(0.68,-0.55,0.27,1.55);
          will-change: transform;
        }
        .zakl-face {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border: 4px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: ${size * 0.28}px;
          color: white;
          background: var(--bg);
          line-height: 1;
          backface-visibility: hidden;
          text-shadow: 0 0 12px var(--glow), 0 0 28px var(--glow);
          user-select: none;
        }
        .zakl-face-front { --bg: #040b8d; --glow: #2a3cff; transform: translateZ(${half}px); }
        .zakl-face-right { --bg: #CDA24D; --glow: #ffcc66; transform: rotateY(90deg) translateZ(${half}px); }
        .zakl-face-back { --bg: #ac0001; --glow: #ff3333; transform: rotateY(180deg) translateZ(${half}px); }
        .zakl-face-left { --bg: #2E2E2E; --glow: #ffffff; transform: rotateY(-90deg) translateZ(${half}px); }
        .zakl-face-top { --bg: #E5E5E5; --glow: #ffffff; transform: rotateX(90deg) translateZ(${half}px); color: transparent; }
        .zakl-face-bottom { --bg: #E5E5E5; --glow: #ffffff; transform: rotateX(-90deg) translateZ(${half}px); color: transparent; }
        .zakl-info {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }
        .zakl-info-rot {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #111;
          background: white;
          border: 2px solid black;
          padding: 6px 14px;
          line-height: 1;
        }
        .zakl-info-help {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b6b6b;
        }
        @media (max-width: 640px) {
          .zakl-scene { width: 320px; height: 320px; perspective: 900px; }
          .zakl-cube-wrapper { width: 200px; height: 200px; }
          .zakl-cube { width: 200px; height: 200px; }
          .zakl-face { width: 200px; height: 200px; font-size: 56px; border-width: 3px; }
          .zakl-face-front { transform: translateZ(100px); }
          .zakl-face-right { transform: rotateY(90deg) translateZ(100px); }
          .zakl-face-back { transform: rotateY(180deg) translateZ(100px); }
          .zakl-face-left { transform: rotateY(-90deg) translateZ(100px); }
          .zakl-face-top { transform: rotateX(90deg) translateZ(100px); }
          .zakl-face-bottom { transform: rotateX(-90deg) translateZ(100px); }
        }
      `}</style>

      <div className="zakl-scene" onContextMenu={(e) => e.preventDefault()}>
        <div
          className="zakl-cube-wrapper"
          style={{ ['--rot' as any]: `${rot}deg` }}
          onClick={handleLeft}
          onContextMenu={handleRight}
          role="button"
          aria-label="LOYO kostka"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setRot((r) => r - 90); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setRot((r) => r + 90); }
          }}
        >
          <div className="zakl-cube">
            <div className="zakl-face zakl-face-front">L</div>
            <div className="zakl-face zakl-face-right">o</div>
            <div className="zakl-face zakl-face-back">Y</div>
            <div className="zakl-face zakl-face-left">o</div>
            <div className="zakl-face zakl-face-top"></div>
            <div className="zakl-face zakl-face-bottom"></div>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="zakl-info">
          <div className="zakl-info-rot">rot: {rot}°</div>
          <div className="zakl-info-help">LEVÝ = -90° | PRAVÝ = +90°</div>
        </div>
      )}
    </div>
  );
};
