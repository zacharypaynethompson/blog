# Frontmatter Schema Contract

**Version**: 1.0.0
**Date**: 2026-03-13

This document defines the YAML frontmatter schema for blog posts and pages. Authors MUST
follow this schema for content to build correctly.

---

## Post Frontmatter

**Location**: `src/posts/*.md`

### Required Fields

```yaml
---
title: string    # Post title (will display lowercase)
date: YYYY-MM-DD # Publication date
---
```

### Optional Fields

```yaml
---
tags:            # List of topic tags
  - tag-name
  - another-tag
description: string  # Short summary for meta/preview (recommended)
---
```

### Complete Example

```yaml
---
title: exploring neural network architectures
date: 2026-03-15
tags:
  - ai-policy
  - data-science
description: A deep dive into transformer models and their implications for policy
---

Your markdown content starts here...
```

### Field Specifications

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-100 characters, any case (displays lowercase) |
| date | date | Yes | ISO 8601 format (YYYY-MM-DD), not future-dated |
| tags | string[] | No | Lowercase, hyphens only, no duplicates |
| description | string | No | 1-160 characters (for SEO meta description) |

### Tag Naming Conventions

Tags MUST be:
- Lowercase letters only (a-z)
- Hyphens for multi-word tags (e.g., `ai-policy`, `data-science`)
- No spaces, underscores, or special characters
- Meaningful and reusable across posts

**Good**: `food`, `music`, `ai-policy`, `data-science`, `cooking`
**Bad**: `Food`, `AI Policy`, `data_science`, `misc`, `stuff`

---

## Page Frontmatter

**Location**: `src/pages/*.md`

### Required Fields

```yaml
---
title: string       # Page title
layout: page.njk    # Template to use
---
```

### Optional Fields

```yaml
---
permalink: /custom-url/  # Override default URL
---
```

### Example (About Page)

```yaml
---
title: about
layout: page.njk
permalink: /about/
---

About page content here...
```

---

## Validation

The build process will fail or warn if:
- Required fields are missing
- Date format is invalid
- Tags contain invalid characters

Authors should validate locally with `npm run build` before committing.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-13 | Initial schema |
