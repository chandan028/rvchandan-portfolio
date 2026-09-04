import { projects } from '@/data/projects';
import { Reveal } from './reveal';

/**
 * Side projects. One card per project, on the same raised surface as the work
 * grid so the page reads as one system rather than two.
 */
export function ProjectCard() {
  return (
    <div className="space-y-5">
      {projects.map((project, i) => (
        <Reveal key={project.name} delay={i * 100}>
          <article className="surface relative overflow-hidden p-6 sm:p-8">
            {/* Accent edge. Replaces the old left border — same signal, but it
                follows the card's radius instead of cutting the corner off. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-spider via-spider/50 to-transparent"
            />

            <h3 className="display text-lg text-silk sm:text-xl">
              {project.name}
            </h3>
            <p className="mt-2 max-w-prose text-[0.95rem] text-dust">
              {project.tagline}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-4">
              {project.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="prose-body">
                  {paragraph}
                </p>
              ))}
            </div>

            {project.repo ? (
              <p className="mt-6">
                <a href={project.repo} className="btn-ghost group">
                  {project.repoLabel ?? project.repo}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-swift group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </p>
            ) : null}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
