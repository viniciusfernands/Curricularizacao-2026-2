import { AppShell } from '../components/AppShell';
import { AnimalPortrait } from '../components/AnimalPortrait';
import { TileButton } from '../components/TileButton';
import { useNav } from '../app/nav-context';
import { DIFFICULTIES, DIFFICULTY_LABEL, type Difficulty } from '../domain/types';

const LEVEL_STYLE: Record<
  Difficulty,
  { image: string; color: string; description: string }
> = {
  facil: {
    image: '/assets/animals/cat/cat_happy.png',
    color: 'level-tile--green',
    description: 'Vamos começar!',
  },
  medio: {
    image: '/assets/animals/cow/cow_happy.png',
    color: 'level-tile--yellow',
    description: 'Um novo desafio!',
  },
  dificil: {
    image: '/assets/animals/lion/lion_happy.png',
    color: 'level-tile--coral',
    description: 'Para exploradores!',
  },
};

export function LevelSelectScreen() {
  const { go } = useNav();

  return (
    <AppShell>
      <section className="flex w-full max-w-5xl flex-col items-center gap-7">
        <div className="text-center">
          <span className="game-kicker">ESCOLHA SUA AVENTURA</span>
          <h1 className="mt-2 text-3xl font-black text-slate-800 sm:text-5xl">
            Qual nível vamos jogar?
          </h1>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
          {DIFFICULTIES.map((level) => (
            <TileButton
              key={level}
              icon={<AnimalPortrait src={LEVEL_STYLE[level].image} />}
              color={LEVEL_STYLE[level].color}
              label={DIFFICULTY_LABEL[level]}
              description={LEVEL_STYLE[level].description}
              onClick={() => go({ name: 'game', difficulty: level })}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
