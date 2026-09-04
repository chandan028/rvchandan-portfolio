/**
 * What I am trusted to own, as distinct from what I have touched.
 *
 * Seniority is a question about scope, and a technology list cannot answer it:
 * every one of these is a system I was on the hook for, including the on-call.
 * Each line is backed by a case study — if one stops being defensible there,
 * delete it here too.
 */

export type Ownership = {
  area: string;
  detail: string;
};

export const ownership: Ownership[] = [
  {
    area: 'Production backend systems',
    detail:
      'Java and Spring services on a 1M+ LOC platform — design, review, rollout, and the on-call that follows.',
  },
  {
    area: 'Schema evolution under load',
    detail:
      'Live migrations on tables with millions of rows, via expand–migrate–contract and dual writes rather than a maintenance window.',
  },
  {
    area: 'Money movement',
    detail:
      'Fee and settlement engines across two providers, webhook idempotency, reconciliation, and multi-currency correctness.',
  },
  {
    area: 'Trust and safety',
    detail:
      'A moderation path over three media types, gated by a labelled corpus that blocks a regression before it reaches a user.',
  },
  {
    area: 'Applied AI that verifies itself',
    detail:
      'LLM tooling constrained by structure and tests — sandboxed edits, generated verification, and a bounded loop that refuses rather than guesses.',
  },
];
