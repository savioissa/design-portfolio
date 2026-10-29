import { Component, ElementRef, afterNextRender, input, viewChild } from '@angular/core';

/*
 * Medidas da fundação, em centímetros: eixos 1–4 a cada 300 e A–C a cada 375 (as cotas da planta).
 * Sapatas, vigas e arranques estão um pouco mais grossos que o real, para ficarem legíveis no desenho pequeno.
 */
const COLS = [0, 300, 600, 900];
const ROWS = [0, 375, 750];
const FOOT = 100;
const FOOT_H = 36;
const BEAM_W = 26;
const BEAM_H = 56;
const BAR_H = 120;
/** Meia largura da gaiola de armadura do arranque */
const CAGE = 9;
const STIRRUPS = [14, 40, 66, 92, 118];

/** Centro do desenho (no plano) */
const MID_X = (COLS[0] + COLS[3]) / 2;
const MID_Y = (ROWS[0] + ROWS[2]) / 2;

/** Vista final: girada 45° e inclinada até a isométrica (35,26° acima do horizonte) */
const TURN = Math.PI / 4;
const TILT = Math.PI / 2 - Math.atan(1 / Math.SQRT2);

/** Escala e centro do desenho na planta (início) e na isométrica (fim) */
const PLAN = { scale: 0.4, cx: 250, cy: 240 };
const ISO = { scale: 0.355, cx: 240, cy: 240 };

interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** Sapatas: uma em cada cruzamento de eixos */
const FOOTINGS: Box[] = ROWS.flatMap((y) =>
  COLS.map((x) => ({ x0: x - FOOT / 2, x1: x + FOOT / 2, y0: y - FOOT / 2, y1: y + FOOT / 2 })),
);

/*
 * Vigas em trechos que não se sobrepõem: as dos eixos A–C são contínuas e as dos eixos 1–4
 * param na face delas. Assim a pintura por profundidade não briga nos cruzamentos.
 */
const BEAMS: Box[] = [
  ...ROWS.flatMap((y) =>
    COLS.slice(0, -1).map((x, i) => ({
      x0: i === 0 ? x - BEAM_W / 2 : x,
      x1: i === COLS.length - 2 ? COLS[i + 1] + BEAM_W / 2 : COLS[i + 1],
      y0: y - BEAM_W / 2,
      y1: y + BEAM_W / 2,
    })),
  ),
  ...COLS.flatMap((x) =>
    ROWS.slice(0, -1).map((y, j) => ({ x0: x - BEAM_W / 2, x1: x + BEAM_W / 2, y0: y + BEAM_W / 2, y1: ROWS[j + 1] - BEAM_W / 2 })),
  ),
];

/** Do mais distante para o mais próximo na vista final (pintura por profundidade) */
const depth = (b: Box) => (b.x0 + b.x1 + b.y0 + b.y1) / 2;
FOOTINGS.sort((a, b) => depth(a) - depth(b));
BEAMS.sort((a, b) => depth(a) - depth(b));
const NODES = FOOTINGS.map((b) => ({ x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 }));

