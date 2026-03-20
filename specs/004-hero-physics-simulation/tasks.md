# Tasks: Interactive Hero Physics Banner

**Input**: Design documents from `/specs/004-hero-physics-simulation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are structured for **3 parallel design variants** implemented in separate git worktrees. All three share a common setup phase, then diverge with distinct visual designs.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Design Variants

Each variant implements the same physics core (FR-001 through FR-010) but with a distinct visual style:

| Variant | Branch | Visual Style | Character |
|---------|--------|-------------|-----------|
| **A: Constellation** | `004-hero-physics-variant-a` | Floating dots with faint proximity lines | Elegant, minimal, web-like |
| **B: Flow Field** | `004-hero-physics-variant-b` | Particles following a Perlin-like flow field, cursor creates turbulence | Organic, fluid, mesmerizing |
| **C: Scatter Burst** | `004-hero-physics-variant-c` | Particles gently orbit, cursor repels in explosive bursts with trails | Energetic, playful, dynamic |

---

## Phase 1: Setup (Shared — on `004-hero-physics-simulation` branch)

**Purpose**: Common infrastructure shared by all three variants

- [ ] T001 [US2] Add `.hero-physics` banner container styles (full-width, 150px height, overflow hidden, responsive scaling) in `src/assets/css/style.css`
- [ ] T002 [US2] Add `prefers-reduced-motion` media query rules for `.hero-physics` container in `src/assets/css/style.css`
- [ ] T003 [US1] Add `<div class="hero-physics" id="hero-physics"><canvas></canvas></div>` banner markup to `src/index.njk` above the `.home` div, and add `{% block scripts %}` for loading the physics JS

**Checkpoint**: Banner container visible on homepage as an empty strip. All three variants will branch from here.

---

## Phase 2: Variant A — Constellation (branch `004-hero-physics-variant-a`)

**Goal**: Floating semi-transparent warm dots (2-8px, `#D2691E` at 15-40% opacity) with thin connecting lines between nearby particles. Cursor repels particles with inverse-square falloff. Idle state: gentle ambient drift. Feels like a warm, dusty star map.

**Independent Test**: Load homepage, move cursor over banner — particles scatter outward from cursor, faint lines stretch and reconnect as particles settle back.

### Implementation

- [ ] T004 [US1] Create `src/assets/js/hero-physics.js` with IIFE structure, canvas initialization, and DPR-independent sizing matching the container dimensions
- [ ] T005 [US1] Implement particle initialization: random positions across canvas, randomized radius (2-5px common, 6-8px rare), opacity (0.15-0.40), zero initial velocity. Particle count: `clamp(floor(width / 25), 40, 100)`
- [ ] T006 [US1] Implement core physics loop: `requestAnimationFrame` loop with velocity damping (0.93 per frame), position update (`x += vx, y += vy`), and canvas boundary wrapping
- [ ] T007 [US1] Implement cursor force field: track mouse position via `mousemove`/`mouseenter`/`mouseleave` on canvas. Apply inverse-square repulsion (`strength * (1 - dist/radius)^2`) to particles within `canvas.height * 0.9` radius. Clamp minimum distance to 20px
- [ ] T008 [US1] Implement ambient drift: when cursor is inactive, apply gentle sinusoidal velocity nudge per particle based on `(particleIndex * 0.5 + time * 0.001)` for organic idle movement
- [ ] T009 [US1] Implement rendering: clear canvas each frame, draw each particle as filled arc with its radius and `rgba(210, 105, 30, opacity)`. Draw thin lines (0.5px, `rgba(210, 105, 30, 0.08)`) between particles within 80px of each other
- [ ] T010 [US3] Implement IntersectionObserver on the banner container — pause the `requestAnimationFrame` loop when banner is not visible, resume when it enters viewport
- [ ] T011 [US3] Implement `prefers-reduced-motion` check: if active, render particles once in initial positions with connecting lines as a static decorative image, skip animation loop entirely
- [ ] T012 [US2] Implement debounced resize handler (150ms): update canvas width to container width, rescale particle x-positions proportionally (`x *= newWidth / oldWidth`), reset velocities to zero
- [ ] T013 [US1] Add subtle attract fringe: at 80-100% of force radius, apply gentle attract force (15% of repel strength) pulling particles inward to create an organic halo effect around the cursor influence zone
- [ ] T014 Wire up script loading in `src/index.njk` via `{% block scripts %}` with defer attribute

