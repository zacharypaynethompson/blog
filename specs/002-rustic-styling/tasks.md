# Tasks: Rustic Visual Styling Enhancements

**Input**: Design documents from `/specs/002-rustic-styling/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No specific test tasks requested in specification - validation through visual testing and accessibility compliance checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Static website project**: `src/` at repository root
- CSS modifications in `src/assets/css/style.css`
- Template updates in `src/_includes/layouts/` and `src/_includes/partials/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure validation

- [x] T001 Verify current blog build works with `npm run build && npm run dev`
- [x] T002 [P] Create backup of current `src/assets/css/style.css` for rollback capability
- [x] T003 [P] Verify Google Fonts infrastructure is working in `src/_includes/layouts/base.njk`

---

## Phase 2: Foundational (CSS Custom Properties)

**Purpose**: Extend CSS custom properties system to support all visual enhancements

**⚠️ CRITICAL**: This phase MUST be complete before ANY user story implementation

- [x] T004 Add typography custom properties to `src/assets/css/style.css` `:root` section
- [x] T005 Add animation custom properties to `src/assets/css/style.css` `:root` section
- [x] T006 Add texture/gradient custom properties to `src/assets/css/style.css` `:root` section
- [x] T007 Verify CSS custom properties are properly scoped and accessible globally

**Checkpoint**: CSS custom properties foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Enhanced Typography Experience (Priority: P1) 🎯 MVP

**Goal**: Replace current Bitter font with Roboto Slab for improved rustic character while maintaining professional readability

**Independent Test**: View any blog page and verify Roboto Slab font loads and displays across all text elements with proper fallback chain

### Implementation for User Story 1

- [x] T008 [P] [US1] Update Google Fonts link from Bitter to Roboto Slab in `src/_includes/layouts/base.njk`
- [x] T009 [US1] Update `--font-family` custom property to use Roboto Slab in `src/assets/css/style.css`
- [x] T010 [US1] Verify font fallback chain includes Georgia and serif in `src/assets/css/style.css`
- [x] T011 [US1] Test font loading performance meets 2-second requirement per SC-001
- [x] T012 [US1] Validate font renders consistently across different screen sizes per acceptance scenarios

**Checkpoint**: Roboto Slab font should be fully functional and independently testable

---

## Phase 4: User Story 2 - Interactive Title Animations (Priority: P2)

**Goal**: Implement stepped reveal animations with blinking cursor on title hover for engaging user interaction

**Independent Test**: Hover over main titles (h1, h2, navigation) and observe character-by-character reveal with blinking cursor, respecting motion preferences

### Implementation for User Story 2

- [x] T013 [US2] Add typewriter and blink keyframe animations to `src/assets/css/style.css`
- [x] T014 [US2] Create `.animated-title` class with hover triggers in `src/assets/css/style.css`
- [x] T015 [US2] Add accessibility support with `prefers-reduced-motion` media query in `src/assets/css/style.css`
- [x] T016 [US2] Update navigation links to use animated-title structure in `src/_includes/partials/nav.njk`
- [x] T017 [US2] Update post titles to use animated-title structure in `src/_includes/layouts/post.njk`
- [x] T018 [US2] Update page titles to use animated-title structure in `src/index.njk` and other page templates
- [x] T019 [US2] Verify animation timing meets 100ms trigger requirement per SC-002
- [x] T020 [US2] Test touch device compatibility and keyboard navigation support

**Checkpoint**: Title animations should work independently on all target elements with full accessibility compliance

---

## Phase 5: User Story 3 - Vibrant Orange Accent Color (Priority: P3)

**Goal**: Update accent color from rusty #B7410E to vibrant #D2691E for improved visual appeal and brand consistency

**Independent Test**: View pages and confirm all accent elements (links, buttons, highlights) display vibrant orange with proper hover states

### Implementation for User Story 3

- [x] T021 [US3] Update `--color-accent` from #B7410E to #D2691E in `src/assets/css/style.css`
- [x] T022 [US3] Update `--color-accent-hover` to #A0520F in `src/assets/css/style.css`
- [x] T023 [US3] Verify WCAG 2.1 AA contrast ratios maintained per SC-003
- [x] T024 [P] [US3] Update D3.js visualization colors in `src/assets/js/explore.js` if present
- [x] T025 [US3] Test color consistency across all interface elements per acceptance scenarios
- [x] T026 [US3] Validate color appearance across different browsers per SC-006

**Checkpoint**: Vibrant orange color should be consistently applied across all accent elements

---

## Phase 6: User Story 4 - Subtle Background Elements (Priority: P4)

**Goal**: Add faint gradient backgrounds with texture that enhance visual hierarchy without overwhelming readability

