# Implementation Plan: static personal blog

**Branch**: `001-static-blog-site` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-static-blog-site/spec.md`

## Summary

Build a minimal, static personal blog hosted on GitHub Pages using Eleventy (11ty) as the
static site generator. The site features markdown-based content authoring, a distinctive
visual design (rusty orange accent, lowercase headings, rustic typography), and an
interactive explore page with a d3.js network visualization connecting posts by shared tags.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+ LTS)
**Primary Dependencies**: Eleventy 2.x (static site generator), d3.js 7.x (visualization)
**Storage**: Flat files (markdown posts, JSON build artifacts)
**Testing**: Manual browser testing; optional Playwright for e2e
**Target Platform**: GitHub Pages (static hosting), modern browsers
**Project Type**: Static site / JAMstack
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals "Good")
**Constraints**: No server-side logic, no database, minimal JavaScript payload
**Scale/Scope**: Single author, ~50-200 posts over time, 3 main pages + post pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Simplicity First

| Checkpoint | Status | Evidence |
|------------|--------|----------|
| YAGNI | ✅ PASS | Only features in spec implemented; no CMS, no comments, no analytics |
| Minimal Dependencies | ✅ PASS | 2 runtime deps (Eleventy, d3.js) - both justified below |
| Flat Structures | ✅ PASS | Single-level src structure; no deep nesting |
| Single Responsibility | ✅ PASS | Clear separation: content, templates, styles, visualization |

**Dependency Justification**:
- **Eleventy**: Required for markdown→HTML, templating, collections. Alternative (raw HTML)
  would violate Content-Centric Design (slow authoring).
- **d3.js**: Required for explore page network graph (FR-008, FR-016-020). No simpler
  alternative provides force-directed graph with hover/click interactions.

### II. Content-Centric Design

| Checkpoint | Status | Evidence |
|------------|--------|----------|
| Markdown First | ✅ PASS | All posts authored as .md with YAML frontmatter |
| Fast Reads | ✅ PASS | Static HTML, minimal JS, performance budget enforced |
| Accessible by Default | ✅ PASS | Semantic HTML, ARIA labels, contrast ratios in design |
| SEO Foundations | ✅ PASS | Meta tags, Open Graph, structured data planned |

### III. Ship Early, Iterate Often

| Checkpoint | Status | Evidence |
|------------|--------|----------|
| MVP Mindset | ✅ PASS | P1 stories (read, browse, publish) deliverable first |
| No Big Bang | ✅ PASS | User stories structured for incremental delivery |
| Working State Always | ✅ PASS | Each phase produces deployable site |
| Feedback Loops | ✅ PASS | Deploy to GitHub Pages enables live testing |

**Gate Status**: ✅ PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-static-blog-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (frontmatter schema)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── posts/               # Markdown blog posts with frontmatter
├── pages/               # Static pages (about.md)
├── _includes/           # Nunjucks templates (layouts, partials)
│   ├── layouts/
│   │   ├── base.njk     # Base HTML structure
│   │   ├── post.njk     # Single post layout
│   │   └── page.njk     # Static page layout
│   └── partials/
│       ├── nav.njk      # Site navigation
│       ├── footer.njk   # Site footer
│       └── post-meta.njk # Post metadata (date, tags)
├── _data/               # Global data files
│   └── site.json        # Site metadata (title, description, url)
├── assets/
│   ├── css/
│   │   └── style.css    # All styles (single file, CSS custom properties)
│   └── js/
│       └── explore.js   # d3.js visualization (explore page only)
├── explore.njk          # Explore page template
└── index.njk            # Homepage template

_site/                   # Build output (gitignored)
```

**Structure Decision**: Flat Eleventy project at repository root. No separate frontend/backend
since this is a purely static site. The `src/` directory contains all source content and
templates; `_site/` is the build output deployed to GitHub Pages.

## Complexity Tracking

> No violations requiring justification. All choices align with constitution.
