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

I've been building this blog using a workflow where the specifications are the primary artifact and the code is their generated expression. The idea comes from a paradigm called specification-driven development and I have been thinking that same inversion could apply to analytical research.

## what specification-driven development is

The core idea is that instead of writing code and documenting it afterwards, you write a detailed specification first, *then* use AI to generate the code from it. The specification captures your reasoning, your constraints, your design decisions. The code is just the implementation of those decisions, and if the specification is good enough, the code generation is close to deterministic.

This matters because AI-assisted coding has changed which part of the process is hard. Writing code used to be the slow, expensive part. Now it's much faster and much cheaper. What's still hard, and what many analysts would argue AI can't reliably do for you, is deciding what to build and why. Specification-driven development puts the emphasis where the difficulty actually is.

A tool called [SpecKit](https://github.com/github/spec-kit) formalises this into a structured workflow. At a high level, the steps are:

1. **Constitution**: a set of shared principles that govern the project, e.g., architectural patterns, quality standards, non-negotiable constraints. This stays relatively stable across the life of a project.
2. **Specification**: a detailed description of what you want to build, written in natural language with enough precision that the implementation choices are determined by it.
3. **Plan**: a technical design that translates the specification into an implementation strategy, covering architecture, dependencies, and how the pieces fit together.
4. **Tasks**: a breakdown of the plan into discrete, ordered units of work that can be implemented independently.
5. **Implementation**: code generation from the tasks, where AI does the mechanical translation and the human verifies that the output matches the spec.

Each step constrains the next. The constitution constrains specifications, specifications constrain plans, plans constrain tasks. By the time you reach implementation, most of the decisions have already been made and documented. The idea being that you limit the extent to which AI makes judgment calls, and rather only executes well-defined instructions.

## how this blog uses it

This blog is built with Eleventy and is relatively simple, but I've been using the SpecKit workflow to build features. Each feature has a specification that describes what it should do, a plan that describes how, and tasks that break it down. The code was generated from those artifacts.

That's probably overkill for a personal blog. But it's been useful as a way to learn the workflow, and it's demonstrated that when the specification is clear, the implementation is fast and predictable. When the specification is vague, the AI generates something plausible that isn't quite right, and you spend more time debugging than you would have spent specifying properly in the first place.

The other thing I've noticed is that the specifications are *more* valuable than the code over time. If I want to understand why a feature works the way it does, I can read the spec first. Then, if I want to change something, I update the spec and regenerate. The code is "ephemeral" in a way that the reasoning behind it isn't.

## what would specification-driven analysis look like

I've been thinking about whether the same inversion applies to analytical work, e.g., the kind of empirical research that happens in policy, social science, and data science contexts. I think it does, and I think the mapping is quite close to what Speckit currently implements.

In a reductive way, most analytical work follows an implicit workflow: get a question, find some data, explore it, run some analysis, produce outputs, write up findings. Often, the analyst carries much of the reasoning in their head. The code captures the implementation but not the rationale. The write-up captures the conclusions but not the path that led to them.

AI-assisted coding also changes core parts of the analysis workflow. When it takes thirty seconds to run a regression with different controls, different sample restrictions, different functional forms, the mechanical friction that previously slowed the process disappears. That friction was in some ways a blessing, as it created space for thought. When writing code was slow, the analyst was forced to sit with their choices, to think about whether this specification was really the right one before committing time to implementing it. When that cost drops to near zero, specification searching becomes effortless, implicit choices become invisible (the AI picks a default and moves on), and the interpretive work that should happen between running analyses gets compressed or skipped entirely.

If specification-driven development says "put the reasoning first, generate the code from it," what does the equivalent look like for analysis?

In specification-driven development, the workflow is constitution, specification, plan, tasks, implementation. Each step constrains the next, and by the time you reach code generation the decisions are already made. For analysis, I think the structure would need to be something like:

<div class="analysis-stepper" id="analysis-stepper">
<div class="stepper-header">
<div class="stepper-nav">
<button class="stepper-btn stepper-prev" aria-label="Previous step" disabled>&larr;</button>
<span class="stepper-indicator"></span>
<button class="stepper-btn stepper-next" aria-label="Next step">&rarr;</button>
</div>
<button class="stepper-toggle" aria-label="Toggle plain text view" title="View as plain text">
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="10" y2="12"/></svg>
</button>
</div>
<div class="stepper-cards">
<div class="stepper-card active" data-step="0">
<div class="stepper-step-num">1</div>
<div class="stepper-card-body">
<h4>context and orientation</h4>
<p>What's the question, why does it matter, what's already known, what data exists. This is the equivalent of understanding user requirements before writing a spec, except analytical questions sit in a messier landscape of prior evidence, institutional context, and political sensitivity.</p>
<p class="stepper-example"><em>Say a government department wants to understand whether firms that adopt new technologies become more productive, because they're designing a support programme for technology adoption. The immediate instinct is to regress some productivity measure on some technology adoption measure and see what happens. But this step forces you to slow down. What problem is the department actually trying to solve? They want to know which firms to target and what kinds of adoption to support, which is not the same question as "does technology cause productivity." And what do you even mean by productivity? Revenue per employee doesn't account for input quality, capital intensity, or whether revenue growth reflects price increases rather than real output. This step is about surfacing the gap between the question you think you're asking and the question you can actually answer.</em></p>
</div>
</div>
<div class="stepper-card" data-step="1">
<div class="stepper-step-num">2</div>
<div class="stepper-card-body">
<h4>exploration</h4>
<p>Engage with the data before committing to an approach. This is not always as prevalent in software development, where you generally know what you're building before you start specifying (though exploration of data is often done in the process of understanding user requirements). In analysis, you often don't know what question you <em>can</em> actually answer until you've seen what the data contains.</p>
<p class="stepper-example"><em>You look at the data. What does "technology adoption" mean in this dataset, is it a binary flag, a spending figure, a self-reported survey response? You notice the firms in the data skew large, or that the technology adoption variable is only available for firms that responded to a voluntary survey. That's selection bias, the firms that respond are probably already different from those that don't in ways that correlate with productivity. You also notice the productivity measures available are limited, you have revenue and headcount but not intermediate inputs, so total factor productivity is off the table. The data is already shaping what question you can credibly answer, and you haven't run a single regression yet.</em></p>
</div>
</div>
<div class="stepper-card" data-step="2">
<div class="stepper-step-num">3</div>
<div class="stepper-card-body">
<h4>analytical specification</h4>
<p>The core artefact. What exactly will you analyse, how, and why. Your identification strategy, your model specification, your expected results, your robustness plan, your limitations. Written and reviewed before any estimation is conducted. This is the direct analogue of the software specification, and likely where most of the value is in this paradigm.</p>
<p class="stepper-example"><em>Now you write down precisely what you'll estimate. Your outcome variable is revenue per employee (acknowledged as a crude proxy). Your treatment is whether a firm reports adopting a specific class of technology. You document your identification strategy, maybe a difference-in-differences design exploiting a policy change that encouraged adoption in certain sectors. You write down what you expect to find, probably a modest positive effect, likely larger for smaller firms. You document the threats: selection into adoption is non-random, the productivity proxy is noisy, the survey response bias means your sample isn't representative. You specify your robustness checks, e.g., alternative productivity measures, different sample restrictions, placebo tests. All of this is written and reviewable before you estimate anything.</em></p>
</div>
</div>
<div class="stepper-card" data-step="3">
<div class="stepper-step-num">4</div>
<div class="stepper-card-body">
<h4>implementation planning and execution</h4>
<p>Translating the specification into code. This is where AI adds the most obvious value. Given a detailed analytical specification, code generation is close to mechanical.</p>
<p class="stepper-example"><em>Given the specification, the code is close to mechanical. AI can generate the data cleaning pipeline, the estimation code, the robustness checks. The specification has already made the decisions, this step just executes them.</em></p>
</div>
</div>
<div class="stepper-card" data-step="4">
<div class="stepper-step-num">5</div>
<div class="stepper-card-body">
<h4>interpretation and sense-checking</h4>
<p>Examining results against expectations and domain knowledge. This is something software doesn't really have an equivalent for. "The code passes its tests" is sufficient for software. "The code ran and produced numbers" is only the beginning for analysis.</p>
<p class="stepper-example"><em>Your main estimate shows a 12% productivity premium for adopters. Is that plausible? You compare it to the literature, most studies find effects in the 5-15% range, so it's in the right ballpark. But your robustness checks show the effect disappears when you restrict to firms that responded to both waves of the survey. That's a red flag, it suggests your result might be driven by differential attrition rather than a real treatment effect. Without the documented expectations from the specification step, you might have just reported the 12% headline figure and moved on.</em></p>
</div>
</div>
<div class="stepper-card" data-step="5">
<div class="stepper-step-num">6</div>
<div class="stepper-card-body">
<h4>documentation</h4>
<p>Packaging the analysis for its audience and preserving the reasoning for future reference (though this should really happen throughout the entire process).</p>
<p class="stepper-example"><em>You write up not just the results but the reasoning chain: why you chose this specification, what alternatives you considered, what the limitations are, and what the department should and shouldn't conclude from this. The specification from step three becomes the backbone of this write-up.</em></p>
</div>
</div>
</div>
</div>
<noscript>

1. **Context and orientation**: what's the question, why does it matter, what's already known, what data exists. This is the equivalent of understanding user requirements before writing a spec, except analytical questions sit in a messier landscape of prior evidence, institutional context, and political sensitivity. *Say a government department wants to understand whether firms that adopt new technologies become more productive, because they're designing a support programme for technology adoption. The immediate instinct is to regress some productivity measure on some technology adoption measure and see what happens. But this step forces you to slow down. What problem is the department actually trying to solve? They want to know which firms to target and what kinds of adoption to support, which is not the same question as "does technology cause productivity." And what do you even mean by productivity? Revenue per employee doesn't account for input quality, capital intensity, or whether revenue growth reflects price increases rather than real output. This step is about surfacing the gap between the question you think you're asking and the question you can actually answer.*
2. **Exploration**: engage with the data before committing to an approach. This is not always as prevalent in software development, where you generally know what you're building before you start specifying (though exploration of data is often done in the process of understanding user requirements). In analysis, you often don't know what question you *can* actually answer until you've seen what the data contains. *You look at the data. What does "technology adoption" mean in this dataset, is it a binary flag, a spending figure, a self-reported survey response? You notice the firms in the data skew large, or that the technology adoption variable is only available for firms that responded to a voluntary survey. That's selection bias, the firms that respond are probably already different from those that don't in ways that correlate with productivity. You also notice the productivity measures available are limited, you have revenue and headcount but not intermediate inputs, so total factor productivity is off the table. The data is already shaping what question you can credibly answer, and you haven't run a single regression yet.*
3. **Analytical specification**: the core artefact. What exactly will you analyse, how, and why. Your identification strategy, your model specification, your expected results, your robustness plan, your limitations. Written and reviewed before any estimation is conducted. This is the direct analogue of the software specification, and likely where most of the value is in this paradigm. *Now you write down precisely what you'll estimate. Your outcome variable is revenue per employee (acknowledged as a crude proxy). Your treatment is whether a firm reports adopting a specific class of technology. You document your identification strategy, maybe a difference-in-differences design exploiting a policy change that encouraged adoption in certain sectors. You write down what you expect to find, probably a modest positive effect, likely larger for smaller firms. You document the threats: selection into adoption is non-random, the productivity proxy is noisy, the survey response bias means your sample isn't representative. You specify your robustness checks, e.g., alternative productivity measures, different sample restrictions, placebo tests. All of this is written and reviewable before you estimate anything.*
4. **Implementation planning and execution**: translating the specification into code. This is where AI adds the most obvious value. Given a detailed analytical specification, code generation is close to mechanical. *Given the specification, the code is close to mechanical. AI can generate the data cleaning pipeline, the estimation code, the robustness checks. The specification has already made the decisions, this step just executes them.*
5. **Interpretation and sense-checking**: examining results against expectations and domain knowledge. This is something software doesn't really have an equivalent for. "The code passes its tests" is sufficient for software. "The code ran and produced numbers" is only the beginning for analysis. *Your main estimate shows a 12% productivity premium for adopters. Is that plausible? You compare it to the literature, most studies find effects in the 5-15% range, so it's in the right ballpark. But your robustness checks show the effect disappears when you restrict to firms that responded to both waves of the survey. That's a red flag, it suggests your result might be driven by differential attrition rather than a real treatment effect. Without the documented expectations from the specification step, you might have just reported the 12% headline figure and moved on.*
6. **Documentation**: packaging the analysis for its audience and preserving the reasoning for future reference (though this should really happen throughout the entire process). *You write up not just the results but the reasoning chain: why you chose this specification, what alternatives you considered, what the limitations are, and what the department should and shouldn't conclude from this. The specification from step three becomes the backbone of this write-up.*

</noscript>
<style>
.analysis-stepper {
  margin: var(--space-md) 0 var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}
.stepper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}
.stepper-nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}
.stepper-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  color: var(--color-text);
  font-family: var(--font-family);
  font-size: 0.85rem;
  line-height: 1;
  transition: border-color 0.2s, color 0.2s;
}
.stepper-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.stepper-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.stepper-indicator {
  display: flex;
  gap: 6px;
  align-items: center;
}
.stepper-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
}
.stepper-dot:hover {
  background: var(--color-accent);
  opacity: 0.6;
}
.stepper-dot.active {
  background: var(--color-accent);
  transform: scale(1.3);
}
.stepper-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.3rem 0.4rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  line-height: 1;
  display: flex;
  align-items: center;
  transition: border-color 0.2s, color 0.2s;
}
.stepper-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.stepper-toggle.text-active {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.stepper-cards {
  position: relative;
  min-height: 120px;
}
.stepper-card {
  display: none;
  padding: var(--space-md);
  animation: stepFadeIn 0.25s ease;
}
.stepper-card.active {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;
}
.stepper-step-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-top: 0.15rem;
}
.stepper-card-body h4 {
  margin: 0 0 var(--space-xs);
  font-size: 1rem;
  color: var(--color-text);
  text-transform: lowercase;
}
.stepper-card-body p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: var(--line-height);
}
.stepper-card-body p.stepper-example {
  margin-top: var(--space-xs);
  padding-top: var(--space-xs);
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
}
/* Plain text mode */
.analysis-stepper.plain-text .stepper-cards {
  min-height: auto;
}
.analysis-stepper.plain-text .stepper-card {
  display: flex !important;
  gap: var(--space-sm);
  align-items: flex-start;
  padding: var(--space-xs) var(--space-md);
  animation: none;
  border-bottom: 1px solid var(--color-border);
}
.analysis-stepper.plain-text .stepper-card:last-child {
  border-bottom: none;
}
.analysis-stepper.plain-text .stepper-card:first-child {
  padding-top: var(--space-sm);
}
.analysis-stepper.plain-text .stepper-nav {
  display: none;
}
@keyframes stepFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 480px) {
  .stepper-card-body p {
    font-size: 0.9rem;
  }
}
</style>
<script>
(function() {
  var stepper = document.getElementById('analysis-stepper');
  if (!stepper) return;
  var cards = stepper.querySelectorAll('.stepper-card');
  var prev = stepper.querySelector('.stepper-prev');
  var next = stepper.querySelector('.stepper-next');
  var indicator = stepper.querySelector('.stepper-indicator');
  var toggle = stepper.querySelector('.stepper-toggle');
  var current = 0;
  var total = cards.length;
  var plainText = false;
  // Build dots
  for (var i = 0; i < total; i++) {
    var dot = document.createElement('span');
    dot.className = 'stepper-dot' + (i === 0 ? ' active' : '');
    dot.dataset.idx = i;
    dot.addEventListener('click', function() { goTo(parseInt(this.dataset.idx)); });
    indicator.appendChild(dot);
  }
  function goTo(idx) {
    if (plainText || idx < 0 || idx >= total) return;
    current = idx;
    cards.forEach(function(c) { c.classList.remove('active'); });
    cards[current].classList.add('active');
    var dots = indicator.querySelectorAll('.stepper-dot');
    dots.forEach(function(d) { d.classList.remove('active'); });
    dots[current].classList.add('active');
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
  }
  prev.addEventListener('click', function() { goTo(current - 1); });
  next.addEventListener('click', function() { goTo(current + 1); });
  toggle.addEventListener('click', function() {
    plainText = !plainText;
    stepper.classList.toggle('plain-text', plainText);
    toggle.classList.toggle('text-active', plainText);
    toggle.setAttribute('title', plainText ? 'View as cards' : 'View as plain text');
    if (!plainText) goTo(current);
  });
})();
</script>

