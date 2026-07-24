# Quickstart: Portfolio Page

**Feature**: 017-portfolio-page

This guide covers building, viewing, and maintaining the portfolio page.

## Prerequisites

- Node.js 18+ LTS
- Repo dependencies installed: `npm install`
- On branch `017-portfolio-page`

## Run locally

```bash
npm run dev      # dev server with live reload
# open http://localhost:8080/blog/portfolio/
```

The portfolio link also appears in the top navigation on every page.

## Add or edit a project (content-only)

1. Open `src/_data/portfolio.json`.
2. Find the relevant category in `categories` (or add a new category object with `id`, `name`, `projects`).
3. Add a project object to that category's `projects` array:

   ```json
   {
     "title": "My report",
     "description": "What it is, in one sentence.",
     "role": "Author",
     "year": "2025",
     "tags": ["economics"],
     "links": [
       { "label": "Read on gov.uk", "url": "https://www.gov.uk/...", "type": "web" },
       { "label": "Download PDF", "url": "https://www.dropbox.com/s/.../file.pdf?dl=1", "type": "pdf" }
     ]
   }
   ```

4. Order matters: items render in array order. Move an entry to reorder it.
5. Save — the dev server reloads automatically. No template or CSS change needed.

Only `title` and `description` are required. Omit any optional field (`role`, `year`, `tags`, `links`) and the card still renders cleanly.

## Hosting a document (PDF)

- Upload the file to your Dropbox and create a share link.
- Append `?dl=1` to force a direct download rather than the Dropbox preview page.
- Use that URL as a link `url` with a clear `label` (e.g. `"Download PDF"`).
- Do **not** commit the PDF to the repo.

## Verify before merging

```bash
npm run lint     # html-validate over templates
npm test         # vitest — includes portfolio.json shape check
npm run build    # production build into _site/
```

Then manually confirm:

- [ ] `/blog/portfolio/` loads and shows each category with its cards.
- [ ] Nav shows "portfolio" and marks it current when on the page.
- [ ] Page is readable at 320px width and on desktop, with no horizontal scroll.
- [ ] Page looks correct in both light and dark themes (toggle in nav).
- [ ] Every link works, including Dropbox document downloads.
- [ ] A card with no links and a card with several links both render cleanly.
- [ ] Viewing page source shows all titles, descriptions, and links present without JavaScript.

## Validating the data file against the schema (optional)

The data contract is documented in `contracts/portfolio-data.schema.json`. To validate locally with any JSON Schema validator (e.g. `ajv`):

```bash
npx ajv validate -s specs/017-portfolio-page/contracts/portfolio-data.schema.json -d src/_data/portfolio.json
```
</content>
