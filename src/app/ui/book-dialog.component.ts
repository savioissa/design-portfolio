import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Book } from '../data/books';
import { I18nService } from '../services/i18n.service';
import { IconComponent } from './icon/icon.component';

/*
 * Card de um livro da estante. Usa <dialog> nativo: Esc fecha, o foco fica preso no card
 * e o clique fora (no ::backdrop) também fecha.
 */
@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [IconComponent],
  template: `
    <dialog #dialog class="dialog" aria-labelledby="book-title" (click)="onClick($event)" (close)="book.set(null)">
      @if (book(); as b) {
        <div class="card" [style.--spine]="b.color" [style.--ink]="b.ink">
          <button type="button" class="close" [attr.aria-label]="i18n.t('close')" (click)="close()">
            <app-icon name="close-md" />
          </button>

          @if (hasCover()) {
            <img class="cover" [src]="'books/' + b.slug + '.jpg'" alt="" />
          }

          <div class="info">
            <h3 id="book-title" class="title">{{ b.title[i18n.lang()] }}</h3>
            <p class="author">{{ b.author }}</p>
            @if (b.why[i18n.lang()]) {
              <p class="why">{{ b.why[i18n.lang()] }}</p>
            }
            @if (b.link) {
              <a class="buy" [href]="b.link" target="_blank" rel="noopener noreferrer">
                {{ i18n.t('buy') }} <app-icon name="external-link" />
              </a>
            }
          </div>
        </div>
      }
    </dialog>
  `,
  styles: `
    .dialog {
      width: min(30rem, calc(100vw - 2 * var(--space-4)));
      padding: 0;
      border: 1px solid var(--accent-border);
      border-radius: var(--radius-lg);
      background: var(--bg);
      color: var(--text);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
    }
    .dialog::backdrop { background: rgba(11, 13, 18, 0.5); backdrop-filter: blur(2px); }
    .dialog[open] { animation: pop 0.25s cubic-bezier(0.2, 0.7, 0.2, 1); }

    .card {
      position: relative;
      display: flex;
      gap: var(--space-4);
      padding: var(--space-5);
    }

    .cover {
      flex: none;
      width: 104px;
      aspect-ratio: 2 / 3;
      border-radius: var(--radius-md);
      object-fit: cover;
    }

    .info { min-width: 0; padding-right: var(--space-4); }
    .title { font-size: var(--text-xl); line-height: var(--leading-xl); }
    .author { margin: var(--space-1) 0 0; color: var(--text-secondary); }
    .why { margin: var(--space-3) 0 0; }

    .buy {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      margin-top: var(--space-3);
      color: var(--accent);
      font-weight: var(--font-weight-button);
      --icon-size: 18px;
    }

    .close {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .close:hover { background: var(--accent-subtle); color: var(--text); }
    .close:focus-visible, .buy:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    @keyframes pop {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
    }

    @media (max-width: 480px) {
      .card { flex-direction: column; }
      .cover { width: 88px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .dialog[open] { animation: none; }
    }
  `,
})
export class BookDialogComponent {
  readonly i18n = inject(I18nService);
  readonly book = signal<Book | null>(null);
  readonly hasCover = signal(true);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(book: Book, hasCover: boolean): void {
    this.book.set(book);
    this.hasCover.set(hasCover);
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  // Sem padding no <dialog>, um clique cujo alvo é o próprio <dialog> só pode ter sido no backdrop
  onClick(e: MouseEvent): void {
    if (e.target === this.dialog().nativeElement) this.close();
  }
}
