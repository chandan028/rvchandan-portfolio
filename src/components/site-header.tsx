import Link from 'next/link';
import { navLinks, site } from '@/data/site';
import { SpiderMark } from './spider-mark';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-thread/60 bg-ink/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-shell items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-sm text-silk transition-colors hover:text-spider"
        >
          <SpiderMark className="h-4 w-4 text-spider" />
          <span className="whitespace-nowrap">{site.name}</span>
        </Link>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <li key={link.href} className="hidden sm:block">
                <Link
                  href={link.href}
                  className="font-mono text-micro uppercase text-dust transition-colors hover:text-silk"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.resume}
                className="border border-thread px-3 py-1.5 font-mono text-micro uppercase text-silk transition-colors hover:border-spider hover:text-spider"
              >
                Résumé
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
