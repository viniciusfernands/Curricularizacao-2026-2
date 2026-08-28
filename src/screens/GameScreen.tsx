import { useCallback, useRef } from 'react';
import { AppShell } from '../components/AppShell';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';
import { saveAttempt } from '../data/progress';
import { PhaserGame } from '../game/PhaserGame';
import { DIFFICULTY_LABEL, type Difficulty } from '../domain/types';
import { questionsFor } from '../game/questions';

interface GameScreenProps {
  difficulty: Difficulty;
}

/** Monta a atividade Phaser e mantém navegação/persistência sob responsabilidade do React. */
export function GameScreen({ difficulty }: GameScreenProps) {
  const { go } = useNav();
  const { child } = useSession();
  const completed = useRef(false);
  const questionCount = questionsFor(difficulty).length;

  const handleComplete = useCallback(
    (attempts: number) => {
      if (completed.current) return;
      completed.current = true;

      saveAttempt({
        child: child ?? 'Criança',
        activity: 'percepcao',
        difficulty,
        timestamp: new Date().toISOString(),
        correct: true,
        attempts,
      });

      go({ name: 'result', difficulty });
    },
    [child, difficulty, go],
  );

  return (
    <AppShell>
      <section
        className="flex w-full max-w-5xl flex-col items-center gap-3"
        aria-label={`Sequência de ${questionCount} atividades do nível ${DIFFICULTY_LABEL[difficulty]}`}
      >
        <div className="flex w-full items-center justify-between px-1 sm:px-2">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600 sm:text-base">
            Nível {DIFFICULTY_LABEL[difficulty]}
          </p>
          <p className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">
            {questionCount} atividades
          </p>
        </div>

        <PhaserGame difficulty={difficulty} onComplete={handleComplete} />

        <p className="sr-only">
          Complete as atividades apresentadas. Use o botão de áudio para ouvir
          cada instrução.
        </p>
      </section>
    </AppShell>
  );
}
