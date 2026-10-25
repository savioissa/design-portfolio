import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { I18nService, Lang } from '../services/i18n.service';
import { FlagIconComponent } from './flag-icon.component';
import { IconComponent } from './icon/icon.component';

@Component({
  selector: 'app-lang-select',
  standalone: true,
  imports: [FlagIconComponent, IconComponent],
  template: `
    <button
      type="button"
      class="select"
      aria-haspopup="listbox"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="i18n.t('langLabel')"
      (click)="open.set(!open())"
    >
      <app-flag-icon [lang]="i18n.lang()" />
      <span class="label">{{ labelOf(i18n.lang()) }}</span>
      <app-icon class="chevron" name="chevron-down" />
    </button>
    @if (open()) {
      <ul class="list" role="listbox">
        @for (o of options; track o.value) {
          <li role="option" [attr.aria-selected]="i18n.lang() === o.value" tabindex="0"
              (click)="choose(o.value)" (keydown.enter)="choose(o.value)">
            <app-flag-icon [lang]="o.value" />
            {{ o.label }}
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host { position: relative; display: inline-block; }
    .select {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      min-width: 104px;
      height: 40px;
      padding: 0 var(--space-3) 0 3px;
      border-radius: var(--radius-full);
      border: 1px solid var(--btn-border);
      color: var(--text);
      font: inherit;
      font-size: var(--text-xs);
      font-weight: var(--font-weight-button);
      cursor: pointer;
      background: var(--btn-bg);
      box-shadow: var(--btn-shadow);
      transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .select:hover {
      border-color: var(--btn-border-hover);
      background: var(--btn-bg-hover);
      box-shadow: var(--btn-shadow-hover);
    }
    .chevron {
      margin-left: auto;
      color: var(--text-secondary);
      transition: transform 0.2s ease;
    }
    .select[aria-expanded='true'] .chevron { transform: rotate(180deg); }
    .list { --flag-size: 24px; }
    .select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .list {
      position: absolute;
      top: calc(100% + var(--space-1));
      left: 0;
      right: 0;
      z-index: 10;
      margin: 0;
      padding: var(--space-1);
      list-style: none;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--accent-border);
      border-radius: var(--radius-lg);
      font-size: var(--text-xs);
    }
    li {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1);
      border-radius: var(--radius-full);
      cursor: pointer;
    }
    li:hover, li:focus-visible, li[aria-selected='true'] { background: var(--accent-subtle); outline: none; }
    /* Mobile: botão compacto; a bandeira já indica o idioma (o nome segue no aria-label) */
    @media (max-width: 600px) {
      .select {
        --flag-size: 24px;
        min-width: 0;
        height: 32px;
        gap: var(--space-1);
        padding: 0 var(--space-2) 0 3px;
      }
      .label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      .chevron { --icon-size: 16px; }
      .list { right: auto; min-width: 88px; }
    }
    @media (prefers-reduced-motion: reduce) { .select, .chevron { transition: none; } }
  `,
})
export class LangSelectComponent {
  readonly i18n = inject(I18nService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly open = signal(false);
  readonly options: { value: Lang; label: string }[] = [
    { value: 'pt', label: 'Pt' },
    { value: 'en', label: 'En' },
    { value: 'es', label: 'Es' },
  ];

  labelOf(lang: Lang): string {
    return this.options.find((o) => o.value === lang)?.label ?? '';
  }

  choose(lang: Lang): void {
    this.i18n.set(lang);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    if (!this.host.nativeElement.contains(e.target)) this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.open.set(false);
  }
}
