import Link from 'next/link';
import DeleteMeetingButton from './DeleteMeetingButton';
import { formatLongDate, meetingTypeLabel } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

const SECONDARY_LINK_CLASS =
  'inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const meetingDate = formatLongDate(meeting.date);

  return (
    <article className="relative flex h-full w-full flex-col gap-1 rounded-xl border border-stone-200 bg-paper p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        {meetingTypeLabel(meeting.meetingType)}
      </p>
      <h2 className="font-serif text-xl font-bold text-primary">
        <Link
          href={`/meetings/${meeting.id}`}
          className="after:absolute after:inset-0 after:rounded-xl after:content-[''] after:focus-visible:outline after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-primary focus-visible:underline"
        >
          {meetingDate}
          <span className="sr-only"> &mdash; view the full agenda</span>
        </Link>
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
      <p className="mt-auto pt-3 text-sm font-semibold text-primary">View agenda &rarr;</p>

      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-3">
        <Link href={`/meetings/${meeting.id}/edit`} className={SECONDARY_LINK_CLASS}>
          Edit
          <span className="sr-only"> the meeting for {meetingDate}</span>
        </Link>
        <DeleteMeetingButton meetingId={meeting.id} meetingDate={meetingDate} />
      </div>
    </article>
  );
}
