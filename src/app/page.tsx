import { Hero } from '@/components/hero';
import { MetricsBand } from '@/components/metrics-band';
import { Section } from '@/components/section';
import { WorkIndex } from '@/components/work-index';
import { Ownership } from '@/components/ownership';
import { ExperienceTimeline } from '@/components/experience-timeline';
import { ProjectCard } from '@/components/project-card';
import { SkillGrid } from '@/components/skill-grid';
import { ContactCta } from '@/components/contact-cta';

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Sits between the hero and the first section, on its own rhythm — the
          numbers are a summary of the work, not a section of it. */}
      <div className="pt-14 sm:pt-20">
        <MetricsBand />
      </div>

      <Section
        id="work"
        label="Selected work"
        heading="Deep dives into production systems"
        intro={
          <p className="max-w-prose text-[0.95rem] leading-relaxed text-dust">
            Each one covers the problem, the constraints, the design decisions
            and at least one alternative I rejected — plus what I would do
            differently. They are longer than a resume bullet on purpose.
          </p>
        }
      >
        <WorkIndex />
      </Section>

      {/*
        Scope, immediately after the evidence for it. "Senior" is a question
        about how much someone can be handed, and the four case studies above
        are the argument this section summarises.
      */}
      <Section
        id="ownership"
        label="Scope"
        heading="What I own"
        intro={
          <p className="max-w-prose text-[0.95rem] leading-relaxed text-dust">
            Systems I was on the hook for, including the on-call — as distinct
            from technologies I have touched.
          </p>
        }
      >
        <Ownership />
      </Section>

      <Section
        id="experience"
        label="Experience"
        heading="Payments, then platform, then AI"
        intro={
          <p className="max-w-prose text-[0.95rem] leading-relaxed text-dust">
            Three years on one platform, with ownership widening at each step.
            The AI work is built on the production knowledge that came first,
            not instead of it.
          </p>
        }
      >
        <ExperienceTimeline />
      </Section>

      <Section id="project" label="Project" heading="Built outside work">
        <ProjectCard />
      </Section>

      <Section id="skills" label="Skills" heading="What I work with">
        <SkillGrid />
      </Section>

      <Section id="contact" label="Contact" heading="Get in touch">
        <ContactCta />
      </Section>
    </>
  );
}
