---
title: "How I Got the AI to Stop Forgetting Who I Am"
description: "The actual architecture — the knowledge base layer underneath everything"
pubDate: 2026-06-15
updatedDate: 2026-06-17
publish: true
---

A while back I [posted](https://www.linkedin.com/posts/activity-7437946247543611394-mDiy) about asking Claude to comb through months of our conversation history and hand me an honest scorecard of how I work — strengths, blind spots, the patterns I'd stopped noticing. It was uncomfortably accurate, and a few people asked how to do it. So let me square that with what follows, because at a glance they look like a contradiction: if the AI already knows me that well, why build a memory system at all?

Because the model itself remembers nothing. Every LLM conversation starts from scratch; the ones that "remember" you are running a layer *outside* the model that keeps state and feeds it back — a database, a file, a product's history feature. Claude knowing me from months of history is exactly that last case: a memory layer the product bolts on. Genuinely useful — and rented. It lives inside one tool, as one ever-growing thread. Open a fresh project, switch to a different tool, or hand a task to an agent on another machine, and that intimacy is gone. And even where it persists, it's the wrong shape: a sprawl of everything I've ever said, not a clean read on where a given project stands today. Great for a once-a-year self-assessment; useless for "pick up exactly where we left off on Tuesday."

So the real question isn't whether to have that memory — it's whether you rent it from one product or own it yourself, portably, across every tool you use. This piece is about owning it.

For a while I rented. I'd open a conversation, re-explain my situation, the constraints, what I'd tried — then ask. Session ended, gone; next session, repeat. It felt like briefing someone who forgot me overnight. This is an organizational problem with a technical solution, and the organizational side is the harder one.

A note before I go further: almost none of what follows is original to me. The layered structure is the personal-knowledge-management idea — the "second brain" and progressive-summarization work (Tiago Forte), on the older Zettelkasten lineage — pointed at an AI instead of at myself. Loading the right context instead of everything is what Andrej Karpathy and others started calling *context engineering* in 2025. The entry-file convention I get to below is borrowed straight from the coding-agent world. What's mine is the assembly: fitting these together into something that survives how I actually work. Sources at the end.

---

### Why buying something doesn't fix it

There are platforms that sell AI "memory." Some of them work reasonably well for limited cases. None of them solve the problem in full, for a simple reason: **the context the AI needs is yours, and you're the only one who can organize it.**

A platform can store your conversations. What it can't do is know which parts of your work matter, how they relate to each other, what the current state of an ongoing project is, or which pieces of old context are still accurate and which are stale. That judgment is yours. The tool can hold the context once you've organized it; it can't organize it for you.

This is the part nobody selling an AI-memory product will say out loud, because it doesn't sell: the hard 80% of the work is yours no matter which tool you buy.

The implication is uncomfortable: you have to do the work. But the upside is also real — once the work is done, it's done. You own it, it's portable, and it works with any AI tool that can read files.

---

### How the context actually accumulates

An agent's knowledge comes from two very different places, and most people lean entirely on the wrong one.

The first is **the model's own context — what it's holding in the moment.** Inside a single session, the model carries everything in its context window: the conversation so far, whatever you've loaded, its own reasoning. This is real, and powerful, and gone the instant you close the tab. The model didn't learn anything — it just had a lot in working memory for a while. It's the whiteboard in a meeting room: invaluable during the meeting, wiped before the next one.

The second is **the memory you keep outside the model — what survives between sessions.** This usually comes in two tiers. There's a **project-scoped memory file**: the orientation file most agent tools now read on startup — Claude reads a `CLAUDE.md`, and the cross-tool open convention is `AGENTS.md`. And there's the **larger store of notes, state, and decisions** that grows as you work. The memory file is where most people stop; the store is where the value actually lives. (More on that file, and why it's the load-bearing one, below.)

Here's the dimension that's easy to miss, and it's the whole game: **the model's context resets to zero every session, but the persistent layer only moves in one direction — it accumulates.** Each session, the agent boots from the files, does the work in its temporary context, and the durable conclusions get written back. The next session starts from a slightly richer base than the last. The model never gets smarter about you. The files do — one session's residue at a time.

That's why a setup like this compounds. A few weeks in, an agent that started clueless about your work is genuinely sharp about it — and you didn't upgrade the model to get there. You let the persistent layer deepen. The model is the engine; the files are the odometer.

The mistake almost everyone makes is treating that one memory file as the whole answer: write a `CLAUDE.md`, pour everything into it, call it solved. Two things go wrong. It's stale by Tuesday — because you've mixed *orientation* (how this project works, which rarely changes) with *state* (where the project is right now, which changes hourly). And it doesn't scale past a single project. The fix is to keep those two jobs apart: a small, stable file for orientation, and a structured store for state that you actually keep current. Which is exactly what the next section is about.

---

### The architecture: three layers, different rules

Here's what I ended up building. It has three layers, and keeping them separate is the thing that makes it work over time.

---

**Layer 1: Raw sources — add-only, never edit**

This is everything that came from outside: chat exports, meeting transcripts, articles, documents, notes from a call. Whatever landed, in its original form.

The rule is simple: **you never edit these.** If an original source needs correcting, you correct your understanding of it in layer 2 — not the source itself.

This sounds pedantic. It turns out to matter a lot. Layer 1 being truly immutable means you always have the original record. When you're six months in and something feels off, you can trace back to what you actually said, what the original document actually said, before you processed it. That's the audit trail. It takes zero effort to maintain as long as you never touch layer 1.

**What goes here in practice:**
- Exported Claude or ChatGPT conversations (HTML or plain text export)
- Meeting transcripts (if you record calls and transcribe them)
- Clipped articles and research
- Any document handed to you from outside that you need to reason about

**Naming:** `YYYY-MM-DD_topic-slug.md` — date-prefixed, sorted automatically.

---

**Layer 2: Synthesized working memory — mutable, git-versioned**

This is where you actually work. Take the raw inputs, distill them, extract the current truth, and maintain it as facts change.

This layer is deliberately mutable. When a project changes state, you update the relevant layer 2 file. When something you believed turns out to be wrong, you correct it. Git keeps the history; you don't need to maintain it manually.

The most important document in this layer is what I call an **anchor** — a short ground-truth statement of a project or context's current state. Not what it was, not the full history — where things actually stand right now. When the AI reads your context, it reads the anchor first. Everything else is detail.

**What goes here in practice:**
- Current-state summaries per project ("here's where this stands today")
- Extracted decisions from multiple chats ("from all the discussions about X, here's what we've actually decided")
- Briefings and working notes — intermediate documents that aren't the final word but are more useful than raw input
- State snapshots from agent runs

**The key discipline:** when facts change, update the layer 2 document. Don't leave stale state sitting next to the current state hoping you'll remember which is which.

---

**Layer 3: The compounding knowledge base — curated, linked**

This is where understanding graduates. Wiki pages per project, cross-links between related things, formal decision records, concept pages for things that keep coming up.

Layer 3 is slower to build and longer-lived. You don't add to it every day. But it's where the real value compounds — because over time, a well-linked layer 3 means you (and the AI) can navigate between projects and topics by following connections, not by searching.

**What goes here in practice:**
- A page per ongoing project with all the key context
- People pages for important contacts (their role, history, what matters to them)
- Concept pages for recurring ideas, frameworks, or tools
- Decision records — formally captured choices with the reasoning, so you can look back later and understand why you did it, not just what you did

**The discipline here:** frontmatter on every page (`updated:` date, `type:`, relevant tags), and wikilinks between related pages. The linking is what makes it navigable. A perfectly-written page that nobody links to is an orphan.

---

### What the AI actually reads

Here's how this works in practice. When I start a session to work on a specific project, I load:

1. **The entry file** (what the vault is, how it works, the conventions — a single `AGENTS.md` at the root that orients any agent; more on this just below)
2. **The relevant project's layer 2 anchor** (current state — where things stand right now)
3. **Any specific layer 3 pages** relevant to today's work

That's usually three documents. The AI has enough to work from. It knows the project history, the current state, the relevant decisions, and the conventions. Session by session, the state in layer 2 gets updated as things change. Layer 3 grows more slowly but more permanently.

The key insight: **you don't need the AI to read everything. You need it to read the right things.**

---

### The bridge: one file every agent reads first

There's one document that ties the folder of files to an agent actually using it well, and it sits at the root: `AGENTS.md`.

Instead of re-explaining the system at the start of every session, you write the orientation down once — what the vault is, where each project's current state lives, the conventions, what an agent may touch and what it must never touch — and every agent reads it first. This isn't a convention I invented. In the coding-agent world it has converged into an open standard: a root `AGENTS.md`, now read by most agents and tools (Claude has its own `CLAUDE.md` for the same job; you can point it at the shared file in one line). *One file, every agent.* Here it does the same thing for a knowledge vault instead of a codebase.

A starter you can drop in at the root:

```markdown
# AGENTS.md — read this first

You're working inside my context vault: a folder of Markdown files that holds what
I'm working on. Orient yourself here before doing anything.

## What this is — three layers, different rules
- 01-sources/      raw inputs — never edit
- 02-synthesized/  working memory: anchors (current state) + summaries — edit freely
- 10-<domain>/     the wiki: durable pages, decisions, concepts

## How to start any task
1. Find the project's anchor in 02-synthesized/ and read it first — that's the current state.
2. Read only the wiki pages relevant to the task. You don't need everything.
3. If anything I ask contradicts the anchor, flag it instead of guessing.

## Conventions
- Files: <topic>-YYYY-MM-DD.md. The `updated:` field tells you if a file is still current.
- Paths are ~/-relative. Decisions live in _meta/decisions/ as ADR-00N-*.md.

## Boundaries
- Never edit anything in 01-sources/.
- Don't invent state — if the anchor doesn't say it, it isn't decided.
```

The moment this file exists, you stop being the integration layer. The agent self-orients; you hand it the task. And — this is the part that turns out to matter most — because the orientation lives in a file rather than in your head, *any* agent can boot from it. Hold that thought; it comes back at the end.

---

### Example: what a project context load looks like

Here's a real example of the kind of thing I paste or load at the start of a session (this is the structure; the specific details below are illustrative):

```markdown
# Context: [Project Name]

## Current state (as of 2026-06-15)
- Phase: active development, working on [specific area]
- Status: [two lines on where things actually stand]
- Blockers: [anything in the way]

## What's been decided
- [Decision A]: [the conclusion, one line] (see ADR-003 for full reasoning)
- [Decision B]: [the conclusion, one line]

## What's NOT yet decided
- [Open question A]
- [Open question B]

## Important context the AI needs
- [Constraint or constraint: e.g. this must work offline]
- [Constraint: e.g. the auth system uses X, not Y]
```

It's mundane, deliberately so. The AI doesn't need a well-written document. It needs accurate state. Prose style is secondary to "is this actually current."

---

### The prompt patterns that matter

The vault is where the information lives. The prompts are how you load and use it.

A few patterns that took longer to learn than they should have:

**The session opener:** don't ask a question first and hope the AI asks for context. Tell it the context, then ask the question. "Here's the project, here's the current state, here's what we've decided, here's today's specific goal — now, can you help me with X?" Every good session starts this way.

**The state update:** at the end of a session where something changed, update the anchor. One sentence is enough: "Status changed from [X] to [Y] as of today." That's the artifact. The session summary in memsearch captures the how; the anchor captures the what.

**The explicit load:** for the AI to actually *use* your context, it needs to be in the same session — either as an uploaded file, as project knowledge (if your tool supports it), or pasted directly. Pointing to "a document that exists somewhere" doesn't work. The document has to be present.

---

### Why tool-independence matters more than it sounds

The vault is just files. Plain text Markdown. They sync with whatever syncs files — git, Syncthing, Dropbox, or all three. The AI that reads them can be anything with file access.

This matters because the AI landscape is still in flux. Models improve fast. Tools come and go. If your knowledge base requires a specific platform, you're betting on that platform's longevity and on staying within its constraints. If it's files, you move between tools freely. You point the new model at the same folder.

A year ago I was using a different set of tools than I am today. The folder is the same folder. Everything I learned, every decision I recorded, every piece of context I built up — still there. That's the bet worth making.

It's the same instinct I keep coming back to. A [trip planner I shared a while back](https://www.linkedin.com/posts/activity-7455675924269670400-xYff) is just a YAML file and one self-contained HTML page — no accounts, no API keys, nothing to log into. Different problem, same bet: plain files you own outlast the tool that made them.

And it goes further than swapping models. Remember the `AGENTS.md` at the root — the entry file every agent reads first? Because the orientation lives in a file an open ecosystem of agents already understands, the same vault can be read by a different model, a different framework, or an agent running on an entirely different machine. They all boot from the same file and pick up the same context. That's the quiet unlock: the day you want to hand a task to a second agent — or run one on an always-on box while you work on your laptop — you don't build anything new. The substrate is already there. Dispatching work across agents and machines is a whole piece on its own, and it's coming; it only works because the foundation got laid here, in plain files with a shared entry point.

---

### The question I didn't plan to ask

When I had this system running, I ran into a question I hadn't anticipated.

The AI remembers across all my projects now. That's the point. But I work on enough distinct things that the question "should the AI working on Project A be able to read Project B's context?" started to feel less theoretical.

For most people, this is a low-stakes question — one person, one machine, a handful of projects. The real risk is accidental context-bleed: you're working on one thing and the AI helpfully reaches for context from a completely different project because it happened to be loaded.

For someone managing clients with NDAs, or separating work from personal projects, or running distinct ventures with different confidentiality needs — it matters more.

I caught a gap in my own design around this. The tools (which MCP servers each project can access) were isolated. The data (which vault context the AI could read in a session) was resting on convention, not a boundary. I'll write about how I'm thinking about that in a later piece — because the answer is more nuanced than "add a wall." The right-sized fix depends on who your actual threat model is. On a single-user machine where you're the only one who can write to the vault, the threat model is mostly accidental bleed, not exfiltration. Those call for different controls.

This is a preview of what's coming. I'm planting it here deliberately because the question is latent in the setup: once you build a system that remembers everything, the interesting question shifts from "how do I get it to remember?" to "should it know all of it all the time?"

---

### The free resource: the structure I actually use

The folder structure, the naming conventions, the frontmatter fields, the anchor format, the prompts I use to load context at session start — all of it is packaged as a free download for newsletter subscribers.

It's not a product. It's the specific artifact the newsletter edition references. If you find the architecture above useful and you'd rather start from a working example than build from scratch, that's what it is.

Subscribe to the newsletter and reply "send it" to this edition. I'll send the structure.

---

### Quick summary of the architecture

For the skimmers:

| Layer | What it holds | Mutability rule |
|---|---|---|
| **1 · Raw** | Original inputs: chats, transcripts, articles | Add-only, never edit |
| **2 · Synthesized** | Working memory: anchors, summaries, state | Mutable — update when facts change |
| **3 · Wiki** | Compounding knowledge: pages, decisions, links | Curated — builds over time |

**The prompts that matter:** session opener (context first, then question), state update (one sentence at session end), explicit load (the document has to be present, not referenced).

**The portability principle:** files sync for free, any AI that can read files can use them, no platform lock-in.

**The question to ask yourself once it's built:** should the AI working on project A be able to read project B's context? The answer isn't always "no" — but you should answer it deliberately.

---

### Credits & sources

None of the building blocks here are mine; the assembly is. Where they come from:

- **The layered structure** — personal knowledge management pointed at an AI: the *second brain* / progressive-summarization idea (Tiago Forte) and the older Zettelkasten lineage (Niklas Luhmann).
- **"Load the right context, not all of it"** — what Andrej Karpathy and others started calling *context engineering* in 2025.
- **The single entry file** — the `AGENTS.md` / `CLAUDE.md` convention from the coding-agent world; `AGENTS.md` is now an open standard read by most agent tools.

The original part is fitting these to how I actually operate — which is also the part you can't copy. Steal the structure; build your own version.

---

If you've built something like this, I'm curious where your version differs from mine — what you keep in which layer, how you load it, what you got wrong the first time. And if you haven't yet: what's actually stopped you? The honest answer is usually "it felt like too much work" — which is exactly what I thought, right up until the afternoon I sat down and did it.

---

*Next piece: how I matched the tools to how I actually work — the topology decisions that turn a knowledge base into something that runs.*
