import { Component, inject } from '@angular/core';
import { TAGS } from '../data/skills';
import { I18nService } from '../services/i18n.service';

/** Cada linha começa a lista num ponto diferente, tem velocidade própria (segundos por volta) e sai de uma
    posição diferente (atraso negativo), para as tags não ficarem alinhadas em colunas.
    As durações acompanham o tamanho da faixa: mais tags ou tags maiores pedem voltas mais longas
    para a velocidade na tela continuar a mesma */
const ROWS = [
  { offset: 0, duration: 290, delay: 0 },
  { offset: 13, duration: 220, delay: -34 },
  { offset: 26, duration: 360, delay: -81 },
  { offset: 39, duration: 250, delay: -52 },
];

/*
 * "Áreas de interesse": faixa de tags rolando da direita para a esquerda, em linhas com velocidades diferentes,
 * de ponta a ponta da tela (anula a margem lateral da página, --page-gutter).
 * Cada linha repete a lista duas vezes e anda exatamente metade da largura, então o fim emenda no começo.
 * Para leitores de tela só a primeira cópia da primeira linha existe (já tem todas as tags); o resto é decorativo.
 */
@Component({
  selector: 'app-tag-marquee',
  standalone: true,
  template: `
    <section aria-labelledby="interests-title">
      <h2 id="interests-title" class="section-title">{{ i18n.t('interestsTitle') }}</h2>

      <div class="marquee">
        @for (row of rows; track $index; let r = $index) {
          <div class="row" [style.--duration.s]="row.duration" [style.--delay.s]="row.delay" [attr.aria-hidden]="r > 0 || null">
            <ul class="track">
              @for (tag of row.tags; track $index) {
                <li class="tag">{{ tag }}</li>
              }
              @for (tag of row.tags; track $index) {
                <li class="tag copy" aria-hidden="true">{{ tag }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }

    .marquee {
      display: grid;
      gap: var(--space-3);
      margin-inline: calc(-1 * var(--page-gutter, 0px));
      overflow: hidden;
    }

    .track {
      display: flex;
      width: max-content;
      margin: 0;
      padding: 0;
      list-style: none;
      animation: marquee var(--duration) var(--delay) linear infinite;
    }
    .row:hover .track { animation-play-state: paused; }

    /* Espaço como margem (e não gap) para as duas metades terem a mesma largura e a volta não dar salto */
    .tag {
      flex: none;
      margin-right: var(--space-3);
      padding: 0.35em 1em;
      border: 1px solid color-mix(in srgb, var(--text) 55%, transparent);
      border-radius: var(--radius-full);
      font-size: clamp(1.5rem, 2.7vw, 2.35rem);
      line-height: 1.25;
      white-space: nowrap;
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }
    .tag:hover {
      border-color: var(--accent);
      background: var(--accent-subtle);
      color: var(--accent);
    }

    @keyframes marquee {
      to { transform: translateX(-50%); }
    }

    @media (max-width: 600px) {
      .marquee { gap: var(--space-2); }
      .tag {
        margin-right: var(--space-2);
        font-size: calc(var(--text-xl) * 0.85);
      }
    }

    /* Sem animação: uma única lista que quebra em várias linhas, dentro da margem da página */
    @media (prefers-reduced-motion: reduce) {
      .marquee { margin-inline: 0; }
      .row + .row, .copy { display: none; }
      .track { flex-wrap: wrap; row-gap: var(--space-3); width: auto; animation: none; }
      .tag { font-size: var(--text-lg); transition: none; }
    }
  `,
})
export class TagMarqueeComponent {
  readonly i18n = inject(I18nService);

  readonly rows = ROWS.map(({ offset, duration, delay }) => ({
    duration,
    delay,
    tags: [...TAGS.slice(offset), ...TAGS.slice(0, offset)],
  }));
}
