# Quickstart Guide: Interactive Obsidian-Style Network Graph

**Feature**: 003-obsidian-network-graph
**Estimated Implementation Time**: 2-3 days
**Prerequisites**: Basic D3.js knowledge, Eleventy familiarity

## Overview

Add an interactive network graph visualization to your Eleventy blog that displays posts and tags as connected nodes with an Obsidian-style dark aesthetic using your existing brand colors. Users can explore relationships, navigate to posts, and filter by tags.

## Quick Implementation Steps

### 1. Setup Testing Infrastructure (30 minutes)

```bash
# Install testing dependencies
npm install --save-dev vitest jsdom

# Add test scripts to package.json
npm run test    # Will run Vitest
npm run lint    # Will run html-validate
```

**Files to create**:
- `tests/unit/` - For utility function tests
- `tests/integration/` - For D3.js component tests

### 2. Create Data Extraction (45 minutes)

**File**: `src/_data/networkGraph.js`
```javascript
module.exports = {
  permalink: '/data/network-graph.json',
  eleventyExcludeFromCollections: true,
  data: () => {
    return {
      // Collection processing logic here
      // Extract posts, create nodes and links
    };
  }
};
```

**Integrates with**: Existing Eleventy collections in `eleventy.config.js`

### 3. Create Network Graph Page (60 minutes)

**File**: `src/network-graph.njk`
```njk
---
layout: layouts/base.njk
title: Network Graph
---

<div id="network-graph-container" class="network-graph" data-theme="brand-dark">
  <div class="graph-controls">
    <button id="reset-graph" class="btn-reset">Reset View</button>
  </div>
  <div class="graph-viewport">
    <svg id="network-graph-svg" role="img"></svg>
  </div>
</div>

{% block scripts %}
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="/assets/js/network-graph.js"></script>
{% endblock %}
```

### 4. Implement Obsidian Styling (90 minutes)

**File**: `src/assets/css/network-graph.css`
```css
/* Dark theme using existing brand colors */
.network-graph[data-theme="brand-dark"] {
  background: #0d1117;
  border: 1px solid #30363d;
}

/* Multi-layer glow effects using brand orange */
.brand-node-glow {
  box-shadow:
    0 0 8px rgba(210, 105, 30, 0.5),
    0 0 16px rgba(210, 105, 30, 0.3),
    0 0 24px rgba(210, 105, 30, 0.2);
}

/* Node and edge styling with brand colors */
.graph-node.post { fill: var(--color-accent); }     /* #D2691E */
.graph-node.tag { fill: #E8943B; }                   /* Lighter orange */
.graph-edge { stroke: rgba(139, 148, 158, 0.3); }
```

### 5. Build D3.js Visualization (3-4 hours)

**File**: `src/assets/js/network-graph.js`
```javascript
(function() {
  'use strict';

  // Configuration
  const config = {
    forces: {
      link: { distance: 80, strength: 0.7 },
      charge: { strength: -120, theta: 0.8 }
    },
    nodes: {
      post: { radius: 10, color: '#D2691E' },  // Existing brand orange
      tag: { radius: 8, color: '#E8943B' }     // Lighter brand orange
    },
    performance: { targetFPS: 30 }
  };

  // Main initialization
  async function init() {
    const data = await loadGraphData();
    const graph = createVisualization(data);
    setupInteractions(graph);
  }

  // Load data from JSON endpoint
  async function loadGraphData() {
    const response = await fetch('/data/network-graph.json');
    return response.json();
  }

  // D3.js force simulation setup
  function createVisualization(data) {
    // Implementation details from research findings
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

## Key Implementation Details

### Force Simulation Configuration

From research findings, use these optimized settings for 200+ nodes:

```javascript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
    .strength(link => 1 / Math.min(link.source.degree, link.target.degree)))
  .force('charge', d3.forceManyBody().strength(-120).theta(0.8))
  .force('collision', d3.forceCollide().radius(12).strength(0.7))
  .velocityDecay(0.4)  // Smoother animation
  .alphaMin(0.001);
```

### Mobile Touch Interactions

```javascript
// Tap state management for mobile hover alternatives
let activeNode = null;

node.on("click", function(event, d) {
  if (activeNode === d) {
    window.location.href = d.url; // Double tap navigation
  } else {
    highlightConnections(d, true); // First tap highlight
    activeNode = d;
  }
});
```

### Accessibility Support

```javascript
// Keyboard navigation
document.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'Escape': resetGraph(); break;
    case 'Tab': handleFocusNavigation(); break;
    case 'Enter': activateSelectedNode(); break;
  }
});

