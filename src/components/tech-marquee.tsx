import { skills } from '@/data/skills';

/**
 * The stack, moving. It exists because a recruiter scanning for keywords
 * should hit them in the first screen, not four sections down — and because a
 * band of motion under a static hero is what stops the fold feeling flat.
 *
 * Built structurally rather than by group name. An earlier version looked each
 * group up by its label with a non-null assertion, so renaming a group in the
 * data file compiled cleanly and then crashed the build at render. Core groups
 * lead, the rest fill in behind them, and nothing here knows what any group is
 * called.
 */
const ITEMS = Array.from(
  new Set([
    ...skills.filter((g) => g.core).flatMap((g) => g.items),
    ...skills.filter((g) => !g.core).flatMap((g) => g.items),
  ]),
).slice(0, 24);

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-x-8 pr-8 font-mono text-micro uppercase text-dust"
    >
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap">
          {item}
          <span aria-hidden="true" className="text-thread">
            ◆
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TechMarquee() {
  return (
    <div
      className="edge-fade relative overflow-hidden border-y border-thread/50 bg-ink/40 py-3.5 backdrop-blur-sm"
      // Not a live region and not decorative — it is a plain list of the stack.
      aria-label="Core stack"
    >
      {/* Duplicated so the loop is seamless at -50%; the copy is hidden from
          assistive tech so the stack is announced once. */}
      <div className="marquee-track flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
