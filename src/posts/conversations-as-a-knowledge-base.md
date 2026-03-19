---
title: conversations as a knowledge base
date: 2026-03-19
tags:
  - knowledge-management
  - ai
  - workflow
description: Most of the context that matters for building software lives in conversations. I think there's a lightweight way to capture it.
layout: layouts/post.njk
---

A lot of the knowledge that matters when building software never makes it into the codebase. It lives in meetings, message threads and conversations where someone explains why we're doing it this way and not that way. The information in business context, discussions of tradeoffs, and verbal articulation of the things people care about shape every decision, but it mostly evaporates.

I've been thinking about what it would look like to actually capture it.

## the gap between talking and building

When a team discusses a feature, the conversation contains a lot of useful signal. E.g., User requirements naturally surface, edge cases get raised, someone explains the business constraint that rules out the obvious approach. All of that context is exactly what you'd want available when you sit down to write the code.

The problem has always been that turning conversations into structured documentation is tedious enough that it doesn't happen consistently. Meeting notes get taken sometimes, decisions get recorded occasionally, but there's no reliable pipeline from "we talked about it" to "the information is available where it's needed."

I think LLMs change this. They're good at reading messy, unstructured text and extracting what matters from it. That makes them a useful translation layer between how we actually think and talk (which is loosely structured, full of tangents, repetitive) and the structured documentation that's useful for building software. The capture doesn't need to be clean because the retrieval can be smart.

## a lightweight setup

I've been experimenting with a workflow that I think makes this practical. The basic idea is you dump everything into one place, let an indexing layer make it searchable, and sync relevant context into project repos where agents can use it.

<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;margin:1.5rem auto;display:block;font-family:'Roboto Slab',Georgia,serif;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D2691E"/>
    </marker>
  </defs>
  <rect x="170" y="10" width="260" height="54" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="300" y="33" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">you</text>
  <text x="300" y="52" text-anchor="middle" font-size="11" fill="#5C5C5C">obsidian daily notes, transcripts, thoughts</text>
  <line x1="300" y1="64" x2="300" y2="104" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <rect x="170" y="104" width="260" height="44" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="300" y="124" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">git repo</text>
  <text x="300" y="140" text-anchor="middle" font-size="11" fill="#5C5C5C">source of truth</text>
  <line x1="220" y1="148" x2="140" y2="198" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="380" y1="148" x2="460" y2="198" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="300" y="185" text-anchor="middle" font-size="10" fill="#D2691E" font-style="italic">sync</text>
  <rect x="20" y="198" width="240" height="64" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="140" y="220" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">openviking</text>
  <text x="140" y="237" text-anchor="middle" font-size="11" fill="#5C5C5C">semantic index</text>
  <text x="140" y="253" text-anchor="middle" font-size="11" fill="#5C5C5C">tiered context (L0 / L1 / L2)</text>
  <rect x="340" y="198" width="240" height="64" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="460" y="220" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">project repos</text>
  <text x="460" y="237" text-anchor="middle" font-size="11" fill="#5C5C5C">.ai/context/ directories</text>
  <text x="460" y="253" text-anchor="middle" font-size="11" fill="#5C5C5C">synced from knowledge base</text>
  <line x1="140" y1="262" x2="200" y2="332" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="460" y1="262" x2="400" y2="332" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="150" y="302" text-anchor="middle" font-size="10" fill="#D2691E" font-style="italic">query</text>
  <text x="450" y="302" text-anchor="middle" font-size="10" fill="#D2691E" font-style="italic">read</text>
  <rect x="140" y="332" width="320" height="64" rx="4" fill="none" stroke="#D2691E" stroke-width="1.5"/>
  <text x="300" y="357" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">ai agents</text>
  <text x="300" y="374" text-anchor="middle" font-size="11" fill="#5C5C5C">query openviking for context</text>
  <text x="300" y="390" text-anchor="middle" font-size="11" fill="#5C5C5C">read .ai/context/ in project repos</text>
</svg>

The components:

**[Obsidian](https://obsidian.md) daily notes** as the capture layer. One file per day, completely freeform. I paste meeting transcripts in, jot down ideas, drop notes from conversations. There's no structure to maintain, which is the point. If capturing something requires organising it first, it probably won't get captured.

**Git** as the source of truth. The knowledge base is a single repo and Obsidian Git syncs it automatically every few minutes.

**[OpenViking](https://github.com/volcengine/openviking)** as the indexing layer. It sits on top of the repo and builds a semantic index, with tiered levels of detail. Agents can request a one-sentence summary of a chunk, or the core information, or the full original content, depending on how much context they need. This keeps token usage reasonable.

**A sync script** that pulls project docs (READMEs, design docs) into the knowledge base so everything is searchable in one place, and pushes relevant knowledge base content into project repos via `.ai/context/` directories where coding agents can read it.

## what this means for coding

When an AI coding agent starts a task, it can query the knowledge base for relevant context. Not just the code and the README, but the conversation where the team discussed why the feature works this way, the meeting where someone raised the edge case, the note where I worked through the tradeoff.

LLMs are good at this kind of high-dimensional retrieval. A conversation transcript might not mention the specific function an agent is working on, but it contains the reasoning and constraints that should inform how that function gets built. The agent can read between the lines in a way that keyword search can't.

I think this is especially useful across multiple projects. Conversations about one project often contain insights relevant to another. A shared knowledge base means that context can flow between them rather than staying siloed.

## connecting to structured specs

I've been using a tool called [SpecKit](https://github.com/github/spec-kit) for structured specifications on this blog. It's a bit much for a blog, but for larger software with multiple stakeholders, having formal specs matters. I think the interesting thing is how a knowledge base like this feeds into that process. The conversations that inform specs don't need to be re-explained each time, because they're already captured and searchable. I'll probably write more about SpecKit once I've used it on something more substantial.

My core thoughts here is that the bottleneck isn't capturing information, it's making capture easy enough that it actually happens. If all I need to do is paste a transcript or write a few sentences into today's note, and the indexing and retrieval happens automatically, then the knowledge base grows as a side effect of working normally.
