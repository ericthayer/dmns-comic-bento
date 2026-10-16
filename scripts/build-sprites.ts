import { readFile, readdir } from 'node:fs/promises';
export async function buildSprites(): Promise<string> {
  const files=(await readdir('art')).filter(f=>f.endsWith('.svg')).sort();
  const symbols=await Promise.all(files.map(async file=>{
    const svg=await readFile(`art/${file}`,'utf8');
    const body=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
    return `<symbol id="art-${file.slice(0,-4)}" viewBox="0 0 600 400">${body}</symbol>`;
  }));
  return `<svg class="sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>${symbols.join('')}<filter id="photo-duotone"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="discrete" tableValues=".05 .56"/><feFuncG type="discrete" tableValues=".05 .76"/><feFuncB type="discrete" tableValues=".05 .16"/></feComponentTransfer></filter></defs></svg>`;
}
