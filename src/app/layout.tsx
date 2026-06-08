import type { Metadata, Viewport } from 'next';
import { site } from '@/config/site';
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
    <html lang="en">
      <body className="font-heading antialiased">{children}</body>
    </html>
  );
}
