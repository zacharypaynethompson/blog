# blog

A minimal personal blog built with Eleventy.

## local development

```bash
# install dependencies
npm install

# start development server
npm run dev

# build for production
npm run build
```

## writing posts

1. Create a new markdown file in `src/posts/`:

```bash
touch src/posts/my-new-post.md
```

2. Add frontmatter at the top:

```yaml
---
title: my post title
date: 2026-03-15
tags:
  - topic-one
  - topic-two
description: A brief summary of the post
layout: layouts/post.njk
---

Your content here...
```

3. Commit and push to deploy:

```bash
git add .
git commit -m "post: my post title"
git push
```

The site rebuilds automatically via GitHub Actions.

## structure

```
src/
├── posts/       # blog posts (markdown)
├── pages/       # static pages (about)
├── _includes/   # templates
├── _data/       # site config
└── assets/      # css, js
```
