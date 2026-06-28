# Use Your Vault Anywhere — the cheat-sheet

You built a memory you own (plain files, in folders, no platform underneath). This is the one-page reference for *using* it — dropping the right slice into whatever AI tool you're in, today, with no special setup.

**The one rule above all the methods:** load the **slice that's relevant**, not your whole vault. The client you're on, the project you're in, the trip you're planning. The right corner makes the AI sharp; your whole life makes it noise.

---

## The three methods (in order of effort)

**1. Paste it** — copy the relevant page into the chat.
- Works in *every* tool that exists. Zero setup. Best for a one-off question where one page is enough.
- Tip: prepend one line — *"Use the context below as background; don't summarize it back to me."* — so the tool treats it as reference, not a task.

**2. Attach it to a project** — set it once, reuse it across every chat in that project.
- The set-once move. Best when you'll have many conversations about the same thing.
- The pattern is the same everywhere even though the menus differ: make a *project / workspace / custom GPT / space*, add your two-or-three relevant pages to its **knowledge / files**, done. Every new chat there already has the context.

**3. Point a tool at the folder** — let an editor or agent read the directory directly.
- Best for coding and agent work, where the tool can already see your filesystem.
- No pasting at all: aim it at the vault (or one folder of it) and `@`-mention or reference the pages you want.

---

## Where each method lives, by assistant

*(Menus move — these are the patterns, not promises. If a name changed, look for the nearest equivalent.)*

| Assistant | Paste | Attach (set-once) | Point at folder |
|---|---|---|---|
| **ChatGPT** | paste in chat | **Projects** → add files; or a **Custom GPT** with the pages as Knowledge | — (use file upload) |
| **Claude** | paste in chat | **Projects** → Project knowledge; or a Claude.ai connector to your files | Claude Code / desktop → point at the directory |
| **Gemini** | paste in chat | **Gems** with the pages as knowledge; or Drive-connected files | — |
| **Copilot / Cursor / editor AIs** | paste in chat | workspace context | **native** — open the folder, `@`-mention files |
| **A local model (Ollama, LM Studio, etc.)** | paste in chat | system prompt / context files | point the runner at the folder |

The point of owning plain files: you're never waiting on one vendor to support "memory." The lowest-tech method (paste) already works in all of them.

---

## What travels well — and what to trim before you send

**Travels well**
- **Markdown.** Every model reads it cleanly — headers, lists, links — no conversion.
- **Current-state pages** (where something stands *now*), short decision records, stable facts. The durable stuff.
- **One concern per file**, so you can hand over exactly the slice you need.

**Trim first**
- **Raw history** — months of chat logs. Load the *compiled* page, not the transcript it came from.
- **Anything stale** — if a page's "current state" is old, fix it before you rely on it.
- **Secrets** — API keys, tokens, account numbers should never have been in a vault page; double-check before you paste into a tool you don't control.
- **The whole vault.** Again: the slice, not the life.

---

## A loader line you can keep

When pasting, this framing makes most tools use the context the way you want:

> *Below is my own background context for this. Treat it as reference you can draw on — don't summarize it back to me, just use it. Here it is:*
>
> *[paste the relevant page]*

---

*Companion to the Load-Bearing edition "Use It Anywhere." Free — copy, adapt, share. It's a working tool, not a product.*
