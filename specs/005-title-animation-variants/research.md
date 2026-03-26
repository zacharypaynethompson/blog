# Research: Network Constellation Title Animation

**Date**: 2026-03-26
**Feature**: 005-title-animation-variants

## R1: Animation Approach — Spring Physics vs CSS Easing

**Decision**: Use a per-frame damped spring simulation via `requestAnimationFrame`, matching the hero physics banner's spring model. Each letter has position, velocity, and is pulled toward origin by a spring force with damping friction.

**Rationale**: The hero-physics.js uses the same model (spring toward rest position, velocity damping at 0.94). Reusing this approach ensures visual consistency between the hero banner and the title animation. Spring physics produces natural overshoot and wobble that CSS easing curves cannot replicate.

**Parameters** (tuned through iterative review):
- Spring constant: `0.015` (gentle pull)
- Damping: `0.90` (fast energy loss — subtle wobble, not bouncy)
- Scatter range: ±45px horizontal, ±30px vertical
- Stagger: 40ms between each letter's convergence start
- Initial delay: 200ms (letters fade in at scattered positions first)

**Alternatives considered**:
- CSS `cubic-bezier` ease-out: Smooth but lacks the organic wobble the owner wanted
- CSS spring approximation with overshoot bezier `(0.22, 1.2, 0.36, 1)`: Tested during iteration; too mechanical, doesn't match hero physics feel
- Canvas-based animation: Overkill for 8 characters; violates simplicity principle

## R2: Network Edge Rendering — SVG vs Canvas vs DOM

**Decision**: Use inline SVG `<line>` elements overlaid on the title container. An absolutely-positioned SVG element contains all edge lines, updated per frame via `setAttribute`.

**Rationale**: SVG lines are the lightest-weight way to draw connecting edges between DOM elements. They can reference the exact computed positions of letter elements via `getBoundingClientRect`, are theme-aware (stroke color from CSS custom property), and are trivially removable from the DOM after animation. No canvas 2D context needed for ~15 lines.

**Alternatives considered**:
- Canvas overlay: Requires pixel ratio handling, separate rendering pipeline; overkill for 15 lines
- CSS pseudo-elements/borders: Cannot draw arbitrary lines between elements
- D3.js: Project already uses D3 for the network graph page, but importing it for 15 SVG lines would violate minimal dependencies

## R3: Edge Lifecycle — When to Show and Hide

**Decision**: Edges are visible during the convergence phase with distance-based opacity (max 0.35). An edge fades out in ~100ms when both of its connected letters first arrive at their destination (within 3px), regardless of whether they've fully settled.

**Rationale**: The owner explicitly requested that lines disappear once both connected letters "first reach their final resting point, not completely settled." This means edges disappear while letters may still have residual wobble — creating a clean visual sequence where the network dissolves before the last micro-oscillations finish. Using `arrived` (first pass through 3px threshold) vs `settled` (velocity < 0.1 and position < 0.3px) gives the desired behavior.

**Edge connection rules**:
- All pairs with index distance ≤ 2 (adjacent and one-skip neighbors)
- Random ~15% of remaining pairs (adds visual richness without clutter)

## R4: Edge Case — Back/Forward Navigation

**Decision**: Animation replays on each page load. IntersectionObserver fires once per page load when the element enters the viewport.

**Rationale**: Eleventy generates static pages. Each navigation is a full page load, so the animation naturally replays. This is expected behavior for a subtle entrance effect.

## R5: Edge Case — Generalizable Text

**Decision**: The color split index is configurable via `data-accent-start` attribute (default: 4). The animation reads text content from the element and works with any string.

**Rationale**: Minimal effort for future-proofing. If the blog rebrands, only the HTML attribute and text content need to change.

## R6: SVG Cleanup

**Decision**: After all letters settle, the SVG overlay is removed from the DOM after a 200ms delay. The container's inline `position: relative` style is also reset.

**Rationale**: Leaving invisible SVG elements in the DOM is wasteful. The 200ms delay ensures any in-progress CSS transitions on the last edges complete before removal.
