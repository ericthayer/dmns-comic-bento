# Motion specification

JavaScript orchestrates state and names; CSS performs animation. Navigation remains native multi-page navigation. No link interception, SPA router, animation library, canvas, WebGL, or media autoplay is used.

## Camera selection

| Comparison | Type |
|---|---|
| Same URL | `none` |
| Depth increases, including another issue | `zoom-in` |
| Depth decreases, including another issue | `zoom-out` |
| Equal depth, different issue | `new-issue` |
| Same issue and depth, sibling order increases | `turn-next` |
| Same issue and depth, sibling order decreases | `turn-prev` |
| Equal order | `none` |

`pageswap` saves the transfer by destination path, adds the type, and names only the participating source panel/title. `pagereveal` names the splash or the matching return panel. On return to Halls, the correct floor is restored before the destination snapshot. Names are cleared after `finished`, including BFCache cleanup. A new navigation skips a running transition. Cross-document focus remains browser-owned.

## Camera choreography

| Move | Old snapshot | New snapshot | Shared elements | Duration / easing | Reduced motion / Still Panels |
|---|---|---|---|---|---|
| Zoom in | Scale to 1.08, opacity to .3 | Fade in | Panel → splash, caption → h1, traveler when present | 640ms, cubic-bezier(.2,.8,.2,1) | 150ms opacity only |
| Zoom out | Fade away | Scale 1.08 → 1, fade in | Splash → original panel slot | 520ms, same ease | 150ms opacity only |
| Next page | Translate left 100%, rotate Y −6° | Enter from right | Traveler when both pages contain one | 560ms, same ease | 150ms opacity only |
| Previous page | Translate right 100%, rotate Y 6° | Enter from left | Traveler when both pages contain one | 560ms, same ease | 150ms opacity only |
| New issue | Down 12vh, opacity .3 | Down from −8vh, scale 1.02 → 1 | Traveler when present | 600ms, same ease | 150ms opacity only |
| Lean in | Existing panel geometry | Focused grid geometry | Temporary `panel-<id>` names | 480ms, same ease | Immediate layout update |
| Floor switch | Down 4vh and fade out | From −4vh and fade in | `floor-content` | 320ms, same ease | Immediate update |
| Filter | Art un-inks before removal | Remaining panels move | Temporary panel names | 240ms exit + 480ms geometry | Immediate update |

The masthead and info strip are separate transition participants with no animation. Camera movement uses at most one rotation axis; the largest angle is 6°. The largest root scale is 1.08. Documentary routes reduce the scale change by 20%. Shared-element geometry is browser-generated. No shake or flashing is used.

## Reveals and held frames

| Effect | Properties | Timing / range | Fallback |
|---|---|---|---|
| Gutters ink in | clip-path | Spread entry 0–40%, linear | Final state without scroll timelines |
| Panels drop | transform, opacity | Entry 20–80%, reading-order progression | Final state; 300ms entrance if cross-document transitions unavailable |
| Art inks in | stroke-dashoffset, opacity | Entry 50% → cover 30%, stepped | Fully inked art |
| Captions slap | clip-path | Entry 70% → cover 40%, stepped word sequence | Complete caption |
| Boil | visibility of three held SVG frames | 360ms, steps(3), in-view only | First frame, no automatic motion |
| Beat sequence | visibility | Three beats, 900ms per beat, one play | Final beat; manual Replay available |
| Un-ink exit | stroke-dashoffset, opacity | 240ms, steps(3) | Instant removal |

At most six panels boil at once. IntersectionObserver pauses off-screen art; document visibility pauses all boil and beats. Documentary art does not boil. Beat sequences never automatically loop and expose Pause during playback. All required text remains present as one accessible sentence.

Look closer and Escape preserve keyboard operation. After a same-document update, the changed region's heading receives focus and the single polite announcer reports the new state. Escape restores focus to Look closer. Floor tabs support Left/Right, Home/End, Enter and Space activation. Native navigation does not script focus.

`prefers-reduced-motion` or Still Panels removes all automatic transform, clip-path, stroke, and boil animation. Explicit Replay changes held frames only. Storage is optional and guarded. Reduced transparency removes overlays; increased contrast removes off-register effects and uses 4px linework.
