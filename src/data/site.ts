/**
 * Every piece of identity/contact copy on the site. Edit here, never in JSX.
 */

export const site = {
  name: 'R V Chandan',
  /**
   * The identity line. Backend engineering leads and applied AI is the
   * specialisation under it — not a second, competing identity. A reader who
   * takes only this line away should still know what I am.
   */
  discipline: 'Backend Engineer — Java · Spring Boot · Applied AI',
  /** One sentence: what I build, and at what scale. */
  positioning:
    'I build production backend systems for identity, payments and trust-and-safety on a 1M+ LOC Java and Spring platform serving 5.5M+ students and 750K+ tutors.',
  /** The arc. Three years read as a progression, not as a duration. */
  subline:
    'Payments first, then platform identity, now LLM tooling against the same codebase.',
  /**
   * Compact proof, sized for a six-second scan. Every item is defended by a
   * case study further down the page — nothing here is a claim on its own.
   */
  proof: [
    '3 years in production',
    '2 promotions',
    '15M-row live migration',
    '1M+ LOC platform',
  ],
  /** Availability. Stated plainly, but it is not the headline. */
  availability: 'Open to SDE 2 · Senior Backend · AI Engineering roles',
  role: 'Backend Engineer — Java, Spring Boot & Applied AI',
  location: 'Bengaluru, India',
  email: 'chandanrv97@gmail.com',
  github: 'https://github.com/chandan028',
  githubLabel: 'github.com/chandan028',
  linkedin: 'https://linkedin.com/in/r-v-chandan-dev',
  linkedinLabel: 'linkedin.com/in/r-v-chandan-dev',
  resume: '/resume.pdf',
  /**
   * Set this to the deployed origin before shipping. It builds absolute URLs
   * for Open Graph tags and the sitemap — relative URLs do not unfurl in
   * Slack or LinkedIn.
   */
  url: 'https://rvchandan.dev',
  description:
    'R V Chandan — backend engineer in Bengaluru working in Java, Spring Boot, payments, identity and applied AI. Deep dives on a live 15M-row identity migration, an autonomous ticket-to-PR agent over 1.03M LOC, an eval-gated moderation pipeline, and owning money movement across Razorpay and Stripe.',
} as const;

export const navLinks = [
  { href: '/#work', label: 'Work' },
  { href: '/#ownership', label: 'Scope' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#project', label: 'Project' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
] as const;
