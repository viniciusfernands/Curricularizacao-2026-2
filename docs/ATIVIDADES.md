# 🎯 Proposta inicial de atividades

> Banco inicial com **28 atividades** para o jogo educacional destinado a
> crianças de 5 a 6 anos. As propostas estão divididas por nível de dificuldade
> e devem ser validadas com a equipe pedagógica durante os testes.

---

## 📋 Visão geral

| Grupo | Quantidade | Objetivo |
| --- | ---: | --- |
| 🟢 Fácil | 8 | Uma instrução, poucas alternativas e baixa dependência de leitura |
| 🟡 Médio | 8 | Mais objetos ou mais de uma ação por atividade |
| 🔴 Difícil | 8 | Mais elementos, etapas ou habilidades combinadas |
| ⭐ Reserva | 4 | Atividades a classificar após testes e validação |
| **Total** | **28** | |

---

## 🟢 Nível fácil

| ID | Área | Atividade | Mecânica |
| --- | --- | --- | --- |
| F01 | Grandezas | Qual é maior? Dois animais aparecem e a criança toca no maior. | Seleção visual |
| F02 | Noções espaciais | Coloque o gato dentro da caixa. | Arrastar para destino |
| F03 | Contagem | Coloque 3 maçãs na cesta. | Arrastar quantidade |
| F04 | Cores | A criança ouve “Azul” e toca na cor correspondente. | Áudio + seleção |
| F05 | Animais/Habitats | Leve o peixe para onde ele vive. | Arrastar para habitat |
| F06 | Fonologia | A criança ouve o som ou nome de uma letra e seleciona a letra correspondente. | Áudio + seleção |
| F07 | Sílabas | A criança ouve “BO-LA” e indica que existem duas partes. | Áudio + quantidade |
| F08 | Percepção visual | Entre quatro figuras, identificar qual é diferente. | Seleção visual |

### Diretriz de interface

Neste nível, cada atividade deve apresentar uma única instrução e poucas
alternativas. A interface deve utilizar botões grandes, poucos elementos na tela
e pouca dependência de leitura.

---

## 🟡 Nível médio

Neste nível, as atividades começam a exigir mais de uma ação ou apresentam mais
objetos simultaneamente.

| ID | Área | Atividade | Mecânica |
| --- | --- | --- | --- |
| M01 | Grandezas | Organize três animais do menor para o maior. | Ordenação |
| M02 | Noções espaciais | Coloque a bola embaixo da mesa. | Arrastar para zona |
| M03 | Contagem | Coloque 5 estrelas dentro da caixa. | Arrastar quantidade |
| M04 | Cores | Separe os objetos pela cor: vermelhos de um lado e azuis do outro. | Classificação |
| M05 | Animais/Habitats | Distribua 3 animais entre seus habitats. | Classificação |
| M06 | Fonologia | Ouça um som inicial e escolha qual imagem começa com esse som. | Áudio + seleção |
| M07 | Letras/Palavras | Veja uma imagem e arraste a primeira letra da palavra. | Associação |
| M08 | Percepção visual | Complete a sequência: 🔴 🔵 🔴 🔵 🔴 ?. | Sequência |

### Exemplo de interação — M05

A atividade não precisa apresentar uma pergunta tradicional. A criança encontra
os animais e habitats na tela:

```text
🐟       🐒       🐄

🌊       🌳       🌾
```

O objetivo é arrastar cada animal até o habitat correto.

---

## 🔴 Nível difícil

“Difícil” não significa tornar o jogo inadequado para crianças de 5 a 6 anos. A
dificuldade aumenta pela quantidade de elementos, etapas ou combinações de
habilidades.

| ID | Área | Atividade | Mecânica |
| --- | --- | --- | --- |
| D01 | Grandezas | Organize 4 objetos do menor para o maior. | Ordenação |
| D02 | Noções espaciais | Siga a instrução: “coloque o pássaro acima da árvore e o cachorro ao lado da casa”. | Múltiplos arrastes |
| D03 | Contagem | Dê 2 peixes para cada gato. | Distribuição + contagem |
| D04 | Cores | Separe vários objetos em 3 grupos de cores. | Classificação |
| D05 | Animais/Habitats | Distribua 6 animais entre 3 habitats. | Classificação |
| D06 | Sílabas | Ouça uma palavra e coloque uma estrela para cada sílaba percebida. | Áudio + contagem |
| D07 | Letras/Palavras | Organize letras para formar uma palavra curta com apoio de imagem e áudio. | Ordenação |
| D08 | Compreensão auditiva | Ouça uma pequena instrução e execute duas ações na ordem correta. | Sequência de ações |

### Exemplo de interação — D08

O jogo pode reproduzir a instrução:

> “Coloque a bola dentro da caixa e depois leve o cachorro até a casa.”

Sem mostrar uma resposta escrita, o jogo avalia internamente esta sequência:

1. Bola → caixa.
2. Cachorro → casa.

---

## ⭐ Banco de reserva

Estas atividades permanecem inicialmente no banco de reserva. Após os testes, a
equipe poderá decidir se cada uma pertence ao nível fácil, médio ou difícil.

| ID | Área | Atividade | Mecânica |
| --- | --- | --- | --- |
| X01 | Percepção visual | Jogo da memória com 3 pares de figuras. | Memória |
| X02 | Animais/Habitats | Associe cada animal à sua comida ou ambiente. | Correspondência |
| X03 | Compreensão auditiva | Ouça uma palavra e selecione a imagem correspondente. | Áudio + seleção |
| X04 | Percepção/Sequência | Complete uma sequência visual com formas, cores ou objetos. | Sequência |

---

## 🧭 Próximos passos sugeridos

1. Validar linguagem, dificuldade e objetivos com a equipe pedagógica.
2. Definir imagens, falas e efeitos sonoros necessários para cada atividade.
3. Converter as atividades aprovadas em dados estruturados, como JSON.
4. Prototipar ao menos uma mecânica de cada tipo no Phaser.
5. Testar em telas, navegadores e dispositivos disponíveis nas escolas.
