import type { CSSProperties } from 'react';

interface AnimalPortraitProps {
  src: string;
  alt?: string;
  frames?: number;
  className?: string;
}

/** Exibe somente o primeiro quadro de uma spritesheet horizontal. */
export function AnimalPortrait({
  src,
  alt = '',
  frames = 4,
  className = '',
}: AnimalPortraitProps) {
  return (
    <span
      className={`animal-portrait ${className}`}
      style={{ '--sprite-frames': frames } as CSSProperties}
      aria-hidden={alt ? undefined : true}
    >
      <img src={src} alt={alt} draggable={false} />
    </span>
  );
}
