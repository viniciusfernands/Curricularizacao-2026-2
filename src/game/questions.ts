import type { ActivityId, Difficulty } from '../domain/types';

export interface GameQuestion {
  id: string;
  difficulty: Difficulty;
  activity: ActivityId;
  title: string;
  instruction: string;
  kind:
    | 'cat-in-box' | 'apple-count' | 'blue-choice' | 'letter-a'
    | 'syllable-two' | 'different-shape' | 'ball-under-table'
    | 'star-count' | 'two-colors' | 'initial-sound' | 'initial-letter'
    | 'alternating-sequence' | 'ball-order' | 'three-colors'
    | 'syllable-three' | 'word-sol' | 'memory' | 'house-choice'
    | 'aab-sequence';
}

export const QUESTIONS: GameQuestion[] = [
  { id: 'F02', difficulty: 'facil', activity: 'espaco', kind: 'cat-in-box', title: 'Onde fica o gato?', instruction: 'Coloque o gato dentro da caixa.' },
  { id: 'F03', difficulty: 'facil', activity: 'contagem', kind: 'apple-count', title: 'Vamos contar?', instruction: 'Coloque três maçãs na cesta.' },
  { id: 'F04', difficulty: 'facil', activity: 'cores', kind: 'blue-choice', title: 'Qual é a cor azul?', instruction: 'Toque na cor azul.' },
  { id: 'F06', difficulty: 'facil', activity: 'silabas', kind: 'letter-a', title: 'Encontre a letra A', instruction: 'Esta é a letra A. Toque na letra A.' },
  { id: 'F07', difficulty: 'facil', activity: 'silabas', kind: 'syllable-two', title: 'BO-LA tem quantas partes?', instruction: 'Ouça: BO-LA. Quantas partes você ouviu?' },
  { id: 'F08', difficulty: 'facil', activity: 'percepcao', kind: 'different-shape', title: 'Qual figura é diferente?', instruction: 'Qual figura é diferente das outras?' },
  { id: 'X03', difficulty: 'facil', activity: 'percepcao', kind: 'house-choice', title: 'Onde está a casa?', instruction: 'Ouça: CASA. Toque na figura que mostra uma casa.' },
  { id: 'M02', difficulty: 'medio', activity: 'espaco', kind: 'ball-under-table', title: 'Onde fica embaixo?', instruction: 'Coloque a bola embaixo da mesa.' },
  { id: 'M03', difficulty: 'medio', activity: 'contagem', kind: 'star-count', title: 'Vamos contar até cinco?', instruction: 'Coloque cinco estrelas dentro da caixa.' },
  { id: 'M04', difficulty: 'medio', activity: 'cores', kind: 'two-colors', title: 'Separe pelas cores', instruction: 'Coloque os objetos vermelhos na caixa vermelha e os objetos azuis na caixa azul.' },
  { id: 'M06', difficulty: 'medio', activity: 'silabas', kind: 'initial-sound', title: 'Qual começa com o som M?', instruction: 'Ouça o som: mmm. Qual figura começa com esse som?' },
  { id: 'M07', difficulty: 'medio', activity: 'silabas', kind: 'initial-letter', title: 'Qual é a primeira letra de BOLA?', instruction: 'Qual é a primeira letra de BOLA? Arraste a letra até a figura.' },
  { id: 'M08', difficulty: 'medio', activity: 'percepcao', kind: 'alternating-sequence', title: 'Qual figura vem depois?', instruction: 'Observe a sequência. Qual figura vem depois?' },
  { id: 'X01', difficulty: 'medio', activity: 'percepcao', kind: 'memory', title: 'Encontre os pares', instruction: 'Encontre os pares de figuras iguais.' },
  { id: 'D01', difficulty: 'dificil', activity: 'percepcao', kind: 'ball-order', title: 'Da menor para a maior', instruction: 'Coloque as bolas da menor para a maior.' },
  { id: 'D04', difficulty: 'dificil', activity: 'cores', kind: 'three-colors', title: 'Separe em três cores', instruction: 'Separe os objetos nas caixas da mesma cor.' },
  { id: 'D06', difficulty: 'dificil', activity: 'silabas', kind: 'syllable-three', title: 'JA-NE-LA tem quantas partes?', instruction: 'Ouça: JA-NE-LA. Coloque uma estrela para cada parte da palavra.' },
  { id: 'D07', difficulty: 'dificil', activity: 'silabas', kind: 'word-sol', title: 'Forme a palavra SOL', instruction: 'Esta palavra é SOL. Coloque as letras na ordem certa.' },
  { id: 'X04', difficulty: 'dificil', activity: 'percepcao', kind: 'aab-sequence', title: 'Qual figura vem depois?', instruction: 'Observe a sequência. Qual figura vem depois?' },
];

export const questionsFor = (difficulty: Difficulty) =>
  QUESTIONS.filter((question) => question.difficulty === difficulty);

export const SKIPPED_ANIMAL_QUESTIONS = [
  { id: 'F01', missing: ['rato'] },
  { id: 'F05', missing: ['peixe'] },
  { id: 'M01', missing: ['rato', 'cachorro'] },
  { id: 'M05', missing: ['peixe', 'macaco'] },
  { id: 'D02', missing: ['pássaro', 'cachorro'] },
  { id: 'D03', missing: ['peixe'] },
  { id: 'D05', missing: ['peixe', 'polvo', 'macaco', 'tucano', 'cavalo'] },
  { id: 'D08', missing: ['cachorro'] },
  { id: 'X02', missing: ['coelho', 'macaco'] },
] as const;
