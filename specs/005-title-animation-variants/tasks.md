# Tasks: Title Animation Variants

**Input**: Design documents from `/specs/005-title-animation-variants/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are split into a shared foundation phase and then one branch per animation variant. Each variant is implemented on its own feature branch from `005-title-animation-variants` so all three can be served on different ports for side-by-side comparison.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Shared Foundation (on `005-title-animation-variants`)

**Purpose**: Build the animation engine scaffold and shared CSS that all three variants need. This is committed on the base feature branch before creating variant sub-branches.

- [ ] T001 [US1] Update nav template data attributes in `src/_includes/partials/nav.njk` — replace `data-typewriter data-tw-min="60" data-tw-max="150" data-tw-cursor="done"` with `data-animation="pull-up" data-accent-start="4"`, keep class `nav-logo` but remove `typewriter-title`
- [ ] T002 [US1] Update script reference in `src/_includes/layouts/base.njk` — change `typewriter-logo.js` to `title-animation.js`
- [ ] T003 [US1] Create `src/assets/js/title-animation.js` with shared animation engine scaffold:
  - IIFE wrapper matching project pattern
  - `splitLetters(el, accentStart)` — reads text, clears element, creates `<span>` per character with `title-char-normal` or `title-char-accent` class, sets `aria-label`
  - `resolveVariant(el)` — reads `?animation=` URL param (override) or `data-animation` attribute (default), returns variant name
  - `variants` map object — initially empty, to be filled per variant branch
  - `init()` — querySelectorAll `[data-animation]`, IntersectionObserver (threshold 0.1), on intersect: splitLetters → resolveVariant → call variant function, handle `prefers-reduced-motion` (skip animation, show final state immediately)
  - DOMContentLoaded / readyState guard (same pattern as current typewriter-logo.js)
- [ ] T004 [US1] [US4] Replace typewriter CSS in `src/assets/css/style.css` (lines 926-969) with shared animation styles:
  - Remove all `.typewriter-title`, `.tw-cursor`, `.tw-char-*`, `@keyframes tw-blink` rules
  - Add `.title-char-normal { color: var(--color-text); }` and `.title-char-accent { color: var(--color-accent); }` (preserves brand color split, works in both light/dark)
  - Update `.nav-logo.typewriter-title` selector to `.nav-logo` (remove typewriter-title dependency)
  - Add `.title-letter` base styles (display: inline-block to enable transforms)
- [ ] T005 [US5] Add reduced-motion CSS rule: `@media (prefers-reduced-motion: reduce) { .title-letter { animation: none !important; opacity: 1 !important; transform: none !important; } }`
- [ ] T006 Delete `src/assets/js/typewriter-logo.js`
- [ ] T007 Verify site builds and title renders statically (no animation yet since variant map is empty) with `npm run build && npm run lint`

**Checkpoint**: Foundation committed on `005-title-animation-variants`. Title renders with correct colors but no animation. Ready to branch.

---

## Phase 2: Variant Branch — Pull-Up (branch `005a-pull-up`)

**Goal**: Implement the "pull from behind" animation where each letter rises from below a clipped surface.

**Independent Test**: Run `npm run dev -- --port=8081`, load `http://localhost:8081/`, verify letters rise upward with stagger.

### Implementation

- [ ] T008 [P] [US2] Add pull-up `@keyframes` and styles in `src/assets/css/style.css`:
  - `.title-letter-wrap` — `display: inline-block; overflow: hidden; vertical-align: bottom;` (clip container per letter)
  - `@keyframes pullUp { from { transform: translateY(110%); opacity: 0; } 60% { opacity: 1; } to { transform: translateY(0); opacity: 1; } }` with cubic-bezier overshoot easing
  - `.title-letter.anim-pull-up { animation: pullUp 0.5s cubic-bezier(0.22, 1.2, 0.36, 1) forwards; }` with CSS custom property `--stagger` for delay
- [ ] T009 [P] [US2] Add `pullUp` variant function in `src/assets/js/title-animation.js`:
  - For each letter span: wrap in a `.title-letter-wrap` div, add `.title-letter` class, set initial `opacity: 0; transform: translateY(110%)`, then add `.anim-pull-up` class with `animation-delay` = index * 80ms
  - Total duration for 8 letters: ~0.5s animation + 7 × 80ms stagger = ~1.06s (under 2s limit)
  - Register in `variants['pull-up']`
- [ ] T010 [US2] Verify pull-up animation: `npm run dev -- --port=8081` — confirm letters rise from below with stagger, final state matches original title styling, accent colors correct

**Checkpoint**: Pull-Up variant fully functional on port 8081

---

## Phase 3: Variant Branch — Neural Resolve (branch `005b-neural-resolve`)

**Goal**: Implement the "neural resolve" animation where letters cycle through random characters before locking in.

**Independent Test**: Run `npm run dev -- --port=8082`, load `http://localhost:8082/`, verify characters scramble then resolve left-to-right.

### Implementation

- [ ] T011 [P] [US3] Add neural-resolve styles in `src/assets/css/style.css`:
  - `.title-letter.anim-neural-resolve { opacity: 1; }` (letters visible immediately, content changes via JS)
  - `.title-letter.resolved { transition: color 0.15s ease; }` (subtle color settle on resolve)
