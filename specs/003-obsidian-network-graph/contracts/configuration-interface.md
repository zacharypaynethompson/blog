# Configuration Interface Contract

**Interface**: Network Graph Configuration Options
**Format**: JavaScript configuration object and HTML data attributes
**Purpose**: Customizable graph behavior, theming, and performance tuning

## Contract Overview

This interface defines all configurable aspects of the network graph component, allowing customization of visual appearance, interaction behavior, and performance characteristics.

## Configuration Schema

### Primary Configuration Object

```typescript
interface GraphConfig {
  // Visual Configuration
  theme: ThemeConfig;
  nodes: NodeConfig;
  edges: EdgeConfig;
  labels: LabelConfig;

  // Interaction Configuration
  interactions: InteractionConfig;
  mobile: MobileConfig;
  accessibility: AccessibilityConfig;

  // Performance Configuration
  simulation: SimulationConfig;
  performance: PerformanceConfig;

  // Data Configuration
  data: DataConfig;
}
```

### Theme Configuration

```typescript
interface ThemeConfig {
  name: "brand-dark" | "light" | "auto";
  colors: {
    background: string;
    postNode: string;
    tagNode: string;
    postEdge: string;
    tagEdge: string;
    highlight: string;
    glow: string;
    text: string;
    textSecondary: string;
  };
  effects: {
    nodeGlow: boolean;
    edgeGlow: boolean;
    hoverScale: number;
    glowIntensity: number;
  };
}
```

### Node Configuration

```typescript
interface NodeConfig {
  post: {
    radius: number;          // Base radius in pixels
    minRadius: number;       // Minimum radius for small screens
    maxRadius: number;       // Maximum radius for scaling
    strokeWidth: number;     // Border width
    opacity: number;         // Base opacity (0-1)
  };
  tag: {
    radius: number;
    minRadius: number;
    maxRadius: number;
    strokeWidth: number;
    opacity: number;
    shape: "circle" | "rect" | "rounded-rect";
  };
  scaling: {
    byConnections: boolean;  // Scale nodes by connection count
    factor: number;         // Scaling multiplier
  };
}
```

### Edge Configuration

```typescript
interface EdgeConfig {
  postTag: {
    strokeWidth: number;
    opacity: number;
    color: string;
    dashArray: string | null; // CSS stroke-dasharray
  };
  postPost: {
    strokeWidth: number;
    opacity: number;
    color: string;
    dashArray: string | null;
  };
  hover: {
    opacityActive: number;   // Opacity for highlighted edges
    opacityInactive: number; // Opacity for dimmed edges
    strokeWidth: number;     // Width when highlighted
  };
}
```

### Label Configuration

```typescript
interface LabelConfig {
  tag: {
    alwaysVisible: boolean;
    fontSize: string;
    fontFamily: string;
    color: string;
    position: "center" | "below" | "above";
    maxLength: number;       // Truncate long tag names
  };
  post: {
    showOnHover: boolean;
    fontSize: string;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    padding: number;
    maxLength: number;
    position: "cursor" | "above" | "below";
  };
}
```

### Interaction Configuration

```typescript
interface InteractionConfig {
  click: {
    posts: "navigate" | "highlight" | "disabled";
    tags: "filter" | "highlight" | "disabled";
    background: "reset" | "disabled";
  };
  hover: {
    enabled: boolean;
    highlightConnected: boolean;
    dimOthers: boolean;
    showLabels: boolean;
    delay: number;          // Milliseconds before hover activates
  };
  drag: {
    enabled: boolean;
    constrainToViewport: boolean;
    snapBack: boolean;      // Return to original position on release
    strength: number;       // Drag force multiplier
  };
}
```

### Mobile Configuration

```typescript
interface MobileConfig {
  touchTargets: {
    minSize: number;        // Minimum touch target size (44px recommended)
    padding: number;        // Extra touch area around nodes
  };
  gestures: {
    longPressDelay: number; // Milliseconds for long press
    doubleTapDelay: number; // Milliseconds for double tap detection
    panZoom: boolean;       // Enable pan/zoom gestures
  };
  optimization: {
    reduceAnimations: boolean;
    canvasFallback: number; // Node count threshold for Canvas rendering
    simplifyEdges: boolean;
  };
}
```

### Simulation Configuration

```typescript
interface SimulationConfig {
  forces: {
    link: {
      distance: number;     // Default link distance
      strength: number;     // Link force strength
    };
    charge: {
      strength: number;     // Node repulsion strength
      theta: number;        // Barnes-Hut approximation
    };
    center: {
      strength: number;     // Centering force strength
    };
    collision: {
      enabled: boolean;
      radius: number;       // Collision detection radius
      strength: number;     // Collision response strength
    };
  };
  animation: {
    velocityDecay: number;  // Energy loss per tick
    alphaMin: number;       // Minimum simulation energy
    alphaDecay: number;     // Energy decay rate
    alphaTarget: number;    // Target energy for interactions
  };
}
```

## Default Configuration Presets

### Dark Theme with Brand Colors (Default)

