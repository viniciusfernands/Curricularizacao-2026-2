import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';

/** Tela inicial: título do jogo e um único botão grande para começar. */
export function HomeScreen() {
  const { go } = useNav();

  return (
    <AppShell showBack={false} showChild={false}>
      <div className="flex flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-8xl drop-shadow-md" aria-hidden="true">
            🎮
          </span>
          <h1 className="text-5xl font-black text-violet-700 sm:text-6xl">
            Vamos Brincar!
          </h1>
          <p className="max-w-md text-xl font-semibold text-slate-500">
            Jogos para aprender brincando
          </p>
        </div>

        <Button size="xl" onClick={() => go({ name: 'identify' })}>
          ▶ Começar
        </Button>
      </div>
    </AppShell>
  );
}
