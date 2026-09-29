'use client';

import { useActionState } from 'react';

import { deleteMeeting } from '@/lib/actions';
import type { DeleteMeetingState } from '@/lib/actions';

const INITIAL_STATE: DeleteMeetingState = { status: 'idle', message: '' };

const GHOST_BUTTON_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

const DANGER_BUTTON_CLASS =
  'inline-flex items-center justify-center rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:bg-stone-400';

export interface DeleteMeetingButtonProps {
  meetingId: number;
  meetingDate: string;
}

/**
 * A `<details>` disclosure is used instead of a click-to-open panel so the delete
 * form is present in the HTML without JavaScript and works with the keyboard for
 * free. `useActionState` then adds the pending state and the inline error message.
 */
export default function DeleteMeetingButton({ meetingId, meetingDate }: DeleteMeetingButtonProps) {
  const [state, formAction, isPending] = useActionState(deleteMeeting, INITIAL_STATE);

  return (
    <details className="group relative z-10 w-full">
      <summary className={`${GHOST_BUTTON_CLASS} list-none`}>
        Delete
        <span className="sr-only"> the meeting for {meetingDate}</span>
      </summary>

      <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3">
        <p className="text-sm font-semibold text-red-900">
          Delete the meeting for {meetingDate}?{' '}
          <span className="font-normal">This cannot be undone.</span>
        </p>

        <form action={formAction} aria-busy={isPending} className="mt-3">
          <input type="hidden" name="id" value={meetingId} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              aria-label={`Confirm deleting the meeting for ${meetingDate}`}
              className={DANGER_BUTTON_CLASS}
            >
              {isPending ? 'Deleting…' : 'Yes, delete it'}
            </button>
          </div>
          <p aria-live="polite" className="mt-2 text-sm font-medium text-red-800">
            {state.status === 'error' ? state.message : ''}
          </p>
        </form>
      </div>
    </details>
  );
}
