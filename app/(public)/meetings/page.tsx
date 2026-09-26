import { Suspense } from 'react';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { DEFAULT_PAGE_SIZE, getMeetings } from '@/lib/meetings-db';

export default async function MeetingsPage(props: PageProps<'/meetings'>) {
  const searchParams = await props.searchParams;

  const query = typeof searchParams.query === 'string' ? searchParams.query.trim() : '';
  const rawPage = typeof searchParams.page === 'string' ? searchParams.page : '1';

  const { meetings, total, totalPages } = await getMeetings({
    query: query || undefined,
    page: Number(rawPage),
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-primary">Sacrament Meetings</h1>
        <p className="mt-2 text-stone-600">
          Select a meeting to view the full agenda and a printable program.
        </p>
      </header>

      <Suspense
        fallback={<div className="h-11 animate-pulse rounded-lg border border-stone-200 bg-paper" />}
      >
        <MeetingSearch />
      </Suspense>

      <p className="text-sm text-stone-600" aria-live="polite">
        {total === 0 ? (
          'No meetings match your search.'
        ) : (
          <>
            Showing {meetings.length} of {total} {total === 1 ? 'meeting' : 'meetings'}
            {query ? (
              <>
                {' '}
                matching &ldquo;{query}&rdquo;
              </>
            ) : null}
            .
          </>
        )}
      </p>

      {meetings.length === 0 ? (
        <p className="rounded-lg border border-stone-200 bg-paper px-4 py-6 text-stone-600">
          No meetings found.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="flex">
              <MeetingCard meeting={meeting} />
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} total={total} />
      </Suspense>
    </div>
  );
}