# Implementation Plan: Title Animation Variants

**Branch**: `005-title-animation-variants` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-title-animation-variants/spec.md`

## Summary

Replace the current typewriter animation on the "zacsblog" nav logo with a variant system offering 4 animations: **Pull-Up** (letters rise from behind a clipped surface), **Neural Resolve** (characters scramble then lock in), **Gradient Descent** (letters converge from scattered positions), and **Network** (constellation-inspired convergence with live SVG connecting edges — selected as production default). A URL parameter preview mechanism (`?animation=variant-name`) lets the blog owner compare variants side-by-side.

## Technical Context

**Language/Version**: JavaScript ES2020+ (browser), CSS3, Nunjucks templates
**Primary Dependencies**: None (vanilla JS, CSS animations/transforms — no new dependencies)
**Storage**: N/A
**Testing**: Vitest (unit), html-validate (lint), manual visual verification
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
**Project Type**: Static site (Eleventy 2.x)
**Performance Goals**: Animations complete in < 2s, 60fps during animation, no layout shift (CLS < 0.1)
**Constraints**: No canvas/SVG for title animation, no new external dependencies, single JS file
**Scale/Scope**: 1 nav element, 8 characters, 3 animation variants

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First — YAGNI** | PASS | 3 variants is the spec minimum; no extras added |
| **I. Simplicity First — Minimal Dependencies** | PASS | Zero new dependencies; vanilla JS + CSS only |
| **I. Simplicity First — Flat Structures** | PASS | Single new JS file replaces single existing file; no new directories |
| **I. Simplicity First — Single Responsibility** | PASS | One file does one thing: animate the title |
| **II. Content-Centric — Fast Reads** | PASS | CSS transforms are GPU-accelerated; no impact on page load |
| **II. Content-Centric — Accessible by Default** | PASS | Respects prefers-reduced-motion; aria-label preserved |
| **III. Ship Early — MVP Mindset** | PASS | Minimum 3 variants, simple preview mechanism |
| **III. Ship Early — Working State Always** | PASS | Replacing one JS file + CSS block; site remains functional at every step |
| **Quality — Performance Budget** | PASS | No layout shift (overflow hidden), no render blocking, < 2s duration |

### Post-Design Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First — YAGNI** | PASS | No unnecessary abstractions; variants are plain functions in a map |
| **I. Simplicity First — Minimal Dependencies** | PASS | Confirmed zero new dependencies |
| **I. Simplicity First — Flat Structures** | PASS | Flat variant map, no class hierarchy or module system |
| **II. Content-Centric — Fast Reads** | PASS | title-animation.js will be ~150-200 lines; CSS additions ~80 lines |
| **II. Content-Centric — Accessible by Default** | PASS | Reduced motion disables all animation; screen readers get aria-label |
| **III. Ship Early — No Big Bang** | PASS | Can implement one variant at a time; each is independently testable |

No violations. Complexity Tracking section not needed.

## Project Structure

### Documentation (this feature)

```text
specs/005-title-animation-variants/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── _includes/
│   ├── layouts/
│   │   └── base.njk           # EDIT: script src typewriter-logo.js → title-animation.js
│   └── partials/
│       └── nav.njk            # EDIT: update data attributes on nav logo
├── assets/
│   ├── css/
│   │   └── style.css          # EDIT: replace typewriter CSS block with animation variant styles
│   └── js/
│       ├── title-animation.js # CREATE: new animation engine (replaces typewriter-logo.js)
│       └── typewriter-logo.js # DELETE: replaced by title-animation.js
```

**Structure Decision**: Existing single-project Eleventy structure. No new directories needed. One file created, one deleted, two edited. This is a surgical replacement within the existing layout.
