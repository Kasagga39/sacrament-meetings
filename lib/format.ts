import type { MeetingType } from './types';

export function formatLongDate(dateString: string): string {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function meetingTypeLabel(meetingType: MeetingType): string {
  switch (meetingType) {
    case 'testimony':
      return 'Testimony Meeting';
    case 'regular':
      return 'Regular Sacrament Meeting';
    case 'stake':
      return 'Stake Conference';
    case 'general':
      return 'General Conference';
  }
}