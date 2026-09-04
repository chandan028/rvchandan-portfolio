import Link from 'next/link';
import { caseStudies } from '@/data/case-studies';
import { TiltCard } from './tilt-card';
import { WebCorner } from './spider-mark';
import { Reveal } from './reveal';

/**
 * The work grid. Each card is a real 3D surface: perspective tilt on the
 * pointer, a cursor-tracked sheen, and content on two z-planes so the title
 * and hook float above the face while the ornament sits just below them.
 *
 * Depth comes from the shadow scale rather than a border, so the cards hold up
 * over the halftone ground and over the hero's gradient alike.
 */
export function WorkIndex() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {caseStudies.map((study, i) => (
        <Reveal as="li" key={study.slug} delay={i * 100}>
          <TiltCard className="h-full">
            <Link
              href={`/work/${study.slug}/`}
              className="tilt-sheen group relative flex h-full flex-col overflow-hidden rounded-card bg-weave/55 p-6 shadow-e2 backdrop-blur-[2px] transition-[box-shadow] duration-300 ease-settle hover:shadow-accent sm:p-7"
            >
              <WebCorner className="tilt-card__web pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-thread transition-colors duration-300 group-hover:text-spider/60" />

              <p className="numeric relative font-mono text-micro text-dust">
                {String(i + 1).padStart(2, '0')} / {String(caseStudies.length).padStart(2, '0')}
              </p>

              <h3 className="tilt-card__lift display relative mt-4 max-w-[24ch] text-base leading-[1.15] text-silk transition-colors duration-300 group-hover:text-spider sm:text-lg">
                {study.title}
              </h3>

              <p className="tilt-card__lift relative mt-4 max-w-prose text-[0.95rem] leading-relaxed text-silk/80">
                {study.hook}
              </p>

              {/*
                The constraints, before the stack. A reader skimming four cards
                judges difficulty from this line, not from the technology list —
                "15M rows under live traffic" says more than "MySQL" does.
              */}
              <p className="numeric relative mt-4 border-l-2 border-spider/70 pl-3 font-mono text-micro leading-relaxed text-dust">
                {study.scale}
              </p>

              {/* mt-auto pins the stack and CTA to the bottom so cards of
                  different hook lengths still line up across the row. */}
              <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
                {study.stack.slice(0, 4).map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="relative mt-5 flex items-center gap-2 font-mono text-micro uppercase text-spider">
                Read the case study
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 ease-swift group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
            </Link>
          </TiltCard>
        </Reveal>
      ))}
    </ul>
  );
}
