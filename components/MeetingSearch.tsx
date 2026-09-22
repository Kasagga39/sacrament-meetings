'use client';

import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    const value = term.trim();
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <label className="block">
      <span className="sr-only">Search meetings</span>
      <input
        type="search"
        defaultValue={searchParams.get('query')?.toString() ?? ''}
        placeholder="Search by speaker, presiding, conducting, or meeting type"
        aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-800 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}