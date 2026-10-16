import { DmnsMasthead } from './components/dmns-masthead.js';
import { DmnsInfoStrip } from './components/dmns-info-strip.js';
import { DmnsPage } from './components/dmns-page.js';
import { DmnsSpread } from './components/dmns-spread.js';
import { DmnsPanel } from './components/dmns-panel.js';
import { DmnsBeatStrip } from './components/dmns-beat-strip.js';
import { DmnsBeat } from './components/dmns-beat.js';
import { DmnsCaption } from './components/dmns-caption.js';
import { DmnsBalloon } from './components/dmns-balloon.js';
import { DmnsSfx } from './components/dmns-sfx.js';
import { DmnsSpecimen } from './components/dmns-specimen.js';
import { DmnsFloorTabs } from './components/dmns-floor-tabs.js';
import { DmnsFilter } from './components/dmns-filter.js';
import { applyPreferences } from './lib/motion.js';
import { wireCamera } from './lib/camera.js';
import type { PagePosition } from './lib/book.js';
applyPreferences();
const components: ReadonlyArray<readonly [string, CustomElementConstructor]> = [
  ['dmns-masthead', DmnsMasthead], ['dmns-info-strip', DmnsInfoStrip], ['dmns-page', DmnsPage], ['dmns-spread', DmnsSpread], ['dmns-panel', DmnsPanel], ['dmns-beat-strip', DmnsBeatStrip], ['dmns-beat', DmnsBeat], ['dmns-caption', DmnsCaption], ['dmns-balloon', DmnsBalloon], ['dmns-sfx', DmnsSfx], ['dmns-specimen', DmnsSpecimen], ['dmns-floor-tabs', DmnsFloorTabs], ['dmns-filter', DmnsFilter],
];
for (const [name, constructor] of components) if (!customElements.get(name)) customElements.define(name, constructor);
document.documentElement.dataset.crossDoc = String('onpageswap' in window && 'onpagereveal' in window);
const data = document.getElementById('book-data')?.textContent;
if (data) wireCamera((JSON.parse(data) as { positions: PagePosition[] }).positions);
document.querySelector('.newsletter')?.addEventListener('submit', event => {
  event.preventDefault();
  const message = document.querySelector('.newsletter-message');
  if (message) message.textContent = 'Thanks for trying the concept. Nothing was sent or stored.';
});
