import Phaser from 'phaser';
import { publicAsset } from '../publicAsset';
import { GENERATED_ANIMAL_FRAMES } from './generatedAnimalFrames';
import type { AnimalName } from './placementActivities';

// Contagens reais: algumas folhas reservam uma quarta coluna transparente.
const EXISTING_SHEETS = {
  cow: {
    idle: { width: 532, height: 530, frames: 3 },
    walk: { width: 598, height: 547, frames: 3 },
    happy: { width: 498, height: 552, frames: 2 },
    think: { width: 564, height: 572, frames: 4 },
  },
  elephant: {
    idle: { width: 572, height: 501, frames: 4 },
    walk: { width: 595, height: 510, frames: 4 },
    happy: { width: 552, height: 541, frames: 3 },
    think: { width: 586, height: 576, frames: 3 },
  },
  lion: {
    idle: { width: 526, height: 508, frames: 4 },
    walk: { width: 580, height: 501, frames: 3 },
    happy: { width: 533, height: 583, frames: 2 },
    think: { width: 533, height: 574, frames: 4 },
  },
} satisfies Partial<Record<AnimalName, Record<string, { width: number; height: number; frames: number }>>>;
export function preloadAnimals(scene: Phaser.Scene, animals: Set<AnimalName>) {
  for (const [name, sheets] of Object.entries(EXISTING_SHEETS)) {
    if (!animals.has(name as AnimalName)) continue;
    for (const [action, sheet] of Object.entries(sheets)) {
      scene.load.spritesheet(`${name}-${action}`, publicAsset(`assets/animals/${name}/${name}_${action}.png`), { frameWidth: sheet.width, frameHeight: sheet.height, endFrame: sheet.frames - 1 });
    }
  }
  for (const [key, sheet] of Object.entries(GENERATED_ANIMAL_FRAMES)) {
    if (animals.has(key.split('-')[0] as AnimalName)) scene.load.image(key,publicAsset(sheet.file));
  }
}
export function registerAnimals(scene: Phaser.Scene) {
  for (const [key, sheet] of Object.entries(GENERATED_ANIMAL_FRAMES)) {
    if (!scene.textures.exists(key)) continue;
    const texture=scene.textures.get(key);
    sheet.frames.forEach(([x,width],i)=>{
      const frame=texture.add(i,0,x,0,width,sheet.height);
      frame?.setTrim(640,sheet.height,(640-width)/2,0,width,sheet.height);
    });
    scene.anims.create({ key: `${key}-animation`, frames: scene.anims.generateFrameNumbers(key,{start:0,end:3}), frameRate: key.endsWith('walk') ? 6 : 3, repeat:-1 });
  }
  for (const [name, sheets] of Object.entries(EXISTING_SHEETS)) {
    for (const [action, sheet] of Object.entries(sheets)) {
      const key = `${name}-${action}`;
      if (scene.textures.exists(key)) scene.anims.create({ key: `${key}-animation`, frames: scene.anims.generateFrameNumbers(key, { start: 0, end: sheet.frames - 1 }), frameRate: action === 'walk' ? 6 : 3, repeat: -1 });
    }
  }
}
export function animalSprite(scene: Phaser.Scene, name: AnimalName, x: number, y: number, size: number) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sprite=scene.add.sprite(x,y,`${name}-walk`,0);
  sprite.setScale(size/sprite.width);
  // Movimento local, mais lento quando o sistema pede redução de movimento.
  // Não deslocar o alvo de arraste nem deixar o personagem totalmente estático.
  sprite.anims.timeScale = reducedMotion ? 0.35 : 1;
  sprite.play(`${name}-walk-animation`);
  return sprite;
}
export function animateAnimal(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite, name: AnimalName, action: 'idle'|'walk'|'happy'|'think') {
  sprite.anims.timeScale = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.35 : 1;
  const key=`${name}-${action}-animation`;
  if (scene.anims.exists(key)) sprite.play(key);
}
