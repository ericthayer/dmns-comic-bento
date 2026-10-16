import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
async function files(directory: string): Promise<string[]> { const entries = await readdir(directory, { withFileTypes: true }); return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(directory,e.name)) : [join(directory,e.name)]))).flat(); }
const all = await files('dist');
const bytes = async (file: string): Promise<number> => gzipSync(await readFile(file)).length;
const js = (await Promise.all(all.filter(f=>f.endsWith('.js')).map(bytes))).reduce((a,b)=>a+b,0);
const css = (await Promise.all(all.filter(f=>f.endsWith('.css')).map(bytes))).reduce((a,b)=>a+b,0);
let svg = 0;
for (const file of all.filter(f=>f.endsWith('.html'))) { const html = await readFile(file,'utf8'); svg = Math.max(svg,gzipSync([...html.matchAll(/<svg[\s\S]*?<\/svg>/g)].map(m=>m[0]).join('')).length); }
const report = { javascriptGzip:js, cssGzip:css, largestSvgGzip:svg, budgets:{javascript:35*1024,css:40*1024,svg:120*1024} };
await mkdir('work',{recursive:true}); await writeFile('work/budgets.json',JSON.stringify(report,null,2));
if (js>35*1024 || css>40*1024 || svg>120*1024) throw new Error(`Performance asset budget exceeded: ${JSON.stringify(report)}`);
console.log(`Gzip budgets passed: JS ${(js/1024).toFixed(1)} KB, CSS ${(css/1024).toFixed(1)} KB, largest SVG ${(svg/1024).toFixed(1)} KB.`);
