---
title: getting started with eleventy
date: 2026-03-12
tags:
  - web
  - eleventy
description: Notes on building this site with Eleventy, a simple static site generator.
layout: layouts/post.njk
---

This site is built with [Eleventy](https://www.11ty.dev/).

## why eleventy?

A few reasons:

- **No client JavaScript by default** - pages are fast and accessible
- **Markdown for content** - easy to write, portable
- **Minimal configuration** - focus on content, not tooling

## the stack

The complete stack for this site:

1. **Eleventy 2.x** - static site generator
2. **Nunjucks** - templating
3. **d3.js** - for the explore page visualization
4. **GitHub Pages** - hosting

## code example

Here's what a basic Eleventy config looks like:

```javascript
module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```

Simple and readable.
