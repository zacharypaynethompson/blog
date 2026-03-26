# Feature Specification: Network Constellation Title Animation

**Feature Branch**: `005-title-animation-variants`
**Created**: 2026-03-26
**Status**: Implemented
**Input**: Replace the typewriter animation on the "zacsblog" nav logo with a constellation-inspired network animation that matches the hero physics banner aesthetic

## Clarifications

### Session 2026-03-26

- Q: Should the spec describe a multi-variant system or the single shipped animation? → A: Single animation — the exploration phase is conversation history, not specification.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Network Constellation Title Animation (Priority: P1)

As the blog owner, I want the "zacsblog" navigation title to animate on page load using a constellation network effect: individual letters start scattered at random positions and converge to their final resting places using damped spring physics, while thin SVG edges connect nearby letters like a network graph that collapses into the title text. The animation should feel organic and match the visual DNA of the existing hero physics banner.

**Why this priority**: This is the core and only animation — without it, the title has no entrance effect.

**Independent Test**: Load any page on the site in a browser and observe the nav title animating with scattered letters converging via spring physics while constellation edges connect them.

**Acceptance Scenarios**:

1. **Given** any page is loaded, **When** the nav title enters the viewport, **Then** each letter of "zacsblog" appears at a random scattered position and converges toward its final position using damped spring motion with subtle wobble
2. **Given** the animation is playing, **When** observing the letter motion, **Then** letters exhibit natural spring overshoot and damping (not a smooth ease curve) consistent with the hero physics particle behavior
3. **Given** the animation is playing, **When** observing the SVG overlay, **Then** thin accent-colored lines connect nearby letter pairs with opacity proportional to distance between them
4. **Given** two connected letters have both first reached their destination point, **When** both endpoints arrive within the arrival threshold, **Then** the connecting edge fades out rapidly (~100ms)
5. **Given** the animation completes (all letters settled), **When** the title is fully rendered, **Then** all SVG edges and the overlay are removed from the DOM, and the title appears in its standard static state

---

### User Story 2 - Accent Color Split (Priority: P1)

As the blog owner, I want the animation to preserve the brand color scheme: "zacs" in the primary text color and "blog" in the accent color, throughout the entire animation and in the final state.

**Why this priority**: The color split is integral to the blog's visual identity and must be correct from the first frame of animation.

**Independent Test**: Observe that during and after the animation, the first 4 letters use `--color-text` and the last 4 use `--color-accent`, in both light and dark mode.

**Acceptance Scenarios**:

1. **Given** the animation is playing or complete, **When** viewing the title, **Then** characters at indices 0-3 ("zacs") use `var(--color-text)` and characters at indices 4-7 ("blog") use `var(--color-accent)`
2. **Given** dark mode is active, **When** the animation plays, **Then** the SVG edge color and letter colors use the dark mode accent and text color values
3. **Given** the color split index is configurable via `data-accent-start`, **When** the attribute value changes, **Then** the color split adjusts accordingly without code changes

---

### User Story 3 - Accessibility and Reduced Motion (Priority: P1)

As a visitor who prefers reduced motion, I want the title to appear immediately in its final state without any animation.

**Why this priority**: Accessibility is non-negotiable and legally required (WCAG 2.1 AA).

**Independent Test**: Enable `prefers-reduced-motion: reduce` in OS/browser settings and verify the title appears instantly with no animation or SVG overlay.

**Acceptance Scenarios**:

1. **Given** the user has `prefers-reduced-motion: reduce` enabled, **When** any page loads, **Then** letters are split and rendered immediately in their final positions with correct colors, no spring animation plays, and no SVG overlay is created
2. **Given** the title is rendered without animation, **When** inspecting the DOM, **Then** an `aria-label` attribute with the full title text is present on the container element

---

### Edge Cases

