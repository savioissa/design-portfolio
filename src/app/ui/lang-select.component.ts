import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { I18nService, Lang } from '../services/i18n.service';
import { FlagIconComponent } from './flag-icon.component';

@Component({
  selector: 'app-lang-select',
  standalone: true,
  imports: [FlagIconComponent],
  template: `
    <button
      type="button"
      class="select"
      aria-haspopup="listbox"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="i18n.t('langLabel')"
      (click)="open.set(!open())"
    >
      <app-flag-icon [lang]="i18n.lang()" [size]="32" />
      <span class="label">{{ i18n.lang() === 'pt' ? 'Pt' : 'En' }}</span>
    </button>
    @if (open()) {
      <ul class="list" role="listbox">
        @for (o of options; track o.value) {
          <li role="option" [attr.aria-selected]="i18n.lang() === o.value" tabindex="0"
              (click)="choose(o.value)" (keydown.enter)="choose(o.value)">
            <app-flag-icon [lang]="o.value" [size]="24" />
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
      padding: 0 var(--space-5) 0 3px;
      border-radius: var(--radius-full);
      border: 1px solid var(--btn-border);
      color: var(--text);
      font: inherit;
      font-size: var(--text-xs);
      font-weight: var(--font-weight-button);
      cursor: pointer;
      background:
        var(--select-chevron) no-repeat right var(--space-3) center / 20px 20px,
        var(--btn-bg);
      box-shadow: var(--btn-shadow);
      transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .select:hover {
      border-color: var(--btn-border-hover);
      background:
        var(--select-chevron) no-repeat right var(--space-3) center / 20px 20px,
        var(--btn-bg-hover);
      box-shadow: var(--btn-shadow-hover);
    }
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
    @media (prefers-reduced-motion: reduce) { .select { transition: none; } }
  `,
})
export class LangSelectComponent {
  readonly i18n = inject(I18nService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly open = signal(false);
  readonly options: { value: Lang; label: string }[] = [
    { value: 'pt', label: 'Pt' },
    { value: 'en', label: 'En' },
  ];

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
