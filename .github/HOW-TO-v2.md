# How to Start a New Project

Mechanical setup process. Follow in order. No decisions — those happen in modryn-hq before you get here.

---

## Prerequisites

- Boilerplate lives at `C:\Users\Luke\Documents\modryn-boilerplate` (already current)
- Empty project folder created at the destination
- Blank GitHub repo created at `https://github.com/modryn-studio/<project-name>`

---

## Step 1 — Copy the boilerplate

```powershell
robocopy "C:\Users\Luke\Documents\modryn-boilerplate" "C:\path\to\<project-name>" /E /XD .git node_modules .next /XF .env.local dev.log
```

Robocopy exit code 1 = success (files copied). Any other code is an error.

---

## Step 2 — Update project identity

Four files, exact changes:

**`package.json`** — change `name`:
```json
"name": "<project-name>",
```

**`src/config/site.ts`** — change `name`:
```typescript
name: '<Project Name>',
```

**`src/app/page.tsx`** — change the `<h1>`:
```tsx
<h1 className="text-2xl font-semibold tracking-tight"><Project Name></h1>
```

**`context.md`** — update the GitHub URL under Social Profiles:
```
- GitHub: https://github.com/modryn-studio/<project-name>
```

**`CLAUDE.md`** — replace the boilerplate header block with:
```markdown
# <project-name> — Claude Code Guide

**Repo:** https://github.com/modryn-studio/<project-name>
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Vercel AI SDK · Vercel
**Source docs:** `context.md` (product/stack) · `brand.md` (voice/visual)

Fill in `context.md` and `brand.md` before building anything. Run `/update` after editing them.

---

## Boilerplate Reference

This project was created from [modryn-boilerplate](https://github.com/modryn-studio/nextjs_boilerplate). The notes below apply to every Modryn project.
```

---

## Step 3 — Create `.env.local`

```powershell
Copy-Item "C:\path\to\<project-name>\.env.local.example" "C:\path\to\<project-name>\.env.local"
```

Then open `.env.local` and fill in `ANTHROPIC_API_KEY`. Required before first request to any AI route.

---

## Step 4 — Initialize git and push

Run these commands from the project root:

```powershell
git init -b main
git add -A
git commit -m "init"
git remote add origin "https://github.com/modryn-studio/<project-name>"
git push -u origin main
git checkout -b dev
git push -u origin dev
```

From this point: **never commit directly to `main`**. Build on `dev`. PR to `main` = a release.

---

## Step 5 — Install dependencies

```powershell
npm install
```

---

## Step 6 — Start the dev server

Use the VS Code build task: `Ctrl+Shift+B` → "Run dev server"

This runs `npm run dev --port 3000` and pipes output to `dev.log`.

**Important:** If Claude Code started a test dev server during setup, kill it before running this step:
```powershell
netstat -ano | Select-String ":3000|:3001" | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique | ForEach-Object { if ($_ -match '^\d+$' -and $_ -ne '0') { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }
```

Open `http://localhost:3000` — you should see the project name heading on a dark page. That's the scaffold working.

---

## What you have at this point

- `main` and `dev` branches on GitHub, current with the boilerplate
- `node_modules` installed, `ANTHROPIC_API_KEY` set
- Dev server running at `localhost:3000`
- `context.md` and `brand.md` are stubs — fill these before building anything

**Next:** fill in `context.md` → run `/update` → proceed to Phase 2 (landing page) in HOW-TO.md.

---

## Notes

- `.next/` is gitignored — it's a Turbopack build cache, project-local, never committed
- Two dev servers on the same port will cause a Turbopack panic. Always kill existing node processes before restarting
- `ANTHROPIC_API_KEY` is required by `env.ts` and throws on first request to any AI route if missing. Set it before trying any genUI work
- `NEXT_PUBLIC_SITE_URL` can stay blank locally — `site.ts` falls back to `http://localhost:3000`
