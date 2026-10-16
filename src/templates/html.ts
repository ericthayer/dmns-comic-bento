export function escape(value: string | number): string { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ?? c)); }
export function jsonScript(value: unknown): string { return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'); }
export function caption(text: string, tag: 'h1'|'h2'|'h3', id: string, extra = ''): string {
  const seed=[...id].reduce((n,c)=>n+c.charCodeAt(0),0);
  return `<${tag} id="${escape(id)}" class="knockout ${escape(extra)}" tabindex="-1"><dmns-caption><span class="sr-only">${escape(text)}</span><span aria-hidden="true" class="caption-words">${text.split(' ').map((word,i)=>`<span class="caption-word" style="--word:${i};--tilt:${((seed+i)%3-1)*.5}deg;--nudge:${(seed+i)%3-1}px">${escape(word)} </span>`).join('')}</span></dmns-caption></${tag}>`;
}
export function art(name: string, extra = ''): string {
  if(name==='none') return '';
  return `<figure class="panel__art ${escape(extra)}" aria-hidden="true" data-placeholder="true"><svg viewBox="0 0 600 400" focusable="false"><use href="#art-${escape(name)}"/></svg><span class="sketch-stamp">Sketch</span></figure>`;
}
export function specimen(pose = 'floating'): string {
  if (pose==='none') return '';
  const prop:Record<string,string>={digging:'⤵',floating:'✧',building:'□',stethoscope:'♡',binoculars:'◎','hard-hat':'⌒',leaves:'⌁',loupe:'⌕'};
  return `<dmns-specimen data-pose="${escape(pose)}" aria-hidden="true" data-placeholder="true"><svg viewBox="0 0 600 400"><use href="#art-specimen"/></svg><span class="specimen-prop">${prop[pose]??''}</span></dmns-specimen>`;
}
export function external(label: string, url: string, className = ''): string { return `<a class="${escape(className)}" href="${escape(url)}">${escape(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (official website)</span></a>`; }
export const arrow = '<span class="panel-arrow" aria-hidden="true">↗</span>';
