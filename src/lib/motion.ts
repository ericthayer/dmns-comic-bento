export type MotionLevel = 'full' | 'reduced' | 'none';
export interface MotionPreferences { still: boolean; reduced: boolean; viewTransitions: boolean; scrollTimelines: boolean }
export function resolveMotionLevel(p: MotionPreferences): MotionLevel {
  if (p.still) return 'none';
  if (p.reduced) return 'reduced';
  return 'full';
}
export function motionLevel(): MotionLevel { return (document.documentElement.dataset.motion as MotionLevel | undefined) ?? 'full'; }
export function safeRead(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } }
export function safeWrite(key: string, value: string): void { try { localStorage.setItem(key,value); } catch { /* Preferences still work for this page. */ } }
export function applyPreferences(stillOverride?: boolean): void {
  const scroll = CSS.supports('animation-timeline: view()');
  document.documentElement.dataset.motion = resolveMotionLevel({still:stillOverride ?? safeRead('dmns-still')==='true',reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,viewTransitions:'startViewTransition' in document,scrollTimelines:scroll});
  document.documentElement.dataset.scroll = String(scroll);
  document.documentElement.dataset.vtClass = String(CSS.supports('view-transition-class: a'));
  document.dispatchEvent(new Event('motionchange'));
}
let running: ViewTransition | undefined;
export function skipRunningTransition(): void { running?.skipTransition(); }
export async function transition(update: () => void, types: string[], heading?: HTMLElement | null, message?: string): Promise<void> {
  running?.skipTransition();
  if (!('startViewTransition' in document) || motionLevel() !== 'full') update();
  else {
    const vt = CSS.supports('selector(:active-view-transition-type(zoom-in))')
      ? document.startViewTransition({update,types})
      : document.startViewTransition(update);
    running = vt;
    // ready rejects when a second navigation skips a transition; never leak that rejection.
    void vt.ready.catch(()=>undefined);
    await vt.finished.catch(()=>undefined);
    if (running !== vt) return;
    running = undefined;
  }
  heading?.focus({preventScroll:true});
  if (message) { const live = document.getElementById('announcer'); if (live) live.textContent = message; }
}
