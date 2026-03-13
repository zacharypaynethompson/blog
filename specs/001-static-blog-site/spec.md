# Feature Specification: static personal blog

**Feature Branch**: `001-static-blog-site`
**Created**: 2026-03-13
**Status**: Draft
**Input**: User description: "A minimal, static personal blog hosted on GitHub Pages with Eleventy"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - read a blog post (Priority: P1)

A visitor arrives at the blog (either via direct link to a post or from the homepage) and reads
an article. The page loads quickly, displays the post content with clear typography, and shows
metadata (title, date, tags). The reading experience is clean and distraction-free.

**Why this priority**: Reading posts is the core purpose of a blog. Without this, nothing else
matters.

**Independent Test**: Can be fully tested by navigating to a published post URL and verifying
the content renders correctly with proper styling, readable typography, and visible metadata.

**Acceptance Scenarios**:

1. **Given** a published blog post exists, **When** a visitor navigates to the post URL,
   **Then** the post title, date, content, and tags display correctly
2. **Given** a visitor is reading a post, **When** they view it on mobile, tablet, or desktop,
   **Then** the layout adapts appropriately and remains readable
3. **Given** a post with multiple tags, **When** the visitor views the post, **Then** all tags
   are visible and link to filtered views

---

### User Story 2 - browse posts from homepage (Priority: P1)

A visitor lands on the homepage and sees a list of recent blog posts. They can scan titles and
dates to find content that interests them, then click through to read a full post.

**Why this priority**: The homepage is the primary entry point; visitors need to discover
content easily.

**Independent Test**: Can be fully tested by loading the homepage and verifying recent posts
appear in chronological order with clickable links.

**Acceptance Scenarios**:

1. **Given** multiple posts exist, **When** a visitor loads the homepage, **Then** posts
   display in reverse chronological order (newest first)
2. **Given** the homepage is loaded, **When** a visitor clicks a post title, **Then** they
   navigate to the full post
3. **Given** posts span professional and personal topics, **When** viewing the homepage,
   **Then** both types appear together in chronological order

---

### User Story 3 - learn about the author (Priority: P2)

A visitor wants to know who writes the blog. They navigate to the about page and read a brief,
personal introduction to the author.

**Why this priority**: Establishes trust and context, but not required for core reading
experience.

**Independent Test**: Can be fully tested by navigating to the about page and verifying static
content displays correctly.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they click the about link, **Then** they see
   the about page with author information
2. **Given** the about page content, **When** displayed, **Then** it matches the site's minimal
   aesthetic and typography

---

### User Story 4 - explore posts visually (Priority: P3)

A visitor wants to discover connections between posts and topics. They navigate to the explore
page and interact with a network visualization showing posts as nodes connected by shared tags.
They can click nodes to read posts or hover to see relationships.

**Why this priority**: Enhances discovery but is additive to core blog functionality.

**Independent Test**: Can be fully tested by loading the explore page and verifying the network
graph renders with correct post/tag relationships and responds to interactions.

**Acceptance Scenarios**:

1. **Given** multiple posts with overlapping tags exist, **When** a visitor loads the explore
   page, **Then** a network graph displays with posts as nodes connected by shared tags
2. **Given** the network graph is visible, **When** a visitor hovers over a node, **Then**
   related posts (sharing tags) are highlighted
3. **Given** the network graph is visible, **When** a visitor clicks a node, **Then** they
   navigate to that post
4. **Given** the explore page is loaded, **When** a visitor selects a tag filter, **Then**
   both the graph and list view filter to show only matching posts

---

### User Story 5 - filter posts by tag (Priority: P3)

A visitor wants to find posts on a specific topic. They use tag filtering (either from the
explore page list view or by clicking a tag on a post) to see only relevant content.

**Why this priority**: Important for content discovery but posts are still accessible without
filtering.

**Independent Test**: Can be fully tested by clicking a tag and verifying only posts with that
tag appear in the filtered view.

**Acceptance Scenarios**:

1. **Given** posts with various tags exist, **When** a visitor clicks a tag, **Then** a
   filtered view shows only posts with that tag
2. **Given** a filtered view is active, **When** a visitor clears the filter, **Then** all
   posts become visible again
3. **Given** the explore page list view, **When** sorted by date, **Then** posts appear in
   reverse chronological order within the filter

---

### User Story 6 - author publishes a new post (Priority: P1)

The author creates a new markdown file with frontmatter (title, date, tags), commits it to
the repository, and the site automatically rebuilds to include the new post.

**Why this priority**: Core workflow enabling the blog to have content.

**Independent Test**: Can be fully tested by adding a markdown file with proper frontmatter,
committing, and verifying the post appears on the live site after build.

**Acceptance Scenarios**:

