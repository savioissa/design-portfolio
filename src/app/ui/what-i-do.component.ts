import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SKILLS, TOOLS } from '../data/skills';
import { I18nService } from '../services/i18n.service';
import { LOGOS, LogoName } from './icon/logos.generated';

/*
 * "Minhas habilidades", no estilo jornal da página: habilidades em verbetes numerados, em duas colunas com fio,
 * e as ferramentas na coluna lateral, cada uma com o logo original pequeno ao lado do nome.
 */
@Component({
  selector: 'app-what-i-do',
  standalone: true,
  template: `
    <section aria-labelledby="what-title">
      <h2 id="what-title" class="section-title">{{ i18n.t('mySkills') }}</h2>

      <div class="cols">
        <ol class="skills" [attr.aria-label]="i18n.t('skillsList')">
          @for (skill of skills; track $index) {
            <li class="skill">
              <h3 class="skill-title">{{ skill.title[i18n.lang()] }}</h3>
              <p class="skill-text">{{ skill.text[i18n.lang()] }}</p>
            </li>
          }
        </ol>

        <div class="aside">
          <h3 id="tools-title" class="sublabel">{{ i18n.t('tools') }}</h3>
          <ul class="tools" aria-labelledby="tools-title">
            @for (tool of tools; track tool.logo) {
              <li class="tool">
                <svg [attr.viewBox]="logos[tool.logo].viewBox" aria-hidden="true" [innerHTML]="logoHtml[tool.logo]"></svg>
                {{ tool.name }}
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }

    /* Verbetes numerados em duas colunas com fio, como os livros de "Sobre mim" */
    .skills {
      columns: 2;
      column-gap: var(--space-6);
      column-rule: 1px solid var(--border);
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: skill;
    }

    .skill {
      display: grid;
      grid-template-columns: 2rem minmax(0, 1fr);
      break-inside: avoid;
      padding-block: var(--space-3);
      border-top: 1px solid var(--border);
      counter-increment: skill;
    }

    .skill::before {
      content: counter(skill, decimal-leading-zero);
      grid-row: span 2;
      font-size: var(--text-xs);
      line-height: var(--leading-lg);
      letter-spacing: 0.08em;
      color: var(--placeholder);
    }

    .skill-title {
      font-family: var(--font-serif);
      font-weight: var(--font-weight-serif-regular);
      font-size: var(--text-lg);
      line-height: var(--leading-lg);
    }

    .skill-text {
      margin: var(--space-1) 0 0;
      font-family: var(--font-serif);
      color: var(--text-secondary);
    }

    .tools {
      display: grid;
      gap: var(--space-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .tool {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-xs);
      line-height: var(--leading-xs);
    }

    .tool svg { flex: none; width: 20px; height: 20px; }

    /* Em telas médias as ferramentas descem para baixo e se distribuem em colunas */
    @media (max-width: 900px) {
      .tools { grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); }
    }

    @media (max-width: 600px) {
      .skills { columns: 1; }

      .skill-title {
        font-size: var(--text-base);
        line-height: var(--leading-base);
      }
    }
  `,
})
export class WhatIDoComponent {
  readonly i18n = inject(I18nService);
  readonly tools = TOOLS;
  readonly skills = SKILLS;
  readonly logos = LOGOS;

  private readonly sanitizer = inject(DomSanitizer);

  // Calculado uma vez: os SVGs vêm do arquivo gerado no build (conteúdo confiável), não de entrada do usuário.
  readonly logoHtml = Object.fromEntries(
    // O GitHub é preto (#161614): vira currentColor para aparecer também no tema escuro
    TOOLS.map((t) => [t.logo, this.sanitizer.bypassSecurityTrustHtml(LOGOS[t.logo].body.replaceAll('#161614', 'currentColor'))]),
  ) as Record<LogoName, SafeHtml>;
}
