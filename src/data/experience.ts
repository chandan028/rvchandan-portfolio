/**
 * The timeline. One line per role — deliberately not a second copy of the
 * case studies. `caseStudy` points at the slug that carries the real detail.
 */

export type Role = {
  title: string;
  period: string;
  mode: string;
  /** Exactly one sentence. If it needs two, it belongs in a case study. */
  line: string;
  caseStudy?: { slug: string; label: string }[];
};

export type Employer = {
  company: string;
  context?: string;
  location: string;
  period: string;
  note?: string;
  roles: Role[];
};

export const experience: Employer[] = [
  {
    company: 'UrbanPro.com',
    context: 'ThinkVidya Learning',
    location: 'Bengaluru, India',
    period: 'Sep 2023 — Present',
    note: 'Education marketplace, 5.5M+ students and 750K+ tutors, on a 1M+ LOC Java and Spring platform.',
    roles: [
      {
        title: 'AI Engineer',
        period: 'Aug 2026 — Present',
        mode: 'On-site',
        line: 'Build agentic developer tooling against the production codebase — a ticket-to-PR agent and an incident auto-triage pipeline that both write and verify their own code changes.',
        caseStudy: [
          { slug: 'ticket-to-pr-agent', label: 'The ticket-to-PR agent' },
        ],
      },
      {
        title: 'Software Engineer',
        period: 'May 2025 — Jul 2026',
        mode: 'Hybrid',
        line: 'Owned platform identity, the org-wide test and static-review tooling, international payments, and the trust-and-safety moderation stack.',
        caseStudy: [
          { slug: 'identity-migration', label: 'Identity on a live table' },
          { slug: 'moderation-eval-harness', label: 'Moderation eval harness' },
          { slug: 'money-movement', label: 'Money movement' },
        ],
      },
      {
        title: 'Associate Software Engineer',
        period: 'Sep 2023 — Apr 2025',
        mode: 'On-site',
        line: 'Owned the Razorpay integration and the fee and settlement engine, and cut p95 latency and peak database CPU on the highest-traffic endpoints.',
        caseStudy: [{ slug: 'money-movement', label: 'Money movement' }],
      },
    ],
  },
  {
    company: 'FACE Prep',
    location: 'Coimbatore, India',
    period: 'Jul 2023 — Aug 2023',
    roles: [
      {
        title: 'Technical Mentor',
        period: 'Jul — Aug 2023',
        mode: 'On-site',
        line: 'Mentored engineering students in Core Java and data structures through structured problem-solving and mock interviews.',
      },
    ],
  },
];
