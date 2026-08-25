import type { ActivityId } from './types';

/**
 * Catálogo das categorias de atividade exibidas no menu de seleção.
 *
 * Por enquanto usa emojis como ícone provisório — serão substituídos por SVGs
 * (Inkscape) / ilustrações (Krita) quando os assets estiverem prontos.
 * As cores usam classes utilitárias do Tailwind para o fundo de cada card.
 */
export interface ActivityMeta {
  id: ActivityId;
  label: string;
  description: string;
  /** Ícone provisório (emoji). Trocar por asset depois. */
  icon: string;
  /** Classes Tailwind para o fundo do card (tom pastel, alto contraste). */
  color: string;
  /** Marca categorias ainda não implementadas (some do menu por ora). */
  available: boolean;
}

export const ACTIVITIES: ActivityMeta[] = [
  {
    id: 'contagem',
    label: 'Contagem',
    description: 'Números e quantidades',
    icon: '🔢',
    color: 'bg-sky-100 hover:bg-sky-200',
    available: false,
  },
  {
    id: 'cores',
    label: 'Cores',
    description: 'Reconhecer as cores',
    icon: '🎨',
    color: 'bg-rose-100 hover:bg-rose-200',
    available: false,
  },
  {
    id: 'silabas',
    label: 'Sons e Sílabas',
    description: 'Consciência fonológica',
    icon: '🔤',
    color: 'bg-amber-100 hover:bg-amber-200',
    available: false,
  },
  {
    id: 'espaco',
    label: 'Noções de Espaço',
    description: 'Em cima, embaixo, ao lado',
    icon: '🧭',
    color: 'bg-emerald-100 hover:bg-emerald-200',
    available: false,
  },
  {
    id: 'percepcao',
    label: 'Percepção Visual',
    description: 'Achar e comparar',
    icon: '👁️',
    color: 'bg-violet-100 hover:bg-violet-200',
    available: false,
  },
  {
    id: 'animais',
    label: 'Animais',
    description: 'Bichos e seus habitats',
    icon: '🐘',
    color: 'bg-lime-100 hover:bg-lime-200',
    available: false,
  },
];

export function getActivity(id: ActivityId): ActivityMeta | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
