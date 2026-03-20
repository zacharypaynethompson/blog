---
description: Create an inline SVG diagram for a blog post to visually summarise conceptual thinking, frameworks, or abstract ideas.
---

## User Input

```text
$ARGUMENTS
```

## Goal

Create an inline SVG diagram for a blog post. The diagram should visually summarise the conceptual point being made in the surrounding text, making abstract ideas concrete and scannable. The output is raw SVG markup ready to paste into a markdown post.

## Process

### Step 1: Understand what needs visualising

Read the user's input. This could be:
- A description of the concept or framework
- A reference to a section of a blog post
- A rough sketch of what the diagram should show

Identify:
- The core relationships or structure to show (layers, flows, comparisons, processes)
- Which elements are primary vs secondary
- What the diagram should make clearer that the text alone doesn't

### Step 2: Ask clarifying questions

Before creating, ask **1-3 focused questions** if anything is unclear:

- **What's the key point?** "What should someone take away from glancing at this?"
- **Structure**: "Are you thinking layers, a flow, a comparison, or something else?"
- **Emphasis**: "Which elements should stand out visually?"
- **Placement**: "Where in the post does this go? Can I read the surrounding text?"

If the input is clear enough, skip straight to creating.

**Wait for answers before proceeding.**

### Step 3: Create the SVG

Write the SVG following the style guide below. Place it in context if a file path is given, or present the raw SVG for the user to place.

### Step 4: Present

Show the user:
- The SVG markup
- A brief description of the layout
- Where it was placed (if inserted into a file)

## Style guide

All diagrams must follow these conventions exactly.

### Base template

```svg
<svg viewBox="0 0 600 [height]" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;margin:1.5rem auto;display:block;font-family:'Roboto Slab',Georgia,serif;">
```

- ViewBox width is always **600**
- Height varies by content
- Max-width 600px, centered with auto margins, displayed as block

### Colours

| Use | Colour | Hex |
|-----|--------|-----|
| Primary accent (borders, arrows, emphasis) | Chocolate | `#D2691E` |
| Default border | Warm grey | `#E8E4DF` |
| Primary text | Dark | `#2D2D2D` |
| Secondary text | Mid grey | `#5C5C5C` |
| Accent text (labels on arrows, annotations) | Chocolate | `#D2691E` |

- Use the orange accent (`#D2691E`) stroke on boxes that are the focus of the diagram's argument
- Use the grey (`#E8E4DF`) stroke on supporting or secondary boxes
- Use dashed grey borders (`stroke-dasharray="6,4"`) for de-emphasised elements (e.g. something that's "solved" or less important)

### Typography

| Element | Font size | Fill | Weight |
|---------|-----------|------|--------|
| Box title | 13 | `#2D2D2D` | 700 |
| Box subtitle / description | 11 | `#5C5C5C` | normal |
| Arrow labels / annotations | 10 | `#D2691E` | normal, italic |

- All text uses `text-anchor="middle"` and is centered within its box
- Title sits ~40% down the box, subtitle ~70% down

### Boxes

- Rounded corners: `rx="4"`
- No fill: `fill="none"`
- Stroke width: `1.5`
- Typical box: 120-320px wide, 44-64px tall depending on content

### Arrows

Always define the marker in `<defs>`:
```svg
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#D2691E"/>
  </marker>
</defs>
```

- Arrows use `stroke="#D2691E"` and `stroke-width="1.5"`
- Apply with `marker-end="url(#arrow)"`

### Layout principles

- **Center content** horizontally within the 600px viewBox
- **No blank lines** inside the SVG element (markdown parsers will break the SVG at blank lines)
- Keep diagrams **compact** — don't spread things out for the sake of it
- Use vertical stacking for hierarchies and layers
- Use horizontal arrangement for parallel concepts or comparisons
- Leave ~20-30px gaps between elements

### Purpose

Diagrams should:
- **Summarise** the conceptual point being made in the text
- **Visualise structure** that's hard to convey in prose (layers, flows, relationships)
- **Make abstract ideas concrete** — if the reader glances at only the diagram, they should get the core idea
- **Align with the argument** — the visual emphasis (which boxes are orange, which are dashed) should match what the text argues is important vs secondary

Diagrams should NOT:
- Repeat what the text already says clearly
- Add decorative elements that don't carry meaning
- Be overly complex — if it needs more than ~10 boxes, reconsider the scope

## Refining

After user edits, the `/refine-diagram` skill (if it exists) can be used to update these preferences. Until then, note patterns from user edits and mention them so this style guide can be updated manually.
