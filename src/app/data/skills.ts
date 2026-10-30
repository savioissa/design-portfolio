import type { Lang } from '../services/i18n.service';
import type { LogoName } from '../ui/icon/logos.generated';

/*
 * Seção "Minhas habilidades" em "Habilidades e formação": habilidades (verbetes numerados) e ferramentas (logo + nome).
 * Para trocar um ícone, adicione o nome em scripts/icons.config.json ("logos") e rode `npm run icons`.
 */
export interface Tool {
  logo: LogoName;
  name: string;
}

export interface Skill {
  title: Record<Lang, string>;
  text: Record<Lang, string>;
}

export const TOOLS: Tool[] = [
  { logo: 'figma', name: 'Figma' },
  { logo: 'adobe-photoshop', name: 'Photoshop' },
  { logo: 'adobe-illustrator', name: 'Illustrator' },
  { logo: 'visual-studio-code', name: 'VS Code' },
  { logo: 'postman-icon', name: 'Postman' },
  { logo: 'claude-icon', name: 'Claude' },
  { logo: 'obsidian-icon', name: 'Obsidian' },
  { logo: 'github-icon', name: 'GitHub' },
];

export const SKILLS: Skill[] = [
  {
    title: { pt: 'Pesquisa', en: 'Research' },
    text: {
      pt: 'Entrevistas, testes de usabilidade e análise de dados para entender quem usa o produto e priorizar os problemas certos.',
      en: 'Interviews, usability tests and data analysis to understand who uses the product and prioritize the right problems.',
    },
  },
  {
    title: { pt: 'Prototipação', en: 'Prototyping' },
    text: {
      pt: 'Do wireframe ao protótipo de alta fidelidade, para validar ideias rápido antes de construir.',
      en: 'From wireframes to high-fidelity prototypes, to validate ideas quickly before building.',
    },
  },
  {
    title: { pt: 'UI e UX', en: 'UI & UX' },
    text: {
      pt: 'Interfaces claras e consistentes, equilibrando as necessidades de quem usa com os objetivos do negócio.',
      en: 'Clear, consistent interfaces that balance user needs with business goals.',
    },
  },
  {
    title: { pt: 'Handoff', en: 'Handoff' },
    text: {
      pt: 'Especificações, componentes e documentação para o time de desenvolvimento construir sem ruído.',
      en: 'Specs, components and documentation so the development team can build without friction.',
    },
  },
  {
    title: { pt: 'QA', en: 'QA' },
    text: {
      pt: 'Revisão da implementação contra o design, apontando ajustes de interface, comportamento e acessibilidade.',
      en: 'Reviewing the implementation against the design, flagging interface, behavior and accessibility fixes.',
    },
  },
  {
    title: { pt: 'Fluxos com IA', en: 'AI workflows' },
    text: {
      pt: 'Uso de IA para acelerar pesquisa, documentação e prototipação, do primeiro rascunho ao código.',
      en: 'Using AI to speed up research, documentation and prototyping, from first draft to code.',
    },
  },
];

/** Tags da faixa "Áreas de interesse", abaixo de "Minhas habilidades" (termos usados como estão, nos dois idiomas) */
export const TAGS: string[] = [
  'Product Design', 'Design Strategy', 'UX Design', 'Problem Solving', 'UI Design', 'Human-Centered Design',
  'Design Systems', 'Design Thinking', 'Design Tokens', 'Service Design', 'Prototyping', 'Interaction Design',
  'Design Research', 'User Interviews', 'Accessibility', 'WCAG 2.2', 'HTML', 'CSS', 'HTML & CSS', 'Angular',
  'PrimeNG', 'APIs', 'SQL', 'AI', 'AI Prototyping', 'Vibe Coding', 'Information Architecture', 'Jobs to be Done',
  'Journey Mapping', 'Heuristic Evaluation', 'Typography', 'Responsive Design', 'Motion Design', 'Mockups',
  'Ideation', 'Design Language', 'Design Principles', 'Craft', 'Technology', 'Hardware', 'Electronics', 'Arduino',
  'RFID', 'CAD', '3D Modeling', '3D Printing', 'Augmented Reality', 'UX Metrics', 'OKRs', 'Agile',
  'Design Critique', 'Stakeholder Management',
];
