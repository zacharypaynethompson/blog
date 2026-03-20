# Implementation Plan: Interactive Hero Physics Banner

**Branch**: `004-hero-physics-simulation` | **Date**: 2026-03-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-hero-physics-simulation/spec.md`

## Summary

Add a lightweight, full-width Canvas 2D physics banner to the blog homepage, positioned between the navigation and the intro text. The banner renders 60-80 semi-transparent warm-toned particles that respond to cursor movement via velocity-based physics with damping. No external libraries required — pure browser APIs (Canvas 2D, requestAnimationFrame, IntersectionObserver). Target: ~3KB JS, 60fps on mid-range hardware.

## Technical Context

**Language/Version**: JavaScript ES2020+ (browser), Node.js 18+ (Eleventy build)
**Primary Dependencies**: None — browser-native Canvas 2D API, requestAnimationFrame, IntersectionObserver
**Storage**: N/A
**Testing**: Manual visual testing + vitest for any utility functions
**Target Platform**: Modern browsers (Chrome/Firefox/Safari/Edge, last 2 versions)
**Project Type**: Static site feature (Eleventy 2.x)
**Performance Goals**: 60fps during mouse interaction, <200ms page load impact, <5KB JS
**Constraints**: No external libraries, must respect prefers-reduced-motion, pause when off-viewport
**Scale/Scope**: Single page (homepage only), 60-100 particles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First — YAGNI** | PASS | Single self-contained JS file, no abstractions beyond what is needed |
| **I. Simplicity First — Minimal Dependencies** | PASS | Zero external dependencies — pure Canvas 2D API |
| **I. Simplicity First — Flat Structures** | PASS | One JS file, one CSS addition, one template edit |
| **I. Simplicity First — Single Responsibility** | PASS | One file does one thing: render the physics banner |
| **II. Content-Centric — Fast Reads** | PASS | Deferred loading, <200ms impact, pauses off-viewport |
| **II. Content-Centric — Accessible by Default** | PASS | prefers-reduced-motion respected, decorative only (no content in banner) |
| **II. Content-Centric — SEO Foundations** | PASS | Banner is purely visual/decorative, no SEO impact |
| **III. Ship Early — MVP Mindset** | PASS | Minimal viable: particles + cursor repel + ambient drift |
| **III. Ship Early — No Big Bang** | PASS | Feature is a single independently deployable increment |
| **Quality — Performance Budget** | PASS | 60fps target, IntersectionObserver pausing, no DPR scaling overhead |
| **Quality — Responsive Design** | PASS | Full-width canvas scales with viewport, particle count adapts |
| **Workflow — Feature Branches** | PASS | Working on `004-hero-physics-simulation` branch |

**Pre-design gate: PASSED. No violations.**

## Project Structure

### Documentation (this feature)

```text
specs/004-hero-physics-simulation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── assets/
│   ├── css/
│   │   └── style.css              # Add banner container styles + reduced-motion rules
│   └── js/
│       └── hero-physics.js        # NEW: Canvas physics simulation (~3KB)
├── _includes/
│   └── layouts/
│       └── base.njk               # No changes needed (uses block scripts)
├── index.njk                      # Add banner container + script block
```

**Structure Decision**: This feature adds a single JS file (`hero-physics.js`) and minor edits to two existing files (`index.njk`, `style.css`). No new directories or structural changes needed. Follows the existing pattern where page-specific JS is loaded via `{% block scripts %}` in Nunjucks templates.

## Complexity Tracking

> No constitution violations. Table not needed.
