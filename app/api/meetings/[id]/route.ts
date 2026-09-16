import { NextRequest, NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<'/api/meetings/[id]'>,
) {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: 'Meeting id must be a positive integer.' },
      { status: 400 },
    );
  }

  const meeting = getMeetingById(Number(id));

  if (!meeting) {
    return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
  }

  return NextResponse.json(meeting);
}