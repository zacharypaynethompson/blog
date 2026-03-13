# Data Model: Rustic Visual Styling System

**Date**: 2026-03-13
**Feature**: 002-rustic-styling
**Phase**: Phase 1 Design

## Overview

This document defines the structural organization of the visual styling system for the rustic enhancements. The model describes the relationships between styling entities, their properties, and validation rules.

## Core Styling Entities

### 1. Typography System

**Entity**: `TypographyConfig`
- **Primary Font**: Roboto Slab (Google Fonts)
- **Fallback Chain**: Georgia, serif
- **Weights**: 400 (regular), 700 (bold)
- **Loading Strategy**: font-display: swap with preconnect

**Properties**:
```css
--font-family: 'Roboto Slab', Georgia, serif
--font-size-base: 18px
--line-height: 1.6
--type-scale: 1.25
```

**Validation Rules**:
- Font must load within 2 seconds (FR-001 → SC-001)
- Must maintain readability across all screen sizes
- Fallback fonts must provide acceptable substitution

**State Transitions**:
- Loading → Web Font Available → Rendered
- Loading → Timeout → Fallback Font → Rendered

### 2. Color Palette System

**Entity**: `ColorSystem`
- **Primary Accent**: #D2691E (Chocolate Orange)
- **Accent Hover**: #A0520F (calculated 20% darker)
- **Background**: #FDFBF7 (existing, unchanged)
- **Text**: #2D2D2D (existing, unchanged)

**Properties**:
```css
--color-accent: #D2691E
--color-accent-hover: #A0520F
--color-bg: #FDFBF7
--color-text: #2D2D2D
```

**Validation Rules**:
- Accent color must maintain 4.5:1 contrast ratio minimum against background
- Hover states must provide visible differentiation
- Color consistency across all interface elements required

**Relationships**:
- ColorSystem → D3Visualization (coordination required)
- ColorSystem → InteractionStates (hover, focus, active)

### 3. Animation System

**Entity**: `TypewriterAnimation`
- **Trigger**: Hover event on title elements (h1, h2, nav links)
- **Behavior**: Sequential character reveal with blinking cursor
- **Duration**: Variable based on text length
- **Accessibility**: Respects prefers-reduced-motion

**Properties**:
```css
--animation-speed: 50ms per character
--cursor-blink-rate: 1s
--animation-easing: steps() timing function
```

**State Machine**:
1. **Idle**: Normal text display
2. **Hover Start**: Begin character-by-character reveal
3. **Revealing**: Active animation with cursor
4. **Complete**: Full text with blinking cursor
5. **Hover End**: Reset to idle state

**Validation Rules**:
- Animation must start within 100ms of hover
- Must complete at readable pace
- Must disable for users with motion sensitivity

### 4. Background Texture System

**Entity**: `GradientTexture`
- **Implementation**: CSS pseudo-elements with layered gradients
- **Opacity Range**: 0.005-0.02 for subtlety
- **Pattern Type**: Combined radial (noise) + linear (gradient) patterns
- **Responsive**: Reduced effects on mobile

**Layer Structure**:
1. **Base Layer**: Existing background color
2. **Gradient Layer**: Faint linear/radial gradients using accent color
3. **Texture Layer**: Ultra-low opacity noise patterns

**Properties**:
```css
--texture-opacity: 0.015
--gradient-opacity: 0.008
--texture-size: 12px 12px
--gradient-direction: 135deg
```

**Validation Rules**:
- Must not reduce text readability below baseline
- Performance impact <1% render time
- Must remain invisible to users with visual sensitivities

## System Relationships

### Dependency Graph

```text
ColorSystem
├── Typography (font color coordination)
├── Animation (cursor color inheritance)
└── GradientTexture (accent color usage)

Animation
├── Typography (applies to text elements)
└── AccessibilitySystem (motion preference detection)

GradientTexture
├── ColorSystem (uses accent colors)
└── ResponsiveSystem (mobile optimization)
```

### Integration Points

**CSS Custom Properties Hub**:
- All systems use CSS custom properties for centralized theming
- Properties defined in `:root` for global access
- Scoped overrides available for specific components

**Accessibility Integration**:
- Motion detection: `prefers-reduced-motion` media query
- High contrast support: `prefers-contrast` media query
- Color vision support: sufficient contrast ratios maintained

**Performance Integration**:
- Font loading coordinated with existing Google Fonts setup
- Animations use compositor thread (transform/opacity properties)
- Textures implemented as pure CSS (no additional HTTP requests)

## Data Flow

### Initialization Flow
1. CSS custom properties loaded
2. Font loading initiated with fallback
3. Base colors and textures applied
4. Animation event listeners attached

### User Interaction Flow
1. User hovers over title element
2. Motion preference checked
3. Animation initiated (if allowed) or static display
4. Cursor blinking activated
5. User exits hover → animation reset

### Responsive Flow
1. Screen size detected
2. Texture complexity adjusted
3. Animation parameters optimized
4. Font scaling maintained

## Validation Schema

### Typography Validation
```javascript
const typographyRules = {
  fontFamily: /^'Roboto Slab',/,
  fallbackChain: ['Georgia', 'serif'],
  weights: [400, 700],
  loadingTime: { max: 2000 }, // milliseconds
}
```

### Color Validation
```javascript
const colorRules = {
  accentContrast: { min: 4.5, target: 4.86 },
  hexFormat: /^#[0-9A-F]{6}$/i,
  consistency: 'all-elements-must-use-custom-properties'
}
```

### Animation Validation
```javascript
const animationRules = {
  triggerDelay: { max: 100 }, // milliseconds
  respectsMotionPrefs: true,
  characterSpeed: { range: [30, 80] }, // ms per character
  accessibility: 'wcag-2.1-aa'
}
```

This data model provides the structural foundation for implementing the rustic visual styling enhancements while ensuring consistency, accessibility, and maintainability.
