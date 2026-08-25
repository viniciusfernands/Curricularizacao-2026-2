import type { ReactNode } from 'react';

interface TileButtonProps {
  /** Ícone grande (emoji provisório ou, futuramente, um SVG). */
  icon: ReactNode;
  label: string;
  description?: string;
  /** Classes de cor de fundo (Tailwind). */
  color?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * Card-botão grande usado nos menus de seleção (nível / atividade).
 * Área de toque generosa, ícone em destaque e pouco texto — adequado à
 * faixa etária (5–6 anos), que ainda lê pouco.
 */
export function TileButton({
  icon,
  label,
  description,
  color = 'bg-white hover:bg-slate-50',
  disabled = false,
  onClick,
}: TileButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group relative flex aspect-square w-full flex-col items-center
        justify-center gap-2 rounded-[2rem] p-6 text-center shadow-md
        ring-1 ring-black/5 transition-transform duration-150
        hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/60
        disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100
        ${color}`}
    >
      <span className="text-6xl drop-shadow-sm sm:text-7xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xl font-extrabold text-slate-800 sm:text-2xl">
        {label}
      </span>
      {description && (
        <span className="text-sm font-semibold text-slate-500">
          {description}
        </span>
      )}
      {disabled && (
        <span className="absolute right-3 top-3 rounded-full bg-slate-700/80 px-2 py-0.5 text-xs font-bold text-white">
          Em breve
        </span>
      )}
    </button>
  );
}
