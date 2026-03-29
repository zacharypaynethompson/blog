# Tasks: Blog Comments (Giscus)

**Input**: Design documents from `/specs/006-blog-comments/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/comments-api.md, quickstart.md

**Tests**: Not explicitly requested in the spec. No test tasks generated. Manual verification checkpoints are included at each phase boundary.

**Organization**: Tasks are grouped by user story. US2 (threading) and US3 (moderation) are provided natively by Giscus and require only verification, not implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Repository Configuration)

**Purpose**: One-time GitHub repository setup required before Giscus can function

- [x] T001 Enable GitHub Discussions on the repository (Settings → General → Features) and create an "Announcements" discussion category
- [x] T002 Install the Giscus GitHub App on the repository via https://github.com/apps/giscus
- [x] T003 Run the Giscus configurator at https://giscus.app/ to obtain `data-repo-id` and `data-category-id` values. Record these for use in T005
- [x] T004 Create repository configuration file at `giscus.json` in repo root with origins whitelist (`https://zacharypaynethompson.github.io`) and `defaultCommentOrder: "oldest"` per research.md R6

---

## Phase 2: User Story 1 - Read and Post a Comment (Priority: P1) 🎯 MVP

**Goal**: Display a Giscus comments section at the bottom of every blog post with custom light/dark themes that match the blog's existing design

**Independent Test**: Visit any blog post → see comments section at bottom → sign in with GitHub → post a comment → comment appears in thread and in GitHub Discussions → toggle theme → comment section switches theme

### Implementation for User Story 1

- [x] T005 [P] [US1] Create Giscus widget partial at `src/_includes/partials/comments.njk` with the Giscus `<script>` tag, container `<div class="giscus">`, and all `data-*` attributes per contracts/comments-api.md. Use values from T003. Set `data-mapping="pathname"`, `data-strict="1"`, `data-theme` to the custom theme URL matching current blog theme
- [x] T006 [P] [US1] Create custom light theme at `src/assets/css/giscus-light.css` mapping blog light colors to Giscus CSS variables: background `#FDFBF7`, text `#2D2D2D`, secondary text `#5C5C5C`, accent `#D2691E`, accent-hover `#A0520F`, border `#E8E4DF` per quickstart.md color mapping reference
- [x] T007 [P] [US1] Create custom dark theme at `src/assets/css/giscus-dark.css` mapping blog dark colors to Giscus CSS variables: background `#1a1a1a`, text `#E0DCD7`, secondary text `#A09A93`, accent `#E8923A`, accent-hover `#F0A85C`, border `#333330` per quickstart.md color mapping reference
- [x] T008 [US1] Modify `src/_includes/layouts/post.njk` to include the comments partial after the `.post-content` div closing tag (after line 29). Add `{% include "partials/comments.njk" %}` wrapped in a comments section container
- [x] T009 [US1] Extend the theme toggle logic in `src/_includes/layouts/base.njk` to send a `postMessage` to the Giscus iframe (`iframe.giscus-frame`) when the theme is toggled, switching `data-theme` between the light and dark custom CSS URLs per contracts/comments-api.md theme switching contract
- [x] T010 [US1] Add initial theme detection in the comments partial (`src/_includes/partials/comments.njk`) so the Giscus `data-theme` attribute is set to the correct custom CSS URL on page load based on `localStorage` theme preference or `prefers-color-scheme` system setting

**Checkpoint**: At this point, every blog post should display a functioning Giscus comments section. Readers can sign in with GitHub and post comments. The widget matches the blog's light and dark themes and switches dynamically with the toggle.

---

## Phase 3: User Story 2 - Reply to an Existing Comment (Priority: P2)

**Goal**: Readers can reply to existing comments in threaded conversations

**Independent Test**: Post a top-level comment → reply to it → reply appears nested beneath the original

**Note**: Threading is provided natively by Giscus/GitHub Discussions. No additional code is required. This phase is verification only.

