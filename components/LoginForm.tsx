'use client';

import { useActionState } from 'react';

import { authenticate, type LoginFormState } from '@/lib/auth-actions';

const INITIAL_STATE: LoginFormState = { status: 'idle', message: '' };

const LABEL_CLASS = 'block text-sm font-semibold text-stone-800';
const INPUT_CLASS =
  'mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30';
const SUBMIT_CLASS =
  'inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-stone-400';

export interface LoginFormProps {
  /** Path inside this app to return to after a successful sign-in. */
  next: string;
}

export default function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(authenticate, INITIAL_STATE);

  return (
    <form action={formAction} aria-busy={isPending} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className={LABEL_CLASS}>
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="bishopric@springfield1stward.org"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="password" className={LABEL_CLASS}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={INPUT_CLASS}
        />
      </div>

      <button type="submit" disabled={isPending} className={SUBMIT_CLASS}>
        {isPending ? 'Signing in\u2026' : 'Sign in'}
      </button>
    </form>
  );
}
