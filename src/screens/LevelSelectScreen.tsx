import { AppShell } from '../components/AppShell';
import { TileButton } from '../components/TileButton';
import { useNav } from '../app/nav-context';
import { DIFFICULTIES, DIFFICULTY_LABEL, type Difficulty } from '../domain/types';

// Aparência de cada nível no menu (ícone e cor).
const LEVEL_STYLE: Record<Difficulty, { icon: string; color: string }> = {
  facil: { icon: '🌱', color: 'bg-emerald-100 hover:bg-emerald-200' },
  medio: { icon: '⭐', color: 'bg-amber-100 hover:bg-amber-200' },
  dificil: { icon: '🚀', color: 'bg-rose-100 hover:bg-rose-200' },
};

/** Seleção do nível de dificuldade: Fácil, Médio, Difícil. */
export function LevelSelectScreen() {
  const { go } = useNav();

  return (
    <AppShell>
      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">
          Escolha o nível
        </h1>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {DIFFICULTIES.map((level) => (
            <TileButton
              key={level}
              icon={LEVEL_STYLE[level].icon}
              color={LEVEL_STYLE[level].color}
              label={DIFFICULTY_LABEL[level]}
              onClick={() => go({ name: 'game', difficulty: level })}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