### Verification for User Story 2

- [ ] T011 [US2] Verify threaded replies work: post a top-level comment on any blog post, then reply to it. Confirm the reply appears nested beneath the parent comment in chronological order (FR-004, FR-011)

**Checkpoint**: Threaded conversations work out of the box via Giscus

---

## Phase 4: User Story 3 - Blog Author Moderates Comments (Priority: P3)

**Goal**: The blog author can delete or hide inappropriate comments using GitHub's built-in tools

**Independent Test**: Post a test comment → navigate to the corresponding GitHub Discussion → delete or hide the comment → verify it no longer appears on the blog post

**Note**: Moderation is provided natively by GitHub Discussions. No additional code is required. This phase is verification only.

### Verification for User Story 3

- [ ] T012 [US3] Verify moderation works: post a test comment, then delete it via GitHub Discussions UI. Confirm it no longer appears in the Giscus widget on the blog post (FR-009). Also verify the Discussion can be locked to prevent new comments

**Checkpoint**: Author can moderate comments entirely through GitHub's existing interface

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories and devices

- [ ] T013 [P] Verify responsive layout: check the comments section renders correctly on mobile, tablet, and desktop screen sizes (SC-006)
- [ ] T014 [P] Verify performance: confirm the comments section adds no more than 1 second to page load time using browser DevTools Network tab (SC-003)
- [ ] T015 [P] Verify all posts have comments: navigate to each blog post and confirm the Giscus widget loads on every one (SC-005)
- [x] T016 Run `npm test && npm run lint` to ensure no regressions
- [ ] T017 Verify graceful degradation: temporarily block the Giscus script in DevTools and confirm the post page renders normally without the comment section

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. T001 → T002 → T003 → T004 (sequential: each step depends on the prior)
- **US1 (Phase 2)**: Depends on Phase 1 completion (needs repo-id and category-id from T003)
- **US2 (Phase 3)**: Depends on US1 completion (needs working widget to test threading)
- **US3 (Phase 4)**: Depends on US1 completion (needs working widget to test moderation)
- **Polish (Phase 5)**: Depends on all prior phases

### Within User Story 1

- T005, T006, T007 can run in **parallel** (different files, no dependencies)
- T008 depends on T005 (partial must exist before including it)
- T009 depends on T005 (needs Giscus iframe to exist for postMessage)
- T010 depends on T005 (initial theme logic goes in the partial)

### Parallel Opportunities

```text
# Phase 2 — launch these three in parallel:
T005: Create comments.njk partial
T006: Create giscus-light.css
T007: Create giscus-dark.css

# Then sequentially:
T008: Include partial in post.njk (depends on T005)
T009: Theme toggle integration in base.njk (depends on T005)
T010: Initial theme detection in comments.njk (depends on T005)

# Phase 5 — launch these three in parallel:
T013: Responsive check
T014: Performance check
T015: All-posts check
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (one-time GitHub configuration)
2. Complete Phase 2: User Story 1 (widget + custom themes + theme switching)
3. **STOP and VALIDATE**: Post a comment, toggle theme, verify everything works
4. Deploy — commenting is live

### Incremental Delivery

1. Phase 1: Setup → GitHub ready for Giscus
2. Phase 2: US1 → Comments work on all posts with custom themes (MVP!)
3. Phase 3: US2 → Verify threading works (no code, just confirmation)
4. Phase 4: US3 → Verify moderation works (no code, just confirmation)
5. Phase 5: Polish → Cross-device and performance validation

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- US2 and US3 require no implementation — Giscus/GitHub Discussions provide threading and moderation natively
- The `data-repo-id` and `data-category-id` values from T003 are required before any implementation can start
- Commit after each task or logical group
- Total new files: 4 (comments.njk, giscus-light.css, giscus-dark.css, giscus.json)
- Total modified files: 2 (post.njk, base.njk)