- [ ] T012 [P] [US3] Add `neuralResolve` variant function in `src/assets/js/title-animation.js`:
  - Character set: lowercase alphanumeric `abcdefghijklmnopqrstuvwxyz0123456789`
  - For each letter: start a `setInterval` (every 50ms) that swaps textContent to a random character from the set
  - After a stagger delay (index * 150ms), clear the interval and set textContent to the correct character, add `.resolved` class
  - Total duration: 7 × 150ms stagger + last letter scramble time = ~1.2s (under 2s limit)
  - Register in `variants['neural-resolve']`
- [ ] T013 [US3] Verify neural-resolve animation: `npm run dev -- --port=8082` — confirm characters scramble with random text then lock in left-to-right, final state correct

**Checkpoint**: Neural Resolve variant fully functional on port 8082

---

## Phase 4: Variant Branch — Gradient Descent (branch `005c-gradient-descent`)

**Goal**: Implement the "gradient descent" animation where letters converge from scattered positions.

**Independent Test**: Run `npm run dev -- --port=8083`, load `http://localhost:8083/`, verify letters drift in from random positions with wobble.

### Implementation

- [ ] T014 [P] [US3] Add gradient-descent keyframes in `src/assets/css/style.css`:
  - `.title-letter.anim-gradient-descent { animation: gradientDescend 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; }` with CSS custom properties `--start-x`, `--start-y` for initial offset
  - `@keyframes gradientDescend { 0% { transform: translate(var(--start-x), var(--start-y)); opacity: 0; } 30% { opacity: 0.7; } 100% { transform: translate(0, 0); opacity: 1; } }`
- [ ] T015 [P] [US3] Add `gradientDescent` variant function in `src/assets/js/title-animation.js`:
  - For each letter: generate random `--start-x` (range: -40px to 40px) and `--start-y` (range: -25px to 25px) as CSS custom properties on the element
  - Set initial `opacity: 0`, then add `.anim-gradient-descent` class with `animation-delay` = index * 50ms + random(0-80ms) jitter (simulates noisy gradient steps)
  - Total duration: ~1s animation + stagger ≈ 1.4s (under 2s limit)
  - Register in `variants['gradient-descent']`
- [ ] T016 [US3] Verify gradient-descent animation: `npm run dev -- --port=8083` — confirm letters converge from scattered positions with slight wobble/jitter, final state correct

**Checkpoint**: Gradient Descent variant fully functional on port 8083

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: After reviewing all three variants side-by-side, merge chosen variant(s) back and clean up.

- [ ] T017 Run `npm test && npm run lint` across all variant branches to confirm no regressions
- [ ] T018 Verify all three variants respect `prefers-reduced-motion: reduce` (title appears instantly, no animation)
- [ ] T019 Verify all three variants work in both light and dark mode (toggle theme, check accent colors)
- [ ] T020 After owner selects preferred variant, merge that branch into `005-title-animation-variants` and set `data-animation` attribute in `nav.njk` to the chosen variant name

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundation)**: No dependencies — starts on `005-title-animation-variants`
- **Phases 2, 3, 4 (Variants)**: Each depends on Phase 1 completion. All three are **fully independent** of each other and can run in parallel on separate branches.
- **Phase 5 (Polish)**: Depends on all variant branches being available for comparison

### Variant Branch Strategy

```
005-title-animation-variants (foundation)
  ├── 005a-pull-up          (T008-T010) → port 8081
  ├── 005b-neural-resolve   (T011-T013) → port 8082
  └── 005c-gradient-descent (T014-T016) → port 8083
```

Each sub-branch is created from `005-title-animation-variants` after Phase 1 is committed.

### Parallel Opportunities

- **T008 + T011 + T014**: All variant CSS tasks can run in parallel (separate branches, no conflicts)
- **T009 + T012 + T015**: All variant JS tasks can run in parallel (separate branches, no conflicts)
- **All three variant branches** can be implemented simultaneously by three subagents

### Parallel Execution: Three Subagents

```
Agent 1 (005a-pull-up):        T008 → T009 → T010
Agent 2 (005b-neural-resolve): T011 → T012 → T013
Agent 3 (005c-gradient-descent): T014 → T015 → T016
```

All three launch after Phase 1 checkpoint. Each agent:
1. Creates its branch from `005-title-animation-variants`
2. Implements CSS + JS for its variant
3. Verifies the animation works on its assigned port

---

## Implementation Strategy

### Side-by-Side Comparison Setup

1. Complete Phase 1 on `005-title-animation-variants` (shared foundation)
2. Launch 3 subagents in parallel — each creates a variant branch and implements one animation
3. Start three dev servers on ports 8081, 8082, 8083
4. Open all three in browser tabs for side-by-side comparison
5. Owner picks favorite → merge that branch back → deploy

---

## Notes

- Each variant branch modifies the same two files (`title-animation.js` and `style.css`) but on isolated branches — no merge conflicts during development
- The `?animation=` URL param preview is built into the shared engine but isn't needed when each branch only has one variant registered
- After selection, the chosen branch merges cleanly since all branches share the same foundation
- Unused variant branches can be discarded or kept for future reference
