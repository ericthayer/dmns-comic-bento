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
  const prop: Record<string,string> = {
    digging:'<path d="M388 203L462 293M446 276L478 258L498 290L479 320L452 311Z" class="art-fill"/>',
    floating:'<path d="M403 115V143M389 129H417M110 277V297M100 287H120"/><ellipse cx="258" cy="315" rx="118" ry="24"/>',
    building:'<path class="art-fill" d="M360 246L413 230L450 258V309L400 326L360 296Z"/><path d="M360 246L400 273L450 258M400 273V326"/>',
    stethoscope:'<path d="M195 240Q201 296 245 290Q294 282 289 237M245 290V311Q299 345 331 307"/><circle class="paper-fill" cx="334" cy="297" r="16"/>',
    binoculars:'<path class="ink-fill" d="M172 182L177 231L224 232L231 182ZM252 175L257 223L311 221L312 173Z"/><circle class="paper-fill" cx="202" cy="214" r="20"/><circle class="paper-fill" cx="284" cy="206" r="20"/>',
    'hard-hat':'<path class="art-fill" d="M167 149Q177 78 237 83Q303 78 317 138L326 151L165 162Z"/><path d="M225 87L228 139M245 85L249 137M157 162L332 151"/>',
    leaves:'<path class="art-fill" d="M148 312L173 287L186 313L212 315L184 331ZM333 312L355 283L363 307L391 311L364 329Z"/>',
    loupe:'<circle class="paper-fill" cx="425" cy="160" r="38"/><circle cx="425" cy="160" r="29"/><path d="M399 188L375 218"/>',
  };
  return `<dmns-specimen data-pose="${escape(pose)}" aria-hidden="true" data-placeholder="true"><svg viewBox="0 0 600 400"><use href="#art-specimen"/>${prop[pose] ?? ''}</svg></dmns-specimen>`;
}
export function external(label: string, url: string, className = ''): string { return `<a class="${escape(className)}" href="${escape(url)}">${escape(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (official website)</span></a>`; }
export const arrow = '<span class="panel-arrow" aria-hidden="true">↗</span>';
