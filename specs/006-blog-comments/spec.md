# Feature Specification: Blog Comments

**Feature Branch**: `006-blog-comments`
**Created**: 2026-03-29
**Status**: Draft
**Input**: User description: "I want a way for people to add comments to my blog"

## Clarifications

### Session 2026-03-29

- Q: Comment infrastructure — BaaS with name-only input, or Giscus (GitHub Discussions) with GitHub auth? → A: Giscus (GitHub Discussions). Keep everything on GitHub with no external services.
- Q: Discussion-to-post mapping strategy? → A: Map by page pathname (e.g., `/posts/welcome/`). Stable even if post title changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read and Post a Comment (Priority: P1)

A blog reader finishes reading a post and wants to share their thoughts. They scroll to the bottom of the post where they find a comments section powered by GitHub Discussions. They sign in with their GitHub account and write a comment. The comment appears in the thread beneath the post for all future visitors to see.

**Why this priority**: This is the core value of the feature. Without the ability to read and post comments, no other commenting functionality matters.

**Independent Test**: Can be fully tested by visiting any blog post, signing in with GitHub, submitting a comment, and verifying it appears in the comments section and in the corresponding GitHub Discussion.

**Acceptance Scenarios**:

1. **Given** a reader is viewing a blog post, **When** they scroll past the post content, **Then** they see a comments section showing any existing comments and a prompt to sign in with GitHub to comment.
2. **Given** a reader has signed in with GitHub and written a comment, **When** they submit it, **Then** the comment appears in the thread with their GitHub username, avatar, and a timestamp.
3. **Given** a blog post has no comments yet, **When** a reader views the comments section, **Then** they see an invitation to be the first to comment.
4. **Given** a reader has not signed in to GitHub, **When** they view the comments section, **Then** they can still read all existing comments but see a prompt to sign in before commenting.

---

### User Story 2 - Reply to an Existing Comment (Priority: P2)

A reader sees an interesting comment from another visitor and wants to respond directly to it. They can reply to a specific comment, creating a threaded conversation beneath the original.

**Why this priority**: Threaded replies transform comments from isolated statements into conversations, significantly increasing engagement and return visits.

**Independent Test**: Can be tested by posting a top-level comment, then replying to it, and verifying the reply appears nested beneath the original comment.

**Acceptance Scenarios**:

1. **Given** a reader is viewing an existing comment, **When** they choose to reply, **Then** they can write and submit a response that appears nested beneath the original comment.
2. **Given** a comment has multiple replies, **When** a reader views the thread, **Then** replies are displayed in chronological order beneath the parent comment.

---

### User Story 3 - Blog Author Moderates Comments (Priority: P3)

The blog author wants to maintain a healthy discussion environment. They can remove inappropriate or spam comments using GitHub's built-in Discussion moderation tools.

**Why this priority**: Moderation protects the quality of discussions and the blog's reputation, but is only needed once comments exist and grow in volume.

**Independent Test**: Can be tested by the blog author deleting or hiding a comment via GitHub Discussions, then verifying it no longer appears on the blog post.

**Acceptance Scenarios**:

1. **Given** the blog author identifies an inappropriate comment, **When** they remove it via GitHub's Discussion moderation tools, **Then** the comment is no longer visible to readers on the blog.
2. **Given** the blog author has not taken any moderation action on a comment, **Then** the comment remains visible to all readers (no pre-approval required).

---

### Edge Cases

- What happens when a reader is not signed in to GitHub? They can read all comments but must sign in to post. A clear sign-in prompt is displayed.
- What happens when the GitHub Discussions API is temporarily unavailable? The comment section should degrade gracefully, showing a message rather than breaking the page layout.
- What happens when a post has a very large number of comments? The comment widget handles pagination natively.
- What happens when a reader includes links or formatted text? GitHub Discussions natively supports Markdown formatting and sanitizes content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a comments section at the bottom of every blog post.
- **FR-002**: System MUST allow readers to submit comments after authenticating with their GitHub account.
- **FR-003**: System MUST display each comment with the commenter's GitHub username, avatar, timestamp, and comment text.
- **FR-004**: System MUST support threaded replies (provided natively by GitHub Discussions).
- **FR-005**: System MUST require GitHub authentication to post a comment. Reading comments does not require sign-in.
- **FR-006**: System MUST map each blog post to a corresponding GitHub Discussion using the page pathname (e.g., `/posts/welcome/`).
- **FR-007**: System MUST support Markdown formatting in comments (provided natively by GitHub Discussions).
- **FR-008**: Content sanitization is handled by GitHub Discussions — no custom sanitization required.
- **FR-009**: System MUST allow the blog author to moderate comments via GitHub's built-in Discussion tools (delete, hide, lock).
- **FR-010**: Comments MUST be publicly readable without requiring sign-in.
- **FR-011**: System MUST display comments in chronological order within each thread.
- **FR-012**: System MUST work within the constraints of a static site hosted on GitHub Pages (no server-side processing, no external services beyond GitHub).
- **FR-013**: The comments widget MUST visually integrate with the blog's existing theme (light and dark mode support).

### Key Entities

- **Discussion**: A GitHub Discussion thread mapped to a specific blog post. Created automatically when the first comment is posted on a post.
- **Comment**: A reply within a GitHub Discussion, submitted by an authenticated GitHub user. Includes username, avatar, timestamp, and Markdown content.
- **Post**: An existing blog post that serves as the parent context, linked to a Discussion by its URL pathname.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Readers can submit a comment in under 30 seconds from deciding to comment (including GitHub sign-in if not already authenticated).
- **SC-002**: New comments appear in the thread within 10 seconds of submission.
- **SC-003**: The comments section adds no more than 1 second to the initial page load time of a blog post.
- **SC-004**: The blog author can remove an unwanted comment within 1 minute using GitHub's Discussion moderation tools.
- **SC-005**: 100% of blog posts display a functioning comments section.
- **SC-006**: Comments remain accessible and readable across desktop and mobile screen sizes.

## Assumptions

- The blog is a static site hosted on GitHub Pages; Giscus (backed by GitHub Discussions) provides comment functionality with no additional infrastructure.
- Comment volume is expected to be low-to-moderate (personal blog), so enterprise-scale tools are not needed.
- No pre-moderation (approval before publishing) is required; comments appear immediately and can be removed after the fact.
- Requiring GitHub authentication provides sufficient spam prevention for the blog's colleague-based audience.
- The blog author is the sole moderator, using GitHub's built-in moderation tools.
- The blog's GitHub repository has Discussions enabled (or will be enabled as part of setup).
- The Giscus GitHub App is installed on the repository.

## Scope Boundaries

**In Scope**:
- Displaying comments on blog posts via Giscus widget
- GitHub-authenticated commenting and replies
- Theme integration (light/dark mode matching)
- Author moderation via GitHub Discussion tools
- Mobile-responsive comment display

**Out of Scope**:
- Anonymous commenting (GitHub auth required)
- Comment voting or reactions beyond GitHub's native emoji reactions
- Email notifications for new comments or replies
- Comment search functionality
- Analytics or reporting on comment activity
- Rich media in comments beyond what GitHub Markdown supports
- Custom comment UI (using Giscus widget as-is)
