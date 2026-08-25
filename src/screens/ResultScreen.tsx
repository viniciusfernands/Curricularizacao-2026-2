import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';
import { summarize } from '../data/progress';
import { getActivity } from '../domain/activities';
import { DIFFICULTY_LABEL, type ActivityId, type Difficulty } from '../domain/types';

interface ResultScreenProps {
  difficulty: Difficulty;
  activity: ActivityId;
}

/**
 * Tela de resultado ao fim de uma atividade.
 *
 * Mostra um resumo positivo para a criança e oferece jogar de novo ou voltar.
 * Por ora, o resumo vem do histórico agregado (localStorage); quando o jogo
 * existir, exibirá o desempenho da rodada recém-jogada.
 */
export function ResultScreen({ difficulty, activity }: ResultScreenProps) {
  const { go, home } = useNav();
  const { child } = useSession();
  const meta = getActivity(activity);
  const summary = summarize(child ?? undefined);

  return (
    <AppShell showBack={false}>
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <span className="text-8xl" aria-hidden="true">
          🎉
        </span>
        <h1 className="text-4xl font-black text-violet-700">Muito bem!</h1>
        <p className="text-xl font-semibold text-slate-500">
          {meta?.label} · Nível {DIFFICULTY_LABEL[difficulty]}
        </p>

        {summary.total > 0 && (
          <div className="flex gap-4">
            <Stat icon="✅" value={summary.correct} label="Acertos" />
            <Stat icon="🔁" value={summary.errors} label="Tentativas" />
          </div>
        )}

        <div className="mt-2 flex flex-col gap-3">
          <Button onClick={() => go({ name: 'game', difficulty, activity })}>
            🔁 Jogar de novo
          </Button>
          <Button variant="secondary" onClick={home}>
            🏠 Início
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex min-w-24 flex-col items-center rounded-2xl bg-white px-5 py-3 shadow-md">
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-2xl font-black text-slate-800">{value}</span>
      <span className="text-sm font-semibold text-slate-500">{label}</span>
    </div>
  );
}
