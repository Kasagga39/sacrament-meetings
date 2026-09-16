import { NextRequest, NextResponse } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');

  if (date !== null && !DATE_PATTERN.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date. Expected the format YYYY-MM-DD.' },
      { status: 400 },
    );
  }

  return NextResponse.json(getMeetings(date ?? undefined));
}