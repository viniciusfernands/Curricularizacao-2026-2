import Phaser from 'phaser';

/** Painel vetorial: mantém contorno e cantos suaves em qualquer escala. */
export function roundedPanel(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fill = 0xffffff, stroke = 0xc4b5fd, alpha = 1) {
  const art = scene.add.graphics();
  const radius = Math.min(26, height / 4);
  art.fillStyle(0x493069, 0.12).fillRoundedRect(-width / 2, -height / 2 + 6, width, height, radius);
  art.fillStyle(fill, alpha).fillRoundedRect(-width / 2, -height / 2, width, height, radius);
  art.lineStyle(4, stroke).strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
  return scene.add.container(x, y, [art]).setSize(width, height);
}

/** Ilustrações próprias, sem alterar os sprites originais dos animais. */
export function vessel(scene: Phaser.Scene, x: number, y: number, width: number, height: number, kind: 'box' | 'basket', color = 0xe9ad60) {
  const art = scene.add.graphics();
  const edge = 0x704322;
  const polygon = (points: number[], fill: number) => {
    art.fillStyle(fill).lineStyle(4, edge);
    art.beginPath(); art.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) art.lineTo(points[i], points[i + 1]);
    art.closePath(); art.fillPath(); art.strokePath();
  };
  art.fillStyle(0x45633c, 0.16).fillEllipse(0, 91, 265, 24);
  if (kind === 'box') {
    polygon([-112,-58, 70,-74, 123,-43, -62,-24], 0xa16c3b);
    polygon([-112,-58, -62,-24, -62,89, -112,56], 0xc18a49);
    polygon([-62,-24,123,-43,112,65,-62,89], color);
    polygon([-112,-58,-143,-82,42,-98,70,-74], 0xf9d394);
    polygon([70,-74,123,-43,145,-69,100,-101], 0xf4c47f);
    polygon([-112,-58,-62,-24,-91,9,-139,-28], 0xf6cc8a);
    polygon([-62,-24,123,-43,141,-6,-40,17], 0xffdda1);
    art.lineStyle(9, 0xffe8b3, 0.6).lineBetween(18,15,17,72);
    art.lineStyle(3, edge, 0.3).lineBetween(-50,72,0,65);
  } else {
    art.lineStyle(18, edge).beginPath().arc(0,-30,98,Math.PI,Math.PI*2).strokePath();
    art.lineStyle(10, 0xefbc71).beginPath().arc(0,-30,98,Math.PI,Math.PI*2).strokePath();
    art.fillStyle(0x84512f).fillEllipse(0,-30,270,65);
    polygon([-130,-28,130,-28,103,79,85,92,-85,92,-103,79], 0xe5a34f);
    art.lineStyle(5, 0xb97632);
    for (const row of [0,24,48,72]) art.lineBetween(-116+row/5,row,116-row/5,row);
    for (const col of [-80,-40,0,40,80]) art.lineBetween(col,-17,col*0.8,85);
    art.lineStyle(4, 0xffd78d);
    for (const row of [6,30,54,78]) art.lineBetween(-114+row/5,row,114-row/5,row);
    art.fillStyle(0xf6c97e).fillRoundedRect(-138,-40,276,22,11);
    art.lineStyle(4, edge).strokeRoundedRect(-138,-40,276,22,11);
  }
  return scene.add.container(x, y, [art]).setSize(width, height).setScale(width / 300, height / 220);
}
