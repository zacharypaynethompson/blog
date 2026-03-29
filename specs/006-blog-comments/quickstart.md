# Quickstart: Blog Comments (Giscus)

**Feature**: 006-blog-comments
**Date**: 2026-03-29

## Overview

Add a Giscus-powered comments section to every blog post. Comments are stored as GitHub Discussions. Readers authenticate via GitHub to comment. The widget visually matches the blog's light and dark themes via custom CSS.

## Architecture at a Glance

```
┌─────────────────────────────┐
│  Blog Post Page (static)    │
│                             │
│  ┌───────────────────────┐  │
│  │  Post Content         │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Comments Section     │  │  ← <div class="giscus">
│  │  (Giscus iframe)      │  │  ← Loaded by giscus client.js
│  └───────────────────────┘  │
└─────────────────────────────┘
         │          ▲
         │ OAuth    │ Discussions API
         ▼          │
┌─────────────────────────────┐
│  GitHub                     │
│  - Discussions (storage)    │
│  - OAuth (authentication)   │
│  - Moderation (built-in)    │
└─────────────────────────────┘
```

## Key Files to Create

| File | Purpose |
|---|---|
| `src/_includes/partials/comments.njk` | Giscus script tag + container div + theme-switching logic |
| `src/assets/css/giscus-light.css` | Custom Giscus theme matching blog light mode |
| `src/assets/css/giscus-dark.css` | Custom Giscus theme matching blog dark mode |
| `giscus.json` | Repository-root config (origins whitelist, comment order) |

## Key Files to Modify

| File | Change |
|---|---|
| `src/_includes/layouts/post.njk` | Include comments partial after `.post-content` |
| `src/_includes/layouts/base.njk` | Extend theme toggle to also switch Giscus theme via postMessage |

## One-Time Setup (Manual)

1. Enable GitHub Discussions on the repository
2. Create an "Announcements" discussion category
3. Install Giscus GitHub App (https://github.com/apps/giscus)
4. Run the Giscus configurator (https://giscus.app/) to get `repo-id` and `category-id`

## Implementation Sequence

1. **Repository setup**: Enable Discussions, install Giscus app, get IDs from configurator
2. **Widget integration**: Create `comments.njk` partial with Giscus script tag, include it in `post.njk`
3. **Custom light theme**: Create `giscus-light.css` mapping blog's light colors to Giscus CSS variables
4. **Custom dark theme**: Create `giscus-dark.css` mapping blog's dark colors to Giscus CSS variables
5. **Theme switching**: Extend the existing theme toggle to send `postMessage` to Giscus iframe when toggled
6. **Initial theme detection**: Set correct theme URL on page load based on `localStorage` / system preference
7. **Repository config**: Add `giscus.json` with origins whitelist and comment order

## Patterns to Follow

- **No new JS dependencies**: Giscus loads via its own `<script>` tag; theme switching is a few lines of vanilla JS
- **CSS custom properties**: The custom Giscus themes should mirror the blog's existing `--color-*` values
- **Dark mode integration**: Hook into the existing `data-theme` attribute toggle in `base.njk`
- **Progressive enhancement**: If Giscus fails to load, the post page works fine — the comment div is simply empty
- **Passthrough copy**: The `giscus-light.css` and `giscus-dark.css` files need to be served as static assets (already handled by existing `addPassthroughCopy` for `src/assets/`)

## Color Mapping Reference

| Blog Variable | Light Value | Dark Value | Giscus Target |
|---|---|---|---|
| `--color-bg` | `#FDFBF7` | `#1a1a1a` | Main background |
| `--color-text` | `#2D2D2D` | `#E0DCD7` | Body text |
| `--color-text-secondary` | `#5C5C5C` | `#A09A93` | Secondary text, timestamps |
| `--color-accent` | `#D2691E` | `#E8923A` | Links, interactive elements |
| `--color-accent-hover` | `#A0520F` | `#F0A85C` | Hover states |
| `--color-border` | `#E8E4DF` | `#333330` | Borders, dividers |
