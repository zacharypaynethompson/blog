# Feature Specification: Interactive Obsidian-Style Network Graph

**Feature Branch**: `003-obsidian-network-graph`
**Created**: 2026-03-13
**Status**: Draft
**Input**: User description: "An interactive network graph visualisation for a page on an existing Eleventy blog site. The graph should have an Obsidian-style aesthetic: dark background, force-directed layout, glowing nodes on hover, subtle/translucent edges, and smooth physics-based animation with drag interaction. Nodes and edges are derived from blog post frontmatter. There are two node types: posts and tags. Each post node connects to its tag nodes, and posts with explicit links to other posts in frontmatter also have direct post-to-post edges. Tags and posts should be visually distinguishable (e.g. different colours or sizes). Tag labels are always visible; post title labels only appear on hover. The graph needs to look good with very few nodes initially and scale to low hundreds at most, so SVG rendering with d3-force is appropriate. Clicking a post node navigates to that blog post. Clicking a tag node filters the graph to show only posts connected to that tag, with a way to reset back to the full view. The purpose is to replace an existing lackluster network visualisation on the site with something more polished and visually engaging."

## User Scenarios & Testing

### User Story 1 - Graph Exploration (Priority: P1)

A blog visitor wants to explore the blog's content structure visually to understand the relationships between posts and topics before deciding what to read.

**Why this priority**: This is the core value proposition - providing an engaging visual overview of blog content that helps users discover posts they might otherwise miss.

**Independent Test**: Can be fully tested by loading the page with the network graph and verifying that all posts and tags are displayed with proper visual connections and delivers immediate visual understanding of content relationships.

**Acceptance Scenarios**:

1. **Given** the network graph page loads, **When** the user views the graph, **Then** all blog posts appear as nodes connected to their respective tag nodes
2. **Given** posts have multiple tags, **When** the graph renders, **Then** each post connects to all its associated tags via visible edges
3. **Given** posts reference other posts in frontmatter, **When** the graph displays, **Then** direct post-to-post connections are visible and distinct from post-to-tag connections
4. **Given** the graph has loaded, **When** the user hovers over a post node, **Then** the post title becomes visible and the node glows
5. **Given** the graph is displayed, **When** the user hovers over any element, **Then** visual feedback (glow, highlight) appears immediately

---

### User Story 2 - Post Navigation (Priority: P2)

A blog visitor wants to click on interesting posts in the graph to read them, using the visualization as a discovery and navigation tool.

**Why this priority**: This transforms the graph from a static visualization into a functional navigation interface, directly supporting the blog's primary goal of content consumption.

**Independent Test**: Can be tested by clicking any post node in the graph and verifying successful navigation to the corresponding blog post page.

**Acceptance Scenarios**:

1. **Given** a post node is visible in the graph, **When** the user clicks on it, **Then** they navigate to that specific blog post page
2. **Given** the user clicks a post node, **When** navigation occurs, **Then** it opens in the same browser tab/window
3. **Given** multiple post nodes are displayed, **When** the user clicks different posts, **Then** each click navigates to the correct corresponding post

---

### User Story 3 - Tag-Based Filtering (Priority: P3)

A blog visitor wants to focus on posts related to specific topics by clicking on tag nodes to filter the graph and see only relevant content.

**Why this priority**: This provides focused exploration capability, allowing users to dive deep into specific topics of interest without visual clutter from unrelated content.

**Independent Test**: Can be tested by clicking any tag node and verifying that only posts connected to that tag remain visible, with a clear way to return to the full view.

**Acceptance Scenarios**:

1. **Given** tag nodes are visible in the graph, **When** the user clicks on a tag, **Then** the graph filters to show only posts connected to that tag
2. **Given** the graph is filtered by a tag, **When** the filtering occurs, **Then** unrelated posts and tags fade out or disappear with smooth animation
3. **Given** the graph is in filtered mode, **When** the user needs to return to full view, **Then** a clear reset option (button, double-click, or escape key) restores all nodes
4. **Given** a tag has no connected posts, **When** the user clicks it, **Then** the graph shows an appropriate empty state with reset option

---

### User Story 4 - Interactive Physics Manipulation (Priority: P4)

A blog visitor wants to manipulate the graph layout by dragging nodes around to better explore relationships and create their preferred view of the content network.

