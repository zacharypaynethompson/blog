# Implementation Plan: Blog Comments (Giscus)

**Branch**: `006-blog-comments` | **Date**: 2026-03-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-blog-comments/spec.md`

## Summary

Add a Giscus-powered comments section to every blog post. Giscus uses GitHub Discussions as the comment backend — no external database or service needed beyond GitHub. Readers authenticate via GitHub to comment; anyone can read comments without signing in. Two custom CSS themes (light and dark) ensure the widget visually matches the blog's existing rustic aesthetic. The existing theme toggle is extended to dynamically switch the Giscus theme via `postMessage`.

## Technical Context

**Language/Version**: JavaScript ES2020+ (browser), CSS3, Nunjucks templates
**Primary Dependencies**: Giscus widget (`https://giscus.app/client.js`, loaded via script tag — no npm package)
**Storage**: GitHub Discussions (managed by GitHub; no custom database)
**Testing**: Vitest (existing), manual browser verification
**Target Platform**: GitHub Pages (static hosting), modern browsers
**Project Type**: Static site (Eleventy 2.x)
**Performance Goals**: Comments section adds <1s to page load (SC-003); async iframe load, non-blocking
**Constraints**: No server-side processing; all configuration is static; theme CSS must be hosted as static assets accessible by the Giscus iframe
**Scale/Scope**: Low traffic personal blog, colleague-based audience

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check

| Principle | Status | Notes |
|---|---|---|
| **I. Simplicity First** | PASS | Giscus is a single script tag — the simplest possible comment solution for a static site |
| YAGNI | PASS | No custom comment UI, no spam tooling, no notification system — all deferred |
| Minimal Dependencies | PASS | No npm packages added; Giscus loads externally via script tag; custom themes are plain CSS files |
| Flat Structures | PASS | 4 new files in existing directories, no new directory hierarchy |
| Single Responsibility | PASS | `comments.njk` = markup; `giscus-light/dark.css` = theme; theme switching = few lines in existing toggle |
| **II. Content-Centric** | PASS | Comments enhance content engagement; async iframe doesn't block page rendering |
| Fast Reads | PASS | Giscus loads async; page content renders immediately; comment iframe loads independently |
| Accessible by Default | PASS | Giscus provides accessible form controls; keyboard navigation works in iframe |
| SEO Foundations | PASS | Comments in iframe don't affect static HTML SEO; structured data already in place |
| **III. Ship Early** | PASS | Widget integration is a single deployable increment; custom themes can follow |
| Working State Always | PASS | If Giscus fails to load, post page is completely unaffected |

### Post-Design Check

| Principle | Status | Notes |
|---|---|---|
| Minimal Dependencies | PASS | Research confirmed: Giscus script tag + 2 CSS files + 1 partial. No npm packages. |
| Single Responsibility | PASS | 4 new files, 2 minor modifications. Each file has one job. |
| Fast Reads | PASS | Script is `async`; iframe loads independently of page content. |
| Performance Budget | PASS | Giscus iframe loads after page paint; no impact on LCP/FID/CLS. |
| Accessible by Default | PASS | Giscus handles form accessibility; custom themes maintain contrast ratios. |

## Project Structure

### Documentation (this feature)

```text
specs/006-blog-comments/
├── plan.md              # This file
├── research.md          # Phase 0: Giscus configuration, custom themes, setup requirements
├── data-model.md        # Phase 1: GitHub Discussions entity model
├── quickstart.md        # Phase 1: implementation overview and color mapping
├── contracts/
│   └── comments-api.md  # Phase 1: Giscus widget integration contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── _includes/
│   ├── layouts/
│   │   ├── base.njk          # MODIFY: extend theme toggle to switch Giscus theme
│   │   └── post.njk          # MODIFY: include comments partial after .post-content
│   └── partials/
│       └── comments.njk      # NEW: Giscus script tag + container div
└── assets/
    └── css/
        ├── giscus-light.css   # NEW: custom Giscus theme (light mode)
        └── giscus-dark.css    # NEW: custom Giscus theme (dark mode)

giscus.json                    # NEW: repository-root config (origins, comment order)
```

**Structure Decision**: Follows existing project conventions — partials in `_includes/partials/`, CSS in `assets/css/`. The `giscus.json` goes at repo root per Giscus requirements. No new directories needed.

## Complexity Tracking

No constitution violations to justify. All choices align with existing patterns and principles.
