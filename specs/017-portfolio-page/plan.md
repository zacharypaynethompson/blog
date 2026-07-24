# Implementation Plan: Portfolio Page

**Branch**: `017-portfolio-page` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-portfolio-page/spec.md`

## Summary

Add a dedicated `/portfolio/` page that showcases the author's work as cards, grouped into labelled categories (Academic/Publications, Professional/gov.uk reports, Code/GitHub). Each card carries a title, short description, optional metadata (role, year, tags) and zero-or-more typed links (e.g. "Read on gov.uk", "Download PDF", "View on GitHub"). Content is author-maintained in a single global data file; the page is rendered statically by Eleventy and reuses the existing site theme. Downloadable documents (PDFs) are hosted externally on the author's Dropbox and referenced by link — nothing binary lands in the repo. The page is fully server-rendered semantic HTML so both humans and agentic readers can parse the whole catalogue without executing JavaScript, and a navigation link makes it discoverable from every page.

## Technical Context

**Language/Version**: JavaScript ES2020+ (browser, none required at runtime for this feature), Node.js 18+ LTS (build)  
**Primary Dependencies**: Eleventy 2.x (`@11ty/eleventy`), Nunjucks templating, markdown-it (existing). No new dependencies.  
**Storage**: File-based — one global data file (`src/_data/portfolio.json`); no database. Documents hosted externally (Dropbox), referenced by URL only.  
**Testing**: vitest (`npm test`), html-validate (`npm run lint`), Playwright available for responsive/visual checks  
**Target Platform**: Static site served via GitHub Pages at path prefix `/blog/`  
**Project Type**: Static site (single project) — Eleventy 11ty blog  
**Performance Goals**: Page load < 3s on standard connection (constitution); LCP < 2.5s; no client-side JS required to render the catalogue  
**Constraints**: Must respect `pathPrefix: "/blog/"`; must work in light + dark themes; responsive 320px → desktop; grid no more than 3 cards across; zero binary documents committed to repo  
**Scale/Scope**: One new page, one data file, CSS additions, one nav link. Expected content volume: a handful to ~2 dozen projects across ~3 categories.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Simplicity First** — ✅ PASS
- No new dependencies (YAGNI honoured). Reuses Eleventy data cascade + Nunjucks + existing CSS custom properties.
- Single data file, single template, additive CSS. Flat structure; no new abstractions.

**II. Content-Centric Design** — ✅ PASS
- Author maintains content in a simple JSON data file, consistent with the site's content model.
- Fully static, server-rendered semantic HTML → fast reads, no JS dependency to view content (also satisfies the machine-readability requirement FR-013).
- Accessibility (WCAG 2.1 AA): semantic sections/headings, descriptive link text, keyboard-reachable links, sufficient contrast via existing theme tokens.
- SEO foundations: existing base layout supplies meta/OG tags; page provides a clear `<h1>` and semantic structure.

**III. Ship Early, Iterate Often** — ✅ PASS
- MVP = the page + nav link + first real entries (User Stories 1 & 2, both P1). Multi-link cards and richer metadata layer on without rework.
- Independently deployable increment on a feature branch; main stays deployable.
- Images/thumbnails explicitly deferred (spec Assumptions) — no speculative work.

**Quality Standards** — ✅ PASS: responsive design required (FR-009), passes `html-validate`, styling via existing custom properties for consistency, no performance regression (static page, no JS).

**Development Workflow** — ✅ PASS: work on `017-portfolio-page`, manual verification + tests before merge, CLAUDE.md/docs updated as user-facing change.

**Result: PASS — no violations. Complexity Tracking not required.**

## Project Structure

### Documentation (this feature)

```text
specs/017-portfolio-page/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── portfolio-data.schema.json   # Phase 1 output — shape of portfolio.json
├── checklists/
│   └── requirements.md  # Spec quality checklist (already created)
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── _data/
│   ├── site.json                 # existing
│   └── portfolio.json            # NEW — categories + projects (author-maintained content)
├── _includes/
│   ├── layouts/
│   │   └── page.njk              # existing (reused, or base.njk directly)
│   └── partials/
│       ├── nav.njk               # MODIFIED — add "portfolio" link + aria-current
│       └── portfolio-card.njk    # NEW (optional) — single-card macro/partial
├── assets/
│   └── css/
│       └── style.css             # MODIFIED — add .portfolio-* styles (custom-prop driven)
└── portfolio.njk                 # NEW — page template (permalink /portfolio/), renders grid from data

eleventy.config.js                # NO functional change required (data file auto-loaded via cascade)
CLAUDE.md                         # MODIFIED — note new page under Project Structure / Recent Changes
```

**Structure Decision**: Single-project static site (Eleventy). The portfolio follows the same pattern as the existing `about` page (a top-level template with frontmatter + permalink) and the existing global data convention (`src/_data/*.json` auto-exposed to templates). Content is decoupled from presentation: `portfolio.njk` iterates over `portfolio.json` and emits semantic HTML, so adding a project is a pure content edit (satisfies FR-010 / SC-004). No Eleventy collection or config change is needed because the data lives in `_data` rather than being derived from files. A small `portfolio-card.njk` partial keeps the template DRY but is optional for the MVP.

## Complexity Tracking

> No constitution violations — section intentionally empty.
</content>
