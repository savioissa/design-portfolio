import { Component, input } from '@angular/core';

@Component({
  selector: 'app-glass-button',
  standalone: true,
  template: `<a class="btn" [href]="href()" [attr.target]="external() ? '_blank' : null" [attr.rel]="external() ? 'noopener noreferrer' : null"><ng-content /></a>`,
  styles: `
    :host { display: inline-flex; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 52px;
      height: 40px;
      padding: 0 var(--space-3);
      border-radius: var(--radius-full);
      border: 1px solid var(--btn-border);
      background: var(--btn-bg);
      box-shadow: var(--btn-shadow);
      color: var(--text);
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      font-weight: var(--font-weight-button);
      line-height: var(--leading-xs);
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }
    .btn:hover {
      border-color: var(--btn-border-hover);
      background: var(--btn-bg-hover);
      box-shadow: var(--btn-shadow-hover);
      transform: translateY(-1px);
    }
    .btn:active { transform: translateY(0); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    @media (max-width: 600px) {
      .btn { min-width: 40px; height: 32px; padding: 0 var(--space-2); }
    }
    @media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
  `,
})
export class GlassButtonComponent {
  readonly href = input('#');
  readonly external = input(false);
}
