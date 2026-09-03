'use client';

import { useEffect } from 'react';

/**
 * The single IntersectionObserver behind every `data-reveal` element.
 *
 * Mounted once in the root layout. A MutationObserver picks up nodes added
 * after hydration — client-side route changes, mainly — so revealed content on
 * a case-study page behaves the same as on the home page.
 *
 * Elements are unobserved once shown: nothing re-animates on the way back up.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;

    // Belt and braces — the inline script in the layout normally does this
    // before first paint. If it was stripped, we still want the animation.
    root.classList.add('js');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || typeof IntersectionObserver === 'undefined') {
      document
        .querySelectorAll('[data-reveal]')
        .forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      },
      // Fire slightly before the element clears the fold so the animation is
      // already settling by the time it is properly in view.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    const observeAll = () => {
      document
        .querySelectorAll('[data-reveal]:not(.is-visible)')
        .forEach((el) => io.observe(el));
    };

    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
