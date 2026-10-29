import { Component, input } from '@angular/core';

/** Deslocamento x, y (unidades do desenho), giro (graus) e escala em relação à posição final */
type Pose = [x: number, y: number, rot: number, scale: number];

interface Motion {
  /** 01. Elementos independentes: soltos, com espaço vazio entre eles */
  a: Pose;
  /** 02. Aproximação: sobrepostos em arranjos de teste, diferentes do final */
  b: Pose;
  /** Pequeno atraso (s), para o grupo não se mover em bloco */
  delay: number;
}

/*
 * Todas as formas estão desenhadas na posição final (03. Uma nova estrutura);
 * as poses A e B dizem de onde cada uma parte e por onde passa.
 */
const MOTION = {
  disc: { a: [-112, -76, 0, 0.6], b: [-40, -20, 0, 0.85], delay: 0 },
  plane: { a: [113, -44, 20, 0.7], b: [40, -24, 35, 0.9], delay: 0.15 },
  arc: { a: [-40, 124, -70, 0.75], b: [24, 48, -30, 0.95], delay: 0.3 },
  cylinder: { a: [120, -271, 0, 0.75], b: [64, -124, 0, 0.9], delay: 0.1 },
  pebble: { a: [130, 84, -12, 1], b: [64, 18, 10, 1], delay: 0.25 },
  sphere: { a: [-292, -148, 0, 1], b: [-150, -96, 0, 1], delay: 0.35 },
  square: { a: [-104, -102, 45, 1], b: [-64, -34, 20, 1], delay: 0.05 },
  hatch: { a: [-150, 104, 0, 1], b: [-70, 30, -15, 1], delay: 0.2 },
  dots: { a: [284, 300, 0, 1], b: [124, 136, 0, 1], delay: 0.4 },
  ground: { a: [0, 46, 0, 0.3], b: [0, 18, 0, 0.7], delay: 0 },
} satisfies Record<string, Motion>;

type Name = keyof typeof MOTION;

/** Variáveis CSS de cada elemento, lidas pela animação "compose" */
function vars({ a, b, delay }: Motion): Record<string, string> {
  return {
    '--ax': `${a[0]}px`,
    '--ay': `${a[1]}px`,
    '--ar': `${a[2]}deg`,
    '--as': `${a[3]}`,
    '--bx': `${b[0]}px`,
    '--by': `${b[1]}px`,
    '--br': `${b[2]}deg`,
    '--bs': `${b[3]}`,
    'animation-delay': `${delay}s`,
  };
}

/** Grade de pontos 4 x 4 */
const DOTS = Array.from({ length: 16 }, (_, i) => ({ x: 76 + (i % 4) * 20, y: 70 + Math.floor(i / 4) * 20 }));

/**
 * "Formas diferentes que se combinam para criar outra": um estudo de formas modernista. Elementos
 * independentes (disco, plano translúcido, arco, cilindro, esfera, forma orgânica, grade de pontos,
 * hachura, quadrado) começam soltos, se aproximam e se sobrepõem em arranjos de teste, com linhas de
 * construção à vista, e se assentam numa estrutura nova, envolvida por um círculo fino. As transparências
 * criam tons novos onde as formas se cruzam. Em ciclo contínuo de 16s.
 *
 * Preto, branco e cinzas, com o laranja queimado só no disco. No modo escuro os cinzas se invertem e
 * as transparências clareiam em vez de escurecer. Com menos movimento pedido pelo sistema, a estrutura
 * final aparece parada.
 */
