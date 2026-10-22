/** Folhas inspecionadas: walk tem 3 poses; happy, 2. O restante é transparente. */
export const CAT_SPRITES = [
  { key: 'cat-idle', file: 'cat_idle.png', width: 565, height: 550, frames: 4, rate: 3 },
  { key: 'cat-walk', file: 'cat_walk.png', width: 572, height: 539, frames: 3, rate: 7 },
  { key: 'cat-happy', file: 'cat_happy.png', width: 502, height: 537, frames: 2, rate: 6 },
  { key: 'cat-think', file: 'cat_think.png', width: 540, height: 554, frames: 3, rate: 5 },
] as const;
