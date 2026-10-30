import { Component, inject } from '@angular/core';
import { I18nService, Lang } from '../services/i18n.service';

/** Idiomas em texto (PT EN): o ativo em negrito, o outro em cinza. */
@Component({
  selector: 'app-lang-select',
  standalone: true,
  template: `
    <div class="group" role="group" [attr.aria-label]="i18n.t('langLabel')">
      @for (o of options; track o.value) {
        <button
          type="button"
          class="option"
          [attr.aria-pressed]="i18n.lang() === o.value"
          [title]="o.name"
          (click)="i18n.set(o.value)"
        >{{ o.label }}</button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    /* A margem negativa aumenta a área de toque sem tirar o texto do alinhamento com a página */
    .group { display: flex; margin: calc(-1 * var(--space-2)); }
    .option {
      padding: var(--space-2);
      border: 0;
      background: none;
      font-family: inherit;
      font-size: var(--text-xs);
      font-weight: var(--font-weight-sans);
      line-height: 1;
      letter-spacing: 0.08em;
      color: var(--placeholder);
      cursor: pointer;
      transition: color 0.2s ease;
    }
    .option:hover { color: var(--text); }
    .option[aria-pressed='true'] { color: var(--text); font-weight: var(--font-weight-button); cursor: default; }
    .option:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: var(--radius-sm); }
    @media (prefers-reduced-motion: reduce) { .option { transition: none; } }
  `,
})
export class LangSelectComponent {
  readonly i18n = inject(I18nService);
  readonly options: { value: Lang; label: string; name: string }[] = [
    { value: 'pt', label: 'PT', name: 'Português' },
    { value: 'en', label: 'EN', name: 'English' },
  ];
}
