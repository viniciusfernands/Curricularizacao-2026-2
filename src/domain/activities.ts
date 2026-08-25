import type { ActivityId } from './types';

/**
 * Temas pedagógicos das perguntas (ver README).
 *
 * Não há menu de seleção de tema: as perguntas de um nível misturam todos os
 * temas. Este catálogo serve apenas como rótulo/ícone de cada tema — usado,
 * por exemplo, nos relatórios de acompanhamento (quais habilidades a criança
 * acertou/errou). Os emojis são provisórios e serão trocados por SVGs.
 */
export interface ActivityMeta {
  id: ActivityId;
  label: string;
  /** Ícone provisório (emoji). Trocar por asset depois. */
  icon: string;
}

export const ACTIVITIES: ActivityMeta[] = [
  { id: 'contagem', label: 'Contagem', icon: '🔢' },
  { id: 'cores', label: 'Cores', icon: '🎨' },
  { id: 'silabas', label: 'Sons e Sílabas', icon: '🔤' },
  { id: 'espaco', label: 'Noções de Espaço', icon: '🧭' },
  { id: 'percepcao', label: 'Percepção Visual', icon: '👁️' },
  { id: 'animais', label: 'Animais', icon: '🐘' },
];

export function getActivity(id: ActivityId): ActivityMeta | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
