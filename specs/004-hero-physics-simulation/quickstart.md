# Quickstart: Interactive Hero Physics Banner

**Feature**: 004-hero-physics-simulation
**Date**: 2026-03-20

## Prerequisites

- Node.js 18+
- npm (comes with Node.js)

## Setup

```bash
# Clone and install
git checkout 004-hero-physics-simulation
npm install

# Start dev server
npx @11ty/eleventy --serve
```

The site will be available at `http://localhost:8080/blog/`.

## Files to Create/Modify

### New file
- `src/assets/js/hero-physics.js` — Canvas 2D physics simulation (~3KB)

### Modified files
- `src/index.njk` — Add banner canvas container above the `.home` div, add `{% block scripts %}` for loading the JS
- `src/assets/css/style.css` — Add `.hero-physics` container styles, reduced-motion rules

## Development Workflow

1. Start the dev server (`npx @11ty/eleventy --serve`)
2. Edit `src/assets/js/hero-physics.js` — changes auto-reload via Eleventy watch
3. Test mouse interaction on homepage
4. Test resize behavior at various viewport widths (320px, 768px, 1440px, 2560px)
5. Test `prefers-reduced-motion` via browser DevTools > Rendering > Emulate CSS media feature
6. Test viewport pausing by scrolling banner out of view and checking CPU usage

## Key Patterns to Follow

- **IIFE pattern**: Wrap the simulation in an IIFE like `typewriter-logo.js` does
- **IntersectionObserver**: Use the same observe/unobserve pattern as `typewriter-logo.js` for viewport-aware pausing
- **CSS custom properties**: Reference `--color-accent`, `--color-bg`, `--color-border` from the existing palette
- **Block scripts**: Load page-specific JS via `{% block scripts %}` in the Nunjucks template (same pattern as `explore.njk`)

## Verification

- [ ] Banner appears full-width above intro text on homepage
- [ ] Particles respond to mouse cursor in real time
- [ ] Ambient animation plays when cursor is outside banner
- [ ] Banner pauses when scrolled out of viewport
- [ ] Static display when `prefers-reduced-motion` is active
- [ ] No layout breakage at 320px-2560px viewport widths
- [ ] Page load increase < 200ms
- [ ] Smooth 60fps during mouse interaction
