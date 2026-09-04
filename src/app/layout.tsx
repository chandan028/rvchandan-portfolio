import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Inter, JetBrains_Mono } from 'next/font/google';
import { site } from '@/data/site';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { RevealObserver } from '@/components/reveal-observer';
import './globals.css';

const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /*
   * The default title carries the search terms rather than a job title alone:
   * "Backend Engineer — Java, Spring Boot & Applied AI" is what someone types,
   * and it is what a shared link shows in a tab strip.
   */
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  keywords: [
    'backend engineer',
    'Java',
    'Spring Boot',
    'Spring Security',
    'distributed systems',
    'payments',
    'Stripe',
    'Razorpay',
    'schema migration',
    'applied AI',
    'LLM agents',
    'Bengaluru',
  ],
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0E1A',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/*
          Marks the document as scripted before first paint, which is what
          arms the scroll-reveal hidden state in CSS. Doing this in an effect
          would flash every section in and then hide it again; doing it here
          means a no-JS reader simply gets the page fully visible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <RevealObserver />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
