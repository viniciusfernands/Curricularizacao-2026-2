import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { DIFFICULTY_LABEL, type Difficulty } from '../domain/types';

interface GameScreenProps {
  difficulty: Difficulty;
}

/**
 * Ponto de montagem do jogo.
 *
 * FASE ATUAL: placeholder. Aqui será montado o <canvas> do Phaser — o
 * componente PhaserGame já existe em src/game/ (ver docs/ARQUITETURA.md).
 * O React continua responsável pela moldura (voltar, nome da criança) e o
 * Phaser cuida apenas das atividades.
 *
 * Não há seleção de tema: as perguntas do nível misturam todos os temas
 * (contagem, cores, sílabas, etc.). Cada pergunta guarda o seu tema apenas
 * como marcador, para o registro de acertos/erros/tentativas.
 *
 * Quando o jogo terminar, a cena do Phaser reportará os resultados e
 * navegaremos para a tela de resultado.
 */
export function GameScreen({ difficulty }: GameScreenProps) {
  const { go } = useNav();

  return (
    <AppShell>
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-lg font-bold uppercase tracking-wide text-violet-500">
          Nível {DIFFICULTY_LABEL[difficulty]}
        </p>

        {/* Área reservada para o <canvas> do Phaser. */}
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-violet-300 bg-white/60 p-8">
          <span className="text-6xl" aria-hidden="true">
            🎮
          </span>
          <p className="text-xl font-bold text-slate-600">
            Aqui vai entrar o jogo (Phaser)
          </p>
          <p className="text-sm font-semibold text-slate-400">
            Perguntas de temas variados
          </p>
        </div>

        {/* Provisório: simula o fim da rodada para testar o fluxo. */}
        <Button
          variant="secondary"
          onClick={() => go({ name: 'result', difficulty })}
        >
          Terminar (teste do fluxo)
        </Button>
      </div>
    </AppShell>
  );
}
