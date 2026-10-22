import { normalizeIdentification, type Identification } from './identification.ts';
import type { Difficulty } from './types';
import type { PedagogicalObjective } from './pedagogy';

export function createProgressId(): string {
  return globalThis.crypto.randomUUID?.() ?? Array.from(
    globalThis.crypto.getRandomValues(new Uint32Array(4)),
    (value) => value.toString(16).padStart(8, '0'),
  ).join('-');
}

export type InteractionAction =
  | { type: 'select'; optionId: string }
  | { type: 'drop'; objectId: string; targetId: string | null }
  | { type: 'count'; objectId: string; targetId: string | null; quantity: number; expected: number }
  | { type: 'pair'; cardIds: [string, string]; symbols: [string, string] };

export interface QuestionInteraction {
  eventId: string;
  questionId: string;
  timestamp: string;
  action: InteractionAction;
  result: 'correct' | 'incorrect' | 'progress';
  completed: boolean;
}

export interface InteractionRecord extends QuestionInteraction, Identification {
  schemaVersion: 2;
  runId: string;
  difficulty: Difficulty;
  objective: PedagogicalObjective;
  /** Sequência de interações na partida, incluindo progresso intermediário. */
  sequence: number;
  /** Tentativa avaliada dentro da pergunta; null para progresso intermediário. */
  attemptNumber: number | null;
}

export interface RunSnapshot extends Identification {
  schemaVersion: 2;
  id: string;
  difficulty: Difficulty;
  questionCount: number;
  startedAt: string;
  completedAt: string | null;
  records: readonly InteractionRecord[];
}

export interface ProgressTotals {
  attempts: number;
  correct: number;
  errors: number;
  completedQuestions: number;
}

export interface QuestionSummary extends ProgressTotals {
  questionId: string;
  objective: PedagogicalObjective;
}

export interface RunSummary extends ProgressTotals {
  runId: string;
  questionCount: number;
  questions: QuestionSummary[];
}

interface TrackedQuestion {
  id: string;
  difficulty: Difficulty;
  objective: PedagogicalObjective;
}

/** Uma instância por partida. Independente de React, Phaser e armazenamento. */
export class ProgressRun {
  private readonly records: InteractionRecord[] = [];
  private readonly eventIds = new Set<string>();
  private readonly completedIds = new Set<string>();
  private readonly attempts = new Map<string, number>();
  private readonly questions: Map<string, TrackedQuestion>;
  private completedAt: string | null = null;
  readonly id: string;
  private readonly identification: Identification;
  private readonly difficulty: Difficulty;
  private readonly startedAt: string;

  constructor(options: Partial<Identification> & {
    id: string;
    difficulty: Difficulty;
    questions: readonly TrackedQuestion[];
    startedAt: string;
  }) {
    this.id = options.id;
    this.identification = normalizeIdentification(options);
    this.difficulty = options.difficulty;
    this.startedAt = options.startedAt;
    this.questions = new Map(options.questions.map((question) => [question.id, question]));
  }

  record(event: QuestionInteraction): InteractionRecord | null {
    const question = this.questions.get(event.questionId);
    if (!question || question.difficulty !== this.difficulty ||
      this.eventIds.has(event.eventId) || this.completedIds.has(event.questionId) ||
      (event.completed && event.result !== 'correct')) return null;

    const evaluated = event.result !== 'progress';
    const attemptNumber = evaluated ? (this.attempts.get(question.id) ?? 0) + 1 : null;
    if (attemptNumber !== null) this.attempts.set(question.id, attemptNumber);
    const record: InteractionRecord = {
      ...event,
      schemaVersion: 2,
      runId: this.id,
      ...this.identification,
      difficulty: this.difficulty,
      objective: { ...question.objective },
      sequence: this.records.length + 1,
      attemptNumber,
    };
    this.eventIds.add(event.eventId);
    this.records.push(record);
    if (event.completed) {
      this.completedIds.add(question.id);
      if (this.completedIds.size === this.questions.size) this.completedAt = event.timestamp;
    }
    return record;
  }

  snapshot(): RunSnapshot {
    return {
      schemaVersion: 2,
      id: this.id,
      ...this.identification,
      difficulty: this.difficulty,
      questionCount: this.questions.size,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      records: [...this.records],
    };
  }

  summarize(): RunSummary {
    const questions = [...this.questions.values()].map((question): QuestionSummary => {
      const records = this.records.filter((record) => record.questionId === question.id);
      const correct = records.filter((record) => record.result === 'correct').length;
      const errors = records.filter((record) => record.result === 'incorrect').length;
      return {
        questionId: question.id,
        objective: question.objective,
        correct,
        errors,
        attempts: correct + errors,
        completedQuestions: this.completedIds.has(question.id) ? 1 : 0,
      };
    });
    const correct = questions.reduce((sum, question) => sum + question.correct, 0);
    const errors = questions.reduce((sum, question) => sum + question.errors, 0);
    return {
      runId: this.id,
      questionCount: this.questions.size,
      attempts: correct + errors,
      correct,
      errors,
      completedQuestions: this.completedIds.size,
      questions,
    };
  }
}
