'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export interface MeetingErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  retry?: () => void;
}

const PRIMARY_BUTTON_CLASS =
  'inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export default function MeetingError({ error, reset, retry }: MeetingErrorProps) {
  useEffect(() => {
    // Swap this for a real error reporter (Sentry, etc.) when one is available.
    console.error('Meeting route failed to render.', error);
  }, [error]);

  function handleRetry() {
    if (typeof retry === 'function') {
      retry();
      return;
    }
    reset();
  }

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-xl border border-stone-200 bg-paper p-6 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Error</p>
      <h2 className="font-serif text-2xl font-bold text-primary">
        We couldn&rsquo;t load this page
      </h2>
      <p className="max-w-xl text-stone-600">
        Something went wrong on our end while loading meeting data. Your records are safe. Try
        again, or head back to the meetings list and start from there.
      </p>
      {error.digest ? (
        <p className="text-xs text-stone-500">
          Reference code: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleRetry} className={PRIMARY_BUTTON_CLASS}>
          Try again
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to all meetings
        </Link>
      </div>
    </div>
  );
}
