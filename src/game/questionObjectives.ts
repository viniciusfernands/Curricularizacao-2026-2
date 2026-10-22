import type { PedagogicalObjective } from '../domain/pedagogy';

/** Descrições do conteúdo implementado; não representam homologação pedagógica. */
export const QUESTION_OBJECTIVES = {
  F02: { area: 'espaco', subject: 'Dentro', skillId: 'posicionar-dentro', skill: 'Posicionar um objeto dentro de outro.' },
  F03: { area: 'contagem', subject: 'Quantidade três', skillId: 'formar-conjunto-tres', skill: 'Formar um conjunto com três elementos.' },
  F04: { area: 'cores', subject: 'Cor azul', skillId: 'reconhecer-azul', skill: 'Reconhecer a cor azul a partir de seu nome.' },
  F06: { area: 'letras', subject: 'Letra A', skillId: 'reconhecer-letra-a', skill: 'Relacionar o nome da letra A à sua representação gráfica.' },
  F07: { area: 'silabas', subject: 'Sílabas de BOLA', skillId: 'contar-silabas-duas', skill: 'Identificar duas sílabas em uma palavra falada.' },
  F08: { area: 'percepcao', subject: 'Igualdade e diferença', skillId: 'identificar-figura-diferente', skill: 'Identificar a figura diferente de um conjunto.' },
  X03: { area: 'audicao', subject: 'Palavra CASA', skillId: 'associar-palavra-imagem', skill: 'Associar uma palavra falada à imagem correspondente.' },
  M02: { area: 'espaco', subject: 'Embaixo', skillId: 'posicionar-embaixo', skill: 'Posicionar um objeto embaixo de outro.' },
  M03: { area: 'contagem', subject: 'Quantidade cinco', skillId: 'formar-conjunto-cinco', skill: 'Formar um conjunto com cinco elementos.' },
  M04: { area: 'cores', subject: 'Vermelho e azul', skillId: 'classificar-duas-cores', skill: 'Classificar objetos em dois grupos de cores.' },
  M06: { area: 'fonologia', subject: 'Som inicial /m/', skillId: 'reconhecer-som-inicial-m', skill: 'Identificar uma palavra que começa com o som /m/.' },
  M07: { area: 'letras', subject: 'Inicial de BOLA', skillId: 'identificar-letra-inicial', skill: 'Identificar a primeira letra de uma palavra com apoio visual.' },
  M08: { area: 'percepcao', subject: 'Padrão AB', skillId: 'completar-padrao-ab', skill: 'Completar uma sequência alternada de cores.' },
  X01: { area: 'percepcao', subject: 'Memória de figuras', skillId: 'associar-pares-memoria', skill: 'Encontrar pares de figuras iguais usando memória visual.' },
  D01: { area: 'grandezas', subject: 'Ordem crescente de tamanho', skillId: 'ordenar-quatro-tamanhos', skill: 'Ordenar quatro objetos do menor para o maior.' },
  D04: { area: 'cores', subject: 'Vermelho, azul e amarelo', skillId: 'classificar-tres-cores', skill: 'Classificar objetos em três grupos de cores.' },
  D06: { area: 'silabas', subject: 'Sílabas de JANELA', skillId: 'contar-silabas-tres', skill: 'Representar com objetos as três sílabas de uma palavra falada.' },
  D07: { area: 'letras', subject: 'Formação de SOL', skillId: 'ordenar-letras-sol', skill: 'Ordenar letras para formar SOL com apoio visual e sonoro.' },
  X04: { area: 'percepcao', subject: 'Padrão AAB', skillId: 'completar-padrao-aab', skill: 'Completar uma sequência visual do tipo AAB.' },
} satisfies Record<string, PedagogicalObjective>;
