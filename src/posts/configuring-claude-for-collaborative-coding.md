---
title: configuring claude for collaborative coding
date: 2026-04-23
tags:
  - ai
  - workflow
  - claude-code
description: If your team is leaning on Claude Code, the configuration is team infrastructure. Here's how I've set it up for a data science team working on an ML classification pipeline.
layout: layouts/post.njk
---

A lot of the writing about configuring coding agents assumes a large, established codebase. Data science work tends to look different, e.g., smaller codebases, multiple projects running in parallel, team members at different experience levels, and workflows around branching and dividing up work that are already less settled. If everyone on the team is using the same agent on the same repo, the agent's behaviour needs to be consistent, and the configuration that governs it needs to be versioned, reviewable, and collaboratively maintained.

I've been setting this up for a small team working on an ML classification pipeline that classifies Horizon Europe research grants. What's emerged is a `.claude/` directory checked into git that functions as shared team infrastructure rather than personal preference.

## the structure

The configuration has three layers.

**`CLAUDE.md`** is the project overview that covers the tech stack, common commands, architecture, and code conventions. It's the equivalent of an onboarding document that Claude reads at the start of every conversation.

**`.claude/principles.md`** is the development philosophy. Every agent and skill in the repo references this file. It covers things like cognitive load reduction (boring over clever, duplication over bad abstraction, minimal indirection), testing philosophy (test observable behaviour through public interfaces, no mocking internal collaborators), and a documentation standard that favours documenting *why* over *what*. Encoding these into a file gives the team a shared baseline regardless of who's prompting, so a less experienced team member gets the same guardrails as a more experienced one.

**`.claude/settings.json`** enables the plugins the team uses, e.g., GitHub, code review, AWS, and Pydantic.

## agents and skills

Claude Code has two extensibility mechanisms worth distinguishing.

**Agents** are specialised roles defined in `.claude/agents/`. You invoke them with `@agent-name`, and each has instructions for how it should behave and which tools it can use. We have four: `code-review` (reviews PRs against the principles, checking for cognitive load and architecture drift), `test-writer` (collaboratively designs tests, confirming what to test before writing anything), `docs` (manages documentation, pushing back when a docstring would just restate what the code already says), and `github-manager` (creates and updates issues using the repo's templates, interrogating the developer about requirements before drafting).

**Skills** are domain knowledge defined in `.claude/skills/`. You invoke them with `/skill-name`. The domain-specific ones have been the most useful, e.g., `hydra` for the project's configuration system, `bedrock` for AWS model invocation, `argilla` for the labelling platform, and `marimo-pair` for live pair programming inside reactive notebooks.

`/grill-me` is adapted from [Matt Pocock's version](https://github.com/mattpocock/skills/blob/main/grill-me/SKILL.md) and the entire instruction is roughly "interview me relentlessly about every aspect of this plan until we reach a shared understanding, walk down each branch of the design tree, and for each question provide your recommended answer." I've found it useful for stress-testing design decisions before committing to them, particularly when working through trade-offs where the right answer depends on context that isn't obvious from the code.

## the refine loop

The most valuable part of this setup is probably the `/refine` skill, which is how the configuration evolves through use rather than being designed upfront.

During a session, something doesn't work well, or Claude makes a mistake that reveals a gap in the configuration. You fix the immediate problem first. Then at a natural endpoint, once the solution is validated, you call `/refine` and Claude proposes a specific edit to the relevant agent or skill file. You review it, confirm, and commit.

The timing is deliberate. `/refine` avoids suggesting config updates during active debugging, because the focus should be on solving the problem. It also won't encode half-understood fixes. It waits until there's a validated solution, then asks whether the learning is worth persisting.

The `github-manager` agent is a good example of what this looks like in practice. The initial version had four sections covering the basics of how to create issues, which templates to use, how to draft them, and how to update existing ones. Over two days and three rounds of refinement, it grew substantially.

After the first round of use, two hours after initialisation, it gained sections on prioritisation, issue types, milestones, AI disclaimers, and board management strategies, all from things that came up immediately when I started actually creating issues through it. After the second round, it picked up guidance on documentation consistency and cross-referencing related issues, because it had been creating near-duplicate tickets without checking what already existed. That round also propagated changes across four other files including `principles.md` and the `code-review` agent, because the learning wasn't specific to one config. After the third round, an hour later, it gained a metadata checklist requiring Claude to query available labels, milestones, and board structure before creating an issue, because it had been creating issues first and adding metadata as an afterthought.

None of these were designed upfront. The git history reads `initialise claude` then `Enhance GitHub issue management guidelines` then `Enhance documentation consistency` then `Add metadata checklist for issue creation`. Each commit came from a friction point in actual use that got corrected and then persisted so it wouldn't need correcting again.

## why this matters for teams

The configuration is never finished. When someone on the team hits a friction point with Claude's behaviour, the fix isn't to remember a better prompting strategy or share it in a message thread. It's to update the configuration so the behaviour improves for everyone. The principles file might get a new section, an agent might get a tighter guardrail, a skill might get a correction. These are small, incremental changes, and they compound.

For data science teams in particular, where the work involves several different things happening at once and the workflows are already less codified than in a typical software engineering team, having a shared and evolving configuration is probably more important than it first appears. It becomes a way of encoding not just what Claude should do but how the team thinks about development, which makes it worth maintaining carefully.
