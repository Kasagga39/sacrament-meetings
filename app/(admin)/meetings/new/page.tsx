import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export default function CreateMeetingPage() {
  return (
    <section className="rounded-xl border border-stone-200 bg-paper p-6 shadow-sm">
      <h2 className="font-serif text-xl font-bold text-primary">Create meeting</h2>
      <p className="mt-2 text-stone-600">
        Add a new sacrament meeting to the planner. Once you save it, you will be taken back to
        the meetings list.
      </p>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" cancelHref="/meetings" />
    </section>
  );
}
