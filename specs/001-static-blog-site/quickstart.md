# Quickstart Guide: static personal blog

**Date**: 2026-03-13
**Branch**: `001-static-blog-site`

This guide covers local development and content authoring workflows.

---

## Prerequisites

- Node.js 18+ LTS
- npm (comes with Node.js)
- Git
- A text editor (VS Code, Vim, etc.)

---

## Local Development

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/USERNAME/USERNAME.github.io.git
cd USERNAME.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:8080`. Changes to content and templates
trigger automatic rebuilds.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production site to `_site/` |
| `npm run serve` | Serve built site locally (no hot reload) |

---

## Writing a Blog Post

### 1. Create the File

Create a new markdown file in `src/posts/`:

```bash
touch src/posts/my-post-title.md
```

**Filename rules**:
- Lowercase letters and hyphens only
- No spaces or special characters
- This becomes the URL slug (e.g., `/posts/my-post-title/`)

### 2. Add Frontmatter

Start the file with YAML frontmatter:

```yaml
---
title: my post title
date: 2026-03-15
tags:
  - topic-one
  - topic-two
description: A brief summary for previews and SEO
---
```

See [contracts/frontmatter-schema.md](./contracts/frontmatter-schema.md) for full schema.

### 3. Write Content

After the frontmatter, write your post in markdown:

```markdown
---
title: my post title
date: 2026-03-15
tags:
  - web
---

This is the first paragraph of my post.

## a heading

More content here. You can use:

- bullet lists
- **bold text**
- *italic text*
- `inline code`
- [links](https://example.com)

### code blocks

```python
def hello():
    print("hello world")
```

And images:

![alt text](/assets/images/my-image.jpg)
```

### 4. Preview Locally

```bash
npm run dev
```

Visit `http://localhost:8080/posts/my-post-title/` to see your post.

### 5. Publish

```bash
git add src/posts/my-post-title.md
git commit -m "post: my post title"
git push origin main
```

GitHub Actions will automatically build and deploy. Your post will be live within a few
minutes.

---

## Editing the About Page

Edit `src/pages/about.md`:

```yaml
---
title: about
layout: page.njk
permalink: /about/
---

Your about content here...
```

---

## Working with Tags

Tags connect related posts. Use consistent, lowercase, hyphenated names.

**Recommended tags** (examples based on stated topics):
- Professional: `ai-policy`, `data-science`, `analysis`
- Personal: `food`, `drink`, `cooking`, `music`

A post can have multiple tags:

```yaml
tags:
  - food
  - cooking
```

Tags automatically:
- Appear on post pages as links
- Create tag filter pages (e.g., `/tags/food/`)
- Connect posts in the explore visualization

---

## Project Structure Reference

```text
src/
├── posts/           # Blog posts (markdown)
│   └── my-post.md
├── pages/           # Static pages
│   └── about.md
├── _includes/       # Templates
│   ├── layouts/
│   │   ├── base.njk
│   │   ├── post.njk
│   │   └── page.njk
│   └── partials/
│       ├── nav.njk
│       └── footer.njk
├── _data/
│   └── site.json    # Site metadata
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── explore.js
├── index.njk        # Homepage
└── explore.njk      # Explore page

_site/               # Build output (gitignored)
```

---

## Troubleshooting

### Build fails with frontmatter error

Check that your frontmatter:
- Starts and ends with `---`
- Has valid YAML syntax (proper indentation, colons after keys)
- Date is in YYYY-MM-DD format

### Post doesn't appear

- Verify the file is in `src/posts/`
- Check that `date` is not in the future
- Ensure frontmatter has required fields (`title`, `date`)

### Styles not updating

- Hard refresh the browser (Cmd+Shift+R / Ctrl+Shift+R)
- Stop and restart the dev server

---

## Next Steps

After the site is built:

1. Update `src/_data/site.json` with your details
2. Edit `src/pages/about.md` with your bio
3. Write your first post
4. Push to GitHub and verify deployment
