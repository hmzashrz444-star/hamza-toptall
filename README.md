# Hamza Bin Shiraz - Toptal Interview Presentation

An editable, dependency-free 16:9 HTML presentation built one approved slide at a time.

## Status

| Item | State |
|---|---|
| Slide 1 - cover | Approved and locked |
| Slide 2 - background and credentials | Approved and locked |
| Slide 3 - selected projects | Approved and locked |
| Slide 4 - Lucky Backyards overview | Approved and locked |
| Slides 5 to 8 - Lucky Backyards deep dive | Complete |
| Slides 9 to 13 - Copperfield deep dive | Complete |
| Slide 14 - selected work | Complete |
| Slide 15 - motion and Guided Visuals | Complete |
| Slide 16 - closing | Complete |
| Runtime dependencies | None |

## Fast edit route

For future work, read only `AGENTS.md` and `docs/NEXT.md`. Do not rescan assets or completed slides. Navigation is shared, and validation discovers new slide files automatically.

## Run locally

```bash
npm run dev
```

Then open `http://127.0.0.1:4173`. To review one slide immediately, use `http://127.0.0.1:4173/?slide=N`. The project also works by opening `index.html` directly.

Validate structure and JavaScript with:

```bash
npm run check
```

For a bounded edit, update only the requested slide markup and isolated stylesheet. Navigation is handled automatically by `src/scripts/slide-route.js`.

## Current experience

- Cinematic HBS load sequence with a skip control
- Bespoke motion choreography for every cover element
- Responsive pointer lighting and portrait depth
- Magnetic primary control with the stable native system cursor
- Live interaction-coordinate readout
- Keyboard, scroll and button navigation fallbacks
- Reduced-motion support
- No runtime dependencies, external fonts or network-loaded assets

## Structure

```text
.
├── index.html
├── AGENTS.md                       # Low-context editing contract
├── package.json
├── scripts/validate-project.mjs   # Structure and lock validation
├── src/
│   ├── scripts/presentation.js
│   └── styles/presentation.css
├── assets/
│   ├── brand/
│   ├── portraits/
│   └── evidence/
└── docs/
    ├── PROJECT-PLAN.md
    ├── ASSET-MANIFEST.md
    ├── MOTION-SYSTEM.md
    ├── PERFORMANCE-NOTES.md
    ├── NEXT.md                       # Only required handoff document
    ├── PROJECT-STATE.md
    ├── SLIDE-BUILD-GUIDE.md
    └── QA-CHECKLIST.md
```

## Controls

- Pointer movement - lighting, coordinate readout and portrait parallax
- Hover - kinetic type, identity mark, portrait system, chapters and magnetic CTA
- Right/Down/Page Down/Enter/Space - advance
- Left/Up/Page Up/Home - go back
- Skip intro - immediately transitions into the cover choreography

## Production rule

The complete 16-slide deck is locked. Bounded revisions should preserve the existing visual system, navigation, verified claims and project ownership boundaries documented in `docs/PROJECT-PLAN.md` and `docs/ASSET-MANIFEST.md`.
