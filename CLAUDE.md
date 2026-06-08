# modryn-boilerplate — Claude Code Guide

Lean Next.js starter for Modryn prototypes. The philosophy: ship the smallest thing that works, add machinery only when a real need shows up. This is the opposite of a kitchen-sink boilerplate — there's no payments, email, auth, analytics, database, or SEO layer baked in. Add those per project.

---

## Starting a New Project From This Boilerplate

1. Copy this folder to the new project location (or `git clone` then reset history).
2. Rename in `package.json` (`name`) and `README.md`.
3. Fill in `src/config/site.ts` (name, description).
4. Recolor `src/app/globals.css` `@theme` tokens — or run the `frontend-design` skill for a real aesthetic pass.
5. `npm install`, then `npm run dev`.
6. Update this `CLAUDE.md` for the specific project (or point it at wherever that project's context lives).

---

## Stack

Next.js 16 (App Router) + React 19 · TypeScript · Tailwind CSS v4 · Vercel. React Compiler is on (`reactCompiler: true`). Designed to deploy to the auto-generated `*.vercel.app` URL — no custom domain assumed.

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

## Adding Common Capabilities (when needed, not before)

- **Database:** Drizzle + Neon/Postgres. Add `DATABASE_URL` to `env.ts`, create `src/lib/db.ts`.
- **Payments:** Stripe Payment Links need zero server code; upgrade to Checkout Sessions only for dynamic pricing.
- **Email / analytics / auth:** wire per project — keep it out of the base.
