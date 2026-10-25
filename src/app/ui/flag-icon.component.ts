import { Component, input } from '@angular/core';
import { Lang } from '../services/i18n.service';

let nextId = 0;

/** Bandeiras circulares em estilo flat, com anel de borda. Tamanho por --flag-size (padrão 32px). */
@Component({
  selector: 'app-flag-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <clipPath [attr.id]="clipId"><circle cx="16" cy="16" r="16" /></clipPath>
      </defs>

      @if (lang() === 'pt') {
        <g [attr.clip-path]="'url(#' + clipId + ')'">
          <rect width="32" height="32" fill="#5FA22E" />
          <path d="M3.2 16 16 8.6 28.8 16 16 23.4Z" fill="#FFD21F" />
          <circle cx="16" cy="16" r="5.6" fill="#1F1D7A" />
          <path d="M10.6 14.7Q16.2 12.4 21.5 16.6" fill="none" stroke="#FCFCFB" stroke-width="0.9" stroke-linecap="round" />
        </g>
        <circle cx="16" cy="16" r="15.5" fill="none" stroke="#4E8C24" stroke-width="1" />
      } @else if (lang() === 'es') {
        <!-- Espanha: faixas vermelho/amarelo/vermelho (1:2:1) e o brasão simplificado em escudo + coroa -->
        <g [attr.clip-path]="'url(#' + clipId + ')'">
          <rect width="32" height="32" fill="#E8283A" />
          <rect y="8" width="32" height="16" fill="#FFC81F" />
          <rect x="8.4" y="11.2" width="5" height="1.2" rx="0.6" fill="#B8101F" />
          <path d="M8.4 13.2h5v3.6a2.5 2.5 0 0 1-5 0Z" fill="#B8101F" />
          <rect x="9.9" y="14.3" width="2" height="2" rx="0.4" fill="#FFC81F" />
        </g>
        <circle cx="16" cy="16" r="15.5" fill="none" stroke="#C41E2F" stroke-width="1" />
      } @else {
        <g [attr.clip-path]="'url(#' + clipId + ')'">
          <rect width="32" height="32" fill="#FCFCFB" />
          @for (y of stripes; track y) {
            <rect x="0" [attr.y]="y" width="32" height="2.462" fill="#EF2B45" />
          }
          <rect width="16" height="17.23" fill="#1F1D7A" />
          @for (s of stars; track $index) {
            <path [attr.d]="'M' + s[0] + ' ' + (s[1] - 0.9) + 'l0.9 0.9-0.9 0.9-0.9-0.9Z'" fill="#FCFCFB" />
          }
        </g>
        <circle cx="16" cy="16" r="15.5" fill="none" stroke="#E2E2E2" stroke-width="1" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      width: var(--flag-size, 32px);
      height: var(--flag-size, 32px);
      border-radius: 9999px;
    }
    svg { display: block; width: 100%; height: 100%; }
  `,
})
export class FlagIconComponent {
  readonly lang = input.required<Lang>();

  readonly clipId = `flag-clip-${nextId++}`;

  /** 13 listras: as 7 vermelhas ficam nas posições pares. */
  readonly stripes = [0, 2, 4, 6, 8, 10, 12].map((i) => +(i * 2.4615).toFixed(3));

  /** Estrelas em losango no cantão, em fileiras alternadas. */
  readonly stars: [number, number][] = [2.4, 5.6, 8.8, 12, 15.2].flatMap((y, row) =>
    (row % 2 === 0 ? [2.6, 6.4, 10.2, 14] : [4.5, 8.3, 12.1]).map((x) => [x, y] as [number, number]),
  );
}
