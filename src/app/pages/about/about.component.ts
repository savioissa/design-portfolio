import { ChangeDetectorRef, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { BOOKS } from '../../data/books';
import { IconComponent } from '../../ui/icon/icon.component';

const PORTRAITS = [
  { key: 'photo', src: 'avatars/photo.png', width: 313, height: 331 },
  { key: 'sketch', src: 'avatars/sketch.jpg', width: 1440, height: 1440 },
  { key: 'pixel', src: 'avatars/pixel.png', width: 507, height: 735 },
];
/** Tempo de cada retrato em destaque. */
const PORTRAIT_INTERVAL = 4000;
/** Duração da troca de lugar entre os retratos. */
const PORTRAIT_MOVE = 700;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly i18n = inject(I18nService);
  readonly books = BOOKS;

  private readonly featured = signal(0);
  /** O retrato em destaque vem primeiro (ocupa a linha de cima); os outros seguem na ordem. */
  readonly portraits = computed(() => {
    const i = this.featured();
    return [...PORTRAITS.slice(i), ...PORTRAITS.slice(0, i)];
  });
  /** Com o cursor sobre os retratos, o destaque para de trocar. */
  paused = false;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const timer = setInterval(() => {
        if (!this.paused && !document.hidden) this.rotate();
      }, PORTRAIT_INTERVAL);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  /** FLIP: troca o destaque e anima cada retrato da posição e do tamanho antigos até os novos. */
  private rotate(): void {
    const images = () => Array.from(this.host.nativeElement.querySelectorAll<HTMLImageElement>('.portraits img'));
    const before = new Map(images().map((img) => [img.dataset['key'], img.getBoundingClientRect()]));

    this.featured.update((i) => (i + 1) % PORTRAITS.length);
    this.cdr.detectChanges();

    for (const img of images()) {
      const from = before.get(img.dataset['key']);
      if (!from) continue;
      const to = img.getBoundingClientRect();
      img.animate(
        [
          { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})` },
          { transform: 'none' },
        ],
        { duration: PORTRAIT_MOVE, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
      );
    }
  }
}
