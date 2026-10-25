import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { GlassButtonComponent } from './ui/glass-button.component';
import { ThemeSwitchComponent } from './ui/theme-switch.component';
import { LangSelectComponent } from './ui/lang-select.component';
import { IconComponent } from './ui/icon/icon.component';
import { I18nService } from './services/i18n.service';
import { SITE_LINKS } from './config/site.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlassButtonComponent, ThemeSwitchComponent, LangSelectComponent, IconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly i18n = inject(I18nService);
  readonly links = SITE_LINKS;

  private readonly router = inject(Router);

  /** Na home o header mostra os contatos; nas outras páginas, o botão "Voltar". */
  readonly isHome = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects === '/'),
    ),
    { initialValue: true },
  );
}
