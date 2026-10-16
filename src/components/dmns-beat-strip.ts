import { motionLevel } from '../lib/motion.js';
export class DmnsBeatStrip extends HTMLElement {
  private observer?: IntersectionObserver;
  private controller = new AbortController();
  private timer?: ReturnType<typeof setTimeout>;
  private played = false;
  private current = 0;
  private show(index: number): void {
    const beats = [...this.querySelectorAll<HTMLElement>('dmns-beat')];
    beats.forEach((beat, i) => { beat.style.visibility = i === index ? 'visible' : 'hidden'; });
    const counter = this.querySelector('.beat-controls>span');
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(beats.length).padStart(2, '0')}`;
  }
  private stop = (): void => {
    if (this.timer) clearTimeout(this.timer);
    const count = this.querySelectorAll('dmns-beat').length;
    this.current = Math.max(count - 1, 0); this.show(this.current);
    const pause = this.querySelector<HTMLButtonElement>('[data-pause]'); if (pause) pause.hidden = true;
    this.removeAttribute('data-playing');
  };
  private play(manual = false): void {
    this.stop();
    if (!manual && (motionLevel() !== 'full' || !CSS.supports('animation-timeline: view()'))) return;
    this.played = true; this.current = 0; this.show(0); this.dataset.playing = 'true';
    const pause = this.querySelector<HTMLButtonElement>('[data-pause]'); if (pause) pause.hidden = false;
    const next = (): void => {
      this.current += 1;
      if (this.current >= this.querySelectorAll('dmns-beat').length) { this.stop(); return; }
      this.show(this.current); this.timer = setTimeout(next, 900);
    };
    this.timer = setTimeout(next, 900);
  }
  connectedCallback(): void {
    this.stop();
    const signal = this.controller.signal;
    this.querySelector('[data-replay]')?.addEventListener('click', () => this.play(true), { signal });
    this.querySelector('[data-pause]')?.addEventListener('click', this.stop, { signal });
    this.addEventListener('pointerenter', () => { if (this.played && motionLevel() === 'full') this.play(); }, { signal });
    this.addEventListener('focusin', event => { if (!(event.target as Element).closest('button') && this.played) this.play(); }, { signal });
    document.addEventListener('motionchange', this.stop, { signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.stop(); }, { signal });
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { if (!this.played) this.play(); }
      else this.stop();
    }, { threshold: .4 });
    this.observer.observe(this);
  }
  disconnectedCallback(): void { this.stop(); this.observer?.disconnect(); this.controller.abort(); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-beat-strip': DmnsBeatStrip } }
