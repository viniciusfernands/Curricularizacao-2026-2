import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { MainScene } from './MainScene'

export function PhaserGame() {
  const gameContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gameContainer.current) return

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 960,
      height: 540,
      backgroundColor: '#0f172a',
      scene: [MainScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    })

    return () => {
      game.destroy(true)
    }
  }, [])

  return <div ref={gameContainer} className="game-shell" />
}
