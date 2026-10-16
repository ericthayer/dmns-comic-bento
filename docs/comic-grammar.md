# Field Notes comic grammar

Whimsy lives in the panels; wayfinding stays plain. Museum names, navigation, hours, ticket links, notices, and form labels use literal language. This is an independent concept, not the museum's commerce or publishing system.

| Term | Meaning | Implementation |
|---|---|---|
| Book | The complete site | `src/lib/book.ts` |
| Issue | A top-level section | `IssueId` |
| Page | A route with complete HTML | `<dmns-page>` |
| Spread | A narrative band of panels | `<dmns-spread>` containing a labeled section |
| Panel | One cell, art, caption, optional link | `<dmns-panel>` |
| Beat | One held frame of a mini-strip | `<dmns-beat>` |
| Gutter | The black material separating panels | `--gutter`, CSS grid gap |
| Caption box | Museum narration and factual text | `<dmns-caption>`, build-time word spans |
| Speech balloon | An invented character's invitation or joke | `<dmns-balloon>` |
| SFX | A drawn visual sound word, at most one per spread | `<dmns-sfx>`; no sound or autoplay audio |
| Splash | The hero panel of a route | `.panel--splash`, `#splash` |

`cover`, `trio`, `mosaic`, `stair`, and `strip` are typed layouts. Container queries use 2, 6, and 12 tracks at phone, tablet, and desktop widths. Flexible layouts auto-place panels in DOM order. Fixed named areas preserve that same order. `scripts/check-reading-order.ts` compares rendered top-left order with DOM order for all routes at all three sizes.

A panel contains one real stretched link with a literal accessible name. Replay and Look closer are separate buttons above that link's hit area. Caption splitting is done at build time, with one complete accessible string and decorative, aria-hidden word spans.

Specimen is a new fictional guide, not a museum mascot. It never carries required information. Exactly one visible traveler owns the `specimen` transition name at a time; all other instances are unnamed. Art is original concept placeholder work with a visible Sketch stamp and `data-placeholder="true"`.

Egyptian Mummies, anthropology, and living-culture material use documentary panels: paper and sepia, plain captions, no character, balloon, SFX, highlighter, or boil. No jokes are attributed to real people, cultures, or human remains. The land acknowledgment stays in ordinary footer type and retains the wording retrieved from the official museum footer.

Pokémon Fossil Museum uses its name and supplied dates only. No third-party imagery, marks, characters, or silhouettes appear. Gems and Minerals remains accessible as a renovation page, with a red closure border and a “To be continued…” label.
