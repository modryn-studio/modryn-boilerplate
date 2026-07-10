# Agents — universal craft iterators

Worker-plane subagents every Modryn prototype inherits. Each reads the running app + the docs this
repo's `CLAUDE.md` points to, edits **only its own lane** in-repo, and reports the diff for review.

| Agent | Lane | Note |
|---|---|---|
| `jobs` | product identity, the cut, first 60s | runs **first** — identity precedes copy |
| `ogilvy` | copy, headlines, hooks, CTAs | after Jobs |
| `rams` | visual / layout / type / interaction | held to `ui-ux-standards.md` |
| `kay` | frontier / year-five / uncopyability | edits scope + structure |
| `charlie` | strategy / kill / moat | **advisory — edits nothing** |
| `dana` | IP / naming / right-of-publicity | usually silent off entertainment work |

**Invoke** one with `@jobs …`, or a group with `/crew <team> <target>` (see `.claude/skills/crew`).

Vertical domain benches (e.g. trading) are **not** here — they're copied into a prototype from
`modryn-hq/benches/<vertical>/`. Doctrine: `modryn-hq/playbooks/build-process.md`.
