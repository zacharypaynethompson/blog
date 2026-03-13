# Data Model: static personal blog

**Date**: 2026-03-13
**Branch**: `001-static-blog-site`

This document defines the data entities, their attributes, relationships, and validation
rules. Since this is a static site, "data" lives in markdown files and JSON generated at
build time.

---

## Entities

### Post

A blog article written in markdown with YAML frontmatter.

**Source**: `src/posts/*.md`

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Post title (displayed in lowercase via CSS) |
| date | date | Yes | Publication date (ISO 8601: YYYY-MM-DD) |
| tags | string[] | No | List of topic tags; empty array if none |
| description | string | No | Short summary for meta tags and previews |
| slug | string | Auto | URL-friendly identifier derived from filename |
| url | string | Auto | Full URL path to the post |
| content | markdown | Yes | Post body (everything after frontmatter) |

**Validation Rules**:
- `title`: Non-empty string, max 100 characters recommended
- `date`: Valid ISO 8601 date, not in the future
- `tags`: Each tag is a non-empty lowercase string, no special characters except hyphens
- Filename must be URL-safe (lowercase, hyphens, no spaces)

**Derived Attributes** (computed by Eleventy):
- `slug`: Derived from filename (e.g., `my-first-post.md` → `my-first-post`)
- `url`: Full path (e.g., `/posts/my-first-post/`)

**Example**:
```yaml
---
title: building a personal blog
date: 2026-03-15
tags:
  - web
  - eleventy
description: How I built this site with Eleventy and d3.js
---

Post content here...
```

---

### Tag

A topic label that connects related posts. Tags are not stored separately; they emerge
from post frontmatter and are collected by Eleventy.

**Source**: Derived from `Post.tags` across all posts

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Tag identifier (lowercase, hyphenated) |
| posts | Post[] | All posts containing this tag |
| count | number | Number of posts with this tag |
| url | string | URL to filtered view (e.g., `/tags/web/`) |

**Validation Rules**:
- `name`: Lowercase letters and hyphens only (e.g., `ai-policy`, `food`, `data-science`)
- No duplicate tags within a single post

**Examples**: `ai-policy`, `data-science`, `food`, `music`, `cooking`, `eleventy`

---

### Page

A static content page (not part of the blog chronology).

**Source**: `src/pages/*.md`

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Page title |
| layout | string | Yes | Template to use (e.g., `page.njk`) |
| permalink | string | No | Custom URL path (defaults to filename) |
| content | markdown | Yes | Page body |

**Known Pages**:
- `about.md` → `/about/`

**Example**:
```yaml
---
title: about
layout: page.njk
permalink: /about/
---

Page content here...
```

---

### GraphData

JSON structure generated at build time for the explore page visualization.

**Source**: Generated template output → `/data/graph.json`

| Attribute | Type | Description |
|-----------|------|-------------|
| nodes | GraphNode[] | Array of post nodes |
| links | GraphLink[] | Array of connections between posts |

---

### GraphNode

A single node in the network visualization representing a post.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Post slug (unique identifier) |
| title | string | Post title |
| url | string | URL path to the post |
| tags | string[] | Tags for this post |
| date | string | Publication date (for sorting) |

**Example**:
```json
{
  "id": "building-a-personal-blog",
  "title": "building a personal blog",
  "url": "/posts/building-a-personal-blog/",
  "tags": ["web", "eleventy"],
  "date": "2026-03-15"
}
```

---

### GraphLink

A connection between two posts that share at least one tag.

| Attribute | Type | Description |
|-----------|------|-------------|
| source | string | Post ID (slug) of first post |
| target | string | Post ID (slug) of second post |
| sharedTags | string[] | Tags both posts have in common |
| weight | number | Number of shared tags (for link strength) |

**Example**:
```json
{
  "source": "building-a-personal-blog",
  "target": "eleventy-tips",
  "sharedTags": ["web", "eleventy"],
  "weight": 2
}
```

---

### SiteMetadata

Global site configuration.

**Source**: `src/_data/site.json`

| Attribute | Type | Description |
|-----------|------|-------------|
| title | string | Site title (displayed in nav, browser tab) |
| description | string | Site description for meta tags |
| url | string | Production URL (e.g., `https://username.github.io`) |
| author | object | Author information |
| author.name | string | Author's display name |

**Example**:
```json
{
  "title": "blog title",
  "description": "writing about ai policy, data science, food, and music",
  "url": "https://username.github.io",
  "author": {
    "name": "Author Name"
  }
}
```

---

## Relationships

```text
┌─────────┐       has many        ┌─────────┐
│  Post   │ ───────────────────── │   Tag   │
└─────────┘                       └─────────┘
     │                                 │
     │ transforms to                   │ groups
     ▼                                 ▼
┌───────────┐     links via      ┌───────────┐
│ GraphNode │ ◄────────────────► │ GraphLink │
└───────────┘    shared tags     └───────────┘
```

- A **Post** has zero or more **Tags**
- A **Tag** groups one or more **Posts**
- Posts sharing tags create **GraphLinks** between their **GraphNodes**
- **SiteMetadata** is global; used by all pages

---

## State Transitions

Posts have no explicit state machine. However, the publishing workflow implies:

```text
Draft (local file) → Committed (in repo) → Published (built & deployed)
```

This is handled entirely by git and GitHub Actions, not by the application.
