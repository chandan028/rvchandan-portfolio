import Link from 'next/link';
import { experience } from '@/data/experience';
import { Reveal } from './reveal';

/**
 * Each employer is a raised surface; the roles inside it hang off a lit rail.
 * The rail fades out at the bottom rather than stopping dead, so the last role
 * does not read as a hard end to the career.
 *
 * Case-study links are chips, not sentences — a recruiter scanning the
 * timeline should be able to see, per role, how many deep write-ups back it.
 */
export function ExperienceTimeline() {
  return (
    <div className="space-y-5">
      {experience.map((employer, e) => (
        <Reveal key={employer.company} delay={e * 110}>
          <article className="surface p-6 sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-lg font-semibold text-silk">
                {employer.company}
                {employer.context ? (
                  <span className="font-normal text-dust">
                    {' '}
                    ({employer.context})
                  </span>
                ) : null}
              </h3>
              <p className="numeric font-mono text-micro text-dust">
                {employer.location} · {employer.period}
              </p>
            </header>

            {employer.note ? (
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-dust">
                {employer.note}
              </p>
            ) : null}

            <ol className="relative mt-7">
              {/* The rail. A gradient, so it dissolves instead of stopping. */}
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-spider/70 via-thread to-transparent"
              />

              {employer.roles.map((role, r) => (
                <li
                  key={role.title + role.period}
                  className="relative pb-8 pl-7 last:pb-0 sm:pl-9"
                >
                  {/* Current role gets the lit node; past roles a quiet one. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full ring-4 ring-weave ${
                      e === 0 && r === 0
                        ? 'bg-spider shadow-glow'
                        : 'bg-thread'
                    }`}
                  />

                  <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                    <h4 className="font-semibold text-silk">{role.title}</h4>
                    <p className="numeric font-mono text-micro text-dust">
                      {role.period} · {role.mode}
                    </p>
                  </div>

                  <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-silk/80">
                    {role.line}
                  </p>

                  {role.caseStudy ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {role.caseStudy.map((ref) => (
                        <li key={ref.slug}>
                          <Link
                            href={`/work/${ref.slug}/`}
                            className="chip group inline-flex min-h-[2rem] items-center gap-1.5 text-web hover:text-web"
                          >
                            {ref.label}
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-200 ease-swift group-hover:translate-x-0.5"
                            >
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
