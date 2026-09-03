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
    label: 'Students served',
    note: 'Marketplace scale the platform runs at, alongside 750K+ tutors.',
  },
  {
    value: 15,
    precision: 0,
    suffix: 'M',
    label: 'Rows migrated live',
    note: 'Identity re-modelled under production traffic — no downtime, nobody logged out.',
    href: '/work/identity-migration/',
  },
  {
    value: 1.03,
    precision: 2,
    suffix: 'M',
    label: 'Lines of Java searched',
    note: 'A 601-model codebase the ticket-to-PR agent retrieves against.',
    href: '/work/ticket-to-pr-agent/',
  },
  {
    value: 2,
    precision: 0,
    suffix: '×',
    label: 'Promotions in 3 years',
    note: 'Associate SWE to SWE to AI Engineer, on the same platform.',
  },
];
