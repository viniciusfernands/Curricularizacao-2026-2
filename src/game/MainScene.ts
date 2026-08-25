import Phaser from 'phaser'

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, 72, 'Phaser 4 funcionando!', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, 116, 'Clique para mover o círculo', {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
      })
      .setOrigin(0.5)

    const player = this.add
      .circle(width / 2, height / 2, 38, 0x8b5cf6)
      .setStrokeStyle(6, 0xc4b5fd)

    this.tweens.add({
      targets: player,
      scale: 1.12,
      duration: 700,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.tweens.add({
        targets: player,
        x: pointer.x,
        y: pointer.y,
        duration: 350,
        ease: 'Back.out',
      })
    })
  }
}
