import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

/**
 * Absolute origin used to resolve URL-based metadata (Open Graph image links).
 * Vercel exposes the deployment URL, so production needs no extra configuration.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const SITE_TITLE = 'Sacrament Meeting Planner';
const SITE_DESCRIPTION =
  'Plan and review the weekly sacrament meeting agenda for the Springfield 1st Ward.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Sacrament Meeting Planner',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  keywords: [
    'sacrament meeting',
    'ward agenda',
    'meeting program',
    'Springfield 1st Ward',
    'bishopric',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout(props: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}