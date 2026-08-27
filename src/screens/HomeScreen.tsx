import { AppShell } from '../components/AppShell';
import { AnimalPortrait } from '../components/AnimalPortrait';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';

export function HomeScreen() {
  const { go } = useNav();

  return (
    <AppShell showBack={false} showChild={false}>
      <section className="hero-card w-full max-w-4xl text-center">
        <div className="hero-animal hero-animal--cat" aria-hidden="true">
          <AnimalPortrait src="/assets/animals/cat/cat_idle.png" />
        </div>
        <div className="hero-animal hero-animal--elephant" aria-hidden="true">
          <AnimalPortrait src="/assets/animals/elephant/elephant_idle.png" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="game-kicker">APRENDER É UMA AVENTURA!</span>
          <h1 className="game-title">Vamos Brincar!</h1>
          <p className="max-w-md text-lg font-extrabold text-slate-600 sm:text-xl">
            Descubra, pense e aprenda com nossos amigos animais.
          </p>

          <Button
            size="xl"
            className="mt-4"
            onClick={() => go({ name: 'identify' })}
          >
            <span aria-hidden="true">▶</span> Começar
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
