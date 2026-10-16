# Changelog

## 0.1.0 — 2026-10-16

### Added
- Twenty-six static, accessible routes rendered from validated JSON content, with real URLs and browser-owned history.
- Field Notes bento layouts, self-hosted Archivo and Jost, original SVG concept sketches, and quiet documentary pages.
- Native cross-document zooms, page turns, issue changes, and temporary shared panel/title names.
- Scroll-driven ink reveals, three-frame boil, one-shot beats, lean-in, floor tabs, and exhibition/program filters.
- Specimen traveler, Still Panels, theme preference, reduced-motion fallbacks, and guarded optional storage.
- Budget, contrast, link, reading-order, unit, axe, browser, and keyboard checks; Netlify static build configuration.

### Content
- Museum facts and exhibition dates are retained from the supplied brief; missing content is visibly marked for DMNS review.
- Mythic Creatures uses its opening date to select “Opens” or “Now open.”
- Prehistoric Journey's upcoming cleaning notice is dated; Gems and Minerals has a renovation page.
- Friday evening hours retain “most Fridays” and do not claim an unconfirmed open state.

### Implementation checkpoints
1. Content and book model: route resolver, layouts, dates, loaders, and motion preference unit tests.
2. Static comic: full route HTML, bento grids, fonts, and placeholder SVG.
3. Scroll reveals: CSS feature-gated gutters, panels, art, and captions.
4. Boil and beats: visibility limits, one-shot playback, and pause/replay controls.
5. Cross-document camera: native pageswap/pagereveal, browser history, and name cleanup.
6. Same-document changes: lean-in, floors, filters, focus, and announcements.
7. Traveler: unique active transition name and context props.
8. Verification: see docs/verification.md for actual results and limitations. These checkpoints describe implementation order, not separate historical green check runs.
