import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project, PROJECTS, PROJECT_SECTIONS, PROJECT_TAGS, ProjectSlug } from '../../data/projects';
import { I18nService } from '../../services/i18n.service';
import { IconComponent } from '../../ui/icon/icon.component';
import { SoonDirective } from '../../ui/soon.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, IconComponent, SoonDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  readonly i18n = inject(I18nService);
  readonly sections = PROJECT_SECTIONS;
  readonly projects: Record<ProjectSlug, Project> = PROJECTS;
  readonly tagNames = PROJECT_TAGS;
}
