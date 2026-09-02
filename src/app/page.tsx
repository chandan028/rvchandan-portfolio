import { Hero } from '@/components/hero';
import { Section } from '@/components/section';
import { WorkIndex } from '@/components/work-index';
import { ExperienceTimeline } from '@/components/experience-timeline';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { education } from '@/data/education';
import { site } from '@/data/site';

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section
        id="work"
        label="Selected work"
        heading="Four systems, written up properly"
      >
        <p className="mb-10 max-w-prose text-[0.95rem] leading-relaxed text-dust">
          Each one covers the problem, the constraints, the design decisions and
          at least one alternative I rejected — plus what I would do differently.
          They are longer than a resume bullet on purpose.
        </p>
        <WorkIndex />
      </Section>

      <Section id="experience" label="Experience" heading="Where this happened">
        <ExperienceTimeline />
      </Section>

      <Section id="project" label="Project" heading="Built outside work">
        {projects.map((project) => (
          <article key={project.name} className="border-l-2 border-spider pl-6 sm:pl-8">
            <h3 className="display text-lg text-silk sm:text-xl">
              {project.name}
            </h3>
            <p className="mt-2 max-w-prose text-[0.95rem] text-dust">
              {project.tagline}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-micro text-dust">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
            <div className="mt-5 space-y-4">
              {project.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="prose-body">
                  {paragraph}
                </p>
              ))}
            </div>
            {project.repo ? (
              <p className="mt-5 font-mono text-sm">
                <a href={project.repo} className="link-underline">
                  {project.repoLabel ?? project.repo} →
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </Section>

      <Section id="skills" label="Skills" heading="What I work with">
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {skills.map((group) => (
            <div
              key={group.label}
              className="border-t border-thread pt-4 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-6"
            >
              <dt className="section-label mb-2 sm:mb-0">{group.label}</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1.5 text-[0.95rem] text-silk/85">
                {group.items.map((item, i) => (
                  <span key={item}>
                    {item}
                    {i < group.items.length - 1 ? (
                      <span aria-hidden="true" className="ml-3 text-thread">
                        /
                      </span>
                    ) : null}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 border-t border-thread pt-4 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-6">
          <p className="section-label mb-2 sm:mb-0">Education</p>
          <div>
            {education.map((entry) => (
              <div key={entry.degree}>
                <p className="text-[0.95rem] text-silk">{entry.degree}</p>
                <p className="mt-1 font-mono text-micro text-dust">
                  {entry.institution} · {entry.location} · {entry.period} ·{' '}
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contact" label="Contact" heading="Get in touch">
        <p className="max-w-prose text-[0.95rem] leading-relaxed text-dust">
          Open to SDE 2, senior backend and AI engineering roles.
        </p>
        <p className="mt-6">
          <a
            href={`mailto:${site.email}`}
            className="display text-[clamp(1.5rem,6vw,2.75rem)] lowercase text-silk underline decoration-spider decoration-2 underline-offset-8 transition-colors hover:text-spider"
          >
            {site.email}
          </a>
        </p>
        <p className="mt-6 font-mono text-micro text-dust">{site.location}</p>
      </Section>
    </>
  );
}
