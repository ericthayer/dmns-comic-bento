import { activeNotice, hoursState, localDate, type Notice, type HoursConfig } from '../lib/dates.js';
interface Runtime { site: HoursConfig; notices: Notice[] }
export class DmnsInfoStrip extends HTMLElement {
  private timer?: ReturnType<typeof setInterval>;
  connectedCallback(): void {
    const data = document.getElementById('book-data');
    if (!data?.textContent) return;
    const runtime: Runtime = JSON.parse(data.textContent) as Runtime;
    const update = (): void => {
      const now = new Date();
      const h = hoursState(now, runtime.site);
      const hours = this.querySelector('[data-hours]');
      const status = this.querySelector('[data-open-state]');
      const notice = this.querySelector('[data-notice]');
      if (hours && hours.textContent !== `Today: ${h.hours}`) hours.textContent = `Today: ${h.hours}`;
      if (status && status.textContent !== h.status) status.textContent = h.status;
      const n = activeNotice(runtime.notices, localDate(now, runtime.site.timezone));
      if (notice) {
        const anchor = notice.closest('a');
        const text = n?.shortText ?? 'Hours & visitor information';
        if (notice.textContent !== text) notice.textContent = text;
        anchor?.setAttribute('href', n ? `/halls/${n.hall}/` : '/visit/');
        const icon = anchor?.querySelector('[aria-hidden]');
        if (icon && icon.textContent !== (n ? '!' : '↗')) icon.textContent = n ? '!' : '↗';
      }
    };
    update();
    // Initial HTML is not an announcement. Only later client updates are live.
    this.setAttribute('aria-live', 'polite');
    this.timer = setInterval(update, 60_000);
  }
  disconnectedCallback(): void { if (this.timer) clearInterval(this.timer); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-info-strip': DmnsInfoStrip } }
