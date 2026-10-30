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
    themeLabel: 'Theme',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    langLabel: 'Language',
    home: 'Home',
    education: 'Education',
    courses: 'Courses',
    certificates: 'Certificates',
    viewCertificates: 'View certificates',
    talks: 'Talks',
    mySkills: 'My skills',
    interestsTitle: 'Areas of interest',
    quote: 'We should keep learning as long as we live.',
    quoteAuthor: 'Seneca',
    tools: 'Tools',
    skillsList: 'Skills',
    present: 'present',
    eduDegree: 'Bachelor’s in Industrial Design',
    eduFocus: 'Focused on Product Design',
    mecGrade: 'Program score from Brazil’s Ministry of Education (MEC), the highest possible.',
    thesisGrade: 'Grade of the final thesis I graduated with.',
    source: 'Source',
    campusAlt: 'Universidade Federal Fluminense campus, with students on the lawn',
    booksTitle: 'Books I recommend',
    booksIntro: '6 books that shaped the way I work and think about products and problems',
    close: 'Close',
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
        text: 'I started as a UX intern and was hired as a Junior UX Analyst in October 2025.',
        tag: '',
        current: true,
      },
      {
        period: '2022 – 2023',
        title: 'Quality Advisor',
        org: 'Papo Design · junior enterprise',
        text: 'Responsible for internal processes and for standardizing the delivery of design projects.',
        tag: '',
        current: false,
      },
      {
        period: '2020 – 2022',
        title: 'Mobile game developer',
        org: 'Paranapanema Games',
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
    solveSteps: [
      {
        title: 'Foundation',
        meaning: 'base, foundation',
        quote: '',
        author: '',
        paragraphs: [
          'Every building starts with what you can’t see. Before a solution takes shape, you need to understand the ground it will stand on.',
          'I start by investigating the context in which the problem happens. I talk to the people who live with it, analyze the available data and put different perspectives side by side. I want to understand what happens, why it happens and what it causes.',
          'Then I organize the findings, test hypotheses and separate symptoms from causes. This is the stage where the problem stops being a perception and takes shape. What seemed like one issue may reveal a different need. An obvious solution may stop making sense. A constraint may become an opportunity.',
          'To me, defining the problem well is already part of the solution. A precise framing leads to better questions, and better questions show which paths are worth exploring.',
          'The foundation isn’t where I have all the answers. It’s where I create the conditions to make conscious decisions throughout the rest of the project.',
        ],
      },
      {
        title: 'Reference',
        meaning: 'reference, consultation',
        quote: '',
        author: '',
        paragraphs: [
          'With the problem scoped, I look beyond it. I search for projects, products and solutions that have faced similar challenges, including in very different contexts.',
          'More than seeing what was done, I want to understand why it was done that way. What decisions were made? What needs guided them? What worked? What would I do differently?',
          'Designing is also learning from what other people have already discovered. I don’t start from scratch, but I don’t copy either. I use references to question familiar paths and see what can be reused, transformed or done better.',
        ],
      },
      {
        title: 'Building',
        meaning: 'build, establish',
        quote: '',
        author: '',
        paragraphs: [
          'With a clear problem and a repertoire in hand, I start turning possibilities into concrete proposals.',
          'I sketch, prototype and experiment with alternatives. I like to take ideas out of the abstract early, because it’s in contact with reality that assumptions are confirmed, adjusted or dropped.',
          'Every choice opens some paths and closes others. That’s why I evaluate each proposal by its potential and also by people’s needs, the limits of the context and the feasibility of what’s being designed.',
          'This process rarely follows a straight line. Testing a solution can reveal a problem I hadn’t seen yet. A discovery can take me back to the references or to the foundation itself. Going back isn’t rework. It’s what keeps the building standing.',
        ],
      },
      {
        title: 'Iteration',
        meaning: 'iteration, repetition',
        quote: '',
        author: '',
        paragraphs: [
          'Once a solution reaches the world, I follow how it’s used. I observe behaviors and analyze data and feedback.',
          'These signals show what’s working, what needs adjusting and what hasn’t been solved yet. Sometimes a small refinement is enough. Other times, a new problem appears.',
          'Launching isn’t the end of the project. It’s the beginning of a conversation with the people who use the product. Each cycle brings the solution closer to what people need and teaches me something I take to the next problem.',
        ],
      },
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
    themeLabel: 'Tema',
    lightMode: 'Modo claro',
    darkMode: 'Modo escuro',
    langLabel: 'Idioma',
    home: 'Início',
    education: 'Formação',
    courses: 'Cursos',
    certificates: 'Certificados',
    viewCertificates: 'Ver certificados',
    talks: 'Palestras',
    mySkills: 'Minhas habilidades',
    interestsTitle: 'Áreas de interesse',
    quote: 'Deve-se aprender enquanto se vive.',
    quoteAuthor: 'Sêneca',
    tools: 'Ferramentas',
    skillsList: 'Habilidades',
    present: 'atual',
    eduDegree: 'Bacharel em Desenho Industrial',
    eduFocus: 'Com foco em Design de Produto',
    mecGrade: 'Nota do curso na avaliação do MEC, a máxima.',
    thesisGrade: 'Nota do TCC com que me formei.',
    source: 'Fonte',
    campusAlt: 'Campus da Universidade Federal Fluminense, com estudantes no gramado',
    booksTitle: 'Livros que indico',
    booksIntro: '6 livros que moldaram minha forma de trabalhar, pensar produto e problema',
    close: 'Fechar',
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
        text: 'Comecei como estagiário de UX e fui efetivado como Analista de UX Júnior em outubro de 2025.',
        tag: '',
        current: true,
      },
      {
        period: '2022 – 2023',
        title: 'Assessor de Qualidade',
        org: 'Papo Design · empresa júnior',
        text: 'Responsável por processos internos e pela padronização das entregas de projetos de design.',
        tag: '',
        current: false,
      },
      {
        period: '2020 – 2022',
        title: 'Desenvolvedor de jogos mobile',
        org: 'Paranapanema Games',
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
    solveSteps: [
      {
        title: 'Fundação',
        meaning: 'base, fundamento',
        quote: '',
        author: '',
        paragraphs: [
          'Toda construção começa pelo que não se vê. Antes de uma solução ganhar forma, é preciso entender o terreno onde ela vai ficar de pé.',
          'Começo investigando o contexto em que o problema acontece. Converso com quem convive com ele, analiso os dados disponíveis e coloco diferentes perspectivas lado a lado. Quero entender o que acontece, por que acontece e o que isso provoca.',
          'Depois, organizo os achados, testo hipóteses e separo sintomas de causas. É nessa etapa que o problema deixa de ser uma percepção e ganha contorno. O que parecia uma questão pode revelar outra necessidade. Uma solução óbvia pode perder o sentido. Uma restrição pode virar oportunidade.',
          'Para mim, definir bem o problema já é parte da solução. Um enquadramento preciso gera perguntas melhores, e perguntas melhores mostram quais caminhos merecem ser explorados.',
          'A fundação não é onde tenho todas as respostas. É onde crio as condições para decidir com consciência durante o resto do projeto.',
        ],
      },
      {
        title: 'Referência',
        meaning: 'referência, consulta',
        quote: '',
        author: '',
        paragraphs: [
          'Com o problema delimitado, olho para fora dele. Busco projetos, produtos e soluções que já enfrentaram desafios parecidos, inclusive em contextos bem diferentes.',
          'Mais do que ver o que foi feito, quero entender por que foi feito assim. Que decisões foram tomadas? Que necessidades as orientaram? O que funcionou? O que eu faria diferente?',
          'Projetar também é aprender com o que outras pessoas já descobriram. Não parto do zero, mas também não copio. Uso as referências para questionar caminhos conhecidos e enxergar o que dá para aproveitar, transformar ou fazer melhor.',
        ],
      },
      {
        title: 'Construção',
        meaning: 'construir, estabelecer',
        quote: '',
        author: '',
        paragraphs: [
          'Com o problema claro e um repertório em mãos, começo a transformar possibilidades em propostas concretas.',
          'Esboço, prototipo e experimento alternativas. Gosto de tirar as ideias da abstração cedo, porque é no contato com a realidade que as suposições se confirmam, se ajustam ou caem.',
          'Cada escolha abre alguns caminhos e fecha outros. Por isso avalio cada proposta pelo seu potencial e também pelas necessidades das pessoas, pelos limites do contexto e pela viabilidade do que está sendo desenhado.',
          'Esse processo raramente segue uma linha reta. Testar uma solução pode revelar um problema que eu ainda não tinha visto. Uma descoberta pode me levar de volta às referências ou à própria fundação. Voltar não é retrabalho. É o que faz a construção ficar de pé.',
        ],
      },
      {
        title: 'Iteração',
        meaning: 'iteração, repetição',
        quote: '',
        author: '',
        paragraphs: [
          'Depois que uma solução chega ao mundo, acompanho como ela é usada. Observo comportamentos, analiso dados e feedbacks.',
          'Esses sinais mostram o que está funcionando, o que precisa de ajuste e o que ainda não foi resolvido. Às vezes basta um pequeno refinamento. Outras vezes, aparece um problema novo.',
          'Lançar não é o fim do projeto. É o início de uma conversa com quem usa o produto. Cada ciclo deixa a solução mais próxima do que as pessoas precisam e me ensina algo que levo para o próximo problema.',
        ],
      },
    ],
  },
} as const;

/** Atributo lang do <html> para cada idioma (leitores de tela e hifenização usam) */
const HTML_LANG: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };

export type DictKey = Exclude<keyof (typeof DICT)['en'], 'title' | 'aboutText' | 'timeline' | 'stats' | 'solveSteps'>;

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initial());
  readonly dict = computed(() => DICT[this.lang()]);
  readonly titleLines = computed(() => this.dict().title);
  readonly aboutText = computed(() => this.dict().aboutText);
  readonly timeline = computed(() => this.dict().timeline);
  readonly stats = computed(() => this.dict().stats);
  readonly solveSteps = computed(() => this.dict().solveSteps);

  constructor() {
    effect(() => {
      document.documentElement.lang = HTML_LANG[this.lang()];
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
      // Qualquer outro valor salvo (ex.: o espanhol, que existia antes) volta para o português
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {}
    return 'pt';
  }
}
