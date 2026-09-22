'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export interface PaginationProps {
  totalPages: number;
  total: number;
}

function parsePage(value: string | null, totalPages: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(parsed, totalPages);
}

export default function Pagination({ totalPages, total }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return (
      <nav aria-label="Meetings pagination" className="mt-8">
        <p className="text-sm text-stone-600">
          {total} {total === 1 ? 'meeting' : 'meetings'} total
        </p>
      </nav>
    );
  }

  const currentPage = parsePage(searchParams.get('page'), totalPages);

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  const previousHref = currentPage > 1 ? buildHref(currentPage - 1) : undefined;
  const nextHref = currentPage < totalPages ? buildHref(currentPage + 1) : undefined;

  const linkClass =
    'rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400 disabled:hover:bg-white';

  return (
    <nav aria-label="Meetings pagination" className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-stone-600">
        {total} {total === 1 ? 'meeting' : 'meetings'} total
      </p>
      <div className="flex items-center gap-2">
        {previousHref ? (
          <Link href={previousHref} className={linkClass} aria-label="Previous page">
            &larr; Previous
          </Link>
        ) : (
          <span className={`${linkClass} cursor-not-allowed`} aria-disabled="true">
            &larr; Previous
          </span>
        )}
        <span className="px-2 text-sm text-stone-700">
          Page {currentPage} of {totalPages}
        </span>
        {nextHref ? (
          <Link href={nextHref} className={linkClass} aria-label="Next page">
            Next &rarr;
          </Link>
        ) : (
          <span className={`${linkClass} cursor-not-allowed`} aria-disabled="true">
            Next &rarr;
          </span>
        )}
      </div>
    </nav>
  );
}