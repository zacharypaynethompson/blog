---
title: the cost curve for slop
date: 2026-04-22
tags:
  - ai
  - workflow
  - specification-driven-development
description: Slop creep is a concern for engineering at scale. I think the cost curve looks different for prototyping and analytical work.
layout: layouts/post.njk
---

<link rel="stylesheet" href="/blog/assets/css/slop-diagrams.css">

Boris Tane recently wrote about what he calls [slop creep](https://boristane.com/blog/slop-creep-enshittification-of-software/), the gradual degradation of codebases through accumulated *individually* reasonable but *collectively* destructive decisions. His argument is that coding agents have accelerated this by removing frictions that previously forced developers to confront architectural mistakes. The agent is "confidently, competently wrong" because it only sees what it's explicitly told, missing the broader system context. Previously, poor decisions would slow teams down, forcing correction. Now agents maintain productivity while building on faulty abstractions, deferring the reckoning until it compounds into something expensive to unwind.

His prescription is a research-plan-implement workflow where engineers define explicit intent upfront, review architectural plans critically across several refinement rounds, and treat irreversible decisions as engineer responsibilities rather than agent ones. The role shifts from typing to thinking strategically about system design before implementation begins.

<div id="slop-workflow-diagram"></div>

I do think Boris is right. But I think he's right for a specific context, and importing those assumptions wholesale is where it gets shaky.

## the vantage matters

Boris is writing from the vantage of a former engineering manager at Cloudflare, where every abstraction is a one-way door and users feel every tiny cut. In that world, "spend 10x more time in the plan, read every line" is obviously correct. The cost of slop at platform scale is high and it compounds fast.

But the cost curve for slop varies depending on what you're building and who you're building it for. For a data science team, or anyone doing prototyping and analytical work alongside more production-oriented engineering, this splits along two different lines.

## prototyping and analytical work

On the prototyping and analytical side, the hard problem isn't translating a known intent into clean code. It's figuring out what users actually need in the first place. The "spec" that matters most is the user-need articulation, and a lot of what looks like slop in these codebases isn't "wrong-abstraction" slop, it's *misinterpreted-user-need* slop, meaning code that got written for an assumption about users that turned out to be wrong, or that's gone stale as the product evolved.

Boris's framing doesn't really speak to this, because he's assuming the intent is known and the question is just how faithfully to execute it. When the intent itself is the thing that keeps moving, the dynamics change.

I don't think de-slopping sessions are as insufficient as Boris implies. His argument is that by the time you notice slop, unwinding costs more than preventing it. That's true at platform scale. It's much less true when you've got a handful of users and the product itself is changing week by week. Regular spring-clean sessions, e.g., grilling the agent on design decisions, asking why things are the way they are, refactoring aggressively, are viable precisely because the cost of refactoring has collapsed. The codebase is small, the code is disposable, and the thing that actually needs to be durable is the understanding of what you're trying to build.

## scalable and production work

On the scalable side, Boris's argument does apply. Once the focus shifts from discovering what the product should be to reliably delivering it at scale, e.g., lower latency, lower cost, more users, fewer failure modes, one-way doors start to matter and slop really does compound. The practice of reading every line of agent output, maintaining cognitive engagement with the code rather than trusting the agent's confidence, is the right discipline for this context. A colleague recently [wrote about](https://myndrws.github.io/2026/02/19/guarding-against-reverse-centaurs.html) the risk of becoming a "reverse centaur", a machine head on a human body, where humans become appendages serving machine processes rather than directing them. That framing captures the danger well.

This is also where the skills you want to develop matter. On the prototyping side, the skills I want to deepen are the analytical ones, and code is a means to an end. On the scalable side, understanding *why* the language and its abstractions work the way they do is what lets you make the design calls that keep the system from quietly getting worse. The cost of not understanding the code is different depending on which side you're on.

<div id="slop-cost-curve"></div>

## specification-driven development as a mindset

I've been trialling [spec-kit](https://github.com/github/spec-kit/) recently, a tool that formalises specification-driven development into a structured workflow where specs generate code rather than the other way around. My take is that it's been educational, but I wouldn't reach for it as a toolkit right now. There's quite a lot of ceremony for the kind of work I'd be doing on the prototyping side.

That said, I think the distinction between SDD-as-a-toolkit and SDD-as-a-state-of-mind is worth making.

The useful shift has been making the distinction in my own head between *specification* and *execution*, that is, what am I actually trying to build and why, vs. what are the exact characters of code that implement it. On the prototyping side, where the codebase is small and the user need is the thing that keeps moving, holding the spec as the durable thing and letting the code be regenerable feels right, even if you're doing it informally.

On the scalable side, I'm less convinced. That's where you're working with a lot of code, where step 3 going wrong compounds into real pain by step 8, and where a tight human-in-every-step loop is the right discipline. Rigid ceremony doesn't add much there that a good engineer wasn't already doing.

## food for thought: the false confidence critique

One counterargument worth sitting with is that spec-driven development creates false confidence. The claim is that when you write a detailed spec upfront, it's very difficult to verify the whole thing makes sense from the start, which is why software development is generally done in modular chunks where you change one thing, then adjust the next based on what happened. When you force an LLM into a rigid plan, it starts ignoring its ability to deviate even when deviating would be the right call. Step 3 has an issue, but the model follows the spec anyway, forcing in behaviour that compounds downstream. By step 8, you've got multiplicative errors and a false sense of security that the plan was right.

Even if you avoid all of that, you either fully trust the output under the assumption that a good spec produces good code, or you review every step anyway, at which point it's not clear what the ceremony bought you over building step-by-step in the first place.

I think this is a strong critique for the scalable side, where tight feedback loops matter. On the prototyping side, where the codebase is smaller and more disposable, it matters less. The spec isn't trying to be a comprehensive multi-step blueprint. It's trying to be a clear articulation of the user need and the analytical approach, with the code as a regenerable expression of that.

## the spec as the durable artefact

My heavy prior is that regenerating code from a specification is going to keep getting cheaper. I'd bet on that quite strongly. Which means the argument for treating the spec as the durable artefact gets stronger over time, even if the specific tooling is still clunky.

This is also where spec-driven thinking has a documentation benefit, even if the toolkit is too ceremonial. Maintaining specifications alongside code forces a documentation trail that most repos otherwise lack. When someone joins a project or revisits it later, the reasoning behind the code is visible in a way that comments and commit messages rarely achieve.

## there isn't going to be a clean prescription

A lot of this comes down to qualitative judgement about how to work with these tools. LLMs are a general-purpose technology, like the internet or electricity, and I don't think there's going to be a clean "do this, don't do this" prescription for working with them. What we're really talking about is closer to management science than engineering, strategies embedded in how we like to work, and that's not something you can standardise easily. It's the soft-skill stuff that comes with practice.

The answer is going to be different for different people and different parts of the team. I think that's probably OK.

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="/blog/assets/js/slop-workflow-diagram.js"></script>
<script src="/blog/assets/js/slop-cost-curve.js"></script>
