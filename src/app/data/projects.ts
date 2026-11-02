import type { Lang } from '../services/i18n.service';

/*
 * Página "Projetos": projetos e as seções em que aparecem.
 * Um projeto pode estar em mais de uma seção ("Projetos selecionados" é um destaque das categorias de baixo);
 * as seções só apontam para o slug, então título, imagem e tags ficam num lugar só.
 * `image` é opcional: sem ela, o card mostra um placeholder cinza. Use um caminho em public/, ex.: 'projects/tcc.jpg'.
 * O card corta a imagem na proporção 11:5.
 * `tags` são as áreas de conhecimento do projeto, na ordem em que aparecem (nomes e traduções em PROJECT_TAGS).
 * `route` é opcional: sem ela, o card mostra o chip "Em breve" no hover.
 */

/** Áreas de conhecimento usadas nas tags dos cards; uma tag nova entra aqui antes de ser usada num projeto */
export const PROJECT_TAGS = {
  'design-grafico': { pt: 'Design gráfico', en: 'Graphic design' },
  cenografia: { pt: 'Cenografia', en: 'Scenography' },
  'ui-ux': { pt: 'UI/UX', en: 'UI/UX' },
  hardware: { pt: 'Hardware', en: 'Hardware' },
  arduino: { pt: 'Arduino', en: 'Arduino' },
  codigo: { pt: 'Código', en: 'Code' },
  'design-industrial': { pt: 'Design industrial', en: 'Industrial design' },
  sql: { pt: 'SQL', en: 'SQL' },
  'design-engineer': { pt: 'Design enginer', en: 'Design enginer' },
  'game-design': { pt: 'Game design', en: 'Game design' },
  marketing: { pt: 'Marketing', en: 'Marketing' },
  'criacao-de-conteudo': { pt: 'Criação de conteúdo', en: 'Content creation' },
  'design-system': { pt: 'Design system', en: 'Design system' },
  'fluxo-com-ia': { pt: 'Fluxo com IA', en: 'AI workflows' },
  dataviz: { pt: 'Dataviz', en: 'Dataviz' },
} satisfies Record<string, Record<Lang, string>>;

export type ProjectTag = keyof typeof PROJECT_TAGS;

export interface Project {
  title: Record<Lang, string>;
  tags: ProjectTag[];
  image?: string;
  route?: string;
}

export interface ProjectSection {
  id: string;
  title: Record<Lang, string>;
  projects: ProjectSlug[];
}

export const PROJECTS = {
  'semana-engenharia-design-2023': {
    title: { pt: 'Semende UFF - 2023', en: 'Semende UFF - 2023' },
    tags: ['design-grafico', 'cenografia', 'ui-ux'],
    image: 'projects/semende-2023.jpg',
  },
  'painel-de-os': {
    title: { pt: 'Painel de Serviço', en: 'Service panel' },
    tags: ['ui-ux', 'dataviz'],
    image: 'projects/painel-de-os.jpg',
  },
  tcc: {
    title: { pt: 'Trabalho de conclusão de curso', en: 'Undergraduate thesis' },
    tags: ['hardware', 'arduino', 'codigo', 'design-industrial'],
    image: 'projects/tcc.jpg',
  },
  'financas-web': {
    title: { pt: 'Web-app para finanças pessoais', en: 'Personal finance web app' },
    tags: ['ui-ux', 'sql', 'design-engineer'],
    image: 'projects/financas-web.jpg',
  },
  'baralho-de-di': {
    title: { pt: 'Projeto: Baralho de design', en: 'Project: Design card deck' },
    tags: ['design-grafico'],
    image: 'projects/baralho-de-di.jpg',
  },
  'game-design': {
    title: { pt: 'Game design', en: 'Game design' },
    tags: ['game-design', 'ui-ux', 'marketing', 'codigo'],
    image: 'projects/game-design.jpg',
  },
  'comunidade-criativa': {
    title: { pt: 'Comunidade criativa', en: 'Creative community' },
    tags: ['design-grafico', 'criacao-de-conteudo'],
    image: 'projects/comunidade-criativa.jpg',
  },
  'linguagem-de-design': {
    title: { pt: 'Linguagem de design e design tokens', en: 'Design language and design tokens' },
    tags: ['design-system', 'ui-ux'],
    image: 'projects/linguagem-de-design.jpg',
  },
  'reformulacao-do-sistema': {
    title: { pt: 'Reformulação do sistema', en: 'System redesign' },
    tags: ['ui-ux'],
    image: 'projects/reformulacao-do-sistema.jpg',
  },
  'ferramenta-de-prototipacao': {
    title: { pt: 'Ferramenta de prototipação', en: 'Prototyping tool' },
    tags: ['fluxo-com-ia'],
    image: 'projects/ferramenta-de-prototipacao.jpg',
  },
} satisfies Record<string, Project>;

export type ProjectSlug = keyof typeof PROJECTS;

export const PROJECT_SECTIONS: ProjectSection[] = [
  {
    id: 'selecionados',
    title: { pt: 'Projetos selecionados', en: 'Selected projects' },
    projects: ['semana-engenharia-design-2023', 'painel-de-os', 'tcc', 'financas-web'],
  },
  {
    id: 'faculdade-e-pessoais',
    title: { pt: 'Faculdade e pessoais', en: 'University and personal' },
    projects: ['semana-engenharia-design-2023', 'tcc', 'baralho-de-di', 'game-design', 'comunidade-criativa'],
  },
  {
    id: 'profissionais',
    title: { pt: 'Profissionais', en: 'Professional' },
    projects: ['linguagem-de-design', 'painel-de-os', 'reformulacao-do-sistema'],
  },
  {
    id: 'ferramentas-com-ia',
    title: { pt: 'Experimentações com IA', en: 'AI experiments' },
    projects: ['financas-web', 'ferramenta-de-prototipacao'],
  },
];
