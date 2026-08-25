// Tipos de domínio compartilhados por toda a aplicação (menus e, futuramente, jogo).

/** Níveis de dificuldade previstos no projeto. */
export type Difficulty = 'facil' | 'medio' | 'dificil';

export const DIFFICULTIES: Difficulty[] = ['facil', 'medio', 'dificil'];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

/**
 * Áreas/categorias pedagógicas que o jogo pode abordar (ver README).
 * Cada categoria será, futuramente, um conjunto de atividades no Phaser.
 */
export type ActivityId =
  | 'contagem'
  | 'cores'
  | 'silabas'
  | 'espaco'
  | 'percepcao'
  | 'animais';

/**
 * Tipos de interação de uma questão (como ela é jogada).
 * Usado quando as atividades forem transformadas em dados (JSON) — ver
 * docs/ARQUITETURA.md. Ainda não é consumido pelos menus.
 */
export type ActivityType =
  | 'image-choice'
  | 'audio-choice'
  | 'counting'
  | 'drag-and-drop'
  | 'color-choice'
  | 'letter-choice'
  | 'syllable-count';

/**
 * Registro de um resultado de questão. Gerado pela camada de jogo e consumido
 * pela camada de acompanhamento (localStorage hoje; backend no futuro).
 */
export interface AttemptRecord {
  /** Nome da criança que jogou (identificação feita pelo professor). */
  child: string;
  activity: ActivityId;
  difficulty: Difficulty;
  /** ISO string do momento em que a questão foi respondida. */
  timestamp: string;
  correct: boolean;
  /** Nº de tentativas até acertar (ou desistir) naquela questão. */
  attempts: number;
}
