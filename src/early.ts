// Compiled as a small classic script by build.ts, before the first paint.
(() => {
  let still = false;
  try {
    still = localStorage.getItem('dmns-still') === 'true';
    const theme = localStorage.getItem('dmns-theme');
    if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
  } catch { /* Storage is optional. */ }
  document.documentElement.dataset.motion = still ? 'none' : matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
  document.documentElement.dataset.scroll = String(CSS.supports('animation-timeline: view()'));
})();
