import { site } from '@/data/site';
import { HeroCanvas } from './hero-canvas';

const links = [
  { href: site.github, label: 'GitHub', text: site.githubLabel },
  { href: site.linkedin, label: 'LinkedIn', text: site.linkedinLabel },
  { href: `mailto:${site.email}`, label: 'Email', text: site.email },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-thread/60">
      <HeroCanvas />

      <div className="relative mx-auto max-w-shell px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <h1 className="display text-[clamp(2.75rem,11vw,6.5rem)] text-silk">
          R V<br className="sm:hidden" /> Chandan
        </h1>

        {/* The single bold gesture on the site. */}
        <hr className="mt-6 h-1 w-24 border-0 bg-spider" />

        <p className="mt-6 max-w-prose text-lg leading-[1.55] text-silk sm:text-xl">
          {site.positioning}
        </p>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-dust">
          {site.subline}
        </p>

        <ul className="mt-9 flex flex-col gap-3 font-mono text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="link-underline">
                <span className="text-dust">{link.label} </span>
                {link.text}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              className="inline-block border border-spider px-3 py-1.5 text-silk transition-colors hover:bg-spider"
            >
              Résumé (PDF)
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