**Why this priority**: This enhances the exploration experience by allowing users to physically interact with the visualization, making it more engaging than static layouts.

**Independent Test**: Can be tested by dragging any node in the graph and verifying smooth movement with realistic physics simulation affecting connected nodes.

**Acceptance Scenarios**:

1. **Given** any node is visible, **When** the user drags it, **Then** the node moves smoothly with the mouse/cursor
2. **Given** a node is being dragged, **When** it moves, **Then** connected nodes respond with realistic physics (springs, momentum)
3. **Given** the user releases a dragged node, **When** the drag ends, **Then** the physics simulation settles into a stable layout
4. **Given** nodes are repositioned through dragging, **When** the graph is filtered or reset, **Then** nodes return to algorithmically determined positions

---

### Edge Cases

- What happens when a post has no tags? (Display as isolated node with distinct visual treatment)
- How does the system handle posts with many tags? (Ensure edges don't create visual clutter, possibly with bundling or fading)
- What happens when there are too many nodes for optimal performance? (Implement node culling or pagination for large datasets)
- How does the graph behave on mobile devices? (Touch interactions for drag, hover alternatives, responsive sizing)
- What happens when blog posts are added/removed? (Graph should update dynamically or provide refresh mechanism)

## Requirements

### Functional Requirements

- **FR-001**: System MUST display blog posts as nodes in a force-directed network graph
- **FR-002**: System MUST display blog tags as nodes visually distinct from post nodes (different color, size, or shape)
- **FR-003**: System MUST create edges connecting each post to its associated tags based on frontmatter
- **FR-004**: System MUST create edges connecting posts that explicitly reference each other in frontmatter
- **FR-005**: System MUST implement Obsidian-style dark theme aesthetic with dark background
- **FR-006**: System MUST show tag labels permanently visible on tag nodes
- **FR-007**: System MUST show post titles only on hover interaction
- **FR-008**: System MUST implement hover effects with node glow/highlighting
- **FR-009**: System MUST enable drag interaction for individual nodes with physics simulation
- **FR-010**: System MUST navigate to blog post page when post nodes are clicked
- **FR-011**: System MUST filter graph to show only connected posts when tag nodes are clicked
- **FR-012**: System MUST provide mechanism to reset from filtered view to full graph view
- **FR-013**: System MUST render with smooth force-directed physics simulation for natural node positioning
- **FR-014**: System MUST display subtle/translucent edges between nodes
- **FR-015**: System MUST animate layout changes and interactions smoothly
- **FR-016**: System MUST scale performance for graphs with up to several hundred nodes
- **FR-017**: System MUST parse blog post frontmatter to extract tags and post references
- **FR-018**: System MUST handle empty or minimal graphs gracefully (few posts/tags)

### Key Entities

- **Post Node**: Represents a blog post with title, URL, publication date, and associated tags extracted from frontmatter
- **Tag Node**: Represents a blog tag/category with name and list of connected posts
- **Post-Tag Edge**: Connection between a post and its associated tags, representing content categorization
- **Post-Post Edge**: Connection between posts that explicitly reference each other, representing content relationships
- **Graph State**: Current view state including filter status, node positions, and interaction modes

### Assumptions

- Blog posts contain structured frontmatter with tags and optional post references
- Existing blog infrastructure supports data extraction from post frontmatter
- Target users have modern web browsers with JavaScript enabled
- Blog content volume will remain under several hundred posts for optimal performance
- Users understand basic graph visualization concepts (nodes representing items, edges representing relationships)
- The existing network visualization mentioned by user has established user expectations that this feature aims to exceed

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can identify relationships between posts and tags within 10 seconds of viewing the graph
- **SC-002**: Graph renders and becomes interactive within 3 seconds for datasets up to 200 nodes
- **SC-003**: 90% of post navigation clicks successfully load the target blog post within 2 seconds
- **SC-004**: Graph maintains smooth 30+ FPS animation during drag interactions and layout changes
- **SC-005**: Tag filtering operations complete within 1 second with smooth visual transitions
- **SC-006**: Graph remains visually clear and navigable with node counts from 5 to 200+ items
- **SC-007**: Users can successfully complete tag filtering and reset operations without instruction 80% of the time
- **SC-008**: Mobile users can effectively interact with the graph using touch gestures
- **SC-009**: Graph loading does not block or significantly impact the rest of the page loading experience