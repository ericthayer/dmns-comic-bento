# Illustration handoff

All current art is original SVG placeholder work. Every scene carries `data-placeholder="true"` and a visible Sketch stamp. These are neither photographs nor representations of specific DMNS collection objects. Replace source files one-for-one, retain the 600 × 400 viewBox, normalized `pathLength="1"`, theme variables, and three held-frame groups. No raster imagery or third-party intellectual property is needed.

## Drawing rules

Use warm notebook paper, flat fills, a single 3px ink line, round caps, slightly irregular curves, and open shapes. Keep anatomical recognition ahead of humor. Offset flat fills 2–4px beneath linework. Optional halftone uses a single color. No gradients, rendered shading, or smooth character tweening. Provide three subtly different ink frames per idle pose; major actions may use 4–6 discrete poses at 83ms per frame.

| Source | Subject / replacement scene | Size / placement | Pop family | Needed poses |
|---|---|---|---|---|
| `notebook.svg` | Open field notebook | 600×400, Cover and learning | Green / paper | Open, page curled, ink guide emerging |
| `dragon.svg` | Invented friendly dragon | 600×400, Cover and Mythic Creatures | Magenta / paper / green | Rest, look, chomp; no borrowed characters |
| `unicorn.svg` | Invented unicorn | 600×400, Mythic beat 2 | Paper / green | Step, head turn, rest |
| `mermaid.svg` | Invented mermaid | 600×400, Mythic beat 3 | Paper / green | Float, wave, rest |
| `stegosaurus.svg` | Recognizable stegosaurus | 600×400, Halls and Prehistoric Journey | Green | Low stance, step, rest; accurate plates and tail spikes |
| `space.svg` | Saturn with rings and field marks | 600×400, Space Odyssey and Theaters | Blue / paper | Three line frames; no invented factual labels |
| `blocks.svg` | Building blocks | 600×400, Discovery Zone | Orange | Stack, settle, rest |
| `heart.svg` | Stylized heart and trace | 600×400, Expedition Health | Magenta | Three held ink frames, no medical claims |
| `bird.svg` | Generic bird and leaf | 600×400, Wildlife and zoology | Green / paper | Perch, look, rest |
| `document.svg` | Restrained archival sheet | 600×400, Egyptian Mummies / anthropology | Sepia only | Static; no figure or remains depicted |
| `crystal.svg` | Generic mineral forms | 600×400, collections / Konovalenko | Blue / paper; sepia on documentary panels | Three ink frames, static in documentary use |
| `construction.svg` | Unfinished mineral sketch and barrier | 600×400, Gems and Minerals | Pencil blue / paper | Incomplete fill; static closure sign |
| `leaf.svg` | Generic leaf and field marks | 600×400, Nature Play | Green | Three held poses |
| `landscape.svg` | Generic landscape study | 600×400, Changing Landscapes | Sepia only | Static; not a portrayal of a named cultural site |
| `stars.svg` | Abstract stars | 600×400, Winter Nights / Laser Shows | Blue / paper | Held line frames, no luminance flashes |
| `theater.svg` | Screen and seats | 600×400, Sturm Infinity Theater | Blue | Static or three line frames |
| `museum.svg` | Generic building study | 600×400, Visit / Wing | Green / paper | Three line frames; not an architectural claim |
| `specimen.svg` | Invented ink creature with goggles | 600×400, displayed around 100–180px wide | Ink, paper, context accent | See pose list below |

## Specimen prop / pose overlays

Overlays are inline SVG in `src/templates/html.ts`, using the same 600×400 coordinate system. Replace together with the body; retain `data-pose` values.

| Pose | Context | Final-art direction |
|---|---|---|
| `digging` | Prehistoric Journey | Spade, bent digging stance |
| `floating` | Space Odyssey / cover | Floating limbs, small orbital marks |
| `building` | Discovery Zone | Holding and stacking a block |
| `stethoscope` | Expedition Health | Listening with a stethoscope |
| `binoculars` | Wildlife Halls | Looking through drawn binoculars |
| `loupe` | Collections / Mythic beat | Holding a magnifying loupe |
| `hard-hat` | Gems and Minerals | Construction hat and unfinished field sketch |
| `leaves` | Nature Play | Stepping into leaves |

Specimen must be absent from Egyptian Mummies and anthropology pages. The current Konovalenko treatment is also documentary to avoid caricature of Russian folklife. Do not draw words or jokes for real people or cultures. No Pokémon art, marks, silhouettes, or characters may be added.

## Panels needing content and art approval

All 18 scene sources above, the pose overlays, and all repeated hall-story panels require museum/illustrator review. `content/halls.json` contains three explicitly unfinished story notes per hall. The media manifest records source, alt text, credit, and placeholder status. Decorative SVG is hidden from assistive technology; any replacement conveying information needs an appropriate title, description, and visible figcaption. No collections photography has been supplied.
