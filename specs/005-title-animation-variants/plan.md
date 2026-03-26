# Implementation Plan: Network Constellation Title Animation

**Branch**: `005-title-animation-variants` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-title-animation-variants/spec.md`

## Summary

Replace the typewriter animation on the "zacsblog" nav logo with a constellation-inspired network animation. Letters start scattered at random positions and converge using damped spring physics (spring: 0.015, damping: 0.90) while SVG edges connect nearby letters with distance-based opacity. Edges fade rapidly when both endpoints arrive. Matches the hero physics banner's visual DNA.

## Technical Context

**Language/Version**: JavaScript ES2020+ (browser), CSS3, Nunjucks templates
**Primary Dependencies**: None (vanilla JS, inline SVG — no new dependencies)
**Storage**: N/A
**Testing**: Vitest (unit), html-validate (lint), manual visual verification
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
**Project Type**: Static site (Eleventy 2.x)
**Performance Goals**: Animation completes in < 2s, 60fps during spring simulation, no layout shift (CLS < 0.1)
**Constraints**: No external dependencies, single JS file, DOM + inline SVG only
**Scale/Scope**: 1 nav element, 8 characters, ~15 SVG line elements

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First — YAGNI** | PASS | Single animation, no variant system, no config UI |
| **I. Simplicity First — Minimal Dependencies** | PASS | Zero new dependencies; vanilla JS + inline SVG |
| **I. Simplicity First — Flat Structures** | PASS | Single JS file replaces single existing file |
| **I. Simplicity First — Single Responsibility** | PASS | One file does one thing: animate the nav title |
| **II. Content-Centric — Fast Reads** | PASS | ~200 lines JS, ~20 lines CSS; no render blocking |
| **II. Content-Centric — Accessible by Default** | PASS | Respects prefers-reduced-motion; aria-label preserved; SVG has aria-hidden |
| **III. Ship Early — MVP Mindset** | PASS | Single focused animation, no unnecessary features |
| **III. Ship Early — Working State Always** | PASS | Site functional at every step of replacement |
| **Quality — Performance Budget** | PASS | 8 DOM elements + ~15 SVG lines via rAF; negligible impact |

## Project Structure

### Documentation

```text
specs/005-title-animation-variants/
├── spec.md         # Feature specification
├── plan.md         # This file
├── research.md     # Technical decisions
├── data-model.md   # Entity definitions
├── quickstart.md   # File map and architecture
└── tasks.md        # Implementation tasks (completed)
```

### Source Code

```text
src/
├── _includes/
│   ├── layouts/
│   │   └── base.njk           # Script reference: title-animation.js
│   └── partials/
│       └── nav.njk            # data-animation data-accent-start="4"
├── assets/
│   ├── css/
│   │   └── style.css          # .title-letter, .title-char-normal/accent, reduced-motion
│   └── js/
│       └── title-animation.js # Constellation network animation (~200 lines)
```

**Files changed from baseline**:
- **Created**: `src/assets/js/title-animation.js`
- **Deleted**: `src/assets/js/typewriter-logo.js`
- **Modified**: `src/assets/css/style.css`, `src/_includes/partials/nav.njk`, `src/_includes/layouts/base.njk`
