'use server';

import { AuthError, CredentialsSignin } from 'next-auth';
import { z } from 'zod';

import { signIn, signOut } from '@/auth';
import { safeRedirectPath } from './safe-redirect';

export interface LoginFormState {
  status: 'idle' | 'error';
  message: string;
}

const CredentialsSchema = z.object({
  email: z
    .string({ error: 'Enter the email address for your bishopric account.' })
    .trim()
    .min(1, 'Enter the email address for your bishopric account.'),
  password: z.string({ error: 'Enter your password.' }).min(1, 'Enter your password.'),
});

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

/**
 * Verifies the bishopric credentials and starts an Auth.js session.
 *
 * A successful sign-in never returns: Auth.js throws a redirect (either to the
 * page the visitor asked for, or back to `/login` when the credentials are
 * wrong).
 */
export async function authenticate(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = CredentialsSchema.safeParse({
    email: readText(formData, 'email'),
    password: readText(formData, 'password'),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      status: 'error',
      message: issue?.message ?? 'Enter your email address and password.',
    };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeRedirectPath(readText(formData, 'next')),
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        status: 'error',
        message: 'That email and password combination is not correct.',
      };
    }

    if (error instanceof AuthError) {
      console.error('authenticate: Auth.js could not start a session.', error);
      return {
        status: 'error',
        message: 'We could not sign you in right now. Please try again in a moment.',
      };
    }

    // Successful sign-ins redirect by throwing, so this must keep propagating.
    throw error;
  }

  return { status: 'idle', message: '' };
}

/** Ends the Auth.js session and returns the visitor to the public site. */
export async function logout(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
