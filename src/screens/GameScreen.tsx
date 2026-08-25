import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { getActivity } from '../domain/activities';
import { DIFFICULTY_LABEL, type ActivityId, type Difficulty } from '../domain/types';

interface GameScreenProps {
  difficulty: Difficulty;
  activity: ActivityId;
}

/**
 * Ponto de montagem do jogo.
 *
 * FASE ATUAL: placeholder. Nesta tela, futuramente, será montado o <canvas>
 * do Phaser (ver docs/ARQUITETURA.md). O React continua responsável pela
 * moldura (voltar, nome da criança) e o Phaser cuida apenas da atividade.
 *
 * Quando o jogo terminar, a cena do Phaser reportará os resultados
 * (acertos/erros/tentativas) e navegaremos para a tela de resultado.
 */
export function GameScreen({ difficulty, activity }: GameScreenProps) {
  const { go } = useNav();
  const meta = getActivity(activity);

  return (
    <AppShell>
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-lg font-bold uppercase tracking-wide text-violet-500">
          {meta?.label} · Nível {DIFFICULTY_LABEL[difficulty]}
        </p>

        {/* Área reservada para o <canvas> do Phaser. */}
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-violet-300 bg-white/60 p-8">
          <span className="text-6xl" aria-hidden="true">
            {meta?.icon ?? '🎮'}
          </span>
          <p className="text-xl font-bold text-slate-600">
            Aqui vai entrar o jogo (Phaser)
          </p>
          <p className="text-sm font-semibold text-slate-400">
            Próxima fase do desenvolvimento
          </p>
        </div>

        {/* Provisório: simula o fim da atividade para testar o fluxo. */}
        <Button
          variant="secondary"
          onClick={() => go({ name: 'result', difficulty, activity })}
        >
          Terminar (teste do fluxo)
        </Button>
      </div>
    </AppShell>
  );
}
