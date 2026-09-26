import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

export const DEFAULT_PAGE_SIZE = 5;

export interface MeetingQuery {
  date?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface MeetingListResult {
  meetings: SacramentMeeting[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const connectionString = process.env.DATABASE_URL;
let cachedSql: NeonQueryFunction<false, false> | undefined;

function getSql(): NeonQueryFunction<false, false> {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Run `vercel env pull .env.local` first.');
  }
  if (!cachedSql) {
    cachedSql = neon(connectionString);
  }
  return cachedSql;
}

interface MeetingRow {
  id: number;
  date: Date | string;
  meeting_type: SacramentMeeting['meetingType'];
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: SacramentMeeting['openingHymn'];
  opening_prayer: string;
  ward_business: SacramentMeeting['wardBusiness'] | null;
  stake_business: boolean;
  sacrament_hymn: SacramentMeeting['sacramentHymn'];
  speakers: SacramentMeeting['speakers'] | null;
  closing_hymn: SacramentMeeting['closingHymn'];
  closing_prayer: string;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDateString(value: Date | string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toISODate(value);
  }
  return String(value).slice(0, 10);
}

function mapMeetingRow(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: toDateString(row.date),
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

function normalizePage(page: number | undefined, totalPages: number): number {
  if (!page || page < 1) {
    return 1;
  }
  return Math.min(page, Math.max(1, totalPages));
}

export async function getMeetings(options: MeetingQuery = {}): Promise<MeetingListResult> {
  const sql = getSql();

  const { date, query } = options;
  const pageSize = Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE);
  const pattern = query ? `%${query}%` : null;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM meetings
    WHERE (${date ?? null}::date IS NULL OR date = ${date ?? null})
      AND (
        ${pattern}::text IS NULL
        OR presiding ILIKE ${pattern}
        OR conducting ILIKE ${pattern}
        OR meeting_type ILIKE ${pattern}
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements(speakers) AS speaker
          WHERE speaker->>'name' ILIKE ${pattern}
        )
      )
  `;

  const total = count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = normalizePage(options.page, totalPages);
  const offset = (page - 1) * pageSize;

  const rows = await sql`
    SELECT
      id,
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    FROM meetings
    WHERE (${date ?? null}::date IS NULL OR date = ${date ?? null})
      AND (
        ${pattern}::text IS NULL
        OR presiding ILIKE ${pattern}
        OR conducting ILIKE ${pattern}
        OR meeting_type ILIKE ${pattern}
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements(speakers) AS speaker
          WHERE speaker->>'name' ILIKE ${pattern}
        )
      )
    ORDER BY date DESC, id DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  return {
    meetings: rows.map((row) => mapMeetingRow(row as MeetingRow)),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  const sql = getSql();

  const rows = await sql`
    SELECT
      id,
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    FROM meetings
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows.length > 0 ? mapMeetingRow(rows[0] as MeetingRow) : undefined;
}

export function getMostRecentSunday(now: Date = new Date()): string {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return toISODate(date);
}

export async function getCurrentMeeting(now: Date = new Date()): Promise<SacramentMeeting | undefined> {
  const sql = getSql();

  const sunday = getMostRecentSunday(now);
  const onSunday = await getMeetings({ date: sunday });
  if (onSunday.meetings.length > 0) {
    return onSunday.meetings[0];
  }

  const today = toISODate(new Date(now));
  const mostRecentPast = await sql`
    SELECT
      id,
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    FROM meetings
    WHERE date <= ${today}
    ORDER BY date DESC, id DESC
    LIMIT 1
  `;
  if (mostRecentPast.length > 0) {
    return mapMeetingRow(mostRecentPast[0] as MeetingRow);
  }

  const first = await sql`
    SELECT
      id,
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    FROM meetings
    ORDER BY date ASC, id ASC
    LIMIT 1
  `;
  return first.length > 0 ? mapMeetingRow(first[0] as MeetingRow) : undefined;
}

export async function addMeeting(
  meeting: Omit<SacramentMeeting, 'id'>,
): Promise<SacramentMeeting> {
  throw new Error(`addMeeting is not implemented yet (meeting on ${meeting.date}).`);
}

export async function updateMeeting(
  id: number,
  updates: Partial<Omit<SacramentMeeting, 'id'>>,
): Promise<SacramentMeeting> {
  throw new Error(`updateMeeting is not implemented yet (meeting ${id}, ${Object.keys(updates).length} change(s)).`);
}

export async function deleteMeeting(id: number): Promise<boolean> {
  throw new Error(`deleteMeeting is not implemented yet (meeting ${id}).`);
}