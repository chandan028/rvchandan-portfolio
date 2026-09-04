/**
 * Grouped, and now ranked. No proficiency levels, no bars, no percentages —
 * they are unfalsifiable and every reader discounts them.
 *
 * What changed is hierarchy. A flat list of forty technologies reads as a
 * keyword dump and tells a reader nothing about where the depth is, so `core`
 * marks the handful I work in daily and would be examined on. The rest is
 * real, and stays, because it is also the surface a recruiter filters against.
 */

export type SkillGroup = {
  label: string;
  /** Rendered with emphasis. Reserve it for genuine depth. */
  core?: boolean;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: 'Core',
    core: true,
    items: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'Hibernate / JPA',
      'MySQL',
      'PostgreSQL',
      'REST',
      'SQL',
    ],
  },
  {
    label: 'Applied AI',
    core: true,
    items: [
      'LLM agents',
      'Tool use / MCP',
      'Gemini',
      'Vertex AI',
      'RAG',
      'Eval harnesses',
    ],
  },
  {
    label: 'Payments',
    core: true,
    items: [
      'Razorpay',
      'Stripe',
      'Multi-currency settlement',
      'Reconciliation',
      'Webhook idempotency',
      'SCA / 3-D Secure',
    ],
  },
  {
    label: 'Distributed-systems practice',
    items: [
      'Idempotency',
      'Concurrency & race conditions',
      'Schema evolution',
      'Backward compatibility',
      'Asynchronous processing',
      'Caching',
      'Observability',
      'Failure recovery',
    ],
  },
  {
    label: 'Platform & tooling',
    items: [
      'Docker',
      'Jenkins',
      'GCP',
      'Azure',
      'Liquibase',
      'Quartz',
      'Apache Solr',
      'Redis',
      'Logz.io',
      'Git',
    ],
  },
  {
    label: 'Also written',
    items: ['Groovy', 'Grails', 'TypeScript', 'JavaScript', 'Spock / JUnit'],
  },
];
