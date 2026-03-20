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

There's a recent paper, "[GPT as a Measurement Tool](https://cdn.openai.com/pdf/7517a586-5bfa-4b87-bd3d-6ea0e9e844c7/GPT-as-a-measurement-tool.pdf)," that introduces a framework called GABRIEL for using large language models to do text classification at scale. Their claim is that GPT can replicate human-coded labels reliably enough to be treated as a general-purpose measurement instrument for social science. I think the paper is right about this, and I think it's also the least interesting thing you could say about classification.

I've been framing classification problems as having three components: methodology, data, and logistics. Most of the attention, including in this paper, goes to methodology first. I think that misses the major challenges involved in classification.

## methodology is the solved part

Before LLMs, methodology was genuinely the hard layer. You needed to choose between support vector machines, random forests, rule-based systems, and whatever else, then spend significant effort on feature engineering, training, and validation. The data science problem really was in the methodology.

That's largely over as LLMs can do classification of unstructured text at least as well as humans can for most practical purposes. GABRIEL demonstrates this, and that is a useful contribution. But the implication is that methodology is no longer the binding constraint. If you can describe what you want to classify in natural language, the model will probably apply that description consistently. 

As an aside, the paper compares GABRIEL to Stata, arguing it's just a neutral tool that applies a method. But OLS has fixed, well-understood statistical properties across Stata versions, proprietary LLMs don't. The underlying model changes with each update, and the paper itself documents performance differences across model versions. In my view, that's a concern for any research programme that needs to extend measurements over years, but it's still a methodology concern, and methodology is still the easiest layer to reason about.

## data as proxy

The harder question is whether the text you're classifying actually corresponds to the thing you care about. For example: job adverts are proxies for job activity, company descriptions are proxies for what a firm actually does, patents are proxies for innovation. None of this text data is the actual economic phenomenon, it's a representation of it, and that representation often introduces systematic measurement error.

If your data doesn't map onto the underlying reality, it doesn't matter how good your classifier is. You're precisely measuring the wrong thing. The paper doesn't really engage with this because it takes its input data as given: Wikipedia titles, congressional transcripts, Reddit threads. That's fine for an academic exercise, but in applied work you're usually dealing with proxy data where the representational validity question is the first thing you need to answer.

