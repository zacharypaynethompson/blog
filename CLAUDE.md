# blog Development Guidelines

Personal blog built with Eleventy 2.x (static site generator). Last updated: 2026-03-26

## Tech Stack
- **Build**: Node.js 18+ LTS, Eleventy 2.x (`@11ty/eleventy`)
- **Frontend**: JavaScript ES2020+ (browser), CSS Custom Properties, Google Fonts
- **Visualization**: D3.js 7.x (network graph), Canvas 2D API (hero physics banner)
- **Content**: Markdown posts with YAML frontmatter

## Project Structure

```text
src/
  _data/           # Global data files (site.json)
  _includes/       # Layouts (base, page, post) and partials (nav, footer, etc.)
  assets/
    css/           # style.css (main), network-graph.css (graph-specific)
    js/            # network-graph.js, hero-physics.js, explore.js, content-search.js, etc.
  data/            # Eleventy data templates (graph JSON, search index)
  pages/           # Static pages (about.md)
  posts/           # Blog posts (markdown with frontmatter)
  explore.njk      # Explore page with network graph + post list
  index.njk        # Homepage with hero banner
  tags.njk         # Tags listing page
specs/             # Feature specifications (001-004)
```

## Commands

- `npm run dev` — Start dev server with live reload
- `npm run build` — Build static site to `_site/`
- `npm test` — Run tests (vitest)
- `npm run lint` — Lint templates (html-validate)
- `npm test && npm run lint` — Full check

## Code Style

JavaScript: ES2020+ standard conventions. CSS: BEM-like class naming with CSS Custom Properties for theming.

## Feature Specs

Feature specifications live in `specs/` with numbered prefixes:
- **001-static-blog-site**: Core Eleventy blog setup, layouts, post system
- **002-rustic-styling**: Visual styling — CSS custom properties, Google Fonts, animations
- **003-obsidian-network-graph**: Interactive D3.js force-directed graph on explore page
- **004-hero-physics-simulation**: Canvas-based constellation hero banner with cursor physics

## Recent Changes
- 006-blog-comments: Added JavaScript ES2020+ (browser), CSS3, Nunjucks templates + Giscus widget (`https://giscus.app/client.js`, loaded via script tag — no npm package)
- 006-blog-comments: Added JavaScript ES2020+ (browser), CSS3, Nunjucks templates + None new for frontend (vanilla JS, CSS); one BaaS provider for comment storage
- 005-title-animation-variants: Added JavaScript ES2020+ (browser), CSS3, Nunjucks templates + None (vanilla JS, CSS animations/transforms — no new dependencies)

## Gotchas

- **pathPrefix and URLs**: The site is deployed at `/blog/` on GitHub Pages. Relative links in markdown posts must include the `/blog/` prefix (e.g. `/blog/posts/my-post/`, not `/posts/my-post/`).

## Active Technologies
- JavaScript ES2020+ (browser), CSS3, Nunjucks templates + Giscus widget (`https://giscus.app/client.js`, loaded via script tag — no npm package) (006-blog-comments)
- GitHub Discussions (managed by GitHub; no custom database) (006-blog-comments)