// ARIA labels for screen readers
function updateNodeLabels(node) {
  const connections = getConnectedNodes(node);
  d3.select(node.element)
    .attr('aria-label', `${node.title}. Connected to ${connections.length} tags`);
}
```

## File Structure After Implementation

```text
src/
├── network-graph.njk           # New page template
├── _data/
│   └── networkGraph.js         # New data extraction
├── assets/
│   ├── css/
│   │   └── network-graph.css   # New Obsidian styling
│   └── js/
│       └── network-graph.js    # New D3.js implementation
└── _includes/partials/
    └── graph-controls.njk      # New control components

tests/
├── unit/
│   ├── data-extraction.test.js    # Test collection logic
│   └── graph-utilities.test.js    # Test helper functions
└── integration/
    └── network-graph.test.js      # Test D3.js lifecycle
```

## User Stories Implementation Priority

### P1: Graph Exploration (Core MVP - Day 1)
- ✅ Data extraction from blog posts
- ✅ Basic SVG rendering with D3.js
- ✅ Post and tag nodes with connections
- ✅ Obsidian dark theme aesthetic

### P2: Post Navigation (Day 2)
- ✅ Click-to-navigate functionality
- ✅ Hover effects and highlighting
- ✅ Mobile touch interactions

### P3: Tag-Based Filtering (Day 2-3)
- ✅ Tag click filtering
- ✅ Reset functionality
- ✅ Smooth animations

### P4: Interactive Physics (Day 3 - Polish)
- ✅ Drag interactions
- ✅ Physics manipulation
- ✅ Performance optimization

## Testing Strategy

### Unit Tests (Quick Wins)
```javascript
// Test data extraction
describe('Graph Data Collection', () => {
  it('generates nodes from blog posts', () => {
    // Test with mock Eleventy collection
  });
});

// Test utility functions
describe('Graph Utilities', () => {
  it('debounce delays function execution', () => {
    // Test interaction helpers
  });
});
```

### Integration Tests (Core Functionality)
```javascript
// Test D3.js lifecycle
describe('Network Graph Component', () => {
  it('initializes graph visualization', () => {
    // Test full component initialization
  });
});
```

## Performance Targets

From research findings, these targets are achievable:

- **Initial Load**: <3 seconds for 200 nodes
- **Interactions**: <200ms response time
- **Animation**: 30+ FPS during transitions
- **Mobile**: Smooth touch interactions with 44px targets

## Integration with Existing Blog

### Navigation Integration
```njk
<!-- Add to existing nav in _includes/partials/nav.njk -->
<li><a href="/network-graph/" {% if page.url == "/network-graph/" %}aria-current="page"{% endif %}>network</a></li>
```

### Build Process Integration
Uses existing Eleventy build pipeline:
1. Eleventy processes `networkGraph.js` → generates JSON endpoint
2. Static assets copied via `addPassthroughCopy`
3. Page builds normally with existing layout system

## Common Gotchas

1. **D3.js Version**: Ensure v7.9.0+ for latest force simulation optimizations
2. **Touch Conflicts**: Use `touch-action: manipulation` to prevent scroll conflicts
3. **Memory Leaks**: Clean up event listeners during state changes
4. **Accessibility**: Test keyboard navigation and screen reader support
5. **Performance**: Monitor FPS during animations, implement Canvas fallback if needed

## Success Validation

Test these scenarios to confirm implementation:

- [ ] Graph loads with all posts and tags visible
- [ ] Hover shows post titles and highlights connections
- [ ] Click on post navigates to blog post
- [ ] Click on tag filters graph to related posts
- [ ] Reset button restores full graph view
- [ ] Mobile touch interactions work smoothly
- [ ] Keyboard navigation is functional
- [ ] Performance targets are met (30+ FPS, <3s load)

## Next Steps After Basic Implementation

1. **Add Analytics**: Track user interactions with graph
2. **Enhanced Filtering**: Multiple tag selection, search functionality
3. **Export Features**: Save graph layouts, share specific views
4. **Advanced Animations**: Path highlighting, clustering for large datasets
5. **Customization**: User preferences for themes, layout algorithms

The implementation leverages existing blog infrastructure while adding a powerful visualization layer that enhances content discovery and user engagement.