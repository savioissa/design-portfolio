import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService, DictKey } from '../../services/i18n.service';
import { IntroService } from '../../services/intro.service';

interface MenuItem {
  key: DictKey;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly i18n = inject(I18nService);
  readonly intro = inject(IntroService);
  readonly menu: MenuItem[] = [
    { key: 'about', route: '/sobre-mim' },
    { key: 'skills', route: '/habilidades-e-formacao' },
    { key: 'solve', route: '/como-resolvo-problemas' },
    { key: 'projects', route: '/projetos' },
  ];
}
