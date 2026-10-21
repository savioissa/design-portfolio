import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GlassButtonComponent } from './ui/glass-button.component';
import { ThemeSwitchComponent } from './ui/theme-switch.component';
import { LangSelectComponent } from './ui/lang-select.component';
import { I18nService, DictKey } from './services/i18n.service';
import { SITE_LINKS } from './config/site.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GlassButtonComponent, ThemeSwitchComponent, LangSelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly i18n = inject(I18nService);
  readonly links = SITE_LINKS;
  readonly menu: DictKey[] = ['about', 'skills', 'solve', 'projects'];

  readonly chipVisible = signal(false);
  private readonly chip = viewChild.required<ElementRef<HTMLElement>>('chip');

  /** Chip "Em breve" substitui o cursor e segue o mouse enquanto ele estiver sobre o item. */
  moveChip(x: number, y: number): void {
    this.chip().nativeElement.style.translate = `${x}px ${y}px`;
  }

  onPointerEnter(e: MouseEvent): void {
    this.moveChip(e.clientX, e.clientY);
    this.chipVisible.set(true);
  }

  onPointerMove(e: MouseEvent): void {
    this.moveChip(e.clientX, e.clientY);
  }

  /** Foco por teclado: ancora o chip acima do item. */
  onFocus(e: FocusEvent): void {
    const el = e.target as HTMLElement;
    if (!el.matches(':focus-visible')) return;
    const r = el.getBoundingClientRect();
    this.moveChip(r.right - 40, r.top - 16);
    this.chipVisible.set(true);
  }

  hideChip(): void {
    this.chipVisible.set(false);
  }
}
