import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies, getCaseStudy } from '@/data/case-studies';
import { Diagram } from '@/components/diagrams';
import { richText } from '@/lib/rich-text';
import { site } from '@/data/site';

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
    <article className="mx-auto max-w-shell px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/#work"
        className="font-mono text-micro uppercase text-dust transition-colors hover:text-spider"
      >
        ← All work
      </Link>

      <header className="mt-8 border-b border-thread pb-10">
        <p className="section-label">Case study</p>
        <h1 className="display mt-3 max-w-[16ch] text-[clamp(2rem,7vw,3.75rem)] text-silk">
          {study.title}
        </h1>
        <hr className="mt-6 h-1 w-20 border-0 bg-spider" />
        <p className="mt-7 max-w-prose text-lg leading-[1.6] text-silk/90">
          {study.standfirst}
        </p>

        <dl className="mt-8 grid gap-x-10 gap-y-4 font-mono text-micro sm:grid-cols-3">
          <div>
            <dt className="text-dust">Role</dt>
            <dd className="mt-1 text-silk">{study.role}</dd>
          </div>
          <div>
            <dt className="text-dust">Period</dt>
            <dd className="mt-1 text-silk">{study.period}</dd>
          </div>
          <div>
            <dt className="text-dust">Stack</dt>
            <dd className="mt-1 text-silk">{study.stack.join(' · ')}</dd>
          </div>
        </dl>
      </header>

      {study.sections.map((section, i) => (
        <div key={section.heading}>
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

          {/* Diagram sits after the problem statement, before the constraints. */}
          {i === 0 ? (
            <div className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-8">
              <div aria-hidden="true" />
              <Diagram which={study.diagram} caption={study.diagramCaption} />
            </div>
          ) : null}
        </div>
      ))}

      <nav
        aria-label="More case studies"
        className="mt-20 border-t border-thread pt-8"
      >
        <p className="section-label">Next</p>
        <Link
          href={`/work/${next.slug}/`}
          className="group mt-3 block max-w-prose"
        >
          <span className="display text-xl text-silk transition-colors group-hover:text-spider sm:text-2xl">
            {next.title}
          </span>
          <span className="mt-2 block text-[0.95rem] leading-relaxed text-dust">
            {next.hook}
          </span>
        </Link>
      </nav>
    </article>
  );
}
