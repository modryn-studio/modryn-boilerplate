---
name: crew
description: "Invoke a group of the studio iterator agents as a team on the current prototype, with one command instead of one @agent at a time. Teams: craft (jobs→ogilvy→rams), desk (the trading bench), strategy (charlie+kay). Trigger when Luke says 'run the craft team on X', 'get the desk on the risk panel', 'have the crew look at the landing page', or names several agents at once."
argument-hint: "[team | agent,agent,...] [what to work on]"
---

# /crew — dispatch a team of iterator agents

Bring a **group** of this repo's `.claude/agents/` iterators to bear on one surface with a single
command. This is the convenient way to "invoke multiple agents at once" — the skill spawns them as
subagents, in the right order, and hands you one combined report.

**Args:** `/crew <team> <what to work on>`
- `<team>` is a named team below, or an ad-hoc comma-list of agent names (`jobs,priya`).
- `<what to work on>` is the target surface + goal (e.g. `the /accounts landing hero — tighten it`).

## Teams

| Team | Members (canonical order) | Mode | Use it for |
|---|---|---|---|
| `craft` | `jobs` → `ogilvy` → `rams` | **relay** (sequential) | Polishing a surface: identity/cut → copy → visual. |
| `desk` | `vera`, `nathan`, `hollis`, `priya` (+ `soren` if present) | **parallel** | A trading surface's domain correctness (read, psychology, risk, legal line, macro). |
| `strategy` | `charlie` + `kay` | **parallel** | "Should this exist / is it the year-five version" before a big change. |

`full` = `strategy`, then `craft`, then `desk` — a whole pass. Use sparingly; it's a lot of edits.

## Why relay vs parallel (the collision rule)

- **`craft` runs as a relay** because its members edit the *same* components and have a hard
  dependency: Jobs settles what the thing is, *then* Ogilvy writes the copy, *then* Rams executes the
  visual. Running them in parallel on shared files clobbers. Each member sees the prior member's edits.
- **`desk` runs in parallel** because its members own *disjoint* surfaces (Vera = the market read,
  Hollis = the risk/sizing numbers, Priya = compliance phrasing, Nathan = the psychology framing,
  Soren = macro). Each edits **only its own domain**; if a change would touch a line another member
  owns, it leaves a note instead of editing.
- **`strategy` runs in parallel** because Charlie edits nothing (he returns a build/kill/moat
  judgment) and Kay edits structure/scope — no overlap.
- For genuinely parallel *exploration of divergent directions*, don't use `/crew` — cut isolated
  worktrees per the `parallel-worktree-treatments` playbook instead.

## Steps

1. **Parse** the first token as the team (or comma-list) and the rest as the target/goal. If no target
   was given, ask for the one surface + goal, then proceed.
2. **Resolve members** against `.claude/agents/`. Only dispatch agents that actually exist here — on a
   non-trading prototype the `desk` won't be present; say which members you skipped and continue with
   the rest. (`charlie` is advisory: he reports a judgment, he does not edit.)
3. **Dispatch:**
   - **Relay teams** (`craft`, and `full` overall): spawn one member subagent, wait for it to finish
     and report, then spawn the next — passing each a one-line summary of what prior teammates just
     changed. Enforce the canonical order.
   - **Parallel teams** (`desk`, `strategy`): spawn all present members as subagents **in a single
     message** (parallel). Tell each: edit only your own lane; if you'd need to change a line another
     member owns, note it instead of editing.
   - Every member gets: the target surface + goal, and the standing instruction from its own agent file
     (read the running app + the docs this repo's `CLAUDE.md` points to → edit its surface → report
     the diff).
4. **Synthesize.** After the team finishes, give Luke ONE combined report: per member, what changed and
   where (files), plus any cross-lane notes members deferred and any advisory verdicts (Charlie). Do
   **not** re-edit their work — this is a summary for Luke to review the diff from a `modryn-hq`
   session.

## Notes

- If Luke names bare agents (`/crew jobs,rams the empty state`), treat it as an ad-hoc team: relay if
  it includes two or more of `jobs`/`ogilvy`/`rams`, otherwise parallel.
- Keep each member in its lane. A member that finds nothing in its lane should say so and make no
  edits rather than inventing work (especially `soren` and `dana` on a trading tool).