- **Back/forward navigation**: Animation replays on each page load (Eleventy generates static pages; each navigation is a full page load)
- **Title not in viewport**: IntersectionObserver (threshold 0.1) defers animation until the element enters the viewport; it plays once when visible
- **Title text changes**: The animation is text-agnostic; it reads the element's text content and works with any string. The color split is controlled by `data-accent-start` and is not hardcoded to "zacsblog"
- **Low-powered devices**: The animation uses `requestAnimationFrame` and will naturally drop frames on slow devices; the spring physics will still converge correctly just with lower visual fidelity
- **SVG cleanup**: The SVG overlay and all edge elements are fully removed from the DOM after animation completes, leaving zero residual elements

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The title animation MUST use damped spring physics to move each letter from a random scattered position to its final resting place, producing natural overshoot and wobble (spring constant: 0.015, damping: 0.90)
- **FR-002**: During animation, thin SVG line elements MUST connect nearby letter pairs, with stroke opacity proportional to the distance between connected letters (max opacity 0.35, max distance 80px)
- **FR-003**: SVG edges MUST connect all adjacent letter pairs (distance ≤ 2) and a random subset (~15%) of non-adjacent pairs
- **FR-004**: SVG edges MUST use the current theme's `--color-accent` value for stroke color, with stroke width of 1.2px
- **FR-005**: When both endpoints of an edge first arrive at their destination (within 3px arrival threshold), that edge MUST fade out in ~100ms
- **FR-006**: Each letter MUST start invisible (opacity 0) at its random offset, then fade to 0.5 opacity with a 30ms stagger per letter, before the spring convergence begins after a 200ms initial delay
- **FR-007**: Letter opacity MUST increase from 0.5 to 1.0 as the letter approaches its final position, proportional to distance from origin
- **FR-008**: A letter is considered "settled" when it is within 0.3px of its final position and velocity is below 0.1px/frame on both axes; at that point its transform and opacity are snapped to their final values
- **FR-009**: After all letters settle, the SVG overlay MUST be removed from the DOM after a 200ms delay, and the container's position style MUST be reset
- **FR-010**: Letters MUST stagger their convergence start by 40ms per letter index (first letter starts at 200ms, second at 240ms, etc.)
- **FR-011**: The animation MUST preserve the "zacs" / "blog" color split using `title-char-normal` and `title-char-accent` CSS classes, with the split index configurable via `data-accent-start` attribute (default: 4)
- **FR-012**: The animation MUST respect `prefers-reduced-motion: reduce` by skipping all animation and showing the title immediately in its final state
- **FR-013**: The animation MUST be triggered by IntersectionObserver (threshold 0.1) and play only once per page load
- **FR-014**: The animation MUST work in both light and dark mode by reading CSS custom properties at runtime
- **FR-015**: The animation MUST function on modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)

### Key Entities

- **Title Letter**: An individual character of the nav title, wrapped in a `<span>` with class `title-letter` plus a color class (`title-char-normal` or `title-char-accent`). Each letter has spring physics state: position (x, y), velocity (vx, vy), and flags for `arrived` (first reached destination) and `settled` (fully at rest).
- **Network Edge**: An SVG `<line>` element connecting two letters. Has distance-based opacity while active, and a `dead` flag set when both endpoints have arrived, triggering rapid fadeout.
- **SVG Overlay**: A full-size SVG element positioned absolutely over the title container. Created at animation start, removed from DOM after all letters settle. Has `aria-hidden="true"` and `pointer-events: none`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Title animation plays on every page load, completing with all letters in their correct final positions
- **SC-002**: Animation completes (all letters settled) within 2 seconds of the title entering the viewport
- **SC-003**: SVG overlay and all edge elements are fully removed from the DOM after animation completion
- **SC-004**: Animation displays correctly in both light and dark mode with theme-appropriate colors
- **SC-005**: With `prefers-reduced-motion: reduce`, the title appears instantly with zero animation
- **SC-006**: The animation visually matches the constellation/network aesthetic of the hero physics banner (particles connected by distance-based lines, spring-damped motion)

## Assumptions

- The animation applies to the "zacsblog" navigation logo title only, not blog post titles or page headings
- The existing dual-color scheme ("zacs" in text color, "blog" in accent) is a firm brand requirement
- The animation was designed to match the hero physics banner aesthetic (damped springs, accent-colored connecting lines, distance-based opacity)
- Performance impact is negligible — 8 letter elements and ~15 SVG lines, animated via requestAnimationFrame
- The old typewriter animation has been fully removed and replaced

## Scope Boundaries

**In scope**:
- Single constellation network animation for the nav title
- Damped spring physics for letter convergence
- SVG edge overlay with distance-based opacity and arrival-triggered fadeout
- Accent color split preservation
- Reduced motion accessibility
- Light/dark mode support

**Out of scope**:
- Multiple animation variants or a variant switching system
- Changes to the hero physics canvas banner
- Animations on any other text elements
- Animation customization UI or configuration beyond `data-accent-start`
