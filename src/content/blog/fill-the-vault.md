---
title: "How I Filled the AI's Memory With Knowledge I Already Had"
description: "The extract-and-compile workflow that turns scattered history into a vault"
pubDate: 2026-06-17
updatedDate: 2026-06-18
publish: false
---

A while back I [posted](https://www.linkedin.com/posts/activity-7437946247543611394-mDiy) about asking Claude to comb my whole history and hand me an honest scorecard of how I work. Last edition I shared the structure underneath my AI's memory — a three-layer folder you own instead of a product you rent. This piece connects the two, because the scorecard was a preview of the move that fills the whole thing: mining knowledge that already exists.

> New here? This is part two. Start with **[Edition 1 — The Foundation](/blog/the-foundation)**: it's the structure this piece fills. Then come back.

The most common reply to the last edition was the obvious one: *empty shelves don't do anything — how do I get my actual knowledge in there?* Fair. That's the messy, hard half — the real work that rarely gets shown. Don't worry, I've got you.

Here's the reframe that made it tractable for me: **you don't have a knowledge problem, you have an extraction problem.** The context your AI needs already exists. It's just trapped — scattered across months of chats, half-written docs in folders you forgot about, READMEs and commit history in your repos, a decision you made in some conversation back in spring and never wrote down. You're not authoring it from scratch. You're freeing it.

And the scorecard post is proof you've already done a version of it. Asking an AI to read months of history and surface what it found *is* extraction. The only thing wrong with it as a memory strategy is what happened next: it was a one-off report I read once and lost. Do the same move, but land the output in the vault, and it stops evaporating. It compounds.

### Why this is two steps, not one

The instinct is to point the AI at your history and say "put all this into my knowledge base." Don't. That's the single fastest way to ruin the knowledge base you're trying to build.

An AI mining months of messy, contradictory history *will* get things wrong. It'll conflate two projects that shared a vocabulary. It'll carry a fact that was true in March into a page dated today. It'll take something you were thinking out loud about and record it as a settled decision. Individually these are small. Collectively, dumped straight into your permanent memory, they're poison — because the whole value of the vault is that your AI can trust it. The first time it confidently tells you something false that it "remembers," you stop trusting all of it.

So the work splits into two moves, and the discipline is in keeping them apart:

1. **Extract** — mine one source into a *staging* file you review. Not the wiki.
2. **Compile** — turn the reviewed staging file into durable pages, and have the AI *propose* the decisions worth keeping rather than writing them silently.

The staging layer is a quarantine. Raw history goes in, structured-but-unverified knowledge comes out, you check it, and only what survives review reaches the wiki. It's the same discipline every data pipeline already uses: land raw, transform in a layer you can inspect, publish only what's checked.

![A vertical pipeline diagram: your existing chat history, folders, and repos flow through EXTRACT into a staging file; through a REVIEW gate where you read it and fix what's wrong; then COMPILE into durable wiki pages and ADRs; through an APPROVE gate where the AI proposes and you ratify — with a "keep it fed" loop at the bottom.](/blog/edition-02-diagram.png)

*The whole thing on one page: extract each source into a staging file you review, compile only what survives into durable pages, and approve every decision before it's recorded — then keep it fed, one source at a time.*

### Step 1: Extract — to staging, never to the wiki

Pick one source at a time. An exported chat history. A project folder. A repo. Resist the urge to feed everything at once — one source, reviewed, beats five sources blurred together.

What you ask the AI to pull out isn't a summary. It's structured signal:

- **Current state** — where this project actually stands now, reconciled against your anchor (the short, hand-maintained statement of current truth).
- **Decisions made** — each one with what was decided, when, why, and *what the alternatives were*. The alternatives are what separate a real decision from a fact.
- **Still open** — the questions that haven't been answered. Counted, so you know the surface area.
- **Contradictions** — where two sources disagree, stated plainly, with how the anchor resolves it.
- **Private context** — anything that belongs in your staging notes but must never graduate to a shareable wiki page.

A scrubbed slice of what an extraction looks like in practice (project names generic):

```markdown
## Decisions that have been made
D1. WHAT: Ship the v1 as a single self-contained file, no backend.
    WHEN: ~2026-04. WHY: zero-install demo matters more than multi-user.
    ALTERNATIVES: a hosted app (rejected — auth + hosting overhead for a demo).
D2. WHAT: Data model lives in YAML, rendering is a separate step.
    WHEN: ~2026-04. WHY: lets a human or an agent fill the data.
    ALTERNATIVES: hard-code the data in the template (rejected — not reusable).

## Contradictions found
- An early chat says "launch in May"; a later note says it slipped to "after the
  family trip." Anchor resolves to: target is now late June, not May.

## Still open  (total: 2)
- Whether to add example templates to the repo before or after announcing it.
- Whether the renderer should ship as a CLI or stay a manual step.
```

Then the AI stops and tells you, in chat, what it found — the decisions, the contradictions, the open-question count, anything that surprised it. **This is the review gate.** You read the staging file and fix what's wrong. The extraction is allowed to be long and a little messy; it's raw ore, not jewelry. Catching the AI's mistakes here is not a failure of the process — it *is* the process.

### Step 2: Compile — and make it ask permission

Once the extraction is clean, the AI turns it into wiki pages: properly frontmattered, cross-linked, specific (concrete details beat vague summaries), split if any page runs long. It carries forward the `(inferred)` marks so a conclusion never masquerades as something a source actually said.

And then the part that matters most. For the decisions, the AI doesn't write them — it *proposes* them:

```
PROPOSED ADR-007: Single-file v1, no backend — Sources: extraction D1. Create? [y/n]
PROPOSED ADR-008: YAML data model + separate renderer — Sources: extraction D2. Create? [y/n]
```

It proposes a record only for something that was genuinely decided, had real alternatives, and has documented rationale — not for trivially-true facts, and not for anything still on the open list. You answer "create 7, skip 8" — or whatever your judgment says — and only then do they become files.

This is the load-bearing habit of the whole system: **the AI proposes, you ratify.** A knowledge base that mints its own decisions is one you'll quietly stop trusting, because you'll never be sure which "decisions" you actually made and which the AI inferred on a Tuesday. Staying the editor is what keeps the vault yours.

### The rule that holds it all together

When sources disagree — and across months of history, they will constantly — your *current* statement of where things stand wins. The old chat said May; the anchor says late June; late June wins, and the conflict gets surfaced, not averaged away.

Three habits enforce it, and they're worth saying out loud because they're what make the difference between a knowledge base and a pile of plausible text:

- **Provenance on everything.** Every extraction cites its sources; every wiki page cites the extraction it came from. Any claim traces back to where it came from.
- **Inference is marked.** What the AI concluded rather than read is tagged `(inferred)`. You never confuse its guess with the record.
- **The anchor is authoritative.** It's the short, current-state truth you maintain by hand, and everything else gets checked against it.

### Keeping it fed

The import is one afternoon. The reason it's worth doing is that it keeps paying — which means it has to stay fed, and feeding it is a minute, not an afternoon.

- **A new source shows up** — a chat worth keeping, a doc, a decision made in passing. Extract just the *delta*, update the anchor's current state, bump its date. Compile only if durable knowledge changed. The one habit that keeps everything honest: at the end of any session where something changed, one line into the anchor — "we changed X today."
- **You start a new project** — spin up its corner and a fresh anchor (or let the Builder do the skeleton), then run the same extraction against whatever already exists for it.
- **Every so often** — a light review pass: stale anchors, orphaned pages, drift between an extraction and the page it produced, missing provenance. This is what stops slow rot.

The math that makes it all worth it: the first load is the work; after that you're just keeping current a thing that pays you back every single session.

### Where to point it first

Don't try to load everything. Pick the one project whose context you most wish your AI already had — the active one, the messy one — and load just that. Feel the difference in the next session, then do the next one. A half-loaded vault you actually use beats a complete one you built in a weekend and never fed again.

---

### The free resource: the loader I actually use

I packaged the whole workflow — the extraction prompt, the compile prompt, the propose-don't-mint discipline, and the keep-it-fed loops — into a single file you hand your AI. You point it at your sources; it stages, you review, it compiles, you approve. There's also a plain-English guide if you'd rather understand it before you run it.

It's not a product. It's the specific method this edition describes, written down so you can use it. Subscribe and reply "send it" to this edition, or grab it from the library next to the structure kit from last time.

---

### Credits & sources

None of the building blocks are mine; the assembly is.

- **Capture → distill → express** is the personal-knowledge-management loop — Tiago Forte's *second brain*, on the older progressive-summarization and Zettelkasten lineage. Extract-then-compile is that loop pointed at an AI instead of at you.
- **Decision records** — the ADR format (a decision, its context, its alternatives) — come from the software-architecture world (Michael Nygard).
- **Stage before you commit** is the discipline of every data pipeline: land raw, transform where you can inspect it, publish only what's checked.

What's mine is fitting them together for AI memory, plus the one rule that keeps it trustworthy: the AI proposes, you ratify.

---

If you've built something like this, I want to know where your version differs — what you stage, what you let the AI write directly, what it got wrong the first time you pointed it at your history. And if you haven't yet: what's the messiest pile of knowledge you've got? That's the first thing I'd load.

---

*Next piece: matching the tools to how you actually work — the topology decisions that turn a fed vault into something that runs on its own.*
