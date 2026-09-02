import type { DiagramKey } from '@/data/case-studies';

/*
 * Boxes and arrows. No gradients, no icons, no fills beyond the surface colour.
 * Each diagram marks the one hard part in `spider` and leaves everything else
 * in `thread` — if two things are highlighted, nothing is.
 */

const SURFACE = '#141B31';
const LINE = '#26304F';
const TEXT = '#F2F4F8';
const MUTED = '#8A93A8';
const ACCENT = '#F03A42';
const MONO =
  'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace';

function Box({
  x,
  y,
  w,
  h,
  lines,
  accent = false,
  muted = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  accent?: boolean;
  muted?: boolean;
}) {
  const startY = y + h / 2 - ((lines.length - 1) * 15) / 2 + 4;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={SURFACE}
        stroke={accent ? ACCENT : LINE}
        strokeWidth={accent ? 1.5 : 1}
        strokeDasharray={muted ? '4 3' : undefined}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + i * 15}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={i === 0 ? 12 : 10.5}
          fill={i === 0 ? (accent ? ACCENT : TEXT) : MUTED}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({
  d,
  marker,
  accent = false,
  dashed = false,
}: {
  d: string;
  marker: string;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? ACCENT : LINE}
      strokeWidth={accent ? 1.5 : 1}
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd={`url(#${marker})`}
    />
  );
}

function Note({
  x,
  y,
  children,
  anchor = 'middle',
  accent = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: 'start' | 'middle' | 'end';
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={MONO}
      fontSize={10.5}
      fill={accent ? ACCENT : MUTED}
    >
      {children}
    </text>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={`${id}-head`}
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 8 4 0 8Z" fill={LINE} />
      </marker>
      <marker
        id={`${id}-head-accent`}
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 8 4 0 8Z" fill={ACCENT} />
      </marker>
    </defs>
  );
}

