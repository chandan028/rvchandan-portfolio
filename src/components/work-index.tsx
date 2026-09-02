import Link from 'next/link';
import { caseStudies } from '@/data/case-studies';
import { TiltCard } from './tilt-card';
import { WebCorner } from './spider-mark';

export function WorkIndex() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {caseStudies.map((study) => (
        <li key={study.slug}>
          <TiltCard className="h-full">
            <Link
              href={`/work/${study.slug}/`}
              className="group relative flex h-full flex-col overflow-hidden border border-thread bg-weave/60 p-6 transition-colors hover:border-spider sm:p-7"
            >
              <WebCorner
                className="tilt-card__web pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-thread transition-colors duration-300 group-hover:text-spider/60"
              />

              <h3 className="tilt-card__lift display relative max-w-[24ch] text-base leading-[1.15] text-silk sm:text-lg">
                {study.title}
              </h3>

              <p className="tilt-card__lift relative mt-4 max-w-prose text-[0.95rem] leading-relaxed text-silk/80">
                {study.hook}
              </p>

              <p className="relative mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-micro text-dust">
                {study.stack.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>

              <p className="relative mt-6 font-mono text-micro uppercase text-spider">
                Read the case study{' '}
                <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          </TiltCard>
        </li>
      ))}
    </ul>
  );
}
