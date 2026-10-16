import { applyPreferences, safeRead, safeWrite } from '../lib/motion.js';
export class DmnsMasthead extends HTMLElement {
  private controller = new AbortController();
  connectedCallback(): void {
    const signal = this.controller.signal;
    const still = this.querySelector<HTMLButtonElement>('[data-still]');
    const theme = this.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    const sync = (): void => { still?.setAttribute('aria-pressed', String(safeRead('dmns-still') === 'true')); };
    still?.addEventListener('click', () => {
      const enabled = still.getAttribute('aria-pressed') !== 'true';
      safeWrite('dmns-still', String(enabled));
      // In blocked storage environments the current page still honors the button.
      applyPreferences(enabled);
      still.setAttribute('aria-pressed', String(enabled));
    }, { signal });
    const setThemeLabel = (): void => theme?.setAttribute('aria-label', `Color theme: ${document.documentElement.dataset.theme ?? 'automatic'}. Change theme`);
    theme?.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme;
      const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
      if (next === 'auto') delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = next;
      safeWrite('dmns-theme', next);
      setThemeLabel();
    }, { signal });
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => applyPreferences(still?.getAttribute('aria-pressed') === 'true'), { signal });
    sync(); setThemeLabel();
  }
  disconnectedCallback(): void { this.controller.abort(); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-masthead': DmnsMasthead } }
