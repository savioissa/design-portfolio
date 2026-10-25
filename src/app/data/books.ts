import type { Lang } from '../services/i18n.service';

/*
 * Livros da estante em "Sobre mim".
 * A capa é lida de public/books/<slug>.jpg; se o arquivo não existir, a lombada fica só com o título.
 * `why` e `link` são opcionais: em branco, somem do card.
 * `color`/`ink` são o fundo e o texto da lombada; `width`/`height` variam para a estante parecer real.
 */
export interface Book {
  slug: string;
  title: Record<Lang, string>;
  author: string;
  why: Record<Lang, string>;
  link: string;
  color: string;
  ink: string;
  width: number;
  height: number;
}

export const BOOKS: Book[] = [
  {
    slug: 'o-ato-criativo',
    title: { pt: 'O ato criativo', en: 'The Creative Act', es: 'El acto creativo' },
    author: 'Rick Rubin',
    why: { pt: '', en: '', es: '' },
    link: '',
    color: '#D9D9D9', ink: '#2F2F2F', width: 112, height: 460,
  },
  {
    slug: 'comece-pelo-porque',
    title: { pt: 'Comece pelo porquê', en: 'Start with Why', es: 'Empieza con el porqué' },
    author: 'Simon Sinek',
    why: { pt: '', en: '', es: '' },
    link: '',
    color: '#E5484D', ink: '#FFFFFF', width: 88, height: 430,
  },
  {
    slug: 'design-como-storytelling',
    title: { pt: 'Design como storytelling', en: 'Design Is Storytelling', es: 'El diseño como storytelling' },
    author: 'Ellen Lupton',
    why: { pt: '', en: '', es: '' },
    link: '',
    color: '#141414', ink: '#FFFFFF', width: 112, height: 430,
  },
  {
    slug: 'a-startup-enxuta',
    title: { pt: 'A startup enxuta', en: 'The Lean Startup', es: 'El método Lean Startup' },
    author: 'Eric Ries',
    why: { pt: '', en: '', es: '' },
    link: '',
    color: '#A8D8FF', ink: '#0B3A66', width: 88, height: 390,
  },
  {
    slug: 'o-teste-da-mae',
    title: { pt: 'O teste da mãe', en: 'The Mom Test', es: 'The Mom Test' },
    author: 'Rob Fitzpatrick',
    why: { pt: '', en: '', es: '' },
    link: '',
    color: '#FFB3D1', ink: '#7A1240', width: 88, height: 400,
  },
  {
    slug: 'design-centrado-no-usuario',
    title: { pt: 'Design centrado no usuário', en: 'User-Centered Design', es: 'Diseño centrado en el usuario' },
    author: 'Travis Lowdermilk',
    why: { pt: '', en: '', es: '' },
    link: '',
    color: '#8B5CF6', ink: '#FFFFFF', width: 112, height: 460,
  },
];
