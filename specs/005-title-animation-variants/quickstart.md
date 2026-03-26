# Quickstart: Network Constellation Title Animation

**Date**: 2026-03-26
**Feature**: 005-title-animation-variants

## Overview

The "zacsblog" nav logo animates on page load with a constellation network effect: letters scatter, converge via damped spring physics, while SVG edges connect nearby pairs. Replaces the old typewriter animation.

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/assets/js/title-animation.js` | **Created** | Constellation network animation (~200 lines) |
| `src/assets/js/typewriter-logo.js` | **Deleted** | Replaced by title-animation.js |
| `src/assets/css/style.css` | **Modified** | Letter styles, color classes, reduced-motion rule |
| `src/_includes/partials/nav.njk` | **Modified** | `data-animation data-accent-start="4"` on nav logo |
| `src/_includes/layouts/base.njk` | **Modified** | Script reference updated |

## Architecture

```
nav.njk (<a class="nav-logo" data-animation data-accent-start="4">zacsblog</a>)
    │
    ▼
title-animation.js
    ├── init()           — querySelectorAll [data-animation], IntersectionObserver
    ├── splitLetters()   — create <span> per character with color classes, set aria-label
    └── animate()        — spring physics simulation with SVG edge overlay
         ├── Physics:    spring=0.015, damping=0.90, stagger=40ms/letter
         ├── Edges:      SVG <line> elements, distance-based opacity (max 0.35)
         ├── Arrival:    letter within 3px → mark arrived → edges fade when both arrive
         └── Settle:     letter < 0.3px + velocity < 0.1 → snap to final state
```

## Verification

```bash
npm run dev
# Open http://localhost:8080/blog/
# Observe: letters scatter → converge with spring wobble → edges fade → title settles
# Toggle dark mode: colors should update correctly
# Enable prefers-reduced-motion: title should appear instantly, no animation
```

## Key Design Decisions

1. **Damped spring physics** — matches hero-physics.js model for visual consistency
2. **Inline SVG edges** — lightweight, theme-aware, trivially removable from DOM
3. **Arrival-based edge fade** — edges disappear when both connected letters first reach destination, not when fully settled
4. **Single file, no modules** — ~200 lines, IIFE pattern matching project conventions
5. **Zero dependencies** — vanilla JS + inline SVG, no libraries
