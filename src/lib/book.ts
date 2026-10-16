export type IssueId = 'cover' | 'halls' | 'special' | 'theaters' | 'visit' | 'programs' | 'learn' | 'science' | 'about' | 'support';
export type Depth = 0 | 1 | 2;
export interface PagePosition { readonly path: string; readonly issue: IssueId; readonly depth: Depth; readonly order: number }
export type CameraMove = 'zoom-in' | 'zoom-out' | 'turn-next' | 'turn-prev' | 'new-issue' | 'none';
export function resolveCameraMove(from: PagePosition, to: PagePosition): CameraMove {
  if (from.path === to.path) return 'none';
  if (from.depth !== to.depth) return to.depth > from.depth ? 'zoom-in' : 'zoom-out';
  if (from.issue !== to.issue) return 'new-issue';
  if (from.order === to.order) return 'none';
  return to.order > from.order ? 'turn-next' : 'turn-prev';
}
export const issues: ReadonlyArray<{ id: IssueId; path: string; name: string; kicker: string }> = [
  { id: 'cover', path: '/', name: 'Denver Museum of Nature & Science', kicker: 'The Cover' },
  { id: 'halls', path: '/halls/', name: 'Halls', kicker: 'Issue: The Halls' },
  { id: 'special', path: '/special-exhibitions/', name: 'Special Exhibitions', kicker: 'Special Edition' },
  { id: 'theaters', path: '/theaters/', name: 'Theaters', kicker: 'Now Screening' },
  { id: 'visit', path: '/visit/', name: 'Plan Your Visit', kicker: 'Getting Here' },
  { id: 'programs', path: '/programs/', name: 'Programs & Events', kicker: 'Coming Attractions' },
  { id: 'learn', path: '/learn/', name: 'School Programs', kicker: 'Field Trips' },
  { id: 'science', path: '/science/', name: 'Science & Collections', kicker: 'Behind the Glass' },
  { id: 'about', path: '/about/', name: 'About the Museum', kicker: 'About' },
  { id: 'support', path: '/support/', name: 'Support the Museum', kicker: 'Support' },
];
export function normalizePath(url: string): string {
  const path = new URL(url, 'https://concept.invalid').pathname;
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
}
