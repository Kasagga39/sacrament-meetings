'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';

import type {
  MeetingFormErrors,
  MeetingFormSpeaker,
  MeetingFormState,
  MeetingFormValues,
} from '@/lib/actions';
import type { MeetingType, SacramentMeeting } from '@/lib/types';

const MEETING_TYPE_OPTIONS: { value: MeetingType; label: string }[] = [
  { value: 'regular', label: 'Regular Sacrament Meeting' },
  { value: 'testimony', label: 'Testimony Meeting' },
  { value: 'stake', label: 'Stake Conference' },
  { value: 'general', label: 'General Conference' },
  { value: 'special', label: 'Special Meeting' },
];

const SPEAKER_TYPE_OPTIONS: { value: MeetingFormSpeaker['type']; label: string }[] = [
  { value: 'speaker', label: 'Speaker' },
  { value: 'musical-number', label: 'Musical Number' },
];

const INITIAL_STATE: MeetingFormState = { status: 'idle', message: '', errors: {} };

const EMPTY_VALUES: MeetingFormValues = {
  date: '',
  meetingType: 'regular',
  presiding: '',
  conducting: '',
  announcements: '',
  openingHymnNumber: '',
  openingHymnTitle: '',
  openingPrayer: '',
  wardBusiness: '',
  stakeBusiness: false,
  sacramentHymnNumber: '',
  sacramentHymnTitle: '',
  speakers: [],
  closingHymnNumber: '',
  closingHymnTitle: '',
  closingPrayer: '',
};

const LABEL_CLASS = 'block text-sm font-semibold text-stone-800';
const INPUT_CLASS =
  'block w-full rounded-lg border bg-white px-3 py-2 text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30';
const ERROR_CLASS = 'mt-1 min-h-5 text-sm font-medium text-red-700';
const LEGEND_CLASS = 'font-serif text-lg font-bold text-primary';
const SECTION_CLASS = 'rounded-lg border border-stone-200 bg-stone-50 p-4';
const PRIMARY_BUTTON_CLASS =
  'inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-stone-400';

export type MeetingFormAction = (
  prevState: MeetingFormState,
  formData: FormData,
) => Promise<MeetingFormState>;

export interface MeetingFormProps {
  action: MeetingFormAction;
  meeting?: SacramentMeeting;
  submitLabel: string;
  cancelHref: string;
}

function toFormValues(meeting?: SacramentMeeting): MeetingFormValues {
  if (!meeting) {
    return EMPTY_VALUES;
  }

  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join('\n'),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers.map((speaker) => ({
      name: speaker.name,
      topic: speaker.topic,
      type: speaker.type,
    })),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

function firstError(errors?: string[]): string {
  return errors && errors.length > 0 ? (errors[0] ?? '') : '';
}

function hasError(errors?: string[]): boolean {
  return Boolean(errors && errors.length > 0);
}

/** Picks the message Zod attached to one row of a repeated field. */
function rowError(errors: string[] | undefined, index: number): string[] | undefined {
  const message = errors?.[index];
  return message ? [message] : undefined;
}

interface FieldFrameProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  errors?: string[];
  children: (describedBy: string) => React.ReactNode;
}

function FieldFrame({ id, label, hint, required, errors, children }: FieldFrameProps) {
  const describedBy = hint ? `${id}-hint ${id}-error` : `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-accent">
              {' '}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-stone-600">
          {hint}
        </p>
      ) : null}
      <div className="mt-1">{children(describedBy)}</div>
      <p id={`${id}-error`} aria-live="polite" className={ERROR_CLASS}>
        {firstError(errors)}
      </p>
    </div>
  );
}

interface TextFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  hint?: string;
  required?: boolean;
  type?: 'text' | 'date' | 'number';
  placeholder?: string;
  inputMode?: 'numeric' | 'text';
}

function TextField({
  id,
  name,
  label,
  value,
  onChange,
  errors,
  hint,
  required,
  type = 'text',
  placeholder,
  inputMode,
}: TextFieldProps) {
  return (
    <FieldFrame id={id} label={label} hint={hint} required={required} errors={errors}>
      {(describedBy) => (
        <input
          id={id}
          name={name ?? id}
          type={type}
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          aria-required={required ? true : undefined}
          aria-invalid={hasError(errors) ? true : undefined}
          aria-describedby={describedBy}
          className={`${INPUT_CLASS} ${hasError(errors) ? 'border-red-500' : 'border-stone-300'}`}
        />
      )}
    </FieldFrame>
  );
}

interface TextAreaFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  hint?: string;
  rows?: number;
}

function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  errors,
  hint,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <FieldFrame id={id} label={label} hint={hint} errors={errors}>
      {(describedBy) => (
        <textarea
          id={id}
          name={name ?? id}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={hasError(errors) ? true : undefined}
          aria-describedby={describedBy}
          className={`${INPUT_CLASS} ${hasError(errors) ? 'border-red-500' : 'border-stone-300'}`}
        />
      )}
    </FieldFrame>
  );
}

interface SelectFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  errors?: string[];
  required?: boolean;
}

function SelectField({
  id,
  name,
  label,
  value,
  options,
  onChange,
  errors,
  required,
}: SelectFieldProps) {
  return (
    <FieldFrame id={id} label={label} required={required} errors={errors}>
      {(describedBy) => (
        <select
          id={id}
          name={name ?? id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-required={required ? true : undefined}
          aria-invalid={hasError(errors) ? true : undefined}
          aria-describedby={describedBy}
          className={`${INPUT_CLASS} ${hasError(errors) ? 'border-red-500' : 'border-stone-300'}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldFrame>
  );
}

