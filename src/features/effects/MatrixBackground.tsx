import React, { useEffect, useRef } from 'react';

/**
 * Zlatý matrix déšť (LoYo OS — Royal Dark).
 *
 * Pravidla:
 * - Kapky se neobjevují uprostřed obrazovky: vždy přiletí shora (začínají nad horním okrajem).
 * - Kapka padá dolů, hlava (svítí víc, má záři) je VESPOD, ocas se nad ní vytrácí.
 * - Každá kapka se zastaví na jedné z výšek STOP_LEVELS (85 %, 90 %, 95 %, 100 %, 105 % výšky okna).
 * - Po zastavení z ní odspodu (od hlavy) ubývají znaky, dokud nezmizí celá; pak přiletí nová shora.
 * - Každý sloupec mění své znaky vlastním tempem (CHANGE_MIN_MS až CHANGE_MAX_MS).
 * - Glitch kolem kurzoru má menší dosah (GLITCH_RADIUS).
 *
 * Rychlost: znaky (i se září hlavy) se předkreslí jednou do atlasu a pak se jen kopírují (drawImage).
 * Telefon: řidší sloupce, rozlišení 1x, 30 FPS, bez efektů navíc (duchové, jiskřičky).
 */

const GLYPHS = ['■', '□', '▪', '▫', '▬', '▭', '▮', '▯', '░', '▒', '▓', '█', '▄', '▀', '▌', '▐', '◼', '◻', '◾', '◽'];
const GLITCH_GLYPHS = ['■', '◼', '█', '▓', '◾'].map((g) => GLYPHS.indexOf(g)); // indexy do GLYPHS

const BG_COLOR = '#2b2b2b'; // POZADÍ
// ZLATÁ: ocas jde od světlejší zlaté (u hlavy) do tmavší (konec ocasu)
const TAIL_NEAR_COLOR = '#e6bd45';
const TAIL_FAR_COLOR = '#8a6a1a';
const HEAD_COLOR = '#ffd95a'; // hlava: jasná zlatá
const HEAD_GLOW_COLOR = '#ffb800'; // záře kolem hlavy
const HEAD_BLINK_COLOR = '#fff3c4'; // hlava občas probleskne skoro do bílé
const HEAD_BLINK_MIN_MS = 700;
const HEAD_BLINK_MAX_MS = 1800;

// Výšky, na kterých se kapky zastaví (podíl výšky okna)
const STOP_LEVELS = [0.85, 0.9, 0.95, 1.0, 1.05];
// Jak rychle po zastavení ubývají znaky (ms na jeden znak)
const DRAIN_MIN_MS = 45;
const DRAIN_MAX_MS = 110;
// Každý sloupec mění znaky svým tempem (interval mezi změnami)
const CHANGE_MIN_MS = 70;
const CHANGE_MAX_MS = 520;
const CHANGE_SHARE = 0.3; // kolik znaků ocasu se při jedné změně vymění (hlava vždy)

// Občasný záblesk hlavy (každý sloupec jednou za 10 s, šance 44,22 %)
const GLITCH_HEAD_COLOR = '#fffbe8';
const GLITCH_HEAD_EVERY_MS = 10000;
const GLITCH_HEAD_CHANCE = 0.4422;
const GLITCH_HEAD_MS = 700;

// Sloupec, kterým projde kurzor, bliká jantarově; mezery se zkracují, až zůstane jantarový
const HIT_COLOR = '#ff9f1a';
const HIT_BLINK_MS = 160;
const HIT_FIRST_GAP_MS = 900;
const HIT_GAP_FACTOR = 0.7;
const HIT_MIN_GAP_MS = 80;
const HIT_HEAD_COLOR = '#fff1a0';
const HIT_HEAD_MAX_MS = 7880;
const HIT_HEAD_MS = 400;

const HIT_BLINK_STARTS: number[] = (() => {
  const starts = [0];
  let gap = HIT_FIRST_GAP_MS;
  while (gap >= HIT_MIN_GAP_MS) {
    starts.push(starts[starts.length - 1] + HIT_BLINK_MS + gap);
    gap *= HIT_GAP_FACTOR;
  }
  return starts;
})();
const hitIsOn = (elapsed: number): boolean => {
  if (elapsed >= HIT_BLINK_STARTS[HIT_BLINK_STARTS.length - 1]) return true;
  return HIT_BLINK_STARTS.some((start) => elapsed >= start && elapsed < start + HIT_BLINK_MS);
};

