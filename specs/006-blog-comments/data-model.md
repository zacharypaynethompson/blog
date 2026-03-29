# Data Model: Blog Comments (Giscus)

**Feature**: 006-blog-comments
**Date**: 2026-03-29

## Overview

With Giscus, the data model is managed entirely by GitHub Discussions. No custom database or schema is needed. This document describes the logical entities and their relationships as they exist in GitHub's system.

## Entities

### Discussion

A GitHub Discussion thread, automatically created by Giscus when the first comment is posted on a blog post.

| Field | Type | Managed By | Description |
|---|---|---|---|
| id | GitHub node ID | GitHub | Unique identifier |
| title | string | Giscus (auto) | Set from the blog post's pathname (e.g., `/blog/posts/welcome/`) |
| category | string | Giscus (auto) | Announcements category (configured in widget) |
| url | URL | GitHub | Link to the Discussion on GitHub |
| locked | boolean | Author (manual) | Whether new comments are allowed |

### Comment

A reply within a GitHub Discussion.

| Field | Type | Managed By | Description |
|---|---|---|---|
| id | GitHub node ID | GitHub | Unique identifier |
| author | GitHub user | GitHub | Username, avatar URL, profile link |
| body | Markdown string | Commenter | Comment content with Markdown formatting |
| created_at | timestamp (UTC) | GitHub | When the comment was posted |
| reactions | emoji counts | GitHub | Native emoji reactions |

### Reply (nested comment)

A reply to a specific comment within a Discussion. GitHub Discussions support one level of nesting natively.

| Field | Type | Managed By | Description |
|---|---|---|---|
| id | GitHub node ID | GitHub | Unique identifier |
| parent_id | GitHub node ID | GitHub | References the parent comment |
| author | GitHub user | GitHub | Username, avatar URL, profile link |
| body | Markdown string | Commenter | Reply content with Markdown formatting |
| created_at | timestamp (UTC) | GitHub | When the reply was posted |

### Relationships

```
Post (1) ──── (0..1) Discussion     [created on first comment]
Discussion (1) ──── (many) Comment  [top-level comments]
Comment (1) ──── (many) Reply       [one level of nesting]
```

## Validation & Constraints

All validation is handled by GitHub Discussions:
- Comments must be non-empty (GitHub enforces this)
- Markdown is sanitized by GitHub's rendering pipeline
- Authentication is required to post (GitHub OAuth)
- Nesting is limited to one level by GitHub Discussions

## State Transitions

```
Discussion: [Not Created] → [Active] → [Locked by author]
Comment:    [Posted] → [Deleted/Hidden by moderator]
```

## Privacy

- Commenter identity is their public GitHub profile (username + avatar)
- No additional personal data is collected or stored by the blog
- GitHub's privacy policy governs all data handling