1. **Given** a valid markdown file with frontmatter, **When** committed to the repository,
   **Then** the site rebuilds and the post appears
2. **Given** a new post is published, **When** the homepage loads, **Then** the new post
   appears at the top of the list
3. **Given** a new post with tags, **When** published, **Then** the post appears in the
   explore page graph connected to its tags

---

### Edge Cases

- What happens when a post has no tags? The post displays normally but has no tag links; it
  appears as an isolated node in the explore graph
- What happens when a visitor accesses a non-existent URL? A styled 404 page displays,
  consistent with site design
- What happens when the explore page loads with only one post? The graph shows a single node
  with its tag connections; the list view shows the single post
- How does the site handle posts with very long titles? Titles truncate gracefully or wrap
  appropriately depending on context
- What happens if two posts share the same slug? Build process fails or warns; author must
  resolve duplicate

## Requirements *(mandatory)*

### Functional Requirements

**Content Display**

- **FR-001**: Site MUST render blog posts from markdown files with frontmatter
- **FR-002**: Each post MUST display title, publication date, content, and tags
- **FR-003**: Post content MUST support standard markdown formatting (headings, lists, code
  blocks, links, images, emphasis)
- **FR-004**: Site MUST display a homepage listing recent posts in reverse chronological order
- **FR-005**: Site MUST provide an about page with static author information

**Navigation & Discovery**

- **FR-006**: Site MUST provide consistent navigation between homepage, about, and explore pages
- **FR-007**: All tags on posts MUST link to a filtered view showing posts with that tag
- **FR-008**: Explore page MUST display an interactive network visualization of posts and tags
- **FR-009**: Explore page MUST include a list view of posts, filterable by tag
- **FR-010**: Selecting a tag in either graph or list MUST cross-filter the other view

**Visual Design**

- **FR-011**: Site MUST use a minimal, sleek design aesthetic
- **FR-012**: Site MUST use rusty orange as the accent color for highlights and interactive
  elements
- **FR-013**: Typography MUST feel rustic and slightly blocky, not polished or corporate
- **FR-014**: Titles and headings MUST use lowercase by default as a stylistic choice
- **FR-015**: Site MUST be fully responsive across mobile, tablet, and desktop viewports

**Network Visualization**

- **FR-016**: Graph MUST represent posts as nodes
- **FR-017**: Graph MUST connect posts that share one or more tags
- **FR-018**: Hovering a node MUST highlight related posts (those sharing tags)
- **FR-019**: Clicking a node MUST navigate to that post
- **FR-020**: Graph styling MUST match the site's minimal aesthetic with restrained animation

**Publishing Workflow**

- **FR-021**: Posts MUST be authored as markdown files with YAML frontmatter
- **FR-022**: Frontmatter MUST support title, date, and tags fields
- **FR-023**: Site MUST rebuild automatically when changes are pushed to the repository
- **FR-024**: Visualization data MUST be generated at build time from post frontmatter

**Accessibility & Performance**

- **FR-025**: Site MUST meet WCAG 2.1 AA accessibility standards
- **FR-026**: Site MUST load within 3 seconds on standard connections
- **FR-027**: Site MUST provide a styled 404 error page

### Key Entities

- **Post**: A blog article with title (string), date (date), content (markdown body), tags
  (list of strings), and slug (URL-friendly identifier derived from filename)
- **Tag**: A topic label connecting related posts; each tag has a name and links to all posts
  using it
- **Page**: Static content pages (about) with title and content, not part of the post
  chronology
- **Graph Node**: Visual representation of a post in the explore visualization; position
  determined by tag relationships
- **Graph Edge**: Visual connection between nodes representing shared tags

## Assumptions

- The author has a GitHub account and repository set up for the blog
- GitHub Pages is enabled for the repository
- The hosting URL will be username.github.io (no custom domain in v1)
- Posts are written in English
- The author is comfortable using git and markdown
- A single author manages all content (no multi-user workflow needed)
- Post dates are set manually in frontmatter (not derived from git history)
- Tags are free-form text (no predefined taxonomy)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Any page on the site loads completely within 3 seconds on a standard broadband
  connection
- **SC-002**: Site passes WCAG 2.1 AA automated accessibility checks
- **SC-003**: Author can publish a new post (write markdown, commit, see it live) within 5
  minutes
- **SC-004**: Visitors can navigate from homepage to any post within 2 clicks
- **SC-005**: Explore page graph correctly reflects all post-tag relationships in the content
- **SC-006**: Site renders correctly on Chrome, Firefox, Safari, and Edge (latest versions)
- **SC-007**: Site is fully usable on mobile devices (touch interactions work, text is
  readable without zooming)
- **SC-008**: All interactive elements in the network visualization respond within 100ms of
  user interaction