@Component({
  selector: 'app-compose-art',
  standalone: true,
  template: `
    <svg viewBox="0 0 480 480" role="img" [attr.aria-label]="label()">
      <defs>
        <filter id="cp-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow class="shadow" dx="0" dy="7" stdDeviation="7" />
        </filter>
        <linearGradient id="cp-cylinder">
          <stop offset="0" class="stop-1" />
          <stop offset="0.45" class="stop-2" />
          <stop offset="1" class="stop-3" />
        </linearGradient>
        <radialGradient id="cp-sphere" cx="0.36" cy="0.3" r="0.75">
          <stop offset="0" class="stop-1" />
          <stop offset="1" class="stop-3" />
        </radialGradient>
      </defs>

      <g class="float">
        <!-- 03: círculo fino que dá unidade à estrutura nova -->
        <circle class="ring" cx="240" cy="236" r="172" />

        <!-- 02: linhas de construção (análise e experimentação) -->
        <g class="guides">
          <path d="M232 60V430M70 196H420M92 336L372 56" />
          <circle cx="232" cy="196" r="100" />
          <path class="mark" d="M226 190l12 12M238 190l-12 12" />
        </g>

        <g class="el" [style]="m.dots">
          @for (d of dots; track $index) {
            <circle class="dot" [attr.cx]="d.x" [attr.cy]="d.y" r="2.2" />
          }
        </g>
        <path class="el line" [style]="m.ground" d="M60 400H430" />
        <path class="el arc" [style]="m.arc" d="M197.8 290A100 100 0 0 1 197.8 102" />
        <circle class="el ember shadowed" [style]="m.disc" cx="232" cy="196" r="76" />
        <g class="el shadowed" [style]="m.cylinder">
          <path class="cylinder" d="M138 322V400A42 12 0 0 0 222 400V322Z" />
          <ellipse class="cylinder-top" cx="180" cy="322" rx="42" ry="12" />
        </g>
        <path
          class="el glass dark"
          [style]="m.pebble"
          d="M92 322C86 296 114 278 150 280C184 282 212 294 210 316C208 338 174 348 144 346C116 344 96 340 92 322Z"
        />
        <rect class="el glass" [style]="m.plane" x="258" y="88" width="58" height="312" />
        <circle class="el sphere shadowed" [style]="m.sphere" cx="352" cy="378" r="22" />
        <rect class="el solid shadowed" [style]="m.square" x="322" y="150" width="24" height="24" />
        <path class="el line" [style]="m.hatch" d="M340 232H410M340 242H410M340 252H410" />
      </g>
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { display: block; width: 100%; height: auto; overflow: visible; }

    .shadow { flood-color: var(--illus-shadow); }
    .stop-1 { stop-color: var(--illus-gray-1); }
    .stop-2 { stop-color: var(--illus-gray-2); }
    .stop-3 { stop-color: var(--illus-gray-3); }

    .shadowed { filter: url(#cp-shadow); }
    .ember { fill: var(--illus-ember); }
    .solid { fill: var(--illus-line); }
    .dot { fill: var(--text-secondary); }

    .line {
      fill: none;
      stroke: var(--illus-line);
      stroke-width: 1.4;
      stroke-linecap: round;
    }
    .arc {
      fill: none;
      stroke: var(--illus-line);
      stroke-width: 9;
    }

    .cylinder {
      fill: url(#cp-cylinder);
      stroke: var(--illus-line);
      stroke-width: 1.2;
    }
    .cylinder-top {
      fill: var(--illus-gray-1);
      stroke: var(--illus-line);
      stroke-width: 1.2;
    }
    .sphere {
      fill: url(#cp-sphere);
      stroke: var(--illus-line);
      stroke-width: 1;
    }

    /* Planos translúcidos: onde cruzam outras formas, criam um tom novo */
    .glass {
      fill: var(--illus-gray-2);
      fill-opacity: 0.75;
      stroke: var(--illus-line);
      stroke-opacity: 0.35;
      stroke-width: 1;
      mix-blend-mode: var(--illus-blend);
    }
    .glass.dark { fill: var(--illus-gray-3); }

    /* Ciclo: soltos (0–12%), aproximação (12–42%), estrutura nova (42–84%), soltando (84–100%) */
    .el {
      transform-box: fill-box;
      transform-origin: center;
      animation: compose 16s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
    }
    @keyframes compose {
      0%, 12%, 100% { transform: translate(var(--ax), var(--ay)) rotate(var(--ar)) scale(var(--as)); }
      32%, 42% { transform: translate(var(--bx), var(--by)) rotate(var(--br)) scale(var(--bs)); }
      58%, 84% { transform: translate(0, 0) rotate(0deg) scale(1); }
    }

    .guides {
      fill: none;
      stroke: var(--text-secondary);
      stroke-width: 0.8;
      stroke-dasharray: 3 5;
      opacity: 0;
      animation: guides 16s ease infinite;
    }
    .guides .mark { stroke-dasharray: none; stroke-width: 1.2; }
    @keyframes guides {
      0%, 22% { opacity: 0; }
      32%, 46% { opacity: 0.9; }
      56%, 100% { opacity: 0; }
    }

    .ring {
      fill: none;
      stroke: var(--text-secondary);
      stroke-width: 1;
      opacity: 0;
      animation: ring 16s ease infinite;
    }
    @keyframes ring {
      0%, 54% { opacity: 0; }
      62%, 82% { opacity: 0.7; }
      90%, 100% { opacity: 0; }
    }

    /* O conjunto flutua devagar, em qualquer fase */
    .float { animation: float 7s ease-in-out infinite alternate; }
    @keyframes float {
      from { transform: translateY(-5px); }
      to { transform: translateY(5px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .el, .float, .guides { animation: none; }
      .ring { animation: none; opacity: 0.7; }
    }
  `,
})
export class ComposeArtComponent {
  readonly label = input.required<string>();

  readonly dots = DOTS;
  readonly m = Object.fromEntries(Object.entries(MOTION).map(([k, v]) => [k, vars(v as Motion)])) as Record<Name, Record<string, string>>;
}
