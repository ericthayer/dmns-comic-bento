import { readFile, writeFile, mkdir } from 'node:fs/promises';
const css=await readFile('src/styles/tokens.css','utf8');
const tokens=new Map([...css.matchAll(/--([a-z0-9-]+):\s*(#[a-fA-F0-9]{6})/g)].map(m=>[m[1]!,m[2]!]));
function luminance(hex:string):number {const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]!*.2126+rgb[1]!*.7152+rgb[2]!*.0722;}
const pairs=[['ink-0','paper'],['ink-0','paper-2'],['paper-text','ink-0'],['ink-0','ticket'],['ink-0','pop-green'],['ink-0','pop-blue'],['ink-0','pop-orange'],['ink-0','pop-magenta'],['ink-0','doc-sepia'],['paper-text','pop-red'],['paper-text','dark-paper'],['paper-text','dark-paper-2']] as const;
const rows=pairs.map(([fg,bg])=>{const a=luminance(tokens.get(fg)!),b=luminance(tokens.get(bg)!);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(ratio<4.5)throw new Error(`${fg} / ${bg}: ${ratio.toFixed(2)} fails AA`);return `| \`--${fg}\` | \`--${bg}\` | ${ratio.toFixed(2)}:1 | Pass |`;});
await mkdir('docs',{recursive:true});
await writeFile('docs/contrast.md',`# Contrast verification\n\nGenerated from tokens.css by npm run check. All text pairs used in light and dark themes require at least 4.5:1. Decorative art is excluded.\n\n| Foreground | Background | Ratio | WCAG AA |\n|---|---|---|---|\n${rows.join('\n')}\n\nThe focus indicator uses a 3px gold outline with a black separation ring. The black ring remains visible on every pop fill; gold remains visible against black. Closure text uses paper text on red.\n`);
console.log(`${rows.length} text contrast pairs passed AA.`);
