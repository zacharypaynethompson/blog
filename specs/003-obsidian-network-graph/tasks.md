# Tasks: Interactive Obsidian-Style Network Graph

**Input**: Design documents from `/specs/003-obsidian-network-graph/`
**Prerequisites**: plan.md (✓), spec.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

**Tests**: Tests are not included as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure at repository root: `src/`, `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and testing infrastructure setup

- [x] T001 Install Vitest testing framework: npm install --save-dev vitest jsdom
- [x] T002 [P] Add npm test script to package.json: "test": "vitest"
- [x] T003 [P] Add npm run lint script to package.json: "lint": "html-validate src/**/*.njk"
- [x] T004 [P] Create tests/unit/ directory structure
- [x] T005 [P] Create tests/integration/ directory structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create networkGraph.js data collection in src/_data/networkGraph.js
- [x] T007 Implement post data extraction from Eleventy collections in src/_data/networkGraph.js
- [x] T008 [P] Implement tag aggregation logic in src/_data/networkGraph.js
- [x] T009 [P] Implement post-tag edge generation in src/_data/networkGraph.js
- [x] T010 [P] Implement post-post edge generation for frontmatter references in src/_data/networkGraph.js
- [x] T011 Configure JSON endpoint permalink '/data/network-graph.json' in src/_data/networkGraph.js
- [x] T012 Add eleventyExcludeFromCollections: true in src/_data/networkGraph.js

**Checkpoint**: Data foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Graph Exploration (Priority: P1) 🎯 MVP

**Goal**: Display blog posts and tags as connected nodes with Obsidian-style dark aesthetic using brand colors, enabling visual content exploration with hover effects

**Independent Test**: Load /network-graph/ page and verify all posts appear as orange nodes connected to their tag nodes, with hover effects showing post titles and node glow

### Implementation for User Story 1

- [x] T013 [P] [US1] Create network graph page template in src/network-graph.njk
- [x] T014 [P] [US1] Create brand-dark theme CSS in src/assets/css/network-graph.css
- [x] T015 [P] [US1] Create graph controls partial in src/_includes/partials/graph-controls.njk
- [x] T016 [US1] Create D3.js graph initialization in src/assets/js/network-graph.js
- [x] T017 [US1] Implement data loading from /data/network-graph.json in src/assets/js/network-graph.js
- [x] T018 [US1] Implement SVG container setup and dimensions in src/assets/js/network-graph.js
- [x] T019 [US1] Implement optimized D3.js force simulation configuration in src/assets/js/network-graph.js
- [x] T020 [US1] Implement post node rendering (circular, orange #D2691E) in src/assets/js/network-graph.js
- [x] T021 [US1] Implement tag node rendering (rounded rectangles, light orange #E8943B) in src/assets/js/network-graph.js
- [x] T022 [US1] Implement post-tag edge rendering with subtle opacity in src/assets/js/network-graph.js
- [x] T023 [US1] Implement post-post edge rendering with distinct styling in src/assets/js/network-graph.js
- [x] T024 [US1] Implement hover effects with node glow using brand colors in src/assets/css/network-graph.css
- [x] T025 [US1] Implement post title labels visible only on hover in src/assets/js/network-graph.js
- [x] T026 [US1] Implement tag labels always visible in src/assets/js/network-graph.js
- [x] T027 [US1] Implement connection highlighting on hover in src/assets/js/network-graph.js
- [x] T028 [US1] Add network-graph page to navigation in src/_includes/partials/nav.njk

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Post Navigation (Priority: P2)

**Goal**: Transform graph from static visualization into functional navigation interface by enabling click-to-navigate functionality

**Independent Test**: Click any post node in the graph and verify successful navigation to the corresponding blog post page in same tab

### Implementation for User Story 2

- [x] T029 [P] [US2] Implement post node click event handlers in src/assets/js/network-graph.js
- [x] T030 [P] [US2] Implement navigation to post URL on post node click in src/assets/js/network-graph.js
- [x] T031 [P] [US2] Add hover cursor styling for clickable post nodes in src/assets/css/network-graph.css
- [x] T032 [US2] Implement mobile touch event handling for post navigation in src/assets/js/network-graph.js
- [x] T033 [US2] Add ARIA labels for post nodes with navigation context in src/assets/js/network-graph.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Tag-Based Filtering (Priority: P3)

**Goal**: Enable focused exploration by clicking tag nodes to filter graph to show only related posts with smooth animations and reset functionality

**Independent Test**: Click any tag node and verify only posts connected to that tag remain visible, with clear reset option restoring full view

### Implementation for User Story 3

- [x] T034 [P] [US3] Implement tag node click event handlers in src/assets/js/network-graph.js
- [x] T035 [P] [US3] Implement graph filtering logic to show only connected posts in src/assets/js/network-graph.js
- [x] T036 [P] [US3] Implement smooth fade animations for filtering in src/assets/css/network-graph.css
- [x] T037 [P] [US3] Add reset button functionality in src/_includes/partials/graph-controls.njk
- [x] T038 [US3] Implement reset button click handler in src/assets/js/network-graph.js
- [x] T039 [US3] Implement escape key reset functionality in src/assets/js/network-graph.js
- [x] T040 [US3] Implement filtered state visual indicators in src/assets/css/network-graph.css
- [x] T041 [US3] Add ARIA live region for filter state announcements in src/network-graph.njk
- [x] T042 [US3] Implement empty state handling for tags with no posts in src/assets/js/network-graph.js

**Checkpoint**: All core user stories should now be independently functional

---

## Phase 6: User Story 4 - Interactive Physics (Priority: P4)

**Goal**: Enable physical manipulation of graph layout through drag interactions with realistic physics simulation

**Independent Test**: Drag any node and verify smooth movement with physics affecting connected nodes, simulation settling on release

### Implementation for User Story 4

- [x] T043 [P] [US4] Implement D3.js drag behavior setup in src/assets/js/network-graph.js
- [x] T044 [P] [US4] Implement drag start event handling with simulation restart in src/assets/js/network-graph.js
- [x] T045 [P] [US4] Implement drag event with position updates in src/assets/js/network-graph.js
- [x] T046 [P] [US4] Implement drag end with physics simulation release in src/assets/js/network-graph.js
- [x] T047 [P] [US4] Add visual feedback during drag interactions in src/assets/css/network-graph.css
- [x] T048 [US4] Implement mobile touch-based drag for single finger in src/assets/js/network-graph.js
- [x] T049 [US4] Implement gesture conflict resolution for pan vs drag in src/assets/js/network-graph.js
- [x] T050 [US4] Reset node positions on filter/reset operations in src/assets/js/network-graph.js

**Checkpoint**: All user stories should now be independently functional with full interactivity

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance optimization, and production readiness

- [x] T051 [P] Implement WCAG 2.1 AA keyboard navigation with roving tabindex in src/assets/js/network-graph.js
- [x] T052 [P] Add comprehensive ARIA labels and descriptions in src/network-graph.njk
- [x] T053 [P] Implement high-contrast focus indicators in src/assets/css/network-graph.css
- [x] T054 [P] Add skip links for graph accessibility in src/network-graph.njk
- [x] T055 [P] Optimize performance for 200+ nodes with RequestAnimationFrame in src/assets/js/network-graph.js
- [x] T056 [P] Implement mobile optimization with 44px touch targets in src/assets/css/network-graph.css
- [x] T057 [P] Add error handling for data loading failures in src/assets/js/network-graph.js
- [x] T058 [P] Implement graceful degradation for reduced motion preferences in src/assets/css/network-graph.css
- [x] T059 Add loading states and status messages in src/network-graph.njk
- [x] T060 Validate all acceptance criteria from quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 post nodes but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1 tag nodes but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Builds on US1 nodes but independently testable

### Within Each User Story

- CSS/HTML templates before JavaScript implementation
- Core rendering before interaction handlers
- Basic functionality before mobile optimizations
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each story, tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch multiple independent files for User Story 1 together:
Task: "Create network graph page template in src/network-graph.njk"
Task: "Create brand-dark theme CSS in src/assets/css/network-graph.css"
Task: "Create graph controls partial in src/_includes/partials/graph-controls.njk"

# Then proceed with JavaScript implementation tasks sequentially
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (5 tasks)
2. Complete Phase 2: Foundational (7 tasks) - CRITICAL
3. Complete Phase 3: User Story 1 (16 tasks)
4. **STOP and VALIDATE**: Test graph exploration functionality independently
5. Deploy/demo basic network visualization

**MVP Delivers**: Interactive graph showing posts and tags with hover effects and brand-consistent Obsidian-style dark aesthetic

### Incremental Delivery

1. Setup + Foundational → Data foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test navigation independently → Deploy/Demo
4. Add User Story 3 → Test filtering independently → Deploy/Demo
5. Add User Story 4 → Test physics independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (12 tasks)
2. Once Foundational is done:
   - Developer A: User Story 1 (16 tasks)
   - Developer B: User Story 2 (5 tasks)
   - Developer C: User Story 3 (9 tasks)
   - Developer D: User Story 4 (8 tasks)
3. Stories complete and integrate independently

---

## Notes

- **Total Tasks**: 60 tasks across 7 phases
- **MVP Scope**: Phases 1-3 (28 tasks) delivers core graph exploration
- **Full Feature**: All phases (60 tasks) delivers complete interactive experience
- [P] tasks = different files, no dependencies (28 parallel opportunities)
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follows constitutional principles: simplicity first, ship early, iterate often