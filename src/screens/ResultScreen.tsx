import { AppShell } from '../components/AppShell';
import { AnimalPortrait } from '../components/AnimalPortrait';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';
import { summarize } from '../data/progress';
import { DIFFICULTY_LABEL, type Difficulty } from '../domain/types';

interface ResultScreenProps {
  difficulty: Difficulty;
}

export function ResultScreen({ difficulty }: ResultScreenProps) {
  const { go, home } = useNav();
  const { child } = useSession();
  const summary = summarize(child ?? undefined);

  return (
    <AppShell showBack={false}>
      <section className="result-card grid w-full max-w-3xl items-center gap-5 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative flex justify-center">
          <span className="result-star result-star--one" aria-hidden="true">★</span>
          <span className="result-star result-star--two" aria-hidden="true">★</span>
          <AnimalPortrait
            src="/assets/animals/elephant/elephant_happy.png"
            className="w-64 sm:w-72"
          />
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          <span className="game-kicker">ATIVIDADE CONCLUÍDA!</span>
          <h1 className="text-4xl font-black text-violet-700 sm:text-5xl">
            Muito bem!
          </h1>
          <p className="text-lg font-extrabold text-slate-500">
            Nível {DIFFICULTY_LABEL[difficulty]}
          </p>

          {summary.total > 0 && (
            <div className="flex gap-3">
              <Stat icon="✓" value={summary.correct} label="Acertos" />
              <Stat icon="↻" value={summary.errors} label="Tentativas" />
            </div>
          )}

          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => go({ name: 'game', difficulty })}>
              <span aria-hidden="true">↻</span> Jogar de novo
            </Button>
            <Button variant="secondary" onClick={home}>
              <span aria-hidden="true">⌂</span> Início
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="result-stat">
      <span className="text-2xl text-emerald-600" aria-hidden="true">{icon}</span>
      <span className="text-2xl font-black text-slate-800">{value}</span>
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </span>
    </div>
  );
}
