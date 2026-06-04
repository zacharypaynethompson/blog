---
description: "Task list for Portfolio Page implementation"
---

# Tasks: Portfolio Page

**Input**: Design documents from `/specs/017-portfolio-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: A single lightweight data-shape test is included because the plan (research.md "Testing approach") calls for guarding `portfolio.json` against malformed content. No other tests are requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in each description

## Path Conventions

Single-project static site (Eleventy). Source under `src/`, repo root for config. Paths below are absolute-relative to repo root `/home/ubuntu/git/zacharypaynethompson/blog/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the content data file and seed it so every later phase has something to render.

- [X] T001 Create `src/_data/portfolio.json` with the top-level shape `{ "intro": "", "categories": [] }` per data-model.md, conforming to `specs/017-portfolio-page/contracts/portfolio-data.schema.json`.
- [X] T002 [P] Seed `src/_data/portfolio.json` with the three initial categories (`academic`, `professional`, `code`) and one real placeholder project each (this blog under `code`; the gov.uk labour market report under `professional`; the Manchester Centre for Health Economics citation under `academic`) per the example in data-model.md.

**Checkpoint**: A valid, populated data file exists.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the page template and base styling scaffold that all three user stories build on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Create `src/portfolio.njk` with frontmatter (`layout: layouts/base.njk`, `title: portfolio`, `permalink: /portfolio/`) and an `<h1>portfolio</h1>` plus optional intro paragraph from `portfolio.intro`; renders an empty `<main>` body for now. Use `base.njk` (not `page.njk`) per research.md Decision 2.
- [X] T004 [P] Add a `.portfolio-*` style block scaffold to `src/assets/css/style.css` (page container, section, grid placeholder) using existing CSS custom properties only — no new colours/fonts, no new dependency.

**Checkpoint**: `/blog/portfolio/` builds and serves a styled, empty page.

---

## Phase 3: User Story 1 - Browse a showcase of work (Priority: P1) 🎯 MVP

**Goal**: Visitor sees a curated, categorised list of projects, each with at least a title and description, in author-controlled order.

**Independent Test**: Load `/blog/portfolio/`; confirm category sections render with cards showing title + description; emptying `categories` shows a friendly placeholder.

### Tests for User Story 1

- [X] T005 [P] [US1] Add `tests/portfolio-data.test.js` (vitest) asserting `src/_data/portfolio.json` parses, every category has `id`/`name`/`projects`, every project has non-empty `title` + `description`, and every link (if present) has `label` + `url` — per data-model.md validation rules.

### Implementation for User Story 1

- [X] T006 [US1] In `src/portfolio.njk`, loop over `portfolio.categories` rendering each as a semantic `<section>` with an `id` anchor and `<h2>` heading + optional `blurb` (FR-003, FR-012).
- [X] T007 [US1] Within each category section in `src/portfolio.njk`, render projects into a card grid container, each card a semantic element (e.g. `<article>`) showing `title` (`<h3>`) and `description` (FR-002, FR-004).
- [X] T008 [US1] In `src/portfolio.njk`, conditionally render optional `role`, `year`, and `tags` per project, omitting each cleanly when absent (FR-004, Edge Cases).
- [X] T009 [US1] Add an empty-state guard in `src/portfolio.njk`: if there are no projects across all categories, render a friendly "work being added" message instead of empty markup (FR-011, US1 scenario 3).
- [X] T010 [US1] Implement the responsive card grid in `src/assets/css/style.css` using CSS Grid `repeat(auto-fit, minmax(...))` capped at 3 columns, stacking to 1 column at 320px, equal-height cards, driven by existing custom properties (FR-002, FR-009, SC-003); verify light + dark theming (FR-006, SC-005).

**Checkpoint**: Portfolio page is a fully functional, responsive, themed, categorised showcase — independently demoable MVP.

---

## Phase 4: User Story 2 - Reach the portfolio from site navigation (Priority: P1)

**Goal**: Visitor can reach the portfolio in one click from any page's main nav, with active-state indication.

**Independent Test**: From any page, the nav shows a "portfolio" link; clicking it lands on `/blog/portfolio/` with `aria-current="page"` set.

### Implementation for User Story 2

- [X] T011 [US2] Add a portfolio link to `src/_includes/partials/nav.njk` — `<li><a href="{{ '/portfolio/' | url }}" {% if page.url == "/portfolio/" %}aria-current="page"{% endif %}>portfolio</a></li>` placed after the explore item, matching the existing nav pattern (FR-007, SC-001).

