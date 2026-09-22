import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/base-url';
import { formatLongDate } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: MeetingPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const baseUrl = await getBaseUrl();
  let title = 'Meeting';

  try {
    const res = await fetch(`${baseUrl}/api/meetings/${encodeURIComponent(id)}`);
    if (res.ok) {
      const meeting = (await res.json()) as SacramentMeeting;
      title = formatLongDate(meeting.date);
    }
  } catch {
    title = 'Meeting';
  }

  return { title };
}

export default async function MeetingPage(props: MeetingPageProps) {
  const { id } = await props.params;
  const baseUrl = await getBaseUrl();
  let meeting: SacramentMeeting | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/meetings/${encodeURIComponent(id)}`);
    if (res.ok) {
      meeting = (await res.json()) as SacramentMeeting;
    }
  } catch {
    meeting = null;
  }

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}