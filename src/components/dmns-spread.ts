import { transition, skipRunningTransition } from '../lib/motion.js';
export class DmnsSpread extends HTMLElement {
  private controller = new AbortController();
  private expanded: HTMLButtonElement | undefined;
  private busy = false;
  private restorePending = false;
  connectedCallback(): void {
    const signal = this.controller.signal;
    this.addEventListener('click', event => {
      const button = (event.target as Element).closest<HTMLButtonElement>('[data-lean]');
      if (button) void this.lean(button, !this.hasAttribute('data-focused'));
    }, { signal });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.expanded) void this.lean(this.expanded, false);
    }, { signal });
  }
  private async lean(button: HTMLButtonElement, expanded: boolean): Promise<void> {
    if (this.busy) {
      if (!expanded) { this.restorePending = true; skipRunningTransition(); }
      return;
    }
    this.busy = true;
    const panels = [...this.querySelectorAll('dmns-panel')];
    panels.forEach(p => { p.style.viewTransitionName = `panel-${p.id}`; p.style.setProperty('view-transition-class', 'panel'); });
    if (expanded) this.expanded = button;
    try {
      await transition(() => {
        this.toggleAttribute('data-focused', expanded);
        button.setAttribute('aria-expanded', String(expanded));
        this.expanded = expanded ? button : undefined;
      }, ['panel-focus'], expanded ? this.querySelector<HTMLElement>('#mythic-strip-title') : button, expanded ? 'Panel expanded. Press Escape to restore the spread.' : 'Spread restored.');
    } finally {
      panels.forEach(p => { p.style.removeProperty('view-transition-name'); p.style.removeProperty('view-transition-class'); });
      this.busy = false;
      if (this.restorePending) { this.restorePending = false; void this.lean(button, false); }
    }
  }
  disconnectedCallback(): void { this.controller.abort(); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-spread': DmnsSpread } }
