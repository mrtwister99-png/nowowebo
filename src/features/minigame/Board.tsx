import React from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  COLOR_BLUE,
  COLOR_FALLING,
  COLOR_RED,
  CUBE_SIZE,
  FIELD_TOP_SPACE,
  STEP,
  WALL_WIDTH,
} from './constants';
import type { FallingPiece, FlashingLines, FloatingScore, Particle, SettledCube } from './types';

interface BoardProps {
  activeMinCol: number;
  activeMaxCol: number;
  settledCubes: SettledCube[];
  flashingLines: FlashingLines | null;
  fallingPiece: FallingPiece | null;
  looseParts: FallingPiece[];
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
  looseParts,
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
    {/* ZDI: tmavě červené, od podlahy až úplně nahoru, těsně za aktivními sloupci; s rozšířením pole se posunou */}
    <div
      className="absolute bottom-0 bg-loyo-red border-2 border-loyo-ink rounded-t-sm z-10 pointer-events-none transition-all duration-500"
      style={{
        width: `${WALL_WIDTH}px`,
        height: `${BOARD_HEIGHT + FIELD_TOP_SPACE}px`,
        left: `${activeMinCol * STEP - WALL_WIDTH - 1}px`,
      }}
      aria-hidden="true"
    />
    <div
      className="absolute bottom-0 bg-loyo-red border-2 border-loyo-ink rounded-t-sm z-10 pointer-events-none transition-all duration-500"
      style={{
        width: `${WALL_WIDTH}px`,
        height: `${BOARD_HEIGHT + FIELD_TOP_SPACE}px`,
        left: `${activeMaxCol * STEP + CUBE_SIZE + 1}px`,
      }}
      aria-hidden="true"
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
          className={`absolute rounded-xs border border-loyo-ink transition-all duration-75 ${
            cube.isRedAlert ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${CUBE_SIZE}px`,
            height: `${CUBE_SIZE}px`,
            left: `${left}px`,
            bottom: `${bottom}px`,
            backgroundColor: isFlashing ? COLOR_FALLING : cube.color,
            boxShadow: isFlashing
              ? `0 0 8px ${COLOR_FALLING}, 1px 1px 0px #18181b`
              : '1px 1px 0px #18181b',
          }}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-px rounded-t-[1px] ${
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
            className="absolute rounded-full border border-loyo-ink z-30 pointer-events-none shadow-brutal-1 animate-pulse"
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
                className="absolute rounded-xs border border-loyo-ink shadow-brutal-1 z-30 pointer-events-none"
                style={{
                  width: `${CUBE_SIZE}px`,
                  height: `${CUBE_SIZE}px`,
                  left: `${cellLeft}px`,
                  top: `${cellTop}px`,
                  backgroundColor: fallingPiece.color,
                  boxShadow: '1px 1px 0px #18181b',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-white/40 rounded-t-[1px]" />
              </div>
            );
          })
        )}
      </>
    )}

    {/* ODPADLÉ ČÁSTI: sloupce dílku, které přečnívaly, padají dál samy (stejnou rychlostí) */}
    {looseParts.flatMap((part, partIdx) =>
      part.cells.map(([, dy], idx) => (
        <div
          key={`lp-${partIdx}-${idx}`}
          className="absolute rounded-xs border border-loyo-ink shadow-brutal-1 z-30 pointer-events-none"
          style={{
            width: `${CUBE_SIZE}px`,
            height: `${CUBE_SIZE}px`,
            left: `${part.col * STEP}px`,
            top: `${part.y + dy * STEP}px`,
            backgroundColor: part.color,
            boxShadow: '1px 1px 0px #18181b',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-white/40 rounded-t-[1px]" />
        </div>
      )),
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
        className="absolute font-heading font-black text-sm sm:text-lg whitespace-nowrap -translate-x-1/2 z-50 pointer-events-none"
        style={{
          left: `${fs.x}px`,
          top: `${fs.y}px`,
          color: fs.color,
          // Modrý text má bílý obrys (čitelný i přes černé kostičky), ostatní barvy tmavý stín
          ...(fs.color === COLOR_BLUE
            ? { WebkitTextStroke: '4px #fff', paintOrder: 'stroke fill' }
            : { textShadow: '0 0 4px #000, 1px 1px 0px #000' }),
        }}
      >
        {fs.text}
      </div>
    ))}
  </div>
);