```javascript
const brandDarkConfig = {
  theme: {
    name: "brand-dark",
    colors: {
      background: "#0d1117",
      postNode: "#D2691E",        // Existing brand orange
      tagNode: "#E8943B",         // Lighter brand orange
      postEdge: "rgba(139, 148, 158, 0.3)",
      tagEdge: "rgba(139, 148, 158, 0.2)",
      highlight: "#A0520F",       // Existing brand hover orange
      glow: "rgba(210, 105, 30, 0.4)",  // Orange glow
      text: "#f0f6fc",
      textSecondary: "#8b949e"
    },
    effects: {
      nodeGlow: true,
      edgeGlow: true,
      hoverScale: 1.2,
      glowIntensity: 0.4
    }
  },
  nodes: {
    post: { radius: 10, strokeWidth: 2, opacity: 0.9 },
    tag: { radius: 8, strokeWidth: 1, opacity: 0.8, shape: "rounded-rect" }
  },
  simulation: {
    forces: {
      link: { distance: 80, strength: 0.7 },
      charge: { strength: -120, theta: 0.8 },
      collision: { enabled: true, radius: 12, strength: 0.7 }
    }
  }
};
```

### Performance-Optimized Configuration

```javascript
const performanceConfig = {
  theme: { effects: { nodeGlow: false, edgeGlow: false } },
  simulation: {
    animation: {
      velocityDecay: 0.9,  // Faster settling
      alphaDecay: 0.05     // Quicker cooling
    }
  },
  mobile: {
    optimization: {
      reduceAnimations: true,
      canvasFallback: 100,
      simplifyEdges: true
    }
  }
};
```

## HTML Data Attribute Interface

### Container Configuration

```html
<!-- Theme selection -->
<div id="graph" data-theme="brand-dark">

<!-- Performance preset -->
<div id="graph" data-config="performance">

<!-- Custom configuration -->
<div id="graph"
     data-node-radius="12"
     data-edge-opacity="0.4"
     data-hover-scale="1.3"
     data-mobile-optimized="true">
```

### Supported Data Attributes

```typescript
interface DataAttributes {
  // Theme and presets
  "data-theme": "brand-dark" | "light" | "auto";
  "data-config": "default" | "performance" | "minimal" | "custom";

  // Quick customization
  "data-node-radius": string;      // CSS length value
  "data-edge-opacity": string;     // 0-1 decimal
  "data-hover-scale": string;      // Scale multiplier
  "data-glow-enabled": "true" | "false";
  "data-mobile-optimized": "true" | "false";

  // Performance
  "data-max-nodes": string;        // Integer node count limit
  "data-canvas-fallback": string;  // Node count threshold
  "data-reduce-motion": "true" | "false";
}
```

## JavaScript Configuration API

### Initialization with Custom Config

```javascript
// Initialize with custom configuration
const graph = new NetworkGraph('#network-graph-container', {
  theme: { name: 'brand-dark' },
  nodes: {
    post: { radius: 12 },
    scaling: { byConnections: true, factor: 1.5 }
  },
  interactions: {
    drag: { enabled: true, snapBack: false }
  }
});

// Update configuration after initialization
graph.updateConfig({
  theme: { name: 'light' },
  simulation: {
    forces: { charge: { strength: -200 } }
  }
});
```

### Runtime Configuration Changes

```javascript
// Theme switching
graph.setTheme('light');

// Performance adjustment
graph.setPerformanceMode(true); // Enables performance optimizations

// Mobile optimization toggle
graph.setMobileOptimization(window.innerWidth <= 768);

// Accessibility mode
graph.setAccessibilityMode(true); // Enhanced keyboard nav, screen reader support
```

## Configuration Validation

### Type Safety and Validation

```javascript
class ConfigValidator {
  static validate(config) {
    // Validate configuration object structure
    const errors = [];

    // Check required fields
    if (config.theme && !['obsidian', 'light', 'auto'].includes(config.theme.name)) {
      errors.push('Invalid theme name');
    }

    // Validate numeric ranges
    if (config.nodes?.post?.radius && (config.nodes.post.radius < 1 || config.nodes.post.radius > 50)) {
      errors.push('Node radius must be between 1 and 50');
    }

    return { valid: errors.length === 0, errors };
  }
}
```

### Default Fallbacks

```javascript
const defaultConfig = {
  // Comprehensive default configuration
  // Used when custom config is invalid or incomplete
};

function mergeConfig(userConfig) {
  return {
    ...defaultConfig,
    ...userConfig,
    // Deep merge for nested objects
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    nodes: { ...defaultConfig.nodes, ...userConfig.nodes }
  };
}
```

## Environment-Specific Configuration

### Auto-Configuration Based on Environment

```javascript
function detectOptimalConfig() {
  const config = { ...defaultConfig };

  // Performance-based adjustments
  if (navigator.hardwareConcurrency < 4) {
    config.performance.reduceAnimations = true;
    config.theme.effects.nodeGlow = false;
  }

  // Mobile detection
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    config.mobile.optimization.reduceAnimations = true;
    config.nodes.post.radius = Math.max(config.nodes.post.radius, 12);
  }

  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    config.simulation.animation.velocityDecay = 0.95;
    config.theme.effects.nodeGlow = false;
  }

  return config;
}
```

This configuration interface provides complete control over the network graph's behavior while maintaining sensible defaults and ensuring optimal performance across different devices and user preferences.