# Data Model: Interactive Hero Physics Banner

**Feature**: 004-hero-physics-simulation
**Date**: 2026-03-20

## Overview

This feature has no persistent data. All state exists in-memory during the browser session and is discarded on page navigation. The data model describes the runtime entities managed by the simulation.

## Entities

### Particle

Represents a single visual element in the simulation.

| Field | Type | Description |
|-------|------|-------------|
| x | number | Current horizontal position (pixels from left edge of canvas) |
| y | number | Current vertical position (pixels from top edge of canvas) |
| vx | number | Horizontal velocity (pixels per frame) |
| vy | number | Vertical velocity (pixels per frame) |
| radius | number | Visual radius (2-8 pixels, set at initialization, immutable) |
| opacity | number | Fill opacity (0.15-0.40, set at initialization, immutable) |

**Initialization**: Particles are created with random positions distributed across the canvas area. Radius and opacity are randomized within their ranges, with most particles small (2-5px) and a few larger (6-8px, lower opacity) for depth.

**State transitions**:
- **Idle**: Gentle ambient drift (sinusoidal velocity nudge based on particle index + time)
- **Influenced**: Cursor force applied to velocity when within force field radius
- **Damped**: Velocity decays by factor 0.93 each frame regardless of state

### Cursor State

Represents the current mouse interaction state.

| Field | Type | Description |
|-------|------|-------------|
| x | number | Current cursor x position relative to canvas |
| y | number | Current cursor y position relative to canvas |
| active | boolean | Whether cursor is within the canvas bounds |

**State transitions**:
- `mouseenter` on canvas: `active = true`
- `mouseleave` from canvas: `active = false`
- `mousemove` on canvas: updates `x`, `y`

### Simulation Config

Constants that control simulation behavior. Set once at initialization.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| damping | number | 0.93 | Velocity decay per frame |
| forceStrength | number | 0.8 | Cursor repulsion strength |
| forceRadius | number | canvas height * 0.9 | Radius of cursor influence (pixels) |
| minDist | number | 20 | Minimum cursor-particle distance (clamp) |
| lineDistance | number | 80 | Max distance to draw connecting lines |
| lineOpacity | number | 0.08 | Opacity of connecting lines |
| ambientStrength | number | 0.15 | Strength of idle drift force |

## Relationships

```
Simulation (1) ──contains──> Particles (40-100)
Simulation (1) ──tracks──> Cursor State (1)
Simulation (1) ──configured by──> Config (1)
Cursor State ──applies force to──> Particles (within radius)
Particles ──connected to──> Particles (within lineDistance, visual only)
```

## No Persistence

All data is ephemeral. Particles are regenerated fresh on each page load. No data is stored in localStorage, cookies, or server-side.
