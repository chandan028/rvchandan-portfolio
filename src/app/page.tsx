import { Hero } from '@/components/hero';
import { MetricsBand } from '@/components/metrics-band';
import { Section } from '@/components/section';
import { WorkIndex } from '@/components/work-index';
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
        heading="Four systems, written up properly"
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

      <Section id="experience" label="Experience" heading="Where this happened">
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
