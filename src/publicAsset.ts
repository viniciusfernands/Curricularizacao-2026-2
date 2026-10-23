/** Resolve arquivos de public/ respeitando o subdiretório de publicação do Vite. */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