**Checkpoint**: Portfolio is discoverable site-wide; US1 + US2 both work.

---

## Phase 5: User Story 3 - Follow a project to learn more (Priority: P2)

**Goal**: Each card renders its zero-or-more typed links as clear, labelled actions leading to the right destinations; cards with no links show no empty/broken link.

**Independent Test**: Open the page; a card with links shows labelled actions ("Read on gov.uk", "Download PDF", "View on GitHub") that resolve; a card with no `links` shows no link block.

### Implementation for User Story 3

- [X] T012 [US3] In `src/portfolio.njk`, render each project's `links` array as a list of anchors using `link.label` as visible text and `link.url` as href, only when the array is present and non-empty (FR-005, FR-013, US3 scenarios 1 & 2).
- [X] T013 [P] [US3] Style the card link/action area in `src/assets/css/style.css` so multiple links sit as distinct, clearly labelled actions without crowding or breaking the card layout (Edge Cases — multi-link cards).
- [X] T014 [US3] Ensure external links behave consistently with the rest of the site and that Dropbox document URLs use direct-download form (`?dl=1`) in `src/_data/portfolio.json`; confirm descriptive link text for machine-readability (FR-006, FR-013, research.md Decision 4).

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, docs, and final checks across the feature.

- [X] T015 [P] Update `CLAUDE.md` Project Structure section to list `src/portfolio.njk` and `src/_data/portfolio.json` (user-facing change per constitution Development Workflow).
- [X] T016 Run `npm run lint` (html-validate) and fix any markup issues in `src/portfolio.njk` and `src/_includes/partials/nav.njk`.
- [X] T017 Run `npm test` (vitest) and `npm run build`; confirm both pass and `_site/portfolio/index.html` is generated with all content present in static HTML (SC-008).
- [X] T018 Execute the `specs/017-portfolio-page/quickstart.md` "Verify before merging" checklist: responsive at 320px + desktop, light + dark themes, every link resolves (incl. Dropbox downloads), no-link and multi-link cards both render (SC-003, SC-005, SC-006).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational. US1 and US2 are both P1; US3 is P2. They touch mostly different files and can proceed in parallel after Phase 2, though US3 builds on the card markup from US1.
- **Polish (Phase 6)**: Depends on all targeted user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational. The core MVP.
- **US2 (P1)**: Depends only on Foundational. Fully independent of US1 (edits `nav.njk` only).
- **US3 (P2)**: Depends on Foundational; integrates with the card markup produced in US1 (T012 extends the card from T007). Best done after US1.

### Within Each User Story

- Data-shape test (T005) can be written before or alongside US1 implementation.
- Template markup before CSS where the CSS targets new elements.
- Story complete before moving to next priority.

### Parallel Opportunities

- T002 [P] runs alongside finishing T001's structure.
- T004 [P] (CSS scaffold) runs alongside T003 (template scaffold).
- T005 [P] (data test) runs independently of all template work.
- US2 (T011) can run fully in parallel with US1 — it only edits `nav.njk`.
- T013 [P] (link styling) and T015 [P] (docs) are isolated-file tasks.

---

## Parallel Example: After Foundational (Phase 2)

```bash
# US2 is independent of US1 — do it in parallel:
Task: "Add portfolio link to src/_includes/partials/nav.njk (T011)"

# Alongside US1 work:
Task: "Add tests/portfolio-data.test.js data-shape test (T005)"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Phase 1: Setup (T001–T002).
2. Phase 2: Foundational (T003–T004).
3. Phase 3: User Story 1 (T005–T010) — the showcase.
4. Phase 4: User Story 2 (T011) — the nav link (cheap, makes it discoverable).
5. **STOP and VALIDATE**: Both P1 stories independently testable → deployable MVP.

### Incremental Delivery

1. Setup + Foundational → page builds.
2. US1 → categorised, responsive, themed showcase → demo.
3. US2 → discoverable from nav → demo.
4. US3 → typed links / downloads → demo.
5. Polish → lint, test, build, quickstart verification.

---

## Notes

- [P] = different files, no dependency on incomplete tasks.
- No new runtime dependencies — vanilla Eleventy/Nunjucks/CSS per the constitution (Simplicity First).
- PDFs are NOT committed; only Dropbox URLs are referenced (research.md Decision 4).
- Page must remain fully functional with JavaScript disabled (FR-013, SC-008).
- Commit after each task or logical group; main stays deployable.
</content>
