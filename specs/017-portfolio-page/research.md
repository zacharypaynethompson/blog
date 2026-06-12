# Research: Portfolio Page

**Feature**: 017-portfolio-page | **Date**: 2026-06-04

No `NEEDS CLARIFICATION` markers remained after `/speckit.clarify`; the technical context is fully resolved by inspecting the existing codebase. This document records the design decisions, their rationale, and the alternatives considered.

## Decision 1: Content lives in a global data file (`src/_data/portfolio.json`)

- **Decision**: Store all categories and projects in a single JSON file under `src/_data/`, exposed to templates automatically via Eleventy's data cascade as the `portfolio` global.
- **Rationale**: Mirrors the existing `site.json` convention. Adding/editing/reordering a project becomes a pure content edit with no template or config change (satisfies FR-010 and SC-004 — "add a project in under 5 minutes"). Keeps presentation (`portfolio.njk`) cleanly separated from data. JSON is trivially machine-readable, aiding the agentic-reader requirement.
- **Alternatives considered**:
  - *One markdown file per project (a collection, like `posts/`)*: more ceremony than needed for ~a dozen short entries with no long-form body; would require an Eleventy collection and ordering logic. Rejected for YAGNI (Constitution I).
  - *Inline data directly in the Nunjucks template*: couples content to markup, harder to maintain, violates separation of concerns. Rejected.
  - *YAML data file*: equally valid in Eleventy, but JSON matches the existing `site.json` and is the most universally parseable for an external/agentic reader. Chosen JSON.

## Decision 2: Page is a top-level Nunjucks template (`src/portfolio.njk`, permalink `/portfolio/`)

- **Decision**: Create `src/portfolio.njk` with frontmatter `permalink: /portfolio/` using the existing `layouts/base.njk` (or `page.njk`), iterating over `portfolio.categories` to render category sections and cards.
- **Rationale**: Identical pattern to `src/explore.njk` and `src/pages/about.md`. Server-rendered HTML means the full catalogue is present in the page source with no JS (satisfies FR-013 / SC-008). Honours `pathPrefix: "/blog/"` automatically through Eleventy's `url` filter.
- **Alternatives considered**:
  - *`page.njk` layout*: gives a standard `<h1>` page header but wraps content in a narrow `.page` container (`--max-width: 42rem`) which is too narrow for a 3-column grid. **Use `base.njk` directly** so the grid can use its own wider, responsive container — matching how `explore.njk` opts out of the narrow page layout. Recorded as the chosen approach.

## Decision 3: Responsive card grid via CSS Grid + custom properties, max 3 across

- **Decision**: Lay out cards with CSS Grid using `repeat(auto-fit, minmax(<min>, 1fr))` capped at 3 columns (e.g. via a `max-width` on the grid or an explicit `grid-template-columns` with media queries), driven entirely by the existing CSS custom properties in `style.css`.
- **Rationale**: `auto-fit` + `minmax` gives natural responsiveness (3 → 2 → 1 columns as width shrinks to 320px) with no JavaScript, satisfying FR-002/FR-009/SC-003. Reusing the existing colour, spacing, border and font tokens guarantees light/dark theme support and visual consistency (FR-006/FR-008/SC-005) for free.
- **Alternatives considered**:
  - *Flexbox with wrapping*: workable but `minmax` grid handles equal-height rows and column capping more cleanly. Grid chosen.
  - *A CSS framework / utility library*: rejected — new dependency, violates Simplicity First.

## Decision 4: Documents hosted externally on Dropbox, referenced by URL

- **Decision**: PDFs and other downloadable documents are NOT committed to the repo. Each project's link list contains a plain URL to the Dropbox-hosted file; the author maintains those files and links.
- **Rationale**: Direct user decision (clarification session 2026-06-04). Keeps the repository free of large binaries, keeps the GitHub Pages site lean, and the author retains full control. A typed link ("Download PDF") renders identically whether it points to Dropbox, gov.uk, or GitHub.
- **Operational note**: External links can rot if a file is moved/renamed or its share settings change. Mitigation: the existing test/lint flow plus a link check before publishing (see quickstart). For a direct download rather than a Dropbox preview page, use the `?dl=1` query parameter on the share URL.
- **Alternatives considered**:
  - *Commit PDFs to `src/assets/`*: previously the default; rejected by the user — bloats the repo, and some documents are large. Within GitHub limits but not preferred.
  - *Academic archive (Zenodo/OSF) with DOIs*: better for formal citation but more per-document setup than the author wants now; not precluded later (a card link can point anywhere).

## Decision 5: Typed links modelled as a list of `{ label, url }` per project

- **Decision**: Each project has a `links` array; each entry has a human/agent-readable `label` (e.g. "Read on gov.uk") and a `url`. Optional `type` may be added later for icons, but the MVP needs only label + url.
- **Rationale**: Supports FR-005 (zero, one, or several links) directly. Descriptive `label` doubles as accessible, machine-readable link text (FR-013). Cards with an empty/absent array simply render no link block (no broken/empty links — FR-003/User Story 3 scenario 2).
- **Alternatives considered**: A single `url` field (rejected — spec requires multiple typed links). A fixed schema of named slots (`govUk`, `pdf`, `github`) — rejected as inflexible; a generic list scales to any link type.

## Decision 6: Navigation link with active-state, matching existing items

- **Decision**: Add `<li><a href="{{ '/portfolio/' | url }}" {% if page.url == "/portfolio/" %}aria-current="page"{% endif %}>portfolio</a></li>` to `src/_includes/partials/nav.njk`, placed alongside home/about/explore.
- **Rationale**: Reuses the exact existing nav pattern (`aria-current="page"` for active state), satisfying FR-007/SC-001 and keeping the nav consistent. Single-click reachable from every page because nav is in `base.njk`.
- **Alternatives considered**: A footer-only link (rejected — less discoverable, fails "single click from main navigation"). Placement order is a minor stylistic choice; default to after `explore`.

## Decision 7: Empty-state handling

- **Decision**: The template guards on whether any projects exist; if `portfolio.categories` is empty or every category has no projects, render a friendly placeholder message instead of empty markup.
- **Rationale**: Satisfies FR-011 and User Story 1 scenario 3. Cheap Nunjucks conditional.
- **Alternatives considered**: None warranted.

## Testing approach

- **`npm run lint`** (html-validate over `src/**/*.njk`) — guards valid, semantic markup.
- **`npm test`** (vitest) — add a small test asserting `portfolio.json` parses and conforms to the documented shape (each project has `title` + `description`; each link has `label` + `url`), so malformed content fails fast.
- **Playwright (available)** — optional responsive/theme spot-check at 320px and desktop, light and dark, for SC-003/SC-005.
- **Manual link check** — verify every link (especially Dropbox documents) resolves before publishing (SC-006).
</content>
