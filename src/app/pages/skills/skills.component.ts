import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { WhatIDoComponent } from '../../ui/what-i-do.component';
import { TagMarqueeComponent } from '../../ui/tag-marquee.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { CertificatesDialogComponent } from '../../ui/certificates-dialog.component';
import { COURSES } from '../../data/courses';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RouterLink, WhatIDoComponent, TagMarqueeComponent, IconComponent, CertificatesDialogComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  readonly i18n = inject(I18nService);
  readonly courses = COURSES;
  /** Notícia da UFF sobre a nota máxima do curso na avaliação do MEC */
  readonly mecSource =
    'https://engenharia.uff.br/curso-de-desenho-industrial-da-uff-conquista-novamente-nota-maxima-em-avaliacao-do-mec/';
}
