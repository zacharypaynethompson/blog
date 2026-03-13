# Data Model: Interactive Obsidian-Style Network Graph

**Feature**: 003-obsidian-network-graph
**Date**: 2026-03-13
**Source**: Entities extracted from feature specification

## Core Entities

### Post Node
Represents a blog post in the network visualization.

**Fields**:
- `id: string` - Unique identifier (file slug from Eleventy)
- `title: string` - Post title for display and navigation
- `url: string` - Relative URL path for navigation (Eleventy-generated)
- `date: string` - Publication date in ISO format (YYYY-MM-DD)
- `tags: string[]` - Array of associated tag names (filtered from frontmatter)
- `x: number` - D3.js simulation x-coordinate (runtime)
- `y: number` - D3.js simulation y-coordinate (runtime)
- `degree: number` - Connection count for layout optimization (calculated)

**Relationships**:
- Connected to Tag Nodes via Post-Tag Edges
- Connected to other Post Nodes via Post-Post Edges (when explicitly referenced)

**Validation Rules** (from requirements):
- `id` must be unique across all nodes
- `title` must be non-empty string
- `url` must be valid relative path
- `tags` array can be empty (isolated node case)
- `x`, `y` coordinates managed by D3.js force simulation

**State Transitions**:
- `default` → `hovered` (on mouse/touch interaction)
- `default` → `highlighted` (when connected to active tag)
- `default` → `dragging` (during drag interaction)
- `any` → `filtered` (when tag filtering is active)

### Tag Node
Represents a blog tag/category in the network visualization.

**Fields**:
- `id: string` - Unique identifier (tag name)
- `name: string` - Display name (always visible)
- `count: number` - Number of connected posts
- `x: number` - D3.js simulation x-coordinate (runtime)
- `y: number` - D3.js simulation y-coordinate (runtime)
- `connectedPosts: string[]` - Array of connected post IDs (calculated)

**Relationships**:
- Connected to Post Nodes via Post-Tag Edges
- No direct Tag-to-Tag connections

**Validation Rules**:
- `id` must be unique across all tag nodes
- `name` must be non-empty string
- `count` must be positive integer
- `connectedPosts` array must contain valid post IDs

**State Transitions**:
- `default` → `active` (when clicked for filtering)
- `default` → `highlighted` (when connected post is hovered)
- `active` → `default` (on reset or other tag selection)

### Post-Tag Edge
Represents the relationship between a post and its associated tags.

**Fields**:
- `source: string` - Post node ID
- `target: string` - Tag node ID
- `type: 'post-tag'` - Edge type identifier
- `strength: number` - Connection strength (typically 1.0)

**Relationships**:
- Links exactly one Post Node to one Tag Node
- Bidirectional relationship for visualization purposes

**Validation Rules**:
- `source` must reference existing Post Node
- `target` must reference existing Tag Node
- `type` must be 'post-tag'
- `strength` must be positive number

### Post-Post Edge
Represents explicit connections between posts (when referenced in frontmatter).

**Fields**:
- `source: string` - Source post node ID
- `target: string` - Target post node ID
- `type: 'post-post'` - Edge type identifier
- `strength: number` - Connection strength (default 1.5 for stronger binding)
- `sharedTags: string[]` - Common tags between connected posts (optional)

**Relationships**:
- Links two Post Nodes directly
- Can be directional (A references B) or bidirectional

**Validation Rules**:
- `source` and `target` must reference existing Post Nodes
- `source` and `target` must be different (no self-references)
- `type` must be 'post-post'
- `strength` must be positive number

### Graph State
Manages the current view state and interaction modes.

**Fields**:
- `mode: string` - Current interaction mode ('default', 'filtering', 'dragging')
- `activeTag: string | null` - Currently selected tag for filtering
- `filteredNodes: string[]` - Array of visible node IDs when filtering
- `hoveredNode: string | null` - Currently hovered node ID
- `simulation: D3Simulation` - D3.js force simulation instance
- `dimensions: { width: number, height: number }` - Canvas dimensions

**State Management**:
- Centralized state for all graph interactions
- Manages filter state, hover state, and simulation control
- Handles reset operations and view transitions

**Validation Rules**:
- `mode` must be one of: 'default', 'filtering', 'dragging'
- `activeTag` must be null or valid tag ID
- `filteredNodes` must contain valid node IDs
- `dimensions` must have positive width and height

## Data Flow Architecture

### Build-Time Processing (Eleventy Collections)

**Input**: Markdown files with YAML frontmatter
```yaml
---
title: "Example Post"
tags: ["javascript", "d3", "visualization"]
references: ["other-post-slug"] # optional
---
```

**Processing Pipeline**:
1. **Collection Generation**: Extract all posts via `getFilteredByGlob("src/posts/*.md")`
2. **Node Creation**: Transform posts into Post Node entities
3. **Tag Aggregation**: Create Tag Node entities from unique tags across posts
4. **Edge Generation**: Create Post-Tag edges and optional Post-Post edges
5. **JSON Serialization**: Output structured data via `/data/network-graph.json`

**Output Format**:
```json
{
  "nodes": [
    {
      "id": "post-slug",
      "title": "Post Title",
      "url": "/posts/post-slug/",
      "date": "2026-03-13",
      "tags": ["tag1", "tag2"],
      "type": "post"
    },
    {
      "id": "tag1",
      "name": "tag1",
      "count": 5,
      "type": "tag"
    }
  ],
  "links": [
    {
      "source": "post-slug",
      "target": "tag1",
      "type": "post-tag",
      "strength": 1.0
    }
  ]
}
```

### Runtime Processing (D3.js Visualization)

**Data Loading**:
1. Fetch JSON from `/data/network-graph.json`
2. Separate nodes by type (posts vs tags)
3. Initialize D3.js force simulation with nodes and links
4. Bind data to SVG elements for rendering

**Interaction Handling**:
- **Hover**: Update Graph State, highlight connections
- **Click**: Navigate (posts) or filter (tags), update Graph State
- **Drag**: Manipulate node positions, maintain physics simulation
- **Reset**: Clear filters, restore full graph view

## Entity Relationships Diagram

```
Post Node ──── Post-Tag Edge ──── Tag Node
    │                                 │
    │                                 │
    └── Post-Post Edge ──────────────┘
                │
        Graph State (manages all)
```

## Performance Considerations

**Entity Scaling**:
- **Post Nodes**: Target 50-200, maximum 500
- **Tag Nodes**: Target 10-50, maximum 100
- **Edges**: Target 200-1000, scales with node relationships
- **Memory**: Node pooling for frequent state changes

**Optimization Patterns**:
- Lazy initialization of Graph State
- Efficient edge lookup using Maps/Sets
- Debounced state updates for rapid interactions
- Spatial indexing for large node sets (if needed)

This data model supports all functional requirements while maintaining performance targets and enabling smooth user interactions across desktop and mobile platforms.