import type { PlacementDefinition } from '../domain/placement';

export type AnimalName = 'cat' | 'cow' | 'elephant' | 'lion' | 'fish' | 'monkey' | 'bird';
export interface PlacementObject { id: string; animal?: AnimalName; x: number; y: number; size: number; targets: string[]; }
export interface PlacementTarget { id: string; visual: 'water' | 'forest' | 'pasture' | 'tree' | 'slot' | 'above-tree' | 'beside-house' | 'plate' | 'box' | 'house'; x: number; y: number; width: number; height: number; capacity: number; }
export interface PlacementActivity { objects: PlacementObject[]; targets: PlacementTarget[]; order?: string[]; }
const target = (id: string, visual: PlacementTarget['visual'], x: number, y = 390, capacity = 1): PlacementTarget => ({ id, visual, x, y, width: 245, height: 155, capacity });
const animal = (id: string, name: AnimalName, x: number, targets: string[], y = 215, size = 110): PlacementObject => ({ id, animal: name, x, y, size, targets });
const habitats = (capacity = 1) => [target('agua','water',200,390,capacity), target('floresta','forest',480,390,capacity), target('pasto','pasture',760,390,capacity)];

export const PLACEMENT_ACTIVITIES: Record<string, PlacementActivity> = {
  F05: { objects: [animal('peixe','fish',170,['agua'],320,165)], targets: [target('agua','water',490,355),target('arvore','tree',790,355)] },
  M01: {
    objects: [animal('vaca','cow',250,['posicao-2'],215,130),animal('elefante','elephant',480,['posicao-3'],215,180),animal('gato','cat',710,['posicao-1'],215,85)],
    targets: [300,480,660].map((x,i) => ({...target(`posicao-${i+1}`,'slot',x),width:155,height:140})),
  },
  M05: { objects: [animal('peixe','fish',200,['agua']),animal('macaco','monkey',480,['floresta']),animal('vaca','cow',760,['pasto'])], targets: habitats() },
  D02: { objects: [animal('passaro','bird',150,['acima-arvore'],240),animal('gato','cat',150,['lado-casa'],410)], targets: [{...target('acima-arvore','above-tree',440,220),width:180,height:100},{...target('lado-casa','beside-house',825,400),width:150,height:120}] },
  D03: { objects: Array.from({length:6},(_,i) => animal(`peixe-${i+1}`,'fish',125+i*142,['prato-1','prato-2','prato-3'],205,100)), targets: [220,480,740].map((x,i) => ({...target(`prato-${i+1}`,'plate',x,420,2),width:200,height:90})) },
  D05: { objects: [animal('peixe-1','fish',125,['agua'],210,100),animal('vaca-1','cow',267,['pasto'],210,100),animal('macaco','monkey',409,['floresta'],210,100),animal('peixe-2','fish',551,['agua'],210,100),animal('passaro','bird',693,['floresta'],210,100),animal('vaca-2','cow',835,['pasto'],210,100)], targets: habitats(2) },
  D08: { objects: [{id:'bola',x:170,y:230,size:85,targets:['caixa']},animal('gato','cat',170,['casa'],400,120)], targets: [target('caixa','box',435,350),target('casa','house',760,350)], order: ['bola','gato'] },
};

export function placementDefinition(activity: PlacementActivity): PlacementDefinition {
  return { objects: activity.objects.map(o=>({id:o.id,targets:o.targets})), targets: activity.targets.map(t=>({id:t.id,capacity:t.capacity})), order: activity.order };
}
