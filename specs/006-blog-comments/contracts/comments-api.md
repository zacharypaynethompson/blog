# Giscus Widget Contract

**Feature**: 006-blog-comments
**Date**: 2026-03-29

## Overview

The blog does not expose or consume a custom API. All comment functionality is provided by the Giscus widget, which communicates with GitHub's API internally. This contract documents the integration interface between the blog and the Giscus widget.

## Widget Embedding Contract

The Giscus widget is embedded via a `<script>` tag placed in the post layout. The script creates an `<iframe>` with class `giscus-frame`.

### Required Attributes

| Attribute | Value | Source |
|---|---|---|
| `src` | `https://giscus.app/client.js` | Static |
| `data-repo` | `{OWNER}/{REPO}` | Repository name |
| `data-repo-id` | `{REPO_ID}` | From Giscus configurator |
| `data-category` | `Announcements` | Discussion category name |
| `data-category-id` | `{CATEGORY_ID}` | From Giscus configurator |
| `data-mapping` | `pathname` | Maps posts by URL path |
| `data-strict` | `1` | Strict hash matching |
| `data-reactions-enabled` | `1` | Enable emoji reactions |
| `data-emit-metadata` | `0` | No metadata emission |
| `data-input-position` | `bottom` | Comment input at bottom |
| `data-theme` | `{THEME_CSS_URL}` | URL to custom light or dark CSS |
| `data-lang` | `en` | English UI |
| `crossorigin` | `anonymous` | CORS policy |
| `async` | (present) | Non-blocking load |

### Placement

A `<div class="giscus"></div>` element controls where the iframe renders. Place after `.post-content` in the post layout.

## Theme Switching Contract

To switch the Giscus theme at runtime (when the blog's dark/light toggle is used):

**Message format**:
```javascript
iframe.contentWindow.postMessage(
  { giscus: { setConfig: { theme: themeUrl } } },
  'https://giscus.app'
);
```

**Target**: `document.querySelector('iframe.giscus-frame')`

**Theme URLs**:
- Light: `{SITE_URL}/assets/css/giscus-light.css`
- Dark: `{SITE_URL}/assets/css/giscus-dark.css`

## Repository Configuration Contract

A `giscus.json` file at the repository root configures server-side behavior:

```json
{
  "origins": ["{SITE_URL}"],
  "defaultCommentOrder": "oldest"
}
```

## Failure Behavior

- If the Giscus script fails to load (network error, CDN outage): the `<div class="giscus">` remains empty; the page layout is unaffected.
- If GitHub Discussions API is unavailable: the iframe shows Giscus's built-in error state.
- If the user's browser blocks third-party iframes: the comment section does not render; post content is unaffected.
