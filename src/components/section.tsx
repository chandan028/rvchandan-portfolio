import type { ReactNode } from 'react';

/**
 * Section shell. The label sits beside the heading on a shared rule rather
 * than stacked above it — a left-hand label is structure, a centred one is
 * decoration.
 */
export function Section({
  id,
  label,
  heading,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mx-auto max-w-shell px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="mb-10 grid gap-2 border-b border-thread pb-4 sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-6">
        <p className="section-label">{label}</p>
        <h2
          id={`${id}-heading`}
          className="display text-xl text-silk sm:text-2xl"
        >
          {heading}
        </h2>
      </div>
      {children}
    </section>
  );
}
