import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SKILLS, TOOLS } from '../data/skills';
import { I18nService } from '../services/i18n.service';
import { LOGOS, LogoName } from './icon/logos.generated';

/*
 * "O que faço": à esquerda o título e a grade de ferramentas (ícones de app sobre um fundo pontilhado),
 * à direita as habilidades em post-its girando numa roda em volta do eixo vertical (para com o mouse
 * ou o foco sobre ela; parada se o sistema pede menos movimento).
 * Os ícones são os logos originais de cada ferramenta, sem efeito 3D.
 */
@Component({
  selector: 'app-what-i-do',
  standalone: true,
  template: `
    <section aria-labelledby="what-title">
      <h2 id="what-title" class="section-title">{{ i18n.t('mySkills') }}</h2>

      <div class="what">
        <ul class="tools" [attr.aria-label]="i18n.t('tools')">
          @for (tool of tools; track tool.logo) {
            <li class="tool" [title]="tool.name">
              <svg [attr.viewBox]="logos[tool.logo].viewBox" role="img" [attr.aria-label]="tool.name" [innerHTML]="logoHtml[tool.logo]"></svg>
            </li>
          }
        </ul>

        <div class="carousel" [style.--n]="ring.length">
          <ul class="ring" [attr.aria-label]="i18n.t('skillsList')">
            @for (skill of ring; track $index) {
              <li class="slot" [style.--i]="$index" [class.copy]="$index >= skills.length" [attr.aria-hidden]="$index >= skills.length || null">
                <article class="note" [style.--note]="skill.color" [style.--tilt.deg]="$index % 2 ? 2 : -2">
                  <h3 class="note-title">{{ skill.title[i18n.lang()] }}</h3>
                  <p class="note-text">{{ skill.text[i18n.lang()] }}</p>
                </article>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }

    /* Desktop: ferramentas encostadas à esquerda e a roda de post-its centralizada no espaço restante,
       as duas centralizadas verticalmente uma em relação à outra */
    .what {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: var(--space-6);
    }

    /* Grade de 3 colunas */
    .tools {
      display: grid;
      grid-template-columns: repeat(3, 56px);
      gap: var(--space-5);
      flex: none;
      margin: 0;
      /* Centraliza a grade (3 × 56px + 2 × 32px = 232px) sob o brasão, que fica numa coluna de 300px */
      padding: 0 0 0 34px;
      list-style: none;
    }

    .tool {
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      color: var(--text);
      transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    .tool:hover { transform: translateY(-4px) scale(1.08); }
    .tool svg { width: 44px; height: 44px; }

    /*
     * Roda de post-its: cada um é girado em volta do eixo vertical (--i × 360°/--n) e empurrado para fora
     * pelo raio --r, calculado para os cartões não se encostarem. A roda inteira gira, então os da frente
     * passam da esquerda para a direita. Os de trás ficam escondidos (backface-visibility).
     */
    .carousel {
      --w: 200px;
      --h: var(--w);
      --r: calc(var(--w) / 2 / tan(180deg / var(--n)) + 16px);
      display: grid;
      justify-items: center;
      padding-block: var(--space-5);
      perspective: 1600px;
      overflow: clip;
    }

    .ring {
      position: relative;
      width: var(--w);
      height: var(--h);
      margin: 0;
      padding: 0;
      list-style: none;
      transform-style: preserve-3d;
      animation: spin 60s linear infinite;
    }
    /* A roda só para enquanto o mouse (ou o foco do teclado) está sobre ela */
    .carousel:hover .ring,
    .carousel:focus-within .ring { animation-play-state: paused; }

    .slot {
      position: absolute;
      inset: 0;
      transform: rotateY(calc(var(--i) * 360deg / var(--n))) translateZ(var(--r));
      backface-visibility: hidden;
      transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    /* Post-it sob o mouse cresce 20% e avança um pouco para fora da roda, ficando por cima dos vizinhos */
    .slot:hover {
      transform: rotateY(calc(var(--i) * 360deg / var(--n))) translateZ(calc(var(--r) + 30px)) scale(1.2);
    }

    /* Post-it: cor própria, faixa adesiva levemente mais escura no topo e sombra de papel descolando */
    .note {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: var(--space-4);
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.07) 0, transparent 16%), var(--note);
      color: #2A2A2A;
      rotate: var(--tilt);
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 14px 22px -8px rgba(0, 0, 0, 0.35);
      clip-path: polygon(0 0, 100% 0, 100% 92%, 94% 100%, 0 100%);
    }

    .note-title {
      margin-bottom: var(--space-2);
      font-family: var(--font-sans);
      font-size: var(--text-lg);
      line-height: var(--leading-lg);
      font-weight: var(--font-weight-button);
    }

    .note-text {
      margin: 0;
      font-size: var(--text-xs);
      line-height: 1.5;
    }

    /* Começa meio passo girada (dois post-its simétricos de frente) e recuada pelo raio,
       para os da frente aparecerem no tamanho real em vez de ampliados pela perspectiva */
    @keyframes spin {
      from { transform: translateZ(calc(-1 * var(--r))) rotateY(calc(180deg / var(--n))); }
      to { transform: translateZ(calc(-1 * var(--r))) rotateY(calc(180deg / var(--n) + 360deg)); }
    }

    @media (max-width: 900px) {
      /* Tablet e celular: ferramentas e roda empilhadas, ambas centralizadas */
      .what { display: flex; flex-direction: column; align-items: center; gap: var(--space-5); }
      .carousel { width: 100%; }
      .tools { grid-template-columns: repeat(4, 56px); padding-left: 0; }
    }

    @media (max-width: 600px) {
      .tools { gap: var(--space-4); }
      .carousel { --w: 160px; --h: 236px; }
      .note { padding: var(--space-3); }
      .note-title { font-size: var(--text-base); line-height: var(--leading-base); }
    }

    /* Sem animação: os post-its viram uma grade parada */
    @media (prefers-reduced-motion: reduce) {
      .tool { transition: none; }
      .ring {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        gap: var(--space-4);
        width: 100%;
        height: auto;
        animation: none;
      }
      .slot, .slot:hover { position: static; transform: none; aspect-ratio: 1; transition: none; }
      .copy { display: none; }
    }
  `,
})
export class WhatIDoComponent {
  readonly i18n = inject(I18nService);
  readonly tools = TOOLS;
  /** A roda leva as habilidades duas vezes (12 post-its a 30°) para sempre haver dois de frente */
  readonly ring = [...SKILLS, ...SKILLS];
  readonly skills = SKILLS;
  readonly logos = LOGOS;

  private readonly sanitizer = inject(DomSanitizer);

  // Calculado uma vez: os SVGs vêm do arquivo gerado no build (conteúdo confiável), não de entrada do usuário.
  readonly logoHtml = Object.fromEntries(
    // O GitHub é preto (#161614): vira currentColor para aparecer também no tema escuro
    TOOLS.map((t) => [t.logo, this.sanitizer.bypassSecurityTrustHtml(LOGOS[t.logo].body.replaceAll('#161614', 'currentColor'))]),
  ) as Record<LogoName, SafeHtml>;
}
