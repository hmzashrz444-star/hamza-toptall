# Performance Notes

Slide 1 is deliberately dependency-free and optimized for reliable screen sharing.

## Rendering decisions

- The native cursor is retained; no duplicate cursor layer is rendered.
- Pointer lighting and portrait depth use transform-only movement.
- Pointer updates are limited to one animation frame at a time.
- Coordinate text updates are throttled rather than rewritten every frame.
- The slide is isolated with CSS containment.
- The background uses one SVG path instead of several competing systems.
- Continuous orbit rotation, backdrop blur and animated image blur were removed.
- Typography animation uses transforms, opacity and clipping rather than blur filters.
- The portrait keeps one static drop shadow and avoids animated color filters.

## Runtime profile

- Runtime dependencies: none
- External font requests: none
- External image requests: none
- JavaScript source: under 10 KB before compression
- CSS source: under 30 KB before compression
- Navigation remains functional without pointer input
- One ordered navigator now controls every slide
- Standard slides need no separate navigation file
- Transitions use a short 180 ms fade with no overlapping slide layers

## Scaling rule

Future slides should reuse the existing tokens, navigation and interaction utilities. Add only slide-specific markup and motion; do not introduce another global background, cursor or animation engine.
