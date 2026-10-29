import { Component, ElementRef, HostListener, afterNextRender, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ThemeSwitchComponent } from './ui/theme-switch.component';
import { LangSelectComponent } from './ui/lang-select.component';
import { IntroService } from './services/intro.service';
import { SITE_LINKS } from './config/site.config';

/** Tempo com só o nome no centro da tela. */
const INTRO_HOLD = 3000;
/** Duração da ida do nome do centro até o canto. */
const INTRO_MOVE = 900;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ThemeSwitchComponent, LangSelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly intro = inject(IntroService);
  readonly links = SITE_LINKS;

  private readonly router = inject(Router);

  /** Rotas com `data: { footer: false }` escondem o rodapé (tema e contatos). */
  readonly showFooter = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        return route.data['footer'] !== false;
      }),
    ),
    { initialValue: true },
  );

  private readonly name = viewChild.required<ElementRef<HTMLElement>>('name');
  private readonly splash = viewChild<ElementRef<HTMLElement>>('splash');
  private holdTimer?: ReturnType<typeof setTimeout>;
  private leaving = false;

  constructor() {
    if (this.intro.playing()) {
      afterNextRender(() => {
        this.holdTimer = setTimeout(() => this.leaveIntro(), INTRO_HOLD);
      });
    }
  }

  @HostListener('document:keydown')
  skipIntro(): void {
    if (!this.intro.playing()) return;
    clearTimeout(this.holdTimer);
    this.leaveIntro();
  }

  /**
   * FLIP: o nome grande sai do centro e encolhe até a posição e o tamanho do nome no canto.
   * Quando chega, a intro termina e o nome do canto (idêntico nesse ponto) toma o lugar dele.
   */
  private leaveIntro(): void {
    const splash = this.splash()?.nativeElement;
    if (this.leaving || !splash) return;
    this.leaving = true;

    const from = splash.getBoundingClientRect();
    const to = this.name().nativeElement.getBoundingClientRect();
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    splash
      .animate(
        [
          { transform: 'none' },
          { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})` },
        ],
        { duration: reduceMotion ? 0 : INTRO_MOVE, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
      )
      .finished.then(() => this.intro.finish());
  }
}
