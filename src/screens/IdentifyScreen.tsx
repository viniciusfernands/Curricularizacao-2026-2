import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';

/**
 * Identificação da criança. Preenchida pelo professor (a criança de 5–6 anos
 * ainda não digita). O nome é usado apenas para associar os registros de
 * acertos/erros/tentativas a quem jogou.
 */
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleContinue();
        }}
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        <span className="text-7xl" aria-hidden="true">
          ✏️
        </span>
        <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">
          Quem vai brincar?
        </h1>
        <p className="text-lg font-semibold text-slate-500">
          (o professor pode digitar o nome da criança)
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da criança"
          autoFocus
          className="w-full rounded-3xl border-4 border-violet-200 bg-white px-6 py-5 text-center text-2xl font-bold text-slate-800 shadow-inner outline-none focus:border-violet-400"
        />

        <Button type="submit" size="xl" disabled={!canContinue}>
          Continuar →
        </Button>
      </form>
    </AppShell>
  );
}
