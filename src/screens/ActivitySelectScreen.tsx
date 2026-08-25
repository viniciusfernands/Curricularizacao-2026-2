import { AppShell } from '../components/AppShell';
import { TileButton } from '../components/TileButton';
import { useNav } from '../app/nav-context';
import { ACTIVITIES } from '../domain/activities';
import { DIFFICULTY_LABEL, type Difficulty } from '../domain/types';

interface ActivitySelectScreenProps {
  difficulty: Difficulty;
}

/**
 * Seleção da categoria de atividade dentro do nível escolhido.
 * As categorias marcadas como `available: false` aparecem como "Em breve"
 * até que a atividade correspondente seja implementada no Phaser.
 */
export function ActivitySelectScreen({ difficulty }: ActivitySelectScreenProps) {
  const { go } = useNav();

  return (
    <AppShell>
      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-lg font-bold uppercase tracking-wide text-violet-500">
            Nível {DIFFICULTY_LABEL[difficulty]}
          </p>
          <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">
            Escolha a brincadeira
          </h1>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3">
          {ACTIVITIES.map((activity) => (
            <TileButton
              key={activity.id}
              icon={activity.icon}
              color={activity.color}
              label={activity.label}
              description={activity.description}
              disabled={!activity.available}
              onClick={() =>
                go({ name: 'game', difficulty, activity: activity.id })
              }
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
