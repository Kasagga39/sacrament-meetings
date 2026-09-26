import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <section aria-label="Introduction" className="relative">
        <Image
          src="/chapel-hero.svg"
          alt="Chapel silhouette under a starry night sky"
          width={1600}
          height={800}
          priority
          className="h-72 w-full object-cover sm:h-96"
        />
      </section>

      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:py-16">
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
          Sacrament Meeting Planner
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-stone-700">
          Plan, review, and share the weekly sacrament meeting agenda for the
          Springfield 1st Ward. Browse past meetings, follow the program, or jump
          straight to this week&rsquo;s meeting.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/meetings"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            View All Meetings
          </Link>
          <Link
            href="/meetings/current"
            className="rounded-lg border-2 border-primary px-5 py-3 font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            This Week&rsquo;s Meeting
          </Link>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-3">
          <li className="rounded-xl border border-stone-200 bg-paper p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-primary">Follow the Agenda</h2>
            <p className="mt-2 text-sm text-stone-600">
              Hymns, prayers, speakers, and musical numbers are laid out in order for every meeting.
            </p>
          </li>
          <li className="rounded-xl border border-stone-200 bg-paper p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-primary">Print the Program</h2>
            <p className="mt-2 text-sm text-stone-600">
              Each agenda includes a print view so the full program can be shared with the ward.
            </p>
          </li>
          <li className="rounded-xl border border-stone-200 bg-paper p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-primary">Stay Current</h2>
            <p className="mt-2 text-sm text-stone-600">
              The This Week link always points to the most recent Sunday&rsquo;s meeting.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}