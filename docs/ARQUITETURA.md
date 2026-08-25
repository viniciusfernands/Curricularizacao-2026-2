# 🧭 Arquitetura e Stack — Curricularização da Extensão 2026.2

> Documento de **planejamento técnico**. Registra as decisões de arquitetura e as
> ferramentas consideradas para o jogo educacional (Pré-escola II, 5–6 anos).
> Nada aqui foi implementado ainda — serve para alinhar o grupo antes de codar.

---

## 🎯 Princípio geral

Evitar arquitetura pesada. O jogo é essencialmente **2D, baseado em perguntas,
imagens, sons, animações e interação por clique/toque**. Dá para montar uma stack
moderna, gratuita e simples de aprender.

Regra que guia todas as escolhas: **começar enxuto e só adicionar dependência
(backend, banco de dados, Howler, etc.) quando um requisito realmente exigir.**

---

## 🧱 Stack recomendada

### Desenvolvimento

| Área          | Ferramenta   | Uso                                              |
| ------------- | ------------ | ------------------------------------------------ |
| Linguagem     | TypeScript   | Lógica da aplicação                              |
| Interface     | React        | Telas, menus, seleção de níveis, resultados      |
| Build         | Vite         | Ambiente de desenvolvimento e build              |
| Estilos       | Tailwind CSS | Layout e identidade visual                       |
| Motor de jogo | Phaser       | Atividades, animações, sprites e interações      |
| Áudio         | Phaser Audio | Reprodução de sons (Howler.js só se necessário)  |
| Versionamento | Git + GitHub | Código e colaboração                             |

### Design e multimídia (assets)

| Área             | Ferramenta      | Uso                                             |
| ---------------- | --------------- | ----------------------------------------------- |
| Prototipação     | Penpot / Figma  | Layout das telas antes de programar             |
| Imagens vetoriais| Inkscape        | Ícones, botões, letras, números, animais (SVG)  |
| Ilustração       | Krita           | Cenários, personagens, habitats                 |
| Áudio            | Audacity        | Gravação e edição de falas/efeitos              |
| Vídeo            | Kdenlive        | Edição de vídeos (usar com parcimônia)          |
| Animação/3D      | Blender         | Animações elaboradas → exportar p/ WebM/PNG     |

> **Nota:** todas as ferramentas de multimídia são gratuitas e open-source
> (exceto Figma, que tem plano gratuito mas não é aberto — Penpot é a alternativa
> open-source).

---

## 🏗️ Divisão React × Phaser

A decisão arquitetural central é **React + Phaser** (não escolher um ou outro).
Cada um cuida do que faz melhor — e **não** transformar todas as telas em canvas.

```
React                         Phaser
│                             │
├── Tela inicial              ├── Perguntas
├── Identificação da criança  ├── Sprites
├── Seleção de nível          ├── Interações (clique/toque)
├── Seleção de atividade      ├── Animações
├── Progresso                 └── Efeitos / áudio do jogo
└── Resultado
        │
        └── monta o <canvas> do Phaser só na tela de jogo
```

**Por que separar:** React é ótimo para menus, formulários e navegação; Phaser foi
feito especificamente para jogos HTML5 2D e já resolve sprites, animações,
transições, entrada por mouse/touch, cenas, câmeras, partículas e gerenciamento de
assets. Phaser tem integração oficial com React e Vite.

❌ **Evitar:** menu, configurações e resultados dentro do Canvas do Phaser.

---

## 🧩 Conteúdo como dados (decisão a definir cedo)

Ponto arquitetural que mais vale definir logo: **não escrever as perguntas dentro
dos componentes React.** Tratar cada atividade como **dado** (JSON), separando
_como apresentar/validar/registrar_ (código) de _qual pergunta/imagem/áudio/resposta_
(conteúdo).

Exemplo de questão em JSON:

