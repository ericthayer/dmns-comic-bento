import { safeRead, safeWrite, transition } from '../lib/motion.js';
export class DmnsFloorTabs extends HTMLElement {
  private controller = new AbortController();
  connectedCallback(): void {
    const nav = this.querySelector('.floor-tabs>div');
    nav?.setAttribute('role', 'tablist'); nav?.setAttribute('aria-label', 'Museum floors');
    const tabs = [...this.querySelectorAll<HTMLAnchorElement>('[data-floor]')];
    tabs.forEach(tab => {
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', `floor-${tab.dataset.floor}`);
      tab.addEventListener('click', event => { event.preventDefault(); void this.selectFloor(tab.dataset.floor ?? '1', true); }, { signal: this.controller.signal });
      tab.addEventListener('keydown', event => {
        if (event.key === ' ') { event.preventDefault(); void this.selectFloor(tab.dataset.floor ?? '1', true); return; }
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const index = tabs.indexOf(tab);
        const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        target?.focus();
      }, { signal: this.controller.signal });
    });
    this.querySelectorAll<HTMLElement>('[data-floor-panel]').forEach(region => {
      region.setAttribute('role', 'tabpanel'); region.setAttribute('aria-labelledby', `tab-${region.dataset.floorPanel}`);
    });
    const hash = location.hash.startsWith('#floor-') ? location.hash.slice(7) : null;
    void this.selectFloor(hash ?? safeRead('dmns-floor') ?? '1', false);
  }
  async selectFloor(floor: string, animate: boolean): Promise<void> {
    if (!['1', '2', '3', 'Outdoor'].includes(floor)) floor = '1';
    const update = (): void => {
      this.querySelectorAll<HTMLAnchorElement>('[data-floor]').forEach(tab => {
        const selected = tab.dataset.floor === floor;
        tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
      });
      this.querySelectorAll<HTMLElement>('[data-floor-panel]').forEach(region => region.hidden = region.dataset.floorPanel !== floor);
      this.dataset.selectedFloor = floor;
      safeWrite('dmns-floor', floor);
    };
    if (animate) await transition(update, ['floor-swap'], this.querySelector<HTMLElement>(`#floor-spread-${floor}-heading`), `Showing ${floor === 'Outdoor' ? 'outdoor halls' : `Floor ${floor}`}.`);
    else update();
  }
  disconnectedCallback(): void { this.controller.abort(); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-floor-tabs': DmnsFloorTabs } }
