import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { WhatIDoComponent } from '../../ui/what-i-do.component';
import { TagMarqueeComponent } from '../../ui/tag-marquee.component';
import { GlassButtonComponent } from '../../ui/glass-button.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { SoonDirective } from '../../ui/soon.directive';
import { COURSES } from '../../data/courses';

/** Inclinação máxima (graus) do brasão ao seguir o mouse */
const TILT = 14;

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [WhatIDoComponent, TagMarqueeComponent, GlassButtonComponent, IconComponent, SoonDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  readonly i18n = inject(I18nService);
  readonly courses = COURSES;

  /** Rotação do brasão: o mouse sobre o cartão inclina o objeto em 3D, como os ícones do Airbnb */
  readonly tilt = signal({ x: 0, y: 0 });

  onMove(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    this.tilt.set({ x: -py * TILT * 2, y: px * TILT * 2 });
  }

  resetTilt(): void {
    this.tilt.set({ x: 0, y: 0 });
  }
}
