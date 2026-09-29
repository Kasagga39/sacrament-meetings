import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';
import { formatLongDate } from '@/lib/format';

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMeetingPage({ params }: EditMeetingPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const meetingId = Number(id);

  let meeting;

  try {
    meeting = await getMeetingById(meetingId);
  } catch (error) {
    console.error(`EditMeetingPage: failed to load meeting ${id}.`, error);
    throw new Error('We could not load this meeting. Please try again in a moment.');
  }

  if (!meeting) {
    notFound();
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-paper p-6 shadow-sm">
      <h2 className="font-serif text-xl font-bold text-primary">Edit meeting</h2>
      <p className="mt-2 text-stone-600">
        Update the agenda for {formatLongDate(meeting.date)}. Saving returns you to the meetings
        list.
      </p>
      <MeetingForm
        action={updateMeeting.bind(null, meeting.id)}
        meeting={meeting}
        submitLabel="Save changes"
        cancelHref="/meetings"
      />
    </section>
  );
}
