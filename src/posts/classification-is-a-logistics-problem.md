---
title: classification is a logistics problem
date: 2026-03-20
tags:
  - data-science
  - measurement
  - classification
  - policy
description: The hard part of classification isn't the model. It's whether your data represents reality and whether anyone agrees on the definitions.
layout: layouts/post.njk
---

There's a recent paper, "GPT as a Measurement Tool," that introduces a framework called GABRIEL for using large language models to do text classification at scale. The core claim is that GPT can replicate human-coded labels reliably enough to be treated as a general-purpose measurement instrument for social science. I think the paper is right about this, and I think it's also the least interesting thing you could say about classification.

I've been framing classification problems as having three components: methodology, data, and logistics. Most of the attention, including in this paper, goes to methodology first. I think that's backwards.

## methodology is the solved part

Before LLMs, methodology was genuinely the hard layer. You needed to choose between support vector machines, random forests, rule-based systems, and whatever else, then spend significant effort on feature engineering, training, and validation. The data science problem really was in the methodology.

That's largely over. LLMs can do classification of unstructured text at least as well as humans can for most practical purposes. GABRIEL demonstrates this, and it's a useful contribution. But the implication is that methodology is no longer the binding constraint. If you can describe what you want to classify in natural language, the model will probably apply that description consistently. The paper compares GABRIEL to Stata, arguing it's just a neutral tool that applies a method. But OLS has fixed, well-understood statistical properties across Stata versions. GPT doesn't. The underlying model changes with each update, and the paper itself documents performance differences across model versions. That's a real concern for any research programme that needs to extend measurements over years, but it's still a methodology concern, and methodology is still the easiest layer to reason about.

## data as proxy

The harder question is whether the text you're classifying actually corresponds to the thing you care about. Job adverts are proxies for job activity. Company descriptions are proxies for what a firm actually does. Patents are proxies for innovation. None of this text data is the actual economic phenomenon, it's a representation of it, and that representation introduces systematic measurement error.

If your data doesn't map onto the underlying reality, it doesn't matter how good your classifier is. You're precisely measuring the wrong thing. The paper doesn't really engage with this because it takes its input data as given: Wikipedia titles, congressional transcripts, Reddit threads. That's fine for an academic exercise, but in applied work you're usually dealing with proxy data where the representational validity question is the first thing you need to answer.

Companies like The Data City offer classification products that map firms into sectors using company descriptions and ML. Their "Real-Time Industrial Classifications" are meant to replace outdated SIC codes, and for many purposes they're probably an improvement. But the same question applies: does a company's self-description on Companies House actually capture its economic activity? A firm might describe itself as an "AI company" because that's what attracts investment, not because AI is the core of what it does. The classifier will faithfully reproduce that signal. Whether the signal is meaningful is a different question entirely.

## logistics is the actual hard part

The layer that gets the least attention is what I think of as logistics: making sure everyone agrees on what you're classifying before you classify anything.

"AI adoption," "digital economy," "green jobs," "cyber" — these mean different things to different people, often to different people in the same organisation. One person's idea of what constitutes a cyber company is completely different to someone else's, especially depending on the context in which the classification is being used. GABRIEL makes it trivially easy to classify at scale, which means two teams can independently produce incompatible datasets using different definitions and never notice, because the outputs look clean and numeric either way. The tool returns confident scores regardless of whether the upstream definitional work was done.

<!-- DIAGRAM: Three stacked layers — methodology (bottom, labelled "solved"), data (middle, labelled "proxy validity"), logistics (top, labelled "definitional alignment"). Arrow pointing up with label "where the actual work is". Maybe show two teams with different definitions feeding into the same tool and getting divergent but clean-looking outputs. -->

This also means there are always more classes than you think. If you have eight sectors you want to classify firms into, you actually have ten: the eight sectors, plus "insufficient information to classify" and "doesn't fit any of these categories." When you're classifying the whole economy into strategic sectors, you're going to find that most firms don't fit cleanly into any of them, or there isn't enough data to make the call. Understanding the dynamics between what fits your definitions and what doesn't is itself a significant piece of analytical work.

In many government contexts, you can't even use commercial LLM APIs directly due to sensitivity constraints, which adds another logistical layer. There are approved alternatives and internal tools that can do the same work, but the point is that the practical barriers to deploying classification at scale are rarely about whether the model is accurate enough.

## the real risk

I think the risk with tools like GABRIEL isn't that GPT is inaccurate. It's that these tools make it easier to skip the data validity and definitional alignment steps, because the methodology layer looks solved and the outputs look authoritative regardless of whether the upstream problems were addressed. The paper's own applications illustrate this. It defines "moral universalism" as a construct, rates 140 years of congressional speeches on it, and interprets the time series as evidence about partisan polarisation. But "moral universalism" isn't a pre-validated construct. It's an attribute the authors invented for the exercise. The validation work in the paper shows GPT can replicate existing human-coded labels on established measures. That tells you nothing about whether GPT's ratings of a novel construct track a real phenomenon.

The message isn't "don't use LLMs for classification." They're good at it and you should. The message is that methodology is the least binding constraint, and tools that make methodology effortless can make people forget that the hard work was always somewhere else.
