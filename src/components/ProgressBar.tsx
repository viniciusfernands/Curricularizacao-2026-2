interface ProgressBarProps {
  /** Valor atual (ex.: questões respondidas). */
  value: number;
  /** Valor máximo (ex.: total de questões). */
  max: number;
  label?: string;
}

/** Barra de progresso simples e colorida para indicar o avanço na atividade. */
export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-sm font-bold text-slate-600">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
