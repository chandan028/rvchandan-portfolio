import { site } from '@/data/site';
import { TiltCard } from './tilt-card';
import { WebCorner } from './spider-mark';
import { Reveal } from './reveal';

const elsewhere = [
  { href: site.linkedin, label: 'LinkedIn' },
  { href: site.github, label: 'GitHub' },
];

/**
 * The end of the page has one job: make the next step obvious. So the address
 * is the largest type in the section, the résumé sits beside it, and the
 * availability line is stated rather than implied.
 */
export function ContactCta() {
  return (
    <Reveal>
      <TiltCard>
        <div className="tilt-sheen relative overflow-hidden rounded-card bg-weave/55 p-7 shadow-e2 backdrop-blur-[2px] sm:p-10">
          <WebCorner className="tilt-card__web pointer-events-none absolute -right-8 -top-8 h-44 w-44 text-thread" />

          <p className="tilt-card__lift relative inline-flex items-start gap-2.5 font-mono text-micro uppercase text-silk sm:items-center">
            <span
              aria-hidden="true"
              className="mt-[0.3em] h-2 w-2 shrink-0 animate-pulseDot rounded-full bg-spider shadow-glow sm:mt-0"
            />
            Open to SDE 2 &amp; senior backend / AI roles
          </p>

          <p className="tilt-card__lift relative mt-5 max-w-prose text-[0.95rem] leading-relaxed text-dust">
            Happy to talk through any of the four systems above in detail —
            including the parts that did not work first time.
          </p>

          <p className="relative mt-7">
            <a
              href={`mailto:${site.email}`}
              className="display inline-block break-all text-[clamp(1.35rem,5.5vw,2.75rem)] lowercase text-silk decoration-spider decoration-2 underline-offset-8 transition-colors duration-200 hover:text-spider hover:underline"
            >
              {site.email}
            </a>
          </p>

          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <a href={`mailto:${site.email}`} className="btn-primary">
              Email me
              <span aria-hidden="true">→</span>
            </a>
            <a href={site.resume} className="btn-ghost">
              Résumé
              <span aria-hidden="true" className="text-dust">
                PDF
              </span>
            </a>
            {elsewhere.map((link) => (
              <a key={link.label} href={link.href} className="btn-ghost">
                {link.label}
              </a>
            ))}
          </div>

          <p className="relative mt-8 font-mono text-micro text-dust">
            {site.location}
          </p>
        </div>
      </TiltCard>
    </Reveal>
  );
}
