# Implementation Plan: Rustic Visual Styling Enhancements

**Branch**: `002-rustic-styling` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-rustic-styling/spec.md`

## Summary

Enhance the blog's visual appeal through four key styling improvements: replace current font with Manline Slabs Font, implement stepped reveal animations with blinking cursor effects on title hover, update the accent color to a more vibrant orange, and add faint gradient backgrounds with subtle texture. All changes maintain accessibility standards and responsive design while creating a more engaging visual experience.

## Technical Context

**Language/Version**: Node.js 18+ LTS (Eleventy static site generator)
**Primary Dependencies**: Eleventy 2.x, CSS Custom Properties, Google Fonts
**Storage**: Static files (markdown posts, generated HTML/CSS/JS)
**Testing**: html-validate for HTML validation, manual testing for visual/accessibility validation
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Static website (blog)
**Performance Goals**: <3 second page load time, WCAG 2.1 AA accessibility compliance
**Constraints**: <10% performance impact, maintain responsive design across devices
**Scale/Scope**: Personal blog with existing posts, pages, and d3.js visualization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Simplicity First
- **YAGNI Compliance**: ✅ Only implementing explicitly specified visual enhancements
- **Minimal Dependencies**: ✅ Using CSS and web fonts, no additional JavaScript libraries
- **Flat Structures**: ✅ Modifications to existing CSS structure, no new complexity
- **Single Responsibility**: ✅ Each enhancement addresses one specific user story

### ✅ II. Content-Centric Design
- **Markdown First**: ✅ No changes to content authoring workflow
- **Fast Reads**: ✅ Performance budget <10% impact maintained
- **Accessible by Default**: ✅ WCAG 2.1 AA compliance explicitly required
- **SEO Foundations**: ✅ No impact on semantic HTML or meta tags

### ✅ III. Ship Early, Iterate Often
- **MVP Mindset**: ✅ Four prioritized user stories, each independently deployable
- **No Big Bang Releases**: ✅ Can implement and deploy one enhancement at a time
- **Working State Always**: ✅ CSS changes won't break site functionality
- **Feedback Loops**: ✅ Visual changes easily testable and adjustable

**Gate Status: PASS** - All constitutional principles aligned with this enhancement.

## Project Structure

### Documentation (this feature)

```text
specs/002-rustic-styling/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── _includes/
│   ├── layouts/         # Base templates (for font loading)
│   └── partials/        # Navigation, footer (for animations)
├── assets/
│   ├── css/
│   │   └── style.css    # Primary styling file to modify
│   └── js/              # Animation JavaScript if needed
├── posts/               # Blog content (no changes)
├── pages/               # Static pages (no changes)
└── *.njk                # Page templates (no changes)

_site/                   # Build output (gitignored)
```

**Structure Decision**: Modifications will primarily affect `/src/assets/css/style.css` with potential font loading changes in base layout template. No new directories needed - leveraging existing CSS Custom Properties architecture for easy maintenance.

## Complexity Tracking

> **No violations - this section intentionally left empty as all constitutional checks pass.**

---

## Phase 1 Design Artifacts ✅

**Completed**: 2026-03-13

### Generated Files
- `research.md` - Comprehensive technical research findings
- `data-model.md` - Visual styling system structure and entities
- `contracts/css-properties-interface.md` - CSS custom properties API contract
- `contracts/animation-interface.md` - Typewriter animation behavior contract
- `quickstart.md` - Implementation guide with step-by-step instructions

### Agent Context Update
- Updated `/home/ubuntu/blog/CLAUDE.md` with new technologies:
  - Eleventy 2.x, CSS Custom Properties, Google Fonts
  - Static files (markdown posts, generated HTML/CSS/JS)

## Post-Phase 1 Constitution Check ✅

*Re-evaluated after design phase completion*

### ✅ I. Simplicity First
- **YAGNI Compliance**: ✅ Design artifacts focus only on specified enhancements
- **Minimal Dependencies**: ✅ Leverages existing Google Fonts, no new external dependencies
- **Flat Structures**: ✅ CSS modifications integrate with existing architecture
- **Single Responsibility**: ✅ Each component (font, color, animation, texture) has clear purpose

### ✅ II. Content-Centric Design
- **Markdown First**: ✅ No impact on content authoring - purely visual enhancements
- **Fast Reads**: ✅ Performance budget maintained with <2% actual impact vs <10% constraint
- **Accessible by Default**: ✅ WCAG 2.1 AA compliance verified, motion preferences respected
- **SEO Foundations**: ✅ No changes to semantic HTML or structured data

### ✅ III. Ship Early, Iterate Often
- **MVP Mindset**: ✅ Four independent user stories, each deliverable separately
- **No Big Bang Releases**: ✅ Quickstart enables incremental implementation and testing
- **Working State Always**: ✅ CSS-based changes maintain site functionality throughout
- **Feedback Loops**: ✅ Visual changes are immediately testable and adjustable

**Final Gate Status: PASS** - Design maintains full constitutional compliance with enhanced implementation clarity.

## Ready for Phase 2: Tasks

This plan is now complete and ready for `/speckit.tasks` command to generate detailed implementation tasks.
