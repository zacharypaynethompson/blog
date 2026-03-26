# Tasks: Network Constellation Title Animation

**Input**: Design documents from `/specs/005-title-animation-variants/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Status**: All tasks complete.

---

## Phase 1: Foundation

**Purpose**: Remove typewriter animation, set up letter splitting and shared styles.

- [x] T001 Update nav template in `src/_includes/partials/nav.njk` — replace typewriter data attributes with `data-animation data-accent-start="4"`
- [x] T002 Update script reference in `src/_includes/layouts/base.njk` — `typewriter-logo.js` → `title-animation.js`
- [x] T003 Replace typewriter CSS in `src/assets/css/style.css` with `.title-letter`, `.title-char-normal`, `.title-char-accent`, and `prefers-reduced-motion` rule
- [x] T004 Delete `src/assets/js/typewriter-logo.js`

---

## Phase 2: Animation Implementation

**Purpose**: Build the constellation network animation in a single JS file.

- [x] T005 Create `src/assets/js/title-animation.js` with IIFE, `splitLetters()` (text → spans with color classes + aria-label), `animate()`, and `init()` (IntersectionObserver, reduced-motion check)
- [x] T006 Implement spring physics simulation: per-letter state (x, y, vx, vy), spring constant 0.015, damping 0.90, stagger 40ms/letter, 200ms initial delay
- [x] T007 Implement SVG edge overlay: create `<line>` elements between adjacent pairs (distance ≤ 2) and ~15% random non-adjacent pairs, stroke from `--color-accent`, width 1.2px, distance-based opacity (max 0.35, range 80px)
- [x] T008 Implement arrival detection: mark letter `arrived` when within 3px of origin; fade edge in 100ms when both endpoints arrived
- [x] T009 Implement settle detection: snap letter to final position when within 0.3px and velocity < 0.1; remove SVG overlay 200ms after all letters settle

---

## Phase 3: Refinement

**Purpose**: Tuning based on visual review.

- [x] T010 Tune damping from 0.94 → 0.92 → 0.90 for faster energy dissipation
- [x] T011 Add arrival threshold (3px) separate from settle threshold (0.3px) so edges fade before wobble fully stops
- [x] T012 Increase edge stroke width to 1.2px and max opacity to 0.35 for visibility given fast fadeout

---

## Phase 4: Validation

- [x] T013 Verify animation plays correctly on page load with spring wobble and edge connections
- [x] T014 Verify `prefers-reduced-motion: reduce` skips animation entirely
- [x] T015 Verify light/dark mode color correctness
- [x] T016 Verify SVG overlay is fully removed from DOM after animation completes
- [x] T017 Run `npm run build` — confirm clean build with no errors

---

## Implementation Summary

- **Created**: `src/assets/js/title-animation.js` (~200 lines)
- **Deleted**: `src/assets/js/typewriter-logo.js`
- **Modified**: `src/assets/css/style.css`, `src/_includes/partials/nav.njk`, `src/_includes/layouts/base.njk`
