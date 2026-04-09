---
title: why language models can't cook
date: 2026-04-09
tags:
  - ai
  - food
  - llms
description: The training data for food is broken at source. The best culinary knowledge was never written down, and what exists online is mostly terrible.
layout: layouts/post.njk
---

Language models write decent poetry. Not great poetry, but if you ask one for a sonnet about loss, most people would read it and think "yeah, that's alright." This makes sense because the best poetry ever written is directly in the training data. Shakespeare, Dickinson, Neruda, the full text, available for the model to learn from. The ceiling of what exists in text is genuinely high.

Food is the opposite. The best culinary knowledge in the world was never written down. The recipes that produce the most memorable meals exist in the hands and intuitions of people who learned by doing, adjusting, tasting, and repeating over years. What LLMs actually train on is the written record of food, and I think that record is fundamentally broken.

## the training data is bad at source

Most recipes online are terrible. Not wrong exactly, but shallow. They'll give you ingredient lists and step sequences that produce something edible, and that's about where it ends. The recipe SEO economy has optimised for long preambles and ad placements rather than for actually teaching anyone to cook. Celebrity chef cookbooks optimise for a different but equally unhelpful thing, which is selling the book itself and the associated cookware, restaurants, and brand extensions that come with it.

The result is that the written record of food, the data that language models learn from, is dominated by instructions that are technically functional but don't encode any real understanding of what's happening or why. They're not principles-based. They describe a sequence of actions without explaining the mechanisms that make those actions work.

This matters because when an LLM generates a recipe, it's drawing on this same pool. The output will be approximately right in the way that most recipes are approximately right, which means it'll be mediocre in exactly the same ways.

## chefs as uninterpretable neural networks

Gordon Ramsay is very good at cooking. This isn't in question. But I think he's good at cooking primarily because of massive amounts of his own experiential data, thousands of iterations of testing things, tasting the results, and learning through repetition what works. He's essentially a neural network trained on sensory feedback that the rest of us don't have access to.

The problem is that when he tries to explain what he's doing, he often can't articulate the actual mechanism. He'll say "I'm doing this to make it crispy," but the reason it's crispy is something else entirely, some interaction of temperature, fat, moisture, or starch that he's triggering without consciously understanding why. He's learned the right actions through experience but can't decompose them into principles. In machine learning terms, he's mechanistically uninterpretable.

This isn't unique to Ramsay, but it's particularly visible with him because he's so aggressively instructional. Jamie Oliver has a version of the same problem, though I think his is compounded by the fact that his recipes are designed more to move books and branded pestle-and-mortars than to build genuine understanding. Both produce content that enters the training data, and in both cases the explanatory layer is either wrong or missing.

As an aside, you can see this play out at scale on something like Kitchen Nightmares, where Ramsay walks into restaurants with actual character and history, identifies some legitimate management problems, and then remakes the whole thing into something soulless and generic. The understanding of what makes food and dining experiences meaningful seems to be absent from his framework, even though his technical skill is undeniable.

The contrast I'd point to is someone like Marco Pierre White, who actually mentored Ramsay. White talks about food at a qualitative, almost romantic level, how a dish should feel, what you're trying to evoke, the relationship between the cook and the ingredients. That kind of contextual framing is much closer to what genuine culinary knowledge actually looks like, but it's also the kind of knowledge that resists being written down in recipe form. It's too situated, too dependent on feel.

## food is too contextual to generalise from text

Beyond the quality of recipes themselves, there's a deeper problem. The experience of food is so contextual and subjective that even perfect recipes wouldn't capture what matters.

Think about what makes a meal memorable. It's almost never just the food. It's who you're eating with, where you are, what time of year it is, what you've been doing that day. A bowl of simple pasta after a long walk through a coastal town is a completely different experience from the same pasta at home on a Tuesday evening. No amount of recipe accuracy captures that.

This extends to cultural food knowledge in a way that I think is underappreciated. Nobody has written in any real detail about why Mexican people love hot sauce on crisps, for example. To me that seems a bit much, but there's probably a deep cultural and historical understanding that frames that preference, an understanding you'd only arrive at by growing up in that context, talking to a lot of people, or doing genuinely immersive research. That data doesn't exist online. It's lived knowledge.

Restaurant recommendations have the same problem. The best places to eat are mostly not written about, and when they are, the writing rarely captures the actual experience. What makes a great meal out with family or friends is so dependent on mood, company, and circumstance that trying to algorithmically recommend it feels fundamentally misaligned with what you're actually trying to optimise for.

## what does work

I think the most useful contributions to food knowledge in written form are the ones that take a different approach entirely.

[Salt, Fat, Acid, Heat](https://www.saltfatacidheat.com/) by Samin Nosrat is principles-based. Rather than giving you a list of recipes to follow, it gives you a framework for understanding what's actually happening when you cook. Once you understand that salt enhances flavour, fat carries it, acid balances it, and heat transforms texture, you can reason about food rather than just executing instructions. That's a fundamentally different kind of knowledge, and it's the kind that transfers.

[The Food Lab](https://www.seriouseats.com/the-food-lab) by J. Kenji López-Alt takes a complementary approach, which is to scientifically test what actually happens. A lot of cooking is basically GCSE-level science, the Maillard reaction, starch gelatinisation, emulsification, but most recipes never explain the underlying processes. López-Alt does, and it changes how you think about cooking. For example, French technique insists you add warm milk to a béchamel gradually, stirring constantly to prevent lumps. But if you add cold milk all at once, the cold temperature stops the starches from coagulating immediately, the roux dissolves into the milk, and you can bring it back up to temperature smoothly. The traditional instruction works, but the explanation of *why* it works (or why the alternative also works) is what actually builds understanding.

These approaches encode the kind of knowledge that LLMs could genuinely benefit from, but they're a tiny fraction of what exists in the training data. The vast majority is the other stuff, the shallow, unexplained, often subtly wrong recipe content that dominates food writing online.

## where this leaves things

I think this is worth paying attention to because there's a growing assumption that LLMs can handle any domain where text exists. Food has a lot of text. It just happens that most of it is bad in ways that are hard to detect from the outside. The recipes are syntactically correct and semantically plausible, they just don't encode the knowledge that actually matters for cooking well.

I love cooking, and I think there's genuine potential for AI to help people cook better, to facilitate understanding, preserve creativity, and make the process of preparing food more enjoyable and more connected to the people and cultures it comes from. But I think you have to start by being honest about what the current technology actually has access to, and what it doesn't. The gap between written food knowledge and actual food knowledge is probably larger than in any other domain I can think of, and pretending that gap doesn't exist is how you end up with tools that make cooking worse rather than better.
