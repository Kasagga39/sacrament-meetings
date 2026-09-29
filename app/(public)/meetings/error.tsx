'use client';

import MeetingError from '@/components/MeetingError';

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  retry?: () => void;
}

export default function MeetingsError({ error, reset, retry }: MeetingsErrorProps) {
  return <MeetingError error={error} reset={reset} retry={retry} />;
}