const SPEED = 1;
const GLITCH = true;
const LAYER_OPACITY = 1;
const SITE_BG_FALLBACK: RGB = [43, 43, 43];

const ANGLE = (-7.77 * Math.PI) / 180; // náklon
const SCALE = 1.12;
const COL_GAP = 18; // rozteč sloupců (počítač)
const COL_GAP_MOBILE = 30; // telefon: řidší sloupce
const GLITCH_RADIUS = 100; // dosah glitche kolem kurzoru (počítač)
const GLITCH_RADIUS_MOBILE = 55; // telefon
const GLITCH_AMP_MOBILE = 0.5;
const MOBILE_FPS = 30;
const ROW_H = 20;
const FONT_PX = 14;
const BUCKETS = 24; // počet odstínů ocasu
const ROW_HEAD = BUCKETS;
const ROW_GLITCH = BUCKETS + 1;
const ROW_HIT_HEAD_GLITCH = BUCKETS + 2;
const ROW_HIT = BUCKETS + 3;
const ROW_HIT_BIG = BUCKETS + 4;
const ROW_HEAD_BLINK = BUCKETS + 5;
const ATLAS_ROWS = BUCKETS + 6;
const FONT_FAMILY = '"Geist Mono", "IBM Plex Mono", monospace';

type RGB = [number, number, number];

interface Column {
  x: number;
  headY: number; // poloha hlavy ve scéně (kladné = dolů)
  stopY: number; // kde se hlava zastaví
  speed: number;
  maxLen: number; // délka při vzniku (pro odstíny ocasu)
  glyphs: number[]; // [0] = hlava (vespod), dál nahoru ocas
  draining: boolean;
  drainMs: number;
  drainT: number;
  changeMs: number;
  changeT: number;
  phase: number;
  glitchAt: number;
  glitchUntil: number;
  hitStart: number;
  hitHeadAt: number;
  hitHeadUntil: number;
  blinkSpeed: number;
}

const randomGlyph = () => Math.floor(Math.random() * GLYPHS.length);
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const toCss = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => v + (b[i] - v) * t) as RGB;

