import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
const KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    try { localStorage.setItem(KEY, theme); } catch {}
  }

  private initial(): Theme {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
