import { site } from '@/data/site';
import { HeroCanvas } from './hero-canvas';
import { Reveal } from './reveal';
import { TechMarquee } from './tech-marquee';

const links = [
  { href: site.github, label: 'GitHub', text: site.githubLabel },
  { href: site.linkedin, label: 'LinkedIn', text: site.linkedinLabel },
  { href: `mailto:${site.email}`, label: 'Email', text: site.email },
];

/**
 * Above the fold, in order of what a hiring manager needs: whether I am
 * available, who I am, what I build, and how to get the CV. Everything else
 * on the page is elaboration on those four lines.
 *
 * Each block is its own reveal so the entrance is staggered rather than one
 * container sliding in as a slab.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroCanvas />

      <div className="relative mx-auto max-w-shell px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <Reveal>
          <p className="inline-flex items-start gap-2.5 rounded-inner bg-weave/70 py-1.5 pl-3 pr-3.5 font-mono text-micro uppercase text-silk shadow-e1 backdrop-blur-sm sm:items-center">
            {/* mt keeps the dot on the first line when the pill wraps. */}
            <span
              aria-hidden="true"
              className="relative mt-[0.3em] flex h-2 w-2 shrink-0 animate-pulseDot rounded-full bg-spider shadow-glow sm:mt-0"
            />
            Open to SDE 2 &amp; senior backend / AI roles
          </p>
        </Reveal>

        <Reveal delay={90}>
          <h1 className="mt-7 display text-[clamp(2.75rem,11vw,6.75rem)] text-silk">
            R V<br className="sm:hidden" /> Chandan
          </h1>
        </Reveal>

        {/* The single bold gesture on the site. */}
        <Reveal delay={160}>
          <hr className="mt-6 h-1 w-24 rounded-full border-0 bg-spider shadow-glow" />
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-6 max-w-prose text-lg leading-[1.55] text-silk sm:text-xl">
            {site.positioning}
          </p>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-dust">
            {site.subline}
          </p>
        </Reveal>

        <Reveal delay={310}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href={site.resume} className="btn-primary">
              Résumé
              <span aria-hidden="true" className="text-silk/70">
                PDF
              </span>
            </a>
            <a href="#work" className="btn-ghost group">
              Read the case studies
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-swift group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={390}>
          <ul className="mt-8 flex flex-col gap-y-1 font-mono text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            {links.map((link) => (
              <li key={link.label}>
                {/* py-2 gives each row a 40px hit target without a visible box. */}
                <a href={link.href} className="link-underline inline-block py-2">
                  <span className="text-dust">{link.label} </span>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <TechMarquee />
    </section>
  );
}
