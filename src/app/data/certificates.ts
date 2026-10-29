/*
 * Certificados do modal "Ver certificados" em "Habilidades e formação", do mais recente para o mais antigo.
 * `year` e `hours` são opcionais: sem eles, o item mostra só a instituição.
 * Os nomes ficam como estão nos certificados, nos dois idiomas.
 */
export interface Certificate {
  title: string;
  issuer: string;
  year?: number;
  hours?: string;
}

export const COURSE_CERTIFICATES: Certificate[] = [
  { title: 'Fundamentos de Desenvolvimento e Design Systems com IA', issuer: 'DesignCircuit', year: 2026, hours: '2h30' },
  { title: 'UI Craft: Menos, Melhor', issuer: 'DesignCircuit', year: 2026, hours: '2h' },
  { title: 'Produto para designers', issuer: 'DesignCircuit', year: 2024, hours: '8h' },
  { title: 'A (R)Evolução do Branding', issuer: 'Anacouto | Laje', year: 2024, hours: '1h12' },
  { title: 'Storytelling para Negócios', issuer: 'PM3', year: 2024, hours: '5h' },
  { title: 'Design de Serviço', issuer: 'PM3', year: 2024, hours: '5h' },
  { title: 'UX Design & Research Essencial', issuer: 'UXNOW', year: 2023, hours: '11h' },
  { title: 'UX e UI Design', issuer: 'Instituto TIM', year: 2021, hours: '40h' },
  { title: 'Claude Foundations', issuer: 'Anthropic' },
];

export const TALK_CERTIFICATES: Certificate[] = [
  { title: 'Designer como programador: usando código como ferramenta criativa', issuer: 'VIII Semana Acadêmica de Design · UFF', year: 2023, hours: '2h' },
  { title: 'Metodologia de design: como escolher os métodos para seu projeto', issuer: 'VIII Semana Acadêmica de Design · UFF', year: 2023, hours: '2h' },
  { title: 'O futuro do design na era da Web3', issuer: 'VII Semana Acadêmica de Design · UFF', year: 2022, hours: '2h' },
  { title: 'O dia a dia de um UI Designer', issuer: 'VII Semana Acadêmica de Design · UFF', year: 2022, hours: '2h' },
];
