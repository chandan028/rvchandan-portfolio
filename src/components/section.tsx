import type { ReactNode } from 'react';
import { Reveal } from './reveal';

/**
 * Section shell. The label sits beside the heading on a shared rule rather
 * than stacked above it — a left-hand label is structure, a centred one is
 * decoration.
 *
 * The header reveals ahead of its own body so a section announces itself
 * before its content arrives, rather than everything landing at once.
 */
export function Section({
  id,
  label,
  heading,
  intro,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  /** Optional standfirst, revealed with the header. */
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mx-auto max-w-shell scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
    >
      <Reveal>
        <div className="mb-10 grid gap-2 border-b border-thread pb-4 sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-6">
          <p className="section-label">{label}</p>
          <h2
            id={`${id}-heading`}
            className="display text-xl text-silk sm:text-2xl"
          >
            {heading}
          </h2>
        </div>
        {intro ? <div className="mb-10">{intro}</div> : null}
      </Reveal>
      {children}
    </section>
  );
}
