# Data Model: Portfolio Page

**Feature**: 017-portfolio-page | **Date**: 2026-06-04

All data lives in a single file: `src/_data/portfolio.json`, exposed to templates as the `portfolio` global via Eleventy's data cascade. There is no runtime store; this is build-time content.

## Top-level shape

```jsonc
{
  "intro": "string (optional) — short lead paragraph shown under the page heading",
  "categories": [ Category, ... ]   // ordered; rendered top-to-bottom as-is
}
```

The array order IS the display order (FR-012) — no separate sort key needed at the top level.

## Entity: Category

A labelled grouping of projects, rendered as a distinct section on the page.

| Field      | Type    | Required | Notes |
|------------|---------|----------|-------|
| `id`       | string  | yes      | Stable slug for the section anchor (e.g. `"academic"`). Unique within file. |
| `name`     | string  | yes      | Display heading (e.g. `"Academic & Publications"`). |
| `blurb`    | string  | no       | Optional one-line description shown under the category heading. |
| `projects` | array   | yes      | Ordered list of `Project` (may be empty). Array order = display order. |

**Validation rules**:
- `id` unique across all categories.
- A category with an empty `projects` array is permitted but should be omitted by the author if it has nothing to show; the template may skip rendering empty categories.

## Entity: Project

A single piece of work to showcase, rendered as a card.

| Field         | Type            | Required | Notes |
|---------------|-----------------|----------|-------|
| `title`       | string          | yes      | Card heading. |
| `description` | string          | yes      | Short plain-text summary of what it is. |
| `role`        | string          | no       | Visitor-facing role/contribution (e.g. `"Author"`, `"Cited contributor"`). |
| `year`        | string          | no       | Year or period (e.g. `"2024"`, `"2023–2024"`). String to allow ranges. |
| `tags`        | array of string | no       | Small set of topic tags. Renders nothing when absent/empty. |
| `links`       | array of Link   | no       | Zero or more typed links. Renders no link block when absent/empty. |

**Validation rules**:
- `title` and `description` are mandatory and non-empty (FR-004).
- All optional fields must render cleanly when absent (FR-004).
- No field may break layout when unusually long (handled in CSS — Edge Cases).

## Entity: Link

A single typed link on a project card.

| Field   | Type   | Required | Notes |
|---------|--------|----------|-------|
| `label` | string | yes      | Human- and agent-readable link text (e.g. `"Read on gov.uk"`, `"Download PDF"`, `"View on GitHub"`). Used verbatim as anchor text (FR-013). |
| `url`   | string | yes      | Absolute URL to the destination. For Dropbox direct downloads, append `?dl=1`. |
| `type`  | string | no       | Optional hint for future iconography (e.g. `"pdf"`, `"github"`, `"web"`). Not required for MVP. |

**Validation rules**:
- Both `label` and `url` required for any link present.
- `url` should be an absolute URL (external destinations: gov.uk, Dropbox, GitHub, or an internal `/blog/...` link to a related post).
- Links are optional at the project level: zero, one, or several are all valid (FR-005).

## Relationships

```text
portfolio (1) ──contains──> Category (0..n, ordered)
Category  (1) ──contains──> Project  (0..n, ordered)
Project   (1) ──contains──> Link     (0..n)
```

## Example (`src/_data/portfolio.json`)

```json
{
  "intro": "A selection of academic, professional, and personal work.",
  "categories": [
    {
      "id": "academic",
      "name": "Academic & Publications",
      "blurb": "Research I have authored or contributed to.",
      "projects": [
        {
          "title": "Health economics research (Manchester Centre for Health Economics)",
          "description": "Published research that cites my contribution.",
          "role": "Cited contributor",
          "year": "2023",
          "tags": ["health economics", "research"],
          "links": [
            { "label": "Download PDF", "url": "https://www.dropbox.com/s/EXAMPLE/paper.pdf?dl=1", "type": "pdf" }
          ]
        }
      ]
    },
    {
      "id": "professional",
      "name": "Professional",
      "blurb": "Reports and analysis published in my professional roles.",
      "projects": [
        {
          "title": "Labour market report",
          "description": "Authored labour market analysis published on gov.uk.",
          "role": "Author",
          "year": "2024",
          "tags": ["labour market", "economics"],
          "links": [
            { "label": "Read on gov.uk", "url": "https://www.gov.uk/government/publications/EXAMPLE", "type": "web" }
          ]
        }
      ]
    },
    {
      "id": "code",
      "name": "Code & GitHub",
      "blurb": "Public repositories and code projects.",
      "projects": [
        {
          "title": "This blog",
          "description": "Personal blog built with Eleventy, including an interactive network graph and physics hero banner.",
          "role": "Author",
          "year": "2026",
          "tags": ["eleventy", "javascript", "d3"],
          "links": [
            { "label": "View on GitHub", "url": "https://github.com/zacharypaynethompson/blog", "type": "github" }
          ]
        }
      ]
    }
  ]
}
```
</content>
