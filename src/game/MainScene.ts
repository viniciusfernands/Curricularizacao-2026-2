import Phaser from 'phaser';
import type { Difficulty } from '../domain/types';
import { questionsFor, type GameQuestion } from './questions';

interface MainSceneOptions {
  difficulty: Difficulty;
  onComplete: (attempts: number) => void;
}

type DisplayObject = Phaser.GameObjects.Text | Phaser.GameObjects.Shape | Phaser.GameObjects.Sprite;

export class MainScene extends Phaser.Scene {
  private readonly onComplete: (attempts: number) => void;
  private readonly questions: GameQuestion[];
  private questionIndex = 0;
  private attempts = 0;
  private locked = false;
  private questionObjects: Phaser.GameObjects.GameObject[] = [];

  constructor({ difficulty, onComplete }: MainSceneOptions) {
    super('MainScene');
    this.onComplete = onComplete;
    this.questions = questionsFor(difficulty);
  }

  preload() {
    this.load.spritesheet('cat-idle', '/assets/animals/cat/cat_idle.png', { frameWidth: 565, frameHeight: 550 });
    this.load.spritesheet('cat-walk', '/assets/animals/cat/cat_walk.png', { frameWidth: 572, frameHeight: 539 });
    this.load.spritesheet('cat-happy', '/assets/animals/cat/cat_happy.png', { frameWidth: 502, frameHeight: 537 });
    this.load.spritesheet('cat-think', '/assets/animals/cat/cat_think.png', { frameWidth: 540, frameHeight: 554 });
  }

