import Phaser from 'phaser';
import { illustration } from './illustrations';
import { roundedPanel, vessel } from './sceneVisuals';
import { animalSprite } from './animalSprites';
import type { PlacementTarget } from './placementActivities';

export function placementVisual(scene: Phaser.Scene, target: PlacementTarget) {
  const {x,y,width,height,visual}=target;
  if (visual==='box') {
    const box=vessel(scene,x,y,width,height,'box');
    return {root:box.root,box};
  }
  const root=scene.add.container(0,0);
  const g=scene.add.graphics();root.add(g);
  if (visual==='slot' || visual==='above-tree' || visual==='beside-house') {
    root.add(roundedPanel(scene,x,y,width,height,0xffffff,0xb5c7c3,0.5));
    if (visual==='above-tree') root.add(illustration(scene,'tree',x,y+155,190));
    if (visual==='beside-house') root.add(illustration(scene,'house',x-165,y-25,170));
  } else if (visual==='house' || visual==='tree') {
    root.add(illustration(scene,visual,x,y,180));
  } else if (visual==='plate') {
    root.add(animalSprite(scene,'cat',x,y-105,105));
    g.fillStyle(0xfff4d5).fillEllipse(x,y,width,height);
    g.lineStyle(5,0x91663d).strokeEllipse(x,y,width,height);
    g.lineStyle(3,0xddba80).strokeEllipse(x,y,width-28,height-25);
  } else if (visual==='water') {
    g.fillStyle(0x96cd73).fillEllipse(x,y+12,width+12,height);
    g.fillStyle(0x54c5e8).fillEllipse(x,y,width,height-20);
    g.lineStyle(4,0x2585af).strokeEllipse(x,y,width,height-20);
    g.lineStyle(4,0xd0f5ff,0.9);
    for (const offset of [-35,5,40]) g.lineBetween(x-65,y+offset,x-20,y+offset+3);
    g.fillStyle(0x78ba50).fillEllipse(x+70,y+35,32,18);
  } else {
    g.fillStyle(0xa9d67d).fillEllipse(x,y+20,width,height-25);
    if (visual==='forest') {
      for (const offset of [-65,0,65]) root.add(illustration(scene,'tree',x+offset,y-28,100));
    } else {
      g.lineStyle(7,0xa16e3d).lineBetween(x-100,y-40,x+100,y-40).lineBetween(x-100,y-15,x+100,y-15);
      for(const offset of [-90,-30,30,90]) g.lineBetween(x+offset,y-65,x+offset,y+5);
    }
  }
  return {root,box:null};
}
