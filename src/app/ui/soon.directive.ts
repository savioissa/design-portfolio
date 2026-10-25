import { DestroyRef, Directive, effect, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';

/** Chip único na página, compartilhado por todos os elementos com appSoon (estilos em styles.scss) */
let chip: HTMLElement | null = null;

function getChip(): HTMLElement {
  if (!chip) {
    chip = document.createElement('span');
    chip.id = 'soon-chip';
    chip.className = 'soon-chip';
    chip.setAttribute('role', 'tooltip');
    document.body.append(chip);
  }
  return chip;
}

/**
 * Marca um item cuja página ainda não existe: o chip "Em breve" substitui o cursor e segue o mouse
 * enquanto ele estiver sobre o item. No foco por teclado, o chip fica ancorado acima do item.
 */
@Directive({
  selector: '[appSoon]',
  standalone: true,
  host: {
    'aria-disabled': 'true',
    'aria-describedby': 'soon-chip',
    '[style.cursor]': "'none'",
    '(mouseenter)': 'show($event.clientX, $event.clientY)',
    '(mousemove)': 'move($event.clientX, $event.clientY)',
    '(mouseleave)': 'hide()',
    '(focusin)': 'onFocus($event)',
    '(focusout)': 'hide()',
  },
})
export class SoonDirective {
  private readonly i18n = inject(I18nService);

  constructor() {
    const el = getChip();
    effect(() => (el.textContent = this.i18n.t('soon')));
    inject(DestroyRef).onDestroy(() => this.hide());
  }

  move(x: number, y: number): void {
    getChip().style.translate = `${x}px ${y}px`;
  }

  show(x: number, y: number): void {
    this.move(x, y);
    getChip().classList.add('visible');
  }

  hide(): void {
    getChip().classList.remove('visible');
  }

  onFocus(e: FocusEvent): void {
    const el = e.target as HTMLElement;
    if (!el.matches(':focus-visible')) return;
    const r = el.getBoundingClientRect();
    this.show(r.right - 40, r.top - 16);
  }
}
