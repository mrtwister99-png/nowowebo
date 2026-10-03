import React from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  COLOR_FALLING,
  COLOR_RED,
  CUBE_SIZE,
  GAP,
  STEP,
} from './constants';
import type { FallingPiece, FlashingLines, FloatingScore, Particle, SettledCube } from './types';

interface BoardProps {
  activeMinCol: number;
  activeMaxCol: number;
  settledCubes: SettledCube[];
  flashingLines: FlashingLines | null;
  fallingPiece: FallingPiece | null;
  particles: Particle[];
  floatingScores: FloatingScore[];
}

/* Hrací plocha: červené hranice aktivních sloupců, dopadlé kostičky, padající dílek, částice a body */
export const Board: React.FC<BoardProps> = ({
  activeMinCol,
  activeMaxCol,
  settledCubes,
  flashingLines,
  fallingPiece,
  particles,
  floatingScores,
}) => (
  <div
    className="relative flex justify-center items-end"
    style={{
      width: `${BOARD_WIDTH}px`,
      height: `${BOARD_HEIGHT}px`,
    }}
  >
    {/* RED BOUNDARY LINES */}
    <div
      className="absolute top-0 bottom-0 w-0.625 bg-loyo-red shadow-[0_0_8px_rgba(172,0,1,0.8)] z-20 pointer-events-none transition-all duration-500"
      style={{
        left: `${activeMinCol * STEP - 1}px`,
      }}
    />

    <div
      className="absolute top-0 bottom-0 w-0.625 bg-loyo-red shadow-[0_0_8px_rgba(172,0,1,0.8)] z-20 pointer-events-none transition-all duration-500"
      style={{
        left: `${(activeMaxCol + 1) * STEP - GAP + 1}px`,
      }}
    />

    {/* SETTLED CUBES (černé po dopadu, při propojení řádku poblikávají barvou COLOR_FALLING) */}
    {settledCubes.map((cube) => {
      const left = cube.col * STEP;
      const bottom = cube.row * STEP;
      const isFlashing =
        flashingLines && flashingLines.rows.includes(cube.row) && flashingLines.flashOn;

      return (
        <div
          key={cube.id}
          className={`absolute rounded-[3.5px] border-2 border-loyo-ink transition-all duration-75 ${
            cube.isRedAlert ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${CUBE_SIZE}px`,
            height: `${CUBE_SIZE}px`,
            left: `${left}px`,
            bottom: `${bottom}px`,
            backgroundColor: isFlashing ? COLOR_FALLING : cube.color,
            boxShadow: isFlashing
              ? `0 0 12px ${COLOR_FALLING}, 2px 2px 0px #18181b`
              : '2px 2px 0px #18181b',
          }}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-[2px] ${
              isFlashing ? 'bg-white' : 'bg-white/20'
            }`}
          />
        </div>
      );
    })}

    {/* ACTIVE FALLING PIECE */}
    {fallingPiece && (
      <>
        {fallingPiece.isBomb ? (
          <div
            className="absolute rounded-full border-2 border-loyo-ink z-30 pointer-events-none shadow-brutal-2 animate-pulse"
            style={{
              width: `${CUBE_SIZE}px`,
              height: `${CUBE_SIZE}px`,
              left: `${fallingPiece.col * STEP}px`,
              top: `${fallingPiece.y}px`,
              backgroundColor: COLOR_RED,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-[9px] text-white">
              💣
            </div>
          </div>
        ) : (
          fallingPiece.cells.map(([dx, dy], idx) => {
            const cellLeft = (fallingPiece.col + dx) * STEP;
            const cellTop = fallingPiece.y + dy * STEP;

            return (
              <div
                key={`fp-${idx}`}
                className="absolute rounded-[3.5px] border-2 border-loyo-ink shadow-brutal-2 z-30 pointer-events-none"
                style={{
                  width: `${CUBE_SIZE}px`,
                  height: `${CUBE_SIZE}px`,
                  left: `${cellLeft}px`,
                  top: `${cellTop}px`,
                  backgroundColor: fallingPiece.color,
                  boxShadow: '2px 2px 0px #18181b',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40 rounded-t-[2px]" />
              </div>
            );
          })
        )}
      </>
    )}

    {/* EXPLOSION PARTICLES */}
    {particles.map((p) => (
      <div
        key={p.id}
        className="absolute rounded-full pointer-events-none z-40"
        style={{
          left: `${p.x}px`,
          top: `${p.y}px`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          opacity: p.opacity,
          boxShadow: `0 0 6px ${p.color}`,
        }}
      />
    ))}

    {/* FLOATING SCORES (+X) */}
    {floatingScores.map((fs) => (
      <div
        key={fs.id}
        className="absolute font-heading font-black text-xs sm:text-sm z-50 pointer-events-none animate-bounce"
        style={{
          left: `${fs.x}px`,
          top: `${fs.y}px`,
          color: fs.color,
          textShadow: '0 0 4px #000, 1px 1px 0px #000',
        }}
      >
        {fs.text}
      </div>
    ))}
  </div>
);
