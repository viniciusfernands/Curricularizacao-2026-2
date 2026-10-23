import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { AnimalPortrait } from '../components/AnimalPortrait';
import { Button } from '../components/Button';
import { useNav } from '../app/nav-context';
import { useSession } from '../state/session-context';
import type { Identification } from '../domain/identification';

const fields: { key: keyof Identification; id: string; label: string; placeholder: string }[] = [
  { key: 'school', id: 'school', label: 'Escola', placeholder: 'Nome da escola' },
  { key: 'classGroup', id: 'class-group', label: 'Turma', placeholder: 'Ex.: A, B, turma da manhã' },
  { key: 'schoolYear', id: 'school-year', label: 'Ano', placeholder: 'Ex.: Pré II, 5º ano, 6º ano' },
  { key: 'teacher', id: 'teacher', label: 'Professora', placeholder: 'Nome da professora' },
  { key: 'child', id: 'child-name', label: 'Nome da criança', placeholder: 'Nome de quem vai jogar' },
];

export function IdentifyScreen() {
  const { go } = useNav();
  const { identification, setIdentification } = useSession();
  const [values, setValues] = useState(identification);

  function handleContinue() {
    setIdentification(values);
    go({ name: 'levels' });
  }

  return (
    <AppShell showChild={false}>
      <section className="menu-card grid w-full max-w-4xl items-center gap-4 md:grid-cols-[0.7fr_1.3fr] md:gap-8">
        <div className="flex flex-col items-center">
          <div className="thought-bubble">Vamos brincar?</div>
          <AnimalPortrait
            src="assets/animals/cat/cat_think.png"
            className="w-28 sm:w-36 md:w-64"
          />
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleContinue();
          }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="game-kicker">QUEM VAI JOGAR?</span>
          <h1 className="text-3xl font-black text-slate-800">Vamos começar!</h1>
          <p id="identification-help" className="font-bold text-slate-500">
            Todos os campos são opcionais. Um adulto pode preencher ou você pode continuar sem informar nada.
          </p>
          <div className="grid w-full gap-3 text-left sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.key === 'child' ? 'sm:col-span-2' : ''}>
                <label className="mb-1 block font-bold text-slate-700" htmlFor={field.id}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.key}
                  type="text"
                  value={values[field.key]}
                  onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
                  placeholder={field.placeholder}
                  aria-describedby="identification-help"
                  autoComplete="off"
                  className="cartoon-input identification-input w-full"
                />
              </div>
            ))}
          </div>
          <Button type="submit" size="lg">
            Continuar <span aria-hidden="true">→</span>
          </Button>
        </form>
      </section>
    </AppShell>
  );
}
