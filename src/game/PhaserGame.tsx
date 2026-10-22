import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import type { Difficulty } from '../domain/types';
import type { QuestionInteraction } from '../domain/progress';

interface PhaserGameProps {
  difficulty: Difficulty;
  onInteraction: (event: QuestionInteraction) => void;
  onComplete: () => void;
}

export function PhaserGame({ difficulty, onComplete, onInteraction }: PhaserGameProps) {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainer.current) return;
    let active = true;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current,
      // Renderiza em dobro, mantendo coordenadas lógicas 960 × 540 na cena.
      width: 1920,
      height: 1080,
      backgroundColor: '#dff5ff',
      scene: [new MainScene({
        difficulty,
        onComplete: () => { if (active) onComplete(); },
        onInteraction: (event) => { if (active) onInteraction(event); },
      })],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: { antialias: true, transparent: false },
      input: { activePointers: 2 },
    });

    return () => {
      active = false;
      game.destroy(true);
    };
  }, [difficulty, onComplete, onInteraction]);

  return <div ref={gameContainer} className="game-shell" />;
}
