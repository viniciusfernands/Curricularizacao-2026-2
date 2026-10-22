import { createContext, useContext } from 'react';

import type { Identification } from '../domain/identification';

/** Identificação opcional da sessão, preenchida com ajuda de um adulto. */
export interface SessionValue {
  identification: Identification;
  setIdentification: (value: Partial<Identification>) => void;
}

export const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession precisa estar dentro de <SessionProvider>');
  }
  return ctx;
}
