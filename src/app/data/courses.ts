/*
 * Cursos em "Habilidades e formação", listados só em texto.
 * `start` e `current` são opcionais: sem `start`, o curso aparece sem período.
 */
export interface Course {
  slug: string;
  title: string;
  provider: string;
  start?: number;
  current?: boolean;
}

export const COURSES: Course[] = [
  { slug: 'design-circuit', title: 'Design Circuit 2.0', provider: 'DesignCircuit', start: 2025, current: true },
  { slug: 'uxnow', title: 'UX Design & Research Essencial', provider: 'UXNOW' },
  { slug: 'claude-foundations', title: 'Claude Foundations', provider: 'Anthropic' },
];
