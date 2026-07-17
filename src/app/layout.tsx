import type { Metadata, Viewport } from 'next';
import { site } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import './globals.css';

export const viewport: Viewport = {
  // Shrinks layout viewport when an on-screen keyboard opens — h-dvh containers
  // then exclude keyboard height without per-component visualViewport hacks.
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  // Private prototype — keep it out of search indexes until there's a reason not to.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: ThemeProvider's blocking script sets the .dark class
    // before hydration, which intentionally differs from the server-rendered markup.
    <html lang="en" suppressHydrationWarning>
      <body className="font-heading antialiased">
        <ThemeProvider>
          <ThemeToggle className="fixed top-4 right-4 z-50" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
