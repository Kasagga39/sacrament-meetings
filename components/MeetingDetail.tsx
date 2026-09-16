import PrintButton from './PrintButton';
import { formatLongDate, meetingTypeLabel } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

interface HymnRowProps {
  hymn: SacramentMeeting['openingHymn'];
  label: string;
}

function HymnRow({ hymn, label }: HymnRowProps) {
  return (
    <p className="text-stone-700">
      <span className="font-semibold text-stone-800">{label}: </span>
      {hymn.number} &mdash; &ldquo;{hymn.title}&rdquo;
    </p>
  );
}

interface SpeakerRowProps {
  speaker: SacramentMeeting['speakers'][number];
}

function SpeakerRow({ speaker }: SpeakerRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-semibold text-stone-800">{speaker.name}</p>
      {speaker.topic ? <p className="text-stone-600">{speaker.topic}</p> : null}
    </div>
  );
}

export default function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-paper shadow-sm">
      <header className="bg-primary px-6 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/75">
          {meetingTypeLabel(meeting.meetingType)}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold">{formatLongDate(meeting.date)}</h1>
        <dl className="mt-4 grid gap-x-10 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex flex-col">
            <dt className="font-semibold uppercase tracking-wide text-white/70">Presiding</dt>
            <dd className="mt-0.5">{meeting.presiding}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="font-semibold uppercase tracking-wide text-white/70">Conducting</dt>
            <dd className="mt-0.5">{meeting.conducting}</dd>
          </div>
        </dl>
      </header>

      <div className="px-6 py-6 sm:px-8">
        {meeting.announcements && meeting.announcements.length > 0 ? (
          <section aria-labelledby="announcements-heading" className="mb-8">
            <h2 id="announcements-heading" className="font-serif text-xl font-bold text-primary">
              Announcements
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-stone-700">
              {meeting.announcements.map((announcement) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <h2 id="agenda-heading" className="font-serif text-xl font-bold text-primary">
          Agenda
        </h2>
        <ol className="mt-4 space-y-3">
          <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Opening Hymn</p>
            <div className="mt-1">
              <HymnRow hymn={meeting.openingHymn} label="Hymn" />
            </div>
          </li>
          <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Opening Prayer</p>
            <p className="mt-1 font-semibold text-stone-800">{meeting.openingPrayer}</p>
          </li>
          {meeting.wardBusiness.length > 0 ? (
            <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Ward Business</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-stone-700">
                {meeting.wardBusiness.map((item) => (
                  <li key={item.description}>{item.description}</li>
                ))}
              </ul>
            </li>
          ) : null}
          {meeting.stakeBusiness ? (
            <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Stake Business</p>
              <p className="mt-1 text-stone-700">Stake business will be conducted.</p>
            </li>
          ) : null}
          <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Sacrament Hymn</p>
            <div className="mt-1">
              <HymnRow hymn={meeting.sacramentHymn} label="Hymn" />
            </div>
          </li>
          {meeting.speakers.map((speaker, index) => (
            <li
              key={`${speaker.type}-${index}`}
              className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                {speaker.type === 'musical-number' ? 'Musical Number' : 'Speaker'}
              </p>
              <div className="mt-1">
                <SpeakerRow speaker={speaker} />
              </div>
            </li>
          ))}
          <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Closing Hymn</p>
            <div className="mt-1">
              <HymnRow hymn={meeting.closingHymn} label="Hymn" />
            </div>
          </li>
          <li className="rounded-lg border-l-4 border-accent/70 bg-stone-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Closing Prayer</p>
            <p className="mt-1 font-semibold text-stone-800">{meeting.closingPrayer}</p>
          </li>
        </ol>
      </div>

      <div className="no-print px-6 pb-6 sm:px-8">
        <PrintButton />
      </div>
    </article>
  );
}