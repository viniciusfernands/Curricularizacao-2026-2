export interface SpeechPart {
  text: string;
  rate?: number;
  pauseAfter?: number;
}

/** Roteiro falado separado da legenda. Síntese provisória, sujeita a revisão pedagógica. */
export function spokenInstruction(id: string, instruction: string): SpeechPart[] {
  if (id === 'F07') return [
    { text: 'Ouça a palavra bola.', pauseAfter: 450 },
    // Uma única fala evita reiniciar a voz em cada sílaba curta.
    // O acento orienta o "o" aberto; a pausa fica dentro da mesma enunciação.
    { text: 'Bó... la.', rate: 0.9, pauseAfter: 450 },
    { text: 'Quantas partes você ouviu?' },
  ];
  if (id === 'D06') {
    const syllables = ['ja', 'ne', 'la'];
    return [
      { text: 'Ouça com atenção.', pauseAfter: 400 },
      ...syllables.map(text => ({ text, rate: 0.75, pauseAfter: 280 })),
      { text: 'Coloque uma estrela para cada parte da palavra.' },
    ];
  }
  if (id === 'M06') return [
    { text: 'Ouça o som.', pauseAfter: 400 },
    // Não substituir pelo nome da letra ("eme"): isso mudaria a habilidade.
    { text: 'mmm', rate: 0.75, pauseAfter: 500 },
    { text: 'Qual figura começa com esse som?' },
  ];
  return instruction.split(/(?<=[.!?])\s+/).filter(Boolean).map(text => ({
    text: text.replace(/\b(BOLA|SOL|CASA)\b/g, word => word.toLowerCase()),
    pauseAfter: 350,
  }));
}
