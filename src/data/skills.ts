/**
 * Grouped and scannable. No proficiency levels, no bars, no percentages —
 * they are unfalsifiable and every reader discounts them.
 */

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Java', 'SQL', 'Groovy', 'JavaScript', 'TypeScript'],
  },
  {
    label: 'Frameworks',
    items: ['Spring Boot', 'Spring Security', 'Hibernate / JPA', 'Grails', 'REST'],
  },
  {
    label: 'Data',
    items: ['MySQL', 'PostgreSQL', 'Redis', 'Apache Solr', 'Liquibase', 'Quartz'],
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'Jenkins', 'Git', 'GCP', 'Azure', 'Logz.io'],
  },
  {
    label: 'Applied AI',
    items: [
      'LLM agents',
      'Tool use',
      'Gemini',
      'Vertex AI',
      'RAG',
      'MCP',
      'Eval harnesses',
    ],
  },
  {
    label: 'Payments',
    items: [
      'Stripe',
      'Razorpay',
      'Multi-currency settlement',
      'Reconciliation',
      'Webhook idempotency',
      'SCA / 3-D Secure',
    ],
  },
  {
    label: 'Practices',
    items: [
      'System design',
      'Schema migration',
      'Spock / JUnit',
      'Code review',
      'Observability',
      'On-call triage',
    ],
  },
];
