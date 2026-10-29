import { Injectable, inject, signal } from '@angular/core';
import { Location } from '@angular/common';

const KEY = 'intro-seen';

@Injectable({ providedIn: 'root' })
export class IntroService {
  private readonly location = inject(Location);

  /** Só o nome no centro da tela: na 1ª visita da sessão, quando ela começa pela home. */
  readonly playing = signal(this.shouldPlay());

  finish(): void {
    this.playing.set(false);
  }

  private shouldPlay(): boolean {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === '1';
      sessionStorage.setItem(KEY, '1');
    } catch {}
    return !seen && this.location.path() === '';
  }
}
