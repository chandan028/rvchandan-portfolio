/**
 * Every piece of identity/contact copy on the site. Edit here, never in JSX.
 */

export const site = {
  name: 'R V Chandan',
  /** One sentence. This is the whole positioning statement. */
  positioning:
    'Backend engineer building payment, identity and LLM-backed systems on a 1M+ LOC Java and Spring platform.',
  /** Sub-line under the hero rule. Kept to two clauses. */
  subline:
    'Three years at an education marketplace serving 5.5M students and 750K tutors. Promoted twice.',
  role: 'Software Engineer — Backend (Java, Spring Boot) & Applied AI',
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
    'R V Chandan — backend engineer in Bengaluru. Case studies on migrating identity across a live 15M-row table, an autonomous ticket-to-PR agent over 1.03M LOC, an eval-gated moderation pipeline, and owning money movement across Razorpay and Stripe.',
} as const;

export const navLinks = [
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#project', label: 'Project' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
] as const;
