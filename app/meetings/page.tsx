import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/base-url';
import { formatLongDate } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

export default async function MeetingsPage(props: PageProps<'/meetings'>) {
  const searchParams = await props.searchParams;
  const date = typeof searchParams.date === 'string' ? searchParams.date.trim() : undefined;

  const baseUrl = await getBaseUrl();
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  let meetings: SacramentMeeting[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/meetings${query}`);
    if (res.ok) {
      meetings = (await res.json()) as SacramentMeeting[];
    }
  } catch {
    meetings = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-primary">Sacrament Meetings</h1>
        <p className="mt-2 text-stone-600">
          Select a meeting to view the full agenda and a printable program.
        </p>
        {date ? (
          <p className="mt-2 text-sm text-accent">
            Showing meetings for {formatLongDate(date)}. Check the date format (YYYY-MM-DD) if
            nothing appears.
          </p>
        ) : null}
      </header>

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
    </div>
  );
}