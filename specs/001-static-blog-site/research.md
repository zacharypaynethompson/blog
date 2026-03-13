# Research: static personal blog

**Date**: 2026-03-13
**Branch**: `001-static-blog-site`

This document captures technical research and decisions made during planning.

---

## 1. Static Site Generator: Eleventy 2.x

### Decision: Use Eleventy with Nunjucks templating

**Rationale**:
- Eleventy is minimal by design (no client JS by default), aligning with constitution principle I (Simplicity First)
- Nunjucks provides async filter support and named arguments for shortcodes
- Official `eleventy-base-blog` starter uses this combination, ensuring community support
- Markdown for content, Nunjucks for templates = clear separation

**Alternatives Considered**:
- **Liquid**: More Jekyll-like but lacks async support in `{% set %}` blocks
- **JavaScript templates (.11ty.js)**: Maximum flexibility but higher cognitive overhead
- **Hugo/Astro**: More features but more complexity; Eleventy matches our minimal aesthetic

### Directory Structure Decision

```text
src/
├── posts/           # Blog posts (markdown)
├── pages/           # Static pages (about.md)
├── _includes/       # Layouts and partials (Nunjucks)
├── _data/           # Global data (site.json)
├── assets/          # CSS, JS, images
├── index.njk        # Homepage
└── explore.njk      # Explore page
```

**Rationale**: Flat structure avoids deep nesting (constitution I). Using `src/` as input
directory keeps root clean for config files.

### Tag Pages

**Decision**: Use Eleventy's built-in pagination over `collections` object

**Rationale**:
- Tag pages auto-generate from post frontmatter tags
- Zero maintenance: add a tag to a post, page appears automatically
- No centralized tag registry needed

### JSON Output for Visualization

**Decision**: Generate JSON at build time via custom permalink

**Rationale**:
- Create a template with `permalink: /data/graph.json` that outputs visualization data
- Pre-computing relationships server-side avoids client-side array operations
- No additional plugins required

### GitHub Pages Deployment

**Decision**: GitHub Actions workflow deploying to `gh-pages` branch

**Rationale**:
- Official Eleventy recommendation
- Can cache `.cache` folder for faster builds
- `peaceiris/actions-gh-pages` action is well-maintained
- For `username.github.io` sites, no `--pathprefix` needed

---

## 2. Network Visualization: d3.js 7.x

### Decision: SVG-based force-directed graph with Pointer Events

**Rationale**:
- SVG is performant up to ~500 nodes; our scale (50-200) is well within range
- SVG provides built-in DOM events (no manual hit-testing like Canvas)
- Pointer Events API handles mouse, touch, and stylus uniformly

### Force Simulation Configuration

**Decisions**:
- `forceLink`: Distance 50-80px, default strength (auto-scales for hub nodes)
- `forceManyBody`: Strength -80 to -120 (moderate repulsion)
- `forceCenter`: Center of viewport
- `forceCollide`: Radius based on node size (prevents overlap)
- `velocityDecay`: 0.5-0.6 (more damping for restrained animation)

**Rationale**:
- Higher velocity decay creates restrained, minimal movement matching site aesthetic
- Default link strength formula naturally handles hub posts (many tags)
- Barnes-Hut approximation (default theta 0.9) gives O(n log n) performance

### Mobile/Touch Handling

**Decisions**:
- Use `pointerenter`/`pointerleave` for hover highlighting
- Use `click` event for navigation
- Apply `touch-action: manipulation` CSS to eliminate 300ms tap delay
- Minimum touch target: 44x44px

**Rationale**:
- Pointer Events work across all input types without separate handlers
- `touch-action: manipulation` preserves pinch-zoom while removing tap delay

### Performance

**Decisions**:
- Animate only `transform` and `opacity` (GPU-composited)
- Stop simulation when settled; reheat on interaction
- Consider pre-computing initial positions at build time

**Rationale**:
- Transform-based positioning uses compositor thread
- Pre-computed positions give instant display on load

### Accessibility

**Decisions**:
- SVG gets `role="img"` with `<title>` and `<desc>`
- Provide visually-hidden HTML list as alternative to graph
- Nodes get `tabindex="0"` and `role="button"` for keyboard navigation
- Respect `prefers-reduced-motion` media query

**Rationale**:
- Data visualizations need structured alternatives for screen readers
- Keyboard navigation ensures the feature is usable without a mouse

---

## 3. Visual Design: Typography & Color

### Color Palette Decision

**Light Theme**:
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FDFBF7` | Warm off-white/cream |
| Primary Text | `#2D2D2D` | Warm charcoal (not pure black) |
| Secondary Text | `#5C5C5C` | Metadata, dates |
| Accent | `#B7410E` | Rusty orange - links, highlights |
| Accent Hover | `#8A3009` | Darker rust |
| Borders | `#E8E4DF` | Warm light gray |

**Rationale**:
- Warm tones create the rustic feel requested
- `#B7410E` is a true rust color with good contrast for large text/accents
- Off-white background is easier on eyes than pure white
- Charcoal text avoids harsh contrast while remaining readable

**WCAG Compliance Note**: Rusty orange passes AA for large text (18px+) but NOT for
small body text on white. Use for links, headings, accents only.

### Typography Decision

**Fonts**:
- **Headings**: Bitter (slab serif) - rustic, editorial feel, blocky
- **Body**: Bitter (same) - designed for screen reading, maintains consistency

**Alternative Pairing**: Archivo Black (headings) + IBM Plex Sans (body)

**Settings**:
- Base size: 18-20px
- Line height: 1.6
- Scale: 1.25 (Major Third)

**Rationale**:
- Slab serifs feel more rustic than geometric sans-serifs
- Single font family reduces HTTP requests and maintains visual cohesion
- Bitter is specifically designed for comfortable screen reading

### Lowercase Headings

**Decision**: Apply `text-transform: lowercase` via CSS

**Rationale**:
- No accessibility concerns (screen readers read underlying text)
- Separates presentation from content
- Author writes in normal sentence case; CSS handles visual styling

---

## 4. Build & Deployment

### GitHub Actions Workflow

**Decision**: Deploy on push to main, use caching

**Cache targets**:
- `node_modules` (npm cache)
- `.cache` folder (Eleventy fetch/image cache)

**Rationale**:
- Caching significantly improves build times
- Automatic deployment ensures main branch is always live

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| Templating language? | Nunjucks (async support, official starter) |
| How to generate tag pages? | Built-in pagination over collections |
| How to output graph JSON? | Custom permalink template |
| Mobile touch handling? | Pointer Events + touch-action CSS |
| Graph accessibility? | Hidden list alternative + keyboard nav |
| Font choice? | Bitter (slab serif) for both headings and body |
| Orange hex value? | #B7410E (rust) for accents |

---

## References

- Eleventy documentation: https://www.11ty.dev/docs/
- d3-force documentation: https://d3js.org/d3-force
- WCAG 2.1 AA guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Google Fonts Bitter: https://fonts.google.com/specimen/Bitter
