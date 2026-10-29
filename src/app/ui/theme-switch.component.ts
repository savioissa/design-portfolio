import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../services/theme.service';
import { DictKey, I18nService } from '../services/i18n.service';
import { IconComponent } from './icon/icon.component';
import { IconName } from './icon/icons.generated';

/** Sol e lua, no mesmo estilo do seletor de idioma: o tema ativo em destaque, o outro em cinza. */
@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="group" role="group" [attr.aria-label]="i18n.t('themeLabel')">
      @for (o of options; track o.value) {
        <button
          type="button"
          class="option"
          [attr.aria-pressed]="theme.theme() === o.value"
          [attr.aria-label]="i18n.t(o.label)"
          (click)="theme.set(o.value)"
        >
          <app-icon [name]="o.icon" />
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    /* A margem negativa aumenta a área de toque sem tirar o ícone do alinhamento com a página */
    .group { display: flex; margin: calc(-1 * var(--space-2)); }
    .option {
      --icon-size: 18px;
      display: flex;
      padding: var(--space-2);
      border: 0;
      background: none;
      color: var(--placeholder);
      cursor: pointer;
      transition: color 0.2s ease;
    }
    .option:hover { color: var(--text); }
    .option[aria-pressed='true'] { color: var(--text); cursor: default; }
    .option:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: var(--radius-sm); }
    @media (prefers-reduced-motion: reduce) { .option { transition: none; } }
  `,
})
export class ThemeSwitchComponent {
  readonly theme = inject(ThemeService);
  readonly i18n = inject(I18nService);
  readonly options: { value: Theme; icon: IconName; label: DictKey }[] = [
    { value: 'light', icon: 'sun', label: 'lightMode' },
    { value: 'dark', icon: 'moon', label: 'darkMode' },
  ];
}
