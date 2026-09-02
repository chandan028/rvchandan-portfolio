/**
 * Two ornaments, both pure geometry. No gradients, no filters, no icon font.
 */

/** The mark in the header. A spider reduced to a body and eight legs. */
export function SpiderMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <ellipse cx="12" cy="13" rx="3.1" ry="4.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.6" r="2" fill="currentColor" stroke="none" />
      <path d="M9 10.5 4.5 7.5 3 4M9 13 3.5 13 1.5 15.5M9.4 15.5 5 18.5 4 22" />
      <path d="M15 10.5 19.5 7.5 21 4M15 13 20.5 13 22.5 15.5M14.6 15.5 19 18.5 20 22" />
    </svg>
  );
}

/**
 * A quarter web, anchored into the corner of a card. Radial threads plus
 * catenary-ish cross-threads — drawn, not stock art.
 */
export function WebCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {/* Radials from the top-right anchor point. */}
      <path d="M120 0 0 40M120 0 22 68M120 0 46 96M120 0 74 118M120 0 120 120M120 0 0 0" />
      {/* Cross-threads sagging between the radials. */}
      <path d="M120 22C96 26 74 40 62 62 50 84 44 100 40 120" />
      <path d="M120 52C104 56 92 66 84 80 76 94 74 106 72 120" />
      <path d="M120 82C112 84 106 90 102 98 98 106 97 113 96 120" />
    </svg>
  );
}
