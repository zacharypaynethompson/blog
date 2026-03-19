# Implementation Plan: Interactive Obsidian-Style Network Graph

**Branch**: `003-obsidian-network-graph` | **Date**: 2026-03-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-obsidian-network-graph/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Interactive network graph visualization that replaces existing lackluster visualization with Obsidian-style dark aesthetic using existing brand colors. Uses force-directed layout to display blog posts and tags as connected nodes, enabling visual content exploration and navigation with drag interactions, hover effects, and tag-based filtering.

## Technical Context

**Language/Version**: JavaScript ES2020+ (browser), Node.js 18+ (Eleventy build process)
**Primary Dependencies**: D3.js (force simulation, SVG rendering), Eleventy 2.x (existing static site generator)
**Storage**: Static Markdown files with YAML frontmatter (existing blog posts)
**Testing**: NEEDS CLARIFICATION (current project testing approach unknown)
**Target Platform**: Modern web browsers (desktop and mobile), integrated with existing Eleventy blog
**Project Type**: Static site generator enhancement with interactive web visualization
**Performance Goals**: 30+ FPS animation during interactions, <3 second initial render for 200 nodes, <200ms response to user interactions
**Constraints**: Client-side only (static hosting), up to several hundred nodes max, mobile touch support required
**Scale/Scope**: 5-200+ blog posts/tags, single interactive page, existing blog integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Simplicity First ✅
- **YAGNI**: Only adding D3.js dependency as explicitly required for force-directed graphs
- **Minimal Dependencies**: D3.js justified (no equivalent in standard library/browser APIs)
- **Flat Structures**: Simple structure - graph page, CSS, JS files, integrates with existing flat Eleventy structure
- **Single Responsibility**: Network graph has single purpose - content exploration/navigation

### II. Content-Centric Design ✅
- **Markdown First**: ✅ Uses existing Markdown posts, no new authoring requirements
- **Fast Reads**: ✅ <3 second load target aligns with constitution requirement
- **Accessible by Default**: Must ensure WCAG 2.1 AA compliance (keyboard nav, screen readers, color contrast)
- **SEO Foundations**: ✅ Enhances existing blog structure, doesn't impact SEO

### III. Ship Early, Iterate Often ✅
- **MVP Mindset**: ✅ P1 story delivers minimum viable graph visualization
- **No Big Bang Releases**: ✅ 4 prioritized stories enable incremental delivery
- **Working State Always**: ✅ Feature branch workflow maintains main branch stability
- **Feedback Loops**: ✅ Each story independently testable and demonstrable

**GATE RESULT: PASSED** - No constitution violations identified.

### Phase 1 Re-Check ✅

After completing design and contracts:

**I. Simplicity First** ✅
- **YAGNI**: Only D3.js added as dependency, all features driven by explicit requirements
- **Minimal Dependencies**: Single additional library (D3.js), leverages existing Eleventy infrastructure
- **Flat Structures**: Clean file organization - single page, dedicated CSS/JS, data endpoint
- **Single Responsibility**: Each component has clear purpose (data extraction, visualization, styling)

**II. Content-Centric Design** ✅
- **Markdown First**: ✅ Zero impact on authoring workflow, uses existing frontmatter
- **Fast Reads**: ✅ <3 second load target maintained, performance optimizations identified
- **Accessible by Default**: ✅ WCAG 2.1 AA compliance planned with ARIA labels, keyboard nav
- **SEO Foundations**: ✅ No impact on SEO, enhances existing structure

**III. Ship Early, Iterate Often** ✅
- **MVP Mindset**: ✅ P1 story delivers complete core value independently
- **No Big Bang Releases**: ✅ Each priority level can be deployed incrementally
- **Working State Always**: ✅ Feature branch workflow, isolated page implementation
- **Feedback Loops**: ✅ Each user story independently testable and demonstrable

**FINAL GATE RESULT: PASSED** - Design maintains constitutional compliance.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
├── network-graph.njk           # New Eleventy page template for graph visualization
├── _data/
│   └── networkGraph.js         # New data file to extract post/tag relationships
├── assets/
│   ├── css/
│   │   └── network-graph.css   # New styles for Obsidian-style graph aesthetics
│   └── js/
│       └── network-graph.js    # New D3.js implementation for interactive graph
└── _includes/
    └── partials/
        └── graph-controls.njk  # New partial for filter/reset controls

tests/ (structure TBD based on current testing approach)
├── network-graph.test.js       # New tests for graph functionality
└── data-extraction.test.js     # New tests for frontmatter processing
```

**Structure Decision**: Integrating with existing Eleventy blog structure. The network graph will be implemented as a new page (`/network-graph/`) with dedicated CSS/JS assets. Data extraction leverages Eleventy's existing `_data` directory pattern for build-time processing of blog post frontmatter. This maintains the flat structure principle from the constitution while clearly organizing graph-specific code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