```json
{
  "id": 1,
  "level": "facil",
  "category": "grandezas",
  "skill": "comparacao",
  "type": "image-choice",
  "audio": "/audio/perguntas/001.mp3",
  "question": "Qual animal é maior?",
  "options": [
    { "image": "/images/animals/elefante.svg", "correct": true },
    { "image": "/images/animals/rato.svg", "correct": false }
  ]
}
```

Tipos de atividade previstos (cada tipo → um "mini-jogo" reutilizável):

```ts
type ActivityType =
  | "image-choice"
  | "audio-choice"
  | "counting"
  | "drag-and-drop"
  | "color-choice"
  | "letter-choice"
  | "syllable-count";
```

Assim é possível produzir 60+ questões sem criar 60 telas diferentes: cada questão
aponta para o mini-jogo do seu `type`.

Exemplo de tipo em TypeScript para as questões:

```ts
interface Question {
  id: number;
  level: "facil" | "medio" | "dificil";
  category: string;
  statement?: string;
  audio?: string;
  image?: string;
  options: Answer[];
}
```

---

## 🗂️ Estrutura de assets (proposta)

```
audio/
├── letras/     (a.mp3, b.mp3, ...)
├── palavras/   (bola.mp3, casa.mp3, gato.mp3)
└── feedback/   (parabens.mp3, tente-novamente.mp3, muito-bem.mp3)

images/
├── animals/    (elefante.svg, rato.svg, ...)
└── ...

Inkscape  → ícones e vetores (SVG)
Krita     → desenhos e ilustrações
Blender   → animações (opcional) → exportar p/ WebM/PNG/sprite
```

> **Áudio:** preferir **gravações humanas** para as instruções principais, em vez
> de voz artificial — entonação, ritmo e clareza fazem diferença para crianças
> pequenas.

---

## 💾 Persistência dos dados

Pelas especificações iniciais, **não é necessário banco de dados na primeira
versão**. O documento sugere que até um `.txt`/JSON com nome da criança, data/hora,
acertos, erros e tentativas já seria suficiente.

```
Frontend → Aplicação → Registro de atividade → JSON / TXT (local)
```

Só considerar MySQL / PostgreSQL / MongoDB / Firebase **depois**, se surgir a
necessidade de painel de professores, turmas, alunos, etc.

---

## 🧑‍💻 Componentes React previstos

`Button` · `Card` · `AudioButton` · `Question` · `AnswerOption` · `ProgressBar` ·
`LevelSelection` · `ActivitySelection` · `GameResult`

---

## 🌿 Fluxo de trabalho no Git

Usar Git + GitHub desde o primeiro dia (evita o clássico `projeto-final-agora-vai.zip`).
Cada membro trabalha em uma branch:

```
main
├── develop
├── feature/menu-inicial
├── feature/jogo-matematica
├── feature/audio
├── feature/resultados
└── feature/percepcao-visual
```

---

## ⚠️ Pontos de atenção

- **Compatibilidade Tailwind 4:** mira navegadores modernos (base Chrome 111,
  Safari 16.4, Firefox 128). Como as escolas usam Chrome/Firefox/Edge, **verificar
  as versões instaladas nos equipamentos** antes de fechar a decisão.
- **Vídeos com parcimônia:** máquinas escolares têm capacidades variadas. Priorizar
  na ordem: **imagem → som → animação simples → vídeo**. Vídeo só quando realmente
  acrescentar à atividade.
- **Não "engordar" a stack:** começar com React + TypeScript + Vite + Tailwind +
  Phaser. Backend, banco, Howler e afins só quando um requisito exigir.
- **Create React App:** descontinuado — não usar (o projeto já usa Vite).

---

## ✅ Próxima decisão do grupo

Antes de desenhar telas, alinhar duas coisas:

1. **React + Phaser vs. somente React** — recomendação: **React + Phaser**, dado o
   escopo (imagens, sons, reconhecimento visual, contagem, interações lúdicas).
2. **Modelo de "tipos de atividade"** (o `ActivityType` acima) — definir cedo evita
   retrabalho e permite escalar o número de questões sem multiplicar telas.
