import { Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { BookshelfComponent } from '../../ui/bookshelf.component';
import { GlassButtonComponent } from '../../ui/glass-button.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { PortraitsComponent } from '../../ui/portraits.component';
import { SoonDirective } from '../../ui/soon.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PortraitsComponent, BookshelfComponent, GlassButtonComponent, IconComponent, SoonDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly i18n = inject(I18nService);
}
