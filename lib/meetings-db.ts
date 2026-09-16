import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-09-13',
    meetingType: 'regular',
    presiding: 'Bishop Mark Taylor',
    conducting: 'Brother Alex Johnson',
    announcements: [
      'Stake Temple Night is this Tuesday at 7:00 PM.',
      'Sign-ups for the ward service project close after sacrament meeting.',
      'New-member welcome dinner next Sunday at the meetinghouse.',
    ],
    openingHymn: { number: 134, title: 'I Know That My Redeemer Lives' },
    openingPrayer: 'Sister Rachel Adams',
    wardBusiness: [
      { description: 'Sustaining of Brother Paul Nguyen as ward missionary leader.' },
      { description: 'Reminder to renew temple recommends with the bishopric after the meeting.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 184, title: 'Upon the Cross of Calvary' },
    speakers: [
      { name: 'Bishop Mark Taylor', topic: 'The Atonement of Jesus Christ', type: 'speaker' },
      { name: 'Ward Choir', topic: 'When I Survey the Wondrous Cross', type: 'musical-number' },
      { name: 'Sister Olivia Bennett', topic: 'Living the Gospel Daily', type: 'speaker' },
    ],
    closingHymn: { number: 193, title: 'I Stand All Amazed' },
    closingPrayer: 'Brother Ethan Wood',
  },
  {
    id: 2,
    date: '2026-09-06',
    meetingType: 'testimony',
    presiding: 'Bishop Mark Taylor',
    conducting: 'Brother David Hansen',
    announcements: [
      'First Sunday of the month: members are invited to share their testimonies.',
      'The youth fund-raising car wash will be held Saturday at 9:00 AM.',
    ],
    openingHymn: { number: 297, title: 'From All That Dwell Below the Skies' },
    openingPrayer: 'Sister Aria Patel',
    wardBusiness: [
      { description: 'Announcement of the September ward council date change.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 173, title: 'While of These Emblems We Partake' },
    speakers: [],
    closingHymn: { number: 103, title: 'Praise to the Lord, the Almighty' },
    closingPrayer: 'Brother Leo Carter',
  },
  {
    id: 3,
    date: '2026-08-30',
    meetingType: 'regular',
    presiding: 'Bishop Mark Taylor',
    conducting: 'Sister Hannah Brooks',
    announcements: [
      'Church-wide Sunday School class begins at 9:30 AM next week.',
      'Ward picnic is scheduled for September 5th at Cherry Park.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Brother Miguel Torres',
    wardBusiness: [
      { description: 'Sustaining of a new Sunday School teacher, Sister Kim Nguyen.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Brother Noah Green', topic: 'Personal Prayer', type: 'speaker' },
      { name: 'Sister Hannah Brooks', topic: 'Be Still, My Soul', type: 'musical-number' },
      { name: 'Sister Rebecca Foster', topic: 'Families and Scripture Study', type: 'speaker' },
    ],
    closingHymn: { number: 140, title: 'Did You Think to Pray?' },
    closingPrayer: 'Brother Ethan Wood',
  },
  {
    id: 4,
    date: '2026-08-23',
    meetingType: 'stake',
    presiding: 'Stake President Robert Bennett',
    conducting: 'Brother James Allred, Second Counselor',
    announcements: [
      'Stake conference broadcast recordings are available in the library.',
    ],
    openingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    openingPrayer: 'Sister Abigail Stone',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 184, title: 'Upon the Cross of Calvary' },
    speakers: [
      { name: 'Elder Scott Richards', topic: 'Discipleship in Everyday Life', type: 'speaker' },
      { name: 'Stake Choir', topic: 'Come, Come, Ye Saints', type: 'musical-number' },
      { name: 'Sister Amy Chen', topic: 'Building the Lord’s Kingdom', type: 'speaker' },
      { name: 'Stake President Robert Bennett', topic: 'Counsel for Our Stake', type: 'speaker' },
    ],
    closingHymn: { number: 105, title: 'Master, the Tempest Is Raging' },
    closingPrayer: 'Brother Miguel Torres',
  },
  {
    id: 5,
    date: '2026-08-16',
    meetingType: 'regular',
    presiding: 'Bishop Mark Taylor',
    conducting: 'Brother Alex Johnson',
    announcements: [
      'Stake temple night is Tuesday at 7:00 PM.',
      'Come prepared to share your thoughts on the youth fundraiser at next week’s council.',
    ],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Sister Emily Carter',
    wardBusiness: [
      { description: 'Sustaining of Brother Samuel Diaz as a new ward clerk.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 185, title: 'Reverently and Meekly Now' },
    speakers: [
      { name: 'Brother Samuel Diaz', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Ward Choir', topic: 'Nearer, My God, to Thee', type: 'musical-number' },
      { name: 'Sister Grace Miller', topic: 'Trusting in the Lord’s Timing', type: 'speaker' },
      { name: 'Brother Jonathan Wells', topic: 'Service as an Expression of Love', type: 'speaker' },
    ],
    closingHymn: { number: 200, title: 'Count Your Blessings' },
    closingPrayer: 'Brother David Hansen',
  },
  {
    id: 6,
    date: '2026-10-04',
    meetingType: 'general',
    presiding: 'A Member of the First Presidency',
    conducting: 'A Member of the First Presidency',
    announcements: [
      'General conference sessions will be broadcast at the meetinghouse at 10:00 AM and 2:00 PM.',
      'Priority seating for visitors will be reserved in the cultural hall.',
    ],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Hannah Brooks',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 194, title: 'There Is a Green Hill Far Away' },
    speakers: [
      { name: 'A Member of the Quorum of the Twelve Apostles', topic: 'The Book of Mormon: Another Testament of Jesus Christ', type: 'speaker' },
      { name: 'General Conference Choir', topic: 'Medley of Praise', type: 'musical-number' },
      { name: 'A Member of the Seventy', topic: 'Counsel for the Modern World', type: 'speaker' },
    ],
    closingHymn: { number: 105, title: 'Master, the Tempest Is Raging' },
    closingPrayer: 'Brother James Keller',
  },
];

export function getMeetings(date?: string): SacramentMeeting[] {
  if (!date) {
    return meetings;
  }
  return meetings.filter((meeting) => meeting.date === date);
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMostRecentSunday(now: Date = new Date()): string {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return toISODate(date);
}

export function getCurrentMeeting(now: Date = new Date()): SacramentMeeting | undefined {
  const sunday = getMostRecentSunday(now);
  const onSunday = getMeetings(sunday);
  if (onSunday.length > 0) {
    return onSunday[0];
  }

  const today = toISODate(new Date(now));
  const mostRecentPast = meetings
    .filter((meeting) => meeting.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (mostRecentPast.length > 0) {
    return mostRecentPast[0];
  }

  return meetings
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}