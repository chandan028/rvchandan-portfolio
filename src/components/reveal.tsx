import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react';

/**
 * Marks an element for the scroll-reveal observer.
 *
 * Deliberately a server component: it renders an attribute and a CSS custom
 * property and nothing else. All the behaviour lives in one observer mounted
 * once in the layout (see reveal-observer.tsx), so a page with forty revealed
 * elements ships zero extra client JavaScript for them.
 *
 * The hidden state is scoped to `html.js` in CSS, so with JavaScript off the
 * page renders fully visible instead of blank.
 *
 * Built with createElement rather than JSX — a polymorphic `as` prop widens
 * the JSX element type to a union, and TypeScript resolves the props of that
 * union to `never`.
 */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: {
  children: ReactNode;
  /** Stagger in ms. Siblings should step by roughly 100. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  return createElement(
    as,
    {
      'data-reveal': '',
      className,
      style: delay
        ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties)
        : undefined,
    },
    children,
  );
}
