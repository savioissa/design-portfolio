import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Certificate, COURSE_CERTIFICATES, TALK_CERTIFICATES } from '../data/certificates';
import { DictKey, I18nService } from '../services/i18n.service';
import { IconComponent } from './icon/icon.component';

/*
 * Modal "Certificados" de "Habilidades e formação": cursos e palestras em duas colunas com fio, só texto,
 * no estilo jornal da página. Usa <dialog> nativo: Esc fecha, o foco fica preso na janela
 * e o clique fora (no ::backdrop) também fecha.
 */
@Component({
  selector: 'app-certificates-dialog',
  standalone: true,
  imports: [IconComponent],
  template: `
    <dialog #dialog class="dialog" aria-labelledby="certificates-title" (click)="onClick($event)">
      <div class="panel">
        <header class="head">
          <h2 id="certificates-title" class="section-title">{{ i18n.t('certificates') }}</h2>
          <button type="button" class="close" [attr.aria-label]="i18n.t('close')" (click)="close()">
            <app-icon name="close-md" />
          </button>
        </header>

        <div class="groups">
          @for (group of groups; track group.label) {
            <section class="group" [attr.aria-labelledby]="'cert-' + group.label">
              <h3 [id]="'cert-' + group.label" class="sublabel">{{ i18n.t(group.label) }} ({{ group.items.length }})</h3>
              <ul class="list">
                @for (c of group.items; track c.title) {
                  <li class="item">
                    <p class="title">{{ c.title }}</p>
                    <p class="meta">{{ meta(c) }}</p>
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      </div>
    </dialog>
  `,
  styles: `
    .dialog {
      width: min(56rem, calc(100vw - 2 * var(--space-4)));
      max-height: min(44rem, calc(100dvh - 2 * var(--space-4)));
      padding: 0;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
    }
    .dialog::backdrop { background: rgba(11, 13, 18, 0.5); backdrop-filter: blur(2px); }
    .dialog[open] { animation: pop 0.25s cubic-bezier(0.2, 0.7, 0.2, 1); }

    .panel { padding: var(--space-5) var(--space-6) var(--space-6); }

    /* Rótulo com o fio forte embaixo, como a abertura das seções da página */
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-5);
      border-bottom: 1px solid var(--text);
    }
    .head .section-title { padding: 0; margin: 0; }

    /* Cursos e palestras lado a lado, com fio vertical entre os dois */
    .groups {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: var(--space-5);
    }
    .group + .group {
      padding-left: var(--space-5);
      border-left: 1px solid var(--border);
    }

    .list { margin: 0; padding: 0; list-style: none; }
    .item { padding-block: var(--space-3); }
    .item:first-child { padding-top: 0; }
    .item + .item { border-top: 1px solid var(--border); }

    .title {
      margin: 0;
      font-family: var(--font-serif);
      font-size: var(--text-base);
      line-height: var(--leading-base);
    }
    .meta {
      margin: var(--space-1) 0 0;
      font-size: var(--text-xs);
      line-height: var(--leading-xs);
      color: var(--text-secondary);
    }

    .close {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      margin-right: calc(-1 * var(--space-2));
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .close:hover { color: var(--text); }
    .close:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: var(--radius-sm); }

    @keyframes pop {
      from { opacity: 0; transform: translateY(8px); }
    }

    /* Mobile: palestras descem para baixo dos cursos, com fio horizontal */
    @media (max-width: 600px) {
      .panel { padding: var(--space-4) var(--space-4) var(--space-5); }
      .groups { grid-template-columns: minmax(0, 1fr); }
      .group + .group {
        margin-top: var(--space-5);
        padding: var(--space-5) 0 0;
        border-left: 0;
        border-top: 1px solid var(--border);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dialog[open] { animation: none; }
    }
  `,
})
export class CertificatesDialogComponent {
  readonly i18n = inject(I18nService);
  readonly groups: { label: DictKey; items: Certificate[] }[] = [
    { label: 'courses', items: COURSE_CERTIFICATES },
    { label: 'talks', items: TALK_CERTIFICATES },
  ];

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(): void {
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  // Sem padding no <dialog>, um clique cujo alvo é o próprio <dialog> só pode ter sido no backdrop
  onClick(e: MouseEvent): void {
    if (e.target === this.dialog().nativeElement) this.close();
  }

  /** Instituição, ano e horas, só os que existirem */
  meta(c: Certificate): string {
    return [c.issuer, c.year, c.hours].filter(Boolean).join(' · ');
  }
}
