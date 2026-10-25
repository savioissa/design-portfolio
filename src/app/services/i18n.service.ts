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
    back: 'Back',
    home: 'Home',
    visitor: 'Visitor',
    booksTitle: 'Books I recommend',
    booksIntro: '6 books that shaped the way I work and think about products and problems',
    close: 'Close',
    buy: 'Where to buy',
    portraitsLabel: 'Three portraits of Sávio: a pencil sketch, a photo and a pixel art avatar',
    // Um item por parágrafo
    aboutText: [
      'I’m Sávio Issa, a product designer with a degree in Industrial Design from Universidade Federal Fluminense, currently working on a B2B product. I’m driven by curiosity and a passion for creating, by the urge to understand how things work, discover new possibilities and turn ideas into experiences that can contribute to a better world.',
      'I’ve never liked limiting myself to a single label within design. Throughout my journey, I’ve explored different fields, hardware and software, visual design, prototyping, augmented reality, data, always looking for new ways to bring ideas to life. I like learning by doing, experimenting and building. That’s why I fell in love with design: the chance to turn curiosity into creation, learning along the way.',
    ],
    timelineTitle: 'Career and experience',
    // Do mais recente para o mais antigo; `current` destaca o item atual
    timeline: [
      {
        period: '2023 – present',
        title: 'Junior UX Analyst',
        org: 'IClass · B2B software (FSM)',
        logo: 'logos/iclass.png',
        text: 'I started as a UX intern and was hired as a Junior UX Analyst in October 2025.',
        tag: '',
        current: true,
      },
      {
        period: '2022 – 2023',
        title: 'Quality Advisor',
        org: 'Papo Design · junior enterprise',
        logo: 'logos/papo-design.png',
        text: 'Responsible for internal processes and for standardizing the delivery of design projects.',
        tag: '',
        current: false,
      },
      {
        period: '2020 – 2022',
        title: 'Mobile game developer',
        org: 'Paranapanema Games',
        logo: 'logos/paranapanema-games.jpg',
        text: 'Independent mobile game developer with over 10,000 downloads on the Play Store.',
        tag: '',
        current: false,
      },
    ],
    statsLabel: 'Highlights',
    stats: [
      { value: '3+', label: 'Years designing digital products' },
      { value: '5+', label: 'Years of design experience' },
    ],
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
    back: 'Voltar',
    home: 'Início',
    visitor: 'Visitante',
    booksTitle: 'Livros que indico',
    booksIntro: '6 livros que moldaram minha forma de trabalhar, pensar produto e problema',
    close: 'Fechar',
    buy: 'Onde comprar',
    portraitsLabel: 'Três retratos do Sávio: um desenho a lápis, uma foto e um avatar em pixel art',
    aboutText: [
      'Sou Sávio Issa, designer de produto formado em Desenho Industrial pela Universidade Federal Fluminense, atualmente trabalhando em um produto B2B. Sou movido pela curiosidade e pela paixão de criar, pela vontade de entender como as coisas funcionam, descobrir novas possibilidades e transformar ideias em experiências que possam contribuir para um mundo melhor.',
      'Nunca gostei de me limitar a um único rótulo dentro do design. Ao longo da minha trajetória, explorei diferentes campos, hardware e software, design visual, prototipação, realidade aumentada, dados, sempre buscando novas formas de materializar ideias. Gosto de aprender fazendo, experimentar e construir. Foi por isso que me apaixonei pelo design: pela possibilidade de transformar curiosidade em criação, aprendendo ao longo do caminho.',
    ],
    timelineTitle: 'Trajetória e experiência',
    timeline: [
      {
        period: '2023 – atual',
        title: 'Analista de UX Júnior',
        org: 'IClass · software B2B (FSM)',
        logo: 'logos/iclass.png',
        text: 'Comecei como estagiário de UX e fui efetivado como Analista de UX Júnior em outubro de 2025.',
        tag: '',
        current: true,
      },
      {
        period: '2022 – 2023',
        title: 'Assessor de Qualidade',
        org: 'Papo Design · empresa júnior',
        logo: 'logos/papo-design.png',
        text: 'Responsável por processos internos e pela padronização das entregas de projetos de design.',
        tag: '',
        current: false,
      },
      {
        period: '2020 – 2022',
        title: 'Desenvolvedor de jogos mobile',
        org: 'Paranapanema Games',
        logo: 'logos/paranapanema-games.jpg',
        text: 'Desenvolvedor independente de jogos mobile com mais de 10 mil downloads na Play Store.',
        tag: '',
        current: false,
      },
    ],
    statsLabel: 'Destaques',
    stats: [
      { value: '+3', label: 'Anos de experiência com design de produtos digitais' },
      { value: '+5', label: 'Anos de experiência com design' },
    ],
  },
} as const;

export type DictKey = Exclude<keyof (typeof DICT)['en'], 'title' | 'aboutText' | 'timeline' | 'stats'>;

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initial());
  readonly dict = computed(() => DICT[this.lang()]);
  readonly titleLines = computed(() => this.dict().title);
  readonly aboutText = computed(() => this.dict().aboutText);
  readonly timeline = computed(() => this.dict().timeline);
  readonly stats = computed(() => this.dict().stats);

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
