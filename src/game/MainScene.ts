import Phaser from 'phaser';
import { Narrator, type NarrationState } from '../audio/narrator';
import { spokenInstruction } from '../audio/instructions';
import { publicAsset } from '../publicAsset';
import { PlacementSession, isLargestAnimalChoice } from '../domain/placement';
import { PLACEMENT_ACTIVITIES, placementDefinition, type AnimalName } from './placementActivities';
import { preloadAnimals, registerAnimals, animalSprite, animateAnimal } from './animalSprites';
import { placementVisual } from './placementVisuals';
import { roundedPanel, vessel } from './sceneVisuals';
import { illustration, type IllustrationKind } from './illustrations';
import { CAT_SPRITES } from './catSprites';
import type { Difficulty } from '../domain/types';
import { createProgressId, type InteractionAction, type QuestionInteraction } from '../domain/progress';
import { questionsFor, type GameQuestion } from './questions';

interface MainSceneOptions {
  difficulty: Difficulty;
  onInteraction: (event: QuestionInteraction) => void;
  onComplete: () => void;
}

type DisplayObject = Phaser.GameObjects.Text | Phaser.GameObjects.Shape | Phaser.GameObjects.Sprite | Phaser.GameObjects.Container;

export class MainScene extends Phaser.Scene {
  private readonly onComplete: () => void;
  private readonly onInteraction: (event: QuestionInteraction) => void;
  private readonly questions: GameQuestion[];
  private questionIndex = 0;
  private locked = false;
  private readonly narrator = new Narrator();
  private narrationTimer?: Phaser.Time.TimerEvent;
  private questionObjects: Phaser.GameObjects.GameObject[] = [];

  constructor({ difficulty, onComplete, onInteraction }: MainSceneOptions) {
    super('MainScene');
    this.onComplete = onComplete;
    this.onInteraction = onInteraction;
    this.questions = questionsFor(difficulty);
  }

  preload() {
    const animals=new Set<AnimalName>(['cat']);
    for(const question of this.questions) {
      if(question.id==='F01') animals.add('elephant');
      for(const object of PLACEMENT_ACTIVITIES[question.id]?.objects ?? []) if(object.animal) animals.add(object.animal);
    }
    preloadAnimals(this,animals);
    for (const sheet of CAT_SPRITES) {
      this.load.spritesheet(sheet.key, publicAsset(`assets/animals/cat/${sheet.file}`), { frameWidth: sheet.width, frameHeight: sheet.height, endFrame: sheet.frames - 1 });
    }
  }

