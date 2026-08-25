import { useMemo, useState, type ReactNode } from 'react';
import { SessionContext, type SessionValue } from './session-context';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [child, setChildState] = useState<string | null>(null);

  const value = useMemo<SessionValue>(
    () => ({
      child,
      setChild: (name) => setChildState(name.trim() || null),
      clearChild: () => setChildState(null),
    }),
    [child],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
