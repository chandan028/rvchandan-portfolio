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
 * Above the fold, ordered by what a hiring manager decides in the first few
 * seconds: what kind of engineer this is, then who, then what I build and at
 * what scale, then the evidence, and only then whether I am available.
 *
 * Availability used to open the page. It now sits under the proof, because
 * "open to roles" is an answer to a question nobody has asked yet — the work
 * has to earn the question first.
 *
 * The primary call to action is the work, not the résumé. The case studies are
 * the thing a CV cannot carry, so they get the filled button.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroCanvas />

      <div className="relative mx-auto max-w-shell px-5 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-24">
        <Reveal>
          <p className="inline-flex items-center rounded-inner bg-weave/70 px-3 py-1.5 font-mono text-micro uppercase text-silk shadow-e1 backdrop-blur-sm">
            {site.discipline}
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

        {/*
          Fact bar, not a tag cloud. Chips are already spent on skills and
          stack, so these are divided by hairlines instead — they are claims
          being asserted, and each one is argued for further down the page.
        */}
        <Reveal delay={290}>
          <ul className="mt-9 flex flex-wrap items-center gap-y-2 font-mono text-micro uppercase text-dust">
            {site.proof.map((item, i) => (
              <li key={item} className="flex items-center">
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="mx-3 h-3 w-px bg-thread sm:mx-4"
                  />
                ) : null}
                <span className="numeric text-silk">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={350}>
          <p className="mt-8 inline-flex items-start gap-2.5 font-mono text-micro uppercase text-silk sm:items-center">
            {/* mt keeps the dot on the first line when the line wraps. */}
            <span
              aria-hidden="true"
              className="mt-[0.3em] h-2 w-2 shrink-0 animate-pulseDot rounded-full bg-spider shadow-glow sm:mt-0"
            />
            {site.availability}
          </p>
        </Reveal>

        <Reveal delay={410}>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn-primary group">
              View the work
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-swift group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a href={site.resume} className="btn-ghost">
              Résumé
              <span aria-hidden="true" className="text-dust">
                PDF
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={470}>
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
