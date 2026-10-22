import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { I18nService } from '../services/i18n.service';
import { IconComponent } from './icon/icon.component';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      class="switch"
      role="switch"
      [attr.aria-checked]="theme.theme() === 'dark'"
      [attr.aria-label]="i18n.t('themeLabel')"
      (click)="theme.toggle()"
    >
      <app-icon class="icon sun" name="sun" />
      <app-icon class="icon moon" name="moon" />
    </button>
  `,
  styles: `
    .switch {
      position: relative;
      display: block;
      width: 78px;
      height: 40px;
      padding: 0;
      border-radius: var(--radius-full);
      border: 1px solid var(--btn-border);
      background: var(--btn-bg);
      box-shadow: var(--btn-shadow);
      color: var(--text-secondary);
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .switch:hover {
      border-color: var(--btn-border-hover);
      background: var(--btn-bg-hover);
      box-shadow: var(--btn-shadow-hover);
    }
    .switch:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .switch::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--switch-thumb-bg);
      box-shadow: var(--switch-thumb-shadow);
      transition: transform 0.2s ease;
    }
    .switch[aria-checked='true']::after { transform: translateX(38px); }
    .icon { position: absolute; top: 9px; z-index: 1; transition: color 0.2s ease; }
    .sun { left: 9px; }
    .moon { right: 9px; }
    .switch[aria-checked='false'] .sun { color: var(--accent); }
    .switch[aria-checked='true'] .moon { color: var(--on-accent); }
    /* Mobile: volta às medidas do design.md (62 x 32px) */
    @media (max-width: 600px) {
      .switch { width: 62px; height: 32px; }
      .switch::after { top: 2px; left: 2px; width: 26px; height: 26px; }
      .switch[aria-checked='true']::after { transform: translateX(30px); }
      .icon { --icon-size: 16px; top: 7px; }
      .sun { left: 7px; }
      .moon { right: 7px; }
    }
    @media (prefers-reduced-motion: reduce) { .switch, .switch::after, .icon { transition: none; } }
  `,
})
export class ThemeSwitchComponent {
  readonly theme = inject(ThemeService);
  readonly i18n = inject(I18nService);
}
