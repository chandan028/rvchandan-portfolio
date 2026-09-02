export type Project = {
  name: string;
  tagline: string;
  stack: string[];
  body: string[];
  repo?: string;
  repoLabel?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    name: 'Yodhha NotesAI',
    tagline: 'AI exam-prep platform for UPSC, NEET, JEE and GATE aspirants.',
    stack: ['Spring Boot', 'PostgreSQL', 'Gemini 2.5 Flash', 'Docker'],
    body: [
      'Gemini 2.5 Flash generates MCQs, explanations and study plans on demand. Generation is the expensive part, so every response goes through a cache keyed on the question shape rather than the raw prompt — repeated syllabus topics across users hit the cache instead of the model, which is what keeps per-user cost viable at all.',
      'Auth is JWT with BCrypt password hashing and OTP verification, with role-based access control over a normalised JPA schema. Real-time mock tests run against the same generation path, and the whole thing deploys as a Docker image.',
    ],
    repo: 'https://github.com/chandan028',
    repoLabel: '[VERIFY: repo URL for Yodhha NotesAI]',
  },
];
