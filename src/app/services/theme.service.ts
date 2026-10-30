import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
const KEY = 'theme';

/**
 * Tema da página. A regra é seguir o modo claro/escuro do dispositivo, inclusive quando ele muda com a página
 * aberta (ex.: modo automático ao anoitecer). Escolher no seletor sol/lua vale só para a visita atual
 * (sessionStorage): na próxima visita a página volta a acompanhar o dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly system = window.matchMedia('(prefers-color-scheme: dark)');
  /** true depois que a pessoa escolhe um tema no seletor nesta visita */
  private chosen = false;

  readonly theme = signal<Theme>(this.initial());

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });

    this.system.addEventListener('change', (e) => {
      if (!this.chosen) this.theme.set(e.matches ? 'dark' : 'light');
    });
  }

  set(theme: Theme): void {
    this.chosen = true;
    this.theme.set(theme);
    try { sessionStorage.setItem(KEY, theme); } catch {}
  }

  private initial(): Theme {
    try {
      // Versões anteriores guardavam a escolha para sempre e deixavam de seguir o dispositivo
      localStorage.removeItem(KEY);
      const saved = sessionStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') {
        this.chosen = true;
        return saved;
      }
    } catch {}
    return this.system.matches ? 'dark' : 'light';
  }
}
