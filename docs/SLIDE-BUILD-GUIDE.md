# Fast Slide-Build Guide

## Add one approved slide

1. Add one semantic section after the locked Slide 1 section in `index.html`.
2. Add `src/styles/slides/slide-XX.css` and link it after `presentation.css`.
3. Add `src/scripts/slides/slide-XX.js` only if CSS cannot provide the required interaction.
4. Store only that slide’s media in `assets/slides/XX/`.
5. Use verified content from `PROJECT-PLAN.md` and `ASSET-MANIFEST.md`.
6. Run `npm run check`, preview at 16:9, update `PROJECT-STATE.md`, and stop.

## Required markup contract

```html
<section class="slide slide--XX" id="slide-XX" aria-labelledby="slide-XX-title">
  <h2 id="slide-XX-title">Visible slide title</h2>
</section>
```

## Reuse

- Colors and spacing: existing CSS custom properties
- Canvas: `.deck` and `.slide`
- Counter style: `.counter`
- Navigation behavior: existing keyboard and wheel logic
- Motion curve: `cubic-bezier(.16,.82,.26,1)`
- Accessibility: visible focus, semantic heading, reduced-motion fallback

## Avoid

- Editing locked Slide 1 selectors
- Global animation libraries or frameworks
- New cursor layers, continuous background loops or heavy blur
- Duplicating evidence into several folders
- Loading remote fonts or runtime assets
- Building more than the approved slide
