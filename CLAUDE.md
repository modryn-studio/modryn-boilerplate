# modryn-boilerplate — Claude Code Guide

Lean Next.js starter for Modryn prototypes. The philosophy: ship the smallest thing that works, add machinery only when a real need shows up. This is the opposite of a kitchen-sink boilerplate — there's no payments, email, auth, analytics, database, or SEO layer baked in. Add those per project.

---

## Operating Rules (inherited by every project from this boilerplate)

How we build — distilled from how Anthropic and top operators use Claude Code. Keep these in every project's CLAUDE.md.

- **This file is owned like code. Keep it under ~200 lines.** Thin, reviewed, current — if a rule stops being true, change it in the same commit as the code that made it false.
- **Disposable prototypes:** build fast, judge by feel, build variants (branch-per-variant), keep the one that sings, throw the rest away. Don't fall in love.
- **Vibe-code the prototype, engineer the production version.** The differentiation and the hard part live in the backend — real auth, object-level permissions (a role on a resource, not an `isAdmin` bool), jobs that retry and get monitored. Slow down deliberately on critical paths.
- **Split doing from judging.** A separate review pass/agent — never let the author grade its own homework.
- **Plan-annotate loop:** ask for a plan with zero implementation → mark up every wrong thing → "address notes, don't implement yet" → repeat to convergence → *then* build.
- **Parallel or variant work uses git worktrees / branch-per-variant** so concurrent sessions never collide on the same files.
- **Read live competitors.** Drive real products with the `chrome-devtools-mcp` CLI (installed globally on this machine) per `modryn-hq/playbooks/read-live-competitor.md` — for recon and to pull real UI to clone / remix / reference. Landing/pricing pages need no auth; Luke logs in by hand for the app itself.
- **UI/UX bar — no vibe-code default.** Build *to* `modryn-hq/playbooks/design-system.md` (the positive spec: tokens, type scale, spacing, states, layout, Laws of UX) — lock the token system before components, run `/design-check` before any UI is "done". Never ship (`ui-ux-standards.md`): framework-default font as brand (Geist/Inter/system-ui), violet gradient CTAs, gradient text / glow blobs / glassmorphism, pill-everything, emoji as UI. If it looks like default LLM output, it's rejected.
- **Model routing:** Sonnet for the grind, Opus for judgment (scoping, review, big decisions); reserve Fable for rare long-horizon autonomous work.
- **Full doctrine:** `modryn-hq/playbooks/build-process.md` + `year-five-doctrine.md` (build the five-years-out version today; the moat is depth a cloner can't replicate in a week).
- **Document lean.** A disposable prototype needs only: this CLAUDE.md (thesis / state / pointers, kept current like code), the code (commented design tokens = self-documenting craft), and the playbooks it points to. Don't fill `context.md` / `brand.md` during throwaway iteration — they earn their place at the real-build phase.
- **Both modes, always.** Every prototype ships light + dark with a persisting toggle out of the box — `ThemeProvider` + `ThemeToggle` are wired into the root layout (no `next-themes`; it's unmaintained with open React 19/Next 16 bugs). Just recolor the `.dark` override block in `globals.css` per brand.

---

## Starting a New Project From This Boilerplate

1. Copy this folder to the new project location (or `git clone` then reset history).
2. Rename in `package.json` (`name`) and `README.md`.
3. Fill in `src/config/site.ts` (name, description).
4. Lock the design system: recolor `src/app/globals.css` `@theme` tokens + choose a real display font, then build the `ui/` primitives — run `/design-check lock` to do this against `design-system.md` before building screens.
5. `npm install`, then `npm run dev`.
6. Update this `CLAUDE.md` for the specific project (or point it at wherever that project's context lives).

---

## Stack

Next.js 16 (App Router) + React 19 · TypeScript · Tailwind CSS v4 · Vercel · **Vercel AI SDK** (`ai` + `@ai-sdk/anthropic` + `@ai-sdk/react`). React Compiler is on (`reactCompiler: true`). Designed to deploy to the auto-generated `*.vercel.app` URL — no custom domain assumed.

## Structure

```
src/app/            → App Router pages, layouts, route handlers
src/components/      → UI; src/components/ui/ holds shared primitives (button, input, textarea)
src/config/site.ts  → minimal site metadata (single source of truth)
src/lib/            → utilities: cn (class merge), env (zod-validated env), route-logger
```

## Conventions

**Tailwind v4 — no config file.** All theme customization lives in `src/app/globals.css` under `@theme` (never `:root`, never a `tailwind.config.*`). Tokens: `bg`, `surface`, `border`, `text`, `muted`, `accent`, `accent-foreground`. Use shorthand `bg-(--color-x)` over `bg-[var(--color-x)]`; when a token is in `@theme` the short utility (`bg-surface`, `text-muted`) works directly.

**API routes** (`src/app/api/**/route.ts`) use `createRouteLogger` from `@/lib/route-logger` — never raw `console.log`:
```typescript
const log = createRouteLogger('my-route');
export async function POST(req: Request): Promise<Response> {
  const ctx = log.begin();
  try {
    // ...
    return log.end(ctx, Response.json(result));
  } catch (error) {
    log.err(ctx, error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Env vars:** register every secret/config var in `src/lib/env.ts` (zod) so a missing value fails fast at boot.

**Code style:** senior-engineer minimalism — small surface area, obvious naming, no abstraction before it's needed. Comments explain WHY. Early returns for errors. One file, one responsibility.

## Defaults Worth Knowing

- `src/app/layout.tsx` sets `robots: { index: false }` — prototypes stay out of search indexes. Remove that when a project genuinely goes public.
- `.vscode/` ships `formatOnSave` + Prettier and a `Run dev server` build task (pipes to `dev.log`).

## README Banner

`npm run generate-banner` → writes `public/brand/banner.png` (1280×320) via Satori (JSX → SVG → PNG with proper font rendering).

**Process every project — do not skip:**

1. Drop logomark at `public/brand/logomark.png` (1024×1024, transparent background)
2. Invoke Rams (`modryn-hq/team/system-prompts/dieter-rams.md`) for a banner spec: font family, weights, mark size, tagline copy, color assignments
3. Update `scripts/generate-banner.mjs` BANNER CONFIG block with the spec values
4. `npm install --save-dev @fontsource/<your-font>` — Google Fonts always serves WOFF2; Satori needs WOFF; @fontsource ships both
5. `npm run generate-banner`

Never use ImageMagick to generate the banner — Arial-Bold text rendering is the wrong register for every Modryn product.

---

## Adding Common Capabilities (when needed, not before)

- **Database:** Drizzle + Neon/Postgres. Add `DATABASE_URL` to `env.ts`, create `src/lib/db.ts`.
- **Payments:** Stripe Payment Links need zero server code; upgrade to Checkout Sessions only for dynamic pricing.
- **Email / analytics / auth:** wire per project — keep it out of the base.
- **Generative UI** (AI SDK v7 — `streamText` + tools + `message.parts`): see `modryn-hq/playbooks/generative-ui.md`. Not duplicated here.
