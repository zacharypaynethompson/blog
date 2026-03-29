# Research: Blog Comments (Giscus)

**Feature**: 006-blog-comments
**Date**: 2026-03-29

## R1: Comment Infrastructure — Giscus via GitHub Discussions

**Decision**: Use Giscus, a lightweight widget that maps blog posts to GitHub Discussions. Comments are stored as Discussion replies on the blog's own GitHub repository.

**Rationale**: Giscus requires zero external infrastructure beyond what the project already uses (GitHub). It provides authentication (GitHub OAuth), threading, Markdown formatting, content sanitization, and moderation — all natively via GitHub Discussions. This is the simplest possible solution for a static site on GitHub Pages, fully aligned with the constitution's Simplicity First principle.

**Alternatives considered**:

| Alternative | Rejected Because |
|---|---|
| BaaS (Supabase/Firebase) | Requires setting up and maintaining an external service; adds an external dependency when GitHub can handle everything |
| Utterances (GitHub Issues) | Similar concept but uses Issues instead of Discussions; Discussions are purpose-built for threaded conversations |
| Disqus | Heavy third-party widget with ads/tracking; violates Simplicity First and performance budget |
| Staticman | Complex setup; comments not visible until site rebuilds — violates SC-002 |
| Self-hosted API | Requires server maintenance; overkill for low-traffic personal blog |

## R2: Giscus Widget Configuration

**Decision**: Embed Giscus via its `<script>` tag with the following configuration:

| Attribute | Value | Rationale |
|---|---|---|
| `data-repo` | `zacharypaynethompson/blog` (or actual repo) | The blog's GitHub repository |
| `data-mapping` | `pathname` | Maps posts by URL path (per clarification session); stable across title changes |
| `data-strict` | `1` | Use strict SHA-1 hash matching to prevent false Discussion matches |
| `data-reactions-enabled` | `1` | Allow emoji reactions on the main discussion (lightweight engagement) |
| `data-emit-metadata` | `0` | No need to emit metadata to parent page |
| `data-input-position` | `bottom` | Comment input at bottom (natural reading flow) |
| `data-lang` | `en` | English UI |
| `data-category` | Announcements (recommended) | Restricts who can create new Discussions, preventing spam |

**Source**: https://giscus.app/ — the `data-repo-id` and `data-category-id` values must be obtained from the Giscus configurator at setup time.

## R3: Custom Theme for Giscus

**Decision**: Create two custom CSS theme files (light and dark) hosted as static assets in the blog, and dynamically switch between them when the user toggles the blog's theme.

**Rationale**: The user wants the comment section to visually align with the blog's existing rustic theme (custom colors, fonts, spacing). Giscus supports custom themes via the `data-theme` attribute, which accepts a URL to a CSS file. The CSS file is injected into the Giscus iframe as a `<link>` stylesheet.

**How custom themes work** (from https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md):
- `data-theme` can be set to a full URL pointing to a CSS file (e.g., `https://zacharypaynethompson.github.io/blog/assets/css/giscus-light.css`)
- The CSS file overrides Giscus's internal CSS variables and styles within the iframe
- Theme can be switched at runtime via `postMessage` to the Giscus iframe:
  ```javascript
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: '<new-theme-url>' } } },
    'https://giscus.app'
  );
  ```

**Custom theme approach**:
- Create `giscus-light.css` and `giscus-dark.css` as static assets
- Map the blog's CSS custom property values (colors, fonts, spacing) to Giscus's internal CSS variables
- Light theme colors: `--color-bg: #FDFBF7`, `--color-text: #2D2D2D`, `--color-accent: #D2691E`, `--color-border: #E8E4DF`
- Dark theme colors: `--color-bg: #1a1a1a`, `--color-text: #E0DCD7`, `--color-accent: #E8923A`, `--color-border: #333330`
- Hook into the existing theme toggle to send a `postMessage` switching the Giscus theme URL

**Alternatives considered**:

| Alternative | Rejected Because |
|---|---|
| Built-in `preferred_color_scheme` theme | Follows OS preference but doesn't match the blog's custom color palette |
| Built-in `light` / `dark` themes | Generic GitHub colors, not aligned with the blog's rustic aesthetic |
| Single theme only | Would look mismatched in one of the two modes |

## R4: Dynamic Theme Switching Integration

**Decision**: Extend the existing theme toggle logic to also update the Giscus iframe theme via `postMessage`.

**Rationale**: The blog already has a theme toggle (inline script in `base.njk` that sets `data-theme` on the root element and persists to `localStorage`). When the user toggles, we also need to tell the Giscus iframe to switch its theme CSS. This is done by posting a message to the iframe with the new theme URL.

**Implementation pattern**:
1. On page load: set Giscus `data-theme` based on current blog theme (from `localStorage` or system preference)
2. On theme toggle: send `postMessage` to `.giscus-frame` iframe with the new theme URL
3. The Giscus iframe class is always `giscus-frame` — use `document.querySelector('iframe.giscus-frame')` to target it

## R5: Repository Setup Requirements

**Decision**: Document the one-time setup steps required before Giscus works.

**Prerequisites** (manual, one-time):
1. Repository must be **public** (it already is — GitHub Pages requires this)
2. Enable **GitHub Discussions** in repository Settings → General → Features
3. Create an **Announcements** category in Discussions (recommended by Giscus for spam prevention)
4. Install the **Giscus GitHub App** on the repository via https://github.com/apps/giscus
5. Use the **Giscus configurator** at https://giscus.app/ to obtain `data-repo-id` and `data-category-id` values

## R6: Optional `giscus.json` Configuration

**Decision**: Add a `giscus.json` file at the repository root to restrict origins and set default comment order.

**Configuration**:
```json
{
  "origins": ["https://zacharypaynethompson.github.io"],
  "defaultCommentOrder": "oldest"
}
```

**Rationale**: The `origins` whitelist prevents other sites from embedding your Giscus widget. `defaultCommentOrder: "oldest"` ensures chronological display (FR-011).
