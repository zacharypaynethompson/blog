# Tasks: static personal blog

**Input**: Design documents from `/specs/001-static-blog-site/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual browser testing per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory structure per plan.md in repository root
- [x] T002 Initialize npm project with package.json in repository root
- [x] T003 Install Eleventy 2.x and d3.js 7.x dependencies via npm
- [x] T004 Create eleventy.config.js with input/output directories and passthrough copy
- [x] T005 [P] Create .gitignore with node_modules/ and _site/
- [x] T006 [P] Create src/_data/site.json with site metadata (title, description, url, author)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be
implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create base layout template in src/_includes/layouts/base.njk with HTML structure, meta tags, and CSS link
- [x] T008 Create navigation partial in src/_includes/partials/nav.njk with links to home, about, explore
- [x] T009 [P] Create footer partial in src/_includes/partials/footer.njk
- [x] T010 Create CSS custom properties (colors, fonts) in src/assets/css/style.css
- [x] T011 Add typography styles (Bitter font, lowercase headings) in src/assets/css/style.css
- [x] T012 Add responsive layout styles (mobile, tablet, desktop) in src/assets/css/style.css
- [x] T013 Configure Eleventy posts collection in eleventy.config.js
- [x] T014 Configure Eleventy tags collection with pagination in eleventy.config.js
- [x] T015 [P] Create 404 error page template in src/404.njk

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Read a Blog Post (Priority: P1) 🎯 MVP

**Goal**: Visitor can navigate to a post URL and read the article with proper styling,
metadata (title, date, tags), and responsive layout.

**Independent Test**: Navigate to a post URL, verify content renders with correct
typography, visible metadata, and tags link to filtered views.

### Implementation for User Story 1

- [x] T016 [US1] Create post layout template in src/_includes/layouts/post.njk extending base.njk
- [x] T017 [US1] Create post metadata partial in src/_includes/partials/post-meta.njk showing date and tags
- [x] T018 [US1] Add post content styling (headings, lists, code blocks, images) in src/assets/css/style.css
- [x] T019 [US1] Create sample post in src/posts/welcome.md with frontmatter (title, date, tags, description)
- [x] T020 [P] [US1] Create second sample post in src/posts/getting-started.md with different tags
- [x] T021 [US1] Add tag links in post-meta.njk pointing to /tags/{tag}/

**Checkpoint**: Posts render correctly at /posts/{slug}/ with full styling and metadata

---

## Phase 4: User Story 2 - Browse Posts from Homepage (Priority: P1) 🎯 MVP

**Goal**: Visitor lands on homepage and sees recent posts in reverse chronological order
with clickable titles.

**Independent Test**: Load homepage, verify posts appear newest-first with working links.

### Implementation for User Story 2

- [x] T022 [US2] Create homepage template in src/index.njk listing posts from collections.posts
- [x] T023 [US2] Add post list styling (title, date, description preview) in src/assets/css/style.css
- [x] T024 [US2] Sort posts by date descending in src/index.njk
- [x] T025 [US2] Link each post title to its full page in src/index.njk

**Checkpoint**: Homepage shows all posts in chronological order with working navigation

---

## Phase 5: User Story 6 - Author Publishes a Post (Priority: P1) 🎯 MVP

**Goal**: Author creates a markdown file with frontmatter, commits, and site rebuilds
automatically via GitHub Actions.

**Independent Test**: Add new markdown file, commit, verify post appears on live site.

### Implementation for User Story 6

- [x] T026 [US6] Create GitHub Actions workflow in .github/workflows/deploy.yml
- [x] T027 [US6] Configure workflow to install deps, build Eleventy, and deploy to gh-pages
- [x] T028 [US6] Add npm scripts (dev, build, serve) in package.json
- [x] T029 [US6] Document post creation workflow in README.md

**Checkpoint**: Pushing to main triggers automatic build and deployment to GitHub Pages

---

## Phase 6: User Story 3 - Learn About the Author (Priority: P2)

**Goal**: Visitor navigates to about page and reads author information.

**Independent Test**: Click about link from any page, verify content displays correctly.

### Implementation for User Story 3

- [x] T030 [US3] Create page layout template in src/_includes/layouts/page.njk extending base.njk
- [x] T031 [US3] Create about page content in src/pages/about.md with frontmatter
- [x] T032 [US3] Add page-specific styling if needed in src/assets/css/style.css

**Checkpoint**: About page accessible at /about/ with consistent styling

---

## Phase 7: User Story 5 - Filter Posts by Tag (Priority: P3)

**Goal**: Clicking a tag shows only posts with that tag.

**Independent Test**: Click a tag, verify filtered list shows only matching posts.

### Implementation for User Story 5

- [x] T033 [US5] Create tag page template in src/tags.njk using Eleventy pagination
- [x] T034 [US5] Configure tag pagination to generate /tags/{tag}/ pages in eleventy.config.js
- [x] T035 [US5] Style tag page list in src/assets/css/style.css

**Checkpoint**: Each tag has its own page listing only posts with that tag

---

## Phase 8: User Story 4 - Explore Posts Visually (Priority: P3)

**Goal**: Visitor uses network visualization to discover post relationships via shared tags.

**Independent Test**: Load explore page, verify graph shows posts as nodes connected by
shared tags, hover highlights related posts, click navigates to post.

### Implementation for User Story 4

- [x] T036 [US4] Create graph data template in src/data/graph.njk outputting JSON at /data/graph.json
- [x] T037 [US4] Implement node/link generation logic in graph.njk from collections.posts
- [x] T038 [US4] Create explore page template in src/explore.njk with SVG container and list view
- [x] T039 [US4] Implement d3.js force simulation in src/assets/js/explore.js
- [x] T040 [US4] Add node rendering (circles with post titles) in src/assets/js/explore.js
- [x] T041 [US4] Add link rendering (lines connecting shared-tag posts) in src/assets/js/explore.js
- [x] T042 [US4] Implement hover highlighting in src/assets/js/explore.js
- [x] T043 [US4] Implement click-to-navigate in src/assets/js/explore.js
- [x] T044 [US4] Add list view with tag filter buttons in src/explore.njk
- [x] T045 [US4] Implement cross-filter between graph and list in src/assets/js/explore.js
- [x] T046 [US4] Add graph accessibility (role="img", title, desc, hidden list) in src/explore.njk
- [x] T047 [US4] Add keyboard navigation for graph nodes in src/assets/js/explore.js
- [x] T048 [US4] Respect prefers-reduced-motion in src/assets/js/explore.js
- [x] T049 [US4] Style explore page layout and graph in src/assets/css/style.css

**Checkpoint**: Explore page fully functional with interactive graph and cross-filtered list

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T050 Add Open Graph and Twitter meta tags in src/_includes/layouts/base.njk
- [x] T051 Add structured data (JSON-LD) for blog posts in src/_includes/layouts/post.njk
- [x] T052 [P] Verify WCAG 2.1 AA compliance with automated tools
- [x] T053 [P] Test on Chrome, Firefox, Safari, Edge (latest versions)
- [x] T054 [P] Test on mobile devices (touch interactions, readability)
- [x] T055 Verify Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [x] T056 Run quickstart.md validation (follow steps, verify everything works)

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup) ─────────────────────────────────────────────────────────────┐
                                                                              │
Phase 2 (Foundational) ──────────────────────────────────────────────────────┤
                                                                              │
     ┌────────────────┬────────────────┬────────────────┐                    │
     ▼                ▼                ▼                │                    │
Phase 3 (US1)    Phase 4 (US2)    Phase 5 (US6)        │ ◄─── MVP COMPLETE  │
Read Post        Homepage         Publish               │                    │
     │                │                │                │                    │
     └────────────────┴────────────────┴────────────────┤                    │
                                                        │                    │
Phase 6 (US3) ──────────────────────────────────────────┤                    │
About Page                                              │                    │
                                                        │                    │
Phase 7 (US5) ──────────────────────────────────────────┤                    │
Tag Filtering                                           │                    │
                                                        │                    │
Phase 8 (US4) ──────────────────────────────────────────┤ ◄─ Depends on US5 │
Explore/Graph                                           │                    │
                                                        │                    │
Phase 9 (Polish) ◄──────────────────────────────────────┘                    │
```

