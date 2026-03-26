# Data Model: Network Constellation Title Animation

**Date**: 2026-03-26
**Feature**: 005-title-animation-variants

## Entities

### Title Letter

An individual character element within the nav title, animated by spring physics.

| Field | Description |
|-------|-------------|
| Character | The text character displayed |
| Index | Position in the title string (0-based) |
| Color Class | `title-char-normal` (indices < accent start) or `title-char-accent` (indices >= accent start) |
| Element | The DOM `<span>` wrapping this character |

**Physics State** (per letter, JS only — not persisted):

| Field | Description |
|-------|-------------|
| x, y | Current offset from final position (px). Starts at random scatter, converges to 0,0 |
| vx, vy | Current velocity (px/frame). Updated each frame by spring force and damping |
| arrived | Boolean. True when letter first enters within 3px of origin. Triggers edge fadeout |
| settled | Boolean. True when position < 0.3px and velocity < 0.1px/frame. Snaps to final state |

**Constraints**:
- Color class determined by `data-accent-start` attribute (default: 4)
- Final rendered state must match existing `.nav-logo` styling exactly
- Scatter range: ±45px horizontal, ±30px vertical

### Network Edge

An SVG `<line>` element connecting two title letters.

| Field | Description |
|-------|-------------|
| Line Element | SVG `<line>` with stroke color from `--color-accent` |
| From Index | Index of the first connected letter |
| To Index | Index of the second connected letter |
| Dead | Boolean. True when both endpoints have `arrived`; triggers 100ms fadeout |

**Constraints**:
- Stroke width: 1.2px
- Stroke opacity: distance-based, max 0.35, drops to 0 beyond 80px
- Connection rules: all pairs with index distance ≤ 2, plus ~15% random additional pairs
- Fadeout transition: 100ms ease once both endpoints arrive

### SVG Overlay

The container for all network edge elements.

| Field | Description |
|-------|-------------|
| Element | SVG element, absolutely positioned over the title container |
| Lifecycle | Created at animation start → updated per frame → removed 200ms after all letters settle |

**Attributes**: `aria-hidden="true"`, `pointer-events: none`, `overflow: visible`

## State Transitions

```
Page load
  → IntersectionObserver fires (threshold 0.1)
  → splitLetters(): text → individual <span> elements with color classes, aria-label set
  → Check prefers-reduced-motion → if reduce: STOP (letters visible in final state)
  → Create SVG overlay and edge lines
  → Scatter letters at random offsets (opacity 0)
  → Fade letters to 0.5 opacity (staggered 30ms each)
  → Begin spring simulation (200ms delay, 40ms stagger per letter):
      Per frame per letter:
        - Apply spring force toward (0,0)
        - Apply damping (×0.90)
        - Update position and opacity
        - If dist < 3px → mark arrived (first time only)
        - If dist < 0.3px and velocity < 0.1 → mark settled, snap to final
      Per frame per edge:
        - If both endpoints arrived → fade to 0 in 100ms, mark dead
        - Else: update line positions, set opacity by distance
  → All letters settled
  → Wait 200ms → remove SVG overlay → reset container position style
```
