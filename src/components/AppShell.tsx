import type { ReactNode } from 'react';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';

interface AppShellProps {
  children: ReactNode;
  /** Mostra o botão de voltar no cabeçalho. */
  showBack?: boolean;
  /** Mostra o nome da criança no cabeçalho. */
  showChild?: boolean;
}

/**
 * Moldura comum das telas: fundo lúdico, cabeçalho com botão de voltar e
 * o nome da criança, e uma área central que centraliza o conteúdo.
 */
export function AppShell({
  children,
  showBack = true,
  showChild = true,
}: AppShellProps) {
  const { back, canGoBack } = useNav();
  const { child } = useSession();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-violet-50 via-sky-50 to-emerald-50">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        {showBack && canGoBack ? (
          <button
            type="button"
            onClick={back}
            aria-label="Voltar"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-md ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/60"
          >
            {/* seta para a esquerda */}
            <span aria-hidden="true">←</span>
          </button>
        ) : (
          <div className="h-14 w-14" />
        )}

        {showChild && child && (
          <span className="rounded-full bg-white/80 px-4 py-2 text-lg font-bold text-slate-700 shadow-sm">
            👦 {child}
          </span>
        )}
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
