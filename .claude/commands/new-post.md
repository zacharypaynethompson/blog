---
description: Draft a new blog post from raw ideas, notes, or rambles through a collaborative back-and-forth.
---

## User Input

```text
$ARGUMENTS
```

## Goal

Turn raw input (rambles, voice note transcripts, pasted conversations, rough ideas) into a polished draft blog post through a collaborative process. The output is a markdown file in `src/posts/` ready for the user to edit further.

## Process

### Step 1: Understand the raw material

Read the user's input carefully. This could be anything — a stream of consciousness, bullet points, a transcript, a pasted conversation, or just a topic idea. Identify:

- The core idea or argument
- Key points and supporting details
- The intended audience (if apparent)
- The tone (casual, technical, analytical, personal)

### Step 2: Ask clarifying questions

Before drafting, ask the user **3-5 focused questions**. Pick from these based on what's missing or unclear from their input:

- **What's the main takeaway?** "If someone reads one sentence from this, what should it be?"
- **Emphasis**: "You touched on X and Y — which matters more to you here?"
- **Length and depth**: "Are you thinking a quick take (300-500 words) or something more developed (800-1500 words)?"
- **Audience**: "Who's this for — people already familiar with the topic, or are you explaining it fresh?"
- **Visuals**: "Would a diagram, chart, or illustration help here? Should I leave placeholders for any?"
- **Interactive elements**: "Would an interactive code example or embedded visualization add something?"
- **Structure**: "Do you see this as a linear argument, a listicle, a narrative, or something else?"
- **Missing pieces**: "You mentioned X but didn't expand on it — should that be in the post or was it tangential?"

Do NOT ask all of these. Only ask what's genuinely unclear from the input. If the input is detailed enough, you might only need 1-2 questions.

**Wait for the user's answers before proceeding.**

### Step 3: Draft the post

After the back-and-forth, write the full draft post including:

**Frontmatter:**
```yaml
---
title: <lowercase title>
date: <today's date in YYYY-MM-DD>
tags:
  - <tag-1>
  - <tag-2>
description: <one-sentence summary>
layout: layouts/post.njk
---
```

**Body:**
- Write in the user's voice based on their input style
- Use markdown formatting (headers, bold, lists, code blocks, links) as appropriate
- Keep titles lowercase to match the blog's existing style
- Include `<!-- TODO: ... -->` comments for places where the user should add specifics, images, or review a section
- If agreed upon, include placeholders for diagrams (`<!-- DIAGRAM: description of what this should show -->`), images (`<!-- IMAGE: description -->`), or interactive elements (`<!-- INTERACTIVE: description -->`)

### Step 4: Save and present

1. Generate the filename from the title (lowercase, hyphens, no special characters)
2. Create the file at `src/posts/<filename>.md`
3. Present a summary to the user:
   - The file path
   - A quick outline of the structure
   - Any TODO placeholders they should revisit

## Writing style

The draft must sound like the user wrote it. Follow these principles strictly:

### 1. Direct and economical
Cut anything that exists only for rhetorical effect. Every sentence should do work.

- No: "Not in some abstract sense — but practically, in a way I can hand to an LLM and say: this is how I write, stick to it."
- Yes: "What I want to do here is figure out what my writing actually sounds like in a way I can hand to an LLM and say 'this is how I write'"

### 2. Precise over evocative
Say what you mean rather than gesture at it.

- No: "It never quite lands the way I'd write it myself. There's always something off."
- Yes: "It never quite sounds like I have written it myself."

### 3. Structural thinker
Respect logical scaffolding but keep surfaces clean.

- No: "That's where the useful information lives — in the edits, in what I cut, what I keep, what I rephrase."
- Yes: "The information in the edits, in what I cut, what I keep, what I rephrase, is where my writing style emerged."

### 4. Comfortable with tentativeness when genuine
Don't assert false confidence. If something is exploratory, say so.

- No: "The process works like this:"
- Yes: "I think the process needs to work something like this:"

### 5. Allergic to being narrated
Show the process, don't commentate on it. Never describe what the writing is doing as it does it.

- No: "You naturally talk about what you're doing as you're doing it. You're not rambling — you're building."
- Yes: (Removed entirely. Let the writing speak for itself.)

### 6. Functional punctuation over stylistic punctuation
Use commas and parentheses for clarity. Avoid em dashes for dramatic effect.

- No: "the blog voice — the one I'd use if I were writing a position on something"
- Yes: "the blog voice, e.g., the one I'd use if I were writing a position on something"

### 7. Conversational but not performatively so
Don't manufacture energy or dramatic buildup. Transitions should flow naturally.

- No: "So let's work through it and find out." (preceded by a dramatic buildup and section break)
- Yes: "Let's work through it and find out." (follows naturally from the previous paragraph)

## Formatting notes

- Titles are always lowercase
- `layout: layouts/post.njk` is required on every post
- Posts don't have to be long — let the content dictate the length
