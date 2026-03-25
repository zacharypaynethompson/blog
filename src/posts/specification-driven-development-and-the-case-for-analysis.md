---
title: specification-driven development and the case for analysis
date: 2026-03-25
tags:
  - specification-driven-development
  - ai
  - workflow
  - analysis
description: AI-assisted coding inverts the relationship between specifications and code. I think the same inversion applies to analytical work.
layout: layouts/post.njk
---

I've been building this blog using a workflow where the specifications are the primary artifact and the code is their generated expression. The idea comes from a paradigm called specification-driven development, and the more I use it, the more I think the same inversion applies to analytical research.

## what specification-driven development is

The core idea is straightforward. Instead of writing code and documenting it afterwards, you write a detailed specification first, then use AI to generate the code from it. The specification captures your reasoning, your constraints, your design decisions. The code is just the implementation of those decisions, and if the specification is good enough, the code generation is close to deterministic.

This matters because AI-assisted coding has changed which part of the process is hard. Writing code used to be the slow, expensive part. Now it's fast and cheap. What's still hard, and what AI can't reliably do for you, is deciding what to build and why. Specification-driven development puts the emphasis where the difficulty actually is.

A tool called [SpecKit](https://github.com/github/spec-kit) formalises this into a structured workflow. At a high level, the steps are:

1. **Constitution**: a set of shared principles that govern the project, e.g., architectural patterns, quality standards, non-negotiable constraints. This stays relatively stable across the life of a project.
2. **Specification**: a detailed description of what you want to build, written in natural language with enough precision that the implementation choices are determined by it.
3. **Plan**: a technical design that translates the specification into an implementation strategy, covering architecture, dependencies, and how the pieces fit together.
4. **Tasks**: a breakdown of the plan into discrete, ordered units of work that can be implemented independently.
5. **Implementation**: code generation from the tasks, where AI does the mechanical translation and the human verifies that the output matches the spec.

The key insight is that each step constrains the next. The constitution constrains specifications. Specifications constrain plans. Plans constrain tasks. By the time you reach implementation, most of the decisions have already been made and documented. The AI isn't making judgment calls, it's executing well-defined instructions.

## how this blog uses it

This blog is built with Eleventy and is relatively simple, but I've been using the SpecKit workflow to build feature. Each feature has a specification that describes what it should do, a plan that describes how, and tasks that break it down. The code was generated from those artifacts.

That's probably overkill for a personal blog. But it's been useful as a way to learn the workflow, and it's demonstrated something I think is important: when the specification is clear, the implementation is fast and predictable. When the specification is vague, the AI generates something plausible that isn't quite right, and you spend more time debugging than you would have spent specifying properly in the first place.

The other thing I've noticed is that the specifications are more valuable than the code over time. If I want to understand why a feature works the way it does, I read the spec, not the source files. If I want to change something, I update the spec and regenerate. The code is disposable in a way that the reasoning behind it isn't.

## what would specification-driven analysis look like

I've been thinking about whether the same inversion applies to analytical work, e.g., the kind of empirical research that happens in policy, social science, and data science contexts. I think it does, and I think the mapping is fairly direct.

Most analytical work follows an implicit workflow: get a question, find some data, explore it, run some analysis, produce outputs, write up findings. The analyst carries most of the reasoning in their head. The code captures the implementation but not the rationale. The write-up captures the conclusions but not the path that led to them.

AI-assisted coding changes this in the same way it changes software development. When it takes thirty seconds to run a regression with different controls, different sample restrictions, different functional forms, the mechanical friction that previously slowed the process disappears. That friction wasn't just an inconvenience, it created space for thought. When writing code was slow, the analyst was forced to sit with their choices, to think about whether this specification was really the right one before committing time to implementing it. When that cost drops to near zero, specification searching becomes effortless, implicit choices become invisible (the AI picks a default and moves on), and the interpretive work that should happen between running analyses gets compressed or skipped entirely.

So the question is: if specification-driven development says "put the reasoning first, generate the code from it," what does the equivalent look like for analysis?

I think it looks something like this. In specification-driven development, the workflow is constitution, specification, plan, tasks, implementation. Each step constrains the next, and by the time you reach code generation the decisions are already made. For analysis, I think the structure would need to be something like:

1. **Context and orientation**: what's the question, why does it matter, what's already known, what data exists. This is the equivalent of understanding user requirements before writing a spec, except analytical questions sit in a messier landscape of prior evidence, institutional context, and political sensitivity.
2. **Exploration**: engage with the data before committing to an approach. This has no real equivalent in software development, where you generally know what you're building before you start specifying. In analysis, you often don't know what question you can actually answer until you've seen what the data contains.
3. **Analytical specification**: the core artifact. What exactly will you analyse, how, and why. Your identification strategy, your model specification, your expected results, your robustness plan, your limitations. Written and reviewed before any estimation is conducted. This is the direct analogue of the software specification, and I think it's where most of the value is.
4. **Implementation planning and execution**: translating the specification into code. This is where AI adds the most obvious value. Given a detailed analytical specification, code generation is close to mechanical.
5. **Interpretation and sense-checking**: examining results against expectations and domain knowledge. This is something software doesn't really have an equivalent for. "The code passes its tests" is sufficient for software. "The code ran and produced numbers" is only the beginning for analysis.
6. **Documentation**: packaging the analysis for its audience and preserving the reasoning for future reference.

The analytical specification, step three, is where I think the real leverage is. It's the equivalent of the SpecKit specification for software, but adapted for the distinct requirements of analytical work. It would need to capture not just what analysis you're running but what you expect to find and why, what the threats to validity are, what alternative specifications you'll test for robustness, and what the analysis cannot tell you. Documenting expected results before seeing them creates a baseline for sense-checking. If your results diverge dramatically from expectations, that's a signal to investigate, not necessarily to doubt the results, but to understand why they differ. Without documented expectations, there's no basis for that kind of critical evaluation.

There's a useful parallel with the constitution concept from specification-driven development. In software, the constitution captures shared principles, e.g., architectural patterns, quality standards, non-negotiable constraints. For analysis, the equivalent would be something like shared epistemic standards: document your reasoning before running estimations, distinguish explicitly between exploratory and confirmatory work, state your limitations honestly and specifically rather than with generic caveats. These aren't methodological prescriptions, they're process commitments that apply regardless of what kind of analysis you're doing.

The differences between software and analysis are real and worth taking seriously. Analytical problems are less decomposable, the question often evolves as you engage with the data. Exploration is a legitimate phase, not a sign that the specification wasn't detailed enough. The "correct" approach is often genuinely contested in ways that software rarely is. And results require sense-checking against domain knowledge, which is a form of judgment that can't be automated or specified away. A specification-driven analysis workflow would need to be more iterative, more flexible, and more reliant on human judgment than its software counterpart.

But the core insight transfers. AI makes the mechanical part of analysis nearly free. The value is almost entirely in the reasoning: formulating good questions, choosing appropriate methods, interpreting results critically, understanding what the data can and cannot tell you. Any workflow that doesn't put the reasoning first is probably leaving most of that value on the table, and any workflow that makes the reasoning explicit and reviewable is probably going to produce better analysis than one that leaves it in the analyst's head.
