import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Com `route`, navega dentro do app (routerLink); senão, usa `href`. Com `disabled`, não navega (use junto com appSoon). */
@Component({
  selector: 'app-glass-button',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #content><ng-content /></ng-template>
    @if (disabled()) {
      <span class="btn" tabindex="0" role="link" aria-disabled="true"><ng-container [ngTemplateOutlet]="content" /></span>
    } @else if (route()) {
      <a class="btn" [routerLink]="route()"><ng-container [ngTemplateOutlet]="content" /></a>
    } @else {
      <a class="btn" [href]="href()" [attr.target]="external() ? '_blank' : null" [attr.rel]="external() ? 'noopener noreferrer' : null"><ng-container [ngTemplateOutlet]="content" /></a>
    }
  `,
  styles: `
    :host { display: inline-flex; }
    .btn {
      --icon-size: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
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
    span.btn { cursor: inherit; }
    @media (max-width: 600px) {
      .btn { min-width: 40px; height: 32px; padding: 0 var(--space-2); }
    }
    @media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
  `,
})
export class GlassButtonComponent {
  readonly href = input('#');
  readonly route = input<string | null>(null);
  readonly external = input(false);
  readonly disabled = input(false);
}
