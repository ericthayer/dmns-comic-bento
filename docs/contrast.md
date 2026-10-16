# Contrast verification

Generated from tokens.css by npm run check. All text pairs used in light and dark themes require at least 4.5:1. Decorative art is excluded.

| Foreground | Background | Ratio | WCAG AA |
|---|---|---|---|
| `--ink-0` | `--paper` | 16.47:1 | Pass |
| `--ink-0` | `--paper-2` | 17.92:1 | Pass |
| `--paper-text` | `--ink-0` | 16.47:1 | Pass |
| `--ink-0` | `--ticket` | 9.89:1 | Pass |
| `--ink-0` | `--pop-green` | 9.18:1 | Pass |
| `--ink-0` | `--pop-blue` | 6.96:1 | Pass |
| `--ink-0` | `--pop-orange` | 8.25:1 | Pass |
| `--ink-0` | `--pop-magenta` | 5.56:1 | Pass |
| `--ink-0` | `--doc-sepia` | 10.08:1 | Pass |
| `--paper-text` | `--pop-red` | 5.70:1 | Pass |
| `--paper-text` | `--dark-paper` | 14.78:1 | Pass |
| `--paper-text` | `--dark-paper-2` | 13.20:1 | Pass |

The focus indicator uses a 3px gold outline with a black separation ring. The black ring remains visible on every pop fill; gold remains visible against black. Closure text uses paper text on red.