  create() {
    this.anims.create({ key: 'cat-idle-animation', frames: this.anims.generateFrameNumbers('cat-idle', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
    this.anims.create({ key: 'cat-walk-animation', frames: this.anims.generateFrameNumbers('cat-walk', { start: 0, end: 3 }), frameRate: 7, repeat: -1 });
    this.anims.create({ key: 'cat-happy-animation', frames: this.anims.generateFrameNumbers('cat-happy', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'cat-think-animation', frames: this.anims.generateFrameNumbers('cat-think', { start: 0, end: 2 }), frameRate: 5, repeat: -1 });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => window.speechSynthesis?.cancel());
    this.showQuestion();
  }

  private keep<T extends Phaser.GameObjects.GameObject>(object: T): T {
    this.questionObjects.push(object);
    return object;
  }

  private showQuestion() {
    this.questionObjects.forEach((object) => object.destroy());
    this.questionObjects = [];
    this.locked = false;
    const question = this.questions[this.questionIndex];
    if (!question) {
      this.onComplete(this.attempts);
      return;
    }

    this.createBackground();
    this.createHeader(question);
    switch (question.kind) {
      case 'cat-in-box': this.catInBox(); break;
      case 'apple-count': this.countIntoTarget('🍎', 5, 3, 'CESTA', 0xf59e0b); break;
      case 'blue-choice': this.choiceRow(['AZUL', 'VERMELHO', 'AMARELO', 'VERDE'], 0, [0x3b82f6, 0xef4444, 0xfacc15, 0x22c55e]); break;
      case 'letter-a': this.choiceRow(['A', 'B', 'O'], 0); break;
      case 'syllable-two': this.choiceRow(['●', '● ●', '● ● ●'], 1); break;
      case 'different-shape': this.shapeDifference(); break;
      case 'ball-under-table': this.ballUnderTable(); break;
      case 'star-count': this.countIntoTarget('★', 7, 5, 'CAIXA', 0x8b5cf6); break;
      case 'two-colors': this.colorSorting([0xef4444, 0x3b82f6], 3); break;
      case 'initial-sound': this.choiceRow(['🍎\nMAÇÃ', '⚽\nBOLA', '🐸\nSAPO'], 0); break;
      case 'initial-letter': this.dragLetters(['B', 'D', 'P'], ['B']); break;
      case 'alternating-sequence': this.sequenceChoice(); break;
      case 'ball-order': this.ballOrder(); break;
      case 'three-colors': this.colorSorting([0xef4444, 0x3b82f6, 0xfacc15], 2); break;
      case 'syllable-three': this.countIntoTarget('★', 5, 3, 'FAIXA', 0x8b5cf6); break;
      case 'word-sol': this.dragLetters(['L', 'S', 'O'], ['S', 'O', 'L']); break;
      case 'memory': this.memoryGame(); break;
      case 'house-choice': this.choiceRow(['🏠\nCASA', '🚗\nCARRO', '🌳\nÁRVORE'], 0); break;
      case 'aab-sequence': this.aabSequence(); break;
    }
  }

  private createBackground() {
    const graphics = this.keep(this.add.graphics());
    graphics.fillGradientStyle(0xdff5ff, 0xdff5ff, 0xf5fbff, 0xf5fbff).fillRect(0, 0, 960, 540);
    graphics.fillStyle(0xffdf70, 0.9).fillCircle(882, 65, 38);
    graphics.fillStyle(0xb9e6a5).fillEllipse(190, 525, 600, 150);
    graphics.fillStyle(0x8bd18a).fillEllipse(750, 525, 760, 180);
    graphics.fillStyle(0x72c978).fillRect(0, 480, 960, 60);
  }

  private createHeader(question: GameQuestion) {
    this.keep(this.add.rectangle(480, 72, 720, 104, 0xffffff, 0.95).setStrokeStyle(4, 0xc4b5fd));
    this.keep(this.add.text(480, 55, question.title, this.textStyle(31, '#4338ca')).setOrigin(0.5));
    this.keep(this.add.text(480, 92, question.instruction.toUpperCase(), this.textStyle(15, '#64748b')).setOrigin(0.5));
    this.keep(this.add.text(55, 48, question.id, this.textStyle(17, '#7c3aed')).setOrigin(0.5));
    this.keep(this.add.text(55, 75, `${this.questionIndex + 1}/${this.questions.length}`, this.textStyle(15, '#64748b')).setOrigin(0.5));
    const button = this.keep(this.add.circle(888, 72, 38, 0x7c3aed).setStrokeStyle(4, 0xddd6fe).setInteractive({ useHandCursor: true }));
    const icon = this.keep(this.add.text(888, 72, '🔊', { fontSize: '28px' }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    const speak = () => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.instruction);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      this.tweens.add({ targets: [button, icon], scale: 1.12, duration: 140, yoyo: true });
    };
    button.on('pointerdown', speak);
    icon.on('pointerdown', speak);
    this.time.delayedCall(350, speak);
  }

  private textStyle(size: number, color = '#334155'): Phaser.Types.GameObjects.Text.TextStyle {
    return { color, fontFamily: 'Nunito, system-ui, sans-serif', fontSize: `${size}px`, fontStyle: 'bold', align: 'center' };
  }

  private choiceRow(labels: string[], correct: number, colors?: number[]) {
    const gap = Math.min(205, 750 / labels.length);
    const start = 480 - ((labels.length - 1) * gap) / 2;
    labels.forEach((label, index) => {
      const x = start + index * gap;
      const card = this.keep(this.add.rectangle(x, 315, Math.min(170, gap - 18), 155, colors?.[index] ?? 0xffffff, colors ? 1 : 0.96).setStrokeStyle(5, colors ? 0xffffff : 0x93c5fd).setInteractive({ useHandCursor: true }));
      const text = this.keep(this.add.text(x, 315, label, this.textStyle(labels.length === 4 ? 20 : 38, colors ? '#ffffff' : '#334155')).setOrigin(0.5).setInteractive({ useHandCursor: true }));
      const choose = () => index === correct ? this.success([card, text]) : this.failure([card, text]);
      card.on('pointerdown', choose);
      text.on('pointerdown', choose);
      this.float(card);
    });
  }

  private shapeDifference() {
    [210, 390, 570, 750].forEach((x, index) => {
      const shape = index === 2
        ? this.keep(this.add.star(x, 315, 5, 35, 72, 0xfacc15).setInteractive({ useHandCursor: true }))
        : this.keep(this.add.circle(x, 315, 58, 0xfacc15).setInteractive({ useHandCursor: true }));
      shape.on('pointerdown', () => index === 2 ? this.success([shape]) : this.failure([shape]));
      this.float(shape);
    });
  }

  private makeDropItem(object: DisplayObject, target: Phaser.Geom.Rectangle, onDrop: (inside: boolean) => boolean) {
    const home = { x: object.x, y: object.y };
    object.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(object);
    object.on('drag', (_pointer: Phaser.Input.Pointer, x: number, y: number) => object.setPosition(x, y));
    object.on('dragend', () => {
      const inside = Phaser.Geom.Rectangle.Contains(target, object.x, object.y);
      const accepted = onDrop(inside);
      if (!inside || !accepted) this.tweens.add({ targets: object, x: home.x, y: home.y, duration: 260, ease: 'Back.out' });
    });
  }

  private catInBox() {
    const box = new Phaser.Geom.Rectangle(610, 260, 240, 175);
    const graphics = this.keep(this.add.graphics());
    graphics.fillStyle(0xd6a568).fillRect(610, 260, 240, 175).lineStyle(8, 0x9a6735).strokeRect(610, 260, 240, 175);
    this.keep(this.add.text(730, 450, 'CAIXA', this.textStyle(18)).setOrigin(0.5));
    const cat = this.keep(this.add.sprite(245, 420, 'cat-idle').setScale(0.34).play('cat-idle-animation'));
    this.makeDropItem(cat, box, (inside) => {
      if (inside) {
        cat.play('cat-happy-animation');
        this.success([cat]);
        return true;
      } else {
        cat.play('cat-think-animation');
        this.failure([cat]);
        this.time.delayedCall(700, () => cat.active && cat.play('cat-idle-animation'));
        return false;
      }
    });
    cat.on('dragstart', () => cat.play('cat-walk-animation'));
  }

  private countIntoTarget(symbol: string, total: number, expected: number, label: string, color: number) {
    const target = new Phaser.Geom.Rectangle(585, 235, 285, 210);
    const zone = this.keep(this.add.rectangle(727, 340, 285, 210, 0xffffff, 0.75).setStrokeStyle(6, color));
    this.keep(this.add.text(727, 455, label, this.textStyle(18)).setOrigin(0.5));
    let count = 0;
    for (let index = 0; index < total; index += 1) {
      const item = this.keep(this.add.text(125 + (index % 3) * 115, 245 + Math.floor(index / 3) * 105, symbol, { fontSize: '58px' }).setOrigin(0.5));
      this.makeDropItem(item, target, (inside) => {
        if (!inside) { this.failure([item]); return false; }
        item.disableInteractive().setAlpha(0.88);
        count += 1;
        this.tweens.add({ targets: item, scale: 0.75, duration: 180 });
        if (count === expected) this.success([zone]);
        return true;
      });
    }
  }

  private ballUnderTable() {
    const target = new Phaser.Geom.Rectangle(555, 320, 260, 145);
    const graphics = this.keep(this.add.graphics());
    graphics.fillStyle(0x9a6735).fillRoundedRect(535, 245, 300, 35, 8).fillRect(560, 275, 25, 190).fillRect(785, 275, 25, 190);
    const ball = this.keep(this.add.circle(225, 340, 55, 0xef4444).setStrokeStyle(7, 0xffffff));
    this.makeDropItem(ball, target, (inside) => {
      if (inside) this.success([ball]); else this.failure([ball]);
      return inside;
    });
  }

  private colorSorting(colors: number[], each: number) {
    const targetWidth = colors.length === 2 ? 290 : 220;
    const gap = colors.length === 2 ? 390 : 275;
    const targets = colors.map((_color, index) => new Phaser.Geom.Rectangle(140 + index * gap, 350, targetWidth, 110));
    colors.forEach((color, index) => this.keep(this.add.rectangle(targets[index].centerX, targets[index].centerY, targets[index].width, targets[index].height, color, 0.25).setStrokeStyle(5, color)));
    let correct = 0;
    const items = colors.flatMap((color, colorIndex) => Array.from({ length: each }, (_, itemIndex) => ({ color, colorIndex, itemIndex })));
    items.forEach((item, index) => {
      const x = 145 + index * (670 / (items.length - 1));
      const object = this.keep(item.itemIndex % 2 === 0 ? this.add.circle(x, 220, 31, item.color) : this.add.star(x, 220, 5, 18, 38, item.color));
      this.makeDropItem(object, targets[item.colorIndex], (inside) => {
        if (!inside) { this.failure([object]); return false; }
        object.disableInteractive();
        correct += 1;
        this.tweens.add({ targets: object, scale: 0.7, duration: 180 });
        if (correct === items.length) this.success([object]);
        return true;
      });
    });
  }

  private dragLetters(letters: string[], answer: string[]) {
    const slots = answer.map((_letter, index) => new Phaser.Geom.Rectangle(480 - (answer.length * 100) / 2 + index * 100, 340, 82, 92));
    const targetArea = new Phaser.Geom.Rectangle(slots[0].x, slots[0].y, slots.at(-1)!.right - slots[0].x, 92);
    slots.forEach((slot) => this.keep(this.add.rectangle(slot.centerX, slot.centerY, slot.width, slot.height, 0xffffff, 0.8).setStrokeStyle(4, 0x8b5cf6)));
    let placed = 0;
    letters.forEach((letter, index) => {
      const object = this.keep(this.add.text(310 + index * 170, 205, letter, this.textStyle(54, '#4338ca')).setOrigin(0.5));
      this.makeDropItem(object, targetArea, () => {
        const slotIndex = slots.findIndex((slot) => Phaser.Geom.Rectangle.Contains(slot, object.x, object.y));
        if (slotIndex < 0 || answer[slotIndex] !== letter) { this.failure([object]); return false; }
        object.setPosition(slots[slotIndex].centerX, slots[slotIndex].centerY).disableInteractive();
        placed += 1;
        if (placed === answer.length) this.success([object]);
        return true;
      });
    });
    this.keep(this.add.text(480, 465, answer.length === 1 ? '⚽  BOLA' : '☀️', this.textStyle(27)).setOrigin(0.5));
  }

  private sequenceChoice() {
    [0xef4444, 0x3b82f6, 0xef4444, 0x3b82f6, 0xef4444].forEach((color, index) => this.keep(this.add.circle(225 + index * 105, 220, 30, color)));
    this.keep(this.add.rectangle(750, 220, 68, 68, 0xffffff, 0.6).setStrokeStyle(4, 0x94a3b8));
    [0x3b82f6, 0xfacc15, 0xef4444].forEach((color, index) => {
      const shape = index === 2 ? this.keep(this.add.rectangle(610 + index * 110, 365, 60, 60, color).setInteractive({ useHandCursor: true })) : this.keep(this.add.circle(610 + index * 110, 365, 30, color).setInteractive({ useHandCursor: true }));
      shape.on('pointerdown', () => index === 0 ? this.success([shape]) : this.failure([shape]));
    });
  }

  private ballOrder() {
    const sizes = [48, 25, 62, 36];
    const answer = [25, 36, 48, 62];
    const slots = answer.map((_size, index) => new Phaser.Geom.Rectangle(185 + index * 150, 345, 115, 105));
    const targetArea = new Phaser.Geom.Rectangle(slots[0].x, slots[0].y, slots.at(-1)!.right - slots[0].x, 105);
    slots.forEach((slot) => this.keep(this.add.rectangle(slot.centerX, slot.centerY, slot.width, slot.height, 0xffffff, 0.6).setStrokeStyle(3, 0x94a3b8)));
    let placed = 0;
    sizes.forEach((size, index) => {
      const ball = this.keep(this.add.circle(250 + index * 160, 210, size, 0xf97316).setStrokeStyle(4, 0xffffff));
      this.makeDropItem(ball, targetArea, () => {
        const slotIndex = slots.findIndex((slot) => Phaser.Geom.Rectangle.Contains(slot, ball.x, ball.y));
        if (slotIndex < 0 || answer[slotIndex] !== size) { this.failure([ball]); return false; }
        ball.setPosition(slots[slotIndex].centerX, slots[slotIndex].centerY).disableInteractive();
        placed += 1;
        if (placed === sizes.length) this.success([ball]);
        return true;
      });
    });
  }

  private memoryGame() {
    const symbols = Phaser.Utils.Array.Shuffle(['🐱', '⚽', '🍎', '🐱', '⚽', '🍎']);
    const open: Array<{ card: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; symbol: string }> = [];
    let pairs = 0;

    symbols.forEach((symbol, index) => {
      const x = 310 + (index % 3) * 170;
      const y = 245 + Math.floor(index / 3) * 145;
      const card = this.keep(this.add.rectangle(x, y, 128, 112, 0x7c3aed).setStrokeStyle(5, 0xddd6fe).setInteractive({ useHandCursor: true }));
      const text = this.keep(this.add.text(x, y, '?', this.textStyle(45, '#ffffff')).setOrigin(0.5));
      const turn = () => {
        if (this.locked || open.length === 2 || !card.input?.enabled) return;
        card.disableInteractive();
        this.tweens.add({
          targets: [card, text], scaleX: 0, duration: 130, yoyo: true,
          onYoyo: () => text.setText(symbol),
          onComplete: () => {
            open.push({ card, text, symbol });
            if (open.length !== 2) return;
            if (open[0].symbol === open[1].symbol) {
              open.splice(0).forEach((item) => this.tweens.add({ targets: [item.card, item.text], alpha: 0.35, scale: 0.92, duration: 220 }));
              pairs += 1;
              if (pairs === 3) this.success([card]);
            } else {
              this.attempts += 1;
              this.time.delayedCall(600, () => open.splice(0).forEach((item) => {
                item.text.setText('?');
                item.card.setInteractive({ useHandCursor: true });
              }));
            }
          },
        });
      };
      card.on('pointerdown', turn);
      text.setInteractive({ useHandCursor: true }).on('pointerdown', turn);
    });
  }

  private aabSequence() {
    const sequence = ['★', '★', '●', '★', '★'];
    sequence.forEach((symbol, index) => this.keep(this.add.text(220 + index * 105, 220, symbol, this.textStyle(48, '#f59e0b')).setOrigin(0.5)));
    this.keep(this.add.rectangle(745, 220, 72, 72, 0xffffff, 0.65).setStrokeStyle(4, 0x94a3b8));
    this.choiceSymbols(['★', '●', '■'], 1);
  }

  private choiceSymbols(symbols: string[], correct: number) {
    symbols.forEach((symbol, index) => {
      const card = this.keep(this.add.rectangle(360 + index * 120, 375, 88, 88, 0xffffff, 0.95).setStrokeStyle(4, 0x93c5fd).setInteractive({ useHandCursor: true }));
      const text = this.keep(this.add.text(card.x, card.y, symbol, this.textStyle(43, '#f59e0b')).setOrigin(0.5).setInteractive({ useHandCursor: true }));
      const choose = () => index === correct ? this.success([card, text]) : this.failure([card, text]);
      card.on('pointerdown', choose);
      text.on('pointerdown', choose);
    });
  }

  private float(target: DisplayObject) {
    this.tweens.add({ targets: target, y: target.y - 5, duration: 850, ease: 'Sine.inOut', yoyo: true, repeat: -1 });
  }

  private failure(targets: DisplayObject[]) {
    if (this.locked) return;
    this.attempts += 1;
    this.tweens.add({ targets, x: '+=8', duration: 65, yoyo: true, repeat: 3 });
    const hint = this.keep(this.add.text(480, 485, 'VAMOS TENTAR DE NOVO? 😊', { ...this.textStyle(20, '#9a3412'), backgroundColor: '#fff7ed', padding: { x: 16, y: 9 } }).setOrigin(0.5).setDepth(20));
    this.time.delayedCall(750, () => hint.active && hint.destroy());
  }

  private success(targets: DisplayObject[]) {
    if (this.locked) return;
    this.locked = true;
    this.attempts += 1;
    targets.forEach((target) => target.disableInteractive());
    this.tweens.add({ targets, scale: '+=0.12', duration: 180, yoyo: true, ease: 'Back.out' });
    const message = this.keep(this.add.text(480, 165, 'MUITO BEM! 🎉', { ...this.textStyle(27, '#166534'), backgroundColor: '#dcfce7', padding: { x: 22, y: 10 } }).setOrigin(0.5).setScale(0.5).setDepth(30));
    this.tweens.add({ targets: message, scale: 1, duration: 280, ease: 'Back.out' });
    for (let index = 0; index < 24; index += 1) {
      const piece = this.keep(this.add.rectangle(Phaser.Math.Between(300, 660), Phaser.Math.Between(145, 205), 8, 13, Phaser.Utils.Array.GetRandom([0xf97316, 0xeab308, 0x22c55e, 0x3b82f6, 0xa855f7])).setDepth(25));
      this.tweens.add({ targets: piece, y: Phaser.Math.Between(360, 520), x: piece.x + Phaser.Math.Between(-120, 120), angle: Phaser.Math.Between(180, 540), alpha: 0, duration: Phaser.Math.Between(700, 1150) });
    }
    this.time.delayedCall(1250, () => { this.questionIndex += 1; this.showQuestion(); });
  }
}
