export interface Notice { id: string; hall: string; start: string; end: string; closureStart: string; priority: number; text: string; shortText: string; source: string }
export interface HoursConfig { timezone: string; closedDates: readonly string[] }
export function localDate(date: Date, timezone = 'America/Denver'): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = (type: string): string => parts.find(p => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function visibleNotices(notices: readonly Notice[], day: string): Notice[] {
  return notices.filter(n => n.end >= day).sort((a, b) => a.priority - b.priority);
}
export function activeNotice(notices: readonly Notice[], day: string): Notice | undefined {
  return visibleNotices(notices, day).find(n => n.start <= day);
}
export function hoursState(date: Date, config: HoursConfig): { hours: string; status: string } {
  const day = localDate(date, config.timezone);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: config.timezone, weekday: 'long', hour: 'numeric', hourCycle: 'h23' }).formatToParts(date);
  const hour = Number(parts.find(p => p.type === 'hour')?.value);
  const friday = parts.some(p => p.type === 'weekday' && p.value === 'Friday');
  if (config.closedDates.includes(day.slice(5))) return { hours: 'Closed today', status: 'Closed' };
  // “Most Fridays” is deliberately not turned into an unverified extended opening.
  const status = hour >= 9 && hour < 17 ? 'Open now' : friday && hour >= 17 && hour < 21 ? 'Confirm evening hours' : 'Closed now';
  return { hours: friday ? '9 a.m.–5 p.m. · Most Fridays until 9 p.m.; confirm' : '9 a.m.–5 p.m.', status };
}
export function exhibitionStatus(item: { slug: string; opens: string | null; ends: string | null }, day: string): string {
  if (item.slug === 'pokemon-fossil-museum' && day < '2027-01-01') return 'Coming 2027';
  const pretty = (d: string): string => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${d}T12:00:00Z`));
  if (item.opens && item.opens > day) return `Opens ${pretty(item.opens)}`;
  if (item.ends && item.ends < day) return 'Exhibition ended';
  if (item.ends) return `Through ${pretty(item.ends)}`;
  return item.opens ? 'Now open' : 'See exhibition details';
}