**Independent Test**: View blog content and identify subtle background elements that enhance emphasis while maintaining clean design

### Implementation for User Story 4

- [x] T027 [US4] Add background texture styles for main content areas in `src/assets/css/style.css`
- [x] T028 [US4] Implement pseudo-element layering with ultra-low opacity gradients in `src/assets/css/style.css`
- [x] T029 [US4] Add site header background enhancement in `src/assets/css/style.css`
- [x] T030 [US4] Create mobile-responsive texture reduction for smaller screens in `src/assets/css/style.css`
- [x] T031 [US4] Verify textures remain below readability threshold per SC-004
- [x] T032 [US4] Test background elements don't interfere with user interaction per FR-009

**Checkpoint**: All user stories should now be independently functional with subtle background enhancements

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation and optimization across all visual enhancements

- [x] T033 [P] Run HTML validation with `npm run build && npx html-validate "_site/**/*.html"`
- [x] T034 [P] Verify responsive design functionality across 320px-1200px+ viewports per SC-007
- [x] T035 [P] Test cross-browser compatibility on Chrome, Firefox, Safari, Edge per SC-006
- [x] T036 Performance baseline comparison to ensure <10% impact per SC-005
- [x] T037 [P] Accessibility compliance validation with reduced motion testing per SC-008
- [x] T038 [P] Visual regression testing across all enhanced pages
- [x] T039 Execute quickstart.md validation steps to verify implementation guide accuracy
- [x] T040 [P] Final code cleanup and CSS organization optimization

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup) ────────────────────────────────────────────────────┐
    │                                                               │
    ▼                                                               │
Phase 2 (Foundational) ─── BLOCKS ALL USER STORIES ────────────────┤
    │                                                               │
    ├─── Phase 3 (US1: Typography) ─── Can run in parallel ────────┤
    ├─── Phase 4 (US2: Animations) ─── Can run in parallel ────────┤
    ├─── Phase 5 (US3: Colors) ────── Can run in parallel ─────────┤
    └─── Phase 6 (US4: Textures) ─── Can run in parallel ──────────┤
                                                                    │
Phase 7 (Polish) ◄─────────────────── Depends on all stories ──────┘
```

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - pure font replacement
- **User Story 2 (P2)**: No dependencies on other stories - pure animation addition
- **User Story 3 (P3)**: No dependencies on other stories - pure color updates
- **User Story 4 (P4)**: No dependencies on other stories - pure background enhancement

### Within Each User Story

- Foundation CSS properties before implementation
- Template structure before styling
- Core implementation before testing
- Accessibility compliance throughout

### Parallel Opportunities

**Limited parallelization due to CSS file conflicts:**
- Setup tasks (T001-T003) can run in parallel
- Some cross-file tasks marked [P] can run in parallel
- User stories can be implemented by different developers if coordinating CSS changes
- Testing and validation tasks can run in parallel

---

## Parallel Example: Multi-File Tasks

```bash
# These can run simultaneously (different files):
T002: "Create backup of current src/assets/css/style.css"
T008: "Update Google Fonts link in src/_includes/layouts/base.njk"
T024: "Update D3.js colors in src/assets/js/explore.js"

# These must run sequentially (same file):
T009: "Update --font-family in src/assets/css/style.css"
T021: "Update --color-accent in src/assets/css/style.css"
T027: "Add background texture styles in src/assets/css/style.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational CSS properties (T004-T007)
3. Complete Phase 3: User Story 1 typography (T008-T012)
4. **STOP and VALIDATE**: Test font loading and display independently
5. Deploy/demo if ready - provides immediate visual impact

### Incremental Delivery

1. Foundation (Phases 1-2) → CSS properties ready
2. Add Typography (Phase 3) → Test independently → Deploy (MVP!)
3. Add Animations (Phase 4) → Test independently → Deploy
4. Add Colors (Phase 5) → Test independently → Deploy
5. Add Textures (Phase 6) → Test independently → Deploy
6. Each enhancement adds visual value without breaking previous work

### Single Developer Strategy

**Recommended order for minimal CSS conflicts:**
1. Complete Foundation (critical blocking work)
2. Typography first (highest visual impact for MVP)
3. Colors second (complements typography changes)
4. Textures third (builds on color system)
5. Animations last (most complex, benefits from stable foundation)

---

## Notes

- [P] tasks work on different files and can run in parallel
- [Story] label maps task to specific user story for traceability
- Most tasks modify `src/assets/css/style.css` - coordinate carefully if multiple developers
- Each user story delivers independent visual value
- CSS custom properties enable easy theme adjustments
- All enhancements maintain existing accessibility and performance standards
- Stop at any checkpoint to validate story independently before proceeding
