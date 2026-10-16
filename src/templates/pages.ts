import type { Content } from '../lib/content.js';
import { type PagePosition, issues } from '../lib/book.js';
import { exhibitionStatus } from '../lib/dates.js';
import { escape, external } from './html.js';
import { panel, spread, hallPanel, exhibitionPanel } from './panels.js';
import { coverPage } from './cover.js';
import { hallDetail, genericDetail, splash } from './detail.js';
export function renderPage(c:Content,p:PagePosition):{title:string;html:string;documentary:boolean} {
 const issue=issues.find(i=>i.id===p.issue)!;
 const slug=p.path.split('/').filter(Boolean).at(-1);
 if(p.depth===0) return {title:c.site.name,html:coverPage(c),documentary:false};
 if(p.depth===2&&p.issue==='halls') {const h=c.halls.find(h=>h.slug===slug)!;return {title:h.name,html:hallDetail(c,h),documentary:h.documentary};}
 if(p.depth===2&&p.issue==='special') {const e=c.exhibitions.find(e=>e.slug===slug)!;return {title:e.name,html:genericDetail(c,e.name,e.description,exhibitionStatus(e,c.day),e.art,e.color,e.source,e.documentary),documentary:e.documentary};}
 if(p.depth===2&&p.issue==='theaters') {const t=c.theaters.find(t=>t.slug===slug)!;return {title:t.name,html:genericDetail(c,t.name,t.description,'Theaters',t.art,t.color,t.source),documentary:false};}
 let html='';
 if(p.issue==='halls') {
  html=splash({title:'Halls',description:'Pick a floor. Follow your curiosity.',kicker:'Issue: The Halls',art:'stegosaurus',color:'green',pose:'digging',short:true});
  html+=`<dmns-floor-tabs><nav aria-label="Choose a floor" class="floor-tabs"><span class="eyebrow">Explore by floor</span><div>${['1','2','3','Outdoor'].map((f,i)=>`<a id="tab-${f}" href="#floor-${f}" data-floor="${f}" ${i===0?'data-initial':''}>${f==='Outdoor'?'Outdoor':`Floor ${f}`}</a>`).join('')}</div></nav><div class="floor-panels">${['1','2','3','Outdoor'].map(f=>`<div id="floor-${f}" data-floor-panel="${f}">${spread({id:`floor-spread-${f}`,title:f==='Outdoor'?'Nature, outdoors':`Floor ${f}`,kicker:'Permanent halls',layout:'strip',flexible:true,panels:c.halls.filter(h=>h.floors.includes(f as '1'|'2'|'3'|'Outdoor')).map((h,i)=>hallPanel(h,`floor${f}`,f,h.slug==='wildlife-halls'&&f==='2'?'paper':h.color,i===0))})}</div>`).join('')}</div></dmns-floor-tabs>`;
  html+=spread({id:'hall-renovation',title:'A new chapter is taking shape.',kicker:'Renovation notice',layout:'trio',flexible:true,panels:[hallPanel(c.halls.find(h=>h.closed)!,'renovation',undefined,'paper',true)]});
 } else if(p.issue==='special') {
  html=splash({title:issue.name,description:'Mythic Creatures. Changing Landscapes. And more to come.',kicker:issue.kicker,art:'dragon',color:'magenta',short:true});
  html+=`<dmns-filter><div class="filter-controls" aria-label="Filter exhibitions" hidden>${['All','Now open','Upcoming'].map((label,i)=>`<button data-filter="${['all','open','upcoming'][i]}" aria-pressed="${i===0}">${label}</button>`).join('')}</div>${spread({id:'exhibitions',title:'Explore special exhibitions',kicker:'At the museum',layout:'strip',flexible:true,panels:c.exhibitions.map(e=>exhibitionPanel(e,c,'exhibition').replace('<dmns-panel ',`<dmns-panel data-category="${e.opens&&e.opens>c.day?'upcoming':'open'}" `))})}<p data-filter-empty hidden>No exhibitions match this filter.</p></dmns-filter>`;
 } else if(p.issue==='theaters') {
  html=splash({title:issue.name,description:'Gates Planetarium · Sturm Infinity Theater · Laser Shows',kicker:issue.kicker,art:'space',color:'blue',short:true});
  html+=spread({id:'theater-list',title:'Choose your theater',kicker:'Films & shows',layout:'trio',panels:c.theaters.map(t=>panel({id:t.slug,title:t.name,description:t.description,art:t.art,color:t.color,href:`/theaters/${t.slug}/`}))});
 } else if(p.issue==='visit') {
  html=splash({title:issue.name,description:c.site.address,kicker:issue.kicker,art:'museum',color:'paper',short:true});
  html+=spread({id:'getting-here',title:'Getting Here',kicker:'Visitor information',layout:'trio',panels:[panel({id:'hours',title:'Hours',description:`${c.site.hours}. ${c.site.fridayHours}. ${c.site.closedLabel}`,documentary:true}),panel({id:'address',title:'Address',description:c.site.address,href:'https://www.dmns.org/visit/getting-here/',linkLabel:'Official directions',documentary:true}),panel({id:'tickets',title:'Buy Tickets',description:'Ticket availability and pricing are on the official museum website.',href:c.site.tickets,linkLabel:'Buy Tickets',documentary:true})]});
  html+=spread({id:'visit-accessibility',title:'Make your visit yours',kicker:'Plan ahead',layout:'trio',panels:[panel({id:'accessibility',title:'Accessibility',description:c.site.todo,href:'https://www.dmns.org/visit/accessibility/',documentary:true}),panel({id:'eat-shop',title:'Eat & Shop',description:c.site.wing.cafe,href:'https://www.dmns.org/visit/eat-and-shop/',documentary:true}),panel({id:'visit-halls',title:'Halls',description:'Find halls by floor.',href:'/halls/',documentary:true})]});
  html+=spread({id:'sturm-family-wing',title:c.site.wing.name,kicker:'At the museum',layout:'mosaic',panels:[panel({id:'wing',title:c.site.wing.name,description:c.site.wing.description,art:'museum',color:'green'}),panel({id:'plaza',title:'Sturm Family Plaza',description:c.site.wing.plaza,documentary:true}),panel({id:'wing-theater',title:'Sturm Infinity Theater',description:c.site.wing.lobby,href:'/theaters/sturm-infinity-theater/',documentary:true})]});
 } else if(p.issue==='science') {
  html=splash({title:issue.name,description:'Collections, labs and research.',kicker:issue.kicker,art:'crystal',color:'paper',short:true});
  html+=spread({id:'collections',title:'Museum collections',kicker:'Behind the Glass',layout:'strip',panels:c.site.collections.map((item,i)=>panel({id:`science-${i}`,title:item.name,description:c.site.todo,art:item.art,color:item.documentary?'sepia':'paper',documentary:item.documentary}))});
  html+=`<div class="official-details">${external('Explore DMNS Digital Collections','https://dmns.netx.net/portals/public/#page/home')}</div>`;
 } else if(p.issue==='programs') {
  html=splash({title:issue.name,description:'Magical Winter Nights opens Nov. 25, 2026.',kicker:issue.kicker,art:'stars',color:'orange',short:true});
  html+=`<dmns-filter><div class="filter-controls" hidden aria-label="Filter programs"><button data-filter="all" aria-pressed="true">All</button><button data-filter="event" aria-pressed="false">Evening events</button><button data-filter="program" aria-pressed="false">Programs</button></div>${spread({id:'program-list',title:'Programs & Events',kicker:'Coming attractions',layout:'trio',flexible:true,panels:[exhibitionPanel(c.exhibitions.find(e=>e.category==='event')!,c,'program').replace('<dmns-panel ','<dmns-panel data-category="event" '),...c.events.map(e=>panel({id:e.id,title:e.name,description:e.description,kicker:'Program information',href:e.source}).replace('<dmns-panel ','<dmns-panel data-category="program" '))]})}<p data-filter-empty hidden>No programs match this filter.</p></dmns-filter>`;
 } else {
  const editorial=p.issue==='about'||p.issue==='support';
  html=splash({title:issue.name,description:p.issue==='about'?c.site.nonprofit:c.site.todo,kicker:issue.kicker,art:editorial?'none':'notebook',color:'paper',short:true,documentary:editorial});
  const links=p.issue==='support'?c.site.outbound.filter(l=>['Membership','Donate'].includes(l.label)):p.issue==='about'?c.site.footerLinks.filter(l=>['Careers','Contact Us','Financials'].includes(l.label)):[{label:'Onsite School Programs',url:'https://www.dmns.org/learn/onsite/'},{label:'Offsite School Programs',url:'https://www.dmns.org/learn/offsite/'},{label:'Virtual School Programs',url:'https://www.dmns.org/learn/virtual/'}];
  html+=`<section class="editorial" aria-labelledby="editorial-title"><h2 id="editorial-title">${escape(issue.name)}</h2><p class="todo">${escape(c.site.todo)}</p><div class="editorial-links">${links.map(l=>external(l.label,l.url)).join('')}</div></section>`;
 }
 return {title:issue.name,html,documentary:p.issue==='about'||p.issue==='support'};
}
