import { Injectable, signal, computed, effect } from '@angular/core';

export type Lang = 'pt' | 'en';
const KEY = 'lang';

const DICT = {
  en: {
    // Título sempre em 3 linhas: uma por item
    title: ['Hi, I’m Sávio Issa.', 'Product designer at', 'IClass Sistemas.'],
    subtitle: 'From Niterói, Rio de Janeiro - Brazil',
    soon: 'Soon',
    about: 'About me',
    skills: 'Skills and education',
    solve: 'How I solve problems',
    projects: 'Projects',
    themeLabel: 'Dark mode',
    langLabel: 'Language',
  },
  pt: {
    title: ['Olá, eu sou Sávio Issa.', 'Product designer na', 'IClass Sistemas.'],
    subtitle: 'De Niterói, Rio de Janeiro - Brasil',
    soon: 'Em breve',
    about: 'Sobre mim',
    skills: 'Habilidades e formação',
    solve: 'Como resolvo problemas',
    projects: 'Projetos',
    themeLabel: 'Modo escuro',
    langLabel: 'Idioma',
  },
} as const;

export type DictKey = Exclude<keyof (typeof DICT)['en'], 'title'>;

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initial());
  readonly dict = computed(() => DICT[this.lang()]);
  readonly titleLines = computed(() => this.dict().title);

  constructor() {
    effect(() => {
      document.documentElement.lang = this.lang() === 'pt' ? 'pt-BR' : 'en';
    });
  }

  t(key: DictKey): string {
    return this.dict()[key];
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    try { localStorage.setItem(KEY, lang); } catch {}
  }

  private initial(): Lang {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {}
    return 'pt';
  }
}
