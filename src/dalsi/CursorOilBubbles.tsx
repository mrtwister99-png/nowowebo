import React, { useEffect, useRef } from 'react';
import { CursorParticleMode } from '../types';

interface BubbleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  color: string;
  glowRgb: string;
  alpha: number;
  life: number;
  maxLife: number;
  wobble: number;
  wobbleSpeed: number;
}

interface CursorOilBubblesProps {
  mode?: CursorParticleMode;
}

export const CursorOilBubbles: React.FC<CursorOilBubblesProps> = ({ mode = 'none' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // If bubbles are turned off, don't run canvas or listeners
    if (mode !== 'bubbles') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // BUBBLES STATE - ONLY THE 3 BRAND COLORS (Blue, Gold, Red)
    const bubbles: BubbleParticle[] = [];
    let lastX = -100;
    let lastY = -100;
    let colorIdx = 0;
    let animId: number | null = null;

    const brandColors = [
      { color: '#040b8d', glowRgb: '4, 11, 141' },
      { color: '#CDA24D', glowRgb: '205, 162, 77' },
      { color: '#ac0001', glowRgb: '172, 0, 1' },
    ];

    // Spawn rich bubble trail on mouse move (flying in from left and right towards behind the cursor)
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (lastX === -100) {
        lastX = currentX;
        lastY = currentY;
        return;
      }

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        // Spawn 2 to 4 bubbles per movement tick for a dense, vibrant trail
        const countToSpawn = Math.min(5, Math.max(2, Math.floor(dist / 5)));

        for (let i = 0; i < countToSpawn; i++) {
          const chosen = brandColors[colorIdx % brandColors.length];
          colorIdx++;

          // Alternating / fluttering offsets from left and right
          const side = (i % 2 === 0 ? 1 : -1) * (1 + Math.random() * 1.5);
          const lateralSpread = (Math.random() * 22 + 8) * side;
          const startX = currentX + lateralSpread;
          const startY = currentY + (Math.random() - 0.5) * 16;

          // Inward velocity towards cursor trail + upward floating lift
          const inwardVx = -side * (0.8 + Math.random() * 1.8) + (Math.random() - 0.5) * 0.8;
          const upwardVy = -0.4 - Math.random() * 1.6 + (Math.random() - 0.5) * 0.6;

          const targetRadius =
            Math.random() < 0.25
              ? Math.random() * 7 + 10 // Large bubbles (10-17px)
              : Math.random() * 5 + 3.5; // Medium/small bubbles (3.5-8.5px)

          bubbles.push({
            x: startX,
            y: startY,
            vx: inwardVx,
            vy: upwardVy,
            radius: 1.5,
            targetRadius,
            color: chosen.color,
            glowRgb: chosen.glowRgb,
            alpha: 0.96,
            life: 0,
            maxLife: 45 + Math.floor(Math.random() * 35),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.08 + Math.random() * 0.08,
          });
        }

        // Keep maximum trail length generous but performant
        if (bubbles.length > 180) {
          bubbles.splice(0, bubbles.length - 180);
        }

        lastX = currentX;
        lastY = currentY;
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render bubble particles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.life++;

        if (b.life >= b.maxLife) {
          bubbles.splice(i, 1);
          continue;
        }

        b.vx *= 0.96;
        b.vy *= 0.96;
        b.vy -= 0.025; // Gentle upward buoyancy

        b.x += b.vx;
        b.y += b.vy;

        if (b.radius < b.targetRadius) {
          b.radius += (b.targetRadius - b.radius) * 0.22;
        }

        b.wobble += b.wobbleSpeed;
        const currentRadius = Math.max(1, b.radius + Math.sin(b.wobble) * (b.radius * 0.14));

        const progress = b.life / b.maxLife;
        const fadeFactor = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.4);
        const currentAlpha = Math.max(0, fadeFactor * 0.94);

        ctx.save();

        // Radial gradient body
        const grad = ctx.createRadialGradient(
          b.x - currentRadius * 0.35,
          b.y - currentRadius * 0.35,
          currentRadius * 0.15,
          b.x,
          b.y,
          currentRadius,
        );
        grad.addColorStop(0, `rgba(${b.glowRgb}, ${currentAlpha * 0.95})`);
        grad.addColorStop(0.7, `rgba(${b.glowRgb}, ${currentAlpha * 0.65})`);
        grad.addColorStop(1, `rgba(${b.glowRgb}, ${currentAlpha * 0.9})`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Surface tension outline
        ctx.strokeStyle = `rgba(${b.glowRgb}, ${currentAlpha * 0.95})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Specular white highlight glare
        const glareRadius = Math.max(1, currentRadius * 0.26);
        ctx.beginPath();
        ctx.arc(
          b.x - currentRadius * 0.35,
          b.y - currentRadius * 0.35,
          glareRadius,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.88})`;
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mode]);

  if (mode !== 'bubbles') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-40 select-none"
    />
  );
};
