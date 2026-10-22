import test from 'node:test';
import assert from 'node:assert/strict';
import { ProgressRun } from '../src/domain/progress.ts';
import { saveRun, RUN_STORAGE_PREFIX } from '../src/data/progress.ts';
import { QUESTIONS, questionsFor } from '../src/game/questions.ts';

const startedAt = '2026-10-21T12:00:00.000Z';
const timestamp = '2026-10-21T12:01:00.000Z';
function run(id = 'run-1', difficulty = 'facil', child = 'Criança de teste') {
  return new ProgressRun({ id, child, difficulty, questions: questionsFor(difficulty), startedAt });
}
function event(eventId, questionId, result, completed = false, action = { type: 'select', optionId: 'A' }) {
  return { eventId, questionId, result, completed, timestamp, action };
}

test('erro, erro, acerto registra três tentativas da pergunta com metadados e horário', () => {
  const journal = run();
  journal.record(event('1', 'F04', 'incorrect'));
  journal.record(event('2', 'F04', 'incorrect'));
  journal.record(event('3', 'F04', 'correct', true));
  const records = journal.snapshot().records;
  assert.deepEqual(records.map(r => r.attemptNumber), [1, 2, 3]);
  assert.deepEqual(records.map(r => r.sequence), [1, 2, 3]);
  assert.ok(records.every(r => r.timestamp === timestamp && r.child === 'Criança de teste'));
  assert.equal(records[0].objective.area, 'cores');
  assert.equal(records[0].objective.skillId, 'reconhecer-azul');
  const summary = journal.summarize();
  assert.equal(summary.attempts, 3);
  assert.equal(summary.correct, 1);
  assert.equal(summary.errors, 2);
  assert.equal(summary.completedQuestions, 1);
});

test('sete atividades e dois erros resultam em nove tentativas, sete acertos e dois erros', () => {
  const journal = run();
  journal.record(event('erro-1', 'F04', 'incorrect'));
  journal.record(event('erro-2', 'F04', 'incorrect'));
  journal.record(event('maca-1', 'F03', 'progress'));
  journal.record(event('maca-2', 'F03', 'progress'));
  for (const question of questionsFor('facil')) {
    journal.record(event(question.id, question.id, 'correct', true));
  }
  const summary = journal.summarize();
  assert.equal(summary.attempts, 9);
  assert.equal(summary.correct, 7);
  assert.equal(summary.errors, 2);
  assert.equal(summary.completedQuestions, 7);
  assert.equal(journal.snapshot().completedAt, timestamp);
  assert.equal(summary.questions.find(q => q.questionId === 'F03').attempts, 1);
});

test('progresso de contagem preserva a quantidade e não incrementa tentativas', () => {
  const journal = run();
  for (let quantity = 1; quantity <= 3; quantity++) {
    journal.record(event(String(quantity), 'F03', quantity === 3 ? 'correct' : 'progress', quantity === 3,
      { type: 'count', objectId: `maca-${quantity}`, targetId: 'cesta', quantity, expected: 3 }));
  }
  assert.deepEqual(journal.snapshot().records.map(r => r.attemptNumber), [null, null, 1]);
  assert.deepEqual(journal.snapshot().records.map(r => r.action.quantity), [1, 2, 3]);
  assert.equal(journal.summarize().correct, 1);
});

test('classificação registra cada posicionamento; conclusão não soma um acerto extra', () => {
  const journal = run('sorting', 'medio');
  for (let index = 0; index < 6; index++) {
    journal.record(event(String(index), 'M04', 'correct', index === 5,
      { type: 'drop', objectId: `objeto-${index}`, targetId: 'vermelho' }));
  }
  assert.equal(journal.summarize().correct, 6);
  assert.equal(journal.summarize().completedQuestions, 1);
  assert.equal(journal.record(event('extra', 'M04', 'correct', true)), null);
  assert.equal(journal.summarize().correct, 6);
});

test('memória conta pares avaliados, incluindo os três pares corretos', () => {
  const journal = run('memory', 'medio');
  journal.record(event('erro', 'X01', 'incorrect', false,
    { type: 'pair', cardIds: ['0', '1'], symbols: ['gato', 'bola'] }));
  for (let pair = 0; pair < 3; pair++) {
    journal.record(event(String(pair), 'X01', 'correct', pair === 2,
      { type: 'pair', cardIds: [`${pair}a`, `${pair}b`], symbols: ['gato', 'gato'] }));
  }
  assert.equal(journal.summarize().attempts, 4);
  assert.equal(journal.summarize().correct, 3);
  assert.equal(journal.summarize().errors, 1);
});

test('rejeita eventos duplicados, perguntas fora do nível e conclusão sem acerto', () => {
  const journal = run();
  const first = event('same', 'F04', 'incorrect');
  assert.ok(journal.record(first));
  assert.equal(journal.record(first), null);
  assert.equal(journal.record(event('outside', 'M04', 'correct')), null);
  assert.equal(journal.record(event('invalid', 'F04', 'progress', true)), null);
  journal.record(event('complete', 'F04', 'correct', true));
  assert.equal(journal.record(event('late', 'F04', 'incorrect')), null);
  assert.equal(journal.summarize().attempts, 2);
});

