const specimens = new Set<DmnsSpecimen>();
let observer: IntersectionObserver | undefined;
const ratios = new Map<Element, number>();
export function selectTraveler(target?: DmnsSpecimen | null): void {
  for (const s of specimens) s.style.removeProperty('view-transition-name');
  const visible = [...specimens].filter(s => (ratios.get(s) ?? 0) > 0);
  const chosen = target ?? visible.sort((a, b) => (ratios.get(b) ?? 0) - (ratios.get(a) ?? 0))[0];
  if (chosen && document.documentElement.dataset.documentary !== 'true') chosen.style.viewTransitionName = 'specimen';
}
export class DmnsSpecimen extends HTMLElement {
  connectedCallback(): void {
    specimens.add(this);
    observer ??= new IntersectionObserver(entries => {
      for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
      if (document.documentElement.dataset.transitionActive !== 'true') selectTraveler();
    }, { threshold: [0, .25, .5, 1] });
    observer.observe(this);
  }
  disconnectedCallback(): void { observer?.unobserve(this); specimens.delete(this); ratios.delete(this); }
}
declare global { interface HTMLElementTagNameMap { 'dmns-specimen': DmnsSpecimen } }
