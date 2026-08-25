import type { AttemptRecord } from '../domain/types';

// Camada simples de persistência do acompanhamento das atividades.
// Hoje grava em localStorage; no futuro pode ser trocado por backend/arquivo
// mantendo a mesma interface (saveAttempt / loadAttempts / summarize).

const STORAGE_KEY = 'curricularizacao:attempts';

/** Lê todos os registros salvos. Nunca lança — retorna [] em caso de erro. */
export function loadAttempts(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AttemptRecord[]) : [];
  } catch {
    return [];
  }
}

/** Acrescenta um registro de tentativa ao histórico. */
export function saveAttempt(record: AttemptRecord): void {
  try {
    const all = loadAttempts();
    all.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia): ignora
    // silenciosamente — o jogo não deve travar por causa do registro.
  }
}

/** Apaga todo o histórico (útil em testes e para reiniciar). */
export function clearAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignora */
  }
}

export interface ProgressSummary {
  total: number;
  correct: number;
  errors: number;
  /** Proporção de acertos, de 0 a 1. */
  accuracy: number;
}

/** Resumo agregado do histórico, opcionalmente filtrando por criança. */
export function summarize(child?: string): ProgressSummary {
  const records = loadAttempts().filter((r) => !child || r.child === child);
  const total = records.length;
  const correct = records.filter((r) => r.correct).length;
  return {
    total,
    correct,
    errors: total - correct,
    accuracy: total === 0 ? 0 : correct / total,
  };
}
