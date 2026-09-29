'use client';

import MeetingError from '@/components/MeetingError';

interface AdminMeetingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  retry?: () => void;
}

export default function AdminMeetingsError({ error, reset, retry }: AdminMeetingsErrorProps) {
  return <MeetingError error={error} reset={reset} retry={retry} />;
}
