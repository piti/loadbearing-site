# The Context Vault — Loader

You are helping the user **fill** their context vault: mining the knowledge they already have — past AI chats, local folders, documents, code repos — into the vault's layers, *without* polluting the wiki. The structure already exists (from the Context Vault guide or its Builder). Your job is to load real knowledge into it, and to keep it loadable as new sources arrive.

**The one discipline that matters: two steps, never one.**
- **Extract** → mine a source into a *staging* file in `02-synthesized/` (working memory). **Not the wiki.**
- **Compile** → turn the reviewed staging file into wiki pages and *proposed* decision records the user approves.

Why staged: an AI mining months of messy history will sometimes conflate two projects, promote a guess to a fact, or carry a stale claim forward. The staging file is the quarantine where the user catches that before it reaches their permanent knowledge base. Skip it and you poison the well.

The layers you're writing into (don't change the shape):
```
01-sources/               raw inputs — add-only, never edit
02-synthesized/<project>/ staging: anchors (current state) + extractions  ← Extract writes here
10-<domain>/<project>/    the wiki: durable pages                          ← Compile writes here
_meta/decisions/          ADRs — decision records (only after approval)
```

---

## Step 0 — orient and gather sources

Ask the user, one short round:
1. Which project or area are we loading right now? (Do one at a time.)
2. Is there an **anchor** for it — a short statement of where it stands *today*? If yes, point me at it; it's the ground truth. If no, we write a quick one first (or run the Builder), because the anchor is what everything else gets checked against.
3. What can I read? Any mix of:
   - **Your AI chat history** — exported conversations, or (if your assistant can search its own past chats) point me at the relevant ones.
   - **Local folders / documents** — notes, drafts, READMEs, specs.
   - **Code repositories** — read the docs and the structure; skim code where it encodes a decision.
   - **Transcripts / articles** — calls, talks, research you've saved.

If a source is worth keeping verbatim, drop a copy into `01-sources/` first (date-stamped, never edited later). Then extract from it.

---

## Step 1 — EXTRACT (run this against one source set)

> Mine the sources for **{project}** into a staging file. Treat the anchor as authoritative; where a source disagrees with the anchor, the anchor wins and you flag the conflict — never silently average them. Do not write anything to the wiki in this step.
>
> Write to `02-synthesized/{project}/{today}-extraction.md` with this shape:
>
> ```markdown
> ---
> type: extraction
> updated: {today}
> sources:
>   - anchor: 02-synthesized/{project}/<anchor-file>   (always)
>   - chats: "<title>, ~<date>"   (every chat you mined, by title + approx date)
>   - repos/files: "<path>"        (every file or repo you read)
> tags: [{project}, extraction]
> ---
>
> ## Current state (reconciled with the anchor)
> - Phase / status / blockers — two or three lines.
>
> ## Decisions that have been made
> D1. WHAT: <the decision> · WHEN: <date/approx> · WHY: <rationale> · ALTERNATIVES: <what was considered and rejected>
> D2. ...
>
> ## Still open
> - <question> (count them; report the total)
>
> ## Contradictions found
> - <source A says X (date); source B says Y (date). Anchor resolves to: Z.>
>
> ## Private context — do NOT compile
> - <anything sensitive that stays in staging and must never graduate to the wiki>
> - (or: "none for this project")
> ```
>
> Rules: cite provenance for everything. Mark anything you inferred as **(inferred)** so it's never mistaken for something the source actually said. Don't invent state — if it isn't in a source or the anchor, it doesn't go in.

**Then stop and report to the user** (in chat, not a file): the decisions you found, the contradictions, the open-question count, and anything that surprised you or that the anchor seemed to miss. **Wait for review before compiling.** Let them correct the staging file first.

---

## Step 2 — COMPILE (run this only after the extraction is reviewed)

> Read the reviewed extraction and the anchor. Produce Layer-3 wiki pages under `10-{domain}/{project}/`:
> - Frontmatter on every page: `type: wiki`, `updated: {today}`, `tags`, and `sources:` (which extraction/anchor it came from). Missing `sources` is the most common gap — don't.
> - Wikilink related pages (`[[...]]`). Keep pages navigable and specific — concrete details over vague summaries. Split anything past ~500 lines.
> - Carry the **(inferred)** marks through; the anchor wins on any conflict.
>
> **Never create a decision record silently.** At the end, output proposed ADRs:
> `PROPOSED ADR-NNN: <title> — <one-line summary>. Sources: <extraction line>. Create? [y/n]`
> Propose one only for a decision that is settled in the anchor, involved a real choice with alternatives, and has documented rationale. Do **not** propose ADRs for trivially-true facts or for anything still in the "Still open" list.
>
> Then update `index.md` (one line summarizing the project's current state) and append a mutation entry to `log.md` (compile · pages touched · new/updated/open/ADRs-proposed counts).

**Then stop.** The user approves decisions explicitly ("create 1, 3, 5; skip 2, 4"). Only then write the approved ADRs to `_meta/decisions/ADR-00N-<slug>.md`. Report the pages created/updated and which ADRs you wrote.

---

## Keeping it fed (the part that makes it worth building)

This is not a one-time import. The vault is only as current as the last time it was fed — and feeding it should be a minute, not an afternoon. Three loops:

**A new source shows up** — a chat worth keeping, a doc, a decision made in passing.
- If it's worth keeping verbatim, drop it in `01-sources/`. Extract just the *delta* (what's new), not the whole history again.
- Update the project's anchor "Current state" to match, and bump its `updated:` date. (At the end of any working session where something changed: one line — "we changed X today" — into the anchor. That single habit is what keeps the whole thing honest.)
- Only compile to the wiki if durable knowledge actually changed. Propose an ADR for any genuinely new decision.

**You start a new project** — spin up `10-{domain}/{new-project}/` and a fresh anchor (or run the Builder for the skeleton). Then run **Step 1** against whatever sources already exist for it, and compile when reviewed.

**Every so often (a cadence — monthly is plenty)** — a light review pass: which anchors have a stale `updated:` date? Any wiki pages orphaned (nothing links to them)? Any drift between a staging extraction and the wiki page it produced? Any page missing its `sources:`? Fix or flag. This is what stops slow rot.

---

## Guardrails (for the AI)
- **Two steps, never one** — a reviewed staging file before anything reaches the wiki, every time.
- **The anchor wins** on conflict; surface the contradiction, don't quietly pick.
- **Propose, never mint** — no ADR without an explicit yes.
- **Provenance on everything**; mark inference as inference.
- **Never edit `01-sources/`.** Never write a secret (API key, token, password) into any file — if you spot one in a source, flag it, don't copy it forward.
- **Show your work and wait at each review gate.** Don't barrel from raw sources to written decisions in one pass.

---

*Companion to The Context Vault and its Builder. Free — copy, adapt, share. It's a working tool, not a product.*
