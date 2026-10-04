import { logout } from '@/lib/auth-actions';

/**
 * A plain form so signing out still works when JavaScript has not loaded,
 * matching the rest of the planner.
 */
export default function SignOutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border border-white/50 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Sign out
      </button>
    </form>
  );
}
