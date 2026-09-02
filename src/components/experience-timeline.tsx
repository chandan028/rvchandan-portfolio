import Link from 'next/link';
import { experience } from '@/data/experience';

export function ExperienceTimeline() {
  return (
    <div className="space-y-14">
      {experience.map((employer) => (
        <article key={employer.company}>
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-lg font-semibold text-silk">
              {employer.company}
              {employer.context ? (
                <span className="font-normal text-dust"> ({employer.context})</span>
              ) : null}
            </h3>
            <p className="font-mono text-micro text-dust">
              {employer.location} · {employer.period}
            </p>
          </header>

          {employer.note ? (
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-dust">
              {employer.note}
            </p>
          ) : null}

          {/* The rule is the timeline. No dots, no icons. */}
          <ol className="mt-6 border-l border-thread">
            {employer.roles.map((role) => (
              <li
                key={role.title + role.period}
                className="relative pb-8 pl-6 last:pb-0 sm:pl-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2.5 h-px w-4 bg-thread sm:w-6"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                  <h4 className="font-semibold text-silk">{role.title}</h4>
                  <p className="font-mono text-micro text-dust">
                    {role.period} · {role.mode}
                  </p>
                </div>
                <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-silk/80">
                  {role.line}
                </p>
                {role.caseStudy ? (
                  <p className="mt-1 flex flex-wrap gap-x-5 font-mono text-micro">
                    {role.caseStudy.map((ref) => (
                      <Link
                        key={ref.slug}
                        href={`/work/${ref.slug}/`}
                        className="inline-block py-2 text-web underline decoration-thread underline-offset-4 hover:decoration-web"
                      >
                        {ref.label} →
                      </Link>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
