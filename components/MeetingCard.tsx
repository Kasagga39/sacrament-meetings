import Link from 'next/link';
import { formatLongDate, meetingTypeLabel } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block h-full rounded-xl border border-stone-200 bg-paper p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <article className="flex h-full flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {meetingTypeLabel(meeting.meetingType)}
        </p>
        <h2 className="font-serif text-xl font-bold text-primary">
          {formatLongDate(meeting.date)}
        </h2>
        <dl className="mt-2 space-y-1 text-sm text-stone-600">
          <div>
            <dt className="inline font-semibold text-stone-700">Conducting: </dt>
            <dd className="inline">{meeting.conducting}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-stone-700">Presiding: </dt>
            <dd className="inline">{meeting.presiding}</dd>
          </div>
        </dl>
        <p className="mt-auto pt-3 text-sm font-semibold text-primary group-hover:underline">
          View agenda &rarr;
        </p>
      </article>
    </Link>
  );
}