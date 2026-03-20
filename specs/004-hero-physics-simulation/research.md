# Research: Interactive Hero Physics Banner

**Feature**: 004-hero-physics-simulation
**Date**: 2026-03-20

## Decision 1: Rendering Technology — Canvas 2D

**Decision**: Use Canvas 2D API for all particle rendering.

**Rationale**:
- Zero DOM overhead — particles are drawn to a bitmap buffer, not individual DOM nodes
- No library required (D3.js/SVG used elsewhere in the project is overkill here)
- A single `clearRect` + loop of `arc()` + `fill()` for 80 particles completes in <1ms
- Particles don't need click/hover events individually — purely visual
- Keeps JS under 5KB easily

**Alternatives considered**:
- **SVG + D3.js**: Already used in the network graph (`src/assets/js/network-graph.js`). However, SVG creates a DOM node per particle — 80 DOM mutations per frame is wasteful for a decorative element. D3.js adds unnecessary bundle weight.
- **WebGL**: Massive overkill for 80 particles. Adds complexity, shader code, and potential compatibility issues with no performance benefit at this scale.

---

## Decision 2: Physics Model — Velocity + Damping

**Decision**: Use velocity-based physics with direct force injection and high damping (decay factor 0.92-0.95).

**Rationale**:
- Each particle stores only `x, y, vx, vy` — minimal state
- Cursor force is added directly to velocity — instant responsiveness, no spring lag
- Velocity damping (`vx *= 0.93`) produces the "snappy" feel: fast acceleration, quick deceleration, no oscillation
- Ambient drift via gentle sinusoidal force when no cursor is present
- ~10 operations per particle per frame — trivially cheap

**Alternatives considered**:
- **Spring forces** (`F = -k * displacement`): Produce oscillation and bounce. To make them snappy requires critical damping, which mathematically reduces to the velocity + decay model anyway. Extra complexity for the same result.
- **Position interpolation (lerp)**: Smooth but "mushy" — particles appear to float on rails without physical weight. Lacks the satisfying inertia that makes interaction feel tactile.

---

## Decision 3: Particle Count — Adaptive 40-100

**Decision**: Scale particle count with viewport width: `count = clamp(Math.floor(width / 25), 40, 100)`.

**Rationale**:
- ~50 on mobile (320px), ~60 on standard desktop (1440px), ~100 on ultrawide (2560px)
- Prevents sparse look on wide screens and overcrowding on narrow screens
- At 100 particles with no particle-to-particle physics, per-frame cost is negligible
- Proximity-based connecting lines (O(n^2) distance checks) stay under 5,000 checks at n=100, completing in <1ms

**Alternatives considered**:
- **Fixed count (80)**: Simpler but looks sparse on ultrawide and crowded on mobile
- **Density-based (particles per pixel area)**: Overcomplicates for minimal visual difference vs. linear width scaling

---

## Decision 4: Mouse Force Field — Inverse-Square Repel

**Decision**: Repulsion with squared falloff, radius scaled to canvas height (~120-150px), gentle attract fringe at outer edge.

**Rationale**:
- **Repel primary**: Creates a satisfying "parting" wake as cursor moves through the particle field — visually immediate and legible
- **Squared falloff**: `force = strength * (1 - dist/radius)^2` — mirrors natural force curves, feels physical
- **Minimum distance clamp** (~20px): Prevents particles from rocketing off when too close to cursor
- **Subtle attract at 80-100% radius** (10-20% of repel strength): Creates an organic gathering/halo effect at the edge of influence
- **No cursor smoothing**: Raw `mousemove` coordinates used directly. Damping on particles already provides visual smoothness; cursor smoothing would add latency and kill snappiness.

**Alternatives considered**:
- **Pure attraction**: Clumps particles into a blob following the cursor — less interesting visually
- **Linear falloff**: Feels less physical/natural than squared curve
- **Smoothed cursor position**: Adds latency, undermines the "snappy" requirement

---

## Decision 5: Canvas Resize Strategy — Debounced, No DPR Scaling

**Decision**: Debounce resize events (150ms), proportionally rescale particle x-positions, skip devicePixelRatio scaling.

**Rationale**:
- **Debounce**: Prevents rapid canvas reallocation during window drag-resize. Animation loop continues unaffected; only dimensions update after settle.
- **Proportional rescale**: `particle.x *= newWidth / oldWidth` keeps particles in relative position. Y stays the same (fixed height).
- **Skip DPR**: At 150px tall with soft, semi-transparent circles, 1x is visually indistinguishable from 2x. Skipping DPR scaling cuts GPU fill cost by 4x on Retina displays.

**Alternatives considered**:
- **DPR-aware scaling**: Higher quality but 4x pixel fill. Not worth it for decorative blurred circles.
- **No rescale on resize**: Particles would cluster on one side after resize — broken look.

---

## Decision 6: Visual Style — Warm Semi-Transparent Dots + Faint Proximity Lines

**Decision**: Soft circles (2-8px radius) in accent color `#D2691E` at 15-40% opacity, with optional thin connecting lines between nearby particles at very low opacity.

**Rationale**:
- **Matches existing palette**: The blog's accent color is `#D2691E` (burnt sienna/chocolate). Using it at low opacity creates a warm, dusty particle field consistent with the site's subtle texture patterns (the CSS uses radial gradients at 0.015 opacity for background texture).
- **Varied sizes**: Mix of 2-5px (most particles) and 6-8px (a few, at lower opacity) creates depth and organic feel.
- **Connecting lines**: Thin lines (0.5-1px) between particles within ~80px at 5-10% opacity. Uses `rgba(210, 105, 30, 0.08)` or the border color. Creates a constellation/web effect that echoes the network graph page — nice thematic link.
- **Reduced motion**: Show particles in static initial positions — a decorative constellation strip with no animation.

**Alternatives considered**:
- **Geometric shapes** (triangles, hexagons): Clash with the soft, serif-based rustic design
- **Metaballs/blobs**: Require expensive compositing operations or shader math. Blow the 5KB and performance budgets. Feel "tech startup" not "rustic blog."
- **Monochrome/grey**: Less personality. The warm accent color ties the banner to the rest of the site.

---

## Decision 7: Integration Point — Homepage Only, Deferred Loading

**Decision**: Banner canvas element added to `src/index.njk` above the `.home` div. JS loaded via `{% block scripts %}` with `defer`. Styles added to `src/assets/css/style.css`.

**Rationale**:
- **Homepage only**: Spec explicitly scopes to homepage. Using the Nunjucks `{% block scripts %}` pattern (already used by explore page for network graph) keeps JS out of other pages.
- **Deferred**: Script loads with `defer` attribute so it doesn't block initial render (FR-010).
- **IntersectionObserver**: Follows the same pattern as `typewriter-logo.js` — observe the banner element, only run simulation when visible.

**Alternatives considered**:
- **Global script in base.njk**: Would load on every page unnecessarily
- **Inline script**: Would increase HTML size and prevent caching