test('novas partidas da mesma criança e de outras crianças têm resumos independentes', () => {
  const first = run('first');
  first.record(event('1', 'F04', 'incorrect'));
  first.record(event('2', 'F04', 'correct', true));
  for (const next of [run('replay'), run('other', 'medio', 'Outra criança de teste')]) {
    assert.equal(next.summarize().attempts, 0);
    assert.equal(next.summarize().completedQuestions, 0);
  }
});

test('preserva histórico legado e outras partidas e grava antes da conclusão', () => {
  const legacy = '[{"child":"Legado","correct":true,"attempts":9}]';
  const data = new Map([['curricularizacao:attempts', legacy]]);
  const storage = () => ({ setItem: (key, value) => data.set(key, value) });
  const journal = run();
  journal.record(event('1', 'F02', 'incorrect'));
  assert.equal(saveRun(journal.snapshot(), storage), true);
  const partial = JSON.parse(data.get(`${RUN_STORAGE_PREFIX}run-1`));
  assert.equal(partial.completedAt, null);
  assert.equal(partial.records.length, 1);
  assert.equal(partial.records[0].questionId, 'F02');
  const other = run('other');
  other.record(event('2', 'F04', 'correct', true));
  saveRun(other.snapshot(), storage);
  assert.equal(data.size, 3);
  assert.equal(data.get('curricularizacao:attempts'), legacy);
});

test('falha de acesso ou cota mantém resumo em memória e próxima gravação recupera a partida', () => {
  const journal = run();
  journal.record(event('1', 'F04', 'incorrect'));
  assert.equal(saveRun(journal.snapshot(), () => { throw new Error('blocked'); }), false);
  assert.equal(saveRun(journal.snapshot(), () => ({ setItem() { throw new Error('quota'); } })), false);
  journal.record(event('2', 'F04', 'correct', true));
  let saved;
  assert.equal(saveRun(journal.snapshot(), () => ({ setItem(_key, value) { saved = JSON.parse(value); } })), true);
  assert.equal(saved.records.length, 2);
  assert.equal(journal.summarize().attempts, 2);
});

test('todas as 19 perguntas têm metadados e IDs de habilidade; classificação reflete conteúdo real', () => {
  assert.equal(QUESTIONS.length, 19);
  assert.equal(new Set(QUESTIONS.map(q => q.id)).size, 19);
  for (const question of QUESTIONS) {
    for (const value of Object.values(question.objective)) assert.ok(value.trim().length > 0);
  }
  assert.equal(QUESTIONS.find(q => q.id === 'D01').objective.area, 'grandezas');
  assert.equal(QUESTIONS.find(q => q.id === 'X03').objective.area, 'audicao');
  assert.equal(QUESTIONS.find(q => q.id === 'F06').objective.area, 'letras');
});


test('identificação vazia ou parcial permite registrar e salvar tentativas', () => {
  for (const identification of [{}, { school: '  Escola de teste  ', schoolYear: ' 5º ano ', child: '   ' }]) {
    const journal = new ProgressRun({ id: 'optional', difficulty: 'facil', questions: questionsFor('facil'), startedAt, ...identification });
    assert.ok(journal.record(event('1', 'F02', 'correct', true)));
    let saved;
    assert.equal(saveRun(journal.snapshot(), () => ({ setItem(_key, value) { saved = JSON.parse(value); } })), true);
    for (const item of [saved, ...saved.records]) {
      assert.equal(item.child, '');
      assert.equal(item.teacher, '');
      assert.equal(item.classGroup, '');
      assert.equal(item.school, identification.school?.trim() ?? '');
      assert.equal(item.schoolYear, identification.schoolYear?.trim() ?? '');
    }
    assert.equal(journal.summarize().completedQuestions, 1);
  }
});

test('dados completos são copiados para a partida e tentativas sem contaminar próxima sessão', () => {
  const identification = { school: ' Escola ', classGroup: ' A ', schoolYear: ' 6º ano ', teacher: ' Professora ', child: ' Nome ' };
  const journal = new ProgressRun({ id: 'full', difficulty: 'facil', questions: questionsFor('facil'), startedAt, ...identification });
  identification.teacher = 'Outra professora';
  journal.record(event('1', 'F02', 'incorrect'));
  journal.record(event('2', 'F02', 'correct', true));
  let saved;
  saveRun(journal.snapshot(), () => ({ setItem(_key, value) { saved = JSON.parse(value); } }));
  for (const item of [saved, ...saved.records]) {
    assert.equal(item.school, 'Escola');
    assert.equal(item.classGroup, 'A');
    assert.equal(item.schoolYear, '6º ano');
    assert.equal(item.teacher, 'Professora');
    assert.equal(item.child, 'Nome');
  }
  const next = new ProgressRun({ id: 'next', difficulty: 'facil', questions: questionsFor('facil'), startedAt });
  assert.equal(next.snapshot().child, '');
  assert.equal(next.snapshot().school, '');
  assert.equal(next.summarize().attempts, 0);
});
