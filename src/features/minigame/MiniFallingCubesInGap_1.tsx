import React from 'react';
import { Board } from './Board';
import { BottomRightControls } from './BottomRightControls';
import { CountdownOverlay } from './CountdownOverlay';
import { DemoOverlay } from './DemoOverlay';
import { HighScoresModal } from './HighScoresModal';
import { LeaderboardOverlay } from './LeaderboardOverlay';
import { NameEntryOverlay } from './NameEntryOverlay';
import { TimerBadge } from './TimerBadge';
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
      className={`relative w-full h-27.5 sm:h-30 overflow-visible select-none flex flex-col justify-end items-center transition-colors duration-200 ${
        game.flashBoard ? 'bg-amber-400/15' : 'bg-transparent'
      }`}
      style={{ marginBottom: '0px' }}
    >
      {gameState === 'demo' && (
        <DemoOverlay
          infoPhase={info.infoPhase}
          typedChars={info.typedChars}
          loadProgress={info.loadProgress}
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
        bombCooldown={game.bombCooldown}
        setIsHovered={info.setIsHovered}
        triggerBomb={game.triggerBomb}
        moveHorizontal={game.moveHorizontal}
        dropFast={game.dropFast}
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
        particles={game.particles}
        floatingScores={game.floatingScores}
      />
    </div>
  );
};
