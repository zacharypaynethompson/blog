# Quickstart Guide: Rustic Visual Styling Implementation

**Date**: 2026-03-13
**Feature**: 002-rustic-styling
**Estimated Time**: 2-3 hours

## Overview

This guide walks through implementing the four visual enhancements: Roboto Slab font, vibrant orange accent color, stepped reveal animations, and subtle gradient backgrounds. Follow the steps in order for best results.

---

## Prerequisites

- Node.js 18+ and npm installed
- Git repository with current blog code
- Text editor with CSS/HTML syntax highlighting

**Verify current setup:**
```bash
# Check you're on the feature branch
git branch --show-current
# Should show: 002-rustic-styling

# Verify build works
npm run build
npm run dev
```

---

## Step 1: Update Font to Roboto Slab (10 minutes)

### 1.1 Update Google Fonts Link

**File**: `src/_includes/layouts/base.njk`

**Find this line** (around line 23):
```html
<link href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;700&display=swap" rel="stylesheet">
```

**Replace with**:
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet">
```

### 1.2 Update CSS Font Family

**File**: `src/assets/css/style.css`

**Find this property** (around line 15):
```css
--font-family: 'Bitter', Georgia, serif;
```

**Replace with**:
```css
--font-family: 'Roboto Slab', Georgia, serif;
```

### 1.3 Test Font Change
```bash
npm run build
npm run dev
# Open http://localhost:8080 and verify new font appears
```

---

## Step 2: Update Accent Color (5 minutes)

### 2.1 Update CSS Color Properties

**File**: `src/assets/css/style.css`

**Find these properties** (around lines 10-11):
```css
--color-accent: #B7410E;
--color-accent-hover: #8A3009;
```

**Replace with**:
```css
--color-accent: #D2691E;
--color-accent-hover: #A0520F;
```

### 2.2 Update D3.js Colors (Optional)

If your site uses the explore page visualization:

**File**: `src/assets/js/explore.js`

**Find color references** (around lines 15-18) and update hex values from `#B7410E` to `#D2691E`

### 2.3 Test Color Change
```bash
npm run build
# Check that links, buttons, and accent elements now use vibrant orange
```

---

## Step 3: Add Stepped Reveal Animations (45 minutes)

### 3.1 Add Animation CSS Properties

**File**: `src/assets/css/style.css`

**Add to `:root` section** (around line 30):
```css
  /* Animation properties */
  --animation-typing-speed: 50ms;
  --animation-cursor-blink: 1s;
  --animation-ease-typing: steps(1, end);
```

### 3.2 Add Animation Keyframes

**Add at the end of `style.css`**:
```css
/* ==========================================================================
   Typewriter Animations
   ========================================================================== */

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### 3.3 Add Animation Classes

**Add after keyframes**:
```css
/* Typewriter animation for titles */
.animated-title {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}

.animated-title .text {
  display: inline-block;
}

.animated-title:hover .text {
  animation: typewriter calc(var(--animation-typing-speed) * 20) var(--animation-ease-typing) forwards;
  width: 0;
}

.animated-title:hover::after {
  content: '|';
  animation: blink var(--animation-cursor-blink) infinite;
  color: var(--color-accent);
  font-weight: normal;
}

/* Accessibility: respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animated-title:hover .text {
    animation: none;
    width: auto;
  }

  .animated-title:hover::after {
    animation: none;
    opacity: 1;
  }
}
```

### 3.4 Update HTML Templates

**File**: `src/_includes/partials/nav.njk`

**Find navigation links** and update:
```html
<ul class="nav-links">
  <li><a href="/" class="animated-title {% if page.url == '/' %}nav-active{% endif %}">
    <span class="text">home</span>
  </a></li>
  <li><a href="/about/" class="animated-title {% if page.url == '/about/' %}nav-active{% endif %}">
    <span class="text">about</span>
  </a></li>
  <li><a href="/explore/" class="animated-title {% if page.url == '/explore/' %}nav-active{% endif %}">
    <span class="text">explore</span>
  </a></li>
</ul>
```

**File**: `src/_includes/layouts/post.njk`

**Find post title** (around line 23):
```html
<h1 class="animated-title">
  <span class="text">{{ title }}</span>
</h1>
```

**File**: `src/index.njk`

**Find page title** and update similarly with animated-title class structure.

### 3.5 Test Animations
```bash
npm run dev
# Hover over navigation links, page titles, and post titles
# Verify typewriter effect with blinking cursor
```

---

## Step 4: Add Subtle Background Gradients (30 minutes)

### 4.1 Add Texture CSS Properties

**File**: `src/assets/css/style.css`

**Add to `:root` section**:
```css
  /* Texture properties */
  --texture-opacity: 0.015;
  --gradient-opacity: 0.008;
  --texture-size: 12px;
