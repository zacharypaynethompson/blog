# Data Model: Title Animation Variants

**Date**: 2026-03-26
**Feature**: 005-title-animation-variants

## Entities

### Animation Variant

A named animation behavior for the title text.

| Field | Description |
|-------|-------------|
| Name | Unique identifier string (e.g., "pull-up", "neural-resolve", "gradient-descent") |
| Animate Function | Logic that receives an array of letter elements and orchestrates their entrance animation |
| Duration | Total time from first letter start to last letter settled (max 2000ms) |
| Stagger | Delay between each letter's animation start |

**Constraints**:
- Name must be a valid URL parameter value (lowercase, hyphenated)
- Animation must leave all letters in their natural DOM flow position when complete
- Animation must be cancellable (for reduced-motion mid-animation)

### Title Letter

An individual character element within the title.

| Field | Description |
|-------|-------------|
| Character | The text character displayed |
| Index | Position in the title string (0-based) |
| Color Class | Either "normal" (indices 0-3) or "accent" (indices 4+), determined by split index |
| Element | The DOM span wrapping this character |

**Constraints**:
- Color class assignment is determined by a configurable split index (default: 4)
- Final rendered state must match existing nav-logo styling exactly

### Animation Configuration

Runtime configuration for which variant is active.

| Field | Description |
|-------|-------------|
| Default Variant | The variant name set in the HTML template (data attribute) |
| Override Variant | Optional variant name from URL query parameter, takes precedence over default |
| Active Variant | Resolved variant: override if present, otherwise default |

**State Transitions**:
- Page load → Read config → Resolve active variant → Split text into letters → Run animation → Complete (static final state)

## Relationships

```
Configuration 1──resolves──▶ 1 Animation Variant
Animation Variant 1──animates──▶ N Title Letters
Title Element 1──contains──▶ N Title Letters
```
