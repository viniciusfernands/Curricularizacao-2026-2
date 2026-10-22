import type { RunSnapshot } from '../domain/progress';

/** A chave antiga curricularizacao:attempts é preservada, sem migração inferida. */
export const RUN_STORAGE_PREFIX = 'curricularizacao:run:v2:';

/** Grava a partida a cada interação. Cada execução tem sua própria chave. */
export function saveRun(
  run: RunSnapshot,
  getStorage: () => Pick<Storage, 'setItem'> = () => localStorage,
): boolean {
  try {
    getStorage().setItem(`${RUN_STORAGE_PREFIX}${run.id}`, JSON.stringify(run));
    return true;
  } catch {
    // O resumo continua disponível em memória; a interface informa a falha.
    return false;
  }
}
