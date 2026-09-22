import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-10">
      <header className="no-print mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-primary">
          Meeting Planner Tools
        </h1>
        <p className="mt-2 text-stone-600">
          Leader-facing tools for planning and maintaining sacrament meetings.
          Sign-in and role-based access will be added in Week 05.
        </p>
        <nav aria-label="Admin" className="mt-4">
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/meetings/new"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                New Meeting
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
}