**Checkpoint**: Variant A complete — constellation-style physics banner functional on homepage.

---

## Phase 3: Variant B — Flow Field (branch `004-hero-physics-variant-b`)

**Goal**: Particles follow smooth directional flow vectors across the canvas, creating a river-like ambient motion. Cursor creates a turbulence zone that disrupts the flow, causing particles to swirl and scatter before rejoining the current. Colors use the warm palette with slight opacity variation to suggest depth layers.

**Independent Test**: Load homepage — particles stream smoothly in ambient flow. Move cursor into banner — nearby particles break from the flow, swirl around cursor wake, then gradually rejoin the current.

### Implementation

- [ ] T015 [US1] Create `src/assets/js/hero-physics.js` with IIFE structure, canvas initialization, and DPR-independent sizing matching the container dimensions
- [ ] T016 [US1] Implement particle initialization: random positions, varied sizes (2-6px), two opacity tiers (0.12-0.25 for "deep" particles, 0.30-0.45 for "surface" particles). Count: `clamp(floor(width / 25), 40, 100)`
- [ ] T017 [US1] Implement flow field: create a grid of angle values (cell size ~40px) using layered sine waves (`angle = sin(x * 0.02 + time) + cos(y * 0.03 + time * 0.7)`) that slowly evolve over time. Each particle samples the nearest grid cell to get its flow direction
- [ ] T018 [US1] Implement core physics loop: each frame, add flow vector (scaled by `ambientStrength * 0.3`) to particle velocity, apply damping (0.95 — slightly higher than constellation for smoother flow), update positions, wrap at boundaries
- [ ] T019 [US1] Implement cursor turbulence: within cursor radius, override flow with a radial force that pushes particles outward AND adds a tangential (perpendicular) component to create a swirl effect. Turbulence strength falls off with distance squared
- [ ] T020 [US1] Implement rendering: clear canvas, draw each particle as a soft circle with its radius and warm color (`rgba(210, 105, 30, opacity)`). No connecting lines — the flow pattern itself creates visual coherence. Optionally draw a very faint motion trail by not fully clearing canvas (use `fillRect` with 95% opacity background instead of `clearRect`)
- [ ] T021 [US3] Implement IntersectionObserver pause/resume for the animation loop
- [ ] T022 [US3] Implement `prefers-reduced-motion`: render particles in static positions with a subtle radial gradient background suggesting flow direction
- [ ] T023 [US2] Implement debounced resize handler: update canvas and flow field grid dimensions, rescale particle positions proportionally
- [ ] T024 Wire up script loading in `src/index.njk` via `{% block scripts %}` with defer attribute

**Checkpoint**: Variant B complete — flow field physics banner functional on homepage.

---

## Phase 4: Variant C — Scatter Burst (branch `004-hero-physics-variant-c`)

**Goal**: Particles gently float with slight gravitational pull toward canvas center, forming a loose cloud. When the cursor enters or moves, particles near it burst outward explosively with a brief opacity/size flash, then drift back. Particles leave short fading trails. Feels energetic and playful — like disturbing fireflies.

**Independent Test**: Load homepage — particles hover in a soft cloud. Move cursor sharply through banner — nearby particles burst away with visible trails, then slowly drift back to their resting positions.

### Implementation