Companies like [The Data City](https://thedatacity.com/) offer classification products that map firms into sectors using company descriptions and ML. Their "Real-Time Industrial Classifications" are meant to replace outdated SIC codes, and for many purposes they're probably an improvement. But the same question applies: does a company's self-description on Companies House actually capture its economic activity? A firm might describe itself as an "AI company" because that's what attracts investment, not because AI is the core of what it does. The classifier will faithfully reproduce that signal. Whether the signal is meaningful is a different question entirely.

The Data City's approach also obfsucates some of the core logistical challenges associated with classification in an applied context.

## logistics is the actual hard part

The layer that gets the least attention is what I think of as logistics: making sure everyone agrees on what you're classifying before you classify anything.

"AI adoption," "digital economy," "green jobs," "cyber" — these mean different things to different people, often to different people in the same organisation. One person's idea of what constitutes a cyber company is completely different to someone else's, especially depending on the context in which the classification is being used. The data city solves this by, in my view, effectively overfitting to the preferences of one individual. And whilst their classification algorithms will be effective in this task, the alignment of this classification amongst multiple actors in an organisation doesn't seem to be a concern of their product.

GABRIEL, too, makes it trivially easy to classify at scale, which means two teams can independently produce incompatible datasets using different definitions and never notice, because the outputs look clean and numeric either way. The tool returns confident scores regardless of whether the upstream definitional work was done.

<svg viewBox="0 0 600 370" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;margin:1.5rem auto;display:block;font-family:'Roboto Slab',Georgia,serif;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D2691E"/>
    </marker>
  </defs>
  <rect x="120" y="10" width="280" height="54" rx="4" fill="none" stroke="#D2691E" stroke-width="1.5"/>
  <text x="260" y="30" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">logistics</text>
  <text x="260" y="48" text-anchor="middle" font-size="11" fill="#5C5C5C">definitional alignment</text>
  <rect x="120" y="74" width="280" height="54" rx="4" fill="none" stroke="#D2691E" stroke-width="1.5"/>
  <text x="260" y="94" text-anchor="middle" font-size="13" fill="#2D2D2D" font-weight="700">data</text>
  <text x="260" y="112" text-anchor="middle" font-size="11" fill="#5C5C5C">proxy validity</text>
  <rect x="120" y="138" width="280" height="54" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="260" y="158" text-anchor="middle" font-size="13" fill="#5C5C5C" font-weight="700">methodology</text>
  <text x="260" y="176" text-anchor="middle" font-size="11" fill="#5C5C5C">largely solved by LLMs</text>
  <line x1="420" y1="165" x2="420" y2="37" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="432" y="105" font-size="10" fill="#D2691E" font-style="italic">where the</text>
  <text x="432" y="117" font-size="10" fill="#D2691E" font-style="italic">work is</text>
  <rect x="140" y="228" width="120" height="44" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="200" y="247" text-anchor="middle" font-size="11" fill="#2D2D2D" font-weight="700">team A</text>
  <text x="200" y="263" text-anchor="middle" font-size="10" fill="#5C5C5C">definition X</text>
  <rect x="280" y="228" width="120" height="44" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="340" y="247" text-anchor="middle" font-size="11" fill="#2D2D2D" font-weight="700">team B</text>
  <text x="340" y="263" text-anchor="middle" font-size="10" fill="#5C5C5C">definition Y</text>
  <line x1="200" y1="272" x2="240" y2="305" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="340" y1="272" x2="300" y2="305" stroke="#D2691E" stroke-width="1.5" marker-end="url(#arrow)"/>
  <rect x="210" y="305" width="120" height="44" rx="4" fill="none" stroke="#E8E4DF" stroke-width="1.5"/>
  <text x="270" y="324" text-anchor="middle" font-size="11" fill="#2D2D2D" font-weight="700">same tool</text>
  <text x="270" y="340" text-anchor="middle" font-size="10" fill="#5C5C5C">clean, numeric outputs</text>
  <line x1="240" y1="349" x2="200" y2="362" stroke="#D2691E" stroke-width="1.5"/>
  <line x1="300" y1="349" x2="340" y2="362" stroke="#D2691E" stroke-width="1.5"/>
  <text x="180" y="362" text-anchor="middle" font-size="10" fill="#D2691E" font-style="italic">result A</text>
  <text x="360" y="362" text-anchor="middle" font-size="10" fill="#D2691E" font-style="italic">result B</text>
</svg>

This also means there are always more classes than you think. If you have eight sectors you want to classify firms into, you actually have ten: the eight sectors, plus "insufficient information to classify" and "doesn't fit any of these categories." When you're classifying the whole economy into strategic sectors, you're going to find that most firms don't fit cleanly into any of them, or there isn't enough data to make the call. Understanding the dynamics between what fits your definitions and what doesn't is itself a significant piece of analytical work.

## the real risk

I think the risk with tools like GABRIEL or The Data City isn't that their inaccurate. It's that these tools make it easier to skip the data validity and definitional alignment steps, because the methodology layer looks solved and the outputs look authoritative regardless of whether the upstream problems were addressed. The paper's own applications illustrate this. It defines "moral universalism" as a construct, rates 140 years of congressional speeches on it, and interprets the time series as evidence about partisan polarisation. But "moral universalism" isn't a pre-validated construct. It's an attribute the authors invented for the exercise. The validation work in the paper shows GPT can replicate existing human-coded labels on established measures. That tells you nothing about whether GPT's ratings of a novel construct track a real phenomenon.

I certainly don't think message is "don't use LLMs for classification." They're very good at it and you should. The message is that methodology is the least binding constraint, and tools that make methodology effortless can make people forget that the hard work is often somewhere else.
