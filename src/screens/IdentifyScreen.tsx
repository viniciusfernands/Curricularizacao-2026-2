import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { AnimalPortrait } from '../components/AnimalPortrait';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';

export function IdentifyScreen() {
  const { go } = useNav();
  const { child, setChild } = useSession();
  const [name, setName] = useState(child ?? '');
  const canContinue = name.trim().length > 0;

  function handleContinue() {
    if (!canContinue) return;
    setChild(name);
    go({ name: 'levels' });
  }

  return (
    <AppShell showChild={false}>
      <section className="menu-card grid w-full max-w-4xl items-center gap-4 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
        <div className="flex flex-col items-center self-end">
          <div className="thought-bubble">Como você se chama?</div>
          <AnimalPortrait
            src="/assets/animals/cat/cat_think.png"
            className="w-56 sm:w-72"
          />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleContinue();
          }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <span className="game-kicker">QUEM VAI JOGAR?</span>
          <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">
            Conte seu nome para nós!
          </h1>
          <p className="font-bold text-slate-500">
            Um adulto pode ajudar a digitar.
          </p>

          <label className="sr-only" htmlFor="child-name">
            Nome da criança
          </label>
          <input
            id="child-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Digite o nome aqui"
            autoFocus
            className="cartoon-input w-full"
          />

          <Button type="submit" size="lg" disabled={!canContinue}>
            Continuar <span aria-hidden="true">→</span>
          </Button>
        </form>
      </section>
    </AppShell>
  );
}
