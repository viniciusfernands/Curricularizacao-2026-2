import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { NavContext, type NavValue, type Route } from './nav-context';

/**
 * Navegação por estado tipado (sem react-router).
 *
 * Um jogo estilo quiosque para crianças não deve depender do botão "voltar"
 * do navegador; o fluxo é controlado por botões grandes na tela. Se um dia for
 * preciso deep-linking/URLs, dá para trocar por react-router sem alterar as
 * telas — basta reimplementar o hook useNav (ver nav-context.ts).
 */
export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);

  const go = useCallback((route: Route) => {
    setStack((prev) => [...prev, route]);
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const home = useCallback(() => {
    setStack([{ name: 'home' }]);
  }, []);

  const value = useMemo<NavValue>(
    () => ({
      route: stack[stack.length - 1],
      go,
      back,
      home,
      canGoBack: stack.length > 1,
    }),
    [stack, go, back, home],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
