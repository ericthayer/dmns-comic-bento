# Browser support

Verified 2026-10-16, headless Playwright engines on macOS. Feature detection runs in the actual served page. Versions below are automation engine versions, not claims about installed consumer browsers.

| Engine | Version | Cross-document VT | Same-document VT | VT class | VT type selector | Scroll timelines | Container queries |
|---|---|---|---|---|---|---|---|
| Chromium | 156.0.8078.4 | Yes | Yes | Yes | Yes | Yes | Yes |
| Firefox | 157.0 | No — fallback used | Yes | Yes | Yes | No — fallback used | Yes |
| WebKit | 27.2 | Yes | Yes | Yes | Yes | Yes | Yes |

All three engines run a navigation, floor-switch, hall-detail, Still Panels, and axe smoke test. Chromium additionally runs all-route JavaScript-on and static-HTML audits, reading-order checks, native shared-panel transition checks, filters, beats, reduced motion, and the keyboard walkthrough.

All 26 pages are loaded with JavaScript disabled to verify static rendering and navigation. Separately, the same HTML is audited with application module responses suppressed, allowing only the axe auditor to execute; tests confirm that custom elements remain unupgraded. This avoids claiming that a JavaScript auditor can run while all script execution is disabled.

## Fallbacks

- No cross-document VT: native page navigation, with a short CSS entrance when motion is permitted.
- No same-document VT: layout updates run immediately; focus and announcement remain.
- No scroll timelines: complete art/captions; beat strips rest on the final frame.
- Reduced motion or Still Panels: no automatic transform, clip, stroke, or boil animations; camera uses a 150ms crossfade.
- No storage access: preferences work for the current page without throwing.

## Not verified

Physical Moto G Power, iPhone/iPad Safari, installed Edge, and assistive technology hardware were unavailable. Headless WebKit is not a substitute for a Safari/iOS device test. Lighthouse mobile uses emulated 4G and CPU slowdown, not a physical phone. Real visitor INP and production CDN behavior require field measurements after deployment. Manual screen-reader pronunciation and vestibular comfort require human review.

## API references

- [Cross-document View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)
- [Same-document View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
- [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
