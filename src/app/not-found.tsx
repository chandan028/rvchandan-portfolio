import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-shell px-5 py-32 sm:px-8">
      <p className="section-label">404</p>
      <h1 className="display mt-3 text-4xl text-silk">Nothing here</h1>
      <hr className="mt-6 h-1 w-20 border-0 bg-spider" />
      <p className="mt-6 max-w-prose text-dust">
        That page does not exist.
      </p>
      <p className="mt-8 font-mono text-sm">
        <Link href="/" className="link-underline">
          Back to the start
        </Link>
      </p>
    </div>
  );
}
