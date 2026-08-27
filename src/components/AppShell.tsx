import type { ReactNode } from 'react';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';

interface AppShellProps {
  children: ReactNode;
  showBack?: boolean;
  showChild?: boolean;
}

export function AppShell({
  children,
  showBack = true,
  showChild = true,
}: AppShellProps) {
  const { back, canGoBack } = useNav();
  const { child } = useSession();

  return (
    <div className="playground-shell flex min-h-full flex-col overflow-hidden">
      <div className="sky-cloud sky-cloud--one" aria-hidden="true" />
      <div className="sky-cloud sky-cloud--two" aria-hidden="true" />

      <header className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8">
        {showBack && canGoBack ? (
          <button
            type="button"
            onClick={back}
            aria-label="Voltar"
            className="cartoon-icon-button"
          >
            <span aria-hidden="true">←</span>
          </button>
        ) : (
          <div className="h-14 w-14" />
        )}

        {showChild && child && (
          <span className="child-badge">
            <span aria-hidden="true">★</span> {child}
          </span>
        )}
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10 sm:px-8">
        {children}
      </main>

      <div className="landscape-hill landscape-hill--left" aria-hidden="true" />
      <div className="landscape-hill landscape-hill--right" aria-hidden="true" />
    </div>
  );
}
