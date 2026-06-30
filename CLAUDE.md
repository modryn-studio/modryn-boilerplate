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

## Generative UI Architecture

**AI SDK v7 pattern.** `streamUI` is deprecated — never use it. Current approach: `streamText()` with tools + client-side `message.parts` rendering.

```typescript
// API route — required boilerplate for SSE routes
export const dynamic = 'force-dynamic';  // prevents SSE caching

export async function POST(req: Request) {
  const result = streamText({  // no await
    model: anthropic('claude-opus-4-8'),  // judgment tasks; use sonnet-4-6 for fast extraction
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: req_body }],
    tools: {
      render_something: {
        description: '...',
        inputSchema: z.object({ ... }),  // inputSchema, NOT parameters
        execute: async (args) => args,
      },
    },
  });
  return result.toUIMessageStreamResponse();  // NOT toDataStreamResponse()
}
```

```typescript
// Client — useChat from '@ai-sdk/react' (separate package from 'ai')
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/my-route', body: extraData }),
});

// Trigger without user input:
useEffect(() => {
  if (!triggered.current && status === 'ready') {
    triggered.current = true;
    sendMessage({ text: 'go' });  // sendMessage(), not append()
  }
}, [status, sendMessage]);

// Render parts:
lastMessage?.parts?.map((part, i) => {
  if (part.type === 'text') return <StreamingText key={i} text={part.text} />;
  if (part.type === 'dynamic-tool' && part.state === 'output-available') {
    // part.type is 'dynamic-tool', NOT 'tool-invocation'
    // part.state is 'output-available', NOT 'result'
    // part.output has the result, NOT part.toolInvocation.result
    const output = part.output as Record<string, unknown>;
    if (part.toolName === 'render_something') return <MyComponent key={i} {...output} />;
  }
});
```

The `.cursor-blink` CSS class (in `globals.css`) renders a blinking `|` cursor during streaming.

**Model selection:** `claude-opus-4-8` for reasoning/generation. `claude-sonnet-4-6` for fast structured extraction.

---

## Adding Common Capabilities (when needed, not before)

- **Database:** Drizzle + Neon/Postgres. Add `DATABASE_URL` to `env.ts`, create `src/lib/db.ts`.
- **Payments:** Stripe Payment Links need zero server code; upgrade to Checkout Sessions only for dynamic pricing.
- **Email / analytics / auth:** wire per project — keep it out of the base.
