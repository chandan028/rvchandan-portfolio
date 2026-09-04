/**
 * Case-study copy. Prose lives here so it can be edited without touching JSX.
 *
 * Inline conventions understood by the renderer (src/lib/rich-text.tsx):
 *   **bold**              → emphasis
 *   `code`                → inline mono
 *   [VERIFY: something]   → renders as a visible marker. Replace before launch.
 *
 * Every study carries a "What I'd do differently" section. Keep it.
 */

export type Section = {
  heading: string;
  body: string[];
};

export type DiagramKey = 'identity' | 'agent' | 'moderation' | 'money';

export type CaseStudy = {
  slug: string;
  /** Short title used in nav and on the home-page index. */
  title: string;
  /** One line. This is the whole pitch on the home page. */
  hook: string;
  /** Standfirst at the top of the case-study page. Two or three sentences. */
  standfirst: string;
  role: string;
  period: string;
  /**
   * The constraints, compressed to one scannable line. This is what a reader
   * skimming four cards uses to judge whether the work was actually hard.
   */
  scale: string;
  stack: string[];
  diagram: DiagramKey;
  diagramCaption: string;
  sections: Section[];
  /** Per-page meta description. */
  description: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'identity-migration',
    title: 'Migrating identity on a live 15M-row table',
    hook: 'One credential, two independent profiles — moved under live traffic with nobody logged out.',
    standfirst:
      'The platform assumed a person was either a tutor or a student. Thousands of people were both, and were paying for it with two accounts. Fixing that meant changing what identity means, on a table with 15M rows, while everyone stayed logged in.',
    role: 'Software Engineer',
    period: 'May 2025 — Jul 2026',
    scale: '15M rows · live traffic · no forced re-login · 170 services',
    stack: ['Java', 'Spring Boot', 'Spring Security', 'MySQL', 'Liquibase', 'Hibernate'],
    diagram: 'identity',
    diagramCaption:
      'Before, one row was the credential, the profile and the role at once. After, the credential stands alone and each profile hangs off it independently.',
    description:
      'How I re-architected platform identity into a dual-profile model — separating credential from profile across a live 15M-row member table and rewiring Spring Security onto it with no downtime and no forced re-login.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'UrbanPro is a two-sided marketplace: students find tutors, tutors find students. The original schema encoded that split at the deepest possible level. A single `member` table, where one row was simultaneously the login credential, the public profile, and the answer to "is this person a tutor or a student".',
          'That works right up until someone is both. A working professional who teaches Java at weekends and is studying for a certification on weekdays is one human being with one email address, and the platform had no way to represent them. In practice they made two accounts with two email addresses, and every downstream system treated them as two unrelated people — two payment histories, two support identities, two sets of notification preferences, two reputations that could not reinforce each other.',
          'The cost was not only user-facing. Anything that wanted to reason about a *person* rather than an account — fraud checks, support tooling, lifetime value, notification de-duplication — was quietly getting the wrong answer for exactly the users who engaged with the platform most.',
          'The hard part was never the idea. Splitting credential from profile is the obvious modelling fix and any engineer would propose it in ten seconds. The hard part was that `member.id` was the most heavily referenced column in the database, and the system referencing it most was the authentication layer that every single request passes through.',
        ],
      },
      {
        heading: 'Constraints',
        body: [
          '**Live traffic, no maintenance window.** The marketplace peaks on evenings and weekends and there was no hour where a write freeze on the member table was acceptable. A big-bang cutover was ruled out before design started — not as a preference, but because the backfill plus index rebuild would not fit inside any window the business would grant. [VERIFY: your estimate for a single-pass backfill, if you measured one]',
          '**No forced re-login.** Every active session had to survive the change. That is a stronger constraint than it first sounds: session tokens carried the old member identifier as their subject, so that identifier could not simply stop meaning what it used to mean.',
          '**The existing foreign keys stay.** [VERIFY: number] tables referenced `member.id`. Rewriting all of them in one change was never on the table, so the new model had to coexist with the old identifier rather than replace it.',
          '**170 backend services could not move at once.** Anything that read identity had to keep compiling and keep working against the old shape while the new shape was being populated underneath it.',
          '**Spring Security was coupled to the old principal.** The authenticated principal was, in effect, "a member row", and authorisation checks across the codebase asked that principal what role it had. Both of those assumptions were about to become false.',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'I split one concept into two: a **credential**, the thing you log in with, and a **profile**, the thing you act as. One credential owns zero or one tutor profile and zero or one student profile, independently. Being a tutor no longer says anything at all about whether you are also a student.',
          'The migration ran as **expand, migrate, contract**, which is the only pattern that satisfies "live traffic" and "no downtime" simultaneously. The expand phase added the credential and profile tables alongside the existing member table without removing anything, and started dual-writing: every write that touched identity wrote both the old shape and the new one inside the same transaction, so the two could not drift.',
          'The migrate phase backfilled 15M rows in bounded batches against a keyset cursor rather than an offset. Keyset matters here for two reasons — batch cost stays flat as the cursor advances instead of degrading linearly, and a failed batch can be retried from its own boundary instead of restarting the pass. Throughput was tuned to hold replication lag inside its normal band rather than to finish quickly. The backfill was allowed to take as long as it needed. [VERIFY: batch size and total backfill wall-clock time]',
          'The session problem I solved by making the old identifier *resolvable* rather than by invalidating it. The authenticated principal became a small object carrying the credential id plus the currently active profile, resolved per request. Tokens whose subject was a legacy member id still resolved, through a compatibility lookup that mapped that identifier to its credential and its default profile. Nobody was logged out, because from the token’s point of view nothing had changed.',
          'Authorisation then moved from asking "what role is this user" to asking "what profile is this request acting as" — which is the question those checks had been trying to ask all along. That reframing is what let one credential hold two profiles without every `@PreAuthorize` in the codebase becoming ambiguous.',
          '**The alternative I rejected:** adding a second role flag to the member row, so one account could be marked as both tutor and student. It is dramatically less work — one column, no new tables, no backfill, no session concerns — and it was the first thing suggested. I rejected it because it fixes the presentation and not the model. The two profiles hold genuinely independent state: separate visibility, separate verification status, separate onboarding completeness, separate suspension. Flattening that onto one row means each of those fields either grows a `tutor_` and a `student_` variant or acquires a conditional meaning, and the schema decays into exactly the ambiguity we were trying to remove. It buys six weeks and costs the next three years.',
          'I also rejected running the backfill as one long transaction. It would have been simpler to reason about and would have given a clean rollback, but the lock footprint on a 15M-row table under live write traffic was not survivable.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The dual-profile model shipped with no downtime and no forced re-login. One credential now holds independent tutor and student profiles, and a person who is both is one person to every system downstream.',
          'How I knew it worked, in descending order of how much I trusted the signal. First, a **reconciliation job** that walked the old and new shapes and asserted they agreed row for row, running continuously through the dual-write period — a non-zero divergence count was the alarm for a hole in the dual-write path. [VERIFY: how many divergences reconciliation caught, and what caused them]. Second, **session survival measured directly** as the authentication failure rate across the cutover, which stayed flat. Third, the disappearance of the duplicate-account support tickets we had been fielding every week. [VERIFY: any before/after number on duplicate-account support volume]',
          '[VERIFY: total migration duration end to end, and whether a rollback was needed at any phase]',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'I would have built the reconciliation job **before** the dual-write rather than alongside it. I wrote them in parallel, which meant that for the first stretch of dual-writing I was trusting the dual-write to be correct with nothing independently checking it. Nothing bad came of it — but that was luck, not design. A defect in that window would have produced silently wrong rows that the later reconciliation would then have had to distinguish from legitimately new ones.',
          'I would also have **contracted faster**. The compatibility lookup mapping legacy member ids to credentials was meant to be temporary scaffolding, and temporary scaffolding that works has no natural pressure to be removed. Every service still reading identity through it is a service that still depends on the old model, and the longer it lives the more new code gets written on top of it. I should have given the contract phase a date at design time and treated slipping that date as a real cost rather than a non-event. [VERIFY: whether the compatibility lookup has since been removed]',
          'And I underestimated how much of this was a product decision wearing a schema costume. "When you sign up as a tutor, does your student profile exist yet?" and "what does switching profiles do to your active session?" are not migration questions, but they blocked the migration — and I ran into them later than I should have, because I had framed the work as pure infrastructure.',
        ],
      },
    ],
  },

  {
    slug: 'ticket-to-pr-agent',
    title: 'An agent that turns a ticket into a pull request',
    hook: 'Reads a Jira issue, finds the right files in 1.03M lines, edits in a sandbox, and verifies its own diff.',
    standfirst:
      'The interesting problem in an autonomous coding agent is not the editing. It is retrieval — deciding which five files out of a 1.03M-line, 601-model codebase a one-paragraph ticket is actually about — and then refusing to trust the result until it has been tested.',
    role: 'AI Engineer',
    period: 'Aug 2026 — Present',
    scale: '1.03M LOC · 601 domain models · sandboxed edits · bounded retries',
    stack: ['Java', 'Groovy', 'Gemini', 'Tool use / MCP', 'git worktree', 'Jira API'],
    diagram: 'agent',
    diagramCaption:
      'The loop. Retrieval narrows structurally before it narrows textually; the edit happens in a throwaway worktree; verification can send the run back, but only a bounded number of times.',
    description:
      'How I built an autonomous ticket-to-pull-request agent: structure-first retrieval across a 1.03M-LOC codebase, sandboxed edits in an isolated git worktree, and a bounded self-verification loop before it opens a PR.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The platform is 1.03M lines of Java and Groovy across 601 domain models, accumulated over more than a decade. A meaningful share of the ticket queue is not intellectually hard — a validation that needs tightening, a field that needs adding to a response, a null check in a path that recently started receiving nulls. The work is small. Finding where the work goes is not.',
          'For a new engineer, that gap *is* the onboarding curve. For an experienced one it is still twenty minutes of searching before five minutes of typing. That ratio is what made this worth automating: the expensive part is search, and search over a well-structured codebase is something a model with the right index is genuinely good at.',
          'So the agent had to run the whole path — read the Jira issue, locate the affected code, make the change, prove the change does something, and open a pull request a human is willing to review. Anything short of a review-ready PR just relocates the work instead of removing it.',
        ],
      },
      {
        heading: 'Constraints',
        body: [
          '**It cannot touch anything shared.** No commits to a shared branch, no writes into a working tree another process might be using, no mutation of anything outside its own sandbox. An agent that can corrupt a developer’s checkout is worse than no agent at all.',
          '**The diff must be reviewable by someone who was not in the loop.** That rules out large speculative refactors even when they would be correct. A 400-line diff from an agent gets rubber-stamped or ignored, and both of those outcomes are worse than a small diff that does less.',
          '**Bounded cost per ticket.** Every retrieval round and every verification round costs tokens and wall-clock time. Without a hard ceiling, an agent that is failing will keep spending to fail. [VERIFY: your actual per-ticket budget or iteration ceiling]',
          '**Names collide, constantly.** Across 601 models the same word means different things in different bounded contexts. A ticket that says "the enrolment status is wrong" is ambiguous by default, and any retrieval strategy that treats the codebase as a bag of text will return the wrong context with total confidence.',
          '[VERIFY: the source-code and data-handling policy for sending repository content to a model provider, and how the design satisfied it]',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'Retrieval is layered, and the layers narrow in a deliberate order. The first pass is **structural, not semantic**: the domain model graph — entity names, their relationships, the packages and services that own them — is indexed as a map of the system, and the ticket text is resolved against that map to select a *region* of the codebase. Only inside that region does lexical and semantic search run to pick specific files. Structure first, then text.',
          'That ordering is the single decision that made retrieval work. It exploits something true of this codebase and invisible to a generic RAG pipeline: a 601-model Java system is not an undifferentiated pile of text, it has a strong machine-readable ownership structure that tells you where a concept lives before you have read a line of implementation.',
          'The edit happens in an **isolated git worktree**, created per ticket. That is what makes the sandbox cheap. The agent gets a real, complete, independent checkout at a known base commit on its own branch, with no shared state and nothing to clean up beyond deleting a directory. The blast radius of a wrong edit is exactly one throwaway folder.',
          'Then the part that matters: **it verifies its own diff before a human sees it.** The agent generates tests for the change it just made, runs them, and reads the result. A failure feeds back into the edit step with the failure output as context and the loop runs again — bounded, so it cannot spin. If it exhausts its iterations without a green run it does not open a PR, and says why. That refusal is a far more useful output than a plausible-looking diff.',
          'The PR body is assembled from what the run actually did: the ticket, the files retrieval selected and the reason it selected them, the diff, and the test results. A reviewer can audit the reasoning instead of only the output — which is the difference between reviewing an agent’s work and guessing at it.',
          '**The alternative I rejected:** flat vector RAG over chunked source files. This is the default architecture for the problem and it is what I tried first. It degrades badly here for a specific, diagnosable reason — embedding similarity over code rewards surface token overlap, and when `status`, `enrolment` and `payment` each appear across dozens of unrelated contexts, the top-k results are consistently plausible and consistently wrong. Worse, they are wrong in a way the model cannot detect, because every retrieved chunk looks locally relevant. Structure-first retrieval fixes this by making disambiguation an explicit, cheap step rather than hoping the embedding space encoded it. [VERIFY: any measured retrieval-accuracy comparison between the two approaches]',
          'I also rejected pushing directly to a feature branch on the shared remote before verification. It would have simplified the plumbing considerably. It also means every failed run leaves debris for a human to clean up, and that cost lands on precisely the people the tool exists to help.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The agent runs the full path end to end: Jira issue in, review-ready pull request out, with retrieval reasoning and test results attached to the PR.',
          'The same machinery underpins a second system — a **production incident auto-triage pipeline** that ingests Logz.io error streams, correlates each alert back to the responsible source path through the same structural index, posts a root-cause summary to the linked Jira issue, and raises a tested fix PR. That reuse is the strongest evidence the retrieval layer was built at the right level of abstraction: the second application needed a new front end onto the index, not a new index.',
          '[VERIFY: how many tickets the agent has handled, what share of its PRs merged with no human changes, and what share were closed unmerged — merge rate is the first number an interviewer will ask for]',
          '[VERIFY: whether you track a false-start rate, i.e. runs that exhausted their iterations without producing a PR]',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'I would have built the **evaluation set before the agent**. I evaluated the way most people evaluate agents — running it on real tickets and reading the output — which tells you whether *this run* was good and almost nothing about whether the system is improving. A fixed set of tickets with known-correct target files, scored automatically, turns every subsequent change from a judgement call into a measurement. I learned this lesson properly on the moderation work, and I wish the order had been reversed.',
          'I would **measure retrieval separately from editing**. Today a failed run is one event, but it has two very different causes: retrieval handed the editor the wrong files, or retrieval was right and the edit was wrong. Those need completely different fixes, and collapsing them into a single success metric means the metric cannot tell you which one to work on. Scoring retrieval alone — did the selected file set contain the file a human actually changed — is cheap, and would have been the highest-value instrument in the system.',
          'And I would have tightened the stop condition sooner. The first version was too willing to keep trying, because a loop that gives up *feels* like a failure while a loop that keeps going *feels* like effort. It is the other way round. An agent that stops cleanly and reports why is a tool; one that burns its budget producing a confident wrong diff is a liability.',
        ],
      },
    ],
  },

  {
    slug: 'moderation-eval-harness',
    title: 'Moderating three media types, gated by an eval harness',
    hook: 'Chat, voice and class recordings through one verdict path — and the accuracy gate mattered more than the prompt.',
    standfirst:
      'Building a moderation classifier is a week of work. Knowing whether a change to it made things better or worse is the entire problem. The prompt was never the hard part; the harness that refused to let a worse prompt ship was.',
    role: 'Software Engineer',
    period: 'May 2025 — Jul 2026',
    scale: '3 media types · one policy · 10% accuracy gate · staged rollout',
    stack: ['Java', 'Spring Boot', 'Google Vertex AI', 'GCP Cloud Storage', 'Quartz'],
    diagram: 'moderation',
    diagramCaption:
      'Three media types normalise to transcript, then share one verdict stage. The eval harness sits between a prompt change and production, not after it.',
    description:
      'How I built a trust-and-safety moderation pipeline for chat, voice and class recordings on Vertex AI — and why the labelled evaluation corpus and accuracy gate mattered more than the classifier prompt.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A marketplace where adults tutor students one-to-one has an obligation to know what is happening in that room. Harm arrives as chat messages, as voice calls, and as recorded classes — three completely different input formats carrying the same small set of policy questions.',
          'Moderation was human. Reviewers worked through queues of flagged content, which is accurate and does not scale, and gets slower exactly when volume spikes — which is exactly when it matters.',
          'The obvious framing is "build a classifier". That framing is a trap, and it is the reason most moderation projects fail slowly rather than quickly. A classifier is easy to build and impossible to *change safely*: someone edits a prompt to catch a case that got missed, nobody can see what that edit did to the thousand cases it used to get right, and the system degrades one well-intentioned improvement at a time. The genuinely hard requirement was not "classify content", it was **"make it possible to change the classifier and know what happened"**.',
          'And the two failure directions are not symmetric. A false negative means harmful content stayed up for a while longer. A false positive means a real tutor with a legitimate class was silently blocked — which destroys trust in the platform faster than the harm the system was built to prevent.',
        ],
      },
      {
        heading: 'Constraints',
        body: [
          '**Three input formats, one policy.** The policy questions are the same across chat, voice and recordings. Anything that answered them three separate times would drift three separate ways.',
          '**False positives are the expensive error.** Blocking a real class is worse than being slow on a borderline one. The system needed to be tuned against that asymmetry rather than against raw accuracy.',
          '**Human reviewers were the fallback, and they have finite capacity.** Any design that punts too much to humans has not automated anything; any design that punts too little removes the safety net.',
          '**No ground truth existed at the start.** There was no labelled dataset — only queues of past decisions of varying consistency. [VERIFY: how the labelled evaluation corpus was assembled, how many items it holds, and who labelled it]',
          '**Recordings are large and processing is not instant.** [VERIFY: the latency budget or SLA for a class recording verdict]',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'The first decision was to **collapse three media types into one judgement**. Everything normalises to a transcript first — chat already is one, voice and recordings become one through speech-to-text on Vertex AI — and only then does a single verdict stage run against a single policy. Media handling and policy judgement became separate problems, which meant a policy change was one change instead of three.',
          'The second decision was the one that mattered. I built a **labelled evaluation corpus** and an **accuracy harness that sits between a prompt change and production**. Any change to the classifier — prompt, model, threshold — is scored against the corpus, and a change that breaches **10% false-positive or false-negative** does not ship. Not a dashboard someone checks afterwards: a gate that blocks the change.',
          'That inverts the usual relationship. Without it, prompt engineering is a series of confident untested edits and the system’s quality is a random walk. With it, the prompt is cheap and safe to change, because the harness catches a regression before a user does. Every hour spent on the corpus bought more accuracy than an hour spent on the prompt would have — which is unintuitive right up until the first time the gate rejects a change you were sure was an improvement.',
          'Rollout was **staged at 10% of traffic**, with per-queue kill switches and an explicit **defer-to-human path** for low-confidence verdicts. Four human approval queues moved behind the automation, but the human path stayed reachable rather than being removed — the system routes to a person when it is uncertain, instead of guessing and being wrong at scale. [VERIFY: your resume says a 50% rollout and the brief says 10% — pick the accurate one]',
          '**The alternative I rejected:** a separate purpose-built classifier per media type, which is the natural decomposition and looks cleaner on a whiteboard. I rejected it because it triples the surface that has to be evaluated and keeps three policies in sync by hand. Three classifiers means three corpora, three sets of thresholds, and three chances for the definition of a violation to drift apart — and drift between them is invisible until an incident review turns up two systems that disagreed about the same content.',
          'I also rejected auto-actioning on the first release at full confidence. Every verdict in the initial window was scored against what the human queue decided, which is what made the next section possible.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The pipeline runs across chat, voice and class recordings against one policy, with prompt changes gated on the 10% false-positive/false-negative bound.',
          'The result I would actually put in front of an interviewer is a failure, not a success. **The first release over-rejected.** In production it flagged materially more content than the human baseline would have. Because the rollout was staged and the human path was still live, the cost of that was contained — but the reason I could *fix* it rather than argue about it was that the corpus already existed. I pulled a labelled sample of real production traffic, measured exactly where the classifier and the humans disagreed, and recalibrated against that measurement instead of against intuition. [VERIFY: what the initial false-positive rate was, what it became, and what the specific recalibration was — threshold, prompt, or policy definition]',
          'That is the whole argument for the harness in one incident: the same bug without a labelled corpus is a month of people relitigating whether the model is "too aggressive". With one, it is a measurement and a fix.',
          '[VERIFY: current false-positive and false-negative rates against the corpus, and the share of content the pipeline now handles without a human]',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'I would have built the corpus **before the first release**, not in response to it. I had a version of the harness when the over-rejection surfaced, and that is the only reason the diagnosis was quick — but I was still assembling labelled data reactively, under time pressure, from an incident. Labelled data gathered calmly before launch is better data, and it would have caught the over-rejection in evaluation instead of in production.',
          'I would **split the thresholds by category**. A single 10% bound across all violation types treats every category as equally costly and equally hard, and they are not — some are near-unambiguous and should be gated far tighter, others are genuinely contested and a 10% disagreement rate may be close to the human ceiling. One global number was the right thing to ship first and the wrong thing to keep.',
          'And I would **measure the humans too**. The corpus treats human decisions as ground truth, but reviewers disagree with each other, and I never quantified by how much. Without an inter-rater agreement number there is a floor on classifier accuracy that I cannot see — and I may have spent effort chasing the last few points of agreement with a baseline that does not agree with itself. [VERIFY: whether inter-rater agreement was ever measured]',
        ],
      },
    ],
  },

  {
    slug: 'money-movement',
    title: 'Owning money movement',
    hook: 'The fee and settlement engine, a defect that double-counted settled amounts, and an expansion into two new markets.',
    standfirst:
      'Payments code is judged differently from other code. A rendering bug is embarrassing; a settlement bug takes money from a real person and takes their trust with it. I owned this path from the first Razorpay integration through a mis-charge defect to a multi-currency Stripe launch.',
    role: 'Associate Software Engineer → Software Engineer',
    period: 'Sep 2023 — Jul 2026',
    scale: '2 providers · one ledger · idempotent webhooks · 2 new markets',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Razorpay', 'Stripe', 'Quartz'],
    diagram: 'money',
    diagramCaption:
      'Two providers, one ledger. Webhooks are idempotent on the provider event id; the settlement job reads ledger state rather than recomputing from orders.',
    description:
      'Owning the fee and settlement engine at UrbanPro: instalments, percentage versus flat fees, refunds and reversals; fixing a defect that double-counted already-settled amounts; and opening US and UAE revenue with a multi-currency Stripe integration.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A marketplace does not just take payments, it *splits* them. Money arrives from a student and has to be divided between the platform and the tutor, on rules that are genuinely complicated: some fees are a percentage and some are flat, some payments are instalments against a larger commitment, and any of it can be refunded or reversed after the split has already been calculated.',
          'That last clause is where the difficulty lives. A refund is not a payment with a minus sign. It has to unwind a fee that has already been computed, possibly already been settled, and possibly been settled as part of a batch containing dozens of other transactions. Every one of those states needs a correct answer, and "correct" is not a matter of opinion — someone can check.',
          'The specific failure I was brought into was a **mis-charge defect that double-counted already-settled amounts**. Money that had been through settlement was being picked up and counted again, which meant users were billed for amounts that had already been accounted for. [VERIFY: what surfaced the defect — a user report, a reconciliation mismatch, or a finance query?]',
          'Later, the problem changed shape: the platform wanted revenue from the US and UAE, which meant a second payment provider, currencies that were not INR, and a regulatory regime — European-style strong customer authentication — that the existing flow had no concept of.',
        ],
      },
      {
        heading: 'Constraints',
        body: [
          '**The ledger is live and it is real money.** There is no rerunning a settlement to see what happens. Every fix has to be correct in one attempt, and every migration has to be reversible or provably safe.',
          '**Webhooks are unreliable by contract, not by accident.** Payment providers guarantee at-least-once delivery, which means duplicates are normal traffic and every handler has to be idempotent. A double-processed webhook in a payments system is a double charge.',
          '**Settlements had already gone out.** Fixing the double-counting defect could not simply correct a formula going forward — historical records were already wrong and money had already moved on them.',
          '**Two providers, not a replacement.** Razorpay stays for India. Stripe is added for the US and UAE. The fee logic must not fork per provider, or the two will drift and only one of them will get the next bug fix.',
          '[VERIFY: transaction volume or GMV through the settlement engine — the scale number is missing and it is the first thing a payments interviewer asks]',
        ],
      },
      {
        heading: 'Approach',
        body: [
          'The root of the double-counting was a **state boundary that was implied rather than recorded**. Settlement determined what to include by recomputing eligibility from order data at run time, which means the answer to "has this been settled" was derived rather than stored — and any derivation that disagrees with reality, on a retry or a partial batch or an edge case in refund timing, silently includes something it should have excluded.',
          'The fix was to make settlement state **an explicit fact in the ledger rather than a computation**. Once a line item is settled, that is recorded against the line item, and the settlement job reads that state instead of re-deriving it. A retry then becomes safe by construction: the second pass sees the recorded state and skips, where before it recomputed and included.',
          'Correcting the historical damage was a separate exercise from correcting the code, and I treated it as one. Identify affected records, quantify the exposure, and issue corrections against a reviewed list — rather than writing a script that "fixes" the ledger in place, which is how a billing bug becomes a billing incident. [VERIFY: how affected users were identified, how the corrections were issued, and the amount recovered]',
          'For Stripe, the design rule was **one fee engine, two providers**. Provider-specific concerns — checkout session shape, webhook signature verification, SCA/3-D Secure challenge handling, currency — live behind an adapter. Fee calculation, settlement and refund logic sit above it and do not know which provider a payment came from. Multi-currency is handled by recording the transaction currency and the amount as the provider reported it, and never re-deriving amounts from a converted figure.',
          'Every webhook handler is **idempotent on the provider’s event id**, recorded before the effect is applied. That single decision removes an entire class of duplicate-processing bugs and it is the first thing I would check in any payments codebase I inherited.',
          '**The alternative I rejected:** computing fees at read time — deriving each split on demand from the order and the current fee configuration, rather than recording the split when the payment happens. It is appealing because it means fee-rule changes apply everywhere instantly and there is no denormalised state to keep in sync. It is also the same class of mistake that caused the original defect. If the fee configuration changes, historical transactions silently start reporting different splits than the ones actually settled, and the system loses the ability to answer "what did we charge this person, at the time we charged them" — which is the only question that matters in a billing dispute. Fees are recorded at the moment of the transaction, immutably.',
          'I also rejected a separate settlement path for Stripe. It would have shipped faster. It would also have meant the next refund-timing bug got fixed in one of two places.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The double-counting defect was fixed at its cause rather than patched at its symptom, and users who had been incorrectly billed were made whole. [VERIFY: number of affected users and total amount recovered]',
          'The Stripe integration opened **US and UAE revenue channels** end to end: multi-currency checkout, SCA/3-D Secure, idempotent webhook reconciliation, and explicit retry and failure handling — sharing one fee and settlement engine with Razorpay. [VERIFY: launch date, and any revenue or transaction figure from the new markets]',
          'How I knew the settlement fix worked: the reconciliation between what the engine believed it had settled and what the provider reported. That is the only check that actually closes the loop, because it compares against an authority outside the system. [VERIFY: whether an automated reconciliation job exists, how often it runs, and what it does on a mismatch]',
          'Beyond payments, I cut p95 latency and peak database CPU on the highest-traffic endpoints — Redis caching on hot read paths, batched rewrites of N+1 ORM access, and covering indexes on the queries that were driving the CPU. [VERIFY: before/after p95 and CPU numbers]',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'I would have written the **reconciliation job before the settlement fix**, not after. The fix was correct, but for a period the evidence that it was correct came from reading the code and the corrected records — not from an independent daily comparison against the provider. In a payments system the reconciliation *is* the test. It should have existed before the engine did, and if I owned this from scratch today it would be the first thing built.',
          'I would have modelled the ledger as **append-only from the start**. Settlement state was added as a recorded fact once the defect forced the issue, which is the right shape arrived at the wrong way. An append-only ledger where every state change is an entry rather than an update makes the original bug structurally impossible — you cannot double-count something whose settlement is an immutable entry — and it gives you the audit trail for free. Retrofitting that onto a live ledger is considerably more expensive than starting there.',
          'And I would have pushed harder on **alerting rather than reporting**. The defect was detectable from data the system already had; nothing was watching for the specific signal. A ledger that can tell you it disagrees with itself, unprompted, is worth more than any amount of after-the-fact analysis. The lesson generalises past payments, and it is the same lesson as the eval harness in the moderation work: build the thing that tells you you are wrong before you build the thing that might be.',
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