### User Story Dependencies

- **US1 (Read Post)**: Depends on Phase 2 only - no other story dependencies
- **US2 (Homepage)**: Depends on Phase 2 only - works independently of US1
- **US6 (Publish)**: Depends on Phase 2 only - enables content creation
- **US3 (About)**: Depends on Phase 2 only - independent static page
- **US5 (Tag Filter)**: Depends on Phase 2 only - tag pages work independently
- **US4 (Explore)**: Depends on US5 (uses same tag filtering logic)

### Within Each User Story

- Templates before content
- CSS styling after templates exist
- Integration last

### Parallel Opportunities

- T005, T006 (Setup) can run in parallel
- T009 (footer) can run in parallel with T007, T008
- T015 (404) can run in parallel with other foundational tasks
- T020 (second sample post) can run in parallel with T019
- T052, T053, T054 (testing) can run in parallel

---

## Parallel Examples

### Phase 1 Setup (parallel tasks)

```text
T005: Create .gitignore
T006: Create site.json
```

### Phase 2 Foundational (parallel tasks)

```text
T009: Create footer partial
T015: Create 404 page
```

### Phase 3 User Story 1 (parallel tasks)

```text
T019: Create first sample post
T020: Create second sample post
```

---

## Implementation Strategy

### MVP First (Phases 1-5)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phases 3, 4, 5 (US1, US2, US6) in order
4. **STOP and VALIDATE**: Site has posts, homepage, and deployment working
5. Deploy to GitHub Pages - **MVP LIVE**

### Incremental Delivery

1. MVP (Phases 1-5) → Basic blog with posts, homepage, publishing
2. Add US3 (About) → Author page adds context
3. Add US5 (Tags) → Content discovery via tag pages
4. Add US4 (Explore) → Visual discovery with network graph
5. Polish → SEO, accessibility, performance validation

---

## Notes

- All CSS goes in single file (style.css) per constitution principle I (Simplicity)
- Eleventy config (eleventy.config.js) is the central configuration point
- Sample posts needed for testing; can be replaced with real content later
- GitHub Actions workflow enables the "commit to publish" workflow
- US4 (Explore) is the most complex phase - can be deferred if MVP is priority
- [P] tasks can run in parallel within their phase
- Commit after each task or logical group for clean history
