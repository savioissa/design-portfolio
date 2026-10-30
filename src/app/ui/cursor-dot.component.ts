import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/** Elementos clicáveis: sobre eles a bolinha cresce */
const INTERACTIVE = 'a, button, [role="button"], [role="option"], label, select, summary';
/** Itens "Em breve" (appSoon): o chip já faz o papel de cursor, então a bolinha some */
const SOON = '[aria-describedby="soon-chip"]';

/*
 * Cursor da página: uma bolinha que segue o mouse no lugar do cursor do sistema.
 * Ela é branca com mix-blend-mode: difference, então inverte o que está embaixo: fica escura no tema claro,
 * clara no escuro e sempre visível sobre fotos. Só entra com mouse/trackpad (hover + pointer fine);
 * em telas de toque nada muda. Estilos e a troca do cursor do sistema ficam em styles.scss (.cursor-dot).
 */
@Component({
  selector: 'app-cursor-dot',
  standalone: true,
  template: '',
  host: { class: 'cursor-dot', 'aria-hidden': 'true' },
})
export class CursorDotComponent {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const root = document.documentElement;
      root.classList.add('has-cursor-dot');

      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        el.style.translate = `${e.clientX}px ${e.clientY}px`;
        const target = e.target as Element | null;
        el.classList.add('visible');
        el.classList.toggle('hover', !!target?.closest(INTERACTIVE));
        el.classList.toggle('hidden', !!target?.closest(SOON));
      };
      const down = () => el.classList.add('pressed');
      const up = () => el.classList.remove('pressed');
      const leave = () => el.classList.remove('visible');

      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerdown', down);
      document.addEventListener('pointerup', up);
      document.documentElement.addEventListener('mouseleave', leave);

      destroyRef.onDestroy(() => {
        root.classList.remove('has-cursor-dot');
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerdown', down);
        document.removeEventListener('pointerup', up);
        document.documentElement.removeEventListener('mouseleave', leave);
      });
    });
  }
}