function Frame({
  title,
  viewBox,
  minWidth,
  children,
}: {
  title: string;
  viewBox: string;
  minWidth: number;
  children: React.ReactNode;
}) {
  return (
    /* Scrolls inside itself on narrow screens rather than shrinking to
       illegibility or pushing the page sideways. */
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={title}
        style={{ minWidth }}
        className="h-auto w-full"
      >
        <title>{title}</title>
        {children}
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- identity */

function IdentityDiagram() {
  const id = 'dg-identity';
  return (
    <Frame
      title="Before: a single member row is credential, profile and role together. After: a credential table stands alone, with independent tutor and student profiles referencing it, and a compatibility lookup mapping legacy member ids onto credentials."
      viewBox="0 0 760 300"
      minWidth={620}
    >
      <Defs id={id} />

      <Note x={20} y={22} anchor="start">
        BEFORE
      </Note>
      <Box
        x={20}
        y={92}
        w={210}
        h={78}
        lines={['member', 'credential + profile + role', '15M rows']}
      />
      <Note x={125} y={196}>
        one row = one identity
      </Note>
      <Note x={125} y={212}>
        two accounts if you are both
      </Note>

      <Arrow d="M250 131 L 316 131" marker={`${id}-head`} />
      <Note x={283} y={120}>
        split
      </Note>

      <Note x={340} y={22} anchor="start">
        AFTER
      </Note>
      <Box
        x={340}
        y={48}
        w={190}
        h={58}
        lines={['credential', 'email · password · OTP']}
      />
      <Arrow d="M400 106 L 400 152" marker={`${id}-head`} />
      <Arrow d="M470 106 L 470 152" marker={`${id}-head`} />
      <Box
        x={330}
        y={152}
        w={130}
        h={58}
        lines={['tutor_profile', 'own state']}
      />
      <Box
        x={476}
        y={152}
        w={130}
        h={58}
        lines={['student_profile', 'own state']}
      />

      <Arrow
        d="M126 172 C 126 252, 330 258, 396 240"
        marker={`${id}-head-accent`}
        accent
      />
      <Box
        x={560}
        y={48}
        w={186}
        h={58}
        lines={['compatibility lookup', 'legacy member.id → credential']}
        accent
      />
      <Arrow d="M560 77 L 534 77" marker={`${id}-head-accent`} accent />
      <Note x={653} y={124} accent>
        why nobody was logged out
      </Note>
      <Note x={470} y={272} accent>
        backfill: keyset batches, dual-written
      </Note>
    </Frame>
  );
}

/* ------------------------------------------------------------------- agent */

function AgentDiagram() {
  const id = 'dg-agent';
  return (
    <Frame
      title="A Jira issue enters structural retrieval over the domain model graph, then lexical and semantic file selection, then an edit inside an isolated git worktree, then test generation and execution. A failing verification returns to the edit step a bounded number of times before the run either opens a pull request or stops and reports."
      viewBox="0 0 860 290"
      minWidth={700}
    >
      <Defs id={id} />

      <Box x={14} y={70} w={120} h={62} lines={['Jira issue', 'one paragraph']} />
      <Arrow d="M134 101 L 168 101" marker={`${id}-head`} />

      <Box
        x={168}
        y={62}
        w={150}
        h={78}
        lines={['structural', 'retrieval', '601-model graph']}
        accent
      />
      <Arrow d="M318 101 L 352 101" marker={`${id}-head-accent`} accent />

      <Box
        x={352}
        y={62}
        w={150}
        h={78}
        lines={['file selection', 'lexical + semantic', 'inside that region']}
      />
      <Arrow d="M502 101 L 536 101" marker={`${id}-head`} />

      <Box
        x={536}
        y={62}
        w={140}
        h={78}
        lines={['edit', 'isolated', 'git worktree']}
      />
      <Arrow d="M676 101 L 710 101" marker={`${id}-head`} />

      <Box
        x={710}
        y={62}
        w={136}
        h={78}
        lines={['generate tests', 'run them', 'read the result']}
      />

      {/* Failure path: back to the edit step, bounded. */}
      <Arrow
        d="M778 140 L 778 196 L 606 196 L 606 140"
        marker={`${id}-head-accent`}
        accent
      />
      <Note x={692} y={212} accent>
        fails → edit again, bounded retries
      </Note>

      <Arrow d="M846 101 L 846 40 L 470 40" marker={`${id}-head`} />
      <Box x={330} y={12} w={140} h={56} lines={['pull request', 'review-ready']} />
      <Note x={556} y={32}>
        green
      </Note>

      {/* Give-up path: leaves the same box the retry loop does. */}
      <Arrow
        d="M820 140 L 820 252 L 470 252"
        marker={`${id}-head`}
        dashed
      />
      <Note x={648} y={244}>
        iterations exhausted
      </Note>
      <Box
        x={330}
        y={224}
        w={140}
        h={52}
        lines={['no PR', 'reports why']}
        muted
      />

      <Note x={14} y={22} anchor="start">
        STRUCTURE FIRST, THEN TEXT
      </Note>
    </Frame>
  );
}

/* -------------------------------------------------------------- moderation */

function ModerationDiagram() {
  const id = 'dg-moderation';
  return (
    <Frame
      title="Chat, voice and class recordings normalise to a transcript — voice and recordings via speech-to-text on Vertex AI — and then share a single policy verdict stage. High-confidence verdicts auto-action; low-confidence ones defer to a human queue. A labelled corpus feeds an evaluation harness that gates any prompt change before it reaches the verdict stage."
      viewBox="0 0 800 360"
      minWidth={660}
    >
      <Defs id={id} />

      <Note x={14} y={22} anchor="start">
        THREE MEDIA TYPES, ONE POLICY
      </Note>

      <Box x={14} y={44} w={130} h={44} lines={['chat']} />
      <Box x={14} y={104} w={130} h={44} lines={['voice call']} />
      <Box x={14} y={164} w={130} h={44} lines={['class recording']} />

      <Arrow d="M144 126 L 186 126" marker={`${id}-head`} />
      <Arrow d="M144 186 L 186 186" marker={`${id}-head`} />
      <Box
        x={186}
        y={122}
        w={140}
        h={68}
        lines={['speech-to-text', 'Vertex AI']}
      />

      <Arrow d="M144 66 C 260 66, 300 90, 356 122" marker={`${id}-head`} />
      <Arrow d="M326 156 L 356 156" marker={`${id}-head`} />
      <Box x={356} y={130} w={120} h={52} lines={['transcript']} />

      <Arrow d="M476 156 L 512 156" marker={`${id}-head`} />
      <Box
        x={512}
        y={122}
        w={150}
        h={68}
        lines={['policy verdict', 'one prompt, one policy']}
      />

      <Arrow d="M662 140 L 706 116" marker={`${id}-head`} />
      <Box x={674} y={62} w={112} h={48} lines={['auto-action']} />
      <Arrow d="M662 172 L 706 200" marker={`${id}-head`} />
      <Box
        x={674}
        y={200}
        w={112}
        h={48}
        lines={['human queue', 'defer']}
      />
      <Note x={796} y={270} anchor="end">
        kill switch per queue
      </Note>

      {/* The gate. Sits below the pipeline and points up into the verdict
          stage, because that is where it intervenes. */}
      <Box
        x={282}
        y={274}
        w={170}
        h={62}
        lines={['labelled corpus', 'ground truth']}
      />
      <Arrow d="M452 305 L 490 305" marker={`${id}-head-accent`} accent />
      <Box
        x={490}
        y={274}
        w={170}
        h={62}
        lines={['eval harness', 'gate: 10% FP / FN']}
        accent
      />
      <Arrow d="M575 274 L 575 196" marker={`${id}-head-accent`} accent />
      <Note x={266} y={305} anchor="end" accent>
        a prompt change stops here →
      </Note>
    </Frame>
  );
}

/* ------------------------------------------------------------------- money */

function MoneyDiagram() {
  const id = 'dg-money';
  return (
    <Frame
      title="A student payment enters through either the Razorpay or the Stripe adapter, both feeding one shared, provider-agnostic fee engine. The fee engine writes to the ledger, where settlement state is recorded rather than recomputed. The settlement job reads that recorded state to pay out tutors. Provider webhooks are deduplicated on the provider event id before they reach the ledger, and a reconciliation job compares ledger state against what the provider reports."
      viewBox="0 0 960 380"
      minWidth={760}
    >
      <Defs id={id} />

      <Note x={14} y={22} anchor="start">
        TWO PROVIDERS, ONE LEDGER
      </Note>

      <Box x={14} y={104} w={130} h={56} lines={['student pays']} />
      <Arrow d="M144 120 L 184 88" marker={`${id}-head`} />
      <Arrow d="M144 144 L 184 176" marker={`${id}-head`} />

      <Box
        x={184}
        y={44}
        w={160}
        h={56}
        lines={['Razorpay adapter', 'INR']}
      />
      <Box
        x={184}
        y={164}
        w={160}
        h={56}
        lines={['Stripe adapter', 'multi-currency · SCA']}
      />
      <Arrow d="M344 88 L 392 118" marker={`${id}-head`} />
      <Arrow d="M344 176 L 392 146" marker={`${id}-head`} />

      <Box
        x={392}
        y={104}
        w={176}
        h={56}
        lines={['fee engine', '% or flat · instalments']}
      />
      <Note x={480} y={180}>
        provider-agnostic
      </Note>

      <Arrow d="M568 132 L 596 132" marker={`${id}-head-accent`} accent />
      <Note x={684} y={86} accent>
        the defect lived here
      </Note>
      <Box
        x={596}
        y={98}
        w={176}
        h={68}
        lines={['ledger', 'settled state recorded,', 'never recomputed']}
        accent
      />

      <Arrow d="M772 132 L 800 132" marker={`${id}-head`} dashed />
      <Box
        x={800}
        y={98}
        w={140}
        h={68}
        lines={['reconciliation', 'ledger vs provider']}
        muted
      />
      <Note x={870} y={188}>
        the only outside check
      </Note>

      <Arrow d="M740 166 L 740 260 L 800 260" marker={`${id}-head`} />
      <Box
        x={800}
        y={232}
        w={140}
        h={56}
        lines={['settlement job', 'reads recorded state']}
      />
      <Arrow d="M870 288 L 870 316" marker={`${id}-head`} />
      <Box x={800} y={320} w={140} h={48} lines={['tutor payout']} />

      <Box
        x={184}
        y={300}
        w={170}
        h={56}
        lines={['provider webhook', 'at-least-once']}
      />
      <Arrow d="M354 328 L 404 328" marker={`${id}-head`} />
      <Box
        x={404}
        y={300}
        w={164}
        h={56}
        lines={['dedupe on', 'provider event id']}
      />
      <Arrow d="M568 328 L 684 328 L 684 172" marker={`${id}-head`} />
    </Frame>
  );
}

const registry: Record<DiagramKey, () => React.JSX.Element> = {
  identity: IdentityDiagram,
  agent: AgentDiagram,
  moderation: ModerationDiagram,
  money: MoneyDiagram,
};

export function Diagram({
  which,
  caption,
}: {
  which: DiagramKey;
  caption: string;
}) {
  const Component = registry[which];
  return (
    <figure className="my-12 border-y border-thread/60 py-8">
      <Component />
      <figcaption className="mt-6 max-w-prose font-mono text-micro leading-relaxed text-dust">
        {caption}
      </figcaption>
    </figure>
  );
}
