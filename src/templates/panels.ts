import type { Color, Content, Exhibition, Hall } from '../lib/content.js';
import type { LayoutName, SpanToken } from '../lib/layouts.js';
import { exhibitionStatus } from '../lib/dates.js';
import { art, caption, escape, specimen, arrow } from './html.js';
export interface PanelOptions { id:string; title:string; description?:string; kicker?:string; art?:string; color?:Color; href?:string; linkLabel?:string; span?:SpanToken; documentary?:boolean; pose?:string; className?:string; extra?:string; lean?:boolean }
export function panel(o:PanelOptions): string {
  return `<dmns-panel id="${escape(o.id)}" data-span="${o.span??'w'}" data-color="${o.color??'paper'}" data-mood="${o.documentary?'documentary':'lively'}" ${o.href?`data-destination="${escape(o.href)}"`:''} class="${escape(o.className??'')}"><article aria-labelledby="${escape(o.id)}-title">
    ${o.kicker?`<p class="eyebrow panel-kicker">${escape(o.kicker)}</p>`:''}${o.art?art(o.art):''}
    <div class="panel-copy">${o.documentary?`<h3 id="${escape(o.id)}-title" class="document-title">${escape(o.title)}</h3>`:caption(o.title,'h3',`${o.id}-title`)}
    ${o.description?`<p class="caption-body ${o.description.includes('TODO:')?'todo':''}">${escape(o.description)}</p>`:''}
    ${o.href?`<a class="panel__link" href="${escape(o.href)}">${escape(o.linkLabel??`Explore ${o.title}`)}${arrow}${o.href.startsWith('https:')?'<span class="sr-only"> (official website)</span>':''}</a>`:''}</div>
    ${o.pose&&!o.documentary?specimen(o.pose):''}${o.extra??''}${o.lean?`<button class="closer" aria-expanded="false" data-lean="${escape(o.id)}">Look closer <span aria-hidden="true">⤢</span></button>`:''}
    </article></dmns-panel>`;
}
export function hallPanel(h:Hall,prefix:string,floor?:string,color?:Color,traveler=false):string {
  const desc=h.slug==='wildlife-halls'&&floor==='2'?`${h.description} Continued on Floor 3.`:h.description;
  return panel({id:`${prefix}-${h.slug}`,title:h.name,description:desc,kicker:h.closed?'To be continued…':h.floors.length?`Floor ${h.floors.join(' & ')}`:'Floor: TODO: confirm with DMNS',art:h.art,color:color??h.color,href:`/halls/${h.slug}/`,documentary:h.documentary,pose:traveler?h.pose:'none',className:h.closed?'panel--closure':'',span:'t'});
}
export function exhibitionPanel(e:Exhibition,c:Content,prefix:string,neutral=false):string {
  return panel({id:`${prefix}-${e.slug}`,title:e.shortName,description:e.description,kicker:exhibitionStatus(e,c.day),art:e.art,color:neutral?'paper':e.color,href:`/special-exhibitions/${e.slug}/`,documentary:e.documentary,span:'t'});
}
export interface SpreadOptions {id:string;title:string;kicker?:string;layout:LayoutName;panels:string[];flexible?:boolean;className?:string;hiddenTitle?:boolean}
export function spread(o:SpreadOptions):string {
  const panels=o.panels.map((p,i)=>p.replace('<dmns-panel ',`<dmns-panel style="--i:${i};--area:${'abcdefghi'[i]??'a'}" `)).join('');
  return `<dmns-spread id="${escape(o.id)}" data-layout="${o.layout}" ${o.flexible?'data-flexible':''} class="${escape(o.className??'')}"><section aria-labelledby="${escape(o.id)}-heading">${o.hiddenTitle?'':`<div class="spread-heading"><div><p class="eyebrow">${escape(o.kicker??'Field Notes')}</p><h2 id="${escape(o.id)}-heading" tabindex="-1">${escape(o.title)}</h2></div><span class="spread-number" aria-hidden="true">${escape(o.id.replace(/[^0-9]/g,'')||'↘')}</span></div>`}<div class="panel-grid" role="group" aria-labelledby="${escape(o.id)}-heading">${panels}</div></section></dmns-spread>`;
}
