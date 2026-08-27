import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

// Botão grande e arredondado, pensado para toque e para o público infantil.
const VARIANTS: Record<Variant, string> = {
  primary: 'cartoon-button--primary',
  secondary: 'cartoon-button--secondary',
  ghost: 'cartoon-button--ghost',
};

const SIZES: Record<Size, string> = {
  md: 'px-5 py-3 text-lg rounded-2xl',
  lg: 'px-8 py-5 text-2xl rounded-3xl',
  xl: 'px-10 py-6 text-3xl rounded-[2rem]',
};

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`cartoon-button inline-flex items-center justify-center gap-3 font-extrabold
        transition-transform duration-150 will-change-transform
        hover:scale-105 active:scale-95
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/60
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
