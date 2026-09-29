'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import {
  addMeeting,
  deleteMeeting as deleteMeetingById,
  updateMeeting as updateMeetingById,
} from './meetings-db';
import type { MeetingInput, SpeakerItem } from './types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const MEETING_TYPES = ['testimony', 'regular', 'stake', 'general', 'special'] as const;
const SPEAKER_TYPES = ['speaker', 'musical-number'] as const;

/**
 * The client-side shape of the meeting form. Every control is controlled, so the
 * values the visitor typed survive the form reset React performs after an action.
 */
export interface MeetingFormSpeaker {
  name: string;
  topic: string;
  type: SpeakerItem['type'];
}

export interface MeetingFormValues {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  announcements: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: MeetingFormSpeaker[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
}

/** Every field name that the schema can attach an error message to. */
export type MeetingFormField =
  | 'date'
  | 'meetingType'
  | 'presiding'
  | 'conducting'
  | 'announcements'
  | 'openingHymnNumber'
  | 'openingHymnTitle'
  | 'openingPrayer'
  | 'wardBusiness'
  | 'stakeBusiness'
  | 'sacramentHymnNumber'
  | 'sacramentHymnTitle'
  | 'speakerName'
  | 'speakerTopic'
  | 'speakerType'
  | 'closingHymnNumber'
  | 'closingHymnTitle'
  | 'closingPrayer';

export type MeetingFormErrors = Partial<Record<MeetingFormField, string[]>>;

export interface MeetingFormState {
  status: 'idle' | 'error' | 'success';
  message: string;
  errors: MeetingFormErrors;
}

export interface DeleteMeetingState {
  status: 'idle' | 'error' | 'success';
  message: string;
}

function requiredText(label: string, max: number) {  return z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
}

function optionalText(label: string, max: number) {
  return z
    .string({ error: `${label} must be text.` })
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`);
}

function requiredHymnNumber(label: string) {
  return z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.coerce
      .number({ error: `${label} is required.` })
      .int(`${label} must be a whole number.`)
      .min(1, `${label} is required.`)
      .max(999, `${label} must be between 1 and 999.`),
  );
}

/**
 * Server-side validation for the create and edit forms. It is intentionally kept
 * private to this module: a `"use server"` file may only export async functions.
 */
const MeetingFormSchema = z.object({
  date: z
    .string({ error: 'Meeting date is required.' })
    .trim()
    .min(1, 'Meeting date is required.')
    .regex(DATE_PATTERN, 'Enter a date in YYYY-MM-DD format.'),
  meetingType: z.enum(MEETING_TYPES, { error: 'Choose a meeting type.' }),
  presiding: requiredText('Presiding officer', 120),
  conducting: requiredText('Conducting officer', 120),
  announcements: optionalText('Announcements', 4000),
  openingHymnNumber: requiredHymnNumber('Opening hymn number'),
  openingHymnTitle: requiredText('Opening hymn title', 120),
  openingPrayer: requiredText('Opening prayer', 120),
  wardBusiness: optionalText('Ward business', 4000),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: requiredHymnNumber('Sacrament hymn number'),
  sacramentHymnTitle: requiredText('Sacrament hymn title', 120),
  speakerName: z
    .array(
      z
        .string({ error: 'A participant name is required.' })
        .trim()
        .min(1, 'Enter a name for every participant, or remove the row.'),
    )
    .max(20, 'A meeting can list at most 20 speakers or musical numbers.'),
  speakerTopic: z.array(
    z.string().trim().max(200, 'Keep each topic under 200 characters.'),
  ),
  speakerType: z.array(z.enum(SPEAKER_TYPES, { error: 'Choose speaker or musical number.' })),
  closingHymnNumber: requiredHymnNumber('Closing hymn number'),
  closingHymnTitle: requiredText('Closing hymn title', 120),
  closingPrayer: requiredText('Closing prayer', 120),
});

const DeleteMeetingSchema = z.object({
  id: z.coerce
    .number({ error: 'That meeting could not be identified.' })
    .int('That meeting could not be identified.')
    .positive('That meeting could not be identified.'),
});

type ValidatedMeetingForm = z.infer<typeof MeetingFormSchema>;

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

function readLines(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === 'string');
}

/** Reads the untrusted `FormData` into the flat shape the schema expects. */
function toRawFormValues(formData: FormData) {
  return {
    date: readText(formData, 'date'),
    meetingType: readText(formData, 'meetingType'),
    presiding: readText(formData, 'presiding'),
    conducting: readText(formData, 'conducting'),
    announcements: readText(formData, 'announcements'),
    openingHymnNumber: readText(formData, 'openingHymnNumber'),
    openingHymnTitle: readText(formData, 'openingHymnTitle'),
    openingPrayer: readText(formData, 'openingPrayer'),
    wardBusiness: readText(formData, 'wardBusiness'),
    stakeBusiness: formData.has('stakeBusiness'),
    sacramentHymnNumber: readText(formData, 'sacramentHymnNumber'),
    sacramentHymnTitle: readText(formData, 'sacramentHymnTitle'),
    speakerName: readLines(formData, 'speakerName'),
    speakerTopic: readLines(formData, 'speakerTopic'),
    speakerType: readLines(formData, 'speakerType'),
    closingHymnNumber: readText(formData, 'closingHymnNumber'),
    closingHymnTitle: readText(formData, 'closingHymnTitle'),
    closingPrayer: readText(formData, 'closingPrayer'),
  };
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function toMeetingInput(values: ValidatedMeetingForm): MeetingInput {
  return {
    date: values.date,
    meetingType: values.meetingType,
    presiding: values.presiding,
    conducting: values.conducting,
    announcements: splitLines(values.announcements),
    openingHymn: { number: values.openingHymnNumber, title: values.openingHymnTitle },
    openingPrayer: values.openingPrayer,
    wardBusiness: splitLines(values.wardBusiness).map((description) => ({ description })),
    stakeBusiness: values.stakeBusiness,
    sacramentHymn: { number: values.sacramentHymnNumber, title: values.sacramentHymnTitle },
    speakers: values.speakerName
      .map((name, index) => ({
        name,
        topic: values.speakerTopic[index] ?? '',
        type: values.speakerType[index] ?? 'speaker',
      }))
      .filter((speaker) => speaker.name.length > 0),
    closingHymn: { number: values.closingHymnNumber, title: values.closingHymnTitle },
    closingPrayer: values.closingPrayer,
  };
}

function toFieldErrors(error: z.ZodError): MeetingFormErrors {
  const errors: MeetingFormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== 'string') {
      continue;
    }

    const bucket = (errors[field as MeetingFormField] ??= []);

    // Array issues (`speakers[2].name`) keep their row so the form can show the
    // message next to the control that produced it.
    const row = issue.path[1];
    if (typeof row === 'number') {
      bucket[row] = issue.message;
    } else {
      bucket.push(issue.message);
    }
  }

  return errors;
}

function invalidFormState(errors: MeetingFormErrors): MeetingFormState {
  return {
    status: 'error',
    message: 'Please correct the highlighted fields and try again.',
    errors,
  };
}

function isUniqueDateViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const { code, constraint, message } = error as {
    code?: unknown;
    constraint?: unknown;
    message?: unknown;
  };

  if (code !== '23505') {
    return false;
  }

  const details = [constraint, message].filter((part): part is string => typeof part === 'string');
  return details.some((detail) => detail.includes('date'));
}

function revalidateMeetingPaths(id?: number): void {
  revalidatePath('/meetings');
  revalidatePath('/meetings/current');

  if (id !== undefined) {
    revalidatePath(`/meetings/${id}`);
    revalidatePath(`/meetings/${id}/edit`);
  }
}

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const parsed = MeetingFormSchema.safeParse(toRawFormValues(formData));

  if (!parsed.success) {
    return invalidFormState(toFieldErrors(parsed.error));
  }

  try {
    await addMeeting(toMeetingInput(parsed.data));
  } catch (error) {
    if (isUniqueDateViolation(error)) {
      return invalidFormState({
        date: ['A meeting already exists for that date. Pick another Sunday.'],
      });
    }

    console.error('createMeeting: failed to insert the meeting.', error);
    throw new Error('We could not save the meeting. Please try again in a moment.');
  }

  revalidateMeetingPaths();
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const parsed = MeetingFormSchema.safeParse(toRawFormValues(formData));

  if (!parsed.success) {
    return invalidFormState(toFieldErrors(parsed.error));
  }

  let updated = false;

  try {
    const result = await updateMeetingById(id, toMeetingInput(parsed.data));
    updated = result !== undefined;
  } catch (error) {
    if (isUniqueDateViolation(error)) {
      return invalidFormState({
        date: ['Another meeting already exists for that date. Pick a different Sunday.'],
      });
    }

    console.error(`updateMeeting: failed to update meeting ${id}.`, error);
    throw new Error('We could not save your changes. Please try again in a moment.');
  }

  if (!updated) {
    console.error(`updateMeeting: meeting ${id} no longer exists.`);
    return {
      status: 'error',
      message: 'That meeting has been deleted. Head back to the meetings list to pick another.',
      errors: {},
    };
  }

  revalidateMeetingPaths(id);
  redirect('/meetings');
}

export async function deleteMeeting(
  _prevState: DeleteMeetingState,
  formData: FormData,
): Promise<DeleteMeetingState> {
  const parsed = DeleteMeetingSchema.safeParse({ id: readText(formData, 'id') });

  if (!parsed.success) {
    return { status: 'error', message: 'That meeting could not be identified.' };
  }

  const id = parsed.data.id;

  try {
    const removed = await deleteMeetingById(id);

    if (!removed) {
      return { status: 'error', message: 'That meeting has already been deleted.' };
    }
  } catch (error) {
    console.error(`deleteMeeting: failed to delete meeting ${id}.`, error);
    throw new Error('We could not delete the meeting. Please try again in a moment.');
  }

  revalidateMeetingPaths(id);

  return { status: 'success', message: 'Meeting deleted.' };
}
