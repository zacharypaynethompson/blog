# Feature Specification: Portfolio Page

**Feature Branch**: `017-portfolio-page`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: User description: "I need a portfolio page on my website !"

## Clarifications

### Session 2026-06-04

- Q: Where should academic-work PDFs be hosted so a card can link to a download? → A: Externally on the author's own Dropbox (not committed to the site repo); cards link to the Dropbox-hosted file, and the author keeps those files up to date.
- Q: How should the cards be organised on the page? → A: Grouped by category (e.g. Academic/Publications, Professional/gov.uk reports, Code/GitHub).
- Q: How many links can a single project card have? → A: Multiple typed links per card (e.g. "Read on gov.uk", "Download PDF", "View on GitHub").
- Q: What should the page look and feel like? → A: A catalogue of links to past work (not a heavily designed showcase), cohesive with the existing blog style, and machine-readable so an agentic reader can parse each item and reach its content easily.
- Q: How many cards across the grid at most? → A: No more than three across; responsive to screen size (fewer columns on narrower screens).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse a showcase of work (Priority: P1)

A visitor arrives at the site wanting to understand what Zac has built and worked on. They navigate to the portfolio page and see a curated list of projects, each presented with a title, a short description of what it is, and an indication of the role or contribution. From this single page they can quickly form a picture of Zac's professional output across data science, public policy, and analysis.

**Why this priority**: The core purpose of a portfolio is to display a body of work in one place. Without the list of projects there is no portfolio. This is the minimum viable slice that delivers value on its own.

**Independent Test**: Can be fully tested by navigating to the portfolio page and confirming that a set of projects is displayed, each with a title and description. Delivers value because a visitor can immediately survey Zac's work.

**Acceptance Scenarios**:

1. **Given** a visitor on any page of the site, **When** they open the portfolio page, **Then** they see a heading identifying the page as a portfolio and a list of one or more project entries.
2. **Given** the portfolio page is open, **When** the visitor reads a project entry, **Then** they see at minimum the project's title and a short description.
3. **Given** the portfolio page has no projects yet defined, **When** a visitor opens it, **Then** they see a friendly message indicating that work is being added rather than a blank or broken page.

---

### User Story 2 - Reach the portfolio from site navigation (Priority: P1)

A visitor exploring the site should be able to discover the portfolio without knowing its direct address. A link in the main site navigation takes them to the portfolio page from anywhere on the site, and the navigation reflects when they are currently on that page.

**Why this priority**: A page that cannot be reached through normal navigation effectively does not exist for most visitors. Discoverability is as essential as the content itself for an MVP.

**Independent Test**: Can be tested by loading any page, clicking the portfolio link in the navigation, and confirming arrival on the portfolio page with the navigation indicating the active page.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** they look at the main navigation, **Then** a clearly labelled portfolio link is present.
2. **Given** a visitor clicks the portfolio navigation link, **When** the page loads, **Then** they arrive at the portfolio page and the navigation marks it as the current page.

---

### User Story 3 - Follow a project to learn more (Priority: P2)

A visitor interested in a particular project wants to dig deeper. Each project entry that has an associated external resource (a repository, a published piece, a live demo, or a related blog post) offers a link the visitor can follow to learn more.

**Why this priority**: Adds depth and lets the portfolio drive visitors to richer material, but the page still delivers value as a static showcase without it. Hence P2 rather than P1.

**Independent Test**: Can be tested by opening the portfolio page, clicking a project's link, and confirming it leads to the expected external or internal destination.

**Acceptance Scenarios**:

1. **Given** a project entry has an associated link, **When** the visitor activates that link, **Then** they are taken to the linked resource.
2. **Given** a project entry has no associated link, **When** the visitor views it, **Then** no broken or empty link is shown.

---

### Edge Cases

