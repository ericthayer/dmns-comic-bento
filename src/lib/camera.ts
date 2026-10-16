import { normalizePath, resolveCameraMove, type CameraMove, type PagePosition } from './book.js';
import { motionLevel, skipRunningTransition } from './motion.js';
import { selectTraveler } from '../components/dmns-specimen.js';
interface NavigationEntry { url: string }
interface Activation { entry: NavigationEntry; from?: NavigationEntry }
interface SwapEvent extends Event { viewTransition: ViewTransition | null; activation: Activation | null }
interface RevealEvent extends Event { viewTransition: ViewTransition | null }
interface NavigationWindow extends Window { navigation?: { activation?: Activation } }
interface Transfer { from: string; to: string; move: CameraMove }
let clicked: HTMLAnchorElement | null = null;
let active: ViewTransition | null = null;
let swapped = false;
const dynamic = new Set<HTMLElement>();
function matchLink(path: string): HTMLAnchorElement | undefined {
  return [...document.querySelectorAll<HTMLAnchorElement>('dmns-panel a[href]')].find(a => normalizePath(a.href) === path);
}
function rememberSlot(from: string, to: string, panel: HTMLElement | null): void {
  if (panel?.id) try { sessionStorage.setItem(`dmns:slot:${from}:${to}`, panel.id); } catch { /* First matching link remains the fallback. */ }
}
function returnPanel(to: string, from: string): HTMLElement | null {
  try {
    const id = sessionStorage.getItem(`dmns:slot:${to}:${from}`);
    const panel = id ? document.getElementById(id) : null;
    if (panel?.localName === 'dmns-panel') return panel;
  } catch { /* Storage is optional. */ }
  return matchLink(from)?.closest<HTMLElement>('dmns-panel') ?? null;
}
function namePanel(panel: HTMLElement | null): void {
  if (!panel) return;
  panel.style.viewTransitionName = 'hero-panel'; dynamic.add(panel);
  const title = panel.querySelector<HTMLElement>('h1,h3');
  if (title) { title.style.viewTransitionName = 'hero-title'; dynamic.add(title); }
  selectTraveler(panel.querySelector('dmns-specimen'));
}
function clear(): void {
  dynamic.forEach(el => el.style.removeProperty('view-transition-name')); dynamic.clear();
  delete document.documentElement.dataset.transitionActive;
  active = null; selectTraveler();
}
function start(vt: ViewTransition, move: CameraMove): void {
  if (active && active !== vt) active.skipTransition();
  dynamic.forEach(el => el.style.removeProperty('view-transition-name')); dynamic.clear();
  active = vt;
  document.documentElement.dataset.camera = move;
  document.documentElement.dataset.transitionActive = 'true';
  if (motionLevel() !== 'full') vt.types?.add('reduced');
  else vt.types?.add(move);
  void vt.ready.catch(() => undefined);
  void vt.finished.catch(() => undefined).then(() => { if (active === vt) clear(); });
}
function save(transfer: Transfer): void { try { sessionStorage.setItem(`dmns:camera:${transfer.to}`, JSON.stringify(transfer)); } catch { /* Navigation API fallback remains available. */ } }
function read(to: string): Transfer | undefined {
  try {
    const raw = sessionStorage.getItem(`dmns:camera:${to}`); sessionStorage.removeItem(`dmns:camera:${to}`);
    if (!raw) return;
    const value: unknown = JSON.parse(raw);
    if (typeof value === 'object' && value !== null && 'from' in value && 'to' in value && 'move' in value && typeof value.from === 'string' && typeof value.to === 'string' && typeof value.move === 'string' && value.to === to) return value as Transfer;
  } catch { /* Storage is optional. */ }
  return;
}
export function wireCamera(positions: readonly PagePosition[]): void {
  const find = (path: string): PagePosition | undefined => positions.find(p => p.path === path);
  document.addEventListener('click', event => {
    const candidate = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!candidate || candidate.origin !== location.origin || event.defaultPrevented) return;
    clicked = candidate;
    skipRunningTransition(); active?.skipTransition();
    // Deliberately no preventDefault: the browser owns navigation and history.
  });
  window.addEventListener('pageswap', event => {
    const e = event as SwapEvent;
    swapped = true;
    if (!e.activation?.entry.url) return;
    const from = normalizePath(location.href), to = normalizePath(e.activation.entry.url);
    const a = find(from), b = find(to); if (!a || !b) return;
    const move = resolveCameraMove(a, b); save({ from, to, move });
    const sourcePanel = (clicked && normalizePath(clicked.href) === to ? clicked : matchLink(to))?.closest<HTMLElement>('dmns-panel') ?? null;
    if (move === 'zoom-in') rememberSlot(from, to, sourcePanel);
    if (!e.viewTransition) return;
    start(e.viewTransition, move);
    if (motionLevel() !== 'full') return;
    if (move === 'zoom-in') namePanel(sourcePanel);
    else if (move === 'zoom-out') namePanel(document.getElementById('splash'));
  });
  window.addEventListener('pagereveal', event => {
    const e = event as RevealEvent;
    swapped = false;
    const to = normalizePath(location.href);
    const activation = (window as NavigationWindow).navigation?.activation;
    const transfer = read(to);
    const from = transfer?.from ?? (activation?.from?.url ? normalizePath(activation.from.url) : undefined);
    if (!from) return;
    const a = find(from), b = find(to); if (!a || !b) return;
    const move = resolveCameraMove(a, b);
    document.documentElement.dataset.camera = move;
    if (!e.viewTransition) return;
    start(e.viewTransition, move);
    if (motionLevel() !== 'full') return;
    if (move === 'zoom-in') namePanel(document.getElementById('splash'));
    else if (move === 'zoom-out') {
      const panel = returnPanel(to, from);
      const floor = panel?.closest<HTMLElement>('[data-floor-panel]')?.dataset.floorPanel;
      if (floor) void document.querySelector('dmns-floor-tabs')?.selectFloor(floor, false);
      namePanel(panel);
    }
  });
  window.addEventListener('pageshow', event => { if (event.persisted) { clicked = null; if (swapped) clear(); } });
}