/** Avanço de 0 a 1 entre `a` e `b`, com entrada e saída suaves */
function smooth(a: number, b: number, p: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Posição na planta (vista de cima, início) */
const planX = (x: number) => PLAN.cx + PLAN.scale * (x - MID_X);
const planY = (y: number) => PLAN.cy + PLAN.scale * (y - MID_Y);

/**
 * Fundação em desenho técnico: começa como planta 2D (sapatas, vigas e cotas, vista de cima) e,
 * conforme o progresso, gira 45° e inclina até a vista isométrica, enquanto sapatas, vigas e os
 * arranques de aço ganham altura. Sem cores: traço preto e faces em três cinzas (invertidos no
 * modo escuro).
 *
 * Quem usa o componente informa o progresso (0 a 1) com setProgress(); o desenho é refeito direto
 * no SVG, sem passar pela detecção de mudanças do Angular.
 */
@Component({
  selector: 'app-foundation-art',
  standalone: true,
  template: `
    <svg viewBox="0 0 480 480" role="img" [attr.aria-label]="label()">
      <!-- Cotas da planta: somem quando o desenho começa a girar -->
      <g #dims class="dims" aria-hidden="true">
        <path [attr.d]="dimPath" />
        @for (t of dimTexts; track $index) {
          <text [attr.x]="t.x" [attr.y]="t.y">{{ t.label }}</text>
        }
      </g>
      <g #model></g>
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { display: block; width: 100%; height: auto; overflow: visible; }

    .dims {
      fill: none;
      stroke: var(--text-secondary);
      stroke-width: 1;
    }
    .dims text {
      fill: var(--text-secondary);
      stroke: none;
      font-family: var(--font-sans);
      font-size: 13px;
      text-anchor: middle;
    }

    :host ::ng-deep {
      .face {
        stroke: var(--illus-line);
        stroke-width: 1.2;
        stroke-linejoin: round;
      }
      .top { fill: var(--illus-gray-1); }
      .side-y { fill: var(--illus-gray-2); }
      .side-x { fill: var(--illus-gray-3); }
      .cage {
        fill: none;
        stroke: var(--illus-line);
        stroke-width: 0.9;
        stroke-linecap: round;
      }
    }

    /* No mobile o desenho encolhe; as cotas crescem nas unidades do SVG para continuar legíveis */
    @media (max-width: 900px) {
      .dims text { font-size: 18px; }
    }
  `,
})
export class FoundationArtComponent {
  readonly label = input.required<string>();

  private readonly model = viewChild.required<ElementRef<SVGGElement>>('model');
  private readonly dims = viewChild.required<ElementRef<SVGGElement>>('dims');

  /** Linhas de cota: horizontal acima do eixo A e vertical à esquerda do eixo 1, com os traços de marcação */
  readonly dimPath = (() => {
    const top = planY(ROWS[0] - 110);
    const left = planX(COLS[0] - 100);
    const tick = (x: number, y: number) => `M${x - 4} ${y + 4}L${x + 4} ${y - 4}`;
    return [
      `M${planX(COLS[0])} ${top}H${planX(COLS[3])}`,
      ...COLS.map((x) => tick(planX(x), top)),
      `M${left} ${planY(ROWS[0])}V${planY(ROWS[2])}`,
      ...ROWS.map((y) => tick(left, planY(y))),
    ].join('');
  })();

  readonly dimTexts = [
    ...COLS.slice(1).map((x, i) => ({ x: planX((COLS[i] + x) / 2), y: planY(ROWS[0] - 110) - 7, label: x - COLS[i] })),
    ...ROWS.slice(1).map((y, j) => ({ x: planX(COLS[0] - 100) - 18, y: planY((ROWS[j] + y) / 2) + 4, label: y - ROWS[j] })),
  ];

  private faces: { el: SVGPolygonElement; box: Box; kind: 'foot' | 'beam'; side: 'top' | 'side-y' | 'side-x' }[] = [];
  private cages: SVGPathElement[] = [];
  private progress = 0;

  constructor() {
    afterNextRender(() => {
      this.build();
      this.render();
    });
  }

  /** Progresso da obra, de 0 (planta 2D) a 1 (isométrica com arranques) */
  setProgress(p: number): void {
    if (p === this.progress) return;
    this.progress = p;
    if (this.faces.length) this.render();
  }

  /*
   * Cria os polígonos uma vez, na ordem de pintura: laterais e topos das sapatas, laterais e topos
   * das vigas, e por último os arranques. Como todas as sapatas (e todas as vigas) têm a mesma altura,
   * um topo nunca fica atrás da lateral de outra peça do mesmo grupo.
   */
  private build(): void {
    const g = this.model().nativeElement;
    const ns = 'http://www.w3.org/2000/svg';
    const add = (box: Box, kind: 'foot' | 'beam', side: 'top' | 'side-y' | 'side-x') => {
      const el = document.createElementNS(ns, 'polygon');
      el.setAttribute('class', `face ${side}`);
      g.append(el);
      this.faces.push({ el, box, kind, side });
    };
    for (const [boxes, kind] of [
      [FOOTINGS, 'foot'],
      [BEAMS, 'beam'],
    ] as const) {
      boxes.forEach((b) => {
        add(b, kind, 'side-y');
        add(b, kind, 'side-x');
      });
      boxes.forEach((b) => add(b, kind, 'top'));
    }
    this.cages = NODES.map(() => {
      const el = document.createElementNS(ns, 'path');
      el.setAttribute('class', 'cage');
      g.append(el);
      return el;
    });
  }

  private render(): void {
    const p = this.progress;
    // Linha do tempo: planta parada até 18% (é o que aparece ao abrir a página), giro até 70%,
    // sapatas, vigas e arranques ganhando altura em sequência
    const turn = smooth(0.18, 0.7, p);
    const footH = FOOT_H * smooth(0.35, 0.58, p);
    const beamH = BEAM_H * smooth(0.5, 0.78, p);
    const barH = BAR_H * smooth(0.78, 0.96, p);

    const sin = Math.sin(TURN * turn);
    const cos = Math.cos(TURN * turn);
    const sinT = Math.sin(TILT * turn);
    const cosT = Math.cos(TILT * turn);
    const scale = PLAN.scale + (ISO.scale - PLAN.scale) * turn;
    const cx = PLAN.cx + (ISO.cx - PLAN.cx) * turn;
    const cy = PLAN.cy + (ISO.cy - PLAN.cy) * turn;

    // Projeção ortográfica: gira em torno do eixo vertical e inclina a câmera para trás
    const pt = (x: number, y: number, z: number) => {
      const dx = x - MID_X;
      const dy = y - MID_Y;
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      return `${(cx + scale * rx).toFixed(1)},${(cy + scale * (ry * cosT - (z - 60) * sinT)).toFixed(1)}`;
    };

    this.dims().nativeElement.style.opacity = String(1 - smooth(0.15, 0.3, p));

    for (const { el, box: b, kind, side } of this.faces) {
      const z0 = kind === 'foot' ? 0 : footH;
      const z1 = kind === 'foot' ? footH : footH + beamH;
      const pts =
        side === 'top'
          ? [pt(b.x0, b.y0, z1), pt(b.x1, b.y0, z1), pt(b.x1, b.y1, z1), pt(b.x0, b.y1, z1)]
          : side === 'side-y'
            ? [pt(b.x0, b.y1, z0), pt(b.x1, b.y1, z0), pt(b.x1, b.y1, z1), pt(b.x0, b.y1, z1)]
            : [pt(b.x1, b.y0, z0), pt(b.x1, b.y1, z0), pt(b.x1, b.y1, z1), pt(b.x1, b.y0, z1)];
      el.setAttribute('points', pts.join(' '));
      // As laterais só aparecem quando o desenho já tem altura
      if (side !== 'top') el.style.display = z1 - z0 < 0.5 ? 'none' : '';
    }

    // Arranques: 4 barras verticais e estribos quadrados, saindo do topo da viga
    const base = footH + beamH;
    const visible = barH > 1;
    this.cages.forEach((el, i) => {
      el.style.display = visible ? '' : 'none';
      if (!visible) return;
      const { x, y } = NODES[i];
      const corners: [number, number][] = [
        [x - CAGE, y - CAGE],
        [x + CAGE, y - CAGE],
        [x + CAGE, y + CAGE],
        [x - CAGE, y + CAGE],
      ];
      const bars = corners.map(([cx, cy]) => `M${pt(cx, cy, base)}L${pt(cx, cy, base + barH)}`);
      const rings = STIRRUPS.filter((h) => h <= barH).map(
        (h) => `M${corners.map(([cx, cy]) => pt(cx, cy, base + h)).join('L')}Z`,
      );
      el.setAttribute('d', [...bars, ...rings].join(''));
    });
  }
}
