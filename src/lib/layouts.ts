export type LayoutName = 'cover' | 'trio' | 'mosaic' | 'stair' | 'strip';
export type SpanToken = 's' | 'm' | 'w' | 't' | 'xl' | 'splash';
export type ContainerSize = 'phone' | 'tablet' | 'desktop';
export const spanTokens: Readonly<Record<SpanToken, readonly [number, number]>> = { s:[3,1],m:[3,2],w:[6,2],t:[3,4],xl:[6,4],splash:[12,4] };
export interface LayoutMap { readonly phone: readonly string[]; readonly tablet: readonly string[]; readonly desktop: readonly string[] }
export const layouts: Readonly<Record<LayoutName, LayoutMap>> = {
  cover: { phone:['a a','b b','c c','d d'], tablet:['a a a a a a','a a a a a a','b b b c c c','b b b d d d'], desktop:['a a a a a a a a b b b b','a a a a a a a a b b b b','a a a a a a a a c c c c','a a a a a a a a d d d d'] },
  trio: { phone:['a a','b b','c c'],tablet:['a a b b c c'],desktop:['a a a a b b b b c c c c'] },
  mosaic: {phone:['a a','b b','c c'],tablet:['a a a a b b','a a a a c c'],desktop:['a a a a a a a a b b b b','a a a a a a a a c c c c']},
  stair: {phone:['a a','b b','c c','d d','e e','f f','g g','h h','i i'],tablet:['a a a . . .','. b b b . .','. c c c . .','. d d d . .','. . e e e .','. . f f f .','. . g g g .','. . h h h .','. . i i i .'],desktop:['a a a . . . . . . . . .','. b b b c c c d d d . .','. . e e e f f f g g g .','. . . h h h i i i . . .']},
  strip: {phone:['a a','b b','c c','d d'],tablet:['a a a b b b','c c c d d d'],desktop:['a a a b b b c c c d d d']},
};
export function layoutOrder(rows: readonly string[]): string[] { return [...new Set(rows.flatMap(row => row.split(' ')).filter(v => v !== '.'))]; }
export function layoutCss(): string {
  return (['phone','tablet','desktop'] as const).map(size => {
    const body = Object.entries(layouts).map(([name,map]) => `dmns-spread[data-layout="${name}"]:not([data-flexible]) > section > .panel-grid { grid-template-areas:${map[size].map(r=>`"${r}"`).join(' ')}; }`).join('\n');
    return size==='phone' ? body : `@container book (min-width:${size==='tablet'?'640':'1024'}px){${body}}`;
  }).join('\n');
}
