import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { loadContent } from '../src/lib/content.js';
import { startServer } from './server.js';
const server = await startServer(0);
const browser = await chromium.launch();
const content = await loadContent();
let checks = 0;
try {
  for (const width of [360,768,1440]) {
    const context = await browser.newContext({viewport:{width,height:1000},javaScriptEnabled:false,reducedMotion:'reduce'});
    const page = await context.newPage();
    for (const route of content.positions) {
      await page.goto(server.url + route.path);
      const result = await page.locator('.panel-grid').evaluateAll(grids => grids.map(grid => {
        const panels = [...grid.children].filter((e):e is HTMLElement=>e instanceof HTMLElement && e.localName==='dmns-panel' && !e.hidden);
        const dom = panels.map(e=>e.id);
        const visual = [...panels].sort((a,b)=>{
          const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();
          return Math.abs(x.top-y.top)>2 ? x.top-y.top : x.left-y.left;
        }).map(e=>e.id);
        return {dom,visual};
      }));
      for(const grid of result) {
        if(JSON.stringify(grid.dom)!==JSON.stringify(grid.visual)) throw new Error(`Reading order differs at ${width}px on ${route.path}: ${JSON.stringify(grid)}`);
        checks++;
      }
    }
    await context.close();
  }
  await writeFile('work/reading-order.json',JSON.stringify({checks,widths:[360,768,1440],routes:content.positions.length,passed:true},null,2));
  console.log(`Reading order passed: ${checks} rendered grids across 26 routes at phone, tablet, and desktop widths.`);
} finally { await browser.close(); await server.close(); }
