import Link from 'next/link';

export default function EditMeetingNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-stone-200 bg-paper p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Meeting not found</p>
      <h2 className="font-serif text-2xl font-bold text-primary">
        We couldn&rsquo;t find that meeting to edit
      </h2>
      <p className="max-w-xl text-stone-600">
        It may have already been deleted, or the address may be incorrect. Pick a meeting from the
        list to edit it.
      </p>
      <Link
        href="/meetings"
        className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Back to all meetings
      </Link>
    </div>
  );
}
