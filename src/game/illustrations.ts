import Phaser from 'phaser';
import { animalSprite } from './animalSprites';

export type IllustrationKind = 'apple' | 'ball' | 'frog' | 'house' | 'car' | 'tree' | 'sun' | 'star' | 'cat';

/** Figuras reutilizáveis com contorno quente, luz e cores comuns aos recipientes. */
export function illustration(scene: Phaser.Scene, kind: IllustrationKind, x: number, y: number, size = 90) {
  const root = scene.add.container(x, y).setSize(100, 100).setScale(size / 100);
  if (kind === 'cat') {
    root.add(animalSprite(scene, 'cat', 0, 0, 94));
    return root;
  }
  const g = scene.add.graphics();
  root.add(g);
  const edge = 0x643721;
  const ellipse = (cx: number, cy: number, w: number, h: number, color: number, stroke = edge) => {
    g.fillStyle(color).fillEllipse(cx, cy, w, h);
    g.lineStyle(3.5, stroke).strokeEllipse(cx, cy, w, h);
  };
  const rect = (rx: number, ry: number, w: number, h: number, color: number, radius = 7) => {
    g.fillStyle(color).fillRoundedRect(rx, ry, w, h, radius);
    g.lineStyle(3.5, edge).strokeRoundedRect(rx, ry, w, h, radius);
  };
  const polygon = (points: number[], color: number) => {
    g.fillStyle(color).lineStyle(3.5, edge).beginPath().moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) g.lineTo(points[i], points[i + 1]);
    g.closePath().fillPath().strokePath();
  };
  switch (kind) {
    case 'apple':
      g.lineStyle(7, edge).lineBetween(0,-22,4,-42);
      ellipse(16,-35,26,13,0x8bc74b);
      // Uma única silhueta arredondada, sem depender dos emojis do sistema.
      {
        const contour = new Phaser.Curves.Spline([
          new Phaser.Math.Vector2(0,-24), new Phaser.Math.Vector2(-18,-28),
          new Phaser.Math.Vector2(-36,-10), new Phaser.Math.Vector2(-31,20),
          new Phaser.Math.Vector2(-16,36), new Phaser.Math.Vector2(0,33),
          new Phaser.Math.Vector2(17,35), new Phaser.Math.Vector2(34,13),
          new Phaser.Math.Vector2(34,-14), new Phaser.Math.Vector2(18,-28),
          new Phaser.Math.Vector2(0,-24),
        ]).getPoints(64);
        g.fillStyle(0xef5543).fillPoints(contour,true);
        g.lineStyle(4,edge).strokePoints(contour,true);
      }
      g.fillStyle(0xffa07a).fillEllipse(-19,-6,12,23);
      break;
    case 'ball':
      ellipse(0,0,82,82,0xfff5db);
      polygon([-11,-17,10,-17,19,1,0,15,-20,1],0x735b49);
      g.lineStyle(4,edge);
      for (const [ax,ay,bx,by] of [[-11,-17,-19,-35],[10,-17,22,-34],[19,1,39,5],[0,15,0,40],[-20,1,-39,7]]) g.lineBetween(ax,ay,bx,by);
      g.fillStyle(0xffffff,0.7).fillEllipse(-19,-22,12,8);
      break;
    case 'frog':
      ellipse(-28,31,31,16,0x69b954); ellipse(28,31,31,16,0x69b954);
      ellipse(0,14,65,49,0x83ca5c); ellipse(0,20,38,28,0xcde68a);
      ellipse(0,-8,77,45,0x8bd55d);
      for (const ex of [-23,23]) {
        ellipse(ex,-24,28,31,0x8bd55d); ellipse(ex,-25,18,23,0xfff9df);
        g.fillStyle(0x302b20).fillEllipse(ex+2,-24,8,13);
        g.fillStyle(0xffffff).fillCircle(ex+3,-28,2.5);
      }
      g.lineStyle(3,edge).beginPath().arc(0,-6,17,0.25,Math.PI-0.25).strokePath();
      g.fillStyle(0xf8a27e).fillEllipse(-26,0,10,6).fillEllipse(26,0,10,6);
      break;
    case 'house':
      rect(-32,-9,64,48,0xffd88a);
      rect(15,-37,12,25,0xc7784f,3);
      polygon([-44,-7,0,-42,44,-7],0xe96c4b);
      rect(-10,11,20,28,0x9c6545,3); rect(-25,1,14,15,0x9bdce6,3); rect(14,1,14,15,0x9bdce6,3);
      g.fillStyle(0xffeab5).fillCircle(4,26,2);
      break;
    case 'car':
      polygon([-31,0,-16,-26,18,-26,33,0],0x6bc7e6);
      g.lineStyle(3,edge).lineBetween(2,-24,2,0);
      rect(-43,-2,86,32,0xef6651,12);
      ellipse(-25,29,23,23,0x695346); ellipse(26,29,23,23,0x695346);
      ellipse(-25,29,9,9,0xf8d99c); ellipse(26,29,9,9,0xf8d99c);
      rect(30,4,10,9,0xffe59a,3);
      break;
    case 'tree':
      polygon([-10,0,11,0,15,40,-17,40],0xc38a50);
      ellipse(-20,-8,43,44,0x6fb84c); ellipse(21,-10,42,43,0x6fb84c);
      ellipse(0,-26,52,46,0x8acc58);
      g.fillStyle(0xb9e978).fillEllipse(-8,-34,19,10);
      break;
    case 'sun':
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5;
        g.lineStyle(6,0xf3ad32).lineBetween(Math.cos(a)*34,Math.sin(a)*34,Math.cos(a)*45,Math.sin(a)*45);
      }
      ellipse(0,0,57,57,0xffd15a);
      g.fillStyle(0xffed9e).fillEllipse(-10,-12,17,9);
      break;
    case 'star': {
      const points: number[] = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 20 : 43;
        points.push(Math.cos(a)*r, Math.sin(a)*r);
      }
      polygon(points,0xffcd4e);
      g.fillStyle(0xffed9e).fillEllipse(-6,-11,12,7);
      break;
    }
  }
  return root;
}
