import { readFile } from 'node:fs/promises';
import { loadContent } from '../src/lib/content.js';
const c=await loadContent();
const pages=new Map<string,string>();
for(const p of c.positions) pages.set(p.path,await readFile(`dist${p.path}index.html`,'utf8'));
const failures:string[]=[];
for(const [path,html] of pages) {
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]!);
 if(new Set(ids).size!==ids.length) failures.push(`${path}: duplicate HTML id`);
 if([...html.matchAll(/<h1(?:\s|>)/g)].length!==1) failures.push(`${path}: expected exactly one h1`);
 for(const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
  const href=match[1]!.replace(/&amp;/g,'&');
  if(href.startsWith('https:')||href.startsWith('mailto:')||href.startsWith('tel:')) continue;
  const dest=new URL(href,`https://concept.invalid${path}`);
  if(!pages.has(dest.pathname)) {failures.push(`${path}: missing ${href}`);continue;}
  if(dest.hash&&!pages.get(dest.pathname)?.includes(`id="${decodeURIComponent(dest.hash.slice(1))}"`)) failures.push(`${path}: missing fragment ${href}`);
 }
}
if(failures.length) throw new Error(failures.join('\n'));
console.log(`Links passed: ${pages.size} routes, no missing internal destinations or duplicate IDs.`);
