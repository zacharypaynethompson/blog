# Tasks: Title Animation Variants

**Input**: Design documents from `/specs/005-title-animation-variants/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: All work on single branch `005-title-animation-variants`. Four animation variants implemented (pull-up, neural-resolve, gradient-descent, network), with "network" selected as the production default after side-by-side comparison.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Foundation

**Purpose**: Replace typewriter animation with new animation engine scaffold and shared styles.

- [x] T001 [US1] Update nav template data attributes in `src/_includes/partials/nav.njk` — replace typewriter attributes with `data-animation="network" data-accent-start="4"`
- [x] T002 [US1] Update script reference in `src/_includes/layouts/base.njk` — change `typewriter-logo.js` to `title-animation.js`
- [x] T003 [US1] Create `src/assets/js/title-animation.js` with animation engine: IIFE, `splitLetters()`, `resolveVariant()` (URL param override + data attribute default), `variants` map, `init()` with IntersectionObserver, reduced-motion check
- [x] T004 [US1] [US4] Replace typewriter CSS in `src/assets/css/style.css` with shared animation styles: `.title-letter`, `.title-char-normal`, `.title-char-accent`, reduced-motion media query
- [x] T005 [US5] Add reduced-motion CSS rule in `src/assets/css/style.css`
- [x] T006 Delete `src/assets/js/typewriter-logo.js`

**Checkpoint**: Foundation complete. Title renders with correct colors, variant system operational.

---

## Phase 2: Animation Variants

**Purpose**: Implement all four animation variants.

- [x] T007 [P] [US2] Add pull-up variant CSS (`@keyframes pullUp`, `.title-letter-wrap`, `.anim-pull-up`) and JS function in `src/assets/js/title-animation.js`
- [x] T008 [P] [US3] Add neural-resolve variant CSS (`.resolved` transition) and JS function in `src/assets/js/title-animation.js`
- [x] T009 [P] [US3] Add gradient-descent variant CSS (`@keyframes gradientDescend`, `.anim-gradient-descent`) and JS function in `src/assets/js/title-animation.js`
- [x] T010 [P] [US3] Add network variant CSS (`.network-node-pulse`) and JS function in `src/assets/js/title-animation.js` — constellation-inspired convergence with live SVG edge updates, distance-based opacity, and accelerated fade as letters settle

**Checkpoint**: All four variants functional, switchable via `?animation=` URL parameter.

---

## Phase 3: Selection & Refinement

**Purpose**: Owner reviews variants, selects favorite, and refines.

- [x] T011 [US1] Compare all variants side-by-side via URL parameter switching
- [x] T012 [US3] Refine network variant: remove accent glow pulse, accelerate edge fade using settled-ratio multiplier
- [x] T013 [US1] Set `data-animation="network"` as production default in `src/_includes/partials/nav.njk`

**Checkpoint**: Network variant selected and set as default.

---

## Phase 4: Polish & Validation

**Purpose**: Final verification and spec updates.

- [x] T014 Update spec.md status to Implemented, document network variant selection in assumptions
- [x] T015 Update plan.md, quickstart.md, and research.md to include network variant
- [x] T016 Rewrite tasks.md to reflect actual implementation
- [x] T017 Run `npm test && npm run lint` to confirm no regressions
- [x] T018 Verify network variant works in both light and dark mode
- [x] T019 Verify `prefers-reduced-motion: reduce` shows title instantly

**Checkpoint**: All specs current, all tests pass, implementation complete.

---

## Dependencies & Execution Order

- **Phase 1**: Foundation — no dependencies
- **Phase 2**: Variants — depends on Phase 1
- **Phase 3**: Selection — depends on Phase 2
- **Phase 4**: Polish — depends on Phase 3

## Implementation Summary

- **Files created**: `src/assets/js/title-animation.js`
- **Files deleted**: `src/assets/js/typewriter-logo.js`
- **Files modified**: `src/assets/css/style.css`, `src/_includes/partials/nav.njk`, `src/_includes/layouts/base.njk`
- **Variants available**: pull-up, neural-resolve, gradient-descent, network (default)
- **Preview**: `?animation=variant-name` URL parameter
- **Production default**: `network` (set via `data-animation` attribute in nav.njk)
