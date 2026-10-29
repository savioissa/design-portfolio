import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { IconComponent } from '../../ui/icon/icon.component';
import { SoonDirective } from '../../ui/soon.directive';

/**
 * Um ideograma por etapa, na ordem de solveSteps (o significado traduzido fica no i18n, em `meaning`):
 * 基 fundação (de 基础), 参 referência (de 参考), 建 construção, 迭 iteração (de 迭代).
 */
const GLYPHS = ['基', '参', '建', '迭'];

@Component({
  selector: 'app-solve',
  standalone: true,
  imports: [RouterLink, IconComponent, SoonDirective],
  templateUrl: './solve.component.html',
  styleUrl: './solve.component.scss',
})
export class SolveComponent {
  readonly i18n = inject(I18nService);
  readonly glyphs = GLYPHS;
}
