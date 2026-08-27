import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';

interface PhaserGameProps {
  onComplete: (attempts: number) => void;
}

export function PhaserGame({ onComplete }: PhaserGameProps) {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainer.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 960,
      height: 540,
      backgroundColor: '#dff5ff',
      scene: [new MainScene({ onComplete })],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: { antialias: true, transparent: false },
      input: { activePointers: 2 },
    });

    return () => {
      game.destroy(true);
    };
  }, [onComplete]);

  return <div ref={gameContainer} className="game-shell" />;
}