```

### 4.2 Add Background Texture Styles

**Add to end of `style.css`**:
```css
/* ==========================================================================
   Subtle Background Textures
   ========================================================================== */

/* Main content areas */
.post,
.page,
.post-preview {
  position: relative;
}

.post::before,
.page::before,
.post-preview::before {
  content: '';
  position: absolute;
  top: -1rem;
  left: -1rem;
  right: -1rem;
  bottom: -1rem;
  background:
    /* Subtle noise texture */
    radial-gradient(
      circle at 25% 25%,
      rgba(210, 105, 30, var(--texture-opacity)) 1px,
      transparent 1px
    ),
    /* Faint gradient */
    linear-gradient(
      135deg,
      rgba(210, 105, 30, var(--gradient-opacity)) 0%,
      transparent 30%
    );
  background-size: var(--texture-size) var(--texture-size), 100% 100%;
  border-radius: 4px;
  z-index: -1;
}

/* Site header enhancement */
.site-header {
  position: relative;
}

.site-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(
      to right,
      rgba(253, 251, 247, 0.8),
      rgba(210, 105, 30, var(--gradient-opacity)) 50%,
      rgba(253, 251, 247, 0.8)
    );
  z-index: -1;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .post::before,
  .page::before,
  .post-preview::before {
    /* Reduce texture complexity on mobile */
    background:
      linear-gradient(
        135deg,
        rgba(210, 105, 30, calc(var(--gradient-opacity) * 0.5)) 0%,
        transparent 50%
      );
    background-size: 100% 100%;
  }
}
```

### 4.3 Test Background Textures
```bash
npm run build
npm run dev
# Look for very subtle texture/gradient effects behind content
# Should be barely visible but add visual interest
```

---

## Step 5: Final Testing & Validation (20 minutes)

### 5.1 Visual Testing Checklist

- [ ] **Font**: Roboto Slab loads and displays across all pages
- [ ] **Color**: Links, buttons, accents use vibrant orange (#D2691E)
- [ ] **Animations**: Hover over titles shows typewriter effect with blinking cursor
- [ ] **Textures**: Very subtle background effects visible behind content
- [ ] **Mobile**: All effects work on smaller screens
- [ ] **Accessibility**: Animations disable with reduced motion preference

### 5.2 Performance Testing

```bash
# Build and check file sizes
npm run build

# Check built CSS size (should be similar to before)
ls -lh _site/assets/css/

# Test loading speed
npm run serve
# Use browser dev tools to check performance
```

### 5.3 Cross-browser Testing

Test in available browsers:
- Chrome/Chromium
- Firefox
- Safari (if on macOS)
- Edge

### 5.4 Accessibility Testing

**Test reduced motion**:
```css
/* Temporarily add to test */
* {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
```

**Test contrast ratios**: Use browser dev tools to verify color contrast meets WCAG AA standards.

---

## Troubleshooting

### Font not loading
- Check network tab for 404 errors on Google Fonts
- Verify font name spelling in CSS
- Clear browser cache

### Animations not working
- Check browser console for JavaScript errors
- Verify hover events on title elements
- Test with simplified animation first

### Colors look wrong
- Verify hex values are correct (#D2691E)
- Check if any hardcoded old colors remain
- Clear browser cache

### Performance issues
- Reduce texture complexity on mobile
- Check for excessive DOM reflows
- Simplify gradient patterns if needed

---

## Next Steps

After successful implementation:

1. **Commit changes**: `git add . && git commit -m "Implement rustic visual styling enhancements"`
2. **Test on staging**: Deploy to preview environment if available
3. **Get feedback**: Share with others for visual feedback
4. **Merge to main**: When satisfied, merge feature branch
5. **Deploy**: Push to production via GitHub Actions

## Files Modified Summary

- `src/_includes/layouts/base.njk` - Google Fonts link
- `src/assets/css/style.css` - Font, colors, animations, textures
- `src/_includes/partials/nav.njk` - Animation markup
- `src/_includes/layouts/post.njk` - Title animations
- `src/index.njk` - Homepage animations

**Total implementation time**: ~2-3 hours including testing
**Files modified**: 5 core files
**New dependencies**: None (uses existing Google Fonts infrastructure)
