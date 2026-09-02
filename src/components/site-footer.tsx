import { site } from '@/data/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-thread/60">
      <div className="mx-auto flex max-w-shell flex-col gap-3 px-5 py-8 font-mono text-micro text-dust sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          {site.name} · {site.location}
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={`mailto:${site.email}`} className="hover:text-silk">
            Email
          </a>
          <a href={site.github} className="hover:text-silk">
            GitHub
          </a>
          <a href={site.linkedin} className="hover:text-silk">
            LinkedIn
          </a>
          <a href={site.resume} className="hover:text-silk">
            Résumé
          </a>
        </p>
      </div>
    </footer>
  );
}
