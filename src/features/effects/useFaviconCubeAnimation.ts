import { useEffect, useRef } from 'react';

const FACES = [
  { bg: '#040b8d', text: 'L', glow: '#2a3cff' },
  { bg: '#CDA24D', text: 'o', glow: '#ffcc66' },
  { bg: '#ac0001', text: 'Y', glow: '#ff3333' },
  { bg: '#2E2E2E', text: 'o', glow: '#ffffff' },
];

export function useFaviconCubeAnimation(enabled = true, intervalMs = 900) {
  const frameRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]') || (() => {
      const l = document.createElement('link');
      l.rel = 'icon';
      l.type = 'image/png';
      document.head.appendChild(l);
      return l;
    })();

    const drawFace = (faceIdx: number) => {
      const face = FACES[faceIdx % FACES.length];
      ctx.clearRect(0, 0, 32, 32);
      ctx.fillStyle = face.bg;
      ctx.fillRect(2, 2, 28, 28);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(2, 2, 28, 28);
      ctx.fillStyle = 'white';
      ctx.font = '900 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = face.glow;
      ctx.shadowBlur = 6;
      ctx.fillText(face.text, 16, 16);
      ctx.shadowBlur = 0;
      try { link.href = canvas.toDataURL('image/png'); } catch {}
    };

    const animate = () => {
      if (document.hidden) return;
      drawFace(frameRef.current % FACES.length);
      frameRef.current = (frameRef.current + 1) % FACES.length;
    };

    drawFace(0);
    timerRef.current = window.setInterval(animate, intervalMs) as unknown as number;

    const onVisibility = () => {
      if (!document.hidden) drawFace(frameRef.current % FACES.length);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, intervalMs]);
}
