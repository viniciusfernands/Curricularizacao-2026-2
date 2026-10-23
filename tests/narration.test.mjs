import test from 'node:test';
import assert from 'node:assert/strict';
import { Narrator, portugueseVoice } from '../src/audio/narrator.ts';
import { spokenInstruction } from '../src/audio/instructions.ts';

const br = {lang:'pt-BR',default:false,localService:true};
function setup(t, voices=[br]) {
  t.mock.timers.enable({apis:['setTimeout']});
  const listeners = new Set(), spoken=[], states=[];
  const synthesis={
    getVoices:()=>voices,
    cancel:()=>{},
    speak:utterance=>spoken.push(utterance),
    addEventListener:(_event,listener)=>listeners.add(listener),
    removeEventListener:(_event,listener)=>listeners.delete(listener),
  };
  const narrator=new Narrator(synthesis,text=>({text}));
  t.after(()=>narrator.stop());
  return {narrator,spoken,states,listeners,voices,report:state=>states.push(state)};
}

test('prioriza pt-BR sobre voz padrão estrangeira e pt-PT; não escolhe outro idioma',()=>{
  const en={lang:'en-US',default:true,localService:true};
  const pt={...en,lang:'pt-PT'};
  assert.equal(portugueseVoice([en,pt,br]),br);
  assert.equal(portugueseVoice([en,pt]),pt);
  assert.equal(portugueseVoice([en]),undefined);
  assert.equal(portugueseVoice([{...br,lang:'pt_BR'}])?.lang,'pt_BR');
});

test('aguarda voiceschanged sem falar com voz estrangeira e remove listener',t=>{
  const h=setup(t,[]);
  h.narrator.speak([{text:'Olá.'}],h.report);
  assert.equal(h.spoken.length,0);
  h.voices.push(br);for(const listener of h.listeners)listener();
  assert.equal(h.spoken[0].voice,br);assert.equal(h.listeners.size,0);
});

test('pausa começa após o fim real da fala; respeita ordem e ritmo',t=>{
  const h=setup(t);
  h.narrator.speak([{text:'Primeiro.',pauseAfter:400},{text:'Depois.',rate:0.75}],h.report);
  const first=h.spoken[0];first.onstart();
  t.mock.timers.tick(3000);assert.equal(h.spoken.length,1);
  first.onend();t.mock.timers.tick(399);assert.equal(h.spoken.length,1);
  t.mock.timers.tick(1);assert.equal(h.spoken[1].text,'Depois.');assert.equal(h.spoken[1].rate,0.75);
  h.spoken[1].onstart();h.spoken[1].onend();t.mock.timers.tick(300);
  assert.equal(h.states.at(-1),'idle');
});

test('repetir e sair cancelam pausas e ignoram callbacks de falas antigas',t=>{
  const h=setup(t);
  h.narrator.speak([{text:'Antiga.'},{text:'Não tocar.'}],h.report);
  const stale=h.spoken[0].onend;
  h.narrator.speak([{text:'Nova.'}],h.report);stale();
  h.spoken[1].onstart();h.spoken[1].onend();h.narrator.stop();
  t.mock.timers.tick(10000);
  assert.deepEqual(h.spoken.map(u=>u.text),['Antiga.','Nova.']);
  assert.equal(h.listeners.size,0);
});

test('sem voz portuguesa informa indisponibilidade; clique posterior permite recuperação',t=>{
  const h=setup(t,[]);h.narrator.speak([{text:'Olá.'}],h.report);
  t.mock.timers.tick(1500);assert.equal(h.states.at(-1),'unavailable');assert.equal(h.listeners.size,0);
  h.voices.push(br);h.narrator.speak([{text:'Olá.'}],h.report);
  h.spoken[0].onstart();assert.equal(h.states.at(-1),'speaking');
});

test('bloqueio de reprodução e falha do serviço encerram a sequência',t=>{
  const h=setup(t);h.narrator.speak([{text:'Olá.'},{text:'Não tocar.'}],h.report);
  h.spoken[0].onerror({error:'not-allowed'});assert.equal(h.states.at(-1),'blocked');
  t.mock.timers.tick(10000);assert.equal(h.spoken.length,1);
  h.narrator.speak([{text:'Outra.'}],h.report);h.spoken[1].onerror({error:'network'});
  assert.equal(h.states.at(-1),'error');
});

test('silêncio sem evento de início não fica indefinidamente em carregamento',t=>{
  const h=setup(t);h.narrator.speak([{text:'Olá.'}],h.report);
  t.mock.timers.tick(5000);assert.equal(h.states.at(-1),'blocked');
});

test('roteiros separam sílabas e duas etapas sem revelar a resposta ou trocar fonema por letra',()=>{
  const bola = spokenInstruction('F07','');
  assert.equal(bola[0].text, 'Ouça a palavra bola.');
  assert.deepEqual(bola.slice(1,-1).map(p=>p.text), ['Bó... la.']);
  assert.equal(bola[1].rate, 0.9);
  assert.deepEqual(spokenInstruction('D06','').slice(1,-1).map(p=>p.text),['ja','ne','la']);
  assert.equal(spokenInstruction('M06','')[1].text,'mmm');
  assert.deepEqual(spokenInstruction('D08','Primeiro, coloque a bola na caixa. Depois, leve o gato até a casa.').map(p=>p.text),['Primeiro, coloque a bola na caixa.','Depois, leve o gato até a casa.']);
});

test('destruir narrador antigo duas vezes não cancela áudio da nova cena',t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  let cancellations=0;
  const synthesis={getVoices:()=>[br],speak:()=>{},cancel:()=>cancellations++,addEventListener:()=>{},removeEventListener:()=>{}};
  const old=new Narrator(synthesis,text=>({text}));const next=new Narrator(synthesis,text=>({text}));
  t.after(()=>{old.stop();next.stop();});
  old.speak([{text:'Antiga.'}],()=>{});old.stop();assert.equal(cancellations,1);
  next.speak([{text:'Nova.'}],()=>{});old.stop();assert.equal(cancellations,1);
});
