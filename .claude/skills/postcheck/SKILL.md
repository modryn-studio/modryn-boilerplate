---
name: postcheck
description: >
  Post-implementation review battery — run after any non-trivial implementation or iteration lands,
  before calling it done. Triaged: only the relevant checks run, each skipped check states why in one
  line. Bugs/UX/mobile consistency, edge cases, refresh-safe state, loading states, caching, stale
  docs, and GitHub issues for anything deferred. Trigger on "run postcheck", "review the last change",
  or automatically once a feature/screen/flow/component reaches a stopping point.
argument-hint: "[optional: path or area to focus]"
---

# /postcheck — the post-implementation review battery

Skips being asked. Run this once an implementation reaches a natural stopping point — a feature,
screen, flow, or component is done and about to be handed back for review. Skip it for truly
trivial turns (a rename, a one-line copy tweak, a fix made mid-iteration). Bias toward running it
when real behavior or UI changed.

Work through the checks below against the most recent diff. **Triage** — run only what's relevant,
and for anything skipped, say so in one line with why ("Caching: N/A, no data fetching or expensive
compute in this diff"). Do not pad the report with checks that don't apply.

For each relevant check: state findings, **fix anything quick and safe inline**, and for anything
deferred, **file it as a GitHub issue** (see the last check) rather than leaving it as loose prose
that nobody tracks.

1. **Bugs + correctness.** Read the changed code for real bugs — wrong state, missing cleanup,
   races, unhandled errors, stale closures, off-by-ones. Fix what you find.

2. **UI/UX consistency.** Compare against sibling components/features: design tokens (no
   hand-picked colors/sizes off the scale — see `design-system.md`), spacing rhythm, register, and
   **both light and dark mode**. Fix drift.

3. **Mobile.** Check at a narrow viewport: grids that must stack, tap-target size (≥44px), overflow
   or clipped content, modals inside their gutters, text that wraps badly. Verify visual changes
   live with the `chrome-devtools-mcp` CLI at mobile width per
   `modryn-hq/playbooks/read-live-competitor.md` — never auto-start a dev server the user runs
   themselves; ask first if unsure how they run it. Fix necessary items.

4. **Edge cases.** Empty / one / many, disabled controls, keyboard (Esc / Tab / focus order / focus
   trap), backdrop and other dismiss paths, double-clicks, boundary values, the new interaction
   under unusual input.

5. **State across refresh.** Identify client state that silently resets on reload. Decide per case:
   real bug (fix) or acceptable ephemeral UI (note it, don't over-engineer persistence nobody asked
   for).

6. **Loading states.** Any async path missing a pending / empty / error state, or a placeholder
   that could read as real data. Fix.

7. **Caching.** Only if the diff touches data fetching, expensive compute, or asset loading: a
   memoization/caching win, or a staleness risk? Otherwise N/A — say so.

8. **Docs.** Does this change make anything stale in `CLAUDE.md`, `context.md`, `brand.md`, or
   `docs/`? Update only what's genuinely stale — this file is owned like code; change a rule in the
   same commit as the code that broke it. If the project has separate strategy/recon docs marked
   read-only from a build session, don't touch them here.

9. **GitHub issues.** For anything deferred (a real TODO, a known gap, a planned follow-up screen),
   file a GitHub issue via `gh` on the repo: clear title, enough context to act without this
   conversation, a label if one fits. Check for an existing open issue first — don't duplicate.
   Report the issue numbers/URLs. Do not file issues for things already fixed inline.

### Report, then fix
End with a tight summary: what you fixed, what you filed (with links), what you checked and found
clean, and what you skipped as N/A. Respect the repo's copy conventions (e.g. no em dashes in
on-screen text, if that's a project rule) and commit only when the user asks.
