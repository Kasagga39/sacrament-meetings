import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';


const DEMO_ACCOUNT = {
  email: 'bishopric@springfield1stward.org',
  password: 'sacrament123',
};

const CredentialsSchema = z.object({
  email: z
    .string({ error: 'Enter the email address for your bishopric account.' })
    .trim()
    .min(1, 'Enter the email address for your bishopric account.'),
  password: z
    .string({ error: 'Enter your password.' })
    .min(1, 'Enter your password.'),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const expectedEmail = process.env.AUTH_USER_EMAIL ?? DEMO_ACCOUNT.email;
        const expectedPassword = process.env.AUTH_USER_PASSWORD ?? DEMO_ACCOUNT.password;

        const matches =
          parsed.data.email.toLowerCase() === expectedEmail.toLowerCase() &&
          parsed.data.password === expectedPassword;

        if (!matches) {
          return null;
        }

        return {
          id: 'bishopric',
          name: 'Springfield 1st Ward Bishopric',
          email: expectedEmail,
        };
      },
    }),
  ],
});
