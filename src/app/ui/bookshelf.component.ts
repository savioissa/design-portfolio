import { Component, inject, signal } from '@angular/core';
import { BOOKS } from '../data/books';
import { I18nService } from '../services/i18n.service';
import { BookDialogComponent } from './book-dialog.component';

/*
 * Estante de livros: cada livro é uma lombada colorida com a capa no topo e o título na vertical.
 * No hover a lombada cresce 15% a partir da base, por cima das vizinhas, sem mexer no layout.
 * Abaixo de 1439px os livros ficam deitados numa pilha, do maior (embaixo) para o menor (em cima).
 */
@Component({
  selector: 'app-bookshelf',
  standalone: true,
  imports: [BookDialogComponent],
  template: `
    <ul class="shelf">
      @for (book of books; track book.slug) {
        <li class="slot" [style.--rank]="pileRank.get(book.slug)">
          <button
            type="button"
            class="spine"
            aria-haspopup="dialog"
            [style.--spine]="book.color"
            [style.--ink]="book.ink"
            [style.--w.px]="book.width"
            [style.--h.px]="book.height"
            (click)="dialog.open(book, !missing().has(book.slug))"
          >
            @if (!missing().has(book.slug)) {
              <img class="cover" [src]="'books/' + book.slug + '.jpg'" alt="" loading="lazy" (error)="markMissing(book.slug)" />
            }
            <span class="title">{{ book.title[i18n.lang()] }}</span>
          </button>
        </li>
      }
    </ul>

    <app-book-dialog #dialog />
  `,
  styles: `
    :host { display: block; }

    /* O padding reserva espaço para a lombada crescer sem ser cortada pela rolagem;
       as margens negativas devolvem esse espaço ao layout */
    .shelf {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      margin: -72px calc(-1 * var(--space-3)) 0;
      padding: 72px var(--space-3) var(--space-2);
      list-style: none;
      overflow-x: auto;
    }

    /* Centraliza com margens automáticas (e não justify-content) para não cortar o início quando a estante rola */
    .slot { position: relative; flex: none; }
    .slot:first-child { margin-left: auto; }
    .slot:last-child { margin-right: auto; }
    .slot:has(.spine:hover), .slot:has(.spine:focus-visible) { z-index: 1; }

    .spine {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: var(--w);
      height: var(--h);
      gap: var(--space-4);
      padding: var(--space-4) 14px var(--space-4);
      border: 0;
      border-radius: 2px;
      background: var(--spine);
      color: var(--ink);
      cursor: pointer;
      transform-origin: 50% 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      /* Contorno sutil: lombadas brancas e pretas não somem no fundo claro/escuro */
      --edge: inset 0 0 0 1px color-mix(in srgb, var(--text) 14%, transparent);
      box-shadow: var(--edge);
    }
    .spine:hover, .spine:focus-visible {
      transform: scale(1.15);
      box-shadow: var(--edge), 0 12px 28px rgba(0, 0, 0, 0.22);
    }
    .spine:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

    .cover {
      flex: none;
      width: 100%;
      max-width: 84px;
      aspect-ratio: 2 / 3;
      border-radius: var(--radius-md);
      object-fit: cover;
    }

    /* Título lido de baixo para cima, como no lombo de um livro */
    .title {
      flex: 1;
      min-height: 0;
      writing-mode: vertical-rl;
      rotate: 180deg;
      text-align: start;
      font-family: var(--font-sans);
      font-size: 17px;
      line-height: 1.2;
      font-weight: var(--font-weight-menu);
    }

    /* Abaixo de 1439px: livros deitados e empilhados. A altura vira comprimento e a largura vira espessura,
       então cada livro mantém sua proporção relativa da estante; --rank põe os maiores embaixo */
    @media (max-width: 1438.98px) {
      .shelf {
        flex-direction: column;
        align-items: center;
        gap: 4px;
        margin: 0;
        padding: 0;
        overflow: visible;
      }
      .slot { max-width: 100%; order: var(--rank); }
      .slot:first-child, .slot:last-child { margin: 0; }

      .spine {
        flex-direction: row;
        gap: var(--space-3);
        width: calc(var(--h) * 0.72);
        max-width: 100%;
        height: calc(var(--w) * 0.55);
        padding: 6px var(--space-3) 6px 6px;
        transform-origin: 50% 50%;
      }

      .cover { width: auto; height: 100%; max-width: none; border-radius: var(--radius-sm); }

      .title {
        min-width: 0;
        writing-mode: horizontal-tb;
        rotate: none;
        font-size: var(--text-base);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    /* Toque deixa o :hover preso; 15% aqui empurraria o livro para fora da tela */
    @media (max-width: 600px) {
      .spine:hover, .spine:focus-visible { transform: scale(1.04); }
    }
    @media (prefers-reduced-motion: reduce) {
      .spine { transition: none; }
    }
  `,
})
export class BookshelfComponent {
  readonly i18n = inject(I18nService);
  readonly books = BOOKS;

  /** Posição na pilha (0 = topo): do menor para o maior, por comprimento e depois espessura */
  readonly pileRank = new Map(
    [...BOOKS]
      .sort((a, b) => a.height - b.height || a.width - b.width)
      .map((b, i) => [b.slug, i]),
  );

  /** Livros sem arquivo de capa em public/books/ */
  readonly missing = signal(new Set<string>());

  markMissing(slug: string): void {
    this.missing.update((s) => new Set(s).add(slug));
  }
}
