import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies, getCaseStudy } from '@/data/case-studies';
import { Diagram } from '@/components/diagrams';
import { richText } from '@/lib/rich-text';
import { site } from '@/data/site';
import { Reveal } from '@/components/reveal';
import { TiltCard } from '@/components/tilt-card';
import { WebCorner } from '@/components/spider-mark';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const url = `${site.url}/work/${study.slug}/`;

  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: `/work/${study.slug}/` },
    openGraph: {
      type: 'article',
      title: `${study.title} — ${site.name}`,
      description: study.description,
      url,
      siteName: site.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${study.title} — ${site.name}`,
      description: study.description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article className="mx-auto max-w-shell px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
      <Link
        href="/#work"
        className="btn-ghost group pl-3.5 pr-4 text-dust hover:text-silk"
      >
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 ease-swift group-hover:-translate-x-1"
        >
          ←
        </span>
        All work
      </Link>

      <header className="mt-8 border-b border-thread pb-10">
        <Reveal>
          <p className="section-label">Case study</p>
          <h1 className="display mt-3 max-w-[16ch] text-[clamp(2rem,7vw,3.75rem)] text-silk">
            {study.title}
          </h1>
          <hr className="mt-6 h-1 w-20 rounded-full border-0 bg-spider shadow-glow" />
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-7 max-w-prose text-lg leading-[1.6] text-silk/90">
            {study.standfirst}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="surface p-4">
              <dt className="section-label">Role</dt>
              <dd className="mt-1.5 text-[0.95rem] text-silk">{study.role}</dd>
            </div>
            <div className="surface p-4">
              <dt className="section-label">Period</dt>
              <dd className="numeric mt-1.5 text-[0.95rem] text-silk">
                {study.period}
              </dd>
            </div>
            <div className="surface p-4">
              <dt className="section-label">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {study.stack.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </Reveal>
      </header>

      {study.sections.map((section, i) => (
        <div key={section.heading}>
          <Reveal>
            <section className="mt-14 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-8">
              <h2 className="display mb-4 text-base text-spider sm:mb-0 sm:text-right sm:text-sm">
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.body.map((paragraph, j) => (
                  <p key={j} className="prose-body">
                    {richText(paragraph)}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Diagram sits after the problem statement, before the constraints. */}
          {i === 0 ? (
            <Reveal>
              <div className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-8">
                <div aria-hidden="true" />
                <Diagram which={study.diagram} caption={study.diagramCaption} />
              </div>
            </Reveal>
          ) : null}
        </div>
      ))}

      <nav aria-label="More case studies" className="mt-20">
        <Reveal>
          <p className="section-label mb-4">Next case study</p>
          <TiltCard>
            <Link
              href={`/work/${next.slug}/`}
              className="tilt-sheen group relative flex flex-col overflow-hidden rounded-card bg-weave/55 p-7 shadow-e2 backdrop-blur-[2px] transition-[box-shadow] duration-300 ease-settle hover:shadow-accent sm:p-8"
            >
              <WebCorner className="tilt-card__web pointer-events-none absolute -right-7 -top-7 h-36 w-36 text-thread transition-colors duration-300 group-hover:text-spider/60" />

              <span className="tilt-card__lift display relative max-w-[28ch] text-xl text-silk transition-colors duration-300 group-hover:text-spider sm:text-2xl">
                {next.title}
              </span>
              <span className="tilt-card__lift relative mt-3 block max-w-prose text-[0.95rem] leading-relaxed text-dust">
                {next.hook}
              </span>
              <span className="relative mt-6 flex items-center gap-2 font-mono text-micro uppercase text-spider">
                Read it
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 ease-swift group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </TiltCard>
        </Reveal>
      </nav>
    </article>
  );
}
