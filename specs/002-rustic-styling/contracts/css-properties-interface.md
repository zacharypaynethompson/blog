# CSS Properties Interface Contract

**Version**: 1.0.0
**Date**: 2026-03-13
**Type**: Design Token API

## Overview

This contract defines the CSS custom properties interface for the rustic styling system. All components must use these standardized properties for consistent theming and maintainability.

## Required Properties

### Typography Properties
```css
:root {
  /* Font Family */
  --font-family: 'Roboto Slab', Georgia, serif;

  /* Existing properties (must be preserved) */
  --font-size-base: 18px;
  --line-height: 1.6;
  --type-scale: 1.25;
}
```

**Contract Requirements**:
- All text elements MUST use `var(--font-family)` instead of hardcoded fonts
- Font fallback chain MUST include at least one web-safe fallback
- Properties MUST be scoped to `:root` for global access

### Color Properties
```css
:root {
  /* Updated accent colors */
  --color-accent: #D2691E;           /* Primary accent (NEW) */
  --color-accent-hover: #A0520F;     /* Hover state (NEW) */

  /* Existing properties (unchanged) */
  --color-bg: #FDFBF7;
  --color-text: #2D2D2D;
  --color-text-secondary: #5C5C5C;
  --color-border: #E8E4DF;
}
```

**Contract Requirements**:
- Accent colors MUST maintain 4.5:1 contrast ratio minimum against `--color-bg`
- All interactive elements MUST use `--color-accent` and `--color-accent-hover`
- Color updates MUST propagate to D3.js visualization components

### Animation Properties
```css
:root {
  /* Typewriter animation */
  --animation-typing-speed: 50ms;    /* Per character delay (NEW) */
  --animation-cursor-blink: 1s;      /* Cursor blink rate (NEW) */
  --animation-ease-typing: steps(1, end); /* Timing function (NEW) */

  /* Existing properties (preserved) */
  --transition-base: 0.2s ease;
}
```

**Contract Requirements**:
- Animation speeds MUST be configurable via CSS properties
- All animations MUST check `prefers-reduced-motion` media query
- Timing functions MUST use `steps()` for typewriter effect

### Texture Properties
```css
:root {
  /* Background texture system */
  --texture-opacity: 0.015;          /* Texture visibility (NEW) */
  --gradient-opacity: 0.008;         /* Gradient subtlety (NEW) */
  --texture-size: 12px;             /* Pattern repetition (NEW) */
}
```

**Contract Requirements**:
- Opacity values MUST remain below 0.02 to preserve readability
- Texture patterns MUST use CSS gradients (no external images)
- Size values MUST scale appropriately on mobile devices

## Usage Patterns

### Component Implementation
```css
/* ✅ Correct - Uses custom properties */
.blog-title {
  font-family: var(--font-family);
  color: var(--color-accent);
  transition: color var(--transition-base);
}

.blog-title:hover {
  color: var(--color-accent-hover);
}

/* ❌ Incorrect - Hardcoded values */
.blog-title {
  font-family: 'Roboto Slab', serif;
  color: #D2691E;
}
```

### Animation Implementation
```css
/* ✅ Correct - Uses custom properties and accessibility */
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

.typewriter-text {
  animation: typewriter calc(var(--animation-typing-speed) * 20) var(--animation-ease-typing);
}

@media (prefers-reduced-motion: reduce) {
  .typewriter-text {
    animation: none;
  }
}
```

### Texture Implementation
```css
/* ✅ Correct - Uses pseudo-elements and custom properties */
.content-section::before {
  content: '';
  position: absolute;
  background: radial-gradient(
    circle at 25% 25%,
    rgba(210, 105, 30, var(--texture-opacity)) 1px,
    transparent 1px
  );
  background-size: var(--texture-size) var(--texture-size);
  z-index: -1;
}
```

## Breaking Changes

### Migration from v0 (Current) to v1 (New)
```css
/* OLD: Hardcoded accent color */
--color-accent: #B7410E;

/* NEW: Updated vibrant orange */
--color-accent: #D2691E;
```

**Migration Steps**:
1. Update CSS custom property value
2. Verify contrast ratios in all usage contexts
3. Update any hardcoded references to old color value
4. Test D3.js visualization color coordination

## Validation

### Automated Checks
```javascript
// CSS property validation
const requiredProperties = [
  '--font-family',
  '--color-accent',
  '--color-accent-hover',
  '--animation-typing-speed',
  '--texture-opacity'
];

// Contrast ratio validation
function validateContrast(accent, background) {
  const ratio = getContrastRatio(accent, background);
  return ratio >= 4.5; // WCAG AA requirement
}
```

### Manual Verification
- [ ] All text elements use `var(--font-family)`
- [ ] All accent colors use custom properties
- [ ] Animations respect motion preferences
- [ ] Textures remain below readability threshold

## Compatibility

**Browser Support**: Modern browsers with CSS custom properties support (95%+ coverage)
**Fallback Strategy**: Hardcoded values in older browsers via progressive enhancement
**Performance Impact**: Negligible (<0.1ms additional property resolution time)
