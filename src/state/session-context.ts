import { createContext, useContext } from 'react';

/**
 * Sessão da criança atual. A identificação é feita pelo professor (a criança
 * de 5–6 anos não digita), então guardamos apenas o nome por enquanto.
 * (Contexto e hook ficam separados do Provider para não quebrar o Fast Refresh.)
 */
export interface SessionValue {
  child: string | null;
  setChild: (name: string) => void;
  clearChild: () => void;
}

export const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession precisa estar dentro de <SessionProvider>');
  }
  return ctx;
}
