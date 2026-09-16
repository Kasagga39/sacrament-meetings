export default function MeetingsLoading() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-live="polite">
      <span className="sr-only">Loading meetings&hellip;</span>
      <div className="h-8 w-56 animate-pulse rounded bg-stone-200" />
      <div className="h-4 w-80 animate-pulse rounded bg-stone-200" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            className="h-40 animate-pulse rounded-xl border border-stone-200 bg-paper"
          />
        ))}
      </ul>
    </div>
  );
}