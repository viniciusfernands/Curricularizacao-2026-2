import { AppShell } from '../components/AppShell';
import { AnimalPortrait } from '../components/AnimalPortrait';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import type { RunSummary } from '../domain/progress';
import { AREA_LABELS } from '../domain/pedagogy';
import { DIFFICULTY_LABEL, type Difficulty } from '../domain/types';

interface ResultScreenProps {
  difficulty: Difficulty;
  summary: RunSummary;
  saved: boolean;
}

export function ResultScreen({ difficulty, summary, saved }: ResultScreenProps) {
  const { go, home } = useNav();

  return (
    <AppShell showBack={false}>
      <section className="result-card grid w-full max-w-3xl items-center gap-5 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative flex justify-center">
          <span className="result-star result-star--one" aria-hidden="true">★</span>
          <span className="result-star result-star--two" aria-hidden="true">★</span>
          <AnimalPortrait
            src="assets/animals/elephant/elephant_happy.png"
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

          {summary.attempts > 0 && (
            <div className="flex gap-3">
              <Stat icon="✓" value={summary.completedQuestions} label="Atividades" />
              <Stat icon="↻" value={summary.attempts} label="Tentativas" />
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

        <details className="relative z-10 w-full min-w-0 rounded-2xl bg-white/90 p-4 text-slate-700 md:col-span-2">
          <summary className="cursor-pointer rounded-lg font-bold focus-visible:outline-2 focus-visible:outline-violet-600">
            Acompanhamento para o adulto — esta partida
          </summary>
          <p className="my-3 text-sm">
            {summary.completedQuestions} de {summary.questionCount} atividades concluídas.
            {' '}{summary.attempts} tentativas avaliadas: {summary.correct} acertos e {summary.errors} erros.
            {' '}Uma atividade pode ter várias respostas; cada posicionamento avaliado
            ou par de memória conta uma tentativa. Na contagem, colocações intermediárias
            são progresso e não somam acertos.
          </p>
          {!saved && (
            <p role="status" className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Não foi possível guardar todos os registros neste dispositivo.
              Este resumo inclui as respostas da partida que continuam em memória.
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Resultados por pergunta e habilidade nesta partida</caption>
              <thead>
                <tr>
                  <th scope="col" className="p-2">Pergunta e habilidade</th>
                  <th scope="col" className="p-2">Tentativas</th>
                  <th scope="col" className="p-2">Acertos</th>
                  <th scope="col" className="p-2">Erros</th>
                </tr>
              </thead>
              <tbody>
                {summary.questions.map((question) => (
                  <tr key={question.questionId} className="border-t border-violet-100">
                    <th scope="row" className="p-2 font-normal">
                      <span className="font-bold">{question.questionId} · {AREA_LABELS[question.objective.area]}</span>
                      <span className="block">{question.objective.subject}</span>
                      <span className="block text-slate-500">{question.objective.skill}</span>
                    </th>
                    <td className="p-2">{question.attempts}</td>
                    <td className="p-2">{question.correct}</td>
                    <td className="p-2">{question.errors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
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
