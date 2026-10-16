import { motionLevel, transition } from '../lib/motion.js';
export class DmnsFilter extends HTMLElement {
  private controller = new AbortController();
  private revision = 0;
  connectedCallback(): void {
    const controls = this.querySelector<HTMLElement>('.filter-controls'); if (controls) controls.hidden = false;
    this.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => { void this.filter(button); }, { signal: this.controller.signal }));
  }
  private async filter(button: HTMLButtonElement): Promise<void> {
    const revision = ++this.revision;
    const category = button.dataset.filter ?? 'all';
    const panels = [...this.querySelectorAll<HTMLElement>('dmns-panel[data-category]')];
    const matches = (panel: HTMLElement): boolean => category === 'all' || panel.dataset.category === category;
    const leaving = panels.filter(panel => !panel.hidden && !matches(panel));
    leaving.forEach(panel => panel.dataset.leaving = 'true');
    if (motionLevel() === 'full' && leaving.length) await new Promise<void>(resolve => setTimeout(resolve, 240));
    if (revision !== this.revision) return;
    panels.forEach(panel => { panel.removeAttribute('data-leaving'); panel.style.viewTransitionName = `panel-${panel.id}`; panel.style.setProperty('view-transition-class', 'panel'); });
    try {
      await transition(() => {
        panels.forEach(panel => panel.hidden = !matches(panel));
        this.querySelectorAll('[data-filter]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
        const empty = this.querySelector<HTMLElement>('[data-filter-empty]'); if (empty) empty.hidden = panels.some(matches);
      }, ['filter'], this.querySelector<HTMLElement>('h2'), `${panels.filter(matches).length} ${this.closest('dmns-page')?.dataset.issue === 'programs' ? 'programs' : 'exhibitions'} shown.`);
    } finally { panels.forEach(panel => { panel.style.removeProperty('view-transition-name'); panel.style.removeProperty('view-transition-class'); }); }
  }
  disconnectedCallback(): void { this.controller.abort(); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-filter': DmnsFilter } }
