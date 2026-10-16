import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveCameraMove, normalizePath, type PagePosition } from '../../src/lib/book.js';
import { layouts, layoutOrder, spanTokens } from '../../src/lib/layouts.js';
import { localDate, hoursState, activeNotice, visibleNotices, exhibitionStatus } from '../../src/lib/dates.js';
import { hallSchema, loadContent } from '../../src/lib/content.js';
import { resolveMotionLevel } from '../../src/lib/motion.js';
const p=(path:string,depth:0|1|2,issue:PagePosition['issue']='halls',order=0):PagePosition=>({path,depth,issue,order});
test('camera branches, including depth precedence and same path',()=>{
  for(const [from,to,want] of [[p('/',0,'cover'),p('/halls/',1),'zoom-in'],[p('/halls/x/',2),p('/halls/',1),'zoom-out'],[p('/halls/',1),p('/theaters/',1,'theaters'),'new-issue'],[p('/halls/a/',2,'halls',0),p('/halls/b/',2,'halls',1),'turn-next'],[p('/halls/b/',2,'halls',1),p('/halls/a/',2,'halls',0),'turn-prev'],[p('/x/',1),p('/x/',1),'none'],[p('/x/',2),p('/y/',2),'none'],[p('/halls/x/',2),p('/theaters/',1,'theaters'),'zoom-out']] as const) assert.equal(resolveCameraMove(from,to),want);
  assert.equal(normalizePath('https://example.com/halls?floor=3#main'),'/halls/');
});
test('all named areas preserve reading order and rectangles at three sizes',()=>{
  for(const map of Object.values(layouts)) for(const rows of Object.values(map)) {
    assert.deepEqual(layoutOrder(rows),[...layoutOrder(rows)].sort());
    const grid=rows.map((r:string)=>r.split(' '));
    assert.ok(grid.every((r:string[])=>r.length===grid[0]?.length));
    for(const area of layoutOrder(rows)) {const points=grid.flatMap((r:string[],y:number)=>r.flatMap((v:string,x:number)=>v===area?[[x,y]]:[]));const xs=points.map((p:number[])=>p[0]!); const ys=points.map((p:number[])=>p[1]!); assert.equal(points.length,(Math.max(...xs)-Math.min(...xs)+1)*(Math.max(...ys)-Math.min(...ys)+1));}
  }
  assert.deepEqual(spanTokens.xl,[6,4]);
});
test('dates use Denver, notices expire inclusively, Friday ambiguity stays explicit',async()=>{
  const c=await loadContent();
  assert.equal(localDate(new Date('2026-10-16T03:00:00Z')),'2026-10-15');
  assert.equal(activeNotice(c.notices,'2026-10-29')?.id,'prehistoric-cleaning');
  assert.equal(activeNotice(c.notices,'2026-10-14'),undefined);
  assert.equal(visibleNotices(c.notices,'2026-10-30').length,0);
  assert.equal(hoursState(new Date('2026-12-25T17:00:00Z'),c.site).status,'Closed');
  assert.equal(hoursState(new Date('2026-10-17T01:00:00Z'),c.site).status,'Confirm evening hours');
  assert.match(exhibitionStatus(c.exhibitions[0]!,'2026-10-15'),/^Opens/);
  assert.equal(exhibitionStatus(c.exhibitions[0]!,'2026-10-16'),'Now open');
});
test('loaders reject invalid data and all routes are unique',async()=>{
  assert.equal(hallSchema.safeParse({slug:'../../escape'}).success,false);
  const c=await loadContent(); assert.equal(c.positions.length,26); assert.equal(new Set(c.positions.map(p=>p.path)).size,26);
  assert.ok(c.halls.filter(h=>h.documentary).every(h=>h.pose==='none'));
});
test('motion preferences dominate feature support',()=>{
  for(const viewTransitions of [true,false]) for(const scrollTimelines of [true,false]) {
    const base={viewTransitions,scrollTimelines};
    assert.equal(resolveMotionLevel({...base,still:true,reduced:false}),'none');
    assert.equal(resolveMotionLevel({...base,still:false,reduced:true}),'reduced');
    assert.equal(resolveMotionLevel({...base,still:false,reduced:false}),'full');
  }
});
test('expired notices are absent from rendered output, not just the strip',async()=>{
  const previous=process.env.BUILD_DATE;
  try {
    process.env.BUILD_DATE='2026-10-30';
    const c=await loadContent();assert.equal(c.notices.length,0);
    const {renderPage}=await import('../../src/templates/pages.js');
    const {documentHtml}=await import('../../src/templates/chrome.js');
    for(const position of c.positions) {const page=renderPage(c,position);const html=documentHtml(c,position,page.title,page.html,'',page.documentary);assert.equal(html.includes('Prehistoric Journey closed Oct. 27'),false);assert.equal(html.includes('prehistoric-cleaning'),false);}
  } finally {if(previous===undefined) delete process.env.BUILD_DATE;else process.env.BUILD_DATE=previous;}
});
test('template text and embedded JSON cannot close into executable markup',async()=>{
  const {escape,jsonScript,caption}=await import('../../src/templates/html.js');
  assert.equal(escape('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(caption('<script>alert(1)</script>','h3','safe').includes('<script>'),false);
  assert.equal(jsonScript({value:'</script><script>alert(1)</script>'}).includes('</script>'),false);
});
