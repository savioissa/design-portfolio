import type { Lang } from '../services/i18n.service';

/* Livros que indico, listados em "Sobre mim" (título traduzido e autor). */
export interface Book {
  slug: string;
  title: Record<Lang, string>;
  author: string;
}

export const BOOKS: Book[] = [
  { slug: 'o-ato-criativo', title: { pt: 'O ato criativo', en: 'The Creative Act' }, author: 'Rick Rubin' },
  { slug: 'comece-pelo-porque', title: { pt: 'Comece pelo porquê', en: 'Start with Why' }, author: 'Simon Sinek' },
  { slug: 'design-como-storytelling', title: { pt: 'Design como storytelling', en: 'Design Is Storytelling' }, author: 'Ellen Lupton' },
  { slug: 'a-startup-enxuta', title: { pt: 'A startup enxuta', en: 'The Lean Startup' }, author: 'Eric Ries' },
  { slug: 'o-teste-da-mae', title: { pt: 'O teste da mãe', en: 'The Mom Test' }, author: 'Rob Fitzpatrick' },
  { slug: 'design-centrado-no-usuario', title: { pt: 'Design centrado no usuário', en: 'User-Centered Design' }, author: 'Travis Lowdermilk' },
];
