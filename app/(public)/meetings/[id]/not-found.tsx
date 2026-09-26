import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Meeting not found
      </p>
      <h1 className="font-serif text-3xl font-bold text-primary">
        We couldn&rsquo;t find that meeting
      </h1>
      <p className="max-w-xl text-stone-600">
        The meeting you&rsquo;re looking for may have been removed, or the address may be
        incorrect.
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