import React from 'react';
import { Board } from './Board';
import { BottomRightControls } from './BottomRightControls';
import { CountdownOverlay } from './CountdownOverlay';
import { DemoOverlay } from './DemoOverlay';
import { HighScoresModal } from './HighScoresModal';
import { LeaderboardOverlay } from './LeaderboardOverlay';
import { NameEntryOverlay } from './NameEntryOverlay';
import { TimerBadge } from './TimerBadge';
import { BOARD_HEIGHT, FIELD_TOP_SPACE } from './constants';
import { useCubesGame } from './useCubesGame';

/*
 * Minihra v mezeře hlavičky: padající kostičky, které se skládají do řádků.
 * Stav a pravidla jsou v useCubesGame, tady je jen skládání obrazovek podle stavu hry.
 */
export const MiniFallingCubesInGap: React.FC = () => {
  const game = useCubesGame();
  const { gameState, info } = game;

  return (
    <div
      className={`relative w-full overflow-visible select-none flex flex-col justify-end items-center transition-colors duration-200 ${
        game.flashBoard ? 'bg-amber-400/15' : 'bg-transparent'
      }`}
      style={{ marginBottom: '0px', minHeight: `${BOARD_HEIGHT + FIELD_TOP_SPACE}px` }}
    >
      {gameState === 'demo' && (
        <DemoOverlay
          infoPhase={info.infoPhase}
          finishedCount={game.finishedCount}
          showHighScoresModal={game.showHighScoresModal}
          onToggleHighScores={() => game.setShowHighScoresModal((prev) => !prev)}
          onStart={game.startGame}
        />
      )}

      {gameState === 'playing' && <TimerBadge timeLeft={game.timeLeft} />}

      {game.showHighScoresModal && gameState === 'demo' && (
        <HighScoresModal
          highScores={game.highScores}
          onClose={() => game.setShowHighScoresModal(false)}
        />
      )}

      <BottomRightControls
        gameState={gameState}
        infoPhase={info.infoPhase}
        setIsHovered={info.setIsHovered}
      />

      {gameState === 'countdown' && <CountdownOverlay countdown={game.countdown} />}

      {gameState === 'name_entry' && (
        <NameEntryOverlay
          score={game.score}
          endReason={game.endReason}
          inputInitials={game.inputInitials}
          activeSlot={game.activeSlot}
          textInputRef={game.textInputRef}
          setInputInitials={game.setInputInitials}
          setActiveSlot={game.setActiveSlot}
          submitInitials={game.submitInitials}
          returnToDemo={game.returnToDemo}
        />
      )}

      {gameState === 'post_leaderboard' && (
        <LeaderboardOverlay
          highScores={game.highScores}
          inputInitials={game.inputInitials}
          returnToDemo={game.returnToDemo}
        />
      )}

      <Board
        activeMinCol={game.activeMinCol}
        activeMaxCol={game.activeMaxCol}
        settledCubes={game.settledCubes}
        flashingLines={game.flashingLines}
        fallingPiece={game.fallingPiece}
        looseParts={game.looseParts}
        particles={game.particles}
        floatingScores={game.floatingScores}
      />
    </div>
  );
};
