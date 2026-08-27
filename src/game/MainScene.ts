import Phaser from 'phaser';

const QUESTION = 'Qual animal é maior?';
const SPOKEN_INSTRUCTION = 'Qual animal é maior? Toque nele.';

interface MainSceneOptions {
  onComplete: (attempts: number) => void;
}

/** Primeira atividade do nível fácil: comparação de tamanho por toque. */
export class MainScene extends Phaser.Scene {
  private readonly onComplete: (attempts: number) => void;
  private attempts = 0;
  private answered = false;

  constructor({ onComplete }: MainSceneOptions) {
    super('MainScene');
    this.onComplete = onComplete;
  }

  preload() {
    this.load.spritesheet(
      'elephant-idle',
      '/assets/animals/elephant/elephant_idle.png',
      { frameWidth: 572, frameHeight: 501 },
    );
    this.load.spritesheet(
      'elephant-happy',
      '/assets/animals/elephant/elephant_happy.png',
      // A folha mantém quatro células; somente as três primeiras têm desenho.
      { frameWidth: 552, frameHeight: 541 },
    );
    this.load.spritesheet('cat-idle', '/assets/animals/cat/cat_idle.png', {
      frameWidth: 565,
      frameHeight: 550,
    });
    this.load.spritesheet('cat-think', '/assets/animals/cat/cat_think.png', {
      // A folha mantém quatro células; somente as três primeiras têm desenho.
      frameWidth: 540,
      frameHeight: 554,
    });
  }

