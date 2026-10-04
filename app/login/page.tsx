import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import LoginForm from '@/components/LoginForm';
import { safeRedirectPath } from '@/lib/safe-redirect';

export const metadata: Metadata = {
  title: 'Bishopric sign in',
  description:
    'Sign in to manage the Springfield 1st Ward sacrament meeting schedule, speakers, and program details.',
};

export default async function LoginPage(props: PageProps<'/login'>) {
  const session = await auth();

  if (session) {
    redirect('/meetings/new');
  }

  const searchParams = await props.searchParams;
  const next = safeRedirectPath(searchParams.next);

  return (
    <div className="mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16">
      <section className="rounded-xl border border-stone-200 bg-paper p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Leader tools
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-primary">Bishopric sign in</h1>
        <p className="mt-2 text-stone-600">
          Creating and editing agendas is limited to the bishopric. Sign in to reach the meeting
          planner tools.
        </p>

        <LoginForm next={next} />

        <p className="mt-6 text-sm text-stone-600">
          Just looking for this week&rsquo;s program?{' '}
          <Link
            href="/meetings"
            className="font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Browse the meetings
          </Link>{' '}
          without signing in.
        </p>
      </section>
    </div>
  );
}
