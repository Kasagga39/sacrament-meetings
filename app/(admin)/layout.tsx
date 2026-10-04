import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-10">
      <header className="no-print mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-primary">
          Meeting Planner Tools
        </h1>
        <p className="mt-2 text-stone-600">
          Leader-facing tools for planning and maintaining sacrament meetings. You are signed in
          as{' '}
          <span className="font-semibold text-stone-800">
            {session.user?.name ?? session.user?.email ?? 'a bishopric member'}
          </span>
          .
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
            <li>
              <Link
                href="/meetings"
                className="rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                All Meetings
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
}