  create() {
    this.attempts = 0;
    this.answered = false;
    this.createAnimations();
    this.createBackground();
    this.createInstruction();

    const elephant = this.add
      .sprite(655, 465, 'elephant-idle')
      .setOrigin(0.5, 1)
      .setScale(0.55)
      .setInteractive({ useHandCursor: true })
      .play('elephant-idle-animation');

    const cat = this.add
      .sprite(286, 466, 'cat-idle')
      .setOrigin(0.5, 1)
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .play('cat-idle-animation');

    this.addNameTag(286, 477, 'GATO', 0xf59e0b);
    this.addNameTag(655, 477, 'ELEFANTE', 0x60a5fa);

    this.addChoiceGlow(cat, 0xfbbf24);
    this.addChoiceGlow(elephant, 0x60a5fa);

    cat.on('pointerdown', () => this.chooseCat(cat));
    elephant.on('pointerdown', () => this.chooseElephant(elephant, cat));

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.speechSynthesis?.cancel();
    });
  }

  private createAnimations() {
    this.anims.create({
      key: 'elephant-idle-animation',
      frames: this.anims.generateFrameNumbers('elephant-idle', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: 'elephant-happy-animation',
      frames: this.anims.generateFrameNumbers('elephant-happy', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'cat-idle-animation',
      frames: this.anims.generateFrameNumbers('cat-idle', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: 'cat-think-animation',
      frames: this.anims.generateFrameNumbers('cat-think', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
  }

  private createBackground() {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();

    graphics.fillGradientStyle(0xdff5ff, 0xdff5ff, 0xf2fbff, 0xf2fbff);
    graphics.fillRect(0, 0, width, height);
    graphics.fillStyle(0xffdf70, 0.9).fillCircle(865, 68, 42);
    graphics.fillStyle(0xffffff, 0.8);
    this.drawCloud(graphics, 92, 84, 0.8);
    this.drawCloud(graphics, 780, 145, 0.65);
    graphics.fillStyle(0xb9e6a5).fillEllipse(180, 505, 580, 180);
    graphics.fillStyle(0x92d58c).fillEllipse(735, 510, 720, 210);
    graphics.fillStyle(0x76c878).fillRect(0, 460, width, height - 460);

    for (let x = 20; x < width; x += 54) {
      graphics.fillStyle(x % 108 === 20 ? 0xffffff : 0xfde68a, 0.85);
      graphics.fillCircle(x, 493 + (x % 3) * 5, 5);
      graphics.fillStyle(0x4d9c52, 0.7).fillRect(x - 1, 497, 2, 10);
    }
  }

  private drawCloud(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    scale: number,
  ) {
    graphics.fillCircle(x, y, 30 * scale);
    graphics.fillCircle(x + 34 * scale, y - 10 * scale, 38 * scale);
    graphics.fillCircle(x + 74 * scale, y, 29 * scale);
    graphics.fillRoundedRect(x - 4 * scale, y, 83 * scale, 25 * scale, 12 * scale);
  }

  private createInstruction() {
    this.add
      .rectangle(480, 83, 700, 112, 0xffffff, 0.94)
      .setStrokeStyle(4, 0xc4b5fd)
      .setOrigin(0.5);

    this.add
      .text(480, 61, QUESTION, {
        color: '#4338ca',
        fontFamily: 'Nunito, system-ui, sans-serif',
        fontSize: '34px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(480, 103, 'TOQUE NO ANIMAL MAIOR', {
        color: '#64748b',
        fontFamily: 'Nunito, system-ui, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    const audioButton = this.add
      .circle(875, 83, 43, 0x7c3aed)
      .setStrokeStyle(5, 0xddd6fe)
      .setInteractive({ useHandCursor: true });
    const audioIcon = this.add
      .text(875, 83, '🔊', { fontSize: '31px' })
      .setOrigin(0.5);

    const speak = () => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(SPOKEN_INSTRUCTION);
      speech.lang = 'pt-BR';
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
      this.tweens.add({
        targets: [audioButton, audioIcon],
        scale: 1.12,
        duration: 140,
        yoyo: true,
      });
    };

    audioButton.on('pointerdown', speak);
    audioIcon.setInteractive({ useHandCursor: true }).on('pointerdown', speak);
  }

  private addChoiceGlow(sprite: Phaser.GameObjects.Sprite, color: number) {
    const shadow = this.add
      .ellipse(sprite.x, 454, sprite.displayWidth * 0.75, 30, color, 0.2)
      .setDepth(0);
    sprite.setDepth(2);
    this.tweens.add({
      targets: shadow,
      scaleX: 1.08,
      alpha: 0.4,
      duration: 900,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private addNameTag(x: number, y: number, label: string, color: number) {
    this.add
      .rectangle(x, y, label === 'ELEFANTE' ? 144 : 104, 38, 0xffffff, 0.96)
      .setStrokeStyle(3, color)
      .setDepth(4);
    this.add
      .text(x, y, label, {
        color: '#334155',
        fontFamily: 'Nunito, system-ui, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(5);
  }

  private chooseCat(cat: Phaser.GameObjects.Sprite) {
    if (this.answered) return;
    this.attempts += 1;
    cat.disableInteractive().play('cat-think-animation');

    const hint = this.add
      .text(cat.x, 216, 'OLHE DE NOVO! 😊', {
        color: '#9a3412',
        backgroundColor: '#fff7ed',
        fontFamily: 'Nunito, system-ui, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        padding: { x: 15, y: 9 },
      })
      .setOrigin(0.5)
      .setDepth(8);

    this.tweens.add({
      targets: cat,
      x: { from: cat.x - 7, to: cat.x + 7 },
      duration: 70,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        cat.setX(286).play('cat-idle-animation').setInteractive({ useHandCursor: true });
        this.time.delayedCall(650, () => hint.destroy());
      },
    });
  }

  private chooseElephant(
    elephant: Phaser.GameObjects.Sprite,
    cat: Phaser.GameObjects.Sprite,
  ) {
    if (this.answered) return;
    this.answered = true;
    this.attempts += 1;
    elephant.disableInteractive().play('elephant-happy-animation');
    cat.disableInteractive();

    this.tweens.add({
      targets: elephant,
      y: 445,
      scale: 0.59,
      duration: 260,
      ease: 'Back.out',
      yoyo: true,
    });
    this.showSuccess();
    this.time.delayedCall(1800, () => this.onComplete(this.attempts));
  }

  private showSuccess() {
    const success = this.add
      .text(480, 188, 'MUITO BEM! 🎉', {
        color: '#166534',
        backgroundColor: '#dcfce7',
        fontFamily: 'Nunito, system-ui, sans-serif',
        fontSize: '29px',
        fontStyle: 'bold',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setScale(0.4)
      .setDepth(10);

    this.tweens.add({ targets: success, scale: 1, duration: 320, ease: 'Back.out' });

    const colors = [0xf97316, 0xeab308, 0x22c55e, 0x3b82f6, 0xa855f7];
    for (let i = 0; i < 32; i += 1) {
      const piece = this.add
        .rectangle(
          Phaser.Math.Between(280, 680),
          Phaser.Math.Between(160, 230),
          8,
          14,
          Phaser.Utils.Array.GetRandom(colors),
        )
        .setAngle(Phaser.Math.Between(0, 180))
        .setDepth(9);
      this.tweens.add({
        targets: piece,
        y: Phaser.Math.Between(380, 530),
        x: piece.x + Phaser.Math.Between(-120, 120),
        angle: piece.angle + Phaser.Math.Between(180, 540),
        alpha: 0,
        duration: Phaser.Math.Between(900, 1450),
        ease: 'Quad.in',
        onComplete: () => piece.destroy(),
      });
    }
  }
}
