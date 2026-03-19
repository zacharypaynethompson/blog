---
description: Learn from user edits to a drafted post and update the /new-post skill's writing style to better match the user's voice.
---

## User Input

```text
$ARGUMENTS
```

## Goal

Compare a drafted blog post against the user's edits, extract patterns about what was changed and why, and update the writing style section in `.claude/commands/new-post.md` so future drafts are more aligned with the user's actual voice.

## Process

### Step 1: Get the diff

If the user provides a file path, run `git diff` on that file. If not, check `git diff` for any modified posts in `src/posts/`. If nothing is staged or modified, check the most recent commit for a post that was recently edited.

### Step 2: Analyse the edits

For each change, classify it into one of these categories:

- **Word choice**: The user replaced a word or phrase with a preferred alternative
- **Sentence structure**: The user restructured how a sentence flows
- **Tone adjustment**: The user softened, sharpened, or shifted the register
- **Removal**: The user cut something entirely (filler, rhetorical flourish, unnecessary hedging)
- **Addition**: The user added something that was missing from the draft
- **Punctuation/connectors**: The user changed how clauses connect

For each edit, note:
- What the draft said
- What the user changed it to
- The pattern this reveals (e.g., "prefers 'you' over 'the basic idea is simple'" or "adds hedging like 'probably' for genuine uncertainty")

### Step 3: Check for conflicts with existing style rules

Read the current writing style section in `.claude/commands/new-post.md`. Check whether any of the new patterns:
- Reinforce an existing rule (add as a new example)
- Contradict an existing rule (flag for review, do not silently overwrite)
- Represent a new pattern not yet captured (add as a new rule)

### Step 4: Present findings to the user

Before making any changes, show the user:
- A summary of the patterns found
- Which existing rules they reinforce
- Any proposed new rules or examples
- Any contradictions

Ask the user to confirm before updating the skill.

### Step 5: Update the /new-post skill

After confirmation, edit `.claude/commands/new-post.md` to:
- Add new examples under existing rules where relevant
- Add new rules with clear before/after examples
- Keep the style section concise (combine related rules rather than letting the list grow unboundedly)

Do NOT rewrite rules the user hasn't triggered edits for. Only add or refine based on observed evidence.

## Notes

- This skill is a feedback loop. Each time it runs, the `/new-post` skill gets slightly better at matching the user's voice.
- Patterns should only be added when there's clear evidence from the edits. A single ambiguous change isn't enough to create a new rule.
- If the same pattern appears across multiple editing sessions, it should be promoted to a more prominent position in the style guide.
- Keep examples concrete. Always use the actual draft text and the actual edit, not invented examples.