- [ ] T025 [US1] Create `src/assets/js/hero-physics.js` with IIFE structure, canvas initialization, and DPR-independent sizing
- [ ] T026 [US1] Implement particle initialization: random positions biased toward horizontal center band (Gaussian-ish distribution), sizes 2-6px, base opacity 0.20-0.40. Each particle stores a `restX, restY` (home position) and `excitement` value (0-1). Count: `clamp(floor(width / 25), 40, 100)`
- [ ] T027 [US1] Implement core physics loop: each frame apply gentle spring force pulling particles toward their rest position (`force = (restPos - pos) * 0.005`), velocity damping at 0.94, position update. The spring creates a soft "return home" behavior
- [ ] T028 [US1] Implement cursor burst: when cursor is within radius, apply strong repulsion (2x normal strength). Set particle `excitement = 1.0` on impact. Excitement decays by `*= 0.96` each frame. While excited, particle radius scales up by `1 + excitement * 0.5` and opacity increases by `excitement * 0.2`
- [ ] T029 [US1] Implement rendering with trails: instead of `clearRect`, draw a semi-transparent background fill (`rgba(253, 251, 247, 0.15)`) each frame to create fading trails. Draw each particle as filled arc with dynamic radius and opacity based on excitement level
- [ ] T030 [US1] Implement ambient idle: without cursor, apply tiny random velocity nudges each frame so particles gently wobble around their rest positions, creating a firefly-like hovering effect
- [ ] T031 [US3] Implement IntersectionObserver pause/resume for the animation loop
- [ ] T032 [US3] Implement `prefers-reduced-motion`: render particles once at rest positions as a static scatter pattern
- [ ] T033 [US2] Implement debounced resize handler: update canvas, recalculate rest positions proportionally, rescale current positions
- [ ] T034 Wire up script loading in `src/index.njk` via `{% block scripts %}` with defer attribute

**Checkpoint**: Variant C complete — scatter burst physics banner functional on homepage.

---

## Phase 5: Polish & Cross-Cutting Concerns (after variant selection)

**Purpose**: Applied to the chosen variant after comparison

- [ ] T035 Fine-tune physics constants (damping, force strength, radius) based on visual testing across viewport sizes
- [ ] T036 Verify performance: check 60fps on mid-range device during active interaction using browser DevTools Performance panel
- [ ] T037 Test all viewport widths (320px, 768px, 1024px, 1440px, 2560px) for layout and particle density
- [ ] T038 Test `prefers-reduced-motion` via DevTools > Rendering > Emulate CSS media
- [ ] T039 Test viewport pausing: scroll banner off screen, verify near-zero CPU usage in Performance monitor
- [ ] T040 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately on `004-hero-physics-simulation`
- **Phases 2, 3, 4 (Variants A, B, C)**: All depend on Phase 1. **Run in parallel** in separate worktrees.
- **Phase 5 (Polish)**: Depends on variant selection — applied to the winner only.

### Worktree Strategy

```
004-hero-physics-simulation (base branch — Phase 1 setup)
├── 004-hero-physics-variant-a (worktree — Constellation)
├── 004-hero-physics-variant-b (worktree — Flow Field)
└── 004-hero-physics-variant-c (worktree — Scatter Burst)
```

1. Complete Phase 1 on `004-hero-physics-simulation`
2. Create 3 branches from `004-hero-physics-simulation`
3. Create worktrees for each branch
4. Implement variants in parallel (agents or manual)
5. Compare all three by serving each worktree
6. Merge chosen variant back to `004-hero-physics-simulation`
7. Apply Phase 5 polish
8. Delete unused worktrees and branches

### Within Each Variant

Tasks are sequential within a variant (single JS file):
- Canvas init → Particle init → Physics loop → Cursor interaction → Rendering → Performance features → Resize → Script wiring

### Parallel Opportunities

- **All 3 variants can run simultaneously** in separate worktrees (zero file conflicts)
- Within Phase 1: T001 and T002 are [P] (both edit `style.css` but different sections — can be combined)
- T003 depends on T001/T002 (needs container styles to exist)

---

## Implementation Strategy

### Parallel Variant Comparison

1. Complete Phase 1: Setup (shared CSS + markup) on base branch
2. Branch 3 variants, create worktrees
3. Implement all 3 variants in parallel (via agents in worktree isolation)
4. Serve each worktree locally to compare visual results
5. Select winning variant
6. Merge winner to base branch, apply Phase 5 polish
7. Clean up worktrees and unused branches

### Per-Variant MVP

Each variant is self-contained — implementing T004-T014 (or equivalent) produces a fully functional banner. No cross-variant dependencies exist.

---

## Notes

- All three variants share the same CSS container, markup, and script loading — only the JS implementation differs
- The `hero-physics.js` file is the only file that varies between branches
- Each variant follows the same IIFE pattern established by `src/assets/js/typewriter-logo.js`
- Physics constants in each variant are initial estimates — expect tuning in Phase 5
- The trail technique in Variant C (semi-transparent background fill instead of clearRect) may need the canvas background color to exactly match `--color-bg: #FDFBF7`
