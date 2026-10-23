import test from 'node:test';
import assert from 'node:assert/strict';
import { PlacementSession, isLargestAnimalChoice } from '../src/domain/placement.ts';
import { PLACEMENT_ACTIVITIES, placementDefinition } from '../src/game/placementActivities.ts';
import { QUESTIONS, RESERVE_QUESTIONS, questionsFor } from '../src/game/questions.ts';

const session=id=>new PlacementSession(placementDefinition(PLACEMENT_ACTIVITIES[id]));
test('24 principais, oito por nível; reservas fora da sequência normal',()=>{
 assert.equal(QUESTIONS.length,24);
 for(const [level,prefix] of [['facil','F'],['medio','M'],['dificil','D']]) {
  assert.deepEqual(questionsFor(level).map(q=>q.id),Array.from({length:8},(_,i)=>`${prefix}0${i+1}`));
 }
 assert.equal(RESERVE_QUESTIONS.length,3);
});
test('comparação maior/menor e peixe: destino errado, fora e correto',()=>{
 assert.equal(isLargestAnimalChoice('gato'),false);assert.equal(isLargestAnimalChoice('elefante'),true);
 const s=session('F05');assert.equal(s.place('peixe','arvore').correct,false);
 assert.equal(s.place('peixe',null).correct,false);assert.equal(s.place('desconhecido','agua'),null);
 assert.deepEqual(s.place('peixe','agua'),{correct:true,completed:true,quantity:1});
 assert.equal(s.place('peixe','agua'),null);
});
test('ordenação exige posição correspondente, sem exigir ordem de arraste',()=>{
 const s=session('M01');assert.equal(s.place('gato','posicao-3').correct,false);
 assert.equal(s.place('elefante','posicao-3').completed,false);
 assert.equal(s.place('gato','posicao-1').completed,false);
 assert.equal(s.place('vaca','posicao-2').completed,true);
});
test('seis peixes: limite de dois por prato, nenhuma sobra e conclusão única',()=>{
 const s=session('D03');assert.equal(s.place('peixe-1','prato-1').quantity,1);
 assert.equal(s.place('peixe-2','prato-1').quantity,2);
 assert.equal(s.place('peixe-3','prato-1').correct,false);
 assert.equal(s.place('peixe-1','prato-2'),null);
 s.place('peixe-3','prato-2');s.place('peixe-4','prato-2');s.place('peixe-5','prato-3');
 assert.equal(s.place('peixe-6','prato-3').completed,true);
 assert.equal(s.place('peixe-6','prato-3'),null);
});
test('primeiro bola, depois gato: tentativa fora de ordem não avança',()=>{
 const s=session('D08');assert.equal(s.place('gato','casa').correct,false);
 assert.equal(s.place('bola','casa').correct,false);assert.equal(s.place('bola','caixa').completed,false);
 assert.equal(s.place('gato','casa').completed,true);
});
test('relações espaciais aceitam as duas ordens; habitats avaliam cada animal',()=>{
 for(const id of ['D02','M05','D05']) {
  const s=session(id),d=PLACEMENT_ACTIVITIES[id];
  const objects=[...d.objects].reverse();
  objects.forEach((o,index)=>{
   const wrong=d.targets.find(t=>!o.targets.includes(t.id));assert.equal(s.place(o.id,wrong.id).correct,false);
   assert.equal(s.place(o.id,o.targets[0]).completed,index===objects.length-1);
  });
 }
});
test('rejeita referências, IDs, capacidades e ordem inválidos na definição',()=>{
 const base={objects:[{id:'a',targets:['b']}],targets:[{id:'b',capacity:1}]};
 for(const invalid of [
  {...base,objects:[]}, {...base,objects:[{id:'a',targets:['fora']}]},
  {...base,objects:[...base.objects,...base.objects]},
  {...base,targets:[{id:'b',capacity:0}]}, {...base,order:['fora']}, {...base,order:[]},
 ])assert.throws(()=>new PlacementSession(invalid));
});
