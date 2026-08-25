import { createContext, useContext } from 'react';
import type { ActivityId, Difficulty } from '../domain/types';

/**
 * Rotas da aplicação. Cada rota carrega os parâmetros de que precisa, então é
 * impossível chegar na tela de jogo sem ter escolhido nível e atividade.
 * (Contexto e hook ficam separados do Provider para não quebrar o Fast Refresh.)
 */
export type Route =
  | { name: 'home' }
  | { name: 'identify' }
  | { name: 'levels' }
  | { name: 'activities'; difficulty: Difficulty }
  | { name: 'game'; difficulty: Difficulty; activity: ActivityId }
  | { name: 'result'; difficulty: Difficulty; activity: ActivityId };

export type RouteName = Route['name'];

export interface NavValue {
  route: Route;
  /** Navega para uma nova rota, empilhando a atual no histórico. */
  go: (route: Route) => void;
  /** Volta uma rota; se não houver histórico, permanece onde está. */
  back: () => void;
  /** Limpa o histórico e vai direto para a home. */
  home: () => void;
  canGoBack: boolean;
}

export const NavContext = createContext<NavValue | null>(null);

export function useNav(): NavValue {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error('useNav precisa estar dentro de <NavProvider>');
  }
  return ctx;
}
