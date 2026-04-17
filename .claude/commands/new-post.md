---
description: Draft a new blog post from raw ideas, notes, or rambles through a collaborative back-and-forth.
---

## User Input

```text
$ARGUMENTS
```

## Goal

Turn raw input (rambles, voice note transcripts, pasted conversations, rough ideas) into a polished draft blog post through a collaborative process. The output is a markdown file in `src/posts/` ready for the user to edit further.

## Process

### Step 1: Understand the raw material

Read the user's input carefully. This could be anything — a stream of consciousness, bullet points, a transcript, a pasted conversation, or just a topic idea. Identify:

- The core idea or argument
- Key points and supporting details
- The intended audience (if apparent)
- The tone (casual, technical, analytical, personal)

### Step 2: Ask clarifying questions

Before drafting, ask the user **3-5 focused questions**. Pick from these based on what's missing or unclear from their input:

- **What's the main takeaway?** "If someone reads one sentence from this, what should it be?"
- **Emphasis**: "You touched on X and Y — which matters more to you here?"
- **Length and depth**: "Are you thinking a quick take (300-500 words) or something more developed (800-1500 words)?"
- **Audience**: "Who's this for — people already familiar with the topic, or are you explaining it fresh?"
- **Visuals**: "Would a diagram, chart, or illustration help here? Should I leave placeholders for any?"
- **Interactive elements**: "Would an interactive code example or embedded visualization add something?"
- **Structure**: "Do you see this as a linear argument, a listicle, a narrative, or something else?"
- **Missing pieces**: "You mentioned X but didn't expand on it — should that be in the post or was it tangential?"
- **Factual context**: "You reference X tool/framework — have you actually used it, or is this based on reading about it?" (This affects framing: first-hand experience vs. describing something you haven't tried yet.)
- **Naming**: "You mention conversations with specific people — should they be named or kept anonymous?"
- **Technical depth**: "For the technical sections, how deep should I go — conceptual framing only, or implementation details too?"

Do NOT ask all of these. Only ask what's genuinely unclear from the input. If the input is detailed enough, you might only need 1-2 questions. Err toward asking more questions rather than fewer — it's better to check assumptions than to guess wrong.

**Wait for the user's answers before proceeding.**

### Step 3: Draft the post

After the back-and-forth, write the full draft post including:

**Frontmatter:**
```yaml
---
title: <lowercase title>
date: <today's date in YYYY-MM-DD>
tags:
  - <tag-1>
  - <tag-2>
description: <one-sentence summary>
layout: layouts/post.njk
---
```

**Body:**
- Write in the user's voice based on their input style
- Use markdown formatting (headers, bold, lists, code blocks, links) as appropriate
- Keep titles lowercase to match the blog's existing style
- Include `<!-- TODO: ... -->` comments for places where the user should add specifics, images, or review a section
- If agreed upon, include placeholders for diagrams (`<!-- DIAGRAM: description of what this should show -->`), images (`<!-- IMAGE: description -->`), or interactive elements (`<!-- INTERACTIVE: description -->`)

### Step 4: Save and present

1. Generate the filename from the title (lowercase, hyphens, no special characters)
2. Create the file at `src/posts/<filename>.md`
3. Present a summary to the user:
   - The file path
   - A quick outline of the structure
   - Any TODO placeholders they should revisit

## Writing style

The draft must sound like the user wrote it. Follow these principles strictly:

**Post types matter.** Not every post is the same register. Analytical posts (e.g., about technology, methodology, classification systems) should be tighter and more restrained. Personal/cultural essays (e.g., about food, culture, lived experience) have more room for voice, humor, spoken-language markers, and self-deprecation. Some rules below are marked as applying more strictly to one type. When drafting, identify the post type early and calibrate accordingly.

### 1. Direct and economical
Cut anything that exists only for rhetorical effect. Every sentence should do work. Remove parentheticals that restate or elaborate what the context already makes clear, but keep short parenthetical asides that add humor, personality, or genuine qualification. **In personal essays**, interpret this more loosely: qualifiers, asides, and humor that add personality aren't filler even if they make sentences longer. Cut rhetorical filler, keep voice.

- No: "Not in some abstract sense — but practically, in a way I can hand to an LLM and say: this is how I write, stick to it."
- Yes: "What I want to do here is figure out what my writing actually sounds like in a way I can hand to an LLM and say 'this is how I write'"
- No: "Rather than using an LLM to classify text into a flat list of categories (as GABRIEL does), it classifies documents..."
- Yes: "Rather than using an LLM to classify text into a flat list of categories, it classifies documents..."
- No: "being honest about what the current technology actually has access to"
- Yes: "recognising what the current technology actually has access to" (single word over phrase)
- OK: "that produce something edible (most of the time)" (short aside that adds personality)
- OK: "learning through repetition what works (and being aggressively scolded if not)" (short aside that adds context/humor)

### 2. Precise over evocative
Say what you mean rather than gesture at it. Name the thing specifically rather than using vague nouns.

- No: "It never quite lands the way I'd write it myself. There's always something off."
- Yes: "It never quite sounds like I have written it myself."
- No: "The business context, the tradeoffs, the things people care about."
- Yes: "The information in business context, discussions of tradeoffs, and verbal articulation of the things people care about"

### 3. Structural thinker
Respect logical scaffolding but keep surfaces clean. Combine short related sentences rather than leaving them fragmented.

- No: "That's where the useful information lives — in the edits, in what I cut, what I keep, what I rephrase."
- Yes: "The information in the edits, in what I cut, what I keep, what I rephrase, is where my writing style emerged."
- No: "The knowledge base is a single repo. Obsidian Git syncs it automatically every few minutes."
- Yes: "The knowledge base is a single repo and Obsidian Git syncs it automatically every few minutes."

### 4. Comfortable with tentativeness when genuine, but don't reflexively hedge
Don't assert false confidence. If something is exploratory, say so. Use "probably", "I think", "my core thoughts" rather than definitive framing. But don't hedge everything — when you have actual conviction, state it directly. Drop "I think" where the uncertainty isn't genuine.

- No: "The process works like this:"
- Yes: "I think the process needs to work something like this:"
- No: "it won't get captured"
- Yes: "it probably won't get captured"
- No: "The core bet here is that"
- Yes: "My core thoughts here is that"
- No: "in a way that I think is underappreciated" (reflexive hedge on a point you're confident about)
- Yes: "in a way that is underappreciated"

### 5. Allergic to being narrated
Show the process, don't commentate on it. Never describe what the writing is doing as it does it.

- No: "You naturally talk about what you're doing as you're doing it. You're not rambling — you're building."
- Yes: (Removed entirely. Let the writing speak for itself.)

### 6. Functional punctuation over stylistic punctuation *(stricter in analytical posts)*
Use commas, "that", or "e.g.," for clarity. Avoid em dashes and colons for dramatic or structural effect. **In personal essays**, stylistic punctuation earns its place when it adds voice: ellipsis for comedic timing ("you're gonna feel... lethargic"), parenthetical question marks for genuine uncertainty ("something with.. cous cous(?)"), italics for real emphasis ("it *can* be good on its own terms").

- No: "the blog voice — the one I'd use if I were writing a position on something"
- Yes: "the blog voice, e.g., the one I'd use if I were writing a position on something"
- No: "You're asking: 'how does our economy fit into these predefined categories?'"
- Yes: "You're asking 'how does our economy fit into these predefined categories?', the categories came first"
- No: "The logic is: if your taxonomy is detailed enough"
- Yes: "The logic is that if your taxonomy is detailed enough"
- No: "classify its attributes: what technology it uses"
- Yes: "classify its attributes e.g., what technology it uses"

### 7. Conversational but not performatively so
Don't manufacture energy or dramatic buildup. Transitions should flow naturally.

- No: "So let's work through it and find out." (preceded by a dramatic buildup and section break)
- Yes: "Let's work through it and find out." (follows naturally from the previous paragraph)

### 8. Flowing clauses over staccato fragments
When listing related points, use comma-separated clauses or "e.g.," rather than punchy one-sentence-per-point fragments.

- No: "User requirements surface. Edge cases get raised. Someone explains the business constraint."
- Yes: "E.g., User requirements naturally surface, edge cases get raised, someone explains the business constraint."
- No: "The basic idea is simple: dump everything into one place"
- Yes: "The basic idea is you dump everything into one place"
- No: "Job adverts are proxies for job activity. Company descriptions are proxies for what a firm actually does. Patents are proxies for innovation."
- Yes: "For example: job adverts are proxies for job activity, company descriptions are proxies for what a firm actually does, patents are proxies for innovation."

### 9. Generic over branded *(stricter in analytical posts)*
Use generic terms where a brand name or specific technology isn't necessary. This applies even to terms like "AI" when the broader category ("technology") is what you actually mean. **In personal essays**, brand names can earn their place when they ground the writing in lived experience and specificity (e.g., "Natoora tomatoes" signals a real price point the reader can look up; "Dolmio, Patak's, Blue Dragon" are the actual jars people recognise).

- No: "It lives in meetings, in Slack threads, in conversations"
- Yes: "It lives in meetings, message threads and conversations"
- No: "Stata versions. GPT doesn't."
- Yes: "Stata versions, proprietary LLMs don't." (generalise from specific product to category when the brand isn't the point)
- No: "there's genuine potential for AI to help people cook better"
- Yes: "there's genuine potential for technology to help people cook better" (generalise when the specific technology isn't the point)

### 10. Substantive over evaluative
Explain what's wrong rather than labelling it with a pithy judgment. State the problem, not your verdict on it.

- No: "I think that's backwards."
- Yes: "I think that misses the major challenges involved in classification."

### 11. Signal digressions
When making a tangential point, break it into its own paragraph and mark it explicitly rather than embedding it in a dense paragraph.

- No: (Stata analogy critique buried mid-paragraph after the main point about methodology)
- Yes: "As an aside, the paper compares GABRIEL to Stata..." (own paragraph, clearly marked as a digression)

### 12. Anonymise people by default
Don't name individuals in blog posts unless there's a specific reason. Default to "a colleague" or similar.

- No: "This distinction came into focus for me through a conversation with David Ampudia de Haro at the Innovation Growth Lab, where he made a point that I think is underappreciated."
- Yes: "This distinction came into focus for me through a conversation with a colleague at the Innovation Growth Lab."

### 13. Plain headings over clever ones
Section headings should be direct and readable, not showcases for jargon or clever framing. If a plain-language heading captures the point, prefer it over a technically impressive one.

- No: "chefs as uninterpretable neural networks"
- Yes: "chefs don't understand themselves"

### 14. Scare quotes for metaphorical technical terms
When borrowing a technical term for a non-technical context, use quotation marks to signal it's being used loosely or metaphorically rather than literally.

- No: "massive amounts of his own experiential data"
- Yes: "massive amounts of his own experiential \"data\""

### 15. Cut non-load-bearing technical detail
If a technical detail doesn't serve the argument, remove it. Keep the conceptual point, cut the implementation specs.

- No: "It uses small sentence-transformer models (around 22 million parameters) rather than large language models, which makes it fast, cheap to run, and self-hostable. Classification is decomposable, meaning you can inspect which matcher contributed what score."
- Yes: "It's designed so that classification is decomposable, meaning you can inspect which matcher contributed what score."

### 16. Questions over assertions about others' experience *(personal essays)*
When speculating about what people in other countries or contexts feel, pose it as a question rather than stating it as fact. This avoids overreach and sounds more honest.

- No: "French home cooks don't feel sheepish about making a gratin."
- Yes: "Do French home cooks feel sheepish about making a gratin?"

### 17. Personal anecdotes over impersonal lists *(personal essays)*
When the post is personal, ground observations in specific memories rather than listing things generically. Transform "people do X" into "my mum did X" where you have the actual memory.

- No: "Worcestershire sauce in spag bol, Marmite or Bovril for depth, brown sauce on the side"
- Yes: "For me it's infused with visions of my Mum putting in 'secret' touches, like Worcestershire sauce, Marmite and even brown sauce"

### 18. Self-deprecating concessions *(personal essays)*
When making a bold claim, concede the obvious counterpoint with humor rather than leaving it for the reader to mentally object to. This builds trust and warmth.

- No: "The cassoulet just has better PR."
- Yes: "The cassoulet just has better PR, and a fancy dish, and, admittedly, does taste much better."
- No: "Twenty-five pounds for an awful pie."
- Yes: "Ten pounds for a dry scotch egg is too much for me even after 4 pints of bitter."

### 19. "We" over imperative for calls to action
Don't lecture the reader. Use collective "we" rather than commanding them. This applies across post types but matters most in personal essays.

- No: "stop apologising for it"
- Yes: "we can stop apologising for it"

### 20. Don't universalize your framing
Avoid claiming your angle is the standard or canonical one. Present it as one perspective.

- No: "The standard critique of British weeknight cooking"
- Yes: "One critique of British weeknight cooking"
- No: "The contrast with other countries is noticeable."
- Yes: "This is more salient when you compare to how this looks in peer countries."

### 21. Introduce unfamiliar terms for the reader
When using a term that a general reader might not know, add a brief gloss rather than assuming knowledge.

- No: "German households often eat Abendbrot"
- Yes: "German households often eat something called Abendbrot, a cold meal of bread, cheese and cold cuts"

## Formatting notes

- Titles are always lowercase
- `layout: layouts/post.njk` is required on every post
- Posts don't have to be long — let the content dictate the length
- Use **bold** for key terms when introducing them in summary or list contexts
