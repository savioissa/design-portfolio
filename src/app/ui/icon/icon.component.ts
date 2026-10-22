import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS, IconName } from './icons.generated';

/**
 * Ícone do coolicons. Herda a cor do texto (currentColor).
 * Tamanho pela variável CSS --icon-size (padrão 20px), definida no componente pai.
 * Para usar um ícone novo, adicione o nome em scripts/icons.config.json e rode `npm run icons`.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      [innerHTML]="body()"
    ></svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      width: var(--icon-size, 20px);
      height: var(--icon-size, 20px);
      line-height: 0;
    }
    svg { display: block; width: 100%; height: 100%; }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();

  private readonly sanitizer = inject(DomSanitizer);

  // O SVG vem do arquivo gerado no build (conteúdo confiável), não de entrada do usuário.
  readonly body = computed(() => this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()]));
}
