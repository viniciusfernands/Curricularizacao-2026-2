export const AREA_LABELS = {
  grandezas: 'Grandezas e comparações',
  espaco: 'Noções espaciais',
  contagem: 'Contagem e quantidades',
  cores: 'Cores',
  habitats: 'Animais e habitats',
  fonologia: 'Consciência fonológica',
  silabas: 'Consciência silábica',
  letras: 'Letras e palavras',
  percepcao: 'Percepção visual',
  audicao: 'Compreensão auditiva',
} as const;

export interface PedagogicalObjective {
  area: keyof typeof AREA_LABELS;
  subject: string;
  skillId: string;
  skill: string;
}
