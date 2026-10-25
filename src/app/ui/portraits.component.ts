import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { I18nService } from '../services/i18n.service';

/** Distância (px) ao redor dos retratos em que o mouse vira o cursor "Visitante" */
const NEAR = 48;

/*
 * Três retratos em círculos com um cursor multiplayer (estilo Figma) que passeia entre eles.
 * O palco tem tamanho fixo e é redimensionado inteiro por --portraits-scale.
 * Cursor e destaque dos círculos usam o mesmo ciclo de 9s: cada círculo fica "ativo" por ~1/3 do tempo.
 * Com o mouse por perto, o cursor do sistema some e um cursor "Visitante" segue o ponteiro.
 */
@Component({
  selector: 'app-portraits',
  standalone: true,
  host: {
    '(document:pointermove)': 'onMove($event)',
    '(document:pointerleave)': 'hideVisitor()',
  },
  template: `
    <div #stage class="stage" role="img" [attr.aria-label]="i18n.t('portraitsLabel')">
      <span class="circle photo"><img src="avatars/photo.png" alt="" /></span>
      <span class="circle sketch"><img src="avatars/sketch.jpg" alt="" /></span>
      <span class="circle pixel"><img src="avatars/pixel.png" alt="" /></span>

      <!-- Grade de 14×8 "pixels"; as duas duplas de pernas alternam para simular o passo -->
      <svg class="mascot" viewBox="0 0 14 8" shape-rendering="crispEdges" aria-hidden="true">
        <rect class="body" x="2" y="0" width="10" height="6" />
        <rect class="body" x="0" y="2" width="2" height="2" />
        <rect class="body" x="12" y="2" width="2" height="2" />
        <rect class="eye" x="4" y="1" width="1" height="2" />
        <rect class="eye" x="9" y="1" width="1" height="2" />
        <g class="legs"><rect x="3" y="6" width="1" height="2" /><rect x="8" y="6" width="1" height="2" /></g>
        <g class="legs"><rect x="5" y="6" width="1" height="2" /><rect x="10" y="6" width="1" height="2" /></g>
      </svg>

      <span class="cursor owner" aria-hidden="true">
        <svg width="18" height="22" viewBox="0 0 18 22"><path d="M1.5 1.5v17.2l4.6-4.4 3 6.4 3-1.4-3-6.3h6.4z" /></svg>
        <span class="label">Sávio</span>
      </span>
    </div>

    <!-- Fora do .stage: o scale do palco viraria o bloco de referência do position: fixed -->
    @if (visitor(); as p) {
      <span class="cursor visitor" aria-hidden="true" [style.translate]="p.x + 'px ' + p.y + 'px'">
        <svg width="18" height="22" viewBox="0 0 18 22"><path d="M1.5 1.5v17.2l4.6-4.4 3 6.4 3-1.4-3-6.3h6.4z" /></svg>
        <span class="label">{{ i18n.t('visitor') }}</span>
      </span>
    }
  `,
  styles: `
    :host {
      --portraits-scale: 1;
      display: block;
      width: calc(370px * var(--portraits-scale));
      height: calc(380px * var(--portraits-scale));
    }

    .stage {
      position: relative;
      width: 370px;
      height: 380px;
      scale: var(--portraits-scale);
      transform-origin: top left;
    }

    .circle {
      position: absolute;
      overflow: hidden;
      border-radius: 50%;
      border: 3px solid var(--accent-border);
      background: #fff;
      animation: active 9s ease-in-out infinite both;
      transition: scale 0.25s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    .circle:hover { scale: 1.15; z-index: 1; }
    .circle img { display: block; width: 100%; height: 100%; object-fit: cover; }

    /* Foto à esquerda; desenho e pixel art empilhados à direita */
    .photo { left: 0; top: 75px; width: 190px; height: 190px; }
    .photo img { object-position: 50% 30%; }

    /* Atrasos negativos deslocam o ciclo para cada círculo acender quando o cursor chega */
    .sketch { left: 200px; top: 0; width: 165px; height: 165px; animation-delay: -6s; }
    .sketch img { scale: 1.35; transform-origin: 50% 44%; }

    /* Pixel art menor que o círculo; o fundo usa o creme da própria imagem para não aparecer emenda.
       O clip-path esconde a borda cinza de 1px que vem no arquivo */
    .pixel { left: 205px; top: 190px; width: 150px; height: 150px; animation-delay: -3s; background: #F0EEE2; }
    .pixel img {
      position: absolute;
      left: 9%;
      top: 6%;
      width: 82%;
      height: auto;
      clip-path: inset(0.5%);
    }

    /* Mascote do Claude em pixel art andando de um lado para o outro por baixo dos círculos */
    .mascot {
      position: absolute;
      left: 0;
      top: 352px;
      width: 42px;
      height: 24px;
      overflow: visible;
      animation: walk 14s ease-in-out infinite both;
    }
    .mascot .body { fill: #D97757; }
    .mascot .eye { fill: #1F1E1D; }
    .mascot .legs { fill: #D97757; animation: step 0.36s steps(1) infinite; }
    .mascot .legs + .legs { animation-delay: -0.18s; }

    @keyframes walk {
      0%, 4% { translate: 8px 0; }
      46%, 54% { translate: 320px 0; }
      96%, 100% { translate: 8px 0; }
    }

    @keyframes step {
      0% { translate: 0 0; }
      50% { translate: 0 -1px; }
    }

    @keyframes active {
      0%, 22%, 100% { border-color: var(--accent); box-shadow: 0 0 0 6px var(--accent-subtle); }
      28%, 94% { border-color: var(--accent-border); box-shadow: 0 0 0 0 transparent; }
    }

    /* Elemento sem tamanho: só a ponta da seta é posicionada */
    .cursor {
      position: absolute;
      left: 0;
      top: 0;
      pointer-events: none;
      --cursor-color: var(--accent);
      --cursor-text: var(--on-accent);
    }
    .cursor svg {
      display: block;
      fill: var(--cursor-color);
      stroke: #fff;
      stroke-width: 1.5;
      stroke-linejoin: round;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
    }

    .label {
      position: absolute;
      left: 14px;
      top: 18px;
      padding: 2px 8px;
      border-radius: 4px 10px 10px 10px;
      background: var(--cursor-color);
      color: var(--cursor-text);
      font-family: var(--font-sans);
      font-size: 12px;
      line-height: 18px;
      font-weight: var(--font-weight-button);
      white-space: nowrap;
    }

    .owner { z-index: 2; animation: travel 9s cubic-bezier(0.6, 0, 0.3, 1) infinite both; }

    @keyframes travel {
      0%, 22%, 100% { translate: 150px 222px; }
      33%, 55% { translate: 298px 124px; }
      66%, 88% { translate: 296px 296px; }
    }

    /* Outra cor, como um segundo participante no arquivo */
    .visitor {
      position: fixed;
      z-index: 10;
      --cursor-color: #D6336C;
      --cursor-text: #fff;
    }

    @media (prefers-reduced-motion: reduce) {
      .circle, .owner, .mascot, .mascot .legs { animation: none; }
      .circle { transition: none; }
      .owner { translate: 150px 222px; }
    }
  `,
})
export class PortraitsComponent {
  readonly i18n = inject(I18nService);
  readonly visitor = signal<{ x: number; y: number } | null>(null);

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hideVisitor());
  }

  onMove(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const r = this.stage().nativeElement.getBoundingClientRect();
    const near =
      e.clientX > r.left - NEAR && e.clientX < r.right + NEAR &&
      e.clientY > r.top - NEAR && e.clientY < r.bottom + NEAR;

    if (!near) return this.hideVisitor();
    this.visitor.set({ x: e.clientX, y: e.clientY });
    document.documentElement.style.cursor = 'none';
  }

  hideVisitor(): void {
    if (!this.visitor()) return;
    this.visitor.set(null);
    document.documentElement.style.cursor = '';
  }
}
