import { useMemo, useState, type ReactNode } from 'react';
import { normalizeIdentification } from '../domain/identification';
import { SessionContext, type SessionValue } from './session-context';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [identification, setIdentificationState] = useState(() => normalizeIdentification());

  const value = useMemo<SessionValue>(
    () => ({
      identification,
      setIdentification: (value) => setIdentificationState(normalizeIdentification(value)),
    }),
    [identification],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
