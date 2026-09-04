/**
 * The four numbers a recruiter should leave with.
 *
 * Every one of these is already argued for somewhere in the case studies —
 * this band is a summary of that work, not a separate set of claims. If a
 * number here stops being defensible in the prose, delete it from here too.
 *
 * `value` is the count-up target; `display` is what gets rendered once the
 * animation lands, so formatting never has to be reverse-engineered from a
 * float.
 */

export type Metric = {
  value: number;
  /** Decimal places to hold while counting. Keeps 1.03M from flickering. */
  precision: number;
  suffix: string;
  label: string;
  /** Where the number comes from. Links to the case study that earns it. */
  note: string;
  href?: string;
};

export const metrics: Metric[] = [
  {
    value: 5.5,
    precision: 1,
    suffix: 'M+',
    label: 'Students on the platform',
    note: 'The scale the systems I own run at, alongside 750K+ tutors.',
  },
  {
    value: 15,
    precision: 0,
    suffix: 'M',
    label: 'Rows migrated under live traffic',
    note: 'Identity re-modelled on the production member table, with no maintenance window and no forced re-login.',
    href: '/work/identity-migration/',
  },
  {
    value: 1.03,
    precision: 2,
    suffix: 'M',
    label: 'Lines of Java the agent searches',
    note: 'Structure-first retrieval across 601 Java and Grails domain models — not embeddings over chunked text.',
    href: '/work/ticket-to-pr-agent/',
  },
  {
    value: 2,
    precision: 0,
    suffix: '×',
    label: 'Promotions in 3 years',
    note: 'Associate SWE to SWE to AI Engineer, widening ownership at each step.',
  },
];
