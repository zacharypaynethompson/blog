---
description: Create a new blog post with frontmatter and open it for writing.
---

## User Input

```text
$ARGUMENTS
```

## Goal

Create a new blog post markdown file in `src/posts/` with proper frontmatter.

## Instructions

1. **Parse the user input** to extract:
   - **Title**: Required. If not provided, ask the user for a title.
   - **Tags**: Optional. Extract any mentioned topics/tags.
   - **Description**: Optional. A brief summary of the post.

2. **Generate the filename** from the title:
   - Lowercase the title
   - Replace spaces and special characters with hyphens
   - Remove consecutive hyphens
   - Example: "My Great Post!" becomes `my-great-post.md`

3. **Set the date** to today's date in `YYYY-MM-DD` format.

4. **Create the file** at `src/posts/<filename>.md` with this frontmatter:

```yaml
---
title: <lowercase title>
date: <today's date>
tags:
  - <tag-1>
  - <tag-2>
description: <description or a placeholder>
layout: layouts/post.njk
---

Your content here...
```

5. **Confirm** by telling the user the file was created and its path.

## Notes

- Title should be lowercase, matching the existing post style in this blog.
- `layout: layouts/post.njk` is always required.
- If no tags are provided, use a single placeholder tag based on the title's topic.
- If no description is provided, generate a brief one from the title.
