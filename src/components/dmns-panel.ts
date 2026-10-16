import { motionLevel } from '../lib/motion.js';
const live: DmnsPanel[] = [];
export class DmnsPanel extends HTMLElement {
  private observer?: IntersectionObserver;
  private controller = new AbortController();
  private visible = false;
  private sync = (): void => {
    const eligible = this.visible && !document.hidden && motionLevel() === 'full' && this.dataset.mood !== 'documentary';
    const index = live.indexOf(this);
    if (eligible && index < 0) live.push(this);
    if (!eligible && index >= 0) live.splice(index, 1);
    this.toggleAttribute('data-live', eligible);
    while (live.length > 6) live.shift()?.removeAttribute('data-live');
  };
  connectedCallback(): void {
    this.observer = new IntersectionObserver(entries => {
      this.visible = entries.some(entry => entry.isIntersecting);
      this.sync();
    }, { threshold: 0.05 });
    this.observer.observe(this);
    document.addEventListener('visibilitychange', this.sync, { signal: this.controller.signal });
    document.addEventListener('motionchange', this.sync, { signal: this.controller.signal });
  }
  disconnectedCallback(): void {
    this.observer?.disconnect(); this.controller.abort();
    const index = live.indexOf(this); if (index >= 0) live.splice(index, 1);
  }
}
declare global { interface HTMLElementTagNameMap { 'dmns-panel': DmnsPanel } }
