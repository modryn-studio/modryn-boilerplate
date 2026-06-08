// Single source of truth for site-wide metadata.
// Kept intentionally minimal — this is a prototype starter, not a marketing site.
// Expand only when there's a real reason to (a custom domain, public launch, etc.).
export const site = {
  name: 'TODO: Project Name',
  description: 'TODO: one-line description of this prototype.',
  // Local dev uses localhost. Update to the Vercel *.vercel.app URL after first deploy.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;
