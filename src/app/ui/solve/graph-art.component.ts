import { Component, DestroyRef, ElementRef, NgZone, afterNextRender, inject, input, viewChild } from '@angular/core';

interface GraphNode {
  /** Posição de repouso */
  hx: number;
  hy: number;
}

/** Gerador pseudoaleatório com semente fixa: o desenho sai igual em toda visita */
function seeded(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const COUNT = 110;
const CENTER = 240;
const RADIUS = 215;

/*
 * Pontos espalhados num círculo em espiral de girassol (ângulo de ouro), que distribui por igual,
 * com um leve desvio aleatório para não parecer uma grade.
 */
const rand = seeded(7);
const NODES: GraphNode[] = Array.from({ length: COUNT }, (_, i) => {
  const r = RADIUS * Math.sqrt((i + 0.5) / COUNT);
  const a = i * 2.39996;
  const jitter = 9;
  return {
    hx: CENTER + r * Math.cos(a) + (rand() - 0.5) * jitter * 2,
    hy: CENTER + r * Math.sin(a) + (rand() - 0.5) * jitter * 2,
  };
});

/** Ritmo próprio de cada ponto na deriva: duas ondas por eixo, com frequências e fases diferentes */
const DRIFT = NODES.map(() => ({
  fx: 0.6 + rand() * 0.8,
  fy: 0.6 + rand() * 0.8,
  gx: 1.3 + rand() * 1,
  gy: 1.3 + rand() * 1,
  px: rand() * Math.PI * 2,
  py: rand() * Math.PI * 2,
}));

/** Deriva parada e agitada (com o ponteiro por perto): amplitude em unidades do desenho e velocidade */
const CALM = { amp: 5, speed: 0.55 };
const EXCITED = { amp: 13, speed: 1.6 };

/** Arestas entre vizinhos próximos */
const LINK = 58;
const EDGES: [number, number][] = [];
NODES.forEach((a, i) =>
  NODES.slice(i + 1).forEach((b, j) => {
    if (Math.hypot(a.hx - b.hx, a.hy - b.hy) < LINK) EDGES.push([i, i + 1 + j]);
  }),
);

/** Vizinhos de cada nó, para o disparo passar adiante */
const NEIGHBORS: number[][] = NODES.map(() => []);
EDGES.forEach(([a, b]) => {
  NEIGHBORS[a].push(b);
  NEIGHBORS[b].push(a);
});

/** Raio de alcance do ponteiro e quanto os nós se aproximam dele */
const REACH = 130;
const PULL = 0.18;
/** Margem em volta do desenho onde o ponteiro já tem efeito */
const MARGIN = 120;
/** Intervalo médio entre disparos espontâneos (ms) e atraso do sinal até os vizinhos */
const FIRE_EVERY = 520;
const FIRE_HOP = 140;

/**
 * Rede de pontos em forma de círculo, como neurônios: os pontos flutuam sozinhos, cada um no seu ritmo,
 * e de tempos em tempos um deles dispara (acende e apaga), passando o sinal mais fraco aos vizinhos.
 * Com o ponteiro por perto, a rede se agita (a deriva ganha amplitude e velocidade aos poucos), os nós
 * se aproximam dele e acendem na cor de destaque, e as conexões entre eles se fortalecem.
 *
 * A animação roda fora do Angular (requestAnimationFrame) e só enquanto o desenho está na tela.
 * Com menos movimento pedido pelo sistema, não há deriva, disparos nem deslocamento; os nós só acendem.
 */
@Component({
  selector: 'app-graph-art',
  standalone: true,
  template: `
    <svg #svg viewBox="0 0 480 480" role="img" [attr.aria-label]="label()">
      <g class="edges">
        @for (e of edges; track $index) {
          <line class="edge" [attr.x1]="nodes[e[0]].hx" [attr.y1]="nodes[e[0]].hy" [attr.x2]="nodes[e[1]].hx" [attr.y2]="nodes[e[1]].hy" />
        }
      </g>
      <g class="rays">
        @for (n of nodes; track $index) {
          <line class="ray" [attr.x1]="n.hx" [attr.y1]="n.hy" [attr.x2]="n.hx" [attr.y2]="n.hy" />
        }
      </g>
      <g class="halos">
        @for (n of nodes; track $index) {
          <circle class="halo" [attr.cx]="n.hx" [attr.cy]="n.hy" r="9" />
        }
      </g>
      <g class="nodes">
        @for (n of nodes; track $index) {
          <circle class="node" [attr.cx]="n.hx" [attr.cy]="n.hy" r="3.2" />
        }
      </g>
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      /* No toque, arrastar na horizontal interage; na vertical, rola a página */
      touch-action: pan-y;
    }

    .edge {
      --e: 0;
      stroke: color-mix(in srgb, var(--accent) calc(var(--e) * 100%), var(--border));
      stroke-width: calc(1px + var(--e) * 1.5px);
      stroke-linecap: round;
    }

    .ray {
      stroke: var(--accent);
      stroke-width: 1;
      stroke-dasharray: 2 5;
      stroke-linecap: round;
      opacity: 0;
    }

    /* Brilho em volta do ponto quando ele dispara */
    .halo {
      fill: var(--accent);
      opacity: 0;
    }

    .node {
      --n: 0;
      fill: color-mix(in srgb, var(--accent) calc(var(--n) * 100%), var(--text-secondary));
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(calc(1 + var(--n) * 0.7));
    }
  `,
})
export class GraphArtComponent {
  readonly label = input.required<string>();

  readonly nodes = NODES;
  readonly edges = EDGES;

  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
  }

  private start(): void {
    const svg = this.svg().nativeElement;
    const nodeEls = Array.from(svg.querySelectorAll<SVGCircleElement>('.node'));
    const haloEls = Array.from(svg.querySelectorAll<SVGCircleElement>('.halo'));
    const rayEls = Array.from(svg.querySelectorAll<SVGLineElement>('.ray'));
    const edgeEls = Array.from(svg.querySelectorAll<SVGLineElement>('.edge'));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');

    // Estado de cada nó: posição atual, brilho pelo ponteiro e intensidade do disparo (0 a 1)
    const state = NODES.map((n) => ({ x: n.hx, y: n.hy, lit: 0, fire: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let release = 0;
    let visible = false;
    let nextFire = 0;
    // Relógio da deriva (avança mais rápido quando agitada), agitação de 0 a 1 e instante do quadro anterior
    let clock = 0;
    let energy = 0;
    let last = 0;
    const timers = new Set<number>();

    /** Dispara um nó e, com atraso, passa o sinal mais fraco a alguns vizinhos */
    const fire = (i: number, strength: number) => {
      state[i].fire = Math.max(state[i].fire, strength);
      if (strength < 0.35) return;
      for (const n of NEIGHBORS[i]) {
        if (Math.random() > 0.55) continue;
        const t = window.setTimeout(() => {
          timers.delete(t);
          fire(n, strength * 0.6);
          schedule();
        }, FIRE_HOP + Math.random() * 80);
        timers.add(t);
      }
    };

    const tick = (now: number) => {
      frame = 0;
      const calm = reduce.matches;
      const ease = calm ? 1 : 0.14;
      let moving = false;

      // Agitação vai e volta aos poucos; o relógio só anda com o desenho na tela
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      energy += ((pointer ? 1 : 0) - energy) * 0.04;
      const amp = calm ? 0 : CALM.amp + (EXCITED.amp - CALM.amp) * energy;
      if (visible && !calm) clock += dt * (CALM.speed + (EXCITED.speed - CALM.speed) * energy);

      // Disparo espontâneo de um ponto ao acaso
      if (!calm && visible && now >= nextFire) {
        fire(Math.floor(Math.random() * NODES.length), 1);
        nextFire = now + FIRE_EVERY * (0.4 + Math.random() * 1.2);
      }

      state.forEach((s, i) => {
        const n = NODES[i];
        const w = DRIFT[i];
        let tx = n.hx + amp * (Math.sin(clock * w.fx + w.px) + 0.4 * Math.sin(clock * w.gx + w.py));
        let ty = n.hy + amp * (Math.sin(clock * w.fy + w.py) + 0.4 * Math.sin(clock * w.gy + w.px));
        let lit = 0;
        if (pointer) {
          const d = Math.hypot(pointer.x - n.hx, pointer.y - n.hy);
          lit = Math.max(0, 1 - d / REACH);
          if (!calm) {
            tx += (pointer.x - tx) * PULL * lit;
            ty += (pointer.y - ty) * PULL * lit;
          }
        }
        s.x += (tx - s.x) * ease;
        s.y += (ty - s.y) * ease;
        s.lit += (lit - s.lit) * (calm ? 1 : 0.2);
        s.fire = s.fire > 0.01 ? s.fire * 0.93 : 0;
        if (Math.abs(tx - s.x) > 0.1 || Math.abs(ty - s.y) > 0.1 || Math.abs(lit - s.lit) > 0.005 || s.fire > 0) moving = true;

        const glow = Math.max(s.lit, s.fire);
        const el = nodeEls[i];
        el.setAttribute('cx', s.x.toFixed(1));
        el.setAttribute('cy', s.y.toFixed(1));
        el.style.setProperty('--n', glow.toFixed(3));

        const halo = haloEls[i];
        halo.setAttribute('cx', s.x.toFixed(1));
        halo.setAttribute('cy', s.y.toFixed(1));
        halo.style.opacity = (s.fire * 0.3).toFixed(3);

        const ray = rayEls[i];
        ray.setAttribute('x1', s.x.toFixed(1));
        ray.setAttribute('y1', s.y.toFixed(1));
        if (pointer) {
          ray.setAttribute('x2', pointer.x.toFixed(1));
          ray.setAttribute('y2', pointer.y.toFixed(1));
        }
        ray.style.opacity = (s.lit * 0.6).toFixed(3);
      });

      EDGES.forEach(([a, b], i) => {
        const el = edgeEls[i];
        const sa = state[a];
        const sb = state[b];
        el.setAttribute('x1', sa.x.toFixed(1));
        el.setAttribute('y1', sa.y.toFixed(1));
        el.setAttribute('x2', sb.x.toFixed(1));
        el.setAttribute('y2', sb.y.toFixed(1));
        el.style.setProperty('--e', Math.min(Math.max(sa.lit, sa.fire), Math.max(sb.lit, sb.fire)).toFixed(3));
      });

      // Enquanto está na tela, segue rodando (deriva e disparos); fora dela, só termina o que está em movimento
      if (moving || (visible && !calm)) schedule();
      else last = 0;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Converte a posição do ponteiro para as coordenadas do desenho; fora da margem, não há efeito
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const inside =
        e.clientX > r.left - MARGIN && e.clientX < r.right + MARGIN && e.clientY > r.top - MARGIN && e.clientY < r.bottom + MARGIN;
      pointer = inside ? { x: ((e.clientX - r.left) / r.width) * 480, y: ((e.clientY - r.top) / r.height) * 480 } : null;
      clearTimeout(release);
      schedule();
    };

    const onLeave = () => {
      pointer = null;
      schedule();
    };

    // No toque, a rede fica acesa um instante depois que o dedo sai
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      clearTimeout(release);
      release = window.setTimeout(onLeave, 700);
    };

    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) onLeave();
    };

    // Só anima os disparos enquanto o desenho aparece na tela
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(svg);

    reduce.addEventListener('change', schedule);
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointercancel', onLeave, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      clearTimeout(release);
      timers.forEach((t) => clearTimeout(t));
      observer.disconnect();
      reduce.removeEventListener('change', schedule);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onLeave);
      document.removeEventListener('pointerout', onOut);
    });
  }
}
