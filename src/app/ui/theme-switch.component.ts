import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  template: `
    <button
      type="button"
      class="switch"
      role="switch"
      [attr.aria-checked]="theme.theme() === 'dark'"
      [attr.aria-label]="i18n.t('themeLabel')"
      (click)="theme.toggle()"
    >
      <svg class="icon sun" viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">
        <circle cx="8" cy="8" r="2.6" />
        <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
      </svg>
      <svg class="icon moon" viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M13.5 9.6A5.5 5.5 0 0 1 6.4 2.5a5.5 5.5 0 1 0 7.1 7.1z" />
      </svg>
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
    @media (prefers-reduced-motion: reduce) { .switch, .switch::after, .icon { transition: none; } }
  `,
})
export class ThemeSwitchComponent {
  readonly theme = inject(ThemeService);
  readonly i18n = inject(I18nService);
}
