import { z } from 'zod';

// Validated environment variables — imported anywhere a secret/config value is read.
// Register each new var here so a missing/invalid value fails fast at boot rather
// than surfacing as a confusing runtime error deep inside a request.
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Add prototype keys as the product grows, e.g.:
  //   MARKET_DATA_API_KEY: z.string().min(1, 'MARKET_DATA_API_KEY is required'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Missing or invalid environment variables:\n${missing}`);
}

export const env = parsed.data;
