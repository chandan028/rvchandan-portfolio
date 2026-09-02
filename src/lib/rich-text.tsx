import { Fragment, type ReactNode } from 'react';

/**
 * Minimal inline renderer so case-study copy can stay in plain typed data
 * instead of JSX. Three tokens only — anything more and the data files start
 * turning back into markup.
 *
 *   **bold**             → <strong>
 *   *emphasis*           → <em>
 *   `code`               → <code>
 *   [VERIFY: something]  → a visible marker, so gaps are impossible to miss
 *
 * Bold is matched before emphasis in the alternation, so ** never gets eaten
 * one asterisk at a time.
 */

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[VERIFY:[^\]]+\])/g;

export function richText(input: string): ReactNode[] {
  return input.split(TOKEN).filter(Boolean).map((chunk, i) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-silk">
          {chunk.slice(2, -2)}
        </strong>
      );
    }

    if (chunk.startsWith('*') && chunk.endsWith('*')) {
      return (
        <em key={i} className="italic">
          {chunk.slice(1, -1)}
        </em>
      );
    }

    if (chunk.startsWith('`') && chunk.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded-sm bg-weave px-1 py-0.5 font-mono text-[0.9em] text-web"
        >
          {chunk.slice(1, -1)}
        </code>
      );
    }

    if (chunk.startsWith('[VERIFY:')) {
      return (
        <mark
          key={i}
          className="mx-0.5 inline border-l-2 border-spider bg-spider/10 px-1.5 py-0.5 font-mono text-[0.8em] text-silk"
        >
          <span className="sr-only">Unverified detail: </span>
          {chunk.slice(1, -1)}
        </mark>
      );
    }

    return <Fragment key={i}>{chunk}</Fragment>;
  });
}