const parseHex = (hex: string): RGB | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (h: string): RGB => parseHex(h) ?? [255, 215, 90];

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches; // telefon / tablet
    const colGap = coarse ? COL_GAP_MOBILE : COL_GAP;
    const glitchR = coarse ? GLITCH_RADIUS_MOBILE : GLITCH_RADIUS;
    const glitchAmp = coarse ? GLITCH_AMP_MOBILE : 1;
    const hitHalfWidth = Math.min(colGap / 2, 11);
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = reducedQuery.matches;

    // ---------- barvy ----------
    const siteBg =
      parseHex(getComputedStyle(document.documentElement).getPropertyValue('--color-loyo-bg')) ??
      SITE_BG_FALLBACK;
    const bake = (c: RGB): RGB =>
      c.map((v, i) => LAYER_OPACITY * v + (1 - LAYER_OPACITY) * siteBg[i]) as RGB;

    const bgCss = toCss(bake(hex(BG_COLOR)));
    const headCss = toCss(bake(hex(HEAD_COLOR)));
    const headBlinkCss = toCss(bake(hex(HEAD_BLINK_COLOR)));
    const glowCss = toCss(hex(HEAD_GLOW_COLOR));
    const glitchHeadCss = toCss(hex(GLITCH_HEAD_COLOR));
    const hitCss = toCss(hex(HIT_COLOR));
    const hitHeadCss = toCss(hex(HIT_HEAD_COLOR));
    const near = hex(TAIL_NEAR_COLOR);
    const far = hex(TAIL_FAR_COLOR);
    const bucketCss: string[] = Array.from({ length: BUCKETS }, (_, i) =>
      toCss(bake(mix(near, far, i / (BUCKETS - 1)))),
    );

    // ---------- stav ----------
    let rs = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0; // výška canvasu (na telefonu s rezervou)
    let V = 0; // viditelná výška okna (od ní se počítají STOP_LEVELS)
    let hx = 0;
    let hy = 0;
    let lastW = 0;
    let lastInnerH = 0;
    let columns: Column[] = [];
    const atlas = document.createElement('canvas');
    let cell = 0;
    let spriteSize = 0;

    let time = 0;
    let last = performance.now();
    let frameInterval = coarse ? 1000 / MOBILE_FPS : 0;
    let frames = 0;
    let slow = 0;
    let shown = false;
    let raf = 0;
    let resizeTimer = 0;
    const mouse = { x: -1000, y: -1000, active: false };

    const cosA = Math.cos(ANGLE);
    const sinA = Math.sin(ANGLE);

    // y ve scéně (pro sloupec na x), který se na obrazovce zobrazí ve výšce screenY
    const sceneY = (x: number, screenY: number) => ((screenY - H / 2) / SCALE - x * sinA) / cosA;

    // ---------- atlas znaků ----------
    const buildAtlas = () => {
      const ds = rs * SCALE;
      const font = FONT_PX * ds;
      cell = Math.ceil(font * 2.4) + 4; // místo i pro záři hlavy
      spriteSize = cell / ds;
      atlas.width = GLYPHS.length * cell;
      atlas.height = ATLAS_ROWS * cell;
      const a = atlas.getContext('2d');
      if (!a) return;
      a.textAlign = 'center';
      a.textBaseline = 'middle';
      for (let row = 0; row < ATLAS_ROWS; row++) {
        const isHead = row >= BUCKETS && row !== ROW_HIT;
        const glows = row === ROW_HEAD || row === ROW_HEAD_BLINK || row === ROW_HIT_BIG;
        a.font = `${isHead ? font * 1.18 : font}px ${FONT_FAMILY}`;
        a.fillStyle =
          row < BUCKETS
            ? bucketCss[row]
            : row === ROW_GLITCH
              ? glitchHeadCss
              : row === ROW_HIT_HEAD_GLITCH
                ? hitHeadCss
                : row === ROW_HIT || row === ROW_HIT_BIG
                  ? hitCss
                  : row === ROW_HEAD_BLINK
                    ? headBlinkCss
                    : headCss;
        for (let g = 0; g < GLYPHS.length; g++) {
          const cx = g * cell + cell / 2;
          const cy = row * cell + cell / 2;
          if (glows) {
            // záře hlavy: dvakrát přes sebe = výraznější svit
            a.shadowColor = row === ROW_HIT_BIG ? hitCss : glowCss;
            a.shadowBlur = font * 0.9;
            a.fillText(GLYPHS[g], cx, cy);
            a.shadowBlur = font * 0.4;
            a.fillText(GLYPHS[g], cx, cy);
            a.shadowBlur = 0;
          } else {
            a.fillText(GLYPHS[g], cx, cy);
          }
        }
      }
    };

    // kapka přiletí shora; initial = první naplnění (víc rozprostřené, ať nepřiletí všechny naráz)
    const spawn = (col: Column, initial: boolean) => {
      const len = 8 + Math.floor(Math.random() * 18) + (Math.random() < 0.15 ? 12 : 0);
      const level = STOP_LEVELS[Math.floor(Math.random() * STOP_LEVELS.length)];
      col.maxLen = len;
      col.glyphs = Array.from({ length: len }, randomGlyph);
      col.stopY = sceneY(col.x, level * V);
      col.draining = false;
      col.drainT = 0;
      col.hitStart = -1;
      col.speed = rand(1.2, 3.6);
      col.drainMs = rand(DRAIN_MIN_MS, DRAIN_MAX_MS);
      col.changeMs = rand(CHANGE_MIN_MS, CHANGE_MAX_MS);
      if (initial && reduced) {
        // statický snímek: kapky rovnou rozmístěné na obrazovce
        col.headY = sceneY(col.x, rand(0.15, level) * V);
      } else {
        // hlava nad horním okrajem (i s ocasem) + náhodné zpoždění
        const startScreen = -ROW_H - (initial ? rand(0, V * 0.9) : rand(0, V * 0.5));
        col.headY = sceneY(col.x, startScreen);
      }
    };

    const newColumn = (x: number): Column => {
      const col: Column = {
        x,
        headY: 0,
        stopY: 0,
        speed: 1,
        maxLen: 1,
        glyphs: [],
        draining: false,
        drainMs: 80,
        drainT: 0,
        changeMs: 200,
        changeT: Math.random() * CHANGE_MAX_MS,
        phase: Math.random() * Math.PI * 2,
        glitchAt: time + Math.random() * GLITCH_HEAD_EVERY_MS,
        glitchUntil: 0,
        hitStart: -1,
        hitHeadAt: 0,
        hitHeadUntil: 0,
        blinkSpeed: (2 * Math.PI) / rand(HEAD_BLINK_MIN_MS, HEAD_BLINK_MAX_MS),
      };
      spawn(col, true);
      return col;
    };

    const setup = () => {
      lastW = window.innerWidth;
      lastInnerH = window.innerHeight;
      W = lastW;
      V = lastInnerH;
      H = coarse ? Math.round(lastInnerH * 1.15) : lastInnerH;
      canvas.width = Math.round(W * rs);
      canvas.height = Math.round(H * rs);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      hx = ((W / 2) * Math.abs(cosA) + (H / 2) * Math.abs(sinA)) / SCALE + 20;
      hy = ((W / 2) * Math.abs(sinA) + (H / 2) * Math.abs(cosA)) / SCALE + 20;

      buildAtlas();
      const count = Math.ceil((2 * hx) / colGap) + 2;
      columns = Array.from({ length: count }, (_, i) =>
        newColumn(-hx + i * colGap + (Math.random() * 4 - 2)),
      );
    };

    // pomalý běh (počítač): nejdřív nižší rozlišení, pak 30 FPS
    const degrade = () => {
      frames = 0;
      slow = 0;
      if (rs > 1.01) {
        rs = Math.max(1, rs - 0.25);
        setup();
      } else {
        frameInterval = 1000 / 30;
      }
    };

    const frame = (now: number) => {
      if (!reduced) raf = requestAnimationFrame(frame);
      const dt = now - last;
      if (dt < frameInterval - 2) return;
      last = now;

      if (frameInterval === 0 && dt < 500) {
        frames++;
        if (frames > 90) {
          slow = dt > 26 ? slow + 1 : Math.max(0, slow - 1);
          if (slow >= 40) degrade();
        }
      }

      const ms = Math.min(dt, 100);
      const step = ms / 16.667;
      time += ms;

      ctx.setTransform(rs, 0, 0, rs, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = bgCss;
      ctx.fillRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2);
      ctx.rotate(ANGLE);
      ctx.scale(SCALE, SCALE);

      const glitchOn = GLITCH && mouse.active;
      let mx = 0;
      let my = 0;
      if (glitchOn) {
        const dx = (mouse.x - W / 2) / SCALE;
        const dy = (mouse.y - H / 2) / SCALE;
        mx = dx * cosA + dy * sinA;
        my = -dx * sinA + dy * cosA;
      }

      const top = -hy - ROW_H;
      const bottom = hy + ROW_H;
      const half = spriteSize / 2;

      for (const col of columns) {
        // ---- pohyb / zastavení / ubývání ----
        if (!reduced) {
          if (!col.draining) {
            col.headY += col.speed * SPEED * 1.2 * step;
            if (col.headY >= col.stopY) {
              col.headY = col.stopY;
              col.draining = true;
              col.drainT = 0;
            }
          } else {
            col.drainT += ms;
            while (col.drainT >= col.drainMs && col.glyphs.length > 0) {
              col.drainT -= col.drainMs;
              col.glyphs.shift(); // ubude spodní znak (hlava), nad ním je nová hlava
              col.headY -= ROW_H;
            }
            if (col.glyphs.length === 0) spawn(col, false);
          }

          // ---- vlastní tempo změny znaků ----
          col.changeT += ms;
          if (col.changeT >= col.changeMs) {
            col.changeT = 0;
            const g = col.glyphs;
            if (g.length) g[0] = randomGlyph();
            for (let i = 1; i < g.length; i++) if (Math.random() < CHANGE_SHARE) g[i] = randomGlyph();
          }
        }

        if (time >= col.glitchAt) {
          if (Math.random() < GLITCH_HEAD_CHANCE) col.glitchUntil = time + GLITCH_HEAD_MS;
          col.glitchAt = time + GLITCH_HEAD_EVERY_MS;
        }
        if (col.hitStart >= 0 && time >= col.hitHeadAt) {
          col.hitHeadUntil = time + HIT_HEAD_MS;
          col.hitHeadAt = time + Math.random() * HIT_HEAD_MAX_MS;
        }

        const len = col.glyphs.length;
        if (!len) continue;
        // celá kapka mimo obrazovku -> nic nekreslit
        if (col.headY < top || col.headY - (len - 1) * ROW_H > bottom) continue;

        const nearCol = glitchOn && Math.abs(col.x - mx) < glitchR + 30;
        const headWhite = Math.sin(time * col.blinkSpeed + col.phase) > 0.35;
        const hitOn = col.hitStart >= 0 && hitIsOn(time - col.hitStart);

        for (let q = 0; q < len; q++) {
          const y = col.headY - q * ROW_H; // hlava vespod, ocas nad ní
          if (y < top || y > bottom) continue;

          const t = Math.min(1, q / col.maxLen);
          let fade = 1 - t * 0.85;
          let dist = 0;
          let offX = 0;
          let offY = 0;

          if (nearCol) {
            const d = Math.hypot(col.x - mx, y - my);
            if (d < glitchR) {
              dist = 1 - d / glitchR;
              offX =
                (Math.sin(y * 0.045 + time * 0.008 + col.phase) * dist * 14 +
                  (Math.random() - 0.5) * dist * 10) *
                glitchAmp;
              offY = Math.cos(y * 0.03 + time * 0.012) * dist * 3 * glitchAmp;
              if (Math.random() < dist * 0.25) {
                col.glyphs[q] =
                  Math.random() < 0.7
                    ? GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)]
                    : randomGlyph();
              }
              fade = fade * (0.6 + Math.random() * 0.7) + dist * 0.3;
            }
            if (col.hitStart < 0 && Math.abs(col.x - mx) < hitHalfWidth && Math.abs(y - my) < ROW_H * 0.6) {
              col.hitStart = time;
              col.hitHeadAt = time + Math.random() * HIT_HEAD_MAX_MS;
            }
          }

          const isHead = q === 0;
          const alpha = isHead ? 1 : Math.max(0.08, Math.min(1, fade));
          const bucket = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
          const sx = col.glyphs[q] * cell;
          const hitGlitch = isHead && col.hitStart >= 0 && time < col.hitHeadUntil;
          const flash = isHead && !hitGlitch && time < col.glitchUntil;
          const glitchRow = hitGlitch ? ROW_HIT_HEAD_GLITCH : ROW_GLITCH;
          const gx = col.x + offX + (flash || hitGlitch ? (Math.random() - 0.5) * 6 : 0) - half;
          const gy = y + offY - half;

          if (!coarse && (flash || hitGlitch)) {
            ctx.globalAlpha = alpha * 0.4;
            ctx.drawImage(atlas, sx, glitchRow * cell, cell, cell, gx + (Math.random() < 0.5 ? 4 : -4), gy, spriteSize, spriteSize);
          }
          if (!coarse && dist > 0.4) {
            ctx.globalAlpha = alpha * 0.18 * dist;
            ctx.drawImage(atlas, sx, bucket * cell, cell, cell, gx + 3 * (dist > 0.7 ? 1 : -1), gy, spriteSize, spriteSize);
          }
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            atlas,
            sx,
            (flash || hitGlitch
              ? glitchRow
              : hitOn
                ? isHead
                  ? ROW_HIT_BIG
                  : ROW_HIT
                : isHead
                  ? headWhite
                    ? ROW_HEAD_BLINK
                    : ROW_HEAD
                  : bucket) * cell,
            cell,
            cell,
            gx,
            gy,
            spriteSize,
            spriteSize,
          );
          if (!coarse && dist > 0.5 && q % 3 === 0) {
            ctx.globalAlpha = 0.06 * dist;
            ctx.fillStyle = isHead ? headCss : bucketCss[bucket];
            ctx.fillRect(gx + half - 1, gy + half, 2, 2);
          }
        }
      }
      ctx.globalAlpha = 1;

      if (!shown) {
        shown = true;
        canvas.style.visibility = 'visible';
      }
    };

    // ---------- události ----------
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
    };
    const onTouchEnd = () => {
      mouse.active = false;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const h = window.innerHeight;
        const heightChanged = coarse ? Math.abs(h - lastInnerH) > lastInnerH * 0.2 : h !== lastInnerH;
        if (window.innerWidth !== lastW || heightChanged) {
          setup();
          if (reduced) frame(performance.now());
        }
      }, 150);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    const startLoop = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onReducedChange = () => {
      reduced = reducedQuery.matches;
      if (reduced) {
        cancelAnimationFrame(raf);
        frame(performance.now());
      } else if (!document.hidden) {
        startLoop();
      }
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) startLoop();
    };
    reducedQuery.addEventListener('change', onReducedChange);
    document.addEventListener('visibilitychange', onVisibility);

    setup();
    last = performance.now();
    if (reduced) frame(last + 16);
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      reducedQuery.removeEventListener('change', onReducedChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-loyo-bg select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 block"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
};
