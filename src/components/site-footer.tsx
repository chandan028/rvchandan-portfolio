import { site } from '@/data/site';
import { SpiderMark } from './spider-mark';

const links = [
  { href: `mailto:${site.email}`, label: 'Email' },
  { href: site.github, label: 'GitHub' },
  { href: site.linkedin, label: 'LinkedIn' },
  { href: site.resume, label: 'Résumé' },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-thread/60">
      <div className="mx-auto flex max-w-shell flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5">
          <SpiderMark className="h-4 w-4 shrink-0 text-spider" />
          <p className="font-mono text-micro text-dust">
            {site.name} · {site.location}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {links.map((link) => (
            <li key={link.label}>
              {/* Padding rather than a box: a 40px target with nothing drawn. */}
              <a
                href={link.href}
                className="flex min-h-[2.5rem] items-center rounded-inner px-2.5 font-mono text-micro text-dust transition-colors hover:text-silk"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