export default function MeetingForm({
  action,
  meeting,
  submitLabel,
  cancelHref,
}: MeetingFormProps) {
  const [values, setValues] = useState<MeetingFormValues>(() => toFormValues(meeting));
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const errors: MeetingFormErrors = state.errors;

  function setField<K extends keyof MeetingFormValues>(field: K, value: MeetingFormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function setSpeaker(index: number, patch: Partial<MeetingFormSpeaker>) {
    setValues((previous) => ({
      ...previous,
      speakers: previous.speakers.map((speaker, position) =>
        position === index ? { ...speaker, ...patch } : speaker,
      ),
    }));
  }

  function addSpeaker() {
    setValues((previous) => ({
      ...previous,
      speakers: [...previous.speakers, { name: '', topic: '', type: 'speaker' }],
    }));
  }

  function removeSpeaker(index: number) {
    setValues((previous) => ({
      ...previous,
      speakers: previous.speakers.filter((_, position) => position !== index),
    }));
  }

  return (
    <form action={formAction} aria-busy={isPending} className="mt-6 flex flex-col gap-6">
      <p className="text-sm text-stone-600">
        <span aria-hidden="true" className="font-semibold text-accent">
          *
        </span>{' '}
        marks a required field. Everything is validated on the server before anything is saved.
      </p>

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className={SECTION_CLASS}>
        <legend className={LEGEND_CLASS}>Meeting details</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="date"
            label="Meeting date"
            type="date"
            required
            value={values.date}
            onChange={(value) => setField('date', value)}
            errors={errors.date}
            hint="Each meeting must fall on a Sunday."
          />
          <SelectField
            id="meetingType"
            label="Meeting type"
            required
            value={values.meetingType}
            options={MEETING_TYPE_OPTIONS}
            onChange={(value) => setField('meetingType', value)}
            errors={errors.meetingType}
          />
          <TextField
            id="presiding"
            label="Presiding officer"
            required
            value={values.presiding}
            onChange={(value) => setField('presiding', value)}
            errors={errors.presiding}
          />
          <TextField
            id="conducting"
            label="Conducting officer"
            required
            value={values.conducting}
            onChange={(value) => setField('conducting', value)}
            errors={errors.conducting}
          />
        </div>
      </fieldset>

      <fieldset className={SECTION_CLASS}>
        <legend className={LEGEND_CLASS}>Announcements and business</legend>
        <div className="mt-4 grid gap-4">
          <TextAreaField
            id="announcements"
            label="Announcements"
            hint="One announcement per line."
            value={values.announcements}
            onChange={(value) => setField('announcements', value)}
            errors={errors.announcements}
          />
          <TextAreaField
            id="wardBusiness"
            label="Ward business"
            hint="One item per line. Leave blank when there is no ward business."
            value={values.wardBusiness}
            onChange={(value) => setField('wardBusiness', value)}
            errors={errors.wardBusiness}
          />
          <div className="flex items-start gap-3">
            <input
              id="stakeBusiness"
              name="stakeBusiness"
              type="checkbox"
              checked={values.stakeBusiness}
              onChange={(event) => setField('stakeBusiness', event.target.checked)}
              aria-describedby="stakeBusiness-error"
              className="mt-1 h-5 w-5 rounded border-stone-400 text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div>
              <label htmlFor="stakeBusiness" className={LABEL_CLASS}>
                Stake business will be conducted
              </label>
              <p id="stakeBusiness-error" aria-live="polite" className={ERROR_CLASS}>
                {firstError(errors.stakeBusiness)}
              </p>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className={SECTION_CLASS}>
        <legend className={LEGEND_CLASS}>Opening</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="openingHymnNumber"
            label="Opening hymn number"
            type="number"
            inputMode="numeric"
            required
            value={values.openingHymnNumber}
            onChange={(value) => setField('openingHymnNumber', value)}
            errors={errors.openingHymnNumber}
          />
          <TextField
            id="openingHymnTitle"
            label="Opening hymn title"
            required
            value={values.openingHymnTitle}
            onChange={(value) => setField('openingHymnTitle', value)}
            errors={errors.openingHymnTitle}
          />
          <TextField
            id="openingPrayer"
            label="Opening prayer"
            required
            value={values.openingPrayer}
            onChange={(value) => setField('openingPrayer', value)}
            errors={errors.openingPrayer}
          />
        </div>
      </fieldset>

      <fieldset className={SECTION_CLASS}>
        <legend className={LEGEND_CLASS}>Sacrament hymn</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="sacramentHymnNumber"
            label="Sacrament hymn number"
            type="number"
            inputMode="numeric"
            required
            value={values.sacramentHymnNumber}
            onChange={(value) => setField('sacramentHymnNumber', value)}
            errors={errors.sacramentHymnNumber}
          />
          <TextField
            id="sacramentHymnTitle"
            label="Sacrament hymn title"
            required
            value={values.sacramentHymnTitle}
            onChange={(value) => setField('sacramentHymnTitle', value)}
            errors={errors.sacramentHymnTitle}
          />
        </div>
      </fieldset>

      <fieldset className={SECTION_CLASS}>
        <legend className={LEGEND_CLASS}>Speakers and musical numbers</legend>
        <p className="mt-2 text-sm text-stone-600">
          List everyone speaking or performing, in the order they appear.
        </p>

        {values.speakers.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-stone-300 px-4 py-4 text-sm text-stone-600">
            No speakers or musical numbers added yet.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {values.speakers.map((speaker, index) => (
              <li key={index} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id={`speakerName-${index}`}
                    name="speakerName"
                    label={`Participant ${index + 1} name`}
                    required
                    value={speaker.name}
                    onChange={(value) => setSpeaker(index, { name: value })}
                    errors={rowError(errors.speakerName, index)}
                  />
                  <SelectField
                    id={`speakerType-${index}`}
                    name="speakerType"
                    label="Role"
                    required
                    value={speaker.type}
                    options={SPEAKER_TYPE_OPTIONS}
                    onChange={(value) =>
                      setSpeaker(index, { type: value as MeetingFormSpeaker['type'] })
                    }
                    errors={rowError(errors.speakerType, index)}
                  />
                  <TextField
                    id={`speakerTopic-${index}`}
                    name="speakerTopic"
                    label="Topic or selection"
                    value={speaker.topic}
                    onChange={(value) => setSpeaker(index, { topic: value })}
                    errors={rowError(errors.speakerTopic, index)}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeSpeaker(index)}
                      className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-red-400 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Remove {speaker.name ? speaker.name : `participant ${index + 1}`}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={addSpeaker}
          className="mt-4 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Add speaker or musical number
        </button>
      </fieldset>

      <fieldset className={SECTION_CLASS}>
        <legend className={LEGEND_CLASS}>Closing</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="closingHymnNumber"
            label="Closing hymn number"
            type="number"
            inputMode="numeric"
            required
            value={values.closingHymnNumber}
            onChange={(value) => setField('closingHymnNumber', value)}
            errors={errors.closingHymnNumber}
          />
          <TextField
            id="closingHymnTitle"
            label="Closing hymn title"
            required
            value={values.closingHymnTitle}
            onChange={(value) => setField('closingHymnTitle', value)}
            errors={errors.closingHymnTitle}
          />
          <TextField
            id="closingPrayer"
            label="Closing prayer"
            required
            value={values.closingPrayer}
            onChange={(value) => setField('closingPrayer', value)}
            errors={errors.closingPrayer}
          />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 border-t border-stone-200 pt-6">
        <button type="submit" disabled={isPending} className={PRIMARY_BUTTON_CLASS}>
          {isPending ? 'Saving\u2026' : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="text-sm font-semibold text-stone-700 underline underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Cancel and go back
        </Link>
      </div>
    </form>
  );
}