The analytical specification, step three, is where I think the real leverage is. It's the equivalent of the SpecKit specification for software, but adapted for requirements of analytical work. It would need to capture not just what analysis you're running but what you expect to find and why, what the threats to validity are, what alternative specifications you'll test for robustness, and what the analysis cannot tell you. Documenting expected results before seeing them creates a baseline for sense-checking. If your results diverge dramatically from expectations, that's a signal to investigate, not necessarily to doubt the results, but to understand why they differ. Without documented expectations, there's no basis for that kind of critical evaluation.

There's also a useful parallel with the constitution concept from specification-driven development. In software, the constitution captures shared principles, e.g., architectural patterns, quality standards. For analysis, the equivalent would be something like shared epistemic standards: document your reasoning before running estimations, distinguish explicitly between exploratory and confirmatory work, state your limitations honestly and specifically rather than with generic caveats.

A tension here is that analytical problems are less decomposable than software problems, as the question often evolves as you engage with the data. Exploration is a core part of the workflow, not a sign that the specification wasn't detailed enough. The "correct" approach is often genuinely contested in ways that software rarely is, and results require sense-checking against domain knowledge, which is a form of judgment that can't be automated or specified away. A specification-driven analysis workflow would need to be more iterative, more flexible, and more reliant on human judgment than its software counterpart. I think the specification-driven framing still holds, but how exactly to handle the loops between exploration and specification is something I haven't fully worked out yet.

What's similar is that AI makes the mechanical part of analysis nearly free. The value is almost entirely in the reasoning: formulating good questions, choosing appropriate methods, interpreting results critically, understanding what the data can and cannot tell you. Any workflow that doesn't put the reasoning first is probably leaving most of that value on the table, and any workflow that makes the reasoning explicit and reviewable is probably going to produce better analysis than one that leaves it in the analyst's head.

I think there's something worth exploring here in more detail, particularly around what a concrete specification-driven analysis workflow would actually look like in practice, how the iteration between exploration and specification works, and what the tooling implications are. I'll try to work through that in a subsequent post.
