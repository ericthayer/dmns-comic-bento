import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { issues, type PagePosition } from './book.js';
import { visibleNotices } from './dates.js';
const color = z.enum(['paper','green','blue','orange','magenta','sepia']);
const slug = z.string().regex(/^[a-z0-9-]+$/);
const url = z.string().url();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)), 'Invalid date');
export const hallSchema = z.object({slug,name:z.string(),floors:z.array(z.enum(['1','2','3','Outdoor'])),description:z.string(),color,art:slug,pose:z.string(),documentary:z.boolean(),source:url,todo:z.array(z.string()),closed:z.boolean()}).strict();
export const exhibitionSchema = z.object({slug,name:z.string(),shortName:z.string(),description:z.string(),opens:date.nullable(),ends:date.nullable(),color,art:slug,documentary:z.boolean(),category:z.enum(['exhibition','event']),source:url,todo:z.array(z.string())}).strict();
const theaterSchema = z.object({slug,name:z.string(),description:z.string(),color,art:slug,source:url}).strict();
const linkSchema = z.object({label:z.string(),url});
const siteSchema = z.object({name:z.string(),shortName:z.string(),asOf:date,timezone:z.string(),address:z.string(),hours:z.string(),fridayHours:z.string(),closedDates:z.array(z.string()),closedLabel:z.string(),todo:z.string(),tickets:url,landAcknowledgment:z.string(),landSource:url,nonprofit:z.string(),credentials:z.array(z.string()),wing:z.object({name:z.string(),description:z.string(),plaza:z.string(),cafe:z.string(),lobby:z.string()}),collections:z.array(z.object({name:z.string(),art:slug,documentary:z.boolean()})),socials:z.array(linkSchema),footerLinks:z.array(linkSchema),outbound:z.array(linkSchema)}).strict();
const noticeSchema = z.object({id:slug,hall:slug,start:date,end:date,closureStart:date,priority:z.number(),text:z.string(),shortText:z.string(),source:url}).refine(n=>n.end>=n.start,'Notice ends before it starts');
const mediaSchema = z.object({src:z.string(),alt:z.string(),credit:z.string(),placeholder:z.boolean()});
const spreadSchema = z.object({id:slug,title:z.string(),kicker:z.string(),layout:z.enum(['cover','trio','mosaic','stair','strip'])});
export type Hall = z.infer<typeof hallSchema>;
export type Exhibition = z.infer<typeof exhibitionSchema>;
export type Theater = z.infer<typeof theaterSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Color = z.infer<typeof color>;
export async function readContent<T>(file: string, schema: z.ZodType<T>): Promise<T> {
  const input: unknown = JSON.parse(await readFile(new URL(`../../content/${file}`, import.meta.url),'utf8'));
  return schema.parse(input);
}
export async function loadContent() {
  const [site,halls,exhibitions,theaters,events,notices,media,cover] = await Promise.all([
    readContent('site.json',siteSchema),readContent('halls.json',z.array(hallSchema)),readContent('exhibitions.json',z.array(exhibitionSchema)),readContent('theaters.json',z.array(theaterSchema)),
    readContent('events.json',z.array(z.object({id:slug,name:z.string(),description:z.string(),category:z.string(),source:url}))),
    readContent('notices.json',z.array(noticeSchema)),readContent('media.json',z.array(mediaSchema)),readContent('spreads/cover.json',z.array(spreadSchema))
  ]);
  const day = date.parse(process.env.BUILD_DATE ?? site.asOf);
  const positions: PagePosition[] = issues.map((i,order)=>({path:i.path,issue:i.id,depth:i.id==='cover'?0:1,order}));
  for (const [list,issue,path] of [[halls,'halls','halls'],[exhibitions,'special','special-exhibitions'],[theaters,'theaters','theaters']] as const) {
    list.forEach((item,order)=>positions.push({path:`/${path}/${item.slug}/`,issue,depth:2,order}));
  }
  if (new Set(positions.map(p=>p.path)).size !== positions.length) throw new Error('Duplicate route');
  for (const hall of halls) if (hall.documentary && hall.pose !== 'none') throw new Error('Documentary hall has a character');
  return {site,halls,exhibitions,theaters,events,notices:visibleNotices(notices,day),media,cover,positions,day};
}
export type Content = Awaited<ReturnType<typeof loadContent>>;
