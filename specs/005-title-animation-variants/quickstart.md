# Quickstart: Title Animation Variants

**Date**: 2026-03-26
**Feature**: 005-title-animation-variants

## Overview

Replace the current typewriter animation on the "zacsblog" nav logo with a system supporting 3 animation variants: "pull-up" (letters rise from behind), "neural-resolve" (characters scramble then resolve), and "gradient-descent" (letters converge from scattered positions).

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/assets/js/typewriter-logo.js` | **Replace** → `title-animation.js` | New animation engine with variant system |
| `src/assets/css/style.css` | **Edit** | Replace typewriter CSS (lines 926-969) with new animation styles |
| `src/_includes/partials/nav.njk` | **Edit** | Update data attributes on nav logo |
| `src/_includes/layouts/base.njk` | **Edit** | Update script reference from typewriter-logo.js to title-animation.js |

## Files to Create

| File | Purpose |
|------|---------|
| `src/assets/js/title-animation.js` | Animation engine: letter splitting, variant registry, observer, 3 variant functions |

## Files to Delete

| File | Reason |
|------|--------|
| `src/assets/js/typewriter-logo.js` | Replaced by title-animation.js |

## Architecture

```
nav.njk (data-animation="neural-resolve" data-accent-start="4")
    │
    ▼
title-animation.js
    ├── init()           — query selector, read config, IntersectionObserver
    ├── splitLetters()   — create span per character with color classes
    ├── resolveVariant() — URL param override or data attribute default
    └── variants = {
          "pull-up":           pullUpAnimate(letters),
          "neural-resolve":    neuralResolveAnimate(letters),
          "gradient-descent":  gradientDescentAnimate(letters)
        }
```

## Key Decisions

1. **Single file, no modules** — all variants in one file (~150-200 lines), matching project's existing JS pattern
2. **URL param for preview** — `?animation=pull-up` overrides the default for easy A/B comparison
3. **CSS transforms only** — GPU-accelerated, no canvas, no SVG, no external dependencies
4. **Preserve color split pattern** — `title-char-normal` / `title-char-accent` classes (renamed from `tw-*`)
5. **Data attribute for production default** — single-line template change to switch the deployed variant

## Preview Workflow

```bash
npm run dev
# Open http://localhost:8080/?animation=pull-up
# Open http://localhost:8080/?animation=neural-resolve
# Open http://localhost:8080/?animation=gradient-descent
# Compare side-by-side, pick favorite, set as data-animation in nav.njk
```

## Variant Descriptions

### 1. Pull-Up (`pull-up`)
Each letter is wrapped in an overflow-hidden container. Letters start translated downward (invisible behind the clip edge) and rise upward into position with a staggered delay and ease-out overshoot.

### 2. Neural Resolve (`neural-resolve`)
Each letter starts visible but displaying rapidly cycling random characters. After a staggered delay, each letter "locks in" to its correct character — like a neural network converging from noise to prediction.

### 3. Gradient Descent (`gradient-descent`)
Each letter starts at a random offset position (scattered) with 0 opacity. Letters simultaneously move toward their correct position following a smooth curve with slight wobble, fading in as they converge — evoking optimization convergence.
