---
title: classification is an ontology problem
date: 2026-04-07
tags:
  - data-science
  - measurement
  - classification
  - policy
description: Top-down classification forces an ontology onto your data. Sometimes you need to let the structure emerge from what's actually there.
layout: layouts/post.njk
---

In a [previous post](/posts/classification-is-a-logistics-problem/), I argued that the hard part of classification isn't methodology, it's data validity and definitional alignment. I still think that's true, but another dimension I didn't address is whether the entire framing of top-down classification is appropriate for what you're trying to understand.

This is less about the practicalities of classification and more about the epistemology of it. When you define sectors from the top down and then classify entities into them, you're imposing an ontology onto your data. That's fine for some purposes, but for others it's fundamentally misaligned with what you're trying to learn.

## what top-down classification actually does

Say the government publishes an industrial strategy with a set of priority sectors: AI, cyber security, frontier biotech, and so on. You want to understand the economy through these sectors, so you take company descriptions and classify firms into them. This is the approach I described in the previous post, and tools like [GABRIEL](https://github.com/openai/GABRIEL) or [The Data City](https://thedatacity.com/) make it operationally straightforward.

But think about what you're actually doing. You're asking "how does our economy fit into these predefined categories?", the categories came first and the data is being shaped to fit *them*. You're not discovering structure in the economy, you're confirming a structure that was already decided.

This matters because the categories might not correspond to how economic activity is actually organised. When you ask "how many AI firms are there?", you're presupposing that "AI firm" is a coherent category that exists in the data in the way you mean it. A company developing AI for video game animation and a company developing AI for supply chain optimisation are both "AI companies," but the resemblance might be superficial. Their supply chains, labour markets, growth dynamics, and competitive landscapes could be completely different.

The question you probably want to ask is the inverse: what activities, connections, and clusters naturally emerge from economic data, and how do those map onto our conceptual understanding of sectors?

## attributes, not buckets

This distinction came into focus for me through a conversation with a colleague at the [Innovation Growth Lab](https://www.innovationgrowthlab.org/).

If you try to force a single definition of a sector, someone will always be unhappy. In my previous post I gave the example of Official Statistics teams and Industrial Strategy teams needing different things from the same classification. Their suggestion was that instead of arguing whether a firm is "in the AI sector," you classify its attributes e.g., what technology it uses, whether it's a producer or adopter, what application domain it operates in.

So rather than a binary "AI company: yes/no", you get something like:

- Technology: Uses AI (yes/no)
- Role: Producer vs. Adopter
- Application domain: Supply chain, creative arts, healthcare, etc.

The definitions of these attributes are rigid and agreed upon, but different teams can query different combinations. A statistics team might query `WHERE Technology = 'Uses AI'` to get a broad count. A strategy team might query `WHERE Technology = 'Uses AI' AND Role = 'Producer' AND Application = 'Supply Chain'` to get something more targeted. The underlying data is the same, the classification is consistent, but the views are flexible.

This is a shift from classification-as-bucketing to classification-as-tagging, and it dissolves some of the logistical alignment problems I described in the previous post. You don't need everyone to agree on what "the AI sector" means if you can agree on what the individual attributes mean.

## hierarchical taxonomies as an alternative

The attribute-based approach addresses the definitional problem, but there's a related structural question, how do you capture the full breadth of economic activity without predetermining what matters?

Top-down classification schemes tend to be sparse. An industrial strategy might define eight or ten sectors, which means the vast majority of firms don't fit cleanly into any of them. As I noted in the previous post, you always end up with more categories than you planned for, because "doesn't fit" and "insufficient information" are always outcomes that need handling.

Hierarchical taxonomies take the opposite approach. Instead of a short list of strategically chosen categories, you start with a detailed, multi-level taxonomy that aims to capture almost every type of entity in your data. Taxonomies used for bibliometric classification, like the [CWTS research topics taxonomy](https://help.openalex.org/hc/en-us/articles/24736129405719-Topics), or government science taxonomies from bodies like GO Science, have hundreds or thousands of categories organised in tree structures.

The logic is that if your taxonomy is detailed enough to cover the full landscape, classification becomes a matching problem rather than a forcing problem. You're not asking "which of these eight boxes does this firm go in?", you're asking "where in this detailed map of economic activity does this firm sit?". The structure of the economy then emerges from the distribution of entities across the taxonomy, rather than being imposed beforehand.

## taxonomise: a different implementation

[Taxonomise](https://github.com/innovation-growth-lab/taxonomise/) is an tool from the Innovation Growth Lab at Nesta that implements this kind of approach. Rather than using an LLM to classify text into a flat list of categories, it classifies documents against hierarchical taxonomies using an ensemble of lightweight semantic matching methods.

At a high level, it works by running three independent matchers in parallel: one that compares the full document embedding against taxonomy labels, one that does the same at the sentence level to capture fine-grained relevance, and one that extracts keywords and matches them to taxonomy terms. These scores are combined with configurable weights and passed through a confidence calibration layer.

It's designed so that Classification is decomposable, meaning you can inspect which matcher contributed what score for any given classification, which matters for auditability. And it natively supports hierarchical taxonomy structures, outputting full paths like "Science > Physics > Quantum" rather than flat labels.

I think the interesting distinction isn't really about the specific implementation, it's about the framing. GABRIEL and similar LLM-based approaches treat classification as a prompted reasoning problem, the model "reads" each text and "decides" a category based on a definition you give it. Taxonomise treats it as a semantic similarity problem, the tool measures how close a document is to each node in a pre-defined taxonomy. The first approach works well when you have a small number of well-defined categories. The second works better when you want to map entities against a comprehensive structure and let patterns emerge from the results.

As an aside, I have not yet had a chance to use this framework in anger yet, but will hopefully write about it when the time comes.

## what this means in practice

I think there are broadly two classification regimes, and the choice between them should be explicit rather than defaulted.

The first is **top-down classification**: you have predefined categories and you want to sort entities into them. This is appropriate when the categories are well-defined, when stakeholders agree on what they mean, and when the goal is to populate a known structure. The previous post covered how to do this well.

The second is **emergent classification**: you want to understand the structure of your data and let categories surface from what's actually there. This is appropriate when you're trying to map a complex domain (like an economy), when you don't want to prejudge what the important groupings are, or when different stakeholders need different views of the same underlying data.

The risk I see in applied work, particularly in government, is that the first approach gets used by default because it's conceptually simpler and the tools for it are more accessible. You end up with clean sector counts that look authoritative but reflect the ontology you imposed rather than the reality you were trying to measure. The firms that don't fit get quietly dropped or forced into ill-fitting categories, and the interesting structure, the connections and clusters that would tell you something new about how the economy actually works, never surfaces.

I think the better default, at least for analytical work aimed at understanding rather than just counting, is to start from the data and work upward.
