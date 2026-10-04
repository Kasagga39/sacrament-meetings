import Link from 'next/link';

import { auth } from '@/auth';
import SignOutButton from './SignOutButton';

/**
 * Shows the right control for the current visitor: a link to the login page
 * when nobody is signed in, or the signed-in account with a sign-out button.
 */
export default async function AuthNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-white/50 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Bishopric sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-white/80 sm:inline">
        {session.user.name ?? session.user.email}
      </span>
      <SignOutButton />
    </div>
  );
}
