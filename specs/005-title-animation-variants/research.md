# Research: Title Animation Variants

**Date**: 2026-03-26
**Feature**: 005-title-animation-variants

## R1: Animation Variant Switching Mechanism

**Decision**: Use a URL query parameter (`?animation=variant-name`) for preview, with a data attribute on the nav logo (`data-animation="variant-name"`) as the persistent default. The URL parameter overrides the data attribute when present.

**Rationale**: URL parameters are zero-infrastructure — no build step changes, no config files to manage. The blog owner can bookmark different variants side-by-side. The data attribute in the template serves as the production default and is a single-line change to switch.

**Alternatives considered**:
- `site.json` config field: Requires rebuild to preview each change; slower iteration
- LocalStorage toggle: Not shareable, harder to compare side-by-side
- Separate preview page: Extra template to maintain, doesn't show the animation in its real navigation context

## R2: Pull-From-Behind Letter Animation Technique

**Decision**: Use CSS `transform: translateY()` with `opacity` and `overflow: hidden` on a wrapper per letter. Each letter starts translated downward (below a clip boundary) and animates upward into place with a cubic-bezier easing that simulates being "pulled" with slight overshoot.

**Rationale**: Pure CSS transforms are GPU-accelerated, performant, and don't require canvas or SVG. The `overflow: hidden` on each letter's wrapper creates the "behind a surface" occlusion effect. Stagger is achieved via incremental `animation-delay` per letter.

**Alternatives considered**:
- `clip-path` reveal: More complex, less browser-performant, and clip-path animations can be janky
- Canvas rendering: Overkill for 8 characters; adds complexity against the constitution's simplicity principle
- 3D perspective transforms (`rotateX`): Visually interesting but can cause text rendering artifacts and is harder to tune for subtlety

## R3: AI/ML-Inspired Animation Concepts

**Decision**: Implement two AI/ML-inspired variants:

1. **"Neural Resolve"** — Each letter starts as a rapidly cycling random character (like a slot machine / matrix decode) that "resolves" to the correct character after a short duration. Letters resolve left-to-right with stagger. This evokes the concept of a neural network converging on a prediction — going from noise to signal.

2. **"Gradient Descent"** — Each letter starts at a random position scattered around the nav area and simultaneously converges to its correct final position following a smooth easing curve. The motion path has slight wobble (like noisy gradient descent steps). Letters fade in from 0 opacity as they move. This evokes optimization/convergence.

**Rationale**: Both concepts are immediately recognizable to an ML audience while remaining visually appealing to anyone. The "neural resolve" effect is particularly effective because it creates anticipation and the text scramble is visually engaging. "Gradient descent" is a playful literal interpretation that reads as dynamic and modern. Both are achievable with DOM manipulation and CSS, no canvas needed.

**Alternatives considered**:
- Neural network connection lines between letters (SVG): Adds SVG dependency, hard to make look clean at small nav size, complex to implement
- Attention heatmap glow: Subtle to the point of being invisible at nav logo size
- Backpropagation wave: Too abstract to communicate visually in < 2 seconds

## R4: Third Complementary Variant

**Decision**: The "pull from behind" variant is the third (alongside the two AI/ML variants), giving exactly 3 total. This satisfies FR-001 without adding unnecessary scope.

**Rationale**: The spec requires "at least 3 distinct variants including one pull-from-behind and at least one AI/ML-inspired." Two AI/ML variants + one pull-from-behind = 3. Adding a fourth would be scope creep per the constitution's MVP mindset.

## R5: Architecture — Single File vs Module Per Variant

**Decision**: Single JS file (`title-animation.js`) replacing `typewriter-logo.js`. Each variant is a plain function registered in a variants map object within the file. No module system, no dynamic imports.

**Rationale**: 8 characters of animation logic is inherently small. Three variant functions + shared setup (letter splitting, observer, config reading) will be well under 200 lines. A single file avoids over-engineering per the constitution's simplicity principle. The variants map makes adding/removing variants trivial.

**Alternatives considered**:
- Separate file per variant with dynamic import: Unnecessary complexity for ~50 lines per variant
- ES module with barrel export: The project doesn't use ES modules for its JS assets currently; introducing a build step would violate minimal dependencies

## R6: CSS Strategy

**Decision**: Replace the typewriter CSS block (lines 926-969 in style.css) with new animation CSS. Use CSS custom properties for timing values. Each variant gets a small set of `@keyframes` rules. Shared styles (letter spans, color classes) remain common.

**Rationale**: Keeps all animation styles co-located. CSS custom properties allow timing tweaks without JS changes. The existing `tw-char-normal` and `tw-char-accent` class pattern works well and should be preserved (or renamed to be animation-agnostic like `title-char-normal` / `title-char-accent`).

## R7: Edge Case — Back/Forward Navigation

**Decision**: Animation replays on each page load. The IntersectionObserver pattern from the current typewriter already handles this correctly — it fires once per page load when the element enters the viewport.

**Rationale**: For an SPA this would matter, but Eleventy generates static pages. Each navigation is a full page load, so the animation naturally replays. This is the expected behavior for a site title animation — it's a quick, subtle entrance effect.

## R8: Edge Case — Generalizable Text

**Decision**: The color-split logic will use a configurable split index (default: 4 for "zacs"/"blog") rather than hardcoding the string "zacsblog". The animation functions themselves will work on any text content from the element.

**Rationale**: Minimal extra effort for future-proofing. The split index in a data attribute (`data-accent-start="4"`) keeps the animation text-agnostic while maintaining the specific brand coloring.