  create() {
    registerAnimals(this);
    this.cameras.main.setZoom(this.scale.width / 960).centerOn(480, 270);
    for (const sheet of CAT_SPRITES) {
      this.anims.create({ key: `${sheet.key}-animation`, frames: this.anims.generateFrameNumbers(sheet.key, { start: 0, end: sheet.frames - 1 }), frameRate: sheet.rate, repeat: -1 });
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopNarration());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.stopNarration());
    this.showQuestion();
  }

  private keep<T extends Phaser.GameObjects.GameObject>(object: T): T {
    this.questionObjects.push(object);
    return object;
  }

  stopNarration() {
    this.narrationTimer?.remove();
    this.narrationTimer = undefined;
    this.narrator.stop();
  }

  private showQuestion() {
    this.stopNarration();
    this.questionObjects.forEach((object) => object.destroy());
    this.questionObjects = [];
    this.locked = false;
    this.input.enabled = true;
    this.input.dragDistanceThreshold = 0;
    const question = this.questions[this.questionIndex];
    if (!question) {
      this.locked = true;
      this.input.enabled = false;
      this.onComplete();
      return;
    }

    this.createBackground();
    this.createHeader(question);
    switch (question.kind) {
      case 'largest-animal': this.largestAnimal(); break;
      case 'placement': this.placementActivity(question.id); break;
      case 'cat-in-box': this.catInBox(); break;
      case 'apple-count': this.countIntoTarget('🍎', 5, 3, 'CESTA', 0xf59e0b); break;
      case 'blue-choice': this.choiceRow(['AZUL', 'VERMELHO', 'AMARELO', 'VERDE'], 0, [0x3b82f6, 0xef4444, 0xfacc15, 0x22c55e]); break;
      case 'letter-a': this.choiceRow(['A', 'B', 'O'], 0); break;
      case 'syllable-two': this.choiceRow(['●', '● ●', '● ● ●'], 1); break;
      case 'different-shape': this.shapeDifference(); break;
      case 'ball-under-table': this.ballUnderTable(); break;
      case 'star-count': this.countIntoTarget('★', 7, 5, 'CAIXA', 0x8b5cf6); break;
      case 'two-colors': this.colorSorting([0xef4444, 0x3b82f6], 3); break;
      case 'initial-sound': this.choiceRow(['🍎\nMAÇÃ', '⚽\nBOLA', '🐸\nSAPO'], 0, undefined, ['apple', 'ball', 'frog']); break;
      case 'initial-letter': this.dragLetters(['B', 'D', 'P'], ['B']); break;
      case 'alternating-sequence': this.sequenceChoice(); break;
      case 'ball-order': this.ballOrder(); break;
      case 'three-colors': this.colorSorting([0xef4444, 0x3b82f6, 0xfacc15], 2); break;
      case 'syllable-three': this.countIntoTarget('★', 5, 3, 'FAIXA', 0x8b5cf6); break;
      case 'word-sol': this.dragLetters(['L', 'S', 'O'], ['S', 'O', 'L']); break;
      case 'memory': this.memoryGame(); break;
      case 'house-choice': this.choiceRow(['🏠\nCASA', '🚗\nCARRO', '🌳\nÁRVORE'], 0, undefined, ['house', 'car', 'tree']); break;
      case 'aab-sequence': this.aabSequence(); break;
    }
  }

  private largestAnimal() {
    const options = [
      {id:'gato',animal:'cat' as const,x:290,size:120},
      {id:'elefante',animal:'elephant' as const,x:650,size:270},
    ];
    options.forEach(option=>{
      const sprite=this.keep(animalSprite(this,option.animal,option.x,330,option.size));
      // Ambos os animais têm alvos confortáveis, mesmo com tamanhos diferentes.
      const hit=this.keep(this.add.zone(option.x,330,290,280).setInteractive({useHandCursor:true}));
      const activate=()=>{
        const action:InteractionAction={type:'select',optionId:option.id};
        if(isLargestAnimalChoice(option.id))this.success([sprite],action);else this.failure([sprite],action);
      };
      hit.on('pointerdown',activate);
    });
  }

  private placementActivity(id:string) {
    this.input.dragDistanceThreshold = 8;
    const definition=PLACEMENT_ACTIVITIES[id];
    const session=new PlacementSession(placementDefinition(definition));
    const targets=definition.targets.map(target=>{
      const visual=placementVisual(this,target);this.keep(visual.root);
      const bounds=new Phaser.Geom.Rectangle(target.x-target.width/2,target.y-target.height/2,target.width,target.height);
      return {...target,bounds,visual};
    });
    const objects=definition.objects.map(object=>({
      ...object,
      sprite: this.keep(object.animal ? animalSprite(this,object.animal,object.x,object.y,object.size) : illustration(this,'ball',object.x,object.y,object.size)),
      placed:false,
    }));
    let selected:typeof objects[number]|null=null;
    const choose=(object:typeof objects[number])=>{
      if(this.locked||object.placed||!object.sprite.input?.enabled)return;
      selected=object;
    };
    const attempt=(object:typeof objects[number],targetId:string|null)=>{
      if(this.locked)return false;
      const result=session.place(object.id,targetId);
      if(!result)return false;
      selected=null;
      const action:InteractionAction={type:'drop',objectId:object.id,targetId};
      if(!result.correct) {
        if(object.animal && object.sprite instanceof Phaser.GameObjects.Sprite) animateAnimal(this,object.sprite,object.animal,'think');
        this.failure([object.sprite],action);return false;
      }
      object.placed=true;object.sprite.disableInteractive();
      const target=targets.find(t=>t.id===targetId)!;
      if(target.visual.box)target.visual.box.place(object.sprite,result.quantity-1,target.capacity,75);
      else {
        const x=target.x+(target.capacity>1?(result.quantity-1-(target.capacity-1)/2)*82:0);
        // Na ordenação, preservar as diferenças de tamanho entre os animais.
        const size=id==='M01'?object.size:target.capacity>1?85:105;
        object.sprite.setPosition(x,target.y);
        object.sprite.setScale(size/object.sprite.width);
      }
      if(object.animal && object.sprite instanceof Phaser.GameObjects.Sprite) animateAnimal(this,object.sprite,object.animal,'happy');
      if(result.completed)this.success([],action);else this.report('correct',action);
      return true;
    };
    for(const object of objects) {
      this.makeDropItem(object.sprite,new Phaser.Geom.Rectangle(0,0,960,540),()=>{
        const target=targets.find(t=>Phaser.Geom.Rectangle.Contains(t.bounds,object.sprite.x,object.sprite.y));
        return attempt(object,target?.id??null);
      });
      object.sprite.on('pointerdown',()=>choose(object));
      object.sprite.on('dragstart',()=>{
        object.sprite.setDepth(10);
        if(object.animal && object.sprite instanceof Phaser.GameObjects.Sprite)animateAnimal(this,object.sprite,object.animal,'walk');
      });
    }
    for(const target of targets) {
      const activate=()=>{if(selected)attempt(selected,target.id);};
      const hit=this.keep(this.add.zone(target.x,target.y,target.width,target.height).setInteractive({useHandCursor:true}));
      // As zonas só recebem cliques; os objetos arrastáveis ficam acima delas.
      hit.setDepth(-0.1);
      hit.on('pointerdown',activate);
    }
  }

  private createBackground() {
    const graphics = this.keep(this.add.graphics());
    // O renderizador Canvas não desenha o gradiente do WebGL.
    graphics.fillStyle(0xdff5ff).fillRect(0, 0, 960, 540);
    graphics.fillGradientStyle(0xdff5ff, 0xdff5ff, 0xf5fbff, 0xf5fbff).fillRect(0, 0, 960, 540);
    graphics.fillStyle(0xffdf70, 0.9).fillCircle(882, 65, 38);
    graphics.fillStyle(0xb9e6a5).fillEllipse(190, 525, 600, 150);
    graphics.fillStyle(0x8bd18a).fillEllipse(750, 525, 760, 180);
    graphics.fillStyle(0x72c978).fillRect(0, 480, 960, 60);
  }

  private createHeader(question: GameQuestion) {
    this.keep(roundedPanel(this, 480, 72, 720, 104));
    this.keep(this.add.text(480, 55, question.title, this.textStyle(31, '#4338ca')).setOrigin(0.5));
    this.keep(this.add.text(480, 92, question.instruction, this.textStyle(18, '#64748b')).setOrigin(0.5));
    this.keep(this.add.text(55, 48, question.id, this.textStyle(17, '#7c3aed')).setOrigin(0.5));
    this.keep(this.add.text(55, 75, `${this.questionIndex + 1}/${this.questions.length}`, this.textStyle(15, '#64748b')).setOrigin(0.5));
    const button = this.keep(this.add.circle(888, 72, 38, 0x7c3aed).setStrokeStyle(4, 0xddd6fe).setInteractive({ useHandCursor: true }));
    const icon = this.keep(this.add.text(888, 72, '🔊', { fontSize: '28px' }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    const status = this.keep(this.add.text(480, 143, '', this.textStyle(15, '#475569')).setOrigin(0.5));
    const messages: Record<NarrationState, string> = {
      idle: '', loading: 'Preparando o áudio…', speaking: '',
      blocked: 'Toque no alto-falante para ouvir a instrução.',
      unavailable: 'Áudio indisponível. Peça ajuda para ler a instrução.',
      error: 'Não foi possível ouvir. Toque no alto-falante para tentar de novo.',
    };
    const speak = () => {
      if (this.locked) return;
      this.narrator.speak(spokenInstruction(question.id, question.instruction), state => {
        if (!status.active) return;
        status.setText(messages[state]);
        button.setFillStyle(state === 'speaking' ? 0x059669 : 0x7c3aed);
        icon.setText(state === 'speaking' ? '🔉' : '🔊');
      });
    };
    const automatic = this.time.delayedCall(350, speak);
    this.narrationTimer = automatic;
    const repeat = () => { automatic.remove(); speak(); };
    button.on('pointerdown', repeat);
    icon.on('pointerdown', repeat);
  }

  private textStyle(size: number, color = '#334155'): Phaser.Types.GameObjects.Text.TextStyle {
    return { color, fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif', fontSize: `${size}px`, fontStyle: 'bold', align: 'center', resolution: 2, padding: { x: 3, y: 3 } };
  }

  private choiceRow(labels: string[], correct: number, colors?: number[], pictures?: IllustrationKind[]) {
    const gap = Math.min(205, 750 / labels.length);
    const start = 480 - ((labels.length - 1) * gap) / 2;
    labels.forEach((label, index) => {
      const x = start + index * gap;
      const card = this.keep(roundedPanel(this, x, 315, Math.min(170, gap - 18), 155, colors?.[index] ?? 0xffffff, colors ? 0xffffff : 0x93c5fd).setInteractive({ useHandCursor: true }));
      const text = this.keep(this.add.text(x, pictures ? 364 : 315, pictures ? label.split('\n').at(-1)! : label, this.textStyle(pictures ? 22 : labels.length === 4 ? 20 : 38, colors ? '#ffffff' : '#334155')).setOrigin(0.5).setInteractive({ useHandCursor: true }));
      const picture = pictures ? this.keep(illustration(this, pictures[index], x, 296, 94)) : null;
      const choiceObjects = picture ? [card, text, picture] : [card, text];
      const action: InteractionAction = { type: 'select', optionId: label };
      const choose = () => index === correct ? this.success(choiceObjects, action) : this.failure(choiceObjects, action);
      card.on('pointerdown', choose);
      text.on('pointerdown', choose);

    });
  }

  private shapeDifference() {
    [210, 390, 570, 750].forEach((x, index) => {
      const shape = index === 2
        ? this.keep(this.add.star(x, 315, 5, 35, 72, 0xfacc15).setInteractive({ useHandCursor: true }))
        : this.keep(this.add.circle(x, 315, 58, 0xfacc15).setInteractive({ useHandCursor: true }));
      const action: InteractionAction = { type: 'select', optionId: `figura-${index}` };
      shape.on('pointerdown', () => index === 2 ? this.success([shape], action) : this.failure([shape], action));
      this.float(shape);
    });
  }

  private makeDropItem(object: DisplayObject, target: Phaser.Geom.Rectangle, onDrop: (inside: boolean) => boolean) {
    const home = { x: object.x, y: object.y };
    object.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(object);
    object.on('drag', (_pointer: Phaser.Input.Pointer, x: number, y: number) => {
      if (!this.locked) object.setPosition(x, y);
    });
    object.on('dragend', () => {
      if (this.locked || !object.input?.enabled) return;
      const inside = Phaser.Geom.Rectangle.Contains(target, object.x, object.y);
      const accepted = onDrop(inside);
      if (!inside || !accepted) {
        // Não aceitar outro arraste durante o retorno do mesmo objeto.
        object.disableInteractive();
        // O balanço de erro não pode disputar a posição com o retorno à origem.
        this.tweens.killTweensOf(object);
        this.tweens.add({
          targets: object, x: home.x, y: home.y, duration: 260, ease: 'Back.out',
          onComplete: () => { if (object.active && !this.locked && object.input) object.input.enabled = true; },
        });
      }
    });
  }

  private catInBox() {
    const box = new Phaser.Geom.Rectangle(610, 260, 240, 175);
    const container = vessel(this, 730, 340, 285, 210, 'box');
    this.keep(container.root);
    this.keep(this.add.text(730, 450, 'CAIXA', this.textStyle(18)).setOrigin(0.5));
    const cat = this.keep(animalSprite(this, 'cat', 245, 420, 192));
    this.makeDropItem(cat, box, (inside) => {
      const action: InteractionAction = { type: 'drop', objectId: 'gato', targetId: inside ? 'caixa' : null };
      if (inside) {
        animateAnimal(this, cat, 'cat', 'happy');
        cat.disableInteractive();
        container.place(cat, 0, 1, 155, 25);
        this.success([], action);
        return true;
      } else {
        animateAnimal(this, cat, 'cat', 'think');
        this.failure([cat], action);
        this.time.delayedCall(700, () => cat.active && animateAnimal(this, cat, 'cat', 'walk'));
        return false;
      }
    });
    cat.on('dragstart', () => {
      cat.setDepth(10);
      animateAnimal(this, cat, 'cat', 'walk');
    });
  }

  private countIntoTarget(symbol: string, total: number, expected: number, label: string, color: number) {
    const target = new Phaser.Geom.Rectangle(585, 235, 285, 210);
    const container = label === 'FAIXA' ? null : vessel(this, 727, 340, 285, 210, label === 'CESTA' ? 'basket' : 'box');
    const zone = this.keep(container?.root ?? roundedPanel(this, 727, 340, 285, 210, 0xffffff, color));
    this.keep(this.add.text(727, 455, label, this.textStyle(18)).setOrigin(0.5));
    let count = 0;
    for (let index = 0; index < total; index += 1) {
      const item = this.keep(illustration(this, symbol === '🍎' ? 'apple' : 'star', 125 + (index % 3) * 115, 245 + Math.floor(index / 3) * 105, 74));
      this.makeDropItem(item, target, (inside) => {
        const action: InteractionAction = {
          type: 'count', objectId: `item-${index}`, targetId: inside ? 'recipiente' : null,
          quantity: count + (inside ? 1 : 0), expected,
        };
        if (!inside) { this.failure([item], action); return false; }
        item.disableInteractive();
        if (container) container.place(item, count, expected, expected > 3 ? 46 : 68);
        else item.setPosition(660 + (count % 3) * 65, 315 + Math.floor(count / 3) * 57).setScale(0.55);
        count += 1;
        if (count === expected) this.success([zone], action);
        else this.report('progress', action);
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
      const action: InteractionAction = { type: 'drop', objectId: 'bola', targetId: inside ? 'embaixo-mesa' : null };
      if (inside) this.success([ball], action); else this.failure([ball], action);
      return inside;
    });
  }

  private colorSorting(colors: number[], each: number) {
    const targetWidth = colors.length === 2 ? 290 : 220;
    const gap = colors.length === 2 ? 390 : 275;
    const targets = colors.map((_color, index) => new Phaser.Geom.Rectangle(140 + index * gap, 350, targetWidth, 110));
    const containers = colors.map((color, index) => {
      const container = vessel(this, targets[index].centerX, targets[index].centerY, targets[index].width, 160, 'box', color);
      this.keep(container.root);
      return container;
    });
    const placedPerColor = colors.map(() => 0);
    let correct = 0;
    const items = colors.flatMap((color, colorIndex) => Array.from({ length: each }, (_, itemIndex) => ({ color, colorIndex, itemIndex })));
    items.forEach((item, index) => {
      const x = 145 + index * (670 / (items.length - 1));
      const object = this.keep(item.itemIndex % 2 === 0 ? this.add.circle(x, 220, 31, item.color) : this.add.star(x, 220, 5, 18, 38, item.color));
      this.makeDropItem(object, targets[item.colorIndex], (inside) => {
        const targetIndex = targets.findIndex((target) => Phaser.Geom.Rectangle.Contains(target, object.x, object.y));
        const action: InteractionAction = {
          type: 'drop', objectId: `cor-${item.color.toString(16)}-objeto-${item.itemIndex}`,
          targetId: targetIndex < 0 ? null : `cor-${colors[targetIndex].toString(16)}`,
        };
        if (!inside) { this.failure([object], action); return false; }
        object.disableInteractive();
        containers[item.colorIndex].place(object, placedPerColor[item.colorIndex]++, each, 60);
        correct += 1;
        if (correct === items.length) this.success([], action);
        else this.report('correct', action);
        return true;
      });
    });
  }

  private dragLetters(letters: string[], answer: string[]) {
    const slots = answer.map((_letter, index) => new Phaser.Geom.Rectangle(480 - (answer.length * 100) / 2 + index * 100, 340, 82, 92));
    const targetArea = new Phaser.Geom.Rectangle(slots[0].x, slots[0].y, slots.at(-1)!.right - slots[0].x, 92);
    slots.forEach((slot) => this.keep(roundedPanel(this, slot.centerX, slot.centerY, slot.width, slot.height, 0xffffff, 0x8b5cf6)));
    let placed = 0;
    letters.forEach((letter, index) => {
      const object = this.keep(this.add.text(310 + index * 170, 205, letter, this.textStyle(54, '#4338ca')).setOrigin(0.5));
      this.makeDropItem(object, targetArea, () => {
        const slotIndex = slots.findIndex((slot) => Phaser.Geom.Rectangle.Contains(slot, object.x, object.y));
        const action: InteractionAction = { type: 'drop', objectId: `letra-${letter}-${index}`, targetId: slotIndex < 0 ? null : `posicao-${slotIndex + 1}` };
        if (slotIndex < 0 || answer[slotIndex] !== letter) { this.failure([object], action); return false; }
        object.setPosition(slots[slotIndex].centerX, slots[slotIndex].centerY).disableInteractive();
        placed += 1;
        if (placed === answer.length) this.success([object], action);
        else this.report('correct', action);
        return true;
      });
    });
    this.keep(illustration(this, answer.length === 1 ? 'ball' : 'sun', answer.length === 1 ? 426 : 480, 470, 65));
    if (answer.length === 1) this.keep(this.add.text(510, 470, 'BOLA', this.textStyle(27)).setOrigin(0.5));
  }

  private sequenceChoice() {
    [0xef4444, 0x3b82f6, 0xef4444, 0x3b82f6, 0xef4444].forEach((color, index) => this.keep(this.add.circle(225 + index * 105, 220, 30, color)));
    this.keep(roundedPanel(this, 750, 220, 68, 68, 0xffffff, 0x94a3b8));
    [0x3b82f6, 0xfacc15, 0xef4444].forEach((color, index) => {
      const shape = index === 2 ? this.keep(this.add.rectangle(610 + index * 110, 365, 60, 60, color).setInteractive({ useHandCursor: true })) : this.keep(this.add.circle(610 + index * 110, 365, 30, color).setInteractive({ useHandCursor: true }));
      const action: InteractionAction = { type: 'select', optionId: ['circulo-azul', 'circulo-amarelo', 'quadrado-vermelho'][index] };
      shape.on('pointerdown', () => index === 0 ? this.success([shape], action) : this.failure([shape], action));
    });
  }

  private ballOrder() {
    const sizes = [48, 25, 62, 36];
    const answer = [25, 36, 48, 62];
    const slots = answer.map((_size, index) => new Phaser.Geom.Rectangle(185 + index * 150, 345, 115, 105));
    const targetArea = new Phaser.Geom.Rectangle(slots[0].x, slots[0].y, slots.at(-1)!.right - slots[0].x, 105);
    slots.forEach((slot) => this.keep(roundedPanel(this, slot.centerX, slot.centerY, slot.width, slot.height, 0xffffff, 0x94a3b8)));
    let placed = 0;
    sizes.forEach((size, index) => {
      const ball = this.keep(this.add.circle(250 + index * 160, 210, size, 0xf97316).setStrokeStyle(4, 0xffffff));
      this.makeDropItem(ball, targetArea, () => {
        const slotIndex = slots.findIndex((slot) => Phaser.Geom.Rectangle.Contains(slot, ball.x, ball.y));
        const action: InteractionAction = { type: 'drop', objectId: `bola-raio-${size}`, targetId: slotIndex < 0 ? null : `posicao-${slotIndex + 1}` };
        if (slotIndex < 0 || answer[slotIndex] !== size) { this.failure([ball], action); return false; }
        ball.setPosition(slots[slotIndex].centerX, slots[slotIndex].centerY).disableInteractive();
        placed += 1;
        if (placed === sizes.length) this.success([ball], action);
        else this.report('correct', action);
        return true;
      });
    });
  }

  private memoryGame() {
    const pictures: Record<string, IllustrationKind> = { '🐱': 'cat', '⚽': 'ball', '🍎': 'apple' };
    const symbols = Phaser.Utils.Array.Shuffle(['🐱', '⚽', '🍎', '🐱', '⚽', '🍎']);
    const open: Array<{ id: string; card: Phaser.GameObjects.Container; text: Phaser.GameObjects.Text; picture: Phaser.GameObjects.Container; symbol: string }> = [];
    let pairs = 0;
    let flipping = false;

    symbols.forEach((symbol, index) => {
      const x = 310 + (index % 3) * 170;
      const y = 245 + Math.floor(index / 3) * 145;
      const card = this.keep(roundedPanel(this, x, y, 128, 112, 0x7c3aed, 0xddd6fe).setInteractive({ useHandCursor: true }));
      const text = this.keep(this.add.text(x, y, '?', this.textStyle(45, '#ffffff')).setOrigin(0.5));
      const picture = this.keep(illustration(this, pictures[symbol], x, y, 85).setVisible(false));
      const turn = () => {
        if (this.locked || flipping || open.length === 2 || !card.input?.enabled) return;
        flipping = true;
        card.disableInteractive();
        // Reservar a carta antes da animação impede abrir uma terceira por cliques rápidos.
        open.push({ id: `carta-${index}`, card, text, picture, symbol });
        this.tweens.add({
          targets: [card, text, picture], scaleX: 0, duration: 130, yoyo: true,
          onYoyo: () => { if (text.active && picture.active) { text.setVisible(false); picture.setVisible(true); } },
          onComplete: () => {
            flipping = false;
            if (this.locked || !card.active || !text.active) return;
            if (open.length !== 2) return;
            const action: InteractionAction = {
              type: 'pair', cardIds: [open[0].id, open[1].id], symbols: [open[0].symbol, open[1].symbol],
            };
            if (open[0].symbol === open[1].symbol) {
              open.splice(0).forEach((item) => this.tweens.add({ targets: [item.card, item.text, item.picture], alpha: 0.35, scale: 0.92, duration: 220 }));
              pairs += 1;
              if (pairs === 3) this.success([card], action);
              else this.report('correct', action);
            } else {
              this.failure([card], action);
              this.time.delayedCall(600, () => open.splice(0).forEach((item) => {
                if (!item.text.active || !item.card.active) return;
                item.text.setVisible(true);
                item.picture.setVisible(false);
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
    this.keep(roundedPanel(this, 745, 220, 72, 72, 0xffffff, 0x94a3b8));
    this.choiceSymbols(['★', '●', '■'], 1);
  }

  private choiceSymbols(symbols: string[], correct: number) {
    symbols.forEach((symbol, index) => {
      const card = this.keep(roundedPanel(this, 360 + index * 120, 375, 88, 88, 0xffffff, 0x93c5fd).setInteractive({ useHandCursor: true }));
      const text = this.keep(this.add.text(card.x, card.y, symbol, this.textStyle(43, '#f59e0b')).setOrigin(0.5).setInteractive({ useHandCursor: true }));
      const action: InteractionAction = { type: 'select', optionId: symbol };
      const choose = () => index === correct ? this.success([card, text], action) : this.failure([card, text], action);
      card.on('pointerdown', choose);
      text.on('pointerdown', choose);
    });
  }

  private float(target: DisplayObject) {
    this.tweens.add({ targets: target, y: target.y - 5, duration: 850, ease: 'Sine.inOut', yoyo: true, repeat: -1 });
  }

  private report(result: QuestionInteraction['result'], action: InteractionAction, completed = false) {
    if (this.locked) return;
    this.onInteraction({
      eventId: createProgressId(),
      questionId: this.questions[this.questionIndex].id,
      timestamp: new Date().toISOString(),
      action,
      result,
      completed,
    });
  }

  private failure(targets: DisplayObject[], action: InteractionAction) {
    if (this.locked) return;
    this.report('incorrect', action);
    this.tweens.add({ targets, x: '+=8', duration: 65, yoyo: true, repeat: 3 });
    const backing = this.keep(roundedPanel(this, 480, 485, 370, 48, 0xfff7ed, 0xfed7aa)).setDepth(19);
    const hint = this.keep(this.add.text(480, 485, 'VAMOS TENTAR DE NOVO? 😊', { ...this.textStyle(20, '#9a3412'), padding: { x: 16, y: 9 } }).setOrigin(0.5).setDepth(20));
    this.time.delayedCall(750, () => { if (hint.active) hint.destroy(); if (backing.active) backing.destroy(); });
  }

  private success(targets: DisplayObject[], action: InteractionAction) {
    if (this.locked) return;
    this.stopNarration();
    this.report('correct', action, true);
    this.locked = true;
    this.input.enabled = false;
    targets.forEach((target) => target.disableInteractive());
    this.tweens.add({ targets, scale: '+=0.12', duration: 180, yoyo: true, ease: 'Back.out' });
    this.keep(roundedPanel(this, 480, 165, 290, 58, 0xdcfce7, 0x86efac)).setDepth(29);
    const message = this.keep(this.add.text(480, 165, 'MUITO BEM! 🎉', { ...this.textStyle(27, '#166534'), padding: { x: 22, y: 10 } }).setOrigin(0.5).setScale(0.5).setDepth(30));
    this.tweens.add({ targets: message, scale: 1, duration: 280, ease: 'Back.out' });
    for (let index = 0; index < 24; index += 1) {
      const piece = this.keep(this.add.rectangle(Phaser.Math.Between(300, 660), Phaser.Math.Between(145, 205), 8, 13, Phaser.Utils.Array.GetRandom([0xf97316, 0xeab308, 0x22c55e, 0x3b82f6, 0xa855f7])).setDepth(25));
      this.tweens.add({ targets: piece, y: Phaser.Math.Between(360, 520), x: piece.x + Phaser.Math.Between(-120, 120), angle: Phaser.Math.Between(180, 540), alpha: 0, duration: Phaser.Math.Between(700, 1150) });
    }
    this.time.delayedCall(1250, () => { this.questionIndex += 1; this.showQuestion(); });
  }
}
