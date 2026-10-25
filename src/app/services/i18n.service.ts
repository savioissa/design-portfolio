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
    booksIntro: '10 books that shaped the way I work and think about design',
    close: 'Close',
    buy: 'Where to buy',
    portraitsLabel: 'Three portraits of Sávio: a pencil sketch, a photo and a pixel art avatar',
    // Um item por parágrafo
    aboutText: [
      'I’m Sávio Issa, a product designer with a degree in Industrial Design from Universidade Federal Fluminense, currently working on a B2B product. I’m driven by curiosity and a passion for creating, by the urge to understand how things work, discover new possibilities and turn ideas into experiences that can contribute to a better world.',
      'I’ve never liked limiting myself to a single label within design. Throughout my journey, I’ve moved closer to different fields and learned from each of them: hardware and software, visual design, prototyping, augmented reality technologies, databases, APIs and anything else that helps me bring an idea to life. I like learning by doing: experimenting, taking things apart, building, learning and starting over. In the end, that’s why I fell in love with design: the chance to keep learning while turning curiosity into creation.',
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
        period: '2021 – 2026',
        title: 'Bachelor’s in Industrial Design',
        org: 'Universidade Federal Fluminense (UFF)',
        logo: 'logos/uff.png',
        text: 'Focus on Product Design.',
        tag: 'Education',
        current: false,
      },
    ],
    statsLabel: 'Highlights',
    stats: [
      { value: '3+', label: 'Years designing digital products' },
      { value: '5+', label: 'Years of design experience' },
      { value: '10', label: 'Final thesis grade at Universidade Federal Fluminense' },
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
    home: 'Página inicial',
    visitor: 'Visitante',
    booksTitle: 'Livros que indico',
    booksIntro: '10 livros que moldaram minha forma de trabalhar e pensar design',
    close: 'Fechar',
    buy: 'Onde comprar',
    portraitsLabel: 'Três retratos do Sávio: um desenho a lápis, uma foto e um avatar em pixel art',
    aboutText: [
      'Sou Sávio Issa, designer de produto formado em Desenho Industrial pela Universidade Federal Fluminense, atualmente trabalhando em um produto B2B. Sou movido pela curiosidade e pela paixão de criar, pela vontade de entender como as coisas funcionam, descobrir novas possibilidades e transformar ideias em experiências que possam contribuir para um mundo melhor.',
      'Nunca gostei muito de me limitar a um único rótulo dentro do design. Ao longo da minha trajetória, fui me aproximando de diferentes campos e aprendendo com cada um deles: hardware e software, design visual, prototipação, tecnologias de realidade aumentada, banco de dados, APIs e tudo aquilo que possa me ajudar a materializar uma ideia. Gosto de aprender fazendo, de experimentar, desmontar, construir, aprender e começar de novo. No fim, foi por isso que me apaixonei pelo design: a possibilidade de estar sempre aprendendo enquanto transformo curiosidade em criação.',
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
        period: '2021 – 2026',
        title: 'Bacharelado em Desenho Industrial',
        org: 'Universidade Federal Fluminense (UFF)',
        logo: 'logos/uff.png',
        text: 'Foco em Design de Produto.',
        tag: 'Formação',
        current: false,
      },
    ],
    statsLabel: 'Destaques',
    stats: [
      { value: '+3', label: 'Anos de experiência com design de produtos digitais' },
      { value: '+5', label: 'Anos de experiência com design' },
      { value: '10', label: 'Nota do TCC pela Universidade Federal Fluminense' },
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
