import { useCallback, useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';
import { saveRun } from '../data/progress';
import { createProgressId, ProgressRun, type QuestionInteraction } from '../domain/progress';
import { PhaserGame } from '../game/PhaserGame';
import { DIFFICULTY_LABEL, type Difficulty } from '../domain/types';
import { questionsFor } from '../game/questions';

interface GameScreenProps {
  difficulty: Difficulty;
}

/** Monta a atividade Phaser e mantém navegação/persistência sob responsabilidade do React. */
export function GameScreen({ difficulty }: GameScreenProps) {
  const { go } = useNav();
  const { identification } = useSession();
  const completed = useRef(false);
  const questionCount = questionsFor(difficulty).length;
  const [run] = useState(() => new ProgressRun({
    id: createProgressId(),
    ...identification,
    difficulty,
    questions: questionsFor(difficulty),
    startedAt: new Date().toISOString(),
  }));
  const saved = useRef(true);
  const [saveFailed, setSaveFailed] = useState(false);

  const handleInteraction = useCallback((event: QuestionInteraction) => {
    if (completed.current || !run.record(event)) return;
    saved.current = saveRun(run.snapshot());
    setSaveFailed(!saved.current);
  }, [run]);

  const handleComplete = useCallback(
    () => {
      if (completed.current) return;
      const summary = run.summarize();
      if (summary.completedQuestions !== questionCount) return;
      completed.current = true;
      go({ name: 'result', difficulty, summary, saved: saved.current });
    },
    [difficulty, go, questionCount, run],
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

        <PhaserGame difficulty={difficulty} onInteraction={handleInteraction} onComplete={handleComplete} />

        {saveFailed && (
          <p role="status" className="rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Não foi possível guardar o progresso neste dispositivo. O resumo
            continua disponível durante esta partida.
          </p>
        )}

        <p className="sr-only">
          Complete as atividades apresentadas. Use o botão de áudio para ouvir
          cada instrução.
        </p>
      </section>
    </AppShell>
  );
}
