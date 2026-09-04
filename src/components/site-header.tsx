'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { navLinks, site } from '@/data/site';
import { SpiderMark } from './spider-mark';

/** Section ids the nav points at, in document order. */
const SECTION_IDS = navLinks.map((l) => l.href.replace('/#', ''));

export function SiteHeader() {
  const [progress, setProgress] = useState(0);
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  /* Scroll progress + the shadow that separates the bar from the page. */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
      setLifted(window.scrollY > 8);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* Which section the reader is in. Absent on case-study pages, which is fine. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // The most-visible section wins, so a short section sandwiched between
        // two long ones still takes the highlight while it owns the viewport.
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of seen) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { threshold: [0, 0.15, 0.4, 0.75], rootMargin: '-20% 0px -45% 0px' },
    );

    for (const id of SECTION_IDS) {
      const node = document.getElementById(id);
      if (node) io.observe(node);
    }
    return () => io.disconnect();
  }, []);

  /* Escape closes the mobile panel; a locked scroll would be overkill here. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 bg-ink/80 backdrop-blur-md transition-shadow duration-300 ease-out ${
        lifted ? 'shadow-e2' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-mono text-sm text-silk transition-colors hover:text-spider"
        >
          <SpiderMark className="h-4 w-4 text-spider transition-transform duration-300 ease-settle group-hover:rotate-12 group-hover:scale-110" />
          <span className="whitespace-nowrap">{site.name}</span>
        </Link>

        <nav aria-label="Sections" className="flex items-center gap-2 sm:gap-5">
          <ul className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              const id = link.href.replace('/#', '');
              const isActive = active === id;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative flex min-h-[2.5rem] items-center rounded-inner px-3 font-mono text-micro uppercase transition-colors duration-200 ${
                      isActive ? 'text-silk' : 'text-dust hover:text-silk'
                    }`}
                  >
                    {link.label}
                    {/* The underline animates in rather than appearing. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-1.5 h-px origin-left bg-spider transition-transform duration-300 ease-settle ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <a
            href={site.resume}
            className="hidden min-h-[2.25rem] items-center rounded-inner bg-weave/70 px-3.5 font-mono text-micro uppercase text-silk shadow-e1 transition-[scale,box-shadow] duration-150 ease-out hover:shadow-e2 active:scale-[0.96] sm:inline-flex"
          >
            Résumé
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-inner text-silk shadow-e1 transition-[scale,box-shadow] duration-150 ease-out active:scale-[0.96] sm:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {/*
              Both bars stay in the DOM and transform into the cross, so the
              open and close states both animate without a motion library.
            */}
            <span aria-hidden="true" className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-300 ease-swift ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-300 ease-swift ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </nav>
      </div>

      {/* Reading progress. Sits on the header's bottom edge as a hairline. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-thread/60"
      >
        <div
          className="h-full origin-left bg-spider"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/*
        Mobile panel. Kept mounted and collapsed by max-height so opening and
        closing both animate — an unmounted panel can only ever animate in.
      */}
      <div
        id="mobile-nav"
        className={`overflow-hidden bg-ink/95 shadow-e2 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-swift sm:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="mx-auto max-w-shell px-5 pb-4 pt-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="flex min-h-[2.75rem] items-center font-mono text-sm uppercase text-dust transition-colors hover:text-silk"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              className="flex min-h-[2.75rem] items-center font-mono text-sm uppercase text-spider"
            >
              Résumé (PDF)
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
