import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import ts from 'typescript';
import { loadContent } from '../src/lib/content.js';
import { layoutCss } from '../src/lib/layouts.js';
import { documentHtml } from '../src/templates/chrome.js';
import { renderPage } from '../src/templates/pages.js';
import { buildSprites } from './build-sprites.js';
const content = await loadContent();
await mkdir('dist/assets/js', { recursive: true });
await cp('public', 'dist', { recursive: true });
const styles = ['tokens.css','base.css','grid.css','components/chrome.css','components/pages.css','ink.css','boil.css','camera.css'];
const css = (await Promise.all(styles.map(p => readFile(`src/styles/${p}`, 'utf8')))).join('\n') + '\n' + layoutCss();
await writeFile('dist/assets/site.css', css);
const early = ts.transpileModule(await readFile('src/early.ts', 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None, moduleDetection: ts.ModuleDetectionKind.Legacy, removeComments: true } }).outputText;
await writeFile('dist/assets/js/early.js', early);
const sprites = await buildSprites();
for (const position of content.positions) {
  const page = renderPage(content, position);
  // One sprite per generated issue page; prune unused symbols and their three frames.
  const symbols = new Set([...page.html.matchAll(/href="#art-([a-z-]+)"/g)].map(m => m[1]));
  const pageSprite = sprites.replace(/<symbol id="art-([a-z-]+)"[\s\S]*?<\/symbol>/g, (symbol: string, id: string) => symbols.has(id) ? symbol : '');
  const directory = `dist${position.path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}index.html`, documentHtml(content, position, page.title, page.html, pageSprite, page.documentary));
}
const cover = content.positions[0]!;
await writeFile('dist/404.html', documentHtml(content, cover, 'Page not found', '<section class="editorial"><h1>Page not found</h1><p>This page is not part of the concept edition.</p><a href="/">Return to the museum home page</a></section>', ''));
await writeFile('dist/routes.json', JSON.stringify(content.positions, null, 2));
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\n');
await mkdir('work', { recursive: true });
await writeFile('work/build-report.json', JSON.stringify({ day: content.day, routes: content.positions.length, notices: content.notices.map(n => n.id) }, null, 2));
console.log(`Built ${content.positions.length} complete HTML routes. Content date: ${content.day}.`);