- What happens when a project has a long description or title? The layout should remain readable and not overflow or break the page.
- How does the page behave on a small (mobile) screen? Project entries should stack and remain legible without horizontal scrolling.
- What happens when a project links to an external site? The link should be clearly distinguishable, and behave consistently with other external links on the site.
- How does the page render in both light and dark theme? It must respect the existing site theming.
- What happens when a project has no link, no role, or only a title and description? The entry must still render cleanly with whatever information is present.
- What happens when a card has several links? They must be presented as distinct, clearly labelled actions without crowding the card or breaking the layout.
- What happens when a category contains only one or two projects? The grid must lay out cleanly without leaving the row looking broken.
- What happens when an externally hosted document is moved, renamed, or its sharing link changes? The link would break; the author must keep Dropbox links current, and link checking should flag broken document links before publishing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a dedicated portfolio page reachable at a stable, human-readable address.
- **FR-002**: The portfolio page MUST display project entries as cards laid out in a responsive grid of no more than three cards across, reducing the number of columns on narrower screens and stacking to a single column on mobile.
- **FR-003**: Project entries MUST be organised into labelled categories (e.g. Academic / Publications, Professional / gov.uk reports, Code / GitHub), each category presented as a distinct section on the page.
- **FR-004**: Each project entry MUST present at least a title and a short description, and MAY include supporting metadata such as the visitor-facing role/contribution, the year or time period, and a small set of topic tags; these MUST render cleanly when absent.
- **FR-005**: Each project entry MAY include one or more typed links to associated resources (e.g. "Read on gov.uk", "Download PDF", "View on GitHub", or a related blog post), each labelled to indicate its destination/type, and the entry MUST render cleanly whether it has zero, one, or several links.
- **FR-006**: Downloadable documents (e.g. academic PDFs) MUST be hosted externally on the author's Dropbox rather than committed to the site repository; a project card links directly to the externally hosted file. The author is responsible for keeping those external files and their links current.
- **FR-007**: The main site navigation MUST include a link to the portfolio page, and the navigation MUST indicate when the portfolio page is the current page, consistent with existing navigation items.
- **FR-008**: The portfolio page MUST be visually consistent with the rest of the site (the existing blog style), including respecting the existing light and dark theme; it is a catalogue of links to past work rather than a heavily designed showcase.
- **FR-009**: The portfolio page MUST be responsive and remain legible and usable on mobile, tablet, and desktop screen widths.
- **FR-010**: The portfolio content MUST be maintainable so that the author can add, edit, remove, and reorder projects and categories without requiring changes to page structure or styling.
- **FR-011**: When no projects are defined, the page MUST display a graceful placeholder message rather than appearing broken or empty.
- **FR-012**: The portfolio page MUST present categories and the projects within each category in a deliberate, author-controlled order rather than an arbitrary order.
- **FR-013**: The portfolio page content MUST be machine-readable: project titles, descriptions, categories, and links MUST be expressed in semantic markup with descriptive link text, and MUST be present without requiring client-side scripting to access, so that an automated/agentic reader can parse each item and reach its linked content.

### Key Entities *(include if feature involves data)*

- **Project**: A single piece of work to showcase. Key attributes: title (required), short description (required), the category it belongs to (required), zero or more typed links each with a label and destination (e.g. gov.uk page, downloadable PDF, GitHub repo, blog post), optional role/contribution, optional time period (year), optional topic tags, and an ordering indicator that controls its position within its category.
- **Category**: A labelled grouping of projects (e.g. Academic / Publications, Professional / gov.uk reports, Code / GitHub). Key attributes: a display name and an ordering indicator that controls its position on the page.
- **Document**: A downloadable file (e.g. an academic PDF) that a project link may point to. Hosted externally on the author's Dropbox; the portfolio references it by its external link rather than storing it in the site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can reach the portfolio page from the main navigation of any page in a single click.
- **SC-002**: A first-time visitor can identify at least three distinct projects and what each one is within 30 seconds of the portfolio page loading.
- **SC-003**: The portfolio page renders correctly and remains legible at common screen widths from 320px (mobile) through to desktop, with no horizontal overflow.
- **SC-004**: The author can add a new project to the portfolio by editing content alone, with no change to layout or styling, in under 5 minutes.
- **SC-005**: The portfolio page renders correctly in both light and dark themes with no unreadable or unstyled elements.
- **SC-006**: Every project link present on the page leads to a working destination (no broken links) at time of publishing, including externally hosted document downloads (e.g. Dropbox-hosted PDFs).
- **SC-007**: Projects are presented under clearly labelled categories, so a visitor can tell at a glance which items are academic, which are professional/published, and which are code.
- **SC-008**: All project information (titles, descriptions, categories, link destinations) is reachable and parseable from the page source without executing client-side scripts, so an automated reader can extract the full catalogue.

## Assumptions

- "Portfolio" refers to a showcase of professional projects and work (data science, public policy, economics, analysis), distinct from the existing blog posts and the about page. Blog posts may be referenced as project links but are not themselves portfolio entries.
- The portfolio is content authored and curated solely by the site owner; there is no visitor-submitted content, authentication, or interactivity beyond following links.
- Project data will be maintained by the author in a simple, file-based form consistent with how the rest of the site's content is managed. Downloadable documents themselves are not part of the repository — only links to their external (Dropbox) locations are stored.
- The page is informational and static; no search, filtering, or pagination is required for the initial version (the expected number of projects is small, on the order of a handful to a couple of dozen).
- Images or thumbnails per project are out of scope for the initial version, but the design should not preclude adding them later.
- Initial categories are expected to be Academic / Publications (including work where the author is cited, e.g. the Manchester Centre for Health Economics research), Professional (e.g. labour market reports published on gov.uk), and Code / GitHub. The exact category set is author-controlled and may change.
- The primary audience is prospective employers / job-application readers (human and, increasingly, automated/agentic), so clarity, working links, and machine-readability are prioritised over visual flourish.
- Personal projects are sparse at the outset (effectively this blog and a forked repository); the page must therefore look complete and intentional even with a small number of entries.
</content>
