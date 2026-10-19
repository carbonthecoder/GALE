import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GALE — Minimalist Weather TUI',
  description: 'Minimalist weather TUI powered by Open-Meteo. Zero API keys, zero tracking.',
  keywords: ['weather', 'tui', 'cli', 'open-meteo', 'terminal', 'minimalist', 'gale'],
  authors: [{ name: 'carbonthecoder', url: 'https://github.com/carbonthecoder' }],
  openGraph: {
    title: 'GALE — Minimalist Weather TUI',
    description: 'Minimalist weather TUI powered by Open-Meteo. Zero API keys, zero tracking.',
    url: 'https://github.com/carbonthecoder/GALE',
    siteName: 'GALE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GALE — Minimalist Weather TUI',
    description: 'Minimalist weather TUI powered by Open-Meteo. Zero API keys, zero tracking.',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